import cases from "./cases/normalizer-cases.js";
import { normalizeMessages } from "../src/normalizer.js";

const normalized = normalizeMessages(cases);

const tests = [
  {
    name: "Conserva la cantidad de mensajes",
    run: () => normalized.length === cases.length,
  },

  {
    name: "Concatena correctamente las partes del mensaje",
    run: () => normalized[0].text === "Hola\nMundo",
  },

  {
    name: "Conserva el timestamp",
    run: () => normalized[0].timestamp === 123456789,
  },

  {
    name: "Genera texto vacío cuando no existen partes",
    run: () => normalized[2].text === "",
  },

  {
    name: "Conserva la estructura del mensaje",
    run: () =>
      normalized.every(
        (m) =>
          "id" in m &&
          "parent" in m &&
          "children" in m &&
          "role" in m &&
          "text" in m &&
          "timestamp" in m
      ),
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

console.log("\n✔ normalizer.test.js OK");