# Legacy Video Studio

Estudio privado con un proyecto independiente por video. Inicio reúne tus videos guardados y permite abrir Doctor V6 de Legacy Capital, subir otro video, importar un editable o vincular sus fuentes.

Abre Escenas para cambiar medios, ordenar/dividir tomas, encuadrar y ajustar transiciones. Capas permite editar textos, precios, logos, gráficas y su animación. Audio conserva voz, música y efectos como pistas independientes. Subtítulos permite editar texto, tiempos, estilo y SRT. Comentarios guarda notas asociadas a una escena y un momento. Referencias mide cortes y paleta de un fragmento y documenta las instrucciones de estilo para ChatGPT o Claude.

Los borradores y el historial local se guardan con IndexedDB en ese navegador. **Guardar** conserva una instantánea independiente del proyecto y sus medios en el espacio privado del Site para abrirla desde otro dispositivo. Los borradores locales no se sincronizan automáticamente: el estado de guardado indica qué copia se completó. Si la revisión cambió en otro dispositivo, se conserva otra copia en vez de sobrescribirla. Descarga también el proyecto editable JSON con sus medios como copia portable. Las solicitudes y resultados de IA usan sus propios snapshots privados. La generación se ejecuta desde tu ChatGPT conectado. Un cambio de guion o duración indica que debe revisarse la locución y los subtítulos.

El motor Canvas reproduce una composición editable. El MP4 original sigue disponible como referencia; no se afirma que esta nueva composición sea idéntica al render HyperFrames. La exportación captura realmente Canvas y Web Audio a tiempo real, en MP4 cuando MediaRecorder lo admite o WebM como alternativa. Mantén la pestaña visible durante la exportación.

`npm run check` valida JavaScript, datos, medios, cambios del modelo, alcance de referencias y subtítulos. `tools/qa-dom.mjs` es una prueba de interacción DOM en Node con adaptadores sintéticos; no sustituye la revisión visual de navegador ni verifica MediaRecorder. La herramienta de navegador gestionado no estuvo disponible durante esta construcción.

Los recursos pertenecen a este proyecto. Las tipografías y pistas conservan sus fuentes y términos bajo `dist/assets/licenses`. El acceso privado del Site no concede derechos de redistribución pública sobre las pistas de stock.


## Cambios con IA usando ChatGPT

La sección principal «Cambios con IA» recibe instrucciones libres y comentarios pendientes, con alcance por escena, apertura o proyecto. «Aplicar cambios con ChatGPT» guarda una copia de origen y una solicitud privada en R2, y abre ChatGPT con la tarea. El usuario envía ese mensaje usando su cuenta existente: el Site no consume una API de IA ni continúa generando por sí solo cuando no hay un asistente ejecutando la solicitud.

El Site expone once herramientas MCP para que el asistente lea el proyecto, vea las referencias, reclame el trabajo, publique progreso, suba recursos reales por fragmentos y entregue una versión completa. La app personal creada por Sites debe estar conectada en ChatGPT. La locución, imágenes y demás medios se generan mediante las herramientas que tenga disponibles ese ChatGPT; la falta de una herramienta debe aparecer como limitación real, sin fingir una generación.

Cuando el asistente devuelve el proyecto, el editor incorpora los resultados automáticamente al volver a su pestaña. Antes guarda una versión anterior. Si hubo cambios manuales durante la ejecución, abre el resultado como proyecto separado. Cambiar el guion exige una voz nueva y subtítulos completos antes de aceptar una solicitud como terminada. Los uploads se verifican por tamaño y SHA256; las solicitudes son idempotentes y su reclamación usa escritura condicional.

El servidor está diseñado para el Site privado de un único propietario. No cambies su audiencia a pública sin añadir aislamiento y autorización por usuario. `worker/index.mjs` es la fuente del backend; `tools/build-worker.py` genera el Worker y su catálogo de recursos. Los medios del proyecto se guardan en el bucket privado y no se incluyen como biblioteca de stock en GitHub.

## Desde el celular y por voz

Inicio es la entrada a la biblioteca. Dentro de un proyecto, en pantallas de hasta 900 px, «Cambios con IA» ocupa la vista principal. «Ver anuncio» abre la reproducción. «Herramientas» despliega escenas, timeline, inspector, referencias y el resto de controles; al cerrar vuelves a tus indicaciones. El campo de cambios conserva su borrador local sin abrir automáticamente el teclado.

