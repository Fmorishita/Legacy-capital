# Empresario V8 (Punta Pacífico)

Edición estilo California v9 / Doctor V13. Detalle, tomas, trazabilidad y checklist: `../../proyectos/punta-pacifico/guiones/empresario-v8-es.md`.

Flujo:
1. `python build.py`
   - Lee `voz.words.json`, `guion-voz.txt`, `faces.json` y `protect.json`.
   - Escribe `index.html`, `layout.json` y `audio/eventos.json`.
   - Coloca titulares y subtítulos donde no tapan caras ni objetos protegidos. Requiere Pillow para medir textos.
2. `python mezcla.py` → `assets/mezcla.wav` y las pistas separadas en `audio/`.
   - Voz procesada.
   - Música «Driving Ambition» (Mixkit 32) editada a compás.
   - Efectos colocados por su golpe.
   - Ducking bajo la voz.
3. `node qa_textos.cjs` → comprueba en Chromium que ningún texto tape caras u objetos (debe dar 0).
4. Render del borrador.
   - `npx --yes hyperframes@0.8.139 render --quality draft --fps 30 --output renders/empresario-v8-borrador-raw.mp4`
   - Después: `python master.py <raw> <final>` (−14 LUFS).

Fotos: `assets/img/` (ignoradas por git).
- 11 fotos IA de «Escenas de IA», recortadas a 1080×1920.
- 4 renders del desarrollador para el equipamiento: v23 clósets, v20 minisplit, v24 baño, roofeq.
- `mapa.png` de California.

Detección de caras con OpenCV YuNet (`face_detection_yunet_2023mar.onnx`).
