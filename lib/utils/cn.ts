import { clsx, type ClassValue } from "clsx";

/** Merges class names using clsx. */
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};
