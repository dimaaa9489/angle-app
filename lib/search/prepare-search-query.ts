import { analyzeSearchQuery } from "@/lib/pose-search";
import { conceptToImpliedFilters, resolveSearchConcept } from "@/lib/i18n/search-vocabulary";
import { normalizeSearchText } from "@/lib/i18n/search-words";
import type { PoseFilters } from "@/lib/types";

export type PreparedSearchQuery = {
  query: string;
  terms: string[];
  categories: string[];
  locations: string[];
  shotTypes: string[];
  peopleCount: string[];
  sessionTypes: string[];
  styles: string[];
};

function mergeFilterValues(userValues: string[], impliedValues: string[]): string[] {
  if (userValues.length) return userValues;
  return impliedValues;
}

function uniqueTerms(values: string[], max = 48): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const norm = normalizeSearchText(value);
    if (!norm || norm.length < 2) continue;
    if (seen.has(norm)) continue;
    seen.add(norm);
    result.push(norm);
    if (result.length >= max) break;
  }

  return result;
}

/** Maps UI filters + dictionary/synonyms → SQL RPC parameters. */
export function prepareSearchQuery(filters: PoseFilters): PreparedSearchQuery {
  const query = filters.query.trim();
  const analysis = analyzeSearchQuery(query);
  const concept = resolveSearchConcept(query);

  const conceptImplied = concept ? conceptToImpliedFilters(concept) : {
    categories: [],
    locations: [],
    peopleCount: [],
    shotTypes: [],
    sessionTypes: [],
    styles: [],
  };

  const terms = uniqueTerms([
    analysis.normalized,
    ...analysis.variants,
    ...analysis.tokenVariants,
    ...(concept?.normalizedTerms ?? []),
  ]);

  return {
    query,
    terms,
    categories: mergeFilterValues(filters.categories, [
      ...analysis.synonymImplied.categories,
      ...conceptImplied.categories,
    ]),
    locations: mergeFilterValues(filters.locations, [
      ...analysis.synonymImplied.locations,
      ...conceptImplied.locations,
    ]),
    shotTypes: mergeFilterValues(filters.shotTypes, [
      ...analysis.synonymImplied.shotTypes,
      ...conceptImplied.shotTypes,
    ]),
    peopleCount: mergeFilterValues(filters.peopleCount, [
      ...analysis.synonymImplied.peopleCount,
      ...conceptImplied.peopleCount,
    ]),
    sessionTypes: mergeFilterValues(filters.sessionTypes, [
      ...analysis.synonymImplied.sessionTypes,
      ...conceptImplied.sessionTypes,
    ]),
    styles: mergeFilterValues(filters.styles, [
      ...analysis.synonymImplied.styles,
      ...conceptImplied.styles,
    ]),
  };
}

export function filtersToSearchParams(
  filters: PoseFilters,
  limit: number,
  offset: number
): URLSearchParams {
  const params = new URLSearchParams();

  const query = filters.query.trim();
  if (query) params.set("q", query);
  if (filters.categories.length) params.set("categories", filters.categories.join(","));
  if (filters.locations.length) params.set("locations", filters.locations.join(","));
  if (filters.shotTypes.length) params.set("shotTypes", filters.shotTypes.join(","));
  if (filters.peopleCount.length) params.set("peopleCount", filters.peopleCount.join(","));
  if (filters.sessionTypes.length) params.set("sessionTypes", filters.sessionTypes.join(","));
  if (filters.styles.length) params.set("styles", filters.styles.join(","));
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  return params;
}
