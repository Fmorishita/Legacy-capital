// Viñedos del Mar (El Sauzal, Ensenada): producto terminado con entrega inmediata.
// Fuente: sitio oficial del desarrollo y fichas de cada prototipo (consultados en octubre de 2026):
// modelos, superficies, precios de lista "desde", mensualidades de referencia, amenidades,
// ubicación (carretera Tecate–Ensenada km 103.5) y tiempos de traslado. No se publica el nombre del
// desarrollador: Legacy Capital lo comparte directamente con cada prospecto.

import { es } from "@/lib/i18n/es";
import { en } from "@/lib/i18n/en";
import type { Dict } from "@/lib/i18n/es";
import type { FaqCopy, FinalCtaCopy, NavCopy } from "@/lib/i18n/types";
import type { Lang } from "@/lib/site";
import type { Interest } from "@/components/lead/LeadForm";

export type VdmModel = {
  id: string;
  interest: Interest;
  type: string;
  name: string;
  tagline: string;
  price: string;
  monthly: string;
  specs: { label: string; value: string }[];
  features: string[];
  images: { src: string; alt: string }[];
  plan: string;
};

export type VdmCopy = {
  meta: { title: string; description: string; ogAlt: string };
  nav: NavCopy;
  hero: {
    status: string;
    place: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageAlt: string;
    tagline: string;
  };
  quickForm: Dict["quickForm"];
  form: Dict["form"];
  facts: { value: string; label: string }[];
  models: {
    eyebrow: string;
    title: string;
    body: string;
    tabsLabel: string;
    from: string;
    monthly: string;
    viewPhotos: string;
    viewPlan: string;
    planLock: string;
    planCta: string;
    cta: string;
    ctaTitle: string;
    prev: string;
    next: string;
    photo: string;
    note: string;
    items: VdmModel[];
  };
  immediate: {
    eyebrow: string;
    title: string;
    body: string;
    pillars: { icon: "eye" | "bank" | "key"; title: string; text: string }[];
    timing: string;
  };
  tour: {
    title: string;
    body: string;
    play: string;
    pause: string;
    tiles: { image: string; alt: string; caption: string }[];
  };
  amenities: {
    eyebrow: string;
    title: string;
    body: string;
    items: { icon: string; label: string }[];
    imageAlt: string;
    note: string;
  };
  audience: {
    eyebrow: string;
    title: string;
    items: { icon: "family" | "wine" | "chart" | "globe"; title: string; text: string }[];
    cta: string;
  };
  location: {
    eyebrow: string;
    title: string;
    body: string;
    times: { value: string; unit: string; place: string }[];
    nearbyTitle: string;
    nearby: string[];
    address: string;
    mapCta: string;
    videoAlt: string;
    caption: string;
  };
  crossSell: { eyebrow: string; title: string; body: string };
  advisor: Dict["advisor"];
  trust: Dict["trust"];
  faq: FaqCopy;
  finalCta: FinalCtaCopy;
  mobileBar: Dict["mobileBar"];
  exit: Dict["exit"];
  dialog: Dict["dialog"];
  footer: Dict["footer"];
  a11y: Dict["a11y"];
};

const MAPS = "https://www.google.com/maps/search/?api=1&query=Vi%C3%B1edos+del+Mar%2C+El+Sauzal%2C+Ensenada%2C+B.C.";
export const vdmMapsUrl = MAPS;

const img = (name: string) => `/img/vdm/${name}.jpg`;

// ---------------------------------------------------------------- Español

