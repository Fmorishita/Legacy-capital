#!/usr/bin/env python3
"""Arma Legacy Studio en Claude SIN tocar la carpeta de GPT.

1. Copia ads-punta-pacifico/editor/dist (trabajo de GPT) a claude-studio/build/dist.
2. Aplica a esa COPIA los cambios de Claude (parches de texto en app.js y exporter.js)
   y agrega los archivos propios de claude-studio/editor/.
3. Genera build/dist/claude-page.html para publicarlo como artifact y la lista de archivos.

Si GPT cambia su editor, vuelve a correr este script: si un parche ya no encaja, avisa
exactamente cuál, en lugar de romper el editor.

  python3 claude-studio/tools/armar.py            arma build/
  python3 claude-studio/tools/armar.py --lista    además imprime los archivos a publicar
"""
import os
import re
import shutil
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
GPT = os.path.join(RAIZ, "ads-punta-pacifico")
ORIGEN = os.path.join(GPT, "editor", "dist")
BUILD = os.path.join(AQUI, "..", "build", "dist")
PROPIOS = os.path.join(AQUI, "..", "editor")

PARCHES = {
    "app.js": [
        ("import {mountAI,projectRevision} from './ai.js';",
         "import {mountAI,projectRevision} from './ai.js';\nimport {conectarNube,CloudStore,mountClaude} from './claude-cloud.js';"),
        ("const store=new ProjectStore();",
         "let store=new ProjectStore();let nube=null;\nconst textoGuardado=()=>store.modo==='nube'?'Guardado en la nube · todos tus dispositivos':'Guardado en este navegador';"),
        ("if(n===saveGeneration)status('Guardado en este navegador',true);",
         "if(n===saveGeneration)status(textoGuardado(),true);"),
        ("else status('Guardado en este navegador',true);",
         "else status(textoGuardado(),true);\n $('projectStateLabel')&&($('projectStateLabel').textContent=store.modo==='nube'?'Edición privada · Guardado en la nube':'Edición privada · Guardado en este navegador');"),
        ("original=await(await fetch('doctor-v6.json')).json();wire();",
         "try{nube=await conectarNube();if(nube)store=new CloudStore(nube);}catch(e){console.warn(e);}\n original=await(await fetch('doctor-v6.json')).json();wire();"),
        ("aiPanel=mountAI({getProject:()=>project,getSelectedSceneId:()=>selectedSceneId,store,openTab:tab,notify:UI.toast,async applyResult(next,meta){",
         "aiPanel=(nube?(h=>mountClaude(h,nube)):mountAI)({getProject:()=>project,getSelectedSceneId:()=>selectedSceneId,store,openTab:tab,notify:UI.toast,revision:projectRevision,getTime:()=>engine?.currentTime||0,async applyResult(next,meta){"),
        ("<p>Disponibles en este navegador. Descarga una copia portable para conservarlos fuera de este dispositivo.</p>",
         "<p>${store.modo==='nube'?'Guardados en la nube: los ves desde cualquier dispositivo.':'Disponibles en este navegador. Descarga una copia portable para conservarlos fuera de este dispositivo.'}</p>"),
        ("UI.toast('Versión guardada en el historial de este navegador.')",
         "UI.toast(store.modo==='nube'?'Versión guardada en el historial (nube).':'Versión guardada en el historial de este navegador.')"),
    ],
    "exporter.js": [
        ("export function downloadBlob(blob, filename) {\n",
         "export function downloadBlob(blob, filename) {\n  // Dentro de Claude las descargas pasan por la capacidad «downloads» (un <a download> no funciona ahí).\n"
         "  if (globalThis.__legacyDownloads) return globalThis.__legacyDownloads.save({filename, data: blob}).catch(e => { if (e?.code !== 'declined') throw new Error('No se pudo descargar: ' + (e?.message || e?.code)); });\n"),
    ],
}


def main():
    if not os.path.isdir(ORIGEN):
        sys.exit(f"No encuentro el editor de GPT en {ORIGEN}")
    # Música y SFX de stock: el preparador oficial de GPT los descarga (quedan fuera de Git).
    if not os.path.exists(os.path.join(ORIGEN, "assets", "audio", "i-can-hear-your-heartbeat-1000.mp3")):
        subprocess.run([sys.executable, os.path.join(GPT, "scripts", "preparar.py"), "--perfil", "editor"], check=True, stdout=subprocess.DEVNULL)
    if os.path.exists(BUILD):
        shutil.rmtree(BUILD)
    shutil.copytree(ORIGEN, BUILD, ignore=shutil.ignore_patterns("server", "claude-page.html"))
    for archivo, cambios in PARCHES.items():
        p = os.path.join(BUILD, archivo)
        s = open(p, encoding="utf-8").read()
        for viejo, nuevo in cambios:
            if s.count(viejo) != 1:
                sys.exit(f"El parche de {archivo} ya no encaja (GPT cambió este fragmento):\n  {viejo[:90]}…")
            s = s.replace(viejo, nuevo)
        open(p, "w", encoding="utf-8").write(s)
    for f in os.listdir(PROPIOS):
        shutil.copy2(os.path.join(PROPIOS, f), os.path.join(BUILD, f))
    # Página para Claude: Claude pone su propio <head>, así que va título, estilos y <body>.
    src = open(os.path.join(BUILD, "index.html"), encoding="utf-8").read()
    body = re.search(r"<body[^>]*>(.*)</body>", src, re.S).group(1).strip()
    open(os.path.join(BUILD, "claude-page.html"), "w", encoding="utf-8").write(
        "<title>Legacy Studio</title>\n<meta name=\"theme-color\" content=\"#0e1420\">\n<link rel=\"stylesheet\" href=\"styles.css\">\n" + body + "\n")
    archivos = sorted(os.path.relpath(os.path.join(r, f), BUILD) for r, _, fs in os.walk(BUILD) for f in fs
                      if f not in ("index.html", "claude-page.html", "render.html") and "licenses" not in r)
    print(f"build/dist listo: {sum(len(c) for c in PARCHES.values())} parches, {len(os.listdir(PROPIOS))} archivos propios, {len(archivos)} archivos a publicar")
    if "--lista" in sys.argv:
        print("\n".join(archivos))


if __name__ == "__main__":
    main()
