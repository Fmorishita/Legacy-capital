# Claude Studio

Trabajo de **Claude**, separado del de GPT. La carpeta `ads-punta-pacifico/` (editor Legacy Studio de GPT) no se modifica desde aquí.

**Editor en Claude:** https://claude.ai/artifact/TvyAwhsn4M9Scyfbt6zsui (privado)

## Cómo funciona sin tocar el trabajo de GPT

`tools/armar.py` copia el editor de GPT (`ads-punta-pacifico/editor/dist`) a `build/dist` (fuera de Git), aplica sobre esa copia los cambios de Claude y agrega los archivos de `editor/`. Si GPT actualiza su editor, se vuelve a armar y los cambios de Claude se aplican encima; si un fragmento cambió, el script dice cuál.

```bash
python3 claude-studio/tools/armar.py                       # arma build/dist
node claude-studio/tools/render-claude.mjs <proyecto.json> <salida.mp4>   # render final exacto
```

| Archivo | Qué hace |
|---|---|
| `editor/claude-cloud.js` | Dentro de Claude: guardado en la nube (mismo proyecto en teléfono y computadora, archivos de cualquier tamaño) y panel «Cambios con Claude». |
| `editor/render.html` | Página sin interfaz que usa el mismo motor del editor para dibujar cuadros exactos. |
| `tools/armar.py` | Arma la versión de Claude desde el editor de GPT (parches en `app.js` y `exporter.js`, solo en la copia). |
| `tools/render-claude.mjs` | Render final cuadro por cuadro con el motor del editor, audio del mismo mezclador a −14 LUFS y caché por escena. |

Otra carpeta de Claude: `estudio-video/` (ficha por escena, Sala de Revisión, analizador de referencias).
