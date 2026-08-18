# Changelog

Este documento resume la evolución del proyecto versión por versión y registra las principales decisiones de implementación tomadas durante su desarrollo.

---

# v1.4.1 — Advertencia de recarga antes de exportar

* Se agrega una advertencia opcional que se muestra al hacer clic en **Exportar** cuando no existe una preferencia guardada.
* La advertencia pausa la exportación y permite continuar con la misma configuración original.
* Se incluye un checkbox para **no volver a mostrar** la advertencia, que se persiste en `chrome.storage.local`.
* Se agrega un enlace contextual a la sección **Troubleshooting** del FAQ dentro de la advertencia.
* Se agrega un enlace discreto de ayuda (`?`) en el footer del popup, que también lleva al FAQ.
* Durante la advertencia, se ocultan temporalmente las opciones de exportación para evitar desbordes en el área del popup.
* Se actualiza la documentación del proyecto.

---

# v1.4.0 — Sitio web oficial y sistema multiidioma

* Se crea el sitio web oficial del proyecto, alojado en GitHub Pages, con la misma identidad visual cyberpunk de la extensión.
* Se implementan las siguientes páginas:
  - Landing page (`index.html`) con hero, carrusel, features, roadmap y FAQ.
  - Página de privacidad (`pages/privacy/`).
  - Página de FAQ (`pages/faq/`).
  - Página de la CLI (`pages/cli/`).
  - Página de changelog (`pages/changelog/`).
  - Página de sitemap (`pages/index.html`) como fallback de navegación.
* Se agrega un sistema multiidioma (español / inglés) a todas las páginas del sitio:
  - Helper de traducciones por página (`languages/`).
  - Orquestadores de idioma reutilizables (`languageHandler`, `languageSettings`).
  - Toggle visual con banderas SVG en el header.
  - Persistencia de la preferencia en `localStorage`.
  - Detección automática del idioma del navegador.
* Se modularizan los estilos y scripts del sitio por responsabilidad (`shared/`, `home/`, `privacy/`, etc.).
* Se agregan meta tags completos de SEO, Open Graph y Twitter Cards en todas las páginas.
* Se crea la imagen social `social.png` (1200×630) y su template HTML.
* Se agrega la meta tag de verificación de Google Search Console.
* Se implementan transiciones de vista entre páginas con la API de View Transitions.
* Se mejora la detección de la sección activa en la sidebar durante el scroll.
* Se corrigen múltiples detalles de responsive, estilos y navegación en el sitio.
* Se actualiza la documentación general y de la extensión para reflejar la nueva web.

---

# v1.3.1 — Sistema multi‑idioma y preparación para publicación

* Se implementa un sistema de traducción multi‑idioma en el popup:
  - Helper de traducción (`languages.js`) con soporte para español e inglés.
  - Mensajes de error desacoplados: el background envía códigos de error (`errorCode`) y el popup los traduce.
  - Detección automática del idioma del navegador al cargar el popup (`languageSettings.js`).
  - Toggle visual con banderas SVG (España / Reino Unido) para cambiar de idioma.
  - Persistencia de la preferencia de idioma en `chrome.storage.local`.
* Se agrega el permiso `storage` al `manifest.json` para guardar la preferencia de idioma.
* Se preparan los materiales para la publicación en la Chrome Web Store:
  - Descripción corta y larga.
  - Política de privacidad.
  - Justificación de permisos.
* Se reorganizan los scripts del popup en la carpeta `js/` (`popup.js`, `languages.js`, `languageSettings.js`).
* Se actualiza el build de la extensión para copiar la carpeta `js/` a `dist/`.
* Se actualiza la documentación general y de la extensión para reflejar los cambios.

---

# v1.3.0 — Release estable con rediseño visual y preparación para distribución

* Se publica la versión estable 1.3.0 en GitHub.
* Incluye todas las funcionalidades de la serie 1.2.x:
  - Popup con opciones avanzadas (formato, compacto, roles).
  - Rediseño cyberpunk con sistema de tokens CSS.
  - Build ZIP automático.
  - Íconos definitivos en todos los tamaños.
  - Indicador de progreso y mejoras de UX.
* Documentación actualizada y preparación para publicación en Chrome Web Store.

---

# v1.2.4 — Rediseño visual y mejoras de UX en el popup

