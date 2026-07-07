"use client";

import { FILTER_GROUPS } from "@/lib/filters";
import type { PoseFilterSelection } from "@/lib/types";

function toggleInArray<T extends string>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

type FilterChipGroupsProps = {
  selection: PoseFilterSelection;
  onChange: (next: PoseFilterSelection) => void;
  variant?: "app" | "admin";
};

export function FilterChipGroups({
  selection,
  onChange,
  variant = "app",
}: FilterChipGroupsProps) {
  const isAdmin = variant === "admin";

  return (
    <div className={isAdmin ? "space-y-3" : "space-y-4 border-t border-white/10 pt-4"}>
      {FILTER_GROUPS.map((group) => {
        const values = selection[group.key] as string[];

        return (
          <div key={group.key}>
            <p
              className={
                isAdmin
                  ? "mb-1.5 text-[11px] font-bold uppercase tracking-wide text-white/45"
                  : "mb-2 text-sm font-semibold text-white/70"
              }
            >
              {group.title}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => {
                const active = values.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...selection,
                        [group.key]: toggleInArray(values, item.id),
                      } as PoseFilterSelection)
                    }
                    className={
                      isAdmin
                        ? `rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            active
                              ? "border-[#B8956B] bg-[#B8956B]/20 text-white"
                              : "border-white/15 text-white/70"
                          }`
                        : `filter-chip ${active ? "filter-chip-active" : ""}`
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
