import { formatDate } from "../src/formatter.js";

const timestamp = 1750582900.374667;

console.log("UNIX");
console.log(formatDate(timestamp, "unix"));

console.log("\nISO");
console.log(formatDate(timestamp, "iso"));

console.log("\nHUMAN");
console.log(formatDate(timestamp, "human"));

console.log("\nLOCALE");
console.log(formatDate(timestamp, "locale"));

console.log("\nFORMATO INEXISTENTE");
console.log(formatDate(timestamp, "cualquier-cosa"));