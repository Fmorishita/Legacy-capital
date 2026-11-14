# QA, entrega y lecciones del proceso

## Alcance de esta referencia

V4 es la referencia aprobada en general por el usuario, con observaciones. V5 está renderizada y verificada; el14/11/2026 el usuario la eligió como fuente del kit para reeditar. Esa selección no se convierte en una aprobación estética nueva. V6 de Higgsfield fue rechazada por el usuario y queda fuera del kit.
Las preferencias confirmadas son las expresadas por él: imágenes pertinentes, poco aspecto de presentación,
subtítulos dentro del video, voz fluida, música con impulso, hooks directos y texto animado.
Los parámetros de cada nuevo encargo se ajustan al brief; 30–45 segundos es la referencia habitual.
El máximo de cuatro segundos por imagen incluye cualquier overlap de transición.
Los 44 fondos distintos de V4 son evidencia de esa entrega, no un número fijo para futuras piezas.

La prueba histórica V6 añadió clips generados a partir de renders, pero no es la fuente elegida para la entrega actual. Si un encargo futuro vuelve a pedir animación, aplicar [la revisión temporal de Higgsfield](higgsfield-y-presupuesto.md): un primer fotograma fiel no prueba que caras, manos, ventanas, pérgolas o perspectiva sigan estables durante el movimiento. Comprobar también texto sobre sujetos que se mueven y registrar gasto y saldo observados.

## 1. Revisar primero la historia y las fuentes

Antes del QA, identificar la revisión por ID completo: `V6-Higgsfield` y `V6-Legacy-Capital-Doctor` son trabajos distintos. El rechazo estético de uno no se aplica al otro. Leer [marca, revisiones y QA visual](marca-version-y-qa-visual.md).


- Cada frase tiene una imagen que se puede explicar sin inventar una relación.
- Marca y logo permitidos concuerdan en voz, textos y fotogramas. Los nombres internos pueden permanecer en procedencia/carpetas sin filtrarse al anuncio.
- Los conteos estructurales y el vestuario del primer buyer persona coinciden con la configuración vigente. En Legacy Doctor: uniforme médico al inicio y un tragaluz en cada roof.
- Escenas deportivas: anatomía, contacto con suelo, pala, pelota, red, ubicación y miradas sostienen la misma acción; no aceptar un jugador que mira a cámara mientras la pelota exige otra dirección.
- Roof y patio están correctamente identificados.
- Los tres momentos de pago muestran acciones de planeación o pago pertinentes.
- No hay afirmación visual de entrega actual, testimonio de cliente o rendimiento garantizado. El8% anual se califica como ESTIMADO/escenario conservador; no se atribuye a una serie histórica verificada.
- Los datos comerciales distinguen lista histórica, dato vigente confirmado y rango/estimación aportados por el cliente. No aparece la antigua línea de precio/disponibilidad ni la nota visible «Plusvalía no garantizada»; el rango es aproximado y el 8% estimado.
- Los fondos son distintos tanto por hash como por revisión visual de su linaje.
- Los renders panorámicos conservan el objeto importante después del recorte vertical.
- Los personajes siguen siendo consistentes y no tienen errores evidentes de manos o anatomía. Empresarios usa el casting masculino o pareja indicado para este proyecto.
- La vista al mar aparece desde la primera frase y primera imagen, con respaldo de un render pertinente.
- Las amenidades del preview siguen siendo proyectadas, aparecen después y tienen uso/ropa adecuados por persona.

## 2. Revisar el diseño en el tiempo, no sólo en frame 0

Comprobar en la composición y después en el MP4:

1. Primer fotograma: persona reconocible, mar visible, gancho y rango de precio completos con 2/3 recámaras y MXN; en la voz, mar desde la primera frase.
2. Apertura entera: todos los elementos activos durante la exposición del precio.
3. Primer corte: verificar también el titular de la segunda toma mientras el precio siga visible.
4. Inicio y mitad de cada toma: legibilidad, relación imagen/voz y objetos importantes.
5. Ambos lados de los cortes: texto, máscaras y subtítulos durante el solapamiento.
6. Cifras de pago: cantidad correcta y etiqueta completa, con imagen pertinente.
7. CTA: tiempo suficiente para leer y escuchar el cierre; logo, «Más información», llamada y flecha centrados en todos los perfiles. Paleta azul/dorado profesional, sin mint/verde claro.
8. Último fotograma: cierre intencional, sin negro ni corte de palabra.

