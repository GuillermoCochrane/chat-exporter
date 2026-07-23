// Responsable de coordinar la extensión
// y responder a las acciones del usuario.

console.log("[AI Chat Exporter] Background iniciado.");

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, {
    type: "DOWNLOAD_CONVERSATION",
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "DOWNLOAD_JSON") {
    return;
  }

  const json = JSON.stringify(message.conversation, null, 2);

  const url = "data:application/json;charset=utf-8," + encodeURIComponent(json);

  chrome.downloads.download({
    url,
    filename: "conversation.json",
    saveAs: true,
  });
});
