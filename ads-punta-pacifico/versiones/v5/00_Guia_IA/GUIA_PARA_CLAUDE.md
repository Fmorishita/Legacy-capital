# Editar los anuncios V5 de Punta Pacífico con otra IA

Este kit reúne los componentes de **Doctor, Empresario y California V5**. El usuario eligió V5 como base para volver a editar y excluyó la prueba V6 de Higgsfield, que no le gustó. Las imágenes de V5 siguen siendo fotografías/renders con movimiento de composición; este kit no incorpora las animaciones de V6. La selección de V5 como base no se presenta como una aprobación estética adicional.

## Empezar

1. Descarga la carpeta completa de Drive y conserva sus nombres y subcarpetas. Si usas un ZIP dividido, extrae todas sus partes en el mismo destino.
2. Antes de abrir los proyectos, ejecuta desde la raíz del kit `python 00_Guia_IA/scripts/preparar_proyectos.py`. Ensambla el HTML y sus medios locales desde los ZIP pequeños y los materiales ordenados, sin red ni generación. Si prefieres los ZIP completos archivados, extrae todas las partes del perfil en un mismo destino; no mezcles ambas vías.
3. Dale a Claude Code —o a otra IA con acceso a archivos— acceso a la carpeta descargada. Abre primero esta guía, el [manifiesto](Manifest_Kit_V5.json) y el perfil que vas a editar.
4. Mira el MP4 V5 de referencia. Lee su guion, timeline y subtítulos antes de cambiar nada.
5. Pega el contenido del [prompt para la IA](PROMPT_PARA_CLAUDE.md) y añade el cambio concreto que quieres. Trabaja en una carpeta nueva; conserva la base V5.

En Claude web/chat, empieza por los archivos pequeños: esta guía, el prompt, el guion, el timeline JSON/CSV, el ZIP de código sin medios y las hojas de miniaturas. Adjunta después sólo las imágenes o audios que necesite la tarea. Los límites de carga dependen de la aplicación y cuenta: no se presupone un tamaño universal. Para trabajar con todos los medios y reproducir la edición completa, resulta más práctico un entorno con acceso a la carpeta local, como Claude Code.

## Dónde está cada cosa

| Carpeta | Contenido y uso |
|---|---|
| `00_Guia_IA/` | Esta guía, prompt para la IA, inventarios, fuentes y herramientas de audio. |
| `01_Marca_y_tipografias/` | Logo, tres tipografías reales, licencias y `Sistema_visual_V5.json`. |
| `02_Doctor/` | Materiales del anuncio de salud. |
| `03_Empresario/` | Materiales del empresario masculino y su pareja. |
| `04_California/` | Materiales de la familia vinculada con California. |
| `05_Efectos_sonoros_compartidos/` | Los seis efectos originales utilizados por los anuncios, con su registro de fuentes. |

Abre el perfil que necesites: [Doctor](../02_Doctor/), [Empresario](../03_Empresario/) o [California](../04_California/). Cada perfil separa `Guion_y_subtitulos/`, `Imagenes_en_orden/`, `Audio/`, `Audio_reconstruido/`, `Estructura_y_timeline/` y `Proyecto_HyperFrames/`. El video de referencia conserva el resultado V5 que debes comparar. El orden de las imágenes y los IDs de toma permiten relacionar una foto con su voz, texto, corte y efecto de sonido.

## Archivos clave de cada perfil

Las rutas siguientes parten de `02_Doctor/`, `03_Empresario/` o `04_California/`:

| Archivo | Para qué sirve |
|---|---|
| `Guion_y_subtitulos/Guion_V5.md` | Narración completa. |
| `Guion_y_subtitulos/subtitulos_V5.srt` y `.vtt` | Texto y tiempos de los grupos finales. |
| `Guion_y_subtitulos/palabras_y_tiempos.json` | Reloj por palabra de la voz. |
| `Guion_y_subtitulos/subtitulos_animados.json` | Grupos y posición/estilo necesarios para el resaltado animado. |
| `Estructura_y_timeline/timeline_V5.json` | Orden, medios, voz, texto visible, recorte, entradas y salidas de las tomas. |
| `Estructura_y_timeline/storyboard_V5.csv` | La misma estructura en una tabla fácil de inspeccionar. |
| `Estructura_y_timeline/audio_recipe.json` | Música, entrada, ganancias y eventos de efectos. |
| `Estructura_y_timeline/motion_cues.json` | Acciones visibles y acentos de sonido asociados. |
| `Proyecto_HyperFrames/index.html` | Composición ejecutable que monta todas las escenas. |
| `Proyecto_HyperFrames/compositions/` | HTML/CSS/GSAP final de cada escena, captions y precio. |

Dentro de `00_Guia_IA/`, los ZIP `Estructura_codigo_V5_salud.zip`, `Estructura_codigo_V5_empresarios.zip` y `Estructura_codigo_V5_california.zip` agrupan código pequeño para facilitar su lectura en una IA. Los medios pesados se conservan por separado y en los editables completos.

