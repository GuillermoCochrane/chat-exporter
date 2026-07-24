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

──────────── CORE ────────────

Conversation

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

────────── Outputs ───────────

Archivo

Download

Clipboard

HTTP Response

...
```

---

# Contratos

## Conversation

Es el modelo de entrada consumido por el Core.

Actualmente corresponde al JSON exportado por ChatGPT.

Toda nueva interfaz debe producir una estructura compatible con este contrato.

El Core nunca conoce el origen de la conversación.

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
- seleccionar archivos de entrada y salida;
- invocar el pipeline.

No contiene lógica de procesamiento.

---

## Chrome Extension

Responsabilidades:

- capturar automáticamente el JSON de conversación;
- construir el objeto `Conversation`;
- invocar el mismo pipeline utilizado por la CLI.

No debe duplicar lógica del Core.

---

# Principios

El Core nunca conoce:

- quién inició el proceso;
- de dónde proviene la conversación;
- cómo será entregado el resultado.

Las interfaces únicamente adaptan datos de entrada.

Los renderers únicamente transforman el modelo interno.

Los outputs únicamente entregan el resultado.

Cada módulo mantiene una única responsabilidad.

---

# Fase 3

La Fase 3 consiste en integrar la extensión utilizando los contratos ya definidos.

El objetivo no es modificar el Core, sino reemplazar la interfaz de entrada.

CLI:

```text
JSON
 ↓
Loader
 ↓
Conversation
```

Extensión:

```text
ChatGPT
 ↓
Inject Script
 ↓
Content Script
 ↓
Background
 ↓
Conversation
```

A partir del objeto `Conversation`, ambos caminos reutilizan exactamente el mismo pipeline.

---

# Próximos pasos

1. Implementar un Loader para la extensión.
2. Definir el punto de entrada compartido del Core.
3. Reutilizar el Parser existente sin modificaciones.
4. Mantener el desacoplamiento entre Interfaces, Core, Renderers y Outputs.
5. Incorporar nuevos renderers y nuevas interfaces sin alterar el pipeline principal.

---

# Conclusión

La extensión no representa un segundo proyecto ni una bifurcación de AI Chat Exporter.

Constituye una nueva interfaz de entrada para el mismo motor de procesamiento.

El Core permanece independiente del origen de los datos y del mecanismo de entrega del resultado, permitiendo que nuevas interfaces y nuevos formatos de salida puedan incorporarse sin modificar el pipeline existente.