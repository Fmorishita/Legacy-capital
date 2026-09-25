import type { Dict } from "@/lib/i18n/es";
import { Reveal } from "@/components/ui/Reveal";

export function Facts({ t }: { t: Dict["facts"] }) {
  return (
    <section aria-label="Punta Pacífico en cifras" className="border-y border-line bg-bg">
      <div className="container-x">
        <dl className="grid grid-cols-2 md:grid-cols-5">
          {t.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.07}
              className={`flex flex-col gap-2 py-7 md:border-l md:border-line md:px-6 md:py-10 md:first:border-l-0 md:first:pl-0 ${
                i === 0 ? "col-span-2 border-b border-line md:col-span-1 md:border-b-0" : ""
              } ${i > 0 && i % 2 === 0 ? "border-l border-line pl-5 md:pl-6" : ""} ${
                i === 1 || i === 2 ? "border-b border-line md:border-b-0" : ""
              }`}
            >
              <dt className="order-2 text-sm leading-snug text-ink-soft">{f.label}</dt>
              <dd className="display order-1 text-[2.4rem] leading-none md:text-[2.6rem]">{f.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
