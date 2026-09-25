"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

function ReelVideo({ label, pauseLabel }: { label: string; pauseLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduce && !userPaused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
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
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative h-full min-h-[26rem] overflow-hidden rounded-2xl bg-navy-950">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/estilo-de-vida.mp4"
        poster="/video/estilo-de-vida-poster.jpg"
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

export function Lifestyle({ t }: { t: Dict["lifestyle"] }) {
  const [a, b, c, d] = t.tiles;
  const Tile = ({ tile, className, sizes }: { tile: typeof a; className: string; sizes: string }) => (
    <figure className={`flex flex-col ${className}`}>
      <div className="relative min-h-[14rem] flex-1 overflow-hidden rounded-2xl bg-bg-alt">
        <Image src={tile.image} alt={tile.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-3 text-sm text-ink-soft">{tile.caption}</figcaption>
    </figure>
  );

  return (
    <section aria-labelledby="life-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x grid gap-5 lg:grid-cols-12 lg:grid-rows-[minmax(20rem,auto)_19rem_19rem]">
        <Reveal className="flex flex-col justify-end pb-4 lg:col-span-5 lg:pr-8">
          <h2 id="life-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-7">
          <Tile tile={a} className="h-full" sizes="(min-width: 1024px) 58vw, 100vw" />
        </Reveal>
        <Reveal delay={0.05} className="aspect-[4/5] sm:aspect-[3/4] lg:col-span-4 lg:row-span-2 lg:aspect-auto">
          <ReelVideo label={t.videoLabel} pauseLabel={t.pause} />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <Tile tile={b} className="h-full" sizes="(min-width: 1024px) 66vw, 100vw" />
        </Reveal>
        <div className="grid grid-cols-2 gap-5 lg:col-span-8">
          <Reveal delay={0.12}>
            <Tile tile={c} className="h-full" sizes="(min-width: 1024px) 33vw, 50vw" />
          </Reveal>
          <Reveal delay={0.16}>
            <Tile tile={d} className="h-full" sizes="(min-width: 1024px) 33vw, 50vw" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
