import { POST_MESSAGE_ORIGIN } from "./constants.js";

// Envía un mensaje a la página mediante postMessage.
export function postMsg(message) {
  window.postMessage(message, POST_MESSAGE_ORIGIN);
}