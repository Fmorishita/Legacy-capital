"use client";

import Image from "next/image";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

// Cuadrícula en vez de carrusel: todo el equipamiento se ve de un vistazo, sin esperar ni deslizar.
export function Included({ t }: { t: Dict["included"] }) {
  return (
    <section aria-labelledby="included-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 id="included-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-5 text-lg text-ink-soft">{t.body}</p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-3 lg:gap-y-12">
          {t.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 3) * 0.08} amount={0.15}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt sm:aspect-[5/4]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </div>
              <h3 className="mt-4 font-semibold leading-snug md:text-lg">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft md:text-base">{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
