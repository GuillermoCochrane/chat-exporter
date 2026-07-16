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
