import { collectViaScroll } from "./scroll.js";

// Responsable de atender mensajes provenientes del content script
// y responder con la conversación completa cuando corresponda.
export function listenForPageMessages() {
  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    if (
      event.data?.source !== "AI_CHAT_EXPORTER" ||
      event.data?.type !== "GET_CONVERSATION"
    ) {
      return;
    }

    try {
      const pages = await collectViaScroll();

      window.postMessage(
        {
          source: "AI_CHAT_EXPORTER",
          type: "CONVERSATION_COMPLETE",
          conversation: pages,
        },
        "*"
      );
    } catch {
      window.postMessage(
        {
          source: "AI_CHAT_EXPORTER",
          type: "CONVERSATION_COMPLETE",
          conversation: window.__AI_CHAT_EXPORTER__.conversation ?? [],
        },
        "*"
      );
    }
  });
}