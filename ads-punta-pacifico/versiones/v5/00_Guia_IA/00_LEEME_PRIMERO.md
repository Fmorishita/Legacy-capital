# Kit de edición · Punta Pacífico V5

Este kit reúne los elementos de los tres anuncios V5: Doctor, Empresario y California. El usuario eligió V5 como base para reeditar y no quiere usar la prueba V6. No se incluyeron videos animados, referencias de generación ni medios de esa prueba. Esto no equivale a una aprobación estética general de V5.

## Para editar con Claude Code u otro software con archivos locales

1. Descargar la carpeta completa desdeDrive y conservar su estructura.
2. Abrir primero `PROMPT_PARA_CLAUDE.md` y elegir sólo un perfil para empezar.
3. Leer su guion, timeline y sistema visual compartido. El MP4V5 es la referencia de resultado.
4. Reutilizar la voz alineada, imágenes y subtítulos. No generar otra voz por defecto.
5. Mantener precio sólo0–3.6s, plan10/10en19/80, textos reales, colocación de captions y cierre centrado.
6. Guardar cambios en una versión nueva. No sobrescribir los archivos V5.

## Qué hay en cada carpeta

- `01_Marca_y_tipografias/`: logo transparente, tres TTForiginales, sistema visual y licencias.
- `02_Doctor/`, `03_Empresario/`, `04_California/`: guion, SRT/VTT, palabras, posiciones de subtítulos, storyboard, timeline, imágenes numeradas, voz sola, mezcla final, música fuente y proyecto HTML/GSAPautocontenido.
- `05_Efectos_sonoros_compartidos/`: seis efectos originales compartidos con sus licencias y registro de fuente.
- `Audio_reconstruido/` dentro de cada perfil: pistas de trabajo separadas preparadas con la receta V5; la mezcla final original es la referencia exacta.
- `00_Guia_IA/scripts/`: descargador opcional de las fuentes oficiales y reconstrucción de audio. No hacen falta para abrir/reproducir el proyecto con la mezcla final ya incluida.

## Si se usa Claude en un chat

Los ZIP `Estructura_codigo_V5_*.zip` son pequeños y contienen código/documentos. Añadir las imágenes del perfil y la voz alineada según el alcance. Un chat sin acceso al resto de las carpetas no puede renderizar una réplica completa sólo con esos ZIP. Para trabajo integral se recomienda una herramienta con acceso a la carpeta descargada.

## Audio y permisos

Los archivos se consolidan para el mismo propietario/licenciatario y sus propios anuncios. Las fuentes, hashes y términos se conservan; no se conceden derechos nuevos ni se presentan los tracks como música propia o una librería de stock de reventa. Ver `Registro_fuentes_audio.json` y las licencias. Los MP3música/SFX se conservan sin cambiar sus bytes.

## Abrir el código original

En `<perfil>/Proyecto_HyperFrames/`: `npm install`, `npm run dev`, `npm run check`, `npm run render`. Requiere Node.js22+,FFmpeg/FFprobe y Chrome; HyperFrames está fijado a0.9.18. El render usa sólo assets locales y la mezcla final; el audio separado es para editar.

Los títulos visibles se leen del HTMLfinal, no del campo antiguo `overlay` de planificación. Cada foto se usa una vez en la serieV5, las exposiciones incluyen transiciones y ninguna supera4s. Conservar arquitectura, acciones y referencias comerciales. Las amenidades son proyectadas y las personas ficticias.


## Preparar el proyecto desde la carpeta ordenada

Después de descargar el kit completo, ejecutar `python 00_Guia_IA/scripts/preparar_proyectos.py`. Este script extrae sólo el código de los pequeños ZIP de estructura y copia los medios clasificados a las rutas relativas que espera cada HTML. No requiere red, generación de IA ni los ZIP grandes de archivo. No reemplaza archivos existentes diferentes sin una opción explícita de restauración. Para validar sin copiar: `python 00_Guia_IA/scripts/preparar_proyectos.py --dry-run`. Después abrir `<perfil>/Proyecto_HyperFrames/`, ejecutar `npm install` y `npm run dev`. Los originales completos archivados en ZIP conservan también su estructura interna con carpetas `salud`, `empresarios` o `california`; son otra vía de apertura y no deben mezclarse a ciegas con este ensamblaje ordenado.
