# EXTENSION_LAB

## Objetivo

Recuperar automáticamente el JSON completo de cualquier conversación de ChatGPT desde la interfaz web y reutilizar el pipeline existente de **AI Chat Exporter**, eliminando la necesidad de utilizar DevTools.

Este documento registra el proceso de investigación, las hipótesis evaluadas, los experimentos realizados y las decisiones técnicas que llevaron a la arquitectura propuesta para la futura extensión del navegador.

---

### Contexto

Actualmente AI Chat Exporter requiere obtener manualmente el archivo `conversation.json` desde DevTools.

Durante esta investigación se confirmó que ChatGPT continúa descargando el árbol completo de la conversación desde el endpoint:

```text
/backend-api/conversation/{id}
```

Sin embargo, también se comprobó que dicho endpoint solo puede capturarse durante la carga inicial de la conversación, ya que las solicitudes manuales posteriores devuelven `404 conversation_inaccessible`.

Como consecuencia, la estrategia del proyecto cambió: en lugar de intentar reproducir la petición, la extensión interceptará la respuesta original antes de que ChatGPT la procese.

La extensión tendrá una única responsabilidad: capturar el JSON y entregarlo al núcleo de AI Chat Exporter, reutilizando el parser y el pipeline ya existentes.

---
## Hipótesis

| ID | Objetivo | Estado | Evidencia | Conclusión |
|----|----------|:------:|-----------|------------|
| H-001 | El endpoint `/backend-api/conversation/{id}` devuelve el árbol completo (`mapping`). | ✔ Confirmada | Respuesta 200 observada en Network. | Es la fuente oficial de la conversación. |
| H-002 | Un `fetch()` manual puede reproducir esa respuesta. | ✖ Refutada | Devuelve `404 conversation_inaccessible`. | Solo funciona durante la carga inicial. |
| H-003 | Reutilizar "Copy as fetch" reproduce la petición original. | ✖ Refutada | Devuelve HTML o 404. | Existen datos de contexto imposibles de reproducir manualmente. |
| H-004 | React expone el árbol de conversación en variables globales. | ✖ Refutada | React Router y React Query no contienen el `mapping`. | El estado permanece encapsulado. |
| H-005 | Interceptar `Response.prototype.json()` permite capturar la conversación. | ✖ Refutada | El hook llega demasiado tarde. | La respuesta ya fue consumida. |
| H-006 | Interceptar `window.fetch()` desde un Content Script es suficiente. | ✖ Refutada | Los Content Scripts viven en un contexto aislado. | No modifican el `fetch` real utilizado por la página. |
| H-007 | Inyectar un script en el contexto de la página permite interceptar `window.fetch()`. | ✔ Confirmada | Se capturó correctamente la respuesta de `/backend-api/conversation/{id}`. | Es la estrategia adoptada por la extensión. |
| H-008 | El JSON puede capturarse antes de que ChatGPT lo procese. | ✔ Confirmada | Se obtuvo el objeto completo y su propiedad `mapping`. | La automatización es viable. |
---

## Experimentos

| ID | Objetivo | Resultado | Conclusión |
|----|----------|-----------|------------|
| E-001 | Inspeccionar el endpoint desde Network. | Respuesta 200 con `mapping` completo. | Se confirmó el origen del JSON. |
| E-002 | Repetir el `fetch()` desde consola. | 404 `conversation_inaccessible`. | No es una estrategia válida. |
| E-003 | Ejecutar "Copy as fetch". | HTML o 404. | No reproduce el contexto original. |
| E-004 | Buscar el árbol en React Router y React Query. | No aparece el `mapping`. | React no expone la conversación. |
| E-005 | Hook sobre `Response.prototype.json()`. | Nunca interceptó la conversación. | La respuesta ya había sido consumida. |
| E-006 | Hook sobre `window.fetch()` desde consola. | No capturó la carga inicial. | El hook siempre llegaba tarde. |
| E-007 | Hook sobre `ReadableStream`. | Se detectaron numerosos streams sin poder aislar el correcto. | Se descartó como estrategia principal. |
| E-008 | Crear una extensión MV3 con Content Script. | El código se ejecutó correctamente en `document_start`. | Base válida para la captura. |
| E-009 | Inyectar un script dentro del contexto de la página. | Se logró modificar el `window.fetch()` real. | Se eliminó la limitación del contexto aislado. |
| E-010 | Clonar la respuesta (`response.clone()`) e inspeccionar el JSON. | Se obtuvo correctamente `json.mapping`. | La captura automática quedó demostrada. |
---

## Restricciones descubiertas

- El endpoint `/backend-api/conversation/{id}` solo devuelve el JSON completo durante la carga inicial de la conversación.
- Repetir la solicitud manualmente produce `404 conversation_inaccessible`.
- El contexto aislado (*Isolated World*) de los Content Scripts impide modificar directamente el `window.fetch()` utilizado por la página.
- Para interceptar correctamente la conversación es necesario inyectar un script dentro del contexto JavaScript de ChatGPT.
- Una vez inyectado el script, es posible clonar la respuesta (`response.clone()`) y acceder al árbol completo (`mapping`) sin interferir con el funcionamiento de la aplicación.
- El parser existente de AI Chat Exporter puede reutilizarse sin modificaciones importantes.

