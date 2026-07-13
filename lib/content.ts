export const IMAGES = {
  homeBackground:
    "https://images.unsplash.com/photo-1524502397800-2eeaad7d3b50?auto=format&fit=crop&w=1600&q=80",
  portrait:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=720&q=80",
  fullBody:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=720&q=80",
} as const;

/** 4 tabs: Home → Search → Favorites → Profile */
export const NAV_ITEMS = [
  { href: "/", icon: "home" as const, labelKey: "navHome" as const },
  { href: "/search", icon: "search" as const, labelKey: "navSearch" as const },
  { href: "/favorites", icon: "heart" as const, labelKey: "navFavorites" as const },
  { href: "/profile", icon: "user" as const, labelKey: "navProfile" as const },
] as const;
