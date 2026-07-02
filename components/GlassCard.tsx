import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function GlassCard({ children, className = "", padding = "lg" }: GlassCardProps) {
  return (
    <div className={`angle-inner-glass text-white ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  );
}
