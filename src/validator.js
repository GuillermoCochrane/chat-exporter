// validator.js

const validatorMessages = {
  unknownOption: (option) => ` Opción desconocida: ${option}`,

  missingValue: (option) => ` La opción "${option}" requiere un valor.`,
};

function throwValidationError(type, value) {
  throw new Error(validatorMessages[type](value));
}

export function validateArguments(args, actions) {
  //Validaciones del CLI

  // Opciones validas
  for (const [index, arg] of args.entries()) {
    if (!arg.startsWith("-")) continue;

    if (!(arg in actions)) throwValidationError("unknownOption", arg);
    
    const action = actions[arg];
    
    // Parametros requeridos para la acción
    if (action.consumes > 0 && args[index + action.consumes] === undefined) throwValidationError("missingValue", arg);
  }
}