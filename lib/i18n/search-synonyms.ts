import {
  getAllFilterIds,
  getAllLabelsForFilterId,
  getFilterGroupKeyForId,
  type FilterGroupKey,
} from "@/lib/i18n/filter-labels";
import { normalizeSearchText } from "@/lib/i18n/search-words";

export type SynonymFilterMap = Partial<Record<FilterGroupKey, string[]>>;

/** Informal / extra synonym queries — override auto-generated filter labels. */
const MANUAL_SEARCH_SYNONYM_TO_FILTERS: Record<string, SynonymFilterMap> = {
  girl: { categories: ["women"] },
  girls: { categories: ["women"] },
  woman: { categories: ["women"] },
  women: { categories: ["women"] },
  female: { categories: ["women"] },
  lady: { categories: ["women"] },
  ladies: { categories: ["women"] },
  model: { categories: ["women"] },
  models: { categories: ["women"] },
  девушка: { categories: ["women"] },
  девушки: { categories: ["women"] },
  девочка: { categories: ["women", "kids"] },
  женщина: { categories: ["women"] },
  женщины: { categories: ["women"] },
  женские: { categories: ["women"] },
  дівчина: { categories: ["women"] },
  дівчини: { categories: ["women"] },
  fille: { categories: ["women"] },
  femme: { categories: ["women"] },
  mujer: { categories: ["women"] },
  chica: { categories: ["women"] },
  ragazza: { categories: ["women"] },
  garota: { categories: ["women"] },
  mädchen: { categories: ["women"] },
  kız: { categories: ["women"] },
  meisje: { categories: ["women"] },
  dziewczyna: { categories: ["women"] },
  holka: { categories: ["women"] },
  女孩: { categories: ["women"] },
  女性: { categories: ["women"] },
  女の子: { categories: ["women"] },
  여자: { categories: ["women"] },
  فتاة: { categories: ["women"] },
  लड़की: { categories: ["women"] },
  perempuan: { categories: ["women"] },

  boy: { categories: ["men"] },
  boys: { categories: ["men"] },
  man: { categories: ["men"] },
  men: { categories: ["men"] },
  male: { categories: ["men"] },
  guy: { categories: ["men"] },
  guys: { categories: ["men"] },
  мужчина: { categories: ["men"] },
  мужчины: { categories: ["men"] },
  мужские: { categories: ["men"] },
  парень: { categories: ["men"] },
  парни: { categories: ["men"] },
  чоловік: { categories: ["men"] },
  homme: { categories: ["men"] },
  hombre: { categories: ["men"] },
  uomo: { categories: ["men"] },
  homem: { categories: ["men"] },
  mann: { categories: ["men"] },
  erkek: { categories: ["men"] },
  mężczyzna: { categories: ["men"] },
  muž: { categories: ["men"] },
  男孩: { categories: ["men"] },
  男性: { categories: ["men"] },
  男の子: { categories: ["men"] },
  남자: { categories: ["men"] },
  رجل: { categories: ["men"] },
  लड़का: { categories: ["men"] },
  pria: { categories: ["men"] },

  couple: { categories: ["couples"] },
  couples: { categories: ["couples"] },
  pair: { categories: ["couples"] },
  pairs: { categories: ["couples"] },
  lovers: { categories: ["couples"], sessionTypes: ["love"] },
  love: { categories: ["couples"], sessionTypes: ["love"] },
  парные: { categories: ["couples"] },
  пара: { categories: ["couples"] },
  пары: { categories: ["couples"] },
  влюбленные: { categories: ["couples"], sessionTypes: ["love"] },
  парочка: { categories: ["couples"] },

  kid: { categories: ["kids"], sessionTypes: ["kids"] },
  kids: { categories: ["kids"], sessionTypes: ["kids"] },
  child: { categories: ["kids"], sessionTypes: ["kids"] },
  children: { categories: ["kids"], sessionTypes: ["kids"] },
  baby: { categories: ["kids"], sessionTypes: ["kids", "newborn"] },
  newborn: { sessionTypes: ["newborn"] },
  toddler: { categories: ["kids"], sessionTypes: ["kids"] },
  ребенок: { categories: ["kids"], sessionTypes: ["kids"] },
  ребёнок: { categories: ["kids"], sessionTypes: ["kids"] },
  дети: { categories: ["kids"], sessionTypes: ["kids"] },
  детские: { categories: ["kids"], sessionTypes: ["kids"] },
  детская: { categories: ["kids"], sessionTypes: ["kids"] },
  малыш: { categories: ["kids"], sessionTypes: ["newborn", "kids"] },
  дитина: { categories: ["kids"], sessionTypes: ["kids"] },
  niño: { categories: ["kids"], sessionTypes: ["kids"] },
  enfant: { categories: ["kids"], sessionTypes: ["kids"] },
  kind: { categories: ["kids"], sessionTypes: ["kids"] },
  bambino: { categories: ["kids"], sessionTypes: ["kids"] },
  crianca: { categories: ["kids"], sessionTypes: ["kids"] },
  dziecko: { categories: ["kids"], sessionTypes: ["kids"] },
  dítě: { categories: ["kids"], sessionTypes: ["kids"] },
  cocuk: { categories: ["kids"], sessionTypes: ["kids"] },
  孩子: { categories: ["kids"], sessionTypes: ["kids"] },
  子供: { categories: ["kids"], sessionTypes: ["kids"] },
  아이: { categories: ["kids"], sessionTypes: ["kids"] },
  طفل: { categories: ["kids"], sessionTypes: ["kids"] },
  बच्चा: { categories: ["kids"], sessionTypes: ["kids"] },
  anak: { categories: ["kids"], sessionTypes: ["kids"] },

  family: { categories: ["family"], sessionTypes: ["family"] },
  families: { categories: ["family"], sessionTypes: ["family"] },
  семья: { categories: ["family"], sessionTypes: ["family"] },
  семейные: { categories: ["family"], sessionTypes: ["family"] },
  familia: { categories: ["family"], sessionTypes: ["family"] },
  famille: { categories: ["family"], sessionTypes: ["family"] },

  wedding: { sessionTypes: ["wedding"] },
  bride: { sessionTypes: ["wedding"] },
  groom: { sessionTypes: ["wedding"] },
  свадьба: { sessionTypes: ["wedding"] },
  невеста: { sessionTypes: ["wedding"] },
  жених: { sessionTypes: ["wedding"] },

  group: { categories: ["group"] },
  groups: { categories: ["group"] },
  team: { categories: ["group"] },
  friends: { categories: ["group"] },
  друзья: { categories: ["group"] },
  групповые: { categories: ["group"] },
  группа: { categories: ["group"] },

  maternity: { sessionTypes: ["maternity"] },
  pregnant: { sessionTypes: ["maternity"] },
  беременность: { sessionTypes: ["maternity"] },
  беременная: { sessionTypes: ["maternity"] },

  boudoir: { sessionTypes: ["boudoir"] },
  будуар: { sessionTypes: ["boudoir"] },

  fashion: { sessionTypes: ["fashion"], styles: ["editorial", "commercial"] },
  модная: { sessionTypes: ["fashion"] },
  модный: { sessionTypes: ["fashion"] },

  business: { sessionTypes: ["business"] },
  деловая: { sessionTypes: ["business"] },
  офисная: { sessionTypes: ["business"], locations: ["office"] },

  selfie: { shotTypes: ["close-up", "portrait"] },
  селфи: { shotTypes: ["close-up", "portrait"] },

  home: { locations: ["home"] },
  house: { locations: ["home"] },
  apartment: { locations: ["home"] },
  flat: { locations: ["home"] },
  interior: { locations: ["home"] },
  indoors: { locations: ["home", "studio"] },
  indoor: { locations: ["home", "studio"] },
  dom: { locations: ["home"] },
  дом: { locations: ["home"] },
  дома: { locations: ["home"] },
  домаш: { locations: ["home"] },
  домашняя: { locations: ["home"] },
  домашний: { locations: ["home"] },
  квартира: { locations: ["home"] },
  квартире: { locations: ["home"] },
  интерьер: { locations: ["home", "loft"] },
  интерьере: { locations: ["home", "loft"] },
  кімната: { locations: ["home"] },
  zuhause: { locations: ["home"] },
  interieur: { locations: ["home"] },
  interiér: { locations: ["home"] },
  intérieur: { locations: ["home"] },
  appartement: { locations: ["home"] },
  wohnung: { locations: ["home"] },
  piso: { locations: ["home"] },
  casa: { locations: ["home"] },
  maison: { locations: ["home"] },

  night: { locations: ["night-city"] },
  noc: { locations: ["night-city"] },
  nacht: { locations: ["night-city"] },
  nuit: { locations: ["night-city"] },
  noche: { locations: ["night-city"] },
  notte: { locations: ["night-city"] },
  noite: { locations: ["night-city"] },
  gece: { locations: ["night-city"] },
  ночь: { locations: ["night-city"] },
  ночи: { locations: ["night-city"] },
  ночью: { locations: ["night-city"] },
  ночной: { locations: ["night-city"] },
  ночная: { locations: ["night-city"] },
  ночное: { locations: ["night-city"] },
  ночные: { locations: ["night-city"] },
};

