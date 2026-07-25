import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";
import { buildMarkdown } from "./markdown.js";
import { writeFileContent } from "./writer.js";
import { parseArguments } from "../interfaces/cli.js";
import { conversationSources } from "./sources/index.js";

export async function runPipeline() {
  try {
    const config = parseArguments();

    const source = conversationSources[config.source];

    if (!source) {
      throw new Error(`Fuente desconocida: ${config.source}`);
    }

    const conversation = await source(config.input);

    const report = inspectConversation(conversation);

    if (config.inspect) {
      console.table(report);
      return;
    }

    const parsed = extractMessages(conversation);
    const filtered = filterConversationMessages(parsed);
    const normalized = normalizeMessages(filtered);

    const markdown = buildMarkdown(normalized, config);

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