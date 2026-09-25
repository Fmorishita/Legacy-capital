"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import type { Lang } from "@/lib/site";
import { captureAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/track";
import { LeadForm, type LeadDefaults } from "./LeadForm";

export type LeadKind = "prices" | "visit" | "lot" | "plan" | "model";

export type LeadRequest = LeadDefaults & {
  kind: LeadKind;
  origin: string;
  title?: string;
  subtitle?: string;
};

type Ctx = { openLead: (req: LeadRequest) => void };
const LeadContext = createContext<Ctx>({ openLead: () => {} });

export function useLead() {
  return useContext(LeadContext);
}

type Props = {
  t: Pick<Dict, "form" | "dialog" | "a11y" | "quickForm">;
  lang: Lang;
  privacyHref: string;
  children: React.ReactNode;
};

export function LeadProvider({ t, lang, privacyHref, children }: Props) {
  const [req, setReq] = useState<LeadRequest | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    captureAttribution();
  }, []);

  const openLead = useCallback((r: LeadRequest) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setReq(r);
    trackEvent("lead_open", { origin: r.origin, kind: r.kind });
  }, []);

  const close = useCallback(() => {
    setReq(null);
    requestAnimationFrame(() => lastFocus.current?.focus?.());
  }, []);

  return (
    <LeadContext.Provider value={{ openLead }}>
      {children}
      <AnimatePresence>
        {req && <LeadDialog key="dialog" req={req} t={t} lang={lang} privacyHref={privacyHref} onClose={close} />}
      </AnimatePresence>
    </LeadContext.Provider>
  );
}

function titleFor(req: LeadRequest, t: Props["t"], lang: Lang) {
  if (req.title) return req.title;
  const d = t.dialog;
  switch (req.kind) {
    case "visit":
      return d.visitTitle;
    case "lot":
      return d.lotTitle.replace("{lot}", String(req.lote ?? ""));
    case "plan":
      return d.planTitle;
    case "model": {
      const label = t.form.interests.find((i) => i.value === req.interes)?.label ?? "";
      return d.modelTitle.replace("{model}", lang === "en" ? label : label.toLowerCase());
    }
    default:
      return d.pricesTitle;
  }
}

function submitFor(req: LeadRequest, t: Props["t"]) {
  switch (req.kind) {
    case "visit":
      return t.form.submitVisit;
    case "lot":
      return t.form.submitLot;
    case "plan":
      return t.form.submitPlan;
    default:
      return t.form.submit;
  }
}

function LeadDialog({
  req,
  t,
  lang,
  privacyHref,
  onClose,
}: {
  req: LeadRequest;
  t: Props["t"];
  lang: Lang;
  privacyHref: string;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = "lead-dialog-title";

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const nodes = panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const isVisit = req.kind === "visit";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <motion.button
        type="button"
        aria-label={t.a11y.close}
        className="absolute inset-0 cursor-default bg-navy-950/60 backdrop-blur-[3px]"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-surface p-6 pb-8 text-ink shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.a11y.close}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-bg-alt hover:text-ink"
        >
          <X className="size-5" aria-hidden />
        </button>
        <div className="mb-6 pr-10">
          <img src="/brand/crest-64.png" alt="" width={32} height={32} className="mb-4 h-10 w-auto" />
          <h2 id={titleId} className="display text-[2rem] leading-[1.05]">
            {titleFor(req, t, lang)}
          </h2>
          {!isVisit && <p className="mt-2 text-ink-soft">{req.subtitle ?? t.quickForm.subtitle}</p>}
        </div>
        <LeadForm
          t={t.form}
          lang={lang}
          origin={req.origin}
          submitLabel={submitFor(req, t)}
          defaults={req}
          privacyHref={privacyHref}
          autoFocus
          fields={{
            interest: req.kind === "prices" || req.kind === "visit",
            visit: isVisit,
            email: isVisit,
          }}
        />
      </motion.div>
    </div>
  );
}