* Se agrega un encabezado contextual al popup que indica el proveedor de la conversación (`Exportando desde ChatGPT`), preparado para futuros modelos.
* Se implementa un spinner CSS animado como indicador de progreso durante la exportación, en reemplazo del texto "Procesando...".
* Se deshabilita el botón Exportar durante el procesamiento para evitar múltiples clics.
* Se mejora el mensaje de error cuando no hay conversación capturada, incluyendo el nombre del proveedor.
* Se agrega la versión dinámica de la extensión en el footer del popup, obtenida desde `chrome.runtime.getManifest()`.
* Se aplica un rediseño completo del popup con estética cyberpunk:
  - Fondo oscuro con gradiente radial.
  - Efectos de glassmorphism en superficies.
  - Switch y radio buttons con apariencia de hardware físico (relieve/hundido).
  - Select nativo estilizado con la nueva API `appearance: base-select`.
* Se implementa un sistema de tokens CSS (variables de diseño) con paleta de colores derivada del ícono de la extensión.
* Se modulariza el CSS del popup por responsabilidad en archivos independientes (`variables.css`, `base.css`, `selector.css`, `options.css`, `button.css`, `footer.css`).
* Se corrigen los tests del modo compacto que esperaban el formato de cita (`>`), el cual fue eliminado en la versión 1.2.2.
* Se actualiza la documentación general y de la extensión para reflejar los cambios.

---

# v1.2.3 — Modo compacto y filtro de roles en la extensión

* Se agregan opciones avanzadas al popup de la extensión:
  - Checkbox para modo compacto.
  - Radio buttons para filtrar por rol (`all`, `user`, `assistant`).
* Las opciones específicas de Markdown se ocultan al seleccionar JSON.
* Se extrae el CSS del popup a un archivo independiente (`popup.css`).
* Se actualiza `background.js` para propagar `compact` y `roleFilter` al pipeline.
* Se actualiza el build de la extensión para incluir `popup.css`.
* Se actualiza la documentación general y de la extensión.

---

# v1.2.2 — Filtro por rol y mejora del modo compacto en CLI

* Se extiende `filter.js` para aceptar un parámetro opcional `targetRole` que permite filtrar mensajes por `user`, `assistant` o conservar todos (`all`).
* Se integra el filtro por rol en `pipeline.js` mediante `config.roleFilter`.
* Se agrega la opción `--role` / `-r` a la CLI con validación en `validator.js`.
* Se mejora el modo compacto del generador Markdown:
  - Ahora preserva las reglas horizontales (`---`) y las listas (`- `, `1. `) que requieren espaciado específico en Markdown.
  - Se implementa una técnica de placeholders (proteger → procesar → restaurar) para manejar casos borde como la transición lista→párrafo.
* Se agregan tests automatizados para el filtro por rol.
* Se actualiza la documentación general para reflejar los cambios.

---

# v1.2.1 — Popup y selector de formato en la extensión

* Se agrega un popup a la extensión con selector de formato de exportación (Markdown / JSON).
* Se implementa un sistema de handlers declarativos en `background.js` para despachar la exportación según el formato elegido.
* Se simplifica el flujo de comunicación entre `inject.js`, `content.js` y `background.js`:
  - `inject.js` ahora envía automáticamente la conversación capturada al content script mediante `window.postMessage`.
  - `content.js` se reduce a un listener pasivo que reenvía cualquier conversación al background.
  - `background.js` almacena la conversación y espera la solicitud de exportación desde el popup.
* Se elimina el listener `chrome.action.onClicked`, reemplazado por `default_popup` en el manifest.
* Se actualiza el script de build para copiar `popup.html` y `popup.js` a `dist/`.
* Se actualiza la documentación general y de la extensión para reflejar los cambios.

---

# v1.2.0 — Release de la v1.2.0

* Se publica la versión estable 1.2.0.
* Se actualiza la documentación general y de la extensión para reflejar los cambios.

---


# v1.1.4 — Extensión integrada

* La extensión de Chrome queda completamente integrada con el pipeline de exportación.
* Se desacopla el mecanismo de salida del orquestador: el Core deja de importar `writer.js` y recibe `config.outputHandler` desde la interfaz.
* Se unifica el contrato de las Conversation Sources: todas reciben el objeto `config` completo.
* Se agrega `ExtensionSource` para conversaciones capturadas por la extensión.
* `background.js` construye la configuración del pipeline y descarga el Markdown generado mediante `chrome.downloads`.
* Se implementa el build automatizado de la extensión con esbuild, incluyendo un plugin para reemplazar `jsonFile.js` por un stub que evita dependencias de Node.js.
* Se agregan íconos iniciales para la extensión.
* Se reorganiza la estructura de carpetas del proyecto: `input/`, `output/`, `docs/research/` y `scripts/` pasan a `assets/`.
* Se actualiza la documentación general del proyecto (ARCHITECTURE, INTEGRATION, ROADMAP, LABORATORY, DECISIONS).

