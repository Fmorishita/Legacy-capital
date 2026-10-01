"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import type { VdmCopy } from "@/lib/i18n/vinedos";
import { site, waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { useLead } from "@/components/lead/LeadProvider";
import { LeadForm } from "@/components/lead/LeadForm";
import { AdvisorAvatar } from "@/components/sections/Advisor";
import { StatusChip } from "@/components/ui/StatusChip";

type Props = {
  t: Pick<VdmCopy, "hero" | "quickForm" | "form">;
  lang: Lang;
  privacyHref: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Video de fondo solo en escritorio y sin "ahorro de datos": en celular se queda la fotografía
 * (el cuadro inicial del mismo video) para no gastar datos ni retrasar la carga.
 */
function useHeroVideo() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setEnabled(desktop && !reduce && !saveData);
  }, []);
  return enabled;
}

export function VdmHero({ t, lang, privacyHref }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openLead } = useLead();
  const video = useHeroVideo();
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  const enter = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } };

  return (
    <section ref={ref} className="relative isolate bg-bg" aria-labelledby="vdm-hero-title">
      <div className="absolute inset-x-0 top-0 -z-10 h-[86dvh] overflow-hidden bg-navy-950 lg:h-full">
        <motion.div className="absolute inset-0" style={{ y }}>
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.1 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 2.8, ease }}
          >
            <Image
              src="/img/vdm/pool-pergola.jpg"
              alt={t.hero.imageAlt}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover object-[60%_55%]"
            />
            {video && (
              <video
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
                src="/video/vdm-hero.mp4"
                poster="/video/vdm-hero-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
                onPlaying={() => setReady(true)}
              />
            )}
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-navy-950/5" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent lg:hidden" />
      </div>

      <div className="container-x grid items-end gap-10 pb-12 pt-36 lg:min-h-[100dvh] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:pb-20 lg:pt-40">
        <div className="flex min-h-[calc(86dvh-13rem)] flex-col justify-end text-cream-100 lg:min-h-0 lg:pb-6">
          <motion.div {...enter(0.15)} className="flex flex-wrap items-center gap-3">
            <StatusChip project="vinedos" label={t.hero.status} tone="dark" />
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400">{t.hero.place}</span>
          </motion.div>
          <motion.h1
            id="vdm-hero-title"
            {...enter(0.28)}
            className="display mt-5 max-w-[14ch] pb-1 text-[2.9rem] leading-[1.02] xs:text-[3.3rem] md:text-7xl lg:max-w-[15ch] lg:text-[4.3rem] xl:text-[4.6rem]"
          >
            {t.hero.title}
          </motion.h1>
          <motion.span
            aria-hidden
            className="mt-7 block h-px w-28 origin-left bg-gold-500"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, delay: 0.7, ease }}
          />
          <motion.p {...enter(0.45)} className="mt-6 max-w-[42ch] text-[1.05rem] leading-relaxed text-cream-100/85 md:text-lg">
            {t.hero.subtitle}
          </motion.p>
          <motion.div {...enter(0.6)} className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>("#inventario input[autocomplete='name']");
                if (window.matchMedia("(min-width: 1024px)").matches && input) {
                  input.focus();
                } else {
                  openLead({ kind: "prices", origin: "vdm-hero" });
                }
              }}
            >
              {t.hero.ctaPrimary}
            </button>
            <a
              href={waLink(t.form.waGeneric)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass"
              onClick={() => trackEvent("whatsapp_click", { origin: "vdm-hero" })}
            >
              <WhatsappLogo className="size-5" weight="fill" aria-hidden />
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
          <motion.p
            {...enter(0.75)}
            className="mt-10 hidden items-center gap-3 font-caps text-[0.8rem] font-semibold tracking-[0.14em] text-cream-100/75 lg:flex"
          >
            <span aria-hidden className="h-px w-8 bg-gold-400" />
            {t.hero.tagline}
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease }}
          className="relative rounded-2xl border border-line bg-surface p-6 text-ink shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.55)] sm:p-8 lg:ml-auto lg:w-full lg:max-w-[27rem]"
          id="inventario"
        >
          <div className="mb-5 flex items-center gap-3 border-b border-line pb-5">
            <AdvisorAvatar name={site.advisor.name} className="size-11 shrink-0" />
            <p className="text-sm leading-tight">
              <span className="block text-ink-soft">{t.quickForm.advisor}</span>
              <span className="font-semibold">{site.advisor.name}</span>
              <span className="text-ink-soft"> · CEO, Legacy Capital</span>
            </p>
          </div>
          <h2 className="display text-[1.9rem] leading-[1.05]">{t.quickForm.title}</h2>
          <dl className="mt-5 grid divide-y divide-line rounded-xl border border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {t.quickForm.priceLine.map((p) => (
              <div key={p.label} className="flex items-baseline justify-between gap-3 px-4 py-3 sm:block">
                <dt className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{p.label}</dt>
                <dd className="whitespace-nowrap font-display text-[1.15rem] font-semibold leading-tight xs:text-[1.3rem] sm:mt-1 sm:text-[1.2rem] lg:text-[1.3rem]">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mb-5 mt-4 text-sm leading-relaxed text-ink-soft">{t.quickForm.subtitle}</p>
          <LeadForm t={t.form} lang={lang} origin="vdm-hero-form" submitLabel={t.form.submit} privacyHref={privacyHref} />
        </motion.div>
      </div>
    </section>
  );
}
