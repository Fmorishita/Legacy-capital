"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, ChartLineUp, Check, FilePdf, LockSimple } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/lead/LeadForm";

type Props = {
  t: Dict["study"];
  form: Dict["form"];
  lang: Lang;
  privacyHref: string;
};

type Kind = "study" | "brochure";

// Valores de relleno: se muestran desenfocados y nunca llegan al lector de pantalla
const MASKED = ["$000,000", "$000,000", "0.00", "$0,000"];

function DocHeader({ meta }: { meta: string }) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line pb-6">
      <div className="flex items-center gap-3">
        <Image src="/brand/crest-64.png" alt="" width={64} height={64} className="h-10 w-auto" />
        <div>
          <p className="font-caps text-sm font-semibold tracking-[0.04em]">Legacy Capital</p>
          <p className="text-xs text-ink-soft">{meta}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-ink-soft">
        <FilePdf className="size-4" aria-hidden />
        PDF
      </span>
    </header>
  );
}

function StudyDoc({ t }: { t: Dict["study"] }) {
  return (
    <>
      <DocHeader meta={t.docMeta} />
      <p className="display mt-6 text-[1.9rem] leading-tight">{t.docTitle}</p>
      <dl className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
        {t.teaser.map((s) => (
          <div key={s.label} className="flex flex-col-reverse justify-end border-l-2 border-gold-500 pl-3 sm:pl-4">
            <dt className="mt-1.5 text-xs leading-snug text-ink-soft sm:text-sm">{s.label}</dt>
            <dd className="display text-[1.7rem] leading-none tabular-nums xs:text-[2rem] sm:text-[2.6rem]">{s.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-8 grid divide-y divide-line rounded-xl border border-line">
        {t.locked.map((label, i) => (
          <li key={label} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <span className="text-sm">{label}</span>
            <span className="flex items-center gap-2">
              <span aria-hidden className="select-none font-display text-lg font-semibold blur-[6px]">
                {MASKED[i % MASKED.length]}
              </span>
              <LockSimple className="size-4 text-gold-ink" weight="bold" aria-hidden />
              <span className="sr-only">{t.lockedNote}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function BrochureDoc({ b }: { b: Dict["study"]["brochure"] }) {
  return (
    <>
      <DocHeader meta={b.docMeta} />
      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-navy-950">
        <Image src="/img/street-aerial-sunset.jpg" alt="" fill sizes="(min-width: 1024px) 34rem, 90vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />
        <p className="display absolute bottom-4 left-5 text-[1.8rem] leading-tight text-cream-100">{b.docTitle}</p>
      </div>
      <ol className="mt-6 grid gap-3">
        {b.contents.map((c, i) => (
          <li key={c} className="flex items-center gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
            <span className="font-display text-lg text-gold-ink tabular-nums">0{i + 1}</span>
            <span className="flex-1 text-sm sm:text-base">{c}</span>
            <LockSimple className="size-4 text-gold-ink" weight="bold" aria-hidden />
          </li>
        ))}
      </ol>
    </>
  );
}

/** Lead magnets: estudio de rentabilidad (inversionista) o brochure (segunda casa), entregados por WhatsApp. */
export function StudyMagnet({ t, form, lang, privacyHref }: Props) {
  const [kind, setKind] = useState<Kind>("study");
  const b = t.brochure;
  const head = kind === "study" ? { eyebrow: t.eyebrow, title: t.title, body: t.body } : b;
  const options: { key: Kind; Icon: typeof BookOpen }[] = [
    { key: "study", Icon: ChartLineUp },
    { key: "brochure", Icon: BookOpen },
  ];

  const choose = (k: Kind) => {
    setKind(k);
    trackEvent("magnet_select", { magnet: k });
  };

  return (
    <section id="rentabilidad" aria-labelledby="study-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal>
          <p className="text-sm font-semibold text-ink-soft">{t.switchLabel}</p>
          <div role="radiogroup" aria-label={t.switchLabel} className="mt-4 grid gap-3 sm:max-w-2xl sm:grid-cols-2">
            {options.map(({ key, Icon }) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={kind === key}
                onClick={() => choose(key)}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                  kind === key ? "border-ink bg-ink text-bg shadow-lg" : "border-line-strong bg-surface hover:border-gold-500"
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-full ${
                    kind === key ? "bg-gold-500 text-navy-900" : "bg-bg-alt text-gold-ink"
                  }`}
                >
                  <Icon className="size-5" weight="duotone" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold">{t.options[key].label}</span>
                  <span className={`block text-sm ${kind === key ? "text-bg/75" : "text-ink-soft"}`}>{t.options[key].caption}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={kind}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mt-14 max-w-3xl">
              <p className="eyebrow">{head.eyebrow}</p>
              <h2 id="study-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
                {head.title}
              </h2>
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft">{head.body}</p>
            </div>

            <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div>
                <article
                  aria-label={kind === "study" ? t.docTitle : b.docTitle}
                  className="relative rounded-2xl border border-line bg-surface p-6 shadow-[0_40px_90px_-40px_rgb(var(--shadow)/0.55)] sm:p-9 lg:-rotate-[1.2deg]"
                >
                  {kind === "study" ? <StudyDoc t={t} /> : <BrochureDoc b={b} />}
                </article>

                {kind === "study" && (
                  <div className="mt-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{t.includesTitle}</p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                      {t.includes.map((item) => (
                        <li key={item} className="flex gap-3 leading-relaxed">
                          <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
                <h3 className="display text-[1.9rem] leading-[1.05]">{t.formTitle}</h3>
                <p className="mb-6 mt-2 text-sm leading-relaxed text-ink-soft">{kind === "study" ? t.formNote : b.formNote}</p>
                <LeadForm
                  t={form}
                  lang={lang}
                  origin={kind === "study" ? "estudio-roi" : "brochure"}
                  submitLabel={kind === "study" ? form.submitStudy : b.submit}
                  defaults={{ interes: kind === "study" ? "inversion" : "segunda_casa" }}
                  fields={{ interest: false }}
                  privacyHref={privacyHref}
                  waTemplate={kind === "study" ? t.waMessage : b.waMessage}
                  successBody={kind === "study" ? t.successBody : b.successBody}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {kind === "study" && <p className="mt-12 max-w-[90ch] text-xs leading-relaxed text-ink-soft">{t.disclaimer}</p>}
      </div>
    </section>
  );
}
