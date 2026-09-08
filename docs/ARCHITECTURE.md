# Arquitectura

## Índice

- [Arquitectura](#arquitectura)
  - [Índice](#índice)
  - [Filosofía](#filosofía)
- [Estructura](#estructura)
- [Pipeline](#pipeline)
  - [Orquestación](#orquestación)
  - [Procesamiento](#procesamiento)
- [Testing](#testing)
- [Responsabilidades](#responsabilidades)
  - [Core](#core)
    - [sources/](#sources)
    - [configuration/](#configuration)
    - [exporter.js](#exporterjs)
    - [pipeline.js](#pipelinejs)
    - [inspector.js](#inspectorjs)
    - [parser.js](#parserjs)
    - [filter.js](#filterjs)
    - [normalizer.js](#normalizerjs)
    - [formatter.js](#formatterjs)
    - [renderers/](#renderers)
    - [outputs/](#outputs)
    - [writer.js](#writerjs)
  - [Interfaces](#interfaces)
    - [cli.js](#clijs)
    - [validator.js](#validatorjs)
  - [Extensión](#extensión)
    - [main.js](#mainjs)
    - [extensionCore.js](#extensioncorejs)
    - [inject.js](#injectjs)
    - [content.js](#contentjs)
    - [background.js](#backgroundjs)
    - [popup.html / js/ / styles/](#popuphtml--js--styles)
  - [Web](#web)
    - [Páginas](#páginas)
    - [Estilos](#estilos)
    - [JavaScript](#javascript)
    - [Sistema multiidioma](#sistema-multiidioma)
  - [Utilities](#utilities)
    - [dom.js](#domjs)
- [Distribución](#distribución)

---

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
/
├── src/
│   ├── main.js
│   ├── configuration/
│   │   ├── pipelineConfig.js
│   │   └── pipelineProfiles.js
│   ├── core/
│   │   ├── exporter.js
│   │   ├── pipeline.js
│   │   ├── inspector.js
│   │   ├── parser.js
│   │   ├── filter.js
│   │   ├── normalizer.js
│   │   ├── markdown.js
│   │   ├── writer.js
│   │   ├── sources/
│   │   │   ├── index.js
│   │   │   ├── jsonFile.js
│   │   │   ├── jsonFile.stub.js
│   │   │   └── extensionSource.js
│   │   ├── renderers/
│   │   │   └── .gitkeep
│   │   └── outputs/
│   │       └── .gitkeep
│   ├── interfaces/
│   │   ├── cli.js
│   │   └── extension/
│   │       ├── background.js
│   │       ├── content.js
│   │       ├── extensionCore.js
│   │       ├── inject.js
│   │       ├── manifest.json
│   │       ├── popup.html
│   │       ├── js/
│   │       │   ├── popup.js
│   │       │   ├── updateNotification.js
│   │       │   ├── versionHandler.js
│   │       │   ├── export/
│   │       │   │   ├── exportHandler.js
│   │       │   │   ├── exportHelpers.js
│   │       │   │   └── formatHandler.js
│   │       │   ├── languages/
│   │       │   │   ├── flagHandler.js
│   │       │   │   ├── languageHandler.js
│   │       │   │   ├── languageSettings.js
│   │       │   │   └── translations.js
│   │       │   └── utilities/
│   │       │       └── dom.js
│   │       ├── modules/
│   │       │   ├── constants.js
│   │       │   ├── postMessage.js
│   │       │   ├── inject/
│   │       │   │   ├── capture.js
│   │       │   │   ├── messaging.js
│   │       │   │   ├── scroll.js
│   │       │   │   ├── state.js
│   │       │   │   └── streamCapture.js
│   │       │   └── background/
│   │       │       ├── download.js
│   │       │       ├── exportHandlers.js
│   │       │       ├── messageHandlers.js
│   │       │       ├── notifications.js
│   │       │       └── progress.js
│   │       ├── styles/
│   │       │   ├── popup.css
│   │       │   ├── variables.css
│   │       │   ├── base.css
│   │       │   ├── selector.css
│   │       │   ├── options.css
│   │       │   ├── button.css
│   │       │   └── footer.css
│   │       └── icons/
│   └── utilities/
│       ├── formatter.js
│       └── validator.js
│
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── privacy.css
│   │   ├── faq.css
│   │   ├── cli.css
│   │   ├── changelog.css
│   │   ├── map.css
│   │   ├── shared/
│   │   │   ├── shared.css
│   │   │   ├── content.css
│   │   │   ├── variables.css
│   │   │   ├── base.css
│   │   │   ├── header.css
│   │   │   ├── sidebar.css
│   │   │   ├── main.css
│   │   │   └── footer.css
│   │   ├── home/
│   │   │   ├── hero.css
│   │   │   ├── carousel.css
│   │   │   ├── features.css
│   │   │   ├── install.css
│   │   │   ├── roadmap.css
│   │   │   └── faq.css
│   │   └── ... (otros módulos de página)
│   ├── js/
│   │   ├── main.js
│   │   ├── base.js
│   │   ├── privacy.js
│   │   ├── faq.js
│   │   ├── cli.js
│   │   ├── changelog.js
│   │   ├── sitemap.js
│   │   ├── languages/
│   │   │   ├── common.js
│   │   │   ├── home.js
│   │   │   ├── privacy.js
│   │   │   ├── faq.js
│   │   │   ├── cli.js
│   │   │   ├── changelog.js
│   │   │   └── sitemap.js
│   │   ├── shared/
│   │   │   ├── commonHandler.js
│   │   │   ├── languageHandler.js
│   │   │   ├── languageSettings.js
│   │   │   ├── flagHandler.js
│   │   │   ├── intersectionObserver.js
│   │   │   ├── sidebarToggle.js
│   │   │   ├── themeToggle.js
│   │   │   └── versionHandler.js
│   │   └── utilities/
│   │       └── dom.js
│   ├── img/
│   │   ├── icons/
│   │   ├── store/
│   │   └── social/
│   └── scripts/
│       ├── buildExtension.js
│       └── buildExtensionZip.js
│
├── pages/
│   ├── index.html
│   ├── privacy/
│   │   └── index.html
│   ├── faq/
│   │   └── index.html
│   ├── cli/
│   │   └── index.html
│   ├── changelog/
│   │   └── index.html
│   └── sitemap/
│       └── index.html
│
├── docs/
├── test/
├── package.json
└── README.md
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
Sorter ✔
Filter ✔
Normalizer ✔
Markdown ✔
JsonFileSource ✔
Writer ✔
Inspector ✔
```

Además de la suite automatizada, el proyecto incorpora validaciones manuales para inspección, modos especiales y preparación de releases.

---

# Responsabilidades

## Core

Los módulos dentro de `src/core/` y `src/configuration/` forman el núcleo del motor y no dependen de la interfaz que los use.

### sources/

Implementa las distintas fuentes de conversación soportadas por el sistema.

Cada Source recibe el objeto `config` completo y extrae lo que necesita para obtener la conversación.

Actualmente el proyecto implementa:

- `jsonFile.js`: carga una conversación desde un archivo JSON en disco.
- `extensionSource.js`: obtiene una conversación capturada por la extensión de Chrome.
- `jsonFile.stub.js`: reemplazo de `jsonFile.js` para el bundle de la extensión, donde el sistema de archivos no está disponible.

Las Sources siempre entregan una `Conversation` sin interpretar su contenido.

El Core permanece completamente desacoplado del origen de los datos.

### configuration/

Centraliza la configuración compartida del pipeline.

Actualmente define:

- configuración base;
- perfiles de ejecución.

Las interfaces reutilizan esta configuración sin duplicar valores por defecto.

### exporter.js

Coordina la ejecución completa del proceso de exportación.

Su responsabilidad consiste en:

- resolver la Conversation Source;
- obtener la conversación;
- ejecutar `runPipeline`;
- seleccionar el renderer correspondiente;
- delegar el mecanismo de salida mediante `config.outputHandler`.

No implementa procesamiento de conversaciones.

No conoce el mecanismo concreto de salida (archivo, descarga, etc.).

### pipeline.js

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

### inspector.js

Obtiene estadísticas de la conversación.

No modifica información.

Puede utilizarse como punto de finalización anticipada mediante `--inspect`.

### parser.js

Transforma el array de páginas en una lista de mensajes.

En el flujo de la extensión, las páginas llegan desde dos orígenes:

- paginación: `GET /backend-api/conversations/{id}`;
- stream SSE: `POST /backend-api/f/conversation`.

El parser ya no espera únicamente `mapping`. Ahora consume páginas con `data.messages[]`.

No filtra ni modifica contenido.

Cuenta con pruebas automatizadas independientes.

### filter.js

Filtra los mensajes conversacionales.

- Conserva únicamente mensajes con rol `user` o `assistant` y contenido de tipo `text`.
- Opcionalmente, puede filtrar por un rol específico (`user`, `assistant`) mediante el parámetro `targetRole`.
- Descarta mensajes de sistema, contextos internos y cualquier contenido que no sea texto.

Cuenta con pruebas automatizadas independientes.

### normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

Cuenta con pruebas automatizadas independientes.

### formatter.js

Centraliza el formateo reutilizable.

Actualmente implementa:

- fechas;
- bloques de cita;
- nombres de roles.

No conoce ningún formato de salida.

Cuenta con pruebas automatizadas independientes.

### renderers/

Contendrá los distintos renderizadores soportados por el proyecto.

Actualmente se encuentra preparado mediante `.gitkeep`.

El primer renderer previsto es Markdown.

### outputs/

Contendrá los distintos mecanismos de salida.

Ejemplos futuros:

- escritura en disco;
- descarga desde extensión;
- respuesta HTTP;
- clipboard.

Actualmente se encuentra preparado mediante `.gitkeep`.

### writer.js

Implementa la escritura de archivos en disco.

No interpreta contenido.

Representa únicamente uno de los posibles mecanismos de salida.

---

## Interfaces

Las interfaces construyen la configuración y delegan en el Core.

### cli.js

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

### validator.js

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

## Extensión

La extensión captura conversaciones desde ChatGPT y las envía al Core.

### main.js

Punto de entrada mínimo de la aplicación Node.

Su única responsabilidad consiste en:

- obtener la configuración desde la interfaz;
- inyectar el mecanismo de salida correspondiente;
- invocar `runExporter()`.

No contiene lógica de negocio.

### extensionCore.js

Punto de entrada del core para la extensión de Chrome.

Importa `runExporter` y lo expone en el ámbito global para que `background.js` pueda invocarlo mediante `importScripts`.

Este archivo es empaquetado por esbuild junto con todas las dependencias del pipeline, generando `dist/extensionBundle.js`.

### inject.js

Script inyectado en el contexto de la página de ChatGPT.

Intercepta `window.fetch()`.

Detecta dos flujos:

- paginación: `/backend-api/conversations/`;
- stream SSE: `/backend-api/f/conversation` (excepto `/prepare`).

Dependiendo del flujo, delega en:

- `capture.js`: para captura paginada pasiva;
- `streamCapture.js`: para captura de conversaciones nuevas;
- `scroll.js`: para forzar la carga completa;
- `state.js`: para encapsular el estado.

No descarga archivos ni interpreta conversaciones.

### content.js

Actúa como puente entre la página y la extensión.

- Inyecta `inject.js` en el contexto de la página.
- Escucha mensajes `CONVERSATION`, `PROGRESS`.
- Reenvía al background.
- Atiende solicitudes de recuperación desde background.

No procesa datos.

### background.js

Orquesta la extensión.

- Recibe conversación capturada.
- Atiende `EXPORT`.
- Construye configuración del pipeline.
- Invoca al Core si es Markdown.
- Descarga archivos y notifica resultado.

Se apoya en los módulos:

- `download.js`
- `exportHandlers.js`
- `messageHandlers.js`
- `notifications.js`
- `progress.js`

### popup.html / js/ / styles/

Interfaz de usuario de la extensión con estética cyberpunk y sistema multi‑idioma.

`popup.html` define el layout con:

- Toggle de idioma.
- Encabezado contextual.
- Selector de formato.
- Opciones de Markdown.
- Botón Exportar.
- Banner de actualización temporal.
- Footer con versión.

Los scripts están organizados en `js/`:

- `popup.js`: orquestador principal.
- `updateNotification.js`: aviso de actualización.
- `versionHandler.js`: versión dinámica.
- `export/exportHandler.js`: flujo de exportación.
- `export/exportHelpers.js`: lógica de bajo nivel.
- `export/formatHandler.js`: toggle de formato.
- `languages/*`: idioma.
- `utilities/dom.js`: helpers DOM.

Los estilos están modularizados en `styles/`.

---

## Web

La web oficial del proyecto, alojada en GitHub Pages, comparte la identidad visual cyberpunk y el sistema multiidioma.

### Páginas

- `index.html`: landing page (raíz).
- `pages/privacy/`: política de privacidad.
- `pages/faq/`: preguntas frecuentes.
- `pages/cli/`: documentación de la CLI.
- `pages/changelog/`: historial de versiones.
- `pages/sitemap/`: índice de navegación (fallback).

### Estilos

- `assets/css/shared/`: módulos compartidos.
- `assets/css/home/`: estilos específicos de la landing.
- `assets/css/privacy.css`, `faq.css`, `cli.css`, `changelog.css`, `map.css`: orquestadores por página.

### JavaScript

- `assets/js/shared/`: módulos comunes.
- `assets/js/languages/`: traducciones por página.
- `assets/js/*.js`: orquestadores por página.

### Sistema multiidioma

- Detección automática.
- Toggle visual.
- Persistencia en `localStorage`.
- Traducción dinámica.

---

## Utilities

Utilidades compartidas entre las interfaces.

### dom.js

Helpers de manipulación del DOM (`$`, `$$`, `setText`, `setValue`, `setStyle`, `hideTag`, `showTag`).

---

# Distribución

Durante la serie 1.1.x la arquitectura terminó de desacoplar el núcleo del proyecto.

Actualmente cualquier interfaz puede reutilizar el mismo motor proporcionando únicamente:

- un perfil de configuración;
- una Conversation Source;
- un renderer;
- un mecanismo de salida.

Esta organización permite incorporar nuevas interfaces, nuevos formatos y nuevas salidas sin modificar el Core.

La extensión de Chrome ya utiliza este mecanismo: captura la conversación mediante paginación o stream SSE, la entrega al core mediante `ExtensionSource`, y recibe el Markdown generado para descargarlo mediante un `outputHandler` basado en `chrome.downloads`.

El build con esbuild empaqueta:

- `extensionCore.js` → `extensionBundle.js`
- `inject.js` → `inject.js`
- `content.js` → `content.js`
- `background.js` → `background.js`

La web documenta y presenta el proyecto al público, reutilizando los mismos principios y estética visual.

---
