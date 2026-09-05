import { SRC, MSG } from "./modules/constants.js";

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
    event.data?.source !== SRC ||
    event.data?.type !== MSG.CONV
  ) {
    return;
  }

  if (!event.data.conversation) return;

  try {
    chrome.runtime.sendMessage({
      type: MSG.DOWN,
      conversation: event.data.conversation,
    });
  } catch {
    // Contexto de la extensión invalidado; se ignora.
  }
});

// Reenvía mensajes de progreso emitidos por el script inyectado.
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (
    event.data?.source !== SRC ||
    event.data?.type !== MSG.PROG
  ) {
    return;
  }

  try {
    chrome.runtime.sendMessage({
      type: MSG.PROG,
      stage: event.data.stage,
      data: event.data.data,
    });
  } catch {
    // Contexto de la extensión invalidado; se ignora.
  }
});

// Atiende solicitudes del background para obtener la conversación
// directamente desde la página.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== MSG.GET_PAGE) return;

  window.postMessage(
    {
      source: SRC,
      type: MSG.GET,
    },
    "*"
  );

  const listener = (event) => {
    if (event.source !== window) return;

    if (
      event.data?.source === SRC &&
      event.data?.type === MSG.DONE
    ) {
      window.removeEventListener("message", listener);
      sendResponse({ conversation: event.data.conversation });
    }
  };

  window.addEventListener("message", listener);
  return true;
});