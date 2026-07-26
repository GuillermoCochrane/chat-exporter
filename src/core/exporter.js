import { runPipeline } from "./pipeline.js";
import { conversationSources } from "./sources/index.js";
import { buildMarkdown } from "./markdown.js";

// Coordina la ejecución completa del exportador.
// Orquesta Sources, Core, Renderers y Outputs.
export async function runExporter(config) {
  try {
    const source = conversationSources[config.source];

    if (!source) {
      throw new Error(`Fuente desconocida: ${config.source}`);
    }

    // Cada fuente recibe el objeto config completo
    // y extrae lo que necesita para obtener la conversación.
    const conversation = await source(config);

    const result = runPipeline(conversation, config);

    if (config.inspect) {
      console.table(result.report);
      return;
    }

    const markdown = buildMarkdown(result.normalized, config);

    if (config.noWrite) {
      console.log("✔ Conversación procesada (modo --no-write).");
      return;
    }

    // El mecanismo de salida es responsabilidad de la interfaz.
    // La CLI escribe en disco, la extensión descarga, etc.
    await config.outputHandler(markdown);

    console.log(`✔ Conversación exportada a ${config.output}`);
  } catch (error) {
    console.error(`✖ ${error.message}`);
    process.exit(1);
  }
}