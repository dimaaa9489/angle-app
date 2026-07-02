"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";

import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { Pose } from "@/lib/types";

type PoseCardProps = {
  pose: Pose;
  index?: number;
  aspect?: "tall" | "medium" | "short";
};

const aspectClass = {
  tall: "h-[260px]",
  medium: "h-[220px]",
  short: "h-[180px]",
};

export function PoseCard({ pose, index = 0, aspect = "medium" }: PoseCardProps) {
  const isStarred = useFavoritesStore((s) => s.isStarred(pose.id));
  const toggleStar = useFavoritesStore((s) => s.toggleStar);

  const sharePose = async () => {
    const url = `${window.location.origin}/pose?id=${pose.id}`;
    if (navigator.share) {
      await navigator.share({ title: pose.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="mb-3 break-inside-avoid"
    >
      <Link href={`/pose?id=${pose.id}`} className="group block">
        <div
          className={`angle-popular-card relative overflow-hidden ${aspectClass[aspect]}`}
        >
          <Image
            src={pose.imageUrl}
            alt={pose.title}
            fill
            className="object-cover transition-transform duration-500 group-active:scale-[1.03]"
            sizes="50vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-bold text-white drop-shadow">{pose.title}</p>
          </div>

          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleStar(pose.id);
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
        </div>
      </Link>
    </motion.div>
  );
}
