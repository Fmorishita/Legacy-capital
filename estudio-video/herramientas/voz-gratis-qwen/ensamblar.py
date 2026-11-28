# Ensambla la voz: recorta silencios, acelera cada párrafo al ritmo objetivo y une con pausas cortas.
# Uso: python ensamblar.py carpeta_parrafos guion.txt salida.wav parrafos.json [wpm_objetivo] [metodo]
import sys, json, subprocess, numpy as np, soundfile as sf, os, tempfile
D, GUION, OUT, PJ = sys.argv[1:5]
WPM = float(sys.argv[5]) if len(sys.argv) > 5 else 205
MET = sys.argv[6] if len(sys.argv) > 6 else 'rubberband'
lines = [l.strip() for l in open(GUION) if l.strip()]
SR = 48000
def load(p):
    y, sr = sf.read(p, dtype='float64'); y = y if y.ndim == 1 else y.mean(1)
    return y, sr
def trim(y, sr, thr_db=-42):
    h = int(0.01 * sr); n = len(y) // h
    e = 20 * np.log10(np.sqrt((y[:n * h].reshape(n, h) ** 2).mean(1)) + 1e-9); pk = e.max()
    on = np.where(e > pk + thr_db)[0]
    a = max(0, (on[0] - 3) * h); b = min(len(y), (on[-1] + 6) * h)
    return y[a:b]
def squeeze(y, sr, maxp=0.30, keep=0.26, thr_db=-38):
    # acorta las pausas internas largas a `keep` segundos (corte en el centro del silencio con fundido)
    h = int(0.01 * sr); n = len(y) // h
    db = 20 * np.log10(np.sqrt((y[:n * h].reshape(n, h) ** 2).mean(1)) + 1e-9); sil = db < db.max() + thr_db
    out = []; last = 0; i = 0
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]: j += 1
            if (j - i) / 100 > maxp and i > 5 and j < n - 5:
                cut0 = (i * h) + int(keep / 2 * sr); cut1 = (j * h) - int(keep / 2 * sr)
                out.append(y[last:cut0]); last = cut1
            i = j
        else:
            i += 1
    out.append(y[last:])
    return np.concatenate(out)
segs = []; words_tot = 0; dur_tot = 0
for i, l in enumerate(lines):
    y, sr = load(f'{D}/p{i:02d}.wav'); y = trim(y, sr)
    segs.append((y, sr)); words_tot += len(l.split()); dur_tot += len(y) / sr
f = (words_tot / (WPM / 60)) / dur_tot
factor = min(1.25, max(1.0, 1 / f))
print(f'palabras {words_tot}, voz sin pausas {dur_tot:.1f}s ({words_tot / dur_tot * 60:.0f} ppm) -> tempo x{factor:.3f}')
tmp = tempfile.mkdtemp()
out = []; marks = []; t = 0.0
GAP = {'?': 0.26, '.': 0.22}
for i, (y, sr) in enumerate(segs):
    a = f'{tmp}/a{i}.wav'; b = f'{tmp}/b{i}.wav'; sf.write(a, y, sr)
    flt = (f'rubberband=tempo={factor:.4f}:transients=mixed:detector=soft:phase=laminar:window=standard:formant=preserved:pitchq=quality' if MET == 'rubberband' else f'atempo={factor:.4f}')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'{flt},aresample={SR}', '-ac', '1', b], check=True)
    z, _ = load(b)
    z = squeeze(z, SR)
    fade = int(0.006 * SR); z[:fade] *= np.linspace(0, 1, fade); z[-fade:] *= np.linspace(1, 0, fade)
    marks.append([round(t, 3), round(t + len(z) / SR, 3)])
    out.append(z); t += len(z) / SR
    if i < len(segs) - 1:
        g = GAP.get(lines[i][-1], 0.22); out.append(np.zeros(int(g * SR))); t += g
lead = np.zeros(int(0.12 * SR))
y = np.concatenate([lead] + out + [np.zeros(int(0.3 * SR))])
marks = [[round(a + 0.12, 3), round(b + 0.12, 3)] for a, b in marks]
sf.write(OUT, (y / (np.abs(y).max() + 1e-9) * 0.89).astype('float32'), SR, subtype='PCM_24')
json.dump(marks, open(PJ, 'w'))
print('duración', round(len(y) / SR, 2), 's; párrafos:', marks)
