"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bank, Key, LockSimple, ShieldCheck } from "@phosphor-icons/react";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import { useLead } from "@/components/lead/LeadProvider";
import { trackEvent } from "@/lib/track";
import { CountUp, Em } from "./primitives";

const ease = [0.16, 1, 0.3, 1] as const;
const TRUST_ICONS = [ShieldCheck, Bank, Key];

type Props = {
  t: ShowcaseCopy["hero"];
  /** Titular propio (la portada habla de Legacy Capital; la preventa, de las casas) */
  head?: { eyebrow: string; title: string; lead: string };
  moveIn?: { text: string; cta: string; href: string };
  image?: string;
  origin: string;
};

/**
 * Portada con video: en celular el reel vertical ocupa la pantalla; en escritorio, el roof garden
 * al atardecer con un acercamiento lento y el reel en una tarjeta de cristal junto a Fran.
 */
export function VideoHero({ t, head, moveIn, image = "/img/hero-roof.jpg", origin }: Props) {
  const { openLead } = useLead();
  const reduce = useReducedMotion();
  const h = head ?? t;
  const decimals = t.amount.decimals;
  const fmt = useCallback((n: number) => n.toFixed(decimals), [decimals]);
  const enter = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } };

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#0a1a2e] text-white lg:items-center"
    >
      <div className="absolute inset-0 -z-10">
        <video
          className="absolute inset-0 h-full w-full object-cover lg:hidden"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/video/hero-reel.jpg"
          aria-hidden
        >
          <source src="/media/video/hero-reel.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hidden overflow-hidden lg:block">
          <Image src={image} alt="" fill priority quality={75} sizes="100vw" className="kenburns object-cover object-[62%_55%]" />
        </div>
        <div className="hero-shade absolute inset-0" />
      </div>

      <div className="container-x grid w-full items-center gap-12 pb-24 pt-32 sm:pb-28 lg:grid-cols-[1.25fr_0.75fr] lg:pb-24 lg:pt-36">
        <div className="max-w-[42rem]">
          <motion.p {...enter(0.1)} className="flex items-center gap-2.5 text-[0.74rem] font-medium uppercase tracking-[0.22em] text-[#ddbb84]">
            <span aria-hidden className="live-dot size-2 shrink-0 rounded-full bg-[#5be38e]" />
            {h.eyebrow}
          </motion.p>
          <motion.h1
            id="hero-title"
            {...enter(0.22)}
            className="display mt-5 text-[2.6rem] leading-[1.02] tracking-[-0.025em] xs:text-[2.9rem] sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]"
          >
            <Em text={h.title} />
          </motion.h1>
          <motion.p {...enter(0.36)} className="lead mt-5 max-w-[36rem] !text-white/85">
            {h.lead}
          </motion.p>

          <motion.div {...enter(0.48)} className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#ddbb84]">{t.from}</span>
            <span className="display text-[2.8rem] leading-none sm:text-[3.2rem]">
              $<CountUp value={t.amount.value} duration={1.6} delay={0.5} format={fmt} />{" "}
              <small className="font-sans text-base tracking-[0.1em] text-[#ddbb84]">{t.amount.unit}</small>
            </span>
            <span className="basis-full text-[0.92rem] text-white/75">
              <b className="font-semibold text-[#ddbb84]">{t.noteStrong}</b> · {t.note}
            </span>
          </motion.div>

          <motion.div {...enter(0.6)} className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-gold btn-lg btn-glow"
              onClick={() => openLead({ kind: "visit", origin: `${origin}-hero` })}
            >
              {t.ctaPrimary}
              <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
            </button>
            <a href="#material" className="btn btn-glass btn-lg" onClick={() => trackEvent("cta_click", { cta: "brochure", origin: `${origin}-hero` })}>
              <LockSimple className="size-4" weight="bold" aria-hidden />
              {t.ctaSecondary}
            </a>
          </motion.div>

          <motion.ul {...enter(0.72)} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem] text-white/75">
            {t.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <li key={item} className="flex items-center gap-2">
                  <Icon className="size-4 text-[#ddbb84]" weight="duotone" aria-hidden />
                  {item}
                </li>
              );
            })}
          </motion.ul>

          {moveIn && (
            <motion.div {...enter(0.84)} className="mt-7">
              <Link
                href={moveIn.href}
                onClick={() => trackEvent("project_pick", { project: "vinedos", origin: `${origin}-hero` })}
                className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm backdrop-blur-md transition hover:border-white/45 hover:bg-white/10"
              >
                <span aria-hidden className="size-2 rounded-full bg-vine-400" />
                <span className="text-white/80">{moveIn.text}</span>
                <span className="font-semibold text-white">{moveIn.cta}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" aria-hidden />
              </Link>
            </motion.div>
          )}
        </div>

        <motion.aside
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease }}
          className="hidden w-full max-w-[21rem] justify-self-end rounded-[24px] border border-white/15 bg-[#0a1a2e]/55 p-2.5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur-xl lg:block"
          aria-label={t.reelLabel}
        >
          <div className="relative aspect-[9/14] overflow-hidden rounded-2xl bg-[#112233]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay={!reduce}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/video/hero-reel.jpg"
              aria-label={t.reelLabel}
            >
              <source src="/media/video/hero-reel.mp4" type="video/mp4" />
            </video>
          </div>
          <a href="#asesor" className="group mt-2.5 flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/[0.06]">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ddbb84]/60">
              <Image src="/media/img/fran-avatar.webp" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <strong className="block text-[0.92rem] font-medium">{t.agent.name}</strong>
              <span className="text-[0.8rem] text-white/65">{t.agent.role}</span>
            </span>
            <ArrowRight className="size-4 text-[#ddbb84] transition-transform group-hover:translate-x-0.5" weight="bold" aria-hidden />
          </a>
        </motion.aside>
      </div>

      <a
        href="#asesor"
        aria-label={t.scroll}
        className="scroll-cue absolute bottom-7 left-1/2 hidden h-10 w-6 -translate-x-1/2 justify-center rounded-full border border-white/45 pt-2 lg:flex"
      >
        <span className="block h-2 w-1 rounded-full bg-white" />
      </a>
    </section>
  );
}
