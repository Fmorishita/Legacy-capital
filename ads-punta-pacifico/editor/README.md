# Legacy Video Studio

Editor privado por escenas y capas. El proyecto de ejemplo usa los materiales, el guion y los tiempos del Doctor V6 de Legacy Capital.

Abre Escenas para cambiar medios, ordenar/dividir tomas, encuadrar y ajustar transiciones. Capas permite editar textos, precios, logos, gráficas y su animación. Audio conserva voz, música y efectos como pistas independientes. Subtítulos permite editar texto, tiempos, estilo y SRT. Comentarios guarda notas asociadas a una escena y un momento. Referencias mide cortes y paleta de un fragmento y documenta las instrucciones de estilo para ChatGPT o Claude.

Los proyectos, medios subidos y versiones se guardan con IndexedDB en el navegador. Descarga el proyecto editable JSON, que incrusta los medios, para trasladarlo a otro dispositivo o enviarlo a una IA. No hay sincronización automática entre dispositivos ni generación automática de voz o imágenes. Un cambio de guion o duración indica que debe revisarse la locución y los subtítulos.

El motor Canvas reproduce una composición editable. El MP4 original sigue disponible como referencia; no se afirma que esta nueva composición sea idéntica al render HyperFrames. La exportación captura realmente Canvas y Web Audio a tiempo real, en MP4 cuando MediaRecorder lo admite o WebM como alternativa. Mantén la pestaña visible durante la exportación.

`npm run check` valida JavaScript, datos, medios, cambios del modelo, alcance de referencias y subtítulos. `tools/qa-dom.mjs` es una prueba de interacción DOM en Node con adaptadores sintéticos; no sustituye la revisión visual de navegador ni verifica MediaRecorder. La herramienta de navegador gestionado no estuvo disponible durante esta construcción.

Los recursos pertenecen a este proyecto. Las tipografías y pistas conservan sus fuentes y términos bajo `dist/assets/licenses`. El acceso privado del Site no concede derechos de redistribución pública sobre las pistas de stock.
