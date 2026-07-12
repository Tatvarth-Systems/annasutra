"use client";

import { useRouter } from "next/navigation";

import { localeLabels, locales } from "@/lib/i18n/config";
import { writeLocaleCookie } from "@/lib/i18n/localeCookie";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

/** Toggle to switch the app's active locale, persisted via cookie. */
export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-full border border-line p-0.5"
    >
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === locale}
          disabled={option === locale}
          onClick={() => {
            writeLocaleCookie(option);
            router.refresh();
          }}
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
            option === locale
              ? "bg-brand text-white"
              : "text-muted hover:bg-brand-soft hover:text-ink",
          )}
        >
          {localeLabels[option]}
        </button>
      ))}
    </div>
  );
};
