import type { AppLanguage } from "@/lib/types";
import { APP_LANGUAGES } from "@/lib/i18n/languages";

export type FilterGroupKey =
  | "categories"
  | "shotTypes"
  | "locations"
  | "peopleCount"
  | "sessionTypes"
  | "styles";

const FILTER_GROUP_KEYS: FilterGroupKey[] = [
  "categories",
  "shotTypes",
  "locations",
  "peopleCount",
  "sessionTypes",
  "styles",
];

const FILTER_IDS_BY_GROUP: Record<FilterGroupKey, readonly string[]> = {
  categories: ["women", "men", "couples", "family", "kids", "group"],
  shotTypes: ["portrait", "close-up", "profile", "half-body", "full-body", "sitting", "lying"],
  locations: [
    "studio", "loft", "home", "street", "urban", "night-city", "park", "garden", "forest",
    "nature", "beach", "lake", "mountains", "countryside", "rooftop", "balcony", "cafe",
    "restaurant", "bar", "hotel", "museum", "office", "gym", "pool", "subway",
  ],
  peopleCount: ["1", "2", "3+"],
  sessionTypes: [
    "portrait", "love", "family", "kids", "story", "fashion", "wedding", "maternity",
    "newborn", "boudoir", "business", "creative", "event", "graduation",
  ],
  styles: [
    "natural-light", "soft", "bright", "dark", "high-key", "low-key", "cinematic", "film",
    "editorial", "commercial", "lifestyle", "candid", "minimal", "elegant", "romantic",
    "moody", "dramatic", "dynamic", "sporty", "boho", "vintage", "gritty",
  ],
};

