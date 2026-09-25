"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, HandTap, X } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { Perfil } from "@/components/lead/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { trackEvent } from "@/lib/track";

export function Personas({ t, label }: { t: Dict["personas"]; label: string }) {
  const [active, setActive] = useState(0);
  // Hasta que la persona elige un perfil, los botones laten en secuencia para invitar a tocarlos
  const [touched, setTouched] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const { openLead } = useLead();
  const p = t.items[active];

  const select = (i: number, focus = false) => {
    setActive(i);
    setTouched(true);
    trackEvent("persona_select", { profile: t.items[i].id });
    if (focus) tabs.current[i]?.focus();
  };

  // En celular el caso queda debajo de la cuadrícula: lo acercamos al tocar un perfil
  const pick = (i: number) => {
    select(i);
    const el = panel.current;
    if (!el || window.matchMedia("(min-width: 1024px)").matches) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
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

        <Reveal delay={0.08} className="mt-12">
          <p className="flex items-center gap-2 text-sm font-semibold text-gold-ink">
            <HandTap className="size-5 animate-[tap-hint_1.6s_ease-in-out_infinite]" weight="duotone" aria-hidden />
            {t.hint}
          </p>
          {/* Cuadrícula: todos los perfiles visibles a la vez, también en celular */}
          <div
            role="tablist"
            aria-label={label}
            onKeyDown={onKey}
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
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
                aria-label={item.label}
                tabIndex={active === i ? 0 : -1}
                onClick={() => pick(i)}
                data-active={active === i}
                style={{ animationDelay: `${i * 0.35}s` }}
                className={`persona-tab group relative aspect-[16/11] overflow-hidden rounded-2xl border-2 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-lg lg:aspect-[4/3] ${
                  active === i ? "border-gold-500 shadow-lg" : "border-transparent"
                } ${!touched && active !== i ? "persona-tab--pulse" : ""} ${touched && active !== i ? "opacity-75 hover:opacity-100" : ""}`}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover object-[50%_30%] transition duration-700 group-hover:scale-110"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/35 to-navy-950/5" />
                {active === i && (
                  <span aria-hidden className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-gold-500 text-navy-900">
                    <Check className="size-3.5" weight="bold" />
                  </span>
                )}
                <span aria-hidden className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-cream-100/75">{item.kicker}</span>
                  <span className="mt-0.5 block text-[0.95rem] font-semibold leading-tight text-cream-100 sm:text-base">{item.city}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div
          ref={panel}
          id="persona-panel"
          role="tabpanel"
          aria-labelledby={`persona-tab-${p.id}`}
          className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-14"
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-bg-alt lg:aspect-[5/4]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={p.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_25%]" />
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

              <div className="mt-10 border-t border-line pt-8">
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
