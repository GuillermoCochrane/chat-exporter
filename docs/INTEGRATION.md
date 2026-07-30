# INTEGRATION

## Objetivo

Documentar cómo las distintas interfaces de AI Chat Exporter interactúan con el Core sin modificar el pipeline interno.

Este documento define los contratos que permiten incorporar nuevas fuentes de conversaciones y nuevos formatos de salida manteniendo el bajo acoplamiento del proyecto.

---

# Filosofía

AI Chat Exporter no depende de una interfaz específica.

La CLI fue la primera interfaz implementada.

La extensión de Chrome es la segunda, ya integrada.

En el futuro podrán incorporarse otras interfaces (API REST, Clipboard, stdin, etc.) reutilizando exactamente el mismo Core.

---

# Arquitectura

```text
            Interfaces
────────────────────────────────────

CLI

Chrome Extension

REST API

Clipboard

stdin

...

            │
            ▼

──── Pipeline Profile ────

            │
            ▼

──── Pipeline Config ─────

            │
            ▼

──────── runExporter ─────

            │
            ▼

── Conversation Source ───

            │
            ▼

Conversation (RAW)

            │
            ▼

──────── runPipeline ─────

Inspector

  ↓

Parser

  ↓

Filter (por rol opcional)

  ↓

Normalizer

  ↓

Modelo canónico

            │
            ▼

────────── Renderers ─────────

Markdown

HTML

TXT

PDF

...

            │
            ▼

────────── Outputs ──────────

Archivo

Download

Clipboard

HTTP Response

...
```

# Contratos

## Conversation Source

Representa cualquier mecanismo capaz de obtener una conversación.

Cada Source recibe el objeto `config` completo y extrae lo que necesita para obtener la conversación.

Actualmente existen:

- `jsonFile`: extrae `config.input` y lee el archivo del sistema.
- `extensionSource`: extrae `config.conversation` (capturada por la extensión).

Todas las Sources devuelven una `Conversation` compatible con el contrato esperado por el pipeline.

El Core nunca conoce cómo fue obtenida esa conversación.

---

## OutputHandler

El mecanismo de salida se inyecta desde la interfaz mediante `config.outputHandler`.

El orquestador (`runExporter`) no importa ni conoce el módulo de escritura.

Cada interfaz provee su propio handler:

- **CLI**: escribe el Markdown en disco usando `writer.js`.
- **Extensión**: descarga el Markdown usando `chrome.downloads`.

Esto permite que el Core permanezca completamente independiente del entorno de ejecución (Node, navegador, etc.).

---

## Conversation

Representa el modelo de conversación entregado por una Conversation Source.

Actualmente corresponde a una conversación exportada desde ChatGPT.

El Core nunca conoce cómo fue obtenida esa conversación.

---

## Message[]

El Parser transforma la conversación original en una colección de mensajes.

A partir de este punto desaparece toda dependencia del formato específico del proveedor.

Todas las etapas posteriores trabajan únicamente con este modelo.

---

## Modelo normalizado

El Normalizer produce el modelo interno utilizado por los renderers.

Este modelo constituye la representación canónica de una conversación dentro del proyecto.

Los renderers nunca necesitan conocer el JSON original.

---

## Renderers

Los renderers transforman el modelo normalizado en una representación textual o documental.

Actualmente existe:

- Markdown

Futuros renderers:

- HTML
- TXT
- PDF

Todos reciben el mismo modelo de entrada.

---

## Outputs

Los outputs se encargan únicamente del destino final del contenido generado.

Actualmente:

- Escritura de archivo (`writer.js`) — usada por la CLI.
- Descarga desde la extensión (`chrome.downloads`) — usada por la Chrome Extension.

Futuros outputs:

- Clipboard
- HTTP Response
- Otros

El renderer no conoce cómo se entrega el resultado.

---

# Interfaces actuales

## CLI

Responsabilidades:

- interpretar argumentos;
- construir la configuración del pipeline;
- inyectar `outputHandler` que escribe en disco;
- invocar `runExporter`.

Opciones soportadas:

