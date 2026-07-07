"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth, getGreeting } from "@/components/AuthProvider";
import { PoseFeedGrid } from "@/components/PoseFeedGrid";
import { SearchBar } from "@/components/SearchBar";
import { useHomeHeaderScroll } from "@/hooks/useHomeHeaderScroll";
import { fetchPosesPage } from "@/lib/poses";
import type { Pose } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";

const PAGE_SIZE = 12;
const HEADER_SPACER = 118;

const HomeFeed = memo(function HomeFeed({
  poses,
  loading,
  loadingMore,
  hasMore,
  sentinelRef,
}: {
  poses: Pose[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}) {
  if (loading && poses.length === 0) {
    return <div className="py-10 text-center text-sm text-white/55">Загружаем ленту…</div>;
  }

  return (
    <>
      <PoseFeedGrid poses={poses} />
      <div ref={sentinelRef} className="h-6" aria-hidden />
      {loadingMore ? (
        <p className="pb-6 text-center text-sm text-white/50">Загружаем ещё…</p>
      ) : null}
      {!hasMore && poses.length > 0 ? (
        <p className="pb-8 text-center text-xs text-white/35">Вы посмотрели всё</p>
      ) : null}
    </>
  );
});

export function HomeContent() {
  const { firstName } = useAuth();
  const router = useRouter();
  const query = useFilterStore((s) => s.filters.query);
  const headerRef = useRef<HTMLDivElement>(null);
  useHomeHeaderScroll(headerRef);

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
      const { poses: batch, hasMore: more } = await fetchPosesPage(
        offsetRef.current,
        PAGE_SIZE
      );

      if (batch.length) {
        setPoses((current) => [...current, ...batch]);
        offsetRef.current += batch.length;
      }

      const nextHasMore = more && batch.length > 0;
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
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
      { rootMargin: "320px 0px", threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, poses.length]);

  return (
    <>
      <div aria-hidden style={{ height: HEADER_SPACER }} />

      <div
        ref={headerRef}
        className="angle-home-header-bar angle-home-header-visible fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-lg px-4"
      >
        <div className="angle-home-header border-b border-white/10 bg-[#4a382c] px-4 pb-3 pt-[max(10px,env(safe-area-inset-top))]">
          <p className="mb-0.5 text-[13px] font-medium text-white/80">
            {getGreeting(firstName)}
          </p>
          <h1 className="mb-2.5 text-[18px] font-bold leading-tight text-white">
            Что сегодня будем фотографировать?
          </h1>

          <SearchBar
            compact
            onFilterClick={() => router.push("/search?filters=open")}
            onSubmit={openSearch}
          />
        </div>
      </div>

      <HomeFeed
        poses={poses}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
      />
    </>
  );
}
