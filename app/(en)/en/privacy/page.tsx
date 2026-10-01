import type { Metadata } from "next";
import { PrivacyPage } from "@/components/PrivacyPage";
import { privacy } from "@/lib/legal/privacy";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${privacy.en.title} | ${site.name}`,
  alternates: { canonical: "/en/privacy", languages: { "es-MX": "/aviso-de-privacidad" } },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <PrivacyPage doc={privacy.en} backHref="/en" backLabel="Back to home" />;
}
