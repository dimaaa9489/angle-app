"use client";

import { useEffect, type RefObject } from "react";

const TOP_THRESHOLD = 4;

export function useHomeHeaderScroll(headerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scrollEl = document.querySelector<HTMLElement>(".angle-scroll");
    const header = headerRef.current;
    if (!scrollEl || !header) return;

    const syncHeight = () => {
      header.style.setProperty("--home-header-h", `${header.offsetHeight}px`);
    };

    syncHeight();
    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(header);

    let visible = true;
    const apply = (atTop: boolean) => {
      if (atTop === visible) return;
      visible = atTop;
      header.classList.toggle("angle-home-header-visible", atTop);
      header.classList.toggle("angle-home-header-hidden", !atTop);
    };

    const onScroll = () => {
      apply(scrollEl.scrollTop <= TOP_THRESHOLD);
    };

    header.classList.add("angle-home-header-visible");
    onScroll();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [headerRef]);
}
