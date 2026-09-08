# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

---

# Estado actual

## Versión

**1.5.0 (Development)**

## Estado general

### Núcleo

- [x] Pipeline desacoplado
- [x] Conversation Sources
- [x] Pipeline Profiles
- [x] Inspector
- [x] Parser adaptado a conversaciones paginadas
- [x] Sorter con failsafe por `parent_id`
- [x] Filter
- [x] Filtro por rol (user/assistant/all)
- [x] Normalizer
- [x] Formatter
- [x] Markdown Builder
- [x] Writer

### Interfaces

- [x] CLI
- [x] Chrome Extension con popup y opciones avanzadas
- [x] Captura de conversaciones existentes con paginación
- [x] Captura de conversaciones nuevas vía SSE
- [x] Confirmación real de descarga
- [x] Notificación de actualizaciones
- [x] Web (GitHub Pages)
- [ ] REST API

### Testing

#### Automatizado

- [x] Formatter
- [x] Validator
- [x] Parser
- [x] Filter
- [x] Filter (filtro por rol)
- [x] Normalizer
- [x] Sorter
- [x] Markdown
- [x] Markdown (modo compacto)
- [x] JsonFileSource
- [x] Writer
- [x] Inspector

#### Manual

- [x] Casos generales
- [x] Modo inspect
- [x] Modo no-write
- [x] Validación de distribución
- [x] Conversación existente con paginación
- [x] Conversación nueva desde cero
- [x] Recarga + mensajes nuevos
- [x] Conversación larga con múltiples páginas

### Distribución

- [x] Metadata del proyecto
- [x] README
- [x] Configuración por defecto (`assets/input/conversation.json`)
- [x] Fixtures versionados
- [x] Repositorio ejecutable inmediatamente después de clonar
- [x] Materiales para publicación en Chrome Web Store
- [x] Extensión enviada a revisión en la Chrome Web Store

### Arquitectura

- [x] Core desacoplado de las interfaces
- [x] Pipeline basado en perfiles
- [x] Conversation Sources
- [x] Preparado para múltiples proveedores
- [x] OutputHandler inyectado
- [x] Contrato unificado de fuentes (reciben `config` completo)
- [x] ExtensionSource
- [x] Build de extensión con esbuild
- [x] Modularización de `inject` y `background`
- [x] Captura de streams SSE sin acoplar al Core

### Extensión — UX

- [x] Popup con selector de formato (Markdown / JSON)
- [x] Modo compacto en popup
- [x] Filtro de roles en popup
- [x] Indicador de progreso y manejo de errores visual
- [x] Feedback de progreso durante la exportación
- [x] Timeout por inactividad
- [x] Deshabilitar controles durante la exportación
- [x] Confirmación real de descarga
- [x] Notificación de descarga finalizada
- [x] Aviso de actualización
- [x] Sistema multi‑idioma (español / inglés) con toggle visual
- [x] Popup refactorizado en handlers modulares

### Web

- [x] Landing page
- [x] Páginas internas (Privacy, FAQ, CLI, Changelog, Sitemap)
- [x] Sistema multiidioma (español / inglés)
- [x] Meta tags SEO y redes sociales
- [x] Transiciones de vista

### Deuda técnica

- [x] Advertencia de recarga para mitigar captura incompleta.
- [x] Recuperar conversación desde la página al exportar para evitar dependencia del estado del Service Worker.
- [x] Captura de conversaciones nuevas vía SSE.
- [x] Captura de mensajes nuevos en conversaciones activas.
- [x] Captura de conversaciones nuevas desde cero.
- [ ] Explorar captura incremental más avanzada (investigación futura, no prioritaria).
- [ ] Advertencia de recarga latente: evaluar si se reutiliza para otros proveedores.

---

# Pipeline

```text
Interface
   ↓
Pipeline Profile
   ↓
Pipeline Config
   ↓
runExporter
   ↓
Conversation Source
   ↓
Conversation
   ↓
runPipeline
   ↓
Inspector
   ↓
Parser
   ↓
Sorter
   ↓
Filter
   ↓
Normalizer
   ↓
Renderer
   ↓
Output
```

---

## Próximo objetivo

### DeepSeek

- Investigar la estructura del JSON de DeepSeek para integrarlo como nuevo Conversation Source.

---

# Evoluciones previstas

Una vez estabilizado el núcleo del proyecto podrán incorporarse nuevas capacidades reutilizando el mismo pipeline.
Las funcionalidades listadas a continuación no forman parte del objetivo de la versión 1.5.0 y representan posibles líneas de evolución del proyecto.

## Nuevos exportadores

- HTML
- PDF
- Obsidian

## Nuevas plataformas

### Infraestructura

- Detección automática del formato de conversación.
- Selección dinámica del parser correspondiente.

### Conversation Sources y Adapters previstos

- ChatGPT
- Gemini
- Claude
- DeepSeek
- Google AI Mode

## Nuevas interfaces

- Extensión para Chrome.
- API.
- Aplicación de escritorio.

## Mejores futuras

- Templates de Markdown.
- Configuración avanzada de exportación.
- Advertencia interactiva de sobrescritura en la CLI.
- Configuración persistente de usuario.
- Soporte para perfiles de exportación.
- Nuevos modos de formateo Markdown.
- Renderers desacoplados.
- Outputs desacoplados.

---
