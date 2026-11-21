# Ecualización "de estudio": acerca el balance tonal de la voz restaurada al de la voz de referencia (narrador),
# con FIR de fase lineal (sin desfase de tiempo) y límites de ganancia. Uso:
#   python 3_eq_estudio.py voz_restaurada.wav voz_referencia.wav salida_eq.wav [fraccion=0.7]
import sys, numpy as np, soundfile as sf, librosa
from scipy.signal import firwin2, oaconvolve, butter, sosfiltfilt

src, refp, dst = sys.argv[1:4]
frac = float(sys.argv[4]) if len(sys.argv) > 4 else 0.7
FS = 48000

def load(p):
    y, fs = sf.read(p, dtype='float64'); y = y if y.ndim == 1 else y.mean(1)
    return librosa.resample(y, orig_sr=fs, target_sr=FS) if fs != FS else y

cent = 1000 * 2 ** (np.arange(-12, 15) / 3)  # 63 Hz … 25 kHz, tercios de octava
def ltas(y):
    S = np.abs(librosa.stft(y.astype(np.float32), n_fft=4096, hop_length=1024)) ** 2
    fr = librosa.fft_frequencies(sr=FS, n_fft=4096); e = S.sum(0); act = e > np.percentile(e, 60)
    m = S[:, act].mean(1); out = []
    for c in cent:
        sel = (fr >= c / 2 ** (1 / 6)) & (fr < c * 2 ** (1 / 6))
        out.append(10 * np.log10(m[sel].mean() + 1e-20) if sel.any() else np.nan)
    out = np.array(out); return out - out[12]

y = load(src); ref = load(refp)
d = ltas(ref) - ltas(y)
g = np.zeros_like(d)
band = (cent >= 250) & (cent <= 14000)          # solo zona de timbre/presencia/aire de la voz
g[band] = np.clip(frac * d[band], -4.0, 6.0)
g = np.convolve(np.pad(g, 1, mode='edge'), [0.25, 0.5, 0.25], mode='valid')  # suaviza entre bandas
freqs = np.concatenate([[0], cent[cent < FS / 2], [FS / 2]])
gains = np.concatenate([[0], g[cent < FS / 2], [0]])
fir = firwin2(4097, freqs, 10 ** (gains / 20), fs=FS)
o = oaconvolve(y, fir)[2048:2048 + len(y)]       # compensa el retardo del FIR (fase lineal)
o = sosfiltfilt(butter(4, 90, 'highpass', fs=FS, output='sos'), o)  # sin retumbe bajo la voz
sf.write(dst, o / (np.abs(o).max() + 1e-9) * 0.9, FS)
print('EQ aplicada (dB por banda):')
print(' '.join(f'{int(c)}:{v:+.1f}' for c, v in zip(cent, g) if abs(v) >= 0.5))
