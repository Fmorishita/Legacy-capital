# Tiempos por palabra de la voz de Fran (Empresario V9) por alineación forzada (torchaudio MMS_FA) contra guion-voz.txt.
# Uso: ~/.venvs/enh/bin/python -I alinear.py <voz.wav> voz.words.json
import json, sys, unicodedata, re, subprocess, numpy as np, torch
from torchaudio.pipelines import MMS_FA as B
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-empresario-v10-es/'
WAV, OUT = sys.argv[1], sys.argv[2]
G = open(P + 'guion-voz.txt').read().split()
SP = {'ruf': 'ruf', 'ruftop': 'ruftop', 'minisplits': 'minisplits'}
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z' ]", '', s).split()
groups = [norm(g) for g in G]
assert all(groups), [g for g, x in zip(G, groups) if not x]
flat = [t for g in groups for t in g]
model = B.get_model(with_star=False); model.eval(); dic = B.get_dict(star=None)
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', WAV, '-ac', '1', '-ar', str(B.sample_rate), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
wav = torch.from_numpy(x)[None]
with torch.inference_mode():
    em, _ = model(wav)
spans = B.get_aligner()(em[0], [[dic[c] for c in w] for w in flat])
r = wav.shape[1] / em.shape[1] / B.sample_rate
out, k = [], 0
for g, n in zip(G, groups):
    out.append([g.strip('¿?¡!,.:;…'), round(spans[k][0].start * r, 3), round(spans[k + len(n) - 1][-1].end * r, 3)]); k += len(n)
json.dump(out, open(OUT, 'w'), ensure_ascii=False)
print(' '.join(f'{a}@{b:.2f}' for a, b, c in out))
