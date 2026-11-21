"use client";

import Image from "next/image";
import { ArrowRight, Car, MapPin, MapTrifold, ShieldCheck, UsersThree, Wall } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { CountUp, Em, Eyebrow, LazyVideo } from "./primitives";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=El+Sauzal+de+Rodr%C3%ADguez%2C+Ensenada%2C+Baja+California";
const POINT_ICONS = [ShieldCheck, Wall, Car, UsersThree];

/** Acceso controlado: la caseta al atardecer y el video de un auto entrando. */
export function Secure({ t, num, ui }: { t: ShowcaseCopy["secure"]; num?: number; ui: ShowcaseCopy["ui"] }) {
  return (
    <section id="seguridad" aria-labelledby="seguridad-title" className="on-dark section-dark py-24 md:py-36">
      <div className="container-x">
        <Reveal className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="seguridad-title" className="display mt-5 text-[2.5rem] md:text-[3.6rem]">
              <Em text={t.title} />
            </h2>
          </div>
          <p className="lead">{t.lead}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
          <Reveal className="relative min-h-[26rem] overflow-hidden rounded-[22px] lg:min-h-[34rem]">
            <Image src="/media/img/caseta-atardecer.webp" alt={t.imageAlt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[50%_56%]" />
            <div className="absolute bottom-4 left-4 aspect-[9/16] w-[36%] max-w-[11.5rem] overflow-hidden rounded-2xl border-2 border-white/85 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8)]">
              <LazyVideo
                src="/media/video/acceso.mp4"
                poster="/media/video/acceso.jpg"
                label={t.clipLabel}
                className="absolute inset-0 h-full w-full object-cover"
                controls={{ play: ui.play, pause: ui.pause }}
              />
              <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold text-[#16202f]">{t.clipTag}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="grid content-start gap-4">
            <div className="rounded-[22px] border border-white/12 bg-white/[0.04] p-6">
              <p className="display text-[3.4rem] leading-none text-[#ddbb84]">
                <CountUp value={Number(t.stat.value)} />
              </p>
              <p className="mt-2 text-white/75">{t.stat.label}</p>
            </div>
            <ul className="grid gap-2">
              {t.points.map((p, i) => {
                const Icon = POINT_ICONS[i] ?? ShieldCheck;
                return (
                  <li key={p} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3.5 text-white/85">
                    <Icon className="size-5 shrink-0 text-[#ddbb84]" weight="duotone" aria-hidden />
                    {p}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Ensenada: por qué la zona, con tres razones y datos de renta vacacional. */
export function EnsenadaPlace({ t, num }: { t: ShowcaseCopy["ensenada"]; num?: number }) {
  return (
    <section id="ensenada" aria-labelledby="ensenada-title" className="py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[24rem] lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] shadow-[0_40px_90px_-40px_rgb(var(--shadow)/0.6)]">
            <Image src="/media/img/aerea-atardecer.webp" alt={t.imageAlt} fill sizes="(min-width: 1024px) 24rem, 90vw" className="object-cover object-[50%_62%]" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="ensenada-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem]">
              <Em text={t.title} />
            </h2>
            <p className="lead mt-5 max-w-[58ch]">{t.lead}</p>
          </Reveal>
          <ol className="mt-8 border-b border-line">
            {t.pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={0.06 * i} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line py-5">
                <span className="font-display text-[1.6rem] italic leading-none text-gold-ink">{["i", "ii", "iii"][i]}</span>
                <div>
                  <h3 className="font-display text-[1.4rem] leading-tight">{p.title}</h3>
                  <p className="mt-1 text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1} className="mt-8 grid grid-cols-3 gap-4">
            {t.stats.map((s) => (
              <div key={s.label}>
                <p className="display text-[1.9rem] leading-none text-gold-ink sm:text-[2.4rem]">
                  {s.prefix}
                  <CountUp value={s.value} format={(n) => n.toFixed(s.decimals ?? 0)} />
                  {s.suffix}
                </p>
                <p className="mt-2 text-[0.82rem] leading-snug text-ink-soft">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-6 text-xs text-ink-soft">{t.statsSource}</p>
        </div>
      </div>
    </section>
  );
}

/** Ubicación: mapa y tiempos a los puntos que más preguntan. */
export function LocationPlace({ t, num, origin }: { t: ShowcaseCopy["location"]; num?: number; origin: string }) {
  const { openLead } = useLead();
  return (
    <section id="ubicacion" aria-labelledby="ubicacion-title" className="on-dark section-dark py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
          <h2 id="ubicacion-title" className="display mt-5 max-w-[22ch] text-[2.3rem] md:text-[3.4rem]">
            <Em text={t.title} />
          </h2>
        </Reveal>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#0f2433]">
            <Image src="/img/ensenada-map.jpg" alt={t.mapAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            <span className="absolute left-[30%] top-[24%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <span className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#16202f] shadow-lg">{t.pin}</span>
              <MapPin className="bob mt-1 size-8 text-[#ddbb84] drop-shadow-lg" weight="fill" aria-hidden />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {t.places.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-display text-[1.25rem] text-white">{p.name}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-sm text-white/55">{p.dist}</span>
                    <span className="rounded-full bg-[#ddbb84] px-3 py-1 text-[0.8rem] font-semibold text-[#16202f]">{p.time}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/55">{t.note}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass"
                onClick={() => trackEvent("maps_click", { origin })}
              >
                <MapTrifold className="size-5" weight="duotone" aria-hidden />
                {t.mapsCta}
              </a>
              <button type="button" className="btn btn-gold" onClick={() => openLead({ kind: "visit", origin: `${origin}-ubicacion` })}>
                {t.tourCta}
                <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
