"use client";

import type { CatalogItem } from "@/data/catalog/types";
import type { Unit } from "@/data/units";

import { NumberField } from "@/components/ui/NumberField";
import { Select } from "@/components/ui/Select";
import { getUnitInputConfig, UNIT_IDS } from "@/data/units";
import { useT } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

type CatalogItemRowProps = {
  item: CatalogItem;
  qty: number;
  unit: Unit;
  onQtyChange: (qty: number) => void;
  onUnitChange: (unit: Unit) => void;
};

/** One catalog item row with a label, inline quantity stepper, and unit selector. */
export const CatalogItemRow = ({
  item,
  qty,
  unit,
  onQtyChange,
  onUnitChange,
}: CatalogItemRowProps) => {
  const t = useT();
  const unitConfig = getUnitInputConfig(unit);

  return (
    <li
      className={cn(
        "flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        qty > 0 ? "bg-brand-soft" : "odd:bg-white even:bg-line/20",
      )}
    >
      <p className="truncate text-sm font-medium text-ink">
        {t(`item.${item.id}`)}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <NumberField
          id={`qty-${item.id}`}
          aria-label={`${t("items.qtyLabel")}: ${t(`item.${item.id}`)}`}
          value={qty}
          minValue={0}
          step={unitConfig.step}
          showStepper
          onChange={(next) => onQtyChange(next ?? 0)}
        />
        <Select
          id={`unit-${item.id}`}
          aria-label={`${t("items.unitLabel")}: ${t(`item.${item.id}`)}`}
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
      </div>
    </li>
  );
};
