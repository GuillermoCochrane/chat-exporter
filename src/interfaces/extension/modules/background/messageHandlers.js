// Handlers de mensajes del background.
// Centraliza la coordinación entre popup, content y exportación.

import { MSG } from "../constants.js";
import { exportHandlers } from "./exportHandlers.js";
import { sendProgress } from "./progress.js";

let capturedConversation = null;

async function getConversationFromPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    return null;
  }

  const response = await chrome.tabs.sendMessage(tab.id, {
    type: MSG.GET_PAGE,
  });

  return response?.conversation ?? null;
}

export const messageHandlers = {
  [MSG.DOWN]: (message) => {
    capturedConversation = message.conversation;
  },

  [MSG.EXP]: async (message, sendResponse, model = "ChatGPT") => {
    if (message.format === "json" || message.format === "md") {
      sendProgress("processing");

      const conversation = await getConversationFromPage();

      if (!conversation || !conversation.length) {
        sendResponse({
          success: false,
          errorCode: "NO_CONVERSATION",
          params: { model },
        });
        return;
      }

      capturedConversation = conversation;

      try {
        await exportHandlers[message.format](conversation, message);
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({
          success: false,
          errorCode: "PIPELINE_ERROR",
          params: { message: error.message },
        });
      }

      return;
    }

    sendResponse({
      success: false,
      errorCode: "UNKNOWN_FORMAT",
      params: { format: message.format },
    });
  },
};