#!/usr/bin/env bash

TESTS=(
'Exportación por defecto|node src/index.js -i input/epistolario_SMALL.json'

'Inspect|node src/index.js --inspect'

'Inspect corto|node src/index.js -in'

'Inspect con input|node src/index.js --inspect -i input/epistolario_MINI.json'

'Inspect repetido|node src/index.js --inspect --inspect'
)