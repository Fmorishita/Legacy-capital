# Claude Studio — reglas

- Todo el trabajo de Claude vive en `claude-studio/` (y `estudio-video/`). **Nunca edites `ads-punta-pacifico/`**: es el trabajo de GPT. Para cambiar el comportamiento del editor, agrega un parche en `tools/armar.py` o un archivo en `editor/`.
- Para publicar: `python3 tools/armar.py --lista` y luego `Artifact` publish con `file_path: build/dist/claude-page.html`, `root: build/dist`, `url` del editor y los archivos listados.

## Datos del editor en Claude (artifact TvyAwhsn4M9Scyfbt6zsui)
Colecciones: `proyectos/<id>` ({project}), `versiones` ({projectId, label, project}), `archivos/<blobId>` ({partes: ids de assets de 19 MB, tipo}), `solicitudes` ({tipo: cambios|render, proyectoId, instrucciones, alcance, escena, tiempo, comentarios, estado, avance, respuesta, video}), `resultados/<solicitudId>` ({project}).

### Al recibir «aplica mis cambios del editor»
1. `ArtifactData query` en `solicitudes` con `estado == pendiente`. Pon `estado: trabajando` y escribe `avance` mientras trabajas.
2. Lee `proyectos/<proyectoId>` con `out_dir` (no por el contexto). Edita solo lo que piden las instrucciones y comentarios: `scenes[]`, `captions[]`, `overlays[]`, `audioTracks[]`. Medios nuevos: súbelos como asset (`Artifact` con `asset: true`) y agrégalos a `assets[]` con `url: "/_blob/<id>"`. Respeta los requisitos del Doctor V6 en `ads-punta-pacifico/CLAUDE.md` (solo lectura).
3. Guarda el proyecto completo en `resultados/<solicitudId>` y marca la solicitud `estado: lista` con una `respuesta` breve. El editor ofrece «Abrir versión nueva», guarda antes la anterior y, si hubo cambios manuales, la abre como proyecto separado.
4. `tipo: render`: guarda el proyecto en un JSON de trabajo y ejecuta `node tools/render-claude.mjs <proyecto.json> <salida.mp4>` (arma antes con `armar.py`). Medios subidos (`/_blob/…`): bájalos con `Artifact read` y pon su ruta local en `url`. Sube el MP4 en partes de ≤ 14 MB (`estudio-video/herramientas/bajar.py partir`) y escribe `video: {partes, nombre, detalle}` y `estado: lista`.

### Render exacto
Mismo `StudioEngine` del editor, así que el MP4 es idéntico a la vista previa (verificado: 41 dB PSNR, solo compresión). Audio del mismo mezclador en un `OfflineAudioContext`, a −14 LUFS y −1 dBTP (`--lufs no` lo desactiva). Caché por escena en `<salida>.segmentos/`: un cambio de subtítulo re-renderizó 3 de 28 tramos en 17 s; el render completo tarda unos 2 min.
