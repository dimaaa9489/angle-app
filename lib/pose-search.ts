import {
  getAllFilterIds,
  getAllLabelsForFilterId,
  getFilterGroupKeyForId,
} from "@/lib/i18n/filter-labels";
import { expandQueryVariants } from "@/lib/i18n/search-expansion";
import { getSynonymFiltersForToken } from "@/lib/i18n/search-synonyms";
import { normalizeSearchText } from "@/lib/i18n/search-words";
import type { Pose, PoseFilterSelection } from "@/lib/types";

function poseTagIds(pose: Pose): string[] {
  return [
    pose.category,
    pose.shotType,
    ...pose.locations,
    ...pose.peopleCount,
    ...pose.sessionTypes,
    ...pose.styles,
  ];
}

const haystackByPoseId = new Map<string, string>();

/** Pre-built index string; keywords are already enriched at publish time. */
export function getPoseSearchHaystack(pose: Pose): string {
  const cached = haystackByPoseId.get(pose.id);
  if (cached) return cached;

  const parts: string[] = [pose.title, ...pose.keywords];
  for (const id of poseTagIds(pose)) {
    parts.push(id, id.replace(/-/g, " "), ...getAllLabelsForFilterId(id));
  }

  const haystack = normalizeSearchText(parts.join(" "));
  haystackByPoseId.set(pose.id, haystack);
  return haystack;
}

export function primePoseSearchHaystacks(poses: Pose[]) {
  for (const pose of poses) getPoseSearchHaystack(pose);
}

export function clearPoseSearchHaystackCache() {
  haystackByPoseId.clear();
}

/** @deprecated Use getPoseSearchHaystack — kept for callers that still import the old name. */
export function buildPoseSearchHaystack(pose: Pose): string {
  return getPoseSearchHaystack(pose);
}

type ImpliedFilters = {
  categories: string[];
  locations: string[];
  peopleCount: string[];
  shotTypes: string[];
  sessionTypes: string[];
  styles: string[];
};

const EMPTY_IMPLIED: ImpliedFilters = {
  categories: [],
  locations: [],
  peopleCount: [],
  shotTypes: [],
  sessionTypes: [],
  styles: [],
};

function emptyImplied(): ImpliedFilters {
  return {
    categories: [],
    locations: [],
    peopleCount: [],
    shotTypes: [],
    sessionTypes: [],
    styles: [],
  };
}

function addImplied(implied: ImpliedFilters, group: keyof ImpliedFilters, id: string) {
  if (!implied[group].includes(id)) implied[group].push(id);
}

function mergeImplied(target: ImpliedFilters, source: ImpliedFilters) {
  for (const key of Object.keys(target) as (keyof ImpliedFilters)[]) {
    for (const id of source[key]) addImplied(target, key, id);
  }
}

function impliedFromSynonyms(query: string): ImpliedFilters {
  const implied = emptyImplied();
  const normalized = normalizeSearchText(query);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const token of [normalized, ...tokens]) {
    const synonym = getSynonymFiltersForToken(token);
    if (!synonym) continue;
    for (const [group, ids] of Object.entries(synonym) as [keyof ImpliedFilters, string[]][]) {
      for (const id of ids ?? []) addImplied(implied, group, id);
    }
  }

  return implied;
}

export function getImpliedFiltersFromQuery(query: string): ImpliedFilters {
  const normalized = normalizeSearchText(query);
  const implied = emptyImplied();
  if (!normalized) return implied;

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 1);
  const phrases = [normalized, ...tokens];

  for (const id of getAllFilterIds()) {
    const labels = getAllLabelsForFilterId(id).map(normalizeSearchText);
    const group = getFilterGroupKeyForId(id);
    if (!group) continue;

    const idNorm = normalizeSearchText(id);
    const idSpaced = normalizeSearchText(id.replace(/-/g, " "));

    for (const phrase of phrases) {
      const matches =
        phrase === idNorm ||
        phrase === idSpaced ||
        labels.some(
          (label) =>
            label === phrase ||
            label.includes(phrase) ||
            phrase.includes(label)
        );

      if (matches) addImplied(implied, group, id);
    }
  }

  mergeImplied(implied, impliedFromSynonyms(normalized));

  return implied;
}

