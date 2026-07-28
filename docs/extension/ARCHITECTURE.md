# ARCHITECTURE

## Objetivo

La extensión tiene como único objetivo capturar automáticamente el JSON completo de una conversación de ChatGPT y entregarlo al pipeline de AI Chat Exporter.

La extensión **no interpreta** la conversación.

La extensión **no genera** Markdown, HTML ni PDF.

Toda la lógica de procesamiento permanece dentro del Core de AI Chat Exporter.

---

# Arquitectura general

```text
                ChatGPT
                    │
                    ▼
            Inject Script
                    │
        Intercepta window.fetch()
                    │
                    ▼
        JSON completo de conversación
                    │
                    ▼
            Content Script
        (puente de comunicación)
                    │
                    ▼
              Background
      (coordinación y exportación)
                    │
                    ▼
        AI Chat Exporter Core
                    │
                    ▼
                Parser
                    │
                    ▼
              Normalizer
                    │
                    ▼
             Exportadores
          ├──────────────┐
          ▼              ▼
       Markdown        JSON
          │
          ├──────────────┐
          ▼              ▼
        HTML           PDF
```

---

# Arquitectura interna de la extensión

```text
┌───────────────────────────────────────┐
│              ChatGPT                  │
└───────────────────────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────┐
│            inject.js                  │
│                                       │
│ • Intercepta fetch()                  │
│ • Filtra respuestas                   │
│ • Conserva únicamente el JSON         │
│   que contiene `mapping`              │
│ • Envía automáticamente la            │
│   conversación capturada al           │
│   content script                      │
└───────────────────────────────────────┘
                  │
          window.postMessage()
          tipo: CONVERSATION
                  │
                  ▼
┌───────────────────────────────────────┐
│            content.js                 │
│                                       │
│ • Inyecta inject.js                   │
│ • Actúa como puente                   │
│ • Reenvía CONVERSATION al             │
│   background como DOWNLOAD_JSON       │
└───────────────────────────────────────┘
                  │
      chrome.runtime.sendMessage()
          tipo: DOWNLOAD_JSON
                  │
                  ▼
┌───────────────────────────────────────┐
│          background.js                │
│                                       │
│ • Almacena la última conversación     │
│ • Responde al popup                   │
│ • Ejecuta exportHandlers              │
│ • Invoca al Core si es Markdown       │
│ • Descarga el archivo                 │
└───────────────────────────────────────┘
                  ▲
                  │
      chrome.runtime.sendMessage()
          tipo: EXPORT
                  │
                  │
┌───────────────────────────────────────┐
│          popup.html / popup.js        │
│                                       │
│ • Selector de formato (MD / JSON)     │
│ • Botón Exportar                      │
│ • Muestra estado de la operación      │
└───────────────────────────────────────┘
```

---

# Responsabilidades

## Inject Script

Responsabilidades:

- interceptar `window.fetch`;
- detectar la respuesta correcta del endpoint de conversación;
- validar la presencia de `mapping`;
- conservar el JSON completo en memoria;
- enviar automáticamente la conversación capturada al content script mediante `window.postMessage`.

No debe:

- descargar archivos;
- interpretar conversaciones;
- comunicarse directamente con el Background.

---

## Content Script

Responsabilidades:

- inyectar `inject.js` en el contexto de la página;
- actuar como puente pasivo entre la página y la extensión;
- reenviar cualquier conversación recibida de `inject.js` al `background.js`.

No debe:

- procesar conversaciones;
- exportar archivos;
- tomar decisiones sobre el flujo de datos.

---

## Background

Responsabilidades:

- recibir y almacenar la conversación capturada enviada por el content script;
- atender las solicitudes de exportación provenientes del popup;
- despachar la exportación según el formato solicitado:
  - JSON: descarga directa del objeto almacenado;
  - Markdown: construir configuración del pipeline, invocar `runExporter` y descargar el resultado mediante `outputHandler`.

No debe:

- interpretar la conversación;
- modificar el JSON.

---

## Popup

Responsabilidades:

- presentar al usuario un selector de formato de exportación (Markdown / JSON);
- enviar la orden de exportación al background con el formato elegido;
- mostrar el estado de la operación (procesando, éxito, error).

No debe:

- acceder directamente al Core;
- ejecutar lógica de procesamiento;
- manipular la conversación.

---

## AI Chat Exporter Core

Responsabilidades:

- interpretar el JSON;
- reconstruir la conversación;
- normalizar la información;
- generar cualquiera de los formatos soportados.

---

# Principios de diseño

La arquitectura sigue una separación estricta de responsabilidades.

Cada componente tiene una única función:

- **Inject** captura y envía.
- **Content** retransmite.
- **Background** coordina y exporta.
- **Popup** presenta opciones y solicita.
- **Core** procesa.

Esta separación permite incorporar nuevos formatos de exportación sin modificar el mecanismo de captura, ni la comunicación entre componentes.

---

# Estado

Arquitectura validada.

La extensión captura automáticamente el JSON, ofrece un popup con selector de formato y exporta tanto Markdown como JSON reutilizando el pipeline existente sin modificaciones.

---
