"use client";

import type { CategoryId } from "@/data/categories";
import type { ClientDetails, OrderDraft, OrderItem } from "@/lib/order/types";
import { useSyncExternalStore } from "react";

import {
  clearDraft,
  emptyDraft,
  readDraft,
  writeDraft,
} from "@/lib/order/storage";

type Listener = () => void;

let snapshot: OrderDraft = emptyDraft();
let initialized = false;
const listeners = new Set<Listener>();
const SERVER_SNAPSHOT: OrderDraft = emptyDraft();

/** Initializes snapshot from storage on first call. */
const ensureInitialized = (): void => {
  if (initialized || typeof window === "undefined") return;
  snapshot = readDraft() ?? emptyDraft();
  initialized = true;
};

/** Notifies all registered listeners of draft changes. */
const emit = (): void => {
  listeners.forEach((listener) => listener());
};

/** Registers a listener for draft changes and returns unsubscribe function. */
const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Returns current draft snapshot. */
const getSnapshot = (): OrderDraft => {
  ensureInitialized();
  return snapshot;
};

/** Server-side snapshot placeholder. */
const getServerSnapshot = (): OrderDraft => {
  return SERVER_SNAPSHOT;
};

/** Merges a patch into the draft, persists it, and notifies listeners. */
const applyPatch = (patch: Partial<OrderDraft>): void => {
  ensureInitialized();
  snapshot = { ...snapshot, ...patch };
  writeDraft(snapshot);
  emit();
};

/** Updates client details, clears category and items. */
const setClientDetails = (details: ClientDetails): void => {
  applyPatch({ client: details, categoryId: null, items: [] });
};

/** Updates category, clears items. */
const setCategory = (categoryId: CategoryId): void => {
  ensureInitialized();
  if (snapshot.categoryId === categoryId) return;
  applyPatch({ categoryId, items: [] });
};

/** Updates order items. */
const setItems = (items: OrderItem[]): void => {
  applyPatch({ items });
};

/** Clears category and items after download. */
const resetAfterDownload = (): void => {
  applyPatch({ categoryId: null, items: [] });
};

/** Clears entire draft and starts fresh client. */
const startNewClient = (): void => {
  ensureInitialized();
  clearDraft();
  snapshot = emptyDraft();
  emit();
};

type OrderDraftApi = {
  client: ClientDetails | null;
  categoryId: CategoryId | null;
  items: OrderItem[];
  setClientDetails: typeof setClientDetails;
  setCategory: typeof setCategory;
  setItems: typeof setItems;
  resetAfterDownload: typeof resetAfterDownload;
  startNewClient: typeof startNewClient;
};

/** Hook to access and modify order draft using external store. */
export const useOrderDraft = (): OrderDraftApi => {
  const draft = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    client: draft.client,
    categoryId: draft.categoryId,
    items: draft.items,
    setClientDetails,
    setCategory,
    setItems,
    resetAfterDownload,
    startNewClient,
  };
};
