"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Pencil, Plus, StickyNote, X } from "lucide-react";
import type { CategoryId } from "@/data/categories";
import { getItemsForCategory } from "@/data/catalog";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { UNIT_IDS, type Unit, getUnitInputConfig } from "@/data/units";
import type { OrderItem } from "@/lib/order/types";
import { useT } from "@/lib/i18n/provider";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

type AddItemRowProps = {
  categoryId: CategoryId;
  items: OrderItem[];
  editingItem: OrderItem | null;
  onSubmit: (item: OrderItem) => void;
  onCancelEdit: () => void;
};

function createUid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AddItemRow({
  categoryId,
  items,
  editingItem,
  onSubmit,
  onCancelEdit,
}: AddItemRowProps) {
  const t = useT();
  const catalogItems = useMemo(
    () => getItemsForCategory(categoryId),
    [categoryId],
  );

  const options: ComboboxOption[] = useMemo(
    () => [
      { id: CUSTOM_ITEM_ID, label: t("items.otherOption"), pinned: true },
      ...catalogItems.map((item) => ({
        id: item.id,
        label: t(`item.${item.id}`),
      })),
    ],
    [catalogItems, t],
  );

  const [itemId, setItemId] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState<Unit>(catalogItems[0]?.defaultUnit ?? "kg");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [prevEditingItem, setPrevEditingItem] = useState(editingItem);
  if (editingItem !== prevEditingItem) {
    setPrevEditingItem(editingItem);
    if (editingItem) {
      setItemId(editingItem.itemId);
      setCustomName(editingItem.customName ?? "");
      setQty(String(editingItem.qty));
      setUnit(editingItem.unit);
      setNote(editingItem.note ?? "");
      setError(null);
    }
  }

  function resetForm() {
    setItemId(null);
    setCustomName("");
    setQty("");
    setUnit(catalogItems[0]?.defaultUnit ?? "kg");
    setNote("");
    setError(null);
  }

  function handleItemChange(nextId: string) {
    setItemId(nextId);
    setError(null);
    if (nextId !== CUSTOM_ITEM_ID) {
      const catalogItem = catalogItems.find((item) => item.id === nextId);
      if (catalogItem) setUnit(catalogItem.defaultUnit);
    }
  }

  const isDuplicate = useMemo(() => {
    if (!itemId || itemId === CUSTOM_ITEM_ID) return false;
    return items.some(
      (item) => item.itemId === itemId && item.uid !== editingItem?.uid,
    );
  }, [items, itemId, editingItem]);

  function handleSubmit() {
    if (!itemId) {
      setError(t("client.requiredError"));
      return;
    }
    if (itemId === CUSTOM_ITEM_ID && customName.trim() === "") {
      setError(t("client.requiredError"));
      return;
    }
    const parsedQty = Number(qty);
    if (!qty || Number.isNaN(parsedQty) || parsedQty <= 0) {
      setError(t("client.requiredError"));
      return;
    }

    onSubmit({
      uid: editingItem?.uid ?? createUid(),
      itemId,
      customName: itemId === CUSTOM_ITEM_ID ? customName.trim() : undefined,
      qty: parsedQty,
      unit,
      note: note.trim() || undefined,
    });

    resetForm();
  }

  const unitConfig = getUnitInputConfig(unit);

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <Field label={t("items.itemLabel")} htmlFor="item-combobox" required>
          <Combobox
            id="item-combobox"
            options={options}
            value={itemId}
            onChange={handleItemChange}
            placeholder={t("items.itemPlaceholder")}
          />
        </Field>

        <Field label={t("items.qtyLabel")} htmlFor="item-qty" required>
          <Input
            id="item-qty"
            type="number"
            min={unitConfig.min}
            step={unitConfig.step}
            value={qty}
            onChange={(event) => setQty(event.target.value)}
          />
        </Field>

        <div>
          <Label htmlFor="item-unit">{t("items.unitLabel")}</Label>
          <Select
            id="item-unit"
            value={unit}
            onChange={(event) => setUnit(event.target.value as Unit)}
          >
            {UNIT_IDS.map((unitId) => (
              <option key={unitId} value={unitId}>
                {t(`unit.${unitId}`)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {itemId === CUSTOM_ITEM_ID ? (
        <div className="mt-3">
          <Field
            label={t("items.customNameLabel")}
            htmlFor="item-custom-name"
            required
          >
            <Input
              id="item-custom-name"
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
            />
          </Field>
        </div>
      ) : null}

      <div className="mt-3">
        <Label htmlFor="item-note">
          {t("items.noteLabel")}
          <span className="ml-1 text-muted">({t("common.optional")})</span>
        </Label>
        <Input
          id="item-note"
          icon={StickyNote}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      {isDuplicate ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-brand">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {t("items.duplicateWarning")}
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <div className="mt-4 flex gap-2">
        <Button type="button" onClick={handleSubmit}>
          {editingItem ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editingItem ? t("items.updateItem") : t("items.addItem")}
        </Button>
        {editingItem ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              resetForm();
              onCancelEdit();
            }}
          >
            <X className="h-4 w-4" />
            {t("items.cancelEdit")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
