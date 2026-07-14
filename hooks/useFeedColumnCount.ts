"use client";

import { useLayoutEffect, useState } from "react";

import {
  FEED_MOBILE_COLUMNS,
  getFeedColumnCount,
} from "@/lib/pose-feed-layout";

function getViewportFeedWidth() {
  return document.documentElement.clientWidth - 32;
}

/** Column count from viewport — stable when filter panel opens/closes. */
export function useFeedColumnCount() {
  const [columnCount, setColumnCount] = useState(FEED_MOBILE_COLUMNS);

  useLayoutEffect(() => {
    const update = () => {
      setColumnCount(getFeedColumnCount(getViewportFeedWidth()));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columnCount;
}
