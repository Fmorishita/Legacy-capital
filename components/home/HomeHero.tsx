"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import type { HomeCopy } from "@/lib/i18n/home";
import type { PortfolioCopy, PortfolioItem } from "@/lib/i18n/portfolio";
import { site } from "@/lib/site";
import { StatusChip } from "@/components/ui/StatusChip";
import { AdvisorAvatar } from "@/components/sections/Advisor";

const ease = [0.16, 1, 0.3, 1] as const;

const focal: Record<PortfolioItem["id"], string> = {
  preventa: "object-[35%_48%]",
  vinedos: "object-[60%_55%]",
};

function Panel({ item, index }: { item: PortfolioItem; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.15 + index * 0.15, ease }}
      className="group relative isolate flex min-h-[68svh] flex-col justify-end overflow-hidden lg:min-h-0 lg:flex-1 lg:[&+&]:border-l lg:[&+&]:border-gold-500/40 lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.16,1,0.3,1)] lg:hover:flex-[1.22]"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1.02 }}
        transition={{ duration: 2.6, ease }}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority
          quality={75}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className={`object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] ${focal[item.id]}`}
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-navy-950/10" />

      <div className="px-6 pb-10 pt-24 sm:px-10 lg:px-12 lg:pb-16">
        <StatusChip project={item.id} label={item.status} tone="dark" />
        <p className="mt-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-cream-100/75">{item.place}</p>
        <h2 className="display mt-2 max-w-[20ch] text-[2.4rem] leading-[1.02] text-cream-100 sm:text-[2.9rem] xl:text-[3.2rem]">
          {item.name}
        </h2>
        <p className="mt-3 max-w-[40ch] text-[0.98rem] leading-relaxed text-cream-100/80">
          {item.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href={item.href} className="btn btn-gold after:absolute after:inset-0 after:content-['']">
            {item.cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" weight="bold" aria-hidden />
          </Link>
          <p className="text-sm leading-tight text-cream-100/80">
            <span className="block font-display text-[1.6rem] font-semibold text-cream-100">{item.price}</span>
            {item.priceNote}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/** Portada del portafolio: dos puertas, una por proyecto. En escritorio, la que se apunta se abre. */
export function HomeHero({ t, portfolio }: { t: HomeCopy["hero"]; portfolio: PortfolioCopy }) {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease } };

  return (
    <section aria-labelledby="home-title" className="relative isolate bg-navy-950 text-cream-100">
      <div className="pointer-events-none relative z-10 lg:absolute lg:inset-x-0 lg:top-0">
        <div className="pointer-events-auto relative">
          <div className="absolute inset-0 hidden bg-gradient-to-b from-navy-950/85 via-navy-950/45 to-transparent lg:block" />
          <div className="container-x relative pb-10 pt-36 lg:pb-24 lg:pt-40">
            <motion.p {...enter(0.1)} className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400">
              {t.eyebrow}
            </motion.p>
            <motion.h1
              id="home-title"
              {...enter(0.22)}
              className="display mt-4 max-w-[18ch] text-[2.5rem] leading-[1.03] xs:text-[2.9rem] md:text-6xl lg:max-w-[21ch] lg:text-[3.4rem] xl:text-[3.7rem]"
            >
              {t.title}
            </motion.h1>
            <motion.div {...enter(0.36)} className="mt-5 flex max-w-2xl items-start gap-4 lg:max-w-[36rem]">
              <AdvisorAvatar name={site.advisor.name} className="mt-1 size-11 shrink-0 ring-2 ring-gold-500/60" />
              <p className="text-[1.02rem] leading-relaxed text-cream-100/85 md:text-lg">{t.subtitle}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:h-[100svh] lg:min-h-[48rem] lg:flex-row">
        {portfolio.items.map((item, i) => (
          <Panel key={item.id} item={item} index={i} />
        ))}
      </div>

      <a
        href="#compara"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-cream-100/30 bg-navy-950/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream-100/85 backdrop-blur-md transition hover:text-cream-100 lg:inline-flex"
      >
        {t.scroll}
        <ArrowDown className="size-3.5" weight="bold" aria-hidden />
      </a>
    </section>
  );
}