## Dos formas de editar

**Continuar el proyecto existente.** `Proyecto_HyperFrames/index.html` monta las escenas de `compositions/`; `assets/` conserva medios y fuentes con rutas locales. El HTML final contiene el diseño, las máscaras y las animaciones GSAP exactas. Usa el proyecto o los ZIP portables completos cuando quieras conservar esa implementación. Sigue su `package.json` y las instrucciones incluidas para instalar las dependencias y abrirlo. La versión original del motor es HyperFrames 0.9.18.

**Recrear en otro motor.** Utiliza el timeline JSON/CSV, los tiempos por palabra, las fotos en orden y la guía visual para reconstruir las pistas en Remotion, FFmpeg u otro software. Mantén segundos y fotogramas como unidades explícitas. El HTML sigue siendo la referencia detallada de texto visible, posiciones, recortes, curvas y excepciones. No es obligatorio usar HyperFrames para aprovechar estos materiales.

Un ZIP pequeño de código sirve para que la IA lea la estructura; no sustituye el proyecto completo con medios. Los ZIP completos y la carpeta con sus assets resuelven las dependencias que necesita un render.

## Formato y reloj que debes conservar

| Perfil | Duración de V5 | FPS | Fotogramas | Fondos distintos |
|---|---:|---:|---:|---:|
| Doctor | 36.875 s | 24 | 885 | 16 |
| Empresario | 39.416667 s | 24 | 946 | 17 |
| California | 41.541667 s | 24 | 997 | 16 |

Lienzo vertical **1080 × 1920**, H.264 y AAC estéreo en los MP4 de referencia. Hay **49 imágenes distintas** en la serie. No repitas una foto para cubrir una frase más larga; conserva sus usos y, si la revisión requiere más material, identifica primero qué toma falta.

La voz es el reloj de edición. `start` es la entrada absoluta de la toma; `core_end` marca el corte que inicia la siguiente; `end` incluye el tiempo durante el que la imagen sigue visible bajo la transición. Por eso la suma de duraciones de las fotos puede superar la duración del anuncio. El solapamiento habitual es 0.32 s; usa siempre el valor de la toma. La exposición total de una imagen, incluida su salida, no debe superar cuatro segundos.

Los tiempos son continuos, y el video final los muestrea a 24 fps. No redondees cada marca de forma acumulativa ni cambies el ritmo de la voz para llenar una plantilla. Conserva el número de fotogramas cuando la edición solicitada no cambie la duración.

## Audio: qué archivo elegir

- **Voz sola alineada:** usa `Audio/voz_sola_alineada.wav` para una remezcla. Tiene el silencio inicial y la duración de V5; evita desplazarla para que empiece en el primer fonema.
- **Voz original de síntesis:** el MP3 crudo se conserva como fuente. No lo sustituyas automáticamente por la voz alineada: sus márgenes y su reloj pueden diferir.
- **Mezcla final:** `Audio/mezcla_final_V5.wav` ya contiene voz, música y efectos con el diseño sonoro de V5. Es la referencia exacta para mantener el sonido.
- **Música fuente y efectos:** los originales usados, sus IDs, sus URLs y sus licencias forman parte de los archivos de trabajo de este proyecto. La entrada, ganancia y ubicación de cada evento se registran en la configuración de audio.
- **Pistas de trabajo separadas:** `Audio_reconstruido/musica_editada.wav`, `efectos.wav`, `premaster.wav` y `mezcla_reconstruida.wav` permiten ajustar el audio sin separar la voz del MP4. Lee `Informe_reconstruccion.json` y la [guía de audio](Audio_para_editar.md); el mastering conjunto y la cuantización de las fuentes pueden producir diferencias pequeñas frente al WAV final. El WAV final V5 es la referencia exacta, no la mezcla reconstruida.

Si reproduces la mezcla final, silencia la voz y las demás pistas separadas. Si remezclas con pistas separadas, silencia la mezcla final. Reproducir ambas opciones a la vez duplica elementos y cambia el volumen.

La música es distinta por perfil: *I Can Hear Your Heartbeat* (Doctor), *Cat Walk* (Empresario) y *Life is a Dream* (California). Mantén sus puntos de entrada y ganancias de la configuración si el cambio no es de audio. Los 34 eventos de efectos tienen una causa visible y marcas de inicio/pico; no añadas el mismo whoosh a todas las palabras. El pico previsto aterriza aproximadamente un fotograma después de la acción visual indicada.

Los términos originales se incluyen para conservar su alcance: estos componentes se organizan para el trabajo del mismo usuario en sus anuncios. No se afirman derechos nuevos sobre música, efectos o tipografías ni se convierte el kit en una librería de stock. El [registro de fuentes](Registro_fuentes_audio.json) conserva IDs, URLs y hashes. El descargador opcional obtiene los originales del proveedor cuando un editor necesite hacerlo bajo la licencia correspondiente.

## Texto, subtítulos y diseño

