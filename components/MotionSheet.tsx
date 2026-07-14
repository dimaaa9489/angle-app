"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { useTranslation } from "@/hooks/useTranslation";

type MotionSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  opaque?: boolean;
};

export function MotionSheet({
  open,
  onClose,
  children,
  className = "",
  opaque = false,
}: MotionSheetProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label={t("commonClose")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="angle-sheet-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`angle-sheet safe-bottom p-4 ${opaque ? "angle-sheet--opaque" : ""} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="angle-sheet-handle" />
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
