# Guía de edición · Doctor V6 Legacy Capital

El MP4 de referencia y el HTML final describen la edición entregada. Los 28 fondos se usan una sola vez; cada toma dura menos de cuatro segundos contando solapamiento. La duración es64.0416667s:1537frames,24fps,1080×1920. No recortar la locución para cumplir una plantilla de45s.

## Qué abrir

- `../07_Video_referencia/Doctor_Legacy_Capital_V6.mp4`: referencia audiovisual final.
- `../02_Guion_y_subtitulos/Guion_cliente_original.md`: solicitud original, sin editar.
- `../02_Guion_y_subtitulos/Guion_locucion_V6.md`: texto pulido realmente narrado y ajustes de redacción.
- `../05_Estructura_y_timeline/timeline_V6.json` y `storyboard_V6.csv`: orden, tiempos, imágenes, movimiento, texto real del HTML y cues sonoros.
- `../02_Guion_y_subtitulos/subtitulos_finales_V6.srt`: grupos finales de captions; `subtitulos_animados_V6.json` conserva palabras, posiciones y estilos. Un SRT no conserva animaciones ni color de cada palabra.
- `../06_Proyecto_HyperFrames/index.html` y `compositions/`: composición exacta. Las cámaras, máscaras, transiciones, cifras, barras de pago, toggles smart home, pin de ubicación y texto cinético son HTML/CSS/GSAP; no hay modelos3D ni archivos Lottie que falten.
- `../04_Audio/`: voz, mezcla, stems, originales utilizados, receta y verificaciones. Sólo una música y seis efectos forman esta pieza.
- `../01_Marca_y_tipografias/`: originales Legacy, fuentes, GSAP y licencias.

## Condiciones específicas de esta edición

La única marca visible es **Legacy Capital**. Apertura con Doctor y vista al mar; casas de2 y3recámaras, deun nivel, con roof privado. Rango de**$3.9 a$4.9MDP**, visible en apertura0–4s y al explicar el rango, según el HTML. Pagos flexibles:10%enganche,10%total distribuido en**20mensualidades** y80%contra entrega, **a mediados de2028**. Apartando este mes, equipamiento incluido en cocina, recámaras, baños y roof, con ahorro de**hasta$450,000MXN**. Los datos proceden del guion nuevo del cliente; no sustituirlos por las condiciones V5 ni por la gráfica antigua de diciembre2028.

La voz dice «Explora su potencial de plusvalía y de ingresos por rentas de estancia corta». No convertir ese potencial en una rentabilidad asegurada ni reintroducir el antiguo8%anual. «Casa de un nivel» describe el área habitable; no afirmar que el roof no requiere escalera.

Mantener arquitectura y amenidades del proyecto, un solo tragaluz por roof, vestuario adecuado y pantallas físicamente orientadas a sus usuarios. Conservar variedad de fondos y relación entre imagen y locución: alberca, pickleball, asadores, convivencia, pagos, smart home y equipamiento deben verse cuando se mencionan. Logo y cierre centrados. Paleta navy#1A2B4C, gold#C5A564 y cream#F5F0E6; no verde claro.

## Reloj y audio

`doctor_v6_voice.wav` se coloca en tiempo0. La primera palabra empieza a0.12s; el offset ya está aplicado. No sumarlo otra vez ni cambiar la velocidad. `doctor_v6_raw.mp3` y `doctor_v6_voice_raw.json` son la síntesis original y sus límites anteriores a la alineación.

Usar `doctor_v6_mix.wav` **o** los stems `doctor_v6_voice.wav`, `doctor_v6_music_edit.wav` y `doctor_v6_effects.wav`; no reproducir mezcla y stems juntos. Los stems son previos al mastering: su suma directa no equivale al master normalizado. `doctor_v6_audio.json` registra el filtro, ganancias, ducking, recortes, eventos y hashes. La mezcla WAV entregada es la referencia exacta. El SRT inicial dentro de Audio sólo sirve como antecedente; los captions finales están en02yHTML.

Para reconstruir audio, con Python, NumPy, SciPy y FFmpeg instalados, ejecutar `python 04_Audio/build_audio.py --timeline 05_Estructura_y_timeline/timeline_audio_V6.json`. Este paso puede sobrescribir los WAV de trabajo; hacer una copia antes. No sintetiza voz nueva ni consulta servicios de pago. La receta portable conserva la misma música, seis SFX y reloj final.

## Proyecto y restauración

`python 00_Guia_IA/scripts/preparar_proyecto.py --dry-run` valida el plan y los medios. Sin `--dry-run`, extrae el ZIP de código y copia los medios clasificados a sus rutas de runtime verificando SHA-256. No pisa ediciones distintas sin `--refresh`. No requiere la carpeta de trabajo original. `restauracion_proyecto.json` especifica cada ruta y hash.

El proyecto usa HyperFrames0.9.18 y GSAP local. Desde06se puede instalar esa versión con el gestor Node habitual para preview/check/render. La descarga del paquete Node requiere conexión; todos los medios y código creativo del anuncio están incluidos. `index.html` necesita el runtime de HyperFrames para reproducir los tiempos/composiciones; abrirlo como HTML estático no reproduce el anuncio completo. Verifica composición, captions y fotogramas de cortes antes de exportar un cambio.

El autor original se conserva como evidencia en05/Autor_original. Tiene rutas de producción de su entorno; usa el restaurador para recuperar exactamente la entrega, o edita directamente los HTML/JSON portables. El registro de fuentes y el manifiesto indican bytes y procedencia, sin ampliar derechos de los recursos.

Las máscaras de entrada de los captions están acopladas a la foto correspondiente. Conserva ese vínculo durante las transiciones para evitar texto sobre la toma que sale. Los prompts y referencias auxiliares están en08_Fuentes_y_generacion. El código original de síntesis de voz queda documentado enAutor_original; la voz entregada ya está alineada y no necesita regeneración. Para reconstruir audio con los mismos medios: `python 04_Audio/build_audio.py --timeline 05_Estructura_y_timeline/timeline_audio_V6.json` (requiereFFmpeg,NumPy ySciPy).
