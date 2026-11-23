/**
 * Landings VSL por buyer persona (tráfico de Meta Ads). Misma regla de marca que el resto del sitio:
 * no se publica el nombre comercial del desarrollo ni del desarrollador; se revela en la llamada.
 * Cifras: lib/money.ts (lista nov 2026) y Guía del Perfil Inversionista. La plusvalía siempre se rotula
 * como escenario estimado; el índice SHF es estatal, no un rendimiento del proyecto.
 */

export type VslPersonaId = "doctores" | "empresarios" | "retiro";

export type VslStep = {
  tag: string;
  title: string;
  problem: string[];
  solution: string[];
  result: string;
};

export type VslCopy = {
  meta: { title: string; description: string };
  pill: string;
  title: string;
  sub: string;
  risk: string;
  video: { src: string; poster: string; captions: string; label: string; demoNote?: string };
  checks: [string, string];
  cta: string;
  ctaAlt: string;
  promise: { quote: string; by: string };
  audience: { kicker: string; title: string };
  proof: { value: string; label: string }[];
  how: { kicker: string; title: string; lead: string; steps: VslStep[] };
  tabs: { kicker: string; title: string; ctaLabel: string };
  fit: { title: string; yes: string[]; no: string[]; note: string };
  features: { title: string; items: { title: string; text: string; img: string; alt: string }[] };
  trust: { kicker: string; title: string; items: { title: string; text: string }[]; disclaimer: string };
  advisor: { kicker: string; title: string; text: string; img: string };
  final: {
    title: string;
    lead: string;
    zoom: { title: string; text: string; cta: string };
    visit: { title: string; text: string; cta: string };
    scarcity: string;
  };
  faq: { title: string; items: { q: string; a: string }[] };
  legal: string;
};

/** Pestañas "un mismo método, tres perfiles" (equivalente a Coaches / Agencias / SaaS). */
export const personaTabs: Record<VslPersonaId, { label: string; problem: string; solution: string }> = {
  doctores: {
    label: "Médicos",
    problem:
      "Trabajas jornadas largas, tu dinero está quieto en el banco y las vacaciones son en hotel, pagando y sin construir nada.",
    solution:
      "Una casa con vista al mar que apartas con el 10%, que usas para descansar en pareja y que puede rentarse cuando no estás. Tú no administras: la cerradura, el clima y las luces se controlan desde el celular.",
  },
  empresarios: {
    label: "Dueños de empresa",
    problem:
      "El 80–90% de tu patrimonio está en tu negocio y tu liquidez es su oxígeno. Diversificar suele pedir millones de contado.",
    solution:
      "Controlas un activo de ~$4 MDP con alrededor del 20% durante la obra. El 80% se paga hasta la entrega, de contado o con crédito hipotecario.",
  },
  retiro: {
    label: "Pre-retiro",
    problem:
      "Quieres vivir frente al mar sin escaleras de por medio, cerca de hospitales y servicios, y sin arriesgar tus ahorros de golpe.",
    solution:
      "Casa de un nivel con roof garden, hospitales a ~7 min y súper a ~3 min. Apartas hoy a precio de preventa y te mudas en 2028.",
  },
};

