import type { Lang } from "@/lib/site";

/**
 * Precios de lista de la preventa (noviembre 2026, MXN) y conversión de referencia a dólares.
 * En inglés los montos se muestran en USD a 18.5 MXN por dólar: el modelo de 2 recámaras queda
 * en $215K USD, la cifra que se usa en la portada. Los contratos se firman en pesos.
 */
export const LIST_PRICE = { "2R": 3_989_325, "3R": 4_360_053 } as const;
export type Model = keyof typeof LIST_PRICE;
export const USD_RATE = 18.5;

/** Precio base del modelo de renta usado en la proyección de plusvalía (MXN). */
export const BASE_VALUE = 4_570_545;

/** Proyección de plusvalía: meses desde hoy y valor en millones de MXN (conservador 8% y optimista 10% anual). */
export const APPRECIATION = {
  months: [0, 25, 60, 96],
  years: ["2026", "2028", "2031", "2034"],
  cons: [4.57, 5.37, 6.72, 8.46],
  opt: [4.57, 5.57, 7.36, 9.8],
} as const;

const halfDown = (v: number) => Math.round(v - 1e-7);

/** Esquema 10 · 10 · 80: enganche a la firma, 20 mensualidades durante la obra y 80% contra entrega. */
export const bridge = {
  down: (p: number) => halfDown(p * 0.1),
  monthly: (p: number) => Math.round((p * 0.1) / 20),
  delivery: (p: number) => halfDown(p * 0.8),
};

/** Contado diferido: 5% de descuento, 40% de enganche, 40% en 19 meses y 20% a la escritura. */
export const cash = {
  final: (p: number) => Math.round(p * 0.95),
  down: (p: number) => Math.round(Math.round(p * 0.95) * 0.4),
  monthly: (p: number) => Math.floor(Math.round(Math.round(p * 0.95) * 0.4) / 19),
  deed: (p: number) => Math.round(Math.round(p * 0.95) * 0.2),
};

/** Monto en la moneda del idioma: pesos en español, dólares (aprox.) en inglés. */
export function inCurrency(mxn: number, lang: Lang) {
  return lang === "en" ? Math.round(mxn / USD_RATE) : mxn;
}

export function money(n: number, lang: Lang) {
  return `$${Math.round(n).toLocaleString(lang === "en" ? "en-US" : "es-MX")}`;
}

/** "$4.57 M" en español; "$247K" en inglés. */
export function millions(v: number, lang: Lang) {
  return lang === "en" ? `$${Math.round((v * 1e6) / USD_RATE / 1000)}K` : `$${v.toFixed(2)} M`;
}
