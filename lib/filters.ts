import type {
  LocationTag,
  PeopleCount,
  PoseCategory,
  PoseFilterSelection,
  SessionType,
  ShotType,
  StyleTag,
} from "@/lib/types";

export const FILTER_CATEGORIES: { id: PoseCategory; label: string }[] = [
  { id: "women", label: "Женские" },
  { id: "men", label: "Мужские" },
  { id: "couples", label: "Парные" },
  { id: "family", label: "Семейные" },
  { id: "kids", label: "Детские" },
  { id: "group", label: "Групповые" },
];

export const FILTER_SHOT_TYPES: { id: ShotType; label: string }[] = [
  { id: "portrait", label: "Портрет" },
  { id: "close-up", label: "Крупный план" },
  { id: "profile", label: "Профиль" },
  { id: "half-body", label: "По пояс" },
  { id: "full-body", label: "Полный рост" },
  { id: "sitting", label: "Сидя" },
  { id: "lying", label: "Лёжа" },
];

export const FILTER_LOCATIONS: { id: LocationTag; label: string }[] = [
  { id: "studio", label: "Студия" },
  { id: "loft", label: "Лофт" },
  { id: "home", label: "Дом / интерьер" },
  { id: "street", label: "Улица" },
  { id: "urban", label: "Город" },
  { id: "night-city", label: "Ночной город" },
  { id: "park", label: "Парк" },
  { id: "garden", label: "Сад" },
  { id: "forest", label: "Лес" },
  { id: "nature", label: "Природа" },
  { id: "beach", label: "Пляж" },
  { id: "lake", label: "Озеро / вода" },
  { id: "mountains", label: "Горы" },
  { id: "countryside", label: "Загород" },
  { id: "rooftop", label: "Крыша" },
  { id: "balcony", label: "Балкон" },
  { id: "cafe", label: "Кафе" },
  { id: "restaurant", label: "Ресторан" },
  { id: "bar", label: "Бар" },
  { id: "hotel", label: "Отель" },
  { id: "museum", label: "Музей" },
  { id: "office", label: "Офис" },
  { id: "gym", label: "Зал / спорт" },
  { id: "pool", label: "Бассейн" },
  { id: "subway", label: "Метро" },
];

export const FILTER_PEOPLE: { id: PeopleCount; label: string }[] = [
  { id: "1", label: "1 человек" },
  { id: "2", label: "2 человека" },
  { id: "3+", label: "3 и больше" },
];

export const FILTER_SESSION_TYPES: { id: SessionType; label: string }[] = [
  { id: "portrait", label: "Портрет" },
  { id: "love", label: "Лав-стори" },
  { id: "family", label: "Семейная" },
  { id: "kids", label: "Детская" },
  { id: "story", label: "Сторителлинг" },
  { id: "fashion", label: "Fashion" },
  { id: "wedding", label: "Свадьба" },
  { id: "maternity", label: "Беременность" },
  { id: "newborn", label: "Ньюборн" },
  { id: "boudoir", label: "Будуар" },
  { id: "business", label: "Деловая" },
  { id: "creative", label: "Креатив" },
  { id: "event", label: "Ивент" },
  { id: "graduation", label: "Выпускной" },
];

export const FILTER_STYLES: { id: StyleTag; label: string }[] = [
  { id: "natural-light", label: "Естественный свет" },
  { id: "soft", label: "Мягкий свет" },
  { id: "bright", label: "Светлый" },
  { id: "dark", label: "Тёмный" },
  { id: "high-key", label: "High key" },
  { id: "low-key", label: "Low key" },
  { id: "cinematic", label: "Киношный" },
  { id: "film", label: "Плёночный" },
  { id: "editorial", label: "Editorial" },
  { id: "commercial", label: "Коммерческий" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "candid", label: "Кэндид" },
  { id: "minimal", label: "Минимализм" },
  { id: "elegant", label: "Элегантный" },
  { id: "romantic", label: "Романтичный" },
  { id: "moody", label: "Moody" },
  { id: "dramatic", label: "Драматичный" },
  { id: "dynamic", label: "Динамика" },
  { id: "sporty", label: "Спортивный" },
  { id: "boho", label: "Boho" },
  { id: "vintage", label: "Винтаж" },
  { id: "gritty", label: "Гранж" },
];

export const FILTER_GROUPS = [
  { key: "categories", title: "Категория", items: FILTER_CATEGORIES },
  { key: "shotTypes", title: "Тип кадра", items: FILTER_SHOT_TYPES },
  { key: "locations", title: "Локация", items: FILTER_LOCATIONS },
  { key: "peopleCount", title: "Люди", items: FILTER_PEOPLE },
  { key: "sessionTypes", title: "Тип съёмки", items: FILTER_SESSION_TYPES },
  { key: "styles", title: "Стиль и свет", items: FILTER_STYLES },
] as const;

const LABEL_MAP = new Map<string, string>(
  FILTER_GROUPS.flatMap((group) => group.items.map((item) => [item.id, item.label]))
);

export function getFilterLabel(id: string): string {
  return LABEL_MAP.get(id) ?? id.replace(/-/g, " ");
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
