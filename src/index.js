import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";
import { buildMarkdown } from "./markdown.js";
import { writeFileContent } from "./writer.js";
import { parseArguments } from "./cli.js";

const { input, output } = parseArguments();

async function main() {
  const conversation = await loadConversation(input); 

  inspectConversation(conversation);

  const parsed = extractMessages(conversation);
  const filtered = filterConversationMessages(parsed);
  const normalized = normalizeMessages(filtered);

  const markdown = buildMarkdown(normalized);

  await writeFileContent(output, markdown);

  console.log(`✔ Conversación exportada a ${output}`);
}

main().catch(console.error);