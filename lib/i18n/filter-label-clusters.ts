import { getAllFilterIds, getAllLabelsForFilterId } from "@/lib/i18n/filter-labels";
import { normalizeSearchText } from "@/lib/i18n/search-words";

/** One set per filter id: all 18-language labels + id tokens. */
export function getFilterLabelAliasGroups(): Set<string>[] {
  const groups: Set<string>[] = [];

  for (const id of getAllFilterIds()) {
    const group = new Set<string>([
      normalizeSearchText(id),
      normalizeSearchText(id.replace(/-/g, " ")),
    ]);

    for (const label of getAllLabelsForFilterId(id)) {
      const norm = normalizeSearchText(label);
      if (norm.length >= 2) group.add(norm);
      for (const word of norm.split(/\s+/)) {
        if (word.length >= 2) group.add(word);
      }
    }

    if (group.size > 1) groups.push(group);
  }

  return groups;
}

/** normalized token → all cross-language aliases for the same filter id */
export function buildFilterLabelAliasClusters(): Map<string, Set<string>> {
  const clusters = new Map<string, Set<string>>();

  for (const group of getFilterLabelAliasGroups()) {
    for (const member of group) {
      const existing = clusters.get(member) ?? new Set<string>();
      for (const value of group) existing.add(value);
      clusters.set(member, existing);
    }
  }

  return clusters;
}
