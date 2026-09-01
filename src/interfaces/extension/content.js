// Responsable de inyectar el código capturador y actuar como
// puente entre la página y la extensión.

const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Reenvía automáticamente cualquier conversación capturada al background.
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (
    event.data?.source !== "AI_CHAT_EXPORTER" ||
    event.data?.type !== "CONVERSATION"
  ) {
    return;
  }

  if (!event.data.conversation) return;

  chrome.runtime.sendMessage({
    type: "DOWNLOAD_JSON",
    conversation: event.data.conversation,
  });
});

// Atiende solicitudes del background para obtener la conversación
// directamente desde la página.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "GET_CONVERSATION_FROM_PAGE") return;

  window.postMessage(
    {
      source: "AI_CHAT_EXPORTER",
      type: "GET_CONVERSATION",
    },
    "*"
  );

  const listener = (event) => {
    if (event.source !== window) return;

    if (
      event.data?.source === "AI_CHAT_EXPORTER" &&
      event.data?.type === "CONVERSATION_COMPLETE"
    ) {
      window.removeEventListener("message", listener);
      sendResponse({ conversation: event.data.conversation });
    }
  };

  window.addEventListener("message", listener);
  return true;
});