# Guion, imagen y audio

## Alcance y punto de partida

- Este flujo conserva el feedback explícito del usuario y la configuración entregada en V4.
- El usuario aprobó en general V4 y el tono de California, con observaciones para pulir. V5 aplica esas preferencias; no declararV5 aprobada antes de su evaluación.
- El14/11/2026 eligió V5 como base para reunir materiales y rechazó V6 de Higgsfield. Para ese encargo conservar la fuente finalV5 y seguir [la entrega portable](entrega-portable-ia.md), sin generar otra narración ni incorporar los clipsV6.
- La referencia es un anuncio vertical de 30–45 segundos, salvo otro brief.
- La regla de ritmo es máximo cuatro segundos por imagen, incluida su salida o transición.
- Las 44 imágenes de V4 y sus 14/14/16 tomas fueron un resultado, no una cuota para futuros trabajos.
- Usar la voz y la intención de cada frase para determinar cuántas imágenes se necesitan.

## 1. Convertir la intención en un guion

Leer primero el brochure, oferta vigente, investigación previa y materiales comerciales de Drive. Por perfil, separar evidencia del proyecto de hipótesis de mercado: qué busca, qué valora de esta ubicación/distribución, qué objeción frena la compra y qué puede demostrar el producto. Si falta contexto, investigar fuentes pertinentes y registrar fecha/enlace; no atribuir ingresos, problemas o preferencias a todo el grupo sin respaldo. Relacionar cada beneficio del guion con una característica comprobable.

1. Identificar a quién se habla, qué busca y qué obstáculo puede tener.
2. Abrir nombrando o identificando al perfil y mencionando la vista al mar desde la primera frase; mostrarla en la primera imagen con respaldo del render.
3. Formular la intención de forma condicional, sin atribuir a todos el mismo problema.
4. Conectar un beneficio concreto del proyecto con esa intención.
5. Explicar precio, preventa y condiciones con los datos vigentes del proyecto.
6. Cerrar con una acción clara y coherente con el destino de la campaña.

Ejemplos de estructura, no textos obligatorios:

- «Doctor, si buscas una casa para bajar el ritmo y compartir más tiempo en pareja…»
- «Empresario, si quieres comprar casa sin pagarla toda al inicio…»
- «Si vives en California y buscas una casa en Ensenada para volver con tu familia…»

Evitar «Tu agenda siempre está llena» o «Todo vuelve a tu negocio» como hechos no confirmados.
La persuasión debe venir de la relevancia, el beneficio y una compra comprensible.
Mantener el recorrido atención → interés → deseo → acción sin convertirlo en cuatro diapositivas.
Escribir primero una narración que se pueda decir con naturalidad; después dividir sus anclas visuales.
No alargarla para cumplir un número de tomas ni acelerar una mala frase para que quepa.

## 2. Tratar los datos comerciales como configuración

La última instrucción y el guion explícito de la pieza prevalecen sobre listas, gráficos y guiones anteriores. Registrar la discrepancia y qué fuente se usa; no combinar un número nuevo en voz con un gráfico histórico distinto. Marca visible y desarrollo interno también se configuran por separado; ver [marca, revisiones y QA](marca-version-y-qa-visual.md).


