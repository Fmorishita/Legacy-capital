"use client";

import Image from "next/image";
import { CalendarCheck, Phone, WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { site, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";

type Props = { t: Dict["advisor"]; waGeneric: string };

/** Retrato del asesor o, mientras no exista, el escudo de la marca. */
export function AdvisorAvatar({ name, className = "" }: { name: string; className?: string }) {
  return site.advisor.hasPhoto ? (
    <span className={`relative block overflow-hidden rounded-full bg-bg-alt ${className}`}>
      <Image src="/img/fran-morishita.jpg" alt={name} fill sizes="96px" className="object-cover object-top" />
    </span>
  ) : (
    <span className={`grid place-items-center rounded-full bg-navy-900 ${className}`}>
      <Image src="/brand/crest-64.png" alt="" width={64} height={64} className="h-[62%] w-auto" />
    </span>
  );
}

export function Advisor({ t, waGeneric }: Props) {
  const { openLead } = useLead();

  return (
    <section id="asesor" aria-labelledby="advisor-title" className="bg-navy-950 py-24 text-cream-100 md:py-36">
      <div className="container-x grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:mx-0">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy-900">
            {site.advisor.hasPhoto ? (
              <Image
                src="/img/fran-morishita.jpg"
                alt={`${t.name}, ${t.role}`}
                fill
                sizes="(min-width: 1024px) 26rem, 90vw"
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <Image src="/brand/crest.png" alt="" width={300} height={391} className="h-40 w-auto opacity-90" />
              </div>
            )}
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent p-6 pt-24">
              <p className="font-caps text-xl font-semibold">{t.name}</p>
              <p className="mt-1 text-sm text-cream-100/80">{t.role}</p>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400">{t.eyebrow}</p>
            <h2 id="advisor-title" className="display mt-4 max-w-[17ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 flex items-center gap-5 border-y border-cream-100/15 py-6">
            <AdvisorAvatar name={t.name} className="size-16 shrink-0" />
            <div>
              <p className="font-caps text-2xl font-semibold">{t.name}</p>
              <p className="mt-1 text-cream-100/75">{t.role}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[56ch] text-lg leading-relaxed text-cream-100/80">{t.bio}</p>

            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.16em] text-gold-400">{t.whyTitle}</p>
            <ul className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {t.why.map((w, i) => (
                <li key={w.title} className="border-t border-cream-100/15 pt-4">
                  <p className="flex items-baseline gap-3 font-semibold">
                    <span className="font-display text-lg text-gold-400 tabular-nums">0{i + 1}</span>
                    {w.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-100/70">{w.text}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-6">
              {t.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm text-cream-100/70">{s.label}</dt>
                  <dd className="display text-5xl leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={waLink(waGeneric)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                onClick={() => trackEvent("whatsapp_click", { origin: "asesor" })}
              >
                <WhatsappLogo className="size-5" weight="fill" aria-hidden />
                {t.ctaWhatsapp}
              </a>
              <button type="button" className="btn btn-glass" onClick={() => openLead({ kind: "visit", origin: "asesor" })}>
                <CalendarCheck className="size-5" aria-hidden />
                {t.ctaVisit}
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-cream-100/15 pt-6">
              <a
                href={site.advisor.phoneHref}
                className="inline-flex items-center gap-2 text-sm text-cream-100/75 hover:text-cream-100"
                onClick={() => trackEvent("phone_click", { origin: "asesor" })}
              >
                <Phone className="size-4" aria-hidden />
                {site.advisor.phoneDisplay}
              </a>
              <p className="display text-xl italic text-gold-300">{t.tagline}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
