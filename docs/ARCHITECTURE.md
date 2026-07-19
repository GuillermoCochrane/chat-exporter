# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad
- Configuración declarativa cuando aporta extensibilidad.

Cada módulo posee una única responsabilidad.

---

## Estructura

src/

loader
↓
inspector
↓
parser
↓
filter
↓
normalizer
↓
formatter
↓
markdown
↓
writer

Orquestación

validator
↓
cli
↓
index

---

## Testing

El proyecto incorpora pruebas automatizadas de forma incremental.

Los módulos se validan de manera independiente, comenzando por aquellos completamente puros y sin dependencias externas.

La estrategia prevista es:

Formatter ✔
↓
Validator ✔
↓
Parser ✔
↓
Filter ✔
↓
Normalizer ✔
↓
Markdown ✔
↓
Loader / Writer (pendiente)

---

## Responsabilidades

### loader.js

Carga archivos JSON.

No interpreta datos.

---

### inspector.js

Obtiene estadísticas de la conversación.

No modifica información.

Puede utilizarse como punto de finalización anticipada del pipeline mediante `--inspect`.

---

### parser.js

Transforma el árbol de conversación (`mapping`) en una lista de mensajes.

No filtra ni modifica contenido.

El módulo cuenta con pruebas automatizadas independientes.

---

### filter.js

Elimina mensajes que no pertenecen a la conversación visible.

No altera el contenido de los mensajes restantes.

El módulo cuenta con pruebas automatizadas independientes.

---

### normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

El módulo cuenta con pruebas automatizadas independientes.

---

### formatter.js

Centraliza el formateo de datos comunes.

Actualmente implementa:

- Formateo de fechas.
- Formateo de bloques de cita Markdown.
- Formateo de roles (`user` → Usuario, `assistant` → Asistente).

Permite incorporar nuevos formateadores sin modificar el resto del pipeline.

El módulo cuenta con pruebas automatizadas independientes.

No conoce el formato de salida (Markdown, HTML, PDF, etc.).

---

### markdown.js

Convierte la conversación normalizada a Markdown.

Utiliza el módulo `formatter` para delegar el formateo de fechas, roles y bloques de cita.

Admite distintos modos de exportación mediante opciones de configuración (por ejemplo, modo compacto).

El módulo cuenta con pruebas automatizadas independientes.

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
- Modo compacto (`-c`, `--compact`).

Cada opción se declara mediante el registro `cliActions`, permitiendo ampliar la interfaz sin modificar el flujo principal de procesamiento.

La validación de argumentos se delega completamente al módulo `validator`.

No conoce la ejecución del pipeline.

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

El módulo valida las acciones declaradas por `cli.js`, sin conocer la ejecución del pipeline.

Los mensajes de validación se encuentran desacoplados mediante `validatorMessages`.

El módulo cuenta con pruebas automatizadas independientes.

---

### index.js

Coordina la ejecución completa del pipeline.

Obtiene la configuración desde la CLI y la propaga a los módulos que la requieren.

Puede finalizar anticipadamente según el modo de ejecución (`--inspect`, `--no-write`).

No implementa lógica de transformación; únicamente orquesta el flujo de ejecución.