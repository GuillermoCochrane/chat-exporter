import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";
import { buildMarkdown } from "./markdown.js";
import { writeFileContent } from "./writer.js";

async function main() {
  const conversation = await loadConversation("./input/epistolario_SMALL.json");

  inspectConversation(conversation);

  const parsed = extractMessages(conversation);
  const filtered = filterConversationMessages(parsed);
  const normalized = normalizeMessages(filtered);

  const markdown = buildMarkdown(normalized);

  await writeFileContent("./output/conversacion.md", markdown);

  console.log(markdown);
}

main().catch(console.error);