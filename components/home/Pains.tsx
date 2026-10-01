"use client";

import { ArrowRight, Check, Compass, FileText, GlobeHemisphereWest, Handshake, ShieldCheck, Tag } from "@phosphor-icons/react";
import type { HomeCopy, PainIcon } from "@/lib/i18n/home";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";
import { AdvisorAvatar } from "@/components/sections/Advisor";
import { useLead } from "@/components/lead/LeadProvider";

const icons: Record<PainIcon, typeof Compass> = {
  compass: Compass,
  shield: ShieldCheck,
  globe: GlobeHemisphereWest,
  tag: Tag,
  file: FileText,
  handshake: Handshake,
};

/** Las dudas del comprador, en sus palabras, y lo que Legacy Capital hace con cada una. */
export function Pains({ t }: { t: HomeCopy["pains"] }) {
  const { openLead } = useLead();

  return (
    <section id="ayuda" aria-labelledby="pains-title" className="py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="pains-title" className="display mt-4 max-w-[14ch] text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
          <div className="mt-10 hidden lg:block">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openLead({ kind: "prices", origin: "home-dudas", title: t.dialogTitle, subtitle: t.dialogSubtitle })
              }
            >
              {t.cta}
              <ArrowRight className="size-4" weight="bold" aria-hidden />
            </button>
            <p className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
              <AdvisorAvatar name={site.advisor.name} className="size-8 shrink-0" />
              {t.ctaNote}
            </p>
          </div>
        </Reveal>

        <div>
          <ul className="border-b border-line">
            {t.items.map((item, i) => {
              const Icon = icons[item.icon];
              return (
                <Reveal
                  as="li"
                  key={item.concern}
                  delay={(i % 2) * 0.05}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-8 sm:grid-cols-[3.25rem_1fr] sm:gap-6 md:py-10"
                >
                  <span aria-hidden className="grid size-10 place-items-center rounded-full bg-gold-500/12 text-gold-ink sm:size-12">
                    <Icon className="size-5 sm:size-6" weight="duotone" />
                  </span>
                  <div>
                    <p className="display text-[1.5rem] leading-[1.15] sm:text-[1.65rem] md:text-[1.95rem]">
                      <span aria-hidden className="text-gold-ink">“</span>
                      {item.concern}
                      <span aria-hidden className="text-gold-ink">”</span>
                    </p>
                    <p className="mt-4 flex gap-3 leading-relaxed text-ink-soft">
                      <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                        <Check className="size-3" weight="bold" />
                      </span>
                      <span>
                        <span className="font-semibold text-ink">{t.answerLabel}: </span>
                        {item.answer}
                      </span>
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-10 lg:hidden">
            <button
              type="button"
              className="btn btn-primary w-full sm:w-auto"
              onClick={() =>
                openLead({ kind: "prices", origin: "home-dudas", title: t.dialogTitle, subtitle: t.dialogSubtitle })
              }
            >
              {t.cta}
              <ArrowRight className="size-4" weight="bold" aria-hidden />
            </button>
            <p className="mt-4 flex items-center gap-3 text-sm text-ink-soft">
              <AdvisorAvatar name={site.advisor.name} className="size-8 shrink-0" />
              {t.ctaNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
