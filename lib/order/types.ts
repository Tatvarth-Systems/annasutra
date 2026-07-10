import type { CategoryId } from "@/data/categories";
import type { Unit } from "@/data/units";

export type EventType = "wedding" | "engagement" | "birthday" | "other";

export type ClientDetails = {
  clientName: string;
  eventType?: EventType;
  eventVenue: string;
  eventDate: string;
  eventTime: string;
  guestCount?: number;
  notes?: string;
};

export type OrderItem = {
  uid: string;
  itemId: string;
  customName?: string;
  qty: number;
  unit: Unit;
  note?: string;
};

export type OrderDraft = {
  version: 1;
  client: ClientDetails | null;
  categoryId: CategoryId | null;
  items: OrderItem[];
};
