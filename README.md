# AI Chat Exporter

> Convierte conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

AI Chat Exporter nació con un objetivo simple: preservar conversaciones de inteligencia artificial en un formato abierto, legible e independiente de la plataforma donde fueron creadas.

Actualmente permite procesar conversaciones exportadas desde ChatGPT a partir de su archivo JSON oficial y convertirlas en documentos Markdown limpios, preservando la estructura, el orden y el contexto mediante un pipeline modular y desacoplado.

El proyecto ofrece dos interfaces que comparten el mismo motor: una CLI para procesar archivos JSON locales y una extensión de Chrome que captura y exporta conversaciones directamente desde el navegador.

Aunque hoy el proyecto soporta ChatGPT y Markdown, su arquitectura fue diseñada para crecer hacia nuevos asistentes, nuevos formatos de exportación y futuras integraciones sin reescribir el núcleo de la aplicación.

---

# Índice

- [AI Chat Exporter](#ai-chat-exporter)
- [Índice](#índice)
- [Estado](#estado)
- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Extensión de Chrome](#extensión-de-chrome)
  - [Build](#build)
  - [Instalación en Chrome](#instalación-en-chrome)
  - [Uso](#uso)
- [Uso de la CLI](#uso-de-la-cli)
  - [Exportación básica](#exportación-básica)
  - [Archivo de entrada personalizado](#archivo-de-entrada-personalizado)
  - [Archivo de salida personalizado](#archivo-de-salida-personalizado)
  - [Modo compacto](#modo-compacto)
  - [Filtro por rol](#filtro-por-rol)
  - [Inspeccionar una conversación](#inspeccionar-una-conversación)
  - [Ejecutar el pipeline sin escribir archivos](#ejecutar-el-pipeline-sin-escribir-archivos)
- [Testing](#testing)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación](#documentación)
  - [Documentación de la extensión](#documentación-de-la-extensión)
- [Evolución futura](#evolución-futura)
- [Filosofía del proyecto](#filosofía-del-proyecto)
- [Licencia](#licencia)

---

# Estado

- ✅ Versión estable 1.3.0
- ✅ CLI funcional
- ✅ Extensión de Chrome integrada
- ✅ Soporte para ChatGPT
- ✅ Exportación a Markdown
- ✅ Suite de pruebas automatizadas

---

# Características

- Conversión de conversaciones exportadas desde ChatGPT a Markdown.
- Pipeline modular y desacoplado.
- Interfaz de línea de comandos (CLI) con opciones avanzadas:
  - Modo compacto, filtro por rol (`--role`), inspección y modo sin escritura.
- Extensión de Chrome con popup interactivo:
  - Selector de formato (Markdown / JSON).
  - Modo compacto y filtro de roles (todos / usuario / asistente).
  - Diseño cyberpunk con indicador de progreso y mensajes de estado.
- Build automatizado de la extensión con esbuild.
- Empaquetado en ZIP listo para distribución.
- Suite de pruebas automatizadas por módulo.
- Documentación técnica completa.

---

# Requisitos

- Node.js 20 o superior.

---

# Instalación

```bash
git clone https://github.com/GuillermoCochrane/chat-exporter.git

cd chat-exporter

npm install
```

El proyecto solo requiere `esbuild` como dependencia de desarrollo para construir la extensión. El core de la CLI funciona sin dependencias externas de npm.

---

# Extensión de Chrome

La extensión captura automáticamente el JSON de cualquier conversación de ChatGPT y la exporta a Markdown o JSON utilizando el mismo pipeline que la CLI.

## Build

```bash
npm run build:extension
```

Esto genera la carpeta `dist/` con todos los archivos necesarios.

Para crear un ZIP listo para distribuir:

```bash
npm run build:extension:zip
```

## Instalación en Chrome

1. Abrí `chrome://extensions/`.
2. Activá **Modo de desarrollador**.
3. Click en **Cargar descomprimida**.
4. Seleccioná la carpeta `dist/`.

## Uso

1. Andá a `https://chatgpt.com/` y abrí una conversación.
2. Hacé clic en el ícono de la extensión para abrir el popup.
3. Seleccioná el formato de exportación (Markdown o JSON).
4. Ajustá las opciones: modo compacto, filtro de roles.
5. Hacé clic en **Exportar**.
6. El archivo se descargará automáticamente.

---

# Uso de la CLI

## Exportación básica

```bash
npm start
```

Por defecto el proyecto:

- lee la conversación desde `assets/input/conversation.json`;
- genera el archivo `assets/output/conversacion.md`.

## Archivo de entrada personalizado

```bash
npm start -- -i assets/input/conversation.json
```

## Archivo de salida personalizado

```bash
npm start -- -i assets/input/conversation.json -o assets/output/prueba.md
```

## Modo compacto

```bash
npm start -- -i assets/input/conversation.json -o assets/output/prueba.md -c
```

## Filtro por rol

```bash
npm start -- -i assets/input/conversation.json -o assets/output/user.md --role user
npm start -- -i assets/input/conversation.json -o assets/output/assistant.md --role assistant
```

## Inspeccionar una conversación

```bash
npm start -- --inspect
```

## Ejecutar el pipeline sin escribir archivos

```bash
npm start -- --no-write
```

---

# Testing

Ejecutar toda la suite:

```bash
npm test
```

Ejecutar una batería específica:

```bash
npm run test:formatter
npm run test:validator
npm run test:parser
npm run test:filter
npm run test:normalizer
npm run test:markdown
npm run test:markdown:compact
npm run test:loader
npm run test:writer
```

Actualmente existen pruebas automatizadas para:

- Formatter
- Validator
- Parser
- Filter
- Normalizer
- Markdown
- Markdown (modo compacto)
- JsonFileSource
- Writer

---

# Arquitectura

La aplicación se organiza en capas desacopladas:

```text
Interface (CLI / Chrome Extension)
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
   ┌────────────┐
   │ Inspector  │
   │ Parser     │
   │ Filter     │
   │ Normalizer │
   └────────────┘
        │
        ▼
Renderer (Markdown)
        │
        ▼
Output (Archivo / Descarga)
```

Cada módulo posee una única responsabilidad. El Core desconoce el origen de la conversación, la interfaz que inició el proceso y el destino final del resultado.

---

# Estructura del proyecto

```text
src/
├── main.js
├── configuration/
│   ├── pipelineConfig.js
│   └── pipelineProfiles.js
├── core/
│   ├── exporter.js
│   ├── pipeline.js
│   ├── inspector.js
│   ├── parser.js
│   ├── filter.js
│   ├── normalizer.js
│   ├── markdown.js
│   ├── writer.js
│   ├── sources/
│   │   ├── index.js
│   │   ├── jsonFile.js
│   │   ├── jsonFile.stub.js
│   │   └── extensionSource.js
│   ├── renderers/
│   └── outputs/
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
│       └── styles/
│           ├── popup.css
│           ├── variables.css
│           ├── base.css
│           ├── selector.css
│           ├── options.css
│           ├── button.css
│           └── footer.css
└── utilities/
    ├── formatter.js
    └── validator.js
```

---

# Documentación

La documentación está organizada por responsabilidad.

| Documento | Propósito |
|-----------|-----------|
| [ROADMAP](docs/ROADMAP.md) | Estado actual y planificación del proyecto. |
| [CHANGELOG](docs/CHANGELOG.md) | Historial completo de versiones. |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Organización interna del sistema. |
| [DATA_FLOW](docs/DATA_FLOW.md) | Recorrido conceptual de los datos. |
| [INTEGRATION](docs/INTEGRATION.md) | Contratos entre interfaces y Core. |
| [DECISIONS](docs/DECISIONS.md) | Registro de decisiones de arquitectura (ADR). |
| [LABORATORY](docs/LABORATORY.md) | Hipótesis, experimentos y descubrimientos. |
| [MANUAL-TESTING](docs/MANUAL-TESTING.md) | Casos de prueba manuales. |

## Documentación de la extensión

| Documento | Propósito |
|-----------|-----------|
| [ROADMAP](docs/extension/ROADMAP.md) | Estado y fases de la extensión. |
| [ARCHITECTURE](docs/extension/ARCHITECTURE.md) | Diseño interno de la extensión. |
| [CAPTURE_RESEARCH](docs/extension/CAPTURE_RESEARCH.md) | Investigación sobre la captura del JSON. |

---

# Evolución futura

Entre las funcionalidades previstas se encuentran:

- Exportación HTML.
- Exportación PDF.
- Exportación Obsidian.
- Soporte para Gemini.
- Soporte para Claude.
- Soporte para DeepSeek.
- Soporte para Google AI.
- API REST.
- Aplicación de escritorio.
- Configuración avanzada de formatos.
- Templates de Markdown.

---

# Filosofía del proyecto

AI Chat Exporter prioriza:

- Arquitectura modular.
- Responsabilidad única por módulo.
- Bajo acoplamiento.
- Evolución incremental.
- Documentación como parte del desarrollo.
- Pruebas automatizadas para preservar el comportamiento.

El objetivo no es únicamente convertir conversaciones entre formatos. La visión del proyecto es construir una base sólida que permita preservar conversaciones de inteligencia artificial en formatos abiertos, facilitando su reutilización e incorporando nuevas plataformas y nuevos formatos sin comprometer el núcleo de la aplicación.

---

# Licencia

MIT License.

---
