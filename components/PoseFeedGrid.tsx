"use client";

import { memo, useMemo } from "react";

import { MotionCard } from "@/components/MotionCard";
import { PoseFeedCard } from "@/components/PoseFeedCard";
import { GlassCard } from "@/components/GlassCard";
import { useFeedColumnCount } from "@/hooks/useFeedColumnCount";
import { getPoseFeedAspect } from "@/lib/pose-feed-layout";
import type { Pose } from "@/lib/types";
import { useTranslation } from "@/hooks/useTranslation";

function FeedColumn({
  items,
  columnCount,
  enableDynamicBg,
}: {
  items: { pose: Pose; index: number }[];
  columnCount: number;
  enableDynamicBg: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      {items.map(({ pose, index }) => (
        <MotionCard key={pose.id} index={index} className="break-inside-avoid">
          <PoseFeedCard
            pose={pose}
            aspect={getPoseFeedAspect(pose.id, Math.floor(index / columnCount))}
            priority={index < columnCount * 3}
            enableDynamicBg={enableDynamicBg}
          />
        </MotionCard>
      ))}
    </div>
  );
}

function distributeToColumns(poses: Pose[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as { pose: Pose; index: number }[]);

  poses.forEach((pose, index) => {
    columns[index % columnCount].push({ pose, index });
  });

  return columns;
}

export const PoseFeedGrid = memo(function PoseFeedGrid({
  poses,
  enableDynamicBg = false,
}: {
  poses: Pose[];
  enableDynamicBg?: boolean;
}) {
  const { t } = useTranslation();
  const columnCount = useFeedColumnCount();

  const columns = useMemo(
    () => distributeToColumns(poses, columnCount),
    [poses, columnCount]
  );

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
    <div className="angle-feed-masonry flex w-full gap-3">
      {columns.map((items, columnIndex) => (
        <FeedColumn
          key={columnIndex}
          items={items}
          columnCount={columnCount}
          enableDynamicBg={enableDynamicBg}
        />
      ))}
    </div>
  );
});
