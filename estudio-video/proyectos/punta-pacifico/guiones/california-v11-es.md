# California v11 (preview), vertical 9:16, español, 43.5 s

Fecha: 27 nov 2026. El guion y las reglas vienen del plan de Meta para el video A · California, que Fran coordinó con la sesión «BUSINESS MANAGER meta». Ese anuncio tenía el peor resultado: 5.3 % de las personas llega al 25 % del video, CTR de 1.7 % y $102 por conversación.

Reglas de Fran para esta versión:
- No gastar créditos de Dreamina ni de Higgsfield.
- Duración máxima de 45 s.
- Ubicación y precio en los primeros 3 s.
- Ningún cuadro vacío entre escenas.
- Logo chico durante el video y sin placa final.
- Siempre «con vista al mar».

## Voz

Qwen3-TTS 1.7B Base (Apache 2.0) en local, sin costo, con el timbre de la voz de California v10.
- Ensamblada con `atempo` ×1.139 (sin rubberband).
- Medida con DNSMOS: OVRL 3.28 (la de v10 da 3.49).
- Tiempos por palabra con alineación forzada (`alinear.py`).

## Guion y escenas

| # | Tiempo | Voz | Pantalla | Escena (material existente) | Fuente del dato |
|---|---|---|---|---|---|
| 1 | 0–7.3 s | ¿Trabajas en Estados Unidos y ganas en dólares? Tu casa con vista al mar en El Sauzal, Ensenada, desde doscientos quince mil dólares. | «¿TRABAJAS EN EE.UU.?» y la tarjeta «CASA CON VISTA AL MAR · EL SAUZAL, ENSENADA · DESDE $215,000 USD», visible desde el cuadro 0 | **PLACEHOLDER**: pareja al atardecer (s07) y aérea (s02). Después irá una toma nueva de un californiano con laptop en una terraza con vista al mar | Precio: Fran, 18 nov 2026 (California v2). Ubicación: guion de v10 |
| 2 | 7.3–11.2 s | A una hora de Tijuana y hora y media de la garita de San Ysidro. | Mapa «A UN PASO DE CALIFORNIA», completo desde el primer cuadro, con «Tijuana 1 h» y «San Ysidro 1 h 30» | Animación del mapa | Distancias del guion de v10, «aprox. en auto» |
| 3 | 11.2–15.6 s | Casas de un nivel con roof garden privado y los mejores atardeceres del Pacífico. | «CASAS DE UN NIVEL / CON ROOF GARDEN», luego «LOS MEJORES / ATARDECERES» | Pareja brindando (s03) y asesor en el roof (s06) | Guion de v10 |
| 4 | 15.6–20.9 s | Dos recámaras desde doscientos quince mil dólares; tres recámaras desde doscientos treinta y cinco mil. | «2 RECÁMARAS DESDE $215,000 USD» y «3 RECÁMARAS DESDE $235,000 USD», cifras fijas sin contador | Recámaras (s08, s09) | Fran, 18 nov 2026 |
| 5 | 20.9–27.8 s | Separas con el diez por ciento, pagas otro diez en veinte mensualidades y el ochenta por ciento hasta la entrega en dos mil veintiocho. | Plan de pagos: 10 % de enganche, 10 % en 20 meses y 80 % contra entrega en 2028. Las 3 barras se llenan en 1 s | Animación de pagos | Guion de v10 (entrega prevista para mediados de 2028) |
| 6 | 27.8–30.6 s | Úsala tus fines de semana o réntala por temporadas. | «ÚSALA O RÉNTALA / POR TEMPORADAS» | Amigos en el rooftop al atardecer (s18) | Guion de v10 (renta por temporadas como uso posible, sin cifras de rendimiento) |
| 7 | 30.6–36.9 s | Y si reservas este mes, te llevas equipamiento incluido con valor de hasta veinticuatro mil doscientos treinta y dos dólares. | «RESERVA ESTE MES / EQUIPAMIENTO INCLUIDO», chips de cocina, cuartos, baño y roof garden, y el panel «$24,232 USD» con contador | Reserva (s13), foto de la cocina y Fran en el roof | Monto: plan de Meta de Fran (27 nov 2026), equivale a los $450,000 MXN del Empresario. **Confirmar con Fran** (v10 decía $25,000 USD) |
| 8 | 36.9–43.5 s | Escríbeme por WhatsApp con el botón de abajo y agendamos tu visita, llamada o videollamada. | «ESCRÍBEME POR WHATSAPP», «Agenda tu visita o videollamada», el botón «WhatsApp +52 646 256 3006» y una flecha hacia abajo | Asesor entrega las llaves a la pareja (s19) | Teléfono: CTA de v10 |

Escenas de v10 que se quitaron:
- Oficina con laptop.
- Pantallas vacías.
- «¿La quieres rentar?».
- Celular y seguridad.
- Plusvalía.
- Imagina, alberca, pickleball y asadores.

## Pendientes legales (para validar con el abogado)

- [ ] NOM-247: el precio aparece solo en USD; falta el equivalente en MXN.
- [ ] La promoción no muestra vigencia, términos ni restricciones (LFPC art. 48).
- [ ] Nombre, domicilio y correo del proveedor: ¿van en el texto del anuncio?
- [ ] Compradores extranjeros en zona restringida: la adquisición es por fideicomiso; el video no dice nada al respecto.
