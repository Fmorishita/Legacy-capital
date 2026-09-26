import { CheckCircle, Lock, CircleDashed, PlayCircle, HourglassMedium, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import type { EstadoEntrega, ModState } from "@/lib/cap/types";

export const STATE_LABEL: Record<ModState, string> = {
  completado: "Completado",
  en_curso: "En curso",
  disponible: "Disponible",
  bloqueado: "Bloqueado",
};

export function StateChip({ estado }: { estado: ModState }) {
  const map = {
    completado: { cls: "bg-ok-bg text-ok", Icon: CheckCircle },
    en_curso: { cls: "bg-warn-bg text-warn", Icon: PlayCircle },
    disponible: { cls: "bg-gold-lt/60 text-gold-dk", Icon: CircleDashed },
    bloqueado: { cls: "bg-cream-2 text-muted", Icon: Lock },
  }[estado];
  return (
    <span className={`cap-chip ${map.cls}`}>
      <map.Icon className="size-3.5" weight="bold" aria-hidden />
      {STATE_LABEL[estado]}
    </span>
  );
}

export const TASK_LABEL: Record<EstadoEntrega | "sin_enviar", string> = {
  sin_enviar: "Sin enviar",
  en_revision: "En revisión",
  aprobado: "Aprobada",
  corregir: "Por corregir",
};

export function TaskChip({ estado }: { estado: EstadoEntrega | "sin_enviar" }) {
  const map = {
    sin_enviar: { cls: "bg-cream-2 text-muted", Icon: CircleDashed },
    en_revision: { cls: "bg-warn-bg text-warn", Icon: HourglassMedium },
    aprobado: { cls: "bg-ok-bg text-ok", Icon: CheckCircle },
    corregir: { cls: "bg-bad-bg text-bad", Icon: ArrowCounterClockwise },
  }[estado];
  return (
    <span className={`cap-chip ${map.cls}`}>
      <map.Icon className="size-3.5" weight="bold" aria-hidden />
      {TASK_LABEL[estado]}
    </span>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="cap-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

const fmt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Tijuana" });
const fmtShort = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Tijuana",
});

export const fecha = (iso: string | null | undefined) => (iso ? fmt.format(new Date(iso)) : "—");
export const fechaHora = (iso: string | null | undefined) => (iso ? fmtShort.format(new Date(iso)) : "—");

export function moduleLabel(numero: string | null, esAnexo = false) {
  return esAnexo ? "Anexos" : `Módulo ${numero}`;
}
