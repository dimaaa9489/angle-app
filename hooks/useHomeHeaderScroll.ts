"use client";

import { useEffect, useState, type RefObject } from "react";

const TOP_THRESHOLD = 12;

export function useHomeHeaderScroll(headerRef: RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let visible = true;
    const apply = (atTop: boolean) => {
      setScrolled(!atTop);
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

  return scrolled;
}
