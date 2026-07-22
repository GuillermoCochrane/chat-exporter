# EXTENSION_LAB

## Objetivo

Recuperar automáticamente el JSON completo de cualquier conversación de ChatGPT desde la interfaz web y reutilizar el pipeline existente de **AI Chat Exporter**, eliminando la necesidad de utilizar DevTools.

Este documento registra el proceso de investigación, las hipótesis evaluadas, los experimentos realizados y las decisiones técnicas que llevaron a la arquitectura propuesta para la futura extensión del navegador.

---

# Contexto

Actualmente AI Chat Exporter requiere obtener manualmente el archivo `conversation.json` desde DevTools.

El objetivo de esta investigación es eliminar la recuperación manual del JSON mediante DevTools, mediante una extensión Chrome (Manifest V3) capaz de capturar el JSON antes de que la aplicación web de ChatGPT lo procese.

La extensión deberá actuar únicamente como **capturador**, reutilizando módulos ya existentes en el proyecto principal.

---

# Hipótesis

| ID    | Objetivo                                                                                     | Estado        | Evidencia                                                                                                                                               | Conclusión                                                                                                                               |
|-------|----------------------------------------------------------------------------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| H‑001 | El endpoint `GET /backend-api/conversation/{id}` devuelve el JSON completo con un árbol `mapping`. | ✔ Confirmada  | Inspección de Network: 200 OK, response de ~44‑276 kB con objeto `mapping`. Vista previa y copia manual del response.                                   | El backend sigue devolviendo la conversación íntegra en ese endpoint.                                                                   |
| H‑002 | Un `fetch()` desde consola con `credentials:"include"` reproduce el mismo JSON.                 | ✖ Refutada    | El fetch devuelve 404 `conversation_inaccessible`. La primera petición de la página sí es 200, pero las posteriores fallan.                             | El endpoint solo responde correctamente durante la carga inicial de la SPA; las llamadas manuales no son equivalentes.                 |
| H‑003 | Copiar los headers exactos (incluido `Authorization: Bearer`) mediante "Copy as fetch" soluciona el 404. | ✖ Refutada    | El fetch copiado devuelve 200 pero con HTML (no JSON) o también 404. No se logró reproducir la respuesta JSON de forma fiable.                          | Hay un contexto de navegación o token efímero que la reproducción manual no incluye.                                                   |
| H‑004 | El JSON queda almacenado en variables globales de React (Router loader, React Query).          | ⚠ Pendiente   | `__REACT_QUERY_CACHE__` vacío. `__reactRouterDataRouter.state.loaderData` tiene `routes/_conversation.c.$conversationId: null`.                       | Los datos no se exponen en el estado global accesible; podrían estar en el ámbito privado de un hook o store interno.                   |
| H‑005 | La aplicación consume la respuesta mediante `Response.prototype.json()`.                        | ✖ Refutada    | El hook en `Response.prototype.json` nunca se disparó para la conversación (llegaba tarde).                                                            | Probablemente `json()` ya fue llamado antes de instalar el hook, o la app usa otro mecanismo (streams).                                 |
| H‑006 | La aplicación consume la respuesta a través de `ReadableStream` (`getReader`).                  | ⚠ Pendiente   | Al interceptar `getReader` se observaron muchísimas llamadas, incluso sin recargar. Los traces mencionan streams vivos de telemetría y otros procesos. | La app sí utiliza streams intensivamente, pero no se aisló cuál corresponde a la conversación principal.                                |
| H‑007 | El hook sobre `window.fetch` capturará la primera petición de la conversación.                   | ✖ Refutada    | Al recargar después de instalar el hook no apareció ningún `console.trace` para el endpoint. El fetch inicial ya había ocurrido o usaba otra referencia. | La app probablemente guarda una referencia a `fetch` antes de que el hook se instale, o el fetch ocurre en un contexto no interceptable. |
| H‑008 | Los `fetch` que aparecen al hacer scroll corresponden a cargas parciales de la conversación.     | ✔ Confirmada  | Los logs de `console.trace` mostraban llamadas `safePost`, `jsonRequest`, `completeRequest` y otras relacionadas con React Query y la UI.              | Son peticiones de telemetría, métricas y posiblemente datos adicionales (stream_status, textdocs), no la carga del mapping principal.    |
| H‑009 | "Copy response" de DevTools proporciona el JSON completo de manera manual y repetible.           | ✔ Confirmada  | Se copió exitosamente el response de la petición 200; contenía el `mapping` completo.                                                                   | La información está disponible en el navegador; el problema es cómo capturarla automáticamente sin intervención manual.                |
| H‑010 | Una extensión Chrome con `"run_at": "document_start"` puede interceptar la respuesta antes de que la aplicación la consuma. | ⚠ Pendiente   | No se implementó aún. Conceptualmente es sólida: el código de la extensión se ejecutaría antes que cualquier script de ChatGPT.                        | Es la vía más prometedora para automatizar la captura sin depender de copias manuales ni proxies externos.                             |

