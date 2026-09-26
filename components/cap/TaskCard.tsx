"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, PaperPlaneTilt, NotePencil, FileText, ChatCircleText } from "@phosphor-icons/react";
import { submitTaskAction } from "@/lib/cap/actions";
import { useModule } from "@/components/cap/ModuleClient";
import { Alert } from "@/components/cap/Alert";
import type { ActionResult, EstadoEntrega, Tarea } from "@/lib/cap/types";

const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.txt,.doc,.docx,.xls,.xlsx";

const CHIP: Record<EstadoEntrega | "sin_enviar", { label: string; cls: string }> = {
  sin_enviar: { label: "Sin enviar", cls: "bg-cream-2 text-muted" },
  en_revision: { label: "En revisión", cls: "bg-warn-bg text-warn" },
  aprobado: { label: "Aprobada", cls: "bg-ok-bg text-ok" },
  corregir: { label: "Por corregir", cls: "bg-bad-bg text-bad" },
};

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export function TaskCard({ task }: { task: Tarea }) {
  const router = useRouter();
  const { markSent } = useModule();
  const e = task.entrega;
  const estado = e?.estado ?? "sin_enviar";
  const [editing, setEditing] = useState(!e || e.estado === "corregir");
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<ActionResult | undefined, FormData>(submitTaskAction, undefined);

  useEffect(() => {
    if (state?.ok) {
      markSent(task.id);
      setEditing(false);
      setFileName(null);
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, task.id, markSent, router]);

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gold/60 bg-white shadow-[0_18px_40px_-30px_rgb(26_43_76/0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-card px-5 py-3.5">
        <p className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] text-gold-dk uppercase">
          <NotePencil className="size-4" aria-hidden /> Tarea · {task.titulo}
        </p>
        <span className={`cap-chip ${CHIP[estado].cls}`}>{CHIP[estado].label}</span>
      </div>

      <div className="px-5 pt-5">
        <div className="manual" dangerouslySetInnerHTML={{ __html: task.instrucciones }} />
      </div>

      {e?.comentario && (
        <div className="mx-5 mt-2 rounded-xl bg-cream px-4 py-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy">
            <ChatCircleText className="size-4" aria-hidden /> Comentario del administrador
          </p>
          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-ink">{e.comentario}</p>
        </div>
      )}

      {e && !editing && (
        <div className="px-5 py-5">
          <p className="text-xs font-semibold text-muted">Tu entrega</p>
          {e.texto && (
            <p className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-line bg-cream/40 px-4 py-3 text-sm leading-relaxed whitespace-pre-line text-ink">
              {e.texto}
            </p>
          )}
          {e.archivo && (
            <a
              href={`/capacitacion/archivo/${e.archivo.id}`}
              target="_blank"
              rel="noopener"
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-navy hover:border-gold"
            >
              <FileText className="size-4" aria-hidden /> {e.archivo.nombre} <span className="text-muted">({kb(e.archivo.tamano)})</span>
            </a>
          )}
          {state?.ok && (
            <div className="mt-4">
              <Alert tone="ok">Listo. Tu tarea quedó en revisión; te avisaremos el resultado aquí mismo.</Alert>
            </div>
          )}
          {e.estado !== "aprobado" && (
            <button type="button" onClick={() => setEditing(true)} className="cap-btn cap-btn-ghost cap-btn-sm mt-4">
              Editar y reenviar
            </button>
          )}
        </div>
      )}

      {editing && (
        <form ref={formRef} action={action} className="grid gap-4 px-5 py-5">
          <input type="hidden" name="tarea" value={task.id} />
          {state && !state.ok && <Alert>{state.error}</Alert>}
          <div>
            <label htmlFor={`t-${task.id}`} className="cap-label">
              Tu respuesta
            </label>
            <textarea
              id={`t-${task.id}`}
              name="texto"
              maxLength={20000}
              defaultValue={e?.texto ?? ""}
              placeholder="Escribe aquí tu respuesta…"
              className="cap-input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="cap-btn cap-btn-ghost cap-btn-sm cursor-pointer">
              <Paperclip className="size-4" aria-hidden />
              {fileName ? "Cambiar archivo" : "Adjuntar archivo"}
              <input
                type="file"
                name="archivo"
                accept={ACCEPT}
                className="sr-only"
                onChange={(ev) => setFileName(ev.currentTarget.files?.[0]?.name ?? null)}
              />
            </label>
            <span className="min-w-0 truncate text-xs text-muted">
              {fileName ?? (e?.archivo ? `Actual: ${e.archivo.nombre}` : "PDF, foto, Word, Excel o texto · máx. 4 MB")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={pending} className="cap-btn cap-btn-primary">
              <PaperPlaneTilt className="size-4" aria-hidden />
              {pending ? "Enviando…" : e ? "Reenviar a revisión" : "Enviar a revisión"}
            </button>
            {e && (
              <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted hover:text-navy">
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
