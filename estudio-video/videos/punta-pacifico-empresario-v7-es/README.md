# Empresario V7 (Punta Pacífico)

- `python3 build.py` genera `index.html` a partir de `voz.words.json` (tiempos por palabra de la voz) y `guion-voz.txt`.
- Render: `npx --yes hyperframes@0.8.139 render --quality draft --fps 30 --output renders/empresario-v7-borrador-raw.mp4`, luego `python3 master.py <raw> <final>` (−14 LUFS).
- Música: Mixkit 617 «Wind Leaves» (Eugenio Mininni), recortada desde 47.5 s (128 BPM, primer pulso en 0.308 s).
- Voz: edge-tts, es-MX-JorgeNeural, +6 %, −4 Hz.
- Detalles y trazabilidad: `../../proyectos/punta-pacifico/guiones/empresario-v7-es.md`.
