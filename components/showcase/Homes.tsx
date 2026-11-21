"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, WhatsappLogo } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { LIST_PRICE, USD_RATE, money, type Model } from "@/lib/money";
import { waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { Em, Eyebrow } from "./primitives";

const MODELS: Model[] = ["2R", "3R"];

/** Precio de lista: pesos completos en español; en inglés, miles de dólares (aprox.) y los pesos abajo. */
export function modelPrice(model: Model, lang: Lang) {
  const mxn = LIST_PRICE[model];
  if (lang === "en") return { main: `$${Math.floor(mxn / USD_RATE / 1000)}K`, unit: "USD", sub: `MXN ${money(mxn, "es")}` };
  return { main: money(mxn, "es"), unit: "MXN", sub: "" };
}

type View = "render" | "plan" | "roof";

/** Los dos modelos: render, planta baja y planta del roof, precio de lista y lo que incluye. */
export function Homes({ t, num, lang, origin }: { t: ShowcaseCopy["homes"]; num?: number; lang: Lang; origin: string }) {
  const { openLead } = useLead();
  const [model, setModel] = useState<Model>("2R");
  const [view, setView] = useState<View>("render");
  const m = t.models[model];
  const price = modelPrice(model, lang);
  const src = view === "render" ? m.render : view === "plan" ? m.plan : m.roofPlan;
  const alt = view === "render" ? m.renderAlt : view === "plan" ? m.planAlt : m.roofPlanAlt;
  const waAvail =
    lang === "en"
      ? `Hi Fran, I'd like to know the availability of the ${m.tab} model with roof garden in Ensenada.`
      : `Hola Fran, quiero conocer la disponibilidad del modelo de ${m.tab} con roof garden en Ensenada.`;

  return (
    <section id="casas" aria-labelledby="casas-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="casas-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <div role="radiogroup" aria-label={t.eyebrow} className="mt-10 inline-flex rounded-full border border-line bg-surface p-1">
          {MODELS.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={model === k}
              onClick={() => {
                setModel(k);
                trackEvent("model_view", { model: k, origin });
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                model === k ? "bg-ink text-bg shadow" : "text-ink-soft hover:text-ink"
              }`}
            >
              {t.models[k].tab}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-[22px] bg-[#f4efe6] shadow-[0_40px_90px_-50px_rgb(var(--shadow)/0.7)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className={view === "render" ? "object-cover" : "object-contain p-4"}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(t.views) as View[]).map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>
                  {t.views[v]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-flex rounded-full bg-gold-500/15 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-ink">
              {t.badge}
            </span>
            <h3 className="display mt-4 text-[2.4rem] leading-none md:text-[2.9rem]">
              {m.name} <em className="block text-[0.62em]">{m.sub}</em>
            </h3>
            <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
              <span className="text-sm text-ink-soft">{t.from}</span>
              <span className="display text-[2.1rem] leading-none text-ink">{price.main}</span>
              <span className="text-sm tracking-[0.08em] text-ink-soft">{price.unit}</span>
              {price.sub && <span className="basis-full pt-1 text-sm text-ink-soft">{price.sub}</span>}
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-line py-5">
              {[
                [m.total, t.totalLabel],
                [m.built, t.builtLabel],
                [m.roof, t.roofLabel],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-display text-[1.6rem] leading-none">{v}</span>
                    <span className="mt-1.5 block text-[0.78rem] leading-snug text-ink-soft">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 grid gap-2.5">
              {m.features.map((f) => (
                <li key={f} className="flex gap-3 leading-snug">
                  <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                    <Check className="size-3" weight="bold" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-gold btn-glow"
                onClick={() =>
                  openLead({
                    kind: "model",
                    origin: `${origin}-modelo-${model}`,
                    interes: model,
                    title: t.quoteTitle.replace("{model}", m.tab),
                  })
                }
              >
                {t.quote}
                <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
              </button>
              <a
                href={waLink(waAvail)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-disponibilidad-${model}` })}
              >
                <WhatsappLogo className="size-5 text-[#1f8f4e]" weight="fill" aria-hidden />
                {t.availability}
              </a>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-ink-soft">{t.note}</p>
      </div>
    </section>
  );
}

/** Portada: los dos modelos en tarjetas, con liga a la página completa de la preventa. */
export function HomesTeaser({
  t,
  homes,
  num,
  lang,
  href,
  origin,
}: {
  t: ShowcaseCopy["homesTeaser"];
  homes: ShowcaseCopy["homes"];
  num?: number;
  lang: Lang;
  href: string;
  origin: string;
}) {
  const { openLead } = useLead();
  return (
    <section id="casas" aria-labelledby="casas-title" className="section-sand py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="casas-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {MODELS.map((k, i) => {
            const m = homes.models[k];
            const price = modelPrice(k, lang);
            return (
              <Reveal as="article" key={k} delay={i * 0.08} className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-surface">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={m.render}
                    alt={m.renderAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#0a1a2e]/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#ddbb84] backdrop-blur-md">
                    {homes.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="display text-[2rem] leading-none">
                    {m.name} <em className="text-[0.7em]">{m.sub}</em>
                  </h3>
                  <p className="mt-4 flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm text-ink-soft">{homes.from}</span>
                    <span className="display text-[1.9rem] leading-none">{price.main}</span>
                    <span className="text-sm tracking-[0.08em] text-ink-soft">{price.unit}</span>
                  </p>
                  <p className="mt-4 text-ink-soft">
                    <span className="font-display text-[1.25rem] text-ink">{m.total}</span> {homes.totalLabel} ·{" "}
                    <span className="font-display text-[1.25rem] text-ink">{m.roof}</span> {homes.roofLabel}
                  </p>
                  <ul className="mt-5 grid gap-2 text-[0.95rem]">
                    {m.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-7">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        openLead({ kind: "model", origin: `${origin}-modelo-${k}`, interes: k, proyecto: "preventa", title: homes.quoteTitle.replace("{model}", m.tab) })
                      }
                    >
                      {homes.quote}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Link href={href} className="btn btn-gold btn-lg btn-glow" onClick={() => trackEvent("project_pick", { project: "preventa", origin: `${origin}-casas` })}>
            {t.cta}
            <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
