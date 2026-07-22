# Manual de Testing

Este documento reúne los casos de prueba manuales utilizados para validar el comportamiento del exportador durante su desarrollo.

Las pruebas manuales complementan la suite automatizada y se utilizan principalmente para verificar el comportamiento observable desde la interfaz de línea de comandos (CLI), la experiencia de uso y el flujo completo del pipeline.

A partir de la etapa **Pre Release (v0.9.x)**, las pruebas manuales quedan desacopladas del código mediante un runner reutilizable (`run-manual-tests.sh`) y archivos independientes de casos (`test-cases-*.sh`).

---

# v0.5.8.1 — CLI básica

## Ayuda larga

**Comando**

```bash
npm start -- --help
```

**Resultado**

✔ Se muestra la ayuda completa.

---

## Ayuda corta

**Comando**

```bash
npm start -- -h
```

**Resultado**

✔ Se muestra la ayuda completa.

---

## Ejecución por defecto

**Comando**

```bash
npm start
```

**Resultado**

✔ Exporta la conversación utilizando el archivo por defecto (`input/conversation.json`).

---

## Entrada personalizada

**Comando**

```bash
node src/main.js -i input/epistolario_MINI.json
```

**Resultado**

✔ Exportación correcta.

---

## Entrada y salida personalizadas

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json -o output/prueba.md
```

**Resultado**

✔ Exportación correcta.

---

## Versión larga

**Comando**

```bash
npm start -- --version
```

**Resultado**

✔ Se muestra la versión instalada.

---

## Versión corta

**Comando**

```bash
npm start -- -v
```

**Resultado**

✔ Se muestra la versión instalada.

---

## Entrada mediante opción

**Comando**

```bash
node src/main.js -i input/epistolario_MINI.json
```

**Resultado**

✔ Se utiliza el archivo indicado mediante `-i`.

---

## Entrada y salida mediante opciones

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json -o output/prueba.md
```

**Resultado**

✔ Exportación correcta.

---

## Orden independiente de las opciones

**Comando**

```bash
node src/main.js -o output/prueba.md -i input/epistolario_SMALL.json
```

**Resultado**

✔ La exportación funciona independientemente del orden de las opciones.

---

# v0.5.9.0 — Validator

## Opción desconocida

**Comando**

```bash
node src/main.js -x
```

**Resultado**

✔ Se informa que la opción no existe.

---

## Opción desconocida combinada con opciones válidas

**Comando**

```bash
node src/main.js -i input.json -x
```

**Resultado**

✔ La validación detecta la opción inválida antes de ejecutar el pipeline.

---

# v0.5.9.1 — Parámetros obligatorios

## Parámetro obligatorio (`-i`)

**Comando**

```bash
node src/main.js -i
```

**Resultado**

✔ Se informa que la opción requiere un valor.

---

## Parámetro obligatorio (`--input`)

**Comando**

```bash
node src/main.js --input
```

**Resultado**

✔ Se informa que la opción requiere un valor.

---

## Opción seguida por otra opción

**Comando**

```bash
node src/main.js -i -o output.md
```

**Resultado**

✔ Se informa que `-i` requiere un valor.

---

## Salida seguida por otra opción

**Comando**

```bash
node src/main.js -o -i input.json
```

**Resultado**

✔ Se informa que `-o` requiere un valor.

---

## Valor reemplazado por otra opción existente

**Comando**

```bash
node src/main.js -i --version
```

**Resultado**

✔ Se informa que `-i` requiere un valor.

---

# v0.5.9.3 — Validación de extensiones

## Extensión válida para archivo de entrada

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.txt
```

**Resultado**

✔ Se informa que el archivo de entrada debe tener extensión `.json`.

---

## Archivo sin extensión

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL
```

**Resultado**

✔ Se informa que el archivo de entrada debe tener extensión `.json`.

---

## Entrada válida

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json
```

**Resultado**

✔ La conversación se exporta correctamente.

---

## Extensión inválida para archivo de salida

**Comando**

```bash
node src/main.js -i input/chat.json -o output/prueba.txt
```

**Resultado**

✔ Se informa que el archivo de salida debe tener extensión `.md`.

---

## Archivo inexistente con extensión válida

**Comando**

```bash
node src/main.js -i input/no-existe.json
```

**Resultado**

✔ La validación de extensión se supera y el error corresponde únicamente a que el archivo no existe.

---

# v0.5.9.4 — Grupos de opciones

## Opción repetida (`-i`)

**Comando**

```bash
node src/main.js -i uno.json -i dos.json
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

## Alias repetidos

