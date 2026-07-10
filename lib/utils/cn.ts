import type { ClassValue } from "clsx";
import { clsx } from "clsx";

/** Merges class names using clsx. */
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};
