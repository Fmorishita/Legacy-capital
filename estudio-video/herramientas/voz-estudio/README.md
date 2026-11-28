# Voz de estudio desde una grabación de celular con eco

Herramienta para voces grabadas lejos del micrófono, en un cuarto con eco. Se usó con el asesor del video Doctor V11b (16 nov 2026), después de que la limpieza clásica de `../limpiar-voz` (WPE + DeepFilterNet3) no alcanzó.

Todo corre en local y gratis: no usa créditos de Higgsfield ni servicios externos. Solo descarga modelos de HuggingFace.

## Cadena

| Paso | Script | Qué hace |
|---|---|---|
| 1 | `1_restaurar_sidon.py` | Re-sintetiza la voz con **Sidon v0.1** (sarulab-speech, MIT), un modelo de restauración multilingüe a 48 kHz. Quita eco y ruido y no cambia los tiempos (desfase 0 ms, labios sincronizados). |
| 2 | `2_combinar_tomas.py` | Si una palabra sale alterada, la toma de otra pasada de Sidon con la misma línea de tiempo. Corta en silencios o cierres de consonante, con fundido de 15 ms. |
| 3 | `3_eq_estudio.py` | EQ de fase lineal que acerca el balance tonal al del narrador (70 % de la diferencia, entre −4 y +6 dB, de 250 Hz a 14 kHz) y aplica un pasa-altos de 90 Hz. |
| 4 | `4_dinamica_nivel.py` | De-esser, compresión 2.5:1 y loudnorm en dos pasadas a −17.5 LUFS con pico de −2 dBTP. Es el mismo nivel que la voz del narrador antes de la mezcla. |

El control de calidad se hace siempre, porque yo no puedo escuchar:

- `qa_metricas.py`: DNSMOS P.835 (SIG / BAK / OVRL), cola de eco y similitud de voz con el original (WavLM-SV).
- `qa_fonemas.py`: fonemas sin modelo de lenguaje (wav2vec2 XLSR-53 espeak). Sirve para saber si una palabra cambió de verdad o si fue error de Whisper.
- Transcripción completa: `npx hyperframes transcribe <wav> --model medium --language es --json`.

## Resultado en el asesor (Doctor V11b)

| Versión | SIG | BAK | OVRL | Cola de eco | Misma voz |
|---|---|---|---|---|---|
| Original (iPhone, AAC 44.1 kHz) | 2.75 | 2.19 | 1.95 | −5.3 dB | 1.000 |
| V11b anterior (WPE + DFN3 + EQ) | 2.94 | 3.91 | 2.66 | −21.9 dB | 0.986 |
| **Voz de estudio (esta cadena)** | **3.73** | **4.20** | **3.52** | **−30.1 dB** | 0.926 |

- Sidon juntaba la «i» de «invertir» con la «o» anterior (fonemas «oː bertir»). Ese tramo (4.90–5.76 s) se tomó de la pasada de Sidon hecha sobre la versión WPE + DFN3, que sí la conserva.
- «Haz clic» y el «de» de «botón de abajo» ya venían débiles en la grabación original. No es un error del modelo.
- Resemble Enhance (MIT) quedó segundo: OVRL 3.28, desfase de +120 ms y transcripción inestable.
- No se usaron modelos con licencia no comercial, como Miipher-2 (CC-BY-NC).

## Uso

```bash
P=~/.venvs/enh/bin/python   # venv con torch CPU, transformers, soundfile, librosa, scipy
$P -I 1_restaurar_sidon.py original.wav sidon.wav
$P -I 2_combinar_tomas.py sidon.wav sidon_comp.wav sidon_otra_pasada.wav:4.90:5.76   # solo si hace falta
$P -I 3_eq_estudio.py sidon_comp.wav voz_narrador.wav voz_eq.wav 0.7
$P -I 4_dinamica_nivel.py voz_eq.wav voz_final.wav -17.5
```

Los audios no se suben al repo, que es público. Viven en `videos/<proyecto>/assets/`, que está ignorado por git.
