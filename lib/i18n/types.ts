// Formas compartidas por las páginas del portafolio (principal, preventa y Viñedos del Mar).

export type NavCopy = {
  links: { href: string; label: string }[];
  cta: string;
  switchLang: { label: string; href: string; short: string };
  advisors: { label: string; href: string };
};

export type FaqCopy = { title: string; items: { q: string; a: string }[] };

export type FinalCtaCopy = { title: string; body: string; formTitle: string; imageAlt: string };
