import { validateArguments } from "../src/utilities/validator.js";

const actions = {
  "-i": {
    group: "input",
    consumes: 1,
  },

  "-o": {
    group: "output",
    consumes: 1,
  },

  "--inspect": {
    group: "inspect",
    consumes: 0,
  },
};

const tests = [
  {
    name: "Argumentos válidos",
    args: ["-i", "test/fixtures/test_data_SMALL.json"],
    shouldThrow: false,
  },

  {
    name: "Opción desconocida",
    args: ["--hola"],
    shouldThrow: true,
  },

  {
    name: "Falta argumento",
    args: ["-i"],
    shouldThrow: true,
  },

  {
    name: "Argumento reemplazado por otra opción",
    args: ["-i", "-o"],
    shouldThrow: true,
  },

  {
    name: "Opción repetida",
    args: ["--inspect", "--inspect"],
    shouldThrow: true,
  },

  {
    name: "Extensión incorrecta de entrada",
    args: ["-i", "input/chat.txt"],
    shouldThrow: true,
  },

  {
    name: "Archivo inexistente",
    args: ["-i", "input/no-existe.json"],
    shouldThrow: true,
  },

  {
    name: "Directorio inexistente",
    args: [
      "-i",
      "input/epistolario_SMALL.json",
      "-o",
      "out/prueba.md",
    ],
    shouldThrow: true,
  },
];

let passed = 0;

for (const test of tests) {
  try {
    validateArguments(test.args, actions);

    if (test.shouldThrow) {
      console.error(`✖ ${test.name}`);
      continue;
    }

    console.log(`✔ ${test.name}`);
    passed++;

  } catch {

    if (!test.shouldThrow) {
      console.error(`✖ ${test.name}`);
      continue;
    }

    console.log(`✔ ${test.name}`);
    passed++;
  }
}

console.log(`\n${passed}/${tests.length} tests superados.`);

if (passed !== tests.length) process.exit(1);

console.log("\n✔ validator.test.js OK");