// Copy de las secciones con el diseño de la landing de la preventa (videos, historias al hacer scroll,
// calculadora de pagos, plusvalía, material exclusivo). Cifras de noviembre 2026: lista de precios,
// brochure y análisis de rentabilidad. Nunca se publica el nombre del desarrollo ni del desarrollador.
// En los titulares, *texto* se muestra en cursiva dorada.

import type { Lang } from "@/lib/site";
import type { Model } from "@/lib/money";

const V = "/media/video";
const I = "/media/img";

export type StoryStep = { kicker: string; title: string; text: string; video: string; poster: string };
export type StoryCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: StoryStep[];
  cta: string;
  ctaWa?: string;
  frameLabel: string;
};

type HeroCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  from: string;
  amount: { value: number; decimals: number; unit: string };
  noteStrong: string;
  note: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string[];
  agent: { name: string; role: string };
  reelLabel: string;
  scroll: string;
};

export type ModelCopy = {
  tab: string;
  name: string;
  sub: string;
  total: string;
  built: string;
  roof: string;
  render: string;
  renderAlt: string;
  plan: string;
  planAlt: string;
  roofPlan: string;
  roofPlanAlt: string;
  features: string[];
};

export type ShowcaseCopy = {
  hero: HeroCopy;
  homeHero: Pick<HeroCopy, "eyebrow" | "title" | "lead"> & { moveIn: { text: string; cta: string } };
  band: string[];
  advisor: {
    eyebrow: string;
    title: string;
    body: string;
    online: string;
    onlineSub: string;
    waLabel: string;
    noFee: string;
    steps: { title: string; text: string }[];
    ctaWa: string;
    ctaVisit: string;
    photoAlt: string;
  };
  day: StoryCopy;
  path: StoryCopy;
  secure: {
    eyebrow: string;
    title: string;
    lead: string;
    stat: { value: string; label: string };
    points: string[];
    clipTag: string;
    imageAlt: string;
    clipLabel: string;
  };
  ensenada: {
    eyebrow: string;
    title: string;
    lead: string;
    pillars: { title: string; text: string }[];
    stats: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[];
    statsSource: string;
    imageAlt: string;
  };
  location: {
    eyebrow: string;
    title: string;
    places: { name: string; dist: string; time: string }[];
    note: string;
    mapsCta: string;
    tourCta: string;
    mapAlt: string;
    pin: string;
  };
  homes: {
    eyebrow: string;
    title: string;
    lead: string;
    models: Record<Model, ModelCopy>;
    badge: string;
    from: string;
    currency: string;
    totalLabel: string;
    builtLabel: string;
    roofLabel: string;
    views: { render: string; plan: string; roof: string };
    quote: string;
    availability: string;
    quoteTitle: string;
    note: string;
  };
  homesTeaser: { eyebrow: string; title: string; lead: string; cta: string; roofLine: string };
  interior: { eyebrow: string; title: string; lead: string; rooms: { title: string; text: string; image: string; alt: string }[] };
  equipment: {
    eyebrow: string;
    title: string;
    upTo: string;
    amount: number;
    unit: string;
    amountNote: string;
    interiorTitle: string;
    interior: string[];
    smartTitle: string;
    smart: string[];
    phoneA: string;
    phoneB: string;
  };
  roof: { eyebrow: string; title: string; stats: { value: string; label: string }[]; features: string[]; cta: string; imageAlt: string };
  amenities: {
    eyebrow: string;
    title: string;
    lead: string;
    featured: { title: string; text: string; image: string; alt: string; pos?: string }[];
    clusterTitle: string;
    cluster: string[];
    devTitle: string;
    dev: string[];
  };
  value: {
    eyebrow: string;
    title: string;
    lead: string;
    labels: string[];
    subs: string[];
    legend: { cons: string; opt: string };
    note: string;
    ask: string;
    cta: string;
    chartLabel: string;
  };
  pay: {
    eyebrow: string;
    title: string;
    lead: string;
    schemes: { bridge: string; cash: string };
    calcFor: string;
    models: Record<Model, string>;
    bridge: { today: string; downNote: string; during: string; monthlyNote: string; delivery: string; deliveryNote: string; note: string };
    cash: { final: string; finalNote: string; down: string; monthly: string; deed: string; note: string };
    currencyNote: string;
    quote: string;
    quoteBy: string;
    cta: string;
    ctaWa: string;
    legal: string;
    imageAlt: string;
  };
  material: {
    eyebrow: string;
    title: string;
    tabs: { roi: string; brochure: string };
    /** Cada documento tiene su propia sección: el brochure arriba (casas) y el análisis junto a la inversión */
    sections: Record<"roi" | "brochure", { eyebrow: string; title: string; formTitle: string; formNote: string }>;
    roi: { meta: string; title: string; kpis: { value: string; label: string }[]; rows: [string, string][]; disclaimer: string };
    brochure: { meta: string; title: string; pages: string; rows: [string, string][]; coverAlt: string };
    form: {
      title: string;
      note: string;
      submitRoi: string;
      submitBrochure: string;
      waRoi: string;
      waBrochure: string;
      successRoi: string;
      successBrochure: string;
    };
    locked: string;
  };
  contact: { eyebrow: string; title: string; lead: string; formTitle: string; submit: string; imageAlt: string; points: string[] };
  faq: { eyebrow: string; title: string; asideTitle: string; asideText: string; items: { q: string; a: string }[] };
  closing: { eyebrow: string; title: string; lead: string; ctaWa: string; ctaVisit: string; videoLabel: string };
  moveIn: { eyebrow: string; title: string; lead: string; facts: string[]; price: string; priceNote: string; cta: string; videoLabel: string };
  ui: { play: string; pause: string; prev: string; next: string; close: string };
};

