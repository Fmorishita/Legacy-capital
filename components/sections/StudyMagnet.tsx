"use client";

import Image from "next/image";
import { Check, FilePdf, LockSimple } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { Lang } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/lead/LeadForm";

type Props = {
  t: Dict["study"];
  form: Dict["form"];
  lang: Lang;
  privacyHref: string;
};

// Valores de relleno: se muestran desenfocados y nunca llegan al lector de pantalla
const MASKED = ["$000,000", "$000,000", "0.00", "$0,000"];

/** Lead magnet: el estudio de rentabilidad se entrega por WhatsApp al dejar los datos. */
export function StudyMagnet({ t, form, lang, privacyHref }: Props) {
  return (
    <section id="rentabilidad" aria-labelledby="study-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="study-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <article
                aria-label={t.docTitle}
                className="relative rounded-2xl border border-line bg-surface p-6 shadow-[0_40px_90px_-40px_rgb(var(--shadow)/0.55)] sm:p-9 lg:-rotate-[1.2deg]"
              >
                <header className="flex items-start justify-between gap-4 border-b border-line pb-6">
                  <div className="flex items-center gap-3">
                    <Image src="/brand/crest-64.png" alt="" width={64} height={64} className="h-10 w-auto" />
                    <div>
                      <p className="font-caps text-sm font-semibold tracking-[0.04em]">Legacy Capital</p>
                      <p className="text-xs text-ink-soft">{t.docMeta}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-ink-soft">
                    <FilePdf className="size-4" aria-hidden />
                    PDF
                  </span>
                </header>

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
              </article>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">{t.includesTitle}</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                {t.includes.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
            <h3 className="display text-[1.9rem] leading-[1.05]">{t.formTitle}</h3>
            <p className="mb-6 mt-2 text-sm leading-relaxed text-ink-soft">{t.formNote}</p>
            <LeadForm
              t={form}
              lang={lang}
              origin="estudio-roi"
              submitLabel={form.submitStudy}
              defaults={{ interes: "inversion" }}
              fields={{ interest: false }}
              privacyHref={privacyHref}
            />
          </Reveal>
        </div>

        <p className="mt-12 max-w-[90ch] text-xs leading-relaxed text-ink-soft">{t.disclaimer}</p>
      </div>
    </section>
  );
}
