# CAPTURE_WARNING_BEHAVIOR

> Documento de experimentación.
> Objetivo: evaluar si la advertencia de recarga sigue siendo necesaria
> después del cambio a recolección activa por paginación.

## Contexto

La advertencia de recarga fue introducida en la v1.4.1, cuando la captura
dependía de un único JSON obtenido durante la carga inicial.

En ese flujo, los mensajes nuevos o las conversaciones abiertas después de
la carga no se capturaban, por lo que la advertencia protegía al usuario
de exportar una conversación incompleta.

Tras el cambio a recolección activa por paginación, el supuesto cambió:
la extensión recorre todas las páginas disponibles antes de exportar.

## Hipótesis

### H1
La recolección activa captura la conversación completa sin necesidad de
recargar la página.

Estado: ✅ Confirmada parcialmente

### H2
La advertencia de recarga sigue apareciendo siempre, incluso cuando la
recolección fue completa, porque el popup no recibe un flag que lo indique.

Estado: ✅ Confirmada

### H3
El comportamiento de la advertencia debe cambiar para adaptarse al nuevo
flujo de recolección.

Estado: ✅ Confirmada como conclusión preliminar

## Escenarios de prueba

| ID | Escenario | Resultado observado | Advertencia |
|----|-----------|----------------------|-------------|
| E-001 | Recargar conversación existente y exportar sin scrollear manual | Recolección completa | Sí |
| E-002 | Crear conversación nueva y exportar | Descarga conversación previa | Sí |
| E-003 | Recargar conversación, escribir mensaje nuevo y exportar | No incluye mensajes nuevos | Sí |
| E-004 | Exportar dos veces sin recargar | Recolección completa | Sí |
| E-005 | Conversación larga (190 páginas) y exportar | Recolección completa | Sí |

## Observaciones

- Al iniciar una conversación nueva desde una anterior, la extensión
  descarga la conversación previa.
- En una captura larga apareció el warning de canal asincrónico, pero en
  el retry se descargó correctamente.
- Los escenarios E-002 y E-003 sugieren que el estado capturado persiste
  entre conversaciones o no se actualiza correctamente.

## Conclusión

Pendiente de análisis tras la detección de los escenarios fallidos.

---

## Hallazgos posteriores

### F-001 — El endpoint de conversación nueva no coincide con el filtro actual

Durante la observación de una conversación nueva, se identificó una petición:

```text
POST https://chatgpt.com/backend-api/f/conversation
```

Initiator: `inject.js:45`

La petición fue interceptada, pero no capturada porque el filtro actual solo contempla:

```text
/backend-api/conversations/
```

El endpoint real no contiene ese patrón, por lo que `captureConversation()` no guarda ninguna página.

### F-002 — La respuesta es un stream SSE, no un JSON directo

La petición `POST /backend-api/f/conversation` devuelve un `Content-Type` de tipo `text/event-stream`.

La estructura observada incluye múltiples eventos `delta` y `data` con:

- `conversation_id`
- mensajes incrementales
- `title_generation`
- `message_marker`
- `conversation_detail_metadata`

No se detectó `mapping` ni `page_info`.

### F-003 — No se detecta GET posterior al stream

Al finalizar el stream de una conversación nueva, no se observó una petición
posterior a `/backend-api/conversations/{id}`.

Por lo tanto, la conversación nueva no queda disponible mediante el flujo
paginado que la extensión captura actualmente.

### F-004 — Flujo real de conversación nueva

Se confirmó el flujo completo:

```text
POST /backend-api/f/conversation/prepare
   ↓
JSON { status: "ok", conduit_token }
   ↓
POST /backend-api/f/conversation
   ↓
SSE text/event-stream
   ↓
data: { type: "resume_conversation_token", conversation_id, ... }
data: { type: "input_message", ... }
event: delta → fragmentos append
data: [DONE]
```

Este flujo no pasa por `/backend-api/conversations/{id}`.

### F-005 — Prototipo de reconstrucción SSE exitoso

Se probó un script en consola para leer el stream de `POST /backend-api/f/conversation`
mediante `response.clone().body.getReader()`.

Resultados:

- Se detectó `conversation_id` de forma temprana.
- Se detectaron mensajes `input_message` con roles `developer` y `user`.
- Se detectó `message_marker` al inicio del contenido visible del asistente.
- Se acumularon los deltas `data: {"v":"..."}` y se reconstruyó correctamente el texto del asistente.

Conclusión:

- Es viable reconstruir la conversación desde el stream SSE.
- Los mensajes con rol `developer` deberán filtrarse al integrar esta captura.
- Falta diseñar cómo fusionar este flujo con la captura paginada actual.

### Impacto

- E-002 y E-003 fallan porque el estado `conversation` no se actualiza con la conversación nueva.
- La advertencia de recarga sigue mostrándose, pero no mitiga el problema real.
- Cualquier solución futura deberá contemplar la captura del stream
  `/backend-api/f/conversation` y su integración con el modelo actual.
