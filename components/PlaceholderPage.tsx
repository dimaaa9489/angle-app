import type { ReactNode } from "react";

import { GlassCard } from "@/components/GlassCard";

export function PlaceholderPage({
  title,
  subtitle = "Скоро здесь будет контент",
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <GlassCard className="flex min-h-[50dvh] flex-col items-center justify-center text-center">
      <h1 className="text-[28px] font-extrabold text-[#2F251D]">{title}</h1>
      <p className="mt-2 text-[15px] text-[#7A6A5D]">{subtitle}</p>
      {children}
    </GlassCard>
  );
}
