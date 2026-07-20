import { filterConversationMessages } from "../src/core/filter.js";
import testCases from "./cases/filter-cases.js";

const assertions = [
  {
    description: "Solo conserva dos mensajes",
    test: (result) => result.length === 2,
  },

  {
    description: "Todos los mensajes son user o assistant",
    test: (result) =>
      result.every((m) => ["user", "assistant"].includes(m.role)),
  },

  {
    description: "Todo el contenido es de tipo text",
    test: (result) =>
      result.every((m) => m.rawContent.content_type === "text"),
  },
];

const result = filterConversationMessages(testCases);

let passed = 0;

for (const assertion of assertions) {
  if (assertion.test(result)) {
    console.log(`✔ ${assertion.description}`);
    passed++;
  } else {
    console.log(`✖ ${assertion.description}`);
  }
}

console.log(`\n${passed}/${assertions.length} tests superados.`);

if (passed !== assertions.length) {
  process.exit(1);
}

console.log("\n✔ filter.test.js OK");