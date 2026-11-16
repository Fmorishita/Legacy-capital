# Dinámica de voz de estudio + nivel final. Uso: python 4_dinamica_nivel.py entrada.wav salida.wav [lufs=-17.5]
# 1) lleva la voz a -20 LUFS, 2) de-esser suave, 3) compresión 2.5:1, 4) loudnorm en dos pasadas a -17.5 LUFS / pico -2 dBTP.
import sys, json, subprocess

src, dst = sys.argv[1], sys.argv[2]
target = float(sys.argv[3]) if len(sys.argv) > 3 else -17.5
tmp = dst + '.tmp.wav'

def measure(path, pre=''):
    af = (pre + ',' if pre else '') + 'loudnorm=I=%s:TP=-2:LRA=7:print_format=json' % target
    err = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', af, '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(err[err.rfind('{'):])

g = -20.0 - float(measure(src)['input_i'])
chain = f'volume={g:.2f}dB,deesser=i=0.35:m=0.5:f=0.5,acompressor=threshold=-24dB:ratio=2.5:attack=8:release=120:knee=3'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', chain, '-ar', '48000', '-c:a', 'pcm_f32le', tmp], check=True)
m = measure(tmp)
ln = (f"loudnorm=I={target}:TP=-2:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
      f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', ln, '-ar', '48000', '-c:a', 'pcm_s16le', dst], check=True)
f = measure(dst)
print(f"{dst}: {f['input_i']} LUFS, pico {f['input_tp']} dBTP")
subprocess.run(['rm', '-f', tmp])
