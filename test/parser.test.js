import { loadConversation } from "../src/loader.js";
import { extractMessages } from "../src/parser.js";

const tests = [
  {
    name: "Conversación MINI",
    input: "input/epistolario_MINI.json",
    expected: 6,
  },

  {
    name: "Conversación SMALL",
    input: "input/epistolario_SMALL.json",
    expected: 14,
  },
];

let passed = 0;

for (const test of tests) {
  try {
    const conversation = await loadConversation(test.input);
    const messages = extractMessages(conversation);

    if (messages.length !== test.expected) {
      throw new Error(
        `Esperados ${test.expected}, obtenidos ${messages.length}`
      );
    }

    console.log(`✔ ${test.name}`);
    passed++;

  } catch (error) {
    console.error(`✖ ${test.name}`);
    console.error(error.message);
  }
}

console.log(`\n${passed}/${tests.length} tests superados.`);

if (passed !== tests.length) process.exit(1);

console.log("\n✔ parser.test.js OK");