"use client";

import Image from "next/image";
import { CalendarCheck, SealCheck, WhatsappLogo } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { site, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { Em, Eyebrow } from "./primitives";

/** "Hola, soy Fran Morishita": quién te atiende, cómo empieza el proceso y dos formas de contacto. */
export function AdvisorIntro({ t, num, waMessage, origin }: { t: ShowcaseCopy["advisor"]; num?: number; waMessage: string; origin: string }) {
  const { openLead } = useLead();

  return (
    <section id="asesor" aria-labelledby="asesor-title" className="overflow-hidden py-24 md:py-36">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal className="relative mx-auto w-full max-w-[25rem] lg:mx-0">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-bg-alt shadow-[0_40px_90px_-40px_rgb(var(--shadow)/0.6)]">
            <Image
              src="/media/img/fran-asesor-casa.webp"
              alt={t.photoAlt}
              fill
              sizes="(min-width: 1024px) 25rem, 90vw"
              className="object-cover object-[50%_30%]"
            />
          </figure>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-asesor-card` })}
            className="bob absolute -right-3 top-[10%] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#16202f] shadow-[0_20px_40px_-18px_rgb(3_8_18/0.55)] sm:-right-8"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#25d366] text-white">
              <WhatsappLogo className="wiggle size-5" weight="fill" aria-hidden />
            </span>
            <span className="leading-tight">
              <strong className="block text-[0.95rem] font-semibold tabular-nums">{site.advisor.phoneDisplay.replace("+52 ", "")}</strong>
              <span className="text-xs text-[#56636b]">{t.waLabel}</span>
            </span>
          </a>
          <p className="absolute -left-3 bottom-[9%] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#16202f] shadow-[0_20px_40px_-18px_rgb(3_8_18/0.55)] sm:-left-8">
            <span aria-hidden className="live-dot size-2.5 rounded-full bg-[#2fbf68]" />
            <span className="leading-tight">
              <strong className="block text-[0.92rem] font-semibold">{t.online}</strong>
              <span className="text-xs text-[#56636b]">{t.onlineSub}</span>
            </span>
          </p>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
            <h2 id="asesor-title" className="display mt-5 text-[2.5rem] md:text-[3.5rem] xl:text-[3.9rem]">
              <Em text={t.title} />
            </h2>
            <p className="lead mt-6 max-w-[58ch]">{t.body}</p>
            <p className="mt-5 flex items-start gap-2.5 text-[0.95rem] font-medium text-gold-ink">
              <SealCheck className="mt-0.5 size-5 shrink-0" weight="duotone" aria-hidden />
              {t.noFee}
            </p>
          </Reveal>

          <ol className="mt-9 grid gap-3 sm:grid-cols-3">
            {t.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.08 * i} className="rounded-2xl border border-line bg-surface p-5">
                <span className="grid size-8 place-items-center rounded-full bg-navy-900 font-display text-[1rem] text-[#ddbb84]">{i + 1}</span>
                <p className="mt-3 font-medium leading-snug">{s.title}</p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-3">
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa btn-glow"
              onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-asesor` })}
            >
              <WhatsappLogo className="wiggle size-5" weight="fill" aria-hidden />
              {t.ctaWa}
            </a>
            <button type="button" className="btn btn-primary" onClick={() => openLead({ kind: "visit", origin: `${origin}-asesor` })}>
              <CalendarCheck className="size-5" weight="duotone" aria-hidden />
              {t.ctaVisit}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
