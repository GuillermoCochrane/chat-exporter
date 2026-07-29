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
│   │   ├── jsonFile.stub.js
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
│       ├── background.js
│       ├── content.js
│       ├── extensionCore.js
│       ├── inject.js
│       ├── manifest.json
│       ├── popup.html
│       ├── popup.js
│       └── icons/
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

El proyecto incluye además:

- `assets/scripts/buildExtension.js`: script de build que empaqueta el core para la extensión mediante esbuild.
- `assets/img/`: variantes de íconos exploradas durante el diseño de la extensión.

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

- `jsonFile.js`: carga una conversación desde un archivo JSON en disco.
- `extensionSource.js`: obtiene una conversación capturada por la extensión de Chrome.
- `jsonFile.stub.js`: reemplazo de `jsonFile.js` para el bundle de la extensión, donde el sistema de archivos no está disponible.

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

Filtra los mensajes conversacionales.

- Conserva únicamente mensajes con rol `user` o `assistant` y contenido de tipo `text`.
- Opcionalmente, puede filtrar por un rol específico (`user`, `assistant`) mediante el parámetro `targetRole`.
- Descarta mensajes de sistema, contextos internos y cualquier contenido que no sea texto.

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
- modo compacto;
- filtro por rol (`--role`).

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
- existencia de archivos y directorios;
- valores válidos para `--role`.

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

## extensionCore.js

Punto de entrada del core para la extensión de Chrome.

Importa `runExporter` y lo expone en el ámbito global para que `background.js` pueda invocarlo mediante `importScripts`.

Este archivo es empaquetado por esbuild junto con todas las dependencias del pipeline, generando `dist/extensionBundle.js`.

---

## inject.js

Script inyectado en el contexto de la página de ChatGPT.

Intercepta `window.fetch()` para capturar la respuesta del endpoint de conversación, filtrando por la presencia de `mapping`.

Al detectar una conversación completa, la envía inmediatamente al `content.js` mediante `window.postMessage` con el tipo `CONVERSATION`.  
Ya no espera una solicitud explícita; el envío es automático ante cada nueva captura.

---

## content.js

Actúa como puente entre la página y la extensión.

- Inyecta `inject.js` en el contexto de la página.
- Escucha los mensajes `CONVERSATION` provenientes de `inject.js` y los reenvía al `background.js` con el tipo `DOWNLOAD_JSON`.

No procesa datos; solo retransmite.

---

## background.js

Coordina la extensión de Chrome.

Sus responsabilidades:

- Recibir la conversación capturada desde `content.js` y almacenarla en memoria.
- Atender las solicitudes de exportación enviadas por el popup (`EXPORT`).
- Según el formato solicitado (JSON o Markdown), ejecutar la exportación correspondiente:
  - JSON: descarga directa del objeto almacenado.
  - Markdown: construye un `config` con `source: "extension"` y un `outputHandler` basado en `chrome.downloads`, y llama a `runExporter`.
- No interpreta la conversación ni genera Markdown directamente; toda la lógica de procesamiento se delega al Core.

---

## popup.html / popup.js

Interfaz de usuario de la extensión.

`popup.html` define el layout con un selector de formato (Markdown / JSON) y un botón Exportar.  
`popup.js` captura la selección del usuario y envía un mensaje `EXPORT` al `background.js` con el formato elegido.

La comunicación es unidireccional: el popup solo envía la orden de exportación y recibe confirmación de éxito o error.

---

## buildExtension.js

Script de build para la extensión.

Utiliza esbuild para empaquetar `extensionCore.js` junto con todas las dependencias del core en un único archivo `dist/extensionBundle.js`.

Incorpora un plugin que reemplaza `jsonFile.js` por `jsonFile.stub.js` para evitar dependencias de Node.js en el contexto del navegador.

Copia los archivos estáticos de la extensión (manifest, background, content, inject, popup, íconos) al directorio `dist/`.

---

# Distribución

Durante la serie **1.1.x** la arquitectura terminó de desacoplar el núcleo del proyecto.

Actualmente cualquier interfaz puede reutilizar el mismo motor proporcionando únicamente:

- un perfil de configuración;
- una Conversation Source;
- un renderer;
- un mecanismo de salida.

Esta organización permite incorporar nuevas interfaces (como la extensión de Chrome), nuevos formatos y nuevas salidas sin modificar el Core.

La extensión de Chrome ya utiliza este mecanismo: captura el JSON, lo entrega al core mediante `ExtensionSource`, y recibe el Markdown generado para descargarlo mediante un `outputHandler` basado en `chrome.downloads`. Incluye un popup que permite al usuario seleccionar el formato de salida antes de exportar.

---
