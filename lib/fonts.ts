import { Cinzel, Jost, Playfair_Display } from "next/font/google";

// Mismo sistema tipográfico de la landing de la preventa: Playfair Display para titulares
// (con cursivas doradas) y Jost para texto. Cinzel solo para el wordmark de Legacy Capital.
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

export const fontVars = `${playfair.variable} ${jost.variable} ${cinzel.variable}`;
