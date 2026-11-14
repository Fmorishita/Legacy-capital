#!/usr/bin/env python3
"""Verify unmodified delivery files against their SHA-256 hashes."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
m=json.loads((ROOT/'00_Guia_IA/Manifest_Kit_Doctor_V6.json').read_text());bad=[]
for f in m['files']:
 p=ROOT/f['path']
 if not p.is_file():bad.append({'path':f['path'],'issue':'missing'});continue
 h=hashlib.sha256()
 with p.open('rb') as s:
  for b in iter(lambda:s.read(1048576),b''):h.update(b)
 if h.hexdigest()!=f['sha256']:bad.append({'path':f['path'],'issue':'changed'})
print(json.dumps({'files':len(m['files']),'failures':bad,'ok':not bad},ensure_ascii=False,indent=2));sys.exit(bool(bad))
