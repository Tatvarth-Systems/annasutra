import type { CatalogItem } from "@/data/catalog/types";
import type { CategoryId } from "@/data/categories";

import { dairy } from "@/data/catalog/dairy";
import { disposables } from "@/data/catalog/disposables";
import { dryFruits } from "@/data/catalog/dryFruits";
import { fruits } from "@/data/catalog/fruits";
import { grocery } from "@/data/catalog/grocery";
import { rentals } from "@/data/catalog/rentals";
import { spices } from "@/data/catalog/spices";
import { utensils } from "@/data/catalog/utensils";
import { vegetables } from "@/data/catalog/vegetables";

export const CUSTOM_ITEM_ID = "__custom__";

export const CATALOG: Record<CategoryId, CatalogItem[]> = {
  vegetables,
  fruits,
  dairy,
  grocery,
  spices,
  dryFruits,
  disposables,
  utensils,
  rentals,
};

export function getItemsForCategory(categoryId: CategoryId): CatalogItem[] {
  return CATALOG[categoryId];
}

export function findCatalogItem(
  categoryId: CategoryId,
  itemId: string,
): CatalogItem | undefined {
  return CATALOG[categoryId].find((item) => item.id === itemId);
}
