# INTEGRATION

## Objetivo

Documentar cómo las distintas interfaces de AI Chat Exporter interactúan con el Core sin modificar el pipeline interno.

Este documento define los contratos que permiten incorporar nuevas fuentes de conversaciones y nuevos formatos de salida manteniendo el bajo acoplamiento del proyecto.

---

# Filosofía

AI Chat Exporter no depende de una interfaz específica.

La CLI fue la primera interfaz implementada.

La extensión de Chrome será la segunda.

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

Filter

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
- **Extensión**: descargará el Markdown usando `chrome.downloads`.

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
- Descarga desde la extensión — próximamente.

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

No conoce cómo se obtiene la conversación.

No contiene lógica de procesamiento.

---

## Chrome Extension

Responsabilidades:

- capturar automáticamente la conversación;
- producir una `Conversation`;
- utilizar `ExtensionSource`;
- inyectar `outputHandler` que descarga el archivo;
- invocar `runExporter`.

No duplica ninguna lógica del Core.

---

# Principios

El Core nunca conoce:

- quién inició el proceso;
- de dónde proviene la conversación;
- cómo será entregado el resultado.

Las interfaces únicamente construyen la configuración de ejecución y delegan la obtención de la conversación en una Conversation Source.

Los renderers únicamente transforman el modelo interno.

Los outputs únicamente entregan el resultado.

Cada módulo mantiene una única responsabilidad.

---

# Fase 3

La Fase 3 consiste en integrar la extensión reutilizando exactamente el mismo flujo del Core.

CLI:

```text
CLI
 ↓
Pipeline Profile
 ↓
runExporter
 ↓
JsonFileSource
 ↓
Conversation
```

Extensión:

```text
Chrome Extension
 ↓
Pipeline Profile
 ↓
runExporter
 ↓
ExtensionSource
 ↓
Conversation
```

Ambos caminos producen exactamente el mismo contrato (`Conversation`) y reutilizan el mismo `runPipeline`.

---

# Próximos pasos

1. [x] Implementar `ExtensionSource`.
2. [ ] Integrar la Chrome Extension con `runExporter`.
3. [ ] Validar que CLI y Extension reutilicen exactamente el mismo pipeline.
4. [ ] Incorporar nuevos Conversation Sources sin modificar el Core.
5. [ ] Incorporar nuevos Renderers y Outputs manteniendo el desacoplamiento actual.

---

# Conclusión

Las interfaces no forman parte del Core.

Cada interfaz únicamente construye la configuración de ejecución y utiliza una Conversation Source para obtener una conversación.

A partir de ese momento, todo el procesamiento es responsabilidad compartida de `runExporter` y `runPipeline`.

Esta arquitectura permite incorporar nuevos proveedores, nuevas interfaces, nuevos renderers y nuevos mecanismos de salida sin modificar el comportamiento interno del motor.


---
