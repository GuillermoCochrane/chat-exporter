# AI Chat Exporter

> Convierte conversaciones exportadas desde plataformas de inteligencia artificial en documentos Markdown abiertos, legibles y reutilizables.

AI Chat Exporter nació con un objetivo simple: preservar conversaciones de inteligencia artificial en un formato abierto, legible e independiente de la plataforma donde fueron creadas.

Actualmente permite reconstruir conversaciones exportadas desde ChatGPT a partir de su archivo JSON oficial y convertirlas en documentos Markdown limpios, preservando la estructura, el orden y el contexto mediante un pipeline modular y desacoplado.

Aunque hoy el proyecto soporta ChatGPT y Markdown, su arquitectura fue diseñada para crecer hacia nuevos asistentes, nuevos formatos de exportación y futuras integraciones sin reescribir el núcleo de la aplicación.

---

# Estado

- ✅ Soporte para ChatGPT
- ✅ Exportación a Markdown
- ✅ Suite de pruebas automatizadas
- 🚧 Pre-release (0.9.x)
- 🎯 Próximo objetivo: v1.0.0

---

# Características

- Conversión de conversaciones exportadas desde ChatGPT a Markdown.
- Pipeline modular y desacoplado.
- Interfaz de línea de comandos (CLI).
- Modo `--inspect`.
- Modo `--no-write`.
- Modo `--compact`.
- Sin dependencias externas.
- Suite de pruebas automatizadas por módulo.
- Documentación técnica completa.

---

# Requisitos

- Node.js 20 o superior.

---

# Instalación

```bash
git clone https://github.com/GuillermoCochrane/chat-exporter.git

cd chat-exporter
```

Actualmente el proyecto no requiere instalar dependencias externas.

---

# Uso

## Exportación básica

```bash
npm start
```

Por defecto el proyecto:

- lee la conversación desde `input/conversation.json`
- genera el archivo `output/conversacion.md`

## Archivo de entrada personalizado

```bash
npm start -- -i input/conversation.json
```

## Archivo de salida personalizado

```bash
npm start -- -i input/conversation.json -o output/prueba.md
```

## Modo compacto

```bash
npm start -- -i input/conversation.json -o output/prueba.md -c
```

## Inspeccionar una conversación

```bash
npm start -- --inspect
```

## Ejecutar el pipeline sin escribir archivos

```bash
npm start -- --no-write
```

---

# Testing

Ejecutar toda la suite:

```bash
npm test
```

Ejecutar una batería específica:

```bash
npm run test:loader
npm run test:writer
npm run test:markdown
...
```

Actualmente existen pruebas automatizadas para:

- Formatter
- Validator
- Parser
- Filter
- Normalizer
- Markdown
- Loader
- Writer

---

# Arquitectura

La aplicación se organiza mediante un pipeline claramente definido:

```
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

Cada módulo posee una única responsabilidad y puede evolucionar de forma independiente.

---

# Estructura del proyecto

```text
src/
├── core/
│   ├── filter.js
│   ├── index.js
│   ├── inspector.js
│   ├── loader.js
│   ├── markdown.js
│   ├── normalizer.js
│   ├── parser.js
│   └── writer.js
│
├── interfaces/
│   └── cli.js
│
├── utilities/
│   ├── formatter.js
│   └── validator.js
│
└── main.js
```

---

# Documentación

La documentación está organizada por responsabilidad.

| Documento | Propósito |
|-----------|-----------|
| [ROADMAP](docs/ROADMAP.md) | Estado actual y planificación del proyecto. |
| [CHANGELOG](docs/CHANGELOG.md) | Historial completo de versiones. |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | Organización interna del sistema. |
| [DECISIONS](docs/DECISIONS.md) | Registro de decisiones de arquitectura (ADR). |
| [LABORATORY](docs/LABORATORY.md) | Hipótesis, experimentos y descubrimientos durante el desarrollo. |
| [MANUAL-TESTING](docs/MANUAL-TESTING.md) | Casos de prueba manuales. |

## Primera vez en el proyecto

Se recomienda recorrer la documentación en el siguiente orden:

1. README
2. ROADMAP
3. ARCHITECTURE
4. DECISIONS
5. LABORATORY

Cada documento responde una pregunta distinta y evita duplicar información.

---

# Próxima versión (1.0.0)

La primera versión estable estará enfocada en:

- consolidar la documentación;
- revisar la experiencia de uso de la CLI;
- realizar la revisión final del proyecto;
- publicar la primera release estable.

---

# Evolución futura

Entre las funcionalidades previstas se encuentran:

- Exportación HTML.
- Exportación PDF.
- Exportación Obsidian.
- Soporte para Gemini.
- Soporte para Claude.
- Soporte para DeepSeek.
- Soporte para Google AI.
- Extensión para Chrome.
- Configuración avanzada de formatos.
- Templates de Markdown.

---

# Filosofía del proyecto

AI Chat Exporter prioriza:

- Arquitectura modular.
- Responsabilidad única por módulo.
- Bajo acoplamiento.
- Evolución incremental.
- Documentación como parte del desarrollo.
- Pruebas automatizadas para preservar el comportamiento.

El objetivo no es únicamente convertir conversaciones entre formatos. La visión del proyecto es construir una base sólida que permita preservar conversaciones de inteligencia artificial en formatos abiertos, facilitando su reutilización e incorporando nuevas plataformas y nuevos formatos sin comprometer el núcleo de la aplicación.

---

# Licencia

MIT License.