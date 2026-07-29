import { existsSync } from "node:fs";
import { dirname } from "node:path";

// Registro de mensajes de validación.
// Centraliza todos los textos mostrados al usuario.
const validatorMessages = {
  unknownOption: (option) => `✖ Opción desconocida: ${option}`,

  missingValue: (option) => `✖ La opción "${option}" requiere un valor.`,

  duplicatedOption: (option) => `✖ La opción "${option}" no puede repetirse.`,

  invalidExtension: (file, type) =>
    `✖ El archivo de ${type === "input" ? "entrada" : "salida"} "${file}" debe tener extensión "${type === "input" ? ".json" : ".md"}".`,

  pathNotFound: (path, kind) =>
    `✖ El ${kind === "file" ? "archivo" : "directorio"} "${path}" no existe.`,

  invalidRole: (role) =>
    `✖ El rol "${role}" no es válido. Debe ser "all", "user" o "assistant".`,
};

// Lanza un Error utilizando el mensaje correspondiente.
function throwValidationError(type, ...args) {
  throw new Error(validatorMessages[type](...args));
}

// Valida la existencia de un archivo o directorio.
function validateFile(path, kind) {
  if (!existsSync(path)) throwValidationError("pathNotFound", path, kind);
}

// Validaciones de la interfaz de línea de comandos.
export function validateArguments(args, actions) {
  // Usamos sets para registrar grupos usados,
  // útil para detectar opciones duplicadas.
  const usedGroups = new Set();

  for (const [index, arg] of args.entries()) {
    if (!arg.startsWith("-")) continue;

    // Opciones válidas.
    if (!(arg in actions)) throwValidationError("unknownOption", arg);

    const action = actions[arg];
    const value = args[index + action.consumes];

    // Opciones repetidas.
    if (usedGroups.has(action.group))
      throwValidationError("duplicatedOption", arg);
    usedGroups.add(action.group);

    // Parámetros requeridos para la acción.
    if (action.consumes > 0 && (value === undefined || value.startsWith("-")))
      throwValidationError("missingValue", arg);

    // Extensión esperada.
    if (action.group === "input" && !value.endsWith(".json"))
      throwValidationError("invalidExtension", value, "input");
    if (action.group === "output" && !value.endsWith(".md"))
      throwValidationError("invalidExtension", value, "output");

    // Existencia del archivo de entrada.
    if (action.group === "input") validateFile(value, "file");
    // Existencia del directorio de salida.
    if (action.group === "output") validateFile(dirname(value), "directory");

    // Validar valor de --role.
    if (action.group === "role" && !["all", "user", "assistant"].includes(value)) {
      throwValidationError("invalidRole", value);
    }
  }
}