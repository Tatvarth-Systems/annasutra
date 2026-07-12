/** Normalizes text for case/whitespace/Unicode-form-insensitive comparison. */
export const normalizeForCompare = (value: string): string => {
  return value.trim().normalize("NFC").toLowerCase();
};
