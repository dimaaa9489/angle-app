import type { FilterGroupKey } from "@/lib/i18n/filter-labels";
import {
  dictionaryEntryToConcept,
  resolveDictionaryEntry,
  SEARCH_DICTIONARY,
  type SearchDictionaryEntry,
} from "@/lib/i18n/search-dictionary";
import { normalizeSearchText } from "@/lib/i18n/search-words";

export type SearchConceptDef = {
  id: string;
  filters?: Partial<Record<FilterGroupKey, string[]>>;
  textTerms: string[];
  normalizedTerms: string[];
};

export const SEARCH_CONCEPTS: SearchConceptDef[] = SEARCH_DICTIONARY.map(dictionaryEntryToConcept);

const TERM_TO_CONCEPT = new Map<string, SearchConceptDef>();

for (const concept of SEARCH_CONCEPTS) {
  for (const term of concept.normalizedTerms) {
    if (!TERM_TO_CONCEPT.has(term)) {
      TERM_TO_CONCEPT.set(term, concept);
    }
  }
}

export function resolveSearchConcept(query: string): SearchConceptDef | null {
  const entry = resolveDictionaryEntry(query);
  if (!entry) return null;
  return dictionaryEntryToConcept(entry);
}

export function conceptToImpliedFilters(concept: SearchConceptDef): {
  categories: string[];
  locations: string[];
  peopleCount: string[];
  shotTypes: string[];
  sessionTypes: string[];
  styles: string[];
} {
  return {
    categories: concept.filters?.categories ?? [],
    locations: concept.filters?.locations ?? [],
    peopleCount: concept.filters?.peopleCount ?? [],
    shotTypes: concept.filters?.shotTypes ?? [],
    sessionTypes: concept.filters?.sessionTypes ?? [],
    styles: concept.filters?.styles ?? [],
  };
}

export function getConceptNormalizedTerms(concept: SearchConceptDef): Set<string> {
  return new Set(concept.normalizedTerms.map((term) => normalizeSearchText(term)));
}

export type { SearchDictionaryEntry };
