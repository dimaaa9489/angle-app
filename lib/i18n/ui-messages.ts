import type { AppLanguage } from "@/lib/types";

export type UiMessages = {
  navHome: string;
  navSearch: string;
  navFavorites: string;
  navProfile: string;
  homeGreetingName: string;
  homeGreetingDefault: string;
  homeTitle: string;
  homeFeedLoading: string;
  homeFeedLoadingMore: string;
  homeFeedEnd: string;
  searchTitle: string;
  searchSubtitle: string;
  searchReset: string;
  searchLoading: string;
  searchFound: string;
  searchFoundLimited: string;
  searchPlaceholder: string;
  searchFilters: string;
  commonLoading: string;
  commonSave: string;
  commonCancel: string;
  commonClose: string;
  commonNothingFound: string;
  commonNothingFoundHint: string;
  profileTitle: string;
  profileSignInHint: string;
  profileSignInGoogle: string;
  profileSignOut: string;
  profileTheme: string;
  profileLanguage: string;
  profileSubscription: string;
  profilePrivacy: string;
  profileOpen: string;
  profileThemeLight: string;
  profileThemeDark: string;
  profileThemeSystem: string;
  profileSubscriptionSoon: string;
  profileSelectTheme: string;
  profileSelectLanguage: string;
  poseLoading: string;
  poseNotFound: string;
  poseLike: string;
  poseAddFolder: string;
  poseShare: string;
  poseFolderTitle: string;
  poseFolderSubtitle: string;
  favoritesTitle: string;
  favoritesSubtitle: string;
  favoritesAddFolder: string;
  favoritesNewFolder: string;
  favoritesSaved: string;
  favoritesPhotos: string;
  favoritesBackFolders: string;
  favoritesFolderName: string;
  favoritesRenameFolder: string;
  favoritesDeleteFolder: string;
  favoritesChooseAction: string;
  favoritesShare: string;
  favoritesRemoveFromFolder: string;
  shareLinkCopied: string;
  shareLinkCopyFailed: string;
};

const EN: UiMessages = {
  navHome: "Home",
  navSearch: "Search",
  navFavorites: "Favorites",
  navProfile: "Profile",
  homeGreetingName: "Hi, {name}!",
  homeGreetingDefault: "Hi, photographer! 👋",
  homeTitle: "What are we shooting today?",
  homeFeedLoading: "Loading feed…",
  homeFeedLoadingMore: "Loading more…",
  homeFeedEnd: "You've seen everything",
  searchTitle: "Search",
  searchSubtitle: "Filters and keywords",
  searchReset: "Reset",
  searchLoading: "Loading…",
  searchFound: "Found: {count}",
  searchFoundLimited: "Found: {count} (showing first {limit})",
  searchPlaceholder: "Search poses and ideas",
  searchFilters: "Filters",
  commonLoading: "Loading…",
  commonSave: "Save",
  commonCancel: "Cancel",
  commonClose: "Close",
  commonNothingFound: "Nothing found",
  commonNothingFoundHint: "Change filters or search query",
  profileTitle: "Profile",
  profileSignInHint: "Sign in to sync favorites",
  profileSignInGoogle: "Sign in with Google",
  profileSignOut: "Sign out",
  profileTheme: "Theme",
  profileLanguage: "Language",
  profileSubscription: "Subscription",
  profilePrivacy: "Privacy",
  profileOpen: "Open",
  profileThemeLight: "Light",
  profileThemeDark: "Dark",
  profileThemeSystem: "System",
  profileSubscriptionSoon: "Soon",
  profileSelectTheme: "Choose theme",
  profileSelectLanguage: "Choose language",
  poseLoading: "Loading…",
  poseNotFound: "Pose not found",
  poseLike: "Like",
  poseAddFolder: "Add to folder",
  poseShare: "Share",
  poseFolderTitle: "Add to folder",
  poseFolderSubtitle: "Choose a folder below",
  favoritesTitle: "Favorites",
  favoritesSubtitle: "Folders with saved poses",
  favoritesAddFolder: "Add folder",
  favoritesNewFolder: "New folder",
  favoritesSaved: "Saved",
  favoritesPhotos: "{count} photos",
  favoritesBackFolders: "Back to folders",
  favoritesFolderName: "Folder name",
  favoritesRenameFolder: "Rename folder",
  favoritesDeleteFolder: "Delete folder",
  favoritesChooseAction: "Choose an action for this photo",
  favoritesShare: "Share",
  favoritesRemoveFromFolder: "Remove from folder",
  shareLinkCopied: "Link copied",
  shareLinkCopyFailed: "Could not copy link",
};

