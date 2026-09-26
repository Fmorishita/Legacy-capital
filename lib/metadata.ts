import type { Metadata } from "next";
import type { Dict } from "@/lib/i18n/es";
import { site } from "@/lib/site";

export const allowIndex = process.env.PERMITIR_INDEXACION === "1";

export function pageMetadata(t: Dict, path: "/" | "/en"): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    alternates: {
      canonical: path,
      languages: { "es-MX": "/", "en-US": "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      locale: t.lang === "en" ? "en_US" : "es_MX",
      alternateLocale: t.lang === "en" ? ["es_MX"] : ["en_US"],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false },
    formatDetection: { telephone: false },
  };
}
