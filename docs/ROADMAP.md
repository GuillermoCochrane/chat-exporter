# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

---

# Estado actual

## Versión

**0.9.5.2 (Pre Release)**

## Estado general

### Núcleo

- [x] Loader
- [x] Inspector
- [x] Parser
- [x] Filter
- [x] Normalizer
- [x] Formatter
- [x] Markdown Builder
- [x] Writer

### Interfaces

- [x] CLI

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

### Pre Release

- [x] Arquitectura reorganizada
- [x] Documentación especializada
- [x] Validación desde clon limpio
- [x] Preparación para distribución
- [ ] Release 1.0.0

---

# Pipeline

```text
JSON
 ↓
Loader
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
Markdown Builder
 ↓
Writer
```

---

# Próximo objetivo

## Versión 1.0.0

La primera versión estable consistirá en:

- Revisión final de toda la documentación.
- Revisión de coherencia entre Architecture, ADR, Laboratory, Changelog y Roadmap.
- Verificación final del proyecto desde un repositorio recién clonado.
- Actualización definitiva de versión.
- Creación del tag.
- Publicación de la primera Release.

No se prevén nuevas funcionalidades antes de la versión 1.0.

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