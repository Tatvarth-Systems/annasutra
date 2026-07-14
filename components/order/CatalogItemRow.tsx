"use client";

import type { CatalogItem } from "@/data/catalog/types";
import type { Unit } from "@/data/units";
import { useState } from "react";
import { StickyNote } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { getUnitInputConfig, UNIT_IDS } from "@/data/units";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

type CatalogItemRowProps = {
  item: CatalogItem;
  qty: number;
  unit: Unit;
  note?: string;
  onQtyChange: (qty: number) => void;
  onUnitChange: (unit: Unit) => void;
  onNoteChange: (note: string) => void;
};

/** One catalog item row with a label, inline quantity stepper, unit selector, and a collapsible note. */
export const CatalogItemRow = ({
  item,
  qty,
  unit,
  note,
  onQtyChange,
  onUnitChange,
  onNoteChange,
}: CatalogItemRowProps) => {
  const t = useT();
  const unitConfig = getUnitInputConfig(unit);
  const [noteOpen, setNoteOpen] = useState(Boolean(note));
  const label = t(`item.${item.id}`);

  return (
    <li
      className={cn(
        "flex flex-col gap-2 px-4 py-3",
        qty > 0 ? "bg-brand-soft" : "odd:bg-white even:bg-line/20",
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="truncate text-sm font-medium text-ink">{label}</p>
        <div className="flex shrink-0 items-center gap-2">
          <NumberField
            id={`qty-${item.id}`}
            aria-label={`${t("items.qtyLabel")}: ${label}`}
            value={qty}
            minValue={0}
            step={unitConfig.step}
            showStepper
            onChange={(next) => onQtyChange(next ?? 0)}
          />
          <Select
            id={`unit-${item.id}`}
            aria-label={`${t("items.unitLabel")}: ${label}`}
            value={unit}
            onChange={(event) => onUnitChange(event.target.value as Unit)}
            className="w-28"
          >
            {UNIT_IDS.map((unitId) => (
              <option key={unitId} value={unitId}>
                {t(`unit.${unitId}`)}
              </option>
            ))}
          </Select>
          <button
            type="button"
            aria-label={`${t("items.noteLabel")}: ${label}`}
            aria-pressed={noteOpen}
            onClick={() => setNoteOpen((open) => !open)}
            className={cn(
              "flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-md border",
              noteOpen || note
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:bg-brand-soft",
            )}
          >
            <StickyNote className="h-4 w-4" />
          </button>
        </div>
      </div>
      {noteOpen && (
        <Input
          id={`note-${item.id}`}
          aria-label={`${t("items.noteLabel")}: ${label}`}
          value={note ?? ""}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={t("items.noteLabel")}
        />
      )}
    </li>
  );
};
