# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde ChatGPT a Markdown limpio y reutilizable.

---

## Estado actual

Versión: 0.5.4

Estado:

- [x] Inicialización del proyecto
- [x] Estructura de carpetas
- [x] Pipeline definido
- [x] Loader
- [x] Inspector
- [x] Parser
- [x] Filtro de mensajes
- [x] Normalización
- [x] Formatter
- [ ] Generador Markdown
- [ ] Writer
- [ ] CLI
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

1. Generar Markdown.
2. Escribir archivo.
3. Añadir CLI.
4. Publicar v1.0.

---

## Ideas futuras

- Exportar HTML
- Exportar PDF
- Exportar Obsidian
- Soporte Gemini
- Soporte Claude
- Soporte DeepSeek
- Soporte Qwen