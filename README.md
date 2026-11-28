# Legacy Capital Real Estate

Sitio de captación de leads de Legacy Capital Real Estate (Ensenada, B.C.) con un portafolio de dos proyectos en El Sauzal: una preventa de casas con roof garden y vista al mar, y departamentos y casas con entrega inmediata.

| Ruta (ES / EN) | Página |
| --- | --- |
| `/` · `/en` | Portada de Legacy Capital con el 80% del recorrido en la preventa (video, Fran, dudas del comprador, historia "Un día aquí", modelos, "Así compras con Fran", pagos, material exclusivo) y la entrega inmediata como opción para estrenar ya |
| `/preventa` · `/en/presale` | Preventa con vista al mar: el mismo recorrido de la landing del proyecto (acceso controlado, ubicación, modelos y plantas, interiores, equipamiento, roof garden, amenidades, plusvalía, pagos) |
| `/entrega-inmediata` · `/en/move-in-ready` | Entrega inmediata (departamentos y casas terminados) |

**Estrategia:** la preventa no publica el nombre comercial del desarrollo ni del desarrollador, ni el inventario por lote. La entrega inmediata tampoco: ni el desarrollo, ni el desarrollador, ni los nombres comerciales de los modelos (se muestran como Departamento 2R, Penthouse 2R, Casa 3R y Casa Roof Top). Legacy Capital y Fran Morishita son los protagonistas; el inventario disponible se comparte por WhatsApp con cada prospecto.

**Código de color:** dorado = preventa, verde viñedo = entrega inmediata (`components/ui/StatusChip.tsx`), en el menú "Proyectos" del encabezado, el menú móvil, el pie de página y las tarjetas.

**Diseño:** mismo lenguaje que la landing de la preventa. Playfair Display (titulares, con la palabra clave en cursiva dorada: `*texto*` en el copy) y Jost (texto); secciones crema y navy alternadas, capítulos numerados ("— 03 · Acceso controlado"), botones dorados con brillo y halo, y dos historias al hacer scroll en las que el video cambia con cada paso (`components/showcase/ScrollStory.tsx`). Componentes en `components/showcase/`, copy en `lib/i18n/showcase.ts`.

**Stack:** Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Phosphor Icons · Supabase (leads y capacitación) · Vercel (hosting y analítica).

## Captación de leads

- Formularios: hero, modal global (precios, visita, corrida, modelo, planos, estudio), sección de estudio de rentabilidad, cierre y aviso de salida (solo escritorio).
- Material exclusivo (análisis de rentabilidad y brochure de noviembre 2026): los PDF **no están en el sitio**. El prospecto elige si lo recibe por WhatsApp o por email (en inglés, email por defecto y obligatorio); la elección se guarda al inicio de `mensaje` como `[Enviar por email]` o `[Enviar por WhatsApp]` y Fran le envía el PDF (o se automatiza con `LEAD_WEBHOOK_URL`).
- Aviso de salida (escritorio, una vez por sesión): fotos del equipamiento incluido y formulario.
- Perfiles de comprador (Ensenada, California, mexicoamericanos, Monterrey, CDMX, Guadalajara): el perfil elegido se guarda en la columna `perfil` y en `origen` (`perfil-monterrey`, etc.).
- Cada lead lleva su proyecto en la columna `proyecto` (`preventa`, `vinedos` o `general`): lo pone la página donde se llenó el formulario; en la portada el formulario pregunta "¿Qué te interesa?". En `interes`, Viñedos usa `depa`, `ph`, `casa` o el modelo (`palomino`, `palomino_ph`, `azur`, `teide`).
- `POST /api/leads` valida con Zod, filtra bots (campo trampa, tiempo mínimo, límite por IP) y guarda vía RPC `public.submit_lead`.
- `PATCH /api/leads` agrega la calificación opcional (plazo, forma de pago, uso) con el token del alta.
- La tabla `public.leads` tiene RLS sin políticas: la llave pública no puede leerla. Las funciones exigen `LEADS_RPC_SECRET`, que solo vive en el servidor.
- Los leads se consultan en Supabase → Table Editor → `leads` (columna `estatus` para el seguimiento).
- Opcional: `LEAD_WEBHOOK_URL` envía cada lead a Make, Zapier, n8n o Slack.
- Eventos de medición: `lead`, `whatsapp_click`, `lot_select`, etc. (Vercel Analytics, y Meta Pixel / GA4 si se configuran sus IDs). Nunca se envían nombre, teléfono ni correo a los píxeles.

