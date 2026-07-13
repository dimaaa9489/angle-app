export type PoseCategory = "women" | "men" | "couples" | "family" | "kids" | "group";
export type ShotType =
  | "portrait"
  | "full-body"
  | "half-body"
  | "sitting"
  | "lying"
  | "close-up"
  | "profile";
export type PeopleCount = "1" | "2" | "3+";
export type LocationTag =
  | "studio"
  | "street"
  | "urban"
  | "park"
  | "forest"
  | "beach"
  | "nature"
  | "home"
  | "loft"
  | "hotel"
  | "cafe"
  | "restaurant"
  | "bar"
  | "office"
  | "rooftop"
  | "balcony"
  | "garden"
  | "pool"
  | "lake"
  | "mountains"
  | "museum"
  | "gym"
  | "night-city"
  | "countryside"
  | "subway";
export type SessionType =
  | "portrait"
  | "love"
  | "family"
  | "story"
  | "fashion"
  | "wedding"
  | "maternity"
  | "business"
  | "creative"
  | "boudoir"
  | "newborn"
  | "event"
  | "graduation"
  | "kids";
export type StyleTag =
  | "candid"
  | "editorial"
  | "minimal"
  | "cinematic"
  | "vintage"
  | "dramatic"
  | "soft"
  | "dynamic"
  | "natural-light"
  | "high-key"
  | "low-key"
  | "film"
  | "boho"
  | "elegant"
  | "lifestyle"
  | "moody"
  | "romantic"
  | "commercial"
  | "bright"
  | "dark"
  | "sporty"
  | "gritty";

export type Pose = {
  id: string;
  imageUrl: string;
  imageKey?: string;
  title: string;
  keywords: string[];
  category: PoseCategory;
  shotType: ShotType;
  locations: LocationTag[];
  peopleCount: PeopleCount[];
  sessionTypes: SessionType[];
  styles: StyleTag[];
  createdAt: string;
};

export type FavoriteFolder = {
  id: string;
  name: string;
  isPinned: boolean;
  createdAt: string;
};

export type FavoriteItem = {
  poseId: string;
  folderId: string;
  savedAt: string;
};

export type PoseFilters = {
  query: string;
  locations: LocationTag[];
  peopleCount: PeopleCount[];
  shotTypes: ShotType[];
  sessionTypes: SessionType[];
  styles: StyleTag[];
  categories: PoseCategory[];
};

export type PoseFilterSelection = Omit<PoseFilters, "query">;

export type AppTheme = "light" | "dark" | "system";
export type AppLanguage =
  | "ru"
  | "en"
  | "uk"
  | "de"
  | "fr"
  | "es"
  | "it"
  | "pt"
  | "pl"
  | "tr"
  | "nl"
  | "cs"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "hi"
  | "id";
