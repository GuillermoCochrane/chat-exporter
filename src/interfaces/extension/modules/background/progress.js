// Utilidades de progreso para comunicar estados al popup.

import { MSG } from "../constants.js";

export function sendProgress(stage, data = {}) {
  chrome.runtime.sendMessage({
    type: MSG.PROG,
    stage,
    data,
  });
}