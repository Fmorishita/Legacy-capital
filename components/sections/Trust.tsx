import { Buildings, Bank, FileText, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

const icons = { building: Buildings, bank: Bank, contract: FileText, shield: ShieldCheck } as const;

export function Trust({ t }: { t: Dict["trust"] }) {
  return (
    <section aria-labelledby="trust-title" className="bg-bg-alt py-24 md:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <h2 id="trust-title" className="display max-w-[16ch] text-[2.6rem] leading-[1.04] md:text-6xl">
              {t.title}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {t.items.map((it, i) => {
              const Icon = icons[it.icon as keyof typeof icons];
              return (
                <Reveal as="li" key={it.title} delay={i * 0.07}>
                  <Icon className="size-8 text-gold-ink" weight="light" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{it.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="rounded-2xl bg-surface p-7 sm:p-10">
          <h3 className="display text-[2.1rem] leading-tight">{t.stepsTitle}</h3>
          <ol className="mt-8">
            {t.steps.map((s, i) => (
              <li key={s.title} className="relative flex gap-6 pb-9 last:pb-0">
                {i < t.steps.length - 1 && (
                  <span aria-hidden className="absolute left-[1.35rem] top-12 h-[calc(100%-3rem)] w-px bg-line-strong" />
                )}
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold font-display text-xl font-semibold text-gold-ink">
                  {i + 1}
                </span>
                <span className="pt-1.5">
                  <span className="block text-xl font-semibold">{s.title}</span>
                  <span className="mt-1 block leading-relaxed text-ink-soft">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
