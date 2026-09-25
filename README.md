# Legacy Capital Real Estate

Landing de captación de leads de Legacy Capital Real Estate (Ensenada, B.C.) para la preventa de casas con roof garden y vista al mar en El Sauzal. Español en `/`, inglés en `/en`.

**Estrategia:** el sitio no publica el nombre comercial del desarrollo ni del desarrollador, ni el inventario por lote. Legacy Capital y Fran Morishita son los protagonistas; esa información se comparte por WhatsApp con cada prospecto.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Phosphor Icons · Supabase (leads) · Vercel (hosting y analítica).

## Captación de leads

- Formularios: hero, modal global (precios, visita, corrida, modelo, planos, estudio), sección de estudio de rentabilidad, cierre y aviso de salida (solo escritorio).
- Lead magnet: el estudio de rentabilidad (PDF) **no está en el sitio**. Al dejar sus datos, el prospecto abre WhatsApp con un mensaje listo y Fran le envía el PDF (se recomienda una respuesta rápida con el PDF en WhatsApp Business, o automatizarlo con `LEAD_WEBHOOK_URL`).
- Perfiles de comprador (Ensenada, California, mexicoamericanos, Monterrey, CDMX, Guadalajara): el perfil elegido se guarda en la columna `perfil` y en `origen` (`perfil-monterrey`, etc.).
- `POST /api/leads` valida con Zod, filtra bots (campo trampa, tiempo mínimo, límite por IP) y guarda vía RPC `public.submit_lead`.
- `PATCH /api/leads` agrega la calificación opcional (plazo, forma de pago, uso) con el token del alta.
- La tabla `public.leads` tiene RLS sin políticas: la llave pública no puede leerla. Las funciones exigen `LEADS_RPC_SECRET`, que solo vive en el servidor.
- Los leads se consultan en Supabase → Table Editor → `leads` (columna `estatus` para el seguimiento).
- Opcional: `LEAD_WEBHOOK_URL` envía cada lead a Make, Zapier, n8n o Slack.
- Eventos de medición: `lead`, `whatsapp_click`, `lot_select`, etc. (Vercel Analytics, y Meta Pixel / GA4 si se configuran sus IDs). Nunca se envían nombre, teléfono ni correo a los píxeles.

## Variables de entorno

Ver `.env.example`. En Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `LEADS_RPC_SECRET`, y opcionales `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`, `PERMITIR_INDEXACION` (poner `1` al conectar el dominio definitivo).

## Contenido

- Textos: `lib/i18n/es.ts` y `lib/i18n/en.ts` (misma estructura).
- Perfiles de comprador y estudio de rentabilidad: `personas` y `study` en los diccionarios.
- Promoción de septiembre y datos de contacto: `lib/site.ts` (la barra promocional se oculta sola al vencer `promoEndsAt`).
- Aviso de privacidad: `lib/legal/privacy.ts` (revisar con un abogado: razón social y domicilio completos).
- Retrato del asesor: agregar `public/img/fran-morishita.jpg` y poner `hasPhoto: true` en `lib/site.ts`.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev
npm run build && npm start
```

Migraciones de base de datos: `supabase/migrations/` (tabla de leads y columna `perfil`).
