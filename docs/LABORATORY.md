# Laboratory

## Hipótesis

### H-001

El endpoint de conversación devuelve el árbol completo.

Estado:

✔ Confirmada.

Evidencia:

El JSON contiene "mapping".

---

### H-002

El segundo fetch devuelve 404.

Estado:

✔ Confirmada.

Causa:

El endpoint solo está disponible durante la carga inicial.

---

### H-003

Es posible interceptar Response.prototype.json.

Estado:

✖ Refutada.

Observaciones:

La respuesta ya fue consumida por la aplicación.

---

## Experimentos

### E-001

Objetivo:

Interceptar fetch.

Resultado:

Parcial.

Observaciones:

Se capturó la petición, pero demasiado tarde.

---

### E-002

Objetivo:

Usar Copy as Fetch.

Resultado:

Exitoso.

Se obtuvo el JSON completo.

---

## Descubrimientos

- La conversación completa viaja durante la carga inicial.
- El JSON contiene el árbol completo.
- El parser podrá funcionar únicamente sobre el campo `mapping`.