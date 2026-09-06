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

### H2
La advertencia de recarga sigue apareciendo siempre, incluso cuando la
recolección fue completa, porque el popup no recibe un flag que lo indique.

### H3
El comportamiento de la advertencia debe cambiar para adaptarse al nuevo
flujo de recolección.

## Escenarios de prueba

| ID | Escenario | Resultado observado | Advertencia |
|----|-----------|----------------------|-------------|
| E-001 | Recargar conversación existente y exportar sin scrollear manual | Pendiente | Pendiente |
| E-002 | Crear conversación nueva y exportar | Pendiente | Pendiente |
| E-003 | Recargar conversación, escribir mensaje nuevo y exportar | Pendiente | Pendiente |
| E-004 | Exportar dos veces sin recargar | Pendiente | Pendiente |
| E-005 | Conversación larga (190 páginas) y exportar | Pendiente | Pendiente |

## Observaciones

Pendiente.

## Conclusión

Pendiente.