const RU: UiMessages = {
  navHome: "Главная",
  navSearch: "Поиск",
  navFavorites: "Избранное",
  navProfile: "Профиль",
  homeGreetingName: "Привет, {name}!",
  homeGreetingDefault: "Привет, фотограф! 👋",
  homeTitle: "Что сегодня будем фотографировать?",
  homeFeedLoading: "Загружаем ленту…",
  homeFeedLoadingMore: "Загружаем ещё…",
  homeFeedEnd: "Вы посмотрели всё",
  searchTitle: "Поиск",
  searchSubtitle: "Фильтры и ключевые слова",
  searchReset: "Сбросить",
  searchLoading: "Загружаем…",
  searchFound: "Найдено: {count}",
  searchFoundLimited: "Найдено: {count} (показаны первые {limit})",
  searchPlaceholder: "Поиск поз и идей",
  searchFilters: "Фильтры",
  commonLoading: "Загрузка…",
  commonSave: "Сохранить",
  commonCancel: "Отмена",
  commonClose: "Закрыть",
  commonNothingFound: "Ничего не найдено",
  commonNothingFoundHint: "Измените фильтры или поисковый запрос",
  profileTitle: "Профиль",
  profileSignInHint: "Войдите, чтобы синхронизировать избранное",
  profileSignInGoogle: "Войти через Google",
  profileSignOut: "Выйти",
  profileTheme: "Тема",
  profileLanguage: "Язык",
  profileSubscription: "Подписка",
  profilePrivacy: "Политика",
  profileOpen: "Открыть",
  profileThemeLight: "Светлая",
  profileThemeDark: "Тёмная",
  profileThemeSystem: "Системная",
  profileSubscriptionSoon: "Скоро",
  profileSelectTheme: "Выбор темы",
  profileSelectLanguage: "Выбор языка",
  poseLoading: "Загрузка…",
  poseNotFound: "Поза не найдена",
  poseLike: "Лайк",
  poseAddFolder: "В папку",
  poseShare: "Поделиться",
  poseFolderTitle: "Добавить в папку",
  poseFolderSubtitle: "Выберите одну из папок ниже",
  favoritesTitle: "Избранное",
  favoritesSubtitle: "Папки с сохранёнными позами",
  favoritesAddFolder: "Добавить папку",
  favoritesNewFolder: "Новая папка",
  favoritesSaved: "Сохранённое",
  favoritesPhotos: "{count} фото",
  favoritesBackFolders: "Назад к папкам",
  favoritesFolderName: "Название папки",
  favoritesRenameFolder: "Переименовать папку",
  favoritesDeleteFolder: "Удалить папку",
  favoritesChooseAction: "Выберите действие для этой фотографии",
  favoritesShare: "Поделиться",
  favoritesRemoveFromFolder: "Удалить из папки",
  shareLinkCopied: "Ссылка скопирована",
  shareLinkCopyFailed: "Не удалось скопировать ссылку",
};

function mergeMessages(base: UiMessages, patch: Partial<UiMessages>): UiMessages {
  return { ...base, ...patch };
}

