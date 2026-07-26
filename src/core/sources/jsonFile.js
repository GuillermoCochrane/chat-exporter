import { readFile } from "node:fs/promises";

// Carga y deserializa una conversación desde un archivo JSON.
// Recibe el objeto config completo y extrae únicamente
// la ruta del archivo de entrada.
export async function loadConversation(config) {
  const content = await readFile(config.input, "utf8");
  return JSON.parse(content);
}