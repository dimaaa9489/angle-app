"use client";

import { create } from "zustand";

import type { Pose } from "@/lib/types";

type HomeFeedState = {
  poses: Pose[];
  shownIds: string[];
  hasMore: boolean;
  initialized: boolean;
  setFeedSnapshot: (snapshot: {
    poses: Pose[];
    shownIds: string[];
    hasMore: boolean;
    initialized?: boolean;
  }) => void;
  resetFeed: () => void;
};

export const useHomeFeedStore = create<HomeFeedState>((set) => ({
  poses: [],
  shownIds: [],
  hasMore: true,
  initialized: false,
  setFeedSnapshot: (snapshot) =>
    set({
      poses: snapshot.poses,
      shownIds: snapshot.shownIds,
      hasMore: snapshot.hasMore,
      initialized: snapshot.initialized ?? true,
    }),
  resetFeed: () =>
    set({
      poses: [],
      shownIds: [],
      hasMore: true,
      initialized: false,
    }),
}));
