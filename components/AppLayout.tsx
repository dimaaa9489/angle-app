import type { ReactNode } from "react";

import { BottomNav } from "@/components/BottomNav";
import { IMAGES } from "@/lib/content";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="angle-app-root">
      <div
        className="angle-bg-layer"
        style={{ backgroundImage: `url(${IMAGES.homeBackground})` }}
        aria-hidden
      />
      <div className="angle-vignette" aria-hidden />

      <div className="angle-content safe-top mx-auto w-full max-w-lg px-4 pb-28 pt-4">
        {children}
      </div>

      <div className="angle-bottom-nav-shell">
        <BottomNav />
      </div>
    </div>
  );
}
