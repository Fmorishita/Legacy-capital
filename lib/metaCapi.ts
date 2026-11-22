import { createHash } from "node:crypto";
import { site } from "@/lib/site";

/**
 * API de conversiones de Meta (servidor → Meta) para el evento Lead.
 *
 * Convive con el píxel del navegador: ambos envían el mismo `event_id` y Meta cuenta el evento una sola vez.
 * Si el visitante bloquea el píxel, este envío conserva el Lead.
 *
 * Es inerte mientras no exista `META_CAPI_TOKEN` en Vercel (token del conjunto de datos, Events Manager → Configuración).
 * Teléfono, correo y nombre viajan cifrados (SHA-256) como pide Meta; IP y user agent van en claro.
 */

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export type MetaLeadSignal = {
  eventId?: string;
  nombre: string;
  telefono: string;
  email?: string;
  origen: string;
  interes?: string;
  pagina?: string;
  fbclid?: string;
  ip: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
};

function eventUrl(pagina?: string) {
  if (!pagina) return site.url;
  if (/^https?:\/\//i.test(pagina)) return pagina;
  return `${site.url}${pagina.startsWith("/") ? "" : "/"}${pagina}`;
}

export async function sendMetaLead(l: MetaLeadSignal): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  // Sin event_id no hay forma de deduplicar contra el píxel: mejor no enviar que contar doble.
  if (!token || !pixel || !l.eventId) return;

  const phone = l.telefono.replace(/\D/g, "");
  const [first, ...rest] = l.nombre.trim().toLowerCase().split(/\s+/);
  const email = l.email?.trim().toLowerCase();
  const now = Math.floor(Date.now() / 1000);
  // Si no hay cookie _fbc pero llegó con fbclid, Meta acepta reconstruirla así
  const fbc = l.fbc || (l.fbclid ? `fb.1.${now * 1000}.${l.fbclid}` : undefined);

  const userData: Record<string, unknown> = {
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(email ? { em: [sha256(email)] } : {}),
    ...(first ? { fn: [sha256(first)] } : {}),
    ...(rest.length ? { ln: [sha256(rest.join(" "))] } : {}),
    ...(l.fbp ? { fbp: l.fbp } : {}),
    ...(fbc ? { fbc } : {}),
    ...(l.ip && l.ip !== "unknown" ? { client_ip_address: l.ip } : {}),
    ...(l.userAgent ? { client_user_agent: l.userAgent } : {}),
  };

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: now,
        event_id: l.eventId,
        action_source: "website",
        event_source_url: eventUrl(l.pagina),
        user_data: userData,
        custom_data: { content_name: l.origen, ...(l.interes ? { content_category: l.interes } : {}) },
      },
    ],
    // Opcional: código de "Probar eventos" para ver el envío del servidor sin mezclarlo con los datos reales
    ...(process.env.META_CAPI_TEST_CODE ? { test_event_code: process.env.META_CAPI_TEST_CODE } : {}),
    access_token: token,
  };

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      // No se registra el cuerpo enviado (lleva datos personales cifrados) ni el token
      console.error("[capi] Meta respondió", res.status, (await res.text().catch(() => "")).slice(0, 300));
    }
  } catch (err) {
    console.error("[capi] envío fallido", err instanceof Error ? err.message : "error");
  }
}