const es: ShowcaseCopy = {
  hero: {
    eyebrow: "Preventa · Zona norte de Ensenada, B.C.",
    title: "Casas con roof garden frente al *Pacífico.*",
    lead: "Casas de un nivel con vista al mar y montañas, en clúster privado con acceso controlado. Equipadas desde la entrega.",
    from: "Desde",
    amount: { value: 3.9, decimals: 1, unit: "MDP" },
    noteStrong: "10% de enganche",
    note: "10% en 20 mensualidades · 80% contra entrega 2028",
    ctaPrimary: "Agenda tu cita",
    ctaSecondary: "Pedir el brochure",
    trust: ["Desarrollador con 25+ años", "Respaldo financiero institucional", "Entrega 2028"],
    agent: { name: "Te atiende Fran Morishita", role: "Fundador · Legacy Capital Real Estate" },
    reelLabel: "Video: atardecer sobre las casas, el roof garden y la vista al mar",
    scroll: "Bajar a la siguiente sección",
  },
  homeHero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, B.C.",
    title: "Tu casa frente al *Pacífico,* con alguien de tu lado.",
    lead: "Casas de un nivel con roof garden y vista al mar en preventa, en un clúster privado al norte de Ensenada. Te acompañamos de la primera llamada a la entrega de llaves.",
    moveIn: { text: "¿Necesitas estrenar ya?", cta: "Ver entrega inmediata" },
  },
  band: ["Roof garden privado", "Vista al mar y montañas", "Acceso controlado", "Smart home incluido", "Alberca · Pickleball · Asadores", "Entrega 2028"],
  advisor: {
    eyebrow: "Tu asesor",
    title: "Hola, soy *Fran Morishita.* Te acompaño de principio a fin.",
    body: "Fundé Legacy Capital Real Estate para que comprar casa en Ensenada sea claro y seguro. Selecciono cada proyecto que presento, te lo enseño en persona o por videollamada, te comparto disponibilidad y promociones de la semana, y armamos juntos la corrida de pagos que va con tu objetivo: vivir, retirarte o invertir.",
    online: "En línea hoy",
    onlineSub: "Respondo el mismo día",
    waLabel: "WhatsApp directo",
    noFee: "Pagas el mismo precio de lista: mi asesoría no tiene costo adicional.",
    steps: [
      { title: "Me escribes", text: "por WhatsApp, llamada o correo" },
      { title: "Visitamos", text: "el terreno o por videollamada" },
      { title: "Apartas tu casa", text: "con la corrida que te conviene" },
    ],
    ctaWa: "Escribirle a Fran",
    ctaVisit: "Agenda tu cita",
    photoAlt: "Fran Morishita, fundador de Legacy Capital Real Estate, frente a una de las casas",
  },
  day: {
    eyebrow: "Un día aquí",
    title: "Un día cualquiera *se siente a vacaciones.*",
    lead: "Sigue bajando y vive un día aquí, de la mañana a la noche.",
    steps: [
      { kicker: "07:00", title: "Despiertas sin prisa", text: "Luz natural, ventanales y minisplit en cada recámara.", video: `${V}/d1-despertar.mp4`, poster: `${V}/d1-despertar.jpg` },
      { kicker: "11:30", title: "La alberca, a pasos de casa", text: "Sin manejar ni salir del clúster: la alberca es parte de tus amenidades.", video: `${V}/d2-alberca.mp4`, poster: `${V}/d2-alberca.jpg` },
      { kicker: "17:00", title: "Pickleball con amigos", text: "Cancha propia dentro del clúster para jugar con tus vecinos.", video: `${V}/d3-pickleball.mp4`, poster: `${V}/d3-pickleball.jpg` },
      { kicker: "19:00", title: "Asador en familia", text: "Asadores y mesas para reunirte sin salir del clúster.", video: `${V}/d4-asador.mp4`, poster: `${V}/d4-asador.jpg` },
      {
        kicker: "20:00",
        title: "Atardecer en tu roof",
        text: "Barra, asador y pérgola arriba de tu casa. Así termina un día cualquiera frente al Pacífico.",
        video: `${V}/d5-atardecer.mp4`,
        poster: `${V}/d5-atardecer.jpg`,
      },
    ],
    cta: "Quiero vivirlo",
    frameLabel: "Videos de un día en la comunidad",
  },
  path: {
    eyebrow: "Así compras con Fran",
    title: "De tu primer mensaje *a las llaves de tu casa.*",
    lead: "Cuatro pasos y en cada uno estoy contigo. Sigue bajando.",
    steps: [
      {
        kicker: "01",
        title: "Me escribes, estés donde estés",
        text: "Desde Ensenada, Tijuana, CDMX o California: te respondo el mismo día por WhatsApp, llamada o correo.",
        video: `${V}/p1-contacto.mp4`,
        poster: `${V}/p1-contacto.jpg`,
      },
      {
        kicker: "02",
        title: "Conoces el proyecto",
        text: "Te muestro el terreno y el punto de venta en persona, o planos, renders y avance de obra por videollamada.",
        video: `${V}/fran-sala.mp4`,
        poster: `${V}/fran-sala.jpg`,
      },
      {
        kicker: "03",
        title: "Firmas con respaldo",
        text: "Apartas tu casa y firmas tu contrato con 10% de enganche. Revisamos contigo contrato, notario y, si eres extranjero, fideicomiso.",
        video: `${V}/p3-firma.mp4`,
        poster: `${V}/p3-firma.jpg`,
      },
      {
        kicker: "04",
        title: "Recibes tus llaves",
        text: "Entrega estimada a mediados de 2028. ¿Estrenamos frente al Pacífico?",
        video: `${V}/p4-llaves.mp4`,
        poster: `${V}/p4-llaves.jpg`,
      },
    ],
    cta: "Quiero mis llaves",
    ctaWa: "WhatsApp",
    frameLabel: "Videos del proceso de compra con Fran",
  },
  secure: {
    eyebrow: "Acceso controlado",
    title: "Un clúster privado *pensado para tu tranquilidad.*",
    lead: "Llegas a casa por un acceso con caseta, dentro de barda perimetral y con amenidades solo para residentes.",
    stat: { value: "120", label: "viviendas en el clúster" },
    points: ["Caseta de acceso controlado", "Barda perimetral", "Estacionamiento de visitas", "Amenidades solo para residentes"],
    clipTag: "Llegas a casa",
    imageAlt: "Caseta de acceso controlado con plumas y barda al atardecer",
    clipLabel: "Video: un auto entra por la caseta de acceso",
  },
  ensenada: {
    eyebrow: "Ensenada",
    title: "Vive entre el mar, las montañas *y el vino.*",
    lead: "Ensenada destaca como destino turístico y de inversión: conectividad, oferta vitivinícola, gastronomía de primer nivel y cercanía con la frontera de Estados Unidos.",
    pillars: [
      { title: "Ubicación privilegiada", text: "Zona norte, el área con mayor potencial de crecimiento y una plusvalía en constante aumento." },
      { title: "Destino ideal para el retiro", text: "Clima privilegiado, entorno tranquilo y servicios al alcance." },
      { title: "Inversión con futuro", text: "Turismo todo el año: cruceros, vino, gastronomía y visitantes de California." },
    ],
    stats: [
      { value: 71, suffix: "/100", label: "Market Score de Ensenada en AirDNA" },
      { value: 7.5, prefix: "+", suffix: "%", decimals: 1, label: "tarifa diaria promedio frente a 2025" },
      { value: 10.9, prefix: "+", suffix: "%", decimals: 1, label: "propiedades activas en renta en el último año" },
    ],
    statsSource: "Fuente: AirDNA 2026, mercado de renta vacacional de Ensenada. Rendimientos pasados no garantizan resultados futuros.",
    imageAlt: "Vista aérea de las casas con roof garden y el mar al atardecer",
  },
  location: {
    eyebrow: "Ubicación",
    title: "A 30 minutos del Valle de Guadalupe, *a hora y media de la frontera.*",
    places: [
      { name: "Caseta de San Miguel", dist: "6 km", time: "10 min" },
      { name: "Valle de Guadalupe", dist: "27 km", time: "30 min" },
      { name: "Tijuana", dist: "108 km", time: "1 h 10 min" },
      { name: "Frontera EE. UU. · San Ysidro", dist: "125 km", time: "1 h 30 min" },
      { name: "Mexicali", dist: "250 km", time: "3 h" },
    ],
    note: "Tiempos aproximados en auto, sujetos a tráfico y condiciones de ruta.",
    mapsCta: "Ver El Sauzal en Google Maps",
    tourCta: "Agendar recorrido",
    mapAlt: "Vista aérea de la bahía de Ensenada y la zona norte",
    pin: "Zona norte · El Sauzal",
  },
  homes: {
    eyebrow: "Residencias",
    title: "Dos modelos de un nivel, *los dos con roof garden.*",
    lead: "Sin escaleras en el día a día: todo en una planta, con patio trasero, estacionamiento y tu terraza privada arriba.",
    models: {
      "2R": {
        tab: "2 recámaras",
        name: "2 Recámaras",
        sub: "con roof garden",
        total: "178.06",
        built: "111.53",
        roof: "66.53",
        render: `${I}/proto2r-render.webp`,
        renderAlt: "Render de la calle con casas de 2 recámaras y la sierra al fondo",
        plan: `${I}/planta-2r.webp`,
        planAlt: "Planta baja del modelo de 2 recámaras",
        roofPlan: `${I}/roof-planta-2r.webp`,
        roofPlanAlt: "Planta del roof garden del modelo de 2 recámaras",
        features: [
          "2 recámaras con clóset · 2.5 baños",
          "Sala, comedor y cocina",
          "Patio trasero y cuarto de lavado",
          "Roof con medio baño, barra, tarja y asador",
          "Terreno desde 180 m² · estacionamiento",
        ],
      },
      "3R": {
        tab: "3 recámaras",
        name: "3 Recámaras",
        sub: "con roof garden",
        total: "195.19",
        built: "120.44",
        roof: "74.75",
        render: `${I}/proto3r-render.webp`,
        renderAlt: "Render de la calle con casas de 3 recámaras y vista al mar",
        plan: `${I}/planta-3r.webp`,
        planAlt: "Planta baja del modelo de 3 recámaras",
        roofPlan: `${I}/roof-planta-3r.webp`,
        roofPlanAlt: "Planta del roof garden del modelo de 3 recámaras",
        features: [
          "3 recámaras con clóset · 2.5 baños",
          "Sala, comedor y cocina",
          "Patio trasero y cuarto de lavado",
          "Roof con medio baño, barra, tarja y asador",
          "Terreno desde 180 m² · estacionamiento",
        ],
      },
    },
    badge: "Preventa",
    from: "Desde",
    currency: "MXN",
    totalLabel: "m² disfrutables",
    builtLabel: "m² construcción",
    roofLabel: "m² de roof",
    views: { render: "Render", plan: "Planta", roof: "Roof" },
    quote: "Cotizar el modelo",
    availability: "Disponibilidad",
    quoteTitle: "Cotiza el modelo de {model}",
    note: "Precios de lista de noviembre 2026 en MXN, sujetos a cambio y disponibilidad.",
  },
  homesTeaser: {
    eyebrow: "Las casas",
    title: "Dos modelos de un nivel, *los dos con roof garden.*",
    lead: "Todo en una planta, con patio trasero y estacionamiento, y arriba tu terraza privada con vista al mar.",
    cta: "Ver planos, pagos y plusvalía",
    roofLine: "de roof garden",
  },
  interior: {
    eyebrow: "Por dentro",
    title: "Recorre tu casa, *espacio por espacio.*",
    lead: "Elige un espacio para verlo. Diseño funcional, luz natural y acabados listos para habitarse.",
    rooms: [
      { title: "Sala-comedor", text: "Espacio abierto e iluminado, conectado con la cocina.", image: `${I}/in-sala.webp`, alt: "Sala-comedor con cocina integrada" },
      { title: "Cocina", text: "Barra de granito, estufa con horno y campana desde la entrega.", image: `${I}/in-cocina.webp`, alt: "Cocina con barra de granito" },
      { title: "Recámara principal", text: "Clóset incluido y minisplit para cada temporada.", image: `${I}/in-recamara-principal.webp`, alt: "Recámara principal con clóset" },
      { title: "Recámara", text: "Clóset y minisplit también en la segunda recámara.", image: `${I}/in-recamara.webp`, alt: "Recámara secundaria con clóset" },
      { title: "Baño", text: "Cancel de cristal templado y acabados en tonos naturales.", image: `${I}/in-bano.webp`, alt: "Baño con cancel de cristal templado" },
      { title: "Patio trasero", text: "Tu espacio exterior privado en planta baja.", image: `${I}/in-patio.webp`, alt: "Patio trasero privado" },
    ],
  },
  equipment: {
    eyebrow: "Equipamiento incluido",
    title: "Lista desde el día uno *y controlada desde tu celular.*",
    upTo: "Hasta",
    amount: 450000,
    unit: "",
    amountNote: "en equipamiento incluido en el precio",
    interiorTitle: "Interior",
    interior: [
      "Cocina con barra de granito, estufa con horno y campana",
      "Clósets en recámaras",
      "Minisplit en recámaras y sala-comedor",
      "Baños con cancel de cristal templado",
    ],
    smartTitle: "Smart home",
    smart: ["Cerradura digital", "Aire acondicionado desde la app", "Encendido y apagado de luces", "Conectividad inalámbrica y panel de control"],
    phoneA: "Video: controlas luces, clima y cerradura desde el celular",
    phoneB: "Video: una pareja llega a casa y abre con la cerradura digital",
  },
  roof: {
    eyebrow: "Roof garden",
    title: "Tu terraza privada, *con el Pacífico de fondo.*",
    stats: [
      { value: "66.53", label: "m² de roof en el modelo de 2 recámaras" },
      { value: "74.75", label: "m² de roof en el de 3 recámaras" },
    ],
    features: ["Medio baño", "Barra con tarja", "Asador", "Pérgola"],
    cta: "Quiero conocer el roof",
    imageAlt: "Roof garden con pérgola, barra y asador frente al mar al atardecer",
  },
  amenities: {
    eyebrow: "Amenidades",
    title: "Alberca, pickleball y asadores *a pasos de tu puerta.*",
    lead: "Doce amenidades dentro del clúster y cuatro más en el desarrollo, pensadas para usarse todos los días.",
    featured: [
      { title: "Alberca", text: "Para refrescarte sin salir del clúster.", image: `${I}/alberca-pareja.webp`, alt: "Pareja en la alberca del clúster", pos: "50% 60%" },
      { title: "Pickleball", text: "Cancha propia para jugar con vecinos y amigos.", image: `${I}/am-pickleball.webp`, alt: "Partido en la cancha de pickleball" },
      { title: "Asadores", text: "Asadores y mesas al aire libre para reuniones.", image: `${I}/am-asadores.webp`, alt: "Familia en el área de asadores" },
      { title: "Salón", text: "Salón de usos múltiples bajo la pérgola.", image: `${I}/cena-pergola.webp`, alt: "Amigos cenando bajo la pérgola", pos: "50% 56%" },
      { title: "Andadores", text: "Parque lineal y andadores para caminar.", image: `${I}/am-andadores.webp`, alt: "Pareja caminando por los andadores" },
    ],
    clusterTitle: "Dentro del clúster",
    cluster: [
      "Alberca",
      "Pickleball",
      "Fogatero",
      "Pet zone",
      "Parque lineal",
      "Juegos infantiles",
      "Ejercicio al aire libre",
      "Mesas de juego",
      "Salón de usos múltiples",
      "Acceso controlado",
      "Estacionamiento de visitas",
      "Baños",
    ],
    devTitle: "En el desarrollo",
    dev: ["Senderos", "Ciclovías", "Zonas de descanso", "Casa club"],
  },
  value: {
    eyebrow: "Plusvalía proyectada",
    title: "De $4.57 M hoy *a hasta $9.80 M en 2034.*",
    lead: "Valor estimado de la misma propiedad con una apreciación anual compuesta conservadora (8%) y optimista (10%).",
    labels: ["Hoy · precio base", "A la entrega 2028", "2031", "2034"],
    subs: ["$4,570,545 MXN", "+$794,839 a +$1,003,914", "conservador · optimista", "conservador · optimista"],
    legend: { cons: "Conservador · 8% anual", opt: "Optimista · 10% anual" },
    note: "Precio base del modelo de renta: $4,570,545 MXN. Proyección ilustrativa de valor, no flujo de rentas ni garantía. Cálculo: $4,570,545 × (1 + tasa anual)^(meses/12).",
    ask: "¿Quieres los números con renta de estancia corta incluida?",
    cta: "Pedir el análisis de rentabilidad",
    chartLabel: "Gráfica de plusvalía proyectada de 2026 a 2034",
  },
  pay: {
    eyebrow: "El puente financiero",
    title: "Paga mientras se construye, *liquida al recibir.*",
    lead: "10% de enganche a la firma, 10% en 20 mensualidades durante la construcción y el 80% contra entrega a mediados de 2028, con crédito hipotecario o recursos propios.",
    schemes: { bridge: "10 · 10 · 80 contra entrega", cash: "Contado diferido · 5% desc." },
    calcFor: "Calcular para",
    models: { "2R": "2 rec.", "3R": "3 rec." },
    bridge: {
      today: "Hoy · a la firma",
      downNote: "de enganche",
      during: "Durante la construcción",
      monthlyNote: "20 mensualidades",
      delivery: "Entrega · mediados de 2028",
      deliveryNote: "contra entrega",
      note: "Montos calculados sobre el precio de lista del modelo elegido y redondeados al peso. El 80% puede cubrirse con crédito hipotecario, recursos propios o ambos.",
    },
    cash: {
      final: "5% de descuento",
      finalNote: "precio final",
      down: "40% de enganche",
      monthly: "40% a 19 meses",
      deed: "20% a la firma de escritura",
      note: "Promoción de noviembre 2026 sobre precio de lista. Montos estimados; pueden variar según la unidad.",
    },
    currencyNote: "",
    quote: "“Te armo la corrida exacta con la unidad, el plazo y el crédito que te convengan.”",
    quoteBy: "Fran Morishita · Legacy Capital",
    cta: "Quiero apartar mi casa",
    ctaWa: "Dudas por WhatsApp",
    legal: "Precios, enganche y mensualidades sujetos a cambio sin previo aviso. Esquema válido únicamente con firma de contrato. Aplican restricciones.",
    imageAlt: "Pareja revisando su plan de pagos personalizado en la laptop",
  },
  material: {
    eyebrow: "Material exclusivo",
    title: "Brochure y análisis de rentabilidad, *para recibirlos por email o WhatsApp.*",
    tabs: { roi: "Análisis de rentabilidad", brochure: "Brochure noviembre 2026" },
    sections: {
      brochure: {
        eyebrow: "Brochure noviembre 2026",
        title: "Precios, plantas y amenidades, *en un solo documento.*",
        formTitle: "Recibe el brochure",
        formNote: "Fran te lo envía en PDF con la disponibilidad y la promoción de la semana.",
      },
      roi: {
        eyebrow: "Análisis de rentabilidad",
        title: "Los números de tu inversión, *antes de decidir.*",
        formTitle: "Recibe el análisis de rentabilidad",
        formNote: "Fran te lo envía en PDF y resuelve tus dudas sobre los números.",
      },
    },
    roi: {
      meta: "Renta vacacional · Ensenada · Noviembre 2026",
      title: "Análisis de rentabilidad",
      kpis: [
        { value: "18.33%", label: "rendimiento estimado en 2 años" },
        { value: "+$794,839", label: "plusvalía estimada a la entrega" },
        { value: "2028", label: "entrega, lista para rentar" },
      ],
      rows: [
        ["Ingreso neto anual por renta corta", "$000,000"],
        ["Tarifa y ocupación por temporada", "$0,000 · 00%"],
        ["Gastos de operación y administración", "$00,000"],
        ["Años de recuperación de la inversión", "0.0 años"],
      ],
      disclaimer: "Escenario conservador ilustrativo: plusvalía + rentas a corto plazo. No garantizado; depende de ocupación, tarifas, gastos y mercado.",
    },
    brochure: {
      meta: "Casas con roof garden · Ensenada · Noviembre 2026",
      title: "Brochure de preventa",
      pages: "PDF · 27 págs.",
      rows: [
        ["Lista de precios y promoción de noviembre", "$0,000,000"],
        ["Plantas arquitectónicas de 2 y 3 recámaras", "00 págs."],
        ["Plano de conjunto y plan maestro", "000 lotes"],
        ["Condiciones comerciales completas", "00% · 00%"],
      ],
      coverAlt: "Portada del brochure: casas con roof garden frente al mar al atardecer",
    },
    form: {
      title: "Recíbelo por email o WhatsApp",
      note: "Fran te lo envía en PDF y resuelve tus dudas sobre los números.",
      submitRoi: "Enviarme el análisis",
      submitBrochure: "Enviarme el brochure",
      waRoi: "Hola Fran, soy {name}. Me interesan las casas con vista al mar en Ensenada. ¿Me compartes el análisis de rentabilidad?",
      waBrochure: "Hola Fran, soy {name}. Me interesan las casas con vista al mar en Ensenada. ¿Me compartes el brochure de noviembre?",
      successRoi: "Fran Morishita te enviará hoy mismo el análisis de rentabilidad.",
      successBrochure: "Fran Morishita te enviará hoy mismo el brochure completo.",
    },
    locked: "Disponible en el documento completo",
  },
  contact: {
    eyebrow: "Contacto",
    title: "Cuéntame qué buscas *y te preparo tu propuesta.*",
    lead: "Con tus respuestas te comparto unidades disponibles, la corrida de pagos que te conviene y el mejor momento para visitarnos.",
    formTitle: "Solicita tu propuesta",
    submit: "Enviar mis datos",
    imageAlt: "Fran Morishita recibe a una pareja en la entrada de una casa",
    points: ["Respuesta el mismo día", "Visita en Ensenada o videollamada", "En español o en inglés"],
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Lo que más *me preguntan.*",
    asideTitle: "Quién te acompaña",
    asideText:
      "Legacy Capital Real Estate es una firma de asesoría inmobiliaria en Ensenada. Esta preventa la desarrolla una firma con más de 25 años y más de 30 proyectos concluidos en 10 estados, con respaldo de una institución financiera líder. En tu primera llamada te compartimos todos los datos del desarrollo.",
    items: [
      {
        q: "¿Por qué comprar a través de Legacy Capital?",
        a: "Pagas el mismo precio de lista y ganas a alguien de tu lado: revisamos contigo números, contrato y proceso notarial, y te acompañamos hasta la entrega. En tu primera llamada te compartimos toda la información del desarrollo y del desarrollador.",
      },
      { q: "¿Cuándo se entregan las casas?", a: "La entrega estimada es a mediados de 2028. Las 20 mensualidades del diferido corren durante la construcción." },
      {
        q: "¿Puedo pagar el 80% con crédito hipotecario?",
        a: "Sí. El 80% contra entrega puede cubrirse con crédito hipotecario, recursos propios o una combinación. Te ayudamos a revisar la mejor opción.",
      },
      {
        q: "¿Qué incluye la casa al entregarse?",
        a: "Cocina con barra de granito, estufa con horno y campana, clósets, minisplits, baños con cancel templado, cerradura digital, control de luces y clima desde la app, y roof con medio baño, barra con tarja, asador y pérgola.",
      },
      {
        q: "¿Sirve para renta vacacional?",
        a: "Es una de las razones por las que muchos compran aquí: Ensenada recibe turismo todo el año por su vino, su gastronomía y su cercanía con California. Te enviamos el análisis de rentabilidad y, antes de firmar, el reglamento de la comunidad.",
      },
      {
        q: "¿Pueden comprar extranjeros o mexicanos que viven en Estados Unidos?",
        a: "Sí. Con nacionalidad mexicana escrituras a tu nombre. Si eres extranjero, en la zona costera se compra mediante un fideicomiso bancario. Te acompañamos en todo el proceso, en español o en inglés.",
      },
      {
        q: "¿Qué gastos adicionales debo considerar?",
        a: "Los gastos notariales, impuestos, avalúo y derechos de registro de la escrituración corren por cuenta del comprador, así como las cuotas de mantenimiento a partir de la entrega.",
      },
      { q: "¿Cuánto necesito para apartar?", a: "Escríbenos por WhatsApp y te compartimos el monto de apartado y las unidades disponibles esta semana." },
      { q: "¿Puedo visitar el desarrollo?", a: "Sí. Agenda un recorrido en Ensenada o una videollamada y te mostramos el terreno, los modelos y las vistas." },
    ],
  },
  closing: {
    eyebrow: "Preventa · noviembre 2026",
    title: "Las casas de preventa *no esperan.*",
    lead: "Pregunta por las promociones vigentes y la disponibilidad de esta semana.",
    ctaWa: "Hablar con Fran",
    ctaVisit: "Agenda tu cita",
    videoLabel: "Video: Fran Morishita abre la puerta de una casa",
  },
  moveIn: {
    eyebrow: "¿Lo necesitas ya?",
    title: "También tenemos casas y departamentos *para estrenar hoy.*",
    lead: "Si quieres mudarte o rentar de inmediato, te mostramos departamentos, penthouses y casas terminados en una comunidad con casa club y alberca, a minutos del Valle de Guadalupe.",
    facts: ["Entrega inmediata", "Crédito, Infonavit o contado", "Casa club y alberca"],
    price: "Desde $3.64 MDP",
    priceNote: "con crédito, Infonavit o contado",
    cta: "Ver entrega inmediata",
    videoLabel: "Video de la comunidad con entrega inmediata",
  },
  ui: { play: "Reproducir video", pause: "Pausar video", prev: "Anterior", next: "Siguiente", close: "Cerrar" },
};

