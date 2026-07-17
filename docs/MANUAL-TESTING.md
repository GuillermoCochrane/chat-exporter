# Testing Manual

## v0.5.8.1

### Ayuda larga

**Comando**

```bash
npm start -- --help
````

**Resultado**

✔ Se muestra la ayuda completa.

---

### Ayuda corta

**Comando**

```bash
npm start -- -h
```

**Resultado**

✔ Se muestra la ayuda completa.

---

### Ejecución por defecto

**Comando**

```bash
npm start
```

**Resultado**

✔ Exporta la conversación usando las rutas por defecto.

---

### Entrada personalizada

**Comando**

```bash
node src/index.js input/epistolario_MINI.json
```

**Resultado**

✔ Exportación correcta.

---

### Entrada y salida personalizadas

**Comando**

```bash
node src/index.js input/epistolario_SMALL.json output/prueba.md
```

**Resultado**

✔ Exportación correcta.

---

### Versión larga

**Comando**

```bash
npm start -- --version
```

**Resultado**

✔ Se muestra la versión instalada.

---

### Versión corta

**Comando**

```bash
npm start -- -v
```

**Resultado**

✔ Se muestra la versión instalada.

---


---

### Entrada mediante opción

**Comando**

```bash
node src/index.js -i input/epistolario_MINI.json
```

**Resultado**

✔ Se utiliza el archivo indicado mediante `-i`.

---

### Entrada y salida mediante opciones

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.json -o output/prueba.md
```

**Resultado**

✔ Exportación correcta.

---

### Orden independiente de las opciones

**Comando**

```bash
node src/index.js -o output/prueba.md -i input/epistolario_SMALL.json
```

**Resultado**

✔ La exportación funciona independientemente del orden de las opciones.

---

## v0.5.9.0

### Opción desconocida

**Comando**

```bash
node src/index.js -x
```

**Resultado**

✔ Se informa que la opción no existe.

---

### Opción desconocida combinada con opciones válidas

**Comando**

```bash
node src/index.js -i input.json -x
```

**Resultado**

✔ La validación detecta la opción inválida antes de ejecutar el pipeline.

---

## v0.5.9.1

### Parámetro obligatorio (`-i`)

**Comando**

```bash
node src/index.js -i
````

**Resultado**

✔ Se informa que la opción requiere un valor.

---

### Parámetro obligatorio (`--input`)

**Comando**

```bash
node src/index.js --input
```

**Resultado**

✔ Se informa que la opción requiere un valor.

---

### Opción seguida por otra opción

**Comando**

```bash
node src/index.js -i -o output.md
```

**Resultado**

✔ Se informa que `-i` requiere un valor.

---

### Salida seguida por otra opción

**Comando**

```bash
node src/index.js -o -i input.json
```

**Resultado**

✔ Se informa que `-o` requiere un valor.

---

### Valor reemplazado por otra opción existente

**Comando**

```bash
node src/index.js -i --version
```

**Resultado**

✔ Se informa que `-i` requiere un valor.

---

## v0.5.9.3

### Extensión válida para archivo de entrada

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.txt
```

**Resultado**

✔ Se informa que el archivo de entrada debe tener extensión `.json`.

---

### Archivo sin extensión

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL
```

**Resultado**

✔ Se informa que el archivo de entrada debe tener extensión `.json`.

---

### Entrada válida con salida válida

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.json
```

**Resultado**

✔ La conversación se exporta correctamente.

---

### Extensión inválida para archivo de salida

**Comando**

```bash
node src/index.js -i input/chat.json -o output/prueba.txt
```

**Resultado**

✔ Se informa que el archivo de salida debe tener extensión `.md`.

---

### Archivo inexistente con extensión válida

**Comando**

```bash
node src/index.js -i input/no-existe.json
```

**Resultado**

✔ La validación de extensión se supera y el error corresponde únicamente a que el archivo no existe.

---

## v0.5.9.4

### Opción repetida (`-i`)

**Comando**

```bash
node src/index.js -i uno.json -i dos.json
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

### Opción repetida (`--input`)

**Comando**

```bash
node src/index.js --input uno.json --input dos.json
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

### Alias repetidos

**Comando**

```bash
node src/index.js -i uno.json --input dos.json
```

**Resultado**

✔ Se informa que las opciones equivalentes no pueden repetirse.

---

### Alias repetidos (orden inverso)

**Comando**

```bash
node src/index.js --input uno.json -i dos.json
```

**Resultado**

✔ Se informa que las opciones equivalentes no pueden repetirse.

---

### Opción de salida repetida

**Comando**

```bash
node src/index.js -o uno.md -o dos.md
```

**Resultado**

✔ Se informa que la opción no puede repetirse.

---

### Alias de salida repetidos

**Comando**

```bash
node src/index.js --output uno.md -o dos.md
```

**Resultado**

✔ Se informa que las opciones equivalentes no pueden repetirse.

---

### Opciones de grupos diferentes

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.json -o output/prueba.md
```

**Resultado**

✔ La conversación se exporta correctamente.

---

## v0.5.9.5

### Archivo de entrada existente

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.json
```

**Resultado**

✔ La conversación se exporta correctamente.

---

### Archivo de entrada inexistente

**Comando**

```bash
node src/index.js -i input/no-existe.json
```

**Resultado**

✔ Se informa que el archivo no existe.

---

### Archivo inexistente con salida válida

**Comando**

```bash
node src/index.js -i input/no-existe.json -o output/prueba.md
```

**Resultado**

✔ Se informa que el archivo no existe.

---

### Archivo con extensión inválida

**Comando**

```bash
node src/index.js -i input/chat.txt
```

**Resultado**

✔ Se informa que el archivo de entrada debe tener extensión `.json`.

---

### Directorio de salida inexistente

**Comando**

```bash
node src/index.js -i input/epistolario_SMALL.json -o out/prueba.md
```

**Resultado**

✔ Se informa que el directorio no existe.

---