export const CLITRANSLATIONS = {
  // CLI Navbar
  "anchor-overview": {
    en: "Overview",
    es: "Resumen",
  },
  "anchor-requirements": {
    en: "Requirements",
    es: "Requisitos",
  },
  "anchor-installation": {
    en: "Installation",
    es: "Instalación",
  },
  "anchor-usage": {
    en: "Basic Usage",
    es: "Uso básico",
  },
  "anchor-options": {
    en: "Options",
    es: "Opciones",
  },
  "anchor-examples": {
    en: "Examples",
    es: "Ejemplos",
  },
  "anchor-pipeline": {
    en: "How It Works",
    es: "Cómo funciona",
  },

  // CLI Hero
  "hero-title": {
    en: "Command Line Interface",
    es: "Interfaz de línea de comandos",
  },
  "hero-text": {
    en: "Export ChatGPT conversations directly from your terminal.",
    es: "Exportá conversaciones de ChatGPT directamente desde tu terminal.",
  },

  // Overview
  "overview-title": {
    en: "Overview",
    es: "Resumen",
  },
  "overview-p1": {
    en: "The CLI lets you process exported ChatGPT JSON files directly from the terminal and generate clean Markdown documents.",
    es: "La CLI te permite procesar archivos JSON exportados de ChatGPT directamente desde la terminal y generar documentos Markdown limpios.",
  },
  "overview-p2": {
    en: "It uses the same modular pipeline as the Chrome Extension, without requiring a browser.",
    es: "Utiliza el mismo pipeline modular que la extensión de Chrome, sin necesidad de un navegador.",
  },
  "overview-p3": {
    en: "This makes the CLI useful for local processing, automation, experimentation, and integration into other workflows.",
    es: "Esto hace que la CLI sea útil para procesamiento local, automatización, experimentación e integración en otros flujos de trabajo.",
  },

  // Requirements
  "requirements-title": {
    en: "Requirements",
    es: "Requisitos",
  },
  "requirements-p1": {
    en: " — or newer.",
    es: " — o superior.",
  },
  "requirements-p2-intro": {
    en: "The core pipeline has no external npm dependencies. The project uses",
    es: "El pipeline principal no tiene dependencias externas de npm. El proyecto utiliza",
  },
  "requirements-p2-outro": {
    en: " as a development dependency for building the Chrome Extension.",
    es: " como dependencia de desarrollo para compilar la extensión de Chrome.",
  },

  // Installation
  "installation-title": {
    en: "Installation",
    es: "Instalación",
  },
  "installation-instructions": {
    en: "Clone the repository and install the dependencies:",
    es: "Cloná el repositorio e instalá las dependencias:",
  },

  // Usage
  "usage-title": {
    en: "Basic Usage",
    es: "Uso básico",
  },
  "usage-intro": {
    en: "Run the exporter with its default configuration:",
    es: "Ejecutá el exportador con su configuración predeterminada:",
  },
  "usage-input": {
    en: "By default, the CLI reads:",
    es: "Por defecto, la CLI lee:",
  },
  "usage-output": {
    en: "The generated Markdown file is written to:",
    es: "El archivo Markdown generado se escribe en:",
  },

  // Options
  "options-title": {
    en: "Options",
    es: "Opciones",
  },
  "option-help": {
    en: "Display the CLI help.",
    es: "Muestra la ayuda de la CLI.",
  },
  "option-version": {
    en: "Display the current version.",
    es: "Muestra la versión actual.",
  },
  "option-input": {
    en: "Specify the input JSON file.",
    es: "Especifica el archivo JSON de entrada.",
  },
  "option-output": {
    en: "Specify the output Markdown file.",
    es: "Especifica el archivo Markdown de salida.",
  },
  "option-inspect": {
    en: "Show conversation statistics without exporting.",
    es: "Muestra estadísticas de la conversación sin exportar.",
  },
  "option-nowrite": {
    en: "Run the complete pipeline without writing the output file.",
    es: "Ejecuta el pipeline completo sin escribir el archivo de salida.",
  },
  "option-compact": {
    en: "Remove unnecessary line breaks from the generated Markdown.",
    es: "Elimina saltos de línea innecesarios del Markdown generado.",
  },
  "option-role": {
    en: "Filter messages by role:",
    es: "Filtra mensajes por rol:",
  },
  "option-role-or": {
    en: "or",
    es: "o",
  },
  "option-role-all": {
    en: "all",
    es: "todos",
  },
  "option-role-user": {
    en: "user",
    es: "usuario",
  },
  "option-role-assistant": {
    en: "assistant",
    es: "asistente",
  },
  // Examples
  "examples-title": {
    en: "Examples",
    es: "Ejemplos",
  },
  "example-default": {
    en: "Export using the default paths:",
    es: "Exportar con las rutas predeterminadas:",
  },
  "example-custom-input": {
    en: "Use a custom input file:",
    es: "Usar un archivo de entrada personalizado:",
  },
  "example-custom-output": {
    en: "Use a custom output file:",
    es: "Usar un archivo de salida personalizado:",
  },
  "example-compact": {
    en: "Enable compact mode:",
    es: "Activar el modo compacto:",
  },
  "example-user": {
    en: "Export only user messages:",
    es: "Exportar solo mensajes del usuario:",
  },
  "example-assistant": {
    en: "Export only assistant messages:",
    es: "Exportar solo mensajes del asistente:",
  },
  "example-inspect": {
    en: "Inspect a conversation without exporting it:",
    es: "Inspeccionar una conversación sin exportarla:",
  },
  "example-no-write": {
    en: "Run the pipeline without writing an output file:",
    es: "Ejecutar el pipeline sin escribir un archivo de salida:",
  },

  // Pipeline
  "pipeline-title": {
    en: "How It Works",
    es: "Cómo funciona",
  },
  "pipeline-intro": {
    en: "The CLI is intentionally thin. It parses the command-line arguments, builds the pipeline configuration, and delegates the actual processing to the shared Core.",
    es: "La CLI es intencionalmente liviana. Analiza los argumentos de línea de comandos, construye la configuración del pipeline y delega el procesamiento real al Core compartido.",
  },
  "pipeline-module": {
    en: "Each module has a single responsibility. The Core does not depend on the interface that started the process or on the destination of the generated result.",
    es: "Cada módulo tiene una única responsabilidad. El Core no depende de la interfaz que inició el proceso ni del destino del resultado generado.",
  },
  "pipeline-interface": {
    en: "The CLI therefore acts as one interface over the same processing engine used by the Chrome Extension.",
    es: "Por lo tanto, la CLI actúa como una interfaz sobre el mismo motor de procesamiento que usa la extensión de Chrome.",
  },
  "pipeline-docs-intro": {
    en: "For a deeper look at the architecture, see the",
    es: "Para una mirada más profunda a la arquitectura, consultá la",
  },
  "pipeline-docs-link": {
    en: "project documentation on GitHub",
    es: "documentación del proyecto en GitHub",
  },
};
