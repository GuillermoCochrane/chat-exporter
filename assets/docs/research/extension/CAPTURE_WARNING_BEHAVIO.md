# CAPTURE_WARNING_BEHAVIOR

> Documento de experimentación.
> Objetivo: evaluar si la advertencia de recarga sigue siendo necesaria
> después del cambio a recolección activa por paginación.

## Contexto

La advertencia de recarga fue introducida en la v1.4.1, cuando la captura
dependía de un único JSON obtenido durante la carga inicial.

En ese flujo, los mensajes nuevos o las conversaciones abiertas después de
la carga no se capturaban, por lo que la advertencia protegía al usuario
de exportar una conversación incompleta.

Tras el cambio a recolección activa por paginación, el supuesto cambió:
la extensión recorre todas las páginas disponibles antes de exportar.

## Hipótesis

### H1
La recolección activa captura la conversación completa sin necesidad de
recargar la página.

Estado: ✅ Confirmada parcialmente

### H2
La advertencia de recarga sigue apareciendo siempre, incluso cuando la
recolección fue completa, porque el popup no recibe un flag que lo indique.

Estado: ✅ Confirmada

### H3
El comportamiento de la advertencia debe cambiar para adaptarse al nuevo
flujo de recolección.

Estado: ✅ Confirmada como conclusión preliminar

## Escenarios de prueba

| ID | Escenario | Resultado observado | Advertencia |
|----|-----------|----------------------|-------------|
| E-001 | Recargar conversación existente y exportar sin scrollear manual | Recolección completa | Sí |
| E-002 | Crear conversación nueva y exportar | Descarga conversación previa | Sí |
| E-003 | Recargar conversación, escribir mensaje nuevo y exportar | No incluye mensajes nuevos | Sí |
| E-004 | Exportar dos veces sin recargar | Recolección completa | Sí |
| E-005 | Conversación larga (190 páginas) y exportar | Recolección completa | Sí |

## Observaciones

- Al iniciar una conversación nueva desde una anterior, la extensión
  descarga la conversación previa.
- En una captura larga apareció el warning de canal asincrónico, pero en
  el retry se descargó correctamente.
- Los escenarios E-002 y E-003 sugieren que el estado capturado persiste
  entre conversaciones o no se actualiza correctamente.

## Conclusión

Pendiente de análisis tras la detección de los escenarios fallidos.