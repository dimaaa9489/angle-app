"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Heart, Home, Search, User } from "lucide-react";
import { motion } from "framer-motion";

import { NAV_ITEMS } from "@/lib/content";
import { useTranslation } from "@/hooks/useTranslation";

const ICONS = {
  home: Home,
  search: Search,
  heart: Heart,
  user: User,
} as const;

type IndicatorState = {
  left: number;
  width: number;
  opacity: number;
};

const HIDDEN_INDICATOR: IndicatorState = { left: 0, width: 0, opacity: 0 };

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorState>(HIDDEN_INDICATOR);

  const activeIndex = NAV_ITEMS.findIndex((item) => {
    const baseHref = item.href.split("?")[0];
    return baseHref === "/"
      ? pathname === "/"
      : pathname === baseHref || pathname.startsWith(`${baseHref}/`);
  });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (activeIndex < 0) {
        setIndicator(HIDDEN_INDICATOR);
        return;
      }

      const container = containerRef.current;
      const activeItem = itemRefs.current[activeIndex];
      if (!container || !activeItem) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      setIndicator({
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeIndex, pathname]);

  return (
    <nav className="angle-bottom-nav shrink-0">
      <div ref={containerRef} className="relative flex items-stretch justify-between px-1.5 py-1.5">
        <motion.div
          className="angle-nav-indicator-slide"
          animate={{
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.opacity,
          }}
          transition={{ type: "spring", damping: 32, stiffness: 280, mass: 0.85 }}
        />

        {NAV_ITEMS.map((item, index) => {
          const baseHref = item.href.split("?")[0];
          const active =
            baseHref === "/"
              ? pathname === "/"
              : pathname === baseHref || pathname.startsWith(`${baseHref}/`);
          const Icon = ICONS[item.icon];

          return (
            <Link
              key={item.href}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              href={item.href}
              data-active={active}
              className="angle-nav-item relative z-[1] flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-2 py-1.5"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className={active ? "text-[var(--nav-text)]" : "text-[var(--nav-text-muted)]"}
              />
              <span
                className={`text-[10px] leading-none ${
                  active
                    ? "font-bold text-[var(--nav-text)]"
                    : "font-semibold text-[var(--nav-text-muted)]"
                }`}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
