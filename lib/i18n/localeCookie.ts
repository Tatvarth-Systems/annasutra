import type { Locale } from "@/lib/i18n/config";

export const LOCALE_COOKIE = "as_locale";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** Writes the locale cookie so the server can pick it up on the next request. */
export const writeLocaleCookie = (locale: Locale): void => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
};
