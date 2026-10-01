// Página principal del portafolio: presenta los dos proyectos de Legacy Capital en El Sauzal y ayuda
// a elegir entre preventa y entrega inmediata.

import { es } from "@/lib/i18n/es";
import { en } from "@/lib/i18n/en";
import type { Dict } from "@/lib/i18n/es";
import type { FaqCopy, FinalCtaCopy, NavCopy } from "@/lib/i18n/types";
import type { Lang } from "@/lib/site";

type Choice = { value: string; label: string };

export type HomeCopy = {
  meta: { title: string; description: string; ogAlt: string };
  nav: NavCopy;
  hero: { eyebrow: string; title: string; subtitle: string; tagline: string; scroll: string };
  facts: { value: string; label: string }[];
  compare: {
    eyebrow: string;
    title: string;
    body: string;
    rows: { label: string; preventa: string; vinedos: string }[];
    quiz: {
      title: string;
      body: string;
      q1: string;
      q1a: Choice[];
      q2: string;
      q2a: Choice[];
      pending: string;
      results: { preventa: string; vinedos: string; ambos: string };
      ctaBoth: string;
    };
  };
  showcase: { eyebrow: string; title: string; body: string; from: string };
  advisor: Dict["advisor"];
  trust: Dict["trust"];
  ensenada: Dict["ensenada"];
  faq: FaqCopy;
  finalCta: FinalCtaCopy;
  form: Dict["form"];
  quickForm: Dict["quickForm"];
  mobileBar: Dict["mobileBar"];
  exit: Dict["exit"];
  dialog: Dict["dialog"];
  footer: Dict["footer"];
  a11y: Dict["a11y"];
};

