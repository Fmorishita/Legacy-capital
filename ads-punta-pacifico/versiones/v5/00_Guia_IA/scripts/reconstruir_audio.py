#!/usr/bin/env python3
"""Reconstruye pistas de trabajo de V5 con las fuentes y la voz alineada.

Requiere FFmpeg en PATH y Python con numpy/scipy. No usa TTS ni servicios de IA.
La mezcla final V5 suministrada es la referencia exacta. Esta reconstrucción usa
la voz PCM16 alineada, mientras el máster original partió de una voz flotante;
esa cuantización y la versión de FFmpeg pueden producir diferencias pequeñas.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import sys

try:
    import numpy as np
    from scipy.io.wavfile import write
    from scipy.ndimage import uniform_filter1d, maximum_filter1d
except ImportError as error:
    raise SystemExit('Faltan dependencias: python -m pip install numpy scipy') from error

ROOT = Path(__file__).resolve().parents[2]
SR = 48000
PROFILES = {'doctor': '02_Doctor', 'empresario': '03_Empresario', 'california': '04_California'}
CROP = {
    'fast-small-sweep-166.mp3': (.07, .22),
    'short-transition-sweep-175.mp3': (.09, .23),
    'air-zoom-vacuum-2608.mp3': (.18, .30),
    'fast-whoosh-1490.mp3': (.18, .34),
    'cinematic-whoosh-fast-1492.mp3': (.28, .36),
    'quick-zoom-impact-772.mp3': (.055, .19),
}


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def run(args):
    return subprocess.run(args, capture_output=True, check=True)


def decode(path, seconds=None, start=None):
    args = ['ffmpeg', '-v', 'error']
    if start is not None:
        args += ['-ss', str(start)]
    args += ['-i', str(path)]
    if seconds is not None:
        args += ['-t', str(seconds)]
    args += ['-ar', str(SR), '-ac', '2', '-f', 'f32le', '-']
    return np.frombuffer(run(args).stdout, np.float32).reshape(-1, 2).copy()


def fit(audio, count):
    return np.pad(audio, ((0, max(0, count - len(audio))), (0, 0)))[:count]


def add(target, audio, second, gain=1):
    offset = round(second * SR)
    source_offset = max(0, -offset)
    offset = max(0, offset)
    count = min(len(target) - offset, len(audio) - source_offset)
    if count > 0:
        target[offset:offset + count] += audio[source_offset:source_offset + count] * gain


def crop_fx(path):
    audio = decode(path)
    original_peak = np.abs(audio).max(axis=1).argmax()
    before, after = CROP[path.name]
    lo = max(0, original_peak - round(before * SR))
    hi = min(len(audio), original_peak + round(after * SR))
    audio = audio[lo:hi].copy()
    fade = min(round(.014 * SR), len(audio) // 3)
    if fade:
        audio[:fade] *= np.linspace(0, 1, fade)[:, None]
        audio[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return audio


def measure(path):
    result = run(['ffmpeg', '-hide_banner', '-i', str(path), '-af',
                  'loudnorm=I=-15:TP=-1.2:LRA=9:print_format=json', '-f', 'null', '-'])
    text = result.stderr.decode('utf-8', errors='replace')
    return json.JSONDecoder().raw_decode(text[text.rfind('{'):])[0]


def check_source(path, catalog):
    relative = path.relative_to(ROOT).as_posix()
    row = catalog[relative]
    if not path.is_file() or path.stat().st_size != row['bytes'] or sha(path) != row['sha256']:
        raise ValueError(f'Fuente ausente o modificada: {relative}. Ejecutar descargar_fuentes_audio.py')


def one(key, replace=False):
    profile = ROOT / PROFILES[key]
    recipe = json.loads((profile / 'Estructura_y_timeline/audio_recipe.json').read_text(encoding='utf-8'))
    duration = float(recipe['duration'])
    count = round(duration * SR)
    voice_path = profile / 'Audio/voz_sola_alineada.wav'
    voice = fit(decode(voice_path), count)
    catalog = {x['local_path']: x for x in json.loads((ROOT / '00_Guia_IA/Registro_fuentes_audio.json').read_text())['files']}
    music = recipe['music']
    sources_by_name = {x['filename']: x for x in catalog.values()}
    source = ROOT / sources_by_name[music['file']]['local_path']
    check_source(source, catalog)
    bed = fit(decode(source, seconds=duration + .05, start=music['in']), count)
    rms = np.sqrt(np.mean(voice * voice, axis=1))
    env = uniform_filter1d(rms, size=round(.06 * SR))
    active = (env > .012).astype(np.float32)
    activity = uniform_filter1d(maximum_filter1d(active, size=round(.20 * SR)), size=round(.18 * SR))
    clock = np.arange(count) / SR
    duck = .83 + .17 * (1 - activity)
    fade = np.minimum(1, clock / .04) * np.minimum(1, np.maximum(0, (duration - clock) / .45))
    pay0 = next(s for s in recipe['shots'] if s['kind'] == 'pay0')
    pay2 = next(s for s in recipe['shots'] if s['kind'] == 'pay2')
    focus = np.ones(count)
    focus[(clock > pay0['start']) & (clock < pay2['end'])] = .84
    bed *= ((10 ** (music['gain_db'] / 20)) * duck * fade * focus)[:, None]
    effects = np.zeros((count, 2), np.float32)
    for event in recipe['sfx_events']:
        path = ROOT / sources_by_name[event['effect']]['local_path']
        check_source(path, catalog)
        add(effects, crop_fx(path), float(event['start']), float(event['gain']))
    premix = (voice + bed).astype(np.float32)
    for event in recipe['sfx_events']:
        path = ROOT / sources_by_name[event['effect']]['local_path']
        add(premix, crop_fx(path), float(event['start']), float(event['gain']))
    out = profile / 'Audio_reconstruido'
    names = ['musica_editada.wav', 'efectos.wav', 'premaster.wav', 'mezcla_reconstruida.wav', 'Informe_reconstruccion.json']
    if not replace and any((out / name).exists() for name in names):
        raise FileExistsError(f'{out.relative_to(ROOT)} ya contiene resultados; usar --replace para sustituirlos')
    out.mkdir(parents=True, exist_ok=True)
    write(out / 'musica_editada.wav', SR, bed.astype(np.float32))
    write(out / 'efectos.wav', SR, effects)
    write(out / 'premaster.wav', SR, premix)
    measured = measure(out / 'premaster.wav')
    filters = (f"loudnorm=I=-15:TP=-1.2:LRA=9:measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
               f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
               f"offset={measured['target_offset']}:linear=true,atrim=duration={duration},apad=whole_dur={duration}")
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(out / 'premaster.wav'), '-af', filters,
         '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', str(out / 'mezcla_reconstruida.wav')])
    levels = measure(out / 'mezcla_reconstruida.wav')
    original = profile / 'Audio/mezcla_final_V5.wav'
    reference = measure(original) if original.is_file() else None
    report = {'perfil': key, 'duration': duration, 'sample_rate': SR, 'channels': 2,
              'recipe': 'Cortes, ducking, foco de pagos, transitorios y ganancias documentados de V5',
              'reference_exact_mix': 'Audio/mezcla_final_V5.wav',
              'bit_exact_claim': False,
              'limitation': 'La voz alineada PCM16 tiene cuantización respecto a la voz flotante del máster original; FFmpeg también puede variar por versión.',
              'levels_reconstructed': levels, 'levels_reference_v5': reference,
              'files': {name: {'bytes': (out / name).stat().st_size, 'sha256': sha(out / name)} for name in names[:-1]}}
    (out / 'Informe_reconstruccion.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'perfil': key, 'LUFS_reconstruido': levels['input_i'], 'dBTP_reconstruido': levels['input_tp'],
                      'LUFS_referencia': reference['input_i'] if reference else None,
                      'salida': out.relative_to(ROOT).as_posix()}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--perfil', choices=['todos'] + list(PROFILES), default='todos')
    parser.add_argument('--replace', action='store_true')
    args = parser.parse_args()
    for key in PROFILES if args.perfil == 'todos' else [args.perfil]:
        one(key, args.replace)


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
