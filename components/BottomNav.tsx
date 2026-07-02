"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Heart, Home, Search, User } from "lucide-react";

import { NAV_ITEMS } from "@/lib/content";

const ICONS = {
  home: Home,
  search: Search,
  heart: Heart,
  user: User,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="angle-bottom-nav safe-bottom shrink-0 border-t border-white/12">
      <div className="mx-auto flex max-w-lg items-center justify-between px-3 pt-2.5 pb-2">
        {NAV_ITEMS.map((item) => {
          const baseHref = item.href.split("?")[0];
          const active =
            baseHref === "/"
              ? pathname === "/"
              : pathname === baseHref || pathname.startsWith(`${baseHref}/`);
          const Icon = ICONS[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              className="angle-nav-item flex flex-1 flex-col items-center gap-1.5"
            >
              <Icon size={22} strokeWidth={active ? 2.3 : 1.9} />
              <span
                className={`text-[10px] leading-none ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
