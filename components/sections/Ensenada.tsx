import Image from "next/image";
import { MapPin, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Dict } from "@/lib/i18n/es";
import { Reveal, HorizonLine } from "@/components/ui/Reveal";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=El+Sauzal+de+Rodr%C3%ADguez%2C+Ensenada%2C+Baja+California";

export function Ensenada({ t }: { t: Dict["ensenada"] }) {
  return (
    <section id="ensenada" aria-labelledby="ens-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <h2 id="ens-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[50ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <div className="relative mt-16">
          <HorizonLine className="absolute left-0 right-0 top-[0.55rem] hidden md:block" delay={0.1} />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {t.moments.map((m, i) => (
              <Reveal as="li" key={m.title} delay={0.1 + i * 0.12}>
                <span className="relative z-10 inline-flex items-center gap-3 bg-bg pr-4">
                  <span className="size-[1.1rem] rounded-full border-2 border-gold bg-bg" aria-hidden />
                  <span className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-ink">{m.time}</span>
                </span>
                <div className={`relative mt-6 aspect-[4/5] overflow-hidden rounded-2xl bg-bg-alt ${i === 1 ? "md:mt-16" : i === 2 ? "md:mt-28" : ""}`}>
                  <Image src={m.image} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <h3 className="display mt-5 text-[1.9rem] leading-tight">{m.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-24 grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="relative aspect-[16/11] overflow-hidden rounded-2xl">
            <Image src="/img/ensenada-map.jpg" alt={t.mapAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="display text-[2.1rem] leading-tight">{t.nearbyTitle}</h3>
            <p className="mt-3 flex items-start gap-2 text-ink-soft">
              <MapPin className="mt-1 size-4 shrink-0 text-gold-ink" weight="fill" aria-hidden />
              {t.location}
            </p>
            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {t.nearby.map((n) => (
                <li key={n} className="flex items-center gap-2.5 text-[0.95rem]">
                  <span className="h-px w-4 bg-gold" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8">
              {t.mapCta}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
