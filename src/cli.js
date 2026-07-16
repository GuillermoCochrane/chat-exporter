import packageJson from "../package.json" with { type: "json" };

const cliMessages = {
  help: `
Chat Exporter v${packageJson.version}

Uso:

  npm start
  npm start -- <input>
  npm start -- <input> <output>

Ejemplos:

  npm start
  npm start -- input/epistolario_MINI.json
  npm start -- input/epistolario_SMALL.json output/prueba.md

Opciones:

  -h, --help       Muestra esta ayuda.
  -v, --version    Muestra la versión.
`,
  version: `Chat Exporter v${packageJson.version}`,
};

function showMessage(type) {
  console.log(cliMessages[type]);
  process.exit(0);
}

const cliActions = {
  "-h": () => showMessage("help"),
  "--help": () => showMessage("help"),
  "-v": () => showMessage("version"),
  "--version": () => showMessage("version"),
};

export function parseArguments() {
  const args = process.argv.slice(2);

  const action = cliActions[args[0]];
  if (action) action();

  return {
    input: args[0] ?? "./input/epistolario_SMALL.json",
    output: args[1] ?? "./output/conversacion.md",
  };
}