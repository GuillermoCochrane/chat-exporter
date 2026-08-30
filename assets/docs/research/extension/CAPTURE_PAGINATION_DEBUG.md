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

Estado: ⏳ Pendiente

### H2
El parámetro `num_turns` controla cuántos turnos/mensajes se traen por página.

Estado: ⏳ Pendiente

### H3
La página no carga toda la conversación de una vez. Al hacer scroll hacia arriba, se disparan nuevas peticiones con `before=<cursor>`.

Estado: ⏳ Pendiente

### H4
Las respuestas de páginas distintas contienen `messages` que no se solapan. Si se solapan, será necesario deduplicar.

Estado: ⏳ Pendiente

### H5
El objeto `message` dentro de `messages[]` es compatible (o fácilmente transformable) con el viejo `message` dentro de `mapping`, al menos en los campos que usa el parser.

Estado: ⏳ Pendiente

### H6
La página mantiene en memoria solo una parte de la conversación. Al agotarse esa caché, solicita más mensajes al servidor.

Estado: ⏳ Pendiente

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

⏳ Pendiente

**Observaciones**

⏳ Pendiente

**Conclusión**

⏳ Pendiente

---