# Extension Roadmap

## Objetivo

Eliminar la necesidad de utilizar DevTools para recuperar el JSON de una conversación de ChatGPT.

La extensión deberá capturar automáticamente el JSON recibido por la aplicación web y reutilizar el pipeline existente de AI Chat Exporter.

---

# Estado

- 🚧 Investigación
- ⏳ Capturador
- ⏳ Persistencia
- ⏳ Integración
- ⏳ UX
- ⏳ Publicación

---

# Fase 1 — Captura

## Objetivos

Demostrar que una extensión Chrome (Manifest V3) puede capturar el JSON de una conversación antes de que ChatGPT lo procese.

## Criterios de éxito

- detectar la petición correcta;
- capturar el `mapping` completo;
- validar la integridad del JSON obtenido.

---

# Fase 2 — Persistencia

## Objetivos

Definir el mecanismo de almacenamiento del JSON capturado antes de iniciar la exportación.

## Alternativas a evaluar

- `window`
- `chrome.storage.local`
- descarga temporal
- comunicación con el Service Worker

## Criterios de éxito

- conservar el JSON íntegro;
- evitar pérdidas de información durante la exportación;
- minimizar el consumo de recursos.

---

# Fase 3 — Integración

## Objetivos

Integrar la extensión con el pipeline existente de AI Chat Exporter.

## Resultado esperado

```text
JSON
 ↓
Parser
 ↓
Filter
 ↓
Normalizer
 ↓
Markdown
 ↓
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