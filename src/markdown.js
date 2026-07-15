import { formatDate, formatQuote } from "./formatter.js";

export function buildMarkdown(messages, options = {}) {
  const { dateFormat = "human" } = options;

  return messages
    .map(
      (message) => `
## ${message.role === "user" ? "Usuario" : "Asistente"} · ${formatDate(message.timestamp, dateFormat)}

${formatQuote(message.text)}
`,
    )
    .join("\n\n---\n\n");
}