TESTS=(

"JSON vacío|npm start -- -i test/fixtures/empty.json"

"Conversación mínima|npm start -- -i test/fixtures/single-message.json -o output/single.md"

"Conversación ORIGINAL|npm start -- -i input/epistolario_ORIGINAL.json -o output/original.md"

"Archivo inexistente|npm start -- -i test/fixtures/no-existe.json"

"Extensión inválida|npm start -- -i test/fixtures/test.txt"

)