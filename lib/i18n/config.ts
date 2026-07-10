export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Resolves a locale string to a supported Locale or falls back to default. */
export const resolveLocale = (value: string | undefined): Locale => {
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
};
