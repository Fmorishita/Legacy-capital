"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, LockSimple } from "@phosphor-icons/react";
import type { VdmCopy, VdmModel } from "@/lib/i18n/vinedos";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";

function Gallery({ m, t }: { m: VdmModel; t: VdmCopy["models"] }) {
  const [i, setI] = useState(0);
  const total = m.images.length;
  const go = useCallback((d: number) => setI((p) => (p + d + total) % total), [total]);
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };
  const img = m.images[i];

  return (
    <div
      className="grid gap-3"
      role="group"
      aria-roledescription="carrusel"
      aria-label={m.name}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={img.src}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
          >
            <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="pointer-events-none object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/50 to-transparent" />
        <p className="absolute bottom-4 left-4 rounded-full bg-navy-950/55 px-3 py-1.5 text-xs font-semibold tabular-nums text-cream-100 backdrop-blur-md" aria-live="polite">
          {t.photo.replace("{n}", String(i + 1)).replace("{total}", String(total))}
        </p>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.prev}
            className="grid size-11 place-items-center rounded-full border border-cream-100/40 bg-navy-950/45 text-cream-100 backdrop-blur-md transition hover:bg-navy-950/70"
          >
            <CaretLeft className="size-5" weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.next}
            className="grid size-11 place-items-center rounded-full border border-cream-100/40 bg-navy-950/45 text-cream-100 backdrop-blur-md transition hover:bg-navy-950/70"
          >
            <CaretRight className="size-5" weight="bold" aria-hidden />
          </button>
        </div>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {m.images.map((im, n) => (
          <button
            key={im.src}
            type="button"
            onClick={() => setI(n)}
            aria-label={im.alt}
            aria-current={n === i}
            className={`relative aspect-[3/2] w-[5.5rem] shrink-0 overflow-hidden rounded-lg transition sm:w-24 ${
              n === i ? "ring-2 ring-ink ring-offset-2 ring-offset-bg-alt" : "opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={im.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function VdmModels({ t }: { t: VdmCopy["models"] }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"photos" | "plan">("photos");
  const { openLead } = useLead();
  const m = t.items[active];

  const pick = (n: number) => {
    setActive(n);
    setView("photos");
    trackEvent("model_select", { model: t.items[n].id, project: "vinedos" });
  };

  return (
    <section id="modelos" aria-labelledby="vdm-models-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="vdm-models-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        {/* Selector: del departamento a la casa */}
        <Reveal delay={0.1} className="relative mt-12">
          <span aria-hidden className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-gold-500/30 via-gold-500 to-vine-500 md:block" />
          <div
            role="tablist"
            aria-label={t.tabsLabel}
            className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
          >
            {t.items.map((it, n) => {
              const on = n === active;
              return (
                <button
                  key={it.id}
                  role="tab"
                  id={`vdm-tab-${it.id}`}
                  aria-selected={on}
                  aria-controls="vdm-model-panel"
                  onClick={() => pick(n)}
                  className="group relative min-w-[11.5rem] snap-start text-left md:min-w-0"
                >
                  <span
                    className={`relative z-10 mb-4 hidden size-[0.85rem] rounded-full border-2 transition md:mt-[0.75rem] md:block ${
                      on ? "border-ink bg-ink" : "border-gold-500 bg-bg-alt group-hover:bg-gold-500"
                    }`}
                  />
                  <span
                    className={`block rounded-2xl border p-4 transition-colors duration-300 ${
                      on ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:border-line-strong"
                    }`}
                  >
                    <span className={`block text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${on ? "text-bg/70" : "text-ink-soft"}`}>
                      {it.type}
                    </span>
                    <span className="display mt-1 block text-[1.6rem] leading-tight">{it.name}</span>
                    <span className={`mt-1 block text-sm ${on ? "text-bg/80" : "text-ink-soft"}`}>
                      {t.from} <span className="font-semibold">{it.price}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div id="vdm-model-panel" role="tabpanel" aria-labelledby={`vdm-tab-${m.id}`} className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
          <div>
            <div className="mb-4 flex justify-end gap-2">
              {(["photos", "plan"] as const).map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>
                  {v === "photos" ? t.viewPhotos : t.viewPlan}
                </button>
              ))}
            </div>
            {view === "photos" ? (
              <Gallery key={m.id} m={m} t={t} />
            ) : (
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface">
                <Image src={m.plan} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="scale-105 object-contain p-4 blur-[6px] sm:p-8" />
                {/* La planta completa con medidas se envía por WhatsApp */}
                <div className="absolute inset-0 grid place-items-center bg-surface/30 p-6 text-center">
                  <div className="max-w-xs rounded-2xl border border-line bg-surface/95 p-6 shadow-xl">
                    <LockSimple className="mx-auto size-6 text-gold-ink" weight="bold" aria-hidden />
                    <p className="mt-3 font-semibold leading-snug">{t.planLock}</p>
                    <button
                      type="button"
                      className="btn btn-primary mt-4 w-full"
                      onClick={() => openLead({ kind: "floorplan", interes: m.interest, origin: `vdm-planos-${m.id}` })}
                    >
                      {t.planCta}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-vine-ink">{m.type}</p>
              <h3 className="display mt-2 text-[2.6rem] leading-none md:text-[3.2rem]">{m.name}</h3>
              <p className="mt-3 text-lg leading-snug text-ink-soft">{m.tagline}</p>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6">
                {m.specs.map((s) => (
                  <div key={s.label}>
                    <dt className="text-xs font-medium uppercase tracking-[0.1em] text-ink-soft">{s.label}</dt>
                    <dd className="mt-1 font-display text-[1.7rem] font-semibold leading-none tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="grid gap-2.5 py-6 text-[0.95rem]">
                {m.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto rounded-2xl border border-line bg-surface p-5">
                <p className="text-sm text-ink-soft">{t.from}</p>
                <p className="display text-[2.4rem] leading-none">{m.price}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  {t.monthly} <span className="font-semibold text-ink">{m.monthly}*</span>
                </p>
                <button
                  type="button"
                  className="btn btn-primary mt-5 w-full"
                  onClick={() =>
                    openLead({
                      kind: "model",
                      interes: m.interest,
                      origin: `vdm-modelo-${m.id}`,
                      title: t.ctaTitle.replace("{model}", m.name),
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

        <p className="mt-10 max-w-4xl text-xs leading-relaxed text-ink-soft">{t.note}</p>
      </div>
    </section>
  );
}
