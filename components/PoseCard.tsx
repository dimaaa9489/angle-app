"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { Pose } from "@/lib/types";

type PoseCardProps = {
  pose: Pose;
  aspect?: "tall" | "medium" | "short";
  priority?: boolean;
};

const aspectClass = {
  tall: "h-[260px]",
  medium: "h-[220px]",
  short: "h-[180px]",
};

const PoseCardActions = memo(function PoseCardActions({
  poseId,
  title,
}: {
  poseId: string;
  title: string;
}) {
  const isStarred = useFavoritesStore((s) => s.isStarred(poseId));
  const toggleStar = useFavoritesStore((s) => s.toggleStar);

  const sharePose = useCallback(async () => {
    const url = `${window.location.origin}/pose?id=${poseId}`;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [poseId, title]);

  return (
    <div className="absolute right-2 top-2 flex gap-1.5">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleStar(poseId);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90"
        aria-label="В избранное"
      >
        <Heart
          size={15}
          className={isStarred ? "fill-[#ff6b7a] text-[#ff6b7a]" : "text-white"}
        />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          void sharePose();
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-transform active:scale-90"
        aria-label="Поделиться"
      >
        <Share2 size={15} className="text-white" />
      </button>
    </div>
  );
});

export const PoseCard = memo(function PoseCard({
  pose,
  aspect = "medium",
  priority = false,
}: PoseCardProps) {
  return (
    <article className="angle-feed-card mb-3 break-inside-avoid">
      <Link href={`/pose?id=${pose.id}`} className="group block">
        <div className={`angle-popular-card relative overflow-hidden ${aspectClass[aspect]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pose.imageUrl}
            alt={pose.title}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-bold text-white drop-shadow">{pose.title}</p>
          </div>
          <PoseCardActions poseId={pose.id} title={pose.title} />
        </div>
      </Link>
    </article>
  );
});
