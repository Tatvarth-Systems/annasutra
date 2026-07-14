"use client";

import type { CatalogItem } from "@/data/catalog/types";
import type { CategoryId } from "@/data/categories";
import type { Unit } from "@/data/units";
import type { OrderItem } from "@/lib/order/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CUSTOM_ITEM_ID, getItemsForCategory } from "@/data/catalog";

export type ChecklistRow = { qty: number; unit: Unit };
type ChecklistState = Record<string, ChecklistRow>;

const FLUSH_DELAY_MS = 300;

/** Builds initial checklist rows for every catalog item, hydrating qty/unit from any matching draft item. */
const buildChecklist = (
  catalogItems: CatalogItem[],
  draftItems: OrderItem[],
): ChecklistState => {
  const existing = new Map(draftItems.map((item) => [item.itemId, item]));
  const state: ChecklistState = {};
  for (const item of catalogItems) {
    const match = existing.get(item.id);
    state[item.id] = match
      ? { qty: match.qty, unit: match.unit }
      : { qty: 0, unit: item.defaultUnit };
  }
  return state;
};

/** Extracts the custom (off-catalog) items from a draft's item list. */
const buildCustomItems = (draftItems: OrderItem[]): OrderItem[] => {
  return draftItems.filter((item) => item.itemId === CUSTOM_ITEM_ID);
};

/** Derives the draft's OrderItem list from checklist rows (qty > 0 only) plus custom items. */
const buildOrderItems = (
  catalogItems: CatalogItem[],
  checklist: ChecklistState,
  customItems: OrderItem[],
): OrderItem[] => {
  const fromCatalog = catalogItems
    .filter((item) => checklist[item.id].qty > 0)
    .map((item) => ({
      uid: item.id,
      itemId: item.id,
      qty: checklist[item.id].qty,
      unit: checklist[item.id].unit,
    }));
  return [...fromCatalog, ...customItems];
};

type UseItemsChecklistResult = {
  catalogItems: CatalogItem[];
  checklist: ChecklistState;
  setChecklistRow: (itemId: string, patch: Partial<ChecklistRow>) => void;
  customItems: OrderItem[];
  setCustomItems: (items: OrderItem[]) => void;
  hasItems: boolean;
  flush: () => void;
};

/** Local editable checklist for a category's catalog items plus custom items, debounce-synced to the order draft. */
export const useItemsChecklist = (
  categoryId: CategoryId | null,
  draftItems: OrderItem[],
  setItems: (items: OrderItem[]) => void,
): UseItemsChecklistResult => {
  const catalogItems = useMemo(
    () => (categoryId ? getItemsForCategory(categoryId) : []),
    [categoryId],
  );

  const [checklist, setChecklist] = useState<ChecklistState>(() =>
    buildChecklist(catalogItems, draftItems),
  );
  const [customItems, setCustomItemsState] = useState<OrderItem[]>(() =>
    buildCustomItems(draftItems),
  );

  const checklistRef = useRef(checklist);
  const customItemsRef = useRef(customItems);
  useEffect(() => {
    checklistRef.current = checklist;
    customItemsRef.current = customItems;
  }, [checklist, customItems]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setItems(
      buildOrderItems(
        catalogItems,
        checklistRef.current,
        customItemsRef.current,
      ),
    );
  }, [catalogItems, setItems]);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      flush();
    }, FLUSH_DELAY_MS);
  }, [flush]);

  useEffect(() => {
    return () => {
      if (timerRef.current) flush();
    };
  }, [flush]);

  const setChecklistRow = useCallback(
    (itemId: string, patch: Partial<ChecklistRow>) => {
      setChecklist((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], ...patch },
      }));
      scheduleFlush();
    },
    [scheduleFlush],
  );

  const setCustomItems = useCallback(
    (items: OrderItem[]) => {
      setCustomItemsState(items);
      scheduleFlush();
    },
    [scheduleFlush],
  );

  const hasItems =
    customItems.length > 0 ||
    Object.values(checklist).some((row) => row.qty > 0);

  return {
    catalogItems,
    checklist,
    setChecklistRow,
    customItems,
    setCustomItems,
    hasItems,
    flush,
  };
};
