import assert from "node:assert/strict";

import { conversationSources } from "../src/core/sources/index.js";
import cases from "./cases/loader-cases.js";

const loadConversation = conversationSources.jsonFile;

// jsonFile extrae config.input internamente.
const data = await loadConversation({ input: cases.PAGINATED });

assert.ok(Array.isArray(data));
assert.ok(data.length > 0);
assert.ok(data[0].data.messages.length > 0);

await assert.rejects(
  loadConversation({ input: cases.INVALID }),
  SyntaxError,
);

await assert.rejects(
  loadConversation({ input: cases.MISSING }),
);

console.log("✔ JsonFileSource carga correctamente una conversación paginada.");
console.log("✔ JsonFileSource detecta JSON inválido.");
console.log("✔ JsonFileSource detecta archivos inexistentes.");
console.log("\n4/4 tests superados.");
console.log("\n✔ jsonFileSource.test.js OK");