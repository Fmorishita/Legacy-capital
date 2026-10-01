import type { Metadata } from "next";
import Link from "next/link";
import { SealCheck, SealWarning } from "@phosphor-icons/react/dist/ssr";
import { Brand } from "@/components/cap/Shell";
import { fecha } from "@/components/cap/ui";
import { capRpc } from "@/lib/cap/server";

export const metadata: Metadata = { title: "Verificación de certificado" };

type Verify = { folio: string; nombre: string; emitido_at: string; valido: boolean };

// Verificación pública: solo nombre, curso, fecha y validez.
export default async function VerifyPage({ params }: { params: Promise<{ folio: string }> }) {
  const { folio } = await params;
  const f = decodeURIComponent(folio).toUpperCase();
  const cert = /^LC-\d{4}-[A-Z0-9]{6}$/.test(f) ? await capRpc<Verify>("verify", { folio: f }).catch(() => null) : null;
  const ok = cert?.valido === true;

  return (
    <main className="grid min-h-dvh place-items-center bg-cream px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center">
          <Brand tone="dark" />
        </div>
        <div className="cap-card mt-8 overflow-hidden text-center">
          <div className={`px-6 py-7 ${ok ? "bg-navy text-cream" : "bg-cream-2 text-navy"}`}>
            {ok ? (
              <SealCheck className="mx-auto size-12 text-gold" weight="duotone" aria-hidden />
            ) : (
              <SealWarning className="mx-auto size-12 text-bad" weight="duotone" aria-hidden />
            )}
            <p className="mt-3 font-serif text-3xl">{ok ? "Certificado válido" : cert ? "Certificado revocado" : "Folio no encontrado"}</p>
            <p className={`mt-1 text-xs tracking-[0.18em] ${ok ? "text-gold" : "text-muted"}`}>FOLIO {f}</p>
          </div>
          {cert ? (
            <dl className="grid gap-5 px-6 py-7 text-left sm:px-8">
              <div>
                <dt className="cap-kicker">Otorgado a</dt>
                <dd className="mt-1 font-serif text-2xl text-navy">{cert.nombre}</dd>
              </div>
              <div>
                <dt className="cap-kicker">Curso</dt>
                <dd className="mt-1 text-sm text-ink">Curso de Ventas Inmobiliarias · Legacy Capital</dd>
              </div>
              <div>
                <dt className="cap-kicker">Fecha de emisión</dt>
                <dd className="mt-1 text-sm text-ink">{fecha(cert.emitido_at)}</dd>
              </div>
              <div>
                <dt className="cap-kicker">Estado</dt>
                <dd className={`mt-1 text-sm font-semibold ${ok ? "text-ok" : "text-bad"}`}>{ok ? "Vigente" : "Sin validez"}</dd>
              </div>
            </dl>
          ) : (
            <p className="px-6 py-7 text-sm leading-relaxed text-ink">
              No existe un certificado con este folio. Revisa que esté escrito como aparece en el documento (por ejemplo,
              LC-2026-ABC123).
            </p>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Emitido por{" "}
          <Link href="/" className="underline underline-offset-4">
            Legacy Capital Real Estate
          </Link>
          , Ensenada, Baja California.
        </p>
      </div>
    </main>
  );
}
