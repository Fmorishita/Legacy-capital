import Image from "next/image";

/** Escudo + wordmark tipográfico (Cinzel reproduce las versalitas del brandbook). */
export function Logo({ tone = "auto", compact = false }: { tone?: "auto" | "light"; compact?: boolean }) {
  const text = tone === "light" ? "text-cream-100" : "text-ink";
  const sub = tone === "light" ? "text-gold-400" : "text-gold-ink";
  return (
    <span className="flex items-center gap-3">
      <Image src="/brand/crest.png" alt="" width={300} height={391} className="h-11 w-auto" priority />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={`font-caps text-[1.2rem] font-semibold tracking-[0.02em] ${text}`}>Legacy Capital</span>
          <span className={`mt-1 flex items-center gap-2 font-sans text-[0.62rem] font-semibold tracking-[0.34em] ${sub}`}>
            <span aria-hidden className="h-px w-3 bg-current" />
            REAL ESTATE
            <span aria-hidden className="h-px w-3 bg-current" />
          </span>
        </span>
      )}
    </span>
  );
}
