# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad

Cada módulo posee una única responsabilidad.

---

## Estructura

src/

loader.js
↓
inspector.js
↓
parser.js
↓
filter.js
↓
normalizer.js
↓
formatter.js
↓
markdown.js
↓
writer.js
↓
validator.js
↓
cli.js
↓
index.js

---

## Testing

El proyecto incorpora pruebas automatizadas de forma incremental.

Los módulos se validan de manera independiente, comenzando por aquellos completamente puros y sin dependencias externas.

La estrategia prevista es:

Formatter
↓
Validator
↓
Parser
↓
Filter
↓
Normalizer
↓
Markdown
↓
Loader / Writer

---

## Responsabilidades

### loader.js

Carga archivos JSON.

No interpreta datos.

---

### inspector.js

Obtiene estadísticas de la conversación.

No modifica información.

---

### parser.js

Transforma el árbol de conversación (`mapping`) en una lista de mensajes.

No filtra ni modifica contenido.

El módulo cuenta con pruebas automatizadas independientes.

---

### filter.js

Elimina mensajes que no pertenecen a la conversación visible.

No altera el contenido de los mensajes restantes.

---

### normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

---

### formatter.js

Centraliza el formateo de datos comunes.

Actualmente implementa:

- Fechas
- Bloques de cita (Markdown)

Está preparado para incorporar nuevos formateadores sin modificar el resto del pipeline.

El módulo cuenta con pruebas automatizadas independientes.

No conoce el formato de salida (Markdown, HTML, PDF, etc.).

---

### markdown.js

Convierte la conversación normalizada a Markdown.

No conoce el JSON original.

---

### writer.js

Escribe archivos en disco.

No interpreta contenido.

---

### cli.js

Interpreta las opciones de la línea de comandos y construye la configuración de ejecución.

Actualmente implementa:

- Lectura de argumentos.
- Valores por defecto.
- Ayuda integrada (`-h`, `--help`).
- Consulta de versión (`-v`, `--version`).
- Selección del archivo de entrada (`-i`, `--input`).
- Selección del archivo de salida (`-o`, `--output`).
- Cada acción declara el grupo lógico al que pertenece, permitiendo tratar como equivalentes las opciones cortas y largas.
- Modo inspección (`-in`, `--inspect`).
- Modo sin escritura (`-nw`, `--no-write`).

Las opciones se procesan mediante un registro de acciones (`cliActions`), permitiendo ampliar la interfaz agregando nuevas entradas sin modificar la lógica principal.

La validación de argumentos se delega completamente al módulo `validator`.

No conoce la lógica del pipeline.

---

### validator.js

Centraliza las validaciones de la interfaz de línea de comandos.

Actualmente implementa:

- Opciones válidas.
- Parámetros obligatorios.
- Verificación de que un parámetro obligatorio no sea otra opción.
- Detección de opciones repetidas mediante grupos lógicos.
- Validación de extensiones.
- Validación de existencia de archivos y directorios.

Los mensajes de validación se encuentran desacoplados de la lógica mediante `validatorMessages`.

El módulo cuenta con pruebas automatizadas independientes.

No conoce la lógica del pipeline.

---

### index.js

Coordina la ejecución del pipeline.

Decide qué etapas ejecutar según la configuración recibida desde la CLI.

Puede finalizar anticipadamente según el modo de ejecución (`--inspect`, `--no-write`).

No contiene lógica de negocio.