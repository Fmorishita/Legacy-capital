# Uso: ~/.venvs/enh/bin/python -I alinear.py assets/voz.wav transcript.json  (luego python3 build.py y python3 cortar_clips.py <carpeta de clips Higgsfield>)
# Alineación forzada (torchaudio MMS_FA) del guion en pantalla (guion.txt) de California v11 contra la voz (guion-voz.txt).
import json, sys, unicodedata, re, torch, torchaudio
from torchaudio.pipelines import MMS_FA as B
GUION = "guion.txt"  # texto en pantalla (cifras con dígitos)
WAV = sys.argv[1]; OUT = sys.argv[2]
disp = open(GUION).read().split()
SPOKEN = {'$215,000': 'doscientos quince mil', '$235,000': 'doscientos treinta y cinco mil', '24/7.': 'veinticuatro siete',
          '10%': 'diez por ciento', '20': 'veinte', '80%': 'ochenta por ciento', '2028.': 'dos mil veintiocho', '$25,000': 'veinticinco mil', '$24,232': 'veinticuatro mil doscientos treinta y dos', '10%,': 'diez por ciento', '10%': 'diez', '2028.': 'dos mil veintiocho', '$235,000.': 'doscientos treinta y cinco mil', 'WhatsApp': 'guatsap', 'Ysidro.': 'isidro',
          'roof': 'ruf', 'rooftop.': 'ruftop', 'Legacy': 'legasi', 'minisplits': 'minisplits'}
def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r"[^a-z' ]", '', s).split()
# cada palabra en pantalla -> lista de palabras habladas (tokens del alineador)
groups = [norm(SPOKEN.get(d, d)) for d in disp]
flat = [t for g in groups for t in g]
model = B.get_model(with_star=False); model.eval()
dic = B.get_dict(star=None)
import subprocess, numpy as np
x = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',WAV,'-ac','1','-ar',str(B.sample_rate),'-f','f32le','-'],capture_output=True,check=True).stdout, np.float32).copy()
wav = torch.from_numpy(x)[None]
with torch.inference_mode():
    em, _ = model(wav)
tok = [[dic[c] for c in w] for w in flat]
aligner = B.get_aligner(); spans = aligner(em[0], tok)
ratio = wav.shape[1] / em.shape[1] / B.sample_rate
out, k = [], 0
for d, g in zip(disp, groups):
    s = spans[k][0].start * ratio; e = spans[k + len(g) - 1][-1].end * ratio
    out.append({'text': d, 'start': round(s, 3), 'end': round(e, 3)}); k += len(g)
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=0)
print(' '.join(f"{o['text']}@{o['start']:.2f}" for o in out))
