"use client";

import { memo } from "react";

import { PoseFeedCard } from "@/components/PoseFeedCard";
import { GlassCard } from "@/components/GlassCard";
import type { Pose } from "@/lib/types";

export const PoseFeedGrid = memo(function PoseFeedGrid({ poses }: { poses: Pose[] }) {
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

  return (
    <div className="angle-feed-grid grid grid-cols-2 gap-3">
      {poses.map((pose, index) => (
        <PoseFeedCard key={pose.id} pose={pose} priority={index < 6} />
      ))}
    </div>
  );
});
