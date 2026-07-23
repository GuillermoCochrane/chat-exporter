# Extension Roadmap

## Objetivo

Eliminar la necesidad de utilizar DevTools para recuperar el JSON de una conversación de ChatGPT.

La extensión deberá capturar automáticamente el JSON recibido por la aplicación web y reutilizar el pipeline existente de AI Chat Exporter.

---

# Estado

- ✅ Investigación
- 🚧 Capturador
- ⏳ Persistencia
- ⏳ Integración
- ⏳ UX
- ⏳ Publicación

---

# Fase 1 — Captura

## Objetivos

Implementar un capturador estable del JSON de conversación utilizando la API `fetch()` desde el contexto de la página.

## Estado

**Completado (Investigación)**

### Validado

- ✅ Inyección de código en el contexto de la página.
- ✅ Intercepción de `window.fetch`.
- ✅ Identificación del endpoint correcto:
  ```
  /backend-api/conversation/{id}
  ```
- ✅ Captura del objeto completo de conversación.
- ✅ Verificación del campo `mapping`.
- ✅ Confirmación de que el JSON coincide con el obtenido manualmente desde DevTools.

## Pendiente

- encapsular el capturador;
- eliminar código de depuración;
- enviar el JSON al resto de la extensión.

---

# Fase 2 — Persistencia

## Objetivos

Definir el mecanismo de almacenamiento del JSON capturado antes de iniciar la exportación.

## Alternativas a evaluar

- `window`
- `chrome.storage.local`
- comunicación mediante `window.postMessage`
- comunicación con el Service Worker

## Criterios de éxito

- conservar el JSON íntegro;
- evitar pérdidas de información;
- minimizar el consumo de recursos;
- desacoplar la captura del proceso de exportación.

---

# Fase 3 — Integración

## Objetivos

Conectar la extensión con el pipeline existente de AI Chat Exporter.

## Flujo esperado

```text
ChatGPT
      │
      ▼
Capturador
      │
      ▼
Pipeline existente
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

# Fase 4 — UX

## Objetivos

- botón **Export**
- indicador de captura
- indicador de progreso
- manejo de errores
- configuración básica

---

# Fase 5 — Publicación

## Objetivos

Preparar la extensión para su distribución.

## Alcance

- revisión del código;
- documentación;
- pruebas manuales;
- empaquetado;
- publicación.

---

# Futuro

- soporte para otros formatos de exportación;
- soporte para otros proveedores de IA;
- exportación directa sin archivos intermedios;
- integración con Obsidian;
- configuración avanzada;
- actualización automática de proveedores compatibles.