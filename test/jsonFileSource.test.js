import assert from "node:assert/strict";

import { conversationSources } from "../src/core/sources/index.js";
import cases from "./cases/loader-cases.js";

const loadConversation = conversationSources.jsonFile;

for (const fixture of [cases.MINI, cases.SMALL]) {
  const data = await loadConversation(fixture);

  assert.equal(typeof data, "object");
  assert.ok(data.mapping);
}

await assert.rejects(
  loadConversation(cases.INVALID),
  SyntaxError,
);

await assert.rejects(
  loadConversation(cases.MISSING),
);

console.log("✔ JsonFileSource carga correctamente archivos válidos.");
console.log("✔ JsonFileSource detecta JSON inválido.");
console.log("✔ JsonFileSource detecta archivos inexistentes.");
console.log("\n4/4 tests superados.");
console.log("\n✔ jsonFileSource.test.js OK");