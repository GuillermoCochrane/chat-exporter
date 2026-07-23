# ARCHITECTURE

La extensión tiene como objetivo recuperar el JSON de una conversación de ChatGPT y entregarlo al pipeline existente de AI Chat Exporter.

No replica la lógica del proyecto principal; únicamente obtiene los datos y los pone a disposición del motor de exportación.

---

## Flujo

```text
ChatGPT
    │
    ▼
Inject Script
    │
Intercepta fetch()
    │
    ▼
JSON de conversación
    │
    ▼
Content Script
    │
    ▼
Background
    │
    ▼
AI Chat Exporter Core
    │
    ▼
Parser
    ▼
Filter
    ▼
Normalizer
    ▼
Markdown
    ▼
Download
```

---

## Responsabilidades

### Extensión

- detectar la respuesta del endpoint de conversación;
- recuperar el JSON completo;
- transferir el JSON al motor de exportación.

### AI Chat Exporter Core

- interpretar el JSON;
- normalizar la conversación;
- generar la salida Markdown;
- producir el archivo final.

---

> La arquitectura interna de la extensión continuará documentándose conforme sus componentes sean implementados.