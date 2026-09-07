// Handlers de exportación para JSON y Markdown.
// No conocen el flujo de mensajes, solo reciben la configuración
// y descargan el resultado final.

import { buildDataUrl, downloadFile } from "./download.js";
import { sendProgress } from "./progress.js";
import { notifyDownloadResult } from "./notifications.js";

export const exportHandlers = {
  json: async (conversation) => {
    sendProgress("generating", { format: "JSON" });

    const jsonStr = JSON.stringify(conversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");

    sendProgress("downloading");
    const result = await downloadFile(url, "json");

    if (!result.success) {
      notifyDownloadResult(result, "json");
      throw new Error(`DOWNLOAD_${result.error ?? "FAILED"}`);
    }

    notifyDownloadResult(result, "json");
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
        const result = await downloadFile(url, "md");

        if (!result.success) {
          notifyDownloadResult(result, "md");
          throw new Error(`DOWNLOAD_${result.error ?? "FAILED"}`);
        }

        notifyDownloadResult(result, "md");
      },
    };

    return globalThis.__AI_CHAT_EXPORTER__.runExporter(config);
  },
};