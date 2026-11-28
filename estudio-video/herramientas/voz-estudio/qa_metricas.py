# Métricas objetivas para comparar tratamientos de la voz del asesor.
# Uso: python qa_metricas.py referencia_alineada.wav original.wav cand1.wav cand2.wav ...
#  - DNSMOS P.835 (SIG voz, BAK fondo, OVRL general; 1–5, más alto = mejor)
#  - cola_dB: caída de energía 50–150 ms después de que termina una palabra (más negativo = menos eco)
#  - sim: similitud de voz con el original (WavLM-SV, coseno; >0.86 ≈ misma persona)
#  - centroide y % de energía > 4 kHz (voz apagada/lejana = valores bajos)
import sys, os, numpy as np, soundfile as sf, librosa, onnxruntime as ort, torch
from transformers import AutoFeatureExtractor, WavLMForXVector

ref_path, orig_path, cands = sys.argv[1], sys.argv[2], sys.argv[3:]
sess = ort.InferenceSession('/root/.cache/dnsmos/sig_bak_ovr.onnx')
p_ovr = np.poly1d([-0.06766283, 1.11546468, 0.04602535]); p_sig = np.poly1d([-0.08397278, 1.22083953, 0.0052439]); p_bak = np.poly1d([-0.13166888, 1.60915514, -0.39604546])

def load(p, sr=None):
    y, fs = sf.read(p, dtype='float64')
    y = y if y.ndim == 1 else y.mean(1)
    if sr and fs != sr:
        y = librosa.resample(y, orig_sr=fs, target_sr=sr); fs = sr
    return y, fs

def dnsmos(y, fs):
    a = librosa.resample(y, orig_sr=fs, target_sr=16000); L = int(9.01 * 16000)
    while len(a) < L: a = np.append(a, a)
    hops = int(np.floor(len(a) / 16000) - 9.01) + 1; r = []
    for i in range(hops):
        s, b, o = sess.run(None, {'input_1': a[i * 16000:i * 16000 + L].astype('float32')[None, :]})[0][0]
        r.append((p_sig(s), p_bak(b), p_ovr(o)))
    return np.array(r).mean(0)

def env_db(y, fs, hop=0.01):
    h = int(hop * fs); n = len(y) // h
    return 10 * np.log10((y[:n * h].reshape(n, h) ** 2).mean(1) + 1e-12)

ref, fr = load(ref_path)
e = env_db(ref, fr); pk = np.percentile(e, 99); quiet = e < pk - 35; offs = []; i = 1
while i < len(quiet):
    if quiet[i] and not quiet[i - 1]:
        j = i
        while j < len(quiet) and quiet[j]: j += 1
        if j - i >= 15 and i >= 12: offs.append(i)
        i = j
    else: i += 1

def tail(y, fs):
    ev = env_db(y, fs)
    return float(np.mean([ev[o + 5:o + 15].mean() - ev[o - 10:o].mean() for o in offs if o + 15 < len(ev)]))

fx = AutoFeatureExtractor.from_pretrained('microsoft/wavlm-base-plus-sv')
sv = WavLMForXVector.from_pretrained('microsoft/wavlm-base-plus-sv').eval()
def emb(y16):
    with torch.inference_mode():
        x = fx(y16.astype(np.float32), sampling_rate=16000, return_tensors='pt')
        v = sv(**x).embeddings[0]
    return torch.nn.functional.normalize(v, dim=-1)
o16, _ = load(orig_path, 16000); eo = emb(o16)

print(f"{'archivo':34s} SIG   BAK   OVRL  cola_dB  sim    centroide  >4kHz%")
for p in [orig_path] + cands:
    y, fs = load(p)
    d = dnsmos(y, fs)
    y16 = librosa.resample(y, orig_sr=fs, target_sr=16000)
    sim = float((emb(y16) * eo).sum())
    S = np.abs(librosa.stft(y.astype(np.float32), n_fft=2048)) ** 2
    f = librosa.fft_frequencies(sr=fs, n_fft=2048)
    hf = 100 * S[f > 4000].sum() / S.sum()
    c = librosa.feature.spectral_centroid(y=y.astype(np.float32), sr=fs).mean()
    print(f"{os.path.basename(p):34s} {d[0]:.2f}  {d[1]:.2f}  {d[2]:.2f}  {tail(y, fs):7.1f}  {sim:.3f}  {c:7.0f}Hz  {hf:5.1f}")
