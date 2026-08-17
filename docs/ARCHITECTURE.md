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
│   │       │   ├── languages.js
│   │       │   └── languageSettings.js
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
│   │   │   ├── flaghandler.js
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
Filter ✔
Normalizer ✔
Markdown ✔
JsonFileSource ✔
Writer ✔
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

Transforma el árbol (`mapping`) en una lista de mensajes.

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

Intercepta `window.fetch()` para capturar la respuesta del endpoint de conversación, filtrando por la presencia de `mapping`.

Al detectar una conversación completa, la envía inmediatamente al `content.js` mediante `window.postMessage` con el tipo `CONVERSATION`.  
Ya no espera una solicitud explícita; el envío es automático ante cada nueva captura.

### content.js

Actúa como puente entre la página y la extensión.

- Inyecta `inject.js` en el contexto de la página.
- Escucha los mensajes `CONVERSATION` provenientes de `inject.js` y los reenvía al `background.js` con el tipo `DOWNLOAD_JSON`.

No procesa datos; solo retransmite.

### background.js

Coordina la extensión de Chrome.

Sus responsabilidades:

- Recibir la conversación capturada desde `content.js` y almacenarla en memoria.
- Atender las solicitudes de exportación enviadas por el popup (`EXPORT`), que incluyen formato, modo compacto y filtro de roles.
- Despachar al handler correspondiente según el formato:
  - JSON: descarga directa del objeto almacenado.
  - Markdown: construye un `config` con `source: "extension"`, `compact`, `roleFilter` y un `outputHandler` basado en `chrome.downloads`, y llama a `runExporter`.
- No interpreta la conversación ni genera Markdown directamente; toda la lógica de procesamiento se delega al Core.
- Los errores se comunican mediante códigos (`errorCode`) y parámetros para que el popup pueda traducirlos al idioma del usuario.

### popup.html / js/ / styles/

Interfaz de usuario de la extensión con estética cyberpunk y sistema multi‑idioma.

`popup.html` define el layout con:
- Toggle de idioma en el encabezado (banderas SVG inline).
- Encabezado contextual que indica el proveedor de la conversación (`Exportando desde ChatGPT`), preparado para futuros modelos.
- Selector de formato (Markdown / JSON).
- Opciones exclusivas de Markdown: switch de modo compacto y radio buttons con apariencia de hardware físico para filtro de roles (`all`, `user`, `assistant`).
- Las opciones de Markdown se ocultan automáticamente al seleccionar JSON.
- Footer con la versión dinámica de la extensión.

Los scripts están organizados en `js/`:
- `popup.js`: punto de entrada principal. Gestiona el estado visual (spinner, deshabilitado del botón Exportar), el envío de mensajes `EXPORT` y la traducción de la interfaz.
- `languages.js`: helper de traducción con las claves textuales para español e inglés.
- `languageSettings.js`: detecta el idioma inicial (navegador o preferencia guardada) y persiste la elección del usuario en `chrome.storage.local`.

Los estilos están modularizados en `styles/`:
- `variables.css`: tokens de diseño (colores, sombras, transiciones) con paleta cyberpunk derivada del ícono original.
- `base.css`: estilos del body, tipografía y encabezado.
- `selector.css`: estilos del `<select>` nativo usando `appearance: base-select`.
- `options.css`: estilos del fieldset, switch de modo compacto, radio buttons físicos y el toggle de idioma.
- `button.css`: estilos del botón Exportar y sus estados.
- `footer.css`: estilos del estado de exportación (spinner, mensajes) y versión.
- `popup.css`: punto de entrada que importa todos los módulos.

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

- `assets/css/shared/`: módulos compartidos (tokens, base, header, sidebar, main, footer, content).
- `assets/css/home/`: estilos específicos de la landing.
- `assets/css/privacy.css`, `faq.css`, `cli.css`, `changelog.css`, `map.css`: orquestadores por página.

### JavaScript

- `assets/js/shared/`: módulos comunes (tema, sidebar, idioma, scroll spy, versión).
- `assets/js/languages/`: traducciones por página.
- `assets/js/*.js`: orquestadores por página (main, privacy, faq, cli, changelog, sitemap).

### Sistema multiidioma

- Detección automática del idioma del navegador.
- Toggle con banderas SVG en el header.
- Persistencia en `localStorage`.
- Traducción dinámica de textos mediante IDs.

---

## Utilities

Utilidades compartidas entre las interfaces.

### dom.js

Helpers de manipulación del DOM (`$`, `$$`, `setText`, `setValue`).

---

# Distribución

Durante la serie **1.1.x** la arquitectura terminó de desacoplar el núcleo del proyecto.

Actualmente cualquier interfaz puede reutilizar el mismo motor proporcionando únicamente:

- un perfil de configuración;
- una Conversation Source;
- un renderer;
- un mecanismo de salida.

Esta organización permite incorporar nuevas interfaces (como la extensión de Chrome y la web), nuevos formatos y nuevas salidas sin modificar el Core.

La extensión de Chrome ya utiliza este mecanismo: captura el JSON, lo entrega al core mediante `ExtensionSource`, y recibe el Markdown generado para descargarlo mediante un `outputHandler` basado en `chrome.downloads`. Incluye un popup con opciones avanzadas de exportación (formato, modo compacto, filtro de roles) y soporte multi‑idioma.

La web documenta y presenta el proyecto al público, reutilizando los mismos principios y estética visual.

---