«Hablar» solicita permiso de micrófono y graba una nota real de hasta tres minutos. Puedes terminar, escuchar, borrar o adjuntar un audio de hasta 10 MB; máximo cinco por solicitud. El dictado en vivo depende de SpeechRecognition del navegador y puede ser parcial. Cuando no está disponible, el audio sigue adjunto para que ChatGPT lo escuche. Revisa o corrige el texto antes de enviar. Las notas pueden guardarse con el proyecto privado; al pulsar «Aplicar cambios con ChatGPT» se adjuntan a esa solicitud. No entran en la locución ni en la mezcla del anuncio.

El asistente recibe las notas pequeñas directamente al leer la solicitud con `legacy_get_ai_request`; `legacy_get_voice_note` recupera cada nota de forma independiente. Esto conserva compatibilidad con conexiones que aún tienen el catálogo anterior de herramientas. `tools/chatgpt-edit-bridge.py download` también guarda estas notas en `voice-notes/`. Si la sesión no admite audio, el helper `transcribe --audio archivo --out transcripcion.json` usa Whisper local en CPU con modelo cuantizado sin enviar la nota a una API; requiere el paquete gratuito pywhispercpp y descarga su modelo una vez. Revisa nombres y cifras. Si tampoco tiene acceso a ejecución/transcripción local, debe informar la limitación. No hay cargos de una API de IA configurada; el usuario envía el mensaje preparado en su ChatGPT.

Verificación: `node tools/qa-voice.mjs` comprueba grabación, cancelación, permisos y fallback con adaptadores; `MOBILE_QA=1 node tools/qa-dom.mjs` simula la navegación móvil, los borradores y el envío privado del audio. Estas pruebas no equivalen a una prueba de micrófono físico en iPhone/Android ni a una exportación multimedia real.

## Inicio y un proyecto por video

Inicio muestra tarjetas con nombre, miniatura, duración y estado de guardado, con búsqueda y actualización. Desde el editor puedes volver a Inicio y abrir otro proyecto sin mezclar sus comentarios ni solicitudes de IA. Doctor V6 y las entregas anteriores se conservan.

- **Subir un video:** crea otro proyecto con su video y audio original; el tamaño admitido para guardar cada archivo en la nube es de hasta 50 MB. Un MP4 terminado contiene sus textos y gráficos incrustados; no se recuperan automáticamente como capas separadas.
- **Importar proyecto editable:** abre el JSON y sus archivos disponibles en una identidad independiente. Conserva escenas, capas, pistas, captions y comentarios que incluya.
- **Guardar:** sube los medios pendientes y guarda la instantánea privada. El borrador y su historial locales siguen disponibles en ese navegador; no son un historial sincronizado entre dispositivos.
- **Google Drive/GitHub:** vincula una carpeta, archivo o repositorio como fuente o abre tu cuenta fuera del editor. «Preparar proyecto con esta fuente» crea un borrador y deja indicaciones listas en Cambios con IA. Envía la solicitud para que tu ChatGPT actual importe los materiales con sus conectores.

Los enlaces de fuentes no equivalen a una conexión OAuth, a una exploración autenticada dentro del Site ni a sincronización automática. La herramienta de elegibilidad de conectores Sites no estuvo disponible en esta revisión; no se ha configurado una conexión de ese tipo. El flujo con ChatGPT conserva la cuenta elegida por el usuario y no añade una API de IA de pago.

La biblioteca usa `GET/POST /api/projects` y `GET/PUT /api/projects/:id`. Cada escritura existente requiere su revisión vigente. Las URLs temporales y los medios sin subir no se aceptan como un guardado durable. Los proyectos y uploads pertenecen al Site privado del propietario; no se publican en el repositorio de código. Los proyectos nuevos usan su propia configuración, sin heredar los precios, personajes o marca del ejemplo Doctor.

El alcance de QA de esta revisión se registra en la entrega: las pruebas de adaptadores, la simulación DOM, una lectura/escritura privada real y la captura nativa de despliegue son verificaciones distintas. No se afirma una prueba física de iPhone/Android o de exportación multimedia por contar sólo con esas comprobaciones.
