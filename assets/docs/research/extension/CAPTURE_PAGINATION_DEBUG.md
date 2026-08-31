# CAPTURE_PAGINATION_DEBUG

> Documento temporal de investigación.
> Las conclusiones definitivas migrarán a la documentación principal (`docs/extension/CAPTURE_RESEARCH.md` o `docs/LABORATORY.md`).

## Objetivo

Investigar el cambio reciente en la API de ChatGPT que afecta la captura automática de conversaciones.

La extensión AI Chat Exporter dejó de capturar conversaciones porque el backend de ChatGPT cambió el formato de respuesta.

Este documento registra las hipótesis, experimentos y resultados de la investigación para adaptar la captura sin modificar el Core.

---

## Contexto

Hasta el 20/08/2026, la extensión interceptaba el endpoint:

```text
GET /backend-api/conversation/{id}
```

cuya respuesta contenía un campo `mapping` con el árbol completo de la conversación.

A partir del 21/08/2026, se detectó un nuevo endpoint:

```text
GET /backend-api/conversations/{id}?include_has_versions=true&num_turns=10
```

La respuesta ahora incluye:

- `messages[]`: lista paginada de mensajes.
- `current_node`: nodo actual.
- `page_info`: información de paginación.

El campo `mapping` desapareció de esta respuesta.

---

## Hipótesis

### H1
El endpoint `/backend-api/conversations/{id}` devuelve solo una página limitada de mensajes, determinada por `num_turns` o por cursor.

Estado: ✅ Confirmada

### H2
El parámetro `num_turns` controla cuántos turnos/mensajes se traen por página.

Estado: ✅ Confirmada con observaciones

**Nota:**  
En las pruebas realizadas, `num_turns=10` devolvió páginas con más de 10 mensajes (por ejemplo, 16, 32 y 42). Esto sugiere que `num_turns` no limita la cantidad exacta de mensajes, sino que influye en la cantidad de turnos o en la profundidad de la página.

### H3
La página no carga toda la conversación de una vez. Al hacer scroll hacia arriba, se disparan nuevas peticiones con `before=<cursor>`.

Estado: ✅ Confirmada

### H4
Las respuestas de páginas distintas contienen `messages` que no se solapan. Si se solapan, será necesario deduplicar.

Estado: ✅ Confirmada

**Nota:**  
Durante la captura completa de una conversación de 187 páginas, no se detectaron mensajes repetidos entre páginas. Los rangos de IDs fueron disjuntos.

### H5
El objeto `message` dentro de `messages[]` es compatible (o fácilmente transformable) con el viejo `message` dentro de `mapping`, al menos en los campos que usa el parser.

Estado: ✅ Confirmada parcialmente

**Nota:**  
La estructura del mensaje es similar, pero ahora se presenta como una lista plana con referencias `parent_id`, en lugar de un árbol de nodos con `children`. Los campos comunes (`id`, `author`, `content`, `create_time`, `metadata`) se mantienen.

### H6
La página mantiene en memoria solo una parte de la conversación. Al agotarse esa caché, solicita más mensajes al servidor.

Estado: ✅ Confirmada

**Nota:**  
Al recorrer la conversación completa, la última página capturada tuvo `has_previous_page=false`, lo que indica que se llegó al inicio del historial.

---

## Experimentos

### E-001 — Observación manual en DevTools

**Objetivo**

Observar el flujo real de peticiones al cargar y navegar una conversación larga.

**Método**

1. Abrir una conversación larga en ChatGPT.
2. Abrir DevTools → Network.
3. Filtrar por `conversations`.
4. Recargar la página.
5. Registrar peticiones al endpoint de conversación.
6. Hacer scroll hacia arriba y observar nuevas peticiones.

**Resultado**

Se identificaron dos endpoints relevantes:

- `GET /backend-api/conversations/{id}`  
  Devuelve la conversación inicial con `messages[]` y `page_info`.

- `GET /backend-api/conversations/{id}/messages?before=<cursor>`  
  Se dispara al hacer scroll hacia arriba y devuelve mensajes anteriores.

**Observaciones**

- La petición inicial incluye `num_turns=10`.
- El `page_info` de la respuesta inicial indicó:
  - `has_previous_page: true`
  - `has_next_page: false`
- Al hacer scroll hacia arriba, se dispararon nuevas peticiones con `before=<start_cursor>`.
- El campo `mapping` no aparece en ninguna de las respuestas observadas.
- Los mensajes ahora se presentan como una lista plana con referencias `parent_id`.

