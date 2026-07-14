# Chat Exporter Roadmap

## Objetivo

Convertir conversaciones exportadas desde ChatGPT a Markdown limpio y reutilizable.

---

## Estado actual

Versión: 0.5

Estado:
- [x] Inicialización del proyecto
- [x] Estructura de carpetas
- [x] Pipeline definido
- [x] Loader
- [x] Inspector
- [x] Parser
- [x] Filtro de mensajes
- [x] Normalización
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
Markdown Builder
↓
Writer

---

## Próximos pasos

1. Normalizar mensajes.
2. Generar Markdown.
3. Escribir archivo.
4. Añadir CLI.
5. Publicar v1.0.

---

## Ideas futuras

- Exportar HTML
- Exportar PDF
- Exportar Obsidian
- Soporte Gemini
- Soporte Claude
- Soporte DeepSeek
- Soporte Qwen