const vdmEs: VdmCopy = {
  meta: {
    title: "Viñedos del Mar: departamentos y casas con entrega inmediata en Ensenada | Legacy Capital",
    description:
      "Departamentos, penthouses y casas terminados en Viñedos del Mar, El Sauzal, a 10 minutos del Valle de Guadalupe. Desde $3.64 MDP con crédito bancario, Infonavit o contado. Agenda tu recorrido con Legacy Capital.",
    ogAlt: "Viñedos del Mar: alberca y casa club, entrega inmediata en Ensenada",
  },
  nav: {
    links: [
      { href: "#modelos", label: "Modelos" },
      { href: "#entrega", label: "Entrega" },
      { href: "#amenidades", label: "Amenidades" },
      { href: "#ubicacion", label: "Ubicación" },
      { href: "#asesor", label: "Asesor" },
    ],
    cta: "Ver inventario",
    switchLang: { label: "English", href: "/en/vinedos-del-mar", short: "EN" },
    advisors: es.nav.advisors,
  },
  hero: {
    status: "Entrega inmediata",
    place: "El Sauzal, Ensenada",
    title: "Estrena hoy, a las puertas del Valle de Guadalupe.",
    subtitle:
      "Departamentos, penthouses y casas terminados en Viñedos del Mar, una comunidad con casa club y alberca entre el mar y la ruta del vino. Desde $3.64 MDP.",
    ctaPrimary: "Ver inventario disponible",
    ctaSecondary: "Escribir por WhatsApp",
    imageAlt: "Alberca con pérgola y casa club de Viñedos del Mar",
    tagline: "Building wealth for generations",
  },
  quickForm: {
    title: "Recibe el inventario disponible",
    subtitle: "Te enviamos por WhatsApp las unidades disponibles hoy, con precio, planos y una corrida con crédito o contado.",
    priceLine: [
      { label: "Departamentos", value: "desde $3.64 MDP" },
      { label: "Casas", value: "desde $4.91 MDP" },
    ],
    advisor: es.quickForm.advisor,
  },
  form: {
    ...es.form,
    interest: "¿Qué te interesa?",
    interests: [
      { value: "depa", label: "Departamento" },
      { value: "ph", label: "Penthouse" },
      { value: "casa", label: "Casa" },
      { value: "explorando", label: "Aún no sé" },
    ],
    messagePh: "Cuéntanos qué buscas o qué día te gustaría hacer el recorrido",
    visitMode: "¿Cómo prefieres conocerlo?",
    visitModes: [
      { value: "presencial", label: "Recorrido en Ensenada" },
      { value: "videollamada", label: "Videollamada" },
    ],
    submit: "Recibir inventario y precios",
    submitVisit: "Agendar recorrido",
    submitFloorplan: "Recibir planos",
    success: {
      ...es.form.success,
      body: "Fran Morishita te escribirá por WhatsApp hoy mismo con el inventario disponible y los precios.",
      whatsapp: "Recibirlo ahora por WhatsApp",
    },
    waMessage:
      "Hola Fran, soy {name}. Me interesa Viñedos del Mar en Ensenada{interest}. ¿Me compartes el inventario disponible y los precios?",
    waGeneric: "Hola Fran, me interesa Viñedos del Mar en Ensenada. ¿Me compartes el inventario disponible y los precios?",
  },
  facts: [
    { value: "4", label: "modelos, del departamento a la casa con roof top" },
    { value: "450", label: "familias ya viven en la comunidad" },
    { value: "10 min", label: "del Valle de Guadalupe" },
    { value: "18 min", label: "del centro de Ensenada" },
    { value: "3", label: "formas de pago: crédito bancario, Infonavit o contado" },
  ],
  models: {
    eyebrow: "Del departamento a la casa",
    title: "Cuatro modelos terminados. Elige el tuyo.",
    body: "Desde un departamento de 2 recámaras hasta una casa de tres plantas con roof top. Te mostramos las unidades disponibles hoy de cada modelo.",
    tabsLabel: "Modelos de Viñedos del Mar",
    from: "Desde",
    monthly: "Mensualidad de referencia desde",
    viewPhotos: "Fotos",
    viewPlan: "Planta",
    planLock: "Planos con medidas, por WhatsApp.",
    planCta: "Recibir planos",
    cta: "Ver unidades disponibles",
    ctaTitle: "Unidades disponibles: {model}",
    prev: "Foto anterior",
    next: "Foto siguiente",
    photo: "Foto {n} de {total}",
    note: "Precios de lista del desarrollador (octubre de 2026), en MXN, sujetos a cambio y disponibilidad. *Mensualidad de referencia con crédito hipotecario; depende de tu enganche, plazo, tasa y aprobación.",
    items: [
      {
        id: "palomino",
        interest: "palomino",
        type: "Departamento",
        name: "Palomino",
        tagline: "2 recámaras, tres balcones y roof top en el edificio.",
        price: "$3.64 MDP",
        monthly: "$37,434",
        specs: [
          { label: "Recámaras", value: "2" },
          { label: "Baños", value: "2" },
          { label: "Construcción", value: "73.68 m²" },
          { label: "Balcones", value: "6.28 m²" },
        ],
        features: [
          "Sala, comedor y cocina integrados",
          "Tres balcones",
          "Área de lavado junto a la cocina",
          "Piso rectificado",
          "Roof top común con pérgola",
          "Estacionamiento",
        ],
        images: [
          { src: img("palomino-1"), alt: "Sala y comedor del departamento Palomino" },
          { src: img("palomino-2"), alt: "Cocina con barra del departamento Palomino" },
          { src: img("palomino-3"), alt: "Comedor junto al ventanal del departamento Palomino" },
          { src: img("palomino-4"), alt: "Recámara principal del departamento Palomino" },
          { src: img("palomino-5"), alt: "Comedor decorado de un departamento Palomino" },
          { src: img("palomino-6"), alt: "Recámara decorada de un departamento Palomino" },
        ],
        plan: img("plan-palomino"),
      },
      {
        id: "palomino-ph",
        interest: "palomino_ph",
        type: "Penthouse",
        name: "Palomino Penthouse",
        tagline: "Más espacio, tres balcones y terraza privada.",
        price: "$4.20 MDP",
        monthly: "$41,178",
        specs: [
          { label: "Recámaras", value: "2" },
          { label: "Baños", value: "2" },
          { label: "Construcción", value: "100.34 m²" },
          { label: "Balcones y terraza", value: "24.08 m²" },
        ],
        features: [
          "Terraza privada",
          "Tres balcones",
          "Cocina con barra",
          "Cuarto de lavado",
          "Piso rectificado",
          "Roof top común con pérgola",
        ],
        images: [
          { src: img("ph-1"), alt: "Comedor amueblado de un Palomino Penthouse" },
          { src: img("ph-2"), alt: "Cocina con barra de granito" },
          { src: img("ph-3"), alt: "Sala amueblada con luz natural" },
          { src: img("ph-4"), alt: "Recámara principal amueblada" },
          { src: img("ph-5"), alt: "Comedor redondo junto a la sala" },
          { src: img("ph-6"), alt: "Cocina con acabados en madera" },
        ],
        plan: img("plan-ph"),
      },
      {
        id: "azur",
        interest: "azur",
        type: "Casa",
        name: "Azur",
        tagline: "Dos plantas, patio y recámara principal con balcón.",
        price: "$4.91 MDP",
        monthly: "$51,412",
        specs: [
          { label: "Recámaras", value: "3" },
          { label: "Baños", value: "2.5" },
          { label: "Construcción", value: "133.78 m²" },
          { label: "Terreno", value: "125.80 m²" },
        ],
        features: [
          "Cochera para 2 autos",
          "Muro de cristal hacia el patio",
          "Sala de TV",
          "Recámara principal con baño-vestidor y balcón",
          "Fachada con piedra natural",
          "Mármol en muebles de baño",
          "Escalera en doble altura",
          "Puerta principal de seguridad",
        ],
        images: [
          { src: img("azur-1"), alt: "Cocina con isla y comedor de la casa Azur" },
          { src: img("azur-2"), alt: "Sala con muro de cristal hacia el patio en la casa Azur" },
          { src: img("azur-3"), alt: "Sala amueblada de la casa Azur" },
          { src: img("azur-4"), alt: "Recámara con balcón y vista en la casa Azur" },
          { src: img("azur-5"), alt: "Comedor decorado de una casa Azur" },
          { src: img("azur-6"), alt: "Baño con cancel de cristal en la casa Azur" },
        ],
        plan: img("plan-azur"),
      },
      {
        id: "teide",
        interest: "teide",
        type: "Casa con roof top",
        name: "Teide",
        tagline: "Tres plantas y una terraza en la azotea para cada atardecer.",
        price: "$5.30 MDP",
        monthly: "$54,122",
        specs: [
          { label: "Recámaras", value: "3" },
          { label: "Baños", value: "2 + 2 medios" },
          { label: "Construcción", value: "137.72 m²" },
          { label: "Terreno", value: "125.80 m²" },
        ],
        features: [
          "Roof top con terraza techada y barra para asador",
          "Medio baño y cuarto de servicio en el roof top",
          "Cochera para 2 autos",
          "Recámara principal con baño-vestidor",
          "Dos balcones",
          "Pisos de gran formato",
          "Fachada con piedra natural",
          "Puerta principal de seguridad",
        ],
        images: [
          { src: img("teide-1"), alt: "Roof top de la casa Teide con terraza, tarja y vista a los cerros" },
          { src: img("teide-2"), alt: "Comedor y sala de la casa Teide" },
          { src: img("teide-3"), alt: "Cocina con isla y escalera de la casa Teide" },
          { src: img("teide-4"), alt: "Recámara con ventanal y vista en la casa Teide" },
          { src: img("teide-5"), alt: "Cocina con barra y comedor de una casa Teide" },
          { src: img("teide-6"), alt: "Recámara secundaria de la casa Teide" },
        ],
        plan: img("plan-teide"),
      },
    ],
  },
  immediate: {
    eyebrow: "Entrega inmediata",
    title: "Sin esperar obra: la recorres, la apartas y la estrenas.",
    body: "Viñedos del Mar ya está construido y habitado. Lo que ves en tu recorrido es lo que compras.",
    pillars: [
      {
        icon: "eye",
        title: "Lo que ves es lo que compras",
        text: "Recorres la unidad terminada antes de decidir: acabados, vista, vecinos y amenidades reales.",
      },
      {
        icon: "bank",
        title: "Usas tu crédito hoy",
        text: "Crédito bancario, Infonavit o contado, con escritura ante notario.",
      },
      {
        icon: "key",
        title: "Te mudas o la rentas ya",
        text: "Sin pagar renta mientras esperas una obra. Si es inversión, empieza a trabajar desde que la recibes.",
      },
    ],
    timing:
      "De contado, la escritura puede firmarse en pocas semanas. Con crédito, el tiempo depende de la aprobación de tu banco o de Infonavit; te damos un calendario estimado desde el primer día.",
  },
  tour: {
    title: "Así se ve hoy.",
    body: "La comunidad, las amenidades y casas muestra amuebladas, tal como las vas a recorrer.",
    play: "Reproducir recorrido en video",
    pause: "Pausar video",
    tiles: [
      { image: img("pool-drone"), alt: "Alberca de la casa club vista desde el aire", caption: "Alberca de la casa club" },
      { image: img("firepit"), alt: "Fogatero entre muros de piedra junto a la casa club", caption: "Fogatero junto a la casa club" },
      { image: img("rooftop-terrace"), alt: "Roof top amueblado de una casa Teide", caption: "Roof top del modelo Teide" },
      { image: img("towers-pool"), alt: "Edificios de departamentos con alberca", caption: "Edificios de departamentos" },
    ],
  },
  amenities: {
    eyebrow: "Amenidades",
    title: "La casa club ya está lista para ti.",
    body: "Amenidades terminadas y en uso, dentro de una comunidad privada con acceso controlado.",
    items: [
      { icon: "pool", label: "Alberca" },
      { icon: "club", label: "Casa club" },
      { icon: "fire", label: "Fogatero" },
      { icon: "park", label: "Áreas verdes" },
      { icon: "kids", label: "Área infantil" },
      { icon: "pet", label: "Pet park" },
      { icon: "rooftop", label: "Roof top en edificios" },
      { icon: "gate", label: "Acceso controlado" },
    ],
    imageAlt: "Alberca y casa club de Viñedos del Mar al atardecer",
    note: "Comunidad privada con acceso controlado.",
  },
  audience: {
    eyebrow: "Para quién es",
    title: "Ideal si quieres estrenar sin esperar.",
    items: [
      {
        icon: "family",
        title: "Familias de Ensenada",
        text: "Deja de rentar: usa tu crédito y estrena en una comunidad con casa club, áreas verdes y acceso controlado.",
      },
      {
        icon: "wine",
        title: "Segunda casa cerca del Valle",
        text: "A 10 minutos del Valle de Guadalupe y a 15 del mar, lista para usarse desde el primer fin de semana.",
      },
      {
        icon: "chart",
        title: "Inversionistas",
        text: "Producto terminado que puede generar ingresos desde que lo recibes. Antes de comprar te compartimos el reglamento de la comunidad.",
      },
      {
        icon: "globe",
        title: "Mexicanos en Estados Unidos",
        text: "Compra a distancia con recorrido por videollamada. Con nacionalidad mexicana escrituras a tu nombre.",
      },
    ],
    cta: "Quiero ver el inventario",
  },
  location: {
    eyebrow: "Ubicación",
    title: "Entre el mar y la ruta del vino.",
    body: "En El Sauzal, sobre la carretera Tecate–Ensenada, a la entrada de la Ruta del Vino. Lo cotidiano está a unos minutos y el Valle de Guadalupe, a diez.",
    times: [
      { value: "10", unit: "min", place: "Valle de Guadalupe" },
      { value: "15", unit: "min", place: "El mar y la costa de El Sauzal" },
      { value: "18", unit: "min", place: "Centro de Ensenada" },
      { value: "1:30", unit: "h", place: "Tijuana y la frontera con San Diego, aprox." },
    ],
    nearbyTitle: "A unos minutos",
    nearby: ["Plaza Sauzal", "Hospital", "Escuelas y colegios", "Supermercados", "Gimnasios", "Playa Tres Emes"],
    address: "Carretera Tecate–Ensenada km 103.5, El Sauzal, Ensenada, B.C.",
    mapCta: "Abrir en Google Maps",
    videoAlt: "Viñedos en el Valle de Guadalupe",
    caption: "El Valle de Guadalupe, a 10 minutos de casa.",
  },
  crossSell: {
    eyebrow: "¿Puedes esperar un poco?",
    title: "Preventa con vista al mar, a minutos de aquí.",
    body: "Casas de un nivel con roof garden frente al Pacífico en El Sauzal, desde $3.9 MDP y con tu enganche en 19 meses.",
  },
  advisor: {
    ...es.advisor,
    why: [
      { title: "Mismo precio de lista", text: "Nuestra asesoría no tiene costo adicional para ti." },
      { title: "Inventario real", text: "Te mostramos solo lo disponible hoy, con precio y planos de cada unidad." },
      { title: "Tu crédito, bien llevado", text: "Te acompañamos con tu banco, Infonavit y notario hasta la firma." },
      { title: "Preventa o entrega inmediata", text: "Si te conviene más la preventa con vista al mar, también te la mostramos." },
    ],
  },
  trust: {
    title: "Compras algo que ya existe.",
    items: [
      { icon: "building", title: "Comunidad terminada y habitada", text: "450 familias ya viven en Viñedos del Mar." },
      { icon: "shield", title: "Desarrollador con trayectoria", text: "Más de 36 años construyendo comunidades residenciales en el noroeste de México." },
      { icon: "contract", title: "Escritura ante notario", text: "Compras con escritura pública: a tu nombre o, si eres extranjero, mediante fideicomiso." },
      { icon: "bank", title: "Crédito bancario e Infonavit", text: "Puedes comprar con crédito hipotecario, Infonavit o de contado." },
    ],
    stepsTitle: "Cómo comprar en Viñedos del Mar",
    steps: [
      { title: "Elige", text: "Te enviamos el inventario disponible y agendamos tu recorrido, en persona o por videollamada." },
      { title: "Aparta", text: "Reservas la unidad que elegiste." },
      { title: "Crédito o contado", text: "Te acompañamos con tu banco o con Infonavit, o con tu pago de contado." },
      { title: "Escritura y llaves", text: "Firmas ante notario y recibes tus llaves." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Las casas y departamentos ya están terminados?",
        a: "Sí. Viñedos del Mar es producto terminado: recorres la unidad que vas a comprar y, una vez cubierto el pago o aprobado tu crédito, firmas la escritura y recibes tus llaves. Te compartimos el inventario disponible al día.",
      },
      {
        q: "¿Puedo comprar con Infonavit o con crédito bancario?",
        a: "Sí. Puedes comprar con crédito bancario, Infonavit o de contado. Te ayudamos a revisar tu precalificación y a comparar opciones antes de apartar.",
      },
      {
        q: "¿En cuánto tiempo me entregan?",
        a: "Depende de tu forma de pago: de contado, en cuanto se firma la escritura; con crédito, al concluir la aprobación y la firma con tu banco o con Infonavit. Desde el primer día te damos un calendario estimado.",
      },
      {
        q: "¿Qué diferencia hay entre los modelos?",
        a: "Palomino es un departamento de 2 recámaras y 73.68 m²; el Palomino Penthouse suma 100.34 m² y terraza privada. Azur es una casa de dos plantas con 3 recámaras, y Teide, una casa de tres plantas con roof top, terraza y barra para asador.",
      },
      {
        q: "¿Qué amenidades tiene?",
        a: "Casa club con alberca, fogatero, áreas verdes, área infantil, pet park y acceso controlado. Los edificios de departamentos tienen roof top común.",
      },
      {
        q: "¿Puedo rentarla en plataformas como Airbnb?",
        a: "Muchos compradores la ven como inversión por su cercanía al Valle de Guadalupe. Antes de comprar te compartimos el reglamento de la comunidad para que confirmes qué usos están permitidos.",
      },
      {
        q: "¿Cuánto es la cuota de mantenimiento?",
        a: "Depende de la privada y del tipo de unidad. Te compartimos el monto vigente junto con el inventario disponible.",
      },
      {
        q: "¿Pueden comprar extranjeros o mexicanos que viven en Estados Unidos?",
        a: "Sí. Con nacionalidad mexicana escrituras a tu nombre. Si eres extranjero, en Ensenada se adquiere mediante un fideicomiso bancario. Te acompañamos en todo el proceso, en español o en inglés.",
      },
      {
        q: "¿Por qué comprar a través de Legacy Capital?",
        a: "Pagas el mismo precio de lista y ganas un asesor que trabaja para ti: te mostramos el inventario real, comparamos con la preventa con vista al mar si te conviene más y te acompañamos con crédito, notario y entrega.",
      },
      {
        q: "¿Puedo visitarla?",
        a: "Sí. Agenda un recorrido en Ensenada o una videollamada y te mostramos las unidades disponibles, la casa club y la vista.",
      },
    ],
  },
  finalCta: {
    title: "Visita la casa que vas a estrenar.",
    body: "Agenda un recorrido por Viñedos del Mar con Fran: ves la unidad terminada, la casa club y la vista. Si quieres, ese mismo día conoces también la preventa con vista al mar, a unos minutos.",
    formTitle: "Agenda tu recorrido",
    imageAlt: "Alberca y casa club de Viñedos del Mar al atardecer",
  },
  mobileBar: { whatsapp: "WhatsApp", prices: "Inventario", visit: "Recorrido" },
  exit: {
    title: "¿Te enviamos el inventario disponible?",
    body: "Departamentos y casas terminados desde $3.64 MDP, con precio y planos de cada unidad. Te lo enviamos por WhatsApp.",
    dismiss: es.exit.dismiss,
  },
  dialog: {
    pricesTitle: "Recibe el inventario disponible",
    visitTitle: "Agenda tu recorrido",
    planTitle: "Recibe tu corrida financiera",
    studyTitle: es.dialog.studyTitle,
    floorplanTitle: "Recibe los planos con medidas",
  },
  footer: es.footer,
  a11y: { ...es.a11y, facts: "Viñedos del Mar en cifras" },
};

