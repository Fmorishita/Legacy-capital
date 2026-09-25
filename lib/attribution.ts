const KEY = "lc_attr_v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "referrer" | "pagina", string>>;

/** Primer toque de la sesión: guarda UTMs / click ids y la página de entrada. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const fromUrl: Attribution = {};
    for (const p of PARAMS) {
      const v = url.searchParams.get(p);
      if (v) fromUrl[p] = v.slice(0, 300);
    }
    const existing = sessionStorage.getItem(KEY);
    if (existing && Object.keys(fromUrl).length === 0) return;
    const data: Attribution = {
      ...fromUrl,
      pagina: url.pathname + url.search,
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento bloqueado: seguimos sin atribución */
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    const data: Attribution = raw ? JSON.parse(raw) : {};
    return { ...data, pagina: data.pagina || window.location.pathname };
  } catch {
    return { pagina: window.location.pathname };
  }
}
