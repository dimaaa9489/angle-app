import { expandTextToSearchKeywords } from "@/lib/i18n/search-expansion";
import { translateTextToAllLanguages } from "@/lib/i18n/machine-translate";
import { normalizeSearchText } from "@/lib/i18n/search-words";
import { selectionToPosePayload } from "@/lib/pose-publish";
import type { PoseFilterSelection } from "@/lib/types";

function addKeywordParts(target: Set<string>, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  target.add(trimmed);
  target.add(normalizeSearchText(trimmed));
  for (const expanded of expandTextToSearchKeywords(trimmed)) {
    target.add(expanded);
  }
}

/** Builds the fullest possible keyword set for multilingual search. */
export async function buildFullPoseKeywords(
  selection: PoseFilterSelection,
  title: string
): Promise<string[]> {
  const payload = selectionToPosePayload(selection, title);
  const keywords = new Set<string>();

  for (const keyword of payload.keywords) {
    addKeywordParts(keywords, keyword);
  }

  addKeywordParts(keywords, title);

  const translations = await translateTextToAllLanguages(title);
  for (const translated of Object.values(translations)) {
    addKeywordParts(keywords, translated);
  }

  return [...keywords].filter(Boolean);
}
