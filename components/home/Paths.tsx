"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarCheck, Check, Sparkle } from "@phosphor-icons/react";
import type { HomeCopy } from "@/lib/i18n/home";
import type { PortfolioCopy } from "@/lib/i18n/portfolio";
import type { ProjectId } from "@/lib/projects";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";
import { useLead } from "@/components/lead/LeadProvider";

type Result = ProjectId | "ambos" | null;

function recommend(when?: string, pay?: string): Result {
  if (!when || !pay) return null;
  if (when === "ya") return "vinedos";
  return pay === "propios" ? "preventa" : "ambos";
}

/**
 * Los dos caminos lado a lado. En escritorio las filas de ambas tarjetas quedan alineadas (subgrid)
 * para compararlas de un vistazo; debajo, un recomendador de dos preguntas.
 */
export function Paths({ t, portfolio }: { t: HomeCopy["paths"]; portfolio: PortfolioCopy }) {
  const { openLead } = useLead();
  const [when, setWhen] = useState<string>();
  const [pay, setPay] = useState<string>();
  const result = recommend(when, pay);
  const [pre, vin] = portfolio.items;
  const picked = (id: ProjectId) => result === id || result === "ambos";

  const answer = (setter: (v: string) => void, value: string, q: string) => {
    setter(value);
    trackEvent("compare_answer", { question: q, answer: value });
  };

  return (
    <section id="compara" aria-labelledby="paths-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="paths-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <div id="proyectos" className="mt-14 grid gap-6 lg:grid-cols-2 lg:grid-rows-[repeat(5,auto)] lg:gap-x-8 lg:gap-y-0">
          {[pre, vin].map((p, i) => {
            const copy = t.items[p.id];
            const vine = p.id === "vinedos";
            return (
              <Reveal
                as="article"
                key={p.id}
                delay={i * 0.08}
                amount={0.1}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-500 lg:row-span-5 lg:grid lg:grid-rows-subgrid ${
                  result && picked(p.id)
                    ? vine
                      ? "border-vine-500 shadow-[0_0_0_1px_var(--color-vine-500)]"
                      : "border-gold-500 shadow-[0_0_0_1px_var(--color-gold-500)]"
                    : "border-line"
                }`}
              >
                <Link href={p.href} tabIndex={-1} aria-hidden className="group relative block aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
                  <StatusChip project={p.id} label={p.status} tone="dark" className="absolute left-5 top-5" />
                </Link>

                <div className="px-6 pt-7 sm:px-8">
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{p.place}</p>
                  <h3 id={`path-${p.id}`} className="display mt-2 text-[2.1rem] leading-[1.05] md:text-[2.5rem]">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed">{copy.promise}</p>
                </div>

                <div className="px-6 pt-7 sm:px-8">
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${vine ? "text-vine-ink" : "text-gold-ink"}`}>
                    {t.fitLabel}
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {copy.fit.map((f) => (
                      <li key={f} className="flex gap-3 leading-relaxed">
                        <span
                          aria-hidden
                          className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full ${
                            vine ? "bg-vine-500 text-cream-100" : "bg-gold-500 text-navy-900"
                          }`}
                        >
                          <Check className="size-3" weight="bold" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="mx-6 mt-8 grid gap-x-6 gap-y-4 border-t border-line pt-6 sm:mx-8 sm:grid-cols-2">
                  {copy.facts.map((f, j) => (
                    // En celular basta con "qué es": el resto se resume en la promesa y el precio
                    <div key={f.label} className={j > 0 ? "hidden sm:block" : undefined}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">{f.label}</dt>
                      <dd className="mt-1 leading-snug">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-6 sm:px-8">
                  <p className="text-sm leading-tight text-ink-soft">
                    <span className="block font-display text-[1.6rem] font-semibold text-ink">{p.price}</span>
                    {p.priceNote}
                  </p>
                  <Link
                    href={p.href}
                    onClick={() => trackEvent("project_pick", { project: p.id, origin: "home-caminos" })}
                    className="btn btn-primary"
                  >
                    {p.cta}
                    <ArrowRight className="size-4" weight="bold" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Recomendador */}
        <Reveal delay={0.1} className="mt-10 rounded-2xl bg-navy-950 p-6 text-cream-100 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Sparkle className="size-7 text-gold-400" weight="duotone" aria-hidden />
              <h3 className="display mt-4 text-[2.2rem] leading-tight">{t.quiz.title}</h3>
              <p className="mt-2 text-cream-100/75">{t.quiz.body}</p>
            </div>
            <div className="grid gap-7">
              {[
                { q: t.quiz.q1, opts: t.quiz.q1a, value: when, set: setWhen, key: "cuando" },
                { q: t.quiz.q2, opts: t.quiz.q2a, value: pay, set: setPay, key: "pago" },
              ].map((g) => (
                <fieldset key={g.key}>
                  <legend className="text-sm font-semibold text-cream-100/85">{g.q}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.opts.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={g.value === o.value}
                        onClick={() => answer(g.set, o.value, g.key)}
                        className="rounded-full border border-cream-100/30 px-4 py-2.5 text-sm font-medium transition hover:border-cream-100/70 aria-pressed:border-gold-400 aria-pressed:bg-gold-500 aria-pressed:text-navy-950"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div aria-live="polite" className="min-h-[4.5rem] border-t border-cream-100/15 pt-6">
                <AnimatePresence mode="wait" initial={false}>
                  {result ? (
                    <motion.div
                      key={result}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-wrap items-center justify-between gap-5"
                    >
                      <p className="max-w-[46ch] text-lg leading-snug">{t.quiz.results[result]}</p>
                      {result === "ambos" ? (
                        <button
                          type="button"
                          className="btn btn-gold"
                          onClick={() => openLead({ kind: "visit", origin: "compara-ambos", proyecto: "general" })}
                        >
                          <CalendarCheck className="size-5" aria-hidden />
                          {t.quiz.ctaBoth}
                        </button>
                      ) : (
                        <Link href={(result === "vinedos" ? vin : pre).href} className="btn btn-gold">
                          {(result === "vinedos" ? vin : pre).cta}
                          <ArrowRight className="size-4" weight="bold" aria-hidden />
                        </Link>
                      )}
                    </motion.div>
                  ) : (
                    <motion.p key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-cream-100/60">
                      {t.quiz.pending}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
