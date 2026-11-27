"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, CaretRight, CheckCircle, CircleNotch, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import type { Dict } from "@/lib/i18n/es";
import { readAttribution } from "@/lib/attribution";
import { newEventId, readMetaCookies, trackEvent } from "@/lib/track";
import { sendLeadEmail } from "@/lib/leadEmail";
import { labelOf, qualify, type QualifyKey } from "@/lib/i18n/qualify";
import { waLink, type Lang } from "@/lib/site";
import type { LeadProject } from "@/lib/projects";
import { useLead } from "./context";

export type Interest =
  | "2R"
  | "3R"
  | "inversion"
  | "segunda_casa"
  | "vivir"
  | "explorando"
  // Entrega inmediata: tipo de producto y modelo
  | "depa"
  | "ph"
  | "casa"
  | "palomino"
  | "palomino_ph"
  | "azur"
  | "teide";

export type Perfil = "tijuana" | "mexicali" | "california" | "cdmx" | "monterrey" | "guadalajara" | "ensenada" | "mexicoamericano";

export type LeadDefaults = {
  interes?: Interest;
  perfil?: Perfil;
  proyecto?: LeadProject;
  esquema_pago?: "financiado" | "contado";
  modo_visita?: "presencial" | "videollamada";
};

type Props = {
  t: Dict["form"];
  lang: Lang;
  origin: string;
  submitLabel: string;
  defaults?: LeadDefaults;
  /** project: pregunta qué proyecto le interesa (solo en páginas sin proyecto, como la principal) */
  fields?: { interest?: boolean; email?: boolean; visit?: boolean; message?: boolean; project?: boolean };
  privacyHref: string;
  autoFocus?: boolean;
  /** Mensaje de WhatsApp y texto de éxito propios (p. ej. para el brochure) */
  waTemplate?: string;
  successBody?: string;
  /** Material exclusivo: el prospecto elige si lo recibe por WhatsApp o por email (en inglés, email por defecto) */
  deliver?: boolean;
};

type Result = { stored: boolean; id?: string; token?: string };
type Step = "contact" | "details" | QualifyKey | "entrega";

/** Opciones de interés que ya cubre la pregunta de propósito: no se preguntan dos veces */
const PURPOSE_INTERESTS = new Set(["segunda_casa", "inversion", "vivir", "explorando"]);
const INTEREST_FROM_USO: Record<string, Interest> = { vivir: "vivir", descanso: "segunda_casa", inversion: "inversion" };

const COUNTRY_CODES = [
  { code: "+52", label: "MX +52" },
  { code: "+1", label: "US +1" },
];


const optionBase =
  "group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";
const optionIdle = "border-[var(--field-line)] hover:border-ink";
const optionOn = "border-gold-500 bg-gold-500/12 shadow-[inset_0_0_0_1px_var(--color-gold-500)]";

/**
 * Formulario de un solo flujo, por pasos: nombre y WhatsApp (ahí ya se guarda el lead y Fran recibe
 * un aviso de contacto), luego el detalle de la visita si aplica, tres preguntas de filtro una por una
 * y, en el material exclusivo, cómo lo quiere recibir. La confirmación solo aparece al terminar todo.
 */
