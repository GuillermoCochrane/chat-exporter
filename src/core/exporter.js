import { runPipeline } from "./pipeline.js";
import { conversationSources } from "./sources/index.js";
import { buildMarkdown } from "./markdown.js";
import { writeFileContent } from "./writer.js";

// Coordina la ejecución completa del exportador.
// Orquesta Sources, Core, Renderers y Outputs.
export async function runExporter(config) {
  try {
    const source = conversationSources[config.source];

    if (!source) {
      throw new Error(`Fuente desconocida: ${config.source}`);
    }

    const conversation = await source(config.input);

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

    await writeFileContent(config.output, markdown);

    console.log(`✔ Conversación exportada a ${config.output}`);
  } catch (error) {
    console.error(`✖ ${error.message}`);
    process.exit(1);
  }
}