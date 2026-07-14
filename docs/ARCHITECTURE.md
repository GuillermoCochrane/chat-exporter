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
filter.js
↓
normalizer.js
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

Obtiene estadísticas de la conversación.

No modifica información.

---

### parser.js

Transforma el árbol de conversación (`mapping`) en una lista de mensajes.

No filtra ni modifica contenido.

---

### filter.js

Elimina mensajes que no pertenecen a la conversación visible.

No altera el contenido de los mensajes restantes.

---

### normalizer.js

Transforma los mensajes filtrados al modelo interno del proyecto.

Elimina la dependencia del formato original de ChatGPT.

---

### markdown.js

Convierte la conversación normalizada a Markdown.

No conoce el JSON original.

---

### writer.js

Escribe archivos en disco.

No interpreta contenido.

---

### index.js

Coordina todo el flujo.

No contiene lógica de negocio.