import { loadConversation } from "../src/loader.js";
import { extractMessages } from "../src/parser.js";

const tests = [
  {
    name: "Conversación MINI",
    input: "test/fixtures/test_data_MINI.json",
    expectedCount: 6,

    assertions(messages) {
      return [
        // cantidad esperada
        messages.length === this.expectedCount,

        // orden
        messages[0].role === "system",
        messages[1].role === "user",
        messages[2].role === "user",
        messages[3].role === "assistant",
        messages[4].role === "user",
        messages[5].role === "assistant",

        // ids
        messages[0].id === "system-1",
        messages[5].id === "assistant-2",

        // relaciones del árbol
        messages[0].parent === "root",
        messages[2].parent === "context-1",
        messages[5].parent === "user-2",

        // children siempre array
        messages.every(m => Array.isArray(m.children)),

        // metadata siempre objeto
        messages.every(m => typeof m.metadata === "object"),

        // propiedades siempre presentes
        messages.every(m => "rawContent" in m),
        messages.every(m => "createTime" in m),
        messages.every(m => "status" in m),

        // contenido intacto
        messages[2].rawContent.content_type === "text",
        messages[5].rawContent.parts[0].includes("pipeline funciona correctamente")
      ];
    }
  },

  {
    name: "Conversación SMALL",
    input: "test/fixtures/test_data_SMALL.json",
    expectedCount: 14,

    assertions(messages) {
      return [
        // cantidad
        messages.length === this.expectedCount,

        // roles esperados
        messages[0].role === "system",
        messages[1].role === "user",

        // assistants consecutivos
        messages[5].role === "assistant",
        messages[6].role === "assistant",

        // users consecutivos
        messages[7].role === "user",
        messages[8].role === "user",

        // ids extremos
        messages[0].id === "system",
        messages[13].id === "assistant-8",

        // estructura
        messages.every(m => m.id),
        messages.every(m => Array.isArray(m.children)),
        messages.every(m => typeof m.metadata === "object"),
        messages.every(m => "rawContent" in m),

        // el parser NO modifica contenido
        messages[9].rawContent.parts[0].includes("# Encabezado"),
        messages[13].rawContent.parts[0] === "Fin de la conversación de prueba."
      ];
    }
  }
];

let passed = 0;

for (const test of tests) {
  try {
    const conversation = await loadConversation(test.input);
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
