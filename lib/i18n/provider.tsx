"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/dictionaries";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { I18nProvider as AriaI18nProvider } from "react-aria-components";

import { toLocaleDigits } from "@/lib/i18n/numerals";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Maps an app locale to a react-aria locale, omitting `-u-nu-deva` so react-aria's NumberParser still auto-detects and accepts Latin digits alongside mr-IN's default Devanagari display. */
const ariaLocaleFor = (locale: Locale): string | undefined => {
  return locale === "mr" ? "mr-IN" : undefined;
};

/** Provides locale and messages context to child components. */
export const LocaleProvider = ({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) => {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return (
    <LocaleContext.Provider value={value}>
      <AriaI18nProvider locale={ariaLocaleFor(locale)}>
        {children}
      </AriaI18nProvider>
    </LocaleContext.Provider>
  );
};

/** Looks up a nested message by dot-separated key. */
const lookup = (messages: Messages, key: string): unknown => {
  return key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);
};

/** Interpolates template string with variables using {name} syntax, localizing digits. */
const interpolate = (
  template: string,
  locale: Locale,
  vars?: Record<string, string | number>,
): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? toLocaleDigits(vars[name], locale) : match,
  );
};

export type TFunction = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

/** Hook to access translation function within LocaleProvider. */
export const useT = (): TFunction => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useT must be used within a LocaleProvider");
  }
  const { messages, locale } = context;

  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = lookup(messages, key);
      if (typeof value !== "string") return key;
      return interpolate(value, locale, vars);
    },
    [messages, locale],
  );
};

/** Hook to access current locale within LocaleProvider. */
export const useLocale = (): Locale => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context.locale;
};
