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

export const POSE_FEED_HEIGHT: Record<PoseFeedAspect, string> = {
  short: "h-[168px]",
  medium: "h-[232px]",
  tall: "h-[312px]",
};

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

export function mergeUniquePoses(current: Pose[], incoming: Pose[]): Pose[] {
  const seen = new Set(current.map((pose) => pose.id));
  const fresh = incoming.filter((pose) => !seen.has(pose.id));
  return [...current, ...fresh];
}
