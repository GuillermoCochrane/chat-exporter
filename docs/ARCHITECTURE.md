# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad.
- Configuración declarativa cuando aporta extensibilidad.

Cada módulo posee una única responsabilidad.

La arquitectura busca que el núcleo del exportador permanezca independiente de las interfaces de entrada y de los formatos de salida, facilitando su reutilización y evolución.

---

## Estructura

```text
src/
│
├── main.js
│
├── core/
│   ├── index.js
│   ├── loader.js
│   ├── inspector.js
│   ├── parser.js
│   ├── filter.js
│   ├── normalizer.js
│   ├── markdown.js
│   └── writer.js
│
├── interfaces/
│   └── cli.js
│
└── utilities/
    ├── formatter.js
    └── validator.js
```

La reorganización realizada durante la serie **0.9.x** separó el núcleo del exportador de sus interfaces y utilidades auxiliares, preparando el proyecto para incorporar nuevos puntos de entrada (API, extensión de navegador u otras interfaces) sin modificar el pipeline.

---

## Pipeline

### Procesamiento

```text
JSON
 ↓
Loader
 ↓
Inspector
 ↓
Parser
 ↓
Filter
 ↓
Normalizer
 ↓
Markdown Builder
 ↓
Writer
```

### Configuración

```text
CLI
 ↓
Validator
 ↓
Configuración
 ↓
Core (index.js)
```

---

## Testing

El proyecto incorpora pruebas automatizadas de forma incremental.

Los módulos se validan de manera independiente, comenzando por aquellos completamente puros y sin dependencias externas.

La estrategia actual es:

```text
Formatter ✔
Validator ✔
Parser ✔
Filter ✔
Normalizer ✔
Markdown ✔
Loader ✔
Writer ✔
```

Además de la suite automatizada, el proyecto incorpora baterías de validación manual para inspección, modos especiales y preparación de releases.

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

Cuenta con pruebas automatizadas independientes.

---

### filter.js

Elimina mensajes que no pertenecen a la conversación visible.

No altera el contenido de los mensajes restantes.

Cuenta con pruebas automatizadas independientes.

---

### normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

Cuenta con pruebas automatizadas independientes.

---

### formatter.js

Centraliza el formateo de datos comunes.

Actualmente implementa:

- Formateo de fechas.
- Formateo de bloques de cita Markdown.
- Formateo de roles (`user` → Usuario, `assistant` → Asistente).

Permite incorporar nuevos formateadores sin modificar el resto del pipeline.

Cuenta con pruebas automatizadas independientes.

No conoce el formato de salida (Markdown, HTML, PDF, etc.).

---

### markdown.js

Convierte la conversación normalizada a Markdown.

Utiliza `formatter` para delegar el formateo de fechas, roles y bloques de cita.

Admite distintos modos de exportación mediante opciones de configuración (por ejemplo, modo compacto).

Cuenta con pruebas automatizadas independientes.

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
- Agrupación lógica de opciones equivalentes (`group`).
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

Valida las acciones declaradas por `cli.js` sin conocer la ejecución del pipeline.

Los mensajes de validación se encuentran desacoplados mediante `validatorMessages`.

Cuenta con pruebas automatizadas independientes.

---

### index.js

Coordina la ejecución completa del núcleo del exportador.

Recibe la configuración construida por la interfaz de línea de comandos y ejecuta el pipeline respetando el modo seleccionado (`inspect`, `no-write` y `compact`).

No implementa reglas de negocio; únicamente orquesta el flujo entre módulos especializados.

---

## Distribución

Durante la serie **0.9.x** la arquitectura se preparó para distribución pública.

Actualmente el proyecto puede ejecutarse inmediatamente después de ser clonado gracias a:

- configuración por defecto;
- conversación mínima versionada (`input/conversation.json`);
- directorios persistentes mediante `.gitkeep`;
- pruebas reproducibles utilizando únicamente recursos versionados (`test/fixtures`).

Esta organización permite que futuras interfaces o exportadores reutilicen el mismo núcleo del proyecto sin introducir dependencias entre capas.