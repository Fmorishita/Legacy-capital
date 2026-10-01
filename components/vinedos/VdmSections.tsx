import Image from "next/image";
import {
  ArrowUpRight,
  Bank,
  Buildings,
  Campfire,
  ChartLineUp,
  Eye,
  GlobeHemisphereWest,
  Key,
  MapPin,
  PawPrint,
  ShieldCheck,
  SunHorizon,
  SwimmingPool,
  Tree,
  Balloon,
  UsersThree,
  Wine,
} from "@phosphor-icons/react/dist/ssr";
import type { VdmCopy } from "@/lib/i18n/vinedos";
import { vdmMapsUrl } from "@/lib/i18n/vinedos";
import { Reveal, HorizonLine } from "@/components/ui/Reveal";
import { InViewVideo } from "@/components/ui/InViewVideo";
import { VdmAudienceCta } from "./VdmClient";

// ---------------------------------------------------------------- Entrega inmediata

const pillarIcons = { eye: Eye, bank: Bank, key: Key } as const;

export function VdmImmediate({ t }: { t: VdmCopy["immediate"] }) {
  return (
    <section id="entrega" aria-labelledby="vdm-now-title" className="py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image src="/img/vdm/rooftop-house.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[55%_50%]" />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-line bg-surface/95 p-5 shadow-xl backdrop-blur sm:left-auto sm:w-[19rem]">
            <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-vine-ink">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-vine-400 opacity-60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-vine-400" />
              </span>
              {t.eyebrow}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t.timing}</p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="vdm-now-title" className="display mt-4 max-w-[18ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
          </Reveal>
          <ol className="mt-10 grid gap-8">
            {t.pillars.map((p, i) => {
              const Icon = pillarIcons[p.icon];
              return (
                <Reveal as="li" key={p.title} delay={0.08 * i} className="flex gap-5 border-t border-line pt-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-vine-soft text-vine-ink">
                    <Icon className="size-6" weight="duotone" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xl font-semibold">{p.title}</span>
                    <span className="mt-1.5 block leading-relaxed text-ink-soft">{p.text}</span>
                  </span>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Así se ve hoy

export function VdmTour({ t }: { t: VdmCopy["tour"] }) {
  return (
    <section id="galeria" aria-labelledby="vdm-tour-title" className="bg-navy-950 py-24 text-cream-100 md:py-36">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 id="vdm-tour-title" className="display text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-cream-100/75">{t.body}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2">
          <Reveal className="md:col-span-2 md:row-span-2">
            <InViewVideo
              src="/video/vdm-recorrido.mp4"
              poster="/video/vdm-recorrido-poster.jpg"
              label={t.play}
              pauseLabel={t.pause}
              className="aspect-[16/10] w-full rounded-2xl md:aspect-auto md:h-full md:min-h-[18rem]"
            />
          </Reveal>
          {t.tiles.map((tile, i) => (
            <Reveal key={tile.image} delay={0.06 * (i + 1)} className="group relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:min-h-[13rem]">
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 to-transparent p-4 pt-14">
                <p className="text-sm font-semibold">{tile.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Amenidades

const amenityIcons = {
  pool: SwimmingPool,
  club: Buildings,
  fire: Campfire,
  park: Tree,
  kids: Balloon,
  pet: PawPrint,
  rooftop: SunHorizon,
  gate: ShieldCheck,
} as const;

export function VdmAmenities({ t }: { t: VdmCopy["amenities"] }) {
  return (
    <section id="amenidades" aria-labelledby="vdm-amen-title" className="py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[5/6]">
          <Image src="/img/vdm/pool-dusk.jpg" alt={t.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-6 pt-20">
            <p className="flex items-center gap-2 text-sm font-semibold text-cream-100">
              <ShieldCheck className="size-5 text-gold-400" weight="duotone" aria-hidden />
              {t.note}
            </p>
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="vdm-amen-title" className="display mt-4 max-w-[15ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {t.items.map((a, i) => {
              const Icon = amenityIcons[a.icon as keyof typeof amenityIcons] ?? Buildings;
              return (
                <Reveal as="li" key={a.label} delay={0.04 * i} className="flex items-center gap-3 bg-bg p-5">
                  <Icon className="size-7 shrink-0 text-gold-ink" weight="light" aria-hidden />
                  <span className="font-medium">{a.label}</span>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Para quién es

const audienceIcons = { family: UsersThree, wine: Wine, chart: ChartLineUp, globe: GlobeHemisphereWest } as const;

export function VdmAudience({ t }: { t: VdmCopy["audience"] }) {
  return (
    <section id="para-ti" aria-labelledby="vdm-aud-title" className="bg-bg-alt py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="vdm-aud-title" className="display mt-4 max-w-[18ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
          </div>
          <VdmAudienceCta label={t.cta} />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((it, i) => {
            const Icon = audienceIcons[it.icon];
            return (
              <Reveal as="li" key={it.title} delay={0.07 * i} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                <Icon className="size-9 text-gold-ink" weight="light" aria-hidden />
                <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{it.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Ubicación

export function VdmLocation({ t }: { t: VdmCopy["location"] }) {
  return (
    <section id="ubicacion" aria-labelledby="vdm-loc-title" className="py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="vdm-loc-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>

        <div className="relative mt-14">
          <HorizonLine className="absolute left-0 right-0 top-[0.55rem] hidden md:block" delay={0.1} />
          <ol className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {t.times.map((x, i) => (
              <Reveal as="li" key={x.place} delay={0.08 * i}>
                <span className="relative z-10 hidden size-[1.1rem] rounded-full border-2 border-gold bg-bg md:block" aria-hidden />
                <p className="mt-0 md:mt-6">
                  <span className="display text-[3.4rem] leading-none tabular-nums md:text-[4rem]">{x.value}</span>
                  <span className="ml-1.5 text-lg font-semibold text-ink-soft">{x.unit}</span>
                </p>
                <p className="mt-2 max-w-[18ch] leading-snug text-ink-soft">{x.place}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="relative">
            <InViewVideo
              src="/video/vdm-vinedo.mp4"
              poster="/video/vdm-vinedo-poster.jpg"
              label={t.videoAlt}
              pauseLabel={t.videoAlt}
              className="aspect-[16/10] rounded-2xl"
            />
            <p className="pointer-events-none absolute right-4 top-4 rounded-full bg-navy-950/55 px-3 py-1.5 text-xs font-semibold text-cream-100 backdrop-blur-md">
              {t.caption}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="display text-[2.1rem] leading-tight">{t.nearbyTitle}</h3>
            <p className="mt-3 flex items-start gap-2 text-ink-soft">
              <MapPin className="mt-1 size-4 shrink-0 text-gold-ink" weight="fill" aria-hidden />
              {t.address}
            </p>
            <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {t.nearby.map((n) => (
                <li key={n} className="flex items-center gap-2.5 text-[0.95rem]">
                  <span className="h-px w-4 bg-gold" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
            <a href={vdmMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8">
              {t.mapCta}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
