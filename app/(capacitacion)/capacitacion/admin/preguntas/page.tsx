import Link from "next/link";
import { BulkApprove, QuestionEditor } from "@/components/cap/AdminClient";
import { requireAdmin, withSession } from "@/lib/cap/server";
import type { PreguntaAdmin } from "@/lib/cap/types";

type Mod = { id: string; numero: string | null; titulo: string };

export default async function PreguntasPage({ searchParams }: { searchParams: Promise<{ modulo?: string }> }) {
  await requireAdmin();
  const [mods, all] = await Promise.all([withSession<Mod[]>("admin_modules"), withSession<PreguntaAdmin[]>("admin_questions")]);
  const cursos = mods.filter((m) => m.id !== "anexos");
  const { modulo } = await searchParams;
  const firstDraft = cursos.find((m) => all.some((q) => q.modulo === m.id && q.estado === "borrador"));
  const sel = cursos.find((m) => m.id === modulo) ?? firstDraft ?? cursos[0];
  const qs = all.filter((q) => q.modulo === sel.id);
  const count = (id: string, pred: (q: PreguntaAdmin) => boolean) => all.filter((q) => q.modulo === id && pred(q)).length;
  const borradores = qs.filter((q) => q.estado === "borrador").length;
  const quizActivo = qs.some((q) => q.estado === "aprobada");

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside>
        <p className="text-sm leading-relaxed text-ink">
          El quiz de cada módulo usa sus preguntas <strong>aprobadas</strong>: las del examen final de ese módulo más las generadas que
          apruebes. Las generadas empiezan como borrador.
        </p>
        <ul className="mt-5 grid gap-1">
          {cursos.map((m) => {
            const b = count(m.id, (q) => q.estado === "borrador");
            const a = count(m.id, (q) => q.estado === "aprobada");
            return (
              <li key={m.id}>
                <Link
                  href={`/capacitacion/admin/preguntas?modulo=${m.id}`}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm ${
                    sel.id === m.id ? "bg-white text-navy shadow-[inset_2px_0_0_var(--color-gold)]" : "text-ink hover:bg-white/60"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    <span className="font-semibold text-gold-dk">{m.numero}</span> {m.titulo}
                  </span>
                  <span className="flex shrink-0 gap-1 text-[0.65rem] font-bold">
                    <span className="rounded-full bg-ok-bg px-1.5 text-ok" title="Aprobadas">
                      {a}
                    </span>
                    {b > 0 && (
                      <span className="rounded-full bg-gold px-1.5 text-navy" title="Borradores">
                        {b}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="cap-kicker">Módulo {sel.numero}</p>
            <h2 className="cap-title text-2xl">{sel.titulo}</h2>
            <p className="mt-1 text-xs text-muted">
              {sel.id === "m12"
                ? "Estas 40 preguntas forman el examen final."
                : quizActivo
                  ? `Quiz activo con ${qs.filter((q) => q.estado === "aprobada").length} preguntas.`
                  : "Sin quiz todavía: el módulo se completa leyendo y enviando sus tareas."}
            </p>
          </div>
          <BulkApprove modulo={sel.id} count={borradores} />
        </div>
        <div className="mt-5 grid gap-4">
          {qs.map((q, i) => (
            <QuestionEditor key={`${q.id}-${q.estado}`} q={q} index={i + 1} />
          ))}
          {!qs.length && <p className="cap-card p-8 text-center text-sm text-muted">Este módulo no tiene preguntas.</p>}
        </div>
      </section>
    </div>
  );
}
