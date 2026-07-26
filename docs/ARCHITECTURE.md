# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad.
- Configuración declarativa cuando aporta extensibilidad.

Cada módulo posee una única responsabilidad.

La arquitectura busca que el núcleo del motor permanezca completamente independiente de las interfaces de entrada, las fuentes de conversación, los renderizadores y los mecanismos de salida, facilitando su reutilización y evolución.

---

# Estructura

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
│   ├── exporter.js
│   ├── pipeline.js
│   ├── inspector.js
│   ├── parser.js
│   ├── filter.js
│   ├── normalizer.js
│   │
│   ├── sources/
│   │   ├── index.js
│   │   ├── jsonFile.js
│   │   └── extensionSource.js
│   │
│   ├── renderers/
│   │   └── .gitkeep
│   │
│   └── outputs/
│       └── .gitkeep
│
├── interfaces/
│   ├── cli.js
│   └── extension/
│
└── utilities/
    ├── formatter.js
    └── validator.js
```

La arquitectura separa cuatro responsabilidades claramente diferenciadas:

- **Interfaces**, que construyen la configuración.
- **Conversation Sources**, que obtienen una conversación desde cualquier origen.
- **Core**, que procesa conversaciones sin conocer su procedencia.
- **Renderers / Outputs**, encargados de transformar y entregar el resultado.

Esta separación permite incorporar nuevas interfaces, nuevas fuentes y nuevos formatos de exportación sin modificar el núcleo del motor.

---

# Pipeline

## Orquestación

```text
Interface
        │
        ▼
Pipeline Profile
        │
        ▼
Pipeline Config
        │
        ▼
runExporter
        │
        ▼
Conversation Source
        │
        ▼
Conversation
        │
        ▼
runPipeline
```

`runExporter()` coordina la ejecución completa.

Resuelve la fuente correspondiente, obtiene la conversación, ejecuta el pipeline, invoca el renderer adecuado y entrega el resultado mediante el mecanismo de salida inyectado por la interfaz.

---

## Procesamiento

```text
Conversation
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
Normalized Conversation
```

`runPipeline()` representa el núcleo puro del proyecto.

Recibe una conversación ya cargada y únicamente ejecuta las etapas de procesamiento.

No conoce interfaces, fuentes, renderizadores ni mecanismos de salida.

---

# Testing

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
JsonFileSource ✔
Writer ✔
```

Además de la suite automatizada, el proyecto incorpora validaciones manuales para inspección, modos especiales y preparación de releases.

---

# Responsabilidades

## sources/

Implementa las distintas fuentes de conversación soportadas por el sistema.

Cada Source recibe el objeto `config` completo y extrae lo que necesita para obtener la conversación.

Actualmente el proyecto implementa:

- `jsonFile.js`
- `extensionSource.js`

Las Sources siempre entregan una `Conversation` sin interpretar su contenido.

El Core permanece completamente desacoplado del origen de los datos.

---

## configuration/

Centraliza la configuración compartida del pipeline.

Actualmente define:

- configuración base;
- perfiles de ejecución.

Las interfaces reutilizan esta configuración sin duplicar valores por defecto.

---

## exporter.js

Coordina la ejecución completa del proceso de exportación.

Su responsabilidad consiste en:

- resolver la Conversation Source;
- obtener la conversación;
- ejecutar `runPipeline`;
- seleccionar el renderer correspondiente;
- delegar el mecanismo de salida mediante `config.outputHandler`.

No implementa procesamiento de conversaciones.

No conoce el mecanismo concreto de salida (archivo, descarga, etc.).

---

## pipeline.js

Representa el núcleo del motor.

Ejecuta exclusivamente el procesamiento interno:

- Inspector
- Parser
- Filter
- Normalizer

Devuelve la conversación normalizada y el reporte generado por el Inspector.

No conoce:

- interfaces;
- fuentes;
- renderizadores;
- mecanismos de salida.

---

## inspector.js

Obtiene estadísticas de la conversación.

No modifica información.

Puede utilizarse como punto de finalización anticipada mediante `--inspect`.

---

## parser.js

Transforma el árbol (`mapping`) en una lista de mensajes.

No filtra ni modifica contenido.

Cuenta con pruebas automatizadas independientes.

---

## filter.js

Elimina mensajes que no pertenecen a la conversación visible.

No altera el contenido restante.

Cuenta con pruebas automatizadas independientes.

---

## normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

Cuenta con pruebas automatizadas independientes.

---

## formatter.js

Centraliza el formateo reutilizable.

Actualmente implementa:

- fechas;
- bloques de cita;
- nombres de roles.

No conoce ningún formato de salida.

Cuenta con pruebas automatizadas independientes.

---

## renderers/

Contendrá los distintos renderizadores soportados por el proyecto.

Actualmente se encuentra preparado mediante `.gitkeep`.

El primer renderer previsto es Markdown.

---

## outputs/

Contendrá los distintos mecanismos de salida.

Ejemplos futuros:

- escritura en disco;
- descarga desde extensión;
- respuesta HTTP;
- clipboard.

Actualmente se encuentra preparado mediante `.gitkeep`.

---

## writer.js

Implementa la escritura de archivos en disco.

No interpreta contenido.

Representa únicamente uno de los posibles mecanismos de salida.

---

## cli.js

Construye el perfil de ejecución solicitado por el usuario.

Los valores por defecto provienen del módulo `configuration`.

Actualmente implementa:

- lectura de argumentos;
- ayuda;
- versión;
- entrada;
- salida;
- inspección;
- modo sin escritura;
- modo compacto.

La validación se delega completamente a `validator.js`.

No conoce la ejecución del pipeline.

---

## validator.js

Centraliza todas las validaciones de la CLI.

Actualmente implementa:

- opciones válidas;
- parámetros obligatorios;
- opciones repetidas;
- extensiones;
- existencia de archivos y directorios.

No conoce el pipeline.

Cuenta con pruebas automatizadas independientes.

---

## main.js

Punto de entrada mínimo de la aplicación.

Su única responsabilidad consiste en:

- obtener la configuración desde la interfaz;
- inyectar el mecanismo de salida correspondiente;
- invocar `runExporter()`.

No contiene lógica de negocio.

---

# Distribución

Durante la serie **1.1.x** la arquitectura terminó de desacoplar el núcleo del proyecto.

Actualmente cualquier interfaz puede reutilizar el mismo motor proporcionando únicamente:

- un perfil de configuración;
- una Conversation Source;
- un renderer;
- un mecanismo de salida.

Esta organización permite incorporar nuevas interfaces (como la extensión de Chrome), nuevos formatos y nuevas salidas sin modificar el Core.

---
