export type PoseCategory = "women" | "men" | "couples" | "family";
export type ShotType = "portrait" | "full-body" | "half-body" | "sitting" | "lying";
export type PeopleCount = "1" | "2" | "3+";
export type LocationTag =
  | "street"
  | "studio"
  | "bar"
  | "cafe"
  | "restaurant"
  | "park"
  | "beach"
  | "home"
  | "office"
  | "nature";
export type SessionType =
  | "portrait"
  | "love"
  | "family"
  | "story"
  | "fashion"
  | "wedding"
  | "maternity"
  | "business"
  | "creative";
export type StyleTag =
  | "candid"
  | "editorial"
  | "minimal"
  | "cinematic"
  | "vintage"
  | "dramatic"
  | "soft"
  | "dynamic";

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

export type AppTheme = "light" | "dark" | "system";
export type AppLanguage = "ru" | "en" | "uk";
