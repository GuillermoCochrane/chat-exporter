# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

---

# Estado actual

## Versión

**1.1.3 (Development)**

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
- [ ] Chrome Extension
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
- [x] Loader
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


---

# Pipeline

```text
Profile
   ↓
Source
   ↓
Conversation
   ↓
Inspector
   ↓
Parser
   ↓
Filter
   ↓
Normalizer
   ↓
Formatter
   ↓
Renderer
   ↓
Output
```

---

## Próximo objetivo

### Integración de la primera interfaz desacoplada

- Integrar Chrome Extension utilizando Conversation Sources.
- Mantener el Core completamente independiente de la interfaz.
- Validar que CLI y Extension compartan exactamente el mismo pipeline.
- Documentar la integración.

---

# Evoluciones previstas

> Una vez estabilizado el núcleo del proyecto podrán incorporarse nuevas capacidades reutilizando el mismo pipeline.
> Las funcionalidades listadas a continuación no forman parte del objetivo de la versión 1.0 y representan posibles líneas de evolución del proyecto.

## Nuevos exportadores

- HTML
- PDF
- Obsidian

## Nuevas plataformas

### Infraestructura

- Detección automática del formato de conversación.
- Selección dinámica del parser correspondiente.

### Parsers previstos

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