const UK: UiMessages = mergeMessages(EN, {
  navHome: "Головна",
  navSearch: "Пошук",
  navFavorites: "Обране",
  navProfile: "Профіль",
  homeGreetingName: "Привіт, {name}!",
  homeGreetingDefault: "Привіт, фотографе! 👋",
  homeTitle: "Що сьогодні будемо фотографувати?",
  homeFeedLoading: "Завантажуємо стрічку…",
  homeFeedLoadingMore: "Завантажуємо ще…",
  homeFeedEnd: "Ви переглянули все",
  searchTitle: "Пошук",
  searchSubtitle: "Фільтри та ключові слова",
  searchReset: "Скинути",
  searchLoading: "Завантажуємо…",
  searchFound: "Знайдено: {count}",
  searchFoundLimited: "Знайдено: {count} (показано перші {limit})",
  searchPlaceholder: "Пошук поз і ідей",
  searchFilters: "Фільтри",
  commonLoading: "Завантаження…",
  commonSave: "Зберегти",
  commonCancel: "Скасувати",
  commonClose: "Закрити",
  commonNothingFound: "Нічого не знайдено",
  commonNothingFoundHint: "Змініть фільтри або пошуковий запит",
  profileTitle: "Профіль",
  profileSignInHint: "Увійдіть, щоб синхронізувати обране",
  profileSignInGoogle: "Увійти через Google",
  profileSignOut: "Вийти",
  profileTheme: "Тема",
  profileLanguage: "Мова",
  profileSubscription: "Підписка",
  profilePrivacy: "Політика",
  profileOpen: "Відкрити",
  profileThemeLight: "Світла",
  profileThemeDark: "Темна",
  profileThemeSystem: "Системна",
  profileSubscriptionSoon: "Незабаром",
  profileSelectTheme: "Вибір теми",
  profileSelectLanguage: "Вибір мови",
  poseNotFound: "Позу не знайдено",
  poseLike: "Лайк",
  poseAddFolder: "У папку",
  poseShare: "Поділитися",
  poseFolderTitle: "Додати в папку",
  poseFolderSubtitle: "Оберіть одну з папок нижче",
  favoritesTitle: "Обране",
  favoritesSubtitle: "Папки зі збереженими позами",
  favoritesAddFolder: "Додати папку",
  favoritesNewFolder: "Нова папка",
  favoritesSaved: "Збережене",
  favoritesPhotos: "{count} фото",
  favoritesBackFolders: "Назад до папок",
  favoritesFolderName: "Назва папки",
  favoritesRenameFolder: "Перейменувати папку",
  favoritesDeleteFolder: "Видалити папку",
  favoritesChooseAction: "Оберіть дію для цього фото",
  favoritesShare: "Поділитися",
  favoritesRemoveFromFolder: "Видалити з папки",
  shareLinkCopied: "Посилання скопійовано",
});

const DE: UiMessages = mergeMessages(EN, {
  navHome: "Start",
  navSearch: "Suche",
  navFavorites: "Favoriten",
  navProfile: "Profil",
  homeGreetingName: "Hallo, {name}!",
  homeGreetingDefault: "Hallo, Fotograf! 👋",
  homeTitle: "Was fotografieren wir heute?",
  homeFeedLoading: "Feed wird geladen…",
  homeFeedLoadingMore: "Mehr laden…",
  homeFeedEnd: "Du hast alles gesehen",
  searchSubtitle: "Filter und Stichwörter",
  searchReset: "Zurücksetzen",
  searchFound: "Gefunden: {count}",
  searchFoundLimited: "Gefunden: {count} (erste {limit})",
  searchPlaceholder: "Posen und Ideen suchen",
  searchFilters: "Filter",
  commonSave: "Speichern",
  commonCancel: "Abbrechen",
  commonClose: "Schließen",
  commonNothingFound: "Nichts gefunden",
  commonNothingFoundHint: "Filter oder Suchbegriff ändern",
  profileSignInHint: "Anmelden, um Favoriten zu synchronisieren",
  profileSignInGoogle: "Mit Google anmelden",
  profileSignOut: "Abmelden",
  profileTheme: "Design",
  profileLanguage: "Sprache",
  profileSubscription: "Abo",
  profilePrivacy: "Datenschutz",
  profileOpen: "Öffnen",
  profileThemeLight: "Hell",
  profileThemeDark: "Dunkel",
  profileThemeSystem: "System",
  profileSubscriptionSoon: "Bald",
  favoritesTitle: "Favoriten",
  favoritesSubtitle: "Ordner mit gespeicherten Posen",
  favoritesNewFolder: "Neuer Ordner",
  favoritesSaved: "Gespeichert",
  favoritesPhotos: "{count} Fotos",
  shareLinkCopied: "Link kopiert",
});

