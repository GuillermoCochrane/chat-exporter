// Transforma los mensajes filtrados al modelo interno del proyecto.
// Elimina la dependencia del formato original de ChatGPT.
export function normalizeMessages(messages) {
  return messages.map((message) => ({
    id: message.id,
    parent: message.parent,
    children: message.children,

    role: message.role,

    text: message.rawContent.parts?.join("\n") ?? "",

    timestamp: message.createTime,
  }));
}