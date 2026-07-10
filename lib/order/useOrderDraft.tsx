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

function ensureInitialized(): void {
  if (initialized || typeof window === "undefined") return;
  snapshot = readDraft() ?? emptyDraft();
  initialized = true;
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): OrderDraft {
  ensureInitialized();
  return snapshot;
}

function getServerSnapshot(): OrderDraft {
  return SERVER_SNAPSHOT;
}

function setClientDetails(details: ClientDetails): void {
  ensureInitialized();
  snapshot = { ...snapshot, client: details, categoryId: null, items: [] };
  writeDraft(snapshot);
  emit();
}

function setCategory(categoryId: CategoryId): void {
  ensureInitialized();
  if (snapshot.categoryId === categoryId) return;
  snapshot = { ...snapshot, categoryId, items: [] };
  writeDraft(snapshot);
  emit();
}

function setItems(items: OrderItem[]): void {
  ensureInitialized();
  snapshot = { ...snapshot, items };
  writeDraft(snapshot);
  emit();
}

function resetAfterDownload(): void {
  ensureInitialized();
  snapshot = { ...snapshot, categoryId: null, items: [] };
  writeDraft(snapshot);
  emit();
}

function startNewClient(): void {
  clearDraft();
  snapshot = emptyDraft();
  initialized = true;
  emit();
}

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

export function useOrderDraft(): OrderDraftApi {
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
}
