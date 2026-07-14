import {
  getAllFilterIds,
  getAllLabelsForFilterId,
} from "@/lib/i18n/filter-labels";
import { getSynonymFiltersForToken } from "@/lib/i18n/search-synonyms";
import { expandTextForSearch, normalizeSearchText } from "@/lib/i18n/search-words";

/** normalized label or token → filter ids */
const LABEL_TO_FILTER_IDS = new Map<string, string[]>();

const SEARCH_STOPWORDS = new Set([
  "in",
  "at",
  "on",
  "the",
  "a",
  "an",
  "or",
  "and",
  "de",
  "la",
  "le",
  "en",
  "im",
  "na",
  "el",
  "al",
  "un",
  "une",
  "du",
  "des",
  "et",
  "es",
  "il",
  "di",
  "da",
  "do",
  "в",
  "у",
  "и",
  "на",
  "по",
  "от",
  "do",
  "da",
]);

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
      const words = norm.split(/\s+/).filter(Boolean);
      if (words.length === 1) {
        addLabelMapping(words[0]!, id);
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
      if (word.length > 2 || word === "1" || word === "2" || word === "3+") {
        parts.add(word);
      }
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

function isUsefulVariant(token: string): boolean {
  if (!token) return false;
  if (SEARCH_STOPWORDS.has(token)) return false;
  if (token.length >= 3) return true;
  return token === "1" || token === "2" || token === "3+";
}

/** Full expansion for publish-time keywords (admin / DeepL reindex). */
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

/** Fast, strict expansion for live search — aliases + synonym filter ids only. */
export function expandQueryVariants(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const variants = new Set<string>([normalized]);

  for (const piece of expandTextForSearch(query)) {
    if (isUsefulVariant(piece)) variants.add(piece);
  }

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2);
  for (const token of tokens) {
    for (const piece of expandTextForSearch(token)) {
      if (isUsefulVariant(piece)) variants.add(piece);
    }
    const synonym = getSynonymFiltersForToken(token);
    if (!synonym) continue;
    for (const ids of Object.values(synonym)) {
      for (const id of ids ?? []) {
        variants.add(id);
        variants.add(normalizeSearchText(id.replace(/-/g, " ")));
      }
    }
  }

  for (const filterId of matchFilterIdsFromText(query)) {
    variants.add(filterId);
    variants.add(normalizeSearchText(filterId.replace(/-/g, " ")));
  }

  return [...variants].filter(isUsefulVariant);
}
