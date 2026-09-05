import { collectViaScroll } from "./scroll.js";
import { SRC, MSG } from "../constants.js";
import { postMsg } from "../postMessage.js";
import { getConversation } from "./state.js";

// Responsable de atender mensajes provenientes del content script
// y responder con la conversación completa cuando corresponda.
export function listenForPageMessages() {
  window.addEventListener("message", async (event) => {
    if (event.source !== window) return;

    if (
      event.data?.source !== SRC ||
      event.data?.type !== MSG.GET
    ) {
      return;
    }

    try {
      const pages = await collectViaScroll();

      postMsg({
        source: SRC,
        type: MSG.DONE,
        conversation: pages,
      });
    } catch {
      postMsg({
        source: SRC,
        type: MSG.DONE,
        conversation: getConversation(),
      });
    }
  });
}