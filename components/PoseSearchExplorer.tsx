"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { GlassCard } from "@/components/GlassCard";
import { PoseFilterPanel } from "@/components/PoseFilterPanel";
import { PoseMasonryGrid } from "@/components/PoseMasonryGrid";
import { SearchBar } from "@/components/SearchBar";
import { EMPTY_FILTERS } from "@/lib/filters";
import { countActiveFilters, filterPoses } from "@/lib/pose-utils";
import { fetchPoses } from "@/lib/poses";
import type { Pose, PoseFilters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";

const SEARCH_RESULT_LIMIT = 60;

export function PoseSearchExplorer() {
  const searchParams = useSearchParams();
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(
    () => searchParams.get("filters") === "open"
  );

  const filters = useFilterStore((s) => s.filters);
  const setFilters = useFilterStore((s) => s.setFilters);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  useEffect(() => {
    void fetchPoses().then((data) => {
      setPoses(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("cat");
    const type = searchParams.get("type");
    const hasPreset = Boolean(q || cat || type);

    if (!hasPreset) return;

    const next: PoseFilters = {
      ...EMPTY_FILTERS,
      query: q,
      categories: cat ? [cat as PoseFilters["categories"][number]] : [],
      shotTypes: type ? [type as PoseFilters["shotTypes"][number]] : [],
    };

    setFilters(next);
  }, [searchParams, setFilters]);

  const filtered = useMemo(() => {
    const matches = filterPoses(poses, filters);
    return matches.slice(0, SEARCH_RESULT_LIMIT);
  }, [poses, filters]);
  const totalMatches = useMemo(
    () => filterPoses(poses, filters).length,
    [poses, filters]
  );
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <GlassCard className="mb-4" padding="md">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-white">Поиск</h1>
            <p className="mt-1 text-sm text-white/55">Найди позы по фильтрам и ключевым словам</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetFilters();
              setFiltersOpen(false);
            }}
            className="text-sm font-semibold text-white/65 active:opacity-70"
          >
            Сбросить
          </button>
        </div>

        <SearchBar
          autoFocus
          activeFilterCount={activeCount}
          onFilterClick={() => setFiltersOpen((open) => !open)}
          onSubmit={() => undefined}
        />

        {filtersOpen ? <PoseFilterPanel /> : null}
      </GlassCard>

      {loading ? (
        <GlassCard padding="md" className="text-center text-sm text-white/50">
          Загружаем…
        </GlassCard>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-white/85">
              Найдено: {totalMatches}
              {totalMatches > SEARCH_RESULT_LIMIT
                ? ` (показаны первые ${SEARCH_RESULT_LIMIT})`
                : ""}
            </p>
          </div>
          <PoseMasonryGrid poses={filtered} />
        </>
      )}
    </>
  );
}
