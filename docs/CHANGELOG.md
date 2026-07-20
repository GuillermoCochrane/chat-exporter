# Changelog

Este documento resume la evolución del proyecto versión por versión y registra las principales decisiones de implementación tomadas durante su desarrollo.

---

## v0.5.0 - Inicialización

- Estructura inicial del proyecto.
- Arquitectura definida.
- Pipeline establecido.

---

## v0.5.1 - Loader e Inspector

- Loader implementado.
- Inspector implementado.
- Primeras pruebas con JSON exportado.

---

## v0.5.2 - Parser

- Parser funcional.
- Extracción de mensajes desde `mapping`.
- Validación sobre conversaciones reales.

---

## v0.5.3 - Filter

- Filtro de mensajes visibles.
- Eliminación de mensajes de sistema.
- Eliminación de contextos internos.
- Validación de múltiples mensajes consecutivos del mismo autor.

---

## v0.5.4 - Normalizer

- Normalización de mensajes.
- Modelo interno desacoplado del JSON de ChatGPT.

---

## v0.5.5 - Formatter

- Nuevo módulo `formatter`.
- Formateo desacoplado de fechas.
- Soporte para formatos:
  - `unix`
  - `iso`
  - `human`
  - `locale`
- Nuevo formateador de bloques de cita (`formatQuote`).
- El formatter queda preparado para incorporar nuevos formateadores sin modificar el resto del pipeline.

---

## v0.5.6 - Markdown Builder

- Implementado el generador de Markdown.
- El Markdown consume exclusivamente el modelo normalizado.
- Todo el formateo textual se delega al módulo `formatter`.
- Validación realizada con conversaciones MINI, SMALL y ORIGINAL.

---

## v0.5.7 - Writer

- Implementado `writer.js`.
- Escritura de archivos Markdown en disco.
- Pipeline completo funcional (JSON → Markdown → Archivo).
- Validación realizada con conversaciones MINI, SMALL y ORIGINAL.

---

## v0.5.8 - CLI

- Implementado `cli.js`.
- Soporte para indicar archivo de entrada desde la consola.
- Soporte para indicar archivo de salida desde la consola.
- `index.js` deja de depender de rutas fijas.

---

## v0.5.8.1 - CLI Help

- Soporte para `-h` y `--help`.
- La ayuda muestra ejemplos de uso y opciones disponibles.
- La ayuda no ejecuta el pipeline.

---

## v0.5.8.2 - CLI Version

- Soporte para `-v` y `--version`.
- La versión se obtiene dinámamente desde `package.json`.
- La consulta de versión no ejecuta el pipeline.

---

## v0.5.8.3 - CLI Named Arguments

- Incorporadas las opciones `-i` y `-o`.
- Eliminada la dependencia del orden de los argumentos.
- La configuración de ejecución pasa a construirse mediante acciones independientes sobre un objeto compartido.

---

## v0.5.9.0 - CLI Validator

- Creado el módulo `validator.js`.
- La validación de argumentos se desacopla de `cli.js`.
- Primera regla implementada: detección de opciones desconocidas.
- `index.js` incorpora manejo centralizado de errores mediante `try/catch`, mostrando mensajes amigables al usuario.

---

## v0.5.9.1 - CLI Required Arguments

- Incorporada la validación de opciones que requieren argumentos.
- La validación utiliza la propiedad `consumes` definida en `cliActions`.
- Los mensajes de validación quedaron centralizados mediante `validatorMessages`.

---

## v0.5.9.2 - CLI Argument Validation

- Validación de parámetros reemplazados por otras opciones.
- `-i -o` informa correctamente que `-i` requiere un valor.
- `-o -i` informa correctamente que `-o` requiere un valor.
- Centralización de mensajes de validación mediante `validatorMessages`.

---

## v0.5.9.3 - CLI File Extensions

- Incorporada la validación de extensiones para archivos de entrada y salida.
- Los archivos de entrada deben utilizar `.json`.
- Los archivos de salida deben utilizar `.md`.
- La validación reutiliza una única regla parametrizada.
- Los mensajes continúan centralizados mediante `validatorMessages`.