---

# Experimentos

| ID     | Objetivo                                                                                                      | Resultado                                                                                                                                                                                                                                                                                                      | Observaciones                                                                                                                                                  | Conclusión                                                                                                                                        |
|--------|---------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| E‑001  | Verificar el endpoint y la estructura del response en Network.                                                | Petición `GET /backend-api/conversation/{id}` 200 OK. Response JSON contiene `title`, `create_time`, `mapping` con nodos anidados.                                                                                                                                                                               | Se inspeccionó manualmente. El tamaño varió (44.7 kB a 276 kB). La estructura coincide con el formato esperado.                                              | El backend y el formato son válidos.                                                                                                               |
| E‑002  | Ejecutar un `fetch` simple con `credentials:"include"` desde la consola.                                       | 404 Not Found; body: `{"detail":{"message":"Inicia sesión para ver esta conversación.","code":"conversation_inaccessible"}}`.                                                                                                                                                                                    | Se probó varias veces. Falló sistemáticamente después de la primera carga de la página.                                                                       | La autenticación por cookies no es suficiente; se necesita algo más que solo está presente durante la navegación inicial.                            |
| E‑003  | Usar "Copy as fetch" del Network y ejecutarlo desde consola.                                                   | Devolvió 200 con HTML (la SPA) o 404. No se obtuvo el JSON de manera consistente.                                                                                                                                                                                                                             | Se copiaron todos los headers, incluyendo Authorization. El comportamiento fue errático.                                                                     | El contexto de la petición original no se puede replicar completamente desde un `fetch` posterior.                                                   |
| E‑004  | Inspeccionar `performance.getEntriesByType("resource")` para ver detalles de la petición.                      | Listó la URL del endpoint con `initiatorType: "fetch"`, `transferSize: 323 kB`, `decodedBodySize: 1.88 MB`.                                                                                                                                                                                                   | Confirmó que la respuesta se descarga realmente y no viene de caché.                                                                                         | La petición existe y es medible.                                                                                                                   |
| E‑005  | Buscar el estado de la conversación en `window.__NEXT_DATA__` y otros globales.                                 | `__NEXT_DATA__`: undefined. No es una aplicación Next.js.                                                                                                                                                                                                                                                     | Se exploraron múltiples objetos globales.                                                                                                                    | No hay un estado global expuesto que contenga el `mapping`.                                                                                        |
| E‑006  | Hook en `Response.prototype.json`.                                                                             | El hook se instaló pero `window.__conversation` permaneció `undefined`.                                                                                                                                                                                                                                        | Instalado tras la carga; la conversación ya había sido parseada. Al recargar con el hook previamente pegado, tampoco se capturó (posiblemente usen streams). | `Response.json()` no es el punto adecuado para interceptar en esta aplicación.                                                                     |
| E‑007  | Hook en `window.fetch` con `console.trace` tras recargar.                                                      | Ningún trace para el endpoint de conversación. Aparecieron traces de otros fetch (telemetría, `safePost`, etc.) especialmente al hacer scroll.                                                                                                                                                                 | El hook no capturó la carga inicial; se ejecutó después de que la app ya obtuvo la conversación.                                                             | El fetch inicial no se puede interceptar con un hook instalado desde la consola después de cargar la página.                                       |
| E‑008  | Explorar `__reactRouterDataRouter` y su estado.                                                                | `router.state.loaderData` mostraba objetos pero `routes/_conversation.c.$conversationId` era `null`. No aparecía el `mapping`.                                                                                                                                                                               | Se examinó con `console.dir` a profundidad 4‑8.                                                                                                             | React Router no expone los datos de la conversación en su estado global.                                                                           |
| E‑009  | Inspeccionar `__REACT_QUERY_CACHE__`.                                                                          | Objeto vacío `{}`.                                                                                                                                                                                                                                                                                            | React Query no almacena la conversación en ese objeto global.                                                                                                | El almacenamiento en caché usa otro mecanismo.                                                                                                     |
| E‑010  | Hook en `ReadableStream.prototype.getReader`.                                                                   | Inmediatamente tras pegar el script aparecieron innumerables llamadas a `getReader()`, sin necesidad de recargar. Los traces mostraban archivos minificados como `4813494d-*.js`.                                                                                                                              | La aplicación tiene muchos streams activos (telemetría, textdocs, etc.). No se pudo aislar el stream de la conversación.                                    | La app sí usa ReadableStream; podría ser el mecanismo para procesar la conversación, pero hace falta filtrar por URL.                               |
| E‑011  | Usar "Copy response" sobre la petición 200 en Network.                                                         | Se obtuvo un JSON enorme que comienza con `{"title":"...","create_time":...` e incluye el `mapping`.                                                                                                                                                                                                        | Confirmó que el navegador ya tiene el dato completo.                                                                                                        | La captura manual es posible, por tanto el problema es solamente la automatización.                                                               |
| E‑012  | Guardar la sesión como HAR (sanitized) para analizar offline.                                                   | Se generó un archivo HAR; contenía la petición 200 con el response completo (mapping incluido) y otras llamadas (`stream_status`, `textdocs`).                                                                                                                                                                 | No se usó para extracción automática, solo como evidencia.                                                                                                  | El HAR confirma que la respuesta está completa y accesible.                                                                                       |

