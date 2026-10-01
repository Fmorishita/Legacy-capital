"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  as?: "div" | "li" | "article";
};

/** Entrada al hacer scroll: comunica jerarquía y orden de lectura. */
export function Reveal({ children, className, delay = 0, y = 28, amount = 0.25, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Línea dorada que se dibuja: el "horizonte" que atraviesa el sitio. */
export function HorizonLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-gold ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
