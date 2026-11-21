"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { APPRECIATION, LIST_PRICE, bridge, cash, inCurrency, millions, money, type Model } from "@/lib/money";
import { waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { Em, Eyebrow } from "./primitives";

// Gráfica en un lienzo de 1000 x 400: las líneas se estiran con el contenedor y los puntos y
// etiquetas se colocan en porcentaje, así nunca se deforman.
const W = 1000;
const H = 400;
const PAD = { l: 24, r: 24, t: 60, b: 40 };
const MIN = 4.0;
const MAX = 10.2;
const x = (i: number) => PAD.l + (W - PAD.l - PAD.r) * (APPRECIATION.months[i] / 96);
const y = (v: number) => PAD.t + (H - PAD.t - PAD.b) * (1 - (v - MIN) / (MAX - MIN));
const curve = (arr: readonly number[]) =>
  arr
    .map((v, i) => {
      if (!i) return `M${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      const px = x(i - 1);
      const py = y(arr[i - 1]);
      const cx = (px + x(i)) / 2;
      return `C${cx.toFixed(1)},${py.toFixed(1)} ${cx.toFixed(1)},${y(v).toFixed(1)} ${x(i).toFixed(1)},${y(v).toFixed(1)}`;
    })
    .join(" ");

/** Plusvalía proyectada con apreciación conservadora (8%) y optimista (10%). */
export function Appreciation({ t, num, lang, origin }: { t: ShowcaseCopy["value"]; num?: number; lang: Lang; origin: string }) {
  const reduce = useReducedMotion();
  const { cons, opt, years } = APPRECIATION;
  const values = cons.map((c, i) => (i === 0 ? millions(c, lang) : `${millions(c, lang)} – ${millions(opt[i], lang)}`));

  return (
    <section id="plusvalia" aria-labelledby="plusvalia-title" className="on-dark section-dark py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="plusvalia-title" className="display mt-5 text-[2.4rem] md:text-[3.5rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <div className="relative h-[15rem] sm:h-[19rem]" role="img" aria-label={t.chartLabel}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="value-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ddbb84" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#ddbb84" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[4, 5, 6, 7, 8, 9, 10].map((v) => (
                <line key={v} x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="rgb(255 255 255 / 0.07)" vectorEffect="non-scaling-stroke" />
              ))}
              <path d={`${curve(opt)} L${x(3)},${y(MIN)} L${x(0)},${y(MIN)} Z`} fill="url(#value-area)" />
              <motion.path
                d={curve(cons)}
                fill="none"
                stroke="#8fb3c9"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d={curve(opt)}
                fill="none"
                stroke="#ddbb84"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            {cons.map((c, i) => (
              <span key={`c${i}`}>
                <span
                  aria-hidden
                  className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#8fb3c9] bg-[#0a1a2e]"
                  style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(c) / H) * 100}%` }}
                />
                {i > 0 && (
                  <>
                    <span
                      aria-hidden
                      className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ddbb84] shadow-[0_0_0_5px_rgb(221_187_132/0.18)]"
                      style={{ left: `${(x(i) / W) * 100}%`, top: `${(y(opt[i]) / H) * 100}%` }}
                    />
                    <span
                      aria-hidden
                      className={`absolute whitespace-nowrap rounded-full bg-[#ddbb84] px-2 py-0.5 text-[0.72rem] font-semibold text-[#16202f] ${i === 3 ? "-translate-x-full" : "-translate-x-1/2"}`}
                      style={{ left: `${(x(i) / W) * 100}%`, top: `calc(${(y(opt[i]) / H) * 100}% - 2rem)` }}
                    >
                      {millions(opt[i], lang)}
                    </span>
                  </>
                )}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-[3px] w-6 rounded-full bg-[#ddbb84]" />
              {t.legend.opt}
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-0 w-6 border-t-2 border-dashed border-[#8fb3c9]" />
              {t.legend.cons}
            </span>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/10 pt-7 lg:grid-cols-4">
            {t.labels.map((label, i) => (
              <div key={label}>
                <dt className="text-[0.72rem] uppercase tracking-[0.18em] text-white/55">{label}</dt>
                <dd className="mt-2 font-display text-[1.45rem] leading-tight text-white sm:text-[1.7rem]">{values[i]}</dd>
                <dd className={`mt-1 text-xs ${i === 1 ? "text-[#5be38e]" : "text-white/55"}`}>{t.subs[i] ?? years[i]}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <p className="mt-5 max-w-[80ch] text-xs leading-relaxed text-white/55">{t.note}</p>
        <Reveal className="mt-8 flex flex-wrap items-center gap-4">
          <p className="text-white/85">{t.ask}</p>
          <a href="#material" className="btn btn-gold btn-glow" onClick={() => trackEvent("cta_click", { cta: "roi", origin: `${origin}-plusvalia` })}>
            {t.cta}
            <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

type Scheme = "bridge" | "cash";

/** Puente financiero: calcula los pagos del modelo elegido con el esquema 10 · 10 · 80 o de contado. */
export function PaymentBridge({ t, num, lang, waMessage, origin }: { t: ShowcaseCopy["pay"]; num?: number; lang: Lang; waMessage: string; origin: string }) {
  const { openLead } = useLead();
  const [scheme, setScheme] = useState<Scheme>("bridge");
  const [model, setModel] = useState<Model>("2R");
  const p = LIST_PRICE[model];
  const fmt = useCallback((n: number) => money(n, lang), [lang]);
  const cur = (mxn: number) => inCurrency(mxn, lang);

  return (
    <section id="pagos" aria-labelledby="pagos-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="pagos-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div role="radiogroup" aria-label={t.eyebrow} className="flex rounded-full border border-line bg-surface p-1">
            {(["bridge", "cash"] as Scheme[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={scheme === s}
                onClick={() => {
                  setScheme(s);
                  trackEvent("pay_scheme", { scheme: s, origin });
                }}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors sm:px-5 ${scheme === s ? "bg-ink text-bg shadow" : "text-ink-soft hover:text-ink"}`}
              >
                {t.schemes[s]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-soft">{t.calcFor}</span>
            <div role="radiogroup" aria-label={t.calcFor} className="flex rounded-full border border-line bg-surface p-1">
              {(Object.keys(t.models) as Model[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={model === k}
                  onClick={() => {
                    setModel(k);
                    trackEvent("pay_model", { model: k, origin });
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${model === k ? "bg-gold-500 text-navy-900" : "text-ink-soft hover:text-ink"}`}
                >
                  {t.models[k]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {scheme === "bridge" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1.2fr_1fr]">
            <div className="rounded-[22px] bg-navy-900 p-6 text-cream-100 shadow-[0_30px_60px_-30px_rgb(3_8_18/0.7)] dark:ring-1 dark:ring-white/12">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[#ddbb84]">{t.bridge.today}</p>
              <p className="display mt-3 text-[3rem] leading-none">10%</p>
              <p className="mt-3 font-display text-[1.6rem]">
                <AnimatedNumber value={cur(bridge.down(p))} format={fmt} />
              </p>
              <p className="text-sm text-cream-100/70">{t.bridge.downNote}</p>
            </div>
            <div className="relative overflow-hidden rounded-[22px] border border-line bg-surface p-6">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-gold-ink">{t.bridge.during}</p>
              <p className="display mt-3 text-[3rem] leading-none">10%</p>
              <p className="mt-3 font-display text-[1.6rem]">
                20 × <AnimatedNumber value={cur(bridge.monthly(p))} format={fmt} />
              </p>
              <p className="text-sm text-ink-soft">{t.bridge.monthlyNote}</p>
              <div aria-hidden className="mt-5 flex h-12 items-end gap-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.i
                    key={i}
                    className="block flex-1 rounded-sm bg-gold-500/70"
                    initial={{ height: 4 }}
                    whileInView={{ height: `${12 + ((i / 19) ** 2) * 88}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.03 * i, duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[22px] bg-[#16324d] p-6 text-cream-100 shadow-[0_30px_60px_-30px_rgb(3_8_18/0.7)]">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[#ddbb84]">{t.bridge.delivery}</p>
              <p className="display mt-3 text-[3rem] leading-none">80%</p>
              <p className="mt-3 font-display text-[1.6rem]">
                <AnimatedNumber value={cur(bridge.delivery(p))} format={fmt} />
              </p>
              <p className="text-sm text-cream-100/70">{t.bridge.deliveryNote}</p>
            </div>
            <p className="text-xs leading-relaxed text-ink-soft md:col-span-3">
              {t.bridge.note} {t.currencyNote}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t.cash.final, value: cash.final(p), note: t.cash.finalNote, dark: true },
              { label: t.cash.down, value: cash.down(p) },
              { label: t.cash.monthly, value: cash.monthly(p), prefix: "19 × " },
              { label: t.cash.deed, value: cash.deed(p) },
            ].map((c) => (
              <div
                key={c.label}
                className={`rounded-[22px] p-6 ${c.dark ? "bg-navy-900 text-cream-100 dark:ring-1 dark:ring-white/12" : "border border-line bg-surface"}`}
              >
                <p className={`text-[0.72rem] uppercase tracking-[0.18em] ${c.dark ? "text-[#ddbb84]" : "text-gold-ink"}`}>{c.label}</p>
                <p className="mt-4 font-display text-[1.75rem] leading-tight">
                  {c.prefix}
                  <AnimatedNumber value={cur(c.value)} format={fmt} />
                </p>
                {c.note && <p className="mt-1 text-sm text-cream-100/70">{c.note}</p>}
              </div>
            ))}
            <p className="text-xs leading-relaxed text-ink-soft sm:col-span-2 lg:col-span-4">
              {t.cash.note} {t.currencyNote}
            </p>
          </div>
        )}

        <Reveal className="mt-10 grid items-center gap-8 overflow-hidden rounded-[24px] border border-line bg-surface md:grid-cols-[0.42fr_0.58fr]">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[19rem]">
            <Image src="/media/img/plan-de-pagos.webp" alt={t.imageAlt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[50%_45%]" />
          </div>
          <div className="p-6 pt-0 md:p-10 md:pl-0">
            <div className="flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-500/60">
                <Image src="/media/img/fran-avatar.webp" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <p className="text-sm text-ink-soft">{t.quoteBy}</p>
            </div>
            <p className="display mt-5 text-[1.6rem] leading-snug md:text-[1.9rem]">{t.quote}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-gold btn-glow"
                onClick={() =>
                  openLead({
                    kind: "plan",
                    origin: `${origin}-pagos-${scheme}-${model}`,
                    interes: model,
                    proyecto: "preventa",
                    esquema_pago: scheme === "bridge" ? "financiado" : "contado",
                  })
                }
              >
                {t.cta}
                <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
              </button>
              <a
                href={waLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-pagos` })}
              >
                <WhatsappLogo className="size-5 text-[#1f8f4e]" weight="fill" aria-hidden />
                {t.ctaWa}
              </a>
            </div>
          </div>
        </Reveal>
        <p className="mt-5 text-xs text-ink-soft">{t.legal}</p>
      </div>
    </section>
  );
}
