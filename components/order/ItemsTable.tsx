"use client";

import type { OrderItem } from "@/lib/order/types";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { useT } from "@/lib/i18n/provider";
import { Button } from "@/components/ui/Button";

type ItemsTableProps = {
  items: OrderItem[];
  onEdit: (item: OrderItem) => void;
  onDelete: (uid: string) => void;
};

export function ItemsTable({ items, onEdit, onDelete }: ItemsTableProps) {
  const t = useT();

  function labelFor(item: OrderItem): string {
    return item.itemId === CUSTOM_ITEM_ID
      ? (item.customName ?? "")
      : t(`item.${item.itemId}`);
  }

  if (items.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
        {t("items.emptyState")}
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-white">
      {items.map((item) => (
        <li
          key={item.uid}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">
              {labelFor(item)}
            </p>
            <p className="text-sm text-muted">
              {item.qty} {t(`unit.${item.unit}`)}
              {item.note ? ` · ${item.note}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" onClick={() => onEdit(item)}>
              {t("common.edit")}
            </Button>
            <Button variant="ghost" onClick={() => onDelete(item.uid)}>
              {t("common.delete")}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
