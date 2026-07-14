import type { OrderItem } from "@/lib/order/types";

/** Filters to items with a positive quantity, defensively re-applied wherever items are consumed. */
export const withQty = (items: OrderItem[]): OrderItem[] => {
  return items.filter((item) => item.qty > 0);
};
