"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

const INTERVAL = 3000;
// Tras una interacción manual, el carrusel espera antes de retomar el avance automático
const RESUME_AFTER = 7000;

export function Included({ t, label }: { t: Dict["included"]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const lastTouch = useRef(0);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [hold, setHold] = useState(false);
  const n = t.items.length;

  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const metrics = useCallback(() => {
    const el = track.current!;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const cards = Array.from(el.children) as HTMLElement[];
    return { el, pad, cards, max: el.scrollWidth - el.clientWidth };
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const { el, pad, cards } = metrics();
      const card = cards[(i + n) % n];
      if (card) el.scrollTo({ left: card.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
    },
    [metrics, n, reduce],
  );

  const onScroll = () => {
    const { el, pad, cards, max } = metrics();
    if (el.scrollLeft >= max - 4) return setIndex(n - 1);
    let best = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - pad - el.scrollLeft) < Math.abs(cards[best].offsetLeft - pad - el.scrollLeft)) best = i;
    });
    setIndex(best);
  };

  const manual = () => {
    lastTouch.current = Date.now();
  };

  useEffect(() => {
    if (!playing || !inView || hold) return;
    const id = window.setInterval(() => {
      if (document.hidden || Date.now() - lastTouch.current < RESUME_AFTER) return;
      const { el, max } = metrics();
      // Al llegar al final (en escritorio se ven varias tarjetas a la vez) vuelve al inicio
      goTo(el.scrollLeft >= max - 4 ? 0 : index + 1);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [playing, inView, hold, index, goTo, metrics]);

  const step = (dir: 1 | -1) => {
    manual();
    goTo(index + dir);
  };

  const running = playing && inView && !hold;

  return (
    <section aria-labelledby="included-title" className="overflow-hidden py-24 md:py-36">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <Reveal className="max-w-2xl">
          <h2 id="included-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 text-lg text-ink-soft">{t.body}</p>
        </Reveal>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t.prev}
            className="grid size-12 place-items-center rounded-full border border-line-strong transition hover:border-ink"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t.next}
            className="grid size-12 place-items-center rounded-full border border-line-strong transition hover:border-ink"
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocusCapture={() => setHold(true)}
        onBlurCapture={() => setHold(false)}
      >
        <Reveal amount={0.15}>
          <ul
            ref={track}
            onScroll={onScroll}
            onPointerDown={manual}
            onWheel={manual}
            onTouchStart={manual}
            className="no-scrollbar relative mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 md:scroll-px-8 md:px-8 lg:scroll-px-[max(2rem,calc((100vw_-_1320px)/2_+_2rem))] lg:px-[max(2rem,calc((100vw_-_1320px)/2_+_2rem))]"
          >
            {t.items.map((item, i) => (
              <li
                key={item.title}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${n}`}
                className="w-[80%] shrink-0 snap-start xs:w-[74%] sm:w-[44%] lg:w-[30%] xl:w-[26%]"
              >
                <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 80vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="container-x mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? t.pause : t.play}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition hover:border-ink"
            >
              {playing ? <Pause className="size-4" weight="fill" aria-hidden /> : <Play className="size-4" weight="fill" aria-hidden />}
            </button>
            <div className="flex flex-1 gap-2">
              {t.items.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    manual();
                    goTo(i);
                  }}
                  aria-label={t.goTo.replace("{title}", item.title)}
                  aria-current={index === i ? "true" : undefined}
                  className="group flex h-8 flex-1 items-center"
                >
                  <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-line-strong/60">
                    {index === i && (
                      <span
                        key={`${i}-${running}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-gold-500"
                        style={running ? { animation: `slide-progress ${INTERVAL}ms linear forwards` } : { width: "100%" }}
                      />
                    )}
                    {index > i && <span className="absolute inset-0 rounded-full bg-ink/35" />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
