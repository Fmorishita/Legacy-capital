import "../globals.css";
import type { Metadata } from "next";
import { RootShell } from "@/components/RootShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { metadataBase: new URL(site.url) };

export default function SpanishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
