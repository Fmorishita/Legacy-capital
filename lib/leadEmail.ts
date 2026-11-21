// Aviso por correo a Fran con cada lead. Igual que la landing de la preventa: se envía desde el
// navegador a FormSubmit (desde los servidores de Vercel FormSubmit responde 403).
// El Origin del navegador es el dominio oficial, que es el que se activó en FormSubmit.
const ENDPOINT = "https://formsubmit.co/ajax/fmejiam@sisol.com.mx";

const PROYECTO: Record<string, string> = { preventa: "Preventa", vinedos: "Entrega inmediata", general: "General" };

export type LeadEmail = {
  kind: "nuevo" | "actualizacion";
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
  horizonte_compra?: string;
  forma_pago?: string;
  uso?: string;
  attr?: Record<string, string | undefined>;
};

export async function sendLeadEmail(l: LeadEmail): Promise<boolean> {
  const proyecto = PROYECTO[l.proyecto ?? "general"] ?? "General";
  const porEmail = /^\[(Enviar por email|Send by email)\]/.test(l.mensaje ?? "");
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .map((k) => l.attr?.[k])
    .filter(Boolean)
    .join(" / ");
  const fields: Record<string, string | undefined> = {
    Nombre: l.nombre,
    WhatsApp: l.telefono,
    Email: l.email,
    Proyecto: proyecto,
    Interes: l.interes,
    Perfil: l.perfil,
    Origen: l.origen,
    Mensaje: l.mensaje,
    Visita: [l.modo_visita, l.fecha_visita].filter(Boolean).join(" · "),
    Esquema_pago: l.esquema_pago,
    Horizonte_compra: l.horizonte_compra,
    Forma_pago: l.forma_pago,
    Uso: l.uso,
    Idioma: l.idioma === "en" ? "Inglés (USD)" : "Español",
    Pagina: location.origin + location.pathname,
    UTM: utm,
    Fecha: new Date().toLocaleString("es-MX", { timeZone: "America/Tijuana" }),
  };
  const payload: Record<string, string> = {
    _subject: `${porEmail ? "ENVIAR POR EMAIL: " : ""}Legacy Capital · ${l.kind === "nuevo" ? "Nuevo lead" : "Lead actualizado"} · ${proyecto} · ${l.nombre}`,
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
