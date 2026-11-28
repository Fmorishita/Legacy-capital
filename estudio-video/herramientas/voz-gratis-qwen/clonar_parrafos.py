import sys, time, torch, soundfile as sf, json
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
M, REF, REFTXT, GUION, OUT = sys.argv[1:6]
only = [int(x) for x in sys.argv[6].split(',')] if len(sys.argv) > 6 and sys.argv[6] else None
seed0 = int(sys.argv[7]) if len(sys.argv) > 7 else 100
m = Qwen3TTSModel.from_pretrained(M, dtype=torch.float32, device_map="cpu")
prompt = m.create_voice_clone_prompt(ref_audio=REF, ref_text=REFTXT, x_vector_only_mode=False)
lines = [l.strip() for l in open(GUION) if l.strip()]
for i, t in enumerate(lines):
    if only and i not in only: continue
    torch.manual_seed(seed0 + i); t0 = time.time()
    w, sr = m.generate_voice_clone(text=t, language="Spanish", voice_clone_prompt=prompt)
    sf.write(f'{OUT}/p{i:02d}.wav', w[0], sr)
    print(i, 'gen', round(time.time() - t0, 1), 'dur', round(len(w[0]) / sr, 2), flush=True)