export function LeadForm({
  t,
  lang,
  origin,
  submitLabel,
  defaults,
  fields = { interest: true },
  privacyHref,
  autoFocus,
  waTemplate,
  successBody,
  deliver,
}: Props) {
  const uid = useId();
  const q = qualify[lang];
  const { project: pageProject } = useLead();
  const mountedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const focusOnMount = useCallback((el: HTMLElement | null) => el?.focus({ preventScroll: true }), []);
  const [name, setName] = useState("");
  const [cc, setCc] = useState(lang === "en" ? "+1" : "+52");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interes, setInteres] = useState<Interest | undefined>(defaults?.interes);
  const [proyecto, setProyecto] = useState<LeadProject | undefined>(defaults?.proyecto ?? pageProject);
  const askProject = Boolean(fields.project && !defaults?.proyecto && !pageProject);
  const [modo, setModo] = useState<LeadDefaults["modo_visita"]>(defaults?.modo_visita);
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [trap, setTrap] = useState("");
  const [via, setVia] = useState<"whatsapp" | "email" | undefined>(undefined);
  const [answers, setAnswers] = useState<Partial<Record<QualifyKey, string>>>({});
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; form?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "saving" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const attrRef = useRef<Record<string, string | undefined>>({});

  // El interés solo se pregunta cuando no es lo mismo que el propósito (p. ej. tipo de producto)
  const showInterest = Boolean(fields.interest && !t.interests.every((i) => PURPOSE_INTERESTS.has(i.value)));
  const hasDetails = showInterest || Boolean(fields.visit || fields.message);
  const steps: Step[] = ["contact", ...(hasDetails ? (["details"] as const) : []), "uso", "plazo", "pago", ...(deliver ? (["entrega"] as const) : [])];
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];
  const total = steps.length;
  const isLast = stepIdx === total - 1;
  const byEmail = Boolean(deliver && via === "email");

  useEffect(() => {
    mountedAt.current = Date.now();
    // Fecha local del visitante (no UTC)
    setMinDate(new Date().toLocaleDateString("en-CA"));
    if (autoFocus) nameRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const digits = phone.replace(/\D/g, "");
  const firstName = name.trim().split(/\s+/)[0] || "";
  const finalInteres = interes ?? (answers.uso ? INTEREST_FROM_USO[answers.uso] : undefined);
  const interestLabel = t.interests.find((i) => i.value === finalInteres)?.label;
  const projectPhrase = t.projects.find((p) => p.value === (proyecto ?? "general"))?.wa ?? "";
  const baseWa = (waTemplate ?? t.waMessage)
    .replace("{name}", name.trim() || "-")
    .replace("{project}", projectPhrase)
    .replace("{interest}", interestLabel ? ` (${interestLabel.toLowerCase()})` : "");
  const summaryLines = [
    [q.summary.uso, labelOf(q, "uso", answers.uso)],
    [q.summary.plazo, labelOf(q, "plazo", answers.plazo)],
    [q.summary.pago, labelOf(q, "pago", answers.pago)],
    [q.summary.via, via ? (via === "email" ? t.deliver.email : t.deliver.whatsapp) : undefined],
    [q.summary.email, email.trim() || undefined],
  ].filter(([, v]) => v);
  // Mensaje de WhatsApp final: lo que pidió y todo lo que ya contestó, para no repetir preguntas
  const waMessage = summaryLines.length
    ? `${baseWa}\n\n${q.summary.intro}\n${summaryLines.map(([k, v]) => `• ${k}: ${v}`).join("\n")}`
    : baseWa;
  const deliverTag = deliver && via ? `[${via === "email" ? t.deliver.tagEmail : t.deliver.tagWhatsapp}]` : "";

  const isBot = () => Boolean(trap) || Date.now() - mountedAt.current < 1500;

  function validateContact() {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t.errors.name;
    if (digits.length !== 10) next.phone = t.errors.phone;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = t.errors.email;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Paso 1: el lead queda guardado y Fran recibe el contacto aunque no termine el resto
  async function onContact(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || !validateContact()) return;
    setStatus("sending");
    const attr = readAttribution();
    attrRef.current = attr as Record<string, string | undefined>;
    const eventId = newEventId();
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
          proyecto: proyecto ?? "general",
          origen: origin,
          modo_visita: modo,
          esquema_pago: defaults?.esquema_pago,
          idioma: lang,
          website: trap,
          elapsed: Date.now() - mountedAt.current,
          event_id: eventId,
          ...readMetaCookies(),
          ...attr,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "error");
      setResult({ stored: Boolean(data.stored), id: data.id, token: data.token });
      if (!isBot()) {
        void sendLeadEmail({
          kind: "nuevo",
          paso: `paso 1 de ${total}`,
          nombre: name.trim(),
          telefono: `${cc} ${digits}`,
          email: email.trim(),
          proyecto: proyecto ?? "general",
          interes,
          perfil: defaults?.perfil,
          origen: origin,
          idioma: lang,
          attr: attrRef.current,
        });
      }
      try {
        // Ya dejó sus datos: no mostrar el aviso de salida en esta sesión
        sessionStorage.setItem("lc_exit", "1");
      } catch {}
      trackEvent("lead", { origin, interest: interes, profile: defaults?.perfil, project: proyecto ?? "general", lang }, { eventId });
      setStatus("idle");
      setStepIdx(1);
    } catch {
      setStatus("idle");
      setErrors({ form: t.errors.generic });
    }
  }

  function goNext() {
    setErrors({});
    setStepIdx((i) => Math.min(i + 1, total - 1));
    trackEvent("form_step", { origin, step: steps[Math.min(stepIdx + 1, total - 1)] });
  }

  function goBack() {
    setErrors({});
    // El contacto ya se envió: el regreso llega hasta la primera pregunta
    setStepIdx((i) => Math.max(i - 1, 1));
  }

  function choose(key: QualifyKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    // Avanza solo al elegir; en el último paso espera el botón de enviar
    if (!isLast) window.setTimeout(goNext, 260);
  }

  // Último paso: se completa el lead (mismo registro) y ahora sí se confirma
  async function onFinish(e?: React.FormEvent) {
    e?.preventDefault();
    if (status === "saving") return;
    if (deliver) {
      if (!via) return;
      if (via === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
        setErrors({ email: email.trim() ? t.errors.email : t.deliver.emailRequired });
        return;
      }
    }
    setStatus("saving");
    const fullMessage = [deliverTag, mensaje.trim()].filter(Boolean).join(" ");
    if (result?.stored && result.id && result.token) {
      try {
        await fetch("/api/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: result.id,
            token: result.token,
            email: email.trim(),
            interes: finalInteres,
            uso: answers.uso,
            horizonte_compra: answers.plazo,
            forma_pago: answers.pago,
            modo_visita: modo,
            fecha_visita: fecha,
            mensaje: fullMessage,
          }),
        });
      } catch {
        // El lead ya está guardado desde el paso 1; las respuestas también viajan en el correo
      }
    }
    if (!isBot()) {
      void sendLeadEmail({
        kind: "completo",
        nombre: name.trim(),
        telefono: `${cc} ${digits}`,
        email: email.trim(),
        proyecto: proyecto ?? "general",
        interes: finalInteres,
        perfil: defaults?.perfil,
        origen: origin,
        mensaje: fullMessage,
        modo_visita: modo,
        fecha_visita: fecha,
        esquema_pago: defaults?.esquema_pago,
        idioma: lang,
        proposito: labelOf(q, "uso", answers.uso),
        plazo: labelOf(q, "plazo", answers.plazo),
        fuente_pago: labelOf(q, "pago", answers.pago),
        entrega: via ? (via === "email" ? "Email" : "WhatsApp") : undefined,
        attr: attrRef.current,
      });
    }
    if (hasDetails) trackEvent("lead_step2", { origin, interest: finalInteres, visit: modo });
    trackEvent("lead_complete", { origin, use: answers.uso, timeline: answers.plazo, payment: answers.pago, via });
    setStatus("done");
  }

  const progress = (
    <div className="grid gap-2">
      <div className="flex min-h-6 items-center justify-between gap-3">
        {stepIdx > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" weight="bold" aria-hidden />
            {q.back}
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
          {q.stepOf.replace("{n}", String(stepIdx + 1)).replace("{total}", String(total))}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-line-strong/50"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(((stepIdx + 1) / total) * 100)}
      >
        <div
          className="h-full rounded-full bg-gold-500 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${((stepIdx + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );

  const submitButton = (label: string, disabled?: boolean) => (
    <button type="submit" className="btn btn-primary mt-1 w-full disabled:opacity-50" disabled={disabled || status === "saving"}>
      {status === "saving" ? (
        <>
          <CircleNotch className="size-4 animate-spin" weight="bold" aria-hidden />
          {t.sending}
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="size-4" weight="bold" aria-hidden />
        </>
      )}
    </button>
  );

  const motionProps = {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -18 },
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
  };

  if (status === "done") {
    return (
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
            <p ref={focusOnMount} tabIndex={-1} className="display text-3xl outline-none">
              {t.success.title.replace("{name}", firstName)}
            </p>
            <p className="mt-2 text-ink-soft">
              {result?.stored ? (byEmail ? t.deliver.successEmail : (successBody ?? t.success.body)) : t.success.fallback}
            </p>
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
          {byEmail ? q.waDirect : t.success.whatsapp}
        </a>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "contact" ? (
        <motion.form key="contact" onSubmit={onContact} noValidate {...motionProps} className="grid gap-4">
          {progress}
          {askProject && (
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">{t.project}</legend>
              <div className="flex flex-wrap gap-2">
                {t.projects.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="chip"
                    aria-pressed={proyecto === opt.value}
                    onClick={() => setProyecto(opt.value as LeadProject)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
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

          {(fields.email || deliver) && (
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
                href={waLink(baseWa)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-error` })}
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
                {t.next}
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
      ) : step === "details" ? (
        <motion.form
          key="details"
          onSubmit={(e) => {
            e.preventDefault();
            goNext();
          }}
          noValidate
          {...motionProps}
          className="grid gap-4"
        >
          {progress}
          <p ref={focusOnMount} tabIndex={-1} className="display text-2xl leading-tight outline-none">
            {q.detailsTitle.replace("{name}", firstName)}
          </p>
          {showInterest && (
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
                <input id={`${uid}-date`} type="date" className="field" value={fecha} min={minDate} onChange={(e) => setFecha(e.target.value)} />
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
          <button type="submit" className="btn btn-primary mt-1 w-full">
            {t.next}
            <ArrowRight className="size-4" weight="bold" aria-hidden />
          </button>
        </motion.form>
      ) : step === "entrega" ? (
        <motion.form key="entrega" onSubmit={onFinish} noValidate {...motionProps} className="grid gap-4">
          {progress}
          <p ref={focusOnMount} tabIndex={-1} className="display text-2xl leading-tight outline-none">
            {q.deliverTitle}
          </p>
          <div className="grid gap-2.5" role="radiogroup" aria-label={q.deliverTitle}>
            {(lang === "en" ? (["email", "whatsapp"] as const) : (["whatsapp", "email"] as const)).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={via === v}
                onClick={() => {
                  setVia(v);
                  setErrors({});
                }}
                className={`${optionBase} ${via === v ? optionOn : optionIdle}`}
              >
                <span className="flex items-center gap-3">
                  {v === "email" ? (
                    <EnvelopeSimple className="size-5 text-gold-ink" weight="duotone" aria-hidden />
                  ) : (
                    <WhatsappLogo className="size-5 text-[#1f8f4e]" weight="fill" aria-hidden />
                  )}
                  <span>
                    <span className="block font-medium">{v === "email" ? t.deliver.email : t.deliver.whatsapp}</span>
                    <span className="block text-sm text-ink-soft">{q.deliverHint[v]}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          {via === "email" && (
            <div className="grid gap-1.5">
              <label htmlFor={`${uid}-email2`} className="text-sm font-medium">
                {t.deliver.emailLabel}
              </label>
              <input
                id={`${uid}-email2`}
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
          {submitButton(submitLabel, !via)}
        </motion.form>
      ) : (
        <motion.form key={step} onSubmit={onFinish} noValidate {...motionProps} className="grid gap-4">
          {progress}
          <p ref={focusOnMount} tabIndex={-1} className="display text-2xl leading-tight outline-none">
            {q.questions[step].title}
          </p>
          <div className="grid gap-2.5" role="radiogroup" aria-label={q.questions[step].title}>
            {q.questions[step].options.map((o) => {
              const on = answers[step] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(step, o.value)}
                  className={`${optionBase} ${on ? optionOn : optionIdle}`}
                >
                  <span>
                    <span className="block font-medium">{o.label}</span>
                    {o.hint && <span className="block text-sm text-ink-soft">{o.hint}</span>}
                  </span>
                  <CaretRight
                    className={`size-4 shrink-0 transition-transform ${on ? "text-gold-ink" : "text-ink-soft group-hover:translate-x-0.5"}`}
                    weight="bold"
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
          {isLast ? (
            submitButton(submitLabel, !answers[step])
          ) : answers[step] ? (
            <button type="button" onClick={goNext} className="btn btn-ghost w-full">
              {t.next}
              <ArrowRight className="size-4" weight="bold" aria-hidden />
            </button>
          ) : null}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
