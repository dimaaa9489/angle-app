"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { GlassCard } from "@/components/GlassCard";
import { PoseFeedGrid } from "@/components/PoseFeedGrid";
import { PoseFilterPanel } from "@/components/PoseFilterPanel";
import { SearchPanel } from "@/components/SearchPanel";
import { EMPTY_FILTERS } from "@/lib/filters";
import { countActiveFilters } from "@/lib/pose-utils";
import type { Pose, PoseFilters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useServerSearchResults } from "@/hooks/useServerSearchResults";
import { useTranslation } from "@/hooks/useTranslation";

const SEARCH_PAGE_SIZE = 24;

const SearchResults = memo(function SearchResults({
  poses,
  totalMatches,
  loading,
  loadingMore,
  hasMore,
  pending,
  error,
  sentinelRef,
  loadingLabel,
  loadingMoreLabel,
  foundLabel,
  errorLabel,
  onRetry,
}: {
  poses: Pose[];
  totalMatches: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  pending?: boolean;
  error: string | null;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  loadingLabel: string;
  loadingMoreLabel: string;
  foundLabel: string;
  errorLabel: string;
  onRetry: () => void;
}) {
  if (loading && poses.length === 0) {
    return (
      <GlassCard padding="md" className="text-center text-sm text-[var(--text-secondary)]">
        {loadingLabel}
      </GlassCard>
    );
  }

  if (error && poses.length === 0) {
    return (
      <GlassCard padding="md" className="text-center text-sm text-[var(--text-secondary)]">
        <p>{errorLabel}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-xs font-semibold text-[var(--accent)]"
        >
          ↻
        </button>
      </GlassCard>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold">{foundLabel}</p>
      </div>
      <div className={pending ? "opacity-60 transition-opacity duration-150" : "transition-opacity duration-150"}>
        <PoseFeedGrid poses={poses} enableDynamicBg />
      </div>
      <div ref={sentinelRef} className="h-6" aria-hidden />
      {loadingMore ? (
        <p className="pb-6 text-center text-sm text-[var(--text-secondary)]">{loadingMoreLabel}</p>
      ) : null}
      {!hasMore && poses.length > 0 && totalMatches > poses.length ? (
        <p className="pb-8 text-center text-xs text-[var(--text-tertiary)]">
          {foundLabel}
        </p>
      ) : null}
    </>
  );
});

export function PoseSearchExplorer() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(
    () => searchParams.get("filters") === "open"
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const {
    poses,
    totalMatches,
    hasMore,
    pending,
    loading,
    loadingMore,
    error,
    loadMore,
    retry,
  } = useServerSearchResults(filters, SEARCH_PAGE_SIZE);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("cat");
    const type = searchParams.get("type");
    const hasPreset = Boolean(q || cat || type);

    if (!hasPreset) return;

    const next: PoseFilters = {
      ...EMPTY_FILTERS,
      query: q,
      categories: cat ? [cat as PoseFilters["categories"][number]] : [],
      shotTypes: type ? [type as PoseFilters["shotTypes"][number]] : [],
    };

    setFilters(next);
  }, [searchParams, setFilters]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "180px 0px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, poses.length]);

  useScrollRestore("/search", !loading);

  const activeCount = countActiveFilters(filters);
  const foundLabel = t("searchFound", { count: totalMatches });

  return (
    <>
      <GlassCard className="angle-ui-shell mb-4" padding="md">
        <SearchPanel
          autoFocus
          activeFilterCount={activeCount}
          onFilterClick={() => setFiltersOpen((open) => !open)}
          onSubmit={() => undefined}
          header={
            <div className="flex items-center justify-between gap-3">
              <div className="angle-page-head mb-0 min-w-0">
                <h1>{t("searchTitle")}</h1>
                <p>{t("searchSubtitle")}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setFiltersOpen(false);
                }}
                className="shrink-0 text-xs font-semibold text-[var(--text-secondary)] active:opacity-70 md:text-[13px]"
              >
                {t("searchReset")}
              </button>
            </div>
          }
          footer={filtersOpen ? <div className="mt-3"><PoseFilterPanel /></div> : null}
        />
      </GlassCard>

      <SearchResults
        poses={poses}
        totalMatches={totalMatches}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        pending={pending}
        error={error}
        sentinelRef={sentinelRef}
        loadingLabel={t("searchLoading")}
        loadingMoreLabel={t("homeFeedLoadingMore")}
        foundLabel={foundLabel}
        errorLabel={t("searchLoading")}
        onRetry={retry}
      />
    </>
  );
}
