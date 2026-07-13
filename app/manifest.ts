import type { MetadataRoute } from "next";

/** PWA manifest so AnnaSutra can be installed to a device home screen. */
const manifest = (): MetadataRoute.Manifest => {
  return {
    name: "AnnaSutra",
    short_name: "AnnaSutra",
    description: "Digital Platform for Catering Services",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbf5",
    theme_color: "#c2410c",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
};

export default manifest;