**Conclusión**

El frontend de ChatGPT ya no recibe la conversación completa en una única respuesta.  
La conversación se obtiene de forma paginada, solicitando páginas anteriores a medida que el usuario navega hacia arriba.

---

### E-002 — Captura pasiva instrumentada

**Objetivo**

Validar que `inject.js` puede capturar y acumular respuestas de conversaciones paginadas sin intervenir en el flujo de la página.

**Método**

1. Modificar temporalmente `inject.js` para:
   - interceptar cualquier respuesta JSON de `/backend-api/conversations/`;
   - guardar la respuesta cruda en `window.__AI_CHAT_EXPORTER__.conversation`.
2. Recargar una conversación.
3. Hacer scroll manual.
4. Inspeccionar el array acumulado desde consola.

**Resultado**

La captura pasiva funcionó correctamente.  
Se obtuvieron múltiples respuestas correspondientes a páginas distintas de la misma conversación.

**Observaciones**

- Las respuestas se acumularon sin sobrescribirse.
- Se mantuvo el flujo `inject → content → background` sin modificaciones.
- El array crudo pudo exportarse como JSON sin tocar el Core.

**Conclusión**

La interceptación pasiva es suficiente para capturar los datos crudos de cada página.  
El desafío restante es cómo forzar la carga de todas las páginas sin intervención manual.

---

### E-003 — Recolección activa mediante `fetch`

**Objetivo**

Evaluar si `inject.js` podía obtener las páginas directamente mediante `fetch`, sin depender del scroll.

**Método**

1. Desde `inject.js`, obtener el `conversation_id`.
2. Reproducir las peticiones usando el `fetch` original de la página.
3. Leer `page_info.has_previous_page` y pedir páginas anteriores con `before`.

**Resultado**

Falló.

Todas las peticiones activas devolvieron:

```text
401 Unauthorized
```

**Observaciones**

- Las peticiones pasivas de la página sí llegan autenticadas.
- Nuestro `fetch` activo no incluyó los headers/cookies/contexto necesarios.
- Replicar ese contexto no es viable desde la extensión sin complejidad adicional.

**Conclusión**

La recolección activa mediante `fetch` queda descartada por ahora.  
Se prioriza continuar con captura pasiva + scroll programático.

---

### E-004 — Scroll automático para recolección completa

**Objetivo**

Diseñar un mecanismo que fuerce a la página a cargar todas las páginas de la conversación y las capture pasivamente.

**Iteraciones**

#### E-004a — Scroll gradual

Se intentó subir el contenedor scrolleable con pasos de scroll.

Resultado: ❌ No disparó nuevas peticiones.

Conclusión: el trigger no es el desplazamiento gradual, sino llegar al borde superior.

#### E-004b — Scroll al tope con recálculo de métricas

Se forzó `scrollTop = 0` y, tras cada página, se recalculó `scrollHeight`/`clientHeight`.

Resultado: ✅ Funcionó parcialmente. Capturó varias páginas, pero se cortó por timeout.

Conclusión: el mecanismo es correcto, pero requiere tolerancia a demoras de red.

#### E-004c — Scroll con evento de captura

Se emitió un `CustomEvent` cada vez que `inject.js` capturaba una página. El script de consola esperaba ese evento en lugar de tiempos fijos.

Resultado: ✅ Funcionó mejor. Capturó muchas páginas, pero un pico de red provocó timeout.

Conclusión: el evento es mucho más confiable que el tiempo fijo. Falta reintento.

#### E-004d — Scroll con reintentos y timeout extendido

Se combinó:

- `CustomEvent` para esperar páginas.
- `timeoutMs` ampliado a 45 segundos.
- Reintento automático ante timeout.
- Oscilación de scroll en reintentos.

Resultado: ✅ Funcionó completamente. Capturó **187 páginas** y llegó a `has_previous_page=false`.

Conclusión: el enfoque es viable y permite capturar la conversación completa sin intervención manual.

---

## Problemas encontrados

### P-001 — Ambigüedad en el tipo de mensaje `CONVERSATION`

**Contexto**

Durante la integración, la exportación JSON se descargaba con solo 2 objetos, a pesar de que la recolección continuaba.

**Causa**

`inject.js` emitía el tipo `CONVERSATION` en dos situaciones:

1. Al capturar pasivamente una página (notificación espontánea).
2. Al finalizar la recolección completa (respuesta final).

`content.js` escuchaba `CONVERSATION` y respondía al `background` con el primer array que llegara. Por lo tanto, la descarga se disparaba antes de tiempo.

