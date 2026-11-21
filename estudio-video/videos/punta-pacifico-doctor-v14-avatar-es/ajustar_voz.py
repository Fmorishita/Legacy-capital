# Voz nueva del Doctor ajustada al ritmo de la V13: cada frase (entre pausas) se acelera con WSOLA (ffmpeg atempo; antes
# rubberband, que la dejaba robótica): hasta 1.25× en las 2 primeras frases y 1.15× en el resto; cada frase empieza donde empezaba en la V13.
import json, subprocess, numpy as np
S = '/tmp/claude-0/-home-user/6b8e8ed3-bff4-58a9-a23d-794f69ea8adc/scratchpad/doc/'
SR = 48000
OLDW = json.load(open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/v10/words.json'))
O = json.load(open(S + 'vieja_al.json'))[20:]
N = json.load(open(S + 'nueva_al.json'))
def load(path, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', path] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()
src = load(S + 'voz-nueva.wav')
ph = [0] + [i for i in range(1, len(N)) if N[i][1] - N[i - 1][2] > 0.22] + [len(N)]
canvas = np.zeros(int(70 * SR), np.float32)
prev_end, words, plan = None, [], []
for k, (a, b) in enumerate(zip(ph, ph[1:])):
    ns, ne = N[a][1], N[b - 1][2]
    os_, oe = O[a][1], O[b - 1][2]
    r = min(max((ne - ns) / (oe - os_), 1.05), 1.25 if k < 2 else 1.15)
    T = max(os_, 6.55 if k == 0 else prev_end + 0.12)
    gb = ns - (N[a - 1][2] if a else 0); ga = (N[b][1] - ne) if b < len(N) else 0.3
    pre, post = min(0.07, gb / 2), min(0.10, ga / 2)
    seg = src[int((ns - pre) * SR):int((ne + post) * SR)]
    seg = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af',
        f'atempo={r}', '-f', 'f32le', '-'],
        input=seg.tobytes(), capture_output=True, check=True).stdout, np.float32).copy()
    f = int(0.012 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    i0 = int(round((T - pre / r) * SR)); canvas[i0:i0 + len(seg)] += seg
    for j in range(a, b):
        words.append([N[j][0], round(T + (N[j][1] - ns) / r, 3), round(T + (N[j][2] - ns) / r, 3)])
    prev_end = T + (ne - ns) / r
    plan.append((round(T, 2), round(r, 3), round(T - os_, 2)))
end = int((prev_end + 0.4) * SR)
canvas = canvas[:end]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'pcm_s24le', S + 'voz-v14b.wav'],
               input=canvas.tobytes(), check=True)
# palabras para los subtítulos del cuerpo: intro igual que antes, desde «Conoce» con la voz nueva
full = [list(w) for w in OLDW[:20]] + words
for i, w in enumerate(full):
    if w[0] == 'roof' and full[i + 1][0] == 'privado.': w[0] = 'rooftop'   # la voz nueva dice «rooftop privado»
json.dump(full, open(S + 'words-v14b.json', 'w'), ensure_ascii=False)
json.dump(plan, open(S + 'plan-v14b.json', 'w'))
print('frases', len(plan), 'fin', round(prev_end, 2), 'tempos', sorted(set(p[1] for p in plan))[:3], '…', max(p[1] for p in plan), 'desfase máx', max(p[2] for p in plan))
