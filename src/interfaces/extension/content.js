// Responsable de comunicarse con la página,
// inyectar el código necesario y actuar como
// puente entre la extensión y la página.

const script = document.createElement("script");

script.src = chrome.runtime.getURL("inject.js");

script.onload = () => script.remove();

(document.head || document.documentElement).appendChild(script);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "DOWNLOAD_CONVERSATION") {
    return;
  }

  window.postMessage(
    {
      source: "AI_CHAT_EXPORTER",
      type: "GET_CONVERSATION",
    },
    "*",
  );

  const listener = (event) => {
    if (event.source !== window) return;

    if (
      event.data?.source !== "AI_CHAT_EXPORTER" ||
      event.data?.type !== "CONVERSATION"
    ) {
      return;
    }

    window.removeEventListener("message", listener);

    if (!event.data.conversation) {
      console.warn("[AI Chat Exporter] No hay una conversación capturada.");
      return;
    }

    console.log(
      "[AI Chat Exporter] Recibido desde inject:",
      event.data.conversation,
    );

    chrome.runtime.sendMessage({
      type: "DOWNLOAD_JSON",
      conversation: event.data.conversation,
    });
  };

  window.addEventListener("message", listener);
});
