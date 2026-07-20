import packageJson from "../../package.json" with { type: "json" };
import { validateArguments } from "../utilities/validator.js";

// Configuración utilizada cuando la CLI no recibe parámetros.
const defaultConfig = {
  input: "./input/epistolario_SMALL.json",
  output: "./output/conversacion.md",

  inspect: false,
  noWrite: false,
  compact: false,
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
  npm start -- -i input/epistolario_SMALL.json -o output/prueba.md -c

Opciones:

  -h, --help         Muestra esta ayuda.
  -v, --version      Muestra la versión.
  -i, --input        Archivo de entrada.
  -o, --output       Archivo de salida.
  -in, --inspect     Muestra estadísticas de la conversación sin exportar.
  -nw, --no-write    Ejecuta todo el pipeline sin escribir el archivo.
  -c, --compact      Elimina saltos de línea extra en los mensajes.
`,
  version: `Chat Exporter v${packageJson.version}`,
};

function showMessage(type) {
  console.log(cliMessages[type]);
  process.exit(0);
}

// Registro de acciones disponibles para la CLI.
// Cada acción declara el grupo al que pertenece, cuántos argumentos consume
// y cómo actualiza la configuración.
const cliActions = {
  "-h": {
    group: "help",
    consumes: 0,
    handler: () => showMessage("help"),
  },

  "--help": {
    group: "help",
    consumes: 0,
    handler: () => showMessage("help"),
  },

  "-v": {
    group: "version",
    consumes: 0,
    handler: () => showMessage("version"),
  },

  "--version": {
    group: "version",
    consumes: 0,
    handler: () => showMessage("version"),
  },

  "-i": {
    group: "input",
    consumes: 1,
    handler: (value, config) => {
      config.input = value;
    },
  },

  "--input": {
    group: "input",
    consumes: 1,
    handler: (value, config) => {
      config.input = value;
    },
  },

  "-o": {
    group: "output",
    consumes: 1,
    handler: (value, config) => {
      config.output = value;
    },
  },

  "--output": {
    group: "output",
    consumes: 1,
    handler: (value, config) => {
      config.output = value;
    },
  },

  "--inspect": {
    group: "inspect",
    consumes: 0,
    handler: (_, config) => {
      config.inspect = true;
    },
  },

  "-in": {
    group: "inspect",
    consumes: 0,
    handler: (_, config) => {
      config.inspect = true;
    },
  },

  "--no-write": {
    group: "noWrite",
    consumes: 0,
    handler: (_, config) => {
      config.noWrite = true;
    },
  },

  "-nw": {
    group: "noWrite",
    consumes: 0,
    handler: (_, config) => {
      config.noWrite = true;
    },
  },

  "-c": {
    group: "compact",
    consumes: 0,
    handler: (_, config) => {
      config.compact = true;
    },
  },

  "--compact": {
    group: "compact",
    consumes: 0,
    handler: (_, config) => {
      config.compact = true;
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
  // Cada opción modifica la configuración utilizando el registro declarativo
  // definido en cliActions.
  for (const [index, arg] of args.entries()) {
    const action = cliActions[arg];

    if (!action) continue;

    const value = args[index + action.consumes];

    action.handler(value, config);
  }

  return config;
}
