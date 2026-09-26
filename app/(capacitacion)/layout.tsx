import "./cap.css";
import "./manual.css";
import type { Metadata, Viewport } from "next";
import { EB_Garamond, Montserrat } from "next/font/google";
import { site } from "@/lib/site";

const ebg = EB_Garamond({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-ebg", display: "swap" });
const mont = Montserrat({ subsets: ["latin"], variable: "--font-mont", display: "swap" });

// Contenido privado: nunca se indexa ni se cachea como estático
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Capacitación · Legacy Capital", template: "%s · Capacitación Legacy Capital" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "same-origin",
};

export const viewport: Viewport = { themeColor: "#1a2b4c" };

export default function CapacitacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${ebg.variable} ${mont.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
