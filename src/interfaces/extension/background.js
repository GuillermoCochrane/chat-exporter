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
// ---------------------------------------------------------------------------

const exportHandlers = {
  // Descarga el JSON original sin procesar.
  json: () => {
    const jsonStr = JSON.stringify(capturedConversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");
    return downloadFile(url, "json");
  },

  // Procesa la conversación con el pipeline y descarga Markdown.
  md: async () => {
    const config = {
      source: "extension",
      conversation: capturedConversation,
      compact: true,

      outputHandler: async (markdown) => {
        const url = buildDataUrl(markdown, "text/markdown");
        await downloadFile(url, "md");
      },
    };

    await globalThis.__AI_CHAT_EXPORTER__.runExporter(config);
  },
};

// ---------------------------------------------------------------------------
// Handlers de mensajes entrantes
// ---------------------------------------------------------------------------

const messageHandlers = {
  // El content script envía la conversación recién capturada.
  DOWNLOAD_JSON: (message) => {
    capturedConversation = message.conversation;
    console.log("[AI Chat Exporter] Conversación almacenada.");
  },

  // El popup solicita una exportación.
  EXPORT: (message, sendResponse) => {
    if (!capturedConversation) {
      sendResponse({
        success: false,
        error: "No hay conversación capturada.",
      });
      return;
    }

    const handler = exportHandlers[message.format];
    if (!handler) {
      sendResponse({
        success: false,
        error: `Formato desconocido: ${message.format}`,
      });
      return;
    }

    // Ejecutar el handler (síncrono o asíncrono)
    Promise.resolve(handler())
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error("[AI Chat Exporter]", error);
        sendResponse({ success: false, error: error.message });
      });

    // Mantiene el canal abierto para respuesta asíncrona
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