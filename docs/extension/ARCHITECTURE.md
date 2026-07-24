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
└───────────────────────────────────────┘
                  │
          window.postMessage()
                  │
                  ▼
┌───────────────────────────────────────┐
│            content.js                 │
│                                       │
│ • Inyecta inject.js                   │
│ • Actúa como puente                   │
│ • Comunica página ↔ extensión         │
└───────────────────────────────────────┘
                  │
      chrome.runtime.sendMessage()
                  │
                  ▼
┌───────────────────────────────────────┐
│          background.js                │
│                                       │
│ • Coordina la extensión               │
│ • Gestiona la descarga                │
│ • Decide el exportador                │
└───────────────────────────────────────┘
```

---

# Responsabilidades

## Inject Script

Responsabilidades:

- interceptar `window.fetch`;
- detectar la respuesta correcta del endpoint de conversación;
- validar la presencia de `mapping`;
- conservar el JSON completo en memoria.

No debe:

- descargar archivos;
- interpretar conversaciones;
- comunicarse directamente con el Background.

---

## Content Script

Responsabilidades:

- inyectar `inject.js`;
- actuar como puente entre la página y la extensión;
- reenviar mensajes entre ambos contextos.

No debe:

- procesar conversaciones;
- exportar archivos.

---

## Background

Responsabilidades:

- coordinar la extensión;
- iniciar la exportación;
- recibir el JSON capturado;
- invocar el pipeline correspondiente.

No debe:

- interpretar la conversación;
- modificar el JSON.

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

- **Inject** captura.
- **Content** comunica.
- **Background** coordina.
- **Core** procesa.
- **Exportadores** generan la salida.

Esta separación permite incorporar nuevos formatos de exportación sin modificar el mecanismo de captura.

---

# Estado

Arquitectura validada.

La captura automática del JSON funciona correctamente y el pipeline existente puede reutilizarse sin modificaciones.