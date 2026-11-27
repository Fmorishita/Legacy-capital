import type { HomeCopy } from "@/lib/i18n/home";
import { portfolio } from "@/lib/i18n/portfolio";
import { showcase } from "@/lib/i18n/showcase";
import { site, waLink, type Lang } from "@/lib/site";
import { href } from "@/lib/projects";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { FloatingActions } from "@/components/sections/FloatingActions";
import { Pains } from "@/components/home/Pains";
import { VideoHero } from "@/components/showcase/VideoHero";
import { Band } from "@/components/showcase/Band";
import { AdvisorIntro } from "@/components/showcase/AdvisorIntro";
import { ScrollStory } from "@/components/showcase/ScrollStory";
import { HomesTeaser } from "@/components/showcase/Homes";
import { PaymentBridge } from "@/components/showcase/Numbers";
import { Material } from "@/components/showcase/Material";
import { Secure } from "@/components/showcase/Place";
import { Closing, Contact, FaqShowcase, MoveInTeaser } from "@/components/showcase/Closing";

function jsonLd(t: HomeCopy, lang: Lang) {
  const url = `${site.url}${href("home", lang) === "/" ? "" : href("home", lang)}`;
  const p = portfolio[lang];
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
      "@type": "ItemList",
      itemListElement: p.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}${item.href}`,
        name: item.name,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ];
}

/**
 * Portada de Legacy Capital con el lenguaje de la landing de la preventa. El 80% del recorrido es la
 * preventa con vista al mar (video, historias, modelos, pagos y material exclusivo); la entrega
 * inmediata aparece como la opción para quien necesita estrenar ya.
 */
export function Home({ t, lang }: { t: HomeCopy; lang: Lang }) {
  const privacyHref = href("privacy", lang);
  const p = portfolio[lang];
  const sc = showcase[lang];
  const waMessage = t.form.waGeneric;
  const waHref = waLink(waMessage);
  const origin = "home";

  return (
    <LeadProvider t={{ form: t.form, dialog: t.dialog, a11y: t.a11y, quickForm: t.quickForm }} lang={lang} privacyHref={privacyHref}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        {t.a11y.skip}
      </a>
      <Header t={{ nav: t.nav, a11y: t.a11y }} homeHref={href("home", lang)} portfolio={p} ctaKind="visit" waHref={waHref} />
      <main id="contenido">
        <VideoHero
          t={sc.hero}
          head={sc.homeHero}
          moveIn={{ ...sc.homeHero.moveIn, href: href("vinedos", lang) }}
          origin={origin}
        />
        <Band items={sc.band} />
        <AdvisorIntro t={sc.advisor} num={1} waMessage={waMessage} origin={origin} />
        <Pains t={t.pains} num={2} />
        <ScrollStory id="dia" num={3} t={sc.day} origin={origin} />
        <Secure t={sc.secure} num={4} ui={sc.ui} />
        <HomesTeaser t={sc.homesTeaser} homes={sc.homes} num={5} lang={lang} href={`${href("preventa", lang)}#casas`} origin={origin} />
        <Material doc="brochure" t={sc.material} form={t.form} num={6} lang={lang} privacyHref={privacyHref} origin={origin} tone="plain" />
        <ScrollStory id="camino" num={7} t={sc.path} waHref={waHref} origin={origin} />
        <PaymentBridge t={sc.pay} num={8} lang={lang} waMessage={waMessage} origin={origin} />
        <Material doc="roi" t={sc.material} form={t.form} num={9} lang={lang} privacyHref={privacyHref} origin={origin} />
        <MoveInTeaser t={sc.moveIn} num={10} href={href("vinedos", lang)} origin={origin} />
        <FaqShowcase t={{ ...sc.faq, items: t.faq.items }} />
        <Contact t={sc.contact} form={t.form} num={11} lang={lang} privacyHref={privacyHref} origin={origin} />
        <Closing t={sc.closing} waMessage={waMessage} ui={sc.ui} origin={origin} />
      </main>
      <Footer t={t.footer} nav={t.nav} waGeneric={t.form.waGeneric} privacyHref={privacyHref} navLabel={t.a11y.footerNav} portfolio={p} />
      <FloatingActions t={t.mobileBar} exit={t.exit} waGeneric={t.form.waGeneric} label={t.a11y.quickActions} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, lang)).replace(/</g, "\\u003c") }} />
    </LeadProvider>
  );
}
