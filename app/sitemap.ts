import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { routes } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { key: "home", priority: 1 },
    { key: "vinedos", priority: 0.9 },
    { key: "preventa", priority: 0.9 },
  ] as const;
  return pages.flatMap(({ key, priority }) => {
    const es = `${site.url}${routes[key].es === "/" ? "" : routes[key].es}`;
    const en = `${site.url}${routes[key].en}`;
    const languages = { es, en };
    return [
      { url: es, lastModified: now, priority, alternates: { languages } },
      { url: en, lastModified: now, priority: priority - 0.1, alternates: { languages } },
    ];
  });
}
