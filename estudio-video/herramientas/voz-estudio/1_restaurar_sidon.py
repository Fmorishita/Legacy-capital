# Restauración de voz con Sidon v0.1 (sarulab-speech, licencia MIT), modelos TorchScript para CPU.
# Uso: python 1_restaurar_sidon.py entrada.wav salida.wav
# Basado en el app.py del demo oficial (sarulab-speech/sidon_demo_beta).
import sys
import numpy as np
import soundfile as sf
import torch
import torchaudio
import transformers
from huggingface_hub import hf_hub_download

src, dst = sys.argv[1], sys.argv[2]
torch.set_num_threads(4)
fe_path = hf_hub_download("sarulab-speech/sidon-v0.1", filename="feature_extractor_cpu.pt")
dec_path = hf_hub_download("sarulab-speech/sidon-v0.1", filename="decoder_cpu.pt")
pre = transformers.SeamlessM4TFeatureExtractor.from_pretrained("facebook/w2v-bert-2.0")
fe = torch.jit.load(fe_path, map_location="cpu").eval()
dec = torch.jit.load(dec_path, map_location="cpu").eval()

y, sr = sf.read(src, dtype="float32")
if y.ndim > 1:
    y = y.mean(1)
y = 0.9 * y / (np.abs(y).max() + 1e-9)
n_out = int(48_000 / sr * len(y))
w = torch.from_numpy(y).view(1, -1)
w = torchaudio.functional.highpass_biquad(w, sr, 50)
w16 = torchaudio.functional.resample(w, sr, 16_000)
w16 = torch.nn.functional.pad(w16, (0, 24000))
outs, cache = [], None
with torch.inference_mode():
    for chunk in w16.view(-1).split(16000 * 96):
        inp = pre(torch.nn.functional.pad(chunk, (160, 160)).numpy(), sampling_rate=16000, return_tensors="pt")
        feat = fe(inp["input_features"])["last_hidden_state"]
        if cache is not None:
            feat = torch.cat([cache, feat], dim=1)
        outs.append(dec(feat.transpose(1, 2)).view(-1)[:-960])
        cache = feat[:, -1:]
o = torch.cat(outs).numpy()[:n_out]
sf.write(dst, o / (np.abs(o).max() + 1e-9) * 0.9, 48_000)
print("ok", dst, round(len(o) / 48_000, 2), "s")
