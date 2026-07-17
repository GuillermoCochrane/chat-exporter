#!/usr/bin/env bash

TESTS=(

'No Write|node src/index.js --no-write'

'No Write corto|node src/index.js -nw'

'No Write con input|node src/index.js --no-write -i input/epistolario_MINI.json'

'No Write repetido|node src/index.js --no-write --no-write'

'No Write junto a Inspect|node src/index.js --inspect --no-write'

)