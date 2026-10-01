import type { Lang } from "@/lib/site";

// Portafolio de Legacy Capital. La preventa no publica su nombre comercial ni el del desarrollador;
// Viñedos del Mar se presenta por su nombre (producto terminado que el cliente puede recorrer), sin
// mencionar al desarrollador.

export type ProjectId = "preventa" | "vinedos";
/** Valor que se guarda en leads.proyecto */
export type LeadProject = ProjectId | "general";

export const routes = {
  home: { es: "/", en: "/en" },
  preventa: { es: "/preventa", en: "/en/presale" },
  vinedos: { es: "/vinedos-del-mar", en: "/en/vinedos-del-mar" },
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
