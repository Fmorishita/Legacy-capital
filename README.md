# Legacy Capital Real Estate

Landing de captación de leads de Legacy Capital Real Estate (Ensenada, B.C.) para la preventa de casas con roof garden y vista al mar en El Sauzal. Español en `/`, inglés en `/en`.

**Estrategia:** el sitio no publica el nombre comercial del desarrollo ni del desarrollador, ni el inventario por lote. Legacy Capital y Fran Morishita son los protagonistas; esa información se comparte por WhatsApp con cada prospecto.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Phosphor Icons · Supabase (leads y capacitación) · Vercel (hosting y analítica).

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

## Capacitación de asesores (`/capacitacion`)

Plataforma privada del Curso de Ventas Inmobiliarias: 14 módulos (0 a 13) más anexos. Se entra desde el enlace discreto "Acceso asesores" del menú y del pie de página. Todas sus rutas llevan `noindex` y exigen sesión, salvo la verificación pública de certificados (`/certificados/[folio]`).

- **Contenido fuera del repositorio.** Este repo es público, así que el manual, las imágenes, las preguntas y la clave de respuestas viven solo en Supabase (esquema `cap`, que la API no expone). Para actualizarlos: descomprimir el paquete de contenido, correr `python3 scripts/cap/preparar.py <carpeta capacitacion> paquete.json [preguntas_borrador.json]` y luego `node scripts/cap/cargar.mjs paquete.json <carpeta capacitacion>/img`. Las preguntas generadas que ya aprobaste o editaste no se sobrescriben.
- **Cuentas.** Registro con nombre, correo, teléfono y contraseña. El administrador elige en el panel si se entra con código de invitación, con aprobación manual o con cualquiera de los dos. Contraseñas con bcrypt (pgcrypto); la sesión es una cookie httpOnly y la base solo guarda su hash. 8 intentos fallidos bloquean el correo 15 minutos.
- **Avance.** Los módulos se desbloquean en orden. Cada sección se marca como leída; un módulo se completa con todas sus secciones leídas, su quiz aprobado (80%) y sus tareas enviadas. Los anexos están siempre abiertos y no cuentan.
- **Quizzes y examen.** Calificación siempre en el servidor. El quiz de cada módulo usa las preguntas del examen final de ese módulo más las generadas que el administrador apruebe (empiezan como borrador). El examen final (Módulo 12) son 40 preguntas en orden aleatorio, 80% para aprobar, 3 intentos (configurable, y el administrador puede dar intentos extra). Al reprobar se ven las preguntas falladas sin la respuesta correcta; al aprobar se revelan, excepto en quizzes de módulo las que también están en el examen final.
- **Tareas.** Ejercicios escritos, casos prácticos del Módulo 12, lista de 100 y tablero semanal del Módulo 13: texto y/o archivo (PDF, imagen, Word, Excel o texto, máx. 4 MB). El administrador aprueba o pide corrección con comentario.
- **Certificado.** Se emite al completar los módulos, aprobar el examen y tener todas las tareas aprobadas: PDF con folio único (`LC-AAAA-XXXXXX`) y código QR hacia la página de verificación, que solo muestra nombre, curso, fecha y validez.
- **Panel** (`/capacitacion/admin`, solo administradores): asesores con avance, calificaciones e intentos; aprobar registros, suspender, restablecer contraseña, dar intentos extra, corregir nombre; códigos de invitación; revisión de tareas; aprobar y editar preguntas; clave de respuestas; exportar CSV.
- **Seguridad.** Todo pasa por `public.cap_rpc`, que exige `CAP_RPC_SECRET` (solo en el servidor) y resuelve la sesión antes de leer o escribir datos de un asesor. Las respuestas correctas nunca llegan al navegador antes de tiempo.
- Migraciones: `supabase/migrations/20260926010000_capacitacion.sql` y `20260926020000_capacitacion_admin.sql`. El valor del secreto se guarda en `private.settings` (clave `cap_secret`) y debe coincidir con `CAP_RPC_SECRET`.

## Variables de entorno

Ver `.env.example`. En Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `LEADS_RPC_SECRET`, `CAP_RPC_SECRET`, y opcionales `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID`, `PERMITIR_INDEXACION` (poner `1` al conectar el dominio definitivo).

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

Migraciones de base de datos: `supabase/migrations/` (leads y capacitación).
