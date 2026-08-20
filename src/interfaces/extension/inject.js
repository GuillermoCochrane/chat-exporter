// Responsable de interceptar las APIs utilizadas por ChatGPT.

const originalFetch = window.fetch;

// Estado interno de la extensión.
window.__AI_CHAT_EXPORTER__ ??= {};

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  if (response.url.includes("/backend-api/conversation/")) {
    const clone = response.clone();

    try {
      const json = await clone.json();

      if (json?.mapping) {
        window.__AI_CHAT_EXPORTER__.conversation = json;

        // Enviar automáticamente la conversación capturada al content script
        window.postMessage(
          {
            source: "AI_CHAT_EXPORTER",
            type: "CONVERSATION",
            conversation: json,
          },
          "*",
        );
      }
    } catch {
      // No se pudo capturar la conversación; se ignora.
    }
  }

  return response;
};

// Atiende solicitudes provenientes del content script.
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (
    event.data?.source !== "AI_CHAT_EXPORTER" ||
    event.data?.type !== "GET_CONVERSATION"
  ) {
    return;
  }

  window.postMessage(
    {
      source: "AI_CHAT_EXPORTER",
      type: "CONVERSATION",
      conversation: window.__AI_CHAT_EXPORTER__.conversation ?? null,
    },
    "*",
  );
});