const homeEs: HomeCopy = {
  meta: {
    title: "Legacy Capital Real Estate | Casas y departamentos en Ensenada, en preventa o con entrega inmediata",
    description:
      "Legacy Capital Real Estate te asesora en El Sauzal, Ensenada: casas con roof garden y vista al mar en preventa desde $3.9 MDP, y departamentos y casas con entrega inmediata en Viñedos del Mar desde $3.64 MDP.",
    ogAlt: "Legacy Capital Real Estate: preventa con vista al mar y entrega inmediata en Ensenada",
  },
  nav: {
    links: [
      { href: "#proyectos", label: "Proyectos" },
      { href: "#compara", label: "Compara" },
      { href: "#asesor", label: "Asesor" },
      { href: "#ensenada", label: "El Sauzal" },
    ],
    cta: "Agendar visita",
    switchLang: { label: "English", href: "/en", short: "EN" },
    advisors: es.nav.advisors,
  },
  hero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, B.C.",
    title: "Tu lugar en Ensenada, en preventa o listo para estrenar.",
    subtitle:
      "Dos proyectos en El Sauzal, entre el mar y la ruta del vino. Te ayudamos a elegir el que más te conviene, sin costo adicional.",
    tagline: "Building wealth for generations",
    scroll: "Compara las dos opciones",
  },
  facts: [
    { value: "2", label: "proyectos en El Sauzal, a minutos uno del otro" },
    { value: "$3.64 MDP", label: "precio de entrada del portafolio" },
    { value: "6", label: "modelos, del departamento a la casa con roof garden" },
    { value: "$0", label: "de costo adicional por nuestra asesoría" },
    { value: "+10", label: "años de Fran Morishita en ventas inmobiliarias" },
  ],
  compare: {
    eyebrow: "Compara",
    title: "¿Preventa o entrega inmediata?",
    body: "Las dos son buenas decisiones. La diferencia está en cuándo quieres estrenar y en cómo prefieres pagar.",
    rows: [
      {
        label: "Qué es",
        preventa: "Casas de un nivel con roof garden y vista al mar",
        vinedos: "Departamentos, penthouses y casas terminados",
      },
      { label: "Precio de entrada", preventa: "Desde $3.9 MDP", vinedos: "Desde $3.64 MDP" },
      {
        label: "Cuándo estrenas",
        preventa: "Al terminar la obra: 14 meses por contrato",
        vinedos: "En cuanto firmas la escritura",
      },
      {
        label: "Cómo pagas",
        preventa: "20% de enganche en 19 meses y 80% a la escritura, con crédito o recursos propios",
        vinedos: "Crédito bancario, Infonavit o contado",
      },
      {
        label: "Lo que ves al comprar",
        preventa: "Planos, renders y avance de obra",
        vinedos: "La casa terminada y la comunidad habitada",
      },
      {
        label: "Su mayor ventaja",
        preventa: "Precio de preventa y plusvalía durante la obra",
        vinedos: "Te mudas o rentas desde el primer día",
      },
      {
        label: "Ideal para",
        preventa: "Segunda casa, retiro o renta vacacional frente al mar",
        vinedos: "Vivir ya, usar tu crédito o invertir sin esperar",
      },
    ],
    quiz: {
      title: "¿Cuál te conviene?",
      body: "Dos preguntas y te decimos por dónde empezar.",
      q1: "¿Cuándo quieres estrenar?",
      q1a: [
        { value: "ya", label: "Lo antes posible" },
        { value: "espera", label: "Puedo esperar 1 a 2 años" },
      ],
      q2: "¿Cómo pagarías?",
      q2a: [
        { value: "credito", label: "Con crédito o Infonavit" },
        { value: "propios", label: "Enganche en pagos con recursos propios" },
      ],
      pending: "Elige una respuesta en cada pregunta.",
      results: {
        vinedos: "Te conviene Viñedos del Mar: entrega inmediata y puedes usar tu crédito hoy.",
        preventa: "Te conviene la preventa: pagas tu enganche en 19 meses a precio de preventa.",
        ambos: "Las dos te funcionan: la preventa acepta crédito para el pago final. Te mostramos ambas en una sola visita.",
      },
      ctaBoth: "Agendar visita a los dos",
    },
  },
  showcase: {
    eyebrow: "Proyectos",
    title: "Dos proyectos, el mismo cuidado.",
    body: "Seleccionamos cada proyecto por su ubicación, la calidad de su construcción y su potencial patrimonial.",
    from: "Desde",
  },
  advisor: {
    ...es.advisor,
    title: "Hablas directo con quien selecciona cada proyecto.",
    why: [
      { title: "Te decimos cuál conviene", text: "Comparamos preventa y entrega inmediata con tus números, no con los nuestros." },
      { title: "Sin costo adicional", text: "Pagas el precio del desarrollador; nuestra asesoría no se suma a tu precio." },
      { title: "Todo por escrito", text: "Corrida financiera, contrato y escritura revisados contigo, en español o inglés." },
      { title: "Contigo hasta las llaves", text: "Crédito, notario, entrega y, si decides rentar, contactos de administración." },
    ],
  },
  trust: {
    title: "Compras con respaldo y todo por escrito.",
    items: [
      {
        icon: "building",
        title: "Proyectos seleccionados",
        text: "Desarrolladores con trayectoria y proyectos que conocemos en persona.",
      },
      {
        icon: "contract",
        title: "Contrato y escritura revisados",
        text: "Revisamos contigo contrato, notario y, si eres extranjero, fideicomiso.",
      },
      {
        icon: "bank",
        title: "Pagos claros",
        text: "Corrida por escrito: enganche diferido en la preventa o crédito, Infonavit y contado en entrega inmediata.",
      },
      {
        icon: "shield",
        title: "Acompañamiento completo",
        text: "De la primera llamada a la entrega de llaves, en español o inglés.",
      },
    ],
    stepsTitle: "Cómo trabajamos",
    steps: [
      { title: "Conversemos", text: "Nos cuentas qué buscas, para qué y para cuándo." },
      { title: "Compara", text: "Te enviamos precios, planos y números de los dos proyectos." },
      { title: "Visita", text: "Recorres ambos en una sola visita a El Sauzal, o por videollamada." },
      { title: "Estrena", text: "Apartas, firmas y te acompañamos hasta las llaves." },
    ],
  },
  ensenada: {
    ...es.ensenada,
    title: "Vivir en El Sauzal.",
    body: "La zona norte de Ensenada: el Pacífico de un lado, el Valle de Guadalupe del otro y la ciudad a unos minutos.",
    moments: [
      { time: "Por la mañana", title: "Café entre árboles", text: "Cafeterías de especialidad a unos minutos de casa.", image: "/img/cafe.jpg" },
      { time: "Por la tarde", title: "Valle de Guadalupe", text: "La ruta del vino de Baja California, a minutos de los dos proyectos.", image: "/img/valle.jpg" },
      { time: "Por la noche", title: "Cena frente al mar", text: "Punta Morro y la costa de El Sauzal.", image: "/img/punta-morro.jpg" },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué proyectos presenta Legacy Capital?",
        a: "Hoy, dos en El Sauzal, zona norte de Ensenada: una preventa de casas de un nivel con roof garden y vista al mar, y Viñedos del Mar, una comunidad terminada con departamentos, penthouses y casas con entrega inmediata.",
      },
      {
        q: "¿Qué me conviene más, preventa o entrega inmediata?",
        a: "La preventa te da precio de entrada y la posibilidad de plusvalía mientras se construye, con el enganche en pagos. La entrega inmediata te permite mudarte o rentar desde el primer día y usar tu crédito hoy. Te ayudamos a compararlas con tus números.",
      },
      {
        q: "¿Puedo usar crédito hipotecario o Infonavit?",
        a: "En Viñedos del Mar puedes comprar con crédito bancario, Infonavit o de contado. En la preventa, el 80% que se paga a la escritura puede cubrirse con recursos propios o con crédito hipotecario.",
      },
      {
        q: "¿Puedo visitar los dos proyectos el mismo día?",
        a: "Sí. Ambos están en El Sauzal, a unos minutos uno del otro. Agenda un recorrido y los conoces en una sola visita, o por videollamada.",
      },
      {
        q: "¿Cuánto cuesta su asesoría?",
        a: "Nada adicional: pagas el precio del desarrollador. Nosotros te acompañamos con números, contrato, crédito y notario hasta la entrega.",
      },
      {
        q: "¿Pueden comprar extranjeros o mexicanos que viven en Estados Unidos?",
        a: "Sí. Con nacionalidad mexicana escrituras a tu nombre. Si eres extranjero, en Ensenada se compra mediante un fideicomiso bancario. Te guiamos en español o en inglés.",
      },
      {
        q: "¿Puedo rentar la propiedad en plataformas como Airbnb?",
        a: "Muchos compradores lo hacen. Antes de comprar te compartimos el reglamento de cada comunidad para que confirmes los usos permitidos y, en la preventa, el estudio de rentabilidad.",
      },
    ],
  },
  finalCta: {
    title: "Conoce los dos en una sola visita.",
    body: "Ambos proyectos están en El Sauzal, a minutos uno del otro. Agenda un recorrido con Fran o una videollamada y decide con todo a la vista.",
    formTitle: "Agenda tu visita",
    imageAlt: "Atardecer sobre el océano Pacífico",
  },
  form: {
    ...es.form,
    submit: "Recibir precios",
    success: {
      ...es.form.success,
      body: "Fran Morishita te escribirá por WhatsApp hoy mismo con precios y disponibilidad.",
    },
    waMessage: "Hola Fran, soy {name}. Me interesa {project} en Ensenada{interest}. ¿Me compartes precios y disponibilidad?",
    waGeneric: "Hola Fran, me interesa conocer sus proyectos en Ensenada: la preventa con vista al mar y Viñedos del Mar.",
  },
  quickForm: {
    ...es.quickForm,
    subtitle: "Te enviamos por WhatsApp precios y disponibilidad del proyecto que elijas.",
  },
  mobileBar: es.mobileBar,
  exit: {
    title: "¿Te enviamos precios de los dos proyectos?",
    body: "Preventa con vista al mar desde $3.9 MDP y entrega inmediata desde $3.64 MDP. Te los enviamos por WhatsApp.",
    dismiss: es.exit.dismiss,
  },
  dialog: { ...es.dialog, pricesTitle: "Recibe precios y disponibilidad" },
  footer: es.footer,
  a11y: { ...es.a11y, facts: "Legacy Capital en cifras" },
};

