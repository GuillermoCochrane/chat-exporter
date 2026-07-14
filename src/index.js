import { loadConversation } from "./loader.js";
import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";

async function main() {
  const conversation = await loadConversation(
    "./input/epistolario_ORIGINAL.json",
  );

  const stats = inspectConversation(conversation);
  const messages = extractMessages(conversation);
  const filtered = filterConversationMessages(messages);
  const normalized = normalizeMessages(filtered);

  console.dir(normalized[0], { depth: null });
  console.dir(normalized[1], { depth: null });
}

main().catch(console.error);