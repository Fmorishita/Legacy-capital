import sys, time, torch, soundfile as sf, json
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
M, REF, REFTXT, JOBS, OUT = sys.argv[1:6]
m = Qwen3TTSModel.from_pretrained(M, dtype=torch.float32, device_map="cpu")
prompt = m.create_voice_clone_prompt(ref_audio=REF, ref_text=REFTXT, x_vector_only_mode=False)
for name, text, seed in json.load(open(JOBS)):
    torch.manual_seed(seed); t0 = time.time()
    w, sr = m.generate_voice_clone(text=text, language="Spanish", voice_clone_prompt=prompt)
    sf.write(f'{OUT}/{name}.wav', w[0], sr)
    print(name, 'gen', round(time.time() - t0, 1), 'dur', round(len(w[0]) / sr, 2), flush=True)
