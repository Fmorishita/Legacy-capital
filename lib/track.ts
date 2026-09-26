import { track } from "@vercel/analytics";

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

export function trackEvent(name: string, props: Record<string, string | number | undefined> = {}) {
  const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Record<
    string,
    string | number
  >;
  try {
    track(name, clean);
  } catch {
    /* noop */
  }
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag; dataLayer?: unknown[] };
  w.dataLayer?.push({ event: name, ...clean });
  if (name === "lead") {
    w.fbq?.("track", "Lead", { content_name: clean.origin, content_category: clean.interest });
    w.gtag?.("event", "generate_lead", clean);
  } else if (name === "whatsapp_click") {
    w.fbq?.("track", "Contact", { content_name: clean.origin });
    w.gtag?.("event", "contact_whatsapp", clean);
  } else {
    w.gtag?.("event", name, clean);
  }
}
