"use client";

import type { Locale } from "@/lib/i18n/config";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Languages } from "lucide-react";

import { localeLabels, localeNames, locales } from "@/lib/i18n/config";
import { writeLocaleCookie } from "@/lib/i18n/localeCookie";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

/** Dropdown to switch the app's active locale, persisted via cookie. */
export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    /** Closes menu when clicking outside or pressing Escape. */
    const handleClose = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setOpen(false);
        return;
      }
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("keydown", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("keydown", handleClose);
    };
  }, [open]);

  /** Switches the active locale, persists it via cookie, and closes the menu. */
  const selectLocale = (option: Locale) => {
    setOpen(false);
    if (option === locale) return;
    writeLocaleCookie(option);
    router.refresh();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Language"
        className="flex items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm text-ink hover:bg-brand-soft"
      >
        <Languages className="h-4 w-4 text-brand" />
        <span>{localeLabels[locale]}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-36 overflow-hidden rounded-md border border-line bg-white py-1 shadow-lg"
        >
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              aria-current={option === locale ? "true" : undefined}
              onClick={() => selectLocale(option)}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm",
                option === locale
                  ? "bg-brand-soft font-medium text-brand"
                  : "text-ink hover:bg-brand-soft",
              )}
            >
              {localeNames[option]}
              {option === locale && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
