# Cómo editar estos anuncios

El usuario quiere modificar libremente el estilo de edición: composición, textos, transiciones, ritmo visual, imágenes, música, SFX y motion graphics. Trabaja sobre la versión elegida, conserva un original y entrega una revisión nueva. No confundas Doctor V6 Legacy Capital con V6 Higgsfield, que fue rechazado y no forma parte de esta carpeta.

## Elegir la fuente

- `versiones/v5/02_Doctor`, `03_Empresario`, `04_California`: anuncios históricos V5, con su marca y condiciones de entonces.
- `versiones/v6-doctor-legacy`: Doctor actual de 64.041667 s, 1080×1920, 24 fps, 28 tomas, 59 grupos de subtítulos y 172 palabras. **Única marca visible y mencionada: Legacy Capital.** El precio y las condiciones del guion V6 prevalecen sobre los datos V5.
- `editor/dist/doctor-v6.json`: proyecto Canvas editable del mismo anuncio para el editor visual. Incluye escenas, capas, assets, captions, words, audioTracks y overlays. Su composición está reconstruida para el editor; el MP4 HyperFrames original es la referencia audiovisual.

## Preparar y editar

Ejecuta `scripts/preparar.py --perfil …` desde esta carpeta o con su ruta completa. Usa `catalogo_medios.json` para localizar los recursos físicos y sus fuentes. Los medios binarios derivados aparecen en las rutas que esperan las composiciones. No publiques en Git los archivos de stock descargados ni los WAV/PNG reconstruidos: ya están en `.gitignore`.

El kit V6 tiene `02_Guion_y_subtitulos`, `03_Imagenes_en_orden`, `04_Audio`, `05_Estructura_y_timeline`, `06_Proyecto_HyperFrames`, `08_Fuentes_y_generacion`. La receta de mezcla se puede volver a ejecutar con:

```bash
python3 versiones/v6-doctor-legacy/04_Audio/build_audio.py --timeline versiones/v6-doctor-legacy/05_Estructura_y_timeline/timeline_V6.json
```

Esto genera stems y una mezcla nueva, no voz nueva. Para V5, `versiones/v5/00_Guia_IA/scripts/reconstruir_audio.py --perfil doctor` reconstruye música, SFX y mezcla a partir de fuentes y voz alineada. Sus dependencias son numpy/scipy y FFmpeg. Lee los avisos de cuantización y versiones de FFmpeg antes de afirmar identidad con el máster.

## Briefs y comentarios del editor

Si el usuario adjunta un JSON exportado de Legacy Studio, valida su envelope `format: legacy-video-studio`, usa `project` como estado actual y extrae `embeddedDataUrl` de assets/referencias. Los comentarios contienen `sceneId`, `time`, `text`, `resolved`; las referencias contienen intervalo, alcance, elementos que quiere tomar y notas. El Markdown exportado explica los cambios pendientes. Un comentario es feedback del usuario, no un texto que deba aparecer dentro del anuncio.

Replica los elementos concretos que el usuario indique de su video de referencia. El análisis del editor sólo estima cortes, duración de tomas y paleta; no identifica por sí solo efectos de sonido, animaciones ni significado de imágenes. No llames a un preset genérico «réplica exacta». No cambies voz, arquitectura o datos comerciales por imitar una referencia.

## Requisitos actuales del Doctor V6

Abrir con médico reconocible por uniforme y estetoscopio, y vista al mar desde la primera frase. Oferta del guion: casas de 2 y 3 recámaras, desde 3.9 hasta 4.9 MDP MXN; 10% enganche, otro 10% **total** distribuido en 20 mensualidades y 80% contra entrega a mediados de 2028. No trasladar 19 mensualidades, 8% anual o diciembre 2028 de referencias históricas. La marca visible es Legacy Capital, paleta marino/dorado/crema.

En los roofs debe verse **un tragaluz**. Mantener arquitectura, geometría y materiales del desarrollo. Revisar rostros, manos, red, pelota, palas y mirada hacia la acción en pickleball; las pantallas miran a sus usuarios. Cada imagen debe corresponder a la frase. Precio sólo en apertura, sin panel fijo de presentación. Mantener subtítulos completos y legibles, no sobre caras. El usuario puede pedir otro estilo; estas condiciones del proyecto siguen vigentes salvo que las cambie expresamente.

Cambiar texto no cambia una grabación de voz existente. Si reescribes guion, genera o solicita una locución nueva dentro del encargo autorizado y vuelve a alinear palabras/subtítulos. Si cambias el orden o la duración, comprueba la correspondencia semántica entre voz y toma. No aceleres una locución para forzar una plantilla.

Guarda outputs en una carpeta nueva y verifica reproducción, audio, cortes y fotogramas del MP4 final. Para exportar la composición original usa la versión instalada o fijada de HyperFrames indicada por sus fuentes (0.9.18); para Canvas, MP4 depende de MediaRecorder y WebM es la alternativa. Conserva licencias y no prometas aprobación estética que el usuario no haya dado.


