"use client";

import Image from "next/image";
import { FilePdf, LockSimple } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { ShowcaseCopy } from "@/lib/i18n/showcase";
import type { Lang } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/lead/LeadForm";
import { Em, Eyebrow } from "./primitives";

export type MaterialDoc = "roi" | "brochure";

/**
 * Material exclusivo: el análisis de rentabilidad y el brochure no están en el sitio. Cada uno tiene su
 * propia sección (el brochure junto a las casas, el análisis junto a la inversión): vista previa con las
 * cifras clave, el resto bloqueado y un formulario para pedirlo; Fran lo envía por WhatsApp o por email.
 */
export function Material({
  doc,
  t,
  form,
  num,
  lang,
  privacyHref,
  origin,
  tone = "sand",
}: {
  doc: MaterialDoc;
  t: ShowcaseCopy["material"];
  form: Dict["form"];
  num?: number;
  lang: Lang;
  privacyHref: string;
  origin: string;
  tone?: "sand" | "plain";
}) {
  const roi = doc === "roi";
  const sec = t.sections[doc];
  const id = roi ? "analisis" : "brochure";

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tone === "sand" ? "section-sand " : ""}py-24 md:py-36`}>
      <div className="container-x">
        <Reveal>
          <Eyebrow num={num}>{sec.eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="display mt-5 max-w-[22ch] text-[2.4rem] md:text-[3.4rem]">
            <Em text={sec.title} />
          </h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <Reveal>
              <article
                className="rounded-[20px] border border-line bg-[#fdfbf7] p-6 text-[#16202f] shadow-[0_40px_80px_-40px_rgb(var(--shadow)/0.6)] sm:p-8"
              >
                <header className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Image src="/brand/crest-64.png" alt="" width={40} height={40} className="h-10 w-auto" />
                    <div className="leading-tight">
                      <p className="font-caps text-[0.95rem] font-semibold">Legacy Capital</p>
                      <p className="text-[0.72rem] text-[#56636b]">{roi ? t.roi.meta : t.brochure.meta}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-[#16202f]/15 px-2.5 py-1 text-[0.72rem] font-semibold">
                    <FilePdf className="size-4" aria-hidden />
                    {roi ? "PDF" : t.brochure.pages}
                  </span>
                </header>

                <h3 className="mt-6 font-display text-[1.9rem] leading-tight">{roi ? t.roi.title : t.brochure.title}</h3>

                {roi ? (
                  <dl className="mt-5 grid grid-cols-3 divide-x divide-[#16202f]/10 border-y border-[#16202f]/10 py-4">
                    {t.roi.kpis.map((k) => (
                      <div key={k.label} className="px-3 first:pl-0">
                        <dd className="font-display text-[1.35rem] leading-none text-[#7a5e2a] sm:text-[1.7rem]">{k.value}</dd>
                        <dt className="mt-2 text-[0.72rem] leading-snug text-[#56636b]">{k.label}</dt>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <div className="relative mt-5 aspect-[16/8] overflow-hidden rounded-xl">
                    <Image src="/img/facade-dusk.jpg" alt={t.brochure.coverAlt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-[50%_60%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e]/80 via-transparent to-transparent" />
                    <p className="absolute bottom-3 left-4 font-caps text-sm font-semibold tracking-wide text-white">Legacy Capital · 2026</p>
                  </div>
                )}

                <ul className="mt-5 grid gap-2.5">
                  {(roi ? t.roi.rows : t.brochure.rows).map(([label, value]) => (
                    <li key={label} className="flex items-center justify-between gap-4 rounded-xl bg-[#16202f]/[0.04] px-4 py-3 text-sm">
                      <span>{label}</span>
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="select-none font-semibold blur-[5px]">
                          {value}
                        </span>
                        <LockSimple className="size-4 text-[#7a5e2a]" weight="bold" aria-label={t.locked} />
                      </span>
                    </li>
                  ))}
                </ul>
                {roi && <p className="mt-4 text-[0.72rem] leading-relaxed text-[#56636b]">{t.roi.disclaimer}</p>}
              </article>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative rounded-[22px] border border-line bg-surface p-6 pt-10 shadow-[0_30px_70px_-40px_rgb(var(--shadow)/0.6)] sm:p-8 sm:pt-11">
            <span className="absolute -top-5 left-6 grid size-10 place-items-center rounded-full bg-gold-500 text-navy-900 shadow-lg sm:left-8">
              <LockSimple className="size-5" weight="bold" aria-hidden />
            </span>
            <h3 className="display text-[1.9rem] leading-tight">{sec.formTitle}</h3>
            <p className="mt-2 text-ink-soft">{sec.formNote}</p>
            <div className="mt-6">
              <LeadForm
                t={form}
                lang={lang}
                origin={`${origin}-${roi ? "analisis" : "brochure"}`}
                submitLabel={roi ? t.form.submitRoi : t.form.submitBrochure}
                defaults={{ proyecto: "preventa", interes: roi ? "inversion" : undefined }}
                fields={{ email: true }}
                deliver
                privacyHref={privacyHref}
                waTemplate={roi ? t.form.waRoi : t.form.waBrochure}
                successBody={roi ? t.form.successRoi : t.form.successBrochure}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