---

# Restricciones descubiertas

- El endpoint `/backend-api/conversation/{id}` solo responde con el JSON completo durante la primera solicitud asociada a la navegación (probablemente un loader interno). Cualquier `fetch` posterior desde la consola recibe `404 conversation_inaccessible`.
- El `Authorization: Bearer` presente en las peticiones de la página no es suficiente para replicar la solicitud desde `fetch` manual; se requiere algún token o estado efímero vinculado a la sesión/navegación.
- No se encontró un objeto global (React Router, React Query, window) que exponga el `mapping` después de la carga.
- Los intentos de interceptar `Response.prototype.json` o `window.fetch` desde la consola llegan siempre después de que la aplicación ya consumió la respuesta, por lo que no capturan la conversación.
- `window.fetch` no es el `fetch` nativo; la aplicación ya lo reemplaza con una versión propia (observado en `window.fetch.toString()`), lo que puede interferir con hooks posteriores.
- La interfaz de ChatGPT no expone un identificador único y estable en la URL para todos los tipos de conversación (cambia entre `/c/`, `/g/.../c/`).

---

# Arquitectura propuesta

## Principios

La extensión debe respetar la arquitectura ya utilizada por AI Chat Exporter:

* Responsabilidad única.
* Bajo acoplamiento.
* Reutilización del pipeline existente.
* Evolución incremental.

La captura del JSON debe mantenerse completamente desacoplada del parser y de los exportadores.

---

## Flujo general

```text
ChatGPT
      │
      ▼
Capturador (extensión / proxy)
      │
      ▼
JSON en crudo
      │
      ▼
Loader (loader.js)
      │
      ▼
Parser (parser.js) – recorre mapping, extrae author.role, content.parts, timestamps
      │
      ▼
Modelo canónico: Conversation { messages[] }
      │
      ▼
Renderers: Markdown (markdown.js), HTML, PDF, Obsidian, etc.
```

---

## Módulos iniciales (solo ChatGPT + Markdown)

