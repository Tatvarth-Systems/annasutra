import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";

/** Allows crawling of public content, excluding the stateful order-creation flow. */
const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/order",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
