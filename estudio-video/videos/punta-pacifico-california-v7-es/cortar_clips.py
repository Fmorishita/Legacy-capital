# Corta los clips de Higgsfield (Seedance 2.5, 720p) al largo exacto de cada toma, con aceleración opcional.
# Uso: python cortar_clips.py carpeta_clips_higgsfield
# Lee CLIPS (toma -> archivo, inicio en el clip, velocidad) y los tiempos de toma de index.html; escribe assets/vid/<toma>.mp4 (1080x1920, 30 fps, sin audio).
import json, re, subprocess, sys
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v7-es/'
SRC = sys.argv[1]
CLIPS = json.load(open(P + 'clips.json'))  # {"toma": ["archivo.mp4", inicio_s, velocidad, "toma_final_opcional"]}
h = open(P + 'index.html').read()
span = {m.group(1): (float(m.group(2)), float(m.group(3))) for m in re.finditer(r'<div id="(\w+)" class="clip bg" data-start="([\d.]+)" data-duration="([\d.]+)"', h)}
for sid, spec in CLIPS.items():
    f, ss, sp = spec[:3]
    a, d = span[sid]
    if len(spec) > 3:  # un clip que cubre varias tomas seguidas
        b2, d2 = span[spec[3]]
        d = b2 + d2 - a
    need = d * sp + 0.15
    vf = f'setpts=PTS/{sp},fps=30,scale=1080:1920:flags=lanczos,format=yuv420p'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', str(ss), '-i', f'{SRC}/{f}', '-t', f'{need:.3f}', '-vf', vf, '-an',
                    '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', f'{P}assets/vid/{sid}.mp4'], check=True)
    out = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{P}assets/vid/{sid}.mp4'], capture_output=True, text=True).stdout)
    print(f'{sid:7s} toma {d:5.2f}s  <- {f} desde {ss}s x{sp}  = {out:.2f}s')
