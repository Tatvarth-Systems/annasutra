import type { OrderDraft } from "@/lib/order/types";

const STORAGE_KEY = "annasutra:order-draft:v1";

/** Returns an empty order draft. */
export const emptyDraft = (): OrderDraft => {
  return { version: 1, client: null, categoryId: null, items: [] };
};

/** Reads order draft from localStorage, returns null if missing or invalid. */
export const readDraft = (): OrderDraft | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<OrderDraft> | null;
    if (!parsed || parsed.version !== 1) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed as OrderDraft;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/** Writes order draft to localStorage. */
export const writeDraft = (draft: OrderDraft): void => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
};

/** Removes order draft from localStorage. */
export const clearDraft = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
