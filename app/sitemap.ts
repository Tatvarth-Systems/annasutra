import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/** Sitemap of indexable content — the landing page and welcome/order entry point; the stateful order-creation flow itself is excluded. */
const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/welcome`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
};

export default sitemap;
