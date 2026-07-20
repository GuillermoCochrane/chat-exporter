import assert from "node:assert/strict";
import { formatDate, formatQuote } from "../src/utilities/formatter.js";

const timestamp = 1750582900.374667;

// formatDate
assert.equal(formatDate(timestamp, "unix"), timestamp);

assert.equal(
  formatDate(timestamp, "iso"),
  "2025-06-22 09:01:40"
);

assert.equal(
  formatDate(timestamp, "cualquier-cosa"),
  formatDate(timestamp, "human")
);

// locale
assert.notEqual(
  formatDate(timestamp, "locale", "es-AR"),
  formatDate(timestamp, "locale", "en-US")
);

// formatQuote
assert.equal(
  formatQuote("Hola"),
  "> Hola"
);

assert.equal(
  formatQuote("Hola\nMundo"),
  "> Hola\n> Mundo"
);

console.log("✔ formatter.test.js OK");