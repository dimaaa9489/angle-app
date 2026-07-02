import type {
  LocationTag,
  PeopleCount,
  PoseCategory,
  ShotType,
  SessionType,
  StyleTag,
} from "@/lib/types";

export const FILTER_LOCATIONS: { id: LocationTag; label: string }[] = [
  { id: "street", label: "Улица" },
  { id: "studio", label: "Студия" },
  { id: "bar", label: "Бар" },
  { id: "cafe", label: "Кафе" },
  { id: "restaurant", label: "Ресторан" },
  { id: "park", label: "Парк" },
  { id: "beach", label: "Пляж" },
  { id: "home", label: "Дом" },
  { id: "office", label: "Офис" },
  { id: "nature", label: "Природа" },
];

export const FILTER_PEOPLE: { id: PeopleCount; label: string }[] = [
  { id: "1", label: "1 человек" },
  { id: "2", label: "2 человека" },
  { id: "3+", label: "3 и больше" },
];

export const FILTER_SHOT_TYPES: { id: ShotType; label: string }[] = [
  { id: "portrait", label: "Портрет" },
  { id: "full-body", label: "Полный рост" },
  { id: "half-body", label: "По пояс" },
  { id: "sitting", label: "Сидя" },
  { id: "lying", label: "Лёжа" },
];

export const FILTER_SESSION_TYPES: { id: SessionType; label: string }[] = [
  { id: "portrait", label: "Портрет" },
  { id: "love", label: "Лав-стори" },
  { id: "family", label: "Семейная" },
  { id: "story", label: "Сторителлинг" },
  { id: "fashion", label: "Fashion" },
  { id: "wedding", label: "Свадьба" },
  { id: "maternity", label: "Беременность" },
  { id: "business", label: "Деловая" },
  { id: "creative", label: "Креатив" },
];

export const FILTER_STYLES: { id: StyleTag; label: string }[] = [
  { id: "candid", label: "Кэндид" },
  { id: "editorial", label: "Editorial" },
  { id: "minimal", label: "Минимализм" },
  { id: "cinematic", label: "Киношный" },
  { id: "vintage", label: "Винтаж" },
  { id: "dramatic", label: "Драматичный" },
  { id: "soft", label: "Мягкий свет" },
  { id: "dynamic", label: "Динамика" },
];

export const FILTER_CATEGORIES: { id: PoseCategory; label: string }[] = [
  { id: "women", label: "Женские" },
  { id: "men", label: "Мужские" },
  { id: "couples", label: "Парные" },
  { id: "family", label: "Семейные" },
];

export const EMPTY_FILTERS = {
  query: "",
  locations: [] as LocationTag[],
  peopleCount: [] as PeopleCount[],
  shotTypes: [] as ShotType[],
  sessionTypes: [] as SessionType[],
  styles: [] as StyleTag[],
  categories: [] as PoseCategory[],
};
