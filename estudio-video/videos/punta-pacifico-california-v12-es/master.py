# Master del audio del video: loudnorm en dos pasadas a -14 LUFS + limitador (pico <= -1 dBFS), video copiado.
# Uso: python master.py entrada.mp4 salida.mp4
import sys, json, subprocess
src, dst = sys.argv[1], sys.argv[2]
def ln_measure(path):
    err = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-vn', '-af', 'loudnorm=I=-14:TP=-2:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return json.loads(err[err.rfind('{'):])
m = ln_measure(src)
af = (f"loudnorm=I=-14:TP=-2:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
      f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
      "alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-c:v', 'copy', '-af', af, '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], check=True)
f = ln_measure(dst)
vol = subprocess.run(['ffmpeg', '-hide_banner', '-i', dst, '-vn', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
peak = [l for l in vol.splitlines() if 'max_volume' in l][0].split(':')[-1].strip()
print(f"{dst}: {f['input_i']} LUFS integrada, pico de muestra {peak}, true peak {f['input_tp']} dBTP")
