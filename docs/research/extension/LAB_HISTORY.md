# AI Chat Exporter — Historial del laboratorio

---

## 1. Propósito

Este documento registra la evolución histórica del laboratorio de AI Chat Exporter.

No pretende explicar cómo funciona el sistema (eso pertenece a la documentación técnica), sino reconstruir el proceso de investigación, las decisiones importantes, los cambios de estrategia y los hitos que llevaron al estado actual del proyecto.

Su objetivo es permitir comprender, meses o años después, por qué el proyecto terminó teniendo la arquitectura actual.

---

## 2. Estado actual

Estado de la etapa de captura.

Estado: Finalizada.

Se encuentra validado que:

- La conversación completa puede capturarse automáticamente.
- El JSON obtenido es equivalente al descargado manualmente desde DevTools.
- El pipeline existente reconstruye correctamente conversaciones utilizando el JSON capturado.
- La arquitectura basada en Inject → Content → Background funciona correctamente bajo Manifest V3.

La siguiente etapa consiste en transformar el capturador experimental en una herramienta de exportación completa.

---

## 3. Línea de tiempo

### Fase 0 — Investigación inicial

- Análisis manual del JSON descargado desde DevTools.
- Comprensión de la estructura `mapping`.
- Validación del pipeline de reconstrucción.

---

### Fase 1 — Captura automática

- Investigación sobre interceptación de tráfico.
- Descarte de `chrome.debugger`.
- Validación de la inyección de scripts.
- Intercepción exitosa de `window.fetch`.

---

### Fase 2 — Exportación

- Comunicación entre Inject, Content y Background.
- Resolución de restricciones de Manifest V3.
- Descarga automática del JSON.

---

### Fase 3 — Validación

- Comparación con el JSON descargado manualmente.
- Prueba del pipeline.
- Confirmación del funcionamiento completo.

Con esta etapa finaliza la investigación y comienza el desarrollo del producto.

## 4. Artefactos

Durante esta etapa se produjeron distintos artefactos de software y documentación.

Entre ellos:

- manifest.json
- inject.js
- content.js
- background.js
- ROADMAP.md
- ARCHITECTURE.md
- CAPTURE_STRATEGY.md
- EXTENSION_LAB.md

Los detalles técnicos de cada uno se documentan en el registro de artefactos correspondiente.

---

## 4. Artefactos

Durante esta etapa se produjeron distintos artefactos de software y documentación.

Entre ellos:

- manifest.json
- inject.js
- content.js
- background.js
- ROADMAP.md
- ARCHITECTURE.md
- CAPTURE_STRATEGY.md
- EXTENSION_LAB.md

Los detalles técnicos de cada uno se documentan en el registro de artefactos correspondiente.

---

## 5. Evolución de la arquitectura

Arquitectura inicial:

DevTools
↓
Descarga manual del JSON
↓
Pipeline

---

Primer intento:

Content Script
↓
Interceptar Fetch

(Descartado por el contexto aislado.)

---

Segunda arquitectura:

Inject Script
↓
Captura del JSON

Content Script
↓
Puente

Background
↓
Descarga

---

Arquitectura final:

Inject Script
↓
Captura

Content Script
↓
Comunicación

Background
↓
Exportación

Pipeline
↓
Reconstrucción

---

## 6. Problemas importantes encontrados

Durante la investigación aparecieron varios problemas que obligaron a modificar la arquitectura.

Los más importantes fueron:

- múltiples respuestas bajo `/backend-api/conversation/`;
- imposibilidad de utilizar `URL.createObjectURL()` dentro del Service Worker;
- ausencia de `chrome.downloads` dentro del Content Script;
- necesidad de respetar los distintos contextos de Manifest V3.

Cada uno de estos problemas produjo cambios concretos en el diseño de la extensión.

---

## 7. Descubrimientos importantes

Entre los descubrimientos más relevantes se encuentran:

- ChatGPT realiza varias solicitudes bajo la misma ruta de conversación.
- La presencia del campo `mapping` es el criterio correcto para identificar la conversación completa.
- El contexto aislado del Content Script no modifica el `window.fetch` de la página.
- La inyección directa mediante `<script>` permite trabajar sobre el contexto real de ChatGPT.
- El JSON capturado automáticamente resulta compatible con el pipeline existente sin modificaciones.

---

## 8. Cambios de estrategia

La investigación produjo varios cambios importantes respecto del plan original.

Entre ellos:

- abandonar la idea de utilizar `chrome.debugger`;
- validar primero el JSON antes que construir toda la arquitectura;
- mover la descarga desde Content hacia Background;
- reemplazar Blob + createObjectURL por Data URLs;
- filtrar por estructura del JSON y no únicamente por la URL interceptada.

Estos cambios permitieron simplificar el proyecto y reducir significativamente la complejidad.

---

## 9. Hitos alcanzados

✔ Comprensión completa del formato de conversación.

✔ Primer JSON reconstruido manualmente.

✔ Primer fetch interceptado.

✔ Primer JSON capturado automáticamente.

✔ Primer filtro por `mapping`.

✔ Primera comunicación completa entre Inject, Content y Background.

✔ Primera descarga automática.

✔ Primer JSON procesado correctamente por el pipeline.

✔ Cierre de la etapa de investigación.

---

## 10. Lecciones aprendidas

La etapa de investigación dejó varias conclusiones prácticas.

- Validar primero los datos antes que la arquitectura.
- Reducir la cantidad de variables acelera enormemente la depuración.
- Manifest V3 obliga a respetar estrictamente los distintos contextos de ejecución.
- La estructura del JSON suele ser un criterio más confiable que la URL utilizada para identificar respuestas.
- Mantener responsabilidades desacopladas facilita modificar la arquitectura sin romper el resto del sistema.

---

## 11. Estado al cierre de la etapa

La investigación queda considerada finalizada.

Queda demostrado que la captura automática de conversaciones de ChatGPT es técnicamente viable y suficientemente estable para servir como base del proyecto.

A partir de este punto, AI Chat Exporter deja de ser un laboratorio de captura y pasa a enfocarse en funcionalidades de producto, tales como:

- exportación a Markdown;
- exportación a HTML;
- exportación a PDF;
- exportación del JSON original;
- incorporación de una interfaz de usuario;
- mejoras de experiencia y automatización.

---
