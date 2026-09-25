"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle, CircleNotch, WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { readAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/track";
import { waLink, type Lang } from "@/lib/site";

export type Interest = "2R" | "3R" | "inversion" | "segunda_casa" | "vivir" | "explorando";

export type Perfil = "ensenada" | "california" | "mexicoamericano" | "monterrey" | "cdmx" | "guadalajara";

export type LeadDefaults = {
  interes?: Interest;
  perfil?: Perfil;
  esquema_pago?: "financiado" | "contado";
  modo_visita?: "presencial" | "videollamada";
};

type Props = {
  t: Dict["form"];
  lang: Lang;
  origin: string;
  submitLabel: string;
  defaults?: LeadDefaults;
  fields?: { interest?: boolean; email?: boolean; visit?: boolean; message?: boolean };
  privacyHref: string;
  autoFocus?: boolean;
};

type Result = { stored: boolean; id?: string; token?: string };

const COUNTRY_CODES = [
  { code: "+52", label: "MX +52" },
  { code: "+1", label: "US +1" },
];

export function LeadForm({
  t,
  lang,
  origin,
  submitLabel,
  defaults,
  fields = { interest: true },
  privacyHref,
  autoFocus,
}: Props) {
  const uid = useId();
  const mountedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus({ preventScroll: true }), []);
  const [name, setName] = useState("");
  const [cc, setCc] = useState(lang === "en" ? "+1" : "+52");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interes, setInteres] = useState<Interest | undefined>(defaults?.interes);
  const [modo, setModo] = useState<LeadDefaults["modo_visita"]>(defaults?.modo_visita);
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    mountedAt.current = Date.now();
    // Fecha local del visitante (no UTC)
    setMinDate(new Date().toLocaleDateString("en-CA"));
    if (autoFocus) nameRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);


  const digits = phone.replace(/\D/g, "");
  const interestLabel = t.interests.find((i) => i.value === interes)?.label;
  const firstName = name.trim().split(/\s+/)[0] || "";

  const waMessage = t.waMessage
    .replace("{name}", name.trim() || "-")
    .replace("{interest}", interestLabel ? ` (${interestLabel.toLowerCase()})` : "");

  function validate() {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t.errors.name;
    if (digits.length !== 10) next.phone = t.errors.phone;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = t.errors.email;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    const attr = readAttribution();
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name.trim(),
          telefono: `${cc} ${digits}`,
          email: email.trim(),
          interes,
          perfil: defaults?.perfil,
          origen: origin,
          mensaje: mensaje.trim(),
          modo_visita: modo,
          fecha_visita: fecha,
          esquema_pago: defaults?.esquema_pago,
          idioma: lang,
          website: trap,
          elapsed: Date.now() - mountedAt.current,
          ...attr,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "error");
      setResult({ stored: Boolean(data.stored), id: data.id, token: data.token });
      setStatus("done");
      try {
        // Ya dejó sus datos: no mostrar el aviso de salida en esta sesión
        sessionStorage.setItem("lc_exit", "1");
      } catch {}
      trackEvent("lead", { origin, interest: interes, profile: defaults?.perfil, lang });
    } catch {
      setStatus("idle");
      setErrors({ form: t.errors.generic });
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status !== "done" ? (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-4"
        >
          <div className="grid gap-1.5">
            <label htmlFor={`${uid}-name`} className="text-sm font-medium">
              {t.name}
            </label>
            <input
              ref={nameRef}
              id={`${uid}-name`}
              className="field"
              autoComplete="name"
              placeholder={t.namePh}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${uid}-name-err` : undefined}
              maxLength={120}
            />
            {errors.name && (
              <p id={`${uid}-name-err`} className="text-sm text-[#b3261e] dark:text-[#ffb4a9]">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label htmlFor={`${uid}-phone`} className="text-sm font-medium">
              {t.phone}
            </label>
            <div className="flex gap-2">
              <select
                aria-label={lang === "en" ? "Country code" : "Código de país"}
                className="field w-[6.75rem] shrink-0 pr-2"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                id={`${uid}-phone`}
                className="field"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={t.phonePh}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d\s()-]/g, "").slice(0, 16))}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
              />
            </div>
            {errors.phone && (
              <p id={`${uid}-phone-err`} className="text-sm text-[#b3261e] dark:text-[#ffb4a9]">
                {errors.phone}
              </p>
            )}
          </div>

          {fields.email && (
            <div className="grid gap-1.5">
              <label htmlFor={`${uid}-email`} className="text-sm font-medium">
                {t.email}
              </label>
              <input
                id={`${uid}-email`}
                className="field"
                type="email"
                autoComplete="email"
                placeholder={t.emailPh}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                maxLength={160}
              />
              {errors.email && <p className="text-sm text-[#b3261e] dark:text-[#ffb4a9]">{errors.email}</p>}
            </div>
          )}

          {fields.interest && (
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">{t.interest}</legend>
              <div className="flex flex-wrap gap-2">
                {t.interests.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="chip"
                    aria-pressed={interes === opt.value}
                    onClick={() => setInteres(opt.value as Interest)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {fields.visit && (
            <div className="grid gap-4">
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium">{t.visitMode}</legend>
                <div className="flex flex-wrap gap-2">
                  {t.visitModes.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="chip"
                      aria-pressed={modo === opt.value}
                      onClick={() => setModo(opt.value as LeadDefaults["modo_visita"])}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-1.5">
                <label htmlFor={`${uid}-date`} className="text-sm font-medium">
                  {t.date}
                </label>
                <input
                  id={`${uid}-date`}
                  type="date"
                  className="field"
                  value={fecha}
                  min={minDate}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>
          )}

          {fields.message && (
            <div className="grid gap-1.5">
              <label htmlFor={`${uid}-msg`} className="text-sm font-medium">
                {t.message}
              </label>
              <textarea
                id={`${uid}-msg`}
                className="field min-h-24 resize-y"
                placeholder={t.messagePh}
                value={mensaje}
                maxLength={1500}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </div>
          )}

          {/* Campo trampa para bots: oculto a personas y lectores de pantalla */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </label>
          </div>

          {errors.form && (
            <p role="alert" className="rounded-xl border border-line-strong bg-bg-alt p-3 text-sm">
              {errors.form}{" "}
              <a
                className="font-semibold underline underline-offset-4"
                href={waLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-1 w-full" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <CircleNotch className="size-4 animate-spin" weight="bold" aria-hidden />
                {t.sending}
              </>
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="size-4" weight="bold" aria-hidden />
              </>
            )}
          </button>
          <p className="text-xs leading-relaxed text-ink-soft">
            {t.reassurance} {t.consent}{" "}
            <a href={privacyHref} className="underline underline-offset-2 hover:text-ink">
              {t.privacy}
            </a>
            .
          </p>
        </motion.form>
      ) : (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-1 size-7 shrink-0 text-gold-ink" weight="duotone" aria-hidden />
            <div>
              {/* Al montarse (tras la animación de salida del formulario) recibe el foco */}
              <p ref={focusOnMount} tabIndex={-1} className="display text-3xl outline-none">
                {t.success.title.replace("{name}", firstName)}
              </p>
              <p className="mt-2 text-ink-soft">{result?.stored ? t.success.body : t.success.fallback}</p>
            </div>
          </div>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold w-full"
            onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-success` })}
          >
            <WhatsappLogo className="size-5" weight="fill" aria-hidden />
            {t.success.whatsapp}
          </a>
          {result?.stored && result.id && result.token && (
            <Qualify t={t} id={result.id} token={result.token} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Qualify({ t, id, token }: { t: Dict["form"]; id: string; token: string }) {
  const [answers, setAnswers] = useState<{ horizonte_compra?: string; forma_pago?: string; uso?: string }>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const s = t.success;

  const groups = [
    { key: "horizonte_compra" as const, label: s.timeline, options: s.timelines },
    { key: "forma_pago" as const, label: s.payment, options: s.payments },
    { key: "uso" as const, label: s.use, options: s.uses },
  ];

  async function send() {
    if (!Object.keys(answers).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, ...answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("qualify");
      setState("done");
      trackEvent("lead_qualified");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return <p className="rounded-2xl border border-line bg-bg-alt p-4 text-sm">{s.qualifyDone}</p>;
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-line bg-bg-alt/60 p-4">
      <div>
        <p className="font-semibold">{s.qualifyTitle}</p>
        <p className="text-sm text-ink-soft">{s.qualifyOptional}</p>
      </div>
      {groups.map((g) => (
        <fieldset key={g.key} className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium">{g.label}</legend>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => (
              <button
                key={o.value}
                type="button"
                className="chip"
                aria-pressed={answers[g.key] === o.value}
                onClick={() => setAnswers((a) => ({ ...a, [g.key]: o.value }))}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      {state === "error" && (
        <p role="alert" className="text-sm text-[#b3261e] dark:text-[#ffb4a9]">
          {t.errors.generic}
        </p>
      )}
      <button
        type="button"
        onClick={send}
        disabled={!Object.keys(answers).length || state === "sending"}
        className="btn btn-ghost w-full disabled:opacity-50"
      >
        {state === "sending" ? <CircleNotch className="size-4 animate-spin" aria-hidden /> : null}
        {s.qualifySubmit}
      </button>
    </div>
  );
}
