# CAPTURE_STRATEGY

## Objetivo

Documentar la estrategia de captura automática del JSON de una conversación de ChatGPT.

Este documento resume el estado de las alternativas evaluadas y registra la estrategia que guiará el desarrollo de la extensión.

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
| Hook sobre `window.fetch()` | ❌ | No intercepta la petición inicial de la conversación. |
| `ReadableStream` (`getReader`) | 🚧 | Se confirmó que ChatGPT utiliza streams, pero aún no se aisló el correspondiente a la conversación. |
| Content Script (`run_at: "document_start"`) | 🚧 | Principal candidato. Permitiría instalar los hooks antes de que ChatGPT inicialice su aplicación. |
| `chrome.webRequest` | ⏳ | Pendiente de evaluación. |
| Proxy (mitmproxy / HTTP Toolkit) | ⏳ | Alternativa si la captura desde la extensión no resulta viable. |
| `chrome.debugger` | ❌ | Descartado por complejidad y permisos elevados. |

---

# Estrategia actual

Con la evidencia obtenida hasta el momento, la implementación se centrará en una extensión Chrome (Manifest V3) capaz de ejecutar código en `document_start`, antes de que ChatGPT procese la respuesta inicial.

El objetivo es interceptar el JSON durante la carga de la conversación, evitando depender de DevTools o de peticiones manuales posteriores.

El mecanismo exacto de captura (Response, ReadableStream u otro) se definirá durante la implementación.

---

# Próximos pasos

1. Crear una extensión mínima (Manifest V3).
2. Verificar la ejecución del Content Script en `document_start`.
3. Instrumentar la captura del JSON inicial.
4. Confirmar la integridad del `mapping`.
5. Integrar la captura con el pipeline existente de AI Chat Exporter.

---

# Criterio de éxito

La estrategia se considerará validada cuando la extensión pueda obtener automáticamente el árbol completo de la conversación (`mapping`) sin requerir DevTools ni intervención manual del usuario.