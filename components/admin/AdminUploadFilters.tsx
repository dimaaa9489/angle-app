"use client";

import { memo } from "react";

import { FilterChipGroups } from "@/components/FilterChipGroups";
import { admin } from "@/components/admin/admin-ui";
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
    <div className={`${admin.cardMuted} mt-4`}>
      <p className={`${admin.label} mb-3`}>Фильтры для всей очереди</p>
      <FilterChipGroups variant="admin" selection={selection} onChange={onChange} />
    </div>
  );
});
