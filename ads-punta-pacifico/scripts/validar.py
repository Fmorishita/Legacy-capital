#!/usr/bin/env python3
"""Comprueba hashes del paquete y distingue descargas aún pendientes."""
from pathlib import Path
import json,hashlib,sys,argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--runtime',action='store_true');args=parser.parse_args()
d=json.loads((ROOT/'catalogo_medios.json').read_text());checked=set();missing=[];errors=[]
for x in d['files']:
 if x.get('source') and x['source'] not in checked:
  f=ROOT/x['source'];checked.add(x['source'])
  if not f.is_file() or hashlib.sha256(f.read_bytes()).hexdigest()!=x['sha256']:errors.append(x['source'])
 if args.runtime and not (ROOT/x['target']).is_file():missing.append(x['target'])
stock={x['sha256'] for x in d['licensed_sources']}
public_stock=[]
for f in ROOT.rglob('*'):
 if f.is_file() and f.suffix.lower() in ['.mp3','.wav'] and '_cache' not in f.parts:
  if hashlib.sha256(f.read_bytes()).hexdigest() in stock:public_stock.append(str(f.relative_to(ROOT)))
print(json.dumps({'ok':not errors and not missing,'unique_media_hashes_verified':len(checked),'materialization_entries':len(d['files']),'errors':errors,'runtime_missing':missing,'downloaded_licensed_working_files':public_stock,'note':'Los archivos licenciados descargados y los derivados runtime están excluidos de Git.'},ensure_ascii=False,indent=2))
sys.exit(bool(errors or missing))
