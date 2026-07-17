import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";
import { buildMarkdown } from "./markdown.js";
import { writeFileContent } from "./writer.js";
import { parseArguments } from "./cli.js";

async function main() {
  try {
    const { input, output, inspect, noWrite } = parseArguments();

    const conversation = await loadConversation(input);

    const report  = inspectConversation(conversation);

    if (inspect) {
      console.table(report);
      return;
    }

    const parsed = extractMessages(conversation);
    const filtered = filterConversationMessages(parsed);
    const normalized = normalizeMessages(filtered);

    const markdown = buildMarkdown(normalized);

    if (noWrite) {
      console.log("✔ Conversación procesada (modo --no-write).");
      return;
    }

    await writeFileContent(output, markdown);

    console.log(`✔ Conversación exportada a ${output}`);
  } catch (error) {
    console.error(`✖ ${error.message}`);
    process.exit(1);
  }
}

main();
