"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import type { OrderItem } from "@/lib/order/types";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ClientSummary } from "@/components/order/ClientSummary";
import { AddItemRow } from "@/components/order/AddItemRow";
import { ItemsTable } from "@/components/order/ItemsTable";

/** Items selection page with add/edit/delete functionality. */
const ItemsPage = () => {
  const t = useT();
  const router = useRouter();
  const { client, categoryId, items, setItems } = useOrderDraft();
  const { showToast } = useToast();
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);

  useEffect(() => {
    if (!client) {
      router.replace("/order/client");
    } else if (!categoryId) {
      router.replace("/order/category");
    }
  }, [client, categoryId, router]);

  if (!client || !categoryId) return null;

  /** Adds new item or updates existing one. */
  const handleSubmitItem = (item: OrderItem) => {
    const exists = items.some((existing) => existing.uid === item.uid);
    setItems(
      exists
        ? items.map((existing) => (existing.uid === item.uid ? item : existing))
        : [...items, item],
    );
    setEditingItem(null);
  };

  /** Deletes item with undo toast. */
  const handleDelete = (uid: string) => {
    const index = items.findIndex((item) => item.uid === uid);
    if (index === -1) return;
    const removed = items[index];
    const next = items.filter((item) => item.uid !== uid);
    setItems(next);
    if (editingItem?.uid === uid) setEditingItem(null);

    showToast(t("items.deletedToast"), {
      label: t("common.undo"),
      onClick: () => {
        setItems([...next.slice(0, index), removed, ...next.slice(index)]);
      },
    });
  };

  return (
    <div>
      <PageHeader
        title={t("items.title")}
        description={t("items.subtitle", {
          category: t(`category.${categoryId}`),
          name: client.clientName,
        })}
        icon={CATEGORY_ICONS[categoryId]}
      />

      <ClientSummary client={client} />

      <AddItemRow
        categoryId={categoryId}
        items={items}
        editingItem={editingItem}
        onSubmit={handleSubmitItem}
        onCancelEdit={() => setEditingItem(null)}
      />

      <div className="mt-6">
        <ItemsTable
          items={items}
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          disabled={items.length === 0}
          onClick={() => router.push("/order/review")}
        >
          {t("items.review")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ItemsPage;
