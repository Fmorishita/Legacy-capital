import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";
import { privacy } from "@/lib/legal/privacy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${privacy.es.title} | ${site.name}`,
  alternates: { canonical: "/aviso-de-privacidad", languages: { "en-US": "/en/privacy" } },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PrivacyPage doc={privacy.es} backHref="/" backLabel="Volver al inicio" />;
}
