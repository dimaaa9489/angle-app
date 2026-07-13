import type { LocationTag, PeopleCount, PoseCategory, PoseFilterSelection, SessionType, ShotType, StyleTag } from "@/lib/types";
import type { AppLanguage } from "@/lib/types";
import {
  getFilterGroups,
  getFilterLabel as getFilterLabelI18n,
} from "@/lib/i18n/filter-labels";

export { getFilterGroups } from "@/lib/i18n/filter-labels";

export const FILTER_GROUPS = getFilterGroups("ru");

export function getFilterLabel(id: string, lang: AppLanguage = "ru"): string {
  return getFilterLabelI18n(id, lang);
}

export const EMPTY_FILTERS = {
  query: "",
  locations: [] as LocationTag[],
  peopleCount: [] as PeopleCount[],
  shotTypes: [] as ShotType[],
  sessionTypes: [] as SessionType[],
  styles: [] as StyleTag[],
  categories: [] as PoseCategory[],
};

export const EMPTY_FILTER_SELECTION: PoseFilterSelection = {
  locations: [],
  peopleCount: [],
  shotTypes: [],
  sessionTypes: [],
  styles: [],
  categories: [],
};
