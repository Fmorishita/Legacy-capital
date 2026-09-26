export const site = {
  name: "Legacy Capital Real Estate",
  shortName: "Legacy Capital",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  city: "Ensenada, Baja California",
  advisor: {
    name: "Fran Morishita",
    // Número público de WhatsApp de Fran (mismo que en franmorishita-bienesraices)
    whatsapp: "5216462563006",
    phoneDisplay: "+52 646 256 3006",
    phoneHref: "tel:+526462563006",
    // Retrato en /public/img/fran-morishita.jpg; en false se muestra el escudo de la marca
    hasPhoto: true,
  },
  // Promoción real del brochure (sept. 2026): 5% al apartar, primeras 10 casas
  promoEndsAt: "2026-09-30T23:59:59-07:00",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${site.advisor.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Lang = "es" | "en";
