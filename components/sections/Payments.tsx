"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Info } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useLead } from "@/components/lead/LeadProvider";
import { site } from "@/lib/site";

// Precios y mensualidades publicados en el brochure de septiembre 2026.
// La mensualidad del brochure equivale al 10% diferido entre 16 pagos, dentro de un plazo de hasta 19 meses.
const BASE = {
  "2R": { price: 3_989_325, monthly: 24_933 },
  "3R": { price: 4_360_053, monthly: 27_250 },
} as const;
const PAYMENTS = 16;

type Model = keyof typeof BASE;
type Scheme = "financiado" | "contado";

export function Payments({ t, models, lang }: { t: Dict["payments"]; models: Dict["models"]["tabs"]; lang: "es" | "en" }) {
  const [model, setModel] = useState<Model>("2R");
  const [scheme, setScheme] = useState<Scheme>("financiado");
  const [promoActive, setPromoActive] = useState(false);
  useEffect(() => setPromoActive(Date.now() < new Date(site.promoEndsAt).getTime()), []);
  const { openLead } = useLead();
  const money = useCallback(
    (n: number) => "$" + Math.floor(n + 1e-6).toLocaleString(lang === "en" ? "en-US" : "es-MX"),
    [lang],
  );

  const { price, monthly } = BASE[model];
  const final = scheme === "contado" ? price * 0.95 : price;
  const parts =
    scheme === "financiado"
      ? [
          { key: "down", label: `${t.rows.down} (10%)`, pct: 10, amount: price * 0.1 },
          { key: "deferred", label: `${t.rows.deferred} (10%)`, pct: 10, amount: price * 0.1, monthly },
          { key: "deed", label: `${t.rows.deed} (80%)`, pct: 80, amount: price * 0.8 },
        ]
      : [
          { key: "down", label: `${t.rows.down} (40%)`, pct: 40, amount: final * 0.4 },
          { key: "deferred", label: `${t.rows.deferred19} (40%)`, pct: 40, amount: final * 0.4 },
          { key: "deed", label: `${t.rows.deed} (20%)`, pct: 20, amount: final * 0.2 },
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
            <div>
              <div className="flex flex-wrap gap-2" role="group" aria-label={lang === "en" ? "Model" : "Modelo"}>
                {(Object.keys(BASE) as Model[]).map((m) => (
                  <button key={m} type="button" className="chip" aria-pressed={model === m} onClick={() => setModel(m)}>
                    {models[m].label}
                  </button>
                ))}
              </div>
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
              <p className="text-sm text-ink-soft">{scheme === "contado" ? t.rows.finalPrice : t.rows.price}</p>
              <AnimatedNumber
                value={final}
                format={money}
                className="display mt-1 block text-[2.8rem] leading-none tabular-nums sm:text-6xl"
              />
            </div>
            {scheme === "contado" && (
              <p className="text-sm text-ink-soft">
                <span className="line-through">{money(price)}</span>
                <span className="ml-2 font-semibold text-gold-ink">
                  {t.rows.discount} {money(price - final)}
                </span>
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

          <dl className="mt-8 grid gap-6">
            {parts.map((p, i) => (
              <div key={p.key} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <dt className="flex items-center gap-3 text-ink-soft">
                  <span className={`size-2.5 rounded-full ${tones[i]}`} aria-hidden />
                  {p.label}
                </dt>
                <dd className="text-right">
                  <AnimatedNumber value={p.amount} format={money} className="font-display text-[1.7rem] font-semibold tabular-nums" />
                  {"monthly" in p && p.monthly ? (
                    <span className="block text-sm text-ink-soft">
                      {t.monthlyNote.replace("{n}", String(PAYMENTS))}{" "}
                      <AnimatedNumber value={p.monthly} format={money} className="font-semibold text-ink" />
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>

          {promoActive && (
            <p className="mt-8 flex gap-2 rounded-xl bg-bg-alt p-4 text-sm leading-relaxed">
              <Info className="mt-0.5 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
              {t.promo}
            </p>
          )}

          <button
            type="button"
            className="btn btn-primary mt-6 w-full"
            onClick={() => openLead({ kind: "plan", interes: model, esquema_pago: scheme, origin: `corrida-${scheme}` })}
          >
            {t.cta}
            <ArrowRight className="size-4" weight="bold" aria-hidden />
          </button>
          <p className="mt-4 text-xs leading-relaxed text-ink-soft">{t.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
