# ARCHITECTURE

## Objetivo

La extensión tiene como único objetivo capturar automáticamente las conversaciones de ChatGPT y entregarlas al pipeline de AI Chat Exporter.

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
            Captura fetch y SSE
                    │
                    ▼
          Páginas o turnos crudos
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
│ • Captura páginas paginadas           │
│ • Lee streams SSE                     │
│ • Reconstruye turnos                  │
│ • Envía automáticamente               │
│   la conversación capturada al        │
│   content script                      │
└───────────────────────────────────────┘
                  │
          window.postMessage()
          tipo: CONVERSATION
          tipo: PROGRESS
                  │
                  ▼
┌───────────────────────────────────────┐
│            content.js                 │
│                                       │
│ • Inyecta inject.js                   │
│ • Actúa como puente                   │
│ • Reenvía CONVERSATION                │
│   al background como DOWNLOAD_JSON    │
│ • Reenvía PROGRESS                    │
│ • Responde GET_PROVIDER               │
│ • Atiende solicitudes de              │
│   recuperación desde background       │
└───────────────────────────────────────┘
                  │
      chrome.runtime.sendMessage()
          tipo: DOWNLOAD_JSON
          tipo: PROGRESS
                  │
                  ▼
┌───────────────────────────────────────┐
│          background.js                │
│                                       │
│ • Almacena la última conversación     │
│ • Responde al popup                   │
│ • Expone GET_PROVIDER                 │
│ • Ejecuta exportHandlers              │
│ • Construye nombres de archivo        │
│ • Espera confirmación de descarga     │
│ • Envía notificaciones                │
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
│   popup.html / js/ / styles/          │
│                                       │
│ • Toggle de idioma (SVG inline)       │
│ • Selector de formato (MD / JSON)     │
│ • Modo compacto (switch)              │
│ • Filtro de roles (radio buttons)     │
│ • Opciones MD se ocultan en JSON      │
│ • Encabezado contextual dinámico      │
│ • Spinner de progreso                 │
│ • Aviso de actualización              │
│ • Footer con versión dinámica         │
│ • Muestra estado de la operación      │
│ • Traducción multi‑idioma             │
└───────────────────────────────────────┘
```

---

# Responsabilidades

## Inject Script

### Responsabilidades:

- interceptar `window.fetch`;
- detectar respuestas de:
  - conversaciones existentes (`/backend-api/conversations/`);
  - conversaciones nuevas (`/backend-api/f/conversation`);
- capturar páginas paginadas;
- leer streams SSE;
- reconstruir turnos `user` y `assistant`;
- conservar la conversación en estado interno;
- emitir progreso de captura;
- enviar automáticamente la conversación capturada al content script mediante `window.postMessage`.

### No debe:

- descargar archivos;
- interpretar conversaciones;
- comunicarse directamente con el Background.

---

### Módulos internos de `inject/`

| Módulo | Responsabilidad |
|---|---|
| `capture.js` | Interceptar fetch y capturar respuestas paginadas |
| `scroll.js` | Forzar carga de todas las páginas de una conversación existente |
| `messaging.js` | Atender mensajes del content script y responder |
| `state.js` | Encapsular el estado global de la conversación |
| `streamCapture.js` | Leer y reconstruir conversaciones nuevas desde SSE |

---

## Content Script

### Responsabilidades:

- inyectar `inject.js` en el contexto de la página;
- actuar como puente pasivo entre la página y la extensión;
- reenviar conversaciones capturadas al background;
- reenviar mensajes de progreso;
- responder `GET_PROVIDER` detectando el proveedor por URL;
- atender solicitudes de recuperación de conversación desde el background.

### No debe:

- procesar conversaciones;
- exportar archivos;
- tomar decisiones sobre el flujo de datos.

---

## Background

### Responsabilidades:

- recibir y almacenar la conversación capturada;
- atender solicitudes de exportación del popup;
- si no hay conversación en memoria, recuperarla desde la página;
- despachar la exportación según formato:
  - JSON: descarga directa;
  - Markdown: invocar `runExporter` mediante el bundle del Core;
- construir nombres de archivo descriptivos;
- esperar confirmación real de descarga;
- enviar notificaciones al finalizar la descarga;
- comunicar errores mediante códigos (`errorCode`) y parámetros;
- exponer `GET_PROVIDER` para el popup.

### No debe:

- interpretar la conversación;
- modificar el JSON.

---

### Módulos internos de `background/`

| Módulo | Responsabilidad |
|---|---|
| `download.js` | Iniciar descarga y esperar finalización |
| `progress.js` | Enviar progreso al popup |
| `exportHandlers.js` | Gestionar exportación JSON y Markdown |
| `messageHandlers.js` | Coordinar mensajes entrantes |
| `notifications.js` | Notificar éxito o error de descarga |
| `filename.js` | Construir nombres de archivo seguros |
| `providerService.js` | Obtener proveedor desde la pestaña activa |

---

## Popup

### Responsabilidades:

- presentar opciones de exportación:
  - formato (Markdown / JSON);
  - modo compacto;
  - filtro de roles;
- mostrar progreso de exportación;
- deshabilitar controles durante la operación;
- mostrar aviso de actualización cuando corresponda;
- mostrar notificación de resultado;
- incluir enlace de ayuda;
- traducir mensajes al idioma activo;
- actualizar proveedor dinámico en el encabezado.

### Scripts principales

- `popup.js`: orquestador principal.
- `providerHandler.js`: actualiza el proveedor dinámico.
- `updateNotification.js`: aviso de actualización.
- `versionHandler.js`: versión dinámica.
- `export/exportHandler.js`: flujo de exportación.
- `export/exportHelpers.js`: lógica de bajo nivel.
- `export/formatHandler.js`: toggle de formato.
- `languages/*`: idioma.
- `utilities/dom.js`: helpers DOM.

### No debe:

- acceder directamente al Core;
- ejecutar lógica de procesamiento;
- manipular la conversación.

---

# Build

La extensión se compila con esbuild.

### Entradas empaquetadas

- `src/interfaces/extension/inject.js`
- `src/interfaces/extension/content.js`
- `src/interfaces/extension/background.js`

### Salidas generadas en `dist/`

- `dist/inject.js`
- `dist/content.js`
- `dist/background.js`

### Core

El Core se empaqueta en `dist/extensionBundle.js` y se expone en `globalThis.__AI_CHAT_EXPORTER__`.

El background lo carga mediante `importScripts("extensionBundle.js")`.

---

# Principios de diseño

La arquitectura sigue una separación estricta de responsabilidades.

Cada componente tiene una única función:

- **Inject** captura y envía.
- **Content** retransmite.
- **Background** coordina y exporta.
- **Popup** presenta opciones y solicita.
- **Core** procesa.

Esta separación permite incorporar nuevos formatos de exportación, nuevos proveedores y nuevas interfaces sin modificar el mecanismo de captura.

---

# Estado

Arquitectura validada.

La extensión captura conversaciones existentes paginadas y conversaciones nuevas vía SSE.

Exporta Markdown y JSON reutilizando el pipeline sin modificaciones.

Incluye feedback de progreso, confirmación real de descarga, notificaciones, detección dinámica de proveedor y nombres de archivo descriptivos.

---