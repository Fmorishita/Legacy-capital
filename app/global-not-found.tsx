import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Página no encontrada | Legacy Capital Real Estate",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVars}>
      <body className="grid min-h-dvh place-items-center bg-bg px-6 text-ink">
        <main className="max-w-md text-center">
          <Image src="/brand/crest.png" alt="Legacy Capital" width={300} height={391} className="mx-auto h-20 w-auto" priority />
          <p className="mt-8 font-caps text-sm font-semibold tracking-[0.2em] text-gold-ink">404</p>
          <h1 className="display mt-3 text-5xl leading-tight">Esta página no existe.</h1>
          <p className="mt-4 text-ink-soft">The page you are looking for does not exist.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="/" className="btn btn-primary">
              Ir al inicio
            </a>
            <a href="/en" className="btn btn-ghost">
              English
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
