// Punto de entrada del core para la extensión.
// Este archivo será empaquetado con esbuild junto con
// todas las dependencias del pipeline.
//
// El bundle resultante expone runExporter en el ámbito global
// para que background.js pueda invocarlo mediante importScripts.

import { runExporter } from "../../core/exporter.js";

globalThis.__AI_CHAT_EXPORTER__ ??= {};
globalThis.__AI_CHAT_EXPORTER__.runExporter = runExporter;