const FR: UiMessages = mergeMessages(EN, {
  navHome: "Accueil",
  navSearch: "Recherche",
  navFavorites: "Favoris",
  navProfile: "Profil",
  homeGreetingName: "Salut, {name} !",
  homeGreetingDefault: "Salut, photographe ! 👋",
  homeTitle: "Que photographions-nous aujourd'hui ?",
  homeFeedLoading: "Chargement du fil…",
  homeFeedLoadingMore: "Chargement…",
  homeFeedEnd: "Vous avez tout vu",
  searchSubtitle: "Filtres et mots-clés",
  searchReset: "Réinitialiser",
  searchFound: "Trouvé : {count}",
  searchFoundLimited: "Trouvé : {count} (premiers {limit})",
  searchPlaceholder: "Rechercher des poses et idées",
  searchFilters: "Filtres",
  commonSave: "Enregistrer",
  commonCancel: "Annuler",
  commonClose: "Fermer",
  commonNothingFound: "Rien trouvé",
  commonNothingFoundHint: "Modifiez les filtres ou la recherche",
  profileSignInHint: "Connectez-vous pour synchroniser les favoris",
  profileSignInGoogle: "Se connecter avec Google",
  profileSignOut: "Se déconnecter",
  profileTheme: "Thème",
  profileLanguage: "Langue",
  profileSubscription: "Abonnement",
  profilePrivacy: "Confidentialité",
  profileOpen: "Ouvrir",
  profileThemeLight: "Clair",
  profileThemeDark: "Sombre",
  profileThemeSystem: "Système",
  profileSubscriptionSoon: "Bientôt",
  favoritesTitle: "Favoris",
  favoritesSubtitle: "Dossiers avec poses enregistrées",
  favoritesNewFolder: "Nouveau dossier",
  favoritesSaved: "Enregistré",
  favoritesPhotos: "{count} photos",
  shareLinkCopied: "Lien copié",
});

const ES: UiMessages = mergeMessages(EN, {
  navHome: "Inicio",
  navSearch: "Buscar",
  navFavorites: "Favoritos",
  navProfile: "Perfil",
  homeGreetingName: "¡Hola, {name}!",
  homeGreetingDefault: "¡Hola, fotógrafo! 👋",
  homeTitle: "¿Qué fotografiamos hoy?",
  homeFeedLoading: "Cargando feed…",
  homeFeedLoadingMore: "Cargando más…",
  homeFeedEnd: "Has visto todo",
  searchSubtitle: "Filtros y palabras clave",
  searchReset: "Restablecer",
  searchFound: "Encontrado: {count}",
  searchFoundLimited: "Encontrado: {count} (primeros {limit})",
  searchPlaceholder: "Buscar poses e ideas",
  searchFilters: "Filtros",
  commonSave: "Guardar",
  commonCancel: "Cancelar",
  commonClose: "Cerrar",
  commonNothingFound: "No se encontró nada",
  commonNothingFoundHint: "Cambia filtros o búsqueda",
  profileSignInHint: "Inicia sesión para sincronizar favoritos",
  profileSignInGoogle: "Entrar con Google",
  profileSignOut: "Cerrar sesión",
  profileTheme: "Tema",
  profileLanguage: "Idioma",
  profileSubscription: "Suscripción",
  profilePrivacy: "Privacidad",
  profileOpen: "Abrir",
  profileThemeLight: "Claro",
  profileThemeDark: "Oscuro",
  profileThemeSystem: "Sistema",
  profileSubscriptionSoon: "Pronto",
  favoritesTitle: "Favoritos",
  favoritesSubtitle: "Carpetas con poses guardadas",
  favoritesNewFolder: "Nueva carpeta",
  favoritesSaved: "Guardado",
  favoritesPhotos: "{count} fotos",
  shareLinkCopied: "Enlace copiado",
});

