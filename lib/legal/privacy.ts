// Aviso de Privacidad Integral del sitio de Legacy Capital Real Estate.
// Base legal: Ley Federal de Protección de Datos Personales en Posesión de los Particulares
// (DOF 20-03-2025, última reforma DOF 14-11-2025). Autoridad: Secretaría Anticorrupción y Buen Gobierno.
// La versión en español es la jurídicamente vinculante; la versión en inglés es una traducción de cortesía.

export type PrivacyDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const privacy: { es: PrivacyDoc; en: PrivacyDoc } = {
  es: {
    title: "Aviso de Privacidad Integral",
    updated: "Última actualización: 25 de septiembre de 2026",
    intro:
      "Este aviso explica qué datos personales recabamos en este sitio web, para qué los usamos, con quién los compartimos y cómo puede ejercer sus derechos, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el Diario Oficial de la Federación el 20 de marzo de 2025 (la “Ley”).",
    sections: [
      {
        heading: "Responsable",
        paragraphs: [
          "Legacy Capital Real Estate (“Legacy Capital” o el “Responsable”) es una firma de asesoría y comercialización inmobiliaria con domicilio en Ensenada, Baja California, México, dirigida por Fran Morishita, director general y asesor comercial, quien es también la persona designada para atender los asuntos relacionados con sus datos personales. Legacy Capital participa como comercializador de los desarrollos que presenta y es responsable de los datos que usted proporciona en este sitio.",
          "Puede contactarnos por WhatsApp al +52 646 256 3006 o por escrito dirigido al Responsable; le responderemos por el mismo medio.",
        ],
      },
      {
        heading: "Datos que recabamos",
        paragraphs: ["Solo tratamos los datos que usted escribe o selecciona en nuestros formularios y cierta información técnica de su visita:"],
        bullets: [
          "Contacto: nombre, número de WhatsApp o teléfono y, si lo desea, correo electrónico.",
          "Su solicitud (opcional): interés (segunda casa, inversión, vivienda o modelo de 2 o 3 recámaras), perfil de comprador que elija en el sitio (ciudad u origen), modalidad y fecha preferida de visita, y su mensaje.",
          "Preguntas de perfil (opcionales): plazo de compra, forma de pago prevista, uso previsto del inmueble y si usted es asesor inmobiliario.",
          "Información técnica: idioma, parámetros de campaña (UTM), identificadores de clic de anuncios (gclid, fbclid), página de entrada, sitio de procedencia y navegador (user-agent). Su dirección IP se usa de forma transitoria para prevenir abusos y no se guarda en nuestra base de contactos.",
        ],
      },
      {
        heading: "Datos sensibles y consentimiento",
        paragraphs: [
          "No recabamos datos personales sensibles. La forma de pago prevista podría considerarse un dato patrimonial: es opcional y, al seleccionarla, usted consiente expresamente su tratamiento. No le pedimos números de cuenta, ingresos ni documentos a través del sitio.",
          "Al enviar un formulario, después de haber tenido a su disposición este aviso, usted otorga su consentimiento expreso, por medios electrónicos, para el tratamiento de sus datos conforme a este aviso.",
        ],
      },
      {
        heading: "Finalidades primarias",
        paragraphs: ["Usamos sus datos para las siguientes finalidades, necesarias para atender su solicitud:"],
        bullets: [
          "Responder su solicitud y comunicarnos con usted por WhatsApp, teléfono o correo electrónico.",
          "Enviarle listas de precios, planos, esquemas de pago y estudios de rentabilidad de los desarrollos que comercializamos.",
          "Agendar y confirmar visitas al desarrollo o videollamadas.",
          "Dar seguimiento a su proceso de compra, hasta el apartado y la formalización de la operación.",
          "Mantener la seguridad del sitio y prevenir envíos abusivos.",
        ],
      },
      {
        heading: "Finalidades secundarias y cómo negarse",
        paragraphs: [
          "Además, y salvo que usted se oponga, usaremos sus datos para: (a) enviarle noticias sobre otros desarrollos y promociones que comercialicemos; (b) invitarle a encuestas de satisfacción; y (c) medir nuestros anuncios y crear audiencias publicitarias en Meta y Google. Estas finalidades no son necesarias para atender su solicitud.",
          "Puede negarse a alguna o a todas en cualquier momento, incluso antes de enviar sus datos, escribiendo “NO PUBLICIDAD” por WhatsApp al +52 646 256 3006. Para la medición publicitaria también puede usar las opciones de la sección de cookies. Su negativa no afectará la atención de su solicitud.",
        ],
      },
      {
        heading: "Proveedores (personas encargadas)",
        paragraphs: [
          "Nos apoyamos en proveedores que tratan datos por nuestra cuenta, siguiendo nuestras instrucciones y solo para prestarnos su servicio; conforme a la Ley, esto no constituye una transferencia. Algunos almacenan información en servidores fuera de México. Actualmente son:",
        ],
        bullets: [
          "Supabase: base de datos donde guardamos las solicitudes.",
          "Vercel: alojamiento del sitio y medición de visitas sin cookies.",
          "Meta (WhatsApp): mensajería con usted.",
          "Meta y Google: medición de campañas con Meta Pixel y Google Analytics 4, solo si están activos en el sitio.",
        ],
      },
      {
        heading: "Transferencias",
        paragraphs: [
          "No vendemos sus datos ni realizamos transferencias que requieran su consentimiento. Solo los compartiremos en los siguientes casos, que el artículo 36 de la Ley permite sin su consentimiento, y los receptores asumirán las mismas obligaciones que el Responsable:",
        ],
        bullets: [
          "Con el desarrollador y con la sociedad promitente vendedora del desarrollo que usted elija, únicamente si decide apartar o comprar una vivienda, para formalizar la operación. Le informaremos su denominación antes de realizar la transferencia.",
          "Con la notaría pública que intervenga en la escrituración.",
          "Con autoridades competentes, cuando la ley o un mandato fundado y motivado lo exija.",
        ],
      },
      {
        heading: "Derechos ARCO",
        paragraphs: [
          "Usted o su representante legal pueden solicitar en cualquier momento el acceso, rectificación o cancelación de sus datos, u oponerse a su tratamiento (derechos ARCO), por WhatsApp al +52 646 256 3006 o por escrito dirigido al Responsable. La solicitud debe incluir:",
        ],
        bullets: [
          "Su nombre y un medio para recibir la respuesta.",
          "Copia de identificación oficial vigente y, si actúa un representante, el documento que acredite su representación.",
          "El derecho que desea ejercer y la descripción clara de los datos (no necesaria para el acceso).",
          "Para rectificación, la corrección solicitada y, en su caso, el documento que la respalde.",
        ],
      },
      {
        heading: "Plazos y respuesta",
        paragraphs: [
          "Le responderemos en un máximo de 20 días hábiles desde que recibamos su solicitud y, si procede, la haremos efectiva dentro de los 15 días hábiles siguientes; ambos plazos pueden ampliarse una vez por un periodo igual si el caso lo justifica. Responderemos por el mismo medio y, en caso de acceso, le entregaremos sus datos en archivo electrónico. El trámite es gratuito, salvo costos de reproducción o envío.",
          "La cancelación implica un periodo de bloqueo previo a la eliminación y no procede cuando debamos conservar los datos por obligación legal o contractual. Si no está conforme con la respuesta, o no la recibe, puede acudir ante la Secretaría Anticorrupción y Buen Gobierno, autoridad competente, dentro de los 15 días hábiles siguientes a nuestra respuesta o al vencimiento del plazo para darla.",
        ],
      },
      {
        heading: "Revocación del consentimiento",
        paragraphs: [
          "Puede revocar su consentimiento en cualquier momento, por los mismos medios y con los mismos requisitos que una solicitud ARCO. La revocación no tiene efectos retroactivos y, si abarca las finalidades primarias, ya no podremos atender su solicitud. No podrá aplicarse de inmediato cuando debamos conservar datos por una obligación legal o por una compra en curso.",
        ],
      },
      {
        heading: "Cómo limitar el uso de sus datos",
        paragraphs: ["Además de sus derechos ARCO, usted puede:"],
        bullets: [
          "Pedirnos por WhatsApp que no le enviemos promociones; lo incluiremos en nuestro listado interno de exclusión.",
          "Inscribir su teléfono en el Registro Público para Evitar Publicidad (REPEP) de Profeco, en repep.profeco.gob.mx.",
          "Bloquear nuestro número en WhatsApp o rechazar cookies en su navegador.",
        ],
      },
      {
        heading: "Cookies y tecnologías de rastreo",
        paragraphs: [
          "Usamos Vercel Web Analytics, que cuenta visitas de forma agregada y sin cookies. Cuando están activos, Meta Pixel y Google Analytics 4 usan cookies y píxeles (web beacons) para medir nuestros anuncios; pueden obtener páginas visitadas, eventos como el envío de un formulario o un clic a WhatsApp, identificadores de cookie y de clic, dirección IP y tipo de navegador y dispositivo. No les enviamos su nombre, teléfono ni correo. Además, el sitio guarda en su navegador (sessionStorage) los parámetros de campaña de su visita, que se borran al cerrar la pestaña.",
          "Puede bloquear o eliminar cookies en su navegador, usar el complemento de inhabilitación de Google Analytics (tools.google.com/dlpage/gaoptout) y ajustar sus preferencias de anuncios en Meta y Google. El sitio seguirá funcionando.",
        ],
      },
      {
        heading: "Conservación y seguridad",
        paragraphs: [
          "Conservamos sus datos mientras sean necesarios para estas finalidades. Si no se concreta una operación, los eliminaremos a más tardar 24 meses después del último contacto; si usted compra, los conservaremos por los plazos que exija la ley. Aplicamos medidas de seguridad administrativas, técnicas y físicas, como acceso restringido y conexiones cifradas. El sitio está dirigido a mayores de edad.",
        ],
      },
      {
        heading: "Cambios a este aviso",
        paragraphs: [
          "Publicaremos cualquier cambio en esta página, con su fecha de actualización. Si un cambio implica nuevas finalidades que requieran su consentimiento, se lo pediremos antes de aplicarlo y, si mantenemos contacto con usted, también podremos avisarle por WhatsApp.",
        ],
      },
    ],
  },
  en: {
    title: "Comprehensive Privacy Notice",
    updated: "Last updated: September 25, 2026",
    intro:
      "This English text is a courtesy translation; the Spanish version (Aviso de Privacidad Integral) is legally binding and prevails in case of discrepancy. This notice explains what personal data we collect on this website, why we use it, who we share it with and how you can exercise your rights, under Mexico's Federal Law on the Protection of Personal Data Held by Private Parties, published in the Official Gazette on March 20, 2025 (the “Law”).",
    sections: [
      {
        heading: "Data controller",
        paragraphs: [
          "Legacy Capital Real Estate (“Legacy Capital” or the “Controller”) is a real estate advisory and brokerage firm located in Ensenada, Baja California, Mexico, led by Fran Morishita, CEO and sales advisor, who is also the person designated to handle matters related to your personal data. Legacy Capital acts as sales agent for the developments it presents and is the controller of the data you provide on this website.",
          "You can contact us via WhatsApp at +52 646 256 3006 or in writing addressed to the Controller; we will reply through the same channel.",
        ],
      },
      {
        heading: "Data we collect",
        paragraphs: ["We only process the data you type or select in our forms and some technical information about your visit:"],
        bullets: [
          "Contact: name, WhatsApp or phone number and, if you wish, email address.",
          "Your request (optional): interest (second home, investment, primary residence or a 2- or 3-bedroom model), the buyer profile you choose on the site (city or origin), preferred visit mode and date, and your message.",
          "Profile questions (optional): purchase timeline, intended payment method, intended use of the home and whether you are a real estate agent.",
          "Technical information: language, campaign parameters (UTM), ad click identifiers (gclid, fbclid), landing page, referring site and browser (user-agent). Your IP address is used transiently to prevent abuse and is not stored in our contact database.",
        ],
      },
      {
        heading: "Sensitive data and consent",
        paragraphs: [
          "We do not collect sensitive personal data. Your intended payment method could be considered financial data: it is optional and, by selecting it, you expressly consent to its processing. We do not ask for account numbers, income or documents through the website.",
          "By submitting a form after this notice has been made available to you, you give your express consent, by electronic means, to the processing of your data as described here.",
        ],
      },
      {
        heading: "Primary purposes",
        paragraphs: ["We use your data for the following purposes, which are necessary to handle your request:"],
        bullets: [
          "Responding to your request and contacting you via WhatsApp, phone or email.",
          "Sending you price lists, floor plans, payment schemes and rental return studies for the developments we market.",
          "Scheduling and confirming site visits or video calls.",
          "Following up on your purchase process, through reservation and closing.",
          "Keeping the website secure and preventing abusive submissions.",
        ],
      },
      {
        heading: "Secondary purposes and how to refuse them",
        paragraphs: [
          "Unless you object, we will also use your data to: (a) send you news about other developments and promotions we market; (b) invite you to satisfaction surveys; and (c) measure our ads and build advertising audiences on Meta and Google. These purposes are not necessary to handle your request.",
          "You can refuse some or all of them at any time, even before submitting your data, by writing “NO ADVERTISING” (or “NO PUBLICIDAD”) via WhatsApp to +52 646 256 3006. For ad measurement you can also use the options in the cookies section. Your refusal will not affect how we handle your request.",
        ],
      },
      {
        heading: "Providers (processors)",
        paragraphs: [
          "We rely on providers that process data on our behalf, following our instructions and only to provide their service to us; under the Law, this is not a transfer. Some store information on servers outside Mexico. They currently are:",
        ],
        bullets: [
          "Supabase: database where we store requests.",
          "Vercel: website hosting and cookieless visit measurement.",
          "Meta (WhatsApp): messaging with you.",
          "Meta and Google: campaign measurement with Meta Pixel and Google Analytics 4, only if active on the website.",
        ],
      },
      {
        heading: "Transfers",
        paragraphs: [
          "We do not sell your data or make transfers that require your consent. We will only share it in the following cases, which Article 36 of the Law allows without your consent, and recipients will assume the same obligations as the Controller:",
        ],
        bullets: [
          "With the developer and the promising seller of the development you choose, only if you decide to reserve or buy a home, to formalize the transaction. We will tell you their legal names before making the transfer.",
          "With the notary public handling the deed.",
          "With competent authorities, when required by law or by a duly grounded order.",
        ],
      },
      {
        heading: "ARCO rights",
        paragraphs: [
          "You or your legal representative may at any time request access to, rectification or cancellation of your data, or object to its processing (ARCO rights), via WhatsApp at +52 646 256 3006 or in writing addressed to the Controller. Your request must include:",
        ],
        bullets: [
          "Your name and a means to receive the response.",
          "A copy of a valid official ID and, if a representative acts for you, proof of representation.",
          "The right you wish to exercise and a clear description of the data (not needed for access).",
          "For rectification, the requested correction and, where applicable, supporting documents.",
        ],
      },
      {
        heading: "Deadlines and response",
        paragraphs: [
          "We will respond within 20 business days of receiving your request and, if applicable, carry it out within the following 15 business days; both periods may be extended once for an equal period when justified. We will reply through the same channel and, for access, deliver your data as an electronic file. The process is free, except for reproduction or shipping costs.",
          "Cancellation involves a blocking period before deletion and does not apply when we must keep data due to a legal or contractual obligation. If you disagree with our response, or receive none, you may go to the Secretaría Anticorrupción y Buen Gobierno (Ministry of Anti-Corruption and Good Governance), the competent authority, within 15 business days after our response or after the response deadline expires.",
        ],
      },
      {
        heading: "Withdrawal of consent",
        paragraphs: [
          "You may withdraw your consent at any time, through the same channels and with the same requirements as an ARCO request. Withdrawal is not retroactive and, if it covers the primary purposes, we will no longer be able to handle your request. It cannot take effect immediately when we must keep data due to a legal obligation or an ongoing purchase.",
        ],
      },
      {
        heading: "How to limit the use of your data",
        paragraphs: ["In addition to your ARCO rights, you can:"],
        bullets: [
          "Ask us via WhatsApp not to send you promotions; we will add you to our internal exclusion list.",
          "Register your phone number in Profeco's Public Registry to Avoid Advertising (REPEP) at repep.profeco.gob.mx.",
          "Block our number on WhatsApp or reject cookies in your browser.",
        ],
      },
      {
        heading: "Cookies and tracking technologies",
        paragraphs: [
          "We use Vercel Web Analytics, which counts visits in aggregate and without cookies. When active, Meta Pixel and Google Analytics 4 use cookies and pixels (web beacons) to measure our ads; they may collect pages visited, events such as a form submission or a WhatsApp click, cookie and click identifiers, IP address and browser and device type. We do not send them your name, phone number or email. The website also stores your visit's campaign parameters in your browser (sessionStorage), which are deleted when you close the tab.",
          "You can block or delete cookies in your browser, use the Google Analytics opt-out add-on (tools.google.com/dlpage/gaoptout) and adjust your ad preferences on Meta and Google. The website will keep working.",
        ],
      },
      {
        heading: "Retention and security",
        paragraphs: [
          "We keep your data for as long as needed for these purposes. If no transaction takes place, we will delete it no later than 24 months after our last contact; if you buy, we will keep it for the periods required by law. We apply administrative, technical and physical security measures, such as restricted access and encrypted connections. This website is intended for adults.",
        ],
      },
      {
        heading: "Changes to this notice",
        paragraphs: [
          "We will publish any change on this page with its update date. If a change involves new purposes that require your consent, we will ask for it before applying the change and, if we are in contact with you, we may also let you know via WhatsApp.",
        ],
      },
    ],
  },
};
