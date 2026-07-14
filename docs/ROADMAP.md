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
- [ ] Parser del JSON
- [ ] Generador Markdown
- [ ] CLI
- [ ] Exportación de archivos
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
Markdown Builder
↓
Writer

---

## Próximos pasos

1. Implementar parser.
2. Normalizar mensajes.
3. Generar Markdown.
4. Escribir archivo.
5. Añadir CLI.
6. Publicar v1.0.

---

## Ideas futuras

- Exportar HTML
- Exportar PDF
- Exportar Obsidian
- Soporte Gemini
- Soporte Claude
- Soporte DeepSeek
- Soporte Qwen