import type { CategoryId } from "@/data/categories";
import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Armchair,
  Carrot,
  Milk,
  Nut,
  ShoppingBasket,
  Soup,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  vegetables: Carrot,
  fruits: Apple,
  dairy: Milk,
  grocery: ShoppingBasket,
  spices: Soup,
  dryFruits: Nut,
  disposables: Trash2,
  utensils: UtensilsCrossed,
  rentals: Armchair,
};
