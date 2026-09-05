// Orquestador del background: recibe mensajes y despacha al handler correcto.

import { messageHandlers } from "./modules/background/messageHandlers.js";
import { MSG } from "./modules/constants.js";

importScripts("extensionBundle.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = messageHandlers[message.type];

  if (!handler) {
    return;
  }

  // Solamente EXPORT necesita respuesta asíncrona.
  // El resto de mensajes se procesan sin mantener el canal abierto.
  if (message.type === MSG.EXP) {
    Promise.resolve(handler(message, sendResponse)).catch((error) => {
      sendResponse({
        success: false,
        errorCode: "PIPELINE_ERROR",
        params: { message: error.message },
      });
    });

    return true;
  }

  handler(message);
});