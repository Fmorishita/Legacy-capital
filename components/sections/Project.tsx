import Image from "next/image";
import { HouseLine, Waves, TrendUp, SealCheck } from "@phosphor-icons/react/dist/ssr";
import type { Dict } from "@/lib/i18n/es";
import { Reveal, HorizonLine } from "@/components/ui/Reveal";

const icons = { house: HouseLine, waves: Waves, trend: TrendUp } as const;

export function Project({ t }: { t: Dict["project"] }) {
  return (
    <section id="proyecto" className="relative overflow-hidden py-24 md:py-36">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <Reveal className="relative pb-16 sm:pb-24 lg:pb-28">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
            <Image
              src="/img/aerial-homes.jpg"
              alt={t.imageAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 right-4 w-[42%] overflow-hidden rounded-2xl border-[6px] border-bg shadow-[0_30px_60px_-30px_rgb(var(--shadow)/0.6)] sm:right-8 lg:-right-10">
            <div className="relative aspect-[4/5]">
              <Image src="/img/family-walk.jpg" alt={t.image2Alt} fill sizes="(min-width: 1024px) 22vw, 42vw" className="object-cover" />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="display text-[2.6rem] leading-[1.04] md:text-6xl">{t.title}</h2>
            <HorizonLine className="mt-7 w-24" delay={0.2} />
            <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
          </Reveal>

          <ul className="mt-10 grid gap-0">
            {t.pillars.map((p, i) => {
              const Icon = icons[p.icon as keyof typeof icons];
              return (
                <Reveal as="li" key={p.title} delay={0.1 + i * 0.08} className="flex gap-5 border-t border-line py-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-gold-ink">
                      <Icon className="size-6" weight="light" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-lg font-semibold">{p.title}</span>
                      <span className="mt-1 block leading-relaxed text-ink-soft">{p.text}</span>
                    </span>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.2}>
            <p className="mt-2 flex gap-3 border-t border-line pt-6 text-sm leading-relaxed text-ink-soft">
              <SealCheck className="mt-0.5 size-5 shrink-0 text-gold-ink" weight="duotone" aria-hidden />
              {t.developer}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
