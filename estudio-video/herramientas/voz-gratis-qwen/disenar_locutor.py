import sys, time, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(4)
m=Qwen3TTSModel.from_pretrained(sys.argv[1], dtype=torch.float32, device_map="cpu")
TEXT="Hay casas de dos habitaciones desde doscientos quince mil dólares. Imagina despertar en tu casa y pasar la mañana en la alberca. ¿Se arma una partida de pickleball?"
I1="Deep, warm and resonant adult male voice in his mid forties, native Mexican Spanish speaker, low pitch. Confident, friendly real-estate commercial narrator with a lively, flowing, fast rhythm, expressive intonation that rises and falls naturally, a smile in the voice, crisp diction, clean close-mic studio recording."
I2="Voz masculina grave y cálida de un hombre de unos cuarenta y cinco años, español mexicano nativo. Narrador de anuncio inmobiliario con ritmo ágil y fluido, entonación expresiva y natural, sonriente y seguro, dicción nítida, grabación de estudio cercana y limpia."
for name,ins,seed in [('d1',I1,3),('d2',I1,21),('d3',I1,57),('d4',I2,3),('d5',I2,21),('d6',I2,57)]:
    torch.manual_seed(seed); t=time.time()
    w,sr=m.generate_voice_design(text=TEXT, language="Spanish", instruct=ins)
    sf.write(f'{name}.wav', w[0], sr); print(name,'gen',round(time.time()-t,1),'dur',round(len(w[0])/sr,2),flush=True)
