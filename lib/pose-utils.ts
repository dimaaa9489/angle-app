import { matchesTextQuery, primePoseSearchHaystacks } from "@/lib/pose-search";
import type { Pose, PoseFilters } from "@/lib/types";

export function matchesPoseFilters(pose: Pose, filters: PoseFilters): boolean {
  if (!matchesTextQuery(pose, filters.query)) return false;

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
