// Utilidades de descarga para la extensión.
// `downloadFile` espera a que Chrome confirme que el archivo terminó
// de descargarse antes de resolver la promesa.

const downloadResolvers = new Map();

// Listener global para despertar al service worker ante cambios
// en el estado de las descargas.
chrome.downloads.onChanged.addListener((delta) => {
  if (!delta.state) return;

  const state = delta.state.current;

  if (state === "complete" || state === "interrupted") {
    const resolve = downloadResolvers.get(delta.id);

    if (!resolve) return;

    downloadResolvers.delete(delta.id);

    const success = state === "complete";
    const error = delta.error?.current ?? null;

    resolve({ success, state, error });
  }
});

export const buildDataUrl = (content, mimeType) =>
  `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;

// Inicia una descarga y espera hasta que finalice o falle.
// Devuelve:
//   { success: true, state: "complete", error: null }
//   { success: false, state: "interrupted", error: "USER_CANCELED" | ... }
export function downloadFile(dataUrl, extension) {
  return new Promise((resolve) => {
    chrome.downloads.download(
      {
        url: dataUrl,
        filename: `conversation.${extension}`,
        saveAs: true,
      },
      (downloadId) => {
        if (chrome.runtime.lastError || downloadId === undefined) {
          resolve({
            success: false,
            state: "interrupted",
            error: chrome.runtime.lastError?.message ?? "DOWNLOAD_START_FAILED",
          });
          return;
        }

        downloadResolvers.set(downloadId, resolve);
      },
    );
  });
}