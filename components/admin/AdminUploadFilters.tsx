"use client";

import { memo } from "react";

import { FilterChipGroups } from "@/components/FilterChipGroups";
import type { PoseFilterSelection } from "@/lib/types";

type AdminUploadFiltersProps = {
  selection: PoseFilterSelection;
  onChange: (next: PoseFilterSelection) => void;
};

export const AdminUploadFilters = memo(function AdminUploadFilters({
  selection,
  onChange,
}: AdminUploadFiltersProps) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">
        Фильтры для всей очереди
      </p>
      <FilterChipGroups variant="admin" selection={selection} onChange={onChange} />
    </div>
  );
});
