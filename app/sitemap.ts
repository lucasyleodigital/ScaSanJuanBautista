import type { MetadataRoute } from "next";
import { FICHAS, SITE_URL } from "@/lib/catalogo-seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...FICHAS.map((f) => ({
      url: `${SITE_URL}/${f.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
