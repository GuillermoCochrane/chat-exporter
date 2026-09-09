import { setText } from './utilities/dom.js';

// Actualiza el nombre del proveedor en el encabezado del popup.
export async function providerHandler() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "GET_PROVIDER",
    });

    const provider = response?.provider ?? "ChatGPT";

    setText("#modelName", provider);
  } catch {
    setText("#modelName", "ChatGPT");
  }
}