## Links por canal y analítica

Cada canal usa su propio link corto; todos llegan a la portada con UTM (definidos en `next.config.ts`, `SHORT_LINKS`):

| Canal | Link |
| --- | --- |
| Instagram de Legacy Capital | `legacycapitalmx.com/ig` |
| Instagram personal de Fran | `legacycapitalmx.com/fran` |
| Página de Facebook | `legacycapitalmx.com/fb` |
| WhatsApp personal (perfil / estados) | `legacycapitalmx.com/wa` |

La fuente se guarda con el lead (columnas `utm_*` en Supabase) y llega en el correo como **Fuente del tráfico**. Para ver visitas por canal y mapas de calor: Microsoft Clarity (`NEXT_PUBLIC_CLARITY_ID`) y Vercel Analytics.

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

Ver `.env.example`. En Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `LEADS_RPC_SECRET`, `CAP_RPC_SECRET`, y opcionales `LEAD_WEBHOOK_URL`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN` (API de conversiones; opcional `META_CAPI_TEST_CODE`), `NEXT_PUBLIC_GA_ID`, `PERMITIR_INDEXACION` (poner `1` al conectar el dominio definitivo).

## Contenido

- Secciones con el diseño de la preventa (portada, historias, modelos, pagos, plusvalía, material, FAQ, cierre): `lib/i18n/showcase.ts`.
- Precios de lista (noviembre 2026), esquemas de pago y proyección de plusvalía: `lib/money.ts`. En inglés los montos van en USD a 18.5 MXN por dólar (`USD_RATE`): el modelo de 2 recámaras queda en $215K USD.
- Videos y fotos hechos con IA (Drive: "Legacy / Punta pacifico" y la landing del proyecto): `public/media/`. Ninguno muestra el nombre del desarrollo; revisar letreros y logos antes de agregar uno nuevo.
- Textos de la preventa: `lib/i18n/es.ts` y `lib/i18n/en.ts` (misma estructura). Portada: `lib/i18n/home.ts`. Entrega inmediata: `lib/i18n/vinedos.ts`. Tarjetas de cada proyecto (precio desde, estatus, foto): `lib/i18n/portfolio.ts`. Rutas: `lib/projects.ts`.
- Entrega inmediata: precios de lista y mensualidades de referencia del desarrollador (octubre de 2026), en `lib/i18n/vinedos.ts` y en el JSON-LD de `components/Vinedos.tsx`; actualizarlos cuando cambie la lista. Fotos y videos en `public/img/vdm/` y `public/video/vdm-*`.
- Perfiles de comprador y estudio de rentabilidad: `personas` y `study` en los diccionarios.
- Promoción de septiembre y datos de contacto: `lib/site.ts` (la barra promocional se oculta sola al vencer `promoEndsAt`).
- Aviso de privacidad: `lib/legal/privacy.ts` (revisar con un abogado: razón social y domicilio completos).
- Retrato del asesor: agregar `public/img/fran-morishita.jpg` y poner `hasPhoto: true` en `lib/site.ts`.

## Estudio de video (`estudio-video/`)

Reels verticales para vender los desarrollos, hechos con [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML → MP4) a partir de renders, texto animado, voz y música. Reglas permanentes en `estudio-video/CLAUDE.md`; estilo de edición medido sobre el video de referencia en `estudio-video/estilo.md`. El video de referencia, los assets del desarrollador, los briefs y los renders no se suben al repo (ver `estudio-video/.gitignore`).

```bash
cd estudio-video && npm install && npx hyperframes doctor
```

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev
npm run build && npm start
```

Migraciones de base de datos: `supabase/migrations/` (leads, proyecto del lead y capacitación).