---

# v1.1.3.6 — Preparación para la integración

* Se completa el refactor del Core necesario para integrar la extensión.
* El orquestador (`exporter.js`) deja de importar `writer.js` y delega la salida en `config.outputHandler`.
* Todas las Conversation Sources pasan a recibir el objeto `config` completo.
* Se crea `ExtensionSource` para conversaciones capturadas por la extensión.
* Se ajustan los tests al nuevo contrato de fuentes.
* Se actualiza la documentación del Core (ARCHITECTURE, ROADMAP, INTEGRATION, DECISIONS, LABORATORY).

---

# v1.1.3.5 — Arquitectura desacoplada del pipeline

* Se documenta la nueva arquitectura con Conversation Sources, Pipeline Profiles y OutputHandler.
* El Core queda completamente preparado para múltiples proveedores e interfaces.

---

# v1.1.3 — Desacoplamiento de la orquestación

* Se separa la orquestación (`runExporter`) del procesamiento (`runPipeline`).
* `runExporter` coordina la fuente, el pipeline y el renderer.
* `runPipeline` ejecuta exclusivamente el procesamiento interno del Core.
* Se implementa el sistema de Conversation Sources.
* `jsonFileSource` se convierte en la primera implementación.
* La CLI pasa a utilizar la configuración base compartida del pipeline.
* Se adaptan los tests al nuevo modelo de fuentes.
* Se implementan nombres genéricos en `jsonFile` para eliminar referencias específicas a ChatGPT.

---

# v1.1.2 — Extensión: captura automática

* La extensión logra capturar automáticamente la conversación completa de ChatGPT.
* Se implementa el script `inject.js` que intercepta `window.fetch()` en el contexto de la página.
* Se filtra la respuesta por la presencia de `mapping` para identificar la conversación.
* Se valida que el JSON capturado es equivalente al descargado manualmente desde DevTools.
* Se reorganiza y actualiza la documentación de la extensión.

---

# v1.1.1 — Extensión: interceptación del JSON

* Se intercepta el JSON completo de conversaciones desde el endpoint `/backend-api/conversation/{id}`.
* Se implementa la inyección de scripts en el contexto de la página mediante `content.js`.
* Se valida la estrategia de captura y se actualiza la documentación.

---

# v1.1.0 — Infraestructura base de la extensión

* Se crea la arquitectura inicial del módulo de extensión.
* Se implementa la infraestructura base: `manifest.json`, `background.js`, `content.js`, `inject.js`.
* Se incorpora la documentación inicial de la extensión (ROADMAP, ARCHITECTURE, CAPTURE_RESEARCH).
* Comienza la investigación formal sobre la viabilidad de capturar el JSON automáticamente.

---

# v1.0.0 — Primera versión estable

* Se publica la versión 1.0.0.
* README completo con instalación, uso, arquitectura y filosofía del proyecto.
* Documentación actualizada para la Pre Release.
* El proyecto queda preparado para distribución pública.

---

# v0.9.5.2 — Pre Release Stabilization

* Finaliza la etapa de estabilización de la Pre Release.
* Se actualizan las pruebas automatizadas para utilizar exclusivamente fixtures versionados.
* Se elimina la dependencia de archivos externos al repositorio.
* Se valida el proyecto desde un repositorio recién clonado.
* Se verifica la ejecución inmediata mediante `npm start`.
* Se comprueba el correcto funcionamiento de la ayuda, la versión, los modos `inspect`, `no-write` y `compact`.
* Se confirma la ausencia de rutas absolutas y dependencias locales.
* El proyecto queda preparado para iniciar la Iteración 5 y la publicación de la versión 1.0.0.

---

# v0.9.5.1 — Release Validation

* Se incorpora una batería específica de validación para Release (`test-cases-release.sh`).
* Se reutiliza el runner genérico de pruebas manuales (`run-manual-tests.sh`).
* Se agregan fixtures mínimos (`empty.json` y `single-message.json`) para validar escenarios básicos.
* Se incorpora `input/conversation.json` como conversación por defecto para la primera ejecución. Es el único archivo versionado dentro de `input/`.
* `.gitignore` conserva únicamente dicho archivo dentro del directorio `input`.
* Se reorganizan los recursos utilizados por las pruebas en `test/fixtures`.
* Se incorpora `.gitkeep` en `output` para preservar la estructura del proyecto.

---

# v0.9.4 — Project Metadata

* Se completa la metadata del proyecto.
* Se actualiza `package.json` con información para distribución pública.
* Se revisan licencia, autor, descripción, repositorio, palabras clave y versiones soportadas de Node.js.

