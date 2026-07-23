// Responsable de interceptar las APIs
// utilizadas por ChatGPT.

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const response = await originalFetch(...args);

  if (response.url.includes("/backend-api/conversation/")) {
    const clone = response.clone();

    try {
      const json = await clone.json();

      console.log("[AI Chat Exporter] Conversación capturada.");
      console.log(json.mapping);
    } catch {
      console.log("[AI Chat Exporter] No se pudo capturar la conversación.");
    }
  }

  return response;
};
