import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/** Sitemap of indexable content — the order-creation flow is stateful and excluded. */
const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: `${SITE_URL}/welcome`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
};

export default sitemap;
