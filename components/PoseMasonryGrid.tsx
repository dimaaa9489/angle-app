"use client";

import { PoseCard } from "@/components/PoseCard";
import { GlassCard } from "@/components/GlassCard";
import type { Pose } from "@/lib/types";

export function PoseMasonryGrid({ poses }: { poses: Pose[] }) {
  if (!poses.length) {
    return (
      <GlassCard padding="md" className="text-center">
        <p className="text-base font-semibold text-white">Ничего не найдено</p>
        <p className="mt-2 text-sm text-white/55">
          Измените фильтры или поисковый запрос
        </p>
      </GlassCard>
    );
  }

  const aspects: Array<"tall" | "medium" | "short"> = [
    "medium",
    "tall",
    "short",
    "medium",
    "tall",
  ];

  return (
    <div className="columns-2 gap-3">
      {poses.map((pose, index) => (
        <PoseCard
          key={`${pose.id}-${index}`}
          pose={pose}
          index={index % 8}
          aspect={aspects[index % aspects.length]}
        />
      ))}
    </div>
  );
}
