"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwise, CheckCircle, Exam, SealCheck, Warning, XCircle } from "@phosphor-icons/react";
import { startQuizAction, submitQuizAction } from "@/lib/cap/actions";
import { useModule } from "@/components/cap/ModuleClient";
import { Alert } from "@/components/cap/Alert";
import type { Letra, QuizInfo, QuizResult, QuizStart } from "@/lib/cap/types";

const LETRAS: Letra[] = ["a", "b", "c", "d"];
const storeKey = (intento: string) => `lc-cap-quiz-${intento}`;

function load(intento: string): Record<string, Letra> {
  try {
    return JSON.parse(localStorage.getItem(storeKey(intento)) ?? "{}");
  } catch {
    return {};
  }
}
function save(intento: string, r: Record<string, Letra>) {
  try {
    localStorage.setItem(storeKey(intento), JSON.stringify(r));
  } catch {}
}
function clear(intento: string) {
  try {
    localStorage.removeItem(storeKey(intento));
  } catch {}
}

export function Quiz({ moduleId, info, isExam }: { moduleId: string; info: QuizInfo; isExam: boolean }) {
  const router = useRouter();
  const { sections, read, quizOk, setQuizOk } = useModule();
  const [run, setRun] = useState<QuizStart | null>(null);
  const [answers, setAnswers] = useState<Record<string, Letra>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usados, setUsados] = useState(info.intentos_usados ?? 0);
  const [best, setBest] = useState(info.mejor?.porcentaje ?? null);

  const allRead = read.size >= sections.length;
  const needsReading = !isExam && !allRead;
  const max = info.intentos_max ?? 0;
  const restantes = isExam ? Math.max(max - usados, 0) : null;
  const noun = isExam ? "examen" : "quiz";

  useEffect(() => {
    if (run) save(run.intento, answers);
  }, [run, answers]);

  async function start() {
    setBusy(true);
    setError(null);
    const res = await startQuizAction(moduleId);
    setBusy(false);
    if (!res.ok || !res.data) return setError(res.ok ? "No se pudo iniciar." : res.error);
    setRun(res.data);
    setAnswers(load(res.data.intento));
    setResult(null);
    requestAnimationFrame(() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const answered = run ? run.preguntas.filter((q) => answers[q.id]).length : 0;

  async function submit() {
    if (!run) return;
    const faltan = run.preguntas.length - answered;
    if (faltan > 0) {
      const first = run.preguntas.find((q) => !answers[q.id]);
      if (!window.confirm(`Te faltan ${faltan} pregunta${faltan === 1 ? "" : "s"} por responder y contarán como incorrectas. ¿Enviar de todos modos?`)) {
        if (first) document.getElementById(`q-${first.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setBusy(true);
    setError(null);
    const res = await submitQuizAction(run.intento, answers);
    setBusy(false);
    if (!res.ok || !res.data) return setError(res.ok ? "No se pudo enviar." : res.error);
    clear(run.intento);
    setResult(res.data);
    setRun(null);
    if (isExam) setUsados((u) => u + 1);
    setBest((b) => Math.max(b ?? 0, res.data!.porcentaje));
    if (res.data.aprobado) {
      setQuizOk(true);
      router.refresh();
    }
    requestAnimationFrame(() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const title = isExam ? "Examen final" : "Quiz del módulo";

  return (
    <section id="quiz" className="mt-12 scroll-mt-24" aria-labelledby="quiz-title">
      <div className="overflow-hidden rounded-2xl border border-navy/15 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-5 py-4 text-cream sm:px-7">
          <h2 id="quiz-title" className="inline-flex items-center gap-2.5 font-serif text-2xl">
            <Exam className="size-6 text-gold" weight="duotone" aria-hidden /> {title}
          </h2>
          {quizOk && (
            <span className="cap-chip bg-ok-bg text-ok">
              <SealCheck className="size-3.5" weight="bold" aria-hidden /> Aprobado
            </span>
          )}
        </div>

        {!run && !result && (
          <div className="px-5 py-6 sm:px-7">
            <ul className="grid gap-2 text-sm text-ink sm:grid-cols-3">
              <li className="rounded-xl bg-cream px-4 py-3">
                <span className="block text-xs text-muted">Preguntas</span>
                <span className="font-serif text-2xl text-navy">{info.preguntas}</span>
              </li>
              <li className="rounded-xl bg-cream px-4 py-3">
                <span className="block text-xs text-muted">Para aprobar</span>
                <span className="font-serif text-2xl text-navy">80%</span>
              </li>
              <li className="rounded-xl bg-cream px-4 py-3">
                <span className="block text-xs text-muted">{isExam ? "Intentos usados" : "Mejor resultado"}</span>
                <span className="font-serif text-2xl text-navy">
                  {isExam ? `${usados} de ${max}` : best != null ? `${Math.round(best)}%` : "—"}
                </span>
              </li>
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-ink">
              {isExam
                ? "Las preguntas aparecen en orden aleatorio y la calificación es inmediata. Si cierras la página, tus respuestas se guardan en este dispositivo y puedes retomar el mismo intento durante 3 horas."
                : "Responde con calma: puedes repetir el quiz las veces que necesites. Al aprobar verás las respuestas de las preguntas que fallaste."}
            </p>
            {isExam && best != null && !quizOk && <p className="mt-2 text-sm text-muted">Tu mejor resultado: {Math.round(best)}%.</p>}
            {error && (
              <div className="mt-4">
                <Alert>{error}</Alert>
              </div>
            )}
            {needsReading && (
              <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">
                <Warning className="size-4 shrink-0" weight="bold" aria-hidden /> Marca como leídas todas las secciones para
                habilitar el quiz ({read.size}/{sections.length}).
              </p>
            )}
            {!(isExam && quizOk) && (
              <button
                type="button"
                onClick={start}
                disabled={busy || needsReading || (isExam && restantes === 0)}
                className="cap-btn cap-btn-primary mt-5"
              >
                {busy ? "Preparando…" : quizOk ? "Practicar de nuevo" : best != null ? `Intentar de nuevo` : `Presentar ${noun}`}
              </button>
            )}
            {isExam && restantes === 0 && !quizOk && (
              <p className="mt-3 text-sm text-bad">Ya usaste todos tus intentos. Pide al administrador un intento adicional.</p>
            )}
          </div>
        )}

        {run && (
          <div className="px-4 py-6 sm:px-7">
            <ol className="grid gap-5">
              {run.preguntas.map((q, i) => (
                <li key={q.id} id={`q-${q.id}`} className="scroll-mt-40 rounded-2xl border border-line p-4 sm:p-5">
                  <fieldset>
                    <legend className="text-[0.95rem] leading-relaxed font-medium text-navy">
                      <span className="mr-2 font-serif text-lg text-gold-dk">{i + 1}.</span>
                      {q.texto}
                    </legend>
                    <div className="mt-3 grid gap-2">
                      {LETRAS.map((l) => {
                        const on = answers[q.id] === l;
                        return (
                          <label
                            key={l}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-sm leading-snug transition ${
                              on ? "border-navy bg-navy text-cream" : "border-line bg-card hover:border-gold"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={l}
                              checked={on}
                              onChange={() => setAnswers((a) => ({ ...a, [q.id]: l }))}
                              className="sr-only"
                            />
                            <span
                              className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold uppercase ${
                                on ? "border-gold bg-gold text-navy" : "border-line text-muted"
                              }`}
                            >
                              {l}
                            </span>
                            <span className="pt-0.5">{q.opciones[l]}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </li>
              ))}
            </ol>
            <div className="sticky bottom-0 -mx-4 mt-6 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-7 sm:px-7">
              {error && (
                <div className="mb-3">
                  <Alert>{error}</Alert>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-navy">
                    Respondidas {answered} de {run.preguntas.length}
                  </p>
                  <div className="cap-progress mt-1.5 max-w-xs">
                    <span style={{ width: `${(answered / run.preguntas.length) * 100}%` }} />
                  </div>
                </div>
                <button type="button" onClick={submit} disabled={busy} className="cap-btn cap-btn-primary shrink-0">
                  {busy ? "Calificando…" : "Enviar respuestas"}
                </button>
              </div>
            </div>
          </div>
        )}

        {result && <ResultView result={result} isExam={isExam} restantes={restantes} onRetry={start} busy={busy} error={error} />}
      </div>
    </section>
  );
}

