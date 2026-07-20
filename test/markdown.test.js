import assert from "node:assert/strict";

import { buildMarkdown } from "../src/core/markdown.js";
import { formatDate } from "../src/utilities/formatter.js";
import cases from "./cases/markdown-cases.js";

const output = buildMarkdown(cases, {
  dateFormat: "locale",
});

const expected = [
`## Usuario · ${formatDate(cases[0].timestamp, "locale")}`,

`> Hola
> 
> ¿Cómo va todo?`,

`## Asistente · ${formatDate(cases[1].timestamp, "locale")}`,

`> Muy bien.`
].join("\n\n");

assert.equal(output.trim(), expected.trim());

console.log("✔ Documento Markdown generado correctamente");
console.log("\n1/1 tests superados.");
console.log("\n✔ markdown.test.js OK");