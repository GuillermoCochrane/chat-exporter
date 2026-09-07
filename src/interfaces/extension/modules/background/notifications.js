// Utilidades de notificación para informar al usuario
// cuando una descarga finalizó correctamente o falló.

function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon128.png"),
    title,
    message,
  });
}

export function notifyDownloadResult(result, format) {
  if (result.success) {
    notify(
      "Exportación exitosa",
      `Tu archivo ${format.toUpperCase()} se descargó correctamente.`,
    );
    return;
  }

  const reason =
    result.error === "USER_CANCELED"
      ? "cancelada por el usuario."
      : `falló: ${result.error || "desconocido"}.`;

  notify("Exportación interrumpida", `La descarga fue ${reason}`);
}