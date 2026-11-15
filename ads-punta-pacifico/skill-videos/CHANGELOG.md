# Historial

## 1.8.0 — 2026-11-14

- Petición: guardar cada video como proyecto, volver a Inicio, subir otros videos y trabajar con fuentes de Drive o GitHub, conservando Doctor V6 como primera prueba.
- Antes: un proyecto abierto y borradores/historial locales. Ahora: biblioteca por video, guardado explícito privado con medios y apertura desde otro dispositivo, además de los borradores y versiones locales. Los conflictos de revisión conservan copias y no sobrescriben silenciosamente otro dispositivo.
- Un video nuevo o un JSON importado tiene identidad independiente. Los recursos, comentarios y solicitudes de IA no se mezclan entre proyectos. Un MP4 terminado se identifica como montaje con elementos incrustados, sin afirmar recuperación automática de capas.
- Drive/GitHub se vinculan como fuentes y pueden abrirse fuera del editor. La importación mediante las cuentas ocurre al enviar una solicitud a ChatGPT. No se declara OAuth, navegación autenticada ni sincronización de carpetas dentro del Site: la herramienta de elegibilidad de conectores Sites no está disponible en esta revisión.
- Los nuevos proyectos usan su configuración de marca y datos; el ejemplo Doctor y las entregas previas se conservan. El alcance de validación y publicación de esta revisión se registra por separado; no implica nueva aprobación estética ni una prueba física de teléfono.

## 1.7.0 — 2026-11-14

- Petición: editar desde el celular con foco en comentarios/cambios con IA; ocultar escenas, inspector y timeline hasta abrirlos; indicar cambios con voz grabada.
- Vista móvil con botones de anuncio y herramientas, retorno a los comentarios sin perder el borrador, campos legibles y objetivos táctiles. La interfaz de escritorio conserva sus controles.
- Grabación real mediante MediaRecorder, revisión, cancelación, adjuntos y dictado cuando el navegador lo soporta. Si no hay dictado, se conserva la nota de voz privada para escucharla desde ChatGPT. No se mezcla en el anuncio ni se publica en GitHub.
- Respaldo gratuito de transcripción local con Whisper.cpp para sesiones que no admiten audio; prueba real con coincidencia de texto, sin enviar la grabación a una API.
- Herramienta MCP adicional para recuperar audio por solicitud y helper que descarga las notas. El resultado automático incorpora sólo la última versión completada para evitar volver a una anterior al abrir otro dispositivo.
- QA de navegación móvil, persistencia y envío de notas mediante simulación DOM; permisos, cancelación y fallback con adaptadores de micrófono. La prueba física de iPhone/Android queda pendiente; no se afirma aprobada.

## 1.6.0 — 2026-11-14

- Petición: hacer visibles los cambios con IA y ejecutar los comentarios de imagen, guion/voz, audio y edición sin sustituciones manuales. El usuario eligió su ChatGPT actual, sin configurar una API de pago.
- Antes: feedback y JSON para continuación manual. Ahora: sección principal, solicitud privada con snapshot, herramientas MCP de lectura/reclamación/subida/resultado y devolución automática al editor. El usuario envía el mensaje preparado en ChatGPT.
- Nueva voz real comprobada en una solicitud de QA aislada, junto con carga binaria, SHA256, subtítulos y devolución del proyecto. No se alteró el anuncio de trabajo ni se usaron APIs de IA de pago.
- Guardado anterior, protección ante cambios concurrentes, estados honestos y rechazo de guion nuevo sin locución/subtítulos correspondientes. La interfaz publicada se revisó mediante captura nativa; no se afirma aprobación estética ni prueba de todos los modelos de generación.

## 1.5.0 · 2026-11-14

Petición explícita: crear un sistema para editar cualquier elemento de los anuncios, añadir comentarios a escenas concretas y subir referencias de estilo, usando Doctor V6 como ejemplo. Se construye Legacy Video Studio con proyecto editable independiente; esta petición no aprueba estéticamente Doctor V6 ni cambia el rechazo de V6-Higgsfield. La publicación del editor y sus verificaciones finales se registran fuera del paquete hasta observar resultados nativos.

