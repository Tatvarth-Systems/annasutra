import type { Unit } from "@/data/units";

export const CATEGORY_IDS = [
  "vegetables",
  "fruits",
  "dairy",
  "grocery",
  "spices",
  "dryFruits",
  "disposables",
  "utensils",
  "rentals",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  defaultUnit: Unit;
};

export const CATEGORIES: Category[] = [
  { id: "vegetables", defaultUnit: "kg" },
  { id: "fruits", defaultUnit: "kg" },
  { id: "dairy", defaultUnit: "litre" },
  { id: "grocery", defaultUnit: "kg" },
  { id: "spices", defaultUnit: "kg" },
  { id: "dryFruits", defaultUnit: "kg" },
  { id: "disposables", defaultUnit: "packet" },
  { id: "utensils", defaultUnit: "nos" },
  { id: "rentals", defaultUnit: "nos" },
];
