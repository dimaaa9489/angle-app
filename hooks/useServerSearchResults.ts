"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { fetchSearchPoses } from "@/lib/search/fetch-search-poses";
import type { Pose, PoseFilters } from "@/lib/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type ServerSearchState = {
  poses: Pose[];
  totalMatches: number;
  hasMore: boolean;
  pending: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  source: "rpc" | "fallback" | null;
};

export function useServerSearchResults(
  filters: PoseFilters,
  pageSize: number
): ServerSearchState & { loadMore: () => void; retry: () => void } {
  const debouncedQuery = useDebouncedValue(filters.query.trim(), 300);
  const filtersForSearch = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery]
  );

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ServerSearchState>({
    poses: [],
    totalMatches: 0,
    hasMore: false,
    pending: false,
    loading: true,
    loadingMore: false,
    error: null,
    source: null,
  });

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const filtersKeyRef = useRef("");

  const filtersKey = JSON.stringify({
    query: filtersForSearch.query,
    categories: filtersForSearch.categories,
    locations: filtersForSearch.locations,
    shotTypes: filtersForSearch.shotTypes,
    peopleCount: filtersForSearch.peopleCount,
    sessionTypes: filtersForSearch.sessionTypes,
    styles: filtersForSearch.styles,
  });

  const runSearch = (offset: number, append: boolean) => {
    const requestId = ++requestIdRef.current;

    if (append) {
      loadingMoreRef.current = true;
      setState((current) => ({ ...current, loadingMore: true, error: null }));
    } else {
      setState((current) => ({ ...current, loading: true, error: null }));
    }

    void fetchSearchPoses(filtersForSearch, pageSize, offset)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;

        setState((current) => ({
          poses: append ? [...current.poses, ...result.poses] : result.poses,
          totalMatches: result.total,
          hasMore: result.hasMore,
          pending: false,
          loading: false,
          loadingMore: false,
          error: null,
          source: result.source ?? null,
        }));
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;

        setState((current) => ({
          ...current,
          pending: false,
          loading: false,
          loadingMore: false,
          error: "search_failed",
        }));
      })
      .finally(() => {
        loadingMoreRef.current = false;
      });
  };

  useEffect(() => {
    filtersKeyRef.current = filtersKey;

    startTransition(() => {
      setState((current) => ({ ...current, pending: true }));
      runSearch(0, false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by filtersKey
  }, [filtersKey, pageSize]);

  const loadMore = () => {
    if (loadingMoreRef.current || !state.hasMore || state.loading) return;
    runSearch(state.poses.length, true);
  };

  const retry = () => {
    runSearch(0, false);
  };

  return {
    ...state,
    pending: isPending || state.pending,
    loadMore,
    retry,
  };
}
