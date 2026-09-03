import { captureConversation } from "./modules/inject/capture.js";
import { listenForPageMessages } from "./modules/inject/messaging.js";

// ---------------------------------------------------------------------------
// Estado inicial de la extensión en el contexto de la página
// ---------------------------------------------------------------------------

window.__AI_CHAT_EXPORTER__ ??= {};
window.__AI_CHAT_EXPORTER__.conversation ??= [];

// ---------------------------------------------------------------------------
// Inicialización
// ---------------------------------------------------------------------------

captureConversation();
listenForPageMessages();