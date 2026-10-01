"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { List, X, ArrowRight, CaretDown, Globe, UserCircle } from "@phosphor-icons/react";
import Image from "next/image";
import type { Dict } from "@/lib/i18n/es";
import type { NavCopy } from "@/lib/i18n/types";
import type { PortfolioCopy } from "@/lib/i18n/portfolio";
import type { ProjectId } from "@/lib/projects";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { StatusChip } from "@/components/ui/StatusChip";

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

/** Menú "Proyectos" de escritorio: se abre al pasar el mouse o con clic, y se cierra con Esc o clic fuera. */
function useProjectsMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Evita que el clic que sigue a la apertura por hover lo cierre de inmediato
  const openedAt = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest("#menu-proyectos") && !button.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    clearTimeout(timer.current);
    if (!open) openedAt.current = Date.now();
    setOpen(true);
  };
  const close = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  return {
    open,
    button,
    close,
    toggle: () => {
      if (open && Date.now() - openedAt.current < 400) return;
      if (open) close();
      else show();
    },
    hoverProps: {
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") show();
      },
      onPointerLeave: (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(false), 180);
      },
    },
  };
}

type Props = {
  t: { nav: NavCopy; a11y: Dict["a11y"]; promo?: Dict["promo"] };
  homeHref: string;
  /** Menú "Proyectos" (preventa / entrega inmediata) */
  portfolio?: PortfolioCopy;
  active?: ProjectId;
  ctaKind?: LeadKind;
};

export function Header({ t, homeHref, portfolio, active, ctaKind = "prices" }: Props) {
  const { openLead } = useLead();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const projects = useProjectsMenu();
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
  const light = !solid && !open && !projects.open;
  const compareHref = `${homeHref}#compara`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
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
            {portfolio && (
              <li {...projects.hoverProps}>
                <button
                  ref={projects.button}
                  type="button"
                  aria-expanded={projects.open}
                  aria-controls="menu-proyectos"
                  onClick={projects.toggle}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.92rem] font-semibold transition-colors ${
                    light
                      ? "border-cream-100/35 text-cream-100 hover:border-cream-100/70"
                      : "border-line-strong text-ink hover:border-ink"
                  }`}
                >
                  <span aria-hidden className="flex gap-1">
                    {portfolio.items.map((p) => (
                      <span key={p.id} className={`size-2 rounded-full ${p.id === "vinedos" ? "bg-vine-400" : "bg-gold-400"}`} />
                    ))}
                  </span>
                  {portfolio.title}
                  <CaretDown
                    className={`size-3.5 transition-transform duration-300 ${projects.open ? "rotate-180" : ""}`}
                    weight="bold"
                    aria-hidden
                  />
                </button>
              </li>
            )}
            {t.nav.links.map((l, i) => (
              // Con el menú de proyectos no caben todos los enlaces en laptops: los últimos aparecen en pantallas anchas
              <li key={l.href} className={!portfolio ? undefined : i >= 5 ? "hidden 2xl:block" : i >= 2 ? "hidden xl:block" : undefined}>
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

        <AnimatePresence>
          {portfolio && projects.open && (
            <motion.div
              id="menu-proyectos"
              {...projects.hoverProps}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full hidden lg:block"
            >
              <div className="container-x">
                <div className="mx-auto mt-2 max-w-[52rem] rounded-2xl border border-line bg-surface p-3 text-ink shadow-[0_30px_80px_-30px_rgb(var(--shadow)/0.55)]">
                  <ul className="grid grid-cols-2 gap-2">
                    {portfolio.items.map((p) => {
                      const here = p.id === active;
                      return (
                        <li key={p.id}>
                          <Link
                            href={p.href}
                            onClick={projects.close}
                            aria-current={here ? "page" : undefined}
                            className="group flex h-full gap-4 rounded-xl p-3 transition-colors hover:bg-bg-alt"
                          >
                            <span className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={p.image}
                                alt=""
                                fill
                                sizes="9rem"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </span>
                            <span className="flex min-w-0 flex-col">
                              <span className="flex flex-wrap items-center gap-2">
                                <StatusChip project={p.id} label={p.status} className="!px-2 !py-1 !text-[0.6rem]" />
                                {here && <span className="text-xs font-medium text-ink-soft">{portfolio.menu.current}</span>}
                              </span>
                              <span className="mt-2 font-display text-[1.3rem] font-semibold leading-tight">{p.name}</span>
                              <span className="mt-1 text-sm leading-snug text-ink-soft">{p.goal}</span>
                              <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold">
                                {p.price}
                                <ArrowRight className="size-3.5 text-gold-ink transition-transform group-hover:translate-x-0.5" weight="bold" aria-hidden />
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href={compareHref}
                    onClick={projects.close}
                    className="mt-2 flex items-center justify-between rounded-xl bg-bg-alt px-4 py-3 text-sm font-medium transition-colors hover:text-gold-ink"
                  >
                    {portfolio.menu.compare}
                    <ArrowRight className="size-4" weight="bold" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-bg lg:hidden"
            style={{ top: `calc(4.5rem${promoActive ? " + 2.1rem" : ""})` }}
          >
            {portfolio && (
              <p className="container-x pt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{portfolio.title}</p>
            )}
            {portfolio && (
              <div className="container-x mt-3 grid grid-cols-2 gap-3">
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
                        <span className="mt-1 block text-xs leading-snug text-ink-soft">{p.goal}</span>
                        <span className="mt-1.5 block text-xs font-semibold">{p.price}</span>
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
