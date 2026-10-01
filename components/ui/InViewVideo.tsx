"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react";

type Props = {
  src: string;
  poster: string;
  label: string;
  pauseLabel: string;
  className?: string;
};

/** Video silencioso en bucle que solo se descarga y reproduce mientras está a la vista. */
export function InViewVideo({ src, poster, label, pauseLabel, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduce && !userPaused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [inView, reduce, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
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
    <div className={`relative overflow-hidden bg-navy-950 ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : label}
        className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full border border-cream-100/40 bg-navy-950/45 text-cream-100 backdrop-blur-md transition hover:bg-navy-950/70"
      >
        {playing ? <Pause className="size-5" weight="fill" aria-hidden /> : <Play className="size-5" weight="fill" aria-hidden />}
      </button>
    </div>
  );
}
