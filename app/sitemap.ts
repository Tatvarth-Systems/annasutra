import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/** Minimal sitemap — the app has no indexable public content beyond the root. */
const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
    },
  ];
};

export default sitemap;
