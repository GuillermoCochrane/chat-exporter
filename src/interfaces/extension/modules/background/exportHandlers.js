import { buildDataUrl, downloadFile } from "./download.js";
import { sendProgress } from "./progress.js";
import { notifyDownloadResult } from "./notifications.js";
import { getConversationTitle, buildExportFilename } from "./filename.js";

export const exportHandlers = {
  json: async (conversation, message, provider) => {
    sendProgress("generating", { format: "JSON" });

    const jsonStr = JSON.stringify(conversation, null, 2);
    const url = buildDataUrl(jsonStr, "application/json");

    const title = getConversationTitle(conversation);
    const filenameBase = buildExportFilename(title, provider);

    sendProgress("downloading");
    const result = await downloadFile(url, "json", filenameBase);

    if (!result.success) {
      notifyDownloadResult(result, "json");
      throw new Error(`DOWNLOAD_${result.error ?? "FAILED"}`);
    }

    notifyDownloadResult(result, "json");
  },

  md: async (conversation, message, provider) => {
    sendProgress("generating", { format: "Markdown" });

    const config = {
      source: "extension",
      conversation,
      compact: message.compact,
      roleFilter: message.roleFilter,

      outputHandler: async (markdown) => {
        const url = buildDataUrl(markdown, "text/markdown");

        const title = getConversationTitle(conversation);
        const filenameBase = buildExportFilename(title, provider);

        sendProgress("downloading");
        const result = await downloadFile(url, "md", filenameBase);

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