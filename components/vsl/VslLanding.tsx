"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle,
  MapPin,
  Quotes,
  VideoCamera,
  XCircle,
} from "@phosphor-icons/react";
import type { VslCopy, VslPersonaId } from "@/lib/i18n/vsl";
import { personaTabs } from "@/lib/i18n/vsl";
import { useLead } from "@/components/lead/LeadProvider";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { Em } from "@/components/showcase/primitives";
import { trackEvent } from "@/lib/track";
import { LIST_PRICE, bridge, money } from "@/lib/money";
import { VslPlayer } from "./VslPlayer";

type Props = { t: VslCopy; persona: VslPersonaId; privacyHref: string };

/**
 * Landing de VSL por persona, con la estructura de las landings de "llamada agendada":
 * titular + video vertical arriba del pliegue, CTA con prueba inmediata, método en 3 pasos
 * (problema → solución → resultado), pestañas por perfil, filtro para quién es / no es,
 * incluido, confianza, asesor, cierre con dos formas de agendar y FAQ de objeciones.
 */
export function VslLanding({ t, persona, privacyHref }: Props) {
  const { openLead } = useLead();
  const [ctaHot, setCtaHot] = useState(false);
  const origin = `vsl-${persona}`;

  const book = (mode: "videollamada" | "presencial", where: string) => {
    trackEvent("vsl_cta", { persona, where, mode });
    openLead({
      kind: "visit",
      origin: `${origin}-${where}`,
      proyecto: "preventa",
      modo_visita: mode,
      title: mode === "videollamada" ? "Agenda tu Zoom de 30 min" : "Agenda tu visita al desarrollo",
      subtitle: "Déjame tus datos y te confirmo el horario por WhatsApp.",
    });
  };

  return (
    <>
      {/* Encabezado mínimo: marca y un solo botón */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo compact />
          <button type="button" onClick={() => book("videollamada", "header")} className="btn btn-gold !px-5 !py-2.5 text-sm">
            Agendar
          </button>
        </div>
      </header>

      <main id="contenido">
        {/* 1 · Hero con VSL vertical */}
        <section className="relative overflow-hidden pb-14 pt-5 md:pb-20 md:pt-14">
          <div className="container-x grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-navy-950 px-3.5 py-1.5 text-[0.68rem] sm:text-[0.72rem] font-medium tracking-wide text-cream-100 lg:mx-0">
                <span aria-hidden className="live-dot size-2 rounded-full bg-[#5be38e]" />
                {t.pill}
              </p>
              <h1 className="display mt-4 text-[1.95rem] leading-[1.06] sm:text-5xl lg:mt-5 lg:text-[3.6rem]">
                <Em text={t.title} />
              </h1>
              <p className="lead mx-auto mt-4 hidden max-w-[34rem] sm:block lg:mx-0">{t.sub}</p>
              <p className="mt-3 text-sm font-medium text-gold-ink">{t.risk}</p>

              {/* En escritorio, CTA y promesa van junto al titular */}
              <div className="mt-8 hidden lg:block">
                <HeroCta t={t} hot={ctaHot} onZoom={() => book("videollamada", "hero")} onVisit={() => book("presencial", "hero")} />
              </div>
            </div>

            <div>
              {t.video ? (
                <VslPlayer
                  src={t.video.src}
                  poster={t.video.poster}
                  captions={t.video.captions}
                  label={t.video.label}
                  persona={persona}
                  ctaAt={55}
                  onCtaTime={() => setCtaHot(true)}
                />
              ) : t.photo ? (
                <div className="relative mx-auto aspect-[9/16] w-full max-w-[22rem] overflow-hidden rounded-[22px] shadow-[0_30px_80px_-30px_rgb(10_26_46/0.75)] ring-1 ring-black/10">
                  <Image src={t.photo.src} alt={t.photo.alt} fill priority sizes="22rem" className="object-cover" />
                </div>
              ) : null}
              <ul className="mx-auto mt-4 grid max-w-[22rem] gap-2">
                {t.checks.map((c) => (
                  <li key={c} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-[0.95rem] font-medium">
                    <CheckCircle className="size-5 shrink-0 text-[#3c9a5f]" weight="fill" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-6 lg:hidden">
                <HeroCta t={t} hot={ctaHot} onZoom={() => book("videollamada", "hero")} onVisit={() => book("presencial", "hero")} />
              </div>
            </div>
          </div>
        </section>

        {/* 2 · Para quién es + prueba */}
        <section className="border-y border-line bg-bg-alt py-12">
          <div className="container-x text-center">
            <p className="eyebrow eyebrow--plain">{t.audience.kicker}</p>
            <h2 className="display mx-auto mt-3 max-w-[40rem] text-2xl md:text-3xl">{t.audience.title}</h2>
            <dl className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
              {t.proof.map((p) => (
                <div key={p.label} className="rounded-2xl border border-line bg-surface px-5 py-5">
                  <dt className="sr-only">{p.label}</dt>
                  <dd className="display text-3xl text-gold-ink">{p.value}</dd>
                  <dd className="mt-1 text-sm text-ink-soft">{p.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3 · Método en 3 pasos: problema → solución → resultado */}
        <section className="py-20 md:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow eyebrow--plain">{t.how.kicker}</p>
              <h2 className="display mt-3 text-[2.2rem] md:text-5xl">
                <Em text={t.how.title} />
              </h2>
              <p className="lead mt-3">{t.how.lead}</p>
            </Reveal>
            <ol className="mt-14 grid gap-14">
              {t.how.steps.map((s, i) => (
                <Reveal as="li" key={s.tag} className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                  <div>
                    <span className="inline-flex rounded-full bg-navy-950 px-4 py-1.5 text-sm font-medium text-cream-100">
                      <span className="mr-2 text-[#ddbb84]">●</span>
                      {s.tag}
                    </span>
                    <h3 className="display mt-4 text-[1.75rem] md:text-4xl">{s.title}</h3>
                    <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
                      <p className="flex items-center gap-2 font-semibold">
                        <XCircle className="size-5 text-[#c0563f]" weight="fill" aria-hidden /> El problema
                      </p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-soft">
                        {s.problem.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-navy-950 p-6 text-cream-100 on-dark">
                    <p className="flex items-center gap-2 font-semibold text-[#ddbb84]">
                      <Image src="/brand/crest-64.png" alt="" width={20} height={26} className="h-5 w-auto" /> La solución Legacy
                    </p>
                    <ul className="mt-3 space-y-2">
                      {s.solution.map((x) => (
                        <li key={x} className="flex gap-2">
                          <CheckCircle className="mt-0.5 size-5 shrink-0 text-[#ddbb84]" weight="fill" aria-hidden />
                          <span className="text-cream-100/90">{x}</span>
                        </li>
                      ))}
                    </ul>
                    {i === 0 && <PaymentTimeline />}
                    <p className="mt-5 border-t border-white/15 pt-4 text-sm">
                      <span className="mr-2 rounded-full bg-[#c5a564] px-2.5 py-1 text-xs font-semibold text-navy-950">Resultado</span>
                      {s.result}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 4 · Pestañas por perfil */}
        <PersonaTabs t={t} active={persona} onCta={() => book("videollamada", "tabs")} />

        {/* 5 · Para quién es / no es */}
        <section className="py-20 md:py-28">
          <div className="container-x">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="display text-[2.1rem] md:text-5xl">{t.fit.title}</h2>
            </Reveal>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[#3c9a5f]/35 bg-[#3c9a5f]/8 p-6">
                <p className="font-semibold">Es para ti si…</p>
                <ul className="mt-4 space-y-3">
                  {t.fit.yes.map((x) => (
                    <li key={x} className="flex gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-[#3c9a5f]" weight="fill" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#c0563f]/35 bg-[#c0563f]/8 p-6">
                <p className="font-semibold">No es para ti si…</p>
                <ul className="mt-4 space-y-3">
                  {t.fit.no.map((x) => (
                    <li key={x} className="flex gap-3">
                      <XCircle className="mt-0.5 size-5 shrink-0 text-[#c0563f]" weight="fill" aria-hidden />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-center text-ink-soft">{t.fit.note}</p>
          </div>
        </section>

        {/* 6 · Qué incluye */}
        <section className="section-sand py-20 md:py-28">
          <div className="container-x">
            <Reveal>
              <h2 className="display text-center text-[2.1rem] md:text-5xl">{t.features.title}</h2>
            </Reveal>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {t.features.items.map((f, i) => (
                <Reveal as="li" key={f.title} delay={(i % 3) * 0.08} className="overflow-hidden rounded-[18px] border border-line bg-surface">
                  <div className="relative aspect-[4/3]">
                    <Image src={f.img} alt={f.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{f.title}</h3>
                    <p className="mt-1 text-ink-soft">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 · Confianza */}
        <section className="section-dark on-dark py-20 md:py-28">
          <div className="container-x">
            <Reveal className="max-w-3xl">
              <p className="eyebrow">{t.trust.kicker}</p>
              <h2 className="display mt-3 text-[2.1rem] md:text-5xl">
                <Em text={t.trust.title} />
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {t.trust.items.map((it) => (
                <li key={it.title} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                  <h3 className="text-lg font-semibold text-[#ddbb84]">{it.title}</h3>
                  <p className="mt-2 text-cream-100/80">{it.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl text-xs text-cream-100/55">{t.trust.disclaimer}</p>
          </div>
        </section>

        {/* 8 · Asesor */}
        <section className="py-20 md:py-28">
          <div className="container-x grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[22px]">
              <Image src={t.advisor.img} alt={t.advisor.title} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="eyebrow">{t.advisor.kicker}</p>
              <h2 className="display mt-3 text-4xl md:text-5xl">{t.advisor.title}</h2>
              <p className="lead mt-4 max-w-xl">{t.advisor.text}</p>
              <button type="button" onClick={() => book("videollamada", "advisor")} className="btn btn-primary btn-lg mt-7">
                Hablar con Fran <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        {/* 9 · Cierre: dos formas de agendar (aquí irá el calendario de Cal.com) */}
        <section id="agendar" className="section-sand py-20 md:py-28">
          <div className="container-x text-center">
            <h2 className="display text-[2.3rem] md:text-6xl">
              <Em text={t.final.title} />
            </h2>
            <p className="lead mx-auto mt-4 max-w-2xl">{t.final.lead}</p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2">
              <BookCard icon="zoom" title={t.final.zoom.title} text={t.final.zoom.text} cta={t.final.zoom.cta} onClick={() => book("videollamada", "final")} primary />
              <BookCard icon="visit" title={t.final.visit.title} text={t.final.visit.text} cta={t.final.visit.cta} onClick={() => book("presencial", "final")} />
            </div>
            <p className="mt-6 text-sm text-ink-soft">{t.final.scarcity}</p>
          </div>
        </section>

        {/* 10 · FAQ de objeciones */}
        <FaqList t={t.faq} />
      </main>

      <footer className="border-t border-line py-10">
        <div className="container-x flex flex-col items-center gap-4 text-center text-xs text-ink-soft">
          <Logo />
          <p className="max-w-2xl">{t.legal}</p>
          <a href={privacyHref} className="underline underline-offset-4">
            Aviso de privacidad
          </a>
        </div>
      </footer>

      {/* Barra fija en celular cuando el video llega al llamado a la acción */}
      <AnimatePresence>
        {ctaHot && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur lg:hidden"
          >
            <button type="button" onClick={() => book("videollamada", "sticky")} className="btn btn-gold btn-glow w-full">
              {t.cta} <ArrowRight className="size-4" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroCta({ t, hot, onZoom, onVisit }: { t: VslCopy; hot: boolean; onZoom: () => void; onVisit: () => void }) {
  return (
    <div className="mx-auto max-w-[26rem] lg:mx-0">
      <button type="button" onClick={onZoom} className={`btn btn-gold btn-lg w-full text-base uppercase tracking-[0.14em] ${hot ? "btn-glow" : ""}`}>
        {t.cta}
      </button>
      <button type="button" onClick={onVisit} className="mt-3 w-full text-sm font-medium text-ink underline underline-offset-4">
        {t.ctaAlt}
      </button>
      <figure className="mt-5 rounded-2xl border border-line bg-surface p-5 text-left">
        <Quotes className="size-5 text-gold-ink" weight="fill" aria-hidden />
        <blockquote className="mt-2 text-[0.95rem] leading-relaxed">“{t.promise.quote}”</blockquote>
        <figcaption className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
          <Image src="/media/img/fran-avatar.webp" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
          {t.promise.by}
        </figcaption>
      </figure>
    </div>
  );
}

/** Línea de tiempo del esquema 10·10·80 (equivalente a la tarjeta "Recorrido desde la campaña"). */
function PaymentTimeline() {
  const p = LIST_PRICE["2R"];
  const rows = [
    { when: "Hoy", what: "10% de enganche", amount: money(bridge.down(p), "es") },
    { when: "20 meses", what: "10% en mensualidades sin intereses", amount: `${money(bridge.monthly(p), "es")} / mes` },
    { when: "Entrega 2028", what: "80% contado o crédito hipotecario", amount: money(bridge.delivery(p), "es") },
  ];
  return (
    <div className="mt-5 rounded-xl bg-white/[0.06] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-cream-100/60">Casa de 2 recámaras · lista nov 2026</p>
      <ol className="mt-3 space-y-3">
        {rows.map((r, i) => (
          <li key={r.when} className="flex items-start gap-3">
            <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${i === 2 ? "bg-[#5be38e]" : "bg-[#c5a564]"}`} aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-semibold">{r.when}</p>
              <p className="text-xs text-cream-100/65">{r.what}</p>
            </div>
            <p className="text-sm font-semibold tabular-nums text-[#ddbb84]">{r.amount}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PersonaTabs({ t, active, onCta }: { t: VslCopy; active: VslPersonaId; onCta: () => void }) {
  const ids = Object.keys(personaTabs) as VslPersonaId[];
  const [tab, setTab] = useState<VslPersonaId>(active);
  const p = personaTabs[tab];
  return (
    <section className="section-sand py-20 md:py-28">
      <div className="container-x">
        <Reveal className="text-center">
          <p className="eyebrow eyebrow--plain">{t.tabs.kicker}</p>
          <h2 className="display mt-3 text-[2.1rem] md:text-5xl">
            <Em text={t.tabs.title} />
          </h2>
        </Reveal>
        <div role="tablist" aria-label="Perfiles" className="no-scrollbar mx-auto mt-8 flex max-w-xl gap-2 overflow-x-auto rounded-full border border-line bg-surface p-1.5">
          {ids.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${tab === id ? "bg-navy-950 text-cream-100" : "text-ink-soft hover:text-ink"}`}
            >
              {personaTabs[id].label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="flex items-center gap-2 font-semibold">
              <XCircle className="size-5 text-[#c0563f]" weight="fill" aria-hidden /> El problema
            </p>
            <p className="mt-3 text-ink-soft">{p.problem}</p>
          </div>
          <div className="rounded-2xl bg-navy-950 p-6 text-cream-100">
            <p className="flex items-center gap-2 font-semibold text-[#ddbb84]">
              <CheckCircle className="size-5" weight="fill" aria-hidden /> La solución
            </p>
            <p className="mt-3 text-cream-100/85">{p.solution}</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="mb-3 text-ink-soft">¿Quieres ver cómo se ve esto con tus números?</p>
          <button type="button" onClick={onCta} className="btn btn-primary btn-lg">
            {t.tabs.ctaLabel} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

function BookCard({
  icon,
  title,
  text,
  cta,
  onClick,
  primary,
}: {
  icon: "zoom" | "visit";
  title: string;
  text: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}) {
  const Icon = icon === "zoom" ? VideoCamera : MapPin;
  return (
    <div className={`flex flex-col items-center rounded-2xl border p-7 ${primary ? "border-[#c5a564] bg-surface shadow-[0_20px_50px_-30px_rgb(197_165_100/0.9)]" : "border-line bg-surface"}`}>
      <span className="grid size-12 place-items-center rounded-full bg-navy-950 text-[#ddbb84]">
        <Icon className="size-6" weight="fill" aria-hidden />
      </span>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-ink-soft">{text}</p>
      <button type="button" onClick={onClick} className={`btn mt-5 w-full ${primary ? "btn-gold" : "btn-ghost"}`}>
        <CalendarCheck className="size-4" aria-hidden /> {cta}
      </button>
    </div>
  );
}

function FaqList({ t }: { t: VslCopy["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28">
      <div className="container-x max-w-3xl">
        <h2 className="display text-center text-[2.1rem] md:text-5xl">{t.title}</h2>
        <ul className="mt-10 border-t border-line-strong">
          {t.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className="border-b border-line-strong">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold"
                  >
                    {it.q}
                    <span aria-hidden className={`text-2xl text-gold-ink transition ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                </h3>
                {isOpen && <p className="pb-6 leading-relaxed text-ink-soft">{it.a}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
