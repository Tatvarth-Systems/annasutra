"use client";

import type { OrderItem } from "@/lib/order/types";
import { PackageOpen, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { toLocaleDigits } from "@/lib/i18n/numerals";
import { useLocale, useT } from "@/lib/i18n/provider";

type ItemsTableProps = {
  items: OrderItem[];
  onEdit: (item: OrderItem) => void;
  onDelete: (uid: string) => void;
};

/** Table displaying order items with edit and delete actions. */
export const ItemsTable = ({ items, onEdit, onDelete }: ItemsTableProps) => {
  const t = useT();
  const locale = useLocale();

  /** Returns display label for an item. */
  const labelFor = (item: OrderItem): string => {
    return item.itemId === CUSTOM_ITEM_ID
      ? (item.customName ?? "")
      : t(`item.${item.itemId}`);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
        <PackageOpen className="h-6 w-6" />
        {t("items.emptyState")}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
      {items.map((item) => (
        <li
          key={item.uid}
          className="flex items-center justify-between gap-3 px-4 py-3 odd:bg-white even:bg-line/20"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {labelFor(item)}
            </p>
            <p className="text-sm text-muted">
              {toLocaleDigits(item.qty, locale)} {t(`unit.${item.unit}`)}
              {item.note ? ` · ${item.note}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" onClick={() => onEdit(item)}>
              <Pencil className="h-4 w-4" />
              {t("common.edit")}
            </Button>
            <Button variant="ghost" onClick={() => onDelete(item.uid)}>
              <Trash2 className="h-4 w-4" />
              {t("common.delete")}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
