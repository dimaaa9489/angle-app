import { shufflePosesSeeded } from "@/lib/pose-feed-layout";
import { matchesTextQuery, primePoseSearchHaystacks } from "@/lib/pose-search";
import type { Pose, PoseFilters } from "@/lib/types";

export function getSearchShuffleSeed(filters: PoseFilters): string {
  return [
    filters.query.trim().toLowerCase(),
    ...filters.categories,
    ...filters.locations,
    ...filters.shotTypes,
    ...filters.peopleCount,
    ...filters.sessionTypes,
    ...filters.styles,
  ].join("|");
}

export function buildSearchResults(
  poses: Pose[],
  filters: PoseFilters,
  limit: number
): { filtered: Pose[]; totalMatches: number } {
  const matches = balanceCategoryFilterResults(filterPoses(poses, filters), filters);
  const shuffled = shufflePosesSeeded(matches, getSearchShuffleSeed(filters));
  return {
    filtered: shuffled.slice(0, limit),
    totalMatches: matches.length,
  };
}

/** Mix results across selected categories so men are not pushed out by the 48-cap. */
export function balanceCategoryFilterResults(poses: Pose[], filters: PoseFilters): Pose[] {
  if (filters.categories.length <= 1) return poses;

  const buckets = new Map<string, Pose[]>();
  for (const category of filters.categories) {
    buckets.set(category, []);
  }

  const overflow: Pose[] = [];
  for (const pose of poses) {
    const bucket = buckets.get(pose.category);
    if (bucket) bucket.push(pose);
    else overflow.push(pose);
  }

  const merged: Pose[] = [];
  let index = 0;
  let added = true;

  while (added) {
    added = false;
    for (const category of filters.categories) {
      const bucket = buckets.get(category);
      const pose = bucket?.[index];
      if (!pose) continue;
      merged.push(pose);
      added = true;
    }
    index += 1;
  }

  return [...merged, ...overflow];
}

export function matchesPoseFilters(pose: Pose, filters: PoseFilters): boolean {
  if (filters.categories.length && !filters.categories.includes(pose.category)) {
    return false;
  }
  if (
    filters.locations.length &&
    !filters.locations.some((l) => pose.locations.includes(l))
  ) {
    return false;
  }
  if (
    filters.peopleCount.length &&
    !filters.peopleCount.some((p) => pose.peopleCount.includes(p))
  ) {
    return false;
  }
  if (filters.shotTypes.length && !filters.shotTypes.includes(pose.shotType)) {
    return false;
  }
  if (
    filters.sessionTypes.length &&
    !filters.sessionTypes.some((s) => pose.sessionTypes.includes(s))
  ) {
    return false;
  }
  if (
    filters.styles.length &&
    !filters.styles.some((s) => pose.styles.includes(s))
  ) {
    return false;
  }

  if (!matchesTextQuery(pose, filters.query)) return false;

  return true;
}

export function filterPoses(poses: Pose[], filters: PoseFilters): Pose[] {
  if (!filters.query.trim()) {
    return poses.filter((pose) => matchesPoseFiltersWithoutQuery(pose, filters));
  }
  return poses.filter((pose) => matchesPoseFilters(pose, filters));
}

function matchesPoseFiltersWithoutQuery(pose: Pose, filters: PoseFilters): boolean {
  if (filters.categories.length && !filters.categories.includes(pose.category)) return false;
  if (
    filters.locations.length &&
    !filters.locations.some((l) => pose.locations.includes(l))
  ) {
    return false;
  }
  if (
    filters.peopleCount.length &&
    !filters.peopleCount.some((p) => pose.peopleCount.includes(p))
  ) {
    return false;
  }
  if (filters.shotTypes.length && !filters.shotTypes.includes(pose.shotType)) return false;
  if (
    filters.sessionTypes.length &&
    !filters.sessionTypes.some((s) => pose.sessionTypes.includes(s))
  ) {
    return false;
  }
  if (filters.styles.length && !filters.styles.some((s) => pose.styles.includes(s))) {
    return false;
  }
  return true;
}

export function preparePoseSearchIndex(poses: Pose[]) {
  primePoseSearchHaystacks(poses);
}

export function countActiveFilters(filters: PoseFilters): number {
  return (
    filters.locations.length +
    filters.peopleCount.length +
    filters.shotTypes.length +
    filters.sessionTypes.length +
    filters.styles.length +
    filters.categories.length
  );
}
