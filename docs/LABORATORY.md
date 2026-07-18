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

## E-012

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

## E-013

#### Objetivo

Validar que el parámetro requerido por una opción no pueda ser reemplazado por otra opción.

#### Resultado

✔ Confirmado.

#### Observaciones

* Las opciones que consumen parámetros (`-i`, `-o`) verifican que el argumento siguiente no sea otra opción.
* La validación reutiliza el registro de acciones (`cliActions`) para conocer cuántos parámetros consume cada opción.
* Los mensajes de error quedan centralizados mediante `validatorMessages`.

#### Conclusión

La CLI detecta parámetros ausentes incluso cuando el siguiente argumento corresponde a otra opción válida.

---

### E-014

#### Objetivo

Validar que los archivos indicados por la CLI posean la extensión esperada antes de ejecutar el pipeline.

#### Resultado

✔ Confirmado.

#### Observaciones

- La validación diferencia archivos de entrada (`.json`) y salida (`.md`).
- Los mensajes de error quedan centralizados mediante `validatorMessages`.
- La regla puede reutilizarse para futuras opciones que acepten archivos.

#### Conclusión

El módulo `validator` pasa a verificar no sólo la estructura de los argumentos, sino también restricciones sobre su formato, manteniendo desacoplada la lógica de la CLI.

---

## E-015

#### Objetivo

Validar que una misma opción lógica no pueda declararse más de una vez.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó la propiedad `group` en `cliActions`.
- La validación utiliza `group` en lugar del nombre de la opción.
- Los alias (`-i` / `--input`) pasan a considerarse equivalentes.

#### Conclusión

La validación deja de depender del nombre de la opción y pasa a operar sobre el modelo declarativo de la CLI.

---

### E-015

#### Objetivo

Validar la existencia de archivos y directorios antes de ejecutar el pipeline.

#### Resultado

✔ Confirmado.

#### Observaciones

- El archivo de entrada debe existir antes de iniciar la carga.
- El directorio de salida debe existir antes de escribir el documento.
- La validación reutiliza una única función para comprobar ambos recursos.

#### Conclusión

El módulo `validator` incorpora validaciones sobre el sistema de archivos sin afectar el resto del pipeline.

---

## E-015

#### Objetivo

Permitir inspeccionar conversaciones sin ejecutar el pipeline completo.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó la opción `--inspect` (`-in`).
- El pipeline puede finalizar luego del Inspector.
- No se genera ningún archivo de salida.

#### Conclusión

El Inspector pasa a ser una etapa reutilizable e independiente del proceso de exportación.

---

## E-016

#### Objetivo

Ejecutar el pipeline completo sin escribir archivos.

#### Resultado

✔ Confirmado.

#### Observaciones

- El Markdown se genera completamente.
- El Writer no se ejecuta.
- La validación permite comprobar el pipeline completo sin modificar el sistema de archivos.

#### Conclusión

El Writer deja de ser obligatorio para validar el procesamiento de una conversación.

---

## E-017

#### Objetivo

Incorporar la primera infraestructura de testing automatizado del proyecto.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se implementó la primera prueba automatizada sobre el módulo `formatter`.
- Se creó un comando dedicado para ejecutar la batería de pruebas.
- El módulo fue elegido por ser completamente puro y no depender del sistema de archivos.

#### Conclusión

El proyecto incorpora una infraestructura de testing automatizado que servirá como base para validar el resto de los módulos.

---

## E-018

#### Objetivo

Validar automáticamente las reglas implementadas por el módulo `validator`.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó la primera batería de pruebas automatizadas para `validator`.
- Se validan tanto casos exitosos como errores esperados.
- El módulo no requirió modificaciones para ser testeado.

#### Conclusión

La arquitectura desacoplada permitió incorporar pruebas automatizadas sin modificar la implementación existente.

---

## E-019

#### Objetivo

Validar automáticamente la estructura generada por el parser.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporaron fixtures específicos para pruebas automatizadas.
- Las pruebas verifican tanto la cantidad de mensajes como la integridad de su estructura.
- El parser mantiene la información necesaria para las etapas posteriores del pipeline.

#### Conclusión

El comportamiento del parser queda protegido mediante pruebas automatizadas independientes.

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
- Un parámetro obligatorio no puede ser reemplazado por otra opción de la CLI.
- La validación de extensiones puede reutilizar una única regla parametrizada para distintos tipos de archivo.
- Las opciones equivalentes pueden agruparse mediante una propiedad declarativa (group), permitiendo validar alias sin depender de sus nombres.
- La existencia de archivos y directorios puede validarse mediante una única función reutilizable.
- El pipeline puede finalizar anticipadamente en distintas etapas sin afectar el desacoplamiento entre módulos.
- Las pruebas manuales también pueden organizarse mediante un patrón datos + ejecutor, reutilizando un único runner para distintas baterías de pruebas.
- La ejecución del pipeline puede finalizar en distintas etapas sin romper el desacoplamiento entre módulos.
- La generación del documento y su persistencia pueden validarse de forma independiente.
- Los módulos completamente puros constituyen el punto de entrada ideal para incorporar testing automatizado.
- La generación del documento y su persistencia pueden validarse de forma independiente.
- Los módulos diseñados como funciones puras permiten incorporar pruebas automatizadas sin requerir modificaciones en su implementación.