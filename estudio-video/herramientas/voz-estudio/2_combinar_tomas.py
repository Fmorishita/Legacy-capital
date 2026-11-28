# Combina tomas restauradas por tramos (mismo modelo, misma línea de tiempo) con fundidos cortos.
# Uso: python 2_combinar_tomas.py base.wav salida.wav otra.wav:ini:fin [otra2.wav:ini:fin ...]
# Los cortes van en silencios o cierres de consonante; fundido de 15 ms con igual potencia.
import sys, numpy as np, soundfile as sf

base, dst, parts = sys.argv[1], sys.argv[2], sys.argv[3:]
y, fs = sf.read(base, dtype='float64'); y = y if y.ndim == 1 else y.mean(1)
out = y.copy(); xf = int(0.015 * fs)
def rms(a): return np.sqrt((a ** 2).mean() + 1e-12)
for p in parts:
    f, a, b = p.rsplit(':', 2); a, b = float(a), float(b)
    z, fz = sf.read(f, dtype='float64'); z = z if z.ndim == 1 else z.mean(1)
    assert fz == fs
    i0, i1 = int(a * fs), int(b * fs)
    # iguala el nivel del tramo prestado con el de la base en ese mismo tramo
    seg = z[i0 - xf:i1 + xf] * (rms(y[i0:i1]) / rms(z[i0:i1]))
    t = np.linspace(0, np.pi / 2, xf)
    fin, fout = np.sin(t), np.cos(t)
    out[i0 - xf:i0] = out[i0 - xf:i0] * fout + seg[:xf] * fin
    out[i0:i1] = seg[xf:xf + (i1 - i0)]
    out[i1:i1 + xf] = out[i1:i1 + xf] * fin + seg[xf + (i1 - i0):] * fout
    print(f'tramo {a:.2f}–{b:.2f} s desde {f.split("/")[-1]}')
sf.write(dst, out / (np.abs(out).max() + 1e-9) * 0.9, fs)
