import { formatDate, formatQuote, formatRole } from "../utilities/formatter.js";

const MESSAGE_SEPARATOR = "\n\n";

// Compacta múltiples líneas en blanco consecutivas,
function compactText(text) {

  // Protege la separación entre una lista y el párrafo siguiente.
  text = text.replace(
    /((?:^- .*|^\d+\. .*))\n\n(?=\S)/gm,
    "$1__LIST_BREAK__"
  );

  // Compacta líneas en blanco, pero preserva las que preceden
  // a listas y reglas horizontales.
  text = text.replace(
    /\n{2,}(?!\n*(- |\d+\. |---))/g,
    "\n"
  );

  // Restaura la separación protegida.
  return  text.replace(/__LIST_BREAK__/g, "\n\n");

}

// Construye la estructura Markdown a partir de un array de mensajes.
export function buildMarkdown(
  messages,
  { dateFormat = "human", compact = false } = {}
) {
  const formattedMessages = messages.map(({ role, timestamp, text }) => {
    const compacted = compact ? compactText(text) : text;
    const body = compact ? compacted : formatQuote(compacted);
    const header = `## ${formatRole(role)} · ${formatDate(timestamp, dateFormat)}`;

    return [header, "", body].join("\n");
  });

  return formattedMessages.join(MESSAGE_SEPARATOR);
}