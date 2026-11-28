"""Quita eco (reverberación) y ruido de una voz grabada con celular.

NOTA (16 nov 2026): con eco fuerte esta cadena se queda corta (Fran la escuchó lejana
y con eco en V11b). Para esos casos usa ../voz-estudio (Sidon + EQ de estudio).

Cadena elegida para el video del asesor (Doctor V11b), medida con DNSMOS, cola de
eco tras cada palabra y transcripción con Whisper:
  1. WPE de un canal (nara_wpe, taps=6, delay=2, STFT 1536/384 a 48 kHz)
  2. DeepFilterNet3 (ruido y cola de reverberación)
Resultado en el asesor: DNSMOS OVRL 1.49 -> 2.57, cola de eco -5 dB -> -22 dB,
transcripción sin errores. VoiceFixer daba mejor DNSMOS pero cambiaba palabras
("disfrutar en pareja" -> "visitar el parque"), por eso se descartó.

Uso:  ~/.venvs/enh/bin/python -I limpiar_voz.py entrada.wav salida.wav
Después (ffmpeg): EQ + compresión + loudnorm al nivel de la voz del narrador:
  highpass=f=85,equalizer=f=320:width_type=o:width=1.2:g=-2.5,
  equalizer=f=3600:width_type=o:width=1.4:g=2,highshelf=f=9500:g=1.5,
  acompressor=threshold=-22dB:ratio=3:attack=6:release=90:makeup=2
Entorno: venv con torch (CPU), nara_wpe, deepfilternet 0.5.6 (parche en df/io.py
para torchaudio nuevo) y el modelo DeepFilterNet3 de raw.githubusercontent.com.
"""
import sys, numpy as np, soundfile as sf, librosa, torch
from nara_wpe.wpe import wpe
from nara_wpe.utils import stft, istft
from df.enhance import enhance, init_df

src, dst = sys.argv[1], sys.argv[2]
y, fs = sf.read(src)
y = y.mean(1) if y.ndim > 1 else y
if fs != 48000:
    y = librosa.resample(y, orig_sr=fs, target_sr=48000); fs = 48000
Y = stft(y[None], size=1536, shift=384).transpose(2, 0, 1)
Z = wpe(Y, taps=6, delay=2, iterations=3, statistics_mode='full').transpose(1, 2, 0)
w = istft(Z, size=1536, shift=384)[0][:len(y)]
model, st, _ = init_df()
o = enhance(model, st, torch.from_numpy(w.astype(np.float32))[None])[0].numpy()
sf.write(dst, o / (np.abs(o).max() + 1e-9) * 0.9, fs)
print('listo', dst)
