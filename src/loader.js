import { readFile } from "node:fs/promises";

// Carga y deserializa el JSON exportado por ChatGPT.
export async function loadConversation(filePath) {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
}