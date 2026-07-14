import { filtersToSearchParams } from "@/lib/search/prepare-search-query";
import type { Pose, PoseFilters } from "@/lib/types";

export type FetchSearchPosesResult = {
  poses: Pose[];
  total: number;
  hasMore: boolean;
  source?: "rpc" | "fallback";
};

export async function fetchSearchPoses(
  filters: PoseFilters,
  limit: number,
  offset: number
): Promise<FetchSearchPosesResult> {
  const params = filtersToSearchParams(filters, limit, offset);

  const response = await fetch(`/api/search/poses?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  return (await response.json()) as FetchSearchPosesResult;
}
