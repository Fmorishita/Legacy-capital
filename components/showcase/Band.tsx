/** Franja en movimiento bajo la portada con lo esencial de la preventa. */
export function Band({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-white/10 bg-[#0d2238] py-4 text-[#d9e3e8]" aria-label={items.join(" · ")}>
      <div className="marquee-track flex w-max gap-7 whitespace-nowrap font-display text-[clamp(1.15rem,2.2vw,1.6rem)]" aria-hidden>
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-7">
            {item}
            <i className="text-[0.6em] not-italic text-gold-500">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
