# Materiales portables para Claude y otros editores

Aplicar cuando el usuario quiera reunir los elementos de anuncios existentes para volver a editarlos con otra IA o software. Es una organización de archivos y conocimiento de edición, no un encargo implícito de crear otro anuncio.

## Fuente elegida y estado del feedback

El 14/11/2026 el usuario rechazó la prueba V6 de Higgsfield y pidió todos los materiales de V5 de Doctor, Empresario y California. Usar los MP4, composiciones y metadatos finales V5. Conservar `V6-Higgsfield` en su ubicación histórica, sin borrarlo y sin copiar sus clips, montaje, prompts ni audio al kit V5. Esta exclusión no se aplica por número a una revisión nueva autorizada con otro ID, como `V6-Legacy-Capital-Doctor`. La selección de V5 como base de reedición no permite escribir que el usuario aprobó su estética en términos que no haya expresado.

El destino observado para este trabajo es la nueva carpeta [Kit editable completo · Anuncios V5](https://drive.google.com/drive/folders/1-yESwFDZJaEoO6YOsk_VL341G4dWgBBX), dentro de la carpeta de anuncios de Punta Pacífico. Su creación no demuestra que todas las cargas hayan terminado. El registro local del trabajo y el readback de Drive indican qué está realmente entregado.

## 1. Auditar antes de copiar

1. Leer la metadata final de cada perfil y la verificación del MP4 correspondiente. Identificar la revisión exacta por SHA256, no sólo por nombre o fecha de la carpeta.
2. Recorrer los medios que utiliza realmente el HTML final. Registrar imágenes, logo, tipografías, runtime, audio, guion, subtítulos, palabras y eventos. No llenar el kit con fotos descartadas, librerías de caché o fuentes de otras versiones.
3. Comprobar la correspondencia entre archivos originales y assets locales de cada proyecto. Conservar bytes y resolución de las imágenes; las miniaturas sirven sólo como índice de revisión.
4. Verificar texto y diseño finales contra el HTML y fotogramas codificados. `metadata.overlay` o el guion de planificación puede contener copy anterior. Por ejemplo, en V5 el título visible de una escena de alberca se definió en la composición y difiere de su anotación de planificación. El kit debe conservar el título realmente mostrado.
5. Distinguir recursos existentes de derivados nuevos. Las voces V5 limpias y alineadas ya existen; no separarlas del MP4 ni regenerarlas. Si se crean stems de trabajo, documentar su procesamiento y su relación con el master.

El caso V5 auditado tiene49imágenes distintas y16/17/16tomas, con duración36.875/39.416667/41.541667s,1080×1920 y24fps. Estos números describen esta fuente, no una cuota para todos los anuncios futuros. En Empresarios deben conservarse las correcciones finales que compactan los bloques de enganche y mensualidades para liberar los rostros.

## 2. Organizar para encontrar y reutilizar

Una estructura útil separa guía y marca compartida de los tres perfiles:

```text
00_Guia_IA/
01_Marca_y_tipografias/
02_Doctor/
03_Empresario/
04_California/
```

Dentro de cada perfil incluir, con nombres en orden de uso:

- MP4 V5 de referencia, para comparar la reconstrucción.
- Guion y subtítulos: narración corrida, SRT final, captions y tiempos por palabra en JSON.
- Imágenes en orden, originales completos y una hoja de miniaturas opcional. Cada imagen identifica su toma y su hash.
- Audio: voz sola alineada, mezcla final, música usada, efectos/eventos y receta de montaje. Mantener la distinción entre original de stock, recorte de trabajo y stem procesado.
- Estructura y tiempo: storyboard CSV, timeline JSON, textos visibles, encuadre, posición de captions, movimientos, transiciones, niveles y eventos de sonido.
- Proyecto original editable con HTML/GSAP, fuentes y assets locales o ZIP portable completo que los conserve.

Los elementos compartidos incluyen el logo, los tres archivos de fuente reales, paleta y reglas de diseño, avisos de licencia y runtimes necesarios. No incluir `node_modules` ni secretos. Declarar las dependencias y su versión para reinstalarlas.

Entregar dos maneras de acceder al código: un ZIP pequeño sólo de fuentes/configuración, que otra IA pueda leer sin ingerir cientos de megabytes de imágenes, y el proyecto completo con todos los medios para ejecutar o renderizar. No prometer que un ZIP sólo de código es autocontenido si necesita descargar los medios por separado.

## 3. Registrar el tiempo sin depender de un editor

La voz es el reloj del anuncio. El mapa portable debe contener como mínimo:

| Campo | Propósito |
|---|---|
| ID y orden de toma | Vincular guion, imagen y composición. |
| Inicio, core_end y fin visible | Mantener el corte y el solapamiento real. |
| Archivo relativo, tipo y SHA256 | Localizar el asset correcto sin rutas del equipo de origen. |
| Frase hablada y tiempos por palabra | Conservar narración y resaltado de captions. |
| Texto final y estilo | Reproducir lo que se ve, no una anotación vieja. |
| Encuadre y posiciones | Conservar rostros, manos, objetos y zonas seguras. |
| Movimiento/transición y easing | Describir el comportamiento y conservar el código exacto cuando exista. |
| Evento de audio, fuente, recorte y ganancia | Reproducir el diseño sonoro. |

Mantener segundos y fps explícitos; los fotogramas son una derivación de ese reloj. En V5 el precio aparece0–3.6s y las tomas incluyen su overlap al comprobar el máximo de cuatro segundos. El SRT por sí solo no describe el énfasis por palabra ni los cambios de posición: conservar también los captions finales y su JSON.

Las rutas absolutas antiguas pueden conservarse como procedencia, pero los archivos ejecutables y la guía de la IA usan rutas relativas al kit. Identificar cuál es el punto de entrada y cuáles son las dependencias de medios.

## 4. Audio, tipografías y licencias

La petición actual organiza copias de trabajo del mismo usuario/licenciatario para continuar sus propios anuncios. No convertirla automáticamente en una publicación o venta de stock a terceros, ni omitir los componentes que pidió por una prohibición más amplia que la licencia real.

Incluir únicamente las tres músicas y los seis efectos que se usaron, con título/autor, URL oficial, términos aplicables, hash, perfil y eventos. No ampliar el acceso de Drive ni crear una biblioteca pública de stock. Las copias de trabajo no conceden propiedad de esas pistas ni permiso de reventa o redistribución como stock.

Las fuentes oficiales revisadas para este trabajo son [Mixkit Music Free](https://mixkit.co/license/modal/musicFree/), [Mixkit SFX Free](https://mixkit.co/license/modal/sfxFree/) y [términos Mixkit](https://mixkit.co/terms/). SFX dice: «You can’t redistribute the Item on its own, as stock, in a tool or template, or with source files». No se encontró una excepción expresa de client-handoff que elimine esa restricción para nuevos destinatarios. Cuando un tercero nuevo necesite originales, proporcionar sus URLs y un descargador directo del licenciante bajo la licencia vigente. No afirmar que un stem M&E crea derechos nuevos o evita la restricción.

Los stems preparados para la edición del propio usuario son artefactos de trabajo del proyecto; documentar si son previos al mastering o posteriores. Un master con limitador o normalización no lineal puede no reconstruirse sumando stems procesados por separado. Conservar el mix narrado final como referencia exacta y no presentar una recombinación aproximada como idéntica.

Las tipografías concretas V5 son Open Sans Condensed Bold, Open Sans Semibold y Open Sans Extrabold, distribuidas en este entorno bajo Apache2.0. Incluir su copyright y el texto de licencia de esos binarios; no asumir la licencia de una descarga distinta. GSAP incrustado es3.15.0 y HyperFrames es0.9.18: conservar los avisos reales de cada uno. La FAQ de GSAP permite que Claude u otras IA generen su código; eso no autoriza construir un producto visual competidor prohibido por su licencia.

## 5. Dar instrucciones concretas a la IA receptora

La guía debe permitir abrir la carpeta, leer los archivos correctos y cambiar algo sin adivinar la estructura. Incluir un prompt inicial que indique:

1. Leer la guía, el sistema visual y el timeline del perfil elegido.
2. Trabajar sólo sobre V5 y conservar los originales.
3. Reutilizar los medios entregados; no generar nuevos activos ni consumir servicios de pago salvo petición posterior.
4. Mantener formato, voz y sincronía salvo el cambio expresamente solicitado.
5. Obtener el texto visible del código final y respetar las condiciones comerciales registradas.
6. Guardar una versión nueva, revisar fotogramas y audio y declarar cualquier componente pendiente.

Claude Code u otro editor con acceso al sistema de archivos puede trabajar con la carpeta completa descargada de Drive. Para una conversación con límites de adjuntos, empezar por guía, guion, timeline, sistema visual y ZIP ligero de código; adjuntar después las imágenes o audio relevantes. No asumir que una carpeta remota es visible para otra IA sin conectarla o descargarla.

## 6. Verificar la entrega

- Comparar todos los archivos incluidos con el inventario y sus hashes. Confirmar que la fuente elegida y los tres MP4 de referencia son V5 y que no entró material V6.
- Comprobar que las rutas relativas de ejecución resuelven assets y que el ZIP ligero declara sus dependencias. Verificar extracción y hashes del proyecto completo.
- Revisar que las voces aisladas corresponden a las versiones usadas y mantienen su offset; no etiquetar una voz MP3 cruda como WAV alineado.
- Proporcionar originales de música/SFX con contexto, términos y receta, no una afirmación de derechos ilimitados.
- Confirmar en Drive las carpetas y archivos por ID, nombre, tamaño y ubicación antes de compartir el enlace. No mover o borrar las entregas anteriores para construir el kit.
- Si se copia un proyecto existente, usar la revisión final que incorpora los últimos fixes; un ZIP anterior puede contener el mismo nombre de versión y un error ya corregido.

La organización del kit no requiere renderizar otra vez un MP4 que no cambió. Si se modifica código o medios del anuncio, sí se aplican los gates normales de edición y render.

## Subversiones nuevas por perfil

Si se solicita una revisión de un solo perfil, conservar el kit histórico y añadir el nuevo perfil en un directorio de versión inequívoco, con guion, voz, medios, composición, mapa y manifiesto propios. No sobrescribir V5 ni etiquetar una carpeta mixta como si todos sus contenidos fueran V5. El índice debe señalar qué versión de Doctor/Empresario/California está vigente y cuáles se preservan como históricos. No sustituir los perfiles que no se pidieron cambiar. Para Legacy Doctor, usar `V6-Legacy-Capital-Doctor`; conservar aparte `V6-Higgsfield`, rechazada.
