"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { useLead } from "@/components/lead/LeadProvider";
import { LeadForm } from "@/components/lead/LeadForm";

type Props = {
  t: Pick<Dict, "hero" | "quickForm" | "form">;
  lang: Lang;
  privacyHref: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ t, lang, privacyHref }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { openLead } = useLead();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease },
        };

  return (
    <section ref={ref} className="relative isolate bg-bg" aria-labelledby="hero-title">
      <div className="absolute inset-x-0 top-0 -z-10 h-[86dvh] overflow-hidden bg-navy-950 lg:h-full">
        <motion.div className="absolute inset-0" style={{ y }}>
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.12 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 2.8, ease }}
          >
            <Image
              src="/img/hero-sunset.jpg"
              alt={t.hero.imageAlt}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover object-[62%_50%]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/35 to-navy-950/0" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-950/80 via-navy-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent lg:hidden" />
      </div>

      <div className="container-x grid items-end gap-10 pb-12 pt-36 lg:min-h-[100dvh] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:pb-20 lg:pt-40">
        <div className="flex min-h-[calc(86dvh-13rem)] flex-col justify-end text-cream-100 lg:min-h-0 lg:pb-6">
          <motion.p {...enter(0.15)} className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            id="hero-title"
            {...enter(0.28)}
            className="display mt-5 max-w-[13ch] pb-1 text-[2.9rem] leading-[1.02] xs:text-[3.3rem] md:text-7xl lg:max-w-none lg:text-[4.3rem] xl:text-[4.6rem]"
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
          <motion.p {...enter(0.45)} className="mt-6 max-w-[38ch] text-[1.05rem] leading-relaxed text-cream-100/85 md:text-lg">
            {t.hero.subtitle}
          </motion.p>
          <motion.div {...enter(0.6)} className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => openLead({ kind: "prices", origin: "hero" })}
            >
              {t.hero.ctaPrimary}
            </button>
            <a
              href={waLink(t.form.waGeneric)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass"
              onClick={() => trackEvent("whatsapp_click", { origin: "hero" })}
            >
              <WhatsappLogo className="size-5" weight="fill" aria-hidden />
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease }}
          className="relative rounded-2xl border border-line bg-surface p-6 text-ink shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.55)] sm:p-8 lg:ml-auto lg:w-full lg:max-w-[27rem]"
          id="precios"
        >
          <h2 className="display text-[1.9rem] leading-[1.05]">{t.quickForm.title}</h2>
          <dl className="mt-5 grid grid-cols-2 divide-x divide-line rounded-xl border border-line">
            {t.quickForm.priceLine.map((p) => (
              <div key={p.label} className="px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{p.label}</dt>
                <dd className="mt-1 whitespace-nowrap font-display text-[1.2rem] font-semibold leading-tight xs:text-[1.35rem]">{p.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mb-5 mt-4 text-sm leading-relaxed text-ink-soft">{t.quickForm.subtitle}</p>
          <LeadForm t={t.form} lang={lang} origin="hero-form" submitLabel={t.form.submit} privacyHref={privacyHref} />
        </motion.div>
      </div>
    </section>
  );
}
