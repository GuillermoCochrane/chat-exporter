export function parseArguments(argv = process.argv) {
  const [, , input, output] = argv;

  return {
    input: input ?? "./input/epistolario_SMALL.json",
    output: output ?? "./output/conversacion.md",
  };
}