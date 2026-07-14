import type { Pose } from "@/lib/types";

export type PoseFeedAspect = "short" | "medium" | "tall";

const ASPECT_CYCLE: PoseFeedAspect[] = [
  "medium",
  "tall",
  "short",
  "medium",
  "tall",
  "short",
];

export const POSE_FEED_ASPECT: Record<PoseFeedAspect, string> = {
  short: "aspect-[5/4]",
  medium: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

/** @deprecated Use POSE_FEED_ASPECT — fixed heights squish on wide columns. */
export const POSE_FEED_HEIGHT: Record<PoseFeedAspect, string> = {
  short: "aspect-[5/4]",
  medium: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

/** Phone layout stays 2 columns; desktop fills the viewport width. */
export const FEED_MOBILE_MAX_WIDTH = 640;
export const FEED_MOBILE_COLUMNS = 2;
export const FEED_MIN_COLUMN_WIDTH = 260;
export const FEED_MAX_COLUMNS = 12;

export function getFeedColumnCount(containerWidth: number): number {
  if (containerWidth <= FEED_MOBILE_MAX_WIDTH) return FEED_MOBILE_COLUMNS;

  return Math.min(
    FEED_MAX_COLUMNS,
    Math.max(3, Math.floor(containerWidth / FEED_MIN_COLUMN_WIDTH))
  );
}

export function getPoseFeedAspect(poseId: string, index = 0): PoseFeedAspect {
  let hash = index;
  for (let i = 0; i < poseId.length; i += 1) {
    hash = (hash + poseId.charCodeAt(i) * (i + 1)) % ASPECT_CYCLE.length;
  }
  return ASPECT_CYCLE[hash] ?? "medium";
}

export function shufflePoses<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Stable pseudo-random order for the same query + filters (no upload-date batches). */
export function shufflePosesSeeded<T>(items: T[], seedText: string): T[] {
  const copy = [...items];
  let seed = hashSeed(seedText || "search");
  const random = () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function mergeUniquePoses(current: Pose[], incoming: Pose[]): Pose[] {
  const seen = new Set(current.map((pose) => pose.id));
  const fresh = incoming.filter((pose) => !seen.has(pose.id));
  return [...current, ...fresh];
}
