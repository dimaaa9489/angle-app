"use client";

import { memo } from "react";
import Link from "next/link";

import { getFeedImageSrc } from "@/lib/feed-image";
import type { Pose } from "@/lib/types";

type PoseFeedCardProps = {
  pose: Pose;
  priority?: boolean;
};

export const PoseFeedCard = memo(function PoseFeedCard({
  pose,
  priority = false,
}: PoseFeedCardProps) {
  const src = getFeedImageSrc(pose.imageUrl);

  return (
    <Link href={`/pose?id=${pose.id}`} className="block">
      <div className="angle-popular-card relative h-[220px] overflow-hidden bg-[#3d2e24]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={pose.title}
          width={420}
          height={462}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="line-clamp-2 text-xs font-bold text-white drop-shadow">{pose.title}</p>
        </div>
      </div>
    </Link>
  );
});
