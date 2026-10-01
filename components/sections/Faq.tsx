"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

export function Faq({ t }: { t: Dict["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="faq-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <Reveal>
          <h2 id="faq-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl lg:sticky lg:top-28">
            {t.title}
          </h2>
        </Reveal>
        <ul className="border-t border-line-strong">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-line-strong">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold md:text-xl"
                  >
                    {item.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-line-strong"
                    >
                      <Plus className="size-4" weight="bold" aria-hidden />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-7 leading-relaxed text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
