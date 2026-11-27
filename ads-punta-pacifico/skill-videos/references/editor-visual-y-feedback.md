# Editor visual y feedback por escena

## Petición y alcance

El 14/11/2026 el usuario pidió un sistema donde modificar cualquier elemento de los anuncios: guion, música, SFX, imágenes o clips, transiciones, subtítulos y motion graphics; añadir comentarios en escenas concretas y subir videos de referencia para indicar un estilo de edición o un elemento que se quiere replicar. Doctor `V6-Legacy-Capital-Doctor` es el proyecto de ejemplo. Esta petición no sustituye el histórico V5 ni convierte en aceptada la prueba `V6-Higgsfield` rechazada.

El editor se construye en `/workspace/sites/legacy-video-studio`. Su publicación debe verificarse con las herramientas nativas antes de afirmar que está disponible en una URL; un enlace esperado o un sitio registrado no prueban despliegue. Guardar ID, URL observada, versión, estado y verificaciones en el registro de entrega fuera del paquete. La publicación privada y la conexión MCP ya fueron verificadas; cada actualización requiere su propia comprobación de despliegue.

## Modelo editable

- Proyecto: ID estable, nombre, revisión, dimensiones, fps, duración, marca visible y versión fuente.
- Escenas: ID estable, orden, inicio/duración, medio, recorte, movimiento de cámara, velocidad de clip, transición y narración asociada. Mantener el tiempo de la voz como referencia cuando el cambio no autorice realinearla.
- Medios: imágenes, videos, logo, tipografías, voces, música y SFX con IDs; conservar fuente, licencia, hash y tiempos de recorte cuando existan. Subir o sustituir un recurso no autoriza rediseñar arquitectura o inventar condiciones comerciales.
- Capas: texto, cifras, logo, líneas, formas y gráficas, con posición, tamaño, color, orden, opacidad, ventana temporal y animación. Subtítulos y titulares permanecen separados.
- Audio: pistas independientes con tipo, recurso, inicio, offset, duración, volumen, fundidos y silencio. No reproducir la mezcla completa al mismo tiempo que sus stems; produce duplicación. El master original sirve como referencia, no como pista adicional a la voz/música/SFX activos.
- Subtítulos: grupos completos con tiempos, palabras, posición y estilo; conservar su correspondencia con voz y escena al cambiar duración u orden. No prometer alineación precisa sin medir una nueva locución.

Guardar los campos existentes que no se editen y conservar procedencia. Los cambios de la interfaz son una nueva revisión; nunca sobrescribir silenciosamente el MP4 o los kits históricos del usuario.

## Comentarios y referencias

Cada comentario conserva `id`, `sceneId`, tiempo exacto del proyecto, texto, fecha y estado abierto/resuelto. Al aplicarlo, saltar a ese tiempo y comprobar qué capa, imagen y frase estaban activas. Si se reordenan escenas, mantener el ID y actualizar o advertir sobre el tiempo para no trasladar feedback a otra toma por accidente.

Una referencia conserva el archivo y su ID, un intervalo de origen, alcance de aplicación —una escena, apertura o proyecto—, elemento deseado e instrucciones concretas. Preguntar sólo si ese alcance no se puede resolver con el material y el contexto. Distinguir imitar ritmo, composición, tratamiento de texto, transición o SFX: no copiar todo el contenido por defecto.

El análisis local del navegador puede muestrear píxeles, estimar cambios visuales y paleta y proponer presets. Registrar método, intervalo, precisión y límites. Los cortes detectados son aproximados; un muestreo lento puede omitir tomas cortas. Los colores no identifican una fuente tipográfica ni reconstruyen una animación. No afirmar que ese análisis comprendió el significado, identificó todos los sonidos o replicó exactamente el estilo. Para una reconstrucción semántica o generación real usar las herramientas disponibles y comprobar su resultado, sin simular una operación de IA.

Aplicar las propuestas al alcance solicitado, conservar una versión anterior y revisar de nuevo rostros, manos, arquitectura, legibilidad, safe areas y sincronía. Una referencia no sustituye las restricciones del proyecto.

## Guion, voz y reloj de edición

