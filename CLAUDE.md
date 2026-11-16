# Legacy Capital — reglas para Claude en este repositorio

## Videos y anuncios → siempre en Legacy Studio

Legacy Studio (editor privado de Fran): https://claude.ai/artifact/TvyAwhsn4M9Scyfbt6zsui

1. **Todo video nuevo o versión nueva se entrega como proyecto de Legacy Studio**, no solo como MP4. Así Fran lo edita (cortes, encuadre, textos, subtítulos, transiciones, sonidos) y los cambios no obligan a rehacer el video desde cero.
   - Arma el proyecto en el formato del editor (`scenes`, `captions`, `overlays`, `audioTracks`, `assets`; ver `ads-punta-pacifico/editor/dist/doctor-v6.json` como ejemplo y `claude-studio/trabajo/doctor-v7.py` como generador).
   - Sube los medios nuevos al artifact (`Artifact` publish con `url` del editor y `asset: true`; audio en `.mp4` AAC porque `.mp3` no se acepta) y usa `url: "/_blob/<id>"` en `assets[]`.
   - Guarda el proyecto con `ArtifactData set` en `proyectos/<id>` con el cuerpo `{id, title, version, updatedAt, project}`. Usa un `id` nuevo por versión (p. ej. `doctor-v8-legacy`) para no pisar la anterior.
   - Renderiza con `node claude-studio/tools/render-claude.mjs` y entrega el MP4 en el chat (`SendUserFile`) y en la base: una solicitud `tipo: render`, `estado: lista`, con `video.partes`.
2. **«Aplica mis cambios del editor»** (en cualquier chat): sigue `claude-studio/CLAUDE.md`. Lee `solicitudes` pendientes, edita solo lo pedido sobre el proyecto existente, guarda el resultado y avisa.
3. **Imágenes nuevas**: Claude no usa la suscripción de ChatGPT de Fran: no hay forma oficial de conectarla y automatizar chatgpt.com rompe sus términos. Entrega el prompt listo (el editor tiene «Prompt para imagen nueva» en cada toma) para que Fran lo pegue en ChatGPT y suba el resultado. Generar con Higgsfield desde aquí gasta créditos: solo con OK explícito y cotización previa.
4. **Nunca edites `ads-punta-pacifico/`** (trabajo de GPT). Todo lo de Claude va en `claude-studio/` y `estudio-video/`.
5. El repositorio es público: medios privados, renders y voces no se suben a Git (`claude-studio/build/`, `claude-studio/entregas/`).
