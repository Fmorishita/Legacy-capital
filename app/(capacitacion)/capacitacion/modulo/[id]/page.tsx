import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Lock, Target } from "@phosphor-icons/react/dist/ssr";
import { Shell } from "@/components/cap/Shell";
import { StateChip, moduleLabel } from "@/components/cap/ui";
import { ModuleFooter, ModuleProvider, MobileNav, ReadButton, SectionNav } from "@/components/cap/ModuleClient";
import { TaskCard } from "@/components/cap/TaskCard";
import { Quiz } from "@/components/cap/Quiz";
import { CapError, requireUser, withSession } from "@/lib/cap/server";
import { splitModule, type Part } from "@/lib/cap/content";
import type { ModuloDetalle, Tarea } from "@/lib/cap/types";

export const metadata: Metadata = { title: "Módulo" };

const ORDER = ["m00", "m01", "m02", "m03", "m04", "m05", "m06", "m07", "m08", "m09", "m10", "m11", "m12", "m13"];

function Locked({ children }: { children: React.ReactNode }) {
  return (
    <main className="cap-wrap grid min-h-[60dvh] place-items-center py-16 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-navy text-cream">
          <Lock className="size-6" weight="bold" aria-hidden />
        </span>
        <h1 className="cap-title mt-5 text-3xl">Módulo bloqueado</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink">{children}</p>
        <Link href="/capacitacion" className="cap-btn cap-btn-primary mt-6">
          Ver mi avance
        </Link>
      </div>
    </main>
  );
}

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  if (!/^(m\d{2}|anexos)$/.test(id)) notFound();

  let m: ModuloDetalle;
  try {
    m = await withSession<ModuloDetalle>("module", { modulo: id });
  } catch (e) {
    if (e instanceof CapError && e.code === "no_encontrado") notFound();
    if (e instanceof CapError && e.code === "bloqueado")
      return (
        <Shell me={me}>
          <Locked>Completa el módulo anterior para desbloquear este. Avanzar en orden te da las bases que necesitas.</Locked>
        </Shell>
      );
    throw e;
  }

  const { intro, sections, hasExamSlot } = splitModule(m.id, m.html, m.secciones, m.tareas);
  const tasks = new Map<string, Tarea>(m.tareas.map((t) => [t.id, t]));
  const isExam = m.id === "m12";
  const showQuiz = !m.es_anexo && (isExam || m.quiz.requerido);
  const quiz = showQuiz ? <Quiz moduleId={m.id} info={m.quiz} isExam={isExam} /> : null;

  const idx = ORDER.indexOf(m.id);
  const nextId = idx >= 0 ? ORDER[idx + 1] : undefined;
  const nextHref = nextId ? `/capacitacion/modulo/${nextId}` : "/capacitacion";
  const nextLabel = nextId ? `Ir al Módulo ${Number(nextId.slice(1))}` : "Ver mi avance";

  const renderPart = (p: Part, key: string) => {
    if (p.kind === "html") return <div key={key} className="manual" dangerouslySetInnerHTML={{ __html: p.html }} />;
    if (p.kind === "exam") return <div key={key}>{quiz}</div>;
    if (p.kind === "task") {
      const t = tasks.get(p.id);
      return t ? <TaskCard key={key} task={t} /> : null;
    }
    // Respuestas del ejercicio: solo después de enviar la tarea (o si no corresponde a ninguna)
    const t = tasks.get(p.task);
    return !t || t.entrega ? <div key={key} className="manual" dangerouslySetInnerHTML={{ __html: p.html }} /> : null;
  };

  return (
    <Shell me={me}>
      <ModuleProvider
        moduleId={m.id}
        sections={m.secciones}
        initialRead={m.leidas}
        initialQuizOk={m.quiz.aprobado}
        initialSent={m.tareas.filter((t) => t.entrega).map((t) => t.id)}
      >
        <header className="relative overflow-hidden bg-navy-3 text-cream">
          {m.imagen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/capacitacion/img/${m.imagen}`} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-3 via-navy-3/70 to-navy-3/20" />
          <div className="cap-wrap relative py-10 sm:py-14">
            <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-sm text-cream/70 hover:text-cream">
              <ArrowLeft className="size-4" aria-hidden /> Mi avance
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <p className="cap-kicker !text-gold">{moduleLabel(m.numero, m.es_anexo)}</p>
              <StateChip estado={m.estado} />
              {m.tiempo && (
                <span className="inline-flex items-center gap-1 text-xs text-cream/70">
                  <Clock className="size-3.5" aria-hidden /> {m.tiempo}
                </span>
              )}
            </div>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.4rem] leading-[1.05] sm:text-[3.2rem]">{m.titulo}</h1>
            {m.subtitulo && <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-cream/80">{m.subtitulo}</p>}
          </div>
        </header>

        <div className="cap-wrap lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <aside className="pt-8">
            <SectionNav />
          </aside>

          <main className="min-w-0 pb-8">
            <MobileNav />
            <div className="mx-auto max-w-[46rem] pt-8">
              {m.objetivos.length > 0 && (
                <div className="cap-card mb-10 p-5 sm:p-6">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    <Target className="size-5 text-gold-dk" aria-hidden /> Al terminar este módulo sabrás:
                  </p>
                  <ul className="mt-3 grid gap-1.5 text-sm leading-relaxed text-ink">
                    {m.objetivos.map((o) => (
                      <li key={o} className="flex gap-2.5">
                        <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {intro.map((p, i) => renderPart(p, `intro-${i}`))}

              {sections.map((s, i) => (
                <section key={s.id} id={`sec-${s.id}`} data-sec className="scroll-mt-32 lg:scroll-mt-24">
                  {s.parts.map((p, j) => renderPart(p, `${s.id}-${j}`))}
                  <ReadButton id={s.id} nextId={sections[i + 1]?.id} />
                </section>
              ))}

              {showQuiz && !hasExamSlot && quiz}

              <ModuleFooter
                quizRequired={showQuiz}
                taskIds={m.tareas.map((t) => t.id)}
                nextHref={nextHref}
                nextLabel={nextLabel}
                isAnnex={m.es_anexo}
              />
            </div>
          </main>
        </div>
      </ModuleProvider>
    </Shell>
  );
}
