import "server-only";

import type { Locale } from "@/lib/i18n/config";

export type Messages = Record<string, unknown>;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/messages/en.json").then((module) => module.default),
};

/** Loads the message dictionary for a given locale. */
export const getDictionary = async (locale: Locale): Promise<Messages> => {
  return dictionaries[locale]();
};
