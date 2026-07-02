"use client";

import { create } from "zustand";

import { EMPTY_FILTERS } from "@/lib/filters";
import type { PoseFilters } from "@/lib/types";

type FilterState = {
  filters: PoseFilters;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<PoseFilters>) => void;
  resetFilters: () => void;
};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: { ...EMPTY_FILTERS },

  setQuery: (query) =>
    set({ filters: { ...get().filters, query } }),

  setFilters: (partial) =>
    set({ filters: { ...get().filters, ...partial } }),

  resetFilters: () => set({ filters: { ...EMPTY_FILTERS } }),
}));