---

## v0.5.9.4 - CLI Option Groups

- Incorporada la propiedad `group` en `cliActions`.
- Los alias (`-i`/`--input`, `-o`/`--output`) pasan a pertenecer al mismo grupo lógico.
- Se implementó la validación de opciones repetidas utilizando los grupos declarados.
- La validación deja de depender del nombre específico de cada opción.

---

## v0.5.9.5 - CLI Path Validation

- Validación de existencia del archivo de entrada.
- Validación de existencia del directorio de salida.
- Se reutiliza una única función para validar ambos recursos.
- Nuevo mensaje de validación `pathNotFound`.

---

## v0.5.9.6 - CLI Inspect

- Incorporado el modo `--inspect` (`-in`).
- El pipeline puede detenerse luego del Inspector.
- Se muestran estadísticas de la conversación sin generar Markdown.
- Incorporado un runner reutilizable para pruebas manuales.
- Las baterías de pruebas quedan desacopladas del ejecutor mediante archivos independientes.

---

## v0.5.9.7 - CLI No Write

- Incorporado el modo `--no-write` (`-nw`).
- El pipeline ejecuta todas las etapas excepto la escritura del archivo.
- El documento Markdown se genera completamente en memoria.
- El modo resulta útil para validar el pipeline completo sin modificar el sistema de archivos.

---

## v0.5.10.0 - Automated Testing

- Comienza la incorporación de pruebas automatizadas.
- Se implementa la primera batería de tests para `formatter.js`.
- Se incorpora el comando `npm run test:formatter`.
- El proyecto inicia la transición desde pruebas manuales hacia pruebas automatizadas por módulo.

---

## v0.5.10.1 - Validator Testing

- Incorporada la primera batería de pruebas automatizadas para `validator.js`.
- Se validan casos exitosos y errores esperados.
- El módulo supera todas las pruebas sin requerir modificaciones en su implementación.

---

## v0.5.10.2 - Parser Tests

- Incorporadas pruebas automatizadas para `parser.js`.
- Se verifican la estructura de los mensajes extraídos y la preservación de información relevante.
- Se incorporan fixtures específicos para pruebas del parser.

---

## v0.5.10.3 - Filter Tests

- Incorporadas pruebas automatizadas para `filter.js`.
- Se valida la eliminación de mensajes no conversacionales.
- Se verifica que sólo permanezcan mensajes `user` y `assistant` con contenido `text`.

---

## v0.5.10.4- Normalizer Tests

- Incorporadas pruebas automatizadas para `normalizer.js`.
- Se valida la transformación del modelo interno.
- Se verifica la concatenación de partes del mensaje.
- Se valida la preservación de la estructura y del timestamp.

---

---

## v0.5.10.5 - Markdown Tests & Compact Mode

- Incorporadas pruebas automatizadas para `markdown.js`.
- Se agregan fixtures específicos para validar la generación de documentos Markdown.
- Se incorpora una batería independiente para verificar el modo de exportación compacta.
- Nuevo parámetro `--compact` (`-c`) para eliminar líneas en blanco consecutivas dentro de los mensajes exportados.
- Se incorpora el formateador `formatRole()` para centralizar la representación de los roles de la conversación.
- Se actualiza el generador Markdown para consumir la configuración completa de la CLI.
- Nuevo comando `npm run test:all` para ejecutar toda la suite de pruebas automatizadas.

---

## v0.5.10.6 - Loader Tests

- Incorporadas pruebas automatizadas para `loader.js`.
- Se agregan fixtures específicos para validar archivos JSON válidos e inválidos.
- Se verifica la carga correcta de conversaciones (`MINI` y `SMALL`).
- Se valida el manejo de JSON malformado.
- Se valida el comportamiento ante archivos inexistentes.
- Nuevo comando `npm run test:loader` para ejecutar la batería de pruebas del módulo.

---