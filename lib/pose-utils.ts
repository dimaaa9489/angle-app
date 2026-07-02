import type { Pose, PoseFilters } from "@/lib/types";

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export function matchesPoseFilters(pose: Pose, filters: PoseFilters): boolean {
  const q = normalize(filters.query);
  if (q) {
    const haystack = [
      pose.title,
      ...pose.keywords,
      pose.category,
      pose.shotType,
      ...pose.locations,
      ...pose.sessionTypes,
      ...pose.styles,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

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
  return poses.filter((p) => matchesPoseFilters(p, filters));
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
