import { readFile } from "node:fs/promises";

export async function loadConversation(filePath) {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
}