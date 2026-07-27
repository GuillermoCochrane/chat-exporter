// Responsable de coordinar la extensión
// y delegar la exportación al core.

importScripts("extensionBundle.js");

console.log("[AI Chat Exporter] Background iniciado.");

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, {
    type: "DOWNLOAD_CONVERSATION",
  });
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type !== "DOWNLOAD_JSON") {
    return;
  }

  const config = {
    source: "extension",
    conversation: message.conversation,
    compact: true,

    outputHandler: async (markdown) => {
      const url = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
      await chrome.downloads.download({
        url,
        filename: "conversacion.md",
        saveAs: true,
      });
    },
  };

  try {
    await globalThis.__AI_CHAT_EXPORTER__.runExporter(config);
  } catch (error) {
    console.error("[AI Chat Exporter]", error.message);
  }
});
