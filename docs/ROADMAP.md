# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde ChatGPT a Markdown limpio y reutilizable.

---

## Estado actual

### Versión: 0.5.10.0

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
- [x] Tests manuales
- [x] Primeros tests automatizados
- [ ] Cobertura completa de tests
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

1. Completar los tests automatizados.
2. Revisar el uso de salida de markdown.js.
3. Publicar v1.0.

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