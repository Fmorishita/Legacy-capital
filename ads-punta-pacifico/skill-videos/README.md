# Videos Punta Pacífico · Skill 1.5.0

Esta carpeta contiene la skill completa. Empieza por SKILL.md; las referencias desarrollan investigación, guion, imágenes, audio, HyperFrames, animación solicitada con presupuesto, QA, kits portables para otras IA, editor visual con feedback y mantenimiento.

La versión 1.5.0 incorpora Legacy Video Studio, solicitado para editar escenas, guion, medios, audio, subtítulos, motion graphics, comentarios con tiempo y referencias de estilo, usando Doctor V6 como ejemplo. Distingue la recomposición editable del MP4 original, registra la voz pendiente cuando cambia el guion y conserva versiones portables con sus medios. El guardado local en el navegador no es sincronización automática con Drive o con el agente.

Conserva las reglas de 1.4.0: histórico V5, prueba V6-Higgsfield rechazada y revisión V6-Legacy-Capital-Doctor independiente. Marca comercial, datos vigentes, uniforme médico, un tragaluz y acción deportiva siguen siendo configuración y QA explícitos de esta pieza. Su evaluación estética sigue pendiente.

## Instalar localmente

Descomprimir el ZIP y ejecutar desde esta carpeta:

```bash
python scripts/validate.py
python scripts/install.py --workspace /ruta/al/proyecto
```

La instalación copia la skill a `~/.agents/skills/videos-punta-pacifico`, agrega un enlace de compatibilidad en `~/.codex/skills` cuando procede y coloca una regla de activación en AGENTS.md del proyecto indicado. El código de instalación usa Python3 y no descarga dependencias ni inicia sesión en servicios. Si un cliente carga las skills sólo al arrancar, abrir una nueva sesión después de instalar.

Esto es instalación en el entorno local del agente. No implica que se haya registrado en la biblioteca cloud de la cuenta de ChatGPT. Para otro cliente con importación de skills, importar el ZIP según su interfaz.

## Usar

Pedir: «Usa videos-punta-pacifico para rehacer estos anuncios» o solicitar cambios de los anuncios dentro del proyecto que contiene la regla de activación.

Los renders y la música no van dentro del paquete de la skill. El kit de materiales del proyecto es una entrega distinta y puede incluir los componentes de trabajo del propio usuario con sus licencias. El contexto incluye enlaces del proyecto y las entregas; acceder con la cuenta autorizada. HyperFrames, FFmpeg y las herramientas de generación son dependencias del trabajo de video, no del instalador. La instalación tampoco conecta Higgsfield, activa planes ni concede créditos; la cuenta y las herramientas disponibles determinan cada ejecución.

## Mantener y descargar

El usuario autorizó actualizar la skill cuando un cambio importante y reutilizable lo amerite. La actualización ocurre al trabajar en esas peticiones, no como una vigilancia en segundo plano.

Editar la regla y su referencia, registrar el motivo en CHANGELOG.md, actualizar VERSION/metadata.json y la versión en SKILL.md. Después:

```bash
python scripts/validate.py
python scripts/install.py --workspace /ruta/al/proyecto
python scripts/export.py --out /ruta/entregables
```

Exportar conserva una copia con versión y otra `latest.zip`, genera hashes y verifica que los archivos del ZIP coincidan con la carpeta fuente. Subir la descarga vigente al destino autorizado y verificarla antes de enlazarla.
