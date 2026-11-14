# Animar renders con Higgsfield dentro del presupuesto

Aplicar cuando el usuario solicite Higgsfield o un modelo de video para dar movimiento realista a los renders existentes. Leer también la skill vigente de Higgsfield y los contratos actuales de sus herramientas. Esta referencia conserva el método; no sustituye su catálogo, cotización, permisos ni instrucciones de ejecución.

## Alcance y datos del trabajo

Estado posterior: el14/11/2026 el usuario rechazó esta prueba V6 y pidió usar V5 para su kit de reedición. Este documento conserva el método histórico y sirve para futuros encargos explícitos; no autoriza reutilizar clips V6 en el kit elegido ni reiniciar generaciones por cuenta propia.

Antes de generar, distinguir si el usuario pide una cotización, una prueba de escenas o un anuncio completo. Una consulta de disponibilidad, editor o precio no autoriza una generación. Cuando ya autoriza gastar un saldo limitado para una prueba, avanzar dentro de ese alcance sin volver a pedir permiso rutinario; respetar cualquier decisión explícita exigida por las herramientas.

V6 del 10/11/2026 es una configuración concreta: Doctor, modelo confirmado `seedance_2_5` (Seedance 2.5), 720p, vertical, primeras escenas del anuncio V5 y tomas solicitadas de 3–4 segundos. El catálogo consultado permitió un mínimo de 4 segundos. El saldo observado fue 110 créditos; la cotización fue 28 por clip de 4 segundos y se enviaron tres por 84, con saldo observado de 26. Estos números describen esa ejecución y no son precios universales ni una promesa de saldo futuro. Los tres trabajos finalizaron y pasaron revisión temporal; se integraron al anuncio de36.875s exportado en720×1280.

El registro del trabajo, no el paquete portable de la skill, conserva los prompts completos, UUID de referencias y trabajos, cotizaciones y resultados. En este entorno: `v6_higgsfield/generation-ledger.json`, `final/Prompts_Seedance25_Doctor_V6.md` y `shotplan.json`.

## 1. Consultar y asignar el saldo

1. Leer saldo y estado real de la cuenta por MCP. No asumir que «cuenta gratis» implica generaciones ilimitadas o que todo saldo procede de la misma concesión.
2. Resolver el nombre solicitado con el catálogo vigente; leer parámetros, roles de medios, relaciones de aspecto y duraciones. No inventar un ID a partir del nombre coloquial.
3. Cotizar con los parámetros que se enviarán: modelo, modo, duración, resolución, cantidad, audio y referencias cuando se requieran. Una cotización no es un trabajo enviado ni valida por sí sola los medios.
4. Calcular la asignación antes de enviar: costo unitario por número de tomas, margen, máximo autorizado y saldo esperado. Priorizar las primeras escenas solicitadas; no convertir el saldo en una cuota que haya que agotar.
5. Consultar preferencias de proyecto antes de la primera generación sin destino; no crear uno si la preferencia no lo pide y el usuario tampoco lo solicitó.
6. Registrar cada envío y su estado. Comprobar el saldo observado después de los envíos y al cerrar, diferenciando gasto real y estimación.

Si la herramienta ajusta duración, resolución o cualquier parámetro con efecto sobre el costo, comprobar de nuevo la asignación antes de continuar. No tratar un valor pedido que el servidor corrigió como si hubiera sido el valor usado.

No cambiar al modelo más barato, una resolución menor o un sistema de generaciones gratuitas distinto para agotar créditos o evitar un límite del modelo pedido. Un contador gratuito de otra familia no demuestra cobertura para Seedance. Respetar los campos y gates actuales para créditos, pruebas e ilimitados; no activar planes, compras, reinicios de créditos ni pruebas nuevas como parte de esta producción.

Si una respuesta de envío se pierde, el resultado es incierto: recuperar por los medios de estado o idempotencia admitidos antes de reintentar. No enviar un segundo trabajo pagado sólo para conseguir una respuesta o un widget nuevo. Un fallo confirmado se informa y se evalúa dentro del saldo restante; no iniciar una cadena de reintentos de pago.

## 2. Preparar referencias fieles

- Usar el PNG limpio de la escena y el personaje que ya corresponde al guion. No animar un fotograma del anuncio que ya tenga precio, logo o subtítulos incrustados: podrían deformarse o duplicarse.
- Inspeccionar la referencia antes de enviarla. Registrar procedencia y hash y confirmar el medio en el servicio. Para imagen a video usar el rol real que admita el modelo; V6 utilizó `start_image`.
- Conservar el encuadre vertical aprobado. Si la fuente es horizontal, preparar un recorte técnico fiel a la composición existente y documentarlo; no pedir al modelo que rellene una casa o espacio no mostrado.
- No publicar referencias ni cambiar su acceso para transferirlas. Usar medios autorizados, URLs autenticadas de transferencia o el mecanismo de carga admitido.
- No añadir personas, amenidades, mar, puertas o superficies inexistentes. El preview sigue siendo una visualización de preventa, incluso cuando se mueve.

