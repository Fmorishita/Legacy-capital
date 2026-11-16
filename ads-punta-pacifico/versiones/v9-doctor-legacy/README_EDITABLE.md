# Doctor V9 · Legacy Capital · editable final

Esta revisión usa clips ya completados de Higgsfield y metraje aportado por el cliente. **La creación de nuevos videos está desactivada por indicación del usuario.** No hace falta ejecutar Seedance ni configurar una clave para editar o renderizar. V8c, la previa V9 y las versiones anteriores se conservan.

La entrega es vertical 720×1280, 30 fps y 60.7 segundos. La composición editable mide 1080×1920; el máster se reduce a 720p. Los clips fuente se conservan con sus dimensiones reales, incluido un archivo de 720×1278, sin deformar su proporción.

## Archivos y capas

- `project/`: HTML por escena, gráficos vectoriales, subtítulos por palabra, tipografías, escudo oficial PNG transparente, videos originales seleccionados, dos fotos y mezcla integrada. Los clips de fondo están silenciados.
- `audio/`: voz limpia Charon, música, seis efectos usados, stems, master y receta. **No reproducir master y stems juntos.** La suma de stems requiere el procesamiento descrito en `doctor_v9_audio.json`.
- `Guion_Doctor_V9.txt`, `Doctor_V9.srt`, `words_v9.json`: texto hablado y sincronía. `timeline.json` conserva escenas, titulares, captions, transiciones, fuentes e intervalos de origen. `MAPA_EDICION.csv` permite consultar las tomas en una hoja de cálculo.
- `shot_review.json`: archivo, hash, procedencia y punto de entrada de cada selección. Son 17 videos de Higgsfield únicos: 15 de los assets MCP y dos ya completados por API antes de la orden de detener generaciones. Se añaden cuatro recortes del material aportado y dos cortes nativos sobre fotos, de 0.58 y 0.56 segundos.
- `source_assets/`: render residencial original, video original del celular y referencias conservadas para futuras ediciones. `REFERENCIAS.md` distingue las referencias históricas de los fondos activos.
- `source_register.json`, `generation_policy.json`: procedencia y prohibición actual de nuevas generaciones. El plan histórico de generación no es una autorización para ejecutarlo.
- `engine/`, `build_v9.py`: montaje portable sin llamadas pagadas. `qa/`, `licenses/` y `MANIFEST.json`: comprobaciones, capturas, licencias y hashes.

El ZIP completo contiene archivos reales; no depende de enlaces simbólicos o rutas del equipo original. El ZIP de código ligero **no incluye medios**. Si la entrega se divide en partes, extraerlas todas en la misma carpeta y conservar la estructura `Doctor_V9_Editable_Final/`.

## Cambiar y renderizar

Requisitos: Node 22+, FFmpeg/FFprobe y Python 3.10+. Desde `project/`, ejecutar `npm install`, `npm run dev` y editar los HTML conservando IDs y tiempos deterministas. Usar `npm run check` antes de exportar.

Para reconstruir desde la configuración: instalar `python3 -m pip install -r requirements-editing.txt` y ejecutar `python3 build_v9.py --final` desde la raíz. Las decisiones semánticas están en la lista `plan` del builder y en `shot_review.json`. **Reconstruir vuelve a escribir los HTML:** guardar primero cualquier edición manual. No cambiar un hash sin revisar realmente la nueva toma.

`npm run render` crea el máster de composición en `exports/`. Para 720p:

```bash
ffmpeg -i ../exports/Doctor_V9_MASTER_1080.mp4 -vf scale=720:1280:flags=lanczos -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a copy -movflags +faststart ../exports/Doctor_V9_FINAL_720p.mp4
```

Cambiar `data-media-start` permite elegir otro intervalo de un video. Mantener duración suficiente, movimiento observable y ausencia de fotogramas repetidos. Para cambiar un titular, modificar su HTML o `headline` en el builder. Captions y SRT son independientes del titular. Música y SFX se editan mediante la receta de audio y después se reconstruye el master.

Si cambia el guion, generar una nueva locución continua y realinear palabras, cortes, captions y SFX. Cambiar sólo texto no modifica la voz. Las herramientas de montaje de este kit no generan voz ni consumen APIs por sí solas.

## Decisiones de esta versión

- La frase de inversión, 4.42–6.82 s, muestra a la pareja celebrando junto al portátil. Se retiró el recorrido de la persona que se levantaba.
- Logo oficial pequeño, sin fondo y centrado abajo. Legacy Capital es la única marca visible.
- Titulares complementarios; precio, porcentajes y CTA mantienen su función. Apertura: $3.9–$4.9 MDP, 2 y 3 recámaras.
- Retirados la animación y el texto de rendimiento esperado 18.33%. El gráfico de apreciación que permanece es un ejemplo estimado a cinco años, separado de los flujos de renta.
- Condiciones de la narración elegida: 10% enganche, otro 10% total en 20 mensualidades, 80% contra entrega a mediados de 2028. No reemplazarlas por condiciones históricas de V5 o por la fecha de una gráfica anterior.
- Se conserva la nueva locución continua Gemini/Charon del montaje V9. Se solicitó dirección masculina profesional mexicana del norte; no se declara escucha humana ni certificación del acento por el solo prompt.
- Música a 125 BPM y efectos sincronizados con entradas visibles. La voz no se aceleró ni cambió de tono.
- Dos imágenes de cuartos y baños conservan movimiento de cámara nativo. No se presentan como videos generados por Higgsfield. Ninguna foto activa se repite.

## Para Claude u otra IA

> Trabaja en una copia nueva de Doctor V9 de Legacy Capital. Lee README, timeline, shot_review, guion, licencias y composiciones. Aplica mis cambios conservando los originales. No generes nuevos videos ni consumas APIs: generation_policy.json los desactiva. Usa los archivos locales, conserva su procedencia y no repitas fondos fotográficos ni intervalos de origen. Mantén sincronía de voz y captions; si cambia el guion, produce y realinea una locución completa. Revisa el MP4 codificado antes de declarar terminado.

Las copias de música y efectos se entregan para la reedición del anuncio del cliente con sus licencias; no constituyen una biblioteca de stock con derechos ampliados para terceros. La revisión técnica no equivale a una aprobación estética nueva del usuario.