type QueryAnalysis = {
  normalized: string;
  variants: string[];
  implied: ImpliedFilters;
  synonymImplied: ImpliedFilters;
  tokenImplied: ImpliedFilters[];
};

const EMPTY_ANALYSIS: QueryAnalysis = {
  normalized: "",
  variants: [],
  implied: EMPTY_IMPLIED,
  synonymImplied: EMPTY_IMPLIED,
  tokenImplied: [],
};

const queryAnalysisCache = new Map<string, QueryAnalysis>();

export function analyzeSearchQuery(query: string): QueryAnalysis {
  const normalized = normalizeSearchText(query);
  if (!normalized) return EMPTY_ANALYSIS;

  const cached = queryAnalysisCache.get(normalized);
  if (cached) return cached;

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 1);
  const analysis: QueryAnalysis = {
    normalized,
    variants: expandQueryVariants(normalized),
    implied: getImpliedFiltersFromQuery(normalized),
    synonymImplied: impliedFromSynonyms(normalized),
    tokenImplied:
      tokens.length > 1 ? tokens.map((token) => getImpliedFiltersFromQuery(token)) : [],
  };

  if (queryAnalysisCache.size > 128) queryAnalysisCache.clear();
  queryAnalysisCache.set(normalized, analysis);
  return analysis;
}

function poseMatchesImpliedFilters(pose: Pose, implied: ImpliedFilters): boolean {
  const hasAny =
    implied.categories.length > 0 ||
    implied.locations.length > 0 ||
    implied.peopleCount.length > 0 ||
    implied.shotTypes.length > 0 ||
    implied.sessionTypes.length > 0 ||
    implied.styles.length > 0;

  if (!hasAny) return false;

  if (implied.categories.length && !implied.categories.includes(pose.category)) {
    return false;
  }
  if (
    implied.locations.length &&
    !implied.locations.some((location) => pose.locations.includes(location as Pose["locations"][number]))
  ) {
    return false;
  }
  if (
    implied.peopleCount.length &&
    !implied.peopleCount.some((count) => pose.peopleCount.includes(count as Pose["peopleCount"][number]))
  ) {
    return false;
  }
  if (implied.shotTypes.length && !implied.shotTypes.includes(pose.shotType)) {
    return false;
  }
  if (
    implied.sessionTypes.length &&
    !implied.sessionTypes.some((type) => pose.sessionTypes.includes(type as Pose["sessionTypes"][number]))
  ) {
    return false;
  }
  if (
    implied.styles.length &&
    !implied.styles.some((style) => pose.styles.includes(style as Pose["styles"][number]))
  ) {
    return false;
  }

  return true;
}

function haystackMatchesAnalysis(haystack: string, analysis: QueryAnalysis): boolean {
  if (haystack.includes(analysis.normalized)) return true;

  for (const variant of analysis.variants) {
    if (variant !== analysis.normalized && haystack.includes(variant)) return true;
  }

  const tokens = analysis.normalized.split(/\s+/).filter((token) => token.length > 1);
  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) {
    return true;
  }

  return false;
}

export function matchesTextQuery(pose: Pose, query: string): boolean {
  const analysis = analyzeSearchQuery(query);
  if (!analysis.normalized) return true;

  const haystack = getPoseSearchHaystack(pose);

  if (haystackMatchesAnalysis(haystack, analysis)) return true;

  if (poseMatchesImpliedFilters(pose, analysis.implied)) return true;
  if (poseMatchesImpliedFilters(pose, analysis.synonymImplied)) return true;

  if (analysis.tokenImplied.length > 1) {
    const merged = emptyImplied();
    for (const part of analysis.tokenImplied) {
      mergeImplied(merged, part);
    }
    if (poseMatchesImpliedFilters(pose, merged)) return true;
  }

  return false;
}

export function buildMultilingualSearchKeywords(selection: PoseFilterSelection): string[] {
  const ids = [
    ...selection.categories,
    ...selection.shotTypes,
    ...selection.locations,
    ...selection.peopleCount,
    ...selection.sessionTypes,
    ...selection.styles,
  ];

  return ids.flatMap((id) => getAllLabelsForFilterId(id).map(normalizeSearchText));
}
