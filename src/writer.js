import { writeFile } from "node:fs/promises";

export async function writeFileContent(path, content) {
  await writeFile(path, content, "utf8");
}