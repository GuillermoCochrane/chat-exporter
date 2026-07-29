import { filterConversationMessages } from "../src/core/filter.js";
import testCases from "./cases/filter-cases.js";

// ------------------------------------------------------------------
// Batería 1 – targetRole = "all" (comportamiento por defecto)
// ------------------------------------------------------------------
const resultAll = filterConversationMessages(testCases, "all");

const assertionsAll = [
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

// ------------------------------------------------------------------
// Batería 2 – targetRole = "user"
// ------------------------------------------------------------------
const resultUser = filterConversationMessages(testCases, "user");

const assertionsUser = [
  {
    description: "[user] Solo hay mensajes del usuario",
    test: (result) => result.length > 0 && result.every((m) => m.role === "user"),
  },
];

// ------------------------------------------------------------------
// Batería 3 – targetRole = "assistant"
// ------------------------------------------------------------------
const resultAssistant = filterConversationMessages(testCases, "assistant");

const assertionsAssistant = [
  {
    description: "[assistant] Solo hay mensajes del asistente",
    test: (result) =>
      result.length > 0 && result.every((m) => m.role === "assistant"),
  },
];

// ------------------------------------------------------------------
// Ejecución
// ------------------------------------------------------------------
let passed = 0;
const totalAssertions =
  assertionsAll.length + assertionsUser.length + assertionsAssistant.length;

for (const assertion of assertionsAll) {
  if (assertion.test(resultAll)) {
    console.log(`✔ ${assertion.description}`);
    passed++;
  } else {
    console.log(`✖ ${assertion.description}`);
  }
}

for (const assertion of assertionsUser) {
  if (assertion.test(resultUser)) {
    console.log(`✔ ${assertion.description}`);
    passed++;
  } else {
    console.log(`✖ ${assertion.description}`);
  }
}

for (const assertion of assertionsAssistant) {
  if (assertion.test(resultAssistant)) {
    console.log(`✔ ${assertion.description}`);
    passed++;
  } else {
    console.log(`✖ ${assertion.description}`);
  }
}

console.log(`\n${passed}/${totalAssertions} tests superados.`);

if (passed !== totalAssertions) {
  process.exit(1);
}

console.log("\n✔ filter.test.js OK");