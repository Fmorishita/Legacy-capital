"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CalendarCheck, Sparkle } from "@phosphor-icons/react";
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

/** Comparativo preventa / entrega inmediata con un recomendador de dos preguntas. */
export function Compare({ t, portfolio }: { t: HomeCopy["compare"]; portfolio: PortfolioCopy }) {
  const { openLead } = useLead();
  const [when, setWhen] = useState<string>();
  const [pay, setPay] = useState<string>();
  const result = recommend(when, pay);
  const [pre, vin] = portfolio.items;
  const highlight = (id: ProjectId) => result === id || result === "ambos";

  const answer = (setter: (v: string) => void, value: string, q: string) => {
    setter(value);
    trackEvent("compare_answer", { question: q, answer: value });
  };

  const column = (id: ProjectId) =>
    `transition-colors duration-500 ${result && highlight(id) ? (id === "vinedos" ? "bg-vine-soft" : "bg-gold-500/10") : ""}`;

  return (
    <section id="compara" aria-labelledby="compare-title" className="bg-bg py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="compare-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        {/* Escritorio: tabla de tres columnas */}
        <Reveal delay={0.1} className="mt-14 hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{t.title}</caption>
            <thead>
              <tr>
                <td className="w-[22%] border-b border-line p-6 align-bottom" />
                {[pre, vin].map((p) => (
                  <th key={p.id} scope="col" className={`w-[39%] border-b border-l border-line p-6 align-top ${column(p.id)}`}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                      <Image src={p.image} alt="" fill sizes="35vw" className="object-cover" />
                    </div>
                    <StatusChip project={p.id} label={p.status} className="mt-5" />
                    <span className="display mt-3 block text-[1.9rem] leading-tight font-medium">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="border-b border-line px-6 py-5 align-top text-sm font-semibold text-ink-soft">
                    {r.label}
                  </th>
                  <td className={`border-b border-l border-line px-6 py-5 align-top leading-relaxed ${column("preventa")}`}>{r.preventa}</td>
                  <td className={`border-b border-l border-line px-6 py-5 align-top leading-relaxed ${column("vinedos")}`}>{r.vinedos}</td>
                </tr>
              ))}
              <tr>
                <td className="p-6" />
                {[pre, vin].map((p) => (
                  <td key={p.id} className={`border-l border-line p-6 ${column(p.id)}`}>
                    <Link href={p.href} className="btn btn-ghost">
                      {p.cta}
                      <ArrowRight className="size-4" weight="bold" aria-hidden />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        {/* Celular: una tarjeta por proyecto */}
        <div className="mt-12 grid gap-5 md:hidden">
          {[pre, vin].map((p) => (
            <Reveal key={p.id} className={`overflow-hidden rounded-2xl border border-line bg-surface ${column(p.id)}`}>
              <div className="relative aspect-[16/9]">
                <Image src={p.image} alt="" fill sizes="100vw" className="object-cover" />
                <StatusChip project={p.id} label={p.status} tone="dark" className="absolute left-4 top-4" />
              </div>
              <div className="p-5">
                <h3 className="display text-[1.9rem] leading-tight">{p.name}</h3>
                <dl className="mt-4 grid gap-3">
                  {t.rows.slice(1).map((r) => (
                    <div key={r.label} className="border-t border-line pt-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">{r.label}</dt>
                      <dd className="mt-1 leading-relaxed">{p.id === "preventa" ? r.preventa : r.vinedos}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={p.href} className="btn btn-ghost mt-6 w-full">
                  {p.cta}
                  <ArrowRight className="size-4" weight="bold" aria-hidden />
                </Link>
              </div>
            </Reveal>
          ))}
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
