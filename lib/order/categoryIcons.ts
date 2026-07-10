import {
  Apple,
  Armchair,
  Carrot,
  Milk,
  Nut,
  Soup,
  ShoppingBasket,
  Trash2,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/data/categories";

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
