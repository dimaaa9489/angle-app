"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

import { getFeedImageSrc } from "@/lib/feed-image";
import { extractDominantColorFromProxy } from "@/lib/dominant-color";
import { dynamicBgEngine } from "@/lib/dynamic-bg-engine";
import {
  POSE_FEED_HEIGHT,
  type PoseFeedAspect,
} from "@/lib/pose-feed-layout";
import type { Pose } from "@/lib/types";

type PoseFeedCardProps = {
  pose: Pose;
  aspect?: PoseFeedAspect;
  priority?: boolean;
  enableDynamicBg?: boolean;
};

export const PoseFeedCard = memo(function PoseFeedCard({
  pose,
  aspect = "medium",
  priority = false,
  enableDynamicBg = false,
}: PoseFeedCardProps) {
  const src = getFeedImageSrc(pose.imageUrl);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const cardId = useId();
  const [cardRgb, setCardRgb] = useState<string | null>(null);

  useEffect(() => {
    if (!enableDynamicBg) return;

    let cancelled = false;
    void extractDominantColorFromProxy(pose.imageUrl, src).then((rgb) => {
      if (!cancelled) setCardRgb(rgb);
    });

    return () => {
      cancelled = true;
    };
  }, [enableDynamicBg, pose.imageUrl, src]);

  useEffect(() => {
    if (!enableDynamicBg || !cardRgb) return;
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        dynamicBgEngine.reportCard(cardId, cardRgb, node, entry);
      },
      { rootMargin: "0px", threshold: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85] }
    );

    observer.observe(node);

    requestAnimationFrame(() => {
      const entry = observer.takeRecords()[0];
      if (entry) {
        dynamicBgEngine.reportCard(cardId, cardRgb, node, entry);
        return;
      }

      dynamicBgEngine.reportCardRect(cardId, cardRgb, node, node.getBoundingClientRect());
    });

    return () => {
      observer.disconnect();
      dynamicBgEngine.unregisterCard(cardId);
    };
  }, [cardId, cardRgb, enableDynamicBg]);

  return (
    <Link ref={cardRef} href={`/pose?id=${pose.id}`} className="block">
      <div
        className={`angle-popular-card relative overflow-hidden ${POSE_FEED_HEIGHT[aspect]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={pose.title}
          width={420}
          height={aspect === "tall" ? 560 : aspect === "short" ? 360 : 462}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="line-clamp-2 text-xs font-bold text-white drop-shadow">
            {pose.title}
          </p>
        </div>
      </div>
    </Link>
  );
});
