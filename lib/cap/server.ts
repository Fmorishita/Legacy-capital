// Acceso a la plataforma de capacitación desde el servidor. Nunca importar en componentes cliente:
// usa el secreto CAP_RPC_SECRET, que no debe llegar al navegador.
import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SESSION_COOKIE = "lc_cap";
const SESSION_DAYS = 30;

export type Me = { id: string; nombre: string; correo: string; rol: "asesor" | "admin"; debe_cambiar: boolean };

export class CapError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

let client: SupabaseClient | null = null;
function db() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new CapError("sin_configurar");
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Llama a public.cap_rpc. Los errores esperados vuelven como { error } y se lanzan como CapError. */
export async function capRpc<T = Record<string, unknown>>(fn: string, params: Record<string, unknown> = {}): Promise<T> {
  const secret = process.env.CAP_RPC_SECRET;
  if (!secret) throw new CapError("sin_configurar");
  const { data, error } = await db().rpc("cap_rpc", { payload: { ...params, fn, secret } });
  if (error) {
    const known = ["sin_sesion", "prohibido"].find((c) => error.message?.includes(c));
    if (!known) console.error(`[cap] ${fn}:`, error.message);
    throw new CapError(known ?? "servidor");
  }
  if (data && typeof data === "object" && "error" in data) throw new CapError(String((data as { error: string }).error));
  return data as T;
}

async function sessionHash() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token && token.length >= 32 ? sha256(token) : null;
}

/** Llama a una función que requiere sesión. */
export async function withSession<T = Record<string, unknown>>(fn: string, params: Record<string, unknown> = {}) {
  const sesion = await sessionHash();
  if (!sesion) throw new CapError("sin_sesion");
  return capRpc<T>(fn, { ...params, sesion });
}

export async function getMe(): Promise<Me | null> {
  try {
    return await withSession<Me>("me");
  } catch (e) {
    if (e instanceof CapError && e.code === "sin_sesion") return null;
    throw e;
  }
}

/** Exige sesión activa. Si la contraseña es temporal, manda a cambiarla primero. */
export async function requireUser(opts: { allowTempPassword?: boolean } = {}) {
  const me = await getMe();
  if (!me) redirect("/capacitacion/entrar");
  if (me.debe_cambiar && !opts.allowTempPassword) redirect("/capacitacion/cuenta");
  return me;
}

export async function requireAdmin() {
  const me = await requireUser();
  if (me.rol !== "admin") redirect("/capacitacion");
  return me;
}

/** Crea el token de sesión: el navegador guarda el token y la base de datos solo su hash. */
export async function startSession(correo: string, password: string) {
  const token = randomBytes(32).toString("base64url");
  const res = await capRpc<{ ok: boolean; rol: string; debe_cambiar: boolean }>("login", {
    correo,
    password,
    sesion: sha256(token),
  });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}

export async function endSession() {
  const sesion = await sessionHash();
  if (sesion) await capRpc("logout", { sesion }).catch(() => {});
  (await cookies()).delete(SESSION_COOKIE);
}
