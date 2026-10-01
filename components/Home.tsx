import type { HomeCopy } from "@/lib/i18n/home";
import { portfolio } from "@/lib/i18n/portfolio";
import { site, type Lang } from "@/lib/site";
import { href } from "@/lib/projects";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { Header } from "@/components/sections/Header";
import { Facts } from "@/components/sections/Facts";
import { Advisor } from "@/components/sections/Advisor";
import { Trust } from "@/components/sections/Trust";
import { Ensenada } from "@/components/sections/Ensenada";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { FloatingActions } from "@/components/sections/FloatingActions";
import { HomeHero } from "@/components/home/HomeHero";
import { Compare } from "@/components/home/Compare";
import { Showcase } from "@/components/home/Showcase";

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

/** Página principal: el portafolio de Legacy Capital con sus dos proyectos. */
export function Home({ t, lang }: { t: HomeCopy; lang: Lang }) {
  const privacyHref = href("privacy", lang);
  const p = portfolio[lang];

  return (
    <LeadProvider t={{ form: t.form, dialog: t.dialog, a11y: t.a11y, quickForm: t.quickForm }} lang={lang} privacyHref={privacyHref}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bg"
      >
        {t.a11y.skip}
      </a>
      <Header t={{ nav: t.nav, a11y: t.a11y }} homeHref={href("home", lang)} portfolio={p} ctaKind="visit" />
      <main id="contenido">
        <HomeHero t={t.hero} portfolio={p} />
        <Facts t={t.facts} label={t.a11y.facts} />
        <Compare t={t.compare} portfolio={p} />
        <Showcase t={t.showcase} portfolio={p} />
        <Advisor t={t.advisor} waGeneric={t.form.waGeneric} />
        <Trust t={t.trust} />
        <Ensenada t={t.ensenada} />
        <Faq t={t.faq} />
        <FinalCta t={t.finalCta} form={t.form} whatsappLabel={t.advisor.ctaWhatsapp} lang={lang} privacyHref={privacyHref} />
      </main>
      <Footer t={t.footer} nav={t.nav} waGeneric={t.form.waGeneric} privacyHref={privacyHref} navLabel={t.a11y.footerNav} portfolio={p} />
      <FloatingActions t={t.mobileBar} exit={t.exit} waGeneric={t.form.waGeneric} label={t.a11y.quickActions} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, lang)).replace(/</g, "\\u003c") }} />
    </LeadProvider>
  );
}
