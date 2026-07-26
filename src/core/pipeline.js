import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { normalizeMessages } from "./normalizer.js";

// Ejecuta exclusivamente el procesamiento interno del Core.
// No conoce interfaces, formatos ni mecanismos de salida.
export function runPipeline(conversation, config) {
  const report = inspectConversation(conversation);

  if (config.inspect) {
    return { report };
  }

  const parsed = extractMessages(conversation);
  const filtered = filterConversationMessages(parsed);
  const normalized = normalizeMessages(filtered);

  return {
    report,
    normalized,
  };
}