- **`loader.js`** – obtiene el objeto JSON (de archivo, del interceptor de la extensión, etc.).
- **`parser.js`** – recorre el `mapping`, extrae `author.role`, `content.parts`, timestamps, etc. Produce un array ordenado de mensajes. No ordena por `create_time` (rompe la estructura de ramas y regeneraciones); en su lugar recorre el árbol en orden.
- **`cleaner.js`** – limpia el contenido (opcional).
- **`markdown.js`** – formatea los mensajes en Markdown.
- **`index.js`** – orquesta el flujo.

---

## Extensión Chrome como capturador automático

- `manifest.json` con `"run_at": "document_start"` para inyectar un content script antes de que cargue ChatGPT.
- El content script podría interceptar `Response.prototype.json` (o `ReadableStream`) y guardar el JSON en `window.__conversation` o enviarlo al background script.
- Alternativa: proxy (mitmproxy) para capturar la respuesta HTTPS independientemente del frontend.

---

## Interfaz futura (post‑MVP)

```ts
interface Provider {
  name: string;
  detect(raw: any): boolean;
  parse(raw: any): Conversation;
}
```

Para soportar Gemini, Claude, etc., añadiendo solo un `Provider` sin modificar el núcleo.

---

# Tecnologías evaluadas

| Tecnología / API               | ¿Se probó? | ¿Se descartó? | ¿Quedó pendiente? | Notas |
|--------------------------------|------------|---------------|-------------------|-------|
| `fetch`                        | ✅         | ❌ (manual falló) | ✅ como parte de la extensión | No reproducible desde consola tras carga. |
| `Response.prototype.json`      | ✅         | ❌ (no capturó) | ✅ (puede funcionar con inyección temprana) | Se llegó tarde. |
| `ReadableStream` / `getReader` | ✅         | ❌ (alto ruido) | ✅ (filtrar por URL) | La aplicación lo usa masivamente. |
| `window.fetch` (hook)          | ✅         | ❌ (no interceptó la carga) | ✅ (posible con document_start) | La aplicación ya envuelve fetch. |
| `window.__reactRouterDataRouter`| ✅        | ❌ (datos nulos) | ❌ | No expone el mapping. |
| `window.__REACT_QUERY_CACHE__` | ✅         | ❌ (vacío) | ❌ | No usado. |
| `performance.getEntriesByType` | ✅         | – | – | Útil para confirmar la existencia de la petición. |
| Chrome DevTools – Network      | ✅         | – | – | Herramienta principal de investigación. |
| "Copy as fetch" / "Copy response" / "Copy as HAR" | ✅ | – | – | Copy response funciona manualmente. |
| Userscripts (Tampermonkey)     | – | – | ✅ | Alternativa a extensión para inyección temprana. |
| `chrome.webRequest`            | – | – | ✅ | Podría usarse para interceptar la petición. |
| `chrome.debugger`              | – | – | ❌ | Demasiado invasivo; no considerado prioritario. |
| Content Scripts (MV3)          | – | – | ✅ | Vía principal para la extensión. |
| Service Worker (MV3)           | – | – | ✅ | Para manejo en background. |
| mitmproxy / HTTP Toolkit       | – | – | ✅ | Alternativa de proxy para captura independiente. |
| `chat_processor.js` (Alex)     | ✅         | – | ✅ | Base para el parser; necesita modularizarse. |
| `JSON.parse`                   | – | – | ✅ | Podría ser interceptado como último recurso. |

---

# Ideas descartadas

- **Repetir el `fetch` desde consola** (con o sin headers copiados): nunca se logró obtener el JSON de manera reproducible.
- **Buscar el estado de la conversación en `window`**: todos los objetos globales inspeccionados resultaron vacíos o nulos.
- **Ordenar los mensajes por `create_time`** (como hace Alex): rompe la estructura de ramas y regeneraciones; es preferible recorrer el árbol respetando sus relaciones.
- **Construir directamente una solución multi-proveedor**: se decidió implementar primero el soporte para ChatGPT y Markdown, evitando sobre-ingeniería prematura.
- **Usar `chrome.debugger`**: requiere permisos elevados y resulta demasiado invasivo para el objetivo del proyecto.

---

# Pendientes

