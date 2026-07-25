# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad.
- Configuración declarativa cuando aporta extensibilidad.

Cada módulo posee una única responsabilidad.

La arquitectura busca que el núcleo del motor permanezca independiente... de las interfaces de entrada y de los formatos de salida, facilitando su reutilización y evolución.

---
## Estructura

```text
src/
│
├── main.js
│
├── configuration/
│   ├── pipelineConfig.js
│   └── pipelineProfiles.js
│
├── core/
│   ├── index.js
│   ├── inspector.js
│   ├── parser.js
│   ├── filter.js
│   ├── normalizer.js
│   ├── markdown.js
│   ├── writer.js
│   │
│   └── sources/
│       ├── index.js
│       └── jsonFile.js
│
├── interfaces/
│   ├── cli.js
│   └── extension/
│
└── utilities/
    ├── formatter.js
    └── validator.js
```

La arquitectura continúa separando el núcleo del motor de las interfaces y de los mecanismos concretos de obtención de conversaciones.

La incorporación del directorio `sources` introduce el concepto de **Conversation Source**, permitiendo que distintas interfaces obtengan conversaciones sin modificar el Core.

La configuración compartida también deja de pertenecer a una interfaz específica y pasa a centralizarse en el módulo `configuration`.

---

## Pipeline

### Procesamiento

```text
Conversation Source
        │
        ▼
Conversation (RAW)
        │
        ▼
Inspector
        │
        ▼
Parser
        │
        ▼
Filter
        │
        ▼
Normalizer
        │
        ▼
Renderer (Markdown)
        │
        ▼
Output
```

### Configuración

```text
Interface

↓

Pipeline Profile

↓

Pipeline Config

↓

Core
```

Cada interfaz únicamente construye la configuración de ejecución.

El Core permanece completamente desacoplado de la forma en que esa configuración fue obtenida.

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

### sources/

Implementa las distintas fuentes de conversación soportadas por el sistema.

Cada Source conoce únicamente cómo obtener una conversación desde un origen determinado.

Actualmente el proyecto implementa:

- `jsonFile.js`

Las Sources entregan siempre una `Conversation` sin interpretar su contenido.

El Core no conoce cómo fue obtenida esa conversación.

---

### configuration/

Centraliza la configuración compartida del pipeline.

Actualmente define:

- configuración base del motor;
- perfiles de ejecución.

Las interfaces reutilizan esta configuración sin duplicar valores por defecto.

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

Construye el perfil de ejecución solicitado por el usuario a partir de los argumentos de la línea de comandos.

Los valores por defecto provienen del módulo `configuration`, evitando que la interfaz sea la fuente de verdad del pipeline.

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

Coordina la ejecución completa del motor.

Su responsabilidad consiste únicamente en orquestar el pipeline utilizando la configuración recibida.

Resuelve la Conversation Source correspondiente, obtiene la conversación y delega el resto del procesamiento a módulos especializados.

No implementa reglas de negocio ni conoce detalles de las interfaces que invocan el pipeline.

---

## Distribución

Durante la serie **0.9.x** la arquitectura se preparó para distribución pública.

Actualmente el proyecto puede ejecutarse inmediatamente después de ser clonado gracias a:

- configuración por defecto;
- conversación mínima versionada (`input/conversation.json`);
- directorios persistentes mediante `.gitkeep`;
- pruebas reproducibles utilizando únicamente recursos versionados (`test/fixtures`).

Esta organización permite que futuras interfaces o exportadores reutilicen el mismo núcleo del proyecto sin introducir dependencias entre capas.