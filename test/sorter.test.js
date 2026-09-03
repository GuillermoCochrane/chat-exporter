import {
  sortMessages,
  sortMessagesSafe,
  sortPagesReverse,
} from "../src/core/sorter.js";

// ------------------------------------------------------------------
// Casos para sortMessages (orden por createTime)
// ------------------------------------------------------------------

const timestampCases = [
  {
    name: "Ordena cronológicamente en modo ascendente",
    input: [
      { id: "b", createTime: 200 },
      { id: "a", createTime: 100 },
      { id: "c", createTime: 300 },
    ],
    expected: ["a", "b", "c"],
  },
  {
    name: "Ordena cronológicamente en modo descendente",
    input: [
      { id: "a", createTime: 100 },
      { id: "c", createTime: 300 },
      { id: "b", createTime: 200 },
    ],
    isAscending: false,
    expected: ["c", "b", "a"],
  },
  {
    name: "Coloca mensajes sin createTime al principio",
    input: [
      { id: "a", createTime: 100 },
      { id: "z", createTime: null },
      { id: "b", createTime: 200 },
    ],
    expected: ["z", "a", "b"],
  },
  {
    name: "No muta el array original",
    input: [
      { id: "b", createTime: 200 },
      { id: "a", createTime: 100 },
    ],
    expected: ["a", "b"],
  },
];

// ------------------------------------------------------------------
// Casos para sortMessagesSafe (corrección por parent_id)
// ------------------------------------------------------------------

const safeCases = [
  {
    name: "Reubica hijo que aparece antes que su padre",
    input: [
      { id: "child", parent: "parent" },
      { id: "parent", parent: null },
    ],
    expected: ["parent", "child"],
  },
  {
    name: "Mantiene orden si no hay conflictos",
    input: [
      { id: "user", parent: null },
      { id: "assistant", parent: "user" },
    ],
    expected: ["user", "assistant"],
  },
  {
    name: "No muta el array original",
    input: [
      { id: "child", parent: "parent" },
      { id: "parent", parent: null },
    ],
    expected: ["parent", "child"],
  },
];

// ------------------------------------------------------------------
// Casos para sortPagesReverse (inversión de páginas)
// ------------------------------------------------------------------

const pageCases = [
  {
    name: "Invierte el array de páginas",
    input: [{ id: "p1" }, { id: "p2" }, { id: "p3" }],
    expected: ["p3", "p2", "p1"],
  },
  {
    name: "No muta el array original",
    input: [{ id: "p1" }, { id: "p2" }],
    expected: ["p2", "p1"],
  },
  {
    name: "Devuelve array vacío si no es un array",
    input: "no-array",
    expected: [],
  },
];

// ------------------------------------------------------------------
// Ejecución
// ------------------------------------------------------------------

let passed = 0;
const totalTests =
  timestampCases.length + safeCases.length + pageCases.length;

function runCase(testCase, sortFn) {
  const original = [...testCase.input];
  const result = sortFn(testCase.input);

  const resultIds = result.map((m) => m.id);
  const expectedIds = testCase.expected;

  if (JSON.stringify(resultIds) !== JSON.stringify(expectedIds)) {
    console.error(`✖ ${testCase.name}`);
    console.error(`  Esperado: ${expectedIds.join(", ")}`);
    console.error(`  Obtenido: ${resultIds.join(", ")}`);
    return false;
  }

  if (testCase.name === "No muta el array original") {
    const originalIds = original.map((m) => m.id);
    if (
      JSON.stringify(originalIds) !==
      JSON.stringify(testCase.input.map((m) => m.id))
    ) {
      console.error(`✖ ${testCase.name}`);
      console.error("  El array original fue mutado.");
      return false;
    }
  }

  console.log(`✔ ${testCase.name}`);
  return true;
}

for (const testCase of timestampCases) {
  if (runCase(testCase, (input) => sortMessages(input, testCase.isAscending ?? true))) {
    passed++;
  }
}

for (const testCase of safeCases) {
  if (runCase(testCase, sortMessagesSafe)) {
    passed++;
  }
}

for (const testCase of pageCases) {
  if (runCase(testCase, sortPagesReverse)) {
    passed++;
  }
}

console.log(`\n${passed}/${totalTests} tests superados.`);

if (passed !== totalTests) process.exit(1);

console.log("\n✔ sorter.test.js OK");