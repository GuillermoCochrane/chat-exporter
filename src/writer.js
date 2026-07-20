import { writeFile } from "node:fs/promises";

// Escribe el contenido generado en un archivo utilizando UTF-8.
export async function writeFileContent(path, content) {
  await writeFile(path, content, "utf8");
}