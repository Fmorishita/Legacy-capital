"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X, ArrowRight, Globe, UserCircle } from "@phosphor-icons/react";
import Image from "next/image";
import type { Dict } from "@/lib/i18n/es";
import type { NavCopy } from "@/lib/i18n/types";
import type { PortfolioCopy } from "@/lib/i18n/portfolio";
import type { ProjectId } from "@/lib/projects";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { StatusChip, StatusDot } from "@/components/ui/StatusChip";

import { useLead, type LeadKind } from "@/components/lead/LeadProvider";

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

type Props = {
  t: { nav: NavCopy; a11y: Dict["a11y"]; promo?: Dict["promo"] };
  homeHref: string;
  /** Selector de proyectos (preventa / entrega inmediata) */
  portfolio?: PortfolioCopy;
  active?: ProjectId;
  ctaKind?: LeadKind;
};

export function Header({ t, homeHref, portfolio, active, ctaKind = "prices" }: Props) {
  const { openLead } = useLead();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const left = useCountdown(site.promoEndsAt);
  const promoActive = Boolean(t.promo) && left !== null && left > 0;

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 40;
    if (next !== solid) setSolid(next);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const d = left ? Math.floor(left / 86_400_000) : 0;
  const h = left ? Math.floor((left % 86_400_000) / 3_600_000) : 0;
  const m = left ? Math.floor((left % 3_600_000) / 60_000) : 0;
  const light = !solid && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {portfolio && (
        <nav aria-label={portfolio.switcherLabel} className="bg-navy-950 text-cream-100">
          <div className="container-x flex h-9 items-stretch gap-1 text-[0.75rem]">
            <span className="mr-3 hidden items-center font-semibold uppercase tracking-[0.18em] text-cream-100/45 md:flex">
              {portfolio.title}
            </span>
            {portfolio.items.map((p) => {
              const on = p.id === active;
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-w-0 items-center gap-2 px-3 transition-colors first:pl-0 md:first:pl-3 ${
                    on
                      ? "text-cream-100 shadow-[inset_0_-2px_0_#c5a564]"
                      : "text-cream-100/65 hover:text-cream-100"
                  }`}
                >
                  <StatusDot project={p.id} />
                  <span className="whitespace-nowrap font-semibold">{p.status}</span>
                  <span className="hidden truncate text-cream-100/55 sm:inline">· {p.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      {promoActive && t.promo && (
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
        <nav className="container-x flex h-[4.5rem] items-center justify-between gap-6" aria-label={t.a11y.mainNav}>
          <Link href={homeHref} aria-label={t.a11y.home} className="shrink-0">
            <Logo tone={light ? "light" : "auto"} />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {t.nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative whitespace-nowrap text-[0.92rem] font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100 ${
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
            <a
              href={t.nav.advisors.href}
              aria-label={t.nav.advisors.label}
              title={t.nav.advisors.label}
              className={`hidden size-10 place-items-center rounded-full transition lg:grid ${
                light ? "text-cream-100/60 hover:text-cream-100" : "text-ink-soft/70 hover:text-ink"
              }`}
            >
              <UserCircle className="size-5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => openLead({ kind: ctaKind, origin: "nav" })}
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
            style={{ top: `calc(4.5rem${promoActive ? " + 2.1rem" : ""}${portfolio ? " + 2.25rem" : ""})` }}
          >
            {portfolio && (
              <div className="container-x grid grid-cols-2 gap-3 pt-6">
                {portfolio.items.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      aria-current={p.id === active ? "page" : undefined}
                      className={`group block overflow-hidden rounded-2xl border bg-surface ${
                        p.id === active ? "border-ink" : "border-line"
                      }`}
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <Image src={p.image} alt="" fill sizes="50vw" className="object-cover" />
                      </span>
                      <span className="block p-3">
                        <StatusChip project={p.id} label={p.status} className="!px-2 !py-1 !text-[0.6rem]" />
                        <span className="mt-2 block text-sm font-semibold leading-snug">{p.name}</span>
                        <span className="mt-0.5 block text-xs text-ink-soft">{p.price}</span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
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
                  openLead({ kind: ctaKind, origin: "menu" });
                }}
              >
                {t.nav.cta}
              </button>
              <Link href={t.nav.switchLang.href} className="btn btn-ghost w-full">
                <Globe className="size-4" aria-hidden />
                {t.nav.switchLang.label}
              </Link>
              <a href={t.nav.advisors.href} className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-ink-soft">
                <UserCircle className="size-4" aria-hidden />
                {t.nav.advisors.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
