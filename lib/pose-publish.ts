import { getFilterLabel } from "@/lib/filters";
import { buildMultilingualSearchKeywords } from "@/lib/pose-search";
import { expandTextToSearchKeywords } from "@/lib/i18n/search-expansion";
import type { PoseFilterSelection } from "@/lib/types";

export function selectionToPosePayload(selection: PoseFilterSelection, title: string) {
  const trimmedTitle = title.trim();
  const keywords = [
    ...selection.categories,
    ...selection.shotTypes,
    ...selection.locations,
    ...selection.peopleCount,
    ...selection.sessionTypes,
    ...selection.styles,
    ...buildMultilingualSearchKeywords(selection),
    ...expandTextToSearchKeywords(trimmedTitle),
  ];

  return {
    title: trimmedTitle,
    keywords: Array.from(new Set(keywords)),
    category: selection.categories[0] ?? "women",
    shotType: selection.shotTypes[0] ?? "portrait",
    locations: selection.locations,
    peopleCount: selection.peopleCount.length ? selection.peopleCount : (["1"] as const),
    sessionTypes: selection.sessionTypes.length ? selection.sessionTypes : ["portrait"],
    styles: selection.styles,
  };
}

export function selectionTagLabels(
  selection: PoseFilterSelection,
  lang: Parameters<typeof getFilterLabel>[1] = "ru"
): string[] {
  return [
    ...selection.categories,
    ...selection.shotTypes,
    ...selection.locations,
    ...selection.peopleCount,
    ...selection.sessionTypes,
    ...selection.styles,
  ].map((id) => getFilterLabel(id, lang));
}
