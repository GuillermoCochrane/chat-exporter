# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

---

# Estado actual

## Versión

**1.4.0 (Development)**

## Estado general

### Núcleo

- [x] Pipeline desacoplado
- [x] Conversation Sources
- [x] Pipeline Profiles
- [x] Inspector
- [x] Parser
- [x] Filter
- [x] Filtro por rol (user/assistant/all)
- [x] Normalizer
- [x] Formatter
- [x] Markdown Builder
- [x] Writer

### Interfaces

- [x] CLI
- [x] Chrome Extension (con popup y opciones avanzadas)
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
- [x] Markdown
- [x] Markdown (modo compacto)
- [x] JsonFileSource
- [x] Writer

#### Manual

- [x] Casos generales
- [x] Modo inspect
- [x] Modo no-write
- [x] Validación de distribución

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

### Extensión — UX

- [x] Popup con selector de formato (Markdown / JSON)
- [x] Modo compacto en popup
- [x] Filtro de roles en popup
- [x] Indicador de progreso y manejo de errores visual
- [x] Sistema multi‑idioma (español / inglés) con toggle visual

### Web

- [x] Landing page
- [x] Páginas internas (Privacy, FAQ, CLI, Changelog, Sitemap)
- [x] Sistema multiidioma (español / inglés)
- [x] Meta tags SEO y redes sociales
- [x] Transiciones de vista

### Deuda técnica

- [ ] La captura del `mapping` ocurre solo al cargar la página; los mensajes nuevos posteriores no se incluyen en la exportación.
- [ ] Las conversaciones nuevas desde cero no generan una captura inicial, por lo que la extensión no puede exportarlas.
- [ ] La segunda exportación sin recargar la página falla porque el Service Worker pierde el estado en memoria.
- [ ] Agregar un modal de advertencia cuando la conversación pueda estar incompleta, con recomendación de recargar la página y enlace a un futuro FAQ.

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

### Estabilización, actualización web y DeepSeek

- Lanzar la extensión en la Chrome Web Store una vez aprobada.
- Actualizar la página web del changelog y roadmap con la v1.4.0.
- Investigar la estructura del JSON de DeepSeek para integrarlo como nuevo Conversation Source.
- Corregir la deuda técnica de la captura parcial y el bug de la doble descarga.

---

# Evoluciones previstas

Una vez estabilizado el núcleo del proyecto podrán incorporarse nuevas capacidades reutilizando el mismo pipeline.
Las funcionalidades listadas a continuación no forman parte del objetivo de la versión 1.0 y representan posibles líneas de evolución del proyecto.

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
