import { parseArguments } from "./interfaces/cli.js";
import { runExporter } from "./core/exporter.js";
import { writeFileContent } from "./core/writer.js";

// Punto de entrada de la aplicación.
// Cada interfaz construye la configuración y delega
// la ejecución al exportador.
const config = parseArguments();

// La CLI define su propio mecanismo de salida.
// Otras interfaces (extensión, API, etc.) proveerán
// el suyo sin modificar el core.
config.outputHandler = async (markdown) => {
  await writeFileContent(config.output, markdown);
};

await runExporter(config);