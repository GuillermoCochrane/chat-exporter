import { formatDate, formatQuote } from "./formatter.js";

export function buildMarkdown(messages) {
  return messages
    .map(
      (message) => `
## ${message.role === "user" ? "Usuario" : "Asistente"} · ${formatDate(message.timestamp)}

${formatQuote(message.text)}
`,
    )
    .join("\n\n---\n\n");
}
