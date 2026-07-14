"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth, getGreeting } from "@/components/AuthProvider";
import { PoseFeedGrid } from "@/components/PoseFeedGrid";
import { SearchPanel } from "@/components/SearchPanel";
import { useHomeHeaderScroll } from "@/hooks/useHomeHeaderScroll";
import { useScrollRestore } from "@/hooks/useScrollRestore";
import { mergeUniquePoses } from "@/lib/pose-feed-layout";
import { fetchHomePosesPool } from "@/lib/poses";
import type { Pose } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useHomeFeedStore } from "@/stores/useHomeFeedStore";
import { useTranslation } from "@/hooks/useTranslation";

const PAGE_SIZE = 12;
const HEADER_SPACER_FALLBACK = 172;
const HEADER_FEED_GAP = 20;

const HomeFeed = memo(function HomeFeed({
  poses,
  loading,
  loadingMore,
  hasMore,
  sentinelRef,
  loadingLabel,
  loadingMoreLabel,
  endLabel,
}: {
  poses: Pose[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  loadingLabel: string;
  loadingMoreLabel: string;
  endLabel: string;
}) {
  if (loading && poses.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-[var(--text-secondary)]">
        {loadingLabel}
      </div>
    );
  }

  return (
    <>
      <PoseFeedGrid poses={poses} enableDynamicBg />
      <div ref={sentinelRef} className="h-6" aria-hidden />
      {loadingMore ? (
        <p className="pb-6 text-center text-sm text-[var(--text-secondary)]">
          {loadingMoreLabel}
        </p>
      ) : null}
      {!hasMore && poses.length > 0 ? (
        <p className="pb-8 text-center text-xs text-[var(--text-tertiary)]">
          {endLabel}
        </p>
      ) : null}
    </>
  );
});

export function HomeContent() {
  const { firstName } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  const query = useFilterStore((s) => s.filters.query);
  const initialFeedRef = useRef(useHomeFeedStore.getState());
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const headerScrolled = useHomeHeaderScroll(headerRef);
  const [headerSpacer, setHeaderSpacer] = useState(HEADER_SPACER_FALLBACK);

  const [poses, setPoses] = useState<Pose[]>(() => initialFeedRef.current.poses);
  const [loading, setLoading] = useState(() => !initialFeedRef.current.initialized);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(() => initialFeedRef.current.hasMore);
  const shownIdsRef = useRef(new Set<string>(initialFeedRef.current.shownIds));
  const hasMoreRef = useRef(initialFeedRef.current.hasMore);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoredFeedRef = useRef(initialFeedRef.current.initialized);

  useScrollRestore("/", !loading);

  useEffect(() => {
    useHomeFeedStore.getState().setFeedSnapshot({
      poses,
      shownIds: [...shownIdsRef.current],
      hasMore,
      initialized: true,
    });
  }, [poses, hasMore]);

  useLayoutEffect(() => {
    const outer = headerRef.current;
    const inner = headerInnerRef.current;
    if (!outer || !inner) return;

    const updateSpacer = () => {
      const measured = Math.ceil(inner.getBoundingClientRect().height);
      if (measured > 0) {
        setHeaderSpacer(measured + HEADER_FEED_GAP);
      }
    };

    updateSpacer();

    const observer = new ResizeObserver(updateSpacer);
    observer.observe(inner);
    observer.observe(outer);
    window.addEventListener("resize", updateSpacer);

    const fontsReady = document.fonts?.ready;
    void fontsReady?.then(updateSpacer);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSpacer);
    };
  }, [firstName]);

  const openSearch = useCallback(() => {
    const nextQuery = query.trim();
    const href = nextQuery
      ? `/search?q=${encodeURIComponent(nextQuery)}`
      : "/search";
    router.push(href);
  }, [query, router]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreRef.current) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const { poses: batch, hasMore: more } = await fetchHomePosesPool(
        PAGE_SIZE,
        shownIdsRef.current
      );

      const nextHasMore = more && batch.length > 0;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);

      if (batch.length) {
        batch.forEach((pose) => shownIdsRef.current.add(pose.id));
        setPoses((current) => mergeUniquePoses(current, batch));
      }
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (restoredFeedRef.current) {
      setLoading(false);
      return;
    }
    void loadMore();
  }, [loadMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "180px 0px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, poses.length]);

  return (
    <>
      <div
        ref={headerRef}
        className="angle-home-header-bar angle-home-header-visible fixed inset-x-0 top-0 z-30 mx-auto w-full px-4 pt-[max(10px,env(safe-area-inset-top))] md:flex md:justify-center md:px-6 lg:px-8"
      >
        <div
          ref={headerInnerRef}
          className={`angle-inner-glass angle-ui-shell w-full p-4 md:p-5 ${
            headerScrolled ? "angle-home-header-scrolled shadow-[var(--shadow-sm)]" : ""
          }`}
        >
          <SearchPanel
            onFilterClick={() => router.push("/search?filters=open")}
            onSubmit={openSearch}
            header={
              <>
                <p className="mb-0.5 text-[13px] font-medium text-[var(--text-secondary)]">
                  {getGreeting(firstName, language)}
                </p>
                <h1 className="text-[18px] font-bold leading-tight md:text-[17px]">
                  {t("homeTitle")}
                </h1>
              </>
            }
          />
        </div>
      </div>

      <div aria-hidden style={{ height: headerSpacer }} />

      <HomeFeed
        poses={poses}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
        loadingLabel={t("homeFeedLoading")}
        loadingMoreLabel={t("homeFeedLoadingMore")}
        endLabel={t("homeFeedEnd")}
      />
    </>
  );
}
