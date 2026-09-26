"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Props = {
  value: number;
  format?: (n: number) => string;
  className?: string;
  /** Si es true, anima de 0 al valor la primera vez que entra en pantalla */
  fromZero?: boolean;
  duration?: number;
};

/** Números que se actualizan sin re-render de React (motion value -> textContent). */
export function AnimatedNumber({ value, format = (n) => String(Math.round(n)), className, fromZero, duration = 0.9 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef<number | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (fromZero && !inView) return;
    const start = prev.current ?? (fromZero ? 0 : value);
    prev.current = value;
    if (reduce || start === value) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(start, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, inView, fromZero, reduce, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format(fromZero ? 0 : value)}
    </span>
  );
}
