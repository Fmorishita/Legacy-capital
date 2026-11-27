# Audio V5 para el mismo proyecto

Cada perfil contiene `Audio/voz_sola_alineada.wav` y `Audio/mezcla_final_V5.wav`, conservados del trabajo V5. La voz ya incluye el silencio de inicio y dura lo mismo que el anuncio: no volver a sumar `narration_offset`.

Cada perfil conserva su música original en `Audio/Musica_fuente`; `05_Efectos_sonoros_compartidos` contiene los seis efectos comunes. Estas rutas identifican las nueve fuentes originales. El catálogo `Registro_fuentes_audio.json` conserva los enlaces oficiales, licencias, tamaños y SHA256. Se suministran como materiales privados de trabajo del mismo proyecto y licenciatario, no como una librería pública o para su reventa.

Para verificar o recuperar una fuente:

```bash
python 00_Guia_IA/scripts/descargar_fuentes_audio.py
```

Para volver a producir las pistas de edición:

```bash
python -m pip install numpy scipy
python 00_Guia_IA/scripts/reconstruir_audio.py --perfil todos
```

Se requiere FFmpeg en `PATH`. El script usa la entrada musical, ganancias, ducking, foco de pagos, cortes y eventos SFX de `Estructura_y_timeline/audio_recipe.json`. Escribe música editada, efectos, premáster y una mezcla reconstruida por perfil. No llama a una API ni genera otra voz. No sobrescribe resultados existentes salvo con `--replace`.

Los stems son pistas de trabajo para esta edición. Para contrastar el resultado, usar siempre `Audio/mezcla_final_V5.wav`: es la mezcla V5 exacta. La reconstrucción parte de la voz PCM16 alineada, mientras el máster original partió de una voz en coma flotante; por esa cuantización y posibles diferencias de FFmpeg, no se afirma igualdad bit a bit.
