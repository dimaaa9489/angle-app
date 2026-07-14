import type { FilterGroupKey } from "@/lib/i18n/filter-labels";
import { normalizeSearchText } from "@/lib/i18n/search-words";

export type SearchDictionaryEntry = {
  id: string;
  filters?: Partial<Record<FilterGroupKey, string[]>>;
  /** All equivalent words/phrases across 18 app languages. */
  terms: string[];
};

/** Shorthand — one cross-language concept group. */
const G = (
  id: string,
  terms: string[],
  filters?: Partial<Record<FilterGroupKey, string[]>>
): SearchDictionaryEntry => ({ id, terms, filters });

/**
 * Master cross-language search dictionary.
 * Any term in a group matches any other term in title/keywords (or filter tag when set).
 */
export const SEARCH_DICTIONARY: SearchDictionaryEntry[] = [
  // ── Locations (strict filter when tagged) ──────────────────────────────
  G("night-city", [
    "night city", "nighttime", "night",
    "noc", "nacht", "noch", "nuit", "noche", "notte", "noite", "gece", "nachts",
    "nocturno", "noturno", "noturna", "nocturna", "nochni", "nochní", "nocni",
    "ночь", "ночи", "ночью", "ночной", "ночная", "ночное", "ночные", "ночного",
    "nich", "nichna", "nichne", "nichni", "nic", "noca", "noci",
    "야경", "夜景", "夜景城市",
  ], { locations: ["night-city"] }),

  G("home", [
    "home", "house", "apartment", "flat", "interior", "indoors", "indoor", "room",
    "dom", "дом", "дома", "домаш", "домашний", "домашняя", "квартира", "квартире",
    "интерьер", "интерьере", "комната", "комнате",
    "dim", "будинок", "квартира", "інтер'єр", "кімната",
    "zuhause", "wohnung", "haus", "interieur",
    "intérieur", "appartement", "maison", "pièce",
    "interior", "piso", "casa", "habitación",
    "interno", "appartamento", "stanza",
    "casa", "apartamento", "quarto",
    "dom", "mieszkanie", "pokój", "wnętrze",
    "ev", "daire", "iç mekan", "oda",
    "huis", "appartement", "kamer", "interieur",
    "dům", "byt", "pokoj", "interiér",
    "家", "室内", "公寓", "房间",
    "家", "室内", "アパート", "部屋",
    "집", "실내", "아파트", "방",
    "منزل", "شقة", "داخلي", "غرفة",
    "घर", "अपार्टमेंट", "इंटीरियर", "कमरा",
    "rumah", "apartemen", "interior", "kamar",
  ], { locations: ["home"] }),

  G("studio", [
    "studio", "photo studio", "photostudio",
    "студия", "студии", "фотостудия",
    "студія", "atelier",
    "estudio", "estúdio",
    "studio fotografico",
    "aufnahmestudio",
    "foto stüdyo", "stüdyo",
    "fotostudio",
    "ateliér", "fotostudio",
    "摄影棚", "スタジオ", "스튜디오",
    "استوديو", "स्टूडियो", "studio foto",
  ], { locations: ["studio"] }),

  G("street", [
    "street", "on street", "in street", "road", "sidewalk", "pavement",
    "улица", "на улице", "ул", "дорога", "тротуар",
    "vulytsia", "вулиця", "на вулиці",
    "straße", "strasse", "strasse", "strasse",
    "rue", "route", "trottoir",
    "calle", "avenida", "acera",
    "strada", "via", "marciapiede",
    "rua", "avenida", "calçada",
    "ulica", "chodnik",
    "sokak", "cadde", "kaldırım",
    "straat", "stoep",
    "ulice", "chodník",
    "街道", "马路", "街", "通り", "道路", "거리", "شارع", "सड़क", "jalan",
  ], { locations: ["street"] }),

  G("urban", [
    "urban", "city", "town", "downtown", "metropolis", "in city",
    "город", "городе", "в городе", "городской", "центр",
    "мisto", "місто", "urban",
    "stadt", "innstadt", "urban",
    "ville", "centre ville", "urbain",
    "ciudad", "urbano", "centro",
    "città", "urbano", "centro",
    "cidade", "urbano", "centro",
    "miasto", "miejski", "centrum",
    "şehir", "kent", "merkez",
    "stad", "centrum", "stedelijk",
    "město", "městský", "centrum",
    "城市", "市区", "都市", "도시", "مدينة", "शहर", "kota",
  ], { locations: ["urban"] }),

  G("beach", [
    "beach", "seaside", "seashore", "shore", "sand", "coast",
    "пляж", "на пляже", "море", "берег", "побережье",
    "pliazh", "берег", "узбережжя",
    "strand", "meer", "küste",
    "plage", "bord de mer", "côte",
    "playa", "orilla", "costa",
    "spiaggia", "riva", "costa",
    "praia", "orla", "costa",
    "plaża", "morze", "brzeg",
    "plaj", "sahil", "kıyı",
    "strand", "kust",
    "pláž", "moře", "pobřeží",
    "海滩", "海边", "海岸", "砂浜", "海辺", "해변", "바다", "شاطئ", "समुद्र तट", "pantai",
  ], { locations: ["beach"] }),

  G("forest", [
    "forest", "woods", "woodland", "trees", "grove",
    "лес", "в лесу", "лесной", "роща", "деревья",
    "lis", "ліс", "wood",
    "wald", "forst", "bäume",
    "forêt", "foret", "bois", "arbres",
    "bosque", "árboles", "selva",
    "foresta", "alberi", "bosco",
    "floresta", "árvores", "mato",
    "las", "drzewa", "puszcza",
    "orman", "ağaçlar",
    "bos", "bomen",
    "les", "stromy", "houští",
    "森林", "树林", "森", "숲", "غابة", "जंगल", "hutan",
  ], { locations: ["forest"] }),

  G("park", [
    "park", "public park", "garden park",
    "парк", "в парке", "парковый",
    "park", "парк",
    "garten", "parkanlage",
    "parc", "jardin public",
    "parque", "jardín",
    "parco", "giardino",
    "parque", "jardim",
    "park", "park miejski",
    "park", "bahçe",
    "park", "openbaar park",
    "park", "městský park",
    "公园", "公園", "공원", "حديقة", "पार्क", "taman",
  ], { locations: ["park"] }),

  G("mountains", [
    "mountains", "mountain", "hills", "alps", "peak", "summit",
    "горы", "в горах", "гора", "холмы", "вершина",
    "hory", "hora", "vrchol",
    "berge", "berg", "gipfel",
    "montagnes", "montagne", "sommet",
    "montañas", "montaña", "cumbre",
    "montagne", "montagna", "vetta",
    "montanhas", "montanha", "pico",
    "góry", "góra", "szczyt",
    "dağlar", "dağ", "tepe",
    "bergen", "berg", "top",
    "hory", "hora", "vrchol",
    "山", "山脉", "山岳", "산", "جبل", "पहाड़", "gunung",
  ], { locations: ["mountains"] }),

  G("lake", [
    "lake", "lakeside", "pond", "reservoir",
    "озеро", "у озера", "озерный", "водоём",
    "ozero", "озеро",
    "see", "stausee",
    "lac", "étang",
    "lago", "estanque",
    "lago", "stagno",
    "lago", "açude",
    "jezioro", "staw",
    "göl", "gölet",
    "meer", "plas",
    "jezero", "rybník",
    "湖", "湖畔", "湖泊", "호수", "بحيرة", "झील", "danau",
  ], { locations: ["lake"] }),

  G("cafe", [
    "cafe", "café", "coffee shop", "coffeehouse", "coffee bar",
    "кафе", "кофейня", "кофе",
    "kav'yarnya", "кав'ярня",
    "café", "kaffeehaus",
    "café", "coffee",
    "cafetería", "café",
    "caffè", "bar",
    "café", "cafeteria",
    "kawiarnia", "kafejka",
    "kafe", "kahvehane",
    "café", "koffiebar",
    "kavárna", "cukrárna",
    "咖啡馆", "カフェ", "카페", "مقهى", "कैफे", "kafe",
  ], { locations: ["cafe"] }),

  G("rooftop", [
    "rooftop", "roof", "on roof", "terrace",
    "крыша", "на крыше", "терраса",
    "dakh", "dakh", "terasa",
    "dach", "dachterrasse",
    "toit", "terrasse",
    "azotea", "terraza", "tejado",
    "tetto", "terrazza",
    "telhado", "terraço",
    "dach", "taras",
    "çatı", "teras",
    "dak", "terras",
    "střecha", "terasa",
    "屋顶", "天台", "ルーフ", "옥상", "سطح", "छत", "atap",
  ], { locations: ["rooftop"] }),

  G("balcony", [
    "balcony", "on balcony", "balconies",
    "балкон", "на балконе", "балконе",
    "balkon", "balkon",
    "balkon", "balkon",
    "balcon", "balcony",
    "balcón", "balcon",
    "balcone", "balconi",
    "varanda", "sacada",
    "balkon", "balkon",
    "balkon", "balkon",
    "balkon", "balkon",
    "balkón", "balkon",
    "阳台", "バルコニー", "발코니", "شرفة", "बालकनी", "balkon",
  ], { locations: ["balcony"] }),

  // ── Objects & props (text match across languages) ──────────────────────
  G("window", [
    "window", "windows", "near window", "by window", "at window", "in window",
    "окно", "окна", "окне", "окном", "у окна", "в окне",
    "vіkno", "vікна", "vіkne",
    "fenster", "fenster",
    "fenêtre", "fenetre",
    "ventana", "ventanas",
    "finestra", "finestre",
    "janela", "janelas",
    "okno", "okna", "oknie", "oknem",
    "pencere", "cam",
    "raam", "venster",
    "okno", "okna", "okne",
    "窗户", "窗", "ウィンドウ", "窓", "창문", "نافذة", "खिड़की", "jendela",
  ]),

  G("mirror", [
    "mirror", "mirrors", "in mirror", "with mirror",
    "зеркало", "зеркала", "зеркале", "у зеркала",
    "dzerkalo", "дзеркало",
    "spiegel",
    "miroir",
    "espejo",
    "specchio",
    "espelho",
    "lustro", "lustrze",
    "ayna",
    "spiegel",
    "zrcadlo", "zrcadle",
    "镜子", "镜", "ミラー", "鏡", "거울", "مرآة", "आईना", "cermin",
  ]),

  G("door", [
    "door", "doors", "doorway", "entrance",
    "дверь", "двери", "дверью", "у двери", "вход",
    "dveri", "двері",
    "tür", "türe", "eingang",
    "porte", "entrée",
    "puerta", "entrada",
    "porta", "ingresso",
    "porta", "entrada",
    "drzwi", "wejście",
    "kapı", "giriş",
    "deur", "ingang",
    "dveře", "vchod",
    "门", "门口", "ドア", "문", "باب", "दरवाजा", "pintu",
  ]),

  G("sofa", [
    "sofa", "couch", "settee", "on sofa", "on couch",
    "диван", "на диване", "диване", "канапе",
    "dyvan", "диван",
    "sofa", "couch",
    "canapé", "sofa",
    "sofá", "sillón",
    "divano", "poltrona",
    "sofá", "poltrona",
    "sofa", "kanapa", "w kanapie",
    "kanepe", "koltuk",
    "bank", "zitbank",
    "pohovka", "gauč",
    "沙发", "ソファ", "소파", "أريكة", "सोफा", "sofa",
  ]),

  G("bed", [
    "bed", "bedroom bed", "on bed", "in bed",
    "кровать", "на кровати", "кровати", "постель",
    "lіzhko", "ліжко",
    "bett", "im bett",
    "lit", "dans le lit",
    "cama", "en la cama",
    "letto", "a letto",
    "cama", "na cama",
    "łóżko", "w łóżku",
    "yatak", "yatakta",
    "bed", "in bed",
    "postel", "v posteli",
    "床", "ベッド", "침대", "سرير", "बिस्तर", "tempat tidur",
  ]),

  G("chair", [
    "chair", "chairs", "on chair", "sitting chair",
    "стул", "на стуле", "стуле", "кресло",
    "stil", "стілець", "крісло",
    "stuhl", "sessel",
    "chaise", "fauteuil",
    "silla", "butaca",
    "sedia", "poltrona",
    "cadeira", "poltrona",
    "krzesło", "fotel",
    "sandalye", "koltuk",
    "stoel", "fauteuil",
    "židle", "křeslo",
    "椅子", "椅", "イス", "의자", "كرسي", "कुर्सी", "kursi",
  ]),

  G("table", [
    "table", "desk", "at table", "on table",
    "стол", "за столом", "столе", "на столе",
    "stil", "стіл",
    "tisch", "schreibtisch",
    "table", "bureau",
    "mesa", "escritorio",
    "tavolo", "scrivania",
    "mesa", "escrivaninha",
    "stół", "biurko",
    "masa", "sira",
    "tafel", "bureau",
    "stůl", "psací stůl",
    "桌子", "机", "テーブル", "桌", "탁자", "طاولة", "मेज", "meja",
  ]),

  G("stairs", [
    "stairs", "staircase", "stairway", "steps", "on stairs",
    "лестница", "на лестнице", "ступени", "ступеньки",
    "dіvnitsya", "сходи",
    "treppe", "treppe", "stufen",
    "escalier", "escaliers", "marches",
    "escalera", "escaleras", "peldaños",
    "scale", "gradini",
    "escada", "degraus",
    "schody", "stopnie",
    "merdiven", "basamak",
    "trap", "trappen",
    "schody", "schodiště",
    "楼梯", "階段", "계단", "سلم", "सीढ़ी", "tangga",
  ]),

  G("car", [
    "car", "cars", "auto", "automobile", "vehicle", "near car", "with car",
    "машина", "машине", "машины", "авто", "автомобиль", "автомобиле", "у машины",
    "avto", "автомобіль", "машина",
    "wagen", "auto", "fahrzeug",
    "voiture", "auto", "véhicule",
    "coche", "auto", "vehículo",
    "macchina", "auto", "veicolo",
    "carro", "automóvel", "veículo",
    "samochód", "auto", "pojazd",
    "araba", "otomobil", "araç",
    "auto", "voertuig", "wagen",
    "auto", "vozidlo", "automobil",
    "汽车", "车", "車", "자동차", "سيارة", "कार", "mobil",
  ]),

  G("flowers", [
    "flowers", "flower", "bouquet", "floral", "with flowers",
    "цветы", "цветами", "букет", "цветочный",
    "kvitky", "квіти", "букет",
    "blumen", "blumenstrauß", "strauß",
    "fleurs", "bouquet", "floral",
    "flores", "ramo", "floral",
    "fiori", "mazzo", "floreale",
    "flores", "buquê", "floral",
    "kwiaty", "bukiet", "kwiatowy",
    "çiçekler", "buket",
    "bloemen", "boeket",
    "květiny", "kytice",
    "花", "鲜花", "花束", "フラワー", "꽃", "زهور", "फूल", "bunga",
  ]),

  G("bike", [
    "bike", "bicycle", "cycling", "cyclist",
    "велосипед", "на велосипеде", "байк",
    "velosyped", "велосипед",
    "fahrrad", "rad",
    "vélo", "bicyclette",
    "bicicleta", "bici",
    "bicicletta", "bici",
    "bicicleta", "bike",
    "rower", "bike",
    "bisiklet",
    "fiets",
    "kolo", "cyklist",
    "自行车", "单车", "自転車", "자전거", "دراجة", "साइकिल", "sepeda",
  ]),

  // ── Time & light ───────────────────────────────────────────────────────
  G("sunset", [
    "sunset", "sun set", "dusk", "golden hour", "evening light",
    "закат", "на закате", "золотой час",
    "zakhid", "захід", "золота година",
    "sonnenuntergang", "abendlicht", "goldene stunde",
    "coucher de soleil", "crépuscule", "heure dorée",
    "atardecer", "puesta de sol", "hora dorada",
    "tramonto", "ora d'oro",
    "pôr do sol", "entardecer", "hora dourada",
    "zachód słońca", "złota godzina",
    "gün batımı", "altın saat",
    "zonsondergang", "gouden uur",
    "západ slunce", "zlatá hodina",
    "日落", "黄昏", "夕日", "夕焼け", "일몰", "غروب", "सूर्यास्त", "matahari terbenam",
  ]),

  G("sunrise", [
    "sunrise", "sun rise", "dawn", "morning light",
    "рассвет", "на рассвете", "утро",
    "skhid", "схід", "ранок",
    "sonnenaufgang", "morgengrauen", "morgenlicht",
    "lever de soleil", "aube", "matin",
    "amanecer", "alba", "mañana",
    "alba", "aurora", "mattina",
    "nascer do sol", "amanhecer", "manhã",
    "wschód słońca", "świt", "rano",
    "gün doğumu", "şafak", "sabah",
    "zonsopgang", "ochtend",
    "východ slunce", "svítání", "ráno",
    "日出", "黎明", "朝日", "日の出", "일출", "شروق", "सूर्योदय", "matahari terbit",
  ]),

  G("rain", [
    "rain", "rainy", "in rain", "raining", "under rain",
    "дождь", "в дождь", "дождливый", "под дождем",
    "doshch", "дощ", "дощовий",
    "regen", "regnerisch",
    "pluie", "pluvieux",
    "lluvia", "lluvioso",
    "pioggia", "piovoso",
    "chuva", "chuvoso",
    "deszcz", "deszczowy",
    "yağmur", "yağmurlu",
    "regen", "regenachtig",
    "déšť", "deštivý",
    "雨", "下雨", "雨天", "雨", "비", "مطر", "बारिश", "hujan",
  ]),

  G("snow", [
    "snow", "snowy", "in snow", "winter snow",
    "снег", "в снегу", "снежный", "зимний",
    "snih", "сніг", "сніговий",
    "schnee", "schneereich",
    "neige", "neigeux",
    "nieve", "nevado",
    "neve", "nevoso",
    "neve", "nevado",
    "śnieg", "śnieżny",
    "kar", "karlı",
    "sneeuw", "sneeuwachtig",
    "sníh", "sněhový",
    "雪", "下雪", "雪", "눈", "ثلج", "बर्फ", "salju",
  ]),

  // ── People & poses (text; categories use filter synonyms separately) ───
  G("portrait", [
    "portrait", "portraits", "headshot", "head shot",
    "портрет", "портретный", "портретная",
    "portret", "портрет",
    "porträt", "portrait",
    "portrait", "portrait photo",
    "retrato", "portrait",
    "ritratto", "ritratto",
    "retrato", "portrait",
    "portret", "portret",
    "portre", "portre",
    "portret", "portret",
    "portrét", "portrét",
    "肖像", "ポートレート", "肖像", "초상", "صورة", "पोर्ट्रेट", "potret",
  ]),

  G("wedding", [
    "wedding", "wedding day", "bridal", "bride", "groom",
    "свадьба", "свадебный", "невеста", "жених",
    "vesillia", "весілля", "наречена",
    "hochzeit", "braut", "bräutigam",
    "mariage", "mariée", "marié",
    "boda", "novia", "novio",
    "matrimonio", "sposa", "sposo",
    "casamento", "noiva", "noivo",
    "ślub", "panna młoda", "pan młody",
    "düğün", "gelin", "damat",
    "bruiloft", "bruid",
    "svatba", "nevěsta", "ženich",
    "婚礼", "結婚", "結婚式", "결혼", "زفاف", "शादी", "pernikahan",
  ]),

  G("love", [
    "love", "love story", "lovers", "romantic", "romance", "couple love",
    "любовь", "лав", "love story", "любовная", "романтика", "влюбленные",
    "kokhannya", "кохання", "закохані",
    "liebe", "liebesgeschichte", "romantisch",
    "amour", "histoire d'amour", "romantique",
    "amor", "historia de amor", "romántico",
    "amore", "storia d'amore", "romantico",
    "amor", "história de amor", "romântico",
    "miłość", "historia miłosna", "romantyczny",
    "aşk", "aşk hikayesi", "romantik",
    "liefde", "liefdesverhaal", "romantisch",
    "láska", "milostný", "romantický",
    "爱情", "ラブ", "恋", "사랑", "حب", "प्यार", "cinta",
  ]),

  G("smile", [
    "smile", "smiling", "smiles", "laugh", "laughing",
    "улыбка", "улыбается", "улыбаться", "смеется", "смеяться",
    "posmishka", "усміхається", "сміється",
    "lächeln", "lächelnd", "lachen",
    "sourire", "souriant", "rire",
    "sonrisa", "sonriendo", "reír",
    "sorriso", "sorridendo", "ridere",
    "sorriso", "sorrindo", "rir",
    "uśmiech", "uśmiecha się", "śmiech",
    "gülümseme", "gülümseyen", "gülme",
    "glimlach", "lachen",
    "úsměv", "usmívat se", "smát se",
    "微笑", "笑", "笑顔", "미소", "ابتسامة", "मुस्कान", "senyum",
  ]),

  G("hug", [
    "hug", "hugging", "embrace", "embracing",
    "объятие", "обнимает", "обниматься", "обнять",
    "obíymy", "обіймає",
    "umarmung", "umarmen",
    "étreinte", "embrasser", "serrer",
    "abrazo", "abrazar",
    "abbraccio", "abbracciare",
    "abraço", "abraçar",
    "uścisk", "przytulać",
    "sarılmak", "kucaklamak",
    "knuffel", "knuffelen",
    "objetí", "objímat",
    "拥抱", "抱", "ハグ", "포옹", "عناق", "गले लगाना", "pelukan",
  ]),

  // ── Style & mood (text; some overlap filter styles) ────────────────────
  G("soft-light", [
    "soft light", "soft lighting", "soft", "gentle light",
    "мягкий свет", "мягкий", "мягкое освещение",
    "myagke", "м'яке світло", "м'який",
    "weiches licht", "sanftes licht",
    "lumière douce", "doux",
    "luz suave", "suave",
    "luce morbida", "morbido",
    "luz suave", "suave",
    "miękkie światło", "miękki",
    "yumuşak ışık", "yumuşak",
    "zacht licht", "zacht",
    "měkké světlo", "měkký",
    "柔光", "柔和", "ソフト", "부드러운", "ضوء ناعم", "कोमल", "lembut",
  ]),

  G("cinematic", [
    "cinematic", "cinema", "film look", "movie look", "filmic",
    "киношный", "кино", "кинematografichny",
    "kinematografichny", "кінematографічний",
    "filmisch", "kinoreif",
    "cinématique", "cinéma",
    "cinematográfico", "cine",
    "cinematografico", "cinema",
    "cinematográfico", "cinema",
    "filmowy", "kinowy",
    "sinematik", "film",
    "filmisch", "cinematisch",
    "filmový", "kino",
    "电影感", "シネマ", "シネマティック", "시네마틱", "سينمائي", "सिनेमाई", "sinematik",
  ]),

  G("vintage", [
    "vintage", "retro", "old style", "classic look",
    "винтаж", "винтажный", "ретро",
    "vintazh", "вінтаж", "ретро",
    "vintage", "retro",
    "vintage", "rétro",
    "vintage", "retro",
    "vintage", "retrò",
    "vintage", "retrô",
    "vintage", "retro",
    "vintage", "retro",
    "vintage", "retro",
    "vintage", "retro",
    "复古", "ヴィンテージ", "빈티지", "كلاسيكي", "विंटेज", "vintage",
  ]),

  G("minimal", [
    "minimal", "minimalist", "minimalism", "clean look",
    "минимализм", "минималистичный", "минимальный",
    "minimalizm", "мінімалізм",
    "minimalismus", "minimalistisch",
    "minimalisme", "minimaliste",
    "minimalismo", "minimalista",
    "minimalismo", "minimalista",
    "minimalismo", "minimalista",
    "minimalizm", "minimalistyczny",
    "minimalizm", "minimalist",
    "minimalisme", "minimalistisch",
    "minimalismus", "minimalistický",
    "极简", "ミニマル", "미니멀", "minimal", "न्यूनतम", "minimal",
  ]),
];

