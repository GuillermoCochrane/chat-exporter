import { SRC, MSG, PAGE_CAPTURED } from "../constants.js";
import { postMsg } from "../postMessage.js";
import { addPage, getConversation, getPageCount } from "./state.js";

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

        const page = {
          url: response.url,
          data: json,
        };

        addPage(page);

        window.dispatchEvent(
          new CustomEvent(PAGE_CAPTURED, {
            detail: page,
          })
        );

        postMsg({
          source: SRC,
          type: MSG.CONV,
          conversation: getConversation(),
        });

        postMsg({
          source: SRC,
          type: MSG.PROG,
          stage: "collecting",
          data: { pageCount: getPageCount() },
        });
      } catch {
        // No se pudo capturar la conversación; se ignora.
      }
    }

    return response;
  };
}