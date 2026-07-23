# CAPTURE_STRATEGY

## Objetivo

Documentar la estrategia utilizada para capturar automáticamente el JSON de una conversación de ChatGPT.

Este documento resume las alternativas evaluadas y registra la estrategia finalmente adoptada.

Los experimentos, hipótesis y evidencias detalladas se documentan en `LABORATORY.md`.

---

# Estado

| Estado | Significado |
|---------|-------------|
| ⏳ Pendiente | Aún no se evaluó. |
| 🚧 En evaluación | Se encuentra en investigación. |
| ❌ Descartada | Se evaluó y no resultó viable. |
| ✅ Confirmada | Demostró ser una alternativa válida. |

---

# Estrategias evaluadas

| Estrategia | Estado | Justificación |
|------------|:------:|---------------|
| `fetch()` desde consola | ❌ | El endpoint devuelve `404 conversation_inaccessible` una vez finalizada la carga inicial. |
| Reutilizar `Copy as fetch` | ❌ | No reproduce el mismo contexto de navegación; devuelve HTML o `404`. |
| Variables globales (React Router / React Query) | ❌ | No exponen el árbol `mapping`. |
| Hook sobre `Response.prototype.json()` | ❌ | El hook se instala demasiado tarde; la respuesta ya fue consumida. |
| Hook sobre `window.fetch()` desde Content Script | ❌ | El contexto aislado de la extensión no modifica el `fetch()` utilizado por la página. |
| Hook sobre `window.fetch()` mediante Script inyectado | ✅ | Permite interceptar la respuesta del endpoint `/backend-api/conversation/{id}` y acceder al objeto completo antes de que ChatGPT lo procese. |
| `ReadableStream` (`getReader`) | ❌ | No fue necesario tras confirmar la interceptación directa mediante `fetch()`. |
| Content Script (`run_at: "document_start"`) | ✅ | Permite inyectar el script antes de la inicialización de ChatGPT. |
| `chrome.webRequest` | ⏳ | No fue necesario evaluar tras validar la estrategia actual. |
| Proxy (mitmproxy / HTTP Toolkit) | ⏳ | Reservado únicamente como alternativa externa de diagnóstico. |
| `chrome.debugger` | ❌ | Descartado por complejidad y permisos elevados. |

---

# Estrategia adoptada

La extensión utiliza dos componentes complementarios:

```text
Content Script
        │
        ▼
Inyección de código
        │
        ▼
Script ejecutado en el contexto de la página
        │
Intercepta window.fetch()
        │
        ▼
/backend-api/conversation/{id}
        │
        ▼
JSON completo
        │
        ▼
mapping
```

El `Content Script` únicamente realiza la inyección del capturador.

La captura propiamente dicha ocurre dentro del contexto JavaScript de la página, donde el `window.fetch()` original puede ser interceptado antes de que ChatGPT procese la respuesta.

---

# Próximos pasos

1. Eliminar el código de depuración.
2. Transferir el JSON desde el Script inyectado hacia el Content Script.
3. Definir el mecanismo de persistencia.
4. Integrar la captura con AI Chat Exporter.
5. Incorporar la exportación desde la interfaz de la extensión.

---

# Criterio de éxito

✔ La estrategia queda validada cuando la extensión obtiene automáticamente el árbol completo de la conversación (`mapping`) interceptando la respuesta de:

```text
/backend-api/conversation/{id}
```

sin utilizar DevTools ni requerir intervención manual del usuario.