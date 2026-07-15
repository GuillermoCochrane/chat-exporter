function showHelp() {
  console.log(`
Chat Exporter v0.5.8

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
`);
}

export function parseArguments() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  return {
    input: args[0] ?? "./input/epistolario_SMALL.json",
    output: args[1] ?? "./output/conversacion.md",
  };
}