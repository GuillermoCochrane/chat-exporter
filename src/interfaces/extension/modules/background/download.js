// Utilidades de descarga para la extensión.

export const buildDataUrl = (content, mimeType) =>
  `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;

export const downloadFile = (dataUrl, extension) =>
  chrome.downloads.download({
    url: dataUrl,
    filename: `conversation.${extension}`,
    saveAs: true,
  });
