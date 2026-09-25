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
    // Coloca un retrato en /public/img/fran-morishita.jpg y cambia a true
    hasPhoto: false,
  },
  // Testimonio de Gus Marcos (copia comprimida del video publicado en el sitio de Fran)
  testimonialVideo: "/video/testimonio-gus-marcos.mp4",
  testimonialPoster: "/video/testimonio-gus-marcos-poster.jpg",
  // Promoción real del brochure (sept. 2026): 5% al apartar, primeras 10 casas
  promoEndsAt: "2026-09-30T23:59:59-07:00",
  // Sembrado oficial del desarrollador
  inventoryUpdatedAt: "2026-09-14",
} as const;

export function waLink(message: string) {
  return `https://wa.me/${site.advisor.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Lang = "es" | "en";
