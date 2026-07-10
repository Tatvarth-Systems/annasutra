import type { Unit } from "@/data/units";
import type { CategoryId } from "@/data/categories";

export type EventType = "wedding" | "engagement" | "birthday" | "other";

export type ClientDetails = {
  clientName: string;
  contactNumber?: string;
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
