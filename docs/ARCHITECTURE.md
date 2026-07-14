# Arquitectura

## Filosofía

El proyecto sigue los principios:

- KISS
- DRY
- SRP
- Composición sobre complejidad

Cada módulo posee una única responsabilidad.

---

## Estructura

src/

loader.js
↓
inspector.js
↓
parser.js
↓
markdown.js
↓
writer.js
↓
index.js

---

## Responsabilidades

### loader.js

Carga archivos JSON.

No interpreta datos.

---

### inspector.js

Obtiene estadísticas.

No modifica información.

---

### parser.js

Transforma el árbol de conversación en una lista lineal.

Es el núcleo del proyecto.

---

### markdown.js

Convierte la conversación normalizada a Markdown.

No conoce el JSON original.

---

### writer.js

Escribe archivos.

No interpreta contenido.

---

### index.js

Coordina todo el flujo.

No contiene lógica de negocio.