"use client";

import type { Unit } from "@/data/units";
import type { OrderItem } from "@/lib/order/types";
import { useState } from "react";
import { Pencil, Plus, StickyNote, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { CUSTOM_ITEM_ID } from "@/data/catalog";
import { getUnitInputConfig, UNIT_IDS } from "@/data/units";
import { useT } from "@/lib/i18n/provider";
import { normalizeForCompare } from "@/lib/utils/text";

type AddCustomItemFormProps = {
  editingItem: OrderItem | null;
  usedLabels: Set<string>;
  onSubmit: (item: OrderItem) => void;
  onCancelEdit: () => void;
};

/** Generates a unique ID using crypto.randomUUID or timestamp fallback. */
const createUid = (): string => {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

/** Form for adding or editing a custom (off-catalog) order item. */
export const AddCustomItemForm = ({
  editingItem,
  usedLabels,
  onSubmit,
  onCancelEdit,
}: AddCustomItemFormProps) => {
  const t = useT();

  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState<Unit>("kg");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ name?: string; qty?: boolean }>({});

  const [prevEditingItem, setPrevEditingItem] = useState(editingItem);
  if (editingItem !== prevEditingItem) {
    setPrevEditingItem(editingItem);
    if (editingItem) {
      setName(editingItem.customName ?? "");
      setQty(editingItem.qty);
      setUnit(editingItem.unit);
      setNote(editingItem.note ?? "");
      setErrors({});
    }
  }

  /** Resets form fields to initial state. */
  const resetForm = () => {
    setName("");
    setQty(undefined);
    setUnit("kg");
    setNote("");
    setErrors({});
  };

  /** Validates form and submits the custom item. */
  const handleSubmit = () => {
    const nextErrors: { name?: string; qty?: boolean } = {};

    const trimmedName = name.trim();
    if (trimmedName === "") {
      nextErrors.name = t("client.requiredError");
    } else if (usedLabels.has(normalizeForCompare(trimmedName))) {
      nextErrors.name = t("items.duplicateNameError");
    }
    if (qty === undefined || qty <= 0) {
      nextErrors.qty = true;
    }

    if (Object.keys(nextErrors).length > 0 || qty === undefined) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      uid: editingItem?.uid ?? createUid(),
      itemId: CUSTOM_ITEM_ID,
      customName: trimmedName,
      qty,
      unit,
      note: note.trim() || undefined,
    });

    resetForm();
  };

  const unitConfig = getUnitInputConfig(unit);

  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <Field
          label={t("items.customNameLabel")}
          htmlFor="custom-item-name"
          required
          error={errors.name}
        >
          <Input
            id="custom-item-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
        </Field>

        <Field
          label={t("items.qtyLabel")}
          htmlFor="custom-item-qty"
          required
          error={errors.qty ? t("client.requiredError") : undefined}
        >
          <NumberField
            id="custom-item-qty"
            aria-label={t("items.qtyLabel")}
            minValue={unitConfig.min}
            step={unitConfig.step}
            value={qty}
            invalid={errors.qty}
            onChange={(next) => {
              setQty(next);
              setErrors((prev) => ({ ...prev, qty: undefined }));
            }}
          />
        </Field>

        <div>
          <Label htmlFor="custom-item-unit">{t("items.unitLabel")}</Label>
          <Select
            id="custom-item-unit"
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

      <div className="mt-3">
        <Label htmlFor="custom-item-note">
          {t("items.noteLabel")}
          <span className="ml-1 text-muted">({t("common.optional")})</span>
        </Label>
        <Input
          id="custom-item-note"
          icon={StickyNote}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="button" onClick={handleSubmit}>
          {editingItem ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {editingItem ? t("items.updateItem") : t("items.addItem")}
        </Button>
        {editingItem && (
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
        )}
      </div>
    </div>
  );
};
