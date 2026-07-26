import { loadConversation } from "./jsonFile.js";
import { loadConversationFromExtension } from "./extensionSource.js";

// Registro de fuentes de conversación.
// Cada fuente recibe el objeto config completo
// y devuelve una Conversation lista para el pipeline.
export const conversationSources = {
  jsonFile: loadConversation,
  extension: loadConversationFromExtension,
};