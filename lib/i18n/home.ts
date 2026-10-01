// Página principal: Legacy Capital como asesor del cliente. Parte de sus dudas, presenta los dos
// caminos (preventa y entrega inmediata) y lleva a la página de cada proyecto.

import { es } from "@/lib/i18n/es";
import { en } from "@/lib/i18n/en";
import type { Dict } from "@/lib/i18n/es";
import type { FaqCopy, FinalCtaCopy, NavCopy } from "@/lib/i18n/types";
import type { Lang } from "@/lib/site";

type Choice = { value: string; label: string };
export type PainIcon = "compass" | "shield" | "globe" | "tag" | "file" | "handshake";

export type HomeCopy = {
  meta: { title: string; description: string; ogAlt: string };
  nav: NavCopy;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    tagline: string;
    imageAlt: string;
    picker: { advisor: string; title: string; body: string; help: string };
  };
  facts: { value: string; label: string }[];
  pains: {
    eyebrow: string;
    title: string;
    body: string;
    answerLabel: string;
    items: { icon: PainIcon; concern: string; answer: string }[];
    cta: string;
    ctaNote: string;
    dialogTitle: string;
    dialogSubtitle: string;
  };
  paths: {
    eyebrow: string;
    title: string;
    body: string;
    fitLabel: string;
    items: Record<"preventa" | "vinedos", { promise: string; fit: string[]; facts: { label: string; value: string }[] }>;
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
      { href: "#ayuda", label: "Cómo te ayudamos" },
      { href: "#compara", label: "¿Cuál te conviene?" },
      { href: "#asesor", label: "Asesor" },
      { href: "#ensenada", label: "El Sauzal" },
    ],
    cta: "Agendar visita",
    switchLang: { label: "English", href: "/en", short: "EN" },
    advisors: es.nav.advisors,
  },
  hero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, B.C.",
    title: "Tu casa en Ensenada, con alguien de tu lado.",
    subtitle:
      "Te escuchamos, comparamos por ti y te acompañamos hasta la entrega de llaves. En El Sauzal tenemos dos caminos: comprar en preventa o estrenar de inmediato.",
    ctaPrimary: "Ayúdame a elegir",
    ctaSecondary: "Escribir por WhatsApp",
    tagline: "Building wealth for generations",
    imageAlt: "Persona caminando hacia el mar al atardecer en la costa de Ensenada",
    picker: {
      advisor: "Te atiende personalmente",
      title: "¿Qué estás buscando?",
      body: "Elige un camino y te mostramos modelos, precios y formas de pago.",
      help: "¿No sabes cuál? Te ayudamos a elegir",
    },
  },
  facts: [
    { value: "$0", label: "de costo adicional por nuestra asesoría" },
    { value: "2", label: "caminos en El Sauzal: preventa o entrega inmediata" },
    { value: "+10", label: "años de Fran Morishita en ventas inmobiliarias" },
    { value: "+$70 MDP", label: "en ventas inmobiliarias dirigidas" },
    { value: "ES · EN", label: "te atendemos en español o inglés" },
  ],
  pains: {
    eyebrow: "Te entendemos",
    title: "Comprar casa no debería darte miedo.",
    body: "Estas son las dudas que más escuchamos antes de comprar en Ensenada. Así las resolvemos contigo.",
    answerLabel: "Lo que hacemos",
    items: [
      {
        icon: "compass",
        concern: "No sé si me conviene comprar en preventa o algo ya terminado.",
        answer: "Comparamos las dos opciones con tus números: cuándo quieres estrenar, cuánto tienes de enganche y cómo vas a pagar.",
      },
      {
        icon: "shield",
        concern: "Me da miedo que no lo entreguen o que no sea lo que me prometieron.",
        answer: "Presentamos desarrolladores con trayectoria. En preventa, contrato bajo la NOM-247 y garantías por escrito; en entrega inmediata, recorres tu casa terminada antes de comprar.",
      },
      {
        icon: "globe",
        concern: "Vivo lejos y no puedo venir a cada rato.",
        answer: "Te mostramos todo por videollamada, te enviamos los documentos por WhatsApp y organizamos tu visita para que conozcas todo en un solo viaje.",
      },
      {
        icon: "tag",
        concern: "No quiero pagar de más.",
        answer: "Pagas el precio de lista del desarrollador. Nuestra asesoría no se suma a tu precio.",
      },
      {
        icon: "file",
        concern: "El crédito, el notario y los trámites me abruman.",
        answer: "Te guiamos con crédito bancario, Infonavit, notario y, si eres extranjero, fideicomiso. Todo por escrito, en español o inglés.",
      },
      {
        icon: "handshake",
        concern: "Los vendedores presionan y luego desaparecen.",
        answer: "Un solo asesor de principio a fin: Fran te responde el mismo día y sigue contigo después de la entrega.",
      },
    ],
    cta: "Cuéntanos qué buscas",
    ctaNote: "Te respondemos hoy por WhatsApp, sin compromiso.",
    dialogTitle: "Cuéntanos qué buscas",
    dialogSubtitle: "Fran te escribe hoy por WhatsApp con las opciones que mejor te quedan.",
  },
  paths: {
    eyebrow: "Dos caminos",
    title: "¿Preventa o entrega inmediata?",
    body: "Las dos son buenas decisiones. La diferencia está en cuándo quieres estrenar y en cómo prefieres pagar.",
    fitLabel: "Es para ti si…",
    items: {
      preventa: {
        promise: "Compras hoy a precio de preventa y estrenas al terminar la obra.",
        fit: [
          "Buscas segunda casa, retiro o renta vacacional frente al mar",
          "Prefieres pagar tu enganche en 19 meses",
          "Quieres la plusvalía de comprar antes de que se termine",
        ],
        facts: [
          { label: "Qué es", value: "Casas de un nivel con roof garden y vista al mar" },
          { label: "Estrenas", value: "Al terminar la obra: 14 meses por contrato" },
          { label: "Pagas", value: "20% de enganche en 19 meses y 80% a la escritura" },
          { label: "Lo que ves al comprar", value: "Planos, renders y avance de obra" },
        ],
      },
      vinedos: {
        promise: "Compras algo terminado y lo estrenas al escriturar.",
        fit: [
          "Quieres mudarte o rentar lo antes posible",
          "Vas a usar crédito bancario o Infonavit",
          "Prefieres recorrer tu casa terminada antes de comprar",
        ],
        facts: [
          { label: "Qué es", value: "Departamentos, penthouses y casas en una comunidad con casa club" },
          { label: "Estrenas", value: "En cuanto firmas la escritura" },
          { label: "Pagas", value: "Crédito bancario, Infonavit o contado" },
          { label: "Lo que ves al comprar", value: "La casa terminada y la comunidad habitada" },
        ],
      },
    },
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
    title: "Te acompañamos en cada paso.",
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
    stepsTitle: "Cómo trabajamos contigo",
    steps: [
      { title: "Conversemos", text: "Nos cuentas qué buscas, para qué y para cuándo." },
      { title: "Compara", text: "Te enviamos precios, planos y números de las opciones que te convienen." },
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
        q: "¿Por qué comprar con un asesor y no directo con el desarrollador?",
        a: "Pagas el mismo precio de lista y ganas a alguien de tu lado: comparamos opciones, revisamos contigo números y contrato, y te acompañamos con crédito, notario y entrega.",
      },
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
    title: "Encontremos tu lugar en Ensenada.",
    body: "Agenda un recorrido o una videollamada con Fran. Conoces los dos proyectos en una sola visita y decides con todo a la vista, sin presión.",
    formTitle: "Agenda tu visita",
    imageAlt: "Carretera costera de Ensenada al atardecer",
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
      { href: "#ayuda", label: "How we help" },
      { href: "#compara", label: "Which one fits?" },
      { href: "#asesor", label: "Advisor" },
      { href: "#ensenada", label: "El Sauzal" },
    ],
    cta: "Book a visit",
    switchLang: { label: "Español", href: "/", short: "ES" },
    advisors: en.nav.advisors,
  },
  hero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, B.C.",
    title: "Your home in Ensenada, with someone on your side.",
    subtitle:
      "We listen, compare for you and stay with you until you get the keys. In El Sauzal there are two ways in: buy in pre-sale or move in right away.",
    ctaPrimary: "Help me choose",
    ctaSecondary: "Message on WhatsApp",
    tagline: "Building wealth for generations",
    imageAlt: "Person walking into the ocean at sunset on the Ensenada coast",
    picker: {
      advisor: "Personally assisted by",
      title: "What are you looking for?",
      body: "Choose a path and we'll show you models, prices and payment options.",
      help: "Not sure? We'll help you choose",
    },
  },
  facts: [
    { value: "$0", label: "extra cost for our advisory" },
    { value: "2", label: "paths in El Sauzal: pre-sale or move-in ready" },
    { value: "+10", label: "years of Fran Morishita in real estate sales" },
    { value: "$70M+", label: "MXN in real estate sales led" },
    { value: "EN · ES", label: "we assist you in English or Spanish" },
  ],
  pains: {
    eyebrow: "We get it",
    title: "Buying a home shouldn't feel scary.",
    body: "These are the concerns we hear most before people buy in Ensenada. Here's how we solve them with you.",
    answerLabel: "What we do",
    items: [
      {
        icon: "compass",
        concern: "I don't know whether to buy in pre-sale or something already finished.",
        answer: "We compare both options with your numbers: when you want to move in, how much you have for a down payment and how you'll pay.",
      },
      {
        icon: "shield",
        concern: "I'm afraid it won't be delivered, or won't be what was promised.",
        answer: "We present developers with a track record. In pre-sale, a contract under NOM-247 and written warranties; with move-in ready, you tour your finished home before buying.",
      },
      {
        icon: "globe",
        concern: "I live far away and can't come often.",
        answer: "We show you everything by video call, send documents on WhatsApp and plan your visit so you see it all in one trip.",
      },
      {
        icon: "tag",
        concern: "I don't want to overpay.",
        answer: "You pay the developer's list price. Our advisory isn't added to your price.",
      },
      {
        icon: "file",
        concern: "Mortgages, the notary and paperwork overwhelm me.",
        answer: "We guide you through bank mortgages, Infonavit, the notary and, if you're a foreigner, the bank trust. Everything in writing, in English or Spanish.",
      },
      {
        icon: "handshake",
        concern: "Salespeople push and then disappear.",
        answer: "One advisor from start to finish: Fran replies the same day and stays with you after delivery.",
      },
    ],
    cta: "Tell us what you're looking for",
    ctaNote: "We'll reply on WhatsApp today, no strings attached.",
    dialogTitle: "Tell us what you're looking for",
    dialogSubtitle: "Fran will message you on WhatsApp today with the options that fit you best.",
  },
  paths: {
    eyebrow: "Two paths",
    title: "Pre-sale or move-in ready?",
    body: "Both are good decisions. The difference is when you want to move in and how you prefer to pay.",
    fitLabel: "It's for you if…",
    items: {
      preventa: {
        promise: "Buy today at the pre-sale price and move in when construction ends.",
        fit: [
          "You want a second home, retirement or vacation rental by the ocean",
          "You'd rather pay your down payment over 19 months",
          "You want the appreciation of buying before it's finished",
        ],
        facts: [
          { label: "What it is", value: "Single-level homes with a roof garden and ocean views" },
          { label: "Move in", value: "When construction ends: 14 months by contract" },
          { label: "You pay", value: "20% down over 19 months and 80% at closing" },
          { label: "What you see when buying", value: "Floor plans, renderings and construction progress" },
        ],
      },
      vinedos: {
        promise: "Buy something finished and move in at closing.",
        fit: [
          "You want to move in or rent as soon as possible",
          "You'll use a bank mortgage or Infonavit",
          "You'd rather tour your finished home before buying",
        ],
        facts: [
          { label: "What it is", value: "Condos, penthouses and homes in a community with a clubhouse" },
          { label: "Move in", value: "As soon as you sign the deed" },
          { label: "You pay", value: "Bank mortgage, Infonavit or cash" },
          { label: "What you see when buying", value: "The finished home and a lived-in community" },
        ],
      },
    },
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
    title: "We're with you every step.",
    items: [
      { icon: "building", title: "Selected projects", text: "Experienced developers and projects we know in person." },
      { icon: "contract", title: "Contract and deed reviewed", text: "We review the contract, notary and, if you're a foreigner, the bank trust with you." },
      { icon: "bank", title: "Clear payments", text: "A written payment plan: deferred down payment in pre-sale, or mortgage, Infonavit and cash for move-in ready." },
      { icon: "shield", title: "Full guidance", text: "From the first call to the keys, in English or Spanish." },
    ],
    stepsTitle: "How we work with you",
    steps: [
      { title: "Let's talk", text: "Tell us what you're looking for, what for and when." },
      { title: "Compare", text: "We send prices, floor plans and numbers for the options that fit you." },
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
        q: "Why buy through an advisor instead of directly from the developer?",
        a: "You pay the same list price and gain someone on your side: we compare options, review the numbers and contract with you, and guide you through the mortgage, notary and delivery.",
      },
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
    title: "Let's find your place in Ensenada.",
    body: "Book a tour or a video call with Fran. See both projects in a single visit and decide with everything in view, no pressure.",
    formTitle: "Book your visit",
    imageAlt: "Ensenada's coastal highway at sunset",
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
