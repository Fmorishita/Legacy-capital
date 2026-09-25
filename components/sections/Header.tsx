"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X, ArrowRight, Globe } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { useLead } from "@/components/lead/LeadProvider";

function useCountdown(target: string) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

export function Header({ t, homeHref }: { t: Pick<Dict, "nav" | "promo" | "a11y">; homeHref: string }) {
  const { openLead } = useLead();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const left = useCountdown(site.promoEndsAt);
  const promoActive = left !== null && left > 0;

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 40;
    if (next !== solid) setSolid(next);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const d = left ? Math.floor(left / 86_400_000) : 0;
  const h = left ? Math.floor((left % 86_400_000) / 3_600_000) : 0;
  const m = left ? Math.floor((left % 3_600_000) / 60_000) : 0;
  const light = !solid && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {promoActive && (
        <button
          type="button"
          onClick={() => openLead({ kind: "prices", origin: "promo-bar" })}
          className="group flex w-full items-center justify-center gap-3 bg-navy-900 px-4 py-2 text-[0.8rem] text-cream-100 dark:bg-navy-950"
        >
          <span className="hidden sm:inline">{t.promo.text}</span>
          <span className="sm:hidden">{t.promo.short}</span>
          <span className="hidden font-semibold tabular-nums text-gold-400 md:inline">
            {t.promo.ends} {d}
            {t.promo.units.d} {h}
            {t.promo.units.h} {m}
            {t.promo.units.m}
          </span>
          <ArrowRight className="size-3.5 text-gold-400 transition group-hover:translate-x-0.5" weight="bold" aria-hidden />
        </button>
      )}

      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          light
            ? "border-b border-transparent bg-gradient-to-b from-navy-950/55 to-transparent"
            : "border-b border-line bg-bg/88 backdrop-blur-xl"
        }`}
      >
        <nav className="container-x flex h-[4.5rem] items-center justify-between gap-6" aria-label="Principal">
          <Link href={homeHref} aria-label={t.a11y.home} className="shrink-0">
            <Logo tone={light ? "light" : "auto"} />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {t.nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative text-[0.92rem] font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100 ${
                    light ? "text-cream-100/90 hover:text-cream-100" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={t.nav.switchLang.href}
              hrefLang={t.nav.switchLang.short.toLowerCase()}
              className={`hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition sm:inline-flex ${
                light ? "text-cream-100/90 hover:text-cream-100" : "text-ink-soft hover:text-ink"
              }`}
            >
              <Globe className="size-4" aria-hidden />
              {t.nav.switchLang.short}
            </Link>
            <button
              type="button"
              onClick={() => openLead({ kind: "prices", origin: "nav" })}
              className={`btn hidden px-5 py-3 text-sm md:inline-flex ${light ? "btn-gold" : "btn-primary"}`}
            >
              {t.nav.cta}
            </button>
            <button
              type="button"
              aria-label={open ? t.a11y.close : t.a11y.menu}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={`grid size-11 place-items-center rounded-full lg:hidden ${light ? "text-cream-100" : "text-ink"}`}
            >
              {open ? <X className="size-6" aria-hidden /> : <List className="size-6" aria-hidden />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-bg lg:hidden"
            style={{ top: promoActive ? "calc(4.5rem + 2.1rem)" : "4.5rem" }}
          >
            <ul className="container-x grid gap-1 py-8">
              {t.nav.links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-center justify-between border-b border-line py-4 text-[2rem]"
                  >
                    {l.label}
                    <ArrowRight className="size-5 text-gold-ink" aria-hidden />
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="container-x grid gap-3 pb-10">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={() => {
                  setOpen(false);
                  openLead({ kind: "prices", origin: "menu" });
                }}
              >
                {t.nav.cta}
              </button>
              <Link href={t.nav.switchLang.href} className="btn btn-ghost w-full">
                <Globe className="size-4" aria-hidden />
                {t.nav.switchLang.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
