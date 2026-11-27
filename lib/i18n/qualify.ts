import type { Lang } from "@/lib/site";

/**
 * Preguntas de filtro del formulario. Se contestan una por una, después de dejar nombre y WhatsApp,
 * y antes de confirmar el envío. Los valores coinciden con las columnas uso, horizonte_compra y
 * forma_pago de public.leads.
 */
export type QualifyKey = "uso" | "plazo" | "pago";
export type QualifyOption = { value: string; label: string; hint?: string };

export type QualifyCopy = {
  stepOf: string;
  back: string;
  detailsTitle: string;
  questions: Record<QualifyKey, { title: string; options: QualifyOption[] }>;
  deliverTitle: string;
  deliverHint: { email: string; whatsapp: string };
  /** Botón final cuando pidió el material por email: WhatsApp queda como canal directo opcional */
  waDirect: string;
  /** Resumen que se agrega al mensaje de WhatsApp final y a las etiquetas del correo */
  summary: { intro: string; uso: string; plazo: string; pago: string; via: string; email: string };
};

const es: QualifyCopy = {
  stepOf: "Paso {n} de {total}",
  back: "Atrás",
  detailsTitle: "Gracias, {name}. Cuéntame un poco más:",
  questions: {
    uso: {
      title: "¿Cuál es el propósito de tu propiedad?",
      options: [
        { value: "vivir", label: "Vivir en ella", hint: "Será mi casa principal" },
        { value: "descanso", label: "Descanso o retiro", hint: "Casa de fin de semana o para retirarme" },
        { value: "inversion", label: "Inversión", hint: "Ganar con la plusvalía y la renta" },
      ],
    },
    plazo: {
      title: "¿En qué plazo te gustaría adquirir la propiedad?",
      options: [
        { value: "0-3", label: "En menos de 3 meses" },
        { value: "3-6", label: "De 3 a 6 meses" },
        { value: "6-12", label: "De 6 a 12 meses" },
        { value: "12+", label: "En más de un año" },
      ],
    },
    pago: {
      title: "¿Cuál sería tu fuente de pago?",
      options: [
        { value: "propios", label: "Recursos propios" },
        { value: "credito", label: "Crédito hipotecario" },
        { value: "ambos", label: "Ambos", hint: "Recursos propios y crédito hipotecario" },
      ],
    },
  },
  deliverTitle: "Por último, ¿cómo prefieres recibirlo?",
  deliverHint: { email: "Te llega en PDF a tu correo", whatsapp: "Te lo envío por mensaje" },
  waDirect: "Escribirle a Fran por WhatsApp",
  summary: {
    intro: "Mis respuestas del formulario:",
    uso: "Propósito",
    plazo: "Plazo",
    pago: "Fuente de pago",
    via: "Recibirlo por",
    email: "Mi correo",
  },
};

const en: QualifyCopy = {
  stepOf: "Step {n} of {total}",
  back: "Back",
  detailsTitle: "Thanks, {name}. Tell me a bit more:",
  questions: {
    uso: {
      title: "What is the purpose of your property?",
      options: [
        { value: "vivir", label: "Live in it", hint: "It will be my main home" },
        { value: "descanso", label: "Getaway or retirement", hint: "A weekend home or a place to retire" },
        { value: "inversion", label: "Investment", hint: "Earn from appreciation and rental income" },
      ],
    },
    plazo: {
      title: "When would you like to buy?",
      options: [
        { value: "0-3", label: "Within 3 months" },
        { value: "3-6", label: "In 3 to 6 months" },
        { value: "6-12", label: "In 6 to 12 months" },
        { value: "12+", label: "In more than a year" },
      ],
    },
    pago: {
      title: "How would you pay for it?",
      options: [
        { value: "propios", label: "Own funds" },
        { value: "credito", label: "Mortgage" },
        { value: "ambos", label: "Both", hint: "Own funds and a mortgage" },
      ],
    },
  },
  deliverTitle: "Last step: how would you like to get it?",
  deliverHint: { email: "The PDF goes to your inbox", whatsapp: "I’ll send it by message" },
  waDirect: "Message Fran on WhatsApp",
  summary: {
    intro: "My answers from the form:",
    uso: "Purpose",
    plazo: "Timeline",
    pago: "Payment source",
    via: "Send it by",
    email: "My email",
  },
};

export const qualify: Record<Lang, QualifyCopy> = { es, en };

export const labelOf = (copy: QualifyCopy, key: QualifyKey, value?: string) =>
  copy.questions[key].options.find((o) => o.value === value)?.label;