No aceptar una cabecera permanente, imágenes contenidas en recuadros o bloques que dominen toda la pieza.
La imagen debe llenar el encuadre; los textos son parte de la acción publicitaria.
Revisar a tamaño de teléfono, además de la imagen de escritorio.
En 1080×1920, usar como referencia el área de texto entre y=168 e y=1330 y márgenes laterales amplios.
Adaptar la zona segura a la plataforma y el formato reales del encargo.
No colocar información decisiva debajo del área que cubrirá la interfaz de Meta.

## 3. Control específico de subtítulos

- Todas las palabras de la voz están representadas, con puntuación y acentos correctos.
- El resaltado sigue la palabra pronunciada y no una estimación de duración por caracteres.
- Los grupos se interrumpen al cambiar de foto, aunque la frase continúe.
- La posición se calcula para la toma activa, no sólo para el inicio de un grupo largo.
- Si una transición muestra dos imágenes, revisar ambas durante ese intervalo.
- El texto no cruza ojos, boca ni la acción de pago que necesita entender el espectador.
- Proteger también manos, teléfonos, calendarios, llaves y detalles relevantes del render.
- Evitar un párrafo editorial sobre el mismo párrafo subtitulado.
- Comprobar entradas, salidas, sombras y contraste sobre las fotos reales.

## 4. Lecciones visuales que deben persistir

### Precio después del primer corte

En Empresarios, el precio de apertura seguía visible hasta 3.6 s.
La segunda toma comenzaba antes y añadía «COMPRA POR ETAPAS».
En el MP4 a 2.8 s, el nuevo titular se cruzaba con el bloque de precio.
Los fotogramas 0 y 1.8 s parecían correctos; el check automático tampoco lo señaló.
La corrección entregada redujo ese titular a 72 px y lo elevó a 180 px.
Esos valores son una solución de ese encuadre, no coordenadas universales.
Regla general: revisar todo el intervalo de exposición y todas las composiciones simultáneas.

### Subtítulos que atraviesan un corte

Un grupo iniciado sobre una imagen conservaba su posición al aparecer la siguiente.
Eso provocó textos sobre rostros aunque cada foto tuviera una posición sugerida.
La solución fue dividir grupos en las palabras de corte y reasignar su posición por toma.
No resolverlo moviendo todos los subtítulos a una única altura arbitraria.

### Precio o etiquetas sobre rostros

Los bloques de precio y notas deben ser compactos y comprobarse durante el movimiento de cámara.
No basta con que estén fuera del rostro en la foto original sin el encuadre final.
Evitar que datos secundarios ocupen la frente o escondan la expresión del personaje.

### Pantallas físicamente imposibles

En las escenas de pago del médico, una gráfica apareció sobre lo que debía ser el dorso de la laptop, o el frente no miraba a sus usuarios. La revisión debe comprobar pantalla/carcasa, bisagra, teclado, perspectiva, manos y mirada. Si la cámara está detrás del panel, mostrar su tapa lisa; si mira sobre el hombro, sólo entonces mostrar el frente real orientado correctamente. Corregir con edición nativa de imagen.

## 5. Gates técnicos de HyperFrames

1. Usar la instalación y el wrapper disponibles; leer la skill central de HyperFrames.
2. Mantener clips temporizados, timelines deterministas y assets locales editables.
3. Ejecutar `hyperframes check --json` después de los cambios finales.
4. Corregir errores; documentar las advertencias que se conserven deliberadamente.
5. Ejecutar snapshots de revisión: planos, cortes, tamaño de teléfono y movimientos relevantes.
6. Abrir el preview y comprobar que responde antes del render de entrega.
7. Renderizar cuando la solicitud de archivos o la autorización existente lo permita.
8. Inspeccionar fotogramas extraídos del MP4 final, no sólo el HTML o el preview.

Una advertencia de pista densa puede ser razonable para una composición completa de subtítulos.
No usarla como excusa para ignorar advertencias de lectura, contraste o colisiones.
Una máscara puede ocultar texto brevemente durante su entrada; debe aterrizar legible y a tiempo.
Un check sin errores no prueba que la narración y la imagen tengan sentido o que el diseño guste.

## 6. Verificación del archivo final

