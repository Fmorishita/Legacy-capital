#!/usr/bin/env python3
"""Trae videos grandes al contenedor sin pasarlos por la conversación.

  python3 herramientas/bajar.py drive <enlace-o-id> <salida.mp4>
      Archivo de Drive compartido como "Cualquier persona con el enlace" (cualquier tamaño).
      El conector de Drive solo baja hasta 10 MB; esto usa la descarga directa.
  python3 herramientas/bajar.py unir <salida.mp4> <parte1> <parte2> ...
      Une las partes que la Sala de Revisión guarda por separado (campo `partes`, en orden).
      Cada parte se trae antes con Artifact read, path = id del asset.
  python3 herramientas/bajar.py partir <archivo> [MB=14]
      Parte un archivo para subirlo a la Sala con Artifact (límite 15 MB por archivo);
      luego se guarda la lista de ids en el campo `partes` del documento.
"""
import os
import re
import subprocess
import sys


def drive(enlace, salida):
    m = re.search(r"(?:/d/|id=)([\w-]{20,})", enlace)
    fid = m.group(1) if m else enlace.strip()
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    r = subprocess.run(["curl", "-sSL", "--fail", "-o", salida, "-w", "%{content_type} %{size_download}", url], capture_output=True, text=True)
    tipo = r.stdout.split(" ")[0] if r.stdout else ""
    if r.returncode != 0 or tipo.startswith("text/html"):
        if os.path.exists(salida):
            os.remove(salida)
        sys.exit("No se pudo bajar: el archivo no está compartido como 'Cualquier persona con el enlace' o el enlace no es de un archivo.")
    print(f"{salida}: {os.path.getsize(salida) / 1e6:.1f} MB ({tipo})")


def unir(salida, partes):
    with open(salida, "wb") as out:
        for p in partes:
            with open(p, "rb") as f:
                out.write(f.read())
    print(f"{salida}: {os.path.getsize(salida) / 1e6:.1f} MB de {len(partes)} partes")


def partir(archivo, mb=14):
    tam = int(mb * 1024 * 1024)
    base, ext = os.path.splitext(archivo)
    salidas = []
    with open(archivo, "rb") as f:
        i = 1
        while True:
            b = f.read(tam)
            if not b:
                break
            p = f"{base}-parte{i}{ext}"
            with open(p, "wb") as o:
                o.write(b)
            salidas.append(p)
            i += 1
    print("\n".join(salidas))
    return salidas


if __name__ == "__main__":
    a = sys.argv
    if len(a) >= 4 and a[1] == "drive":
        drive(a[2], a[3])
    elif len(a) >= 4 and a[1] == "unir":
        unir(a[2], a[3:])
    elif len(a) >= 3 and a[1] == "partir":
        partir(a[2], float(a[3]) if len(a) > 3 else 14)
    else:
        print(__doc__)
