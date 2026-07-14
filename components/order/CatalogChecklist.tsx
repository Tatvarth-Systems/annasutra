"use client";

import type { CatalogItem } from "@/data/catalog/types";
import type { ChecklistRow } from "@/lib/order/useItemsChecklist";
import { useMemo, useState } from "react";
import { PackageSearch, Search } from "lucide-react";

import { CatalogItemRow } from "@/components/order/CatalogItemRow";
import { Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/provider";
import { normalizeForCompare } from "@/lib/utils/text";

type CatalogChecklistProps = {
  catalogItems: CatalogItem[];
  checklist: Record<string, ChecklistRow>;
  onChangeRow: (itemId: string, patch: Partial<ChecklistRow>) => void;
};

/** Filterable checklist of a category's catalog items, each with an inline qty/unit editor. */
export const CatalogChecklist = ({
  catalogItems,
  checklist,
  onChangeRow,
}: CatalogChecklistProps) => {
  const t = useT();
  const [filterQuery, setFilterQuery] = useState("");

  const visibleItems = useMemo(() => {
    const query = normalizeForCompare(filterQuery);
    if (!query) return catalogItems;
    return catalogItems.filter((item) =>
      normalizeForCompare(t(`item.${item.id}`)).includes(query),
    );
  }, [catalogItems, filterQuery, t]);

  return (
    <div>
      <div className="sticky top-14 z-30 bg-surface/95 py-2 backdrop-blur">
        <Input
          icon={Search}
          value={filterQuery}
          onChange={(event) => setFilterQuery(event.target.value)}
          placeholder={t("items.filterPlaceholder")}
          aria-label={t("items.filterPlaceholder")}
        />
      </div>

      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          <PackageSearch className="h-6 w-6" />
          {t("items.noMatches")}
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line overflow-hidden rounded-lg border border-line">
          {visibleItems.map((item) => (
            <CatalogItemRow
              key={item.id}
              item={item}
              qty={checklist[item.id]?.qty ?? 0}
              unit={checklist[item.id]?.unit ?? item.defaultUnit}
              note={checklist[item.id]?.note}
              onQtyChange={(qty) => onChangeRow(item.id, { qty })}
              onUnitChange={(unit) => onChangeRow(item.id, { unit })}
              onNoteChange={(note) => onChangeRow(item.id, { note })}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
