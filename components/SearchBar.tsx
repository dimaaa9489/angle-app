"use client";

import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useFilterStore } from "@/stores/useFilterStore";

type SearchBarProps = {
  autoFocus?: boolean;
  compact?: boolean;
  onFilterClick?: () => void;
  onSubmit?: () => void;
  activeFilterCount?: number;
};

export function SearchBar({
  autoFocus,
  compact,
  onFilterClick,
  onSubmit,
  activeFilterCount = 0,
}: SearchBarProps) {
  const router = useRouter();
  const filters = useFilterStore((s) => s.filters);
  const setQuery = useFilterStore((s) => s.setQuery);

  const openFilters = () => {
    if (onFilterClick) {
      onFilterClick();
      return;
    }
    router.push("/search?filters=open");
  };

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-2.5"}`}>
      <div
        className={`angle-search-pill flex flex-1 items-center ${
          compact ? "min-h-10 gap-2 px-3" : "min-h-12 gap-2.5 px-4"
        }`}
      >
        <SearchIcon
          size={compact ? 15 : 17}
          className="shrink-0 text-white/65"
          strokeWidth={2.2}
        />
        <input
          type="search"
          value={filters.query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (onSubmit) {
                onSubmit();
                return;
              }
              router.push("/search");
            }
          }}
          placeholder="Поиск поз и идей"
          className={`w-full bg-transparent text-white outline-none placeholder:text-white/45 ${
            compact ? "py-2 text-[14px]" : "py-3 text-[15px]"
          }`}
        />
      </div>
      <button
        type="button"
        onClick={openFilters}
        className={`angle-search-filter relative flex shrink-0 items-center justify-center ${
          compact ? "h-10 w-10" : "h-12 w-12"
        } ${activeFilterCount > 0 ? "angle-search-filter-active" : ""}`}
        aria-label="Фильтры"
      >
        <SlidersHorizontal
          size={compact ? 16 : 18}
          className="text-white/90"
          strokeWidth={2.2}
        />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-[#3d2e24]">
            {activeFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}
