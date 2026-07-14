import { expandQueryVariants } from "@/lib/i18n/search-expansion";
import { getTranslateProvider, translateToPivotLanguages } from "@/lib/i18n/machine-translate";
import { normalizeSearchText } from "@/lib/i18n/search-words";

type CacheEntry = { variants: string[]; at: number };

const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_CACHE = 512;

const expandCache = new Map<string, CacheEntry>();

function addVariants(target: Set<string>, text: string) {
  const normalized = normalizeSearchText(text);
  if (!normalized) return;
  target.add(normalized);
  for (const variant of expandQueryVariants(text)) {
    target.add(variant);
  }
}

/** Static + machine-translated query expansion (server-side, cached). */
export async function expandSearchQuery(query: string): Promise<string[]> {
  const trimmed = query.trim();
  const normalized = normalizeSearchText(trimmed);
  if (!normalized) return [];

  const cached = expandCache.get(normalized);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.variants;
  }

  const variants = new Set<string>();
  addVariants(variants, trimmed);

  if (trimmed.length >= 2 && getTranslateProvider() !== "none") {
    const translations = await translateToPivotLanguages(trimmed);
    for (const translated of translations) {
      addVariants(variants, translated);
    }
  }

  const result = [...variants].filter(Boolean);
  if (expandCache.size >= MAX_CACHE) expandCache.clear();
  expandCache.set(normalized, { variants: result, at: Date.now() });
  return result;
}

export function clearSearchQueryExpandCache() {
  expandCache.clear();
}
