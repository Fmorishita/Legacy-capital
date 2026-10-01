import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Certificate, CheckCircle, Circle, DownloadSimple, SealCheck } from "@phosphor-icons/react/dist/ssr";
import { Shell } from "@/components/cap/Shell";
import { TaskChip, fecha } from "@/components/cap/ui";
import { requireUser, withSession } from "@/lib/cap/server";
import type { Certificado, Dashboard } from "@/lib/cap/types";

export const metadata: Metadata = { title: "Mi certificado" };

export default async function CertificadoPage() {
  const me = await requireUser();
  // Si ya cumple, esta llamada emite el certificado con su folio único
  const [cert, d] = await Promise.all([withSession<Certificado>("certificate"), withSession<Dashboard>("dashboard")]);
  const titulos = new Map(d.modulos.map((m) => [m.id, `Módulo ${m.numero} · ${m.titulo}`]));

  return (
    <Shell me={me}>
      <main className="cap-wrap max-w-3xl py-10">
        <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
          <ArrowLeft className="size-4" aria-hidden /> Mi avance
        </Link>

        {cert.elegible ? (
          <section className="mt-6 overflow-hidden rounded-2xl bg-navy text-cream">
            <div className="p-7 sm:p-10">
              <Certificate className="size-12 text-gold" weight="duotone" aria-hidden />
              <p className="cap-kicker mt-5 !text-gold">Certificado de finalización</p>
              <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">Felicidades, {cert.nombre.split(/\s+/)[0]}.</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream/80">
                Concluiste el Curso de Ventas Inmobiliarias de Legacy Capital. Tu certificado tiene el folio{" "}
                <strong className="tracking-wider text-gold">{cert.folio}</strong>, emitido el {fecha(cert.emitido_at)}, y cualquiera puede
                verificarlo en línea.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/capacitacion/certificado/pdf" className="cap-btn cap-btn-gold">
                  <DownloadSimple className="size-4" aria-hidden /> Descargar certificado (PDF)
                </a>
                <Link href={`/certificados/${cert.folio}`} className="cap-btn border border-cream/30 text-cream hover:bg-white/10">
                  <SealCheck className="size-4" aria-hidden /> Página de verificación
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <p className="cap-kicker mt-6">Mi certificado</p>
            <h1 className="cap-title mt-2 text-4xl">Esto te falta para certificarte</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink">
              El certificado se emite automáticamente cuando completas todos los módulos, apruebas el examen final y el
              administrador aprueba tus tareas.
            </p>

            <section className="cap-card mt-8 p-6">
              <h2 className="text-sm font-semibold text-navy">Examen final</h2>
              <p className="mt-3 flex items-center gap-2.5 text-sm">
                {cert.requisitos.examen_aprobado ? (
                  <CheckCircle className="size-5 text-ok" weight="fill" aria-hidden />
                ) : (
                  <Circle className="size-5 text-line" weight="bold" aria-hidden />
                )}
                {cert.requisitos.examen_aprobado ? "Aprobado" : "Pendiente: presenta el examen en el Módulo 12 (80% para aprobar)."}
              </p>
            </section>

            <section className="cap-card mt-4 p-6">
              <h2 className="text-sm font-semibold text-navy">Módulos por completar ({cert.requisitos.modulos_faltantes.length})</h2>
              {cert.requisitos.modulos_faltantes.length ? (
                <ul className="mt-3 grid gap-2 text-sm">
                  {cert.requisitos.modulos_faltantes.map((id) => (
                    <li key={id} className="flex items-center gap-2.5">
                      <Circle className="size-5 shrink-0 text-line" weight="bold" aria-hidden />
                      <Link href={`/capacitacion/modulo/${id}`} className="text-navy underline-offset-4 hover:underline">
                        {titulos.get(id) ?? id}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 flex items-center gap-2.5 text-sm">
                  <CheckCircle className="size-5 text-ok" weight="fill" aria-hidden /> Todos completados
                </p>
              )}
            </section>

            <section className="cap-card mt-4 p-6">
              <h2 className="text-sm font-semibold text-navy">Tareas por aprobar ({cert.requisitos.tareas_pendientes.length})</h2>
              {cert.requisitos.tareas_pendientes.length ? (
                <ul className="mt-3 grid gap-2.5 text-sm">
                  {cert.requisitos.tareas_pendientes.map((t) => (
                    <li key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-navy">{t.titulo}</span>
                      <TaskChip estado={t.estado} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 flex items-center gap-2.5 text-sm">
                  <CheckCircle className="size-5 text-ok" weight="fill" aria-hidden /> Todas aprobadas
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}
