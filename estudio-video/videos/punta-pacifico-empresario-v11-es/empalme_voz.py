# Voz del Empresario V11: el audio aprobado de V10 (Generated Audio 1:18 PM) con la oración del equipamiento tomada del
# audio corregido de Fran (Generated Audio 4:15 PM: «…como cocina equipada, clósets, minisplits, baños y rooftop…»).
# Cortes en el punto más silencioso de las pausas antes de «Reserva» y antes de «Construye»; la oración nueva se iguala
# en loudness y se ecualiza (la toma nueva trae ~8 dB más de agudos arriba de 8 kHz) para que no se note el empalme.
# Después, pausas de 0.22–0.25 s entre los elementos de la lista para que cada foto dure ~1 s.
# Uso: python empalme_voz.py <voz_v10_original.wav> <voz_corregida.wav> <words_v10.json> <words_corregida.json> <salida.wav>
import json, subprocess, sys, numpy as np
A_P, B_P, WA_P, WB_P, OUT = sys.argv[1:6]
SR = 48000
EQ = ('highshelf=f=7800:g=-9:t=q:w=0.8,equalizer=f=5700:t=q:w=1:g=1.6,equalizer=f=2400:t=q:w=1:g=-1.3,'
      'equalizer=f=7200:t=q:w=1.2:g=-2,equalizer=f=14000:t=q:w=1:g=-2')
def load(p, af=None):
    c = ['ffmpeg', '-v', 'error', '-i', p] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(c, capture_output=True, check=True).stdout, np.float32).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.tobytes(), capture_output=True)
    return float([l for l in p.stderr.decode().splitlines() if l.strip().startswith('I:')][-1].split()[1])
def quiet(x, t0, t1):
    i0, i1 = int(t0 * SR), int(t1 * SR); w = int(0.01 * SR); seg = x[i0:i1]
    e = [np.sqrt((seg[k:k + w] ** 2).mean()) for k in range(0, len(seg) - w, w // 2)]
    return i0 + int(np.argmin(e)) * (w // 2) + w // 2
g = lambda W, t, after=0: [w for w in W if w[0] == t and w[1] >= after][0]
A, B = load(A_P), load(B_P, EQ)
WA, WB = json.load(open(WA_P)), json.load(open(WB_P))
a1, a2 = quiet(A, g(WA, 'entrega')[2], g(WA, 'Reserva')[1]), quiet(A, g(WA, 'pesos', 40)[2], g(WA, 'Construye')[1])
b1, b2 = quiet(B, g(WB, 'entrega')[2], g(WB, 'Reserva')[1]), quiet(B, g(WB, 'pesos', 40)[2], g(WB, 'Construye')[1])
sb = B[b1:b2] * 10 ** ((lufs(A[a1:a2]) - lufs(B[b1:b2])) / 20)
f = int(0.01 * SR); sb[:f] *= np.linspace(0, 1, f); sb[-f:] *= np.linspace(1, 0, f)
# pausas en la lista (posiciones dentro de la oración nueva)
off = b1 / SR
cuts = []
for p, q in (('equipada', 'clósets'), ('clósets', 'minisplits'), ('minisplits', 'baños'), ('baños', 'y'), ('ruftop', 'con')):
    wp = g(WB, p, 35); wq = g(WB, q, wp[1])
    cuts.append((quiet(B, wp[2], wq[1]) - b1, 0.25 if p in ('equipada', 'clósets', 'minisplits') else 0.33))
parts, prev = [], 0
for c, pz in cuts:
    s = sb[prev:c].copy(); s[-f:] *= np.linspace(1, 0, f); parts += [s, np.zeros(int(pz * SR), np.float32)]; prev = c
s = sb[prev:].copy(); s[:f] *= np.linspace(0, 1, f); parts.append(s)
y = np.concatenate([A[:a1]] + parts + [A[a2:]])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', OUT], input=y.tobytes(), check=True)
print(f'empalme: V10 hasta {a1 / SR:.3f} s + oración nueva {b1 / SR:.3f}–{b2 / SR:.3f} s + V10 desde {a2 / SR:.3f} s → {len(y) / SR:.2f} s')
