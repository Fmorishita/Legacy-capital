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

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 520;
    if (next !== show) setShow(next);
  });

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
      openLead({ kind: "prices", origin: "exit-intent", title: exit.title, subtitle: exit.body });
    };
    document.addEventListener("mouseout", onOut);
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseout", onOut);
    };
  }, [openLead, exit.title, exit.body]);

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
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
              <a
                href={waLink(waGeneric)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { origin: "mobile-bar" })}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-semibold text-ink"
              >
                <WhatsappLogo className="size-6 text-[#1f8f4e] dark:text-[#5bd38b]" weight="fill" aria-hidden />
                {t.whatsapp}
              </a>
              <button
                type="button"
                onClick={() => openLead({ kind: "prices", origin: "mobile-bar" })}
                className="flex flex-col items-center gap-1 rounded-xl bg-btn py-1.5 text-xs font-semibold text-btn-ink"
              >
                <Tag className="size-6" weight="duotone" aria-hidden />
                {t.prices}
              </button>
              <button
                type="button"
                onClick={() => openLead({ kind: "visit", origin: "mobile-bar" })}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-semibold text-ink"
              >
                <CalendarCheck className="size-6 text-gold-ink" weight="duotone" aria-hidden />
                {t.visit}
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
            className="fixed bottom-6 right-6 z-40 hidden size-14 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-[0_18px_40px_-12px_rgb(3_8_18/0.55)] transition-transform hover:scale-105 lg:grid"
          >
            <WhatsappLogo className="size-7" weight="fill" aria-hidden />
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
