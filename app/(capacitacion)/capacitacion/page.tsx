import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Certificate, Clock, Lock, BookOpen, SealCheck, ListChecks, Exam } from "@phosphor-icons/react/dist/ssr";
import { Shell } from "@/components/cap/Shell";
import { Alert } from "@/components/cap/Alert";
import { Progress, StateChip, moduleLabel } from "@/components/cap/ui";
import { requireUser, withSession } from "@/lib/cap/server";
import type { Dashboard, ModuloResumen } from "@/lib/cap/types";

export const metadata: Metadata = { title: "Mi avance" };

function ModuleCard({ m }: { m: ModuloResumen }) {
  const locked = m.estado === "bloqueado";
  const pct = m.total ? (m.leidas / m.total) * 100 : 0;
  const body = (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[13px] bg-navy">
        {m.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/capacitacion/img/th-${m.imagen}`}
            alt=""
            loading="lazy"
            className={`size-full object-cover transition duration-700 group-hover:scale-[1.04] ${locked ? "opacity-50 grayscale" : ""}`}
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,#243a63,#0f1b33)]">
            <BookOpen className="size-12 text-gold" weight="thin" aria-hidden />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.16em] text-cream backdrop-blur">
          {moduleLabel(m.numero, m.es_anexo).toUpperCase()}
        </span>
        {locked && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-12 place-items-center rounded-full bg-navy/80 text-cream">
              <Lock className="size-5" weight="bold" aria-hidden />
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <StateChip estado={m.estado} />
          {m.tiempo && (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3.5" aria-hidden /> {m.tiempo}
            </span>
          )}
        </div>
        <h3 className="cap-title mt-3 text-[1.35rem]">{m.titulo}</h3>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {m.leidas}/{m.total} secciones
            </span>
            <span className="flex items-center gap-3">
              {m.quiz_requerido && (
                <span className={`inline-flex items-center gap-1 ${m.quiz_aprobado ? "text-ok" : ""}`}>
                  <Exam className="size-3.5" aria-hidden /> {m.id === "m12" ? "Examen" : "Quiz"}
                  {m.quiz_aprobado ? " ✓" : ""}
                </span>
              )}
              {m.tareas_total > 0 && (
                <span className={`inline-flex items-center gap-1 ${m.tareas_enviadas >= m.tareas_total ? "text-ok" : ""}`}>
                  <ListChecks className="size-3.5" aria-hidden /> {m.tareas_enviadas}/{m.tareas_total}
                </span>
              )}
            </span>
          </div>
          <div className="mt-2">
            <Progress value={m.estado === "completado" ? 100 : pct} label={`Avance de ${m.titulo}`} />
          </div>
        </div>
      </div>
    </>
  );
  const cls = "group cap-card flex flex-col overflow-hidden transition";
  return locked ? (
    <div className={`${cls} opacity-80`} aria-disabled title="Completa el módulo anterior para desbloquearlo">
      {body}
    </div>
  ) : (
    <Link
      href={`/capacitacion/modulo/${m.id}`}
      className={`${cls} hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_18px_40px_-24px_rgb(26_43_76/0.45)]`}
    >
      {body}
    </Link>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ bienvenida?: string; cuenta?: string }> }) {
  const me = await requireUser();
  const sp = await searchParams;
  const d = await withSession<Dashboard>("dashboard");
  const cursos = d.modulos.filter((m) => !m.es_anexo);
  const anexos = d.modulos.filter((m) => m.es_anexo);
  const siguiente = cursos.find((m) => m.estado !== "completado" && m.estado !== "bloqueado");
  const pct = d.total ? (d.completados / d.total) * 100 : 0;
  const first = me.nombre.split(/\s+/)[0];

  return (
    <Shell me={me}>
      <main className="cap-wrap py-8 sm:py-12">
        {sp.bienvenida && (
          <div className="mb-6">
            <Alert tone="ok">Tu cuenta está lista. Empieza por el Módulo 0: te toma unos minutos y te da el mapa del curso.</Alert>
          </div>
        )}
        {sp.cuenta && (
          <div className="mb-6">
            <Alert tone="ok">Tu contraseña quedó actualizada.</Alert>
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="cap-card relative overflow-hidden p-6 sm:p-8">
            <p className="cap-kicker">Curso de Ventas Inmobiliarias</p>
            <h1 className="cap-title mt-2 text-[2.1rem] sm:text-[2.6rem]">Hola, {first}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink">
              Avanza en orden: cada módulo se desbloquea al completar el anterior. Lee cada sección, presenta el quiz y envía
              tus tareas.
            </p>
            <div className="mt-7">
              <div className="flex items-end justify-between gap-3">
                <p className="text-sm font-semibold text-navy">
                  {d.completados} de {d.total} módulos completados
                </p>
                <p className="font-serif text-3xl leading-none text-gold-dk">{Math.round(pct)}%</p>
              </div>
              <div className="mt-3">
                <Progress value={pct} label="Avance general del curso" />
              </div>
            </div>
            {siguiente && (
              <Link href={`/capacitacion/modulo/${siguiente.id}`} className="cap-btn cap-btn-primary mt-7">
                {siguiente.estado === "en_curso" ? "Continuar" : "Empezar"}: {moduleLabel(siguiente.numero)}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>

          <div className={`cap-card flex flex-col p-6 sm:p-8 ${d.certificado ? "border-gold bg-navy text-cream" : ""}`}>
            <Certificate className={`size-9 ${d.certificado ? "text-gold" : "text-gold-dk"}`} weight="duotone" aria-hidden />
            <h2 className={`mt-3 font-serif text-2xl ${d.certificado ? "text-cream" : "text-navy"}`}>
              {d.certificado ? "Tu certificado está listo" : "Tu certificado"}
            </h2>
            {d.certificado ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-cream/80">
                  Folio <span className="font-semibold tracking-wider text-gold">{d.certificado}</span>. Cualquiera puede
                  verificarlo en línea.
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  <a href="/capacitacion/certificado/pdf" className="cap-btn cap-btn-gold">
                    Descargar PDF
                  </a>
                  <Link href={`/certificados/${d.certificado}`} className="cap-btn border border-cream/30 text-cream hover:bg-white/10">
                    <SealCheck className="size-4" aria-hidden /> Verificación
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ink">
                  Se habilita al completar los {d.total} módulos, aprobar el examen final con 80% o más y tener tus tareas
                  aprobadas por el administrador.
                </p>
                <Link href="/capacitacion/certificado" className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-navy underline-offset-4 hover:underline">
                  {d.completados >= d.total ? "Obtener mi certificado" : "Ver qué me falta"} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="modulos">
          <div className="flex items-end justify-between gap-4">
            <h2 id="modulos" className="cap-title text-3xl">
              Módulos
            </h2>
            <p className="text-xs text-muted">{cursos.length} módulos · en orden</p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cursos.map((m) => (
              <ModuleCard key={m.id} m={m} />
            ))}
          </div>
        </section>

        {anexos.length > 0 && (
          <section className="mt-12" aria-labelledby="anexos">
            <h2 id="anexos" className="cap-title text-3xl">
              Consulta rápida
            </h2>
            <p className="mt-2 text-sm text-muted">Disponibles siempre. No cuentan para el certificado.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {anexos.map((m) => (
                <ModuleCard key={m.id} m={m} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Shell>
  );
}
