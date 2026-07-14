/** Cross-language word aliases for title and query search expansion. */
export const SEARCH_WORD_ALIASES: Record<string, string[]> = {
  в: ["in", "at", "im", "en", "à", "en el", "nel", "na", "в", "у"],
  in: ["в", "у", "en", "im", "à"],
  city: ["город", "городе", "місто", "stadt", "ville", "ciudad", "città", "cidade", "şehir", "urban"],
  город: ["city", "urban", "town", "ville", "stadt", "ciudad", "città", "misto", "місто"],
  городе: ["city", "in city", "urban", "town", "в городе"],
  urban: ["город", "city", "town", "улица", "street"],
  studio: ["студия", "студії", "estudio", "estúdio", "studio", "スタジオ", "스튜디오"],
  студия: ["studio", "estudio", "stüdyo"],
  street: ["улица", "ulica", "straße", "rue", "calle", "strada", "rua", "sokak"],
  улица: ["street", "urban", "city"],
  beach: ["пляж", "plaza", "plage", "playa", "spiaggia", "praia", "plaj"],
  пляж: ["beach", "plage", "playa"],
  park: ["парк", "parque", "parc", "giardino", "garden"],
  парк: ["park", "parc", "parque"],
  portrait: ["портрет", "portret", "porträt", "retrato", "ritratto", "porträt"],
  портрет: ["portrait", "portret"],
  wedding: ["свадьба", "весілля", "hochzeit", "mariage", "boda", "matrimonio", "casamento"],
  свадьба: ["wedding", "mariage", "boda"],
  love: ["лав", "любовь", "love story", "lav", "amor", "amour", "liebe"],
  family: ["семья", "сім'я", "familie", "famille", "familia", "famiglia", "família"],
  семейные: ["family", "famille", "familia"],
  семья: ["family", "famille"],
  girl: ["women", "female", "lady", "девушка", "женщина", "fille", "chica", "mujer"],
  girls: ["women", "female", "девушки", "женщины"],
  woman: ["women", "female", "girl", "lady", "женщина", "девушка", "femme", "mujer"],
  women: ["женские", "female", "girl", "ladies", "femmes"],
  female: ["women", "girl", "woman", "женские"],
  men: ["мужские", "male", "man", "guys", "hommes", "hombres"],
  man: ["men", "male", "boy", "мужчина", "парень", "homme"],
  boy: ["men", "male", "man", "парень"],
  kids: ["детские", "дитячі", "kinder", "enfants", "niños", "bambini"],
  night: ["ночь", "ночной", "nuit", "noche", "notte", "noite", "gece"],
  ночной: ["night", "nuit", "noche"],
  soft: ["мягкий", "м'який", "weich", "doux", "suave", "morbido"],
  cinematic: ["киношный", "filmisch", "cinématique", "cinematográfico"],
  natural: ["естественный", "natural", "natürlich", "naturel", "natural"],
  home: ["дом", "дома", "квартира", "интерьер", "interior", "apartment", "flat", "house", "zuhause", "intérieur"],
  дом: ["home", "interior", "house", "apartment", "flat", "квартира", "интерьер"],
  дома: ["home", "interior", "house", "apartment", "квартира"],
  квартира: ["apartment", "flat", "home", "house", "interior", "дом", "интерьер", "appartement", "wohnung", "piso"],
  apartment: ["квартира", "flat", "home", "interior", "дом", "appartement", "wohnung"],
  flat: ["квартира", "apartment", "home", "interior", "дом"],
  house: ["дом", "home", "interior", "квартира"],
  interior: ["интерьер", "дом", "home", "квартира", "interior", "intérieur"],
  интерьер: ["interior", "home", "дом", "квартира", "apartment"],
  car: ["машина", "автомобиль", "auto", "vehicle", "automobile", "авто", "coche", "voiture", "macchina", "araba"],
  cars: ["машина", "автомобиль", "car", "auto", "vehicle", "авто"],
  auto: ["car", "машина", "автомобиль", "vehicle", "automobile", "авто"],
  vehicle: ["car", "машина", "автомобиль", "auto", "automobile", "авто"],
  automobile: ["car", "машина", "автомобиль", "auto", "vehicle", "авто"],
  машина: ["car", "auto", "vehicle", "automobile", "cars", "автомобиль", "авто"],
  автомобиль: ["car", "auto", "vehicle", "automobile", "машина", "авто", "cars"],
  авто: ["car", "auto", "машина", "автомобиль", "vehicle"],
  forest: ["лес", "forêt", "bosque", "foresta", "floresta", "wald"],
  лес: ["forest", "woods", "wald"],
  mountains: ["горы", "montagnes", "montañas", "montagne", "berge"],
  горы: ["mountains", "montagnes", "berge"],
  ville: ["city", "город", "urban", "ciudad", "città"],
  femme: ["woman", "women", "girl", "женщина", "девушка"],
  femmes: ["women", "female", "женские"],
  couple: ["couples", "парные", "пара", "amour"],
  amour: ["love", "лав", "любовь", "couples"],
  plage: ["beach", "пляж", "playa"],
  foret: ["forest", "лес", "forêt"],
  forêt: ["forest", "лес", "wald"],
  doux: ["soft", "мягкий", "suave"],
  mariage: ["wedding", "свадьба", "boda"],
};

import { getFilterLabelAliasGroups } from "@/lib/i18n/filter-label-clusters";

export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ё/g, "е")
    .replace(/[''`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAliasClusters(): Map<string, Set<string>> {
  const clusters = new Map<string, Set<string>>();

  const mergeGroup = (group: Set<string>) => {
    for (const member of group) {
      if (!member || member.length < 2) continue;
      const existing = clusters.get(member) ?? new Set<string>();
      for (const value of group) {
        if (value.length >= 2) existing.add(value);
      }
      clusters.set(member, existing);
    }
  };

  for (const [key, aliases] of Object.entries(SEARCH_WORD_ALIASES)) {
    mergeGroup(
      new Set<string>([
        normalizeSearchText(key),
        ...aliases.map((alias) => normalizeSearchText(alias)),
      ])
    );
  }

  for (const group of getFilterLabelAliasGroups()) {
    mergeGroup(group);
  }

  return clusters;
}

const ALIAS_CLUSTERS = buildAliasClusters();

export function expandTextForSearch(text: string): string[] {
  const normalized = normalizeSearchText(text);
  if (!normalized) return [];

  const parts = new Set<string>([normalized, text.toLowerCase().trim()]);
  const words = normalized.split(/\s+/).filter(Boolean);

  for (const word of words) {
    parts.add(word);
    const aliases = SEARCH_WORD_ALIASES[word];
    if (aliases) {
      for (const alias of aliases) {
        parts.add(normalizeSearchText(alias));
      }
    }
    const cluster = ALIAS_CLUSTERS.get(word);
    if (cluster) {
      for (const member of cluster) parts.add(member);
    }
  }

  if (words.length > 1) {
    const translated = words.map(
      (word) => SEARCH_WORD_ALIASES[word]?.[0] ?? word
    );
    parts.add(translated.join(" "));
    for (const word of translated) {
      const cluster = ALIAS_CLUSTERS.get(word);
      if (cluster) {
        for (const member of cluster) parts.add(member);
      }
    }
  }

  return [...parts];
}
