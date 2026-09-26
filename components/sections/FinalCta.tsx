"use client";

import Image from "next/image";
import { WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { waLink, type Lang } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/lead/LeadForm";

type Props = {
  t: Dict["finalCta"];
  form: Dict["form"];
  whatsappLabel: string;
  lang: Lang;
  privacyHref: string;
};

/** Bloque navy final (único cambio de tema de la página, transición deliberada hacia el pie). */
export function FinalCta({ t, form, whatsappLabel, lang, privacyHref }: Props) {
  return (
    <section id="visita" aria-labelledby="final-title" className="relative isolate overflow-hidden bg-navy-900 text-cream-100 dark:bg-navy-950">
      <div className="absolute inset-0 -z-10">
        <Image src="/img/sunset-ocean.jpg" alt={t.imageAlt} fill sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40 dark:from-navy-950 dark:via-navy-950/85" />
      </div>
      <div className="container-x grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1fr_27rem] lg:gap-20">
        <Reveal>
          <h2 id="final-title" className="display max-w-[15ch] text-[2.8rem] leading-[1.03] md:text-[4.4rem]">
            {t.title}
          </h2>
          <span aria-hidden className="mt-8 block h-px w-28 bg-gold-500" />
          <p className="mt-7 max-w-[44ch] text-lg leading-relaxed text-cream-100/80">{t.body}</p>
          <a
            href={waLink(form.waGeneric)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold mt-9"
            onClick={() => trackEvent("whatsapp_click", { origin: "final" })}
          >
            <WhatsappLogo className="size-5" weight="fill" aria-hidden />
            {whatsappLabel}
          </a>
        </Reveal>
        <Reveal delay={0.1} className="rounded-2xl bg-surface p-6 text-ink shadow-2xl sm:p-8">
          <h3 className="display mb-6 text-[1.9rem] leading-tight">{t.formTitle}</h3>
          <LeadForm
            t={form}
            lang={lang}
            origin="visita-final"
            submitLabel={form.submitVisit}
            defaults={{ modo_visita: "presencial" }}
            fields={{ interest: true, visit: true, email: true, message: true }}
            privacyHref={privacyHref}
          />
        </Reveal>
      </div>
    </section>
  );
}
