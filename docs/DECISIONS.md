# Registro de decisiones

---

## ADR-0001

Fecha:
2026-07-14

Título:
Separación por responsabilidades.

Motivación:
Evitar módulos gigantes y facilitar la reutilización.

Consecuencia:
Cada módulo tendrá una única responsabilidad y podrá reutilizarse de forma independiente.

Estado:
Aceptada.

---

## ADR-0002

Fecha:
2026-07-14

Título:
Markdown como formato base.

Motivación:
Es portable, legible y ampliamente soportado.

Consecuencia:
Otros formatos (HTML, PDF, DOCX, etc.) podrán generarse a partir del Markdown sin modificar el parser.

Estado:
Aceptada.

---

## ADR-0003

Fecha:
2026-07-14

Título:
Pipeline lineal.

Arquitectura:

JSON
→ Loader
→ Inspector
→ Parser
→ Filter
→ Normalizer
→ Formatter
→ Markdown Builder
→ Writer

Motivación:
Facilita testing, debugging y desacoplamiento entre etapas.

Consecuencia:
Cada módulo tiene una única responsabilidad y puede probarse de forma independiente.

Estado:
Aceptada.

---

## ADR-0004

Fecha:
2026-07-14

Título:
No asumir alternancia de roles.

Motivación:
Los Canvas y otros artefactos internos generan múltiples mensajes consecutivos del mismo autor.

Consecuencia:
El exportador respetará exclusivamente el orden del árbol de conversación, sin inferir alternancia entre usuario y asistente.

Estado:
Aceptada.

---

## ADR-0005

Fecha:
2026-07-14

Título:
Desacoplar el formateo del pipeline.

Motivación:
La representación de los datos no debe depender del parser ni del generador Markdown.

Consecuencia:
El módulo `formatter` centraliza el formateo de fechas y podrá ampliarse para otros tipos de datos sin modificar el resto del pipeline.

Estado:
Aceptada.