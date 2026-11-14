# Doctor V6 · Legacy Capital · kit de edición

Esta carpeta contiene la nueva edición Legacy Capital de Doctor. V5 permanece como antecedente separado. No es la prueba Higgsfield V6 rechazada. La revisión estética de esta nueva pieza corresponde al usuario; tener un MP4 verificado no equivale a su aprobación.

1. Descarga la carpeta completa. Abre `GUIA_PARA_CLAUDE.md` y entrega a tu editor `PROMPT_PARA_CLAUDE.md` junto con los medios.
2. Ejecuta `python 00_Guia_IA/scripts/verificar_kit.py` para comprobar hashes antes de editar.
3. Si sólo descargaste medios clasificados y el ZIP de código, ejecuta `python 00_Guia_IA/scripts/preparar_proyecto.py`. Restaura el proyecto sin llamadas de IA ni render. Conserva archivos modificados; `--refresh` restaura expresamente los originales.
4. El archivo de referencia está en `07_Video_referencia/Doctor_Legacy_Capital_V6.mp4`. El proyecto HTML/GSAP está en `06_Proyecto_HyperFrames/`.

El ZIP de código es pequeño y no duplica los medios. Si hay ZIPs de proyecto por partes, son ZIPs independientes: extrae **todos** en una misma carpeta, respetando rutas. Cada parte es menor de100MiB. No hacen falta si ya descargaste el proyecto completo.

Los medios se consolidan para el mismo propietario y sus anuncios; los términos de música, SFX, fuentes y librerías están incluidos. No se concede una licencia nueva para distribuir originales como biblioteca ni se cambian permisos de Drive.
