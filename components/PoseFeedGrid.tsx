"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { PoseFeedCard } from "@/components/PoseFeedCard";
import { GlassCard } from "@/components/GlassCard";
import type { Pose } from "@/lib/types";

const COLS = 2;
const ROW_HEIGHT = 232;
const BUFFER_ROWS = 4;

type VisibleRange = { start: number; end: number };

function getScrollRoot() {
  return document.querySelector<HTMLElement>(".angle-scroll");
}

export const PoseFeedGrid = memo(function PoseFeedGrid({ poses }: { poses: Pose[] }) {
  const rowCount = Math.ceil(poses.length / COLS);
  const [range, setRange] = useState<VisibleRange>({ start: 0, end: 12 });
  const rangeRef = useRef(range);

  const updateRange = useMemo(
    () => (scrollTop: number, viewHeight: number) => {
      const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS);
      const end = Math.min(
        rowCount,
        Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + BUFFER_ROWS
      );
      const prev = rangeRef.current;
      if (prev.start === start && prev.end === end) return;
      const next = { start, end };
      rangeRef.current = next;
      setRange(next);
    },
    [rowCount]
  );

  useEffect(() => {
    rangeRef.current = range;
  }, [range]);

  useEffect(() => {
    const root = getScrollRoot();
    if (!root || rowCount === 0) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      updateRange(root.scrollTop, root.clientHeight);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rowCount, updateRange]);

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

  const topSpacer = range.start * ROW_HEIGHT;
  const bottomSpacer = Math.max(0, (rowCount - range.end) * ROW_HEIGHT);

  const visible: { pose: Pose; index: number }[] = [];
  for (let row = range.start; row < range.end; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const index = row * COLS + col;
      const pose = poses[index];
      if (pose) visible.push({ pose, index });
    }
  }

  return (
    <div className="angle-feed-grid" style={{ minHeight: rowCount * ROW_HEIGHT }}>
      {topSpacer > 0 ? <div aria-hidden style={{ height: topSpacer }} /> : null}
      <div className="grid grid-cols-2 gap-3">
        {visible.map(({ pose, index }) => (
          <PoseFeedCard key={pose.id} pose={pose} priority={index < 4} />
        ))}
      </div>
      {bottomSpacer > 0 ? <div aria-hidden style={{ height: bottomSpacer }} /> : null}
    </div>
  );
});
