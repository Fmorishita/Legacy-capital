# Anuncios Punta Pacífico · Materiales para Claude

Aquí están los materiales de trabajo de **Doctor V5, Empresario V5, California V5 y Doctor V6 Legacy Capital**, junto con el código del editor visual. La prueba V6 Higgsfield rechazada queda excluida.

**Editor privado funcionando:** https://legacy-video-studio-fran.trimjewel4.chatgpt.site

## Empezar con Claude

1. Conecta o clona este repositorio y abre esta carpeta.
2. Lee `CLAUDE.md` y selecciona la versión que vas a editar.
3. Prepara sus medios. El comando descarga la música y los efectos directamente de sus fuentes oficiales y verifica SHA256; no consume créditos de generación.

```bash
python3 -m pip install Pillow numpy scipy
python3 ads-punta-pacifico/scripts/preparar.py --perfil doctor-v6
python3 ads-punta-pacifico/scripts/validar.py
```

FFmpeg debe estar instalado. También existen los perfiles `doctor-v5`, `empresario-v5`, `california-v5`, `editor` y `todos`. Las descargas y archivos reconstruidos están excluidos de Git.

Para abrir una copia del editor desde el repositorio:

```bash
python3 ads-punta-pacifico/scripts/preparar.py --perfil editor
python3 -m http.server 4173 --directory ads-punta-pacifico/editor/dist
```

Abre `http://localhost:4173`. El Site privado ya contiene sus propios recursos preparados.

## Qué contiene

- `versiones/v5/`: guiones, voces, subtítulos, fuentes, logos, planos, tiempos, música/SFX referenciados y composiciones HyperFrames de los tres anuncios históricos.
- `versiones/v6-doctor-legacy/`: el guion nuevo, 28 escenas, palabras y subtítulos finales, motion graphics, receta de mezcla y proyecto HyperFrames del Doctor con Legacy Capital.
- `medios/imagenes/`: fotografías y renders de trabajo con dimensiones originales, deduplicados por SHA. Las conversiones JPEG usan calidad 92; logos con transparencia conservan PNG.
- `medios/voces/`: síntesis original y locuciones alineadas en FLAC sin pérdida. `medios/mezclas-referencia/` contiene versiones AAC del audio completo con voz para revisar y componer.
- `editor/`: el sistema visual por escenas y capas. Guarda versiones en el navegador y exporta proyectos con sus medios, subtítulos y video.
- `catalogo_medios.json`: rutas de montaje, hashes, procedencia y enlaces a originales exactos de Drive. Los manifiestos copiados dentro de cada kit describen esos originales históricos; el catálogo de esta carpeta describe las copias de trabajo del repositorio.
- `skill-videos/`: reglas y método de edición, incluyendo feedback por escena y referencias.

## Audio y originales

El repositorio es público. La música y los SFX de stock se obtienen con `preparar.py` desde sus URLs oficiales y términos; no se publican como biblioteca de stock. Las recetas conservan ganancias, entradas, ducking, transitorios y sincronía. Los scripts originales permiten reconstruir stems para reeditar la mezcla.

Los kits completos y los PNG, WAV, stems y MP4 exactos permanecen en Drive, con sus permisos actuales:

- Kit V5: https://drive.google.com/drive/folders/1-yESwFDZJaEoO6YOsk_VL341G4dWgBBX
- Doctor V6 Legacy Capital: https://drive.google.com/drive/folders/1YexjMgwYteGijO3XoE6CrRNx3EZ3t7rJ
- MP4 Doctor V6: https://drive.google.com/file/d/1PiQDnFxi_WBwPmQFj0KtZYy1QDKbFpfZ/view

La edición con las copias optimizadas conserva estructura y tiempos; no se afirma equivalencia binaria con los originales. Para una salida que requiera los originales exactos, usa sus enlaces y el conector de Drive de la misma cuenta.
