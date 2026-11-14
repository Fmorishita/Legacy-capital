#!/usr/bin/env python3
"""Prepara medios de trabajo desde el repositorio y las fuentes oficiales.
No utiliza servicios de IA ni créditos. Requiere Pillow y FFmpeg para los proyectos.
"""
import argparse,hashlib,json,os,shutil,subprocess,sys,tempfile,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def safe(relative):
 p=(ROOT/relative).resolve()
 if ROOT.resolve() not in p.parents:raise ValueError('Ruta fuera del paquete')
 return p
def download(item,destination):
 cache=ROOT/'_cache'/item['sha256'];cache.parent.mkdir(exist_ok=True)
 if not cache.exists() or sha(cache)!=item['sha256']:
  request=urllib.request.Request(item['url'],headers={'User-Agent':'LegacyCapital-project-preparation/1.0'})
  with urllib.request.urlopen(request,timeout=60) as response,tempfile.NamedTemporaryFile(dir=cache.parent,delete=False) as out:
   shutil.copyfileobj(response,out);tmp=Path(out.name)
  if sha(tmp)!=item['sha256']:tmp.unlink();raise ValueError('El archivo de la fuente cambió: '+item['target'])
  tmp.replace(cache)
 shutil.copy2(cache,destination)
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--perfil',choices=['todos','editor','doctor-v6','doctor-v5','empresario-v5','california-v5'],default='todos');parser.add_argument('--sin-red',action='store_true');parser.add_argument('--force',action='store_true');args=parser.parse_args()
 data=json.loads((ROOT/'catalogo_medios.json').read_text());prefix={'doctor-v6':'versiones/v6-doctor-legacy/','doctor-v5':'versiones/v5/02_Doctor/','empresario-v5':'versiones/v5/03_Empresario/','california-v5':'versiones/v5/04_California/','editor':'editor/'}
 selected=[x for x in data['files'] if args.perfil=='todos' or x['target'].startswith(prefix[args.perfil]) or args.perfil.endswith('-v5') and x['target'].startswith(('versiones/v5/01_Marca_y_tipografias/','versiones/v5/05_Efectos_sonoros_compartidos/'))]
 complete=[];pending=[]
 for item in selected:
  dst=safe(item['target']);dst.parent.mkdir(parents=True,exist_ok=True)
  if dst.exists() and not args.force:complete.append(item['target']);continue
  if item['method']=='download':
   if args.sin_red:pending.append(item['target']);continue
   download(item,dst)
  else:
   src=safe(item['source'])
   if sha(src)!=item['sha256']:raise ValueError('Checksum incorrecto: '+item['source'])
   if item['method']=='copy':shutil.copy2(src,dst)
   elif item['method']=='image':
    try:from PIL import Image
    except ImportError:raise SystemExit('Instala Pillow: python3 -m pip install Pillow')
    with Image.open(src) as im:im.save(dst)
   elif item['method']=='audio':subprocess.run(['ffmpeg','-v','error','-y','-threads','2','-i',str(src),'-ar','48000','-ac','2','-c:a','pcm_s16le',str(dst)],check=True)
  complete.append(item['target'])
 report={'perfil':args.perfil,'prepared':len(complete),'pending_downloads':pending,'note':'Imágenes de trabajo JPEG92, voces FLAC sin pérdida, mezclas AAC de referencia. Originales exactos y stems en el kit de Drive.'}
 print(json.dumps(report,ensure_ascii=False,indent=2))
 if pending:raise SystemExit(2)
if __name__=='__main__':main()
