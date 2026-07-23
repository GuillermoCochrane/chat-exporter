// Responsable de interceptar las APIs
// utilizadas por ChatGPT.

const originalFetch = window.fetch;

// Estado interno de la extensión.
window.__AI_CHAT_EXPORTER__ ??= {};

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  if (response.url.includes("/backend-api/conversation/")) {
    const clone = response.clone();

    try {
      const json = await clone.json();

      console.log("[AI Chat Exporter] JSON completo:", json);
      console.log("[AI Chat Exporter] Tipo:", typeof json);
      console.log("[AI Chat Exporter] Es array:", Array.isArray(json));
      console.log("[AI Chat Exporter] Keys:", Object.keys(json));

      if (json?.mapping) {
        window.__AI_CHAT_EXPORTER__.conversation = json;

        console.log("[AI Chat Exporter] Conversación completa almacenada.");
      } else {
        console.log("[AI Chat Exporter] Respuesta ignorada.");
      }
    } catch {
      console.warn("[AI Chat Exporter] No se pudo capturar la conversación.");
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

  console.log(
    "[AI Chat Exporter] Enviando conversación:",
    window.__AI_CHAT_EXPORTER__.conversation?.mapping ? "OK" : "VACÍA",
  );

  window.postMessage(
    {
      source: "AI_CHAT_EXPORTER",
      type: "CONVERSATION",
      conversation: window.__AI_CHAT_EXPORTER__.conversation ?? null,
    },
    "*",
  );
});
