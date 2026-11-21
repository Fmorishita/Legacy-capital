# Cortes de la referencia

Detección: `ffmpeg -vf "crop=520:580:0:60,select='gt(scene,0.12)',showinfo"`.
- Con el umbral 0.3 sobre el cuadro completo solo detectó 5 cortes, porque la interfaz fija de Facebook tapa ≈ 45 % del cuadro y baja la puntuación de escena.
- Por eso se recortó la zona sin interfaz (520×580 desde y = 60) y se bajó el umbral a **0.12**.
- Cada candidato se verificó a mano con tiras a 10 y 30 fps (`transiciones/`). Se descartaron detecciones dobles o falsas (1.80/1.83, 19.52, 43.34) y se agregaron un jump cut (41.40) y el punto medio de los dos light leaks.

| # | Tiempo (s) | Tipo | Verificación |
|---|---|---|---|
| 1 | 1.770 | Corte seco (punch-in de abierto a medio) | t01 |
| 2 | 4.10–5.00 (medio 4.55) | Light leak | t02 |
| 3 | 6.935 | Corte seco | detector |
| 4 | 8.502 | Corte seco | detector |
| 5 | 9.918 | Corte seco | detector |
| 6 | 10.885 | Corte seco | detector |
| 7 | 12.585 | Corte seco | detector |
| 8 | 14.320 | Corte seco (el precio sale con desenfoque 3 cuadros antes) | t03 |
| 9 | 19.487 | Corte seco | t04 |
| 10 | 26.288 | Corte seco | t09 |
| 11 | 31.972 | Corte seco | t10 |
| 12 | 34.740 | Corte seco | t05 |
| 13 | 38.340 | Corte seco | detector |
| 14 | 41.400 | Jump cut (misma toma) | t07 |
| 15 | 42.10–43.30 (medio 42.70) | Light leak | t08 |

Salida cruda del detector (umbral 0.12):
1.76667 1.8 1.83333 4.80167 6.935 8.50167 9.91833 10.885 12.585 14.32 19.4867 19.52 26.2883 31.9717 34.74 38.34 43.3083 43.3417 
