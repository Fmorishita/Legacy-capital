# Empresario V9 (Punta Pacífico)

V8 con los cambios de Fran del 21 nov 2026. Detalle, tomas, trazabilidad y checklist: `../../proyectos/punta-pacifico/guiones/empresario-v9-es.md`.

Flujo:
1. Voz: `audio/voz-fran.wav` = audio de Fran («Generated Audio November 21 2026 1:18 PM») con pausas de 0.22–0.25 s entre «clósets… minisplits… baños… y rooftop…» (cortes en el silencio entre palabras; no se cambia la velocidad).
   - Tiempos por palabra: `~/.venvs/enh/bin/python -I alinear.py audio/voz-fran.wav voz.words.json` (alineación forzada torchaudio MMS_FA contra `guion-voz.txt`).
2. `python build.py` → `index.html`, `layout.json` y `audio/eventos.json` (titulares y subtítulos solo donde no tapan caras ni objetos protegidos; requiere Pillow).
3. `python mezcla.py` → `assets/mezcla.wav` y pistas separadas en `audio/`.
   - Música «Dreaming Big» (Mixkit 31): el clímax entra en «Reserva este mes»; en el corte al CTA salta al golpe final y el piano del final queda bajo el cierre.
4. `node qa_textos.cjs` → en Chromium, ningún texto sobre caras u objetos (debe dar 0).
5. Render: `npx hyperframes render --quality draft --fps 30 -o renders/empresario-v9-render.mp4`, después `python master.py <render> renders/empresario-v9-borrador.mp4` (−14 LUFS).

Fotos (`assets/img/`, ignoradas por git): «Escenas de IA» recortadas a 1080×1920 (incluida la nueva del dinero en la mesa, `o-dinero`), renders del desarrollador para el equipamiento (clósets v23, minisplit v20, baño = render retocado de Doctor V13, roofeq) y `mapa.png`.
Caras: OpenCV YuNet (`faces.json`); objetos marcados a mano (`protect.json`).