- Antes: kit de archivos para reedición mediante otra IA. Ahora: flujo adicional de editor visual con escenas, medios, capas, guion, audio, subtítulos, versiones locales y exportación portable con medios; se conservan el kit y los renders anteriores.
- Comentarios con timestamp e ID de escena; referencias con archivo, intervalo, alcance, elemento a imitar e instrucciones. El análisis de píxeles mide cortes y colores de forma aproximada; no se presenta como análisis semántico de IA ni réplica exacta de una edición.
- El guion y el texto asociado a la voz se comparan: un cambio desincronizado marca la locución pendiente. No simular generación de voz, imágenes, música o video sin una herramienta y resultado reales.
- La composición de canvas del editor y el render HyperFrames de referencia son productos distintos. Exportación de navegador en MP4 si MediaRecorder lo soporta, WebM como alternativa; grabación en tiempo real manteniendo visible la pestaña y verificación del archivo resultante.
- Nueva referencia de edición visual y feedback; el validador la exige desde 1.5.0 manteniendo compatibilidad con paquetes anteriores durante una actualización.

- Entrega a GitHub solicitada: carpeta acotada para Claude con copias de trabajo, preparación automática y fuentes licenciadas. Repositorio público conservado; originales exactos en Drive. Verificados commit remoto y recursos.
- Editor publicado de forma privada; interacciones verificadas mediante simulación DOM y captura nativa revisada. Exportación MediaRecorder y navegador interactivo quedan sin verificar por falta de herramientas; no se declaran aprobados.

## 1.4.0 · 2026-11-14

Nueva petición Doctor comercializada por Legacy Capital. Esta revisión se identifica como `V6-Legacy-Capital-Doctor` y no como la prueba histórica `V6-Higgsfield`, que sigue rechazada. La evaluación estética de la nueva pieza está pendiente. Esta entrada se aplica sólo después de terminar y verificar la pieza.

- Marca comercial y logo visibles configurados independientemente de la identidad del proyecto y la carpeta de fuentes; no filtrar nombres internos al anuncio.
- Primer Doctor reconocible en uniforme médico; vestuario posterior acorde a actividad. Conteo estructural explícito: un tragaluz por roof en este encargo. Pickleball con anatomía y mirada coherentes con pelota/juego.
- El último guion y los datos explícitos del cliente sustituyen referencias históricas. Precio, mensualidades, fecha de entrega, promoción y vigencia son configuración de la revisión, sin convertirlos en valores universales de la skill.
- Nuevo manifiesto de versión y subversión por perfil para preservar V5 y distinguir dos trabajos llamados V6. Kit Doctor nuevo separado; no actualizar los otros perfiles sin encargo.

## 1.3.0 · 2026-11-14

Petición explícita: el usuario dijo que no le gustó V6 de Higgsfield y pidió reunir todos los elementos de los tres anuncios V5 en otra carpeta de Drive para reeditar con Claude u otra IA. V5 es la base seleccionada para esta entrega; no se declara una aprobación estética que no haya emitido. V6 se conserva como histórico, fuera del kit. La organización del kit y su verificación local quedaron completadas; la entrega de Drive se registra fuera del paquete.

- Antes: editables completos y mix narrado como entrega principal. Ahora: kit por perfil con archivos individuales, voz limpia alineada, mezcla y componentes exactos de audio del propio proyecto, tipografías y logo, imágenes en orden, guion, subtítulos, tiempos por palabra, CSV/JSON de edición, código ligero y proyectos completos.
- Añadida guía/prompt para la IA receptora, rutas relativas, índice de archivos, procedencia y manifiestos SHA256. El HTML final y los fotogramas son la autoridad del texto visible; `metadata.overlay` puede conservar una anotación de planificación que no sea el copy entregado.
- Se aclara la diferencia entre organizar las copias de trabajo del mismo usuario/licenciatario y redistribuir stock a nuevos terceros. Mantener términos y fuentes; no afirmar una excepción de client-handoff ni que un stem cambia los derechos. Descarga oficial como opción para nuevos destinatarios.
- Nueva referencia de entrega portable. El validador exige esa referencia desde1.3.0, preservando validación de instalaciones anteriores durante la actualización.

## 1.2.0 · 2026-11-10

