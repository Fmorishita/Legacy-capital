# Legacy Video Studio

Editor privado por escenas y capas. El proyecto de ejemplo usa los materiales, el guion y los tiempos del Doctor V6 de Legacy Capital.

Abre Escenas para cambiar medios, ordenar/dividir tomas, encuadrar y ajustar transiciones. Capas permite editar textos, precios, logos, gráficas y su animación. Audio conserva voz, música y efectos como pistas independientes. Subtítulos permite editar texto, tiempos, estilo y SRT. Comentarios guarda notas asociadas a una escena y un momento. Referencias mide cortes y paleta de un fragmento y documenta las instrucciones de estilo para ChatGPT o Claude.

Los borradores manuales, medios subidos y versiones locales se guardan con IndexedDB en el navegador. Descarga el proyecto editable JSON, que incrusta los medios, para trasladarlo a otro dispositivo o enviarlo a una IA. No hay sincronización automática entre dispositivos ni generación automática de voz o imágenes. Un cambio de guion o duración indica que debe revisarse la locución y los subtítulos.

El motor Canvas reproduce una composición editable. El MP4 original sigue disponible como referencia; no se afirma que esta nueva composición sea idéntica al render HyperFrames. La exportación captura realmente Canvas y Web Audio a tiempo real, en MP4 cuando MediaRecorder lo admite o WebM como alternativa. Mantén la pestaña visible durante la exportación.

`npm run check` valida JavaScript, datos, medios, cambios del modelo, alcance de referencias y subtítulos. `tools/qa-dom.mjs` es una prueba de interacción DOM en Node con adaptadores sintéticos; no sustituye la revisión visual de navegador ni verifica MediaRecorder. La herramienta de navegador gestionado no estuvo disponible durante esta construcción.

Los recursos pertenecen a este proyecto. Las tipografías y pistas conservan sus fuentes y términos bajo `dist/assets/licenses`. El acceso privado del Site no concede derechos de redistribución pública sobre las pistas de stock.


## Cambios con IA usando ChatGPT

La sección principal «Cambios con IA» recibe instrucciones libres y comentarios pendientes, con alcance por escena, apertura o proyecto. «Aplicar cambios con ChatGPT» guarda una copia de origen y una solicitud privada en R2, y abre ChatGPT con la tarea. El usuario envía ese mensaje usando su cuenta existente: el Site no consume una API de IA ni continúa generando por sí solo cuando no hay un asistente ejecutando la solicitud.

El Site expone diez herramientas MCP para que el asistente lea el proyecto, vea las referencias, reclame el trabajo, publique progreso, suba recursos reales por fragmentos y entregue una versión completa. La app personal creada por Sites debe estar conectada en ChatGPT. La locución, imágenes y demás medios se generan mediante las herramientas que tenga disponibles ese ChatGPT; la falta de una herramienta debe aparecer como limitación real, sin fingir una generación.

Cuando el asistente devuelve el proyecto, el editor incorpora los resultados automáticamente al volver a su pestaña. Antes guarda una versión anterior. Si hubo cambios manuales durante la ejecución, abre el resultado como proyecto separado. Cambiar el guion exige una voz nueva y subtítulos completos antes de aceptar una solicitud como terminada. Los uploads se verifican por tamaño y SHA256; las solicitudes son idempotentes y su reclamación usa escritura condicional.

El servidor está diseñado para el Site privado de un único propietario. No cambies su audiencia a pública sin añadir aislamiento y autorización por usuario. `worker/index.mjs` es la fuente del backend; `tools/build-worker.py` genera el Worker y su catálogo de recursos. Los medios del proyecto se guardan en el bucket privado y no se incluyen como biblioteca de stock en GitHub.
