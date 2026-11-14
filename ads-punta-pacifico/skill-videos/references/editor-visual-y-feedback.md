# Editor visual y feedback por escena

## Petición y alcance

El 14/11/2026 el usuario pidió un sistema donde modificar cualquier elemento de los anuncios: guion, música, SFX, imágenes o clips, transiciones, subtítulos y motion graphics; añadir comentarios en escenas concretas y subir videos de referencia para indicar un estilo de edición o un elemento que se quiere replicar. Doctor `V6-Legacy-Capital-Doctor` es el proyecto de ejemplo. Esta petición no sustituye el histórico V5 ni convierte en aceptada la prueba `V6-Higgsfield` rechazada.

El editor se construye en `/workspace/sites/legacy-video-studio`. Su publicación debe verificarse con las herramientas nativas antes de afirmar que está disponible en una URL; un enlace esperado o un sitio registrado no prueban despliegue. Guardar ID, URL observada, versión, estado y verificaciones en el registro de entrega fuera del paquete. En esta revisión de la skill, la publicación está pendiente de comprobación final.

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

El guardado del editor es local al navegador mediante IndexedDB, con versiones explícitas además del borrador. No equivale a una copia en Drive, sincronización entre dispositivos ni acceso automático del agente a cambios privados del navegador. Comprobar errores de cuota y de persistencia y evitar afirmar guardado si la operación falló.

Para compartir un cambio con ChatGPT, Claude u otro editor, exportar el JSON portable con todos sus medios y el brief de edición: configuración, IDs, escenas, capas, pistas, captions, comentarios y referencias. Los recursos subidos deben viajar como bytes o entradas portables; las URLs `blob:` sólo funcionan en la sesión y no son una entrega durable. Conservar nombres, fuentes, licencias y hashes cuando estén disponibles. Un JSON de configuración sin sus recursos se identifica como tal, sin llamarlo paquete completo.

Al continuar, importar y validar el paquete más reciente; no asumir que el proyecto de ejemplo sigue siendo el actual. El brief registra cambios pendientes, referencias e indicaciones de voz, sin presentarlos como ya aplicados. La subida a Drive se realiza mediante el flujo autorizado y su readback, no mediante una promesa de sincronización automática.

## Exportación y QA

Consultar soporte real de `MediaRecorder` y del codec: exportar MP4 cuando esté disponible; ofrecer WebM como alternativa compatible. No cambiar la extensión de un WebM para llamarlo MP4. La grabación del canvas y la mezcla del navegador ocurre en tiempo real: mantener la pestaña visible y evitar interrumpirla hasta terminar. Mostrar progreso, errores y formato de salida reales.

Verificar una exportación corta con video y audio y los controles que afectan el montaje; para una entrega final, revisar el archivo completo como exige la skill. Comprobar dimensiones, duración, reproducción, legibilidad, sincronía y ausencia de handles/guías del editor. Una vista previa correcta no prueba por sí sola que el archivo descargado quedó bien.

Guardar y reportar el alcance de pruebas realizado. No presentar un control de interfaz, un brief exportado o un preset propuesto como una generación de medios, una edición ya renderizada o una aprobación estética del usuario.
