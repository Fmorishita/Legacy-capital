"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, SpeakerHigh, ArrowCounterClockwise } from "@phosphor-icons/react";
import { trackEvent } from "@/lib/track";

type Props = {
  src: string;
  poster: string;
  captions: string;
  label: string;
  persona: string;
  /** Segundo a partir del cual se resalta el botón de agenda (llamado a la acción del video) */
  ctaAt?: number;
  onCtaTime?: () => void;
};

const MILESTONES = [25, 50, 75, 95] as const;

/**
 * Reproductor vertical del VSL. Arranca en silencio con subtítulos (autoplay permitido en celular) y
 * un aviso grande de "Toca para escuchar": al tocarlo vuelve al inicio con sonido. Mide 25/50/75/95 %
 * (Vercel, GA y, al 50 %, ViewContent del píxel para armar el público de retargeting).
 */
export function VslPlayer({ src, poster, captions, label, persona, ctaAt, onCtaTime }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [cues, setCues] = useState<{ start: number; end: number; text: string }[]>([]);
  const [caption, setCaption] = useState("");
  const sent = useRef(new Set<number>());
  const ctaFired = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  // Subtítulos propios (el VSL se ve mucho sin audio y así se ven igual en iPhone y Android)
  useEffect(() => {
    let alive = true;
    fetch(captions)
      .then((r) => r.text())
      .then((txt) => alive && setCues(parseVtt(txt)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [captions]);

  const onTime = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgress(pct);
    const cue = cues.find((c) => v.currentTime >= c.start && v.currentTime <= c.end);
    setCaption(cue ? cue.text : "");
    if (!unmuted) return; // solo medimos la vista con sonido, la que cuenta
    for (const m of MILESTONES) {
      if (pct >= m && !sent.current.has(m)) {
        sent.current.add(m);
        trackEvent("vsl_progress", { persona, pct: m });
      }
    }
    if (ctaAt !== undefined && v.currentTime >= ctaAt && !ctaFired.current) {
      ctaFired.current = true;
      onCtaTime?.();
    }
  };

  const listen = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setUnmuted(true);
    setEnded(false);
    v.play().catch(() => {});
    trackEvent("vsl_play", { persona });
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (!unmuted) return listen();
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-[22px] bg-navy-950 shadow-[0_30px_80px_-30px_rgb(10_26_46/0.75)] ring-1 ring-black/10">
      <video
        ref={ref}
        className="vsl-video block aspect-[9/16] w-full object-cover"
        poster={poster}
        playsInline
        muted
        loop={!unmuted}
        preload="auto"
        aria-label={label}
        onTimeUpdate={onTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setEnded(true);
          trackEvent("vsl_complete", { persona });
        }}
        onClick={toggle}
      >
        <source src={src} type="video/mp4" />
      </video>

      {caption && (
        <p aria-hidden className="pointer-events-none absolute inset-x-4 bottom-[30%] text-center">
          <span className="box-decoration-clone rounded-lg bg-navy-950/80 px-2.5 py-1 text-[1.05rem] font-semibold leading-[1.6] text-white">
            {caption}
          </span>
        </p>
      )}

      {!unmuted && (
        <button
          type="button"
          onClick={listen}
          className="absolute inset-0 grid place-items-center bg-navy-950/25 text-white"
          aria-label="Reproducir el video con sonido"
        >
          <span className="vsl-listen flex flex-col items-center gap-2 rounded-2xl bg-navy-950/85 px-6 py-5 backdrop-blur-md">
            <span className="grid size-14 place-items-center rounded-full bg-[#c5a564] text-navy-950 shadow-[0_0_0_8px_rgb(197_165_100/0.25)]">
              <SpeakerHigh className="size-7" weight="fill" aria-hidden />
            </span>
            <span className="text-[0.95rem] font-semibold">Toca para escuchar</span>
            <span className="text-[0.72rem] text-white/70">El video ya empezó sin sonido</span>
          </span>
        </button>
      )}

      {unmuted && ended && (
        <button
          type="button"
          onClick={listen}
          className="absolute inset-x-0 top-4 mx-auto flex w-max items-center gap-2 rounded-full bg-navy-950/80 px-4 py-2 text-sm text-white backdrop-blur"
        >
          <ArrowCounterClockwise className="size-4" aria-hidden /> Ver de nuevo
        </button>
      )}

      {unmuted && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="absolute bottom-4 left-3 z-10 grid size-10 place-items-center rounded-full border border-white/40 bg-navy-950/45 text-white backdrop-blur-md"
        >
          {playing ? <Pause className="size-4" weight="fill" aria-hidden /> : <Play className="size-4" weight="fill" aria-hidden />}
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/15" aria-hidden>
        <div className="h-full bg-[#c5a564] transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function toSec(t: string) {
  const [h, m, rest] = t.trim().split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(rest);
}

/** WEBVTT mínimo: "00:00:01.360 --> 00:00:02.360" seguido del texto. */
function parseVtt(txt: string) {
  return txt
    .split(/\n\s*\n/)
    .map((b) => b.trim().split("\n"))
    .filter((l) => l[0]?.includes("-->"))
    .map((l) => {
      const [a, b] = l[0].split("-->");
      return { start: toSec(a), end: toSec(b), text: l.slice(1).join(" ") };
    });
}
