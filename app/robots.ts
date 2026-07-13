import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/** Disallows all crawling — the app is fully auth-gated with no public content to index. */
const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