const IT: UiMessages = mergeMessages(EN, {
  navHome: "Home",
  navSearch: "Cerca",
  navFavorites: "Preferiti",
  navProfile: "Profilo",
  homeGreetingName: "Ciao, {name}!",
  homeGreetingDefault: "Ciao, fotografo! 👋",
  homeTitle: "Cosa fotografiamo oggi?",
  searchSubtitle: "Filtri e parole chiave",
  searchReset: "Reimposta",
  searchPlaceholder: "Cerca pose e idee",
  commonSave: "Salva",
  commonCancel: "Annulla",
  commonClose: "Chiudi",
  commonNothingFound: "Nessun risultato",
  profileSignInGoogle: "Accedi con Google",
  profileSignOut: "Esci",
  profileTheme: "Tema",
  profileLanguage: "Lingua",
  favoritesTitle: "Preferiti",
  favoritesNewFolder: "Nuova cartella",
  shareLinkCopied: "Link copiato",
});

const PT: UiMessages = mergeMessages(EN, {
  navHome: "Início",
  navSearch: "Buscar",
  navFavorites: "Favoritos",
  navProfile: "Perfil",
  homeGreetingName: "Olá, {name}!",
  homeGreetingDefault: "Olá, fotógrafo! 👋",
  homeTitle: "O que vamos fotografar hoje?",
  searchSubtitle: "Filtros e palavras-chave",
  searchReset: "Redefinir",
  searchPlaceholder: "Buscar poses e ideias",
  commonSave: "Salvar",
  commonCancel: "Cancelar",
  commonClose: "Fechar",
  profileSignInGoogle: "Entrar com Google",
  profileSignOut: "Sair",
  favoritesTitle: "Favoritos",
  favoritesNewFolder: "Nova pasta",
  shareLinkCopied: "Link copiado",
});

const PL: UiMessages = mergeMessages(EN, {
  navHome: "Główna",
  navSearch: "Szukaj",
  navFavorites: "Ulubione",
  navProfile: "Profil",
  homeGreetingName: "Cześć, {name}!",
  homeGreetingDefault: "Cześć, fotografie! 👋",
  homeTitle: "Co dziś fotografujemy?",
  searchSubtitle: "Filtry i słowa kluczowe",
  searchReset: "Resetuj",
  searchPlaceholder: "Szukaj poz i pomysłów",
  commonSave: "Zapisz",
  commonCancel: "Anuluj",
  commonClose: "Zamknij",
  profileSignInGoogle: "Zaloguj przez Google",
  profileSignOut: "Wyloguj",
  favoritesTitle: "Ulubione",
  favoritesNewFolder: "Nowy folder",
  shareLinkCopied: "Link skopiowany",
});

const TR: UiMessages = mergeMessages(EN, {
  navHome: "Ana sayfa",
  navSearch: "Ara",
  navFavorites: "Favoriler",
  navProfile: "Profil",
  homeGreetingName: "Merhaba, {name}!",
  homeGreetingDefault: "Merhaba, fotoğrafçı! 👋",
  homeTitle: "Bugün ne çekiyoruz?",
  searchSubtitle: "Filtreler ve anahtar kelimeler",
  searchReset: "Sıfırla",
  searchPlaceholder: "Poz ve fikir ara",
  commonSave: "Kaydet",
  commonCancel: "İptal",
  commonClose: "Kapat",
  profileSignInGoogle: "Google ile giriş",
  profileSignOut: "Çıkış",
  favoritesTitle: "Favoriler",
  favoritesNewFolder: "Yeni klasör",
  shareLinkCopied: "Bağlantı kopyalandı",
});

