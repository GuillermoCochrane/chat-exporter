// Servicio para obtener el proveedor detectado desde la pestaña activa.

export async function getProviderFromActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) return "Unknown";

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_PROVIDER",
    });

    return response?.provider ?? "Unknown";
  } catch {
    return "Unknown";
  }
}