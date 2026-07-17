import packageJson from "../package.json" with { type: "json" };
import { validateArguments } from "./validator.js";

const defaultConfig = {
  input: "./input/epistolario_SMALL.json",
  output: "./output/conversacion.md",
};

const cliMessages = {
  help: `
Chat Exporter v${packageJson.version}

Uso:

  npm start
  npm start -- -i <input>
  npm start -- -i <input> -o <output>

Ejemplos:

  npm start
  npm start -- -i input/epistolario_MINI.json
  npm start -- -i input/epistolario_SMALL.json -o output/prueba.md

Opciones:

  -h, --help         Muestra esta ayuda.
  -v, --version      Muestra la versión.
  -i, --input        Archivo de entrada.
  -o, --output       Archivo de salida.
`,
  version: `Chat Exporter v${packageJson.version}`,
};

function showMessage(type) {
  console.log(cliMessages[type]);
  process.exit(0);
}

// Registro de acciones disponibles para la CLI.
// Cada acción declara cuántos argumentos consume y cómo actualiza la configuración.
const cliActions = {
  "-h": {
    consumes: 0,
    handler: () => showMessage("help"),
  },

  "--help": {
    consumes: 0,
    handler: () => showMessage("help"),
  },

  "-v": {
    consumes: 0,
    handler: () => showMessage("version"),
  },

  "--version": {
    consumes: 0,
    handler: () => showMessage("version"),
  },

  "-i": {
    consumes: 1,
    handler: (value, config) => {
      config.input = value;
    },
  },

  "--input": {
    consumes: 1,
    handler: (value, config) => {
      config.input = value;
    },
  },

  "-o": {
    consumes: 1,
    handler: (value, config) => {
      config.output = value;
    },
  },

  "--output": {
    consumes: 1,
    handler: (value, config) => {
      config.output = value;
    },
  },
};

export function parseArguments() {
  const args = process.argv.slice(2);

  validateArguments(args, cliActions);

  // Se crea una copia para evitar modificar la configuración por defecto.
  const config = { ...defaultConfig };

  // entries() devuelve pares [índice, valor].
  // Necesitamos el índice para acceder al argumento asociado a cada opción
  // (por ejemplo: "-i" -> "archivo.json") manteniendo un for...of legible.
  for (const [index, arg] of args.entries()) {
    const action = cliActions[arg];

    if (!action) continue;

    const value = args[index + action.consumes];

    action.handler(value, config);
  }

  return config;
}
