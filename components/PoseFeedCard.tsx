"use client";

import { memo } from "react";
import Link from "next/link";

import type { Pose } from "@/lib/types";

type PoseFeedCardProps = {
  pose: Pose;
  priority?: boolean;
};

export const PoseFeedCard = memo(function PoseFeedCard({
  pose,
  priority = false,
}: PoseFeedCardProps) {
  return (
    <Link href={`/pose?id=${pose.id}`} className="block">
      <div className="angle-popular-card relative h-[220px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pose.imageUrl}
          alt={pose.title}
          width={400}
          height={440}
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
