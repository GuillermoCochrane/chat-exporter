// Script de build para la extensión de Chrome.
// Empaqueta el core usando esbuild y copia los archivos estáticos a dist/.

import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const outDir = resolve(root, "dist");

// Crear directorio de salida
mkdirSync(outDir, { recursive: true });

// Plugin para reemplazar jsonFile.js por su stub en el bundle de la extensión
const stubPlugin = {
  name: "stub-json-file",
  setup(build) {
    build.onResolve({ filter: /\/jsonFile\.js$/ }, (args) => {
      if (args.path.includes("jsonFile.stub")) return null;
      return {
        path: resolve(args.resolveDir, "jsonFile.stub.js"),
      };
    });
  },
};

// Empaquetar el core con esbuild
await esbuild.build({
  entryPoints: ["src/interfaces/extension/extensionCore.js"],
  bundle: true,
  format: "iife",
  outfile: "dist/extensionBundle.js",
  plugins: [stubPlugin],
  absWorkingDir: root,
});

// Copia recursiva de directorios
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Copiar archivos estáticos de la extensión
const staticFiles = [
  "manifest.json",
  "background.js",
  "content.js",
  "inject.js",
  "popup.html",
];

for (const file of staticFiles) {
  copyFileSync(
    resolve(root, "src/interfaces/extension", file),
    resolve(outDir, file),
  );
}

// Copiar estilos modulares
copyDir(
  resolve(root, "src/interfaces/extension/styles"),
  resolve(outDir, "styles"),
);

// Copiar scripts del popup
copyDir(
  resolve(root, "src/interfaces/extension/js"),
  resolve(outDir, "js"),
);

// Copiar íconos
const iconsDir = resolve(root, "src/interfaces/extension/icons");
const outIconsDir = resolve(outDir, "icons");
mkdirSync(outIconsDir, { recursive: true });
for (const icon of ["icon16.png", "icon32.png", "icon48.png", "icon128.png"]) {
  copyFileSync(resolve(iconsDir, icon), resolve(outIconsDir, icon));
}

console.log("✔ Extensión construida en dist/");