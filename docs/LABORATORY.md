# Laboratory

## Índice

- [Hipótesis](#hipótesis)
- [Experimentos](#experimentos)
  - [v0.5.x — Core inicial](#v05x--core-inicial)
  - [v0.9.x — Pre-release y arquitectura](#v09x--pre-release-y-arquitectura)
  - [v1.1.x — Integración de la extensión](#v11x--integración-de-la-extensión)
  - [v1.2.1 — Popup y selector de formato](#v121--popup-y-selector-de-formato)
  - [v1.2.2 — Filtro por rol y modo compacto (CLI)](#v122--filtro-por-rol-y-modo-compacto-cli)
  - [v1.2.3 — Opciones avanzadas en la extensión](#v123--opciones-avanzadas-en-la-extensión)
  - [v1.2.4 — Rediseño visual y UX del popup](#v124--rediseño-visual-y-ux-del-popup)
- [Descubrimientos](#descubrimientos)
  - [Desarrollo](#desarrollo)
  - [Pre Release](#pre-release)

---

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

### v0.5.x — Core inicial

### E-001

#### Objetivo

Interceptar las llamadas a `fetch`.

#### Resultado

Parcial.

#### Observaciones

- Se logró interceptar la petición.
- La captura ocurrió demasiado tarde para obtener el JSON completo.

#### Conclusión

Interceptar `fetch` después de que la aplicación consume la respuesta no garantiza acceder al contenido completo del JSON.

---

### E-002

#### Objetivo

Obtener la respuesta completa mediante DevTools.

#### Resultado

✔ Confirmado.

#### Observaciones

- `Copy Response` devuelve el JSON completo.
- El campo `mapping` contiene todo el árbol de la conversación.
- Este método permitió comenzar el desarrollo del parser.

#### Conclusión

El JSON exportado por DevTools constituye una fuente confiable para reconstruir la conversación.

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
- Se conserva el orden original de la conversación.
- ChatGPT puede emitir múltiples mensajes consecutivos del mismo autor (`assistant → assistant`).
- Los Canvas aparecen como mensajes independientes del asistente.

#### Conclusión

No puede asumirse alternancia entre `user` y `assistant`.

El pipeline debe respetar exclusivamente el orden del árbol de conversación.

---

### E-004

#### Objetivo

Desacoplar el formateo de fechas del parser y del generador Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- El parser entrega datos puros.
- El formateo queda centralizado.
- El módulo puede reutilizarse desde cualquier exportador.

#### Conclusión

El módulo `formatter` pasa a ser un servicio reutilizable dentro del pipeline.

---

### E-005

#### Objetivo

Desacoplar el formateo textual del generador Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- El formateo de bloques Markdown se delega completamente al módulo `formatter`.
- Posteriormente también se incorporó el formateo de roles (`user` → Usuario, `assistant` → Asistente).
- Se mantiene una única responsabilidad por módulo.

#### Conclusión

`formatter` centraliza toda la representación textual reutilizable del pipeline.

---

### E-006

#### Objetivo

Implementar el módulo Writer y validar la escritura del documento Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- El archivo se genera correctamente en disco.
- El contenido coincide con la salida producida por `markdown.js`.
- Se validó utilizando los archivos MINI, SMALL y ORIGINAL.

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

- Se incorporó soporte para `-h` y `--help`.
- La ayuda no ejecuta el pipeline.
- Se muestran el uso esperado y ejemplos de ejecución.

#### Conclusión

La interfaz de línea de comandos resulta autoexplicativa sin afectar la lógica del exportador.

---

### E-009

#### Objetivo

Incorporar consulta de versión integrada para la interfaz de línea de comandos.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó soporte para `-v` y `--version`.
- La versión se obtiene directamente desde `package.json`.
- La consulta no ejecuta el pipeline.

#### Conclusión

La CLI permite consultar la versión instalada utilizando una única fuente de verdad.

---

### E-010

#### Objetivo

Eliminar la dependencia del orden posicional de los argumentos de la CLI.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporaron las opciones `-i` y `-o`.
- El orden de los argumentos deja de ser significativo.
- La configuración se construye mediante acciones independientes sobre un mismo objeto.

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

### E-012

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

### E-013

#### Objetivo

Validar que el parámetro requerido por una opción no pueda ser reemplazado por otra opción.

#### Resultado

✔ Confirmado.

#### Observaciones

- Las opciones que consumen parámetros (`-i`, `-o`) verifican que el argumento siguiente no sea otra opción.
- La validación reutiliza el registro `cliActions` para conocer cuántos parámetros consume cada opción.
- Los mensajes de error quedan centralizados mediante `validatorMessages`.

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

El módulo `validator` pasa a verificar no solo la estructura de los argumentos, sino también restricciones sobre su formato, manteniendo desacoplada la lógica de la CLI.

---

### E-015

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

### E-016

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

### E-017

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

### E-018

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

### E-019

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

### E-020

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

### E-021

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

### E-022

#### Objetivo

Validar automáticamente la normalización del modelo interno utilizado por el pipeline.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó una batería de pruebas automatizadas para `normalizer`.
- Se verifica la concatenación del contenido textual.
- Se valida la conservación de la estructura básica del mensaje.
- Se contemplan mensajes sin contenido textual.

#### Conclusión

La transformación hacia el modelo interno queda protegida mediante pruebas automatizadas independientes.

---

### E-023

#### Objetivo

Validar automáticamente la generación de documentos Markdown.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporaron casos de prueba para el generador Markdown.
- Se validó el encabezado de cada mensaje.
- Se verificó la delegación del formateo de fechas, roles y bloques de cita al módulo `formatter`.
- Se incorporó una batería independiente para validar el modo compacto.

#### Conclusión

El comportamiento del generador Markdown queda protegido mediante pruebas automatizadas para ambos modos de exportación.

---

### E-024

#### Objetivo

Validar automáticamente la carga de conversaciones desde archivos JSON.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó una batería de pruebas automatizadas para `loader`.
- Se validó la carga correcta de conversaciones reales (`MINI` y `SMALL`).
- Se incorporó un fixture con JSON inválido para verificar el comportamiento ante errores de parseo.
- Se verificó el manejo de archivos inexistentes.

#### Conclusión

El módulo `loader` queda protegido mediante pruebas automatizadas que validan tanto el funcionamiento esperado como las condiciones de error más frecuentes.

---

### E-025

#### Objetivo

Validar automáticamente la escritura de documentos Markdown en el sistema de archivos.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó una batería de pruebas automatizadas para `writer`.
- Se verifica la creación correcta del archivo de salida.
- Se comprueba que el contenido escrito coincide exactamente con el esperado.
- El archivo generado durante la prueba se elimina al finalizar la ejecución.
- Se utiliza un directorio temporal ignorado por Git para evitar contaminar el repositorio.

#### Conclusión

El módulo `writer` queda protegido mediante pruebas automatizadas que validan la persistencia del documento sin dejar artefactos permanentes en el proyecto.

---

### v0.9.x — Pre-release y arquitectura

### E-026

#### Objetivo

Reorganizar la arquitectura del proyecto para separar el núcleo del exportador de sus interfaces.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se reorganizó `src` en `core`, `interfaces` y `utilities`.
- El pipeline quedó completamente desacoplado de la CLI.
- Los tests pudieron adaptarse actualizando únicamente los imports.

#### Conclusión

Una separación temprana de responsabilidades facilita la incorporación futura de nuevas interfaces sin modificar el núcleo del exportador.

---

### E-027

#### Objetivo

Evaluar si la documentación debía escribirse durante el desarrollo o al finalizar el núcleo del proyecto.

#### Resultado

✔ Confirmado.

#### Observaciones

- El README se redactó una vez estabilizada la arquitectura.
- La documentación pudo reflejar el estado real del proyecto.
- Se evitó reescribir documentación en cada iteración funcional.

#### Conclusión

La documentación de alto nivel resulta más consistente cuando se redacta sobre una arquitectura estable.

---

### E-028

#### Objetivo

Preparar el proyecto para ser utilizado inmediatamente después de clonar el repositorio.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se incorporó `input/conversation.json`.
- `npm start` funciona sin parámetros.
- Se ajustó `.gitignore` para versionar únicamente ese archivo dentro del directorio `input`.

#### Conclusión

Reducir la configuración inicial mejora significativamente la experiencia del primer uso.

---

### E-029

#### Objetivo

Completar la metadata necesaria para distribuir el proyecto públicamente.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se revisó `package.json`.
- Se completaron `author`, `license`, `engines`, `keywords` y `description`.
- Se verificó la consistencia de los scripts disponibles.

#### Conclusión

La preparación para distribución requiere tanto código estable como metadata consistente.

---

### E-030

#### Objetivo

Validar el proyecto desde un repositorio recién clonado.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se creó un clon limpio del repositorio.
- Se ejecutó `npm start`.
- Se ejecutó la suite completa de pruebas.
- Se verificó la ausencia de rutas absolutas.
- Se detectó un test que dependía de un archivo fuera del repositorio.

#### Conclusión

Las pruebas de distribución permiten detectar dependencias implícitas que permanecen invisibles durante el desarrollo cotidiano.

---

### E-031

#### Objetivo

Eliminar dependencias de archivos externos en la suite de pruebas.

#### Resultado

✔ Confirmado.

#### Observaciones

- Los tests pasaron a utilizar únicamente `test/fixtures`.
- Se eliminaron referencias a archivos externos al repositorio.
- La batería quedó completamente reproducible desde un clon limpio.

#### Conclusión

Toda prueba automatizada debe depender exclusivamente de recursos versionados junto al proyecto.

---

### E-032

#### Objetivo

Desacoplar la obtención de conversaciones del resto del pipeline.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se introdujo la abstracción `Conversation Source`.
- El Loader dejó de ser el responsable de acceder directamente al sistema de archivos.
- El Core ahora consume conversaciones mediante una fuente declarativa.
- La primera implementación corresponde a `jsonFile`.

#### Conclusión

El origen de una conversación deja de formar parte del Core y pasa a ser intercambiable, permitiendo reutilizar el mismo pipeline desde distintas interfaces.

---

### E-033

#### Objetivo

Centralizar la configuración del pipeline para reutilizarla desde distintas interfaces.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se creó `pipelineConfig` como fuente de verdad.
- Se incorporaron `pipelineProfiles`.
- La CLI pasó a utilizar el perfil `cli`.
- Las futuras interfaces podrán reutilizar el mismo perfil o definir variantes propias.

#### Conclusión

La configuración deja de pertenecer a la CLI y pasa a formar parte de la infraestructura del pipeline.

---

### E-034

#### Objetivo

Separar la orquestación del procesamiento del pipeline para desacoplar completamente el Core de las interfaces.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se dividió el antiguo `index.js` en dos responsabilidades independientes.
- `runPipeline()` pasó a recibir una conversación ya obtenida y una configuración, limitándose al procesamiento del Core.
- `runExporter()` pasó a encargarse de resolver la Conversation Source, ejecutar el pipeline, renderizar el resultado y delegar la escritura.
- `main.js` quedó reducido al punto de entrada de la aplicación.
- El procesamiento interno puede reutilizarse desde cualquier interfaz sin conocer el origen de la conversación ni el destino del resultado.

#### Conclusión

Separar la orquestación del procesamiento reduce el acoplamiento del sistema y convierte al pipeline en un componente reutilizable e independiente de cualquier interfaz.

---

### v1.1.x — Integración de la extensión

### E-035

#### Objetivo

Desacoplar completamente el mecanismo de salida del orquestador para permitir que el Core funcione en entornos sin Node.js.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se eliminó la importación de `writer.js` desde `exporter.js`.
- El orquestador ahora recibe una función `config.outputHandler` inyectada por la interfaz.
- La CLI define su propio handler usando `writeFileContent`.
- La extensión podrá definir el suyo usando `chrome.downloads`.
- El Core dejó de depender de `fs` y puede ejecutarse en cualquier entorno.

#### Conclusión

Inyectar el mecanismo de salida elimina la última dependencia del Core con Node.js y permite reutilizar el pipeline desde la extensión sin modificaciones.

---

### E-036

#### Objetivo

Unificar el contrato de las Conversation Sources para que el orquestador no necesite conocer los detalles de cada fuente.

#### Resultado

✔ Confirmado.

#### Observaciones

- Todas las fuentes pasaron a recibir el objeto `config` completo.
- `jsonFile` extrae `config.input`, `extensionSource` extrae `config.conversation`.
- El orquestador invoca a todas las fuentes de manera uniforme: `source(config)`.
- Se creó `ExtensionSource` para conversaciones capturadas por la extensión.

#### Conclusión

Unificar el contrato permite agregar nuevas fuentes sin modificar el orquestador. Cada fuente extrae del `config` lo que necesita.

---

### E-037

#### Objetivo

Desacoplar completamente el mecanismo de salida del orquestador para permitir que el Core funcione en entornos sin Node.js.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se eliminó la importación de `writer.js` desde `exporter.js`.
- El orquestador ahora recibe una función `config.outputHandler` inyectada por la interfaz.
- La CLI define su propio handler usando `writeFileContent`.
- La extensión define el suyo usando `chrome.downloads`.
- El Core dejó de depender de `fs` y puede ejecutarse en cualquier entorno.

#### Conclusión

Inyectar el mecanismo de salida elimina la última dependencia del Core con Node.js y permite reutilizar el pipeline desde la extensión sin modificaciones.

---

### E-038

#### Objetivo

Unificar el contrato de las Conversation Sources para que el orquestador no necesite conocer los detalles de cada fuente.

#### Resultado

✔ Confirmado.

#### Observaciones

- Todas las fuentes pasaron a recibir el objeto `config` completo.
- `jsonFile` extrae `config.input`, `extensionSource` extrae `config.conversation`.
- El orquestador invoca a todas las fuentes de manera uniforme: `source(config)`.
- Se creó `ExtensionSource` para conversaciones capturadas por la extensión.

#### Conclusión

Unificar el contrato permite agregar nuevas fuentes sin modificar el orquestador. Cada fuente extrae del `config` lo que necesita.

---

### E-039

#### Objetivo

Empaquetar el Core para que pueda ejecutarse dentro del service worker de una extensión Manifest V3.

#### Resultado

✔ Confirmado.

#### Observaciones

- El Core utiliza módulos ES, incompatibles con service workers.
- Se implementó `extensionCore.js` como punto de entrada que expone `runExporter` en `globalThis`.
- Se utilizó esbuild para generar un bundle único en formato IIFE.
- Se creó un plugin que reemplaza `jsonFile.js` por `jsonFile.stub.js` para evitar dependencias de Node.js.
- `background.js` carga el bundle mediante `importScripts`.
- El build se automatizó con el script `assets/scripts/buildExtension.js` y el comando `npm run build:extension`.

#### Conclusión

El bundling con esbuild permite reutilizar el Core completo en la extensión sin modificar su arquitectura interna. El stub de `jsonFile.js` aísla las dependencias de Node sin romper el registro de fuentes.

---

### E-040

#### Objetivo

Integrar la extensión de Chrome con el pipeline de exportación para descargar Markdown directamente desde ChatGPT.

#### Resultado

✔ Confirmado.

#### Observaciones

- `background.js` construye un `config` con `source: "extension"` y un `outputHandler` basado en `chrome.downloads`.
- La extensión invoca `runExporter`, que utiliza `ExtensionSource` para obtener la conversación capturada.
- El pipeline procesa la conversación completa (parser → filter → normalizer → markdown).
- El Markdown generado se descarga automáticamente como `conversacion.md`.
- Se verificó que CLI y Extension reutilizan exactamente el mismo pipeline.

#### Conclusión

La extensión pasó de descargar JSON crudo a exportar Markdown procesado, reutilizando el 100% del Core sin modificaciones. La arquitectura desacoplada demostró ser correcta.

---

### v1.2.1 — Popup y selector de formato

### E-041

#### Objetivo

Agregar un popup a la extensión con selector de formato de exportación (Markdown / JSON).

#### Resultado

✔ Confirmado.

#### Observaciones

- Se crearon `popup.html` y `popup.js` como interfaz de usuario de la extensión.
- El popup envía un mensaje `EXPORT` al background con el formato elegido.
- Se implementó un sistema de handlers declarativos en `background.js` para despachar la exportación según el formato (`json`, `md`).
- Se eliminó el listener `chrome.action.onClicked`, reemplazado por `default_popup` en el manifest.
- Se actualizó el script de build para copiar los archivos del popup a `dist/`.

#### Conclusión

El popup permite al usuario elegir el formato de salida antes de exportar, mejorando la usabilidad de la extensión. La arquitectura declarativa de handlers facilita la incorporación de nuevos formatos en el futuro.

---

### E-042

#### Objetivo

Simplificar el flujo de comunicación entre `inject.js`, `content.js` y `background.js` eliminando la dependencia de una solicitud explícita de captura.

#### Resultado

✔ Confirmado.

#### Observaciones

- Anteriormente, `content.js` solo enviaba la conversación al background cuando recibía un mensaje `DOWNLOAD_CONVERSATION` (disparado por `chrome.action.onClicked`).
- Al migrar a popup, ese mensaje dejó de enviarse, rompiendo la comunicación.
- Se modificó `inject.js` para que, al capturar una conversación, envíe inmediatamente un `postMessage` con tipo `CONVERSATION` hacia `content.js`.
- `content.js` se simplificó a un único listener pasivo que reenvía cualquier `CONVERSATION` al background como `DOWNLOAD_JSON`.
- El flujo ahora es automático: `inject` captura → `content` retransmite → `background` almacena.

#### Conclusión

La comunicación automática elimina la necesidad de coordinación manual entre los componentes y asegura que la conversación esté siempre disponible cuando el usuario abre el popup. Cada módulo conserva una única responsabilidad bien definida.

---

### v1.2.2 — Filtro por rol y modo compacto (CLI)

### E-043

#### Objetivo

Mejorar el modo compacto para preservar la estructura Markdown (reglas horizontales, listas, bloques de código) mientras se reduce el espaciado vertical excesivo.

#### Resultado

✔ Confirmado.

#### Observaciones

- La implementación inicial con `text.replace(/\n{2,}/g, "\n")` rompía reglas horizontales (`---`) y listas, ya que Markdown requiere una línea en blanco antes de estos elementos.
- Se probó una regex con mirada negativa (`(?!\n*---)`) que protegía las reglas horizontales pero no las listas.
- Se descubrió que las listas también requieren una línea en blanco previa para que el parser de Markdown las interprete correctamente.
- Se intentó extender la mirada negativa para cubrir listas (`(?!\n*(- |\d+\. |---))`), pero no cubría el caso de la transición lista→párrafo.
- La solución final utiliza un sistema de placeholders:
  1. Se protege la separación lista→párrafo reemplazando `\n\n` por `__LIST_BREAK__`.
  2. Se aplica la regex con mirada negativa para todo lo demás.
  3. Se restaura el placeholder a `\n\n`.
- Se creó un JSON de pruebas de estrés con casos borde (reglas, listas, bloques de código, espaciado excesivo, saltos de línea simples) para validar la solución.

#### Conclusión

El modo compacto ahora reduce significativamente el espaciado vertical sin romper la estructura Markdown. La técnica de placeholders resultó más efectiva y mantenible que una regex única compleja.

---

### E-044

#### Objetivo

Agregar filtro por rol (`user`, `assistant`, `all`) al pipeline y a la CLI.

#### Resultado

✔ Confirmado.

#### Observaciones

- Inicialmente se consideró crear un nuevo módulo `filterByRole.js`, pero se optó por extender `filter.js` con un parámetro opcional `targetRole`.
- `filterConversationMessages(messages, targetRole)` ahora acepta `"all"` (por defecto), `"user"` o `"assistant"`.
- Se integró en `pipeline.js` usando `config.roleFilter`.
- Se agregó la opción `--role` / `-r` a la CLI con validación en `validator.js`.
- Se agregaron tests automatizados para los tres casos (`all`, `user`, `assistant`).

#### Conclusión

Extender un módulo existente en lugar de crear uno nuevo mantuvo el código más simple (KISS) y reutilizó las validaciones de roles que ya existían. La CLI ahora permite exportar conversaciones filtradas por rol.

---

### v1.2.3 — Opciones avanzadas en la extensión

### E-045

#### Objetivo

Integrar las opciones de modo compacto y filtro de roles en el popup de la extensión.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se agregó un checkbox para modo compacto y radio buttons para filtro de roles (`all`, `user`, `assistant`) en `popup.html`.
- Las opciones específicas de Markdown se ocultan automáticamente al seleccionar JSON, usando la propiedad nativa `hidden`.
- Se extrajo el CSS del popup a un archivo independiente (`popup.css`).
- `popup.js` envía todas las opciones (`format`, `compact`, `roleFilter`) en el mensaje `EXPORT`.
- Se corrigió `background.js` para que los handlers `md` y `json` reciban el mensaje completo y propaguen `compact` y `roleFilter` al `config` del pipeline.
- Se actualizó el build para incluir `popup.css` y el manifest para declararlo como recurso accesible.

#### Conclusión

La extensión ahora ofrece las mismas opciones de exportación que la CLI, manteniendo la coherencia entre ambas interfaces. La separación de responsabilidades (popup solo envía intención, background solo coordina, core solo procesa) se mantuvo intacta.

---

### v1.2.4 — Rediseño visual y UX del popup

### E-046

#### Objetivo

Implementar indicadores de progreso y retroalimentación visual durante la exportación.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se reemplazó el texto "Procesando..." por un spinner CSS animado.
- Se deshabilita el botón Exportar mientras la operación está en curso, evitando múltiples clics.
- Se mejoró el mensaje de error cuando no hay conversación capturada, incluyendo el nombre del proveedor y preparándolo para futuros modelos.
- Se agregó la versión dinámica de la extensión en el footer, obtenida automáticamente desde `chrome.runtime.getManifest()`.

#### Conclusión

La experiencia de usuario mejoró significativamente con feedback visual claro durante la espera y mensajes de error orientativos.

---

### E-047

#### Objetivo

Rediseñar completamente el popup con una estética cyberpunk cohesiva.

#### Resultado

✔ Confirmado.

#### Observaciones

- Se implementó un fondo oscuro con gradiente radial.
- Las superficies (select, fieldset) utilizan glassmorphism (`backdrop-filter: blur()`) con transparencia controlada.
- Los controles de formulario se rediseñaron con apariencia de hardware físico:
  - Checkbox como switch deslizante.
  - Radio buttons como botones circulares que se hunden al seleccionarlos.
- El `<select>` se estilizó completamente con la nueva API nativa `appearance: base-select`, sin hacks ni JavaScript.
- Se construyó un sistema de tokens CSS con tres capas (primitivos, derivados, compuestos) para garantizar consistencia y facilitar futuros cambios de paleta.

#### Conclusión

El diseño logra una identidad visual única y profesional, coherente con el ícono original, y preparado para adaptarse a una nueva paleta de colores con solo modificar variables.

---

### E-048

#### Objetivo

Modularizar la hoja de estilos del popup para mejorar el mantenimiento.

#### Resultado

✔ Confirmado.

#### Observaciones

- El archivo único de más de 300 líneas se dividió en siete módulos: `variables.css`, `base.css`, `selector.css`, `options.css`, `button.css`, `footer.css` y `popup.css` como punto de entrada.
- La separación sigue el principio de responsabilidad única: cada archivo controla un aspecto visual específico.
- El build de la extensión se actualizó para copiar recursivamente la carpeta `styles/` a `dist/`.
- Se corrigió la declaración de recursos en el manifest para permitir que el popup cargue los nuevos módulos.

#### Conclusión

La modularización facilita la edición y extensión de los estilos sin navegar por un archivo monolítico, manteniendo la misma apariencia visual.

---

## Descubrimientos

### Desarrollo

- La conversación completa viaja durante la carga inicial.
- El JSON contiene el árbol completo en `mapping`.
- El parser puede trabajar únicamente sobre `mapping`.
- La alternancia de roles no está garantizada.
- Los Canvas forman parte del árbol de conversación como mensajes propios.
- El formateo puede desacoplarse completamente de la lógica de negocio.
- El módulo `formatter` puede centralizar toda la representación textual reutilizable (fechas, roles y bloques de cita).
- El pipeline completo funciona desde la carga del JSON hasta la escritura del archivo Markdown.
- La versión del proyecto puede obtenerse desde una única fuente de verdad (`package.json`).
- Las opciones nombradas (`-i`, `-o`) eliminan la dependencia del orden de los argumentos y facilitan la escalabilidad de la CLI.
- La validación de argumentos puede evolucionar como un módulo independiente de la CLI.
- La propiedad `consumes` puede utilizarse como única fuente de verdad para validar opciones que requieren argumentos.
- Las opciones equivalentes pueden agruparse mediante una propiedad declarativa (`group`).
- La validación de extensiones y de recursos del sistema de archivos puede reutilizar reglas genéricas.
- El pipeline puede finalizar anticipadamente en distintas etapas sin romper el desacoplamiento entre módulos.
- Las pruebas manuales también pueden organizarse mediante el patrón datos + ejecutor.
- La generación del documento y su persistencia pueden validarse de forma independiente.
- Los módulos diseñados como funciones puras permiten incorporar pruebas automatizadas sin modificar su implementación.
- El generador Markdown puede ofrecer distintos modos de exportación reutilizando la misma infraestructura de formateo.
- La carga de conversaciones puede validarse completamente mediante pruebas automatizadas utilizando fixtures reales, archivos inexistentes y JSON malformado.
- La escritura de archivos puede validarse automáticamente utilizando un directorio temporal ignorado por Git, evitando efectos secundarios sobre el repositorio.
- Separar la obtención de la conversación, el procesamiento y la salida produce un pipeline reutilizable desde cualquier interfaz.
- La orquestación puede evolucionar independientemente del procesamiento cuando ambos componentes se comunican mediante contratos simples.
- Resolver la Conversation Source fuera del pipeline elimina el último acoplamiento del Core con el entorno de ejecución.
- Inyectar el mecanismo de salida mediante `config.outputHandler` desacopla completamente el Core del entorno de ejecución.
- Unificar el contrato de las fuentes (recibir `config` completo) permite incorporar nuevos orígenes de datos sin modificar el orquestador.
- Los tests existentes facilitan validar refactors arquitectónicos sin miedo a regresiones.
- esbuild con un plugin de reemplazo permite empaquetar el Core para el navegador sin modificar su estructura interna.
- Un stub de fuente es suficiente para aislar dependencias de Node en el bundle de la extensión.
- `importScripts` en el service worker permite cargar bundles IIFE generados externamente.
- La arquitectura de Conversation Sources + OutputHandler inyectado funciona correctamente en dos entornos completamente distintos (Node y Chrome Extension).
- Un popup de extensión no puede ejecutar lógica de procesamiento pesada; debe delegar al background mediante mensajes.
- `chrome.runtime.sendMessage` desde el popup requiere devolver `true` en el listener del background si la respuesta es asíncrona.
- El evento `chrome.tabs.onUpdated` puede interferir con la persistencia de datos si se dispara con cada cambio de estado de carga de la SPA.
- La comunicación `inject → content → background` debe ser automática (push) y no depender de solicitudes explícitas para evitar desconexiones al cambiar la interfaz de usuario de la extensión.
- Markdown requiere una línea en blanco antes de reglas horizontales (`---`) y listas (`- ` o `1. `) para interpretarlas correctamente.
- Una regex con mirada negativa puede proteger múltiples patrones, pero no cubre todos los casos de borde (como la transición lista→párrafo).
- La técnica de placeholders (proteger→procesar→restaurar) es una alternativa KISS efectiva cuando las reglas de reemplazo son contextuales.
- Extender un módulo existente con un parámetro opcional es preferible a crear un nuevo archivo cuando la responsabilidad es la misma (filtrar mensajes).
- La API `appearance: base-select` permite personalizar completamente un `<select>` nativo sin perder accesibilidad ni navegación por teclado.
- Un sistema de tokens CSS con capas (primitivos, derivados, compuestos) simplifica el mantenimiento y la evolución visual del proyecto.
- Los Service Workers de Manifest V3 son efímeros: el estado en memoria puede perderse entre aperturas del popup, lo que requiere estrategias de persistencia (storage) para datos críticos.
- La modularización de CSS con `@import` es viable en extensiones de Chrome siempre que los archivos se declaren en `web_accessible_resources`.

### Pre Release

- La reorganización arquitectónica puede realizarse sin modificar el comportamiento observable cuando el proyecto posee una buena cobertura de pruebas.
- Es preferible escribir la documentación de alto nivel una vez estabilizada la arquitectura.
- Un archivo de entrada por defecto reduce significativamente la fricción durante el primer uso del proyecto.
- La validación desde un repositorio recién clonado constituye una prueba complementaria a la batería automatizada y permite detectar dependencias implícitas.
- Los fixtures utilizados por las pruebas deben formar parte del repositorio para garantizar la reproducibilidad.
- La preparación de una Release implica principalmente reducir incertidumbre, no incorporar nuevas funcionalidades.
- El origen de una conversación puede abstraerse mediante Conversation Sources sin modificar el pipeline.
- La configuración del pipeline puede centralizarse y reutilizarse entre distintas interfaces.
- Los perfiles permiten adaptar el comportamiento del pipeline sin duplicar configuración.
- La separación entre orquestación (`runExporter`) y procesamiento (`runPipeline`) simplifica la incorporación de nuevas interfaces sin modificar el núcleo del proyecto.
- Centralizar la resolución de Conversation Sources en el orquestador mantiene al Core completamente independiente del origen de los datos.