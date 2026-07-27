# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

---

# Estado actual

## Versión

**1.1.4 (Development)**

## Estado general

### Núcleo

- [x] Pipeline desacoplado
- [x] Conversation Sources
- [x] Pipeline Profiles
- [x] Inspector
- [x] Parser
- [x] Filter
- [x] Normalizer
- [x] Formatter
- [x] Markdown Builder
- [x] Writer

### Interfaces

- [x] CLI
- [x] Chrome Extension
- [ ] REST API

### Testing

#### Automatizado

- [x] Formatter
- [x] Validator
- [x] Parser
- [x] Filter
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
- [x] Configuración por defecto (`input/conversation.json`)
- [x] Fixtures versionados
- [x] Repositorio ejecutable inmediatamente después de clonar

### Arquitectura

- [x] Core desacoplado de las interfaces
- [x] Pipeline basado en perfiles
- [x] Conversation Sources
- [x] Preparado para múltiples proveedores
- [x] OutputHandler inyectado
- [x] Contrato unificado de fuentes (reciben `config` completo)
- [x] ExtensionSource
- [x] Build de extensión con esbuild


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

## Integración de la extensión

La Chrome Extension ya está integrada con el pipeline.

- [x] ExtensionSource implementada.
- [x] Extensión integrada con `runExporter`.
- [x] Build automatizado con esbuild.
- [x] CLI y Extension reutilizan exactamente el mismo pipeline.
- [x] Descarga de Markdown desde la extensión.

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

## Mejoras futuras

- Templates de Markdown.
- Configuración avanzada de exportación.
- Advertencia interactiva de sobrescritura en la CLI.
- Configuración persistente de usuario.
- Soporte para perfiles de exportación.
- Nuevos modos de formateo Markdown.
- Renderers desacoplados.
- Outputs desacoplados.

---
