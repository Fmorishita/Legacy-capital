import type { ProjectId } from "@/lib/projects";

/**
 * Estado comercial de cada proyecto: dorado para la preventa, verde de viñedo para la entrega
 * inmediata. El mismo código de color se repite en el selector del encabezado y en las tarjetas.
 */
export function StatusChip({
  project,
  label,
  tone = "light",
  className = "",
}: {
  project: ProjectId;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const vine = project === "vinedos";
  const base =
    tone === "dark"
      ? "border border-cream-100/25 bg-navy-950/45 text-cream-100 backdrop-blur-md"
      : vine
        ? "bg-vine-soft text-vine-ink"
        : "bg-gold-500/15 text-gold-ink";
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] ${base} ${className}`}
    >
      <span aria-hidden className="relative flex size-2">
        {vine && <span className="absolute inset-0 animate-ping rounded-full bg-vine-400 opacity-60 motion-reduce:hidden" />}
        <span className={`relative size-2 rounded-full ${vine ? "bg-vine-400" : "bg-gold-400"}`} />
      </span>
      {label}
    </span>
  );
}

export function StatusDot({ project }: { project: ProjectId }) {
  return <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${project === "vinedos" ? "bg-vine-400" : "bg-gold-400"}`} />;
}
