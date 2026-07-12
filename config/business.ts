import type { Locale } from "@/lib/i18n/config";

export const BUSINESS: Record<
  Locale,
  { name: string; proprietor: string; address: string }
> = {
  en: {
    name: "Ambika Caterers",
    proprietor: "Ravi Ojha",
    address: "Moti Nagar, Latur",
  },
  mr: {
    name: "अंबिका केटरर्स",
    proprietor: "रवी ओझा",
    address: "मोती नगर, लातूर",
  },
};

export const BUSINESS_PHONES = ["9028333320", "9518591712"] as const;
