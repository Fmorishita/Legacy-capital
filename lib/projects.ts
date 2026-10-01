import type { Lang } from "@/lib/site";

// Portafolio de Legacy Capital. Ningún proyecto publica su nombre comercial ni el de su desarrollador:
// se presentan como "preventa" y "entrega inmediata".

export type ProjectId = "preventa" | "vinedos";
/** Valor que se guarda en leads.proyecto */
export type LeadProject = ProjectId | "general";

export const routes = {
  home: { es: "/", en: "/en" },
  preventa: { es: "/preventa", en: "/en/presale" },
  vinedos: { es: "/entrega-inmediata", en: "/en/move-in-ready" },
  privacy: { es: "/aviso-de-privacidad", en: "/en/privacy" },
} as const;

export type RouteKey = keyof typeof routes;

export function href(key: RouteKey, lang: Lang) {
  return routes[key][lang];
}

/** Ruta equivalente en el otro idioma */
export function altHref(key: RouteKey, lang: Lang) {
  return routes[key][lang === "es" ? "en" : "es"];
}

export const projectStatus = {
  preventa: { es: "Preventa", en: "Pre-sale" },
  vinedos: { es: "Entrega inmediata", en: "Move-in ready" },
} as const;
