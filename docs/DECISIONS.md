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

**Título**

Separar la validación de la interpretación de argumentos.

**Motivación**

Interpretar argumentos y validar su consistencia son responsabilidades distintas y evolucionan de forma independiente.

**Consecuencia**

La validación se delega al módulo `validator`, permitiendo incorporar reglas reutilizables sin modificar la implementación de `cli`.


---

## ADR-0013

#### Fecha

2026-07-17

#### Título

Validar parámetros antes de ejecutar acciones.

#### Motivación

Las opciones que consumen argumentos no deben interpretar otra opción como si fuera un valor válido.

#### Consecuencia

El validador verifica la estructura completa de los argumentos antes de que la CLI construya la configuración de ejecución.

#### Estado

Aceptada.

---


## ADR-0014

#### Fecha

2026-07-17

####  Título

Agrupar opciones equivalentes mediante un identificador común.

#### Motivación

Las opciones cortas y largas representan la misma acción y deben validarse como una única entidad lógica.

#### Consecuencia

Cada acción declara un `group`, permitiendo que las reglas de validación trabajen sobre conceptos (`input`, `output`, etc.) en lugar de nombres concretos (`-i`, `--input`).

#### Estado

Aceptada.

---

## ADR-0015

#### Fecha

2026-07-17

#### Título

Validar recursos del sistema de archivos antes de ejecutar el pipeline.

#### Motivación

Los errores producidos por archivos o directorios inexistentes deben detectarse antes de iniciar la ejecución del pipeline.

#### Consecuencia

El módulo `validator` incorpora validaciones sobre el sistema de archivos, evitando delegar esos errores al `loader` o al `writer`.

#### Estado

Aceptada.

---

## ADR-0015

#### Fecha

2026-07-17

#### Título

Permitir la ejecución parcial del pipeline.

#### Motivación

Durante el desarrollo resulta útil inspeccionar el estado de una conversación sin ejecutar las etapas posteriores del pipeline.

#### Consecuencia

La CLI incorpora el modo `--inspect`, permitiendo finalizar la ejecución luego del Inspector sin generar el documento Markdown.

#### Estado

Aceptada.

---

## ADR-0016

#### Fecha

2026-07-17

#### Título

Desacoplar las pruebas manuales de su ejecutor.

#### Motivación

Las baterías de pruebas evolucionan de forma independiente del mecanismo que las ejecuta.

#### Consecuencia

Los casos de prueba se almacenan en archivos independientes consumidos por un runner genérico reutilizable.

#### Estado

Aceptada.

---

## ADR-0017

#### Fecha

2026-07-17

#### Título

Permitir ejecutar el pipeline sin escribir archivos.

#### Motivación

Durante el desarrollo resulta útil validar el funcionamiento completo del pipeline sin generar archivos en disco.

#### Consecuencia

La CLI incorpora el modo `--no-write`, permitiendo ejecutar todas las etapas del pipeline excepto la escritura del archivo final.

#### Estado

Aceptada.

---

## ADR-0018

#### Fecha

2026-07-18

#### Título

Incorporar testing automatizado de forma incremental.

#### Motivación

El proyecto alcanzó un nivel de desacoplamiento suficiente para validar cada módulo de manera independiente.

#### Consecuencia

Las pruebas automatizadas se incorporarán módulo por módulo, comenzando por aquellos que sean completamente puros y no dependan del sistema de archivos.

#### Estado

Aceptada.

---
