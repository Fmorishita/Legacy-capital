"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

export function Included({ t }: { t: Dict["included"] }) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
          <button type="button" onClick={() => scroll(-1)} aria-label={t.prev} className="grid size-12 place-items-center rounded-full border border-line-strong transition hover:border-ink">
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={t.next} className="grid size-12 place-items-center rounded-full border border-line-strong transition hover:border-ink">
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-px-5 px-5 pb-2 md:scroll-px-8 md:px-8 lg:scroll-px-[max(2rem,calc((100vw_-_1320px)/2_+_2rem))] lg:px-[max(2rem,calc((100vw_-_1320px)/2_+_2rem))]"
      >
        {t.items.map((item, i) => (
          <li key={item.title} className="w-[78%] shrink-0 snap-start xs:w-[62%] sm:w-[44%] lg:w-[30%] xl:w-[26%]">
            <Reveal delay={Math.min(i, 3) * 0.08}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 78vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-soft">{item.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
