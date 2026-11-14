#!/usr/bin/env python3
"""Genera dist/claude-page.html: el mismo editor (index.html) en el formato de página de Claude.

Claude envuelve la página con su propio <!doctype>/<head>, así que aquí va solo el título,
la hoja de estilos y el contenido del <body>. Los demás archivos de dist/ se publican tal cual.
Uso: python3 tools/artifact-page.py  →  luego Artifact publish con dist/claude-page.html + files.
"""
import os
import re
import sys

dist = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")
src = open(os.path.join(dist, "index.html"), encoding="utf-8").read()
body = re.search(r"<body[^>]*>(.*)</body>", src, re.S).group(1).strip()
page = ("<title>Legacy Studio</title>\n"
        '<meta name="description" content="Editor de video de Legacy Capital conectado a Claude.">\n'
        '<meta name="theme-color" content="#0e1420">\n'
        '<link rel="stylesheet" href="styles.css">\n' + body + "\n")
out = os.path.join(dist, "claude-page.html")
open(out, "w", encoding="utf-8").write(page)
files = sorted(os.path.relpath(os.path.join(r, f), dist) for r, _, fs in os.walk(dist) for f in fs
               if f not in ("index.html", "claude-page.html", "render.html") and "licenses" not in r)
print(out, len(files), "archivos")
if "--lista" in sys.argv:
    print("\n".join(files))