const homeEn: HomeCopy = {
  meta: {
    title: "Legacy Capital Real Estate | Homes and condos in Ensenada, pre-sale or move-in ready",
    description:
      "Legacy Capital Real Estate advises you in El Sauzal, Ensenada: ocean-view roof garden homes in pre-sale from MXN $3.9M, and move-in ready condos and homes at Viñedos del Mar from MXN $3.64M.",
    ogAlt: "Legacy Capital Real Estate: ocean-view pre-sale and move-in ready homes in Ensenada",
  },
  nav: {
    links: [
      { href: "#proyectos", label: "Projects" },
      { href: "#compara", label: "Compare" },
      { href: "#asesor", label: "Advisor" },
      { href: "#ensenada", label: "El Sauzal" },
    ],
    cta: "Book a visit",
    switchLang: { label: "Español", href: "/", short: "ES" },
    advisors: en.nav.advisors,
  },
  hero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, B.C.",
    title: "Your place in Ensenada, in pre-sale or ready to move in.",
    subtitle:
      "Two projects in El Sauzal, between the ocean and the wine route. We help you choose the one that suits you best, at no extra cost.",
    tagline: "Building wealth for generations",
    scroll: "Compare both options",
  },
  facts: [
    { value: "2", label: "projects in El Sauzal, minutes from each other" },
    { value: "$3.64M", label: "MXN entry price across the portfolio" },
    { value: "6", label: "models, from a condo to a roof garden home" },
    { value: "$0", label: "extra cost for our advisory" },
    { value: "+10", label: "years of Fran Morishita in real estate sales" },
  ],
  compare: {
    eyebrow: "Compare",
    title: "Pre-sale or move-in ready?",
    body: "Both are good decisions. The difference is when you want to move in and how you prefer to pay.",
    rows: [
      {
        label: "What it is",
        preventa: "Single-level homes with a roof garden and ocean views",
        vinedos: "Finished condos, penthouses and homes",
      },
      { label: "Entry price", preventa: "From MXN $3.9M", vinedos: "From MXN $3.64M" },
      {
        label: "When you move in",
        preventa: "When construction ends: 14 months by contract",
        vinedos: "As soon as you sign the deed",
      },
      {
        label: "How you pay",
        preventa: "20% down over 19 months and 80% at closing, with a mortgage or your own funds",
        vinedos: "Bank mortgage, Infonavit or cash",
      },
      {
        label: "What you see when buying",
        preventa: "Floor plans, renderings and construction progress",
        vinedos: "The finished home and a lived-in community",
      },
      {
        label: "Biggest advantage",
        preventa: "Pre-sale price and appreciation during construction",
        vinedos: "Move in or rent from day one",
      },
      {
        label: "Ideal for",
        preventa: "A second home, retirement or ocean-view vacation rental",
        vinedos: "Living there now, using your mortgage or investing without waiting",
      },
    ],
    quiz: {
      title: "Which one suits you?",
      body: "Two questions and we'll tell you where to start.",
      q1: "When do you want to move in?",
      q1a: [
        { value: "ya", label: "As soon as possible" },
        { value: "espera", label: "I can wait 1 to 2 years" },
      ],
      q2: "How would you pay?",
      q2a: [
        { value: "credito", label: "With a mortgage or Infonavit" },
        { value: "propios", label: "Down payment in installments, own funds" },
      ],
      pending: "Choose one answer for each question.",
      results: {
        vinedos: "Viñedos del Mar suits you: move-in ready, and you can use your mortgage today.",
        preventa: "The pre-sale suits you: pay your down payment over 19 months at the pre-sale price.",
        ambos: "Both work for you: the pre-sale accepts a mortgage for the final payment. We'll show you both in one visit.",
      },
      ctaBoth: "Book a visit to both",
    },
  },
  showcase: {
    eyebrow: "Projects",
    title: "Two projects, the same care.",
    body: "We select each project for its location, construction quality and long-term value.",
    from: "From",
  },
  advisor: {
    ...en.advisor,
    title: "Talk directly with the person who selects every project.",
    why: [
      { title: "We tell you which one fits", text: "We compare pre-sale and move-in ready with your numbers, not ours." },
      { title: "No extra cost", text: "You pay the developer's price; our advisory isn't added to it." },
      { title: "Everything in writing", text: "Payment plan, contract and deed reviewed with you, in English or Spanish." },
      { title: "With you until the keys", text: "Mortgage, notary, delivery and, if you decide to rent, management contacts." },
    ],
  },
  trust: {
    title: "Buy with backing and everything in writing.",
    items: [
      { icon: "building", title: "Selected projects", text: "Experienced developers and projects we know in person." },
      { icon: "contract", title: "Contract and deed reviewed", text: "We review the contract, notary and, if you're a foreigner, the bank trust with you." },
      { icon: "bank", title: "Clear payments", text: "A written payment plan: deferred down payment in pre-sale, or mortgage, Infonavit and cash for move-in ready." },
      { icon: "shield", title: "Full guidance", text: "From the first call to the keys, in English or Spanish." },
    ],
    stepsTitle: "How we work",
    steps: [
      { title: "Let's talk", text: "Tell us what you're looking for, what for and when." },
      { title: "Compare", text: "We send prices, floor plans and numbers for both projects." },
      { title: "Visit", text: "Tour both in a single visit to El Sauzal, or by video call." },
      { title: "Move in", text: "Reserve, sign, and we'll be with you until the keys." },
    ],
  },
  ensenada: {
    ...en.ensenada,
    title: "Living in El Sauzal.",
    body: "Ensenada's north end: the Pacific on one side, Valle de Guadalupe on the other and the city minutes away.",
    moments: [
      { time: "Morning", title: "Coffee among the trees", text: "Specialty coffee shops minutes from home.", image: "/img/cafe.jpg" },
      { time: "Afternoon", title: "Valle de Guadalupe", text: "Baja California's wine route, minutes from both projects.", image: "/img/valle.jpg" },
      { time: "Evening", title: "Dinner by the ocean", text: "Punta Morro and the El Sauzal coast.", image: "/img/punta-morro.jpg" },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Which projects does Legacy Capital offer?",
        a: "Currently two in El Sauzal, Ensenada's north end: a pre-sale of single-level homes with a roof garden and ocean views, and Viñedos del Mar, a finished community of move-in ready condos, penthouses and homes.",
      },
      {
        q: "Which is better for me, pre-sale or move-in ready?",
        a: "Pre-sale gives you an entry price and potential appreciation during construction, with the down payment in installments. Move-in ready lets you live there or rent from day one and use your mortgage today. We help you compare them with your numbers.",
      },
      {
        q: "Can I use a mortgage or Infonavit?",
        a: "At Viñedos del Mar you can buy with a bank mortgage, Infonavit or cash. In the pre-sale, the 80% paid at closing can be covered with your own funds or a mortgage.",
      },
      {
        q: "Can I visit both projects on the same day?",
        a: "Yes. Both are in El Sauzal, minutes from each other. Book a tour and see them in a single visit, or by video call.",
      },
      {
        q: "How much does your advisory cost?",
        a: "Nothing extra: you pay the developer's price. We guide you through the numbers, contract, mortgage and notary until delivery.",
      },
      {
        q: "Can foreigners or Mexicans living in the U.S. buy?",
        a: "Yes. With Mexican nationality, the deed goes in your name. Foreigners buy in Ensenada through a bank trust (fideicomiso). We guide you in English or Spanish.",
      },
      {
        q: "Can I rent the property on platforms like Airbnb?",
        a: "Many buyers do. Before you buy, we share each community's rules so you can confirm allowed uses and, for the pre-sale, the rental return study.",
      },
    ],
  },
  finalCta: {
    title: "See both in a single visit.",
    body: "Both projects are in El Sauzal, minutes from each other. Book a tour with Fran or a video call and decide with everything in view.",
    formTitle: "Book your visit",
    imageAlt: "Sunset over the Pacific Ocean",
  },
  form: {
    ...en.form,
    submit: "Get prices",
    success: {
      ...en.form.success,
      body: "Fran Morishita will message you on WhatsApp today with prices and availability.",
    },
    waMessage: "Hi Fran, I'm {name}. I'm interested in {project} in Ensenada{interest}. Could you share prices and availability?",
    waGeneric: "Hi Fran, I'd like to learn about your projects in Ensenada: the ocean-view pre-sale and Viñedos del Mar.",
  },
  quickForm: {
    ...en.quickForm,
    subtitle: "We'll send prices and availability for the project you choose to your WhatsApp.",
  },
  mobileBar: en.mobileBar,
  exit: {
    title: "Want prices for both projects?",
    body: "Ocean-view pre-sale from MXN $3.9M and move-in ready from MXN $3.64M. We'll send them to your WhatsApp.",
    dismiss: en.exit.dismiss,
  },
  dialog: { ...en.dialog, pricesTitle: "Get prices and availability" },
  footer: en.footer,
  a11y: { ...en.a11y, facts: "Legacy Capital in numbers" },
};

export const home: Record<Lang, HomeCopy> = { es: homeEs, en: homeEn };
