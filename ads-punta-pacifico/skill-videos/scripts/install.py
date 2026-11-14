#!/usr/bin/env python3
"""Install this one local skill and add an idempotent project activation rule."""
from pathlib import Path
from datetime import datetime, timezone
import argparse, hashlib, json, os, shutil, tempfile
from validate import package_files, validate

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()

def activate(workspace, source, target, name):
    workspace=Path(workspace).resolve()
    if not workspace.is_dir(): raise ValueError(f'Workspace does not exist: {workspace}')
    file=workspace/'AGENTS.md'
    start=f'<!-- {name}:begin -->';end=f'<!-- {name}:end -->'
    block=f'''{start}
## Anuncios y videos de Punta Pacífico

Cuando el usuario pida crear o cambiar videos, anuncios, reels, guiones, imágenes, voz, música, subtítulos o motion graphics de Punta Pacífico (a veces escrito Puente Pacífico), leer y aplicar la skill [videos-punta-pacifico](<{target/'SKILL.md'}>).

Fuente canónica editable: `{source}`. Copia instalada: `{target}`. Las instrucciones nuevas del usuario prevalecen sobre reglas anteriores.

El usuario autorizó mantener esta skill: al aplicar un cambio importante y reutilizable, actualizar regla/referencia, VERSION, metadata y CHANGELOG; validar, reinstalar, regenerar ZIP descargable y actualizar su entrega de Drive autorizada. Un cambio puntual de foto/precio va a configuración salvo que cambie una regla general. Conservar versiones y no afirmar aprobación estética que el usuario no haya dado. Ver references/mantenimiento.md. Esta regla actúa al trabajar en esas peticiones; no crea una vigilancia en segundo plano.
{end}'''
    content=file.read_text() if file.exists() else ''
    if start in content:
        if end not in content: raise ValueError(f'Incomplete managed block in {file}')
        before,rest=content.split(start,1);_,after=rest.split(end,1)
        updated=before+block+after
    else: updated=content.rstrip()+'\n\n'+block+'\n'
    file.write_text(updated.lstrip())
    return str(file)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--source',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--target',type=Path)
    parser.add_argument('--workspace',type=Path,action='append',default=[])
    parser.add_argument('--report',type=Path)
    args=parser.parse_args();source=args.source.resolve();check=validate(source);name=check['name']
    target=(args.target or Path.home()/'.agents/skills'/name).expanduser().resolve()
    if target.name != name: raise ValueError('Target must be a folder named '+name)
    backup=None
    if source != target:
        target.parent.mkdir(parents=True,exist_ok=True)
        temp=Path(tempfile.mkdtemp(prefix='.'+name+'-',dir=target.parent))
        try:
            for f in package_files(source):
                dest=temp/f.relative_to(source);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,dest)
            validate(temp)
            if target.exists():
                if not (target/'SKILL.md').is_file() or validate(target)['name']!=name:
                    raise ValueError('Refusing to replace an unrelated directory')
                stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
                backup=target.parent.parent/'skill-backups'/f'{name}-{stamp}'
                backup.parent.mkdir(parents=True,exist_ok=True);target.rename(backup)
            temp.rename(target)
        except Exception:
            if backup and backup.exists() and not target.exists(): backup.rename(target)
            if temp.exists(): shutil.rmtree(temp)
            raise
    validate(target)
    assert all(sha(f)==sha(target/f.relative_to(source)) for f in package_files(source))
    legacy=Path.home()/'.codex/skills'/name
    legacy.parent.mkdir(parents=True,exist_ok=True)
    compatibility='existing path preserved'
    if not os.path.lexists(legacy): legacy.symlink_to(target,target_is_directory=True);compatibility='symlink created'
    elif legacy.is_symlink() and legacy.resolve()==target: compatibility='symlink already correct'
    agents=[activate(w,source,target,name) for w in args.workspace]
    report={**check,'installed_path':str(target),'canonical_source':str(source),
            'compatibility_path':str(legacy),'compatibility_status':compatibility,
            'activation_files':agents,'backup':str(backup) if backup else None,
            'scope':'local agent environment; no cloud ChatGPT registration','hashes_match':True}
    if args.report:
        args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
