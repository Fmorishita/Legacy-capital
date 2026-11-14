#!/usr/bin/env python3
"""Validate the portable skill structure, versions and local reference links."""
from pathlib import Path
import argparse, hashlib, json, re

REQUIRED = ['SKILL.md','VERSION','metadata.json','README.md','CHANGELOG.md',
 'agents/openai.yaml','references/contexto-punta-pacifico.md',
 'references/guion-imagen-audio.md','references/qa-y-lecciones.md',
 'references/hyperframes-y-entrega.md','references/mantenimiento.md',
 'templates/proyecto.json','templates/storyboard.json','templates/decision.md',
 'scripts/install.py','scripts/export.py','scripts/validate.py']

def package_files(root):
    return sorted(p for p in root.rglob('*') if p.is_file()
                  and not any(x in {'.git','__pycache__','node_modules'} for x in p.relative_to(root).parts)
                  and p.suffix != '.pyc')

def validate(root):
    root = Path(root).resolve()
    errors = [f'Missing {name}' for name in REQUIRED if not (root/name).is_file()]
    if errors: raise ValueError('\n'.join(errors))
    text = (root/'SKILL.md').read_text()
    match = re.match(r'^---\n(.*?)\n---\n',text,re.S)
    if not match: raise ValueError('SKILL.md needs YAML frontmatter')
    fields = dict(re.findall(r'^(name|description):\s*(.+)$',match.group(1),re.M))
    name = fields.get('name','')
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',name) or len(name)>64:
        errors.append('Invalid skill name')
    if not fields.get('description'): errors.append('Missing skill description')
    meta = json.loads((root/'metadata.json').read_text())
    version = (root/'VERSION').read_text().strip()
    if not re.fullmatch(r'\d+\.\d+\.\d+',version): errors.append('Invalid VERSION')
    elif tuple(map(int,version.split('.'))) >= (1,2,0):
        if not (root/'references/higgsfield-y-presupuesto.md').is_file():
            errors.append('Missing references/higgsfield-y-presupuesto.md')
        if tuple(map(int,version.split('.'))) >= (1,3,0):
            if not (root/'references/entrega-portable-ia.md').is_file():
                errors.append('Missing references/entrega-portable-ia.md')
        if tuple(map(int,version.split('.'))) >= (1,4,0):
            if not (root/'references/marca-version-y-qa-visual.md').is_file():
                errors.append('Missing references/marca-version-y-qa-visual.md')
        if tuple(map(int,version.split('.'))) >= (1,5,0):
            if not (root/'references/editor-visual-y-feedback.md').is_file():
                errors.append('Missing references/editor-visual-y-feedback.md')
    if meta.get('name') != name or meta.get('version') != version:
        errors.append('Metadata name/version mismatch')
    if f'**{version}**' not in text: errors.append('SKILL.md version mismatch')
    if f'## {version}' not in (root/'CHANGELOG.md').read_text(): errors.append('Changelog version missing')
    for p in package_files(root):
        rel = p.relative_to(root)
        if p.name.startswith('.env') or p.suffix in {'.pem','.key','.zip','.mp4','.wav','.mp3','.png'}:
            errors.append(f'Unexpected payload {rel}')
        if p.stat().st_size > 1024*1024: errors.append(f'Unexpected large skill file {rel}')
        if p.suffix == '.json': json.loads(p.read_text())
        if p.suffix == '.py': compile(p.read_text(),str(rel),'exec')
        if p.suffix == '.md':
            for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
                if '://' in link or link.startswith(('#','/')): continue
                dest=(p.parent/link.split('#')[0]).resolve()
                if not dest.is_relative_to(root) or not dest.exists():
                    errors.append(f'Broken local link in {rel}: {link}')
    if errors: raise ValueError('\n'.join(errors))
    return {'ok':True,'name':name,'version':version,'files':len(package_files(root)),
            'skill_sha256':hashlib.sha256((root/'SKILL.md').read_bytes()).hexdigest()}

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--package',type=Path,default=Path(__file__).resolve().parents[1])
    args=parser.parse_args();print(json.dumps(validate(args.package),ensure_ascii=False,indent=2))
