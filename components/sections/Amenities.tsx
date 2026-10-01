import Image from "next/image";
import {
  SwimmingPool,
  Campfire,
  TennisBall,
  Balloon,
  PawPrint,
  Tree,
  Barbell,
  Cards,
  UsersThree,
  Toilet,
  ShieldCheck,
  Car,
  Path,
  Bicycle,
  Armchair,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

const icons = {
  pool: SwimmingPool,
  fire: Campfire,
  pickleball: TennisBall,
  kids: Balloon,
  pet: PawPrint,
  park: Tree,
  gym: Barbell,
  games: Cards,
  hall: UsersThree,
  restroom: Toilet,
  gate: ShieldCheck,
  car: Car,
  trail: Path,
  bike: Bicycle,
  bench: Armchair,
  club: Buildings,
} as const;

type Item = { icon: string; label: string };

function IconGrid({ items, cols }: { items: Item[]; cols: string }) {
  return (
    <ul className={`grid gap-x-6 gap-y-7 ${cols}`}>
      {items.map((a) => {
        const Icon = icons[a.icon as keyof typeof icons];
        return (
          <li key={a.label} className="flex items-center gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-gold-ink ring-1 ring-line">
              <Icon className="size-[1.35rem]" weight="light" aria-hidden />
            </span>
            <span className="text-[0.95rem] font-medium leading-snug">{a.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Amenities({ t }: { t: Dict["amenities"] }) {
  return (
    <section aria-labelledby="amen-title" className="py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[4/5]">
            <Image src="/img/entrance.jpg" alt={t.imageAlt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover object-[35%_50%]" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
            <ShieldCheck className="size-4 text-gold-ink" weight="bold" aria-hidden />
            {t.security}
          </p>
        </Reveal>

        <div>
          <Reveal>
            <h2 id="amen-title" className="display max-w-[14ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <h3 className="mb-7 border-b border-line pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {t.inCluster}
            </h3>
            <IconGrid items={t.cluster} cols="grid-cols-1 xs:grid-cols-2 xl:grid-cols-3" />
          </Reveal>
          <Reveal delay={0.15} className="mt-14">
            <h3 className="mb-7 border-b border-line pb-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {t.inMaster}
            </h3>
            <IconGrid items={t.master} cols="grid-cols-1 xs:grid-cols-2 xl:grid-cols-4" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
