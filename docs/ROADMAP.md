# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde ChatGPT a Markdown limpio y reutilizable.

---

## Estado actual

### Versión: 0.5.10.6

**Estado**

- [x] Inicialización del proyecto
- [x] Estructura de carpetas
- [x] Pipeline definido

### Pipeline

- [x] Loader
- [x] Inspector
- [x] Parser
- [x] Filter
- [x] Normalizer
- [x] Formatter
- [x] Markdown Builder
- [x] Writer
- [x] CLI

### Testing

- [x] Tests manuales
- [x] Tests Formatter
- [x] Tests Validator
- [x] Tests Parser
- [x] Tests Filter
- [x] Tests Normalizer
- [x] Tests Markdown
- [x] Tests Markdown (modo compacto)
- [x] Runner para ejecutar la suite completa
- [x] Tests Loader
- [ ] Tests Writer

### Funcionalidades

- [x] Exportación Markdown
- [x] Modo inspect
- [x] Modo no-write
- [x] Modo compact

- [ ] Primera Release
---

## Pipeline previsto

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

---

## Próximos pasos

1. Implementar tests para Writer.
2. Revisar cobertura de la CLI.
3. Preparar la primera Release 1.0.0.

---

## Ideas futuras

- Convertir en extensiuon de Chrome
- Soporte Gemini
- Soporte DeepSeek
- Soporte Claude
- Soporte Modo IA de google
- Exportar HTML
- Exportar PDF
- Exportar Obsidian
- Warning de sobrescritura interacitvo en la CLI
- Modo compacto configurable desde la extensión.
- Configuración de formatos de exportación.
- Templates de Markdown.