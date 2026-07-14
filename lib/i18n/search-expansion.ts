import {
  getAllFilterIds,
  getAllLabelsForFilterId,
} from "@/lib/i18n/filter-labels";
import { getSynonymFiltersForToken } from "@/lib/i18n/search-synonyms";
import { expandTextForSearch, normalizeSearchText } from "@/lib/i18n/search-words";

/** normalized label or token → filter ids */
const LABEL_TO_FILTER_IDS = new Map<string, string[]>();

function addLabelMapping(norm: string, filterId: string) {
  if (!norm) return;
  if (norm.length < 3 && norm !== "1" && norm !== "2" && norm !== "3+") return;
  const list = LABEL_TO_FILTER_IDS.get(norm) ?? [];
  if (!list.includes(filterId)) list.push(filterId);
  LABEL_TO_FILTER_IDS.set(norm, list);
}

function buildLabelIndex() {
  for (const id of getAllFilterIds()) {
    for (const label of getAllLabelsForFilterId(id)) {
      const norm = normalizeSearchText(label);
      addLabelMapping(norm, id);
      for (const word of norm.split(/\s+/)) {
        addLabelMapping(word, id);
      }
    }
    addLabelMapping(normalizeSearchText(id), id);
    addLabelMapping(normalizeSearchText(id.replace(/-/g, " ")), id);
  }
}

buildLabelIndex();

function addFilterIdKeywords(parts: Set<string>, filterId: string) {
  parts.add(filterId);
  parts.add(normalizeSearchText(filterId.replace(/-/g, " ")));
  for (const label of getAllLabelsForFilterId(filterId)) {
    parts.add(normalizeSearchText(label));
    for (const word of normalizeSearchText(label).split(/\s+/)) {
      if (word.length > 1) parts.add(word);
    }
  }
}

function matchFilterIdsFromText(text: string): string[] {
  const normalized = normalizeSearchText(text);
  if (!normalized) return [];

  const matched = new Set<string>();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const phrase of [normalized, ...tokens]) {
    const direct = LABEL_TO_FILTER_IDS.get(phrase);
    if (!direct) continue;
    for (const id of direct) matched.add(id);
  }

  return [...matched];
}

function addSynonymKeywords(parts: Set<string>, text: string) {
  const normalized = normalizeSearchText(text);
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (const token of [normalized, ...tokens]) {
    const synonym = getSynonymFiltersForToken(token);
    if (!synonym) continue;
    for (const ids of Object.values(synonym)) {
      for (const id of ids ?? []) addFilterIdKeywords(parts, id);
    }
  }
}

/** Maximal cross-language keyword expansion for titles, queries, and stored keywords. */
export function expandTextToSearchKeywords(text: string): string[] {
  const normalized = normalizeSearchText(text);
  if (!normalized) return [];

  const parts = new Set<string>();

  for (const piece of expandTextForSearch(text)) {
    parts.add(piece);
  }

  for (const word of normalized.split(/\s+/)) {
    if (word.length > 2 || word === "1" || word === "2" || word === "3+") parts.add(word);
  }

  parts.add(normalized);

  for (const filterId of matchFilterIdsFromText(text)) {
    addFilterIdKeywords(parts, filterId);
  }

  addSynonymKeywords(parts, text);

  return [...parts].filter(Boolean);
}

export function expandQueryVariants(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const variants = new Set<string>(expandTextToSearchKeywords(query));
  variants.add(normalized);

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2);
  for (const token of tokens) {
    for (const expanded of expandTextToSearchKeywords(token)) {
      variants.add(expanded);
    }
  }

  return [...variants];
}