1. **Confirmar el mecanismo exacto de consumo de la respuesta**: determinar si ChatGPT utiliza `Response.json()`, `ReadableStream`, ambos o algún mecanismo adicional para procesar la conversación.
2. **Implementar el capturador automático**: desarrollar una extensión Chrome (Manifest V3) con `run_at: "document_start"` capaz de interceptar la respuesta antes de que la aplicación la procese.
3. **Integrar la captura con el pipeline existente**: reutilizar `loader`, `parser` y `markdown` sin modificar la arquitectura del proyecto.
4. **Refactorizar `chat_processor.js`** en módulos independientes (`loader`, `parser`, `cleaner`, `renderer/markdown`) para facilitar su mantenimiento y reutilización.
5. **Validar el funcionamiento con múltiples conversaciones**: probar chats con ramas, regeneraciones, herramientas, imágenes y distintos tamaños.
6. **Evaluar un proxy como alternativa**: investigar herramientas como mitmproxy si la estrategia basada en la extensión no resulta suficiente.

---

# Próximos pasos

1. Construir un prototipo mínimo de extensión (Manifest V3).
2. Verificar la captura automática del JSON durante la carga inicial de una conversación.
3. Integrar la captura con el pipeline existente de AI Chat Exporter.
4. Automatizar la generación y descarga del documento Markdown.
5. Validar el funcionamiento con múltiples conversaciones.
6. Una vez estabilizado el flujo completo, comenzar la expansión hacia nuevos formatos de salida y nuevos proveedores.

---

# Cronología

1. **Descubrimiento del endpoint** – Se identifica `/backend-api/conversation/{id}` devolviendo `200 OK` junto con el árbol `mapping`.
2. **Fallo del `fetch` manual** – Un `fetch()` ejecutado desde la consola devuelve `404`; comienza la investigación sobre autenticación y contexto de navegación.
3. **Experimentación con hooks** – Se prueban `Response.prototype.json`, `window.fetch` y `ReadableStream.getReader`. Ninguno logra capturar la conversación inicial, aunque permiten comprender mejor el funcionamiento interno de la aplicación.
4. **Inspección del estado de React** – Se analizan `__reactRouterDataRouter` y `__REACT_QUERY_CACHE__`, sin encontrar el árbol de la conversación.
5. **Éxito manual con "Copy response"** – Se confirma que el navegador recibe y conserva el JSON completo de la conversación.
6. **Cambio de estrategia** – Se abandona la idea de reproducir la petición y se decide interceptar la respuesta antes de que ChatGPT la procese.
7. **Diseño de la arquitectura** – Se plantea una extensión basada en `document_start` que funcione como capturador desacoplado del resto del pipeline.
8. **Enfoque KISS** – Se define un alcance inicial limitado a ChatGPT + Markdown, postergando otros proveedores y formatos.
9. **Próxima etapa** – Implementación del capturador e integración con la arquitectura existente de AI Chat Exporter.

---

# Estado actual

## Confirmado

- El backend continúa enviando el árbol completo de la conversación.
- El parser actual de AI Chat Exporter puede reutilizarse.
- La arquitectura modular permite incorporar un capturador externo sin modificar el núcleo del proyecto.
- La opción **"Copy response"** de DevTools permite recuperar manualmente el JSON completo.

## Pendiente

- Capturar automáticamente el JSON durante la carga inicial de la conversación.
- Implementar la extensión Chrome.
- Integrar la captura con el pipeline existente.
- Automatizar la generación y descarga del documento Markdown sin intervención manual.

---

# Conclusión

La investigación confirmó que el principal desafío no consiste en interpretar la estructura del JSON de ChatGPT, sino en capturarlo automáticamente antes de que la aplicación web lo procese.

El parser y el pipeline desarrollados por AI Chat Exporter ya resuelven satisfactoriamente la transformación del modelo de conversación hacia formatos abiertos como Markdown. La arquitectura actual del proyecto permite incorporar un capturador externo sin modificar el núcleo de la aplicación.

En consecuencia, la siguiente etapa del proyecto deja de centrarse en el procesamiento de datos y pasa a enfocarse exclusivamente en la automatización de su captura mediante una extensión para navegador.