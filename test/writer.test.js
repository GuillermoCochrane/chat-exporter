import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";

import { writeFileContent } from "../src/core/writer.js";
import testCase from "./cases/writer-cases.js";

await writeFileContent(testCase.outputPath, testCase.content);

const output = await readFile(testCase.outputPath, "utf8");

assert.equal(output, testCase.content);

await rm(testCase.outputPath);

console.log("✔ Writer escribe correctamente el archivo.");
console.log("\n1/1 tests superados.");
console.log("\n✔ writer.test.js OK");