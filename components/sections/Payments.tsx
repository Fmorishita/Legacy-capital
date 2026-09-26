"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info, LockSimple } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { site } from "@/lib/site";

// Mensualidad del brochure de septiembre 2026 (10% diferido). Es el único monto que se muestra:
// la corrida completa se envía por WhatsApp para que el prospecto deje sus datos.
const MONTHLY = { "2R": 24_933, "3R": 27_250 } as const;

type Model = keyof typeof MONTHLY;
type Scheme = "financiado" | "contado";

export function Payments({ t, models, lang }: { t: Dict["payments"]; models: Dict["models"]["tabs"]; lang: "es" | "en" }) {
  const [model, setModel] = useState<Model>("2R");
  const [scheme, setScheme] = useState<Scheme>("financiado");
  const [promoActive, setPromoActive] = useState(false);
  useEffect(() => setPromoActive(Date.now() < new Date(site.promoEndsAt).getTime()), []);
  const { openLead } = useLead();
  const money = useCallback((n: number) => "$" + n.toLocaleString(lang === "en" ? "en-US" : "es-MX"), [lang]);

  const parts =
    scheme === "financiado"
      ? [
          { key: "down", label: `${t.rows.down} (10%)`, pct: 10 },
          { key: "deferred", label: `${t.rows.deferred} (10%)`, pct: 10, monthly: MONTHLY[model] },
          { key: "deed", label: `${t.rows.deed} (80%)`, pct: 80 },
        ]
      : [
          { key: "down", label: `${t.rows.down} (40%)`, pct: 40 },
          { key: "deferred", label: `${t.rows.deferred19} (40%)`, pct: 40 },
          { key: "deed", label: `${t.rows.deed} (20%)`, pct: 20 },
        ];
  const tones = ["bg-gold-500", "bg-gold-300", "bg-navy-800 dark:bg-cream-100/80"];

  return (
    <section id="pagos" aria-labelledby="pay-title" className="py-24 md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <h2 id="pay-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>

          <div className="mt-10 grid gap-6">
            <div className="flex flex-wrap gap-2" role="group" aria-label={lang === "en" ? "Model" : "Modelo"}>
              {(Object.keys(MONTHLY) as Model[]).map((m) => (
                <button key={m} type="button" className="chip" aria-pressed={model === m} onClick={() => setModel(m)}>
                  {models[m].label}
                </button>
              ))}
            </div>
            <div className="grid gap-3" role="radiogroup" aria-label={lang === "en" ? "Payment scheme" : "Esquema de pago"}>
              {(Object.keys(t.schemes) as Scheme[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={scheme === s}
                  onClick={() => setScheme(s)}
                  className={`rounded-2xl border p-5 text-left transition-colors ${
                    scheme === s ? "border-ink bg-surface" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`grid size-5 place-items-center rounded-full border ${scheme === s ? "border-ink" : "border-line-strong"}`}
                    >
                      {scheme === s && <span className="size-2.5 rounded-full bg-ink" />}
                    </span>
                    <span className="font-semibold">{t.schemes[s].label}</span>
                  </span>
                  <span className="mt-2 block pl-8 text-sm leading-relaxed text-ink-soft">{t.schemes[s].caption}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-2xl border border-line bg-surface p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div>
              <p className="text-sm text-ink-soft">{t.rows.price}</p>
              <p className="display mt-1 text-[2.6rem] leading-none sm:text-[3.4rem]">{models[model].price}</p>
            </div>
            {scheme === "contado" ? (
              <p className="max-w-[18ch] text-sm leading-snug text-ink-soft sm:text-right">
                <span className="display block text-[2rem] leading-none text-gold-ink">5%</span>
                {t.discountHook}
              </p>
            ) : (
              <p className="text-sm leading-snug text-ink-soft sm:text-right">
                {t.monthlyHook}
                <span className="display block text-[2rem] leading-none text-gold-ink tabular-nums">{money(MONTHLY[model])}</span>
              </p>
            )}
          </div>

          <div className="mt-8 flex h-3 overflow-hidden rounded-full" aria-hidden>
            {parts.map((p, i) => (
              <motion.span
                key={p.key}
                layout
                className={`${tones[i]} h-full`}
                initial={false}
                animate={{ width: `${p.pct}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
              />
            ))}
          </div>

          <dl className="mt-8 grid gap-5">
            {parts.map((p, i) => (
              <div key={p.key} className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-3 text-ink-soft">
                  <span className={`size-2.5 rounded-full ${tones[i]}`} aria-hidden />
                  {p.label}
                </dt>
                <dd className="flex items-center gap-2">
                  <span aria-hidden className="select-none font-display text-[1.1rem] font-semibold blur-[7px] sm:text-[1.5rem]">
                    $000,000
                  </span>
                  <LockSimple className="size-4 text-gold-ink" weight="bold" aria-hidden />
                  <span className="sr-only">{t.lockTitle}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-xl bg-bg-alt p-5">
            <p className="flex items-center gap-2 font-semibold">
              <LockSimple className="size-4 text-gold-ink" weight="bold" aria-hidden />
              {t.lockTitle}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t.lockBody}</p>
            <button
              type="button"
              className="btn btn-primary mt-5 w-full"
              onClick={() => openLead({ kind: "plan", interes: model, esquema_pago: scheme, origin: `corrida-${scheme}` })}
            >
              {t.cta}
              <ArrowRight className="size-4" weight="bold" aria-hidden />
            </button>
          </div>

          {promoActive && (
            <p className="mt-5 flex gap-2 text-sm leading-relaxed">
              <Info className="mt-0.5 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
              {t.promo}
            </p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">{t.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