- Consultar la fuente vigente y registrar internamente su fecha, enlace y condiciones.
- Respetar la última instrucción comercial explícita del usuario cuando sustituya una condición anterior.
- Mostrar desde el primer fotograma el dato de precio y su alcance. En V5: «Rango aprox. $3.9–$4.8 MDP ·2 y 3 recámaras ·MXN», resumen aportado por el cliente.
- Retirar el precio tras una apertura legible; V4 usó 0–3.6 segundos.
- No convertirlo en una cabecera o pie permanente durante toda la pieza.
- No presentar el rango redondeado como un precio unitario exacto ni el precio de 2R como precio de todas las casas. La lista de 29/09/2026 es histórica; el rango nuevo y su máximo son aportados por el cliente, sin inventario validado aquí. Retirar la línea visible «Precio y disponibilidad sujetos a cambio».
- La condición histórica V5 fue10% de enganche +10% en19mensualidades +80%contraentrega. El nuevo guion Legacy Doctor usa20mensualidades; leer el valor de la configuración vigente, no copiar este ejemplo histórico.
- El segundo 10% es el total distribuido en las mensualidades; no es 10% cada mes.
- Explicar la preventa como pagos flexibles para planear el desembolso y cuidar liquidez; evitar descapitalizarse es el objetivo de esa planeación, no una garantía absoluta.
- Para V5, presentar8% anual como plusvalía ESTIMADA en escenario conservador aportado por el cliente, no histórico comprobado ni rendimiento asegurado. Quitar la antigua nota visible «Plusvalía no garantizada»; conservar la calificación de estimación.
- No mencionar casa muestra: fue información interna del usuario.
- No agregar fecha de lista ni etiquetas IA sobre las tomas del anuncio.
- Mantener procedencia y naturaleza ilustrativa de las imágenes en los archivos internos.
- No presentar amenidades proyectadas como prueba de obra terminada o disponibilidad actual.

## 3. Construir un mapa semántico de imágenes

Para cada frase, registrar:

| Campo | Uso |
|---|---|
| Texto hablado y palabra inicial | Anclar el corte a la narración real. |
| Beneficio o acción | Explicar por qué aparece esa imagen. |
| Archivo y fuente original | Recuperar el activo y comprobar su procedencia. |
| SHA256 y grupo de linaje | Detectar archivos repetidos y derivados del mismo fotograma. |
| Persona y espacio | Conservar continuidad y arquitectura. |
| Encuadre y posición de subtítulos | Proteger rostros, manos y la acción importante. |
| Inicio, fin y transición | Verificar el máximo de cuatro segundos de exposición. |

Ejemplos de correspondencia literal:

- Roof garden → mostrar el roof garden, no el patio de planta baja.
- Recámaras → mostrar una recámara reconocible.
- Enganche → persona realizando o confirmando un pago conceptual en su teléfono.
- Mensualidades → calendario, presupuesto o revisión de pagos en laptop.
- Contra entrega → planeación del pago final con laptop y llaves, sin afirmar una entrega actual.
- Reunirse con la familia → convivencia o sobremesa, no una fachada vacía sin relación.

Si una frase necesita más de cuatro segundos, añadir otra toma pertinente o ajustar el guion.
No sostener una imagen más tiempo para ahorrar una generación.
No reciclar un fondo mediante espejo, recorte, cambio de color o zoom y contarlo como imagen nueva.
Un SHA256 distinto no demuestra que dos archivos sean visualmente distintos: revisar el linaje y las hojas de imágenes.
La identidad visual del proyecto puede repetirse; la prohibición se refiere a reutilizar fotografías o fondos.
El logo de marca y elementos funcionales comunes pueden mantenerse como firma de campaña.

## 4. Generar personas dentro de los renders

1. Inspeccionar primero el render oficial y la persona ficticia de referencia.
2. Usar la herramienta nativa de generación/edición de imágenes disponible.
3. Adjuntar tanto la referencia del espacio como la referencia de la persona cuando sea posible.
4. Mantener rostro, edad aparente, vestuario y relaciones entre personajes dentro de cada perfil.
5. Pedir una acción vinculada al guion y un encuadre distinto para cada toma.
6. Preservar geometría, accesos, materiales, distribución y elementos reconocibles del proyecto.
7. Pedir formato vertical con rostros y acciones dentro de zonas que permitan colocar texto.
8. Revisar manos, dispositivos, llaves, mirada, proporciones y continuidad arquitectónica. En laptops, comprobar frente/dorso, bisagra, teclado y líneas de visión: si la cámara ve la tapa exterior, ésta es lisa y no contiene una interfaz o gráfica imposible.
9. Usar ropa según situación: traje de baño en alberca, ropa deportiva y pala/tenis en pickleball, ropa casual veraniega en asadores y salón exterior; no mantener vestuario de oficina para todas las actividades.
10. Para Empresarios de este proyecto, usar el protagonista masculino solo o con esposa. Es casting del brief, no una regla general sobre género y emprendimiento.

Plantilla de prompt adaptable:

