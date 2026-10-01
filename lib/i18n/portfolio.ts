// Portafolio de Legacy Capital: datos compartidos por el menú "Proyectos" del encabezado, el menú móvil,
// el pie de página, la página principal y las tarjetas cruzadas entre proyectos.
// Ningún proyecto se presenta con su nombre comercial ni el de su desarrollador.

import type { Lang } from "@/lib/site";
import { routes, type ProjectId } from "@/lib/projects";

export type PortfolioItem = {
  id: ProjectId;
  status: string;
  name: string;
  /** Nombre corto para tarjetas pequeñas */
  short: string;
  place: string;
  summary: string;
  price: string;
  priceNote: string;
  href: string;
  image: string;
  imageAlt: string;
  cta: string;
  /** Para qué sirve cada camino, en palabras del cliente */
  goal: string;
  highlights: string[];
};

export type PortfolioCopy = {
  title: string;
  switcherLabel: string;
  /** Menú "Proyectos" del encabezado */
  menu: { current: string; view: string; compare: string };
  items: [PortfolioItem, PortfolioItem];
};

const es: PortfolioCopy = {
  title: "Proyectos",
  switcherLabel: "Proyectos de Legacy Capital",
  menu: { current: "Estás aquí", view: "Ver proyecto", compare: "¿No sabes cuál te conviene? Compáralos" },
  items: [
    {
      id: "preventa",
      status: "Preventa",
      name: "Casas con roof garden y vista al mar",
      short: "Casas con vista al mar",
      place: "El Sauzal, Ensenada",
      summary: "Casas de un nivel con roof garden frente al Pacífico, para segunda casa o renta vacacional.",
      price: "Desde $3.9 MDP",
      priceNote: "Enganche en 19 meses",
      href: routes.preventa.es,
      image: "/img/hero-roof.jpg",
      imageAlt: "Roof garden con pérgola frente al mar del Pacífico al atardecer",
      cta: "Ver la preventa",
      goal: "Invertir o tener tu casa frente al mar",
      highlights: [
        "Casas de un nivel de 2 y 3 recámaras",
        "Hasta 75 m² de roof garden con pérgola y asador",
        "20% de enganche diferido; 80% a la escritura",
        "12.33% anual estimado en renta vacacional",
      ],
    },
    {
      id: "vinedos",
      status: "Entrega inmediata",
      name: "Departamentos y casas listos para estrenar",
      short: "Listos para estrenar",
      place: "El Sauzal, a 10 min del Valle de Guadalupe",
      summary: "Departamentos, penthouses y casas terminados en una comunidad con casa club y alberca.",
      price: "Desde $3.64 MDP",
      priceNote: "Crédito, Infonavit o contado",
      href: routes.vinedos.es,
      image: "/img/vdm/pool-pergola.jpg",
      imageAlt: "Alberca con pérgola y casa club de la comunidad",
      cta: "Ver entrega inmediata",
      goal: "Estrenar ya, con crédito o Infonavit",
      highlights: [
        "Del departamento de 2 recámaras a la casa con roof top",
        "Casa club con alberca, fogatero y áreas verdes",
        "450 familias ya viven en la comunidad",
        "Lo recorres terminado y lo estrenas al escriturar",
      ],
    },
  ],
};

const en: PortfolioCopy = {
  title: "Projects",
  switcherLabel: "Legacy Capital projects",
  menu: { current: "You're here", view: "See project", compare: "Not sure which fits you? Compare them" },
  items: [
    {
      id: "preventa",
      status: "Pre-sale",
      name: "Roof garden homes with ocean views",
      short: "Ocean-view homes",
      place: "El Sauzal, Ensenada",
      summary: "Single-level homes with a private roof garden facing the Pacific, for a second home or vacation rental.",
      price: "From MXN $3.9M",
      priceNote: "Down payment over 19 months",
      href: routes.preventa.en,
      image: "/img/hero-roof.jpg",
      imageAlt: "Roof garden with pergola facing the Pacific at sunset",
      cta: "See the pre-sale",
      goal: "Invest in or own a home by the ocean",
      highlights: [
        "Single-level 2 and 3 bedroom homes",
        "Up to 75 m² of roof garden with pergola and grill",
        "20% deferred down payment; 80% at closing",
        "12.33% estimated annual vacation rental return",
      ],
    },
    {
      id: "vinedos",
      status: "Move-in ready",
      name: "Move-in ready condos and homes",
      short: "Move-in ready",
      place: "El Sauzal, 10 min from Valle de Guadalupe",
      summary: "Finished condos, penthouses and homes in a community with a clubhouse and pool.",
      price: "From MXN $3.64M",
      priceNote: "Mortgage, Infonavit or cash",
      href: routes.vinedos.en,
      image: "/img/vdm/pool-pergola.jpg",
      imageAlt: "Pool with pergola and clubhouse in the community",
      cta: "See move-in ready",
      goal: "Move in now, with a mortgage or Infonavit",
      highlights: [
        "From a 2-bedroom condo to a home with a rooftop",
        "Clubhouse with pool, fire pit and green areas",
        "450 families already live in the community",
        "Tour it finished and move in at closing",
      ],
    },
  ],
};

export const portfolio: Record<Lang, PortfolioCopy> = { es, en };
