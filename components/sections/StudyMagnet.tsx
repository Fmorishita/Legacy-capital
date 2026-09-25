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

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  doc: React.ReactNode;
  aside?: React.ReactNode;
  formTitle: string;
  formNote: string;
  form: React.ReactNode;
  footnote?: string;
  className: string;
};

function MagnetSection({ id, eyebrow, title, body, doc, aside, formTitle, formNote, form, footnote, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 md:py-36 ${className}`}>
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={`${id}-title`} className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft">{body}</p>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Reveal>
              <article className="relative rounded-2xl border border-line bg-surface p-6 shadow-[0_40px_90px_-40px_rgb(var(--shadow)/0.55)] sm:p-9 lg:-rotate-[1.2deg]">
                {doc}
              </article>
            </Reveal>
            {aside}
          </div>
          <Reveal delay={0.12} className="rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
            <h3 className="display text-[1.9rem] leading-[1.05]">{formTitle}</h3>
            <p className="mb-6 mt-2 text-sm leading-relaxed text-ink-soft">{formNote}</p>
            {form}
          </Reveal>
        </div>

        {footnote && <p className="mt-12 max-w-[90ch] text-xs leading-relaxed text-ink-soft">{footnote}</p>}
      </div>
    </section>
  );
}

/** Lead magnet para quien busca segunda casa: el brochure completo, por WhatsApp. */
export function BrochureMagnet({ t, form, lang, privacyHref }: Props) {
  const b = t.brochure;
  return (
    <MagnetSection
      id="brochure"
      className="bg-bg-alt"
      eyebrow={b.eyebrow}
      title={b.title}
      body={b.body}
      doc={<BrochureDoc b={b} />}
      formTitle={t.formTitle}
      formNote={b.formNote}
      form={
        <LeadForm
          t={form}
          lang={lang}
          origin="brochure"
          submitLabel={b.submit}
          defaults={{ interes: "segunda_casa" }}
          fields={{ interest: false }}
          privacyHref={privacyHref}
          waTemplate={b.waMessage}
          successBody={b.successBody}
        />
      }
    />
  );
}

/** Lead magnet para inversionistas: el estudio de rentabilidad, por WhatsApp. */
export function StudyMagnet({ t, form, lang, privacyHref }: Props) {
  return (
    <MagnetSection
      id="rentabilidad"
      className="bg-bg-alt"
      eyebrow={t.eyebrow}
      title={t.title}
      body={t.body}
      doc={<StudyDoc t={t} />}
      aside={
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
      }
      formTitle={t.formTitle}
      formNote={t.formNote}
      form={
        <LeadForm
          t={form}
          lang={lang}
          origin="estudio-roi"
          submitLabel={form.submitStudy}
          defaults={{ interes: "inversion" }}
          fields={{ interest: false }}
          privacyHref={privacyHref}
          waTemplate={t.waMessage}
          successBody={t.successBody}
        />
      }
      footnote={t.disclaimer}
    />
  );
}
