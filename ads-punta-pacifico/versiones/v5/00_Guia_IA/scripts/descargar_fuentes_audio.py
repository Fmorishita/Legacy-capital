#!/usr/bin/env python3
"""Verifica o recupera las nueve fuentes oficiales usadas por los anuncios V5.

No crea audio ni usa un servicio de IA. El catálogo incluye URLs, tamaño y SHA256
de los archivos exactos. Los archivos correctos existentes se conservan.
"""
from pathlib import Path
import argparse
import hashlib
import json
import sys
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / '00_Guia_IA/Registro_fuentes_audio.json'


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', choices=['all', 'music', 'sfx'], default='all')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--replace', action='store_true',
                        help='Reemplazar un archivo local que no coincide con el original')
    args = parser.parse_args()
    data = json.loads(CATALOG.read_text(encoding='utf-8'))
    failures = []
    for item in data['files']:
        if args.only != 'all' and item['kind'] != args.only:
            continue
        dest = ROOT / item['local_path']
        assert dest.resolve().is_relative_to(ROOT), 'Ruta fuera del kit'
        if dest.is_file() and dest.stat().st_size == item['bytes'] and sha(dest) == item['sha256']:
            print('OK:', item['local_path'])
            continue
        if dest.exists() and not args.replace:
            failures.append(f'{item["local_path"]}: cambió; conservar copia o usar --replace')
            continue
        if args.dry_run:
            print('DESCARGAR:', item['local_path'], item['url'])
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        temp = dest.with_name(dest.name + '.part')
        try:
            request = urllib.request.Request(item['url'], headers={'User-Agent': 'Punta-Pacifico-V5-assets/1.0'})
            with urllib.request.urlopen(request, timeout=60) as response, temp.open('wb') as stream:
                while True:
                    block = response.read(1024 * 1024)
                    if not block:
                        break
                    stream.write(block)
            if temp.stat().st_size != item['bytes'] or sha(temp) != item['sha256']:
                raise ValueError('La fuente oficial cambió; revisar catálogo/licencia antes de sustituirla')
            temp.replace(dest)
            print('DESCARGADO Y VERIFICADO:', item['local_path'])
        except (OSError, ValueError, urllib.error.URLError) as error:
            if temp.exists():
                temp.unlink()
            failures.append(f'{item["local_path"]}: {error}')
    if failures:
        print('\n'.join(failures), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