const NL: UiMessages = mergeMessages(EN, {
  navHome: "Home",
  navSearch: "Zoeken",
  navFavorites: "Favorieten",
  navProfile: "Profiel",
  homeGreetingName: "Hoi, {name}!",
  homeGreetingDefault: "Hoi, fotograaf! 👋",
  homeTitle: "Wat fotograferen we vandaag?",
  searchSubtitle: "Filters en zoekwoorden",
  searchReset: "Reset",
  searchPlaceholder: "Zoek poses en ideeën",
  commonSave: "Opslaan",
  commonCancel: "Annuleren",
  commonClose: "Sluiten",
  profileSignInGoogle: "Inloggen met Google",
  profileSignOut: "Uitloggen",
  favoritesTitle: "Favorieten",
  favoritesNewFolder: "Nieuwe map",
  shareLinkCopied: "Link gekopieerd",
});

const CS: UiMessages = mergeMessages(EN, {
  navHome: "Domů",
  navSearch: "Hledat",
  navFavorites: "Oblíbené",
  navProfile: "Profil",
  homeGreetingName: "Ahoj, {name}!",
  homeGreetingDefault: "Ahoj, fotografu! 👋",
  homeTitle: "Co dnes fotíme?",
  searchSubtitle: "Filtry a klíčová slova",
  searchReset: "Resetovat",
  searchPlaceholder: "Hledat pózy a nápady",
  commonSave: "Uložit",
  commonCancel: "Zrušit",
  commonClose: "Zavřít",
  profileSignInGoogle: "Přihlásit přes Google",
  profileSignOut: "Odhlásit",
  favoritesTitle: "Oblíbené",
  favoritesNewFolder: "Nová složka",
  shareLinkCopied: "Odkaz zkopírován",
});

const ZH: UiMessages = mergeMessages(EN, {
  navHome: "首页",
  navSearch: "搜索",
  navFavorites: "收藏",
  navProfile: "个人资料",
  homeGreetingName: "你好，{name}！",
  homeGreetingDefault: "你好，摄影师！👋",
  homeTitle: "今天拍什么？",
  homeFeedLoading: "加载动态…",
  homeFeedLoadingMore: "加载更多…",
  homeFeedEnd: "已全部看完",
  searchSubtitle: "筛选和关键词",
  searchReset: "重置",
  searchFound: "找到：{count}",
  searchPlaceholder: "搜索姿势和创意",
  searchFilters: "筛选",
  commonSave: "保存",
  commonCancel: "取消",
  commonClose: "关闭",
  commonNothingFound: "未找到结果",
  commonNothingFoundHint: "更改筛选或搜索词",
  profileSignInGoogle: "使用 Google 登录",
  profileSignOut: "退出",
  profileTheme: "主题",
  profileLanguage: "语言",
  favoritesTitle: "收藏",
  favoritesNewFolder: "新文件夹",
  shareLinkCopied: "链接已复制",
});

const JA: UiMessages = mergeMessages(EN, {
  navHome: "ホーム",
  navSearch: "検索",
  navFavorites: "お気に入り",
  navProfile: "プロフィール",
  homeGreetingName: "こんにちは、{name}！",
  homeGreetingDefault: "こんにちは、フォトグラファー！👋",
  homeTitle: "今日は何を撮りますか？",
  searchSubtitle: "フィルターとキーワード",
  searchReset: "リセット",
  searchPlaceholder: "ポーズとアイデアを検索",
  commonSave: "保存",
  commonCancel: "キャンセル",
  commonClose: "閉じる",
  commonNothingFound: "見つかりませんでした",
  profileSignInGoogle: "Googleでログイン",
  profileSignOut: "ログアウト",
  favoritesTitle: "お気に入り",
  favoritesNewFolder: "新しいフォルダ",
  shareLinkCopied: "リンクをコピーしました",
});

const KO: UiMessages = mergeMessages(EN, {
  navHome: "홈",
  navSearch: "검색",
  navFavorites: "즐겨찾기",
  navProfile: "프로필",
  homeGreetingName: "안녕하세요, {name}!",
  homeGreetingDefault: "안녕하세요, 사진작가님! 👋",
  homeTitle: "오늘 무엇을 촬영할까요?",
  searchSubtitle: "필터 및 키워드",
  searchReset: "초기화",
  searchPlaceholder: "포즈와 아이디어 검색",
  commonSave: "저장",
  commonCancel: "취소",
  commonClose: "닫기",
  commonNothingFound: "결과 없음",
  profileSignInGoogle: "Google로 로그인",
  profileSignOut: "로그아웃",
  favoritesTitle: "즐겨찾기",
  favoritesNewFolder: "새 폴더",
  shareLinkCopied: "링크가 복사되었습니다",
});

