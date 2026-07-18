// Roles que representan mensajes visibles de la conversación.
const VALID_ROLES = new Set(["user", "assistant"]);

// Filtra únicamente los mensajes conversacionales.
//
// Conserva únicamente:
// - mensajes del usuario
// - mensajes del asistente
// - contenido textual
//
// Descarta:
// - system
// - tool
// - developer
// - contextos internos
// - cualquier contenido que no sea texto
export function filterConversationMessages(messages) {
  return messages.filter(
    ({ role, rawContent }) =>
      VALID_ROLES.has(role) && rawContent?.content_type === "text",
  );
}