// ── Indexes (built once at module load) ────────────────────────────────────

const TERM_TO_ENTRY = new Map<string, SearchDictionaryEntry>();
const ENTRY_TERM_SETS = new Map<string, Set<string>>();

function isIndexableTerm(term: string): boolean {
  const norm = normalizeSearchText(term);
  if (!norm) return false;
  if (norm.length >= 3) return true;
  return norm === "1" || norm === "2" || norm === "3+";
}

for (const entry of SEARCH_DICTIONARY) {
  const normalizedTerms = new Set<string>();

  for (const term of entry.terms) {
    const norm = normalizeSearchText(term);
    if (!isIndexableTerm(norm)) continue;
    normalizedTerms.add(norm);
    if (!TERM_TO_ENTRY.has(norm)) {
      TERM_TO_ENTRY.set(norm, entry);
    }
  }

  ENTRY_TERM_SETS.set(entry.id, normalizedTerms);
}

/** Alias cluster: every term in a group ↔ all siblings (for expandTextForSearch). */
export function buildDictionaryAliasClusters(): Map<string, Set<string>> {
  const clusters = new Map<string, Set<string>>();

  for (const entry of SEARCH_DICTIONARY) {
    const group = ENTRY_TERM_SETS.get(entry.id);
    if (!group || group.size === 0) continue;

    for (const member of group) {
      const existing = clusters.get(member) ?? new Set<string>();
      for (const sibling of group) existing.add(sibling);
      clusters.set(member, existing);
    }
  }

  return clusters;
}

export const DICTIONARY_ALIAS_CLUSTERS = buildDictionaryAliasClusters();

export function resolveDictionaryEntry(query: string): SearchDictionaryEntry | null {
  const normalized = normalizeSearchText(query);
  if (!normalized) return null;

  const direct = TERM_TO_ENTRY.get(normalized);
  if (direct) return direct;

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2);
  if (tokens.length === 1) {
    return TERM_TO_ENTRY.get(tokens[0]!) ?? null;
  }

  for (const token of tokens) {
    const entry = TERM_TO_ENTRY.get(token);
    if (entry) return entry;
  }

  return null;
}

export function getDictionaryTermSet(entryId: string): Set<string> {
  return ENTRY_TERM_SETS.get(entryId) ?? new Set();
}

export function dictionaryEntryToConcept(entry: SearchDictionaryEntry) {
  return {
    id: entry.id,
    filters: entry.filters,
    textTerms: entry.terms,
    normalizedTerms: [...(ENTRY_TERM_SETS.get(entry.id) ?? [])],
  };
}
