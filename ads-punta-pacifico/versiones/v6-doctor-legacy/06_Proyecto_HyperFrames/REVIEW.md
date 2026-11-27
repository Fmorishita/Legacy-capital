# Doctor V6 · Legacy Capital · revisión previa a exportación

Revisión de producción del 14/11/2026; evaluación estética del usuario pendiente.

28 fondos diferentes por SHA256, 9 imágenes nuevas. Cada foto dura como máximo 3.993583 s contando su salida bajo la transición. Voz nueva continua: 64.041667 s, 1537 fotogramas a 24 fps. No se usaron clips ni montaje V6 Higgsfield.

Se inspeccionaron las 28 fuentes, 40 snapshots del montaje, 6 snapshots de los ajustes de captions y 3 de la apertura final. Médico en uniforme y mar desde el inicio; roofs con un solo tragaluz; pickleball con miradas dirigidas al juego; pantallas orientadas hacia sus usuarios. Se despejaron rostros, manos, teléfono y cerradura en las escenas señaladas.

Precio de apertura 0–4 s revisado sobre ambas imágenes y durante la retirada del texto. El dorado claro de precio es #E2C98F para legibilidad, dentro de la familia dorada de Legacy. Marca y logo originales de Legacy Capital; logotipo y CTA centrados en x540. Condiciones de esta revisión: 20 mensualidades, mediados de 2028 y ahorro de hasta $450 mil por equipamiento al apartar este mes. El guion del cliente es su fuente.

`qa/check-delivery.json`: sin errores de lint, runtime, layout, contraste, craft o audio; sin advertencias visuales. Permanece una advertencia de tamaño del archivo de captions: contiene los 59 grupos editables en una sola pista. El preview local responde HTTP200 en el puerto3046.

La línea de plusvalía es conceptual, sin cifras de rendimiento, en una escena titulada como potencial. La mezcla tiene 28 acentos con causa visible, fuentes/licencias registradas, -14.98 LUFS y -1.18 dBTP. Se comprobó alineación, duración y decodificación por herramientas; no se afirma escucha humana.

La revisión de cortes motivó acoplar la máscara de entrada de los captions a la misma máscara de su imagen. Los 59 grupos conservan visibilidad completa al menos un fotograma, y se inspeccionaron siete cortes afectados tras la reparación.

El gate del MP4 codificado se registra en `qa/Verificacion_MP4_V6.json` después de exportar. Esta revisión no equivale a aprobación estética del usuario.

MP4 final decodificado completo:1537frames,1080×1920,H.264/AAC,64.041667s. Se inspeccionaron118fotogramas codificados incluidos cortes/apertura/cierre. Audio codificado:-15.03LUFS,-1.20dBTP. La revisión de producción quedó concluida; la evaluación estética del usuario permanece pendiente.
