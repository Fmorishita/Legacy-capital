import type { VdmCopy } from "@/lib/i18n/vinedos";
import { portfolio } from "@/lib/i18n/portfolio";
import { site, type Lang } from "@/lib/site";
import { href } from "@/lib/projects";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { Header } from "@/components/sections/Header";
import { Facts } from "@/components/sections/Facts";
import { Advisor } from "@/components/sections/Advisor";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { FloatingActions } from "@/components/sections/FloatingActions";
import { CrossSell } from "@/components/sections/CrossSell";
import { VdmHero } from "@/components/vinedos/VdmHero";
import { VdmModels } from "@/components/vinedos/VdmModels";
import { VdmAmenities, VdmAudience, VdmImmediate, VdmLocation, VdmTour } from "@/components/vinedos/VdmSections";

const PRICES = { palomino: 3639798, palomino_ph: 4202453, azur: 4910724, teide: 5296500 } as const;

function jsonLd(t: VdmCopy, lang: Lang) {
  const url = `${site.url}${href("vinedos", lang)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Residence",
      name: "Viñedos del Mar",
      description: t.meta.description,
      url,
      image: [`${site.url}/img/vdm/pool-pergola.jpg`, `${site.url}/img/vdm/aerial.jpg`, `${site.url}/img/vdm/rooftop-terrace.jpg`],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carretera Tecate–Ensenada km 103.5",
        addressLocality: "El Sauzal, Ensenada",
        postalCode: "22760",
        addressRegion: "Baja California",
        addressCountry: "MX",
      },
      geo: { "@type": "GeoCoordinates", latitude: 31.9141, longitude: -116.6912 },
      amenityFeature: t.amenities.items.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.label, value: true })),
      containsPlace: t.models.items.map((m) => ({
        "@type": m.interest.startsWith("palomino") ? "Apartment" : "SingleFamilyResidence",
        name: m.name,
        floorSize: { "@type": "QuantitativeValue", value: parseFloat(m.specs[2].value), unitCode: "MTK" },
        numberOfBedrooms: parseInt(m.specs[0].value, 10),
      })),
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "MXN",
        lowPrice: PRICES.palomino,
        highPrice: PRICES.teide,
        offerCount: t.models.items.length,
        availability: "https://schema.org/InStock",
        seller: { "@type": "RealEstateAgent", name: site.name, telephone: site.advisor.phoneDisplay },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ];
}

/** Viñedos del Mar: producto terminado con entrega inmediata. */
export function Vinedos({ t, lang }: { t: VdmCopy; lang: Lang }) {
  const privacyHref = href("privacy", lang);
  const p = portfolio[lang];

  return (
    <LeadProvider
      t={{ form: t.form, dialog: t.dialog, a11y: t.a11y, quickForm: t.quickForm }}
      lang={lang}
      privacyHref={privacyHref}
      project="vinedos"
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        {t.a11y.skip}
      </a>
      <Header t={{ nav: t.nav, a11y: t.a11y }} homeHref={href("home", lang)} portfolio={p} active="vinedos" />
      <main id="contenido">
        <VdmHero t={{ hero: t.hero, quickForm: t.quickForm, form: t.form }} lang={lang} privacyHref={privacyHref} />
        <Facts t={t.facts} label={t.a11y.facts} />
        <VdmModels t={t.models} />
        <VdmImmediate t={t.immediate} />
        <VdmTour t={t.tour} />
        <VdmAmenities t={t.amenities} />
        <VdmAudience t={t.audience} />
        <Advisor t={t.advisor} waGeneric={t.form.waGeneric} />
        <VdmLocation t={t.location} />
        <Trust t={t.trust} />
        <CrossSell item={p.items[0]} t={t.crossSell} />
        <Faq t={t.faq} />
        <FinalCta
          t={t.finalCta}
          form={t.form}
          whatsappLabel={t.hero.ctaSecondary}
          lang={lang}
          privacyHref={privacyHref}
          image="/img/vdm/pool-dusk.jpg"
        />
      </main>
      <Footer t={t.footer} nav={t.nav} waGeneric={t.form.waGeneric} privacyHref={privacyHref} navLabel={t.a11y.footerNav} portfolio={p} />
      <FloatingActions t={t.mobileBar} exit={t.exit} waGeneric={t.form.waGeneric} label={t.a11y.quickActions} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, lang)).replace(/</g, "\\u003c") }} />
    </LeadProvider>
  );
}
