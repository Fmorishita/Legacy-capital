"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { WhatsappLogo, Tag, CalendarCheck } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { waLink } from "@/lib/site";
import { trackEvent } from "@/lib/track";
import { useLead } from "@/components/lead/LeadProvider";

type Props = { t: Dict["mobileBar"]; exit: Dict["exit"]; waGeneric: string; label: string };

/** Barra fija en móvil (WhatsApp, precios, visita), botón de WhatsApp en escritorio y aviso de salida (solo escritorio, una vez por sesión). */
export function FloatingActions({ t, exit, waGeneric, label }: Props) {
  const { openLead } = useLead();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const exitArmed = useRef(false);

  const [tip, setTip] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 520;
    if (next !== show) setShow(next);
  });

  // La burbuja "¿Dudas? Escríbeme" aparece una vez, unos segundos después de mostrarse el botón
  useEffect(() => {
    if (!show) return;
    const a = setTimeout(() => setTip(true), 2500);
    const b = setTimeout(() => setTip(false), 9500);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [show]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    if (!desktop) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("lc_exit") === "1";
    } catch {}
    if (seen) return;
    const arm = setTimeout(() => (exitArmed.current = true), 15_000);
    const onOut = (e: MouseEvent) => {
      if (!exitArmed.current || e.clientY > 8 || e.relatedTarget) return;
      try {
        if (sessionStorage.getItem("lc_exit") === "1") return;
      } catch {}
      exitArmed.current = false;
      try {
        sessionStorage.setItem("lc_exit", "1");
      } catch {}
      document.removeEventListener("mouseout", onOut);
      openLead({ kind: "prices", origin: "exit-intent", title: exit.title, subtitle: exit.body, pics: exit.pics });
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, [openLead, exit.title, exit.body, exit.pics]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.nav
            key="bar"
            aria-label={label}
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a1a2e]/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 text-white backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-md grid-cols-[1fr_1.5fr_1fr] items-center gap-2">
              <a
                href={waLink(waGeneric)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { origin: "mobile-bar" })}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-medium"
              >
                <WhatsappLogo className="wiggle size-6 text-[#5be38e]" weight="fill" aria-hidden />
                {t.whatsapp}
              </a>
              <button
                type="button"
                onClick={() => openLead({ kind: "visit", origin: "mobile-bar" })}
                className="btn btn-gold btn-glow w-full px-3 py-3 text-[0.9rem]"
              >
                <CalendarCheck className="size-5" weight="duotone" aria-hidden />
                {t.visit}
              </button>
              <button
                type="button"
                onClick={() => openLead({ kind: "prices", origin: "mobile-bar" })}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-medium"
              >
                <Tag className="size-6 text-[#ddbb84]" weight="duotone" aria-hidden />
                {t.prices}
              </button>
            </div>
          </motion.nav>
          <motion.a
            key="fab"
            href={waLink(waGeneric)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.whatsapp}
            onClick={() => trackEvent("whatsapp_click", { origin: "fab" })}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fab-ring group fixed bottom-6 right-6 z-40 hidden size-[3.75rem] place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_34px_-10px_rgb(37_211_102/0.7)] transition-transform hover:-translate-y-0.5 hover:scale-105 lg:grid"
          >
            <WhatsappLogo className="wiggle size-8" weight="fill" aria-hidden />
            {t.ask && (
              <span
                className={`pointer-events-none absolute right-[4.6rem] whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0a1a2e] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.35)] transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 ${
                  tip ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                }`}
              >
                {t.ask}
              </span>
            )}
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
