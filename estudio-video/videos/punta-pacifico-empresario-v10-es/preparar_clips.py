# Prepara los clips de Seedance 2.5 (Dreamina, 720x1280, 24 fps) para el montaje: 1080x1920, 30 fps, sin audio,
# cortados al largo de cada toma. Si la toma dura más que el clip (s08: 4.48 s), se desacelera con interpolación.
# Uso: python preparar_clips.py <carpeta con s01.mp4 ...>   (lee las tomas de layout.json)
import json, subprocess, sys, os
P = os.path.dirname(os.path.abspath(__file__)) + '/'
SRC = sys.argv[1]
shots = {s['id']: s for s in json.load(open(P + 'layout.json'))['shots']}
os.makedirs(P + 'assets/vid', exist_ok=True)
for f in sorted(os.listdir(SRC)):
    sid = f[:-4]
    if not f.endswith('.mp4') or sid not in shots:
        continue
    need = shots[sid]['b'] - shots[sid]['a'] + 0.1
    src_d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{SRC}/{f}'], capture_output=True, text=True).stdout)
    sp = min(1.0, (src_d - 0.05) / need)
    vf = f'setpts=PTS/{sp:.4f},' if sp < 1 else ''
    vf += 'minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc,' if sp < 1 else 'fps=30,'
    vf += 'scale=1080:1920:flags=lanczos,format=yuv420p'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', f'{SRC}/{f}', '-t', f'{need:.3f}', '-vf', vf, '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', P + f'assets/vid/{sid}.mp4'], check=True)
    out = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', P + f'assets/vid/{sid}.mp4'], capture_output=True, text=True).stdout)
    print(f'{sid}: toma {need - 0.1:.2f} s ← clip {src_d:.2f} s ×{sp:.2f} = {out:.2f} s')
