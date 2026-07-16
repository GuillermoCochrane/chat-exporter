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