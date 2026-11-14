# Audio editable · Doctor V6 Legacy Capital

`doctor_v6_voice.wav` es la voz nueva, limpia y alineada para la edición, estéreo48kHzPCM16. Empieza con «Doctor» a0.12s; no necesita desplazamiento adicional al ponerla en tiempo0. No se alteró su velocidad después de sintetizarla. Duración total64.0416667s,1537fotogramas a24fps. La última palabra termina a63.188958s y queda cola para el cierre.

`doctor_v6_raw.mp3` conserva la síntesis original. `doctor_v6_voice_raw.json` guarda los límites originales por palabra. `doctor_v6_voice.json` y `doctor_v6_words.json` usan ya el reloj final del video; no sumar dos veces el offset. `doctor_v6.srt` es un agrupamiento inicial completo: para el MP4 debe dividirse en los cortes definitivos y cambiar de posición según rostros/manos/acciones. El SRT por sí solo no conserva resaltados por palabra; el JSON sí.

La mezcla final y sus componentes se documentan en `doctor_v6_audio.json` y el script `build_audio.py`. Usar **la mezcla** o **los stems**, sin reproducir ambas opciones a la vez. Los stems previos al mastering se mantienen como elementos de trabajo. Si se necesita recrear el master, aplicar el proceso de mastering registrado a la suma; la suma directa de stems no es el archivo final normalizado. La voz y la narración determinan los cortes, no una plantilla con duración fija.

Los términos20mensualidades/mediados2028/$3.9–$4.9MDP/promociónhasta$450mil proceden del nuevo guion aportado por el cliente. El guion hablado corrige «Genera plusvalía…» por «Explora su potencial…» y conserva la idea de inversión/rentas sin asegurar resultados. No se utiliza la gráfica antigua de diciembre2028 para modificar la fecha hablada. Ver `Guion_locucion_V6.md` para el texto y su procedencia.

`muestra_marca_Legacy_Capital.mp3` es sólo una muestra de revisión, extraída del cierre de esta misma locución. No debe agregarse como segunda voz al anuncio. El análisis de sonoridad y decodificación no equivale a una escucha humana; los reportes indican esa limitación con precisión.
