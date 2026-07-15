# Changelog

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