"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth, getGreeting } from "@/components/AuthProvider";
import { PoseMasonryGrid } from "@/components/PoseMasonryGrid";
import { SearchBar } from "@/components/SearchBar";
import { fetchPosesPage } from "@/lib/poses";
import type { Pose } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";

const PAGE_SIZE = 12;

export function HomeContent() {
  const { firstName } = useAuth();
  const router = useRouter();
  const query = useFilterStore((s) => s.filters.query);

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const openSearch = () => {
    const nextQuery = query.trim();
    const href = nextQuery
      ? `/search?q=${encodeURIComponent(nextQuery)}`
      : "/search";
    router.push(href);
  };

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
      { rootMargin: "280px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, poses.length]);

  return (
    <>
      <div className="angle-home-header sticky top-0 z-10 -mx-4 mb-4 border-b border-white/10 bg-[#4a382c]/82 px-4 pb-4 pt-1 backdrop-blur-xl">
        <p className="mb-1 text-[14px] font-medium text-white/85">
          {getGreeting(firstName)}
        </p>
        <h1 className="mb-4 text-[22px] font-bold leading-[1.2] text-white">
          Что сегодня будем
          <br />
          фотографировать?
        </h1>

        <SearchBar
          onFilterClick={() => router.push("/search?filters=open")}
          onSubmit={openSearch}
        />
      </div>

      {loading && poses.length === 0 ? (
        <div className="py-10 text-center text-sm text-white/55">Загружаем ленту…</div>
      ) : (
        <>
          <PoseMasonryGrid poses={poses} />
          <div ref={sentinelRef} className="h-10" aria-hidden />
          {loadingMore ? (
            <p className="pb-6 text-center text-sm text-white/50">Загружаем ещё…</p>
          ) : null}
          {!hasMore && poses.length > 0 ? (
            <p className="pb-8 text-center text-xs text-white/35">Вы посмотрели всё</p>
          ) : null}
        </>
      )}
    </>
  );
}
