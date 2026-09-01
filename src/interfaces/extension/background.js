// Coordina la extensión: recibe la conversación capturada y
// atiende las solicitudes de exportación del popup.

importScripts("extensionBundle.js");

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
  json: () => {
    const jsonStr = JSON.stringify(capturedConversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");
    return downloadFile(url, "json");
  },

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
// Obtener conversación desde la página activa
// ---------------------------------------------------------------------------

async function getConversationFromPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    return null;
  }

  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "GET_CONVERSATION_FROM_PAGE",
  });

  return response?.conversation ?? null;
}

// ---------------------------------------------------------------------------
// Handlers de mensajes entrantes
// ---------------------------------------------------------------------------

const messageHandlers = {
  DOWNLOAD_JSON: (message) => {
    capturedConversation = message.conversation;
  },

  EXPORT: async (message, sendResponse, model = "ChatGPT") => {
    if (message.format === "json") {
      const conversation = await getConversationFromPage();

      if (!conversation || !conversation.length) {
        sendResponse({
          success: false,
          errorCode: "NO_CONVERSATION",
          params: { model },
        });
        return;
      }

      capturedConversation = conversation;

      try {
        await exportHandlers.json();
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({
          success: false,
          errorCode: "PIPELINE_ERROR",
          params: { message: error.message },
        });
      }

      return;
    }

    if (!capturedConversation) {
      capturedConversation = await getConversationFromPage();
    }

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

    try {
      await handler(message);
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({
        success: false,
        errorCode: "PIPELINE_ERROR",
        params: { message: error.message },
      });
    }
  },
};

// ---------------------------------------------------------------------------
// Listener principal
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = messageHandlers[message.type];

  if (!handler) {
    return;
  }

  Promise.resolve(handler(message, sendResponse)).catch((error) => {
    sendResponse({
      success: false,
      errorCode: "PIPELINE_ERROR",
      params: { message: error.message },
    });
  });

  return true;
});