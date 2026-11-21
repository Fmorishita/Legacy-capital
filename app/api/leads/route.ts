import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Preventa: 2R/3R; Entrega inmediata: tipo de producto (depa, ph, casa) o modelo
const INTERESES = [
  "2R",
  "3R",
  "inversion",
  "segunda_casa",
  "vivir",
  "explorando",
  "depa",
  "ph",
  "casa",
  "palomino",
  "palomino_ph",
  "azur",
  "teide",
] as const;
const PROYECTOS = ["preventa", "vinedos", "general"] as const;

// Recorta en lugar de rechazar: un UTM largo nunca debe tirar un lead
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.slice(0, max) : undefined));

const leadSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  telefono: z
    .string()
    .trim()
    .regex(/^\+\d{1,3} ?\d{8,14}$/),
  // Un correo con errores se descarta, pero el lead (nombre + WhatsApp) se conserva
  email: z
    .string()
    .trim()
    .max(320)
    .optional()
    .transform((v) => (v && v.length <= 160 && z.email().safeParse(v).success ? v : undefined)),
  interes: z.enum(INTERESES).optional(),
  perfil: z.enum(["ensenada", "california", "mexicoamericano", "monterrey", "cdmx", "guadalajara"]).optional(),
  proyecto: z.enum(PROYECTOS).optional(),
  origen: z
    .string()
    .trim()
    .default("web")
    .transform((v) => v.slice(0, 40)),
  mensaje: z
    .string()
    .trim()
    .max(3000)
    .optional()
    .transform((v) => (v ? v.slice(0, 1500) : undefined)),
  modo_visita: z.enum(["presencial", "videollamada"]).optional(),
  fecha_visita: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  esquema_pago: z.enum(["financiado", "contado"]).optional(),
  idioma: z.enum(["es", "en"]).default("es"),
  utm_source: optionalText(150),
  utm_medium: optionalText(150),
  utm_campaign: optionalText(150),
  utm_content: optionalText(150),
  utm_term: optionalText(150),
  gclid: optionalText(300),
  fbclid: optionalText(300),
  pagina: optionalText(500),
  referrer: optionalText(500),
  // Anti-spam: campo trampa vacío y tiempo mínimo de llenado
  website: z.string().max(500).optional(),
  elapsed: z.number().min(0).optional(),
});

const qualifySchema = z.object({
  id: z.uuid(),
  token: z.uuid(),
  // Solo para el correo de aviso (el paso 2 no repite los datos de contacto)
  nombre: optionalText(120),
  telefono: optionalText(30),
  email: optionalText(160),
  idioma: z.enum(["es", "en"]).optional(),
  origen: optionalText(40),
  horizonte_compra: z.enum(["0-3", "3-6", "6-12", "explorando"]).optional(),
  forma_pago: z.enum(["contado", "credito", "infonavit", "usd"]).optional(),
  uso: z.enum(["segunda_casa", "renta", "vivir", "retiro", "broker"]).optional(),
  // Segundo paso del formulario
  interes: z.enum(INTERESES).optional(),
  proyecto: z.enum(PROYECTOS).optional(),
  modo_visita: z.enum(["presencial", "videollamada"]).optional(),
  fecha_visita: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  mensaje: z
    .string()
    .trim()
    .max(3000)
    .optional()
    .transform((v) => (v ? v.slice(0, 1500) : undefined)),
});

// Límite best-effort por instancia: 6 envíos por IP cada 10 minutos
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 6;
}

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function notifyWebhook(lead: Record<string, unknown>) {
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "lead.created", source: "legacy-capital-web", lead }),
      signal: AbortSignal.timeout(3500),
    });
  } catch (err) {
    console.error("[leads] webhook failed", err);
  }
}

const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "fmejiam@sisol.com.mx";
const PROYECTO_LABEL: Record<string, string> = { preventa: "Preventa", vinedos: "Entrega inmediata", general: "General" };

const dash = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : String(v));

/**
 * Avisa por correo a Fran con los datos del lead (mismo método que la landing de preventa: FormSubmit).
 * Nunca debe tumbar el envío del lead: si falla, solo se registra.
 */
