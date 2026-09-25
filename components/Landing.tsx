import type { Dict } from "@/lib/i18n/es";
import { site, type Lang } from "@/lib/site";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Facts } from "@/components/sections/Facts";
import { Project } from "@/components/sections/Project";
import { RoofToggle } from "@/components/sections/RoofToggle";
import { Models } from "@/components/sections/Models";
import { Included } from "@/components/sections/Included";
import { Lifestyle } from "@/components/sections/Lifestyle";
import { Amenities } from "@/components/sections/Amenities";
import { Payments } from "@/components/sections/Payments";
import { Invest } from "@/components/sections/Invest";
import { StudyMagnet } from "@/components/sections/StudyMagnet";
import { Personas } from "@/components/sections/Personas";
import { Ensenada } from "@/components/sections/Ensenada";
import { Trust } from "@/components/sections/Trust";
import { Advisor } from "@/components/sections/Advisor";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { FloatingActions } from "@/components/sections/FloatingActions";

function jsonLd(t: Dict, lang: Lang) {
  const url = lang === "en" ? `${site.url}/en` : site.url;
  return [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: site.name,
      url,
      image: `${site.url}/brand/crest-512.png`,
      logo: `${site.url}/brand/crest-512.png`,
      slogan: "Building wealth for generations",
      telephone: site.advisor.phoneDisplay,
      areaServed: "Ensenada, Baja California, México",
      address: { "@type": "PostalAddress", addressLocality: "Ensenada", addressRegion: "Baja California", addressCountry: "MX" },
      employee: { "@type": "Person", name: site.advisor.name, jobTitle: t.advisor.role },
    },
    {
      "@context": "https://schema.org",
      "@type": "Residence",
      name: t.meta.title.split(" | ")[0],
      description: t.meta.description,
      url,
      image: [`${site.url}/img/hero-sunset.jpg`, `${site.url}/img/aerial-homes.jpg`, `${site.url}/img/roof-sunset.jpg`],
      address: {
        "@type": "PostalAddress",
        addressLocality: "El Sauzal de Rodríguez, Ensenada",
        addressRegion: "Baja California",
        addressCountry: "MX",
      },
      containsPlace: [
        { "@type": "SingleFamilyResidence", name: t.models.tabs["2R"].label, numberOfRooms: 2, floorSize: { "@type": "QuantitativeValue", value: 178.06, unitCode: "MTK" } },
        { "@type": "SingleFamilyResidence", name: t.models.tabs["3R"].label, numberOfRooms: 3, floorSize: { "@type": "QuantitativeValue", value: 195.19, unitCode: "MTK" } },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    },
  ];
}

export function Landing({ t, lang }: { t: Dict; lang: Lang }) {
  const privacyHref = lang === "en" ? "/en/privacy" : "/aviso-de-privacidad";
  const homeHref = lang === "en" ? "/en" : "/";

  return (
    <LeadProvider t={{ form: t.form, dialog: t.dialog, a11y: t.a11y, quickForm: t.quickForm }} lang={lang} privacyHref={privacyHref}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        {t.a11y.skip}
      </a>
      <Header t={{ nav: t.nav, promo: t.promo, a11y: t.a11y }} homeHref={homeHref} />
      <main id="contenido">
        <Hero t={{ hero: t.hero, quickForm: t.quickForm, form: t.form }} lang={lang} privacyHref={privacyHref} />
        <Facts t={t.facts} label={t.a11y.facts} />
        <Personas t={t.personas} label={t.a11y.personas} />
        <Advisor t={t.advisor} waGeneric={t.form.waGeneric} />
        <Project t={t.project} />
        <RoofToggle t={t.roof} />
        <Models t={t.models} />
        <Included t={t.included} />
        <Lifestyle t={t.lifestyle} />
        <Amenities t={t.amenities} />
        <Invest t={t.invest} lang={lang} />
        <StudyMagnet t={t.study} form={t.form} lang={lang} privacyHref={privacyHref} />
        <Payments t={t.payments} models={t.models.tabs} lang={lang} />
        <Trust t={t.trust} />
        <Ensenada t={t.ensenada} />
        <Faq t={t.faq} />
        <FinalCta t={t.finalCta} form={t.form} whatsappLabel={t.hero.ctaSecondary} lang={lang} privacyHref={privacyHref} />
      </main>
      <Footer t={t.footer} nav={t.nav} waGeneric={t.form.waGeneric} privacyHref={privacyHref} navLabel={t.a11y.footerNav} />
      <FloatingActions t={t.mobileBar} exit={t.exit} waGeneric={t.form.waGeneric} label={t.a11y.quickActions} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, lang)).replace(/</g, "\\u003c") }} />
    </LeadProvider>
  );
}
