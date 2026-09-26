"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, CheckCircle, CaretDown, Circle, ListBullets } from "@phosphor-icons/react";
import { markReadAction } from "@/lib/cap/actions";
import type { Seccion } from "@/lib/cap/types";

type Ctx = {
  moduleId: string;
  sections: Seccion[];
  read: Set<string>;
  pending: string | null;
  error: string | null;
  markRead: (id: string) => Promise<void>;
  quizOk: boolean;
  setQuizOk: (v: boolean) => void;
  sent: Set<string>;
  markSent: (id: string) => void;
};

const ModuleCtx = createContext<Ctx | null>(null);
export const useModule = () => {
  const c = useContext(ModuleCtx);
  if (!c) throw new Error("useModule fuera de ModuleProvider");
  return c;
};

export function ModuleProvider({
  moduleId,
  sections,
  initialRead,
  initialQuizOk,
  initialSent,
  children,
}: {
  moduleId: string;
  sections: Seccion[];
  initialRead: string[];
  initialQuizOk: boolean;
  initialSent: string[];
  children: React.ReactNode;
}) {
  const [read, setRead] = useState(() => new Set(initialRead));
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizOk, setQuizOk] = useState(initialQuizOk);
  const [sent, setSent] = useState(() => new Set(initialSent));

  const markRead = useCallback(
    async (id: string) => {
      setPending(id);
      setError(null);
      const res = await markReadAction(moduleId, id);
      setPending(null);
      if (res.ok) setRead((r) => new Set(r).add(id));
      else setError(res.error);
    },
    [moduleId],
  );
  const markSent = useCallback((id: string) => setSent((s) => new Set(s).add(id)), []);

  const value = useMemo(
    () => ({ moduleId, sections, read, pending, error, markRead, quizOk, setQuizOk, sent, markSent }),
    [moduleId, sections, read, pending, error, markRead, quizOk, sent, markSent],
  );
  return <ModuleCtx.Provider value={value}>{children}</ModuleCtx.Provider>;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(`sec-${id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id.slice(4));
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function NavList({ onPick }: { onPick?: () => void }) {
  const { sections, read } = useModule();
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  return (
    <ol className="grid gap-0.5">
      {sections.map((s) => {
        const done = read.has(s.id);
        const on = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#sec-${s.id}`}
              onClick={onPick}
              aria-current={on ? "location" : undefined}
              className={`flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-[0.8rem] leading-snug transition ${
                on ? "bg-white text-navy shadow-[inset_2px_0_0_var(--color-gold)]" : "text-ink hover:bg-white/60"
              }`}
            >
              {done ? (
                <CheckCircle className="mt-px size-4 shrink-0 text-ok" weight="fill" aria-label="Leída" />
              ) : (
                <Circle className="mt-px size-4 shrink-0 text-line" weight="bold" aria-hidden />
              )}
              <span>
                <span className="mr-1.5 font-semibold text-gold-dk">{s.num}</span>
                {s.titulo}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Índice lateral (escritorio) */
export function SectionNav({ extra }: { extra?: React.ReactNode }) {
  const { sections, read } = useModule();
  const pct = sections.length ? Math.round((read.size / sections.length) * 100) : 0;
  return (
    <nav aria-label="Secciones del módulo" className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] overflow-y-auto pb-6 lg:block">
      <p className="cap-kicker px-2.5">Contenido</p>
      <div className="mt-3 px-2.5">
        <div className="flex justify-between text-xs text-muted">
          <span>
            {read.size}/{sections.length} leídas
          </span>
          <span>{pct}%</span>
        </div>
        <div className="cap-progress mt-1.5">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="mt-4">
        <NavList />
      </div>
      {extra}
    </nav>
  );
}

/** Barra fija con avance e índice desplegable (celular y tablet) */
export function MobileNav() {
  const { sections, read } = useModule();
  const [open, setOpen] = useState(false);
  const pct = sections.length ? Math.round((read.size / sections.length) * 100) : 0;
  if (!sections.length) return null;
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-cream/95 backdrop-blur sm:-mx-6 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-6"
      >
        <ListBullets className="size-5 shrink-0 text-gold-dk" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-navy">
            {read.size} de {sections.length} secciones leídas
          </span>
          <span className="cap-progress mt-1.5 block">
            <span style={{ width: `${pct}%` }} />
          </span>
        </span>
        <CaretDown className={`size-4 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="max-h-[60dvh] overflow-y-auto px-2 pb-4 sm:px-4">
          <NavList onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export function ReadButton({ id, nextId }: { id: string; nextId?: string }) {
  const { read, pending, error, markRead } = useModule();
  const done = read.has(id);
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-line bg-white/50 px-4 py-3.5">
      {done ? (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ok">
          <CheckCircle className="size-5" weight="fill" aria-hidden /> Sección leída
        </span>
      ) : (
        <button type="button" onClick={() => markRead(id)} disabled={pending === id} className="cap-btn cap-btn-primary cap-btn-sm">
          <Check className="size-4" weight="bold" aria-hidden />
          {pending === id ? "Guardando…" : "Marcar como leída"}
        </button>
      )}
      {error && pending === null && !done && <span className="text-xs text-bad">{error}</span>}
      {nextId && (
        <a href={`#sec-${nextId}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
          Siguiente sección <ArrowDown className="size-4" aria-hidden />
        </a>
      )}
    </div>
  );
}

/** Resumen de requisitos del módulo y enlace al siguiente. */
export function ModuleFooter({
  quizRequired,
  taskIds,
  nextHref,
  nextLabel,
  isAnnex,
}: {
  quizRequired: boolean;
  taskIds: string[];
  nextHref: string;
  nextLabel: string;
  isAnnex: boolean;
}) {
  const { sections, read, quizOk, sent } = useModule();
  const allRead = read.size >= sections.length;
  const tasksOk = taskIds.every((t) => sent.has(t));
  const complete = allRead && (!quizRequired || quizOk) && tasksOk;
  if (isAnnex) return null;

  const items = [
    { ok: allRead, label: `Secciones leídas (${read.size}/${sections.length})` },
    ...(quizRequired ? [{ ok: quizOk, label: "Quiz aprobado con 80% o más" }] : []),
    ...(taskIds.length ? [{ ok: tasksOk, label: `Tareas enviadas (${taskIds.filter((t) => sent.has(t)).length}/${taskIds.length})` }] : []),
  ];

  return (
    <section className={`mt-12 rounded-2xl p-6 sm:p-8 ${complete ? "bg-navy text-cream" : "cap-card"}`} aria-live="polite">
      {complete ? (
        <>
          <p className="cap-kicker !text-gold">Módulo completado</p>
          <p className="mt-2 font-serif text-3xl">Excelente trabajo.</p>
          <p className="mt-2 text-sm text-cream/75">Tu avance quedó guardado.</p>
          <Link href={nextHref} className="cap-btn cap-btn-gold mt-6">
            {nextLabel} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </>
      ) : (
        <>
          <p className="cap-kicker">Para completar este módulo</p>
          <ul className="mt-4 grid gap-2.5">
            {items.map((it) => (
              <li key={it.label} className="flex items-center gap-2.5 text-sm">
                {it.ok ? (
                  <CheckCircle className="size-5 text-ok" weight="fill" aria-label="Listo" />
                ) : (
                  <Circle className="size-5 text-line" weight="bold" aria-label="Pendiente" />
                )}
                <span className={it.ok ? "text-muted line-through" : "text-navy"}>{it.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