- `-i`, `--input`: archivo de entrada.
- `-o`, `--output`: archivo de salida.
- `-c`, `--compact`: modo compacto.
- `-r`, `--role`: filtro por rol (`all`, `user`, `assistant`).
- `-in`, `--inspect`: inspeccionar conversación.
- `-nw`, `--no-write`: pipeline sin escritura.

No conoce cómo se obtiene la conversación.

No contiene lógica de procesamiento.

---

## Chrome Extension

### Captura

La captura de la conversación sigue el flujo:

```text
ChatGPT (fetch)
    │
    ▼
inject.js
    │
    ▼
postMessage(CONVERSATION)
    │
    ▼
content.js
    │
    ▼
runtime.sendMessage(DOWNLOAD_JSON)
    │
    ▼
background.js
    │
capturedConversation
```

- `inject.js` intercepta `window.fetch()` en el contexto de la página y, al detectar una respuesta que contiene `mapping`, envía la conversación completa a `content.js` mediante `window.postMessage`.
- `content.js` actúa como puente pasivo: escucha mensajes `CONVERSATION` y los reenvía al `background.js` como `DOWNLOAD_JSON`.
- `background.js` almacena la conversación en `capturedConversation`, lista para ser exportada cuando el usuario lo solicite.

Este flujo es automático y no requiere que el usuario haga clic en el ícono para capturar la conversación. La captura ocurre durante la carga inicial de la página.

### Exportación

La exportación se inicia desde el popup:

```text
popup.js
    │
    ▼
runtime.sendMessage(EXPORT)
    │
    ▼
background.js
    │
    ▼
exportHandlers[format]()
    │
    ├── json → descarga directa
    │
    └── md   → runExporter → outputHandler → descarga
```

- `popup.js` presenta opciones de exportación: formato (MD/JSON), modo compacto y filtro de roles (`all`, `user`, `assistant`). Las opciones específicas de Markdown se ocultan al elegir JSON.
- Envía un mensaje `EXPORT` con todos los parámetros (`format`, `compact`, `roleFilter`).
- `background.js` recibe el mensaje, verifica que exista una conversación capturada y ejecuta el handler correspondiente:
  - **JSON**: serializa la conversación y la descarga directamente.
  - **Markdown**: construye un `config` con `source: "extension"`, `compact`, `roleFilter` y un `outputHandler` que descarga el archivo `.md`.
- La descarga utiliza `chrome.downloads.download` con `saveAs: true` para que el usuario elija la ubicación.

### Principios

- El popup no conoce el pipeline; solo envía la intención del usuario.
- El background no interpreta la conversación; solo coordina y despacha al Core cuando es necesario.
- El content script no toma decisiones; solo retransmite mensajes.
- El inject script no sabe de la existencia del popup ni del background; solo captura y envía.

---

# Fase 3 — Integración

**Estado: completada.**

La extensión reutiliza el mismo `runExporter` y `runPipeline` que la CLI. La comunicación entre componentes se basa en mensajes desacoplados:

- `CONVERSATION`: inject → content.
- `DOWNLOAD_JSON`: content → background.
- `EXPORT`: popup → background.

---

# Próximos pasos

1. [x] Implementar `ExtensionSource`.
2. [x] Integrar la Chrome Extension con `runExporter`.
3. [x] Validar que CLI y Extension reutilicen exactamente el mismo pipeline.
4. [x] Incorporar selector de formato (MD/JSON) en el popup.
5. [x] Agregar opciones avanzadas al popup (modo compacto, filtro de roles).
6. [ ] Mejorar feedback visual en el popup (spinner, errores detallados).
7. [ ] Incorporar nuevos Conversation Sources sin modificar el Core.
8. [ ] Incorporar nuevos Renderers y Outputs manteniendo el desacoplamiento actual.

---

# Conclusión

Las interfaces no forman parte del Core.

Cada interfaz únicamente construye la configuración de ejecución y utiliza una Conversation Source para obtener una conversación.

A partir de ese momento, todo el procesamiento es responsabilidad compartida de `runExporter` y `runPipeline`.

Esta arquitectura permite incorporar nuevos proveedores, nuevas interfaces, nuevos renderers y nuevos mecanismos de salida sin modificar el comportamiento interno del motor.

---
