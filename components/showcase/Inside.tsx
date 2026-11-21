"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowRight, Check, Armchair, CookingPot, Leaf, PersonSimpleWalk, SwimmingPool, TennisBall } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import type { Lang } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { CountUp, Em, Eyebrow, LazyVideo } from "./primitives";

/** Recorre tu casa: lista de espacios y la foto del que eliges. */
export function InteriorTour({ t, num }: { t: ShowcaseCopy["interior"]; num?: number }) {
  const [i, setI] = useState(0);
  const room = t.rooms[i];
  return (
    <section id="interior" aria-labelledby="interior-title" className="section-sand py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="interior-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-bg shadow-[0_40px_90px_-50px_rgb(var(--shadow)/0.7)]">
            <AnimatePresence initial={false}>
              <motion.div
                key={room.image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={room.image} alt={room.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="grid gap-1.5">
            {t.rooms.map((r, k) => {
              const on = k === i;
              return (
                <li key={r.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setI(k)}
                    className={`w-full rounded-2xl px-5 py-3.5 text-left transition ${on ? "bg-surface shadow-[0_20px_40px_-26px_rgb(var(--shadow)/0.7)]" : "hover:bg-surface/60"}`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-sm italic text-gold-ink">{String(k + 1).padStart(2, "0")}</span>
                      <span className={`font-display text-[1.3rem] ${on ? "text-ink" : "text-ink-soft"}`}>{r.title}</span>
                    </span>
                    {on && <span className="mt-1 block pl-8 text-[0.92rem] text-ink-soft">{r.text}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Equipamiento: lo que viene incluido y el smart home en dos celulares con video. */
export function Equipment({ t, num, lang, ui }: { t: ShowcaseCopy["equipment"]; num?: number; lang: Lang; ui: ShowcaseCopy["ui"] }) {
  const fmt = useCallback((n: number) => `$${Math.round(n).toLocaleString(lang === "en" ? "en-US" : "es-MX")}`, [lang]);
  return (
    <section id="equipamiento" aria-labelledby="equipamiento-title" className="overflow-hidden py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="equipamiento-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem]">
              <Em text={t.title} />
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-8 inline-block rounded-2xl bg-navy-900 px-6 py-5 text-cream-100 shadow-[0_24px_50px_-24px_rgb(3_8_18/0.7)]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#ddbb84]">{t.upTo}</span>
            <span className="mt-1 block font-display text-[2.6rem] leading-none">
              <CountUp value={t.amount} format={fmt} /> {t.unit && <small className="font-sans text-base tracking-[0.08em] text-[#ddbb84]">{t.unit}</small>}
            </span>
            <span className="mt-2 block text-sm text-cream-100/75">{t.amountNote}</span>
          </Reveal>
          <div className="mt-9 grid gap-8 sm:grid-cols-2">
            {[
              [t.interiorTitle, t.interior],
              [t.smartTitle, t.smart],
            ].map(([title, items]) => (
              <Reveal key={title as string}>
                <h3 className="font-display text-[1.35rem]">{title as string}</h3>
                <ul className="mt-3 grid gap-2.5">
                  {(items as string[]).map((it) => (
                    <li key={it} className="flex gap-2.5 text-[0.98rem] leading-snug text-ink-soft">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="relative mx-auto flex w-full max-w-[30rem] items-start justify-center gap-5 py-6">
          {[
            { src: "/media/video/celular.mp4", poster: "/media/video/celular.jpg", label: t.phoneA, cls: "" },
            { src: "/media/video/cerradura.mp4", poster: "/media/video/cerradura.jpg", label: t.phoneB, cls: "mt-16" },
          ].map((p) => (
            <div
              key={p.src}
              className={`relative aspect-[9/19] w-[46%] overflow-hidden rounded-[2rem] border-[6px] border-[#0a1a2e] bg-[#0a1a2e] shadow-[0_40px_80px_-30px_rgb(3_8_18/0.7)] ${p.cls}`}
            >
              <LazyVideo src={p.src} poster={p.poster} label={p.label} className="absolute inset-0 h-full w-full object-cover" controls={{ play: ui.play, pause: ui.pause }} />
              <span aria-hidden className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/60" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
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

const AMENITY_ICONS = [SwimmingPool, TennisBall, CookingPot, Armchair, PersonSimpleWalk];

/** Amenidades: cinco destacadas que avanzan solas mientras se ven, y la lista completa. */
export function AmenitiesShowcase({ t, num }: { t: ShowcaseCopy["amenities"]; num?: number }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.4 });
  const item = t.featured[i];

  useEffect(() => {
    if (!auto || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((k) => (k + 1) % t.featured.length), 4200);
    return () => clearInterval(id);
  }, [auto, inView, t.featured.length]);

  return (
    <section id="amenidades" aria-labelledby="amenidades-title" className="section-sand py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="amenidades-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <div ref={box} className="mt-12 grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <ul className="order-2 grid gap-1.5 lg:order-1">
            {t.featured.map((f, k) => {
              const Icon = AMENITY_ICONS[k] ?? Leaf;
              const on = k === i;
              return (
                <li key={f.title}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setI(k);
                      setAuto(false);
                    }}
                    className={`relative w-full overflow-hidden rounded-2xl px-5 py-4 text-left transition ${on ? "bg-surface shadow-[0_20px_40px_-26px_rgb(var(--shadow)/0.7)]" : "hover:bg-surface/60"}`}
                  >
                    {on && <span aria-hidden className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-gold-500" />}
                    <span className="flex items-center gap-3">
                      <Icon className={`size-5 shrink-0 ${on ? "text-gold-ink" : "text-ink-soft"}`} weight="duotone" aria-hidden />
                      <span className={`font-display text-[1.3rem] ${on ? "text-ink" : "text-ink-soft"}`}>{f.title}</span>
                    </span>
                    {on && <span className="mt-1 block pl-8 text-[0.92rem] text-ink-soft">{f.text}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[22px] shadow-[0_40px_90px_-50px_rgb(var(--shadow)/0.7)] sm:aspect-[5/4] lg:order-2 lg:aspect-[6/5]">
            <AnimatePresence initial={false}>
              <motion.div
                key={item.image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" style={{ objectPosition: item.pos ?? "50% 50%" }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[2fr_1fr]">
          {[
            [t.clusterTitle, t.cluster],
            [t.devTitle, t.dev],
          ].map(([title, items]) => (
            <Reveal key={title as string}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">{title as string}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(items as string[]).map((a) => (
                  <li key={a} className="rounded-full border border-line-strong bg-surface/70 px-4 py-2 text-sm">
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
