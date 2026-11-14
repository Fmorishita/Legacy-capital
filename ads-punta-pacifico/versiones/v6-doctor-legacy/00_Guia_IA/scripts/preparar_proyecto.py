#!/usr/bin/env python3
"""Restore the exact packaged HTML project from source ZIP + classified media.

No network, generation or rendering. Existing changed files are preserved unless
--refresh is explicitly passed. Run from any working directory.
"""
import argparse,hashlib,json,os,re,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--dry-run',action='store_true');p.add_argument('--refresh',action='store_true');p.add_argument('--hardlink',action='store_true',help='Use hardlinks for restoration on this same disk; do not edit linked media in place');a=p.parse_args()
 plan=json.loads((ROOT/'05_Estructura_y_timeline/restauracion_proyecto.json').read_text());count=0
 archive=ROOT/'00_Guia_IA/Estructura_codigo_Doctor_V6_Legacy.zip'
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None,'Corrupt source ZIP'
  for item in z.infolist():
   rel=Path(item.filename)
   if item.is_dir():continue
   target=ROOT/rel
   assert target.resolve().is_relative_to((ROOT/'06_Proyecto_HyperFrames').resolve()),'Unsafe source ZIP path'
   data=z.read(item);digest=hashlib.sha256(data).hexdigest()
   if target.exists() and sha(target)!=digest and not a.refresh:raise ValueError('Preserving changed code: '+str(rel))
   if not a.dry_run and (not target.exists() or sha(target)!=digest):
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():target.unlink()
    target.write_bytes(data)
 for item in plan['runtime_assets']:
  src=ROOT/item['source'];dst=ROOT/item['destination']
  assert src.resolve().is_relative_to(ROOT.resolve()) and dst.resolve().is_relative_to((ROOT/'06_Proyecto_HyperFrames').resolve())
  assert src.is_file() and sha(src)==item['sha256'],'Missing/changed classified media: '+str(src)
  if dst.exists() and sha(dst)!=item['sha256'] and not a.refresh:raise ValueError('Preserving changed asset: '+str(dst))
  if not a.dry_run and (not dst.exists() or sha(dst)!=item['sha256']):
   dst.parent.mkdir(parents=True,exist_ok=True)
   if dst.exists():dst.unlink()
   if a.hardlink:
    try:os.link(src,dst)
    except OSError:shutil.copy2(src,dst)
   else:shutil.copy2(src,dst)
  count+=1
 if not a.dry_run:
  project=ROOT/'06_Proyecto_HyperFrames'
  for item in plan['project_code']:
   assert sha(ROOT/item['path'])==item['sha256'],'Project code mismatch: '+item['path']
  h='\n'.join(x.read_text() for x in [project/'index.html',*(project/'compositions').glob('*.html')])
  assert all((project/r).is_file() for r in set(re.findall(r'assets/[A-Za-z0-9_./-]+',h))),'Missing HTML asset'
 print(json.dumps({'restored':not a.dry_run,'runtime_assets':count,'project_code_files':len(plan['project_code']),'project':'06_Proyecto_HyperFrames','paid_calls':0},indent=2))
if __name__=='__main__':main()
