// Valid actions for the command-line arguments
export function validateArguments(args, actions) {
  for (const arg of args) {
    if (!arg.startsWith("-")) continue;
    if (!(arg in actions)) throw new Error(` Opción desconocida: ${arg}`);
  }
}