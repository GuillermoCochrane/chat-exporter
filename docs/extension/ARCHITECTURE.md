# ARCHITECTURE

La extensión fue diseñada para actuar únicamente como un capturador del JSON de ChatGPT.

Toda la lógica de procesamiento permanece en AI Chat Exporter.

---

## Flujo

```text
ChatGPT
    │
    ▼
Content Script
    │
    ▼
Capturador
    │
    ▼
JSON
    │
    ▼
AI Chat Exporter Core
    │
    ▼
Renderer
    │
    ▼
Download
```

---

> La arquitectura interna de la extensión se documentará a medida que sus componentes sean implementados.