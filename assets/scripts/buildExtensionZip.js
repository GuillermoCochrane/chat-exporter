// Script para empaquetar la extensión en un archivo ZIP listo para distribuir.
// Ejecuta el build y luego comprime el directorio dist/.

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const distDir = resolve(root, "dist");
const outputZip = resolve(root, "dist.zip");
const osMessage = process.platform === "win32" ? "Windows" : process.platform === "darwin" ? "macOS" : "Linux/Unix";

console.log(`🖥️  Build para ${osMessage}`);

console.log("▶ Construyendo extensión...");
execSync("npm run build:extension", { cwd: root, stdio: "inherit" });

if (!existsSync(distDir)) {
  console.error("✖ dist/ no encontrada. El build falló.");
  process.exit(1);
}

console.log("▶ Empaquetando ZIP...");

if (process.platform === "win32") {
  execSync(
    `powershell -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${outputZip}' -Force"`,
    { stdio: "inherit" },
  );
} else {
  execSync(`cd "${distDir}" && zip -r "${outputZip}" .`, {
    stdio: "inherit",
  });
}

console.log(`✔ Extensión empaquetada en ${outputZip}`);