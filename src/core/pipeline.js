import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { sortPagesReverse, sortMessagesSafe } from "./sorter.js";
import { normalizeMessages } from "./normalizer.js";

// Ejecuta exclusivamente el procesamiento interno del Core.
// No conoce interfaces, formatos ni mecanismos de salida.
export function runPipeline(conversation, config) {
  // El inspector solo se ejecuta cuando la interfaz lo solicita.
  if (config.inspect) {
    const report = inspectConversation(conversation);
    return { report };
  }

const pages = sortPagesReverse(conversation);
const parsed = extractMessages(pages);
const sorted = sortMessagesSafe(parsed);
const filtered = filterConversationMessages(sorted, config.roleFilter ?? "all");
const normalized = normalizeMessages(filtered);


  return { normalized };
}