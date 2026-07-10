"use client";

import { useSyncExternalStore } from "react";
import type { CategoryId } from "@/data/categories";
import type { ClientDetails, OrderDraft, OrderItem } from "@/lib/order/types";
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

/** Updates client details, clears category and items. */
const setClientDetails = (details: ClientDetails): void => {
  ensureInitialized();
  snapshot = { ...snapshot, client: details, categoryId: null, items: [] };
  writeDraft(snapshot);
  emit();
};

/** Updates category, clears items. */
const setCategory = (categoryId: CategoryId): void => {
  ensureInitialized();
  if (snapshot.categoryId === categoryId) return;
  snapshot = { ...snapshot, categoryId, items: [] };
  writeDraft(snapshot);
  emit();
};

/** Updates order items. */
const setItems = (items: OrderItem[]): void => {
  ensureInitialized();
  snapshot = { ...snapshot, items };
  writeDraft(snapshot);
  emit();
};

/** Clears category and items after download. */
const resetAfterDownload = (): void => {
  ensureInitialized();
  snapshot = { ...snapshot, categoryId: null, items: [] };
  writeDraft(snapshot);
  emit();
};

/** Clears entire draft and starts fresh client. */
const startNewClient = (): void => {
  clearDraft();
  snapshot = emptyDraft();
  initialized = true;
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
