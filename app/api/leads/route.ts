import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const leadSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  telefono: z
    .string()
    .trim()
    .regex(/^\+\d{1,3} ?\d{8,14}$/),
  email: z
    .union([z.email().max(160), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  interes: z.enum(["2R", "3R", "inversion", "explorando"]).optional(),
  lote: z.number().int().min(1).max(500).optional(),
  origen: z.string().trim().max(40).default("web"),
  mensaje: optionalText(1500),
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
  horizonte_compra: z.enum(["0-3", "3-6", "6-12", "explorando"]).optional(),
  forma_pago: z.enum(["contado", "credito", "infonavit", "usd"]).optional(),
  uso: z.enum(["vivir", "retiro", "renta", "broker"]).optional(),
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
    await notifyWebhook(record);
    return NextResponse.json({ ok: true, stored: false });
  }

  const { data, error } = await client.rpc("submit_lead", { payload: { ...record, secret } });
  if (error) {
    const limited = error.message?.includes("rate_limited");
    console.error("[leads] submit_lead error", error.message, JSON.stringify(record));
    if (limited) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    await notifyWebhook(record);
    return NextResponse.json({ ok: true, stored: false });
  }

  const result = data as { id: string; token: string };
  await notifyWebhook({ ...record, id: result.id });
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
  return NextResponse.json({ ok: Boolean(data) });
}
