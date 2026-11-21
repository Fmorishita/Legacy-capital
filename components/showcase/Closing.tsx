"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, CaretDown, WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/lead/LeadForm";
import { useLead } from "@/components/lead/LeadProvider";
import { Em, Eyebrow, LazyVideo } from "./primitives";

/** Contacto: qué recibes al escribir y el formulario de dos pasos (datos, luego perfil y visita). */
export function Contact({
  t,
  form,
  num,
  lang,
  privacyHref,
  origin,
}: {
  t: ShowcaseCopy["contact"];
  form: Dict["form"];
  num?: number;
  lang: Lang;
  privacyHref: string;
  origin: string;
}) {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="py-24 md:py-36">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="contacto-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem]">
              <Em text={t.title} />
            </h2>
            <p className="lead mt-5 max-w-[52ch]">{t.lead}</p>
            <ul className="mt-6 grid gap-2">
              {t.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Check className="size-4 text-gold-ink" weight="bold" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="relative mt-10 aspect-[4/3] max-w-[30rem] overflow-hidden rounded-[22px] shadow-[0_40px_90px_-50px_rgb(var(--shadow)/0.7)]">
            <Image src="/media/img/fran-entrada.webp" alt={t.imageAlt} fill sizes="(min-width: 1024px) 30rem, 90vw" className="object-cover object-[50%_35%]" />
          </Reveal>
        </div>
        <Reveal delay={0.05} className="rounded-[22px] border border-line bg-surface p-6 shadow-[0_30px_70px_-40px_rgb(var(--shadow)/0.6)] sm:p-8 lg:sticky lg:top-28">
          <h3 className="display mb-6 text-[1.9rem] leading-tight">{t.formTitle}</h3>
          <LeadForm
            t={form}
            lang={lang}
            origin={`${origin}-contacto`}
            submitLabel={t.submit}
            fields={{ interest: true, visit: true, email: true, project: true }}
            privacyHref={privacyHref}
          />
        </Reveal>
      </div>
    </section>
  );
}

/** Preguntas frecuentes con acordeón nativo y una nota sobre quién acompaña al comprador. */
export function FaqShowcase({ t, num }: { t: ShowcaseCopy["faq"]; num?: number }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-sand py-24 md:py-36">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28">
          <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
          <h2 id="faq-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem]">
            <Em text={t.title} />
          </h2>
          <div className="mt-8 rounded-[20px] border border-line bg-surface p-6">
            <p className="eyebrow">{t.asideTitle}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{t.asideText}</p>
          </div>
        </Reveal>
        <div className="border-b border-line">
          {t.items.map((item) => (
            <details key={item.q} className="group border-t border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[1.25rem] leading-snug marker:hidden md:text-[1.4rem] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong transition-transform duration-300 group-open:rotate-180 group-open:bg-navy-900 group-open:text-cream-100">
                  <CaretDown className="size-4" weight="bold" aria-hidden />
                </span>
              </summary>
              <p className="max-w-[68ch] pb-6 pr-12 leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Cierre: urgencia de preventa, WhatsApp y cita, con Fran abriendo la puerta. */
export function Closing({ t, waMessage, ui, origin }: { t: ShowcaseCopy["closing"]; waMessage: string; ui: ShowcaseCopy["ui"]; origin: string }) {
  const { openLead } = useLead();
  return (
    <section id="cierre" aria-labelledby="cierre-title" className="on-dark relative isolate overflow-hidden bg-[#0a1a2e] py-24 text-white md:py-32">
      <Image src="/media/img/aerea-render.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0a1a2e_20%,rgb(10_26_46/0.7)_60%,rgb(10_26_46/0.45))]" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="cierre-title" className="display mt-5 text-[3rem] leading-[1.02] md:text-[4.6rem]">
            <Em text={t.title} />
          </h2>
          <p className="lead mt-5 max-w-[44ch]">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa btn-lg btn-glow"
              onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-cierre` })}
            >
              <WhatsappLogo className="wiggle size-5" weight="fill" aria-hidden />
              {t.ctaWa}
            </a>
            <button type="button" className="btn btn-glass btn-lg" onClick={() => openLead({ kind: "visit", origin: `${origin}-cierre` })}>
              <CalendarCheck className="size-5" weight="duotone" aria-hidden />
              {t.ctaVisit}
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="relative mx-auto aspect-[9/14] w-full max-w-[17rem] overflow-hidden rounded-[22px] border border-white/15 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] lg:mx-0 lg:justify-self-end">
          <LazyVideo
            src="/media/video/p2-puerta.mp4"
            poster="/media/video/p2-puerta.jpg"
            label={t.videoLabel}
            className="absolute inset-0 h-full w-full object-cover"
            controls={{ play: ui.play, pause: ui.pause }}
          />
        </Reveal>
      </div>
    </section>
  );
}

/** El 20%: la entrega inmediata como opción para quien necesita estrenar ya. */
export function MoveInTeaser({ t, num, href, origin }: { t: ShowcaseCopy["moveIn"]; num?: number; href: string; origin: string }) {
  return (
    <section id="estrenar" aria-labelledby="estrenar-title" className="py-20 md:py-28">
      <div className="container-x">
        <Reveal className="grid overflow-hidden rounded-[26px] border border-line bg-surface lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-video lg:aspect-auto lg:min-h-[26rem]">
            <LazyVideo src="/video/vdm-hero.mp4" poster="/video/vdm-hero-poster.jpg" label={t.videoLabel} className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#0a1a2e]/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <span aria-hidden className="size-2 rounded-full bg-vine-400" />
              {t.facts[0]}
            </span>
          </div>
          <div className="p-7 sm:p-10">
            <Eyebrow num={num} className="!text-vine-ink">
              {t.eyebrow}
            </Eyebrow>
            <h2 id="estrenar-title" className="display mt-4 text-[2.1rem] md:text-[2.7rem]">
              <Em text={t.title} />
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t.lead}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {t.facts.map((f) => (
                <li key={f} className="rounded-full bg-vine-soft px-3.5 py-1.5 text-sm font-medium text-vine-ink">
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <span className="display text-[1.8rem]">{t.price}</span> <span className="text-sm text-ink-soft">{t.priceNote}</span>
            </p>
            <Link
              href={href}
              className="btn mt-6 bg-vine-700 text-white shadow-[0_12px_28px_-14px_rgb(68_96_58/0.9)] hover:bg-vine-500"
              onClick={() => trackEvent("project_pick", { project: "vinedos", origin: `${origin}-estrenar` })}
            >
              {t.cta}
              <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
