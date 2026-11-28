# Voz gratuita con Qwen3-TTS (California v2, 18 nov 2026)

Locución en español generada en local, sin costo y con uso comercial permitido:
- Modelos `Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign` y `Qwen/Qwen3-TTS-12Hz-1.7B-Base`, ambos con licencia Apache 2.0.
- Paquete `qwen-tts` 0.1.1, en un venv aparte (`~/.venvs/qwentts`, con torch CPU y transformers 4.57.3).
- El locutor se diseña con una descripción de texto, así que no clona a ninguna persona real. Después, el modelo Base repite ese mismo timbre en cada párrafo.

## Pasos

1. `disenar_locutor.py <modelo VoiceDesign>`: genera 6 candidatos (`d1`–`d6`) con dos descripciones y tres semillas. Para elegir, usa `medir_voz.py` (DNSMOS, F0 y pausas) y Whisper (que no haya errores de pronunciación).
   - En California v2 se eligió `d1`: voz grave de unos 115 Hz, la más expresiva y con DNSMOS 3.59.
2. `clonar_parrafos.py <modelo Base> d1.wav "<texto exacto de d1>" guion.txt salida/`: genera un WAV por párrafo con el mismo timbre. Tarda unos 5× tiempo real en 4 CPU.
3. Revisa cada párrafo con Whisper. Si algo falla, rehaz ese párrafo con `tomas_alternas.py` y cambia la semilla o la puntuación.
   - Ejemplo: «ganas en dólares…» sonaba a pregunta. Con un punto en vez de puntos suspensivos y la semilla 203, la entonación cae.
   - Para comprobarlo: `entonacion_palabra.py toma.wav transcript.json dólares` (si la diferencia en semitonos es negativa, la entonación es afirmativa).
4. `ensamblar.py parrafos/ guion.txt voz.wav parrafos.json 193 atempo`: recorta silencios, acelera con `atempo` (×1.15; `rubberband` bajaba la calidad), acorta las pausas internas de más de 0.30 s y une los párrafos con pausas de 0.22–0.26 s. También guarda los inicios de cada párrafo, que usa `build.py` para los cortes.

## Resultado en California v2

- 81.9 s para 255 palabras, unas 187 palabras por minuto.
- DNSMOS OVRL 3.44. La voz V2 de la carpeta de Fran daba 3.11, y Whisper la entendía mal en «roof garden» y «atardeceres».
- F0 de 119 Hz con 4.3 semitonos de variación, contra 2.5 de la voz V2: es más expresiva.
