"use client";

import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { GlassCard } from "@/components/GlassCard";
import { PoseFeedGrid } from "@/components/PoseFeedGrid";
import { PoseFilterPanel } from "@/components/PoseFilterPanel";
import { SearchPanel } from "@/components/SearchPanel";
import { EMPTY_FILTERS } from "@/lib/filters";
import { balanceCategoryFilterResults, countActiveFilters, filterPoses, preparePoseSearchIndex } from "@/lib/pose-utils";
import { fetchPoses } from "@/lib/poses";
import type { Pose, PoseFilters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { useSearchQueryVariants } from "@/hooks/useSearchQueryVariants";
import { useTranslation } from "@/hooks/useTranslation";

const SEARCH_RESULT_LIMIT = 48;

const SearchResults = memo(function SearchResults({
  poses,
  totalMatches,
  loading,
  pending,
  loadingLabel,
  foundLabel,
}: {
  poses: Pose[];
  totalMatches: number;
  loading: boolean;
  pending?: boolean;
  loadingLabel: string;
  foundLabel: string;
}) {
  if (loading) {
    return (
      <GlassCard padding="md" className="text-center text-sm text-[var(--text-secondary)]">
        {loadingLabel}
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
    </>
  );
});

export function PoseSearchExplorer() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(
    () => searchParams.get("filters") === "open"
  );

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const deferredQuery = useDeferredValue(filters.query);
  const { variants: queryVariants, pending: translationPending } = useSearchQueryVariants(
    filters.query
  );

  useEffect(() => {
    void fetchPoses().then((data) => {
      setPoses(data);
      preparePoseSearchIndex(data);
      setLoading(false);
    });
  }, []);

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

  const filtersForSearch = useMemo(
    () => ({ ...filters, query: deferredQuery }),
    [filters, deferredQuery]
  );

  const { filtered, totalMatches } = useMemo(() => {
    const matches = balanceCategoryFilterResults(
      filterPoses(poses, filtersForSearch, queryVariants),
      filtersForSearch
    );
    return {
      filtered: matches.slice(0, SEARCH_RESULT_LIMIT),
      totalMatches: matches.length,
    };
  }, [poses, filtersForSearch, queryVariants]);

  const isSearchPending =
    filters.query !== deferredQuery || (translationPending && Boolean(deferredQuery.trim()));

  useScrollRestore("/search", !loading);

  const activeCount = countActiveFilters(filters);
  const foundLabel =
    totalMatches > SEARCH_RESULT_LIMIT
      ? t("searchFoundLimited", { count: totalMatches, limit: SEARCH_RESULT_LIMIT })
      : t("searchFound", { count: totalMatches });

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
        poses={filtered}
        totalMatches={totalMatches}
        loading={loading}
        pending={isSearchPending}
        loadingLabel={t("searchLoading")}
        foundLabel={foundLabel}
      />
    </>
  );
}
