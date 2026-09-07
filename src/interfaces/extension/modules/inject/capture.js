import { SRC, MSG, PAGE_CAPTURED } from "../constants.js";
import { postMsg } from "../postMessage.js";
import {
  addPage,
  getConversation,
  getPageCount,
  getActiveConversationId,
  setActiveConversationId,
  resetConversation,
} from "./state.js";

function getConversationIdFromUrl() {
  const match = window.location.pathname.match(/\/c\/([a-f0-9-]+)/i);
  return match?.[1] ?? null;
}

export function captureConversation() {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Detección de cambio de conversación por URL.
    // Solo se considera si la URL actual tiene un id de conversación.
    const currentId = getConversationIdFromUrl();

    if (currentId && currentId !== getActiveConversationId()) {
      resetConversation();
      setActiveConversationId(currentId);
    }

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