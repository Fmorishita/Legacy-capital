# California · inversión y uso propio · v2 (montaje con fotos)

- Base: guion, storyboard y montaje V2 de Fran (carpeta de Drive del 18 nov 2026).
- Cambios que pidió Fran ese mismo día:
  1. Equipamiento: se agrega el **baño** antes del roof garden, con su foto. En Higgsfield no había video del baño, así que se usó el render del baño y no se gastaron créditos.
  2. El monto del equipamiento pasa a **$25,000 USD**, en dólares como los precios.
  3. Al inicio ya no aparecen los precios. «Trabajas en EE.UU.» y «Ganas en dólares» van como afirmación, no como pregunta.
  4. La plusvalía usa la información de la animación del Doctor: curvas de 8% y 10% anual sobre la misma casa. Se quitaron el título «Paga poco a poco» y las barras del plan de pagos.
  5. Voz nueva, gratuita y más fluida. Se generó con Qwen3-TTS 1.7B (licencia Apache 2.0, uso comercial permitido). El locutor se diseñó con una descripción de texto y no clona a ninguna persona real. El modelo base mantiene el mismo timbre en los 13 párrafos.
- Proyecto: `videos/punta-pacifico-california-v2-es/`. `build.py` genera `index.html` a partir de los tiempos por palabra de la voz.

## Guion final (voz)

1. Trabajas en Estados Unidos, ganas en dólares… ¿Y si tu próxima casa de inversión y descanso estuviera en México?
2. Conoce este nuevo proyecto residencial en Ensenada. Casas de un nivel, con tu propio roof garden y vista al mar para vivir los mejores atardeceres.
3. Está en la carretera principal de El Sauzal, a una hora y media de la frontera con San Diego, a una hora de Tijuana y a tres horas de Mexicali.
4. Hay casas de dos habitaciones desde doscientos quince mil dólares y de tres desde doscientos treinta y cinco mil dólares.
5. ¿La quieres rentar por temporadas? Desde tu celular puedes controlar las luces, los minisplits y la cerradura.
6. El residencial tendrá acceso controlado con seguridad las veinticuatro horas, los siete días de la semana.
7. Puedes cuidar tu liquidez con diez por ciento de enganche, otro diez por ciento dividido en veinte mensualidades y el ochenta por ciento contra entrega, prevista para mediados de dos mil veintiocho.
8. Así puedes planear tu patrimonio desde hoy y aprovechar el potencial de plusvalía mientras pagas.
9. Si reservas este mes, obtén equipamiento en cocina, cuartos, **baño** y roof garden por un valor de hasta **veinticinco mil dólares**.
10. Imagina despertar en tu casa y pasar la mañana en la alberca. ¿Se arma una partida de pickleball?
11. Habrá asadores para la carne asada y un salón al aire libre para reunir a la familia.
12. Y al caer la tarde, el Pacífico desde tu propio rooftop.
13. Haz clic en el botón de abajo para recibir más información con Legacy Capital.

## Trazabilidad de datos

| Párrafo | Dato | En pantalla | Fuente |
|---|---|---|---|
| 2 | Casas de un nivel, roof garden, vista al mar | Titulares | Guion V2 de Fran |
| 3 | Frontera ≈1 h 30, Tijuana ≈1 h, Mexicali ≈3 h | Mapa y renglones «aprox.» con nota de tiempos aproximados | Guion V2 de Fran. **Pendiente:** el mg1 del Doctor decía Tijuana 1 h 10 min |
| 4 | 2 hab. desde $215,000 USD; 3 hab. desde $235,000 USD | Precio grande con contador (ya no en el hook) | Guion V2 de Fran |
| 5 | Control de luces, minisplits y cerradura desde el celular; renta por temporadas | Chips | Guion V2 de Fran |
| 6 | Acceso controlado, seguridad 24/7 | Titulares «Acceso controlado» y «Seguridad 24/7» | Guion V2 de Fran (amenidad futura: «tendrá») |
| 7 | 10% enganche + 10% en 20 mensualidades + 80% contra entrega, mediados de 2028 | Barra 10/10/80 y tarjetas | Guion V2 de Fran |
| 7 | Ej.: $21,500 USD y 20 × $1,075 USD | Con la nota «*Ejemplo con casa de 2 habitaciones desde $215,000 USD» | **PROPUESTA**: es un cálculo sobre el precio del guion |
| 8 | Plusvalía proyectada al 8% y 10% anual sobre $215,000 USD, hasta mediados de 2028 (19 meses), 2031 y 2034 | Curvas, valores y cálculo con supuestos visibles; «Escenario ilustrativo, no garantizado» | Supuestos de la animación del Doctor ya aprobada (8% y 10%), por pedido de Fran. Las cifras son un cálculo |
| 9 | Equipamiento en cocina, cuartos, baño y roof garden por hasta $25,000 USD al reservar este mes | Chips y contador $25,000 USD | Fran, 18 nov 2026 |
| 10–11 | Alberca, pickleball, asadores, salón al aire libre | Titulares | Guion V2 de Fran (amenidades futuras: «habrá») |
| 13 | CTA y WhatsApp +52 646 256 3006 | Botón, WhatsApp y placa final | Cierre del Doctor |

## Checklist de cumplimiento (pendiente de validación legal)

- [ ] Precios y equipamiento solo en USD. La NOM-247 5.6 pide pesos aunque también se muestre USD; no hay tipo de cambio en el brief.
- [ ] Promoción «este mes» sin vigencia ni términos (LFPC art. 48).
- [ ] Plusvalía como escenario con supuestos visibles y sin garantía. Validar que se pueda usar en anuncios.
- [ ] Amenidades futuras (seguridad 24/7, alberca, pickleball, asadores, salón) mostradas con imágenes generadas por IA y sin «Imagen ilustrativa» (decisión de Fran).
- [ ] Datos del proveedor completos (domicilio, correo).
- [ ] Renta por temporadas sin cifras de ocupación ni de ingresos.

## Música y voz

- Música: «Happy Times», Alejandro Magaña (Mixkit Stock Music Free License: uso comercial y en anuncios, sin atribución).
- Voz: Qwen3-TTS-12Hz-1.7B-VoiceDesign + Base (Apache 2.0). El locutor se generó por descripción («voz masculina grave y cálida, español mexicano nativo, ritmo ágil»).
