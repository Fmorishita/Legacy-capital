# Prompt para editar los anuncios V5

Copia el bloque siguiente a Claude Code u otra IA con acceso a los archivos. Sustituye únicamente los campos entre corchetes con tu cambio y tu carpeta de salida.

---

Quiero que edites los anuncios **V5 de Punta Pacífico** usando los componentes de esta carpeta. Elige el perfil **[Doctor / Empresario / California / los tres]** y aplica este cambio: **[describe aquí qué quieres modificar]**. Guarda el resultado como una versión nueva en **[carpeta de salida]**.

La base es V5. Excluye la prueba V6 de Higgsfield: no uses sus videos ni su montaje. Conserva el diseño del proyecto, sus personajes y las imágenes de esta carpeta; no generes otro inmueble ni inventes amenidades o vistas.

Si todavía no existe el proyecto local con todos sus medios, ejecuta `python 00_Guia_IA/scripts/preparar_proyectos.py` desde la raíz del kit. Es un ensamblaje local sin generación ni red y conserva archivos existentes distintos.

Primero lee `00_Guia_IA/GUIA_PARA_CLAUDE.md`, `00_Guia_IA/Manifest_Kit_V5.json` y los documentos del perfil seleccionado. Examina el MP4 V5 de referencia y los archivos `Estructura_y_timeline/timeline_V5.json` y `Estructura_y_timeline/storyboard_V5.csv`. El HTML final de `Proyecto_HyperFrames/` es la fuente detallada de textos visibles, posiciones, recortes, transiciones y curvas. No reconstruyas el diseño usando sólo `metadata.overlay` o una anotación de guion: pueden describir una propuesta anterior. Si alguna ruta o archivo falta, búscalo en la carpeta y el manifiesto antes de sustituirlo.

Puedes continuar el proyecto HTML/GSAP existente o reconstruirlo en el motor adecuado para este cambio. No es obligatorio usar HyperFrames, pero debes mantener la estructura visual y temporal que no te pido cambiar. Conserva rutas relativas y entrega un proyecto editable con medios locales, además del MP4 y un registro breve de cambios.

Respeta estas reglas:

1. Lienzo 1080 × 1920 vertical, 24 fps. Duraciones/fotogramas de referencia: Doctor 36.875 s / 885; Empresario 39.416667 s / 946; California 41.541667 s / 997. Mantén el reloj y número de fotogramas si el cambio no altera la duración.
2. Usa las imágenes del perfil seleccionado en su orden y contexto: 16 de Doctor, 17 de Empresario y 16 de California; son 49 en total entre los tres anuncios. No metas las 49 en un solo video. Cada fondo se utiliza una sola vez por serie; un espejo o recorte de la misma foto no cuenta como foto nueva. Ninguna imagen permanece más de 4 s, incluida la transición.
3. Para mantener el sonido V5, usa la mezcla final como única pista de audio. Para remezclar, usa la voz sola alineada más música y efectos separados y silencia la mezcla final. No reproduzcas ambas opciones a la vez, no extraigas la voz del MP4 y no vuelvas a sintetizarla si no lo requiere el cambio.
4. Usa `Guion_y_subtitulos/palabras_y_tiempos.json` y `Guion_y_subtitulos/subtitulos_animados.json` para conservar el énfasis sincronizado. El SRT no sustituye las posiciones, fuentes y animaciones. Divide grupos en los cortes y protege caras, manos y la acción de cada toma.
5. Usa las tipografías TTF incluidas, logo y `01_Marca_y_tipografias/Sistema_visual_V5.json`. La imagen debe ocupar toda la pantalla; evita convertir el anuncio en una presentación de paneles. Mantén los títulos breves, animaciones legibles y transiciones/SFX ligados a acciones visibles.
6. Conserva la apertura dirigida a cada perfil y la vista al mar desde el inicio. El rango «Rango aprox. $3.9–$4.8 MDP · 2 y 3 recámaras · MXN» sólo aparece de 0 a 3.6 s, también libre de cruces al entrar la segunda foto.
7. Conserva 10% de enganche + 10% TOTAL en 19 mensualidades + 80% contra entrega como esquema flexible de planeación. Mantén 8% anual calificado como plusvalía ESTIMADA en ESCENARIO CONSERVADOR. No presentes el dato como garantía o histórico comprobado.
8. Las amenidades son proyectadas; la imagen debe corresponder a lo narrado. Mantén el hombre/pareja de Empresario, la identidad de los otros perfiles y la geometría del proyecto y de las laptops.
9. Conserva logo, «MÁS INFORMACIÓN», llamada y flecha centrados en el cierre. Mantén los pagos compactos de Empresario y las posiciones especiales de subtítulos que evitan rostros o acciones.
10. No agregues «casa muestra», etiquetas IA, fecha de lista ni los antiguos avisos visibles de precio/disponibilidad o plusvalía no garantizada. Conserva fuentes y licencias de los componentes sin atribuirte derechos sobre stock.

Una instrucción nueva y explícita mía puede cambiar el copy o los importes de una versión nueva; en ese caso documenta el antes/después y conserva V5 como referencia. No sustituyas mis cambios por decisiones de estilo no solicitadas.

Antes de finalizar, revisa el inicio, el intervalo completo de precio, las transiciones, los tres pagos y el cierre a tamaño de teléfono. Verifica el MP4 codificado: formato, duración, fotogramas, audio, captions incrustados, decodificación y ausencia de negros inesperados. Corrige cualquier cruce sobre rostros o manos. Entrega el MP4 nuevo, los editables usados y una nota con lo cambiado y lo comprobado; distingue verificación técnica de valoración estética.

---

## Si usas Claude en el navegador

Adjunta primero esta guía/prompt, el guion, el timeline, el código sin medios y una hoja de miniaturas del perfil. Explica si Claude podrá ejecutar código o si sólo necesitas instrucciones de edición. Añade después los assets puntuales o usa un entorno con acceso a la carpeta local para renderizar. No asumas que la aplicación puede abrir directamente todas las carpetas de Drive o procesar cualquier ZIP grande.
