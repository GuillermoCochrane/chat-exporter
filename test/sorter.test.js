import { sortMessages } from "../src/core/sorter.js";

const cases = [
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

let passed = 0;

for (const testCase of cases) {
  const original = [...testCase.input];
  const result = sortMessages(testCase.input, testCase.isAscending ?? true);

  const resultIds = result.map((m) => m.id);
  const expectedIds = testCase.expected;

  if (JSON.stringify(resultIds) !== JSON.stringify(expectedIds)) {
    console.error(`✖ ${testCase.name}`);
    console.error(`  Esperado: ${expectedIds.join(", ")}`);
    console.error(`  Obtenido: ${resultIds.join(", ")}`);
    continue;
  }

  if (testCase.name === "No muta el array original") {
    const originalIds = original.map((m) => m.id);
    if (JSON.stringify(originalIds) !== JSON.stringify(testCase.input.map((m) => m.id))) {
      console.error(`✖ ${testCase.name}`);
      console.error("  El array original fue mutado.");
      continue;
    }
  }

  console.log(`✔ ${testCase.name}`);
  passed++;
}

console.log(`\n${passed}/${cases.length} tests superados.`);

if (passed !== cases.length) process.exit(1);

console.log("\n✔ sorter.test.js OK");