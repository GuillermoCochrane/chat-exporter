# Registro de decisiones

---

## ADR-0001

#### Fecha

2026-07-14

#### Título

Separación por responsabilidades.

#### Motivación

Evitar módulos gigantes y facilitar la reutilización.

#### Consecuencia

Cada módulo tendrá una única responsabilidad y podrá reutilizarse de forma independiente.

#### Estado

Aceptada.

---

## ADR-0002

#### Fecha

2026-07-14

#### Título

Markdown como formato base.

#### Motivación

Es portable, legible y ampliamente soportado.

#### Consecuencia

Otros formatos (HTML, PDF, DOCX, etc.) podrán generarse a partir del Markdown sin modificar el parser.

#### Estado

Aceptada.

---

## ADR-0003

#### Fecha

2026-07-14

#### Título

Pipeline lineal.

#### Arquitectura

```text
JSON
→ Loader
→ Inspector
→ Parser
→ Filter
→ Normalizer
→ Formatter
→ Markdown Builder
→ Writer
```

#### Motivación

Facilita testing, debugging y desacoplamiento entre etapas.

#### Consecuencia

Cada módulo tiene una única responsabilidad y puede probarse de forma independiente.

#### Estado

Aceptada.

---

## ADR-0004

#### Fecha

2026-07-14

#### Título

No asumir alternancia de roles.

#### Motivación

Los Canvas y otros artefactos internos generan múltiples mensajes consecutivos del mismo autor.

#### Consecuencia

El exportador respetará exclusivamente el orden del árbol de conversación, sin inferir alternancia entre usuario y asistente.

#### Estado

Aceptada.

---

## ADR-0005

#### Fecha

2026-07-14

#### Título

Desacoplar el formateo del pipeline.

#### Motivación

La representación de los datos no debe depender del parser ni del generador Markdown.

#### Consecuencia

El módulo `formatter` centraliza el formateo de datos comunes (fechas y bloques de cita) y podrá ampliarse para otros tipos de datos sin modificar el resto del pipeline.

#### Estado

Aceptada.

---

## ADR-0006

#### Fecha

2026-07-15

#### Título

Separar la generación del documento de su escritura.

#### Motivación

Generar el contenido y escribirlo en disco son responsabilidades diferentes.

#### Consecuencia

`markdown.js` produce únicamente texto y `writer.js` se ocupa exclusivamente del sistema de archivos.

#### Estado

Aceptada.

---

## ADR-0007

#### Fecha

2026-07-15

#### Título

Desacoplar la configuración de ejecución.

#### Motivación

El pipeline no debe depender de rutas codificadas dentro de `index.js`.

#### Consecuencia

El módulo `cli` centraliza la lectura de argumentos y permite reutilizar el mismo pipeline con distintas conversaciones y archivos de salida.

#### Estado

Aceptada.

---

## ADR-0008

#### Fecha

2026-07-15

#### Título

Versionado de desarrollo previo a la versión 1.0.

#### Motivación

Durante el desarrollo se realizan iteraciones pequeñas dentro de un mismo módulo que no justifican un nuevo hito funcional.

#### Consecuencia

Hasta la versión 1.0 el proyecto utiliza un cuarto componente de versión para identificar iteraciones pequeñas dentro de un mismo módulo.

A partir de la versión 1.0 se adoptará Semantic Versioning (MAJOR.MINOR.PATCH).

#### Estado

Aceptada.

---

## ADR-0009

#### Fecha

2026-07-15

#### Título

CLI autoexplicativo.

#### Motivación

El usuario debe poder conocer el uso del programa sin consultar documentación externa.

#### Consecuencia

El módulo `cli` incorpora comandos de ayuda (`-h`, `--help`) y consulta de versión (`-v`, `--version`) desacoplados del pipeline.

#### Estado

Aceptada.

---

## ADR-0010

#### Fecha

2026-07-15

#### Título

Centralizar la versión del proyecto.

#### Motivación

Evitar mantener el número de versión duplicado entre el código y la documentación.

#### Consecuencia

La CLI obtiene la versión directamente desde `package.json`, utilizando una única fuente de verdad.

#### Estado

Aceptada.


## ADR-0011

#### Fecha

2026-07-16

#### Título

Preferir opciones nombradas frente a argumentos posicionales.

#### Motivación

Los argumentos posicionales generan dependencia del orden y dificultan la incorporación de nuevas opciones.

#### Consecuencia

La CLI utiliza opciones explícitas (`-i`, `-o`) para construir la configuración de ejecución de forma independiente del orden en que aparecen.

#### Estado

Aceptada.

---

## ADR-0012

#### Fecha

2026-07-16

#### Título

Separar la validación de argumentos de la interpretación de la CLI.

#### Motivación

Interpretar argumentos y validar su validez son responsabilidades diferentes que evolucionan de forma independiente.

#### Consecuencia

La validación se delega al módulo `validator`, permitiendo incorporar nuevas reglas sin modificar la implementación de `cli`.

#### Estado

Aceptada.

---

## ADR-0012

#### Fecha

2026-07-16

#### Título

Separar la validación de la interpretación de argumentos.

#### Motivación

Interpretar opciones y validar su consistencia son responsabilidades distintas.

#### Consecuencia

El módulo `validator` incorpora reglas de validación reutilizables apoyándose en la definición de cada acción de la CLI.

#### Estado

Aceptada.

---