async function notifyEmail(lead: Record<string, unknown>, kind: "nuevo" | "actualizacion") {
  if (!NOTIFY_EMAIL || process.env.LEAD_EMAIL_DISABLED === "1") return;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://legacycapitalmx.vercel.app";
  const proyecto = PROYECTO_LABEL[String(lead.proyecto ?? "general")] ?? "General";
  const nombre = dash(lead.nombre) ?? "Sin nombre";
  const mensaje = dash(lead.mensaje);
  const porEmail = mensaje?.startsWith("[Enviar por email]") || mensaje?.startsWith("[Send by email]");
  const subject =
    `${porEmail ? "ENVIAR POR EMAIL: " : ""}Legacy Capital · ${kind === "nuevo" ? "Nuevo lead" : "Lead actualizado"} · ${proyecto} · ${nombre}`;

  const fields: Record<string, string | undefined> = {
    Nombre: nombre,
    WhatsApp: dash(lead.telefono),
    Email: dash(lead.email),
    Proyecto: proyecto,
    Interes: dash(lead.interes),
    Perfil: dash(lead.perfil),
    Origen: dash(lead.origen),
    Mensaje: mensaje,
    Visita: [dash(lead.modo_visita), dash(lead.fecha_visita)].filter(Boolean).join(" · ") || undefined,
    Esquema_pago: dash(lead.esquema_pago),
    Horizonte_compra: dash(lead.horizonte_compra),
    Forma_pago: dash(lead.forma_pago),
    Uso: dash(lead.uso),
    Idioma: lead.idioma === "en" ? "Inglés (USD)" : "Español",
    Pagina: dash(lead.pagina),
    UTM: [lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_content, lead.utm_term].filter(Boolean).join(" / ") || undefined,
    Referrer: dash(lead.referrer),
    Fecha: new Date().toLocaleString("es-MX", { timeZone: "America/Tijuana" }),
  };
  const payload: Record<string, string> = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
  };
  if (typeof lead.email === "string" && lead.email) payload._replyto = lead.email;
  for (const [k, v] of Object.entries(fields)) if (v) payload[k] = v.slice(0, 1500);

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Origin: site, Referer: `${site}/` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) === "false") console.error("[leads] email failed", res.status, json.message);
  } catch (err) {
    console.error("[leads] email failed", err);
  }
}

async function notifyAll(lead: Record<string, unknown>, kind: "nuevo" | "actualizacion" = "nuevo") {
  await Promise.allSettled([notifyEmail(lead, kind), kind === "nuevo" ? notifyWebhook(lead) : Promise.resolve()]);
}

function clientIp(req: NextRequest) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 422 },
    );
  }

  const { website, elapsed, ...lead } = parsed.data;

  // Bots: respondemos 200 para no darles señal, pero no guardamos nada.
  if (website || (typeof elapsed === "number" && elapsed < 1500)) {
    return NextResponse.json({ ok: true, stored: false });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const record = {
    ...lead,
    user_agent: (req.headers.get("user-agent") || "").slice(0, 400),
  };

  const client = supabase();
  const secret = process.env.LEADS_RPC_SECRET;
  if (!client || !secret) {
    console.error("[leads] Supabase no configurado. Lead:", JSON.stringify(record));
    await notifyAll(record);
    return NextResponse.json({ ok: true, stored: false });
  }

  const { data, error } = await client.rpc("submit_lead", { payload: { ...record, secret } });
  if (error) {
    const limited = error.message?.includes("rate_limited");
    console.error("[leads] submit_lead error", error.message, JSON.stringify(record));
    if (limited) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    await notifyAll(record);
    return NextResponse.json({ ok: true, stored: false });
  }

  const result = data as { id: string; token: string };
  await notifyAll({ ...record, id: result.id });
  return NextResponse.json({ ok: true, stored: true, id: result.id, token: result.token });
}

export async function PATCH(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = qualifySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });

  const client = supabase();
  const secret = process.env.LEADS_RPC_SECRET;
  if (!client || !secret) return NextResponse.json({ ok: false, stored: false });

  const { data, error } = await client.rpc("qualify_lead", { payload: { ...parsed.data, secret } });
  if (error) {
    console.error("[leads] qualify_lead error", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (data) {
    const { id, token, ...detail } = parsed.data;
    void token;
    await notifyEmail({ ...detail, id }, "actualizacion");
  }
  return NextResponse.json({ ok: Boolean(data) });
}