Petición explícita: hacer más reales las primeras escenas del anuncio Doctor con Higgsfield y Seedance 2.5, a720p, usando sólo el saldo disponible de la cuenta y conservando la casa y el proyecto. V6 quedó renderizada y verificada; su aprobación estética sigue pendiente. La evaluación estética deV5 sigue pendiente.

- Antes: el flujo usaba imágenes fijas y animación de composición. Ahora: se añade una prueba de imagen a video con referencias limpias como primer fotograma, movimientos humanos pequeños y control temporal de arquitectura, identidad, manos y objetos.
- Consultar catálogo, saldo y cotización antes de enviar; registrar trabajos y gasto. El casoV6 usó3clips de4s cotizados a28créditos,84 de110 y26 restantes observados; estos datos son configuración de esa ejecución, no precios ni saldos universales.
- Recortar los clips a las ventanas reales del anuncio sin estirar la voz ni duplicar fondos; conservar narración, música, SFX y captions y reducir cámara artificial adicional. Generar sin audio cuando proceda y verificar dimensiones del MP4 entregado.
- Separar consulta de Katana de autorización para otra variante. Resolver la ruta del editor; no afirmar conexión o uso de un editor local ausente ni sustituirlo con un sandbox cloud. La composición autorizada con HyperFrames se identifica por su herramienta real.
- Añadida referenciaHiggsfield/presupuesto, campos de presupuesto/generación en templates y validación de esa referencia.
- Compatibilidad de actualización: el validador exige la nueva referencia desde1.2.0; permite validar la instalación1.1.0 antes de respaldarla y sustituirla, conservando las comprobaciones de identidad y versión.

## 1.1.0 · 2026-11-06

Feedback explícito: el usuario dijo que le gustan los anuncios V4 y que California gustó en general, con observaciones para pulir. V5 es el trabajo derivado y todavía no se declara aprobada.

- Apertura con vista al mar nombrada y visible; amenidades del preview después, según valor de cada perfil y con ropa adecuada.
- Casting masculino o pareja para Empresarios de Punta Pacífico; paleta azul/dorado, sin verde claro. Todos los cierres centrados.
- Rango de precio resumido y aproximado indicado por el cliente: $3.9–$4.8 MDP,2 y 3 recámaras,MXN; retirar la nota visible de precio/disponibilidad.
- Pago10/10en19/80 explicado como flexibilidad para cuidar liquidez. Estimación de plusvalía8% anual en escenario conservador aportada por el cliente; no histórico verificado ni garantía. Retirar la nota visible «Plusvalía no garantizada», conservando ESTIMADA en la cifra.
- QA de laptops: interfaz sólo en el frente real de pantalla, no sobre la tapa; revisar bisagra, perspectiva y mirada. Reforzar SFX de texto/motion y transiciones B-roll motivadas.
- Templates distinguen datos históricos de lista, rango resumido y estimación aportados por el cliente, y preview de amenidades pendientes de materialización. Carpeta de skills en Drive actualizada a la colección «skills ChatGPT».
- Continuación 10/11/2026: preview exacto localizado y verificado en Drive; referencia y procedencia incorporadas antes de generar las escenas. V5 quedó renderizada y verificada, pendiente de evaluación estética del usuario.

## 1.0.0 · 2026-11-06

Creación solicitada por el usuario después de la entrega V4. Se documentaron sus preferencias explícitas: imágenes de personas en renders, hooks directos, precio sólo en apertura, pagos, subtítulos dentro del video, voz continua, música distinta y edición con HyperFrames.

Se incorporaron las lecciones de V4: grupos de subtítulos que cruzaban cortes, texto sobre rostros, cruce de precio/titular en Empresarios a2.8s, correspondencia entre imagen y voz, límite de100MiB del conector y sincronización de fuente/MP4/ZIP/Drive tras corregir.

Se añadió la instrucción de mantener la skill ante cambios importantes, versionar y regenerar el paquete descargable. En el momento de crear1.0.0, V4 era la última configuración entregada y aún no se había recibido aprobación estética explícita; la aprobación general posterior se registra en1.1.0.

Control añadido en1.4.0tras revisar el MP4: máscaras de captions ligadas a su propia imagen durante los cortes, comprobación de legibilidad real del scrim y evidencia de fotogramas codificados. Se corrigió y verificó la pieza antes de registrar este aprendizaje.
