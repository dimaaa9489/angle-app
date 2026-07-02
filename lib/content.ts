export const IMAGES = {
  homeBackground:
    "https://images.unsplash.com/photo-1524502397800-2eeaad7d3b50?auto=format&fit=crop&w=1600&q=80",
  portrait:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=720&q=80",
  fullBody:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=720&q=80",
} as const;

/** 4 вкладки: Главная → Поиск → Избранное → Профиль */
export const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "home" as const },
  { href: "/search", label: "Поиск", icon: "search" as const },
  { href: "/favorites", label: "Избранное", icon: "heart" as const },
  { href: "/profile", label: "Профиль", icon: "user" as const },
] as const;
