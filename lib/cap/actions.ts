"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CapError, capRpc, endSession, startSession, withSession } from "@/lib/cap/server";
import { errorMessage } from "@/lib/cap/messages";
import type { ActionResult, Letra, QuizResult, QuizStart } from "@/lib/cap/types";

const MAX_FILE = 4 * 1024 * 1024; // Vercel limita el cuerpo de la petición a 4.5 MB
const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  txt: "text/plain",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function fail(e: unknown): { ok: false; error: string } {
  if (e instanceof CapError) return { ok: false, error: errorMessage(e.code) };
  console.error("[cap]", e);
  return { ok: false, error: errorMessage("servidor") };
}

async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return fail(e);
  }
}

function safeNext(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return /^\/capacitacion(\/[\w\-/]*)?$/.test(s) ? s : "/capacitacion";
}

// ---------------------------------------------------------------- Cuenta

export async function loginAction(_: unknown, fd: FormData): Promise<ActionResult | undefined> {
  let debeCambiar = false;
  try {
    const res = await startSession(str(fd, "correo").toLowerCase(), String(fd.get("password") ?? ""));
    debeCambiar = res.debe_cambiar;
  } catch (e) {
    return fail(e);
  }
  redirect(debeCambiar ? "/capacitacion/cuenta" : safeNext(fd.get("next")));
}

export async function registerAction(_: unknown, fd: FormData): Promise<ActionResult | undefined> {
  const password = String(fd.get("password") ?? "");
  if (password !== String(fd.get("confirmar") ?? "")) return { ok: false, error: errorMessage("password_distinta") };
  const correo = str(fd, "correo").toLowerCase();
  let activo = false;
  try {
    const res = await capRpc<{ estado: "activo" | "pendiente" }>("register", {
      nombre: str(fd, "nombre"),
      correo,
      telefono: str(fd, "telefono"),
      password,
      codigo: str(fd, "codigo"),
    });
    activo = res.estado === "activo";
    if (activo) await startSession(correo, password);
  } catch (e) {
    return fail(e);
  }
  if (activo) redirect("/capacitacion?bienvenida=1");
  return { ok: true, message: "pendiente" };
}

export async function logoutAction() {
  await endSession();
  redirect("/capacitacion/entrar");
}

export async function changePasswordAction(_: unknown, fd: FormData): Promise<ActionResult | undefined> {
  const nueva = String(fd.get("nueva") ?? "");
  if (nueva !== String(fd.get("confirmar") ?? "")) return { ok: false, error: errorMessage("password_distinta") };
  try {
    await withSession("change_password", { actual: String(fd.get("actual") ?? ""), nueva });
  } catch (e) {
    return fail(e);
  }
  redirect("/capacitacion?cuenta=1");
}

// ---------------------------------------------------------------- Estudio

export async function markReadAction(modulo: string, seccion: string) {
  return run(() => withSession<{ ok: boolean; completado: boolean }>("read", { modulo, seccion }));
}

export async function startQuizAction(modulo: string) {
  return run(() => withSession<QuizStart>("quiz_start", { modulo }));
}

export async function submitQuizAction(intento: string, respuestas: Record<string, string>) {
  const clean: Record<string, Letra> = {};
  for (const [k, v] of Object.entries(respuestas ?? {})) {
    if (/^\d{1,9}$/.test(k) && ["a", "b", "c", "d"].includes(v)) clean[k] = v as Letra;
  }
  const res = await run(() => withSession<QuizResult>("quiz_submit", { intento, respuestas: clean }));
  if (res.ok) revalidatePath("/capacitacion", "layout");
  return res;
}

export async function submitTaskAction(_: unknown, fd: FormData): Promise<ActionResult> {
  const tarea = str(fd, "tarea");
  const texto = String(fd.get("texto") ?? "").trim();
  const file = fd.get("archivo");
  let archivo: { nombre: string; tipo: string; base64: string } | undefined;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE) return { ok: false, error: errorMessage("archivo_grande") };
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const tipo = FILE_TYPES[ext];
    if (!tipo) return { ok: false, error: errorMessage("tipo_archivo") };
    archivo = { nombre: file.name.slice(0, 160), tipo, base64: Buffer.from(await file.arrayBuffer()).toString("base64") };
  }
  if (!texto && !archivo) return { ok: false, error: errorMessage("vacia") };

  const res = await run(() => withSession("submit_task", { tarea, texto, archivo }));
  if (res.ok) revalidatePath("/capacitacion", "layout");
  return res.ok ? { ok: true } : res;
}

// ---------------------------------------------------------------- Administración

function done<T>(res: ActionResult<T>) {
  if (res.ok) revalidatePath("/capacitacion", "layout");
  return res;
}

export async function adminSetEstadoAction(usuario: string, estado: "activo" | "pendiente" | "suspendido") {
  return done(await run(() => withSession("admin_set_estado", { usuario, estado })));
}

export async function adminResetPasswordAction(usuario: string) {
  return done(await run(() => withSession<{ temporal: string }>("admin_reset_password", { usuario })));
}

export async function adminExtraAttemptAction(usuario: string) {
  return done(await run(() => withSession("admin_extra_attempt", { usuario })));
}

export async function adminCreateCodeAction(_: unknown, fd: FormData) {
  return done(
    await run(() =>
      withSession<{ codigo: string }>("admin_create_code", { usos: str(fd, "usos"), dias: str(fd, "dias"), nota: str(fd, "nota") }),
    ),
  );
}

export async function adminToggleCodeAction(codigo: string, activo: boolean) {
  return done(await run(() => withSession("admin_toggle_code", { codigo, activo })));
}

export async function adminSetConfigAction(_: unknown, fd: FormData) {
  return done(
    await run(() =>
      withSession("admin_set_config", { modo_registro: str(fd, "modo_registro"), intentos_examen: Number(str(fd, "intentos_examen")) }),
    ),
  );
}

export async function adminReviewAction(_: unknown, fd: FormData) {
  if (str(fd, "estado") === "corregir" && !str(fd, "comentario"))
    return { ok: false as const, error: "Escribe un comentario para que el asesor sepa qué corregir." };
  return done(
    await run(() =>
      withSession("admin_review", { entrega: str(fd, "entrega"), estado: str(fd, "estado"), comentario: str(fd, "comentario") }),
    ),
  );
}

export async function adminSaveQuestionAction(_: unknown, fd: FormData) {
  return done(
    await run(() =>
      withSession("admin_question_save", {
        id: Number(str(fd, "id")),
        texto: str(fd, "texto"),
        opciones: { a: str(fd, "a"), b: str(fd, "b"), c: str(fd, "c"), d: str(fd, "d") },
        correcta: str(fd, "correcta"),
        estado: str(fd, "estado"),
      }),
    ),
  );
}

export async function adminUpdateUserAction(_: unknown, fd: FormData) {
  return done(
    await run(() =>
      withSession("admin_update_user", { usuario: str(fd, "usuario"), nombre: str(fd, "nombre"), telefono: str(fd, "telefono") }),
    ),
  );
}

export async function adminBulkQuestionsAction(modulo: string, estado: "aprobada" | "descartada") {
  return done(await run(() => withSession<{ actualizadas: number }>("admin_questions_bulk", { modulo, estado })));
}
