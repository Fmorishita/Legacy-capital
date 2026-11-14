#!/usr/bin/env python3
"""Assemble portable V5 HTML projects from this owner's classified media.

No network, model generation or paid services. Existing different files are never
overwritten by default. Run after downloading the complete Drive folder.
"""
from pathlib import Path
import argparse,hashlib,json,re,shutil,zipfile

ROOT=Path(__file__).resolve().parents[2]
PROFILES={'salud':'02_Doctor','empresarios':'03_Empresario','california':'04_California'}

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run',action='store_true')
    parser.add_argument('--perfil',choices=tuple(PROFILES))
    parser.add_argument('--refresh-assets',action='store_true',help='Explicitly replace changed runtime assets with the classified V5 originals')
    args=parser.parse_args();result=[]
    for key,dirname in PROFILES.items():
        if args.perfil and args.perfil!=key:continue
        profile=ROOT/dirname;project=profile/'Proyecto_HyperFrames';source=ROOT/'00_Guia_IA'/f'Estructura_codigo_V5_{key}.zip'
        if not (project/'index.html').is_file():
            assert source.is_file(),f'Missing {source}; download the small code ZIP from00_Guia_IA'
            with zipfile.ZipFile(source) as z:
                assert z.testzip() is None
                for entry in z.infolist():
                    rel=Path(entry.filename)
                    if not rel.parts or rel.parts[0]!='Proyecto_HyperFrames' or entry.is_dir():continue
                    target=profile/rel
                    assert target.resolve().is_relative_to(project.resolve()),'Unsafe ZIP member'
                    if not target.exists() and not args.dry_run:
                        target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(entry))
        timeline=json.loads((profile/'Estructura_y_timeline/timeline_V5.json').read_text())
        # Code metadata supplies the original runtime filenames. The timeline
        # supplies the categorized image location and verifies its exact bytes.
        meta_path=project/'metadata.json'
        if meta_path.is_file():meta=json.loads(meta_path.read_text())
        else:
            with zipfile.ZipFile(source) as z:meta=json.loads(z.read('Proyecto_HyperFrames/metadata.json'))
        targets={s['id']:s for s in meta['shots']};assets=[]
        for shot in timeline['shots']:
            image=(profile/'Estructura_y_timeline'/shot['image']).resolve()
            assert image.is_relative_to(ROOT.resolve()) and image.is_file(),image
            assert sha(image)==shot['image_sha256'],f'Classified image changed: {image}'
            assets.append((image,project/targets[shot['id']]['local']))
        shared=ROOT/'01_Marca_y_tipografias'
        for name,target in [('OpenSans_Condensed_Bold.ttf','display.ttf'),('OpenSans_Semibold.ttf','text.ttf'),('OpenSans_ExtraBold.ttf','bold.ttf')]:
            assets.append((shared/'Tipografias'/name,project/'assets/fonts'/target))
        assets.extend([(shared/'Marca/logo_Punta_Pacifico_blanco.png',project/'assets/logo-white.png'),(shared/'Librerias/gsap.min.js',project/'assets/gsap.min.js'),(profile/'Audio/mezcla_final_V5.wav',project/'assets/audio/master_mix.wav')])
        for src,dst in assets:
            assert src.is_file(),src
            assert dst.resolve().is_relative_to(project.resolve()),dst
            if dst.exists() and sha(src)!=sha(dst) and not args.refresh_assets:
                raise ValueError(f'Preserving changed asset {dst}. Use --refresh-assets only to restore the V5 original.')
            if not args.dry_run and (not dst.exists() or sha(src)!=sha(dst)):
                dst.parent.mkdir(parents=True,exist_ok=True)
                if dst.exists() and dst.stat().st_nlink>1:dst.unlink()
                shutil.copy2(src,dst)
        if not args.dry_run:
            html=(project/'index.html').read_text()+'\n'+'\n'.join(f.read_text() for f in (project/'compositions').glob('*.html'))
            refs=set(re.findall(r'assets/[A-Za-z0-9_./-]+',html))
            assert all((project/rel).is_file() for rel in refs),f'{key}: runtime asset missing'
        result.append({'profile':key,'assets':len(assets),'project':str(project.relative_to(ROOT)),'dry_run':args.dry_run})
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
