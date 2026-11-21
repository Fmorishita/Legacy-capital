# Mezcla de audio de Empresario V8 → assets/mezcla.wav (+ pistas separadas en audio/).
# Voz: edge-tts (es-MX-JorgeNeural) con EQ de presencia, de-esser y compresión suave.
# Música: «Driving Ambition» (Ahjay Stelino, Mixkit Stock Music Free License). Se edita a compás (100 BPM):
#   el platillo del coro (38.548 s de la pista) cae en «Conoce» y se quitan 2 compases (83.548–88.348 s) para que el
#   final real de la pista entre en el corte al CTA; su último golpe remata el logo ~1 s antes del final.
# Ducking: la música baja sola mientras habla la voz y sube en las pausas.
# Efectos: audio/eventos.json (lo escribe build.py); cada efecto se coloca por su golpe (pico) o su inicio.
import json, subprocess, numpy as np

P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-empresario-v8-es/'
SR = 48000
E = json.load(open(P + 'audio/eventos.json'))
DUR, T_DROP, TS = E['DUR'], E['T_DROP'], E['TS']
N = int(round(DUR * SR))
SFXI = json.load(open(P + 'audio/sfx_info.json'))


def load(path, af=None, ch=2):
    cmd = ['ffmpeg', '-v', 'error', '-i', path]
    if af:
        cmd += ['-af', af]
    cmd += ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    return x.reshape(-1, ch).copy()


def lufs(x):
    """Loudness integrada (EBU R128) con ffmpeg."""
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', str(x.shape[1]), '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True)
    lines = [l for l in p.stderr.decode().splitlines() if l.strip().startswith('I:')]
    return float(lines[-1].split()[1])


db = lambda g: 10 ** (g / 20)
# ---------- voz
voz = load(P + 'audio/voz-edge.mp3', 'highpass=f=70,equalizer=f=180:t=q:w=1:g=1.2,equalizer=f=3200:t=q:w=1.2:g=2.2,equalizer=f=9000:t=q:w=1:g=1,'
           'deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=3:attack=6:release=90:makeup=2', ch=1)
v = np.zeros((N, 2), np.float32)
L = min(N, len(voz))
v[:L, 0] = voz[:L, 0]
v[:L, 1] = voz[:L, 0]
v *= db(-16 - lufs(v))
# ---------- música editada a compás
mus = load(P + 'audio/musica-original-driving-ambition.mp3', 'highpass=f=35,equalizer=f=2800:t=q:w=1.1:g=-3.5,equalizer=f=250:t=q:w=1:g=-1')
OFF = 38.548 - T_DROP            # segundo de la pista que suena en t=0 (platillo del coro en «Conoce»)
X = int(0.04 * SR)               # cruce de 40 ms
a0, a1 = int(OFF * SR), int((OFF + TS) * SR)  # termina en 83.548 s de la pista
b0 = int(88.348 * SR)
seg1 = mus[a0:a1 + X // 2]
seg2 = mus[b0 - X // 2:b0 - X // 2 + (N - len(seg1)) + X]
fo = np.cos(np.linspace(0, np.pi / 2, X))[:, None] ** 1
fi = np.sin(np.linspace(0, np.pi / 2, X))[:, None] ** 1
m = np.concatenate([seg1[:-X], seg1[-X:] * fo + seg2[:X] * fi, seg2[X:]])[:N]
if len(m) < N:
    m = np.concatenate([m, np.zeros((N - len(m), 2), np.float32)])
fade = int(0.9 * SR)
m[-fade:] *= np.linspace(1, 0, fade)[:, None]
# ducking por la voz (seguidor de envolvente con ataque 30 ms y relajación 450 ms)
hop = int(0.01 * SR)
env = np.sqrt(np.convolve(v[:, 0] ** 2, np.ones(hop * 3) / (hop * 3), 'same'))[::hop]
act = (20 * np.log10(env + 1e-9) > -42).astype(float)
g = np.zeros_like(act)
for i in range(1, len(act)):
    k = 0.28 if act[i] > g[i - 1] else 0.022     # ataque rápido, relajación lenta
    g[i] = g[i - 1] + (act[i] - g[i - 1]) * k
duck_db = -6.0 * g                                # hasta −6 dB bajo la voz
gain = np.interp(np.arange(N), np.arange(len(g)) * hop, db(duck_db)).astype(np.float32)
m *= gain[:, None]
# cama: la música queda ~17 LU bajo la voz mientras se habla (regla del estudio: 16–17 dB)
hop_mask = np.repeat((np.convolve(act, np.ones(5) / 5, 'same') > 0.5), hop)[:N]
m *= db(-17 - (lufs(m[hop_mask]) - lufs(v[hop_mask])))
# ---------- efectos
fx = np.zeros((N, 2), np.float32)
cache = {}
for e in E['events']:
    f = e['f']
    if f not in cache:
        cache[f] = load(P + 'assets/sfx/' + f + '.mp3')
    x = cache[f].copy()
    ref = SFXI[f]['peak'] if e['ref'] == 'peak' else SFXI[f]['onset']
    st = e['hit'] - ref
    if e['dur']:
        x = x[:int((e['dur'] + (ref if e['ref'] == 'peak' else 0)) * SR)]
    if e['fade']:
        k = min(len(x) // 2, int(e['fade'] * SR))
        if k > 0:
            x[:k] *= np.linspace(0, 1, k)[:, None]
            x[-k:] *= np.linspace(1, 0, k)[:, None]
    pan = e['pan']
    x[:, 0] *= np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
    x[:, 1] *= np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
    x *= db(e['db'])
    i0 = int(round(st * SR))
    if i0 < 0:
        x, i0 = x[-i0:], 0
    i1 = min(N, i0 + len(x))
    fx[i0:i1] += x[:i1 - i0]
mix = v + m + fx
pk = np.abs(mix).max()
if pk > 0.95:  # protección (el master final hace la normalización a −14 LUFS)
    mix *= 0.95 / pk
for name, arr in (('voz', v), ('musica', m), ('efectos', fx), ('mezcla', mix)):
    path = P + ('assets/mezcla.wav' if name == 'mezcla' else f'audio/{name}.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', path],
                   input=arr.astype(np.float32).tobytes(), check=True)
# relación voz / música mientras habla la voz
sp = np.repeat(act, hop)[:N] > 0.5
r = lambda x: 10 * np.log10(np.mean(x[sp] ** 2) + 1e-12)
print(f'voz {lufs(v):.1f} LUFS · música {lufs(m):.1f} LUFS · efectos {lufs(fx):.1f} LUFS · mezcla {lufs(mix):.1f} LUFS · pico {20*np.log10(np.abs(mix).max()):.1f} dBFS')
print(f'música bajo la voz (LUFS, solo tramos con voz): {lufs(m[sp]) - lufs(v[sp]):.1f} LU · música en pausas: {lufs(m[~sp]):.1f} LUFS')
print('splice', round(TS, 3), 'offset', round(OFF, 3))