function ResultView({
  result,
  isExam,
  restantes,
  onRetry,
  busy,
  error,
}: {
  result: QuizResult;
  isExam: boolean;
  restantes: number | null;
  onRetry: () => void;
  busy: boolean;
  error: string | null;
}) {
  const pct = Math.round(result.porcentaje);
  const canRetry = !result.aprobado && (!isExam || (restantes ?? 0) > 0);
  const hidden = useMemo(() => result.falladas.filter((f) => !f.correcta).length, [result]);
  return (
    <div className="px-5 py-6 sm:px-7">
      <div className={`flex flex-wrap items-center gap-5 rounded-2xl p-5 ${result.aprobado ? "bg-ok-bg" : "bg-bad-bg"}`}>
        <div
          className={`grid size-24 shrink-0 place-items-center rounded-full border-4 bg-white font-serif text-3xl ${
            result.aprobado ? "border-ok text-ok" : "border-bad text-bad"
          }`}
        >
          {pct}%
        </div>
        <div className="min-w-0 flex-1">
          <p className={`inline-flex items-center gap-2 text-lg font-semibold ${result.aprobado ? "text-ok" : "text-bad"}`}>
            {result.aprobado ? <CheckCircle className="size-5" weight="fill" aria-hidden /> : <XCircle className="size-5" weight="fill" aria-hidden />}
            {result.aprobado ? "¡Aprobado!" : "Aún no apruebas"}
          </p>
          <p className="mt-1 text-sm text-ink">
            {result.correctas} de {result.total} correctas. {result.aprobado ? "" : "Necesitas 80% para aprobar."}
            {isExam && !result.aprobado && restantes != null && ` Te quedan ${restantes} intento${restantes === 1 ? "" : "s"}.`}
          </p>
        </div>
      </div>

      {result.falladas.length > 0 && (
        <>
          <h3 className="mt-7 text-sm font-semibold text-navy">Preguntas que fallaste ({result.falladas.length})</h3>
          {!result.aprobado && (
            <p className="mt-1 text-xs text-muted">Las respuestas correctas se muestran cuando apruebas. Repasa las secciones y vuelve a intentarlo.</p>
          )}
          {result.aprobado && hidden > 0 && !isExam && (
            <p className="mt-1 text-xs text-muted">
              Algunas preguntas también forman parte del examen final: para esas no mostramos la respuesta. Repásalas en el módulo.
            </p>
          )}
          <ol className="mt-4 grid gap-3">
            {result.falladas.map((f) => (
              <li key={f.id} className="rounded-xl border border-line p-4 text-sm">
                <p className="font-medium text-navy">{f.texto}</p>
                <p className="mt-2 text-bad">
                  Tu respuesta: {f.tu_respuesta ? `${f.tu_respuesta.toUpperCase()}) ${f.opciones[f.tu_respuesta]}` : "sin responder"}
                </p>
                {f.correcta && (
                  <p className="mt-1 text-ok">
                    Correcta: {f.correcta.toUpperCase()}) {f.opciones[f.correcta]}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </>
      )}

      {error && (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      )}
      {canRetry && (
        <button type="button" onClick={onRetry} disabled={busy} className="cap-btn cap-btn-primary mt-6">
          <ArrowClockwise className="size-4" aria-hidden /> {busy ? "Preparando…" : "Intentar de nuevo"}
        </button>
      )}
    </div>
  );
}