Conservar separados el guion editable y el texto que corresponde a la voz cargada. Cuando difieran, marcar la locución como pendiente y explicar que cambiar letras en una caja de texto no modifica el audio grabado. Permitir subir una nueva voz o preparar el brief para generarla con una herramienta real. No declarar una voz regenerada por cambiar su etiqueta.

Después de una nueva voz medir duración y palabras; realinear subtítulos, escenas y SFX pertinentes y comprobar el resultado completo. Si sólo cambia un titular o caption, no regenerar innecesariamente la voz. Un cambio de duración, orden o velocidad de clip puede requerir otra verificación del reloj aunque el guion no cambie.

## Composición editable y render de referencia

El canvas de Legacy Video Studio recompone recursos y capas para permitir edición directa. El MP4 original de HyperFrames es referencia de la pieza entregada. No afirmar equivalencia visual o sonora exacta por compartir imágenes, datos y tiempos: pueden cambiar rasterizado de fuentes, curvas de animación, máscaras de transición, mezcla o gestión de color.

Ofrecer comparación con el original y exportar una revisión nueva del editor. Cuando se requiera acabado final idéntico al motor de producción, portar los cambios a HyperFrames, renderizar y verificar ese MP4. Identificar en metadata qué motor produjo cada archivo y mantener el origen `V6-Legacy-Capital-Doctor` separado de la prueba `V6-Higgsfield`.

## Guardado, portabilidad y continuación con IA

El borrador del editor y su historial se conservan en IndexedDB de ese navegador. Desde 1.8.0, Guardar conserva además una instantánea del proyecto y sus medios en el espacio privado del Site, que se puede abrir desde otro dispositivo. El guardado explícito no significa que todos los borradores locales se sincronicen automáticamente ni que se haya escrito una copia en Drive/GitHub. Mostrar el resultado real de cada operación; si falla la subida, conservar el borrador local y advertir que el guardado privado está pendiente. Comprobar errores de cuota, archivos ausentes y revisión del proyecto antes de afirmar guardado.

Para compartir un cambio con ChatGPT, Claude u otro editor, exportar el JSON portable con todos sus medios y el brief de edición: configuración, IDs, escenas, capas, pistas, captions, comentarios y referencias. Los recursos subidos deben viajar como bytes o entradas portables; las URLs `blob:` sólo funcionan en la sesión y no son una entrega durable. Conservar nombres, fuentes, licencias y hashes cuando estén disponibles. Un JSON de configuración sin sus recursos se identifica como tal, sin llamarlo paquete completo.

Al continuar, importar y validar el paquete más reciente; no asumir que el proyecto de ejemplo sigue siendo el actual. El brief registra cambios pendientes, referencias e indicaciones de voz, sin presentarlos como ya aplicados. La subida a Drive se realiza mediante el flujo autorizado y su readback, no mediante una promesa de sincronización automática.

## Exportación y QA

Consultar soporte real de `MediaRecorder` y del codec: exportar MP4 cuando esté disponible; ofrecer WebM como alternativa compatible. No cambiar la extensión de un WebM para llamarlo MP4. La grabación del canvas y la mezcla del navegador ocurre en tiempo real: mantener la pestaña visible y evitar interrumpirla hasta terminar. Mostrar progreso, errores y formato de salida reales.

Verificar una exportación corta con video y audio y los controles que afectan el montaje; para una entrega final, revisar el archivo completo como exige la skill. Comprobar dimensiones, duración, reproducción, legibilidad, sincronía y ausencia de handles/guías del editor. Una vista previa correcta no prueba por sí sola que el archivo descargado quedó bien.

Guardar y reportar el alcance de pruebas realizado. No presentar un control de interfaz, un brief exportado o un preset propuesto como una generación de medios, una edición ya renderizada o una aprobación estética del usuario.


## Materiales en un repositorio de GitHub

Cuando el usuario pida entrega a través de su repositorio, localizarlo y verificar permisos y visibilidad antes de escribir. Añadir una carpeta acotada sin cambiar la aplicación existente. Organizar versiones, fuentes, guiones, subtítulos, tiempos, medios, tipografías, logos y código; añadir `CLAUDE.md` con instrucciones de preparación y una correspondencia entre recursos y escenas. La elección de estilo del usuario puede sustituir la edición anterior; los hechos del proyecto no cambian por imitar una referencia.

