// Registro de mensajes de validación.
// Centraliza todos los textos mostrados al usuario.
const validatorMessages = {
  unknownOption: (option) => ` Opción desconocida: ${option}`,

  missingValue: (option) => ` La opción "${option}" requiere un valor.`,

  invalidExtension: (file, type) => ` El archivo de ${type === "input" ? "entrada" : "salida"} "${file}" debe tener extensión "${type === "input" ? ".json" : ".md"}".`,
};

// Lanza un Error utilizando el mensaje correspondiente.
function throwValidationError(type, ...args) {
  throw new Error(validatorMessages[type](...args));
}

// Validaciones de la interfaz de línea de comandos.
export function validateArguments(args, actions) {
  for (const [index, arg] of args.entries()) {
    if (!arg.startsWith("-")) continue;

    // Opciones validas
    if (!(arg in actions)) throwValidationError("unknownOption", arg);
    

    const action = actions[arg];
    const value = args[index + action.consumes];

    // Parámetros requeridos para la acción.
    if (action.consumes > 0 && (value === undefined || value.startsWith("-")))  throwValidationError("missingValue", arg);

    // Extensión esperada.
    if ((arg === "-i" || arg === "--input") && !value.endsWith(".json") ) throwValidationError("invalidExtension", value, "input");
    if ((arg === "-o" || arg === "--output") && !value.endsWith(".md")) throwValidationError("invalidExtension", value, "output");
  }
}