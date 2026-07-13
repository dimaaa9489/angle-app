"use client";

import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useFilterStore } from "@/stores/useFilterStore";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();
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
          compact ? "min-h-12 gap-2 px-3" : "min-h-12 gap-2.5 px-4"
        }`}
      >
        <SearchIcon
          size={compact ? 15 : 17}
          className="shrink-0 text-[var(--text-tertiary)]"
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
          placeholder={t("searchPlaceholder")}
          className={`w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] ${
            compact ? "py-2 text-[14px]" : "py-3 text-[15px]"
          }`}
        />
      </div>
      <button
        type="button"
        onClick={openFilters}
        className={`angle-search-filter relative flex shrink-0 items-center justify-center h-12 w-12 ${
          activeFilterCount > 0 ? "angle-search-filter-active" : ""
        }`}
        aria-label={t("searchFilters")}
      >
        <SlidersHorizontal size={compact ? 16 : 18} strokeWidth={2.2} />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold leading-none text-[var(--text-inverse)]">
            {activeFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}