No convertir el repositorio público en una biblioteca de música o SFX de stock. Mantener fuentes oficiales, términos, hashes y un script de descarga para el trabajo autorizado. El método de esta entrega incluye copias de imagen JPEG de calidad 92 con dimensiones originales, PNG para transparencia, voces FLAC sin pérdida y mezclas AAC de referencia. Identificar esas optimizaciones; no llamarlas originales exactos. Enlazar los PNG, WAV, stems y MP4 exactos de Drive sin ampliar sus permisos.

Verificar hashes de medios, rutas de montaje, reconstrucción de una imagen y una voz, descarga de fuentes licenciadas y lectura del commit remoto. Los archivos de stock recuperados, la caché y los derivados se excluyen de Git. Los manifiestos históricos conservan los hashes del kit original; un catálogo del repositorio describe sus copias de trabajo.

Entrega verificada del 14/11/2026: editor privado en https://legacy-video-studio-fran.trimjewel4.chatgpt.site y materiales en https://github.com/Fmorishita/Legacy-capital/tree/main/ads-punta-pacifico . La prueba técnica no implica aprobación estética del usuario.


## Cambios con IA mediante la cuenta de ChatGPT (1.6)

El usuario eligió usar su ChatGPT actual sin configurar una API de IA de pago. La sección principal «Cambios con IA» recopila instrucciones y comentarios pendientes, junto con escena, momento, alcance y referencias. El envío guarda una solicitud privada con el proyecto y sus medios en el Site; abre ChatGPT con un mensaje preparado que el usuario debe enviar. No afirmar que la app por sí sola ejecuta un modelo en segundo plano, que los límites de ChatGPT son ilimitados o que un trabajo terminará sin una sesión del asistente.

La app personal de Legacy Video Studio queda conectada a ChatGPT por MCP. Flujo del asistente: leer `legacy_get_ai_request`, revisar el alcance y las referencias, reclamar con `legacy_claim_ai_request`, obtener el proyecto y la imagen actual con `legacy_get_project` / `legacy_get_scene_image`, publicar progreso real con `legacy_update_ai_request`, subir los medios y terminar mediante `legacy_submit_ai_result`. Usar los nombres efectivamente expuestos en la sesión; no inventar herramientas.

Para subir archivos reales: `legacy_begin_asset_upload`, `legacy_upload_asset_chunk` y `legacy_finish_asset_upload` verifican tamaño y SHA256. Pueden transportar imagen, audio, clip y JSON completo. Las URLs `blob:` no son una entrega. También existe el helper portable `tools/chatgpt-edit-bridge.py` para descargar la solicitud, producir voz con el cliente gratuito Edge TTS si está disponible, subir archivos y entregar la versión. El acceso de servicio del Site se mantiene sólo en memoria/stdin y se envía únicamente a ese Site; no se muestra al usuario ni se incluye en código, logs o GitHub. El helper usa las rutas privadas del Site; el endpoint MCP reservado se usa mediante las herramientas autenticadas de ChatGPT.

Si pide una foto, generarla con la herramienta nativa y referencias reales del proyecto, subirla y asignarla a la escena indicada. No sustituir generación por renombrar o reutilizar silenciosamente el mismo archivo. Si cambia el guion hablado, producir una narración continua nueva, medir el audio, realinear palabras, escenas y captions y ajustar música/SFX al reloj nuevo. Si sólo cambia un titular visible, conservar la voz salvo que pida otra. Para música/SFX mantener fuentes y licencias; no gastar créditos de otros servicios o contratar una API dentro de este modo. Si una herramienta o cuota falta, marcar la limitación con `needs_input` y conservar lo realizado; nunca fingir un recurso ni resolver un comentario pendiente.

El servidor rechaza guion nuevo sin nueva locución correspondiente, subtítulos incompletos, URLs temporales o pistas fuera de sus tiempos. El editor conserva la versión previa e incorpora el resultado al volver a su pestaña. Usa una huella estable del proyecto para detectar cambios concurrentes y abre la versión de IA como proyecto separado cuando es necesario. Los borradores manuales siguen en IndexedDB. Desde 1.8.0, el guardado explícito del proyecto también lo conserva en el espacio privado, junto con sus medios; las solicitudes de IA y sus resultados mantienen sus snapshots independientes. No publicar snapshots, comentarios ni uploads privados en el repositorio público al sincronizar el código.

