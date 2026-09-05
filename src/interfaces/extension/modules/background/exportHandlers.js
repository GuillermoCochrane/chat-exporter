// Handlers de exportación para JSON y Markdown.
// No conocen el flujo de mensajes, solo reciben la configuración
// y descargan el resultado final.

import { buildDataUrl, downloadFile } from "./download.js";
import { sendProgress } from "./progress.js";

export const exportHandlers = {
  json: async (conversation) => {
    sendProgress("generating", { format: "JSON" });

    const jsonStr = JSON.stringify(conversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");

    sendProgress("downloading");
    await downloadFile(url, "json");
  },

  md: async (conversation, message) => {
    sendProgress("generating", { format: "Markdown" });

    const config = {
      source: "extension",
      conversation,
      compact: message.compact,
      roleFilter: message.roleFilter,

      outputHandler: async (markdown) => {
        const url = buildDataUrl(markdown, "text/markdown");
        sendProgress("downloading");
        await downloadFile(url, "md");
      },
    };

    return globalThis.__AI_CHAT_EXPORTER__.runExporter(config);
  },
};