- MP4 H.264, audio AAC estéreo, dimensiones verticales acordes al brief.
- V4 se entregó a 1080×1920 y 24 fps; confirmar los parámetros declarados de cada nuevo trabajo.
- Duración del archivo coherente con la composición y sin prolongar la imagen final por accidente.
- Cantidad de fotogramas igual a la duración de video declarada multiplicada por sus fps.
- Decodificación completa sin errores.
- Ausencia de cuadros negros involuntarios, incluidos inicio, cortes y cierre.
- Voz y música presentes; CTA sin palabra truncada ni silencio final accidental.
- Sonoridad de referencia cercana a −15 LUFS y pico verdadero alrededor de −1 dBTP, sin clipping.
- Subtítulos realmente quemados y visibles en el MP4, además de entregar el SRT si corresponde.
- Registro de hashes de fuentes y archivos finales para identificar exactamente lo entregado.
- No afirmar que el audio se escuchó si sólo se midió o decodificó.

## 7. Cambios, reparaciones y consistencia de entregables

- Preservar la versión anterior y corregir primero la fuente editable.
- Revisar la región afectada y volver a exportar el perfil que cambió.
- Una reparación parcial exige mantener fps y tiempos, cubrir toda la escena modificada y su transición.
- Conservar el audio original cuando no cambie; verificar el empalme y la cantidad de fotogramas.
- Comprobar el MP4 corregido completo y los fotogramas próximos al empalme.
- No dejar un MP4 corregido con un editable o ZIP que reproduzca el error anterior.
- Actualizar también los hashes internos y los manifests de archivo.
- Si se corrige una entrega ya enlazada, reemplazar bytes en el ID confirmado de esa versión.
- Para una nueva versión solicitada, crear una carpeta de versión y conservar las anteriores.
- Verificar cada carga con lectura de Drive: nombre, ID, tamaño, carpeta y enlace observados.
- No fabricar enlaces ni afirmar que un upload pendiente ya terminó.

## 8. Recursos, archivo y límites de Drive

- Comprobar espacio disponible antes de renders largos y paquetes grandes.
- Conservar las hojas relevantes y usar `hyperframes clean --dry-run` antes de limpiar.
- Limpiar cachés con el CLI; no borrar fuentes, videos previos, originales o todo `.hyperframes`.
- Respetar el bloqueo de render del motor; no ejecutar renders paralelos evadiéndolo.
- El conector usado en V4 rechazó archivos mayores de 100 MiB: verificar el límite actual.
- Si un ZIP excede el límite, dividir por perfil o crear complementos claramente nombrados.
- Incluir instrucciones de extracción cuando dos ZIP deban combinarse en una misma carpeta.
- Verificar físicamente la extracción y comparar SHA256 con el paquete completo.
- Mantener originales de imágenes; no reducir su calidad sólo para evitar preparar la entrega.
- Incluir el mix narrado y el registro de licencias. Para la reedición del mismo usuario, conservar también voz alineada y componentes de trabajo exactos del proyecto; no publicarlos ni redistribuirlos como una biblioteca de stock a nuevos destinatarios. Ver [entrega portable](entrega-portable-ia.md).
- Entregar los MP4 con enlaces directos y una carpeta clara con imágenes, guiones y editables.

## 9. QA de un kit para otra IA

Verificar versión fuente, rutas y hashes sin volver a renderizar un anuncio que no cambió. Confirmar el texto visible contra el HTML final y fotogramas, los tiempos contra la voz alineada y la composición, y las licencias contra los recursos realmente usados. El código ligero debe declarar sus dependencias; el proyecto completo debe resolverlas localmente. Comprobar que no se copiaron mediosV6 al kitV5 y que todos los archivos de Drive se leyeron de vuelta. La guía y el prompt para la IA deben señalar el punto de entrada, el perfil y los cambios que requieren autorización posterior.

## Subtítulos durante transiciones

En Doctor V6 Legacy Capital, la revisión del MP4 mostró que una pista global de captions podía cubrir la foto que estaba saliendo. Acoplar la máscara de entrada de cada grupo a la misma foto y reloj de transición, o definir una zona segura común. Revisar ambos lados de cada corte en el archivo codificado; comprobar que cada grupo conserva fotogramas con texto completo visible. Un check DOM sin errores no sustituye esa revisión. Validar también el CSS de scrims: un gradiente inválido puede desaparecer y lavar el texto dorado sobre el cielo.
