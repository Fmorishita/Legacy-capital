import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import type { PortfolioItem } from "@/lib/i18n/portfolio";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip } from "@/components/ui/StatusChip";

export type CrossSellCopy = { eyebrow: string; title: string; body: string };

/** Puente entre proyectos: desde la preventa hacia la entrega inmediata y viceversa. */
export function CrossSell({ item, t, tone = "bg" }: { item: PortfolioItem; t: CrossSellCopy; tone?: "bg" | "alt" }) {
  return (
    <section aria-labelledby={`cross-${item.id}`} className={`${tone === "alt" ? "bg-bg-alt" : "bg-bg"} py-20 md:py-28`}>
      <div className="container-x">
        <Reveal>
          <Link
            href={item.href}
            className="group grid overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_30px_80px_-50px_rgb(var(--shadow)/0.6)] transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-[0_40px_90px_-45px_rgb(var(--shadow)/0.65)] md:grid-cols-[1.05fr_1fr]"
          >
            <div className="relative aspect-[16/11] overflow-hidden md:aspect-auto md:min-h-[26rem]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
              <StatusChip project={item.id} label={item.status} tone="dark" className="absolute left-5 top-5" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="eyebrow">{t.eyebrow}</p>
              <h2 id={`cross-${item.id}`} className="display mt-4 text-[2.3rem] leading-[1.05] md:text-[3rem]">
                {t.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">{t.body}</p>
              <ul className="mt-7 grid gap-2.5">
                {item.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[0.95rem]">
                    <Check className="mt-1 size-4 shrink-0 text-gold-ink" weight="bold" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <span className="btn btn-primary">
                  {item.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" weight="bold" aria-hidden />
                </span>
                <span className="text-sm text-ink-soft">
                  <span className="font-display text-xl font-semibold text-ink">{item.price}</span> · {item.priceNote}
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
