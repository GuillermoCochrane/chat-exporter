import { messageHandlers } from "./modules/background/messageHandlers.js";
import { getProviderFromActiveTab } from "./modules/background/providerService.js";
import { MSG } from "./modules/constants.js";

importScripts("extensionBundle.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Consulta de proveedor desde el popup.
  if (message.type === "GET_PROVIDER") {
    getProviderFromActiveTab().then((provider) => {
      sendResponse({ provider });
    });

    return true;
  }

  const handler = messageHandlers[message.type];

  if (!handler) {
    return;
  }

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