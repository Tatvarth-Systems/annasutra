"use client";

import type { OrderItem } from "@/lib/order/types";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AddCustomItemForm } from "@/components/order/AddCustomItemForm";
import { CatalogChecklist } from "@/components/order/CatalogChecklist";
import { ClientSummary } from "@/components/order/ClientSummary";
import { ItemsTable } from "@/components/order/ItemsTable";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/lib/i18n/provider";
import { CATEGORY_ICONS } from "@/lib/order/categoryIcons";
import { useItemsChecklist } from "@/lib/order/useItemsChecklist";
import { useOrderDraft } from "@/lib/order/useOrderDraft";
import { useOrderStepGuard } from "@/lib/order/useOrderStepGuard";
import { normalizeForCompare } from "@/lib/utils/text";

/** Items page: catalog checklist with inline qty/unit editing, plus custom item add/edit/delete. */
const ItemsPage = () => {
  const t = useT();
  const router = useRouter();
  const { client, categoryId, items, setItems } = useOrderDraft();
  const { showToast } = useToast();
  const [editingCustomItem, setEditingCustomItem] = useState<OrderItem | null>(
    null,
  );
  const ready = useOrderStepGuard("items", { client, categoryId, items });

  const {
    catalogItems,
    checklist,
    setChecklistRow,
    customItems,
    setCustomItems,
    hasItems,
    flush,
  } = useItemsChecklist(categoryId, items, setItems);

  const usedLabels = useMemo(() => {
    const labels = new Set<string>();
    for (const item of catalogItems) {
      if ((checklist[item.id]?.qty ?? 0) > 0) {
        labels.add(normalizeForCompare(t(`item.${item.id}`)));
      }
    }
    for (const item of customItems) {
      if (editingCustomItem && item.uid === editingCustomItem.uid) continue;
      labels.add(normalizeForCompare(item.customName ?? ""));
    }
    return labels;
  }, [catalogItems, checklist, customItems, editingCustomItem, t]);

  if (!ready || !client || !categoryId) return null;

  const selectedCount =
    customItems.length +
    Object.values(checklist).filter((row) => row.qty > 0).length;

  /** Adds new custom item or updates an existing one. */
  const handleSubmitCustomItem = (item: OrderItem) => {
    const exists = customItems.some((existing) => existing.uid === item.uid);
    setCustomItems(
      exists
        ? customItems.map((existing) =>
            existing.uid === item.uid ? item : existing,
          )
        : [...customItems, item],
    );
    setEditingCustomItem(null);
  };

  /** Deletes a custom item with an undo toast. */
  const handleDeleteCustomItem = (uid: string) => {
    const index = customItems.findIndex((item) => item.uid === uid);
    if (index === -1) return;
    const removed = customItems[index];
    const next = customItems.filter((item) => item.uid !== uid);
    setCustomItems(next);
    if (editingCustomItem?.uid === uid) setEditingCustomItem(null);

    showToast(t("items.deletedToast"), {
      label: t("common.undo"),
      onClick: () => {
        setCustomItems([
          ...next.slice(0, index),
          removed,
          ...next.slice(index),
        ]);
      },
    });
  };

  /** Flushes pending edits and navigates to the review step. */
  const handleReview = () => {
    flush();
    router.push("/order/review");
  };

  return (
    <div className="pb-32">
      <PageHeader
        title={t("items.title")}
        description={t("items.subtitle", {
          category: t(`category.${categoryId}`),
          name: client.clientName,
        })}
        icon={CATEGORY_ICONS[categoryId]}
      />

      <ClientSummary client={client} />

      <CatalogChecklist
        catalogItems={catalogItems}
        checklist={checklist}
        onChangeRow={setChecklistRow}
      />

      <div className="mt-8">
        <h2 className="text-base font-semibold text-ink">
          {t("items.customSectionTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("items.listSubtitle")}</p>
        <div className="mt-3">
          <ItemsTable
            items={customItems}
            onEdit={setEditingCustomItem}
            onDelete={handleDeleteCustomItem}
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-base font-semibold text-ink">
          {t("items.addCustomItemTitle")}
        </h2>
        <div className="mt-3">
          <AddCustomItemForm
            editingItem={editingCustomItem}
            usedLabels={usedLabels}
            onSubmit={handleSubmitCustomItem}
            onCancelEdit={() => setEditingCustomItem(null)}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <p className="text-sm text-muted">
            {t("items.selectedCount", { count: selectedCount })}
          </p>
          <Button disabled={!hasItems} onClick={handleReview}>
            {t("items.review")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
