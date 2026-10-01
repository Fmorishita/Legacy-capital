import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import type { HomeCopy } from "@/lib/i18n/home";
import type { PortfolioCopy, PortfolioItem } from "@/lib/i18n/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";

// Fotografía de apoyo de cada proyecto: una principal y un detalle
const media: Record<PortfolioItem["id"], { main: string; inset: string }> = {
  preventa: { main: "/img/aerial-homes.jpg", inset: "/img/roof-sunset.jpg" },
  vinedos: { main: "/img/vdm/aerial.jpg", inset: "/img/vdm/teide-1.jpg" },
};

function Feature({ item, flip }: { item: PortfolioItem; flip: boolean }) {
  const m = media[item.id];
  return (
    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <Reveal className={`relative ${flip ? "lg:order-2" : ""}`}>
        <Link href={item.href} tabIndex={-1} aria-hidden className="group relative block aspect-[5/4] overflow-hidden rounded-2xl bg-bg-alt">
          <Image
            src={m.main}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </Link>
        <div
          className={`absolute -bottom-8 hidden aspect-[4/3] w-[42%] overflow-hidden rounded-2xl border-[6px] border-bg shadow-2xl sm:block ${
            flip ? "-left-6" : "-right-6"
          }`}
        >
          <Image src={m.inset} alt="" fill sizes="20vw" className="object-cover" />
        </div>
      </Reveal>
      <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
        <StatusChip project={item.id} label={item.status} />
        <p className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">{item.place}</p>
        <h3 className="display mt-2 text-[2.5rem] leading-[1.03] md:text-[3.3rem]">{item.name}</h3>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">{item.summary}</p>
        <ul className="mt-7 grid gap-3">
          {item.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-line pt-7">
          <p className="leading-tight">
            <span className="block font-display text-[2rem] font-semibold">{item.price}</span>
            <span className="text-sm text-ink-soft">{item.priceNote}</span>
          </p>
          <Link href={item.href} className="btn btn-primary">
            {item.cta}
            <ArrowRight className="size-4" weight="bold" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </article>
  );
}

export function Showcase({ t, portfolio }: { t: HomeCopy["showcase"]; portfolio: PortfolioCopy }) {
  return (
    <section id="proyectos" aria-labelledby="showcase-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="showcase-title" className="display mt-4 text-[2.6rem] leading-[1.04] md:text-6xl">
            {t.title}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
        </Reveal>
        <div className="mt-16 grid gap-24 md:mt-24 md:gap-36">
          {portfolio.items.map((item, i) => (
            <Feature key={item.id} item={item} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
