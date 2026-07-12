import type { Locale } from "@/lib/i18n/config";

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

/** Converts ASCII digits in a value to Devanagari digits for the mr locale. */
export const toLocaleDigits = (
  value: string | number,
  locale: Locale,
): string => {
  const text = String(value);
  if (locale !== "mr") return text;
  return text.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)]);
};