---

# v0.9.3 — Documentation

* Se reescribe completamente el README.
* Se documentan instalación, arquitectura, pipeline, testing y filosofía del proyecto.
* Se incorpora una guía de inicio para nuevos colaboradores.

---

# v0.9.2 — Default Configuration

* La configuración por defecto pasa a utilizar `input/conversation.json`.
* La CLI puede ejecutarse inmediatamente mediante `npm start`.
* Se actualiza la ayuda integrada para reflejar la nueva configuración.

---

# v0.9.1 — Test Migration

* Se actualizan las pruebas para reflejar la nueva estructura del proyecto.

---

# v0.9.0 — Pre Release

* Comienza oficialmente la etapa Pre Release.
* Se reorganiza completamente la estructura del proyecto.
* Se separan el núcleo (`core`), las interfaces (`interfaces`) y las utilidades (`utilities`).
* El pipeline permanece sin cambios funcionales.
* El proyecto queda preparado para futuras interfaces reutilizando el mismo motor.

---

## v0.5.10.7 — Writer Tests

* Incorporadas pruebas automatizadas para `writer.js`.
* Se incorpora un caso de prueba específico para validar la escritura de archivos.
* Se verifica que el contenido generado se escriba correctamente en disco.
* Se valida la lectura posterior del archivo para comprobar la integridad del contenido.
* El archivo temporal utilizado durante la prueba se elimina al finalizar la ejecución.
* Nuevo comando `npm run test:writer` para ejecutar la batería de pruebas del módulo.

---

## v0.5.10.6 — Loader Tests

* Incorporadas pruebas automatizadas para `loader.js`.
* Se verifica la carga correcta de archivos JSON válidos.
* Se incorporan fixtures específicos para validar conversaciones MINI y SMALL.
* Se incorpora un fixture con JSON inválido para validar errores de parseo.
* Se valida el comportamiento ante archivos inexistentes.
* Nuevo comando `npm run test:loader` para ejecutar la batería de pruebas del módulo.

---

## v0.5.10.5 — Markdown Tests & Compact Mode

* Incorporadas pruebas automatizadas para `markdown.js`.
* Se agregan fixtures específicos para validar la generación de documentos Markdown.
* Se incorpora una batería independiente para verificar el modo de exportación compacta.
* Nuevo parámetro `--compact` (`-c`) para eliminar líneas en blanco consecutivas dentro de los mensajes exportados.
* Se incorpora el formateador `formatRole()` para centralizar la representación de los roles de la conversación.
* Se actualiza el generador Markdown para consumir la configuración completa de la CLI.
* Nuevo comando `npm run test:all` para ejecutar toda la suite de pruebas automatizadas.

---

## v0.5.10.4 — Normalizer Tests

* Incorporadas pruebas automatizadas para `normalizer.js`.
* Se valida la transformación del modelo interno.
* Se verifica la concatenación de partes del mensaje.
* Se valida la preservación de la estructura y del timestamp.

---

## v0.5.10.3 — Filter Tests

* Incorporadas pruebas automatizadas para `filter.js`.
* Se valida la eliminación de mensajes no conversacionales.
* Se verifica que sólo permanezcan mensajes `user` y `assistant` con contenido `text`.

---

## v0.5.10.2 — Parser Tests

* Incorporadas pruebas automatizadas para `parser.js`.
* Se verifican la estructura de los mensajes extraídos y la preservación de información relevante.
* Se incorporan fixtures específicos para pruebas del parser.

---

## v0.5.10.1 — Validator Testing

* Incorporada la primera batería de pruebas automatizadas para `validator.js`.
* Se validan casos exitosos y errores esperados.
* El módulo supera todas las pruebas sin requerir modificaciones en su implementación.

---

## v0.5.10.0 — Automated Testing

* Comienza la incorporación de pruebas automatizadas.
* Se implementa la primera batería de tests para `formatter.js`.
* Se incorpora el comando `npm run test:formatter`.
* El proyecto inicia la transición desde pruebas manuales hacia pruebas automatizadas por módulo.

---

## v0.5.9.7 — CLI No Write

* Incorporado el modo `--no-write` (`-nw`).
* El pipeline ejecuta todas las etapas excepto la escritura del archivo.
* El documento Markdown se genera completamente en memoria.
* El modo resulta útil para validar el pipeline completo sin modificar el sistema de archivos.

---

## v0.5.9.6 — CLI Inspect

* Incorporado el modo `--inspect` (`-in`).
* El pipeline puede detenerse luego del Inspector.
* Se muestran estadísticas de la conversación sin generar Markdown.
* Incorporado un runner reutilizable para pruebas manuales.
* Las baterías de pruebas quedan desacopladas del ejecutor mediante archivos independientes.