function buildAutoLabelSynonyms(): Record<string, SynonymFilterMap> {
  const result: Record<string, SynonymFilterMap> = {};

  const addToken = (token: string, group: FilterGroupKey, id: string) => {
    const key = token.trim().toLowerCase().replace(/ё/g, "е");
    if (key.length < 3 && key !== "1" && key !== "2" && key !== "3+") return;
    const existing = result[key]?.[group] ?? [];
    if (existing.includes(id)) return;
    result[key] = { ...result[key], [group]: [...existing, id] };
  };

  for (const id of getAllFilterIds()) {
    const group = getFilterGroupKeyForId(id);
    if (!group) continue;

    addToken(normalizeSearchText(id), group, id);
    addToken(normalizeSearchText(id.replace(/-/g, " ")), group, id);

    for (const label of getAllLabelsForFilterId(id)) {
      const norm = normalizeSearchText(label);
      addToken(norm, group, id);
      const words = norm.split(/\s+/).filter(Boolean);
      if (words.length === 1) {
        addToken(words[0]!, group, id);
      }
    }
  }

  return result;
}

export const SEARCH_SYNONYM_TO_FILTERS: Record<string, SynonymFilterMap> = {
  ...buildAutoLabelSynonyms(),
  ...MANUAL_SEARCH_SYNONYM_TO_FILTERS,
};

export function getSynonymFiltersForToken(token: string): SynonymFilterMap | null {
  const key = token.trim().toLowerCase().replace(/ё/g, "е");
  return SEARCH_SYNONYM_TO_FILTERS[key] ?? null;
}
