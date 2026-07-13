import type { ReactNode } from "react";

import { BottomNav } from "@/components/BottomNav";
import { DynamicBackground } from "@/components/DynamicBackground";
import { ShareToast } from "@/components/ShareToast";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="angle-app-root">
      <DynamicBackground />

      <div className="angle-content mx-auto w-full max-w-lg px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))]">
        {children}

        <div className="angle-bottom-nav-shell">
          <BottomNav />
        </div>

        <ShareToast />
      </div>
    </div>
  );
}
