"use client";

import { useEffect, useState, useTransition } from "react";

import { buildSearchResults } from "@/lib/pose-utils";
import type { Pose, PoseFilters } from "@/lib/types";

type SearchResultsState = {
  filtered: Pose[];
  totalMatches: number;
  pending: boolean;
};

export function useSearchResults(
  poses: Pose[],
  filters: PoseFilters,
  limit: number
): SearchResultsState {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<SearchResultsState>(() => ({
    ...buildSearchResults(poses, filters, limit),
    pending: false,
  }));

  useEffect(() => {
    startTransition(() => {
      const next = buildSearchResults(poses, filters, limit);
      setState({ ...next, pending: false });
    });
  }, [poses, filters, limit]);

  return { ...state, pending: isPending };
}
