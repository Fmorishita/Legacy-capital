# Uso: alinear.py voz.wav salida.json 20 (desde «Conoce») con ~/.venvs/enh/bin/python -I; para la voz anterior usar 0.
import json, sys, unicodedata, re, subprocess, numpy as np, torch
from torchaudio.pipelines import MMS_FA as B
W = json.load(open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/v10/words.json'))
WAV, OUT, I0 = sys.argv[1], sys.argv[2], int(sys.argv[3])
disp = [w[0] for w in W[I0:]]
SP = {'30': 'treinta', '1': 'una', '10': 'diez', '3': 'tres', '3.9': 'tres punto nueve', '4.9': 'cuatro punto nueve', '10%': 'diez por ciento',
      '20': 'veinte', '80%': 'ochenta por ciento', '2028.': 'dos mil veintiocho', '450,000': 'cuatrocientos cincuenta mil', 'roof': 'ruf',
      'Legacy': 'legasi', 'smart': 'esmart', 'home,': 'jom', 'pickleball,': 'pikolbol', 'Sausal,': 'sausal'}
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z' ]", '', s).split()
groups = [norm(SP.get(d, d)) for d in disp]
for d, g in zip(disp, groups):
    assert g, d
flat = [t for g in groups for t in g]
model = B.get_model(with_star=False); model.eval(); dic = B.get_dict(star=None)
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', WAV, '-ac', '1', '-ar', str(B.sample_rate), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
wav = torch.from_numpy(x)[None]
with torch.inference_mode():
    em, _ = model(wav)
spans = B.get_aligner()(em[0], [[dic[c] for c in w] for w in flat])
r = wav.shape[1] / em.shape[1] / B.sample_rate
out, k = [], 0
for d, g in zip(disp, groups):
    out.append([d, round(spans[k][0].start * r, 3), round(spans[k + len(g) - 1][-1].end * r, 3)]); k += len(g)
json.dump(out, open(OUT, 'w'), ensure_ascii=False)
print(' '.join(f'{a}@{b:.2f}' for a, b, c in out))