// ---------------------------------------------------------------- English

const vdmEn: VdmCopy = {
  meta: {
    title: "Viñedos del Mar: move-in ready condos and homes in Ensenada | Legacy Capital",
    description:
      "Finished condos, penthouses and homes at Viñedos del Mar, El Sauzal, 10 minutes from Valle de Guadalupe. From MXN $3.64M with a mortgage, Infonavit or cash. Book your tour with Legacy Capital.",
    ogAlt: "Viñedos del Mar: pool and clubhouse, move-in ready in Ensenada",
  },
  nav: {
    links: [
      { href: "#modelos", label: "Models" },
      { href: "#entrega", label: "Move-in" },
      { href: "#amenidades", label: "Amenities" },
      { href: "#ubicacion", label: "Location" },
      { href: "#asesor", label: "Advisor" },
    ],
    cta: "See inventory",
    switchLang: { label: "Español", href: "/vinedos-del-mar", short: "ES" },
    advisors: en.nav.advisors,
  },
  hero: {
    status: "Move-in ready",
    place: "El Sauzal, Ensenada",
    title: "Move in now, at the gateway to Valle de Guadalupe.",
    subtitle:
      "Finished condos, penthouses and homes at Viñedos del Mar, a community with a clubhouse and pool between the ocean and the wine route. From MXN $3.64M.",
    ctaPrimary: "See available inventory",
    ctaSecondary: "Message on WhatsApp",
    imageAlt: "Pool with pergola and clubhouse at Viñedos del Mar",
    tagline: "Building wealth for generations",
  },
  quickForm: {
    title: "Get the available inventory",
    subtitle: "We'll send to your WhatsApp the units available today, with price, floor plans and a payment estimate with a mortgage or cash.",
    priceLine: [
      { label: "Condos", value: "from MXN $3.64M" },
      { label: "Homes", value: "from MXN $4.91M" },
    ],
    advisor: en.quickForm.advisor,
  },
  form: {
    ...en.form,
    interest: "What are you interested in?",
    interests: [
      { value: "depa", label: "Condo" },
      { value: "ph", label: "Penthouse" },
      { value: "casa", label: "House" },
      { value: "explorando", label: "Not sure yet" },
    ],
    messagePh: "Tell us what you're looking for or when you'd like to tour",
    visitMode: "How would you like to see it?",
    visitModes: [
      { value: "presencial", label: "Tour in Ensenada" },
      { value: "videollamada", label: "Video call" },
    ],
    submit: "Get inventory and prices",
    submitVisit: "Book a tour",
    submitFloorplan: "Get floor plans",
    success: {
      ...en.form.success,
      body: "Fran Morishita will message you on WhatsApp today with the available inventory and prices.",
      whatsapp: "Get it now on WhatsApp",
    },
    waMessage:
      "Hi Fran, I'm {name}. I'm interested in Viñedos del Mar in Ensenada{interest}. Could you share the available inventory and prices?",
    waGeneric: "Hi Fran, I'm interested in Viñedos del Mar in Ensenada. Could you share the available inventory and prices?",
  },
  facts: [
    { value: "4", label: "models, from a condo to a home with a rooftop" },
    { value: "450", label: "families already live in the community" },
    { value: "10 min", label: "from Valle de Guadalupe" },
    { value: "18 min", label: "from downtown Ensenada" },
    { value: "3", label: "ways to pay: mortgage, Infonavit or cash" },
  ],
  models: {
    eyebrow: "From condo to house",
    title: "Four finished models. Choose yours.",
    body: "From a 2-bedroom condo to a three-story home with a rooftop. We'll show you the units available today for each model.",
    tabsLabel: "Viñedos del Mar models",
    from: "From",
    monthly: "Reference monthly payment from",
    viewPhotos: "Photos",
    viewPlan: "Floor plan",
    planLock: "Floor plans with measurements, via WhatsApp.",
    planCta: "Get floor plans",
    cta: "See available units",
    ctaTitle: "Available units: {model}",
    prev: "Previous photo",
    next: "Next photo",
    photo: "Photo {n} of {total}",
    note: "Developer list prices (October 2026) in Mexican pesos, subject to change and availability. *Reference monthly payment with a mortgage; it depends on your down payment, term, rate and approval.",
    items: [
      {
        id: "palomino",
        interest: "palomino",
        type: "Condo",
        name: "Palomino",
        tagline: "2 bedrooms, three balconies and a building rooftop.",
        price: "MXN $3.64M",
        monthly: "MXN $37,434",
        specs: [
          { label: "Bedrooms", value: "2" },
          { label: "Baths", value: "2" },
          { label: "Interior", value: "73.68 m²" },
          { label: "Balconies", value: "6.28 m²" },
        ],
        features: [
          "Open living, dining and kitchen",
          "Three balconies",
          "Laundry area next to the kitchen",
          "Rectified tile floors",
          "Shared rooftop with pergola",
          "Parking",
        ],
        images: [
          { src: img("palomino-1"), alt: "Living and dining area of the Palomino condo" },
          { src: img("palomino-2"), alt: "Kitchen with breakfast bar in the Palomino condo" },
          { src: img("palomino-3"), alt: "Dining area by the window in the Palomino condo" },
          { src: img("palomino-4"), alt: "Primary bedroom of the Palomino condo" },
          { src: img("palomino-5"), alt: "Staged dining room in a Palomino condo" },
          { src: img("palomino-6"), alt: "Staged bedroom in a Palomino condo" },
        ],
        plan: img("plan-palomino"),
      },
      {
        id: "palomino-ph",
        interest: "palomino_ph",
        type: "Penthouse",
        name: "Palomino Penthouse",
        tagline: "More space, three balconies and a private terrace.",
        price: "MXN $4.20M",
        monthly: "MXN $41,178",
        specs: [
          { label: "Bedrooms", value: "2" },
          { label: "Baths", value: "2" },
          { label: "Interior", value: "100.34 m²" },
          { label: "Balconies and terrace", value: "24.08 m²" },
        ],
        features: [
          "Private terrace",
          "Three balconies",
          "Kitchen with breakfast bar",
          "Laundry room",
          "Rectified tile floors",
          "Shared rooftop with pergola",
        ],
        images: [
          { src: img("ph-1"), alt: "Furnished dining room in a Palomino Penthouse" },
          { src: img("ph-2"), alt: "Kitchen with granite breakfast bar" },
          { src: img("ph-3"), alt: "Furnished living room with natural light" },
          { src: img("ph-4"), alt: "Furnished primary bedroom" },
          { src: img("ph-5"), alt: "Round dining table next to the living room" },
          { src: img("ph-6"), alt: "Kitchen with wood finishes" },
        ],
        plan: img("plan-ph"),
      },
      {
        id: "azur",
        interest: "azur",
        type: "House",
        name: "Azur",
        tagline: "Two stories, a patio and a primary bedroom with balcony.",
        price: "MXN $4.91M",
        monthly: "MXN $51,412",
        specs: [
          { label: "Bedrooms", value: "3" },
          { label: "Baths", value: "2.5" },
          { label: "Interior", value: "133.78 m²" },
          { label: "Lot", value: "125.80 m²" },
        ],
        features: [
          "2-car garage",
          "Glass wall to the backyard",
          "TV room",
          "Primary bedroom with walk-in closet, bath and balcony",
          "Natural stone facade",
          "Marble bathroom vanities",
          "Double-height staircase",
          "Security front door",
        ],
        images: [
          { src: img("azur-1"), alt: "Kitchen with island and dining area in the Azur home" },
          { src: img("azur-2"), alt: "Living room with glass wall to the patio in the Azur home" },
          { src: img("azur-3"), alt: "Furnished living room in the Azur home" },
          { src: img("azur-4"), alt: "Bedroom with balcony and view in the Azur home" },
          { src: img("azur-5"), alt: "Staged dining room in an Azur home" },
          { src: img("azur-6"), alt: "Bathroom with glass shower in the Azur home" },
        ],
        plan: img("plan-azur"),
      },
      {
        id: "teide",
        interest: "teide",
        type: "House with rooftop",
        name: "Teide",
        tagline: "Three stories and a rooftop terrace for every sunset.",
        price: "MXN $5.30M",
        monthly: "MXN $54,122",
        specs: [
          { label: "Bedrooms", value: "3" },
          { label: "Baths", value: "2 full + 2 half" },
          { label: "Interior", value: "137.72 m²" },
          { label: "Lot", value: "125.80 m²" },
        ],
        features: [
          "Rooftop with covered terrace and grill counter",
          "Half bath and utility room on the rooftop",
          "2-car garage",
          "Primary bedroom with walk-in closet and bath",
          "Two balconies",
          "Large-format floor tiles",
          "Natural stone facade",
          "Security front door",
        ],
        images: [
          { src: img("teide-1"), alt: "Teide rooftop with terrace, sink and hillside views" },
          { src: img("teide-2"), alt: "Dining and living room of the Teide home" },
          { src: img("teide-3"), alt: "Kitchen with island and staircase in the Teide home" },
          { src: img("teide-4"), alt: "Bedroom with large window and view in the Teide home" },
          { src: img("teide-5"), alt: "Kitchen bar and dining area in a Teide home" },
          { src: img("teide-6"), alt: "Secondary bedroom of the Teide home" },
        ],
        plan: img("plan-teide"),
      },
    ],
  },
  immediate: {
    eyebrow: "Move-in ready",
    title: "No waiting on construction: tour it, reserve it, move in.",
    body: "Viñedos del Mar is already built and lived in. What you see on your tour is what you buy.",
    pillars: [
      {
        icon: "eye",
        title: "What you see is what you buy",
        text: "Tour the finished unit before you decide: real finishes, views, neighbors and amenities.",
      },
      {
        icon: "bank",
        title: "Use your mortgage today",
        text: "Bank mortgage, Infonavit or cash, closing before a notary.",
      },
      {
        icon: "key",
        title: "Move in or rent it right away",
        text: "No paying rent while you wait for construction. As an investment, it starts working from the day you receive it.",
      },
    ],
    timing:
      "Paying cash, closing can be signed in a few weeks. With a mortgage, timing depends on approval from your bank or Infonavit; we give you an estimated calendar from day one.",
  },
  tour: {
    title: "How it looks today.",
    body: "The community, the amenities and furnished model homes, just as you'll tour them.",
    play: "Play video tour",
    pause: "Pause video",
    tiles: [
      { image: img("pool-drone"), alt: "Clubhouse pool seen from above", caption: "The clubhouse pool" },
      { image: img("firepit"), alt: "Fire pit between stone walls by the clubhouse", caption: "Fire pit by the clubhouse" },
      { image: img("rooftop-terrace"), alt: "Furnished rooftop of a Teide home", caption: "The Teide rooftop" },
      { image: img("towers-pool"), alt: "Condo buildings with pool", caption: "Condo buildings" },
    ],
  },
  amenities: {
    eyebrow: "Amenities",
    title: "The clubhouse is ready for you.",
    body: "Finished amenities already in use, inside a private community with controlled access.",
    items: [
      { icon: "pool", label: "Pool" },
      { icon: "club", label: "Clubhouse" },
      { icon: "fire", label: "Fire pit" },
      { icon: "park", label: "Green areas" },
      { icon: "kids", label: "Kids' area" },
      { icon: "pet", label: "Pet park" },
      { icon: "rooftop", label: "Building rooftops" },
      { icon: "gate", label: "Controlled access" },
    ],
    imageAlt: "Pool and clubhouse at Viñedos del Mar at dusk",
    note: "Private community with controlled access.",
  },
  audience: {
    eyebrow: "Who it's for",
    title: "Ideal if you'd rather not wait.",
    items: [
      {
        icon: "family",
        title: "Ensenada families",
        text: "Stop renting: use your mortgage and move into a community with a clubhouse, green areas and controlled access.",
      },
      {
        icon: "wine",
        title: "A second home near the Valle",
        text: "10 minutes from Valle de Guadalupe and 15 from the ocean, ready to enjoy from the first weekend.",
      },
      {
        icon: "chart",
        title: "Investors",
        text: "A finished product that can generate income from the day you receive it. Before you buy, we share the community rules.",
      },
      {
        icon: "globe",
        title: "Mexicans living in the U.S.",
        text: "Buy remotely with a video tour. With Mexican nationality, the deed goes in your name.",
      },
    ],
    cta: "I want to see the inventory",
  },
  location: {
    eyebrow: "Location",
    title: "Between the ocean and the wine route.",
    body: "In El Sauzal, on the Tecate–Ensenada highway, at the entrance to the Wine Route. Daily needs are minutes away, and Valle de Guadalupe is ten.",
    times: [
      { value: "10", unit: "min", place: "Valle de Guadalupe" },
      { value: "15", unit: "min", place: "The ocean and El Sauzal coast" },
      { value: "18", unit: "min", place: "Downtown Ensenada" },
      { value: "1:30", unit: "h", place: "Tijuana and the San Diego border, approx." },
    ],
    nearbyTitle: "Minutes away",
    nearby: ["Plaza Sauzal", "Hospital", "Schools", "Supermarkets", "Gyms", "Tres Emes beach"],
    address: "Tecate–Ensenada Highway km 103.5, El Sauzal, Ensenada, B.C.",
    mapCta: "Open in Google Maps",
    videoAlt: "Vineyards in Valle de Guadalupe",
    caption: "Valle de Guadalupe, 10 minutes from home.",
  },
  crossSell: {
    eyebrow: "Can you wait a little?",
    title: "An ocean-view pre-sale, minutes away.",
    body: "Single-level homes with a roof garden facing the Pacific in El Sauzal, from MXN $3.9M with your down payment over 19 months.",
  },
  advisor: {
    ...en.advisor,
    why: [
      { title: "Same list price", text: "Our advisory comes at no extra cost to you." },
      { title: "Real inventory", text: "We only show what's available today, with price and floor plans for each unit." },
      { title: "Your mortgage, well managed", text: "We guide you with your bank, Infonavit and the notary through closing." },
      { title: "Pre-sale or move-in ready", text: "If the ocean-view pre-sale suits you better, we'll show you that too." },
    ],
  },
  trust: {
    title: "You're buying something that already exists.",
    items: [
      { icon: "building", title: "Finished, lived-in community", text: "450 families already live at Viñedos del Mar." },
      { icon: "shield", title: "Experienced developer", text: "Over 36 years building residential communities in northwest Mexico." },
      { icon: "contract", title: "Closing before a notary", text: "A public deed in your name or, if you're a foreigner, through a bank trust." },
      { icon: "bank", title: "Mortgage and Infonavit", text: "Buy with a bank mortgage, Infonavit or cash." },
    ],
    stepsTitle: "How to buy at Viñedos del Mar",
    steps: [
      { title: "Choose", text: "We send the available inventory and schedule your tour, in person or by video call." },
      { title: "Reserve", text: "You reserve the unit you chose." },
      { title: "Mortgage or cash", text: "We guide you with your bank or Infonavit, or with your cash payment." },
      { title: "Closing and keys", text: "You sign before a notary and receive your keys." },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Are the homes and condos already finished?",
        a: "Yes. Viñedos del Mar is a finished product: you tour the unit you'll buy and, once the payment is covered or your mortgage is approved, you sign the deed and get your keys. We share the up-to-date available inventory.",
      },
      {
        q: "Can I buy with Infonavit or a bank mortgage?",
        a: "Yes. You can buy with a bank mortgage, Infonavit or cash. We help you review your pre-qualification and compare options before reserving.",
      },
      {
        q: "How soon do I get the keys?",
        a: "It depends on how you pay: with cash, as soon as the deed is signed; with a mortgage, once approval and closing with your bank or Infonavit are complete. We give you an estimated calendar from day one.",
      },
      {
        q: "What's the difference between the models?",
        a: "Palomino is a 2-bedroom, 73.68 m² condo; the Palomino Penthouse offers 100.34 m² and a private terrace. Azur is a two-story, 3-bedroom home, and Teide a three-story home with a rooftop terrace and grill counter.",
      },
      {
        q: "What amenities are there?",
        a: "A clubhouse with pool, fire pit, green areas, kids' area, pet park and controlled access. The condo buildings have a shared rooftop.",
      },
      {
        q: "Can I rent it on platforms like Airbnb?",
        a: "Many buyers see it as an investment because it's close to Valle de Guadalupe. Before you buy, we share the community rules so you can confirm which uses are allowed.",
      },
      {
        q: "How much are the HOA fees?",
        a: "They depend on the private section and the type of unit. We share the current amount along with the available inventory.",
      },
      {
        q: "Can foreigners or Mexicans living in the U.S. buy?",
        a: "Yes. With Mexican nationality, you can hold the deed in your name. Foreigners buy in Ensenada through a bank trust (fideicomiso). We guide you through the whole process, in English or Spanish.",
      },
      {
        q: "Why buy through Legacy Capital?",
        a: "You pay the same list price and gain an advisor who works for you: we show you the real inventory, compare it with the ocean-view pre-sale if that suits you better, and guide you through the mortgage, notary and delivery.",
      },
      {
        q: "Can I visit?",
        a: "Yes. Book a tour in Ensenada or a video call and we'll show you the available units, the clubhouse and the views.",
      },
    ],
  },
  finalCta: {
    title: "Tour the home you're about to move into.",
    body: "Book a tour of Viñedos del Mar with Fran: see the finished unit, the clubhouse and the views. If you'd like, see the ocean-view pre-sale the same day, just minutes away.",
    formTitle: "Book your tour",
    imageAlt: "Pool and clubhouse at Viñedos del Mar at dusk",
  },
  mobileBar: { whatsapp: "WhatsApp", prices: "Inventory", visit: "Tour" },
  exit: {
    title: "Want the available inventory?",
    body: "Finished condos and homes from MXN $3.64M, with price and floor plans for each unit. We'll send it to your WhatsApp.",
    dismiss: en.exit.dismiss,
  },
  dialog: {
    pricesTitle: "Get the available inventory",
    visitTitle: "Book your tour",
    planTitle: "Get your payment estimate",
    studyTitle: en.dialog.studyTitle,
    floorplanTitle: "Get floor plans with measurements",
  },
  footer: en.footer,
  a11y: { ...en.a11y, facts: "Viñedos del Mar in numbers" },
};

export const vinedos: Record<Lang, VdmCopy> = { es: vdmEs, en: vdmEn };
