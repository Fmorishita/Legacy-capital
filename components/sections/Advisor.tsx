"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, WhatsappLogo, Phone, CalendarCheck } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { site, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";

export function Advisor({ t, waGeneric }: { t: Dict["advisor"]; waGeneric: string }) {
  const { openLead } = useLead();
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    setStarted(true);
    trackEvent("testimonial_play");
    requestAnimationFrame(() => video.current?.play().catch(() => {}));
  };

  return (
    <section id="asesor" aria-labelledby="advisor-title" className="py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <Reveal className="mx-auto w-full max-w-sm lg:mx-0">
          <figure>
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-navy-950">
              {site.advisor.hasPhoto && !started ? (
                <Image src="/img/fran-morishita.jpg" alt={t.name} fill sizes="24rem" className="object-cover" />
              ) : null}
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                src={site.testimonialVideo}
                poster={site.testimonialPoster}
                preload="none"
                playsInline
                controls={started}
              />
              {!started && (
                <button
                  type="button"
                  onClick={play}
                  className="group absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent p-6 text-left text-cream-100"
                >
                  <span className="mb-auto mt-[42%] grid size-20 place-items-center rounded-full bg-cream-100/90 text-navy-800 shadow-xl transition group-hover:scale-105">
                    <Play className="size-8 translate-x-0.5" weight="fill" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-300">{t.playTestimonial}</span>
                </button>
              )}
            </div>
            <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">{t.testimonial}</figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="advisor-title" className="display mt-4 max-w-[17ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 flex items-center gap-5 border-y border-line py-6">
            <Image src="/brand/crest.png" alt="" width={300} height={391} className="h-16 w-auto" />
            <div>
              <p className="font-caps text-2xl font-semibold">{t.name}</p>
              <p className="mt-1 text-ink-soft">{t.role}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.bio}</p>
            <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-6">
              {t.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-2 text-sm text-ink-soft">{s.label}</dt>
                  <dd className="display text-5xl leading-none">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={waLink(waGeneric)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                onClick={() => trackEvent("whatsapp_click", { origin: "asesor" })}
              >
                <WhatsappLogo className="size-5" weight="fill" aria-hidden />
                {t.ctaWhatsapp}
              </a>
              <button type="button" className="btn btn-ghost" onClick={() => openLead({ kind: "visit", origin: "asesor" })}>
                <CalendarCheck className="size-5" aria-hidden />
                {t.ctaVisit}
              </button>
            </div>
            <a
              href={site.advisor.phoneHref}
              className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
              onClick={() => trackEvent("phone_click", { origin: "asesor" })}
            >
              <Phone className="size-4" aria-hidden />
              {site.advisor.phoneDisplay}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
