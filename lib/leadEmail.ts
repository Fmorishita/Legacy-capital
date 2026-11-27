// Aviso por correo a Fran con cada lead. Igual que la landing de la preventa: se envía desde el
// navegador a FormSubmit (desde los servidores de Vercel FormSubmit responde 403).
// El Origin del navegador es el dominio oficial, que es el que se activó en FormSubmit.
const ENDPOINT = "https://formsubmit.co/ajax/fmejiam@sisol.com.mx";

const PROYECTO: Record<string, string> = { preventa: "Preventa", vinedos: "Entrega inmediata", general: "General" };

export type LeadEmail = {
  /** nuevo: dejó nombre y WhatsApp (paso 1); completo: contestó todo el formulario */
  kind: "nuevo" | "completo";
  nombre: string;
  telefono: string;
  email?: string;
  proyecto?: string;
  interes?: string;
  perfil?: string;
  origen?: string;
  mensaje?: string;
  modo_visita?: string;
  fecha_visita?: string;
  esquema_pago?: string;
  idioma?: string;
  /** Respuestas ya traducidas a texto legible */
  proposito?: string;
  plazo?: string;
  fuente_pago?: string;
  entrega?: string;
  paso?: string;
  attr?: Record<string, string | undefined>;
};

/** De dónde llegó: link con UTM, anuncio de Meta/Google, otra página o directo. */
export function trafficSource(attr: Record<string, string | undefined> = {}): string {
  if (attr.utm_source) {
    return [attr.utm_source, attr.utm_medium, attr.utm_campaign, attr.utm_content].filter(Boolean).join(" · ");
  }
  if (attr.fbclid) return "Meta (Facebook/Instagram) · clic sin UTM";
  if (attr.gclid) return "Google Ads";
  if (attr.referrer) {
    try {
      const host = new URL(attr.referrer).hostname.replace(/^www\./, "");
      if (host && host !== location.hostname) return `Referido · ${host}`;
    } catch {
      /* referrer inválido */
    }
  }
  return "Directo (sin UTM ni referido)";
}

export async function sendLeadEmail(l: LeadEmail): Promise<boolean> {
  const proyecto = PROYECTO[l.proyecto ?? "general"] ?? "General";
  const porEmail = /^\[(Enviar por email|Send by email)\]/.test(l.mensaje ?? "");
  const fields: Record<string, string | undefined> = {
    Estado: l.kind === "completo" ? "Formulario completo" : `Solo contacto${l.paso ? ` (${l.paso})` : ""}: aún no termina las preguntas`,
    Nombre: l.nombre,
    WhatsApp: l.telefono,
    Email: l.email,
    Proyecto: proyecto,
    Proposito: l.proposito,
    Plazo: l.plazo,
    Fuente_de_pago: l.fuente_pago,
    Entrega: l.entrega,
    Interes: l.interes,
    Perfil: l.perfil,
    Origen: l.origen,
    Mensaje: l.mensaje,
    Visita: [l.modo_visita, l.fecha_visita].filter(Boolean).join(" · "),
    Esquema_pago: l.esquema_pago,
    Idioma: l.idioma === "en" ? "Inglés (USD)" : "Español",
    Fuente_del_trafico: trafficSource(l.attr),
    Pagina: location.origin + location.pathname,
    Pagina_de_entrada: l.attr?.pagina,
    Fecha: new Date().toLocaleString("es-MX", { timeZone: "America/Tijuana" }),
  };
  const head = l.kind === "completo" ? "Lead completo" : "Nuevo contacto (incompleto)";
  const payload: Record<string, string> = {
    _subject: `${porEmail ? "ENVIAR POR EMAIL: " : ""}Legacy Capital · ${head} · ${proyecto} · ${l.nombre}`,
    _template: "table",
    _captcha: "false",
  };
  if (l.email) payload._replyto = l.email;
  for (const [k, v] of Object.entries(fields)) if (v) payload[k] = v.slice(0, 1500);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && String(json.success) !== "false";
  } catch {
    return false;
  }
}
