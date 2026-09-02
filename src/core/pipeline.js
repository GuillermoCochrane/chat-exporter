import { inspectConversation } from "./inspector.js";
import { extractMessages } from "./parser.js";
import { filterConversationMessages } from "./filter.js";
import { sortMessages } from "./sorter.js";
import { normalizeMessages } from "./normalizer.js";

// Ejecuta exclusivamente el procesamiento interno del Core.
// No conoce interfaces, formatos ni mecanismos de salida.
export function runPipeline(conversation, config) {
  // El inspector solo se ejecuta cuando la interfaz lo solicita.
  if (config.inspect) {
    const report = inspectConversation(conversation);
    return { report };
  }

  const parsed = extractMessages(conversation);
  const filtered = filterConversationMessages(parsed, config.roleFilter ?? "all");
  const sorted = sortMessages(filtered);
  const normalized = normalizeMessages(sorted);

  return {
    report: null,
    normalized,
  };
}