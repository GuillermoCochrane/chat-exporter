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

## Conversation

Representa el modelo de conversación entregado por una Conversation Source.

Actualmente corresponde a una conversación exportada desde ChatGPT mediante `JsonFileSource`.

El Core nunca conoce cómo fue obtenida esa conversación.

Cada nueva interfaz únicamente debe producir una `Conversation` compatible con el contrato esperado por el pipeline.

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

- Escritura de archivo (`writer.js`)

Futuros outputs:

- Descarga desde la extensión
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
- invocar `runExporter`.

No conoce cómo se obtiene la conversación.

No contiene lógica de procesamiento.

---

## Chrome Extension

Responsabilidades:

- capturar automáticamente la conversación;
- producir una `Conversation`;
- utilizar un Conversation Source propio;
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

1. Implementar `ExtensionSource`.
2. Integrar la Chrome Extension con `runExporter`.
3. Validar que CLI y Extension reutilicen exactamente el mismo pipeline.
4. Incorporar nuevos Conversation Sources sin modificar el Core.
5. Incorporar nuevos Renderers y Outputs manteniendo el desacoplamiento actual.

---

# Conclusión

Las interfaces no forman parte del Core.

Cada interfaz únicamente construye la configuración de ejecución y utiliza una Conversation Source para obtener una conversación.

A partir de ese momento, todo el procesamiento es responsabilidad compartida de `runExporter` y `runPipeline`.

Esta arquitectura permite incorporar nuevos proveedores, nuevas interfaces, nuevos renderers y nuevos mecanismos de salida sin modificar el comportamiento interno del motor.

---
