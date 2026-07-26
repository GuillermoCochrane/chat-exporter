import { parseArguments } from "./interfaces/cli.js";
import { runExporter } from "./core/exporter.js";

// Punto de entrada de la aplicación.
// Cada interfaz construye la configuración y delega
// la ejecución al exportador.
const config = parseArguments();

await runExporter(config);