const en: ShowcaseCopy = {
  hero: {
    eyebrow: "Pre-sale · Northern Ensenada, Baja California",
    title: "Roof-garden homes facing the *Pacific.*",
    lead: "Single-story homes with ocean and mountain views, in a private gated cluster. Fully equipped at delivery.",
    from: "From",
    amount: { value: 215, decimals: 0, unit: "K USD" },
    noteStrong: "10% down",
    note: "10% in 20 monthly payments · 80% at delivery in 2028",
    ctaPrimary: "Book an appointment",
    ctaSecondary: "Get the brochure",
    trust: ["Developer with 25+ years", "Institutional financial backing", "Delivery 2028"],
    agent: { name: "Your advisor: Fran Morishita", role: "Founder · Legacy Capital Real Estate" },
    reelLabel: "Video: sunset over the homes, the roof garden and the ocean view",
    scroll: "Scroll to the next section",
  },
  homeHero: {
    eyebrow: "Legacy Capital Real Estate · Ensenada, Baja California",
    title: "Your home facing the *Pacific,* with someone on your side.",
    lead: "Single-story pre-sale homes with a roof garden and ocean views, in a private gated cluster in northern Ensenada. We guide you from the first call to the day you get your keys.",
    moveIn: { text: "Need to move in now?", cta: "See move-in-ready homes" },
  },
  band: ["Private roof garden", "Ocean and mountain views", "Gated access", "Smart home included", "Pool · Pickleball · Grills", "Delivery 2028"],
  advisor: {
    eyebrow: "Your advisor",
    title: "Hi, I’m *Fran Morishita.* I’ll guide you every step.",
    body: "I founded Legacy Capital Real Estate so buying a home in Ensenada feels clear and safe. I hand-pick every project I present, show it to you in person or by video call, share this week’s availability and promotions, and build the payment plan that fits your goal: living, retiring or investing. Se habla español.",
    online: "Online today",
    onlineSub: "Same-day replies",
    waLabel: "Direct WhatsApp",
    noFee: "You pay the same list price: my advice costs you nothing extra.",
    steps: [
      { title: "Message me", text: "by WhatsApp, phone or email" },
      { title: "We visit", text: "on site or by video call" },
      { title: "Reserve your home", text: "with the plan that suits you" },
    ],
    ctaWa: "Message Fran",
    ctaVisit: "Book an appointment",
    photoAlt: "Fran Morishita, founder of Legacy Capital Real Estate, in front of one of the homes",
  },
  day: {
    eyebrow: "A day here",
    title: "An ordinary day *feels like vacation.*",
    lead: "Keep scrolling and live a day here, from morning to night.",
    steps: [
      { kicker: "7:00 am", title: "Wake up slowly", text: "Natural light, big windows and mini-split A/C in every bedroom.", video: `${V}/d1-despertar.mp4`, poster: `${V}/d1-despertar.jpg` },
      { kicker: "11:30 am", title: "The pool, steps from home", text: "No driving, no leaving the cluster: the pool is one of your amenities.", video: `${V}/d2-alberca.mp4`, poster: `${V}/d2-alberca.jpg` },
      { kicker: "5:00 pm", title: "Pickleball with friends", text: "A court inside the cluster to play with your neighbors.", video: `${V}/d3-pickleball.mp4`, poster: `${V}/d3-pickleball.jpg` },
      { kicker: "7:00 pm", title: "Family grill night", text: "Grills and tables for get-togethers inside the cluster.", video: `${V}/d4-asador.mp4`, poster: `${V}/d4-asador.jpg` },
      {
        kicker: "8:00 pm",
        title: "Sunset on your roof",
        text: "Bar, grill and pergola right above your home. That’s how an ordinary day ends on the Pacific.",
        video: `${V}/d5-atardecer.mp4`,
        poster: `${V}/d5-atardecer.jpg`,
      },
    ],
    cta: "I want this life",
    frameLabel: "Videos of a day in the community",
  },
  path: {
    eyebrow: "How you buy with Fran",
    title: "From your first message *to the keys to your home.*",
    lead: "Four steps, and I’m with you in every one. Keep scrolling.",
    steps: [
      {
        kicker: "01",
        title: "Message me from anywhere",
        text: "From California, Arizona or anywhere in Mexico: I reply the same day by WhatsApp, phone or email.",
        video: `${V}/p1-contacto.mp4`,
        poster: `${V}/p1-contacto.jpg`,
      },
      {
        kicker: "02",
        title: "You see the project",
        text: "I show you the land and the sales office in person, or floor plans, renders and construction progress by video call.",
        video: `${V}/fran-sala.mp4`,
        poster: `${V}/fran-sala.jpg`,
      },
      {
        kicker: "03",
        title: "Sign with confidence",
        text: "Reserve your home and sign your contract with 10% down. We review the contract, the notary and, for foreign buyers, the bank trust with you.",
        video: `${V}/p3-firma.mp4`,
        poster: `${V}/p3-firma.jpg`,
      },
      {
        kicker: "04",
        title: "Get your keys",
        text: "Estimated delivery mid-2028. Ready to move in facing the Pacific?",
        video: `${V}/p4-llaves.mp4`,
        poster: `${V}/p4-llaves.jpg`,
      },
    ],
    cta: "I want my keys",
    ctaWa: "WhatsApp",
    frameLabel: "Videos of the buying process with Fran",
  },
  secure: {
    eyebrow: "Gated access",
    title: "A private cluster *built for peace of mind.*",
    lead: "You come home through a guarded gate, inside a perimeter wall, with amenities for residents only.",
    stat: { value: "120", label: "homes in the cluster" },
    points: ["Guarded access gate", "Perimeter wall", "Visitor parking", "Amenities for residents only"],
    clipTag: "Coming home",
    imageAlt: "Guarded entrance gate and perimeter wall at sunset",
    clipLabel: "Video: a car drives in through the guarded gate",
  },
  ensenada: {
    eyebrow: "Ensenada",
    title: "Live between the ocean, the mountains *and the wine.*",
    lead: "Ensenada stands out as a travel and investment destination: easy access, wine country, world-class food and less than two hours from the US border.",
    pillars: [
      { title: "Prime location", text: "Northern Ensenada, the area with the highest growth potential and steadily rising values." },
      { title: "Ideal for retirement", text: "Mild climate, a calm setting and services close by." },
      { title: "Investment with a future", text: "Year-round tourism: cruise ships, wine, food and visitors from California." },
    ],
    stats: [
      { value: 71, suffix: "/100", label: "Ensenada Market Score on AirDNA" },
      { value: 7.5, prefix: "+", suffix: "%", decimals: 1, label: "average daily rate vs. 2025" },
      { value: 10.9, prefix: "+", suffix: "%", decimals: 1, label: "active rental listings in the last year" },
    ],
    statsSource: "Source: AirDNA 2026, Ensenada vacation rental market. Past performance does not guarantee future results.",
    imageAlt: "Aerial view of the roof-garden homes and the ocean at sunset",
  },
  location: {
    eyebrow: "Location",
    title: "30 minutes from Valle de Guadalupe, *90 minutes from the border.*",
    places: [
      { name: "Caseta de San Miguel", dist: "4 mi", time: "10 min" },
      { name: "Valle de Guadalupe", dist: "17 mi", time: "30 min" },
      { name: "Tijuana", dist: "67 mi", time: "1 h 10 min" },
      { name: "US border · San Ysidro", dist: "78 mi", time: "1 h 30 min" },
      { name: "Mexicali", dist: "155 mi", time: "3 h" },
    ],
    note: "Approximate drive times; traffic and border waits vary.",
    mapsCta: "See El Sauzal on Google Maps",
    tourCta: "Book a tour",
    mapAlt: "Aerial view of Ensenada bay and the northern area",
    pin: "Northern Ensenada · El Sauzal",
  },
  homes: {
    eyebrow: "Homes",
    title: "Two single-story models, *both with a roof garden.*",
    lead: "No stairs in daily life: everything on one floor, with a backyard, parking and your private terrace upstairs.",
    models: {
      "2R": {
        tab: "2 bedrooms",
        name: "2 Bedrooms",
        sub: "with roof garden",
        total: "1,917",
        built: "1,200",
        roof: "716",
        render: `${I}/proto2r-render.webp`,
        renderAlt: "Rendering of the street with 2-bedroom homes and the mountains behind",
        plan: `${I}/planta-2r.webp`,
        planAlt: "2-bedroom ground-floor plan",
        roofPlan: `${I}/roof-planta-2r.webp`,
        roofPlanAlt: "2-bedroom roof garden plan",
        features: [
          "2 bedrooms with closets · 2.5 baths",
          "Living room, dining room and kitchen",
          "Backyard and laundry room",
          "Roof with half bath, bar, sink and grill",
          "Lot from 1,938 sq ft · parking",
        ],
      },
      "3R": {
        tab: "3 bedrooms",
        name: "3 Bedrooms",
        sub: "with roof garden",
        total: "2,101",
        built: "1,296",
        roof: "805",
        render: `${I}/proto3r-render.webp`,
        renderAlt: "Rendering of the street with 3-bedroom homes and an ocean view",
        plan: `${I}/planta-3r.webp`,
        planAlt: "3-bedroom ground-floor plan",
        roofPlan: `${I}/roof-planta-3r.webp`,
        roofPlanAlt: "3-bedroom roof garden plan",
        features: [
          "3 bedrooms with closets · 2.5 baths",
          "Living room, dining room and kitchen",
          "Backyard and laundry room",
          "Roof with half bath, bar, sink and grill",
          "Lot from 1,938 sq ft · parking",
        ],
      },
    },
    badge: "Pre-sale",
    from: "From",
    currency: "USD",
    totalLabel: "sq ft of living space",
    builtLabel: "sq ft built",
    roofLabel: "sq ft roof garden",
    views: { render: "Rendering", plan: "Floor plan", roof: "Roof" },
    quote: "Get a quote",
    availability: "Availability",
    quoteTitle: "Get a quote for the {model} model",
    note: "November 2026 list prices. USD amounts are approximate at 18.5 MXN per USD; contracts are signed in Mexican pesos.",
  },
  homesTeaser: {
    eyebrow: "The homes",
    title: "Two single-story models, *both with a roof garden.*",
    lead: "Everything on one floor, with a backyard and parking, and your private ocean-view terrace upstairs.",
    cta: "See floor plans, payments and appreciation",
    roofLine: "roof garden",
  },
  interior: {
    eyebrow: "Inside",
    title: "Tour your home, *room by room.*",
    lead: "Pick a room to see it. Functional design, natural light and move-in-ready finishes.",
    rooms: [
      { title: "Living-dining", text: "Open, bright space connected to the kitchen.", image: `${I}/in-sala.webp`, alt: "Living and dining room with open kitchen" },
      { title: "Kitchen", text: "Granite bar, stove with oven and range hood at delivery.", image: `${I}/in-cocina.webp`, alt: "Kitchen with granite bar" },
      { title: "Primary bedroom", text: "Built-in closet and mini-split A/C for every season.", image: `${I}/in-recamara-principal.webp`, alt: "Primary bedroom with closet" },
      { title: "Bedroom", text: "Closet and mini-split in the second bedroom too.", image: `${I}/in-recamara.webp`, alt: "Second bedroom with closet" },
      { title: "Bathroom", text: "Tempered-glass shower and natural-tone finishes.", image: `${I}/in-bano.webp`, alt: "Bathroom with tempered-glass shower" },
      { title: "Backyard", text: "Your private outdoor space on the ground floor.", image: `${I}/in-patio.webp`, alt: "Private backyard" },
    ],
  },
  equipment: {
    eyebrow: "Equipment included",
    title: "Ready from day one *and controlled from your phone.*",
    upTo: "Up to",
    amount: 24000,
    unit: "USD",
    amountNote: "in equipment included in the price",
    interiorTitle: "Interior",
    interior: ["Kitchen with granite bar, stove, oven and range hood", "Closets in bedrooms", "Mini-split A/C in bedrooms and living area", "Tempered-glass showers"],
    smartTitle: "Smart home",
    smart: ["Digital door lock", "A/C controlled from the app", "Lights on and off from your phone", "Wireless connectivity and control panel"],
    phoneA: "Video: lights, climate and door lock controlled from a phone",
    phoneB: "Video: a couple arrives home and opens the digital lock",
  },
  roof: {
    eyebrow: "Roof garden",
    title: "Your private terrace, *with the Pacific as backdrop.*",
    stats: [
      { value: "716", label: "sq ft roof on the 2-bedroom model" },
      { value: "805", label: "sq ft roof on the 3-bedroom model" },
    ],
    features: ["Half bath", "Bar with sink", "Grill", "Pergola"],
    cta: "See the roof in person",
    imageAlt: "Roof garden with pergola, bar and grill facing the ocean at sunset",
  },
  amenities: {
    eyebrow: "Amenities",
    title: "Pool, pickleball and grills *steps from your door.*",
    lead: "Twelve amenities inside the cluster and four more in the development, made for everyday use.",
    featured: [
      { title: "Pool", text: "Cool off without leaving the cluster.", image: `${I}/alberca-pareja.webp`, alt: "Couple at the cluster pool", pos: "50% 60%" },
      { title: "Pickleball", text: "Your own court to play with neighbors and friends.", image: `${I}/am-pickleball.webp`, alt: "Game on the pickleball court" },
      { title: "Grills", text: "Outdoor grills and tables for get-togethers.", image: `${I}/am-asadores.webp`, alt: "Family at the grill area" },
      { title: "Lounge", text: "Multipurpose lounge under the pergola.", image: `${I}/cena-pergola.webp`, alt: "Friends having dinner under the pergola", pos: "50% 56%" },
      { title: "Walking paths", text: "Linear park and walking paths.", image: `${I}/am-andadores.webp`, alt: "Couple walking along the paths" },
    ],
    clusterTitle: "Inside the cluster",
    cluster: [
      "Pool",
      "Pickleball",
      "Fire pit",
      "Pet zone",
      "Linear park",
      "Playground",
      "Outdoor gym",
      "Game tables",
      "Multipurpose lounge",
      "Gated access",
      "Visitor parking",
      "Restrooms",
    ],
    devTitle: "In the development",
    dev: ["Trails", "Bike lanes", "Rest areas", "Clubhouse"],
  },
  value: {
    eyebrow: "Projected appreciation",
    title: "From $247K today *to as much as $530K by 2034.*",
    lead: "Estimated value of the same property with conservative (8%) and optimistic (10%) compound annual appreciation, in USD.",
    labels: ["Today · base price", "At delivery 2028", "2031", "2034"],
    subs: ["$247,057 USD", "+$42,964 to +$54,266", "conservative · optimistic", "conservative · optimistic"],
    legend: { cons: "Conservative · 8% a year", opt: "Optimistic · 10% a year" },
    note: "Base price of the rental model: MXN $4,570,545 (≈ $247,057 USD at 18.5 MXN per USD). Illustrative value projection, not rental income or a guarantee. Formula: price × (1 + annual rate)^(months/12).",
    ask: "Want the numbers with short-term rental income included?",
    cta: "Get the ROI analysis",
    chartLabel: "Chart of projected appreciation from 2026 to 2034",
  },
  pay: {
    eyebrow: "The payment bridge",
    title: "Pay while it’s built, *settle at delivery.*",
    lead: "10% down at signing, 10% in 20 monthly payments during construction, and 80% at delivery in mid-2028, with a mortgage or your own funds.",
    schemes: { bridge: "10 · 10 · 80 at delivery", cash: "Deferred cash · 5% off" },
    calcFor: "Calculate for",
    models: { "2R": "2 bed", "3R": "3 bed" },
    bridge: {
      today: "Today · at signing",
      downNote: "down payment",
      during: "During construction",
      monthlyNote: "20 monthly payments",
      delivery: "Delivery · mid-2028",
      deliveryNote: "at delivery",
      note: "Amounts based on the list price of the selected model. The 80% can be covered with a mortgage, your own funds or both.",
    },
    cash: {
      final: "5% discount",
      finalNote: "final price",
      down: "40% down payment",
      monthly: "40% over 19 months",
      deed: "20% at deed signing",
      note: "November 2026 promotion on list price. Estimated amounts; they may vary by unit.",
    },
    currencyNote: "Shown in USD at 18.5 MXN per USD (approximate; contracts are in Mexican pesos).",
    quote: "“I’ll build the exact payment plan for the unit, timeline and financing that fit you.”",
    quoteBy: "Fran Morishita · Legacy Capital",
    cta: "Reserve my home",
    ctaWa: "Questions on WhatsApp",
    legal: "Prices, down payment and monthly payments subject to change without notice. Plan valid only with a signed contract. Restrictions apply.",
    imageAlt: "Couple reviewing their custom payment plan on a laptop",
  },
  material: {
    eyebrow: "Exclusive material",
    title: "Brochure and ROI analysis, *sent to your email or WhatsApp.*",
    tabs: { roi: "ROI analysis", brochure: "November 2026 brochure" },
    sections: {
      brochure: {
        eyebrow: "November 2026 brochure",
        title: "Prices, floor plans and amenities, *in one document.*",
        formTitle: "Get the brochure",
        formNote: "Fran sends you the PDF with this week’s availability and promotion.",
      },
      roi: {
        eyebrow: "ROI analysis",
        title: "The numbers behind your investment, *before you decide.*",
        formTitle: "Get the ROI analysis",
        formNote: "Fran sends you the PDF and answers your questions about the numbers.",
      },
    },
    roi: {
      meta: "Vacation rental · Ensenada · November 2026",
      title: "ROI analysis",
      kpis: [
        { value: "18.33%", label: "estimated return over 2 years" },
        { value: "+$42,964", label: "estimated appreciation at delivery (USD)" },
        { value: "2028", label: "delivery, ready to rent" },
      ],
      rows: [
        ["Annual net short-term rental income", "$000,000"],
        ["Nightly rate and occupancy by season", "$0,000 · 00%"],
        ["Operating and management costs", "$00,000"],
        ["Payback period", "0.0 yrs"],
      ],
      disclaimer: "Illustrative conservative scenario: appreciation + short-term rentals. Not guaranteed; depends on occupancy, rates, costs and market.",
    },
    brochure: {
      meta: "Roof-garden homes · Ensenada · November 2026",
      title: "Pre-sale brochure",
      pages: "PDF · 27 pages",
      rows: [
        ["Price list and November promotion", "$0,000,000"],
        ["2- and 3-bedroom floor plans", "00 pp."],
        ["Site plan and master plan", "000 lots"],
        ["Full commercial terms", "00% · 00%"],
      ],
      coverAlt: "Brochure cover: roof-garden homes facing the ocean at sunset",
    },
    form: {
      title: "Get it by email or WhatsApp",
      note: "Fran sends you the PDF and answers your questions about the numbers.",
      submitRoi: "Send me the analysis",
      submitBrochure: "Send me the brochure",
      waRoi: "Hi Fran, I'm {name}. I'm interested in the ocean-view homes in Ensenada. Could you send me the ROI analysis?",
      waBrochure: "Hi Fran, I'm {name}. I'm interested in the ocean-view homes in Ensenada. Could you send me the November brochure?",
      successRoi: "Fran Morishita will send you the ROI analysis today.",
      successBrochure: "Fran Morishita will send you the full brochure today.",
    },
    locked: "Included in the full document",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell me what you’re looking for *and I’ll prepare your proposal.*",
    lead: "With your answers I’ll share available units, the payment plan that suits you and the best time to visit.",
    formTitle: "Request your proposal",
    submit: "Send my details",
    imageAlt: "Fran Morishita welcomes a couple at the entrance of a home",
    points: ["Same-day reply", "Visit in Ensenada or video call", "In English or Spanish"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "What buyers *ask me most.*",
    asideTitle: "Who’s on your side",
    asideText:
      "Legacy Capital Real Estate is a real estate advisory firm in Ensenada. This pre-sale is developed by a firm with 25+ years and 30+ completed projects in 10 Mexican states, backed by a leading financial institution. On your first call we share every detail of the development.",
    items: [
      {
        q: "Why buy through Legacy Capital?",
        a: "You pay the same list price and gain someone on your side: we go through the numbers, the contract and the notary process with you, and stay with you until delivery. On your first call we share all the details of the development and the developer.",
      },
      { q: "When are the homes delivered?", a: "Estimated delivery is mid-2028. The 20 monthly payments run during construction." },
      { q: "Can I pay the 80% with a mortgage?", a: "Yes. The 80% at delivery can be covered with a mortgage, your own funds or a combination. We’ll help you review the best option." },
      {
        q: "What’s included at delivery?",
        a: "Kitchen with granite bar, stove, oven and range hood, closets, mini-split A/C, tempered-glass showers, digital lock, lights and climate from the app, and a roof with half bath, bar with sink, grill and pergola.",
      },
      {
        q: "Does it work as a vacation rental?",
        a: "It’s one of the main reasons people buy here: Ensenada draws visitors year-round for its wine, food and proximity to California. We’ll send you the ROI analysis and, before you sign, the community rules.",
      },
      {
        q: "Can foreigners or Mexicans living in the US buy?",
        a: "Yes. With Mexican citizenship you can take title in your own name. Foreign buyers in the coastal zone purchase through a bank trust (fideicomiso). We guide you through the whole process, in English or Spanish.",
      },
      {
        q: "What additional costs should I plan for?",
        a: "Notary fees, taxes, appraisal and registration fees at closing are paid by the buyer, as well as HOA fees from delivery onward.",
      },
      { q: "How much do I need to reserve?", a: "Message us on WhatsApp and we’ll share the reservation amount and the units available this week." },
      { q: "Can I visit the development?", a: "Yes. Book a tour in Ensenada or a video call and we’ll show you the land, the models and the views." },
    ],
  },
  closing: {
    eyebrow: "Pre-sale · November 2026",
    title: "Pre-sale homes *don’t wait.*",
    lead: "Ask about current promotions and this week’s availability.",
    ctaWa: "Talk to Fran",
    ctaVisit: "Book an appointment",
    videoLabel: "Video: Fran Morishita opens the door of a home",
  },
  moveIn: {
    eyebrow: "Need it now?",
    title: "We also have homes and condos *ready to move in today.*",
    lead: "If you want to move in or rent right away, we’ll show you finished condos, penthouses and homes in a community with a clubhouse and pool, minutes from Valle de Guadalupe.",
    facts: ["Move-in ready", "Mortgage, Infonavit or cash", "Clubhouse and pool"],
    price: "From MXN $3.64M",
    priceNote: "with a mortgage, Infonavit or cash",
    cta: "See move-in-ready homes",
    videoLabel: "Video of the move-in-ready community",
  },
  ui: { play: "Play video", pause: "Pause video", prev: "Previous", next: "Next", close: "Close" },
};

export const showcase: Record<Lang, ShowcaseCopy> = { es, en };