## 3. Diseñar el movimiento según lo narrado

Una acción pequeña y reconocible suele aportar más realismo que una cámara espectacular con geometría inestable. Para V6: pareja mirando el mar, un breve intercambio de miradas y una sonrisa; pareja en sala con respiración y asentimiento sutil; fachada estable con gesto o medio paso pequeño de las personas ya presentes.

Pedir continuidad de rostro, edad, ropa, proporciones, posición y contacto de manos. Mantener materiales, líneas de ventanas, puertas, barandales, pérgolas, mobiliario, horizonte, iluminación y perspectiva. Preferir cámara fija o un movimiento mínimo que no revele lados nuevos del proyecto. Evitar giros grandes, órbitas, caminatas complejas, recoger objetos o movimientos de dedos que no sean necesarios para la frase.

Estructura de prompt adaptable:

> Animate this exact reference as one continuous photorealistic shot. [One small action linked to the voiceover.] Natural breathing and restrained microexpressions. Keep the same people, clothes, positions and hand contacts. The architecture, dimensions, materials, furniture, openings, railings, horizon and perspective stay unchanged. Locked camera. Do not reveal unseen space, introduce new objects, cut to another shot, add text or make anyone speak.

Usar campo de prompt negativo sólo si el esquema actual lo admite. No fingir que una instrucción de conservación garantiza identidad o geometría exactas en todos los fotogramas: el resultado debe pasar revisión temporal.

## 4. Conservar el reloj del anuncio

Generar sin audio cuando el esquema y la tarea lo permitan. V6 usó `generate_audio=false` para mantener la narración, música y SFX del montaje existente; no crear diálogos ni voz de los personajes.

La duración mínima del modelo no obliga a alargar una toma, estirar la voz o repetir el clip. Generar 4 segundos y recortar a su ventana real de edición, con el tiempo de transición incluido y sin superar cuatro segundos de exposición por toma. Los primeros clips de V6 sustituyen imágenes en las mismas ventanas de V5.

Integrar videos silenciados y temporizados con el contrato del motor de composición. No reproducirlos mediante temporizadores o llamadas manuales que rompan el render determinista. Si el clip ya contiene movimiento, retirar o reducir la cámara artificial de la foto; evitar doble Ken Burns. Conservar el resto del anuncio, los subtítulos por palabra, el precio de apertura, los datos comerciales y el CTA salvo instrucciones nuevas.

La generación 720p no equivale automáticamente a una entrega 720p: verificar dimensiones del MP4 final. Si se necesita un máster de composición mayor y una reducción posterior, documentar el proceso; no presentarlo como generación nativa de mayor resolución.

## 5. Revisar y entregar

Esperar los trabajos por los mecanismos soportados sin reenviarlos. Reutilizar sus widgets cuando ya existan; no duplicar una generación para mostrarla. Distinguir pendiente, completada, fallida, aceptada e integrada.

Inspeccionar inicio, centro y final de cada clip y una tira temporal o reproducción accesible. Comparar con la referencia: rectas del inmueble, ventanas, puertas, barandal, pérgolas, horizonte, caras, ojos, manos, dedos, vestimenta y contacto de pies/objetos. Revisar cortes inesperados, nuevas superficies, deformaciones y cambios de identidad. En el montaje, comprobar que los movimientos nuevos no lleven un rostro o una mano bajo textos que antes estaban libres.

Después de integrar, revisar fotogramas codificados, continuidad de la voz, sincronía de captions, cuadros negros, dimensiones, fps, duración y niveles. Entregar una versión nueva conservando las anteriores, los clips aceptados y los prompts/parámetros útiles; registrar rechazos y cualquier tramo que siga siendo imagen fija. Dar gasto real y saldo observado. La verificación técnica no implica aprobación estética del usuario.

## Katana y editor local

La pregunta «¿podemos usar Katana?» pide primero una comprobación de disponibilidad; no autoriza por sí sola una segunda variante ni otra asignación de créditos. Resolver `/use-video-editor` según la skill actual de Higgsfield y seguir el handoff real al plugin/editor local si existe. Un resultado de instrucciones genéricas no prueba que se haya conectado un editor.

Si los controles requeridos del editor local no están disponibles, explicarlo con precisión. No afirmar que se abrió o usó Katana ni crear un sustituto de ese editor en un sandbox cloud para superar la ausencia. Diferenciar la generación ordinaria de clips que sí puede hacer el MCP de la edición interactiva que no está expuesta. Una composición con HyperFrames sigue siendo HyperFrames y sólo se hace cuando está dentro de la tarea autorizada.

No ejecutar un preset Katana, abrir una sesión de preset ni cambiar a una receta de recreación sólo por la consulta de disponibilidad. Si el usuario pide después ese flujo, resolverlo de nuevo con las instrucciones y permisos vigentes, conservando su presupuesto.
