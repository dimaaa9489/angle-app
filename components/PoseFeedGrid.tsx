"use client";

import { memo, useMemo } from "react";

import { MotionCard } from "@/components/MotionCard";
import { PoseFeedCard } from "@/components/PoseFeedCard";
import { GlassCard } from "@/components/GlassCard";
import { getPoseFeedAspect } from "@/lib/pose-feed-layout";
import type { Pose } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

function FeedColumn({
  items,
  enableDynamicBg,
}: {
  items: { pose: Pose; index: number }[];
  enableDynamicBg: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      {items.map(({ pose, index }) => (
        <MotionCard
          key={pose.id}
          index={index}
          className="break-inside-avoid"
        >
          <PoseFeedCard
            pose={pose}
            aspect={getPoseFeedAspect(pose.id, Math.floor(index / 2))}
            priority={index < 6}
            enableDynamicBg={enableDynamicBg}
          />
        </MotionCard>
      ))}
    </div>
  );
}

export const PoseFeedGrid = memo(function PoseFeedGrid({
  poses,
  enableDynamicBg = false,
}: {
  poses: Pose[];
  enableDynamicBg?: boolean;
}) {
  const { t } = useTranslation();
  const { leftColumn, rightColumn } = useMemo(() => {
    const left: { pose: Pose; index: number }[] = [];
    const right: { pose: Pose; index: number }[] = [];

    poses.forEach((pose, index) => {
      if (index % 2 === 0) left.push({ pose, index });
      else right.push({ pose, index });
    });

    return { leftColumn: left, rightColumn: right };
  }, [poses]);

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
    <div className="angle-feed-masonry flex gap-3">
      <FeedColumn items={leftColumn} enableDynamicBg={enableDynamicBg} />
      <FeedColumn items={rightColumn} enableDynamicBg={enableDynamicBg} />
    </div>
  );
});
