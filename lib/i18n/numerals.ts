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

/** Converts Devanagari digits in a string to ASCII digits, leaving ASCII digits untouched. */
export const toAsciiDigits = (value: string): string => {
  return value.replace(/[०-९]/g, (digit) =>
    String(digit.charCodeAt(0) - 0x0966),
  );
};
