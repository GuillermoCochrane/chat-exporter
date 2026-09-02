import { inspectConversation } from "../src/core/inspector.js";
import { conversationSources } from "../src/core/sources/index.js";

const loadConversation = conversationSources.jsonFile;

const conversation = await loadConversation({
  input: "test/fixtures/test_data_paginated_SMALL.json",
});

const { title, rows } = inspectConversation(conversation);

const totalRow = rows.at(-1);

const tests = [
  {
    name: "Devuelve título y filas",
    run: () => typeof title === "string" && Array.isArray(rows),
  },

  {
    name: "La última fila es Total",
    run: () => totalRow["Página"] === "Total",
  },

  {
    name: "Hay una fila por página más la de Total",
    run: () => rows.length === conversation.length + 1,
  },

  {
    name: "Cuenta mensajes de la primera página",
    run: () =>
      rows[0]["Mensajes"] === conversation[0].data.messages.length,
  },

  {
    name: "Los totales coinciden con la suma de las páginas",
    run: () => {
      const sumMessages = conversation.reduce(
        (acc, page) => acc + (page.data.messages?.length ?? 0),
        0,
      );

      return totalRow["Mensajes"] === sumMessages;
    },
  },

  {
    name: "Cuenta roles correctamente en totales",
    run: () => {
      const counters = { user: 0, assistant: 0, system: 0, tool: 0 };

      for (const page of conversation) {
        for (const message of page.data?.messages ?? []) {
          const role = message.author?.role;
          if (role in counters) counters[role]++;
        }
      }

      return (
        totalRow["User"] === counters.user &&
        totalRow["Assistant"] === counters.assistant &&
        totalRow["System"] === counters.system &&
        totalRow["Tool"] === counters.tool
      );
    },
  },

  {
    name: "Cuenta tipos de contenido correctamente en totales",
    run: () => {
      const counters = { text: 0, code: 0, other: 0 };

      for (const page of conversation) {
        for (const message of page.data?.messages ?? []) {
          const type = message.content?.content_type;

          if (type === "text") counters.text++;
          else if (type === "code") counters.code++;
          else counters.other++;
        }
      }

      return (
        totalRow["Texto"] === counters.text &&
        totalRow["Code"] === counters.code &&
        totalRow["Otros"] === counters.other
      );
    },
  },

  {
    name: "Muestra rango de fechas",
    run: () =>
      totalRow["Inicio"] !== "—" && totalRow["Fin"] !== "—",
  },
];

let passed = 0;

for (const test of tests) {
  if (test.run()) {
    console.log(`✔ ${test.name}`);
    passed++;
  } else {
    console.log(`✖ ${test.name}`);
  }
}

console.log(`\n${passed}/${tests.length} tests superados.`);

if (passed !== tests.length) process.exit(1);

console.log("\n✔ inspector.test.js OK");