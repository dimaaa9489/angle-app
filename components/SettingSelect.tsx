"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export type SettingSelectOption<T extends string> = {
  value: T;
  label: string;
};

type SettingSelectProps<T extends string> = {
  value: T;
  options: SettingSelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
};

export function SettingSelect<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SettingSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="angle-setting-select relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="angle-setting-select-trigger"
      >
        <span>{selected?.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="angle-setting-select-menu"
            role="listbox"
            aria-label={ariaLabel}
          >
            <LayoutGroup id={`${ariaLabel}-options`}>
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className="angle-setting-select-option relative"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {active ? (
                      <motion.span
                        layoutId={`${ariaLabel}-highlight`}
                        className="angle-setting-select-highlight"
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 320,
                        }}
                      />
                    ) : null}
                    <span className="relative z-[1]">{option.label}</span>
                    {active ? (
                      <Check size={14} strokeWidth={2.5} className="relative z-[1]" />
                    ) : (
                      <span className="w-3.5" aria-hidden />
                    )}
                  </button>
                );
              })}
            </LayoutGroup>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
