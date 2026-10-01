"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Copy, MagnifyingGlass, WhatsappLogo, XCircle } from "@phosphor-icons/react";
import {
  adminBulkQuestionsAction,
  adminCreateCodeAction,
  adminExtraAttemptAction,
  adminResetPasswordAction,
  adminReviewAction,
  adminSaveQuestionAction,
  adminSetConfigAction,
  adminSetEstadoAction,
  adminToggleCodeAction,
  adminUpdateUserAction,
} from "@/lib/cap/actions";
import { Alert } from "@/components/cap/Alert";
import type { AdminOverview, Letra, PreguntaAdmin, UsuarioAdmin } from "@/lib/cap/types";

const ESTADO_CLS: Record<UsuarioAdmin["estado"], string> = {
  activo: "bg-ok-bg text-ok",
  pendiente: "bg-warn-bg text-warn",
  suspendido: "bg-bad-bg text-bad",
};

export function EstadoChip({ estado }: { estado: UsuarioAdmin["estado"] }) {
  return <span className={`cap-chip capitalize ${ESTADO_CLS[estado]}`}>{estado}</span>;
}

const dt = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "America/Tijuana" });
const when = (iso: string | null) => (iso ? dt.format(new Date(iso)) : "—");

// ---------------------------------------------------------------- Asesores

export function UsersTable({ users, totalModulos }: { users: UsuarioAdmin[]; totalModulos: number }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<"todos" | UsuarioAdmin["estado"]>("todos");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter(
      (u) => (f === "todos" || u.estado === f) && (!s || u.nombre.toLowerCase().includes(s) || u.correo.includes(s) || u.telefono.includes(s)),
    );
  }, [users, q, f]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[14rem] flex-1">
          <span className="sr-only">Buscar asesor</span>
          <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, correo o teléfono" className="cap-input pl-9" />
        </label>
        <select value={f} onChange={(e) => setF(e.target.value as typeof f)} className="cap-input w-auto" aria-label="Filtrar por estado">
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="pendiente">Pendientes</option>
          <option value="suspendido">Suspendidos</option>
        </select>
      </div>
      <div className="cap-card mt-4 overflow-x-auto">
        <table className="cap-table min-w-[900px]">
          <thead>
            <tr>
              <th>Asesor</th>
              <th>Estado</th>
              <th>Avance</th>
              <th>Quizzes</th>
              <th>Examen</th>
              <th>Tareas</th>
              <th>Certificado</th>
              <th>Último acceso</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-white/70">
                <td>
                  <Link href={`/capacitacion/admin/asesor/${u.id}`} className="font-semibold text-navy hover:underline">
                    {u.nombre}
                  </Link>
                  {u.rol === "admin" && <span className="ml-2 cap-chip bg-navy text-cream">admin</span>}
                  <p className="text-xs text-muted">{u.correo}</p>
                </td>
                <td>
                  <EstadoChip estado={u.estado} />
                </td>
                <td className="min-w-36">
                  <p className="text-xs text-muted">
                    {u.completados}/{totalModulos} módulos
                  </p>
                  <div className="cap-progress mt-1.5">
                    <span style={{ width: `${(u.completados / Math.max(totalModulos, 1)) * 100}%` }} />
                  </div>
                </td>
                <td>{u.quizzes_aprobados}</td>
                <td>
                  {u.examen_aprobado ? (
                    <span className="font-semibold text-ok">Aprobado</span>
                  ) : u.examen_intentos ? (
                    <span className="text-bad">No aprobado</span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                  {u.examen_intentos > 0 && (
                    <p className="text-xs text-muted">
                      Mejor {Math.round(u.examen_mejor ?? 0)}% · {u.examen_intentos} intento{u.examen_intentos === 1 ? "" : "s"}
                    </p>
                  )}
                </td>
                <td>
                  <p className="text-xs">{u.tareas_aprobadas} aprobadas</p>
                  {u.tareas_revision > 0 && <p className="text-xs font-semibold text-warn">{u.tareas_revision} en revisión</p>}
                </td>
                <td>{u.certificado ? <span className="text-xs font-semibold tracking-wider text-gold-dk">{u.certificado}</span> : "—"}</td>
                <td className="text-xs text-muted">{when(u.ultimo_acceso)}</td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-sm text-muted">
                  No hay asesores con ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const exec = (fn: () => Promise<{ ok: boolean; error?: string; data?: unknown }>, okText?: (d: unknown) => string) =>
    start(async () => {
      const r = await fn();
      if (r.ok) {
        setMsg(okText ? { tone: "ok", text: okText(r.data) } : null);
        router.refresh();
      } else setMsg({ tone: "bad", text: r.error ?? "Error" });
    });
  return { pending, msg, exec };
}

export function ApproveButtons({ id }: { id: string }) {
  const { pending, msg, exec } = useAction();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={pending} onClick={() => exec(() => adminSetEstadoAction(id, "activo"))} className="cap-btn cap-btn-primary cap-btn-sm">
        <CheckCircle className="size-4" aria-hidden /> Aprobar
      </button>
      <button type="button" disabled={pending} onClick={() => exec(() => adminSetEstadoAction(id, "suspendido"))} className="cap-btn cap-btn-ghost cap-btn-sm">
        <XCircle className="size-4" aria-hidden /> Rechazar
      </button>
      {msg && <span className={`text-xs ${msg.tone === "ok" ? "text-ok" : "text-bad"}`}>{msg.text}</span>}
    </div>
  );
}

