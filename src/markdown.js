import { formatDate, formatQuote, formatRole } from "./formatter.js";

const MESSAGE_SEPARATOR = "\n\n";

// Compacta múltiples líneas en blanco consecutivas.
// Se utiliza opcionalmente durante la exportación.
function compactText(text) {
  return text.replace(/\n{2,}/g, "\n");
}

// Construye la estructura Markdown a partir de un array de mensajes.
export function buildMarkdown(
  messages,
  {
    dateFormat = "human",
    compact = false,
  } = {},
) {
  return messages
    .map(({ role, timestamp, text }) => {
      const content = compact ? compactText(text) : text;

      return [
        `## ${formatRole(role)} · ${formatDate(timestamp, dateFormat)}`,
        "",
        formatQuote(content),
      ].join("\n");
    })
    .join(MESSAGE_SEPARATOR);
}