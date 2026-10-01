"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import type { HomeCopy } from "@/lib/i18n/home";
import type { PortfolioCopy } from "@/lib/i18n/portfolio";
import { site, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { StatusChip } from "@/components/ui/StatusChip";
import { AdvisorAvatar } from "@/components/sections/Advisor";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Portada: el mismo lenguaje del hero de la preventa (foto a todo lo ancho y tarjeta a la derecha),
 * pero la tarjeta no es un formulario: pregunta qué busca la persona y la lleva al proyecto indicado.
 */
export function HomeHero({ t, portfolio, waGeneric }: { t: HomeCopy["hero"]; portfolio: PortfolioCopy; waGeneric: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);

  const enter = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } };

  return (
    <section ref={ref} className="relative isolate bg-bg" aria-labelledby="home-title">
      <div className="absolute inset-x-0 top-0 -z-10 h-[64dvh] overflow-hidden bg-navy-950 sm:h-[80dvh] lg:h-full">
        <motion.div className="absolute inset-0" style={{ y }}>
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.12 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 2.8, ease }}
          >
            <Image
              src="/img/sunset-ocean.jpg"
              alt={t.imageAlt}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover object-[50%_60%]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-navy-950/10" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent lg:hidden" />
      </div>

      {/* En celular el hero es más corto: las dos opciones de proyecto deben verse casi sin bajar */}
      <div className="container-x grid items-end gap-8 pb-12 pt-28 sm:gap-10 sm:pt-32 lg:min-h-[100dvh] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pb-20 lg:pt-36">
        <div className="flex flex-col justify-end text-cream-100 sm:min-h-[calc(80dvh-12rem)] lg:min-h-0 lg:pb-6">
          <motion.p {...enter(0.15)} className="hidden text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400 sm:block">
            {t.eyebrow}
          </motion.p>
          <motion.h1
            id="home-title"
            {...enter(0.28)}
            className="display pb-1 text-[2.5rem] leading-[1.02] xs:text-[2.75rem] sm:mt-5 sm:max-w-[14ch] md:text-7xl lg:text-[4.1rem] xl:text-[4.5rem]"
          >
            {t.title}
          </motion.h1>
          <motion.span
            aria-hidden
            className="mt-5 block h-px w-28 origin-left bg-gold-500 sm:mt-7"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, delay: 0.7, ease }}
          />
          <motion.p {...enter(0.45)} className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-cream-100/85 sm:mt-6 sm:text-[1.05rem] md:text-lg">
            {t.subtitle}
          </motion.p>
          <motion.div {...enter(0.6)} className="mt-9 hidden flex-wrap gap-3 sm:flex">
            <a href="#compara" className="btn btn-gold">
              {t.ctaPrimary}
            </a>
            <a
              href={waLink(waGeneric)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass"
              onClick={() => trackEvent("whatsapp_click", { origin: "home-hero" })}
            >
              <WhatsappLogo className="size-5" weight="fill" aria-hidden />
              {t.ctaSecondary}
            </a>
          </motion.div>
          <motion.p
            {...enter(0.75)}
            className="mt-10 hidden items-center gap-3 font-caps text-[0.8rem] font-semibold tracking-[0.14em] text-cream-100/75 lg:flex"
          >
            <span aria-hidden className="h-px w-8 bg-gold-400" />
            {t.tagline}
          </motion.p>
        </div>

        <motion.div
          id="elige"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease }}
          className="relative rounded-2xl border border-line bg-surface p-5 text-ink shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.55)] sm:p-8 lg:ml-auto lg:w-full lg:max-w-[30rem]"
        >
          <div className="mb-5 hidden items-center gap-3 border-b border-line pb-5 sm:flex">
            <AdvisorAvatar name={site.advisor.name} className="size-11 shrink-0" />
            <p className="text-sm leading-tight">
              <span className="block text-ink-soft">{t.picker.advisor}</span>
              <span className="font-semibold">{site.advisor.name}</span>
              <span className="text-ink-soft"> · CEO, Legacy Capital</span>
            </p>
          </div>
          <h2 className="display text-[1.75rem] leading-[1.05] sm:text-[1.9rem]">{t.picker.title}</h2>
          <p className="mt-2 hidden text-sm leading-relaxed text-ink-soft sm:block">{t.picker.body}</p>

          <ul className="mt-4 grid gap-3 sm:mt-5">
            {portfolio.items.map((p) => (
              <li key={p.id}>
                <Link
                  href={p.href}
                  onClick={() => trackEvent("project_pick", { project: p.id, origin: "home-hero" })}
                  className={`group flex items-center gap-4 rounded-xl border border-line p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    p.id === "vinedos" ? "hover:border-vine-500" : "hover:border-gold-500"
                  }`}
                >
                  <span className="relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-lg sm:w-24">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="6rem"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <StatusChip project={p.id} label={p.status} className="!px-2 !py-1 !text-[0.6rem]" />
                    <span className="mt-1.5 block text-[1.02rem] font-semibold leading-snug">{p.goal}</span>
                    <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink-soft">
                      {p.short} · <span className="whitespace-nowrap">{p.price}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-bg"
                  >
                    <ArrowRight className="size-4" weight="bold" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <a
            href="#compara"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-bg-alt px-4 py-3 text-sm font-medium transition-colors hover:text-gold-ink"
          >
            {t.picker.help}
            <ArrowRight className="size-4" weight="bold" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
