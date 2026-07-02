"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PressableGlowProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export function PressableGlow({
  children,
  className = "",
  onClick,
  disabled,
}: PressableGlowProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`tap-glow rounded-2xl outline-none transition-shadow ${className}`}
    >
      {children}
    </motion.button>
  );
}