QA observado: conexión MCP nativa y diez herramientas disponibles en 1.6.0; referencias de imagen leídas; locución real generada sin una API de IA de pago, subida en fragmentos y recuperada con SHA256 coincidente; nueva voz, captions y duración integrados en una solicitud de prueba separada. La prueba no equivale a afirmar generación visual nueva ni exportación final del anuncio completo.

## Vista móvil y notas de voz (1.7.0)

El usuario pidió priorizar los cambios con IA desde el teléfono. Dentro del proyecto abierto, hasta 900 px, mostrar esa sección con el teclado cerrado, conservar el campo de indicaciones al navegar y ofrecer «Ver anuncio» y «Herramientas». Escenas, inspector, timeline y los demás paneles se despliegan sólo al pedirlos; al cerrar volver a los comentarios. No eliminar las opciones manuales ni obligar a recorrerlas para dar instrucciones. Usar textos legibles, campos de 16 px, objetivos táctiles y área segura de pantalla.

«Hablar» solicita permiso al micrófono y captura un audio real. Ofrecer contador, fin, revisión con reproductor, cancelación, borrado y adjuntar audio. Máximo tres minutos por grabación, cinco notas por solicitud y 10 MB por nota. Detener los tracks del micrófono al terminar/cancelar y conservar la grabación al pasar a segundo plano cuando sea posible. Explicar permisos denegados y permitir el dictado del teclado o un adjunto; nunca inventar un texto para sustituir una grabación fallida.

SpeechRecognition/webkitSpeechRecognition puede producir un dictado en español, pero su disponibilidad y precisión dependen del navegador. Mantener audio y texto editable separados. Si no hay dictado en vivo, enviar la nota para que ChatGPT la escuche; no afirmar que se transcribió. El texto corregido explícitamente por el usuario tiene prioridad sobre un dictado parcial. Las notas son borradores locales hasta guardarlas con el proyecto o enviar una solicitud. El guardado explícito puede conservarlas en el proyecto privado; al pedir los cambios se adjuntan a la solicitud del Site, sin incorporarlas a assets/audioTracks del anuncio ni subirlas al repositorio público.

La solicitud incluye voiceNotes con IDs, metadatos y URLs privadas. Leerla y escuchar cada audio antes de editar. legacy_get_ai_request adjunta las notas pequeñas; legacy_get_voice_note permite recuperarlas de forma individual. Las conexiones con un catálogo anterior conservan la lectura de audio mediante la herramienta existente o el helper privado; el helper también descarga los archivos en voice-notes/. Si la sesión no admite audio como entrada, descargar las notas con el helper privado y usar su comando transcribe con Whisper.cpp local en CPU y modelo cuantizado base-q5_1 (paquete pywhispercpp y FFmpeg). El modelo se descarga una vez; el audio no se envía a una API de transcripción. Revisar cifras, nombres y fragmentos inciertos. Si tampoco hay ejecución local para transcribir, registrar needs_input y la limitación concreta. No tratar una nota como nueva narración del video. Al abrir otro dispositivo, incorporar únicamente la última solicitud completada; los borradores manuales locales no se consideran sincronizados.

QA: comprobar navegación, preservación de texto y blobs, límites, denegación de permiso, cancelación durante permiso pendiente, deduplicación de dictado y envío de audio sin contaminar la mezcla. Los adaptadores de Node no prueban hardware, Safari/Chrome reales, permisos del sistema ni exportación multimedia; registrar esas pruebas como pendientes hasta ejecutarlas.

Respaldo verificado: una nota MP3 privada de prueba se recuperó con SHA256 intacto y se transcribió localmente con el modelo base-q5_1; el texto coincidió con la locución de prueba. La conexión nativa de esta sesión omite los bloques audio por no admitir esa entrada, por lo que no se declara escucha directa. Este resultado no prueba aún el micrófono físico de un teléfono.

