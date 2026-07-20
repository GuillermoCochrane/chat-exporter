import assert from "node:assert/strict";

import { loadConversation } from "../src/core/loader.js";
import cases from "./cases/loader-cases.js";

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

console.log("✔ Loader carga correctamente archivos válidos.");
console.log("✔ Loader detecta JSON inválido.");
console.log("✔ Loader detecta archivos inexistentes.");
console.log("\n4/4 tests superados.");
console.log("\n✔ loader.test.js OK");