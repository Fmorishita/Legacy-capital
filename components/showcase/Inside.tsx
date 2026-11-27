"use client";

import { useCallback } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CoatHanger,
  CookingPot,
  DeviceMobile,
  Lightbulb,
  LockKey,
  Shower,
  Snowflake,
  Sparkle,
  WifiHigh,
} from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import type { Lang } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { CountUp, Em, Eyebrow } from "./primitives";
import { ScrollStory } from "./ScrollStory";

/** Recorre tu casa: cada espacio aparece al hacer scroll, sin tocar nada. */
export function InteriorTour({ t, num }: { t: ShowcaseCopy["interior"]; num?: number }) {
  return (
    <ScrollStory
      id="interior"
      num={num}
      origin="interior"
      frame="landscape"
      tone="sand"
      t={{
        eyebrow: t.eyebrow,
        title: t.title,
        lead: t.lead,
        frameLabel: t.title.replace(/\*/g, ""),
        steps: t.rooms.map((r, k) => ({ kicker: String(k + 1).padStart(2, "0"), title: r.title, text: r.text, poster: r.image, alt: r.alt })),
      }}
    />
  );
}

const INTERIOR_ICONS = [CookingPot, CoatHanger, Snowflake, Shower];
const SMART_ICONS = [LockKey, DeviceMobile, Lightbulb, WifiHigh];

/** Equipamiento: el ahorro al frente y cada cosa incluida con su ícono. */
export function Equipment({ t, num, lang }: { t: ShowcaseCopy["equipment"]; num?: number; lang: Lang }) {
  const fmt = useCallback((n: number) => `$${Math.round(n).toLocaleString(lang === "en" ? "en-US" : "es-MX")}`, [lang]);
  const groups = [
    { title: t.interiorTitle, items: t.interior, icons: INTERIOR_ICONS },
    { title: t.smartTitle, items: t.smart, icons: SMART_ICONS },
  ];
  return (
    <section id="equipamiento" aria-labelledby="equipamiento-title" className="overflow-hidden py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-[44rem]">
          <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
          <h2 id="equipamiento-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem]">
            <Em text={t.title} />
          </h2>
        </Reveal>

        {/* El ahorro, grande y con la foto de la cocina equipada */}
        <Reveal
          delay={0.06}
          className="relative mt-10 grid overflow-hidden rounded-[26px] bg-navy-900 text-cream-100 shadow-[0_40px_90px_-40px_rgb(3_8_18/0.8)] lg:grid-cols-[1fr_1.1fr]"
        >
          <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ddbb84]/40 bg-[#ddbb84]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ddbb84]">
              <Sparkle className="size-3.5" weight="fill" aria-hidden />
              {t.eyebrow}
            </span>
            <p className="mt-5 text-sm uppercase tracking-[0.2em] text-cream-100/70">{t.upTo}</p>
            <p className="display mt-1 text-[3.6rem] leading-none text-[#ddbb84] sm:text-[4.8rem]">
              <CountUp value={t.amount} format={fmt} />
              {t.unit && <small className="ml-2 font-sans text-base tracking-[0.08em]">{t.unit}</small>}
            </p>
            <p className="mt-3 max-w-[26ch] text-lg text-cream-100/90">
              {t.amountNote}, <span className="text-[#ddbb84]">{t.savingsTag}</span>.
            </p>
          </div>
          <div className="relative min-h-[16rem] lg:min-h-[22rem]">
            <Image src="/media/img/eq-cocinando.webp" alt={t.imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_26_46)_0%,transparent_30%)] lg:bg-[linear-gradient(90deg,rgb(10_26_46)_0%,transparent_35%)]" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          {groups.map((g) => (
            <div key={g.title}>
              <Reveal>
                <h3 className="font-display text-[1.6rem]">{g.title}</h3>
              </Reveal>
              <ul className="mt-5 grid grid-cols-2 gap-3">
                {g.items.map((it, k) => {
                  const Icon = g.icons[k] ?? Check;
                  return (
                    <Reveal
                      as="li"
                      key={it}
                      delay={0.05 * k}
                      className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-gold-500/60 sm:p-5"
                    >
                      <span className="grid size-11 place-items-center rounded-full bg-gold-500/15 text-gold-ink transition-transform duration-500 group-hover:scale-110">
                        <Icon className="size-6" weight="duotone" aria-hidden />
                      </span>
                      <span className="text-[0.95rem] leading-snug">{it}</span>
                    </Reveal>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Smart home: los dos videos como historia al hacer scroll, con lo que pasa en cada uno. */
export function SmartHome({ t, num, origin }: { t: ShowcaseCopy["smart"]; num?: number; origin: string }) {
  return <ScrollStory id="smart" num={num} t={t} origin={origin} />;
}

/** Roof garden: la terraza privada a todo lo ancho. */
export function RoofBanner({ t, num, origin }: { t: ShowcaseCopy["roof"]; num?: number; origin: string }) {
  const { openLead } = useLead();
  return (
    <section id="roof" aria-labelledby="roof-title" className="on-dark relative isolate flex min-h-[88svh] items-end overflow-hidden text-white lg:items-center">
      <Image src="/media/img/in-roof-atardecer.webp" alt={t.imageAlt} fill sizes="100vw" className="-z-20 object-cover object-[35%_50%]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(8_22_38/0.95),rgb(8_22_38/0.35)_55%,transparent)] lg:bg-[linear-gradient(270deg,rgb(8_22_38/0.92)_0%,rgb(8_22_38/0.6)_42%,transparent_72%)]" />
      <div className="container-x py-24">
        <Reveal className="ml-auto max-w-[34rem]">
          <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
          <h2 id="roof-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
            <Em text={t.title} />
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6">
            {t.stats.map((s) => (
              <div key={s.label}>
                <p className="display text-[2.8rem] leading-none text-[#ddbb84] md:text-[3.4rem]">{s.value}</p>
                <p className="mt-2 text-sm text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {t.features.map((f) => (
              <li key={f} className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                {f}
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-gold btn-glow mt-9" onClick={() => openLead({ kind: "visit", origin: `${origin}-roof` })}>
            {t.cta}
            <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/** Amenidades: cada una aparece al hacer scroll con su foto y su texto; abajo, la lista completa. */
export function AmenitiesShowcase({ t, num }: { t: ShowcaseCopy["amenities"]; num?: number }) {
  return (
    <ScrollStory
      id="amenidades"
      num={num}
      origin="amenidades"
      frame="landscape"
      tone="sand"
      t={{
        eyebrow: t.eyebrow,
        title: t.title,
        lead: t.lead,
        frameLabel: t.title.replace(/\*/g, ""),
        steps: t.featured.map((f, k) => ({ kicker: String(k + 1).padStart(2, "0"), title: f.title, text: f.text, poster: f.image, alt: f.alt, pos: f.pos })),
      }}
      footer={
        <div className="container-x grid gap-10 pb-24 pt-10 md:grid-cols-[2fr_1fr] lg:pt-0">
          {[
            [t.clusterTitle, t.cluster],
            [t.devTitle, t.dev],
          ].map(([title, items]) => (
            <div key={title as string}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">{title as string}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(items as string[]).map((a) => (
                  <li key={a} className="rounded-full border border-line-strong bg-surface/70 px-4 py-2 text-sm">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      }
    />
  );
}
