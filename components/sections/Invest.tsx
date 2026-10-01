"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useCallback, useRef } from "react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

function Stat({ s, lang }: { s: Dict["invest"]["stats"][number]; lang: "es" | "en" }) {
  const decimals = "decimals" in s ? (s.decimals as number) : 0;
  const fmt = useCallback(
    (n: number) =>
      `${"prefix" in s ? s.prefix : ""}${n.toLocaleString(lang === "en" ? "en-US" : "es-MX", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${s.suffix}`,
    [s, decimals, lang],
  );
  return (
    <div className="border-t border-cream-100/20 pt-5">
      <AnimatedNumber value={s.value} fromZero duration={1.6} format={fmt} className="display block text-[3.2rem] leading-none text-cream-100 tabular-nums md:text-[4rem]" />
      <p className="mt-3 max-w-[24ch] text-sm leading-snug text-cream-100/75">{s.label}</p>
    </div>
  );
}

export function Invest({ t, lang }: { t: Dict["invest"]; lang: "es" | "en" }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section ref={ref} id="inversion" aria-labelledby="invest-title" className="relative isolate overflow-hidden bg-navy-950 py-24 text-cream-100 md:py-36">
      <motion.div className="absolute inset-[-10%_0] -z-10" style={{ y }}>
        <Image src="/img/aerial-coast.jpg" alt={t.imageAlt} fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/90 via-navy-950/78 to-navy-950/92" />

      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-gold-400">{t.eyebrow}</p>
            <h2 id="invest-title" className="display mt-4 max-w-[16ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
            <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-cream-100/80">{t.body}</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {t.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <Stat s={s} lang={lang} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20 grid border-y border-cream-100/15 md:grid-cols-[1.2fr_1fr_1fr] md:divide-x md:divide-cream-100/15">
          {t.reasons.map((r, i) => (
            <Reveal
              key={r.title}
              delay={i * 0.08}
              className={`py-7 md:px-8 md:py-10 md:first:pl-0 ${i > 0 ? "border-t border-cream-100/15 md:border-t-0" : ""}`}
            >
              <h3 className={`display leading-tight text-gold-300 ${i === 0 ? "text-[2rem] md:text-[2.4rem]" : "text-[1.7rem]"}`}>{r.title}</h3>
              <p className="mt-2 max-w-[36ch] leading-relaxed text-cream-100/80">{r.text}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-xs text-cream-100/60">{t.source}</p>
      </div>
    </section>
  );
}