/** Per-language filter labels. English is the canonical fallback. */
const LABELS: Record<AppLanguage, Record<string, string>> = {
  en: {
    women: "Women", men: "Men", couples: "Couples", family: "Family", kids: "Kids", group: "Group",
    portrait: "Portrait", "close-up": "Close-up", profile: "Profile", "half-body": "Half body",
    "full-body": "Full body", sitting: "Sitting", lying: "Lying",
    studio: "Studio", loft: "Loft", home: "Home interior", street: "Street", urban: "City",
    "night-city": "Night city", park: "Park", garden: "Garden", forest: "Forest", nature: "Nature",
    beach: "Beach", lake: "Lake", mountains: "Mountains", countryside: "Countryside",
    rooftop: "Rooftop", balcony: "Balcony", cafe: "Cafe", restaurant: "Restaurant", bar: "Bar",
    hotel: "Hotel", museum: "Museum", office: "Office", gym: "Gym", pool: "Pool", subway: "Subway",
    "1": "1 person", "2": "2 people", "3+": "3 or more",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Wedding",
    maternity: "Maternity", newborn: "Newborn", boudoir: "Boudoir", business: "Business",
    creative: "Creative", event: "Event", graduation: "Graduation",
    "natural-light": "Natural light", soft: "Soft light", bright: "Bright", dark: "Dark",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinematic", film: "Film",
    editorial: "Editorial", commercial: "Commercial", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegant", romantic: "Romantic", moody: "Moody",
    dramatic: "Dramatic", dynamic: "Dynamic", sporty: "Sporty", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  ru: {
    women: "Женские", men: "Мужские", couples: "Парные", family: "Семейные", kids: "Детские", group: "Групповые",
    portrait: "Портрет", "close-up": "Крупный план", profile: "Профиль", "half-body": "По пояс",
    "full-body": "Полный рост", sitting: "Сидя", lying: "Лёжа",
    studio: "Студия", loft: "Лофт", home: "Дом интерьер", street: "Улица", urban: "Город",
    "night-city": "Ночной город", park: "Парк", garden: "Сад", forest: "Лес", nature: "Природа",
    beach: "Пляж", lake: "Озеро", mountains: "Горы", countryside: "Загород",
    rooftop: "Крыша", balcony: "Балкон", cafe: "Кафе", restaurant: "Ресторан", bar: "Бар",
    hotel: "Отель", museum: "Музей", office: "Офис", gym: "Зал", pool: "Бассейн", subway: "Метро",
    "1": "1 человек", "2": "2 человека", "3+": "3 и больше",
    love: "Лав-стори", story: "Сторителлинг", fashion: "Fashion", wedding: "Свадьба",
    maternity: "Беременность", newborn: "Ньюборн", boudoir: "Будуар", business: "Деловая",
    creative: "Креатив", event: "Ивент", graduation: "Выпускной",
    "natural-light": "Естественный свет", soft: "Мягкий свет", bright: "Светлый", dark: "Тёмный",
    "high-key": "High key", "low-key": "Low key", cinematic: "Киношный", film: "Плёночный",
    editorial: "Editorial", commercial: "Коммерческий", lifestyle: "Lifestyle", candid: "Кэндид",
    minimal: "Минимализм", elegant: "Элегантный", romantic: "Романтичный", moody: "Moody",
    dramatic: "Драматичный", dynamic: "Динамика", sporty: "Спортивный", boho: "Boho",
    vintage: "Винтаж", gritty: "Гранж",
  },
  uk: {
    women: "Жіночі", men: "Чоловічі", couples: "Парні", family: "Сімейні", kids: "Дитячі", group: "Групові",
    portrait: "Портрет", "close-up": "Крупний план", profile: "Профіль", "half-body": "По пояс",
    "full-body": "Повний зріст", sitting: "Сидячи", lying: "Лежачи",
    studio: "Студія", loft: "Лофт", home: "Дім інтер'єр", street: "Вулиця", urban: "Місто",
    "night-city": "Нічне місто", park: "Парк", garden: "Сад", forest: "Ліс", nature: "Природа",
    beach: "Пляж", lake: "Озеро", mountains: "Гори", countryside: "Заміський",
    rooftop: "Дах", balcony: "Балкон", cafe: "Кафе", restaurant: "Ресторан", bar: "Бар",
    hotel: "Готель", museum: "Музей", office: "Офіс", gym: "Зал", pool: "Басейн", subway: "Метро",
    "1": "1 людина", "2": "2 людини", "3+": "3 і більше",
    love: "Лав-сторі", story: "Сторітелінг", fashion: "Fashion", wedding: "Весілля",
    maternity: "Вагітність", newborn: "Ньюборн", boudoir: "Будуар", business: "Ділова",
    creative: "Креатив", event: "Івент", graduation: "Випускний",
    "natural-light": "Природне світло", soft: "М'яке світло", bright: "Світлий", dark: "Темний",
    "high-key": "High key", "low-key": "Low key", cinematic: "Кінематографічний", film: "Плівковий",
    editorial: "Editorial", commercial: "Комерційний", lifestyle: "Lifestyle", candid: "Кендід",
    minimal: "Мінімалізм", elegant: "Елегантний", romantic: "Романтичний", moody: "Moody",
    dramatic: "Драматичний", dynamic: "Динаміка", sporty: "Спортивний", boho: "Boho",
    vintage: "Вінтаж", gritty: "Гранж",
  },
  de: {
    women: "Frauen", men: "Männer", couples: "Paare", family: "Familie", kids: "Kinder", group: "Gruppe",
    portrait: "Porträt", "close-up": "Nahaufnahme", profile: "Profil", "half-body": "Halbfigur",
    "full-body": "Ganzkörper", sitting: "Sitzend", lying: "Liegend",
    studio: "Studio", loft: "Loft", home: "Zuhause", street: "Straße", urban: "Stadt",
    "night-city": "Nachtstadt", park: "Park", garden: "Garten", forest: "Wald", nature: "Natur",
    beach: "Strand", lake: "See", mountains: "Berge", countryside: "Land",
    rooftop: "Dach", balcony: "Balkon", cafe: "Café", restaurant: "Restaurant", bar: "Bar",
    hotel: "Hotel", museum: "Museum", office: "Büro", gym: "Fitnessstudio", pool: "Pool", subway: "U-Bahn",
    "1": "1 Person", "2": "2 Personen", "3+": "3 oder mehr",
    love: "Love Story", story: "Storytelling", fashion: "Fashion", wedding: "Hochzeit",
    maternity: "Schwangerschaft", newborn: "Neugeborenes", boudoir: "Boudoir", business: "Business",
    creative: "Kreativ", event: "Event", graduation: "Abschluss",
    "natural-light": "Natürliches Licht", soft: "Weiches Licht", bright: "Hell", dark: "Dunkel",
    "high-key": "High key", "low-key": "Low key", cinematic: "Filmisch", film: "Analog",
    editorial: "Editorial", commercial: "Kommerziell", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegant", romantic: "Romantisch", moody: "Moody",
    dramatic: "Dramatisch", dynamic: "Dynamisch", sporty: "Sportlich", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  fr: {
    women: "Femmes", men: "Hommes", couples: "Couples", family: "Famille", kids: "Enfants", group: "Groupe",
    portrait: "Portrait", "close-up": "Gros plan", profile: "Profil", "half-body": "Mi-corps",
    "full-body": "Plein pied", sitting: "Assis", lying: "Allongé",
    studio: "Studio", loft: "Loft", home: "Intérieur", street: "Rue", urban: "Ville",
    "night-city": "Ville de nuit", park: "Parc", garden: "Jardin", forest: "Forêt", nature: "Nature",
    beach: "Plage", lake: "Lac", mountains: "Montagnes", countryside: "Campagne",
    rooftop: "Toit", balcony: "Balcon", cafe: "Café", restaurant: "Restaurant", bar: "Bar",
    hotel: "Hôtel", museum: "Musée", office: "Bureau", gym: "Salle de sport", pool: "Piscine", subway: "Métro",
    "1": "1 personne", "2": "2 personnes", "3+": "3 ou plus",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Mariage",
    maternity: "Grossesse", newborn: "Nouveau-né", boudoir: "Boudoir", business: "Business",
    creative: "Créatif", event: "Événement", graduation: "Remise de diplôme",
    "natural-light": "Lumière naturelle", soft: "Lumière douce", bright: "Clair", dark: "Sombre",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinématique", film: "Film",
    editorial: "Editorial", commercial: "Commercial", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Élégant", romantic: "Romantique", moody: "Moody",
    dramatic: "Dramatique", dynamic: "Dynamique", sporty: "Sportif", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  es: {
    women: "Mujeres", men: "Hombres", couples: "Parejas", family: "Familia", kids: "Niños", group: "Grupo",
    portrait: "Retrato", "close-up": "Primer plano", profile: "Perfil", "half-body": "Medio cuerpo",
    "full-body": "Cuerpo entero", sitting: "Sentado", lying: "Acostado",
    studio: "Estudio", loft: "Loft", home: "Interior", street: "Calle", urban: "Ciudad",
    "night-city": "Ciudad nocturna", park: "Parque", garden: "Jardín", forest: "Bosque", nature: "Naturaleza",
    beach: "Playa", lake: "Lago", mountains: "Montañas", countryside: "Campo",
    rooftop: "Azotea", balcony: "Balcón", cafe: "Café", restaurant: "Restaurante", bar: "Bar",
    hotel: "Hotel", museum: "Museo", office: "Oficina", gym: "Gimnasio", pool: "Piscina", subway: "Metro",
    "1": "1 persona", "2": "2 personas", "3+": "3 o más",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Boda",
    maternity: "Embarazo", newborn: "Recién nacido", boudoir: "Boudoir", business: "Negocios",
    creative: "Creativo", event: "Evento", graduation: "Graduación",
    "natural-light": "Luz natural", soft: "Luz suave", bright: "Claro", dark: "Oscuro",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinematográfico", film: "Película",
    editorial: "Editorial", commercial: "Comercial", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegante", romantic: "Romántico", moody: "Moody",
    dramatic: "Dramático", dynamic: "Dinámico", sporty: "Deportivo", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  it: {
    women: "Donne", men: "Uomini", couples: "Coppie", family: "Famiglia", kids: "Bambini", group: "Gruppo",
    portrait: "Ritratto", "close-up": "Primo piano", profile: "Profilo", "half-body": "Mezzo busto",
    "full-body": "Figura intera", sitting: "Seduto", lying: "Sdraiato",
    studio: "Studio", loft: "Loft", home: "Interni", street: "Strada", urban: "Città",
    "night-city": "Città notturna", park: "Parco", garden: "Giardino", forest: "Foresta", nature: "Natura",
    beach: "Spiaggia", lake: "Lago", mountains: "Montagne", countryside: "Campagna",
    rooftop: "Tetto", balcony: "Balcone", cafe: "Caffè", restaurant: "Ristorante", bar: "Bar",
    hotel: "Hotel", museum: "Museo", office: "Ufficio", gym: "Palestra", pool: "Piscina", subway: "Metropolitana",
    "1": "1 persona", "2": "2 persone", "3+": "3 o più",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Matrimonio",
    maternity: "Gravidanza", newborn: "Neonato", boudoir: "Boudoir", business: "Business",
    creative: "Creativo", event: "Evento", graduation: "Laurea",
    "natural-light": "Luce naturale", soft: "Luce morbida", bright: "Chiaro", dark: "Scuro",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinematografico", film: "Pellicola",
    editorial: "Editorial", commercial: "Commerciale", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegante", romantic: "Romantico", moody: "Moody",
    dramatic: "Drammatico", dynamic: "Dinamico", sporty: "Sportivo", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  pt: {
    women: "Mulheres", men: "Homens", couples: "Casais", family: "Família", kids: "Crianças", group: "Grupo",
    portrait: "Retrato", "close-up": "Close-up", profile: "Perfil", "half-body": "Meio corpo",
    "full-body": "Corpo inteiro", sitting: "Sentado", lying: "Deitado",
    studio: "Estúdio", loft: "Loft", home: "Interior", street: "Rua", urban: "Cidade",
    "night-city": "Cidade noturna", park: "Parque", garden: "Jardim", forest: "Floresta", nature: "Natureza",
    beach: "Praia", lake: "Lago", mountains: "Montanhas", countryside: "Campo",
    rooftop: "Telhado", balcony: "Varanda", cafe: "Café", restaurant: "Restaurante", bar: "Bar",
    hotel: "Hotel", museum: "Museu", office: "Escritório", gym: "Academia", pool: "Piscina", subway: "Metrô",
    "1": "1 pessoa", "2": "2 pessoas", "3+": "3 ou mais",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Casamento",
    maternity: "Gravidez", newborn: "Recém-nascido", boudoir: "Boudoir", business: "Negócios",
    creative: "Criativo", event: "Evento", graduation: "Formatura",
    "natural-light": "Luz natural", soft: "Luz suave", bright: "Claro", dark: "Escuro",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinematográfico", film: "Filme",
    editorial: "Editorial", commercial: "Comercial", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegante", romantic: "Romântico", moody: "Moody",
    dramatic: "Dramático", dynamic: "Dinâmico", sporty: "Esportivo", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  pl: {
    women: "Kobiece", men: "Męskie", couples: "Pary", family: "Rodzinne", kids: "Dziecięce", group: "Grupowe",
    portrait: "Portret", "close-up": "Zbliżenie", profile: "Profil", "half-body": "Do pasa",
    "full-body": "Pełna sylwetka", sitting: "Siedzący", lying: "Leżący",
    studio: "Studio", loft: "Loft", home: "Wnętrze", street: "Ulica", urban: "Miasto",
    "night-city": "Miasto nocą", park: "Park", garden: "Ogród", forest: "Las", nature: "Natura",
    beach: "Plaża", lake: "Jezioro", mountains: "Góry", countryside: "Wieś",
    rooftop: "Dach", balcony: "Balkon", cafe: "Kawiarnia", restaurant: "Restauracja", bar: "Bar",
    hotel: "Hotel", museum: "Muzeum", office: "Biuro", gym: "Siłownia", pool: "Basen", subway: "Metro",
    "1": "1 osoba", "2": "2 osoby", "3+": "3 lub więcej",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Ślub",
    maternity: "Ciąża", newborn: "Noworodek", boudoir: "Boudoir", business: "Biznes",
    creative: "Kreatywne", event: "Event", graduation: "Matura",
    "natural-light": "Światło naturalne", soft: "Miękkie światło", bright: "Jasny", dark: "Ciemny",
    "high-key": "High key", "low-key": "Low key", cinematic: "Filmowy", film: "Analog",
    editorial: "Editorial", commercial: "Komercyjny", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegancki", romantic: "Romantyczny", moody: "Moody",
    dramatic: "Dramatyczny", dynamic: "Dynamiczny", sporty: "Sportowy", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  tr: {
    women: "Kadın", men: "Erkek", couples: "Çift", family: "Aile", kids: "Çocuk", group: "Grup",
    portrait: "Portre", "close-up": "Yakın plan", profile: "Profil", "half-body": "Bel hizası",
    "full-body": "Tam boy", sitting: "Oturur", lying: "Uzanır",
    studio: "Stüdyo", loft: "Loft", home: "İç mekan", street: "Sokak", urban: "Şehir",
    "night-city": "Gece şehri", park: "Park", garden: "Bahçe", forest: "Orman", nature: "Doğa",
    beach: "Plaj", lake: "Göl", mountains: "Dağ", countryside: "Kırsal",
    rooftop: "Çatı", balcony: "Balkon", cafe: "Kafe", restaurant: "Restoran", bar: "Bar",
    hotel: "Otel", museum: "Müze", office: "Ofis", gym: "Spor salonu", pool: "Havuz", subway: "Metro",
    "1": "1 kişi", "2": "2 kişi", "3+": "3 veya daha fazla",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Düğün",
    maternity: "Hamilelik", newborn: "Yenidoğan", boudoir: "Boudoir", business: "İş",
    creative: "Yaratıcı", event: "Etkinlik", graduation: "Mezuniyet",
    "natural-light": "Doğal ışık", soft: "Yumuşak ışık", bright: "Açık", dark: "Koyu",
    "high-key": "High key", "low-key": "Low key", cinematic: "Sinematik", film: "Film",
    editorial: "Editorial", commercial: "Ticari", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Zarif", romantic: "Romantik", moody: "Moody",
    dramatic: "Dramatik", dynamic: "Dinamik", sporty: "Sportif", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  nl: {
    women: "Vrouwen", men: "Mannen", couples: "Koppels", family: "Familie", kids: "Kinderen", group: "Groep",
    portrait: "Portret", "close-up": "Close-up", profile: "Profiel", "half-body": "Half lengte",
    "full-body": "Volledig", sitting: "Zittend", lying: "Liggend",
    studio: "Studio", loft: "Loft", home: "Interieur", street: "Straat", urban: "Stad",
    "night-city": "Nachtstad", park: "Park", garden: "Tuin", forest: "Bos", nature: "Natuur",
    beach: "Strand", lake: "Meer", mountains: "Bergen", countryside: "Platteland",
    rooftop: "Dak", balcony: "Balkon", cafe: "Café", restaurant: "Restaurant", bar: "Bar",
    hotel: "Hotel", museum: "Museum", office: "Kantoor", gym: "Sportschool", pool: "Zwembad", subway: "Metro",
    "1": "1 persoon", "2": "2 personen", "3+": "3 of meer",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Bruiloft",
    maternity: "Zwangerschap", newborn: "Pasgeborene", boudoir: "Boudoir", business: "Zakelijk",
    creative: "Creatief", event: "Evenement", graduation: "Diploma",
    "natural-light": "Natuurlijk licht", soft: "Zacht licht", bright: "Licht", dark: "Donker",
    "high-key": "High key", "low-key": "Low key", cinematic: "Cinematisch", film: "Film",
    editorial: "Editorial", commercial: "Commercieel", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegant", romantic: "Romantisch", moody: "Moody",
    dramatic: "Dramatisch", dynamic: "Dynamisch", sporty: "Sportief", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  cs: {
    women: "Ženy", men: "Muži", couples: "Páry", family: "Rodina", kids: "Děti", group: "Skupina",
    portrait: "Portrét", "close-up": "Detail", profile: "Profil", "half-body": "Po pás",
    "full-body": "Celá postava", sitting: "Sedící", lying: "Ležící",
    studio: "Studio", loft: "Loft", home: "Interiér", street: "Ulice", urban: "Město",
    "night-city": "Noční město", park: "Park", garden: "Zahrada", forest: "Les", nature: "Příroda",
    beach: "Pláž", lake: "Jezero", mountains: "Hory", countryside: "Venkov",
    rooftop: "Střecha", balcony: "Balkon", cafe: "Kavárna", restaurant: "Restaurace", bar: "Bar",
    hotel: "Hotel", museum: "Muzeum", office: "Kancelář", gym: "Posilovna", pool: "Bazén", subway: "Metro",
    "1": "1 osoba", "2": "2 osoby", "3+": "3 a více",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Svatba",
    maternity: "Těhotenství", newborn: "Novorozenec", boudoir: "Boudoir", business: "Business",
    creative: "Kreativní", event: "Event", graduation: "Maturita",
    "natural-light": "Přirozené světlo", soft: "Měkké světlo", bright: "Světlý", dark: "Tmavý",
    "high-key": "High key", "low-key": "Low key", cinematic: "Filmový", film: "Film",
    editorial: "Editorial", commercial: "Komerční", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegantní", romantic: "Romantický", moody: "Moody",
    dramatic: "Dramatický", dynamic: "Dynamický", sporty: "Sportovní", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
  zh: {
    women: "女性", men: "男性", couples: "情侣", family: "家庭", kids: "儿童", group: "团体",
    portrait: "肖像", "close-up": "特写", profile: "侧面", "half-body": "半身",
    "full-body": "全身", sitting: "坐姿", lying: "躺姿",
    studio: "影棚", loft: "阁楼", home: "室内", street: "街道", urban: "城市",
    "night-city": "夜景城市", park: "公园", garden: "花园", forest: "森林", nature: "自然",
    beach: "海滩", lake: "湖泊", mountains: "山脉", countryside: "乡村",
    rooftop: "屋顶", balcony: "阳台", cafe: "咖啡馆", restaurant: "餐厅", bar: "酒吧",
    hotel: "酒店", museum: "博物馆", office: "办公室", gym: "健身房", pool: "泳池", subway: "地铁",
    "1": "1人", "2": "2人", "3+": "3人及以上",
    love: "爱情", story: "故事", fashion: "时尚", wedding: "婚礼",
    maternity: "孕妇", newborn: "新生儿", boudoir: "私房", business: "商务",
    creative: "创意", event: "活动", graduation: "毕业",
    "natural-light": "自然光", soft: "柔光", bright: "明亮", dark: "暗调",
    "high-key": "高调", "low-key": "低调", cinematic: "电影感", film: "胶片",
    editorial: "编辑", commercial: "商业", lifestyle: "生活方式", candid: "抓拍",
    minimal: "极简", elegant: "优雅", romantic: "浪漫", moody: "情绪",
    dramatic: "戏剧", dynamic: "动感", sporty: "运动", boho: "波西米亚",
    vintage: "复古", gritty: "粗粝",
  },
  ja: {
    women: "女性", men: "男性", couples: "カップル", family: "家族", kids: "子供", group: "グループ",
    portrait: "ポートレート", "close-up": "クローズアップ", profile: "横顔", "half-body": "半身",
    "full-body": "全身", sitting: "座り", lying: "寝姿",
    studio: "スタジオ", loft: "ロフト", home: "室内", street: "ストリート", urban: "都市",
    "night-city": "夜景", park: "公園", garden: "庭園", forest: "森", nature: "自然",
    beach: "ビーチ", lake: "湖", mountains: "山", countryside: "田舎",
    rooftop: "屋上", balcony: "バルコニー", cafe: "カフェ", restaurant: "レストラン", bar: "バー",
    hotel: "ホテル", museum: "博物館", office: "オフィス", gym: "ジム", pool: "プール", subway: "地下鉄",
    "1": "1人", "2": "2人", "3+": "3人以上",
    love: "ラブストーリー", story: "ストーリー", fashion: "ファッション", wedding: "ウェディング",
    maternity: "マタニティ", newborn: "ニューボーン", boudoir: "ブードワール", business: "ビジネス",
    creative: "クリエイティブ", event: "イベント", graduation: "卒業",
    "natural-light": "自然光", soft: "ソフトライト", bright: "明るい", dark: "ダーク",
    "high-key": "ハイキー", "low-key": "ローキー", cinematic: "シネマティック", film: "フィルム",
    editorial: "エディトリアル", commercial: "コマーシャル", lifestyle: "ライフスタイル", candid: "キャンディッド",
    minimal: "ミニマル", elegant: "エレガント", romantic: "ロマンチック", moody: "ムーディー",
    dramatic: "ドラマチック", dynamic: "ダイナミック", sporty: "スポーティ", boho: "ボヘミアン",
    vintage: "ヴィンテージ", gritty: "グリッティ",
  },
  ko: {
    women: "여성", men: "남성", couples: "커플", family: "가족", kids: "아동", group: "그룹",
    portrait: "포트레이트", "close-up": "클로즈업", profile: "프로필", "half-body": "반신",
    "full-body": "전신", sitting: "앉은", lying: "누운",
    studio: "스튜디오", loft: "로프트", home: "실내", street: "거리", urban: "도시",
    "night-city": "야경", park: "공원", garden: "정원", forest: "숲", nature: "자연",
    beach: "해변", lake: "호수", mountains: "산", countryside: "시골",
    rooftop: "옥상", balcony: "발코니", cafe: "카페", restaurant: "레스토랑", bar: "바",
    hotel: "호텔", museum: "박물관", office: "사무실", gym: "체육관", pool: "수영장", subway: "지하철",
    "1": "1명", "2": "2명", "3+": "3명 이상",
    love: "러브스토리", story: "스토리", fashion: "패션", wedding: "웨딩",
    maternity: "임신", newborn: "신생아", boudoir: "부두아르", business: "비즈니스",
    creative: "크리에이티브", event: "이벤트", graduation: "졸업",
    "natural-light": "자연광", soft: "소프트 라이트", bright: "밝은", dark: "어두운",
    "high-key": "하이키", "low-key": "로우키", cinematic: "시네마틱", film: "필름",
    editorial: "에디토리얼", commercial: "커머셜", lifestyle: "라이프스타일", candid: "캔디드",
    minimal: "미니멀", elegant: "엘레강트", romantic: "로맨틱", moody: "무디",
    dramatic: "드라마틱", dynamic: "다이나믹", sporty: "스포티", boho: "보헤미안",
    vintage: "빈티지", gritty: "그리티",
  },
  ar: {
    women: "نساء", men: "رجال", couples: "أزواج", family: "عائلة", kids: "أطفال", group: "مجموعة",
    portrait: "بورتريه", "close-up": "لقطة قريبة", profile: "جانبي", "half-body": "نصف جسم",
    "full-body": "كامل الجسم", sitting: "جالس", lying: "مستلقي",
    studio: "استوديو", loft: "لوفت", home: "داخلي", street: "شارع", urban: "مدينة",
    "night-city": "مدينة ليلية", park: "حديقة", garden: "حديقة", forest: "غابة", nature: "طبيعة",
    beach: "شاطئ", lake: "بحيرة", mountains: "جبال", countryside: "ريف",
    rooftop: "سطح", balcony: "شرفة", cafe: "مقهى", restaurant: "مطعم", bar: "بار",
    hotel: "فندق", museum: "متحف", office: "مكتب", gym: "صالة رياضية", pool: "مسبح", subway: "مترو",
    "1": "شخص واحد", "2": "شخصان", "3+": "3 أو أكثر",
    love: "قصة حب", story: "سرد", fashion: "أزياء", wedding: "زفاف",
    maternity: "حمل", newborn: "مولود", boudoir: "بودوار", business: "أعمال",
    creative: "إبداعي", event: "حدث", graduation: "تخرج",
    "natural-light": "ضوء طبيعي", soft: "ضوء ناعم", bright: "فاتح", dark: "داكن",
    "high-key": "هاي كي", "low-key": "لو كي", cinematic: "سينمائي", film: "فيلم",
    editorial: "افتتاحي", commercial: "تجاري", lifestyle: "نمط حياة", candid: "طبيعي",
    minimal: "بسيط", elegant: "أنيق", romantic: "رومانسي", moody: "مزاجي",
    dramatic: "درامي", dynamic: "ديناميكي", sporty: "رياضي", boho: "بوهو",
    vintage: "كلاسيكي", gritty: "خشن",
  },
  hi: {
    women: "महिला", men: "पुरुष", couples: "जोड़े", family: "परिवार", kids: "बच्चे", group: "समूह",
    portrait: "पोर्ट्रेट", "close-up": "क्लोज़-अप", profile: "प्रोफ़ाइल", "half-body": "आधा शरीर",
    "full-body": "पूरा शरीर", sitting: "बैठे", lying: "लेटे",
    studio: "स्टूडियो", loft: "लॉफ्ट", home: "इंटीरियर", street: "सड़क", urban: "शहर",
    "night-city": "रात का शहर", park: "पार्क", garden: "बगीचा", forest: "जंगल", nature: "प्रकृति",
    beach: "समुद्र तट", lake: "झील", mountains: "पहाड़", countryside: "ग्रामीण",
    rooftop: "छत", balcony: "बालकनी", cafe: "कैफ़े", restaurant: "रेस्तरां", bar: "बार",
    hotel: "होटल", museum: "संग्रहालय", office: "कार्यालय", gym: "जिम", pool: "पूल", subway: "मेट्रो",
    "1": "1 व्यक्ति", "2": "2 लोग", "3+": "3 या अधिक",
    love: "लव स्टोरी", story: "कहानी", fashion: "फैशन", wedding: "शादी",
    maternity: "गर्भावस्था", newborn: "नवजात", boudoir: "बौदुआर", business: "व्यापार",
    creative: "रचनात्मक", event: "इवेंट", graduation: "स्नातक",
    "natural-light": "प्राकृतिक प्रकाश", soft: "मुलायम प्रकाश", bright: "उज्ज्वल", dark: "गहरा",
    "high-key": "हाई की", "low-key": "लो की", cinematic: "सिनेमैटिक", film: "फिल्म",
    editorial: "संपादकीय", commercial: "व्यावसायिक", lifestyle: "लाइफस्टाइल", candid: "कैंडिड",
    minimal: "मिनिमल", elegant: "शानदार", romantic: "रोमांटिक", moody: "मूडी",
    dramatic: "नाटकीय", dynamic: "गतिशील", sporty: "खेल", boho: "बोहो",
    vintage: "विंटेज", gritty: "ग्रिटी",
  },
  id: {
    women: "Wanita", men: "Pria", couples: "Pasangan", family: "Keluarga", kids: "Anak", group: "Grup",
    portrait: "Potret", "close-up": "Close-up", profile: "Profil", "half-body": "Setengah badan",
    "full-body": "Seluruh tubuh", sitting: "Duduk", lying: "Berbaring",
    studio: "Studio", loft: "Loft", home: "Interior", street: "Jalanan", urban: "Kota",
    "night-city": "Kota malam", park: "Taman", garden: "Taman bunga", forest: "Hutan", nature: "Alam",
    beach: "Pantai", lake: "Danau", mountains: "Gunung", countryside: "Pedesaan",
    rooftop: "Atap", balcony: "Balkon", cafe: "Kafe", restaurant: "Restoran", bar: "Bar",
    hotel: "Hotel", museum: "Museum", office: "Kantor", gym: "Gym", pool: "Kolam", subway: "Metro",
    "1": "1 orang", "2": "2 orang", "3+": "3 atau lebih",
    love: "Love story", story: "Storytelling", fashion: "Fashion", wedding: "Pernikahan",
    maternity: "Kehamilan", newborn: "Bayi baru lahir", boudoir: "Boudoir", business: "Bisnis",
    creative: "Kreatif", event: "Acara", graduation: "Kelulusan",
    "natural-light": "Cahaya alami", soft: "Cahaya lembut", bright: "Terang", dark: "Gelap",
    "high-key": "High key", "low-key": "Low key", cinematic: "Sinematik", film: "Film",
    editorial: "Editorial", commercial: "Komersial", lifestyle: "Lifestyle", candid: "Candid",
    minimal: "Minimal", elegant: "Elegan", romantic: "Romantis", moody: "Moody",
    dramatic: "Dramatis", dynamic: "Dinamis", sporty: "Sporty", boho: "Boho",
    vintage: "Vintage", gritty: "Gritty",
  },
};

const GROUP_TITLES: Record<AppLanguage, Record<FilterGroupKey, string>> = {
  en: {
    categories: "Category", shotTypes: "Shot type", locations: "Location",
    peopleCount: "People", sessionTypes: "Session type", styles: "Style & light",
  },
  ru: {
    categories: "Категория", shotTypes: "Тип кадра", locations: "Локация",
    peopleCount: "Люди", sessionTypes: "Тип съёмки", styles: "Стиль и свет",
  },
  uk: {
    categories: "Категорія", shotTypes: "Тип кадру", locations: "Локація",
    peopleCount: "Люди", sessionTypes: "Тип зйомки", styles: "Стиль і світло",
  },
  de: {
    categories: "Kategorie", shotTypes: "Aufnahmetyp", locations: "Ort",
    peopleCount: "Personen", sessionTypes: "Shooting-Typ", styles: "Stil & Licht",
  },
  fr: {
    categories: "Catégorie", shotTypes: "Type de plan", locations: "Lieu",
    peopleCount: "Personnes", sessionTypes: "Type de séance", styles: "Style et lumière",
  },
  es: {
    categories: "Categoría", shotTypes: "Tipo de plano", locations: "Ubicación",
    peopleCount: "Personas", sessionTypes: "Tipo de sesión", styles: "Estilo y luz",
  },
  it: {
    categories: "Categoria", shotTypes: "Tipo di scatto", locations: "Location",
    peopleCount: "Persone", sessionTypes: "Tipo di servizio", styles: "Stile e luce",
  },
  pt: {
    categories: "Categoria", shotTypes: "Tipo de foto", locations: "Local",
    peopleCount: "Pessoas", sessionTypes: "Tipo de sessão", styles: "Estilo e luz",
  },
  pl: {
    categories: "Kategoria", shotTypes: "Typ ujęcia", locations: "Lokalizacja",
    peopleCount: "Osoby", sessionTypes: "Typ sesji", styles: "Styl i światło",
  },
  tr: {
    categories: "Kategori", shotTypes: "Çekim tipi", locations: "Konum",
    peopleCount: "Kişiler", sessionTypes: "Çekim türü", styles: "Stil ve ışık",
  },
  nl: {
    categories: "Categorie", shotTypes: "Beeldtype", locations: "Locatie",
    peopleCount: "Personen", sessionTypes: "Sessietype", styles: "Stijl & licht",
  },
  cs: {
    categories: "Kategorie", shotTypes: "Typ záběru", locations: "Lokace",
    peopleCount: "Lidé", sessionTypes: "Typ focení", styles: "Styl a světlo",
  },
  zh: {
    categories: "类别", shotTypes: "拍摄类型", locations: "地点",
    peopleCount: "人数", sessionTypes: "拍摄类型", styles: "风格与光线",
  },
  ja: {
    categories: "カテゴリー", shotTypes: "撮影タイプ", locations: "ロケーション",
    peopleCount: "人数", sessionTypes: "セッションタイプ", styles: "スタイルと光",
  },
  ko: {
    categories: "카테고리", shotTypes: "촬영 유형", locations: "장소",
    peopleCount: "인원", sessionTypes: "촬영 유형", styles: "스타일과 조명",
  },
  ar: {
    categories: "الفئة", shotTypes: "نوع اللقطة", locations: "الموقع",
    peopleCount: "الأشخاص", sessionTypes: "نوع الجلسة", styles: "الأسلوب والإضاءة",
  },
  hi: {
    categories: "श्रेणी", shotTypes: "शॉट प्रकार", locations: "स्थान",
    peopleCount: "लोग", sessionTypes: "सेशन प्रकार", styles: "स्टाइल और लाइट",
  },
  id: {
    categories: "Kategori", shotTypes: "Jenis bidikan", locations: "Lokasi",
    peopleCount: "Orang", sessionTypes: "Jenis sesi", styles: "Gaya & cahaya",
  },
};

const ALL_FILTER_IDS = new Set(
  FILTER_GROUP_KEYS.flatMap((group) => FILTER_IDS_BY_GROUP[group])
);

const LABEL_LOOKUP = new Map<string, Map<string, string>>();

for (const id of ALL_FILTER_IDS) {
  const perLang = new Map<string, string>();
  for (const lang of APP_LANGUAGES) {
    const label = LABELS[lang.value][id] ?? LABELS.en[id];
    if (label) perLang.set(lang.value, label);
  }
  LABEL_LOOKUP.set(id, perLang);
}

export function getFilterLabel(id: string, lang: AppLanguage = "ru"): string {
  const labels = LABEL_LOOKUP.get(id);
  if (labels?.has(lang)) return labels.get(lang)!;
  if (labels?.has("en")) return labels.get("en")!;
  return id.replace(/-/g, " ");
}

export function getAllLabelsForFilterId(id: string): string[] {
  const labels = LABEL_LOOKUP.get(id);
  if (!labels) return [id.replace(/-/g, " ")];
  return Array.from(new Set([...labels.values(), id, id.replace(/-/g, " ")]));
}

export function getFilterGroups(lang: AppLanguage) {
  const titles = GROUP_TITLES[lang] ?? GROUP_TITLES.en;
  return FILTER_GROUP_KEYS.map((key) => ({
    key,
    title: titles[key],
    items: FILTER_IDS_BY_GROUP[key].map((id) => ({
      id,
      label: getFilterLabel(id, lang),
    })),
  }));
}

export function getAllFilterIds(): string[] {
  return [...ALL_FILTER_IDS];
}

export function getFilterGroupKeyForId(id: string): FilterGroupKey | null {
  for (const key of FILTER_GROUP_KEYS) {
    if ((FILTER_IDS_BY_GROUP[key] as readonly string[]).includes(id)) return key;
  }
  return null;
}