> Una fotografía publicitaria vertical, a pantalla completa, de la misma persona ficticia de la referencia.
> Conservar exactamente la arquitectura y materiales del render adjunto.
> Acción: [acción específica de la frase]. Espacio: [espacio verificado].
> Encuadre: [ángulo y distancia diferentes de las tomas anteriores].
> Mantener visibles rostro, manos y [teléfono/calendario/llaves/otra acción importante].
> Luz natural y expresión creíble. Sin texto superpuesto, logos bancarios ni cifras legibles inventadas.
> No representar una entrega o testimonio real. Sin collage, marcos ni rediseño del inmueble.

No inventar amenidades o vistas que no estén sustentadas por las fuentes. Una corrección estructural explícita del cliente debe registrarse como requisito de esa pieza y verificarse en cada imagen; no arrastrar un render histórico que lo contradiga. En el encargo Legacy Doctor se cuenta un solo tragaluz por roof. El preview V5 incluye alberca, pickleball, asadores y salón de usos múltiples al aire libre, primeras áreas proyectadas a construir. No convertir el pabellón abierto en salón cerrado ni afirmar disponibilidad actual. Presentar estas amenidades después de la apertura, vinculadas a lo que cada perfil valora.
Conservar los PNG originales y documentar cuáles se usaron; las hojas de contacto son sólo material de revisión.
Entregar las imágenes generadas también como archivos individuales cuando lo solicite el usuario.

## 5. Producir voz, subtítulos y música

- Generar una voz continua por anuncio o bloques largos que respeten respiraciones naturales.
- No sintetizar una frase aislada por cada toma de dos o tres segundos.
- Obtener tiempos por palabra o una alineación fiable de la narración final.
- Los cortes siguen las palabras; no modificar la velocidad de cada frase para acomodar fotos arbitrarias.
- Incrustar todos los subtítulos en el MP4; el SRT adicional no sustituye esta obligación.
- Usar grupos breves, normalmente de dos a cuatro palabras, con énfasis sobre la palabra pronunciada.
- Permitir grupos más cortos para respetar un corte o una respiración.
- Partir un grupo al cambiar de imagen y asignar su posición a la nueva toma.
- No tapar ojos, boca, manos, pantalla o documento cuando sostengan el sentido de la frase.
- Usar titulares editoriales sólo cuando aporten jerarquía; no duplicar párrafos completos de la voz.
- Elegir una grabación musical distinta para cada perfil; cambiar volumen o tempo de la misma pista no basta.
- Buscar arreglos profesionales con impulso y entrar en un compás activo, evitando introducciones lentas.
- V4 usó aproximadamente 125/130/120 BPM; elegir el ritmo por intención y marca, no por copiar esos números.
- Registrar título, autor, URL, licencia, fecha de revisión y restricciones de uso.
- No afirmar que una pista licenciada es original propia o carece de derechos de autor.
- Reforzar SFX diferentes en entradas de texto, cifras y motion graphics, además de cambios de plano, con causa visible y pico sincronizado. Usar transiciones B-roll motivadas por acción, objeto o dirección de movimiento; no repetir el mismo efecto como plantilla.
- Evitar tonos sintéticos, notificaciones y el mismo whoosh en cada palabra.
- Mantener voz inteligible y música subordinada; conservar cola suficiente para que el CTA no termine cortado. Centrar logotipo, «Más información», texto de llamada y flecha en todos los cierres. Usar azul marino/dorado profesional en vez del mint de Empresarios.
- En una entrega de video conservar el mix narrado integrado. Cuando el mismo usuario pida reorganizar sus materiales para continuar sus propios anuncios, incluir también la voz limpia alineada y los componentes exactos de música/SFX de ese proyecto con licencias, URLs y función de edición. No confundir esa organización con una librería de stock para nuevos terceros ni conceder derechos de redistribución. Ver [entrega portable](entrega-portable-ia.md).
- Si se preparan stems de trabajo, documentar su tratamiento antes/después del mastering y si su suma reproduce el master o sólo sirve como aproximación editable. Cambiar el contenedor no altera la licencia de la música o los efectos.
- Medir y decodificar el audio. No afirmar una escucha humana o una evaluación auditiva que no ocurrió.