export const vsl: Record<"doctores", VslCopy> = {
  doctores: {
    meta: {
      title: "Doctor: tu casa frente al mar pagando hoy el 10% · Legacy Capital",
      description:
        "Mira el video antes de agendar: para quién es, para quién no, y cómo funciona el Método Legacy 10·10·80 en una preventa privada con vista al mar en Ensenada.",
    },
    pill: "Asesoría patrimonial · Preventa privada en Ensenada",
    title: "Doctor: tu casa frente al mar, *pagando hoy solo el 10%.*",
    sub: "Tú cuidas la salud de otros. Nosotros te ayudamos a cuidar tu patrimonio, con una casa que disfrutas en pareja y que puede rentarse cuando no la usas.",
    risk: "Mira el video antes de agendar. Si no es para ti, te lo digo en la llamada.",
    video: {
      src: "/media/video/vsl-demo-doctor.mp4",
      poster: "/media/video/vsl-demo-doctor.jpg",
      captions: "/media/video/vsl-demo-doctor.vtt",
      label: "Video: por qué un médico invierte en esta preventa con vista al mar",
      demoNote: "Video de muestra (anuncio Doctor V9). Aquí va el VSL completo de 8–10 min.",
    },
    checks: ["Apartas con el 10%", "Te acompaño hasta tus llaves"],
    cta: "Agendar mi Zoom de 30 min",
    ctaAlt: "Prefiero visitar en persona",
    promise: {
      quote:
        "En la llamada te enseño el proyecto, las casas que siguen disponibles y tu corrida con números reales. Sin presión: si no te conviene, te lo digo.",
      by: "Fran Morishita · Asesor patrimonial, Legacy Capital",
    },
    audience: { kicker: "Para quién es", title: "Médicos y profesionales de la salud que quieren que su dinero trabaje sin quitarles tiempo" },
    proof: [
      { value: "30+", label: "proyectos terminados del desarrollador" },
      { value: "5 años", label: "de garantía estructural por escrito" },
      { value: "+10.3%", label: "índice SHF de vivienda en BC (4T 2025)" },
    ],
    how: {
      kicker: "Cómo funciona",
      title: "El Método Legacy *10·10·80* en tres pasos",
      lead: "Construir patrimonio sin descapitalizarte.",
      steps: [
        {
          tag: "Primer paso",
          title: "Aparta con el 10% y asegura precio de preventa",
          problem: [
            "Tu dinero en el banco o en CETES apenas le gana a la inflación.",
            "Comprar terminado cuesta más: pagas la plusvalía que otro ya ganó.",
          ],
          solution: [
            "Apartas con el 10%: desde ~$399 mil en una casa de 2 recámaras.",
            "Congelas el precio de lista de preventa desde el primer día.",
          ],
          result: "Entras al activo completo con una fracción de su valor.",
        },
        {
          tag: "Segundo paso",
          title: "Paga el otro 10% en 20 mensualidades sin intereses",
          problem: [
            "Tu agenda no deja tiempo para administrar inversiones complicadas.",
            "Una compra grande de contado te quita liquidez.",
          ],
          solution: [
            "Alrededor de $20 mil al mes durante la construcción, sin intereses.",
            "Te mando avance de obra; tú no tienes que estar encima.",
          ],
          result: "Con ~20% del valor controlas el 100% de la casa mientras se construye.",
        },
        {
          tag: "Paso final",
          title: "Recibe en 2028: vívela, réntala o ambas",
          problem: [
            "Una casa vacía cuesta; una mal administrada, más.",
            "No quieres llamadas de huéspedes a las 3 a. m.",
          ],
          solution: [
            "Pagas el 80% contra entrega: de contado o con crédito hipotecario.",
            "Smart home y renta vacacional administrada para los días que no la usas.",
          ],
          result: "Descanso propio frente al mar y un activo que puede generar ingresos.",
        },
      ],
    },
    tabs: { kicker: "Un mismo método", title: "Adaptado a *tu momento*", ctaLabel: "Ver si califico" },
    fit: {
      title: "Te lo digo claro, para no hacerte perder tiempo",
      yes: [
        "Eres médico o profesional de la salud con práctica establecida.",
        "Quieres un lugar propio para desconectarte en pareja.",
        "Buscas que tu dinero trabaje en un activo real, sin administrarlo tú.",
        "Puedes apartar con el 10% y cubrir ~$20 mil al mes durante 20 meses.",
      ],
      no: [
        "Necesitas mudarte antes de 2028.",
        "Buscas un rendimiento garantizado o duplicar tu dinero en un año.",
        "No tienes un plan para el 80% contra entrega (contado o crédito).",
        "Vas a decidir sin tu pareja.",
      ],
      note: "Si nada de la columna derecha te detiene, agenda. Vale la pena la conversación.",
    },
    features: {
      title: "Todo lo que incluye tu casa",
      items: [
        { title: "Vista al Pacífico", text: "Roof garden privado con pérgola, asador y medio baño.", img: "/media/img/roof-vista.webp", alt: "Roof garden con vista al mar" },
        { title: "Un solo nivel", text: "2 o 3 recámaras; la vida diaria sin escaleras. El roof es el extra.", img: "/media/img/in-sala.webp", alt: "Sala de la casa" },
        { title: "Smart home", text: "Cerradura, clima y luces desde tu celular, estés donde estés.", img: "/media/img/eq-smart.webp", alt: "Control de la casa desde el celular" },
        { title: "Amenidades", text: "Alberca, pickleball, asadores y salón al aire libre (proyectadas).", img: "/media/img/am-alberca.webp", alt: "Alberca de las amenidades" },
        { title: "Ubicación", text: "El Sauzal, entrada norte de Ensenada. Hospitales a ~7 min, Valle de Guadalupe a ~30 min.", img: "/media/img/aerea-atardecer.webp", alt: "Vista aérea al atardecer" },
        { title: "Equipamiento", text: "Promoción del mes: cocina, recámaras, baños y roof equipados. Consulta vigencia.", img: "/media/img/eq-cocinando.webp", alt: "Cocina equipada" },
      ],
    },
    trust: {
      kicker: "Por qué confiar",
      title: "Es preventa. Por eso te lo contesto *con el contrato en la mano.*",
      items: [
        { title: "Penas por retraso", text: "$1,000 MXN por día de retraso. Si pasa de 40 días, puedes rescindir y te devuelven lo pagado más 10%." },
        { title: "Garantías por escrito", text: "5 años en estructura, 3 en impermeabilización y 1 en construcción, desde la escritura." },
        { title: "Desarrollador con trayectoria", text: "Más de 25 años, 30+ proyectos terminados y presencia en 10 estados." },
        { title: "Pagas a la entidad propietaria", text: "Con contrato y recibo. Nunca a una cuenta personal." },
      ],
      disclaimer:
        "Índice SHF: indicador estatal de precios de vivienda, no rendimiento del proyecto. Escenarios de plusvalía estimados, no garantizados. Precios de lista nov 2026, sujetos a cambio y disponibilidad.",
    },
    advisor: {
      kicker: "Quién te acompaña",
      title: "Fran Morishita",
      text: "Asesor patrimonial de Legacy Capital en Ensenada. Te acompaño desde la primera llamada hasta que recibes tus llaves: corrida, contrato, avance de obra y visita al desarrollo.",
      img: "/media/img/fran-asesor.webp",
    },
    final: {
      title: "¿Listo para ver *tu corrida?*",
      lead: "30 minutos. Te muestro el proyecto, el inventario disponible y los números para tu caso. Si puedes, conéctate con tu pareja.",
      zoom: { title: "Zoom de 30 min", text: "Elige un horario que no choque con tu consulta.", cta: "Agendar Zoom" },
      visit: { title: "Visita al desarrollo", text: "Ve la vista al mar desde el terreno y el avance de obra.", cta: "Agendar visita" },
      scarcity: "Atiendo personalmente, por eso los espacios por semana son limitados.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Por qué no dicen el nombre del proyecto?", a: "Es una preventa privada. El inventario cambia cada semana y prefiero mostrarte en la llamada las casas que de verdad están disponibles, con su precio exacto." },
        { q: "¿Y si no entregan a tiempo?", a: "El contrato establece una pena de $1,000 MXN por día de retraso. Si el retraso supera 40 días, puedes exigir el cumplimiento o rescindir y recibir lo pagado más 10%." },
        { q: "¿Puedo pagar el 80% con crédito hipotecario?", a: "Sí. El 80% contra entrega puede pagarse de contado o con crédito hipotecario bancario al escriturar." },
        { q: "¿Y si necesito el dinero antes de la entrega?", a: "Existe la opción de ceder tus derechos a otro comprador antes de escriturar, sujeta al contrato y a encontrar comprador. Te la explico con números en la llamada." },
        { q: "¿Quién administra la renta?", a: "Te presentamos administración profesional de renta vacacional. La casa es smart home: el acceso y el clima se controlan a distancia." },
        { q: "¿Qué gastos adicionales hay?", a: "Escrituración, mantenimiento y predial. Te los damos por escrito en tu corrida personalizada." },
      ],
    },
    legal:
      "Legacy Capital Real Estate · Ensenada, B.C. Imágenes y videos ilustrativos, algunos creados con IA. Amenidades proyectadas. Esta página no constituye una oferta vinculante.",
  },
};
