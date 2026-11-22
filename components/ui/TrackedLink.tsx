"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/track";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Evento de lib/track (p. ej. "whatsapp_click" o "phone_click"). */
  event: "whatsapp_click" | "phone_click";
  /** Dónde está el botón (aparece como content_name en Meta). */
  origin: string;
};

/** Enlace <a> que registra el evento de contacto al hacer clic. Sirve en componentes de servidor (p. ej. el pie). */
export function TrackedLink({ event, origin, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, { origin });
        onClick?.(e);
      }}
    />
  );
}
