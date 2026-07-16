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

Las opciones se procesan mediante un registro de acciones (`cliActions`), permitiendo ampliar la interfaz agregando nuevas entradas sin modificar la lógica principal.

La validación de argumentos se delega completamente al módulo `validator`.

No conoce la lógica del pipeline.

---

### validator.js

Centraliza las validaciones de la interfaz de línea de comandos.

Actualmente implementa:

- Validación de opciones soportadas.
- Validación de argumentos obligatorios.

Las reglas utilizan la definición de cada acción (`consumes`) para evitar duplicación de información.

Está preparado para incorporar nuevas validaciones sin modificar `cli.js`.

---

### index.js

Coordina todo el flujo.

No contiene lógica de negocio.