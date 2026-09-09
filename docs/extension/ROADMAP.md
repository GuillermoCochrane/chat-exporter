# Extension Roadmap

## Objetivo

Eliminar la necesidad de utilizar DevTools para recuperar el JSON de una conversación de ChatGPT.

La extensión captura automáticamente la conversación desde la interfaz web y la entrega al pipeline de AI Chat Exporter.

El objetivo final es ofrecer una herramienta completa de exportación, con soporte para conversaciones existentes y nuevas.

---

# Estado

- ✅ Investigación
- ✅ Capturador
- ✅ Persistencia
- ✅ Integración
- ✅ Popup con selector de formato (MD/JSON)
- ✅ Opciones avanzadas (compact, roles)
- ✅ UX completa
- ✅ Captura de conversaciones nuevas mediante SSE
- ✅ Confirmación real de descarga
- ✅ Notificación de actualizaciones
- ✅ Detección automática de proveedor
- ✅ Nombres de archivo descriptivos
- 🚧 Publicación

---

# Fase 1 — Captura

## Objetivos

Implementar un capturador estable de conversaciones de ChatGPT.

## Estado

**Completado**

### Validado

- ✅ Inyección de código en el contexto de la página.
- ✅ Intercepción de `window.fetch`.
- ✅ Identificación del endpoint de conversación.
- ✅ Captura de conversaciones existentes paginadas.
- ✅ Captura de conversaciones nuevas mediante stream SSE.
- ✅ Integración de ambos flujos en el mismo estado.
- ✅ Detección del proveedor mediante URL.
- ✅ Confirmación de que el JSON/SSE se puede transformar en el modelo del pipeline.

### Resultado

La captura automática es viable y funciona tanto para conversaciones existentes como para conversaciones nuevas.

---

# Fase 2 — Persistencia

## Objetivos

Definir un mecanismo de almacenamiento temporal desacoplado entre la captura y la exportación.

## Estado

**Completado**

### Decisión adoptada

La conversación capturada permanece en memoria dentro del contexto de la página.

Si el Service Worker se reinicia y pierde la conversación, la extensión puede recuperarla desde la página mediante el content script.

Además, se guarda el título de la conversación cuando está disponible, tanto desde páginas paginadas como desde el stream SSE.

El proveedor se detecta automáticamente y se utiliza para construir nombres de archivo descriptivos.

### Motivos

- Evita serialización innecesaria.
- Evita duplicación de memoria.
- Desacopla completamente la captura de la exportación.
- Simplifica la arquitectura.
- Mejora la organización de los archivos descargados.

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
      ├── conversación existente → paginación
      │
      └── conversación nueva → SSE
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
- ✅ Modo compacto
- ✅ Filtro de roles
- ✅ Opciones de Markdown se ocultan al seleccionar JSON
- ✅ Indicador de progreso
- ✅ Botón Exportar deshabilitado durante el procesamiento
- ✅ Mensajes de estado
- ✅ Encabezado contextual con nombre del proveedor
- ✅ Footer con versión dinámica
- ✅ Estética cyberpunk con glassmorphism y sistema de tokens CSS
- ✅ Estilos modularizados por responsabilidad
- ✅ Sistema multi‑idioma
- ✅ Feedback de progreso
- ✅ Timeout por inactividad
- ✅ Confirmación real de descarga
- ✅ Notificación al finalizar la descarga
- ✅ Aviso de actualización
- ✅ Detección dinámica de proveedor
- ✅ Nombres de archivo descriptivos

### Pendiente

- ⏳ Publicación en Chrome Web Store
- ⏳ Configuración avanzada (templates, atajos de teclado)

---

# Fase 6 — Publicación

## Objetivos

Preparar la extensión para distribución.

## Estado

**Pendiente**

### Alcance

- Revisión general.
- Documentación.
- Pruebas manuales.
- Empaquetado.
- Publicación.

---

# Futuro

## Exportación

- Nuevos formatos.
- Exportación múltiple.
- Plantillas personalizadas.

## Compatibilidad

- Otros proveedores de IA.
- Detección automática del proveedor.
- Actualización de proveedores compatibles.

## Integraciones

- Obsidian.
- Logseq.
- Notion.
- GitHub.

## Automatización

- Exportación automática.
- Exportación por conversación.
- Exportación por lote.
- Sincronización incremental.

---
