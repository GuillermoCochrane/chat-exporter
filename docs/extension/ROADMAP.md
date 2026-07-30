# Extension Roadmap

## Objetivo

Eliminar la necesidad de utilizar DevTools para recuperar el JSON de una conversación de ChatGPT.

La extensión deberá capturar automáticamente el JSON recibido por la aplicación web y reutilizar el pipeline existente de AI Chat Exporter.

El objetivo final es convertir el capturador experimental en una herramienta completa de exportación de conversaciones.

---

# Estado

- ✅ Investigación
- ✅ Capturador
- ✅ Persistencia
- ✅ Integración
- ✅ Popup con selector de formato (MD/JSON)
- ✅ Opciones avanzadas (compact, roles)
- 🚧 UX completa
- ⏳ Publicación

---

# Fase 1 — Captura

## Objetivos

Implementar un capturador estable del JSON de conversación utilizando la API `fetch()` desde el contexto real de la página.

## Estado

**Completado**

### Validado

- ✅ Inyección de código en el contexto de la página.
- ✅ Intercepción de `window.fetch`.
- ✅ Identificación del endpoint correcto:

  ```
  /backend-api/conversation/{id}
  ```

- ✅ Captura del objeto completo de conversación.
- ✅ Identificación del campo `mapping`.
- ✅ Filtrado de respuestas para evitar sobrescrituras por metadatos o arrays vacíos.
- ✅ Confirmación de que el JSON coincide con el obtenido manualmente desde DevTools.

### Resultado

La investigación demuestra que la captura automática del JSON es completamente viable bajo Manifest V3.

---

# Fase 2 — Persistencia

## Objetivos

Definir un mecanismo de almacenamiento temporal desacoplado entre la captura y la exportación.

## Estado

**Completado**

### Decisión adoptada

La conversación capturada permanece en memoria en `capturedConversation` dentro del background.

### Motivos

- evita serialización innecesaria;
- evita duplicación de memoria;
- desacopla completamente la captura de la exportación;
- simplifica la arquitectura.

---

# Fase 3 — Integración

## Objetivos

Conectar la extensión con el pipeline existente de AI Chat Exporter.

## Estado

**Completado**

### Flujo actual

```text
ChatGPT
      │
      ▼
Inject Script
      │
      ▼
Content Script
      │
      ▼
Background
      │
      ▼
Popup → EXPORT
      │
      ├── JSON → descarga directa
      │
      └── MD   → runExporter → descarga
```

La extensión reutiliza el pipeline del Core y ofrece al usuario un popup para seleccionar el formato de exportación.

---

# Fase 4 — Exportadores

## Objetivos

Permitir múltiples formatos de salida utilizando el mismo pipeline.

## Estado

**En progreso**

### Formatos implementados

- ✅ JSON (original)
- ✅ Markdown

### Formatos previstos

- HTML
- PDF

La arquitectura permite agregar nuevos formatos sin modificar el capturador.

---

## Fase 5 — UX

## Objetivos

Construir la interfaz definitiva de la extensión.

## Estado

**En progreso**

### Implementado

- ✅ Popup con selector de formato
- ✅ Modo compacto (checkbox)
- ✅ Filtro de roles (radio buttons: all / user / assistant)
- ✅ Opciones de Markdown se ocultan al seleccionar JSON
- ✅ Mensajes de estado (éxito / error)

### Pendiente

- ⏳ Indicador de progreso (spinner)
- ⏳ Mejora visual de errores
- ⏳ Configuración básica

---

# Fase 6 — Publicación

## Objetivos

Preparar la extensión para distribución.

## Estado

**Pendiente**

### Alcance

- limpieza del código;
- eliminación de logs de depuración;
- revisión general;
- documentación;
- pruebas manuales;
- empaquetado;
- publicación.

---

# Futuro

## Exportación

- nuevos formatos;
- exportación múltiple;
- plantillas personalizadas.

## Compatibilidad

- otros proveedores de IA;
- detección automática del proveedor;
- actualización de proveedores compatibles.

## Integraciones

- Obsidian;
- Logseq;
- Notion;
- GitHub.

## Automatización

- exportación automática;
- exportación por conversación;
- exportación por lote;
- sincronización incremental.

---
