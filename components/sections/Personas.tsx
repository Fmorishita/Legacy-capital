"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, X } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { Perfil } from "@/components/lead/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { trackEvent } from "@/lib/track";

export function Personas({ t, label }: { t: Dict["personas"]; label: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { openLead } = useLead();
  const p = t.items[active];

  const select = (i: number, focus = false) => {
    setActive(i);
    trackEvent("persona_select", { profile: t.items[i].id });
    if (focus) tabs.current[i]?.focus();
    tabs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = t.items.length;
    if (e.key === "ArrowRight") select((active + 1) % n, true);
    else if (e.key === "ArrowLeft") select((active - 1 + n) % n, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(n - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <section id="para-ti" aria-labelledby="personas-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="personas-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <Reveal delay={0.08} className="-mx-5 mt-12 md:mx-0">
          <div
            role="tablist"
            aria-label={label}
            onKeyDown={onKey}
            className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 md:flex-wrap md:px-0"
          >
            {t.items.map((item, i) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`persona-tab-${item.id}`}
                aria-selected={active === i}
                aria-controls="persona-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => select(i)}
                className="chip shrink-0 whitespace-nowrap"
                data-active={active === i}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          id="persona-panel"
          role="tabpanel"
          aria-labelledby={`persona-tab-${p.id}`}
          className="mt-8 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14"
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-bg-alt lg:aspect-auto lg:min-h-[34rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-navy-950/70 to-transparent p-5 pt-16">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cream-100/35 bg-navy-950/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cream-100 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <h3 className="display text-[2.1rem] leading-[1.06] md:text-[2.8rem]">{p.headline}</h3>

              <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{t.painsLabel}</p>
                  <ul className="mt-4 grid gap-4">
                    {p.pains.map((pain) => (
                      <li key={pain} className="flex gap-3 leading-relaxed text-ink-soft">
                        <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong">
                          <X className="size-3" weight="bold" />
                        </span>
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{t.gainsLabel}</p>
                  <ul className="mt-4 grid gap-4">
                    {p.gains.map((gain) => (
                      <li key={gain} className="flex gap-3 leading-relaxed">
                        <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                          <Check className="size-3" weight="bold" />
                        </span>
                        {gain}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 border-t border-line pt-8 lg:mt-auto">
                <button
                  type="button"
                  className="btn btn-primary w-full sm:w-auto"
                  onClick={() =>
                    openLead({
                      kind: "prices",
                      origin: `perfil-${p.id}`,
                      perfil: p.id as Perfil,
                      subtitle: t.dialogSubtitle,
                    })
                  }
                >
                  {t.cta}
                  <ArrowRight className="size-4" weight="bold" aria-hidden />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
