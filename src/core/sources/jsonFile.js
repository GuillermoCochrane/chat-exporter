import { readFile } from "node:fs/promises";

// Carga y deserializa una conversación desde un archivo JSON.
export async function loadJsonFileConversation(filePath) {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
}