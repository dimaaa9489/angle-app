"use client";

import { useEffect, useState } from "react";

import { buildDynamicBgGradient } from "@/lib/dynamic-bg-gradient";
import { dynamicBgEngine } from "@/lib/dynamic-bg-engine";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function DynamicBackground() {
  const theme = useSettingsStore((s) => s.theme);
  const [displayRgb, setDisplayRgb] = useState("248,248,248");

  useEffect(() => {
    return dynamicBgEngine.subscribe((rgb) => {
      setDisplayRgb(rgb);
      document.documentElement.style.setProperty("--bg-dynamic-rgb", rgb);
    });
  }, []);

  return (
    <div className="angle-dynamic-bg-wrap" aria-hidden>
      <div
        className="angle-dynamic-bg-base"
        style={{ backgroundColor: `rgba(${displayRgb}, 0.4)` }}
        data-theme={theme}
      />
      <div
        className="angle-dynamic-bg-layer"
        style={{ background: buildDynamicBgGradient(displayRgb) }}
        data-theme={theme}
      />
    </div>
  );
}
