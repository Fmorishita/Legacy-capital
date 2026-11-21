# Reconocimiento de fonemas (wav2vec2 XLSR-53 espeak, sin modelo de lenguaje) para revisar palabras puntuales.
# Uso: python qa_fonemas.py ini fin archivo1.wav archivo2.wav ...
import sys, numpy as np, soundfile as sf, librosa, torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
a, b = float(sys.argv[1]), float(sys.argv[2])
proc = Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-xlsr-53-espeak-cv-ft')
model = Wav2Vec2ForCTC.from_pretrained('facebook/wav2vec2-xlsr-53-espeak-cv-ft').eval()
for p in sys.argv[3:]:
    y, fs = sf.read(p, dtype='float64'); y = y if y.ndim == 1 else y.mean(1)
    y = librosa.resample(y[int(a * fs):int(b * fs)], orig_sr=fs, target_sr=16000).astype(np.float32)
    x = proc(y, sampling_rate=16000, return_tensors='pt')
    with torch.inference_mode():
        ids = model(x.input_values).logits.argmax(-1)
    print(f'{p.split("/")[-1]:26s} {proc.batch_decode(ids)[0]}')
