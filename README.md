# Legacy Capital Real Estate · Punta Pacífico

Landing de captación de leads para **Punta Pacífico** (Ensenada, B.C.), comercializado por Legacy Capital Real Estate. Español en `/`, inglés en `/en`.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Phosphor Icons · Supabase (leads) · Vercel (hosting y analítica).

## Captación de leads

- Formularios: hero, modal global (precios, visita, lote, corrida, modelo), cierre y aviso de salida (solo escritorio).
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
- Disponibilidad del Clúster 1: `lib/lots.ts` (cambiar `status` a `"apartada"` o `"vendida"`). Si cambia el sembrado oficial, reemplazar `public/img/sembrado.jpg`.
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

Migración de base de datos: `supabase/migrations/20260925010000_leads.sql`.
