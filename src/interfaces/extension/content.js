import { SRC, MSG } from "./modules/constants.js";
import { detectProvider } from "./modules/providers.js";

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

// Responde consultas del background.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Consulta del proveedor actual desde la URL de la página.
  if (message.type === "GET_PROVIDER") {
    const provider = detectProvider(window.location.hostname);
    sendResponse({ provider });
    return false;
  }

  // Solicitud de conversación completa desde la página.
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