---

## v0.5.9.5 — CLI Path Validation

* Validación de existencia del archivo de entrada.
* Validación de existencia del directorio de salida.
* Se reutiliza una única función para validar ambos recursos.
* Nuevo mensaje de validación `pathNotFound`.

---

## v0.5.9.4 — CLI Option Groups

* Incorporada la propiedad `group` en `cliActions`.
* Los alias (`-i` / `--input`, `-o` / `--output`) pasan a pertenecer al mismo grupo lógico.
* Se implementó la validación de opciones repetidas utilizando los grupos declarados.
* La validación deja de depender del nombre específico de cada opción.

---

## v0.5.9.3 — CLI File Extensions

* Incorporada la validación de extensiones para archivos de entrada y salida.
* Los archivos de entrada deben utilizar `.json`.
* Los archivos de salida deben utilizar `.md`.
* La validación reutiliza una única regla parametrizada.
* Los mensajes continúan centralizados mediante `validatorMessages`.

---

## v0.5.9.2 — CLI Argument Validation

* Validación de parámetros reemplazados por otras opciones.
* `-i -o` informa correctamente que `-i` requiere un valor.
* `-o -i` informa correctamente que `-o` requiere un valor.
* Centralización de mensajes de validación mediante `validatorMessages`.

---

## v0.5.9.1 — CLI Required Arguments

* Incorporada la validación de opciones que requieren argumentos.
* La validación utiliza la propiedad `consumes` definida en `cliActions`.
* Los mensajes de validación quedaron centralizados mediante `validatorMessages`.

---

## v0.5.9.0 — CLI Validator

* Creado el módulo `validator.js`.
* La validación de argumentos se desacopla de `cli.js`.
* Primera regla implementada: detección de opciones desconocidas.
* `main.js` incorpora manejo centralizado de errores mediante `try/catch`, mostrando mensajes amigables al usuario.

---

## v0.5.8.3 — CLI Named Arguments

* Incorporadas las opciones `-i` y `-o`.
* Eliminada la dependencia del orden de los argumentos.
* La configuración de ejecución pasa a construirse mediante acciones independientes sobre un objeto compartido.

---

## v0.5.8.2 — CLI Version

* Soporte para `-v` y `--version`.
* La versión se obtiene dinámicamente desde `package.json`.
* La consulta de versión no ejecuta el pipeline.

---

## v0.5.8.1 — CLI Help

* Soporte para `-h` y `--help`.
* La ayuda muestra ejemplos de uso y opciones disponibles.
* La ayuda no ejecuta el pipeline.

---

## v0.5.8 — CLI

* Implementado `cli.js`.
* Soporte para indicar archivo de entrada desde la consola.
* Soporte para indicar archivo de salida desde la consola.
* El pipeline deja de depender de rutas fijas.

---

## v0.5.7 — Writer

* Implementado `writer.js`.
* Escritura de archivos Markdown en disco.
* Pipeline completo funcional (JSON → Markdown → Archivo).
* Validación realizada con conversaciones MINI, SMALL y ORIGINAL.

---

## v0.5.6 — Markdown Builder

* Implementado el generador de Markdown.
* El Markdown consume exclusivamente el modelo normalizado.
* Todo el formateo textual se delega al módulo `formatter`.
* Validación realizada con conversaciones MINI, SMALL y ORIGINAL.

---

## v0.5.5 — Formatter

* Nuevo módulo `formatter`.
* Formateo desacoplado de fechas.
* Soporte para formatos `unix`, `iso`, `human` y `locale`.
* Nuevo formateador de bloques de cita (`formatQuote`).
* El módulo queda preparado para incorporar nuevos formateadores sin modificar el resto del pipeline.

---

## v0.5.4 — Normalizer

* Normalización de mensajes.
* Modelo interno desacoplado del JSON de ChatGPT.

---

## v0.5.3 — Filter

* Filtro de mensajes visibles.
* Eliminación de mensajes de sistema.
* Eliminación de contextos internos.
* Validación de múltiples mensajes consecutivos del mismo autor.

---

## v0.5.2 — Parser

* Parser funcional.
* Extracción de mensajes desde `mapping`.
* Validación sobre conversaciones reales.

---

## v0.5.1 — Loader e Inspector

* Loader implementado.
* Inspector implementado.
* Primeras pruebas con JSON exportado.

---

## v0.5.0 — Inicialización

* Estructura inicial del proyecto.
* Arquitectura definida.
* Pipeline establecido.