## Inicio, proyectos guardados y fuentes (1.8.0)

La petición añade una biblioteca de videos independiente del editor abierto. Inicio debe mostrar tarjetas con nombre, miniatura si existe, duración, fecha y estado de guardado; permitir buscar y abrir un proyecto; ofrecer subir video, importar un JSON editable y vincular fuentes de Drive/GitHub. Conservar un acceso visible a Inicio y Guardar tanto en escritorio como en móvil. Al abrir un proyecto, mantener el flujo de comentarios y cambios con IA; escenas, timeline e inspector permanecen bajo demanda en el celular.

Un proyecto tiene ID propio y conserva medios, escenas, capas, pistas, subtítulos, comentarios, fuentes y borradores de instrucciones. Subir otro video o importar un editable crea un proyecto independiente. No reciclar el ID de Doctor, sus solicitudes ni su configuración de marca por conveniencia. Los archivos nuevos deben tener referencias durables que no sobrescriban los bytes usados por otro proyecto o una versión anterior. El JSON portable debe incluir los medios necesarios; al importarlo, evitar colisiones de blobs o IDs entre proyectos.

Guardar es una acción explícita: subir los medios pendientes y confirmar la escritura de la instantánea en R2 privado. Sólo después mostrar guardado en el espacio privado. Mantener un borrador local si la red, el tamaño o el almacenamiento impiden completar la copia. La revisión del servidor actúa como precondición; ante una revisión nueva de otro dispositivo, conservar los cambios como otra copia y explicar el resultado. Nunca leer la revisión más reciente para sobrescribirla sin comprobar el contenido que el usuario abrió.

Distinguir tres mecanismos: el borrador e historial locales de IndexedDB, la instantánea guardada del proyecto privado y el snapshot de una solicitud de IA. No llamar al historial local un historial de nube ni prometer que un borrador sin guardar aparece en otro teléfono. Al recuperar un resultado de IA, comprobar que sigue abierto su proyecto de origen para no aplicarlo a otro video. Los medios, comentarios y trabajos de un proyecto permanecen separados de los demás.

Al subir un MP4/MOV/WebM, conservar el video y su audio original como recursos del proyecto. Los textos, subtítulos, música o gráficos que ya estén incrustados no se convierten automáticamente en elementos independientes: explicarlo y usar un proyecto fuente cuando exista. Importar un JSON editable conserva su estructura y archivos disponibles. Un proyecto todavía sin medios puede guardarse como borrador explícito con una escena placeholder; no presentarlo como una edición terminada.

Vincular Drive o GitHub guarda el enlace y el nombre como procedencia. Abrir mi Drive/GitHub permite acceder a la cuenta o carpeta fuera del editor. En esta revisión no está disponible la herramienta de elegibilidad de conectores Sites, de modo que no se añade ni se afirma OAuth, exploración autenticada o sincronización de carpetas dentro del Site. Para importar con IA, preparar un proyecto independiente con la fuente y una indicación explícita; el usuario envía la solicitud desde Cambios con IA y su ChatGPT actual usa los conectores que tenga autorizados. Leer el enlace y el alcance antes de copiar archivos. Si no se puede acceder, informar la limitación y conservar el proyecto vinculado. No sustituir ese acceso por una copia del estado de conexión del agente ni publicar materiales privados en GitHub.

Los proyectos nuevos usan identidad, fuentes y datos comerciales propios. El ejemplo Doctor V6 no determina la marca, buyer persona o precios de los siguientes videos. Conservar los anuncios, editables e históricos previos; esta mejora del sistema no los vuelve a aprobar estéticamente.

QA de esta función: guardar y reabrir dos proyectos distintos, importar un editable sin colisiones, conservar audio y medios subidos, mantener comentarios/solicitudes en su proyecto y rechazar sobrescrituras con revisión antigua. Comprobar búsqueda, Inicio y apertura en la simulación DOM móvil y de escritorio. Registrar por separado las pruebas de backend/adaptadores, las escrituras y lecturas privadas reales, el despliegue y su captura nativa. Una simulación o captura de escritorio no prueba Safari/Chrome físicos, micrófono ni exportación real; mantener esos límites explícitos.
