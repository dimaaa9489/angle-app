import type { ReactNode } from "react";
import Image from "next/image";

import { IMAGES } from "@/lib/content";

export function AppShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-h-dvh overflow-hidden bg-[#D8C4B0] ${className}`}>
      <Image
        src={IMAGES.homeBackground}
        alt=""
        fill
        priority
        className="object-cover scale-105 blur-[2px]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(245,232,216,0.42)] backdrop-blur-[2px]" />
      <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
    </div>
  );
}
