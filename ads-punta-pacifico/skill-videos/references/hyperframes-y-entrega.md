# Producción en HyperFrames y entrega

## Preparar

1. Recuperar el proyecto y sus instrucciones AGENTS.md. Preservar versiones anteriores y cambios manuales del usuario.
2. Leer las skills oficiales HyperFrames, HyperFrames CLI, registry y media-use instaladas; en este entorno están en `~/.agents/skills/`. Consultar referencias de vertical, captions, motion, audio y review según el trabajo. No duplicar aquí todo su contrato cambiante.
3. Verificar Node, HyperFrames, FFmpeg/FFprobe y navegador compatibles. Mantener las variables de red y autenticación del entorno; no sustituirlas ni imprimir credenciales.
4. Crear una nueva carpeta de versión. No ejecutar ciegamente un builder histórico que escriba enV4.

## Entradas de producción

- Configuración del proyecto con oferta y fuentes vigentes, marca comercial visible separada de la identidad del desarrollo y un ID de revisión inequívoco.
- Guion corrido y storyboard por persona.
- Registro de imágenes con hash, fuente/linaje, encuadre, acción y persona.
- Voz final y límites por palabra.
- Música/SFX licenciados, tiempos de acciones y mezcla.
- Para una prueba de renders animados: clips aceptados, referencia, prompt, parámetros, trabajo, duración generada, recorte y revisión temporal. Ver [Higgsfield y presupuesto](higgsfield-y-presupuesto.md). Usar videos silenciados y temporizados dentro de la composición; conservar la mezcla narrada existente cuando la revisión no cambia el audio.

La voz es el reloj. Buscar las anclas habladas y dividir las imágenes para que ninguna dure más de4s con overlaps. Crear grupos de subtítulos después de conocer los cortes: un grupo no conserva la posición de la foto anterior cuando entra una nueva.

## Composición editable

- `index.html` monta escenas desde `compositions/`; imágenes, fuentes y audio locales en `assets/`.
- Una timeline pausada y determinista por composición, registrada conforme al contrato oficial. Cada clip tieneID, inicio y duración. Cada audio tieneID.
- Usar el root para montajes y pistas, escenas para imagen/copy/movimiento y una pista organizada para captions.
- Variables editables para texto, colores, medios e importes. No generar todo el contenido visible mediante código opaco.
- Fondo a pantalla completa con encuadre revisado y mar visible desde el hook. Usar máscaras/transforms de cámara para movimiento; no deformar arquitectura ni inventar vistas. Para tratamientos de medios seguir media-use.
- Tipografía editorial breve. Alternar momentos de imagen+subtítulo con énfasis visual en el beneficio o cifra pertinente.
- Usar transiciones B-roll diferentes con un motivo de acción, objeto o dirección de lectura. Añadir SFX sincronizados a texto/cifras/motion, sin ruido en cada palabra. No repetir una plantilla sólo cambiando fotos y color.
- Centrar logo, título y CTA de todos los cierres; paleta azul marino/dorado profesional, sin verde claro. Revisar ropa de amenidades y geometría de pantallas antes de montar.
- Precio como overlay independiente de apertura. Verificar sus relaciones con titulares de las tomas que entren mientras siga activo.

## Validación y exportación

Ejemplos de CLI; adaptar a la versión instalada y consultar `--help`:

```bash
node /ruta/tooling/hyperframes.mjs check --json
node /ruta/tooling/hyperframes.mjs snapshot --review
node /ruta/tooling/hyperframes.mjs snapshot --at 0,1.8,2.8,3.4 --json
node /ruta/tooling/hyperframes.mjs preview --background
node /ruta/tooling/hyperframes.mjs render --fps 24 --quality delivery --workers 1 --crf 19 -o final.mp4
```

Los tiempos de ejemplo son deV4; muestrear los tiempos reales del nuevo guion. Verificar HTTP200 del preview. El pedido explícito de los videos autoriza renderizar después del QA; no pedir otra confirmación rutinaria para exportar lo que ya se solicitó.

La capacidad de workers depende de la máquina. Respetar el lock oficial y renderizar las piezas secuencialmente cuando el motor lo exija. No prometer tiempos universales: en software GPU la exportación puede tardar varios minutos.

Antes de renderizar comprobar disco. Usar `hyperframes clean --dry-run` y el limpiador oficial para cachés; conservar fuentes, videos previos, historial y evidencias relevantes. No borrar toda `.hyperframes`.

Tras editar: comprobar la zona modificada, revisar sus bordes y reconstruir el MP4. Una corrección parcial debe mantener duración, fotogramas, continuidad y audio sincronizado. Preferir render completo cuando corresponda; si se recompone una intro, documentar y verificar el empalme.

## Materiales de entrega

1. MP4 de cada perfil con subtítulos incrustados.
2. PNG generados como archivos individuales, además de ZIP si conviene; no dejarlos sólo dentro de un paquete difícil de explorar.
3. Guiones y SRT adicionales.
4. Proyectos editables completos con medios locales y mezcla narrada integrada.
5. Licencias/registro de fuentes y verificación técnica.

Si el mismo usuario solicita los elementos para volver a editar, añadir assets individuales, voz limpia alineada, componentes de audio del propio proyecto, código ligero, fuentes completas, CSV/JSON temporal y guía para la IA receptora. Ver [entrega portable](entrega-portable-ia.md). No inferir un encargo de generar o renderizar otro video.

No distribuir librerías de música o efectos a nuevos terceros si la licencia no lo permite. Distinguir esa redistribución de organizar las copias de trabajo del mismo usuario/licenciatario que pidió los componentes de sus anuncios. Conservar términos, procedencia y límites de uso; no afirmar una excepción de client-handoff ni que un stem modifica los derechos. Preservar originales de imágenes; si se comprime una copia para un fin concreto, declararlo y conservar el original.

## Drive

- Usar el conector de Drive y su skill de flujo. Mantener la carpeta comercial conocida y crear una versión nueva para una revisión importante. La skill y sus descargas viven en la colección «skills ChatGPT», dentro de su subcarpeta propia; conservar sus IDs al actualizar.
- El usuario autorizó cargar las entregas de este proyecto. Una publicación de campaña, cambio de acceso o envío a terceros es otra acción y necesita su propia autorización.
- En el conector usado paraV4, el límite por archivo fue **100MiB=104857600bytes**. Revisar tamaño antes de subir. La limitación puede cambiar según herramienta.
- Si el paquete excede el límite, dividirlo por perfil. Si un perfil requiere complemento, dar instrucciones inequívocas de extraer ambos sobre la misma carpeta. Verificar extracción y hashes de todos los archivos.
- Al corregir un archivo ya enlazado dentro de esa versión, reemplazar sus bytes en el mismoID y verificar metadata/tamaño. No dejar MP4 corregido con editable antiguo.
- Para descargar la skill, subir el ZIP de versión y una descarga vigente al destino autorizado; registrar IDs y enlaces observados en el registro local, fuera del paquete.
- Confirmar escritura con metadata o listado del conector. Retornar sólo URLs realmente observadas, nunca IDs inventados.