const AR: UiMessages = mergeMessages(EN, {
  navHome: "الرئيسية",
  navSearch: "بحث",
  navFavorites: "المفضلة",
  navProfile: "الملف الشخصي",
  homeGreetingName: "مرحباً، {name}!",
  homeGreetingDefault: "مرحباً أيها المصور! 👋",
  homeTitle: "ماذا نصور اليوم؟",
  searchSubtitle: "الفلاتر والكلمات المفتاحية",
  searchReset: "إعادة تعيين",
  searchPlaceholder: "ابحث عن أوضاع وأفكار",
  commonSave: "حفظ",
  commonCancel: "إلغاء",
  commonClose: "إغلاق",
  commonNothingFound: "لم يتم العثور على نتائج",
  profileSignInGoogle: "تسجيل الدخول عبر Google",
  profileSignOut: "تسجيل الخروج",
  favoritesTitle: "المفضلة",
  favoritesNewFolder: "مجلد جديد",
  shareLinkCopied: "تم نسخ الرابط",
});

const HI: UiMessages = mergeMessages(EN, {
  navHome: "होम",
  navSearch: "खोज",
  navFavorites: "पसंदीदा",
  navProfile: "प्रोफ़ाइल",
  homeGreetingName: "नमस्ते, {name}!",
  homeGreetingDefault: "नमस्ते, फोटोग्राफर! 👋",
  homeTitle: "आज हम क्या शूट करेंगे?",
  searchSubtitle: "फ़िल्टर और कीवर्ड",
  searchReset: "रीसेट",
  searchPlaceholder: "पोज़ और आइडिया खोजें",
  commonSave: "सहेजें",
  commonCancel: "रद्द करें",
  commonClose: "बंद करें",
  profileSignInGoogle: "Google से साइन इन",
  profileSignOut: "साइन आउट",
  favoritesTitle: "पसंदीदा",
  favoritesNewFolder: "नया फ़ोल्डर",
  shareLinkCopied: "लिंक कॉपी हो गया",
});

const ID: UiMessages = mergeMessages(EN, {
  navHome: "Beranda",
  navSearch: "Cari",
  navFavorites: "Favorit",
  navProfile: "Profil",
  homeGreetingName: "Hai, {name}!",
  homeGreetingDefault: "Hai, fotografer! 👋",
  homeTitle: "Apa yang kita foto hari ini?",
  searchSubtitle: "Filter dan kata kunci",
  searchReset: "Reset",
  searchPlaceholder: "Cari pose dan ide",
  commonSave: "Simpan",
  commonCancel: "Batal",
  commonClose: "Tutup",
  profileSignInGoogle: "Masuk dengan Google",
  profileSignOut: "Keluar",
  favoritesTitle: "Favorit",
  favoritesNewFolder: "Folder baru",
  shareLinkCopied: "Tautan disalin",
});

export const UI_MESSAGES: Record<AppLanguage, UiMessages> = {
  ru: RU,
  en: EN,
  uk: UK,
  de: DE,
  fr: FR,
  es: ES,
  it: IT,
  pt: PT,
  pl: PL,
  tr: TR,
  nl: NL,
  cs: CS,
  zh: ZH,
  ja: JA,
  ko: KO,
  ar: AR,
  hi: HI,
  id: ID,
};

export type UiMessageKey = keyof UiMessages;

export function translate(
  lang: AppLanguage,
  key: UiMessageKey,
  params?: Record<string, string | number>
): string {
  const template = UI_MESSAGES[lang]?.[key] ?? UI_MESSAGES.en[key] ?? key;
  if (!params) return template;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}