El [sistema visual](../01_Marca_y_tipografias/Sistema_visual_V5.json) documenta colores, tipografías y coordenadas. Los tres archivos TTF usados son **Open Sans Condensed Bold**, **Open Sans Semibold** y **Open Sans Extrabold**. En `01_Marca_y_tipografias/Tipografias/` se llaman `OpenSans_Condensed_Bold.ttf`, `OpenSans_Semibold.ttf` y `OpenSans_ExtraBold.ttf`; dentro del proyecto se conservan como `display.ttf`, `text.ttf` y `bold.ttf`. En el código se llaman `PPCondensed`, `PPText` y `PPBold`. Conserva los archivos y sus avisos de licencia; no los sustituyas por una fuente del sistema parecida.

Paleta de referencia: fondo azul marino `#071D29`, blanco y acentos Doctor `#FFD086`, Empresario `#E5BC76`, California `#FFC696`. El CTA de Empresario usa un dorado más claro, `#FFE1AD`, para legibilidad. El HTML contiene los valores completos y cualquier excepción.

Usa `subtitulos_V5.srt` o `.vtt` para los grupos finales. `subtitulos_audio_original.srt` se conserva como archivo de síntesis previo y no tiene prioridad sobre los grupos finales ni sobre el HTML. El SRT permite reutilizar el texto y sus marcas básicas. Para reproducir el resaltado por palabra, usa además el JSON de palabras y los grupos finales de captions. El SRT por sí solo no conserva la fuente, el énfasis dorado, las posiciones ni las animaciones. Los grupos se dividen al cambiar de foto y su posición se adapta a la escena: no muevas todos los subtítulos a una única altura.

El campo editorial `overlay` de un guion o metadata puede ser una anotación anterior. **El texto visible del HTML final y el MP4 V5 tienen prioridad para copiar el resultado entregado.** Por ejemplo, la alberca de Doctor muestra «TU PAUSA / EN LA ALBERCA», aunque una anotación de planeación diga otra frase. Conserva los calificadores de las cifras y no copies sólo el número grande.

La imagen llena el lienzo. Los titulares son breves y animados; no reconstruyas un panel permanente con texto arriba y foto pequeña abajo. Como orientación de V5, el texto principal usa márgenes amplios, aproximadamente x=108–972 y y=168–1330. Estas coordenadas pertenecen al lienzo 1080×1920. Comprueba rostros, manos y acciones durante el movimiento; no basta con revisar la foto sin recorte.

Conserva especialmente las dos tarjetas de pago compactas de Empresario: enganche y mensualidades usan `hero_top=168` y números/etiquetas reducidos. Esas correcciones liberan los rostros de su pareja. Los asadores y pickleball tienen subtítulos elevados para proteger manos, pinzas y palas. El cierre centra logo, «MÁS INFORMACIÓN», llamada y flecha en x=540.

## Contenido comercial y correspondencia

- Apertura con el buyer persona y vista al mar visible y nombrada. Usa los personajes y espacios existentes; no generes una casa distinta.
- Rango de apertura **«Rango aprox. $3.9–$4.8 MDP · 2 y 3 recámaras · MXN»**, visible sólo de 0 a 3.6 s. Revisa también el primer corte mientras el rango sigue activo.
- Pagos: **10% de enganche + 10% TOTAL en 19 mensualidades + 80% contra entrega**, como flexibilidad para planear el desembolso y cuidar liquidez.
- **8% anual como plusvalía estimada, escenario conservador**, dato aportado por el cliente; no convertirlo en histórico comprobado ni en ganancia asegurada.
- Las amenidades siguen siendo proyectadas. Mantén la imagen vinculada a la voz: alberca, asadores, pickleball o salón exterior cuando se nombran; planeación/pago al explicar el esquema.
- Conserva el casting masculino de Empresario y la continuidad de cada pareja/familia. Las laptops deben mostrar su tapa exterior lisa cuando la cámara mira su dorso.
- No agregues «casa muestra», etiqueta IA, fecha de lista, «Precio y disponibilidad sujetos a cambio» ni «Plusvalía no garantizada» al video.

Estos importes describen V5, no una actualización comercial automática. Una nueva indicación explícita del usuario puede sustituirlos para un nuevo anuncio; registra ese cambio sin alterar la referencia V5.

## Revisar la nueva edición

Comprueba archivos y rutas con el manifiesto, sin modificar los originales. Revisa el primer fotograma, todo el intervalo del precio, los dos lados de los cortes, pagos, cifra de plusvalía asentada y cierre. Compara también a tamaño de teléfono.

Antes de entregar un MP4 nuevo, verifica dimensiones, fps, duración, fotogramas, audio estéreo y decodificación completa; comprueba que no haya cuadros negros inesperados y que los subtítulos estén realmente dentro del archivo. Inspecciona fotogramas del MP4 codificado. No confundas un preview HTML correcto con un export correcto, ni una comprobación técnica con aprobación estética del usuario.