**Solución**

Se creó un tipo de mensaje nuevo:

- `CONVERSATION`: notificación espontánea de captura pasiva.
- `CONVERSATION_COMPLETE`: respuesta final luego de `collectViaScroll()`.

El `content.js` solo responde a `GET_CONVERSATION_FROM_PAGE` cuando recibe `CONVERSATION_COMPLETE`.

**Estado**

✅ Resuelto.

---

### P-002 — Error de canal asíncrono en `content.js`

**Síntoma**

Durante la recolección aparece repetidamente:

```text
Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
```

**Impacto**

No impide la captura ni la descarga. Es un error de comunicación asíncrona entre `content.js` y `background.js`.

**Estado**

⏳ Deuda pendiente. Se resolverá en una iteración posterior.

---

## Conclusión general

La conversación completa de ChatGPT puede capturarse mediante:

1. Interceptación pasiva de respuestas JSON desde `inject.js`.
2. Scroll automático hacia el tope del contenedor de mensajes.
3. Espera reactiva mediante `CustomEvent`.
4. Recálculo del contenedor después de cada página.
5. Reintentos ante demoras de red.
6. Detención cuando `page_info.has_previous_page` sea `false`.
7. Diferenciación entre notificación espontánea y respuesta final.

No fue necesario modificar el Core, el parser ni el flujo de exportación.

Este mecanismo será la base para la solución definitiva de captura en la extensión.

---

## Anexo — Script final funcional

```js
(async () => {
  console.log("[EXPERIMENTO] Iniciando scroll completo...");

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  function findScrollableContainer() {
    const all = [...document.querySelectorAll("*")];
    const candidates = all
      .filter((el) => {
        const style = getComputedStyle(el);
        return (
          el.scrollHeight > el.clientHeight &&
          (style.overflowY === "auto" || style.overflowY === "scroll")
        );
      })
      .sort((a, b) => b.scrollHeight - a.scrollHeight);

    return candidates[0] ?? document.scrollingElement ?? document.documentElement;
  }

  function waitForNewPage(timeoutMs = 45000) {
    return new Promise((resolve) => {
      const handler = (event) => {
        window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
        clearTimeout(timer);
        resolve(event.detail);
      };

      const timer = setTimeout(() => {
        window.removeEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
        resolve(null);
      }, timeoutMs);

      window.addEventListener("AI_CHAT_EXPORTER_PAGE_CAPTURED", handler);
    });
  }

  const container = findScrollableContainer();
  const state = window.__AI_CHAT_EXPORTER__;

  if (!state?.conversation) {
    console.warn("[EXPERIMENTO] No hay array de conversación.");
    return;
  }

  const initialCount = state.conversation.length;
  let lastPage = state.conversation[state.conversation.length - 1]?.data;
  let pageCount = initialCount;
  let consecutiveTimeouts = 0;

  console.log(`[EXPERIMENTO] Páginas iniciales: ${initialCount}`);

  while (lastPage?.page_info?.has_previous_page) {
    container.scrollTop = 0;

    const newPage = await waitForNewPage();

    if (!newPage) {
      consecutiveTimeouts++;
      console.warn(`[EXPERIMENTO] Timeout #${consecutiveTimeouts}. Reintentando...`);

      if (consecutiveTimeouts >= 3) {
        console.log("[EXPERIMENTO] Demasiados timeouts consecutivos. Deteniendo.");
        break;
      }

      container.scrollTop = 200;
      await sleep(500);
      container.scrollTop = 0;

      continue;
    }

    consecutiveTimeouts = 0;
    pageCount = state.conversation.length;
    lastPage = newPage.data;

    await sleep(1500);
    container.scrollTop = 0;
    await sleep(300);

    if (pageCount % 10 === 0 || !lastPage?.page_info?.has_previous_page) {
      console.log(`[EXPERIMENTO] Páginas capturadas: ${pageCount} | has_previous_page: ${lastPage?.page_info?.has_previous_page}`);
    }
  }

  console.log(`[EXPERIMENTO] Fin. Total páginas: ${state.conversation.length}`);

  const last = state.conversation[state.conversation.length - 1];
  if (last?.data?.page_info) {
    console.log("[EXPERIMENTO] Última página:", {
      has_previous_page: last.data.page_info.has_previous_page,
      has_next_page: last.data.page_info.has_next_page,
      messages: last.data.messages?.length ?? 0,
    });
  }
})();
```

---
