// Responsable de interceptar fetch y capturar respuestas crudas
// de los endpoints de conversación de ChatGPT.

// ---------------------------------------------------------------------------
// Interceptor pasivo de fetch
// ---------------------------------------------------------------------------

export function captureConversation() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.url.includes("/backend-api/conversations/")) {
      const clone = response.clone();

      try {
        const json = await clone.json();

        window.__AI_CHAT_EXPORTER__ ??= {};
        window.__AI_CHAT_EXPORTER__.conversation ??= [];

        window.__AI_CHAT_EXPORTER__.conversation.push({
          url: response.url,
          data: json,
        });

        window.dispatchEvent(
          new CustomEvent("AI_CHAT_EXPORTER_PAGE_CAPTURED", {
            detail: { url: response.url, data: json },
          })
        );

        window.postMessage(
          {
            source: "AI_CHAT_EXPORTER",
            type: "CONVERSATION",
            conversation: window.__AI_CHAT_EXPORTER__.conversation,
          },
          "*"
        );
      } catch {
        // No se pudo capturar la conversación; se ignora.
      }
    }

    return response;
  };
}