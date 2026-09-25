"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, ArrowRight } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";

type ModelKey = "2R" | "3R";

export function Models({ t }: { t: Dict["models"] }) {
  const [model, setModel] = useState<ModelKey>("3R");
  const [view, setView] = useState<"render" | "plan">("render");
  const { openLead } = useLead();
  const m = t.tabs[model];

  return (
    <section id="casas" aria-labelledby="models-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <h2 id="models-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label={t.title} className="flex rounded-full border border-line-strong p-1">
            {(Object.keys(t.tabs) as ModelKey[]).map((k) => (
              <button
                key={k}
                role="tab"
                id={`tab-${k}`}
                aria-selected={model === k}
                aria-controls="model-panel"
                onClick={() => setModel(k)}
                className="relative rounded-full px-5 py-2.5 text-sm font-semibold sm:px-7"
              >
                {model === k && (
                  <motion.span
                    layoutId="model-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={`relative transition-colors ${model === k ? "text-bg" : "text-ink"}`}>{t.tabs[k].label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["render", "plan"] as const).map((v) => (
              <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>
                {v === "render" ? t.viewRender : t.viewPlan}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          id="model-panel"
          role="tabpanel"
          aria-labelledby={`tab-${model}`}
          className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12"
        >
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`${model}-${view}`}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={view === "render" ? m.image : m.plan}
                  alt={`${view === "render" ? t.renderAlt : t.planAlt} ${m.label}`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={view === "render" ? "object-cover" : "object-contain p-4 sm:p-8"}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col">
            <div className="flex items-end gap-3 border-b border-line pb-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={m.total}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="display text-[4.2rem] leading-[0.9] tabular-nums md:text-[5rem]"
                >
                  {m.total}
                </motion.span>
              </AnimatePresence>
              <span className="pb-2 text-sm leading-tight text-ink-soft">{t.totalLabel}</span>
            </div>

            <dl className="grid grid-cols-3 gap-4 border-b border-line py-6">
              {m.specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs font-medium uppercase tracking-[0.1em] text-ink-soft">{s.label}</dt>
                  <dd className="mt-1.5 font-semibold tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 py-6 text-[0.95rem]">
              {m.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto rounded-2xl border border-line bg-surface p-5">
              <p className="display text-3xl">{m.price}</p>
              <p className="mt-1 text-xs text-ink-soft">{t.note}</p>
              <button
                type="button"
                className="btn btn-primary mt-4 w-full"
                onClick={() => openLead({ kind: "model", interes: model, origin: `modelo-${model}` })}
              >
                {t.cta}
                <ArrowRight className="size-4" weight="bold" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
