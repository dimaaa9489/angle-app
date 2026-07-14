"use client";

import { FilterChipGroups } from "@/components/FilterChipGroups";
import { useFilterStore } from "@/stores/useFilterStore";

export function PoseFilterPanel() {
  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);

  return (
    <FilterChipGroups
      variant="app"
      selection={{
        categories: filters.categories,
        shotTypes: filters.shotTypes,
        locations: filters.locations,
        peopleCount: filters.peopleCount,
        sessionTypes: filters.sessionTypes,
        styles: filters.styles,
      }}
      onChange={(selection) => {
        const query = useFilterStore.getState().filters.query;
        setFilters({ ...selection, query });
      }}
    />
  );
}
