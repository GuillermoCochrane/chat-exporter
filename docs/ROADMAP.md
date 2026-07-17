# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde ChatGPT a Markdown limpio y reutilizable.

---

## Estado actual

### Versión: 0.5.9.2

**Estado**:

- [x] Inicialización del proyecto
- [x] Estructura de carpetas
- [x] Pipeline definido
- [x] Loader
- [x] Inspector
- [x] Parser
- [x] Filtro de mensajes
- [x] Normalización
- [x] Formatter
- [x] Generador Markdown
- [x] Writer
- [x] CLI
- [ ] Tests
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

1. Incorporar nuevas reglas al módulo `validator`.
2. Añadir tests.
3. Publicar v1.0.

---

## Ideas futuras

- Exportar HTML
- Exportar PDF
- Exportar Obsidian
- Soporte Gemini
- Soporte Claude
- Soporte DeepSeek
- Soporte Qwen