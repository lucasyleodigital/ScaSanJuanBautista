import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = "https://www.dehesapenolite.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/panel-eva",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
