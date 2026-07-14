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

El parser podrá reutilizarse para distintos exportadores.

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

Estado:

Aceptada.

---

## ADR-0003

Título:

Pipeline lineal.

JSON
→ Parser
→ Markdown
→ Archivo

Motivación:

Facilita testing y debugging.

Estado:

Aceptada.