## Ejecutar solicitudes de «Cambios con IA»

La app personal Legacy Video Studio está conectada a ChatGPT. Usa las herramientas MCP disponibles: `legacy_get_ai_request`, `legacy_claim_ai_request`, `legacy_get_project`, `legacy_get_scene_image`, `legacy_update_ai_request`, las tres herramientas de subida y `legacy_submit_ai_result`. Recibe el ID de solicitud del mensaje del usuario. No edites un proyecto distinto ni publiques sus comentarios o snapshots privados en GitHub.

Ejecuta los comentarios, no entregues sólo un plan. Una foto solicitada debe generarse y asignarse al `mediaId` de la escena; si cambia la narración, genera una locución continua real, mide palabras y duración, realinea las escenas y los subtítulos y recorta/reubica música/SFX. Sube los recursos reales antes de devolver la versión completa. No marques completed una operación que no hiciste. Si falta un modelo o cuota, informa con needs_input y conserva el trabajo. Este modo usa las herramientas de la cuenta actual de ChatGPT; no contrates una API ni gastes créditos de otro proveedor sin autorización específica.

El helper `editor/tools/chatgpt-edit-bridge.py` permite producir voz con Edge TTS gratuito, leer solicitudes y subir archivos. Las herramientas MCP reciben los recursos por fragmentos base64. Si el ejecutor necesita acceso de servicio, obtén el acceso ya existente del mismo Site mediante Sites y pásalo sólo por memoria/stdin al helper; no lo muestres, guardes ni envíes a otros dominios. El helper llama a las rutas privadas del editor; el endpoint MCP reservado se utiliza mediante la conexión autenticada de ChatGPT.

La devolución se incorpora sola cuando el usuario vuelve a la pestaña del editor. Conserva la versión previa y registra qué comentarios se resolvieron; los cambios manuales concurrentes deben quedar guardados y la versión de IA se abre separada.


## Legacy Studio en Claude (editor + nube + render exacto)

El mismo editor de `editor/dist` corre como artifact privado de Claude: https://claude.ai/artifact/TvyAwhsn4M9Scyfbt6zsui
Dentro de Claude, `claude-cloud.js` reemplaza el guardado del navegador por la base de datos del artifact (mismo proyecto en teléfono y computadora) y el panel de IA por «Cambios con Claude». Fuera de Claude el editor funciona igual que antes (IndexedDB y ChatGPT).

Colecciones: `proyectos/<id>` ({project}), `versiones` ({projectId, label, project}), `archivos/<blobId>` ({partes: ids de assets de 19 MB, tipo}), `solicitudes` ({tipo: cambios|render, proyectoId, instrucciones, alcance, escena, tiempo, comentarios, estado, avance, respuesta, video}), `resultados/<solicitudId>` ({project}).

### Al recibir «aplica mis cambios del editor»
1. `ArtifactData query` en `solicitudes` con `estado == pendiente`. Pon `estado: trabajando` y escribe `avance` mientras trabajas.
2. Lee `proyectos/<proyectoId>` con `out_dir` (no por el contexto). Edita solo los campos que piden las instrucciones y comentarios: `scenes[]`, `captions[]`, `overlays[]`, `audioTracks[]`. Medios nuevos: súbelos como asset (`Artifact` con `asset: true`) y agrégalos a `assets[]` con `url: "/_blob/<id>"`.
3. Guarda el proyecto completo en `resultados/<solicitudId>` y marca la solicitud `estado: lista` con `respuesta` breve. El editor ofrece «Abrir versión nueva», guarda antes la anterior y, si hubo cambios manuales, la abre como proyecto separado.
4. `tipo: render`: guarda el proyecto en `editor/_trabajo/<id>.json` y ejecuta `node editor/tools/render-claude.mjs <proyecto.json> <salida.mp4>`. Antes, `scripts/preparar.py --perfil editor` para que existan música y SFX. Para medios subidos (`/_blob/…`), descárgalos con `Artifact read` y ajusta su `url` a la ruta local. Sube el MP4 en partes de ≤ 14 MB (`estudio-video/herramientas/bajar.py partir`) y escribe `video: {partes, nombre, detalle}` y `estado: lista`.

### Render exacto (`editor/tools/render-claude.mjs`)
Dibuja cada cuadro con el mismo `StudioEngine` del editor (`dist/render.html`), así que el MP4 es idéntico a la vista previa (verificado: 41 dB PSNR frente al canvas del editor, diferencia solo de compresión). El audio sale del mismo mezclador del editor en un `OfflineAudioContext` y se normaliza a −14 LUFS y −1 dBTP (`--lufs no` lo desactiva). Corta por escenas y guarda cada tramo por huella en `<salida>.segmentos/`: un cambio de subtítulo re-renderizó 3 de 28 tramos en 17 s; el render completo tarda unos 2 min.