## 6. Reedición desde un video de referencia

Cuando el usuario elige un MP4 como fuente del guion y pide adaptar su estilo de animación:

1. Conservar el archivo adjunto y registrar duración, resolución y origen. Examinar su montaje completo con muestras representativas de las transiciones y los gráficos, además de las imágenes estáticas de contexto.
2. Recuperar el guion hablado y contrastarlo con el texto original del cliente si existe. Usar reconocimiento de voz como apoyo y corregir nombres, importes y fechas con evidencia. No sustituirlo por otra revisión pulida del asistente cuando el usuario pidió el mismo guion.
3. Documentar los mecanismos de animación observados: orden de construcción, trazado de líneas, aparición de números, movimiento de cámara y acentos de sonido. Reinterpretarlos con una composición propia; no afirmar que se recuperaron las capas originales del MP4.
4. Resolver datos con la última instrucción explícita. Si ésta exige conservar la locución de la referencia, las gráficas se ajustan a ese guion. Registrar cualquier diferencia con imágenes históricas: en Doctor V7, la narración elegida indica mediados de 2028, mientras una gráfica de contexto muestra diciembre de 2028. No combinar ambas fechas ni inventar una confirmación comercial adicional.
5. Recomponer las infografías horizontales para lectura vertical. Dar prioridad al dato que se dice en cada momento y construir el puente, rutas o curvas por etapas. Usar SVG/texto editable para números y diagramas; los recortes verificables de mapas pueden conservar su geografía original. No inventar coordenadas a partir de una ilustración.
6. Mantener captions durante los mapas y gráficos. Dividirlos en los cortes, reservarles espacio y comprobarlos también en el archivo codificado. Titulares y leyendas no reemplazan la transcripción completa.
7. Expresar escenarios de apreciación como proyecciones o estimaciones con base, tasa y horizonte coherentes. No transformar el valor estimado a cinco años en valor a la entrega. Los datos concretos pertenecen a la configuración, no a la regla general de la skill.
8. Generar una narración continua cuando se cambie la voz. Para retirar pausas excesivas, identificar centros de silencio por energía de audio, conservar los extremos y verificar que ninguna palabra sea cortada. Guardar el mapa de recortes y realinear palabras, cortes, captions, música y SFX al reloj resultante. No borrar respiraciones indiscriminadamente ni usar silencio cero como objetivo literal.
9. Verificar continuidad de la mezcla y de los visuales sin huecos muertos. Medir duración y picos, decodificar y separar estos controles de una escucha humana; no declarar ésta si no ocurrió. Sincronizar el pico de cada SFX con la llegada visible del texto, cifra o acción, no siempre con el inicio de escena.
10. Contar cada fotografía una sola vez dentro del alcance solicitado. Comprobar SHA256, fuente y parentesco visual: cambiar el encuadre no crea otra foto. Una gráfica editable que evoluciona durante una secuencia no es una foto reutilizada. Verificar también que una toma breve termine su animación antes del siguiente corte.

La petición de entregar el MP4 en el chat autoriza renderizarlo y verificarlo; conservar las versiones anteriores y enlazar el archivo final. Registrar por separado revisión técnica, entrega y feedback estético del usuario.

## Titulares complementarios y cambio de voz

Cuando haya subtítulos completos, usar el titular opcional para sumar una consecuencia o beneficio: ante una alberca, «Recarga tu energía»; ante la planeación, «Distribuye el desembolso». Evitar copiar la frase de la locución en otra capa. Los datos de decisión como precio, pagos y CTA pueden tener énfasis gráfico explícito. Comprobar que todo el texto llegue a verse antes del corte.

Si el usuario rechaza una voz por robótica, registrar el rechazo de esa versión y probar otra síntesis/prosodia dentro del presupuesto autorizado. Solicitar una locución continua, dirección regional discreta y ritmo conversacional, sin retiming para forzar el montaje. Regenerar el reloj de escenas, palabras, subtítulos y sonido. El texto del prompt no demuestra un acento logrado ni sustituye una escucha real; declarar qué revisión se hizo.
