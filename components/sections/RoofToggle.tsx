"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Sun, SunHorizon } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

export function RoofToggle({ t }: { t: Dict["roof"] }) {
  const [mode, setMode] = useState<"day" | "sunset">("sunset");
  const options = [
    { id: "day" as const, label: t.day, Icon: Sun },
    { id: "sunset" as const, label: t.sunset, Icon: SunHorizon },
  ];

  return (
    <section aria-labelledby="roof-title" className="pb-24 md:pb-36">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-2xl bg-navy-950">
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/10]">
            <Image
              src="/img/roof-day.jpg"
              alt={t.dayAlt}
              fill
              sizes="(min-width: 1320px) 1256px, 100vw"
              className="object-cover object-[50%_62%]"
            />
            <AnimatePresence initial={false}>
              {mode === "sunset" && (
                <motion.div
                  key="sunset"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/img/roof-sunset.jpg"
                    alt={t.sunsetAlt}
                    fill
                    sizes="(min-width: 1320px) 1256px, 100vw"
                    className="object-cover object-[50%_62%]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent md:bg-gradient-to-r md:from-navy-950/80 md:via-navy-950/25" />
          </div>

          <div
            role="radiogroup"
            aria-label={`${t.day} / ${t.sunset}`}
            className="absolute right-4 top-4 flex rounded-full border border-cream-100/25 bg-navy-950/45 p-1 backdrop-blur-md md:right-6 md:top-6"
          >
            {options.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mode === id}
                onClick={() => setMode(id)}
                className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cream-100"
              >
                {mode === id && (
                  <motion.span
                    layoutId="roof-pill"
                    className="absolute inset-0 rounded-full bg-cream-100"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`relative size-4 ${mode === id ? "text-navy-800" : ""}`} weight="bold" aria-hidden />
                <span className={`relative ${mode === id ? "text-navy-800" : ""}`}>{label}</span>
              </button>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-cream-100 sm:p-10 md:max-w-xl lg:p-14">
            <h2 id="roof-title" className="display text-[2.3rem] leading-[1.04] md:text-5xl lg:text-[3.6rem]">
              {t.title}
            </h2>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-cream-100/85 md:text-lg">{t.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
