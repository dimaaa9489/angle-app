"use client";

import { useEffect, type RefObject } from "react";

const TOP_THRESHOLD = 8;

export function useHomeHeaderScroll(headerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let visible = true;
    const apply = (atTop: boolean) => {
      if (atTop === visible) return;
      visible = atTop;
      header.classList.toggle("angle-home-header-visible", atTop);
      header.classList.toggle("angle-home-header-hidden", !atTop);
    };

    const onScroll = () => {
      apply(window.scrollY <= TOP_THRESHOLD);
    };

    header.classList.add("angle-home-header-visible");
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef]);
}
