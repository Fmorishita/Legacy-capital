import type { Metadata } from "next";
import { site, type Lang } from "@/lib/site";
import { routes, type RouteKey } from "@/lib/projects";

export const allowIndex = process.env.PERMITIR_INDEXACION === "1";

type MetaCopy = { meta: { title: string; description: string } };

/** Metadatos de una página con su par en el otro idioma. */
export function pageMetadata(t: MetaCopy, key: RouteKey, lang: Lang): Metadata {
  const path = routes[key][lang];
  const es = routes[key].es;
  const en = routes[key].en;
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    alternates: {
      canonical: path,
      languages: { "es-MX": es, "en-US": en, "x-default": es },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      locale: lang === "en" ? "en_US" : "es_MX",
      alternateLocale: lang === "en" ? ["es_MX"] : ["en_US"],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false },
    formatDetection: { telephone: false },
  };
}
