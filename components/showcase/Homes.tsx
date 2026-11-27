"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, WhatsappLogo } from "@phosphor-icons/react";
import type { StoryStep } from "@/lib/i18n/showcase";
import { ScrollStory } from "./ScrollStory";
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

/**
 * Los dos modelos sin pestañas ni clics: al hacer scroll pasan fachada, planta baja y roof garden de
 * 2 recámaras y luego de 3. En cada fachada, precio de lista, metros y botones para cotizar.
 */
export function Homes({ t, num, lang, origin }: { t: ShowcaseCopy["homes"]; num?: number; lang: Lang; origin: string }) {
  const { openLead } = useLead();
  const steps: StoryStep[] = [];
  const meta: { model: Model; kind: "render" | "plan" | "roof" }[] = [];
  for (const model of MODELS) {
    const m = t.models[model];
    const price = modelPrice(model, lang);
    steps.push({
      kicker: model,
      title: `${m.tab} ${m.sub}`,
      text: `${t.from} ${price.main} ${price.unit}${price.sub ? ` · ${price.sub}` : ""}`,
      poster: m.render,
      alt: m.renderAlt,
    });
    meta.push({ model, kind: "render" });
    steps.push({
      kicker: model,
      title: t.story.planTitle,
      text: t.story.planText.replace("{built}", m.built),
      poster: m.plan,
      alt: m.planAlt,
      fit: "contain",
    });
    meta.push({ model, kind: "plan" });
    steps.push({
      kicker: model,
      title: t.story.roofTitle,
      text: t.story.roofText.replace("{roof}", m.roof),
      poster: m.roofPlan,
      alt: m.roofPlanAlt,
      fit: "contain",
    });
    meta.push({ model, kind: "roof" });
  }

  const extra = (k: number) => {
    const { model, kind } = meta[k];
    if (kind !== "render") return null;
    const m = t.models[model];
    const waAvail =
      lang === "en"
        ? `Hi Fran, I'd like to know the availability of the ${m.tab} model with roof garden in Ensenada.`
        : `Hola Fran, quiero conocer la disponibilidad del modelo de ${m.tab} con roof garden en Ensenada.`;
    return (
      <div className="mt-4">
        <dl className="grid grid-cols-3 gap-3 border-y border-white/15 py-3 lg:border-line">
          {[
            [m.total, t.totalLabel],
            [m.built, t.builtLabel],
            [m.roof, t.roofLabel],
          ].map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="story-title block font-display text-[1.35rem] leading-none md:text-[1.6rem]">{v}</span>
                <span className="story-text mt-1 block text-[0.75rem] leading-snug">{l}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            className="btn btn-gold btn-glow"
            onClick={() => openLead({ kind: "model", origin: `${origin}-modelo-${model}`, interes: model, title: t.quoteTitle.replace("{model}", m.tab) })}
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
            <WhatsappLogo className="size-5 text-[#25d366]" weight="fill" aria-hidden />
            {t.availability}
          </a>
        </div>
      </div>
    );
  };

  return (
    <ScrollStory
      id="casas"
      num={num}
      t={{ eyebrow: t.eyebrow, title: t.title, lead: t.lead, steps, frameLabel: t.story.frameLabel }}
      origin={origin}
      frame="landscape"
      tone="sand"
      extra={extra}
      footer={<p className="container-x pb-16 pt-6 text-xs text-ink-soft lg:pt-0">{t.note}</p>}
    />
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
