# Laboratory

## Hipótesis

### H-001

#### Objetivo

Verificar si el endpoint de conversación devuelve el árbol completo.

#### Estado

✔ Confirmada.

#### Evidencia

El JSON contiene el campo `mapping`, con todos los nodos de la conversación.

---

### H-002

#### Objetivo

Verificar el comportamiento del endpoint al repetir la petición.

#### Estado

✔ Confirmada.

#### Resultado

La segunda petición devuelve `404`.

#### Conclusión

El endpoint solo está disponible durante la carga inicial de la conversación.

---

### H-003

#### Objetivo

Interceptar `Response.prototype.json`.

#### Estado

✖ Refutada.

#### Resultado

No fue posible capturar el JSON.

#### Conclusión

La respuesta ya había sido consumida por la aplicación antes de instalar el hook.

---

## Experimentos

### E-001

#### Objetivo

Interceptar las llamadas a `fetch`.

#### Resultado

Parcial.

#### Observaciones

- Se logró interceptar la petición.
- La captura ocurrió demasiado tarde para obtener el JSON completo.

---

### E-002

#### Objetivo

Obtener la respuesta completa mediante DevTools.

#### Resultado

✔ Exitoso.

#### Observaciones

- `Copy Response` devuelve el JSON completo.
- El campo `mapping` contiene todo el árbol de la conversación.
- Este método permitió comenzar el desarrollo del parser.

---

### E-003

#### Objetivo

Implementar el parser y validar la extracción de mensajes conversacionales.

#### Resultado

✔ Confirmado.

#### Observaciones

- El parser recorre correctamente el campo `mapping`.
- Se eliminaron correctamente los mensajes de sistema.
- Se eliminaron correctamente los contextos internos (`user_editable_context`, `model_editable_context`).
- El orden original de la conversación se conserva.
- ChatGPT puede emitir múltiples mensajes consecutivos del mismo autor (`assistant → assistant`).
- Los Canvas aparecen como mensajes independientes del asistente.

#### Conclusión

No puede asumirse alternancia entre `user` y `assistant`.

El pipeline deberá respetar exclusivamente el orden del árbol de conversación.

---

### E-004

#### Objetivo

Desacoplar el formateo de fechas del parser y del generador Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- El parser entrega datos puros.
- El formateo queda centralizado.
- El módulo puede reutilizarse por cualquier exportador.

#### Conclusión

El formatter pasa a ser un servicio reutilizable dentro del pipeline.

---

### E-005

#### Objetivo

Desacoplar el formateo de bloques Markdown del generador.

#### Resultado

✔ Confirmado.

#### Observaciones

- El prefijo `>` se aplica correctamente a todas las líneas del mensaje.
- El generador Markdown delega completamente el formateo al formatter.
- Se mantiene una única responsabilidad por módulo.

#### Conclusión

El formatter pasa a centralizar toda la representación textual reutilizable del pipeline.

---

### E-006

#### Objetivo

Implementar el módulo Writer y validar la escritura del documento Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- El archivo se genera correctamente en disco.
- El contenido coincide con la salida generada por el Markdown Builder.
- Se validó con los archivos MINI, SMALL y ORIGINAL.

#### Conclusión

El pipeline completo puede exportar conversaciones a un archivo Markdown.

---

### E-007

#### Objetivo

Incorporar una interfaz de línea de comandos para parametrizar la ejecución del exportador.

#### Resultado

✔ Confirmado.

#### Observaciones

- El archivo de entrada puede indicarse desde la línea de comandos.
- El archivo de salida también puede personalizarse.
- El pipeline permanece desacoplado de la configuración de ejecución.

#### Conclusión

El módulo `cli` desacopla la configuración de ejecución del resto del pipeline.

---

### E-008

#### Objetivo

Implementar ayuda integrada para la interfaz de línea de comandos.

#### Resultado

✔ Confirmado.

#### Observaciones

* Se incorporó soporte para `-h` y `--help`.
* La ayuda no ejecuta el pipeline.
* Se muestra el uso esperado y ejemplos de ejecución.

#### Conclusión

La interfaz de línea de comandos resulta autoexplicativa sin afectar la lógica del exportador.

---

### E-009

#### Objetivo

Incorporar consulta de versión integrada para la interfaz de línea de comandos.

#### Resultado

✔ Confirmado.

#### Observaciones

* Se incorporó soporte para `-v` y `--version`.
* La versión se obtiene directamente desde `package.json`.
* La consulta no ejecuta el pipeline.

#### Conclusión

La CLI permite consultar la versión instalada sin depender de documentación externa.

---


## E-010

#### Objetivo

Eliminar la dependencia del orden posicional de los argumentos de la CLI.

#### Resultado

✔ Confirmado.

#### Observaciones

* Se incorporaron las opciones `-i` y `-o`.
* El orden de los argumentos deja de ser significativo.
* La configuración se construye mediante acciones independientes sobre un mismo objeto.

#### Conclusión

La CLI pasa a comportarse como una interfaz declarativa basada en opciones, facilitando futuras ampliaciones.

---

### E-011

#### Objetivo

Separar la validación de argumentos de la lógica de la CLI.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se creó el módulo `validator`.
- La validación ocurre antes de interpretar los argumentos.
- La CLI deja de ser responsable de validar opciones desconocidas.

#### Conclusión

La validación de argumentos pasa a constituir una responsabilidad independiente, permitiendo ampliar las reglas sin modificar el módulo `cli`.

---

## E-011

#### Objetivo

Validar que las opciones que consumen argumentos reciban un valor.

#### Resultado

✔ Confirmado.

#### Observaciones

- La validación utiliza la propiedad `consumes` definida en cada acción de la CLI.
- La regla funciona para cualquier opción registrada que requiera argumentos.
- Los mensajes de error quedaron centralizados mediante `validatorMessages`.

#### Conclusión

La validación deja de depender de opciones específicas y pasa a utilizar la definición declarativa de cada acción.


---


## Descubrimientos

- La conversación completa viaja durante la carga inicial.
- El JSON contiene el árbol completo en `mapping`.
- El parser puede trabajar únicamente sobre `mapping`.
- La alternancia de roles no está garantizada.
- Los Canvas forman parte del árbol de conversación como mensajes propios.
- El formateo puede desacoplarse completamente de la lógica de negocio.
- El formateo de bloques Markdown puede desacoplarse completamente del generador.
- El pipeline completo funciona desde la carga del JSON hasta la escritura del archivo Markdown.
- La versión del proyecto puede obtenerse desde una única fuente de verdad (`package.json`), evitando duplicación de información.
- Las opciones nombradas (`-i`, `-o`) eliminan la dependencia del orden de los argumentos y facilitan la escalabilidad de la CLI.
- La validación de argumentos puede evolucionar como un módulo independiente del parser de la CLI.
- La propiedad `consumes` puede utilizarse como única fuente de verdad para validar opciones que requieren argumentos.