**Comando**

```bash
node src/main.js -i uno.json --input dos.json
```

**Resultado**

✔ Se informa que las opciones equivalentes no pueden repetirse.

---

## Alias repetidos (orden inverso)

**Comando**

```bash
node src/main.js --input uno.json -i dos.json
```

**Resultado**

✔ Se informa que las opciones equivalentes no pueden repetirse.

---

## Opción de salida repetida

**Comando**

```bash
node src/main.js -o uno.md -o dos.md
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

## Opciones de grupos diferentes

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json -o output/prueba.md
```

**Resultado**

✔ La conversación se exporta correctamente.

---

# v0.5.9.5 — Validación del sistema de archivos

## Archivo de entrada existente

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json
```

**Resultado**

✔ Exportación correcta.

---

## Archivo de entrada inexistente

**Comando**

```bash
node src/main.js -i input/no-existe.json
```

**Resultado**

✔ Se informa que el archivo no existe.

---

## Directorio de salida inexistente

**Comando**

```bash
node src/main.js -i input/epistolario_SMALL.json -o out/prueba.md
```

**Resultado**

✔ Se informa que el directorio no existe.

---

# v0.5.9.6 — Inspector

## Inspect

**Comando**

```bash
node src/main.js --inspect
```

**Resultado**

✔ Se muestran estadísticas de la conversación sin generar el documento Markdown.

---

## Inspect corto

**Comando**

```bash
node src/main.js -in
```

**Resultado**

✔ Se muestran estadísticas de la conversación.

---

## Inspect con archivo personalizado

**Comando**

```bash
node src/main.js --inspect -i input/epistolario_MINI.json
```

**Resultado**

✔ Se inspecciona el archivo indicado.

---

## Opción repetida

**Comando**

```bash
node src/main.js --inspect --inspect
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

# v0.5.9.7 — No Write

## No Write

**Comando**

```bash
node src/main.js --no-write
```

**Resultado**

✔ Se ejecuta el pipeline completo sin escribir el archivo.

---

## No Write corto

**Comando**

```bash
node src/main.js -nw
```

**Resultado**

✔ Se ejecuta el pipeline completo sin escribir el archivo.

---

## No Write con archivo personalizado

**Comando**

```bash
node src/main.js --no-write -i input/epistolario_MINI.json
```

**Resultado**

✔ El pipeline procesa el archivo indicado sin generar salida en disco.

---

## No Write junto a Inspect

**Comando**

```bash
node src/main.js --inspect --no-write
```

**Resultado**

✔ `--inspect` tiene prioridad y finaliza la ejecución luego del Inspector.

---

# v0.9.5 — Validación de Release

Durante la etapa **Pre Release** las pruebas manuales dejan de ejecutarse individualmente y pasan a organizarse mediante un **runner reutilizable**.

Los casos se almacenan en archivos independientes (`test-cases-*.sh`) consumidos por `run-manual-tests.sh`.

## Runner

**Comando**

```bash
npm run manualtest -- ./test/test-cases-release.sh
```

**Resultado esperado**

✔ Se ejecuta la batería completa de pruebas de release.

La batería actual valida:

- JSON vacío.
- Conversación mínima.
- Conversación completa (ORIGINAL).
- Archivo inexistente.
- Extensión inválida.

---

## Validación de distribución

Además de los casos anteriores, antes de publicar una versión estable debe verificarse:

### Clonado limpio

✔ El proyecto puede clonarse desde cero.

---

### Instalación

```bash
npm install
```

✔ Instala correctamente las dependencias.

---

### Ejecución inmediata

```bash
npm start
```

✔ Exporta correctamente `input/conversation.json` utilizando la configuración por defecto.

---

### Ayuda

```bash
npm start -- -h
```

✔ La ayuda refleja el estado actual de la CLI.

---

### Suite automatizada

```bash
npm test
```

✔ Toda la suite automatizada finaliza correctamente.

---

### Rutas absolutas

```bash
grep -R "C:/" .
grep -R "D:/" .
grep -R "/home/" .
```

✔ No existen rutas absolutas embebidas en el proyecto.

---

### Estado del repositorio

```bash
git status
```

✔ El árbol de trabajo permanece limpio luego de ejecutar las pruebas.

---

## Objetivo de la Pre Release

Al finalizar esta validación debe poder responderse afirmativamente la siguiente pregunta:

> **¿Puede cualquier persona clonar este repositorio y utilizar el exportador en menos de dos minutos?**

Si la respuesta es **sí**, la etapa de estabilización ha cumplido su objetivo.