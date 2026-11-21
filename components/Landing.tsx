import type { Dict } from "@/lib/i18n/es";
import { site, waLink, type Lang } from "@/lib/site";
import { href } from "@/lib/projects";
import { portfolio } from "@/lib/i18n/portfolio";
import { showcase } from "@/lib/i18n/showcase";
import { LIST_PRICE } from "@/lib/money";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { Header } from "@/components/sections/Header";
import { Personas } from "@/components/sections/Personas";
import { Footer } from "@/components/sections/Footer";
import { FloatingActions } from "@/components/sections/FloatingActions";
import { VideoHero } from "@/components/showcase/VideoHero";
import { Band } from "@/components/showcase/Band";
import { AdvisorIntro } from "@/components/showcase/AdvisorIntro";
import { ScrollStory } from "@/components/showcase/ScrollStory";
import { EnsenadaPlace, LocationPlace, Secure } from "@/components/showcase/Place";
import { Homes } from "@/components/showcase/Homes";
import { AmenitiesShowcase, Equipment, InteriorTour, RoofBanner } from "@/components/showcase/Inside";
import { Appreciation, PaymentBridge } from "@/components/showcase/Numbers";
import { Material } from "@/components/showcase/Material";
import { Closing, Contact, FaqShowcase, MoveInTeaser } from "@/components/showcase/Closing";
import { plain } from "@/lib/text";

function jsonLd(t: Dict, lang: Lang) {
  const url = `${site.url}${href("preventa", lang)}`;
  const sc = showcase[lang];
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
      name: plain(sc.hero.title),
      description: t.meta.description,
      url,
      image: [`${site.url}/img/hero-roof.jpg`, `${site.url}/media/img/proto2r-render.webp`, `${site.url}/media/img/aerea-atardecer.webp`],
      address: {
        "@type": "PostalAddress",
        addressLocality: "El Sauzal de Rodríguez, Ensenada",
        addressRegion: "Baja California",
        addressCountry: "MX",
      },
      containsPlace: [
        { "@type": "SingleFamilyResidence", name: sc.homes.models["2R"].tab, numberOfRooms: 2, floorSize: { "@type": "QuantitativeValue", value: 178.06, unitCode: "MTK" } },
        { "@type": "SingleFamilyResidence", name: sc.homes.models["3R"].tab, numberOfRooms: 3, floorSize: { "@type": "QuantitativeValue", value: 195.19, unitCode: "MTK" } },
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "MXN",
        lowPrice: LIST_PRICE["2R"],
        highPrice: LIST_PRICE["3R"],
        availability: "https://schema.org/PreOrder",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: sc.faq.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    },
  ];
}

/**
 * Preventa de casas con roof garden y vista al mar (sin nombre comercial), con el mismo recorrido
 * de la landing del proyecto: video, historias al hacer scroll, modelos, pagos, plusvalía y material.
 */
export function Landing({ t, lang }: { t: Dict; lang: Lang }) {
  const privacyHref = href("privacy", lang);
  const homeHref = href("home", lang);
  const p = portfolio[lang];
  const sc = showcase[lang];
  const waMessage = t.form.waGeneric;
  const waHref = waLink(waMessage);
  const origin = "preventa";

  return (
    <LeadProvider
      t={{ form: t.form, dialog: t.dialog, a11y: t.a11y, quickForm: t.quickForm }}
      lang={lang}
      privacyHref={privacyHref}
      project="preventa"
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        {t.a11y.skip}
      </a>
      <Header t={{ nav: t.nav, promo: t.promo, a11y: t.a11y }} homeHref={homeHref} portfolio={p} active="preventa" ctaKind="visit" waHref={waHref} />
      <main id="contenido">
        <VideoHero t={sc.hero} origin={origin} />
        <Band items={sc.band} />
        <AdvisorIntro t={sc.advisor} num={1} waMessage={waMessage} origin={origin} />
        <ScrollStory id="dia" num={2} t={sc.day} origin={origin} />
        <Personas t={t.personas} label={t.a11y.personas} num={3} />
        <Secure t={sc.secure} num={4} ui={sc.ui} />
        <EnsenadaPlace t={sc.ensenada} num={5} />
        <LocationPlace t={sc.location} num={6} origin={origin} />
        <Homes t={sc.homes} num={7} lang={lang} origin={origin} />
        <InteriorTour t={sc.interior} num={8} />
        <Equipment t={sc.equipment} num={9} lang={lang} ui={sc.ui} />
        <RoofBanner t={sc.roof} num={10} origin={origin} />
        <ScrollStory id="camino" num={11} t={sc.path} waHref={waHref} origin={origin} />
        <AmenitiesShowcase t={sc.amenities} num={12} />
        <Appreciation t={sc.value} num={13} lang={lang} origin={origin} />
        <PaymentBridge t={sc.pay} num={14} lang={lang} waMessage={waMessage} origin={origin} />
        <Material t={sc.material} form={t.form} num={15} lang={lang} privacyHref={privacyHref} origin={origin} />
        <Contact t={sc.contact} form={t.form} num={16} lang={lang} privacyHref={privacyHref} origin={origin} />
        <MoveInTeaser t={sc.moveIn} href={href("vinedos", lang)} origin={origin} />
        <FaqShowcase t={sc.faq} />
        <Closing t={sc.closing} waMessage={waMessage} ui={sc.ui} origin={origin} />
      </main>
      <Footer t={t.footer} nav={t.nav} waGeneric={t.form.waGeneric} privacyHref={privacyHref} navLabel={t.a11y.footerNav} portfolio={p} />
      <FloatingActions t={t.mobileBar} exit={t.exit} waGeneric={t.form.waGeneric} label={t.a11y.quickActions} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, lang)).replace(/</g, "\\u003c") }} />
    </LeadProvider>
  );
}
