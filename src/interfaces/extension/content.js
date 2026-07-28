// Responsable de inyectar el código capturador y actuar como
// puente entre la página y la extensión.

const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

// Listener permanente: reenvía cualquier conversación capturada al background.
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (
    event.data?.source !== "AI_CHAT_EXPORTER" ||
    event.data?.type !== "CONVERSATION"
  ) {
    return;
  }

  if (!event.data.conversation) {
    console.warn("[AI Chat Exporter] Conversación vacía recibida.");
    return;
  }

  console.log("[AI Chat Exporter] Reenviando conversación al background.");
  chrome.runtime.sendMessage({
    type: "DOWNLOAD_JSON",
    conversation: event.data.conversation,
  });
});