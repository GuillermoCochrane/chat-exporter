// Coordina la extensión: recibe la conversación capturada y
// atiende las solicitudes de exportación del popup.

importScripts("extensionBundle.js");

console.log("[AI Chat Exporter] Background iniciado.");

// ---------------------------------------------------------------------------
// Estado interno
// ---------------------------------------------------------------------------

let capturedConversation = null;

// ---------------------------------------------------------------------------
// Utilidades de descarga
// ---------------------------------------------------------------------------

const buildDataUrl = (content, mimeType) =>
  `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;

const downloadFile = (dataUrl, extension) =>
  chrome.downloads.download({
    url: dataUrl,
    filename: `conversation.${extension}`,
    saveAs: true,
  });

// ---------------------------------------------------------------------------
// Handlers de formato de exportación
// Cada handler recibe el mensaje completo del popup y extrae lo que necesita.
// ---------------------------------------------------------------------------

const exportHandlers = {
  // Descarga el JSON original sin procesar.
  json: (message) => {
    const jsonStr = JSON.stringify(capturedConversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");
    return downloadFile(url, "json");
  },

  // Procesa la conversación con el pipeline y descarga Markdown.
  md: (message) => {
    const config = {
      source: "extension",
      conversation: capturedConversation,
      compact: message.compact,
      roleFilter: message.roleFilter,

      outputHandler: async (markdown) => {
        const url = buildDataUrl(markdown, "text/markdown");
        await downloadFile(url, "md");
      },
    };

    return globalThis.__AI_CHAT_EXPORTER__.runExporter(config);
  },
};

// ---------------------------------------------------------------------------
// Handlers de mensajes entrantes
// ---------------------------------------------------------------------------

// Handlers de mensajes entrantes
const messageHandlers = {
  DOWNLOAD_JSON: (message) => {
    capturedConversation = message.conversation;
    console.log("[AI Chat Exporter] Conversación almacenada.");
  },

  EXPORT: (message, sendResponse, model = "ChatGPT") => {
    if (!capturedConversation) {
      sendResponse({
        success: false,
        errorCode: "NO_CONVERSATION",
        params: { model },
      });
      return;
    }

    const handler = exportHandlers[message.format];
    if (!handler) {
      sendResponse({
        success: false,
        errorCode: "UNKNOWN_FORMAT",
        params: { format: message.format },
      });
      return;
    }

    Promise.resolve(handler(message))
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error("[AI Chat Exporter]", error);
        // Error inesperado del pipeline: enviamos el mensaje original como fallback
        sendResponse({
          success: false,
          errorCode: "PIPELINE_ERROR",
          params: { message: error.message },
        });
      });

    return true;
  },
};

// ---------------------------------------------------------------------------
// Listener principal
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = messageHandlers[message.type];
  if (!handler) return;

  return handler(message, sendResponse);
});