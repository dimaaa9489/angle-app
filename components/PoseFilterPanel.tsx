"use client";

import {
  FILTER_CATEGORIES,
  FILTER_LOCATIONS,
  FILTER_PEOPLE,
  FILTER_SESSION_TYPES,
  FILTER_SHOT_TYPES,
  FILTER_STYLES,
} from "@/lib/filters";
import type { PoseFilters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";

function toggleInArray<T extends string>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${active ? "filter-chip-active" : ""}`}
    >
      {label}
    </button>
  );
}

function FilterGroup<T extends string>({
  title,
  items,
  values,
  onToggle,
}: {
  title: string;
  items: { id: T; label: string }[];
  values: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-white/70">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <FilterChip
            key={item.id}
            label={item.label}
            active={values.includes(item.id)}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function PoseFilterPanel() {
  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);

  const update = <K extends keyof PoseFilters>(key: K, value: PoseFilters[K]) => {
    setFilters({ [key]: value } as Partial<PoseFilters>);
  };

  return (
    <div className="space-y-4 border-t border-white/10 pt-4">
      <FilterGroup
        title="Категория"
        items={FILTER_CATEGORIES}
        values={filters.categories}
        onToggle={(value) =>
          update("categories", toggleInArray(filters.categories, value))
        }
      />
      <FilterGroup
        title="Тип кадра"
        items={FILTER_SHOT_TYPES}
        values={filters.shotTypes}
        onToggle={(value) =>
          update("shotTypes", toggleInArray(filters.shotTypes, value))
        }
      />
      <FilterGroup
        title="Локация"
        items={FILTER_LOCATIONS}
        values={filters.locations}
        onToggle={(value) =>
          update("locations", toggleInArray(filters.locations, value))
        }
      />
      <FilterGroup
        title="Люди"
        items={FILTER_PEOPLE}
        values={filters.peopleCount}
        onToggle={(value) =>
          update("peopleCount", toggleInArray(filters.peopleCount, value))
        }
      />
      <FilterGroup
        title="Тип сессии"
        items={FILTER_SESSION_TYPES}
        values={filters.sessionTypes}
        onToggle={(value) =>
          update("sessionTypes", toggleInArray(filters.sessionTypes, value))
        }
      />
      <FilterGroup
        title="Стиль"
        items={FILTER_STYLES}
        values={filters.styles}
        onToggle={(value) =>
          update("styles", toggleInArray(filters.styles, value))
        }
      />
    </div>
  );
}
