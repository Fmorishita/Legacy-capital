"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, HandSwipeRight, ListBullets, MapTrifold } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { lots, availableCount, clusterSize, type Lot } from "@/lib/lots";
import { Reveal } from "@/components/ui/Reveal";
import { useLead } from "@/components/lead/LeadProvider";
import { trackEvent } from "@/lib/track";

type Filter = "all" | "2R" | "3R" | "premium";

const matches = (l: Lot, f: Filter) => f === "all" || l.model === f || (f === "premium" && l.view === "premium");

export function Availability({ t, lang }: { t: Dict["availability"]; lang: "es" | "en" }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Lot | null>(null);
  const [mode, setMode] = useState<"map" | "list">("map");
  const { openLead } = useLead();

  const visibleAvailable = useMemo(
    () => lots.filter((l) => l.status === "disponible" && matches(l, filter)),
    [filter],
  );
  // Sugerencias del estado vacío: primero las de vista premium
  const suggestions = useMemo(
    () => [...visibleAvailable].sort((a, b) => Number(b.view === "premium") - Number(a.view === "premium")).slice(0, 6),
    [visibleAvailable],
  );

  const similar = useMemo(() => {
    if (!selected || selected.status === "disponible") return [];
    return lots
      .filter((l) => l.status === "disponible" && l.model === selected.model)
      .sort((a, b) => Number(b.view === selected.view) - Number(a.view === selected.view) || Math.abs(a.n - selected.n) - Math.abs(b.n - selected.n))
      .slice(0, 3);
  }, [selected]);

  const pick = (l: Lot) => {
    setSelected(l);
    trackEvent("lot_select", { lot: l.n, model: l.model, status: l.status });
  };

  const request = (l: Lot) =>
    openLead({ kind: "lot", lote: l.n, interes: l.model, origin: "sembrado" });

  const modelLabel = (m: Lot["model"]) => t.filters[m];
  const updated = t.updated;

  return (
    <section id="disponibilidad" aria-labelledby="avail-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="avail-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-between gap-5 border-b border-line pb-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros">
            {(Object.keys(t.filters) as Filter[]).map((f) => (
              <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {t.filters[f]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm">
              <span className="font-display text-2xl font-semibold tabular-nums">
                {t.counter.replace("{available}", String(availableCount)).replace("{total}", String(clusterSize))}
              </span>
              <span className="block text-xs text-ink-soft">{updated}</span>
            </p>
            <button
              type="button"
              className="chip lg:hidden"
              onClick={() => setMode((m) => (m === "map" ? "list" : "map"))}
            >
              {mode === "map" ? <ListBullets className="size-4" aria-hidden /> : <MapTrifold className="size-4" aria-hidden />}
              {mode === "map" ? t.listView : t.mapView}
            </button>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_21rem] lg:gap-8">
          <div className={`min-w-0 ${mode === "list" ? "hidden lg:block" : ""}`}>
            <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
              <div className="relative min-w-[860px] overflow-hidden rounded-2xl md:min-w-0">
                <Image
                  src="/img/sembrado.jpg"
                  alt={t.mapAlt}
                  width={2200}
                  height={1497}
                  sizes="(min-width: 1024px) 900px, 860px"
                  className="h-auto w-full"
                />
                {lots.map((l) => {
                  const on = matches(l, filter);
                  const isSel = selected?.n === l.n;
                  return (
                    <button
                      key={l.n}
                      type="button"
                      onClick={() => pick(l)}
                      aria-pressed={isSel}
                      aria-label={`${t.lot} ${l.n}, ${modelLabel(l.model)}, ${t.legend[l.status]}`}
                      style={{ left: `${l.x}%`, top: `${l.y}%` }}
                      className="group absolute aspect-square w-[3.1%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    >
                      <span
                        className={`absolute inset-0 rounded-full transition duration-300 ${
                          isSel
                            ? "scale-125 bg-gold-500/30 ring-[3px] ring-gold-400"
                            : on
                              ? "ring-2 ring-transparent group-hover:scale-110 group-hover:ring-cream-100"
                              : "bg-navy-950/60"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft md:hidden">
              <HandSwipeRight className="size-4" aria-hidden />
              {t.dragHint}
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-soft">
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-[#4f6b2c]" aria-hidden /> {t.legend.disponible}
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-[#d8232a]" aria-hidden /> {t.legend.vendida}
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#9ad3d8]" aria-hidden /> {t.legend.premium}
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#f2a7c6]" aria-hidden /> {t.legend.preferente}
              </li>
            </ul>
          </div>

          {mode === "list" && (
            <ul className="grid grid-cols-2 gap-2 xs:grid-cols-3 lg:hidden">
              {visibleAvailable.map((l) => (
                <li key={l.n}>
                  <button
                    type="button"
                    onClick={() => pick(l)}
                    data-active={selected?.n === l.n}
                    className="chip w-full justify-between"
                  >
                    <span className="font-semibold">
                      {t.lot} {l.n}
                    </span>
                    <span className="text-xs opacity-75">{l.model}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <aside aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.div
                  key={selected.n}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-line bg-surface p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="display text-5xl leading-none">
                      <span className="block text-sm font-sans font-semibold uppercase tracking-[0.14em] text-ink-soft">{t.lot}</span>
                      {selected.n}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selected.status === "disponible"
                          ? "bg-[#4f6b2c]/15 text-[#3c5520] dark:text-[#b9d58f]"
                          : "bg-[#d8232a]/12 text-[#a31b20] dark:text-[#ff9a9a]"
                      }`}
                    >
                      {t.legend[selected.status]}
                    </span>
                  </div>
                  <dl className="mt-6 grid gap-3 text-[0.95rem]">
                    {[
                      [t.model, modelLabel(selected.model)],
                      [t.land, `${selected.land.toLocaleString(lang === "en" ? "en-US" : "es-MX", { maximumFractionDigits: 2 })} m²`],
                      [t.view, t.views[selected.view]],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-line pb-3">
                        <dt className="text-ink-soft">{k}</dt>
                        <dd className="text-right font-semibold">{v}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-soft">{t.price}</dt>
                      <dd>
                        <button
                          type="button"
                          onClick={() => request(selected)}
                          className="font-semibold text-gold-ink underline underline-offset-4 disabled:no-underline disabled:opacity-50"
                          disabled={selected.status !== "disponible"}
                        >
                          {t.priceCta}
                        </button>
                      </dd>
                    </div>
                  </dl>
                  {selected.status === "disponible" ? (
                    <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => request(selected)}>
                      {t.cta}
                      <ArrowRight className="size-4" weight="bold" aria-hidden />
                    </button>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-ink-soft">{t.soldNote}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {similar.map((s) => (
                          <button key={s.n} type="button" className="chip" onClick={() => pick(s)}>
                            {t.lot} {s.n}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-line-strong p-6"
                >
                  <MapTrifold className="size-8 text-gold-ink" weight="light" aria-hidden />
                  <p className="mt-4 font-semibold">{t.pickPrompt}</p>
                  <p className="mt-2 text-sm text-ink-soft">{t.pickHint}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {suggestions.map((l) => (
                      <button key={l.n} type="button" className="chip" onClick={() => pick(l)}>
                        {t.lot} {l.n}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}
