"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/dictionaries";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo } from "react";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

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
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
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

/** Interpolates template string with variables using {name} syntax. */
const interpolate = (
  template: string,
  vars?: Record<string, string | number>,
): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
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
  const { messages } = context;

  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = lookup(messages, key);
      if (typeof value !== "string") return key;
      return interpolate(value, vars);
    },
    [messages],
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
