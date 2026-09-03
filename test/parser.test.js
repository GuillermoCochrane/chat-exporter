import { conversationSources } from "../src/core/sources/index.js";
import { extractMessages } from "../src/core/parser.js";

const loadConversation = conversationSources.jsonFile;

const tests = [
  {
    name: "Conversación paginada SMALL",
    input: "test/fixtures/test_data_paginated_SMALL.json",
    expectedCount: 6,

    assertions(messages) {
      return [
        // cantidad esperada
        messages.length === this.expectedCount,

        // roles en el orden original de páginas
        messages[0].role === "user",      // user-1
        messages[1].role === "assistant", // assistant-1
        messages[2].role === "system",    // system-1
        messages[3].role === "user",      // user-2
        messages[4].role === "assistant", // assistant-2
        messages[5].role === "tool",      // tool-1

        // ids
        messages[0].id === "user-1",
        messages[5].id === "tool-1",

        // parent desde metadata.parent_id
        messages[0].parent === null,
        messages[1].parent === "user-1",
        messages[2].parent === null,
        messages[3].parent === "assistant-1",
        messages[4].parent === "user-2",
        messages[5].parent === null,

        // children siempre array
        messages.every((m) => Array.isArray(m.children)),

        // metadata siempre objeto
        messages.every((m) => typeof m.metadata === "object"),

        // propiedades siempre presentes
        messages.every((m) => "rawContent" in m),
        messages.every((m) => "createTime" in m),
        messages.every((m) => "status" in m),

        // contenido intacto
        messages[0].rawContent.parts[0] === "Hola",
        messages[2].rawContent.content_type === "model_editable_context",
        messages[5].rawContent.content_type === "code",
        messages[5].rawContent.text === "console.log('test')",
      ];
    },
  },
];

let passed = 0;

for (const test of tests) {
  try {
    const conversation = await loadConversation({ input: test.input });
    const messages = extractMessages(conversation);

    if (messages.length !== test.expectedCount) {
      throw new Error(
        `Esperados ${test.expectedCount}, obtenidos ${messages.length}`,
      );
    }

    const results = test.assertions(messages);

    if (results.some((result) => !result)) {
      throw new Error("Alguna aserción falló.");
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