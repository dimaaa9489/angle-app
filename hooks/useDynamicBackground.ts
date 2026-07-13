"use client";

import { useEffect } from "react";

import { extractDominantColor } from "@/lib/dominant-color";
import { dynamicBgEngine } from "@/lib/dynamic-bg-engine";

/** Single-photo pages (pose detail). Keeps the last color on unmount. */
export function useDynamicBackground(imageUrl: string | null | undefined) {
  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    void extractDominantColor(imageUrl).then((rgb) => {
      if (cancelled) return;
      dynamicBgEngine.setPoseColor(rgb);
    });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);
}
