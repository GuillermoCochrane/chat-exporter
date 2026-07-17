// Registro de mensajes de validación.
// Centraliza todos los textos mostrados al usuario.
const validatorMessages = {
  unknownOption: (option) => ` Opción desconocida: ${option}`,

  missingValue: (option) => ` La opción "${option}" requiere un valor.`,
};

function throwValidationError(type, value) {
  throw new Error(validatorMessages[type](value));
}

// Validaciones de la interfaz de línea de comandos.
export function validateArguments(args, actions) {
  // Opciones validas
  for (const [index, arg] of args.entries()) {
    if (!arg.startsWith("-")) continue;

    if (!(arg in actions)) throwValidationError("unknownOption", arg);

    const action = actions[arg];

    // Parámetros requeridos para la acción.
    const value = args[index + action.consumes];

    if (action.consumes > 0 && (value === undefined || value.startsWith("-"))) { throwValidationError("missingValue", arg); }
  }
}