---

## Arquitectura propuesta

### Principios

La extensión mantiene una única responsabilidad: capturar el JSON.

Todo el procesamiento continúa siendo responsabilidad de AI Chat Exporter.

Se preservan los principios de:

- Responsabilidad única.
- Bajo acoplamiento.
- Reutilización del núcleo existente.
- Evolución incremental.

---

### Flujo general

```text
ChatGPT
      │
      ▼
Content Script
      │
      ▼
Script inyectado
      │
Intercepta window.fetch()
      │
      ▼
JSON completo
      │
      ▼
Loader
      │
      ▼
Parser
      │
      ▼
Conversation
      │
      ▼
Markdown / HTML / PDF
```

---

### Componentes

- **Content Script**: únicamente inyecta el capturador.
- **Inject Script**: intercepta `window.fetch()` y obtiene el JSON.
- **Loader**: recibe el JSON.
- **Parser**: transforma el `mapping` en el modelo canónico.
- **Renderer**: genera los formatos de exportación.

---

## Tecnologías evaluadas

| Tecnología | Resultado | Estado |
|------------|-----------|:------:|
| `fetch()` manual | 404 | ❌ |
| `Copy as fetch` | No reproduce la petición | ❌ |
| `Response.prototype.json()` | Hook demasiado tardío | ❌ |
| `ReadableStream` | Excesivo ruido | ❌ |
| `window.fetch` (Content Script) | Contexto aislado | ❌ |
| `window.fetch` (Script inyectado) | Captura exitosa | ✅ |
| Content Script (`document_start`) | Inyección exitosa | ✅ |
| React Router | No contiene el mapping | ❌ |
| React Query | No contiene el mapping | ❌ |
| DevTools ("Copy response") | Recupera el JSON completo | ✅ |
| `chrome.webRequest` | No fue necesario | ⏳ |
| Proxy (mitmproxy / HTTP Toolkit) | Alternativa futura | ⏳ |

---

## Ideas descartadas

- Repetir el `fetch()` desde la consola.
- Reutilizar "Copy as fetch".
- Buscar el árbol de conversación en objetos globales de React.
- Interceptar `Response.prototype.json()`.
- Interceptar `window.fetch()` únicamente desde un Content Script.
- Basar la captura en `ReadableStream`.

Todas estas estrategias fueron sustituidas por una única solución: interceptar `window.fetch()` desde un script inyectado en el contexto de la página.

---

## Pendientes

1. Implementar la comunicación entre el Script inyectado y el Content Script.
2. Definir el mecanismo de persistencia del JSON.
3. Integrar el Loader con AI Chat Exporter.
4. Eliminar el código de depuración.
5. Construir la interfaz de exportación.
6. Validar el funcionamiento sobre conversaciones de distintos tamaños y con regeneraciones.

---

## Próximos pasos

1. Finalizar el capturador.
2. Implementar el canal de comunicación entre ambos contextos.
3. Integrar el Loader con el parser existente.
4. Automatizar la descarga en Markdown.
5. Incorporar la interfaz de usuario de la extensión.
6. Preparar la publicación del MVP.
---

## Cronología

## Cronología

1. Descubrimiento del endpoint `/backend-api/conversation/{id}`.
2. Confirmación del árbol `mapping`.
3. Fracaso de todas las estrategias basadas en `fetch()` manual.
4. Investigación sobre React Router, React Query y ReadableStreams.
5. Confirmación de que los Content Scripts utilizan un contexto aislado.
6. Descubrimiento de la necesidad de inyectar un script.
7. Primera interceptación exitosa de `window.fetch()`.
8. Captura automática del `mapping`.
9. Definición de la arquitectura definitiva de la extensión.

---

## Estado actual

### Confirmado

- El endpoint oficial de ChatGPT continúa entregando el árbol completo de la conversación.
- La captura automática ya fue demostrada mediante un script inyectado.
- El parser existente puede reutilizarse sin cambios importantes.
- La arquitectura del proyecto permanece desacoplada.

### Pendiente

- Comunicación entre el Script inyectado y el Content Script.
- Persistencia del JSON.
- Integración con el pipeline.
- Interfaz de usuario de la extensión.

---

## Conclusión

La investigación permitió cambiar completamente el enfoque del proyecto.

El problema nunca fue interpretar el JSON de ChatGPT, sino capturarlo en el instante correcto.

Tras confirmar que los Content Scripts trabajan en un contexto aislado, la estrategia evolucionó hacia la inyección de un script capaz de interceptar el `window.fetch()` real utilizado por la aplicación.

Con esa técnica se obtuvo automáticamente el árbol completo (`mapping`) sin utilizar DevTools ni reproducir peticiones manuales.

A partir de este punto, el desarrollo deja de ser una investigación sobre la captura y pasa a ser un trabajo de integración con el pipeline existente de AI Chat Exporter.

---
