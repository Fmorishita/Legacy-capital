import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1, alternates: { languages: { en: `${site.url}/en` } } },
    { url: `${site.url}/en`, lastModified: now, priority: 0.9, alternates: { languages: { es: site.url } } },
  ];
}
