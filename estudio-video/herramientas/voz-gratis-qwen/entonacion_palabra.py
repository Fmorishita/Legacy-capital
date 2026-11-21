# Contorno de F0 de una palabra: compara el final con el inicio (semitonos). Negativo = baja (afirmación).
import sys, json, numpy as np, soundfile as sf, librosa
wav, trj, word = sys.argv[1:4]
W = json.load(open(trj)); y, sr = sf.read(wav); y = y if y.ndim == 1 else y.mean(1)
y = librosa.resample(y, orig_sr=sr, target_sr=16000)
for w in W:
    if w['text'].lower().strip('¿?,.…').startswith(word):
        a, b = int(max(0, w['start'] - 0.05) * 16000), int(min(w['end'] + 0.15, len(y) / 16000) * 16000)
        f0, vf, _ = librosa.pyin(y[a:b], fmin=60, fmax=320, sr=16000, frame_length=1024, hop_length=160)
        f = f0[~np.isnan(f0)]
        if len(f) < 6: print(word, 'sin F0'); break
        n = len(f); ini = np.median(f[:max(2, n // 3)]); fin = np.median(f[-max(2, n // 4):])
        print(f"{word}: {w['start']:.2f}-{w['end']:.2f}s  F0 inicio {ini:.0f} Hz -> final {fin:.0f} Hz  ({12*np.log2(fin/ini):+.1f} st)")
        break
