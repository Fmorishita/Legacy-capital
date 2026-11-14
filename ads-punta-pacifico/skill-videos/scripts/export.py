#!/usr/bin/env python3
"""Create verified versioned/latest ZIPs without including project media or secrets."""
from pathlib import Path
import argparse, hashlib, json, shutil, zipfile
from validate import package_files, validate

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--package',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--out',type=Path,required=True)
    args=parser.parse_args();root=args.package.resolve();check=validate(root);out=args.out.resolve()
    if out.is_relative_to(root): raise ValueError('Export folder must be outside the skill')
    out.mkdir(parents=True,exist_ok=True)
    name,version=check['name'],check['version'];archive=out/f'{name}-{version}.zip'
    files=package_files(root)
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for f in files:
            # Fixed timestamps make an unchanged skill export byte-reproducible.
            info=zipfile.ZipInfo(name+'/'+f.relative_to(root).as_posix(),date_time=(2026,1,1,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
            z.writestr(info,f.read_bytes())
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        for f in files: assert hashlib.sha256(z.read(name+'/'+f.relative_to(root).as_posix())).hexdigest()==sha(f)
    latest=out/f'{name}-latest.zip';shutil.copy2(archive,latest)
    shutil.copy2(root/'SKILL.md',out/f'{name}-SKILL.md')
    manifest={**check,'archive':archive.name,'latest':latest.name,
              'archive_bytes':archive.stat().st_size,'archive_sha256':sha(archive),
              'files':[{'path':str(f.relative_to(root)),'bytes':f.stat().st_size,'sha256':sha(f)} for f in files]}
    assert sha(latest)==manifest['archive_sha256']
    (out/f'{name}-{version}-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    print(json.dumps({k:v for k,v in manifest.items() if k!='files'},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