export function UserActions({ id, estado, nombre, telefono, esYo }: { id: string; estado: UsuarioAdmin["estado"]; nombre: string; telefono: string; esYo: boolean }) {
  const { pending, msg, exec } = useAction();
  const [temp, setTemp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const wa = telefono.replace(/\D/g, "");

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {!esYo && estado !== "activo" && (
          <button type="button" disabled={pending} onClick={() => exec(() => adminSetEstadoAction(id, "activo"), () => "Acceso activado.")} className="cap-btn cap-btn-primary cap-btn-sm">
            {estado === "pendiente" ? "Aprobar registro" : "Reactivar acceso"}
          </button>
        )}
        {!esYo && estado === "activo" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => window.confirm(`¿Suspender el acceso de ${nombre}? Se cerrarán sus sesiones.`) && exec(() => adminSetEstadoAction(id, "suspendido"), () => "Acceso suspendido.")}
            className="cap-btn cap-btn-ghost cap-btn-sm"
          >
            Suspender acceso
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            window.confirm(`¿Generar una contraseña temporal para ${nombre}? La actual dejará de funcionar.`) &&
            exec(
              async () => {
                const r = await adminResetPasswordAction(id);
                if (r.ok && r.data) setTemp(r.data.temporal);
                return r;
              },
              () => "Contraseña temporal generada.",
            )
          }
          className="cap-btn cap-btn-ghost cap-btn-sm"
        >
          Restablecer contraseña
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => exec(() => adminExtraAttemptAction(id), () => "Se agregó un intento extra del examen final.")}
          className="cap-btn cap-btn-ghost cap-btn-sm"
        >
          Dar intento extra de examen
        </button>
      </div>
      {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
      {temp && (
        <div className="rounded-xl border border-gold bg-white p-4 text-sm">
          <p className="text-xs text-muted">Contraseña temporal (solo se muestra una vez):</p>
          <p className="mt-1 font-mono text-xl tracking-wider text-navy">{temp}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="cap-btn cap-btn-ghost cap-btn-sm"
              onClick={() => navigator.clipboard.writeText(temp).then(() => setCopied(true))}
            >
              <Copy className="size-4" aria-hidden /> {copied ? "Copiada" : "Copiar"}
            </button>
            {wa.length >= 10 && (
              <a
                className="cap-btn cap-btn-ghost cap-btn-sm"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/${wa}?text=${encodeURIComponent(
                  `Hola ${nombre.split(" ")[0]}, tu contraseña temporal para la capacitación de Legacy Capital es: ${temp}\nEntra en ${location.origin}/capacitacion/entrar y crea una nueva.`,
                )}`}
              >
                <WhatsappLogo className="size-4" aria-hidden /> Enviar por WhatsApp
              </a>
            )}
          </div>
          <p className="mt-2 text-xs text-muted">Al entrar, el sistema le pedirá crear una nueva.</p>
        </div>
      )}
    </div>
  );
}

export function EditUserForm({ id, nombre, telefono }: { id: string; nombre: string; telefono: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (prev: unknown, fd: FormData) => {
    const r = await adminUpdateUserAction(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, undefined);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input type="hidden" name="usuario" value={id} />
      <div>
        <label className="cap-label" htmlFor="e-nombre">
          Nombre (así sale en el certificado)
        </label>
        <input id="e-nombre" name="nombre" defaultValue={nombre} required className="cap-input" />
      </div>
      <div>
        <label className="cap-label" htmlFor="e-tel">
          Teléfono
        </label>
        <input id="e-tel" name="telefono" defaultValue={telefono} required className="cap-input" />
      </div>
      <button type="submit" disabled={pending} className="cap-btn cap-btn-primary">
        {pending ? "Guardando…" : "Guardar"}
      </button>
      {state && (
        <div className="sm:col-span-3">
          {state.ok ? <Alert tone="ok">Datos actualizados.</Alert> : <Alert>{state.error}</Alert>}
        </div>
      )}
    </form>
  );
}

// ---------------------------------------------------------------- Tareas

export function ReviewForm({ entrega, comentario, estado }: { entrega: string; comentario: string | null; estado: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (prev: unknown, fd: FormData) => {
    const r = await adminReviewAction(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, undefined);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="entrega" value={entrega} />
      <div>
        <label className="cap-label" htmlFor={`c-${entrega}`}>
          Comentario para el asesor {estado === "en_revision" && <span className="font-normal text-muted">(obligatorio si pides corrección)</span>}
        </label>
        <textarea id={`c-${entrega}`} name="comentario" defaultValue={comentario ?? ""} className="cap-input !min-h-24" maxLength={4000} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" name="estado" value="aprobado" disabled={pending} className="cap-btn cap-btn-primary cap-btn-sm">
          <CheckCircle className="size-4" aria-hidden /> Aprobar
        </button>
        <button type="submit" name="estado" value="corregir" disabled={pending} className="cap-btn cap-btn-ghost cap-btn-sm">
          Pedir corrección
        </button>
      </div>
      {state && !state.ok && <Alert>{state.error}</Alert>}
    </form>
  );
}

// ---------------------------------------------------------------- Preguntas

const LETRAS: Letra[] = ["a", "b", "c", "d"];

export function QuestionEditor({ q, index }: { q: PreguntaAdmin; index: number }) {
  const router = useRouter();
  const [correcta, setCorrecta] = useState<Letra>(q.correcta);
  const [state, action, pending] = useActionState(async (prev: unknown, fd: FormData) => {
    const r = await adminSaveQuestionAction(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, undefined);
  const exam = q.origen === "examen";
  const tone = exam ? "border-navy/20" : q.estado === "aprobada" ? "border-ok/40" : q.estado === "descartada" ? "border-line opacity-70" : "border-gold";

  return (
    <form action={action} className={`rounded-2xl border bg-white p-4 sm:p-5 ${tone}`}>
      <input type="hidden" name="id" value={q.id} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted">
          #{index} · {exam ? `Examen final, pregunta ${q.n_examen}` : `Generada${q.seccion ? ` · sección ${q.seccion.replace(/^m\d+-s/, "")}` : ""}`}
        </p>
        {exam ? (
          <>
            <input type="hidden" name="estado" value="aprobada" />
            <span className="cap-chip bg-navy text-cream">Examen · siempre activa</span>
          </>
        ) : (
          <select name="estado" defaultValue={q.estado} className="cap-input !min-h-9 w-auto !py-1 text-sm" aria-label="Estado">
            <option value="borrador">Borrador</option>
            <option value="aprobada">Aprobada</option>
            <option value="descartada">Descartada</option>
          </select>
        )}
      </div>
      <textarea name="texto" defaultValue={q.texto} required className="cap-input mt-3 !min-h-20 text-[0.95rem]" aria-label="Pregunta" />
      <div className="mt-3 grid gap-2">
        {LETRAS.map((l) => (
          <label key={l} className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${correcta === l ? "border-ok bg-ok-bg" : "border-line"}`}>
            <input type="radio" name="correcta" value={l} checked={correcta === l} onChange={() => setCorrecta(l)} aria-label={`Marcar ${l} como correcta`} />
            <span className="w-4 text-xs font-bold uppercase text-muted">{l}</span>
            <input name={l} defaultValue={q.opciones[l]} required className="min-w-0 flex-1 bg-transparent px-1 py-1 text-sm outline-none" aria-label={`Opción ${l}`} />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="cap-btn cap-btn-primary cap-btn-sm">
          {pending ? "Guardando…" : "Guardar"}
        </button>
        {state && (state.ok ? <span className="text-xs text-ok">Guardada.</span> : <span className="text-xs text-bad">{state.error}</span>)}
      </div>
    </form>
  );
}

export function BulkApprove({ modulo, count }: { modulo: string; count: number }) {
  const { pending, msg, exec } = useAction();
  if (!count) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => exec(() => adminBulkQuestionsAction(modulo, "aprobada"), () => "Borradores aprobados.")}
        className="cap-btn cap-btn-primary cap-btn-sm"
      >
        Aprobar los {count} borradores
      </button>
      {msg && <span className={`text-xs ${msg.tone === "ok" ? "text-ok" : "text-bad"}`}>{msg.text}</span>}
    </div>
  );
}

