# Fixtures Legacy

Esta carpeta contiene fixtures que representan el formato antiguo de conversaciones de ChatGPT.

## ¿Por qué están acá?

Hasta agosto de 2026, el parser consumía conversaciones cuya estructura se basaba en `mapping`:

```json
{
  "mapping": {
    "node-id": {
      "message": {},
      "parent": "",
      "children": []
    }
  }
}
```

A partir del cambio de API de ChatGPT, las conversaciones comenzaron a entregarse paginadas, con una estructura basada en `messages[]` y `page_info`.

Eso hizo que los fixtures `test_data_MINI.json` y `test_data_SMALL.json` dejaran de ser compatibles con el nuevo parser.

## Conservación

Se mantienen en esta carpeta como referencia histórica del formato anterior y del proceso de migración.

No se utilizan en la suite de pruebas actual.

Si en el futuro se necesita analizar conversaciones viejas exportadas antes del cambio de API, pueden servir como base para reintroducir un adaptador, pero hoy no está previsto.

---
