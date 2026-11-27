from pathlib import Path
import json,hashlib,base64,mimetypes,subprocess,shutil
ROOT=Path(__file__).resolve().parents[1];dist=ROOT/'dist';static={};assets={}
for f in dist.rglob('*'):
 if not f.is_file() or 'server' in f.relative_to(dist).parts:continue
 name=f.relative_to(dist).as_posix();data=f.read_bytes();mime=mimetypes.guess_type(name)[0] or 'application/octet-stream'
 if f.suffix in ['.js','.mjs']:mime='text/javascript; charset=utf-8'
 elif f.suffix in ['.html','.css','.json']:mime+='; charset=utf-8'
 entry={'mime':mime,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()};assets[name]=entry
 if f.suffix in ['.html','.js','.css','.json','.ttf'] or name.startswith('assets/thumbs/') or name=='assets/images/doctor-01.jpg':static[name]={**entry,'base64':base64.b64encode(data).decode()}
(ROOT/'worker/static-files.mjs').write_text('export const STATIC='+json.dumps(static,separators=(',',':'))+';\nexport const ASSETS='+json.dumps(assets,separators=(',',':'))+';\n')
(ROOT/'bootstrap-manifest.json').write_text(json.dumps(assets,indent=2))
(dist/'server').mkdir(exist_ok=True)
esbuild=ROOT/'node_modules/.bin/esbuild'
if not esbuild.exists():esbuild=Path(shutil.which('esbuild') or '/workspace/punta-pacifico/node_modules/.bin/esbuild')
if not esbuild.exists():raise SystemExit('Instala esbuild en este proyecto: npm install --no-save esbuild')
subprocess.run([str(esbuild),str(ROOT/'worker/index.mjs'),'--bundle','--format=esm','--platform=browser','--target=es2022','--minify','--outfile='+str(dist/'server/index.js')],check=True)
print(json.dumps({'worker_bytes':(dist/'server/index.js').stat().st_size,'embedded_files':len(static),'bucket_files':len(assets)}))
