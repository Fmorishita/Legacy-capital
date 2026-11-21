"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react";

/** "Casas frente al *Pacífico.*" -> el texto entre asteriscos va en cursiva dorada. */
export function Em({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

/**
 * Número que cuenta desde cero la primera vez que se ve. El HTML del servidor ya trae la cifra final
 * (buscadores, lectores de pantalla y movimiento reducido la leen tal cual).
 */
export function CountUp({
  value,
  format = (n: number) => Math.round(n).toLocaleString("es-MX"),
  duration = 1.4,
  delay = 0,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce || done.current) return;
    done.current = true;
    let raf = 0;
    const t0 = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const k = Math.min(1, Math.max(0, (now - t0) / (duration * 1000)));
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(value * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = format(0);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = format(value);
    };
  }, [inView, reduce, value, format, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

/** "— 03 · Acceso controlado" */
export function Eyebrow({ num, children, className = "" }: { num?: number; children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      {num ? <span className="tabular-nums">{String(num).padStart(2, "0")} ·</span> : null}
      {children}
    </p>
  );
}

/**
 * Video silencioso en bucle que solo se descarga y reproduce cuando está cerca de la pantalla.
 * Con movimiento reducido se queda en el póster y muestra un botón para reproducirlo.
 */
export function LazyVideo({
  src,
  poster,
  label,
  className = "",
  controls,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  controls?: { play: string; pause: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: "300px 0px" });
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (near && !loaded) setLoaded(true);
  }, [near, loaded]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !loaded) return;
    if (visible && !reduce && !userPaused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [visible, loaded, reduce, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (!loaded) setLoaded(true);
    if (v.paused) {
      setUserPaused(false);
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={className}
        src={loaded ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      {controls && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? controls.pause : controls.play}
          className="absolute bottom-3 left-3 z-10 grid size-10 place-items-center rounded-full border border-white/40 bg-navy-950/45 text-white backdrop-blur-md transition hover:bg-navy-950/70"
        >
          {playing ? <Pause className="size-4" weight="fill" aria-hidden /> : <Play className="size-4" weight="fill" aria-hidden />}
        </button>
      )}
    </>
  );
}