// ---------------------------------------------------------------- Registro y códigos

export function ConfigForm({ config }: { config: AdminOverview["config"] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (prev: unknown, fd: FormData) => {
    const r = await adminSetConfigAction(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, undefined);
  const modos = [
    { v: "ambos", t: "Código o aprobación", d: "Con código entran de inmediato; sin código quedan pendientes hasta que los apruebes." },
    { v: "codigo", t: "Solo con código", d: "Nadie puede registrarse sin un código de invitación vigente." },
    { v: "aprobacion", t: "Solo con aprobación", d: "No se pide código: apruebas cada registro desde la pestaña Asesores." },
  ];
  return (
    <form action={action} className="grid gap-5">
      <fieldset>
        <legend className="cap-label">Cómo se registran los asesores</legend>
        <div className="mt-2 grid gap-2">
          {modos.map((m) => (
            <label key={m.v} className="flex cursor-pointer gap-3 rounded-xl border border-line bg-white p-3.5 has-[:checked]:border-gold has-[:checked]:bg-gold-lt/25">
              <input type="radio" name="modo_registro" value={m.v} defaultChecked={config.modo_registro === m.v} className="mt-1" />
              <span>
                <span className="block text-sm font-semibold text-navy">{m.t}</span>
                <span className="block text-xs leading-relaxed text-muted">{m.d}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="max-w-xs">
        <label className="cap-label" htmlFor="intentos">
          Intentos del examen final por asesor
        </label>
        <input id="intentos" name="intentos_examen" type="number" min={1} max={20} defaultValue={config.intentos_examen} className="cap-input" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="cap-btn cap-btn-primary">
          {pending ? "Guardando…" : "Guardar configuración"}
        </button>
        {state && (state.ok ? <span className="text-sm text-ok">Guardado.</span> : <span className="text-sm text-bad">{state.error}</span>)}
      </div>
    </form>
  );
}

export function CreateCodeForm() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [state, action, pending] = useActionState(async (prev: unknown, fd: FormData) => {
    setCopied(false);
    const r = await adminCreateCodeAction(prev, fd);
    if (r.ok) router.refresh();
    return r;
  }, undefined);
  const code = state?.ok ? state.data?.codigo : null;
  const link = typeof window !== "undefined" ? `${location.origin}/capacitacion/registro` : "/capacitacion/registro";
  const msg = code
    ? `Hola, te invito a la capacitación de asesores de Legacy Capital.\n1. Entra a ${link}\n2. Regístrate con tu nombre, correo y teléfono.\n3. Usa el código de invitación: ${code}`
    : "";

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-3 sm:grid-cols-[7rem_9rem_1fr_auto] sm:items-end">
        <div>
          <label className="cap-label" htmlFor="usos">
            Usos
          </label>
          <input id="usos" name="usos" type="number" min={1} max={500} defaultValue={1} className="cap-input" />
        </div>
        <div>
          <label className="cap-label" htmlFor="dias">
            Vigencia (días)
          </label>
          <input id="dias" name="dias" type="number" min={1} max={365} placeholder="Sin límite" className="cap-input" />
        </div>
        <div>
          <label className="cap-label" htmlFor="nota">
            Nota (para quién es)
          </label>
          <input id="nota" name="nota" maxLength={120} placeholder="Ej. Grupo octubre" className="cap-input" />
        </div>
        <button type="submit" disabled={pending} className="cap-btn cap-btn-primary">
          {pending ? "Generando…" : "Generar código"}
        </button>
      </form>
      {state && !state.ok && <Alert>{state.error}</Alert>}
      {code && (
        <div className="rounded-xl border border-gold bg-white p-4">
          <p className="text-xs text-muted">Código nuevo</p>
          <p className="mt-1 font-mono text-2xl tracking-[0.18em] text-navy">{code}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="cap-btn cap-btn-ghost cap-btn-sm"
              onClick={() => navigator.clipboard.writeText(msg).then(() => setCopied(true))}
            >
              <Copy className="size-4" aria-hidden /> {copied ? "Invitación copiada" : "Copiar invitación"}
            </button>
            <a className="cap-btn cap-btn-ghost cap-btn-sm" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(msg)}`}>
              <WhatsappLogo className="size-4" aria-hidden /> Compartir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function CodeToggle({ codigo, activo }: { codigo: string; activo: boolean }) {
  const { pending, exec } = useAction();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => exec(() => adminToggleCodeAction(codigo, !activo))}
      className={`cap-btn cap-btn-sm ${activo ? "cap-btn-ghost" : "cap-btn-primary"}`}
    >
      {activo ? "Desactivar" : "Activar"}
    </button>
  );
}
