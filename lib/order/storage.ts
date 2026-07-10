import type { OrderDraft } from "@/lib/order/types";

const STORAGE_KEY = "annasutra:order-draft:v1";

export function emptyDraft(): OrderDraft {
  return { version: 1, client: null, categoryId: null, items: [] };
}

export function readDraft(): OrderDraft | null {
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
}

export function writeDraft(draft: OrderDraft): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
