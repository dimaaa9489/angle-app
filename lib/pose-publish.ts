import { getFilterLabel } from "@/lib/filters";
import type { PoseFilterSelection } from "@/lib/types";

export function selectionToPosePayload(selection: PoseFilterSelection, title: string) {
  const keywords = [
    ...selection.categories,
    ...selection.shotTypes,
    ...selection.locations,
    ...selection.peopleCount,
    ...selection.sessionTypes,
    ...selection.styles,
    ...title.split(/\s+/).filter(Boolean).map((word) => word.toLowerCase()),
  ];

  return {
    title: title.trim(),
    keywords: Array.from(new Set(keywords)),
    category: selection.categories[0] ?? "women",
    shotType: selection.shotTypes[0] ?? "portrait",
    locations: selection.locations,
    peopleCount: selection.peopleCount.length ? selection.peopleCount : (["1"] as const),
    sessionTypes: selection.sessionTypes.length ? selection.sessionTypes : ["portrait"],
    styles: selection.styles,
  };
}

export function selectionTagLabels(selection: PoseFilterSelection): string[] {
  return [
    ...selection.categories,
    ...selection.shotTypes,
    ...selection.locations,
    ...selection.peopleCount,
    ...selection.sessionTypes,
    ...selection.styles,
  ].map(getFilterLabel);
}
