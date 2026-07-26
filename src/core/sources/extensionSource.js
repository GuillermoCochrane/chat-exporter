// Obtiene una conversación previamente capturada
// desde la extensión de Chrome.
// La conversación viaja dentro del objeto config
// y fue interceptada por el script inyectado.
export async function loadConversationFromExtension(config) {
  if (!config.conversation) {
    throw new Error("No se proporcionó una conversación.");
  }
  return config.conversation;
}