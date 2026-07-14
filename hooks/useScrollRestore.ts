"use client";

import { useLayoutEffect } from "react";

import { restoreScrollForPath } from "@/lib/scroll-restore";

export function useScrollRestore(path: string, ready = true) {
  useLayoutEffect(() => {
    if (!ready) return;
    restoreScrollForPath(path);
  }, [path, ready]);
}
