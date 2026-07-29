// Roles que representan mensajes visibles de la conversación.
const VALID_ROLES = new Set(["user", "assistant"]);

// Filtra los mensajes conversacionales.
//
// - Conserva únicamente mensajes con rol user o assistant
//   y contenido de tipo text.
// - Si se especifica targetRole ("user" o "assistant"),
//   se descartan los mensajes del otro rol.
//
// Devuelve un nuevo array con los mensajes que cumplen las condiciones.
export function filterConversationMessages(messages, targetRole = "all") {
  const filtered = messages.filter(
    ({ role, rawContent }) =>
      VALID_ROLES.has(role) && rawContent?.content_type === "text",
  );

  if (targetRole === "all") return filtered;

  return filtered.filter(({ role }) => role === targetRole);
}