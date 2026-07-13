"use client";

import { memo } from "react";

import { PoseCard } from "@/components/PoseCard";
import { GlassCard } from "@/components/GlassCard";
import type { Pose } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

const aspects: Array<"tall" | "medium" | "short"> = [
  "medium",
  "tall",
  "short",
  "medium",
  "tall",
];

export const PoseMasonryGrid = memo(function PoseMasonryGrid({
  poses,
}: {
  poses: Pose[];
}) {
  const { t } = useTranslation();

  if (!poses.length) {
    return (
      <GlassCard padding="md" className="text-center">
        <p className="text-base font-semibold">{t("commonNothingFound")}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t("commonNothingFoundHint")}
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="columns-2 gap-3">
      {poses.map((pose, index) => (
        <PoseCard
          key={pose.id}
          pose={pose}
          aspect={aspects[index % aspects.length]}
          priority={index < 4}
        />
      ))}
    </div>
  );
});
