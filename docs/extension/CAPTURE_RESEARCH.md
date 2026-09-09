# CAPTURE_RESEARCH

## Objetivo

Determinar si es posible capturar automáticamente el árbol completo de una conversación de ChatGPT sin depender de DevTools y reutilizar el pipeline existente de AI Chat Exporter.

La investigación no busca modificar el funcionamiento interno de ChatGPT, sino interceptar la respuesta original recibida por la aplicación web y entregarla al núcleo del proyecto para su posterior procesamiento.

---

## Alcance

Esta investigación comprende:

- análisis del funcionamiento interno de ChatGPT durante la carga de conversaciones;
- identificación del origen del árbol de conversación;
- evaluación de múltiples estrategias de captura;
- estudio de las restricciones impuestas por Manifest V3;
- diseño de una arquitectura desacoplada para la futura extensión.

No comprende:

- generación de Markdown;
- parser del árbol;
- renderizado;
- interfaz de usuario;
- publicación de la extensión.

Todos esos componentes pertenecen al núcleo de AI Chat Exporter y quedan fuera del alcance de este documento.

---

## Estado

Investigación finalizada y actualizada tras el cambio de API de ChatGPT.

Se confirmó que la captura automática es técnicamente viable y compatible con la arquitectura existente del proyecto.

---

# Contexto

Originalmente AI Chat Exporter dependía de un proceso completamente manual.

El usuario debía:

1. abrir DevTools;
2. localizar la respuesta correspondiente a la conversación;
3. descargar el archivo `conversation.json`;
4. alimentar manualmente el pipeline existente.

Aunque este procedimiento permitía reconstruir correctamente cualquier conversación, presentaba varias limitaciones:

- dependía del conocimiento de DevTools;
- requería intervención manual;
- no era reutilizable por usuarios finales;
- impedía automatizar el proceso de exportación.

El objetivo pasó entonces a ser eliminar completamente esa dependencia.

La pregunta inicial fue sencilla:

> ¿Es posible capturar automáticamente el mismo JSON que ChatGPT descarga durante la carga de una conversación?

Toda la investigación desarrollada en este documento surge de intentar responder esa única pregunta.

---

# Estado inicial

Antes de comenzar la investigación se conocían los siguientes hechos:

- ChatGPT reconstruía correctamente conversaciones muy extensas.
- DevTools permitía descargar un archivo `conversation.json`.
- El pipeline existente ya era capaz de interpretar dicho archivo.

Lo desconocido era:

- de dónde provenía exactamente ese JSON;
- cuándo era generado;
- si podía solicitarse nuevamente;
- si existía alguna API pública;
- si React conservaba el árbol completo;
- si era posible interceptarlo automáticamente.

Estas incógnitas definieron las primeras hipótesis de trabajo.

---

# Hipótesis

| ID | Hipótesis | Estado |
|----|-----------|:------:|
| H-001 | El endpoint `/backend-api/conversation/{id}` devuelve el árbol completo de conversación. | ✅ Confirmada |
| H-002 | Es posible reproducir la petición mediante un `fetch()` manual. | ❌ Refutada |
| H-003 | "Copy as fetch" reproduce exactamente la petición original. | ❌ Refutada |
| H-004 | React mantiene el árbol completo accesible desde variables globales. | ❌ Refutada |
| H-005 | Interceptar `Response.prototype.json()` permite capturar el árbol. | ❌ Refutada |
| H-006 | Un Content Script puede interceptar el `window.fetch()` utilizado por la página. | ❌ Refutada |
| H-007 | Un script inyectado puede interceptar el `window.fetch()` real de ChatGPT. | ✅ Confirmada |
| H-008 | El JSON puede capturarse antes de que la aplicación lo procese. | ✅ Confirmada |
| H-009 | Las conversaciones nuevas viajan por un flujo SSE. | ✅ Confirmada |
| H-010 | La captura combinada paginación + SSE cubre todos los escenarios de ChatGPT. | ✅ Confirmada |

---

# Experimentos

## E-001 — Identificación del endpoint

**Objetivo**

Determinar desde dónde obtiene ChatGPT el árbol completo de una conversación.

**Implementación**

Inspección del tráfico de red utilizando DevTools durante la carga de una conversación.

**Resultado**

Se identificó el endpoint:

```text
/backend-api/conversation/{id}
```

La respuesta contiene el árbol completo (`mapping`) utilizado por la aplicación.

---

## E-002 — Reproducción manual del endpoint

**Objetivo**

Comprobar si el endpoint podía reutilizarse mediante un `fetch()` ejecutado desde la consola.

**Resultado**

La petición devolvió:

```text
404 conversation_inaccessible
```

**Conclusión**

El endpoint únicamente puede consumirse durante la carga inicial de la conversación.

---

## E-003 — Copy as fetch

**Objetivo**

Reutilizar exactamente la petición generada por el navegador.

**Resultado**

La petición devolvió HTML o `404`.

**Conclusión**

Existen datos de contexto imposibles de reproducir manualmente.

---

## E-004 — React

**Objetivo**

Determinar si el árbol permanecía accesible dentro del estado interno de React.

**Resultado**

Se inspeccionaron React Router y React Query.

No se encontró ninguna referencia al árbol completo de conversación.

**Conclusión**

React consume el JSON, pero no mantiene una copia accesible del `mapping`.

---

## E-005 — Hook sobre Response.prototype.json()

**Objetivo**

Interceptar el momento en que ChatGPT convertía la respuesta en JSON.

**Resultado**

El hook nunca llegó a ejecutarse sobre la conversación.

**Conclusión**

La respuesta ya había sido consumida antes de poder interceptarla.

---

## E-006 — Hook sobre window.fetch() desde consola

**Objetivo**

Interceptar todas las respuestas HTTP.

**Resultado**

El hook se instalaba demasiado tarde.

La conversación ya había sido descargada.

**Conclusión**

La captura debía producirse antes de la ejecución del código de la aplicación.

---

## E-007 — Script inyectado

**Objetivo**

Modificar el `window.fetch()` real utilizado por la página.

**Resultado**

La interceptación funcionó correctamente.

Fue posible clonar la respuesta y acceder al JSON completo.

**Conclusión**

Esta técnica eliminó la limitación del contexto aislado de Manifest V3.

---

## E-008 — Validación del pipeline

**Objetivo**

Comprobar que el JSON capturado automáticamente era equivalente al descargado manualmente desde DevTools.

**Resultado**

El archivo generado fue procesado correctamente por AI Chat Exporter y reconstruyó la conversación completa sin modificaciones en el pipeline.

**Conclusión**

La captura automática es compatible con la arquitectura existente del proyecto.

---

## E-009 — Captura de conversaciones existentes paginadas

**Objetivo**

Restaurar la captura de conversaciones existentes después del cambio a paginación.

**Resultado**

Se implementó scroll automático y se capturaron todas las páginas.

**Conclusión**

La estrategia funciona sin reproducir peticiones manualmente.

---

## E-010 — Captura de conversaciones nuevas con SSE

**Objetivo**

Capturar conversaciones nuevas que no pasan por el endpoint paginado.

**Resultado**

Se leyó el stream SSE y se reconstruyeron los mensajes de usuario y asistente.

**Conclusión**

La estrategia SSE complementa la captura paginada.

---

## E-011 — Captura combinada en escenarios reales

**Objetivo**

Validar la extensión en conversaciones existentes, nuevas, recargadas y con múltiples páginas.

**Resultado**

La exportación Markdown fue correcta en todos los escenarios.

**Conclusión**

La estrategia combinada es robusta.

---

# Problemas encontrados

## P-001 — Múltiples respuestas bajo el mismo endpoint

Durante la carga de una conversación ChatGPT realiza varias peticiones relacionadas con `/backend-api/conversation/`.

Entre ellas aparecen:

- conversación completa;
- metadatos;
- respuestas vacías (`[]`).

Inicialmente todas sobrescribían la conversación almacenada.

### Resolución

Conservar únicamente los objetos que contienen la propiedad:

```text
mapping
```

---

## P-002 — URL.createObjectURL()

Manifest V3 ejecuta el background como Service Worker.

En ese contexto no existe:

```javascript
URL.createObjectURL()
```

La estrategia basada en Blob quedó descartada.

### Resolución

Utilizar Data URLs.

---

## P-003 — chrome.downloads

La API:

```javascript
chrome.downloads
```

no existe dentro del Content Script.

### Resolución

Delegar completamente la descarga al Background.

---

## P-004 — Contexto aislado

Los Content Scripts viven dentro del Isolated World.

Modificar:

```javascript
window.fetch
```

desde ese contexto no afecta al `fetch` utilizado por ChatGPT.

### Resolución

Inyectar un script directamente en el contexto de la página.

---

## P-005 — Timeout fijo en content script

Un timeout fijo de 60 segundos para recuperar la conversación completa cortaba las recolecciones largas.

### Resolución

Eliminar el timeout fijo y delegar el control de inactividad al popup.

---

## P-006 — Captura de stream SSE con deltas incompletos

Los deltas del SSE pueden venir como strings, objetos con ruta o arrays de patches.

Si no se procesan todos, el mensaje del asistente queda incompleto.

### Resolución

Implementar un acumulador que maneje los tres formatos.

---

# Restricciones

Durante la investigación se identificaron varias restricciones impuestas tanto por ChatGPT como por Manifest V3.

## C-001 — Disponibilidad del endpoint

El endpoint:

```text
/backend-api/conversation/{id}
```

solo devuelve el árbol completo durante la carga inicial de la conversación.

Intentar repetir posteriormente la solicitud produce:

```text
404 conversation_inaccessible
```

---

## C-002 — Contexto aislado

Los Content Scripts se ejecutan dentro del **Isolated World**.

Esto implica que modificar:

```javascript
window.fetch
```

desde un Content Script no altera el `fetch` utilizado por la aplicación.

---

## C-003 — Service Worker

El Background de Manifest V3 no posee acceso al DOM.

Por lo tanto no existen APIs como:

```javascript
URL.createObjectURL()
```

---

## C-004 — chrome.downloads

La API:

```javascript
chrome.downloads
```

solo está disponible para el Background.

No puede utilizarse desde el Content Script.

---

## C-005 — Captura temprana

La interceptación debe realizarse antes de que ChatGPT procese la respuesta.

Por este motivo el script debe inyectarse durante:

```text
document_start
```

---

# Descubrimientos

## DISC-001 — El endpoint no es único

Aunque todas las respuestas pertenecen a:

```text
/backend-api/conversation/
```

no todas contienen la conversación.

Durante una carga normal aparecen respuestas de:

- conversación;
- metadata;
- arrays vacíos;
- textdocs.

El filtrado debe realizarse por estructura y no únicamente por URL.

---

## DISC-002 — mapping identifica la conversación

La presencia del atributo:

```text
mapping
```

permite distinguir de forma confiable la conversación completa del resto de respuestas.

---

## DISC-003 — La inyección elimina el Isolated World

Un script inyectado mediante:

```html
<script src="inject.js">
```

se ejecuta dentro del contexto JavaScript de ChatGPT.

Esto permite modificar el `window.fetch()` real utilizado por la aplicación.

---

## DISC-004 — El pipeline no necesita cambios

El JSON capturado automáticamente posee exactamente la misma estructura que el descargado manualmente desde DevTools.

El parser existente pudo reutilizarse sin modificaciones.

---

## DISC-005 — Las conversaciones nuevas no usan paginación

Las conversaciones nuevas llegan por SSE, no por el endpoint paginado.

---

## DISC-006 — El proveedor puede detectarse por URL

La URL actual permite detectar el proveedor sin permisos adicionales.

---

# Cambios de estrategia

## S-001

### Antes

Intentar reproducir manualmente la petición.

### Después

Interceptar la respuesta original.

### Motivo

El endpoint solo permanece disponible durante la carga inicial.

---

## S-002

### Antes

Buscar el árbol dentro del estado interno de React.

### Después

Capturarlo antes de que React lo procese.

### Motivo

React no conserva una copia accesible del árbol.

---

## S-003

### Antes

Modificar `window.fetch()` desde el Content Script.

### Después

Modificar el `fetch` mediante un script inyectado.

### Motivo

El contexto aislado impide alterar el objeto global de la página.

---

## S-004

### Antes

Descargar utilizando:

```javascript
Blob
URL.createObjectURL()
```

### Después

Utilizar Data URLs.

### Motivo

Manifest V3 no soporta `URL.createObjectURL()` dentro del Service Worker.

---

## S-005

### Antes

Asumir que toda conversación llegaba en un único JSON con `mapping`.

### Después

Diferenciar captura paginada de captura SSE.

### Motivo

La API de ChatGPT separó ambos flujos.

---

# Arquitectura final

La investigación permitió definir una arquitectura simple y completamente desacoplada.

```text
Usuario
    │
    ▼
Background
    │
    ▼
Content Script
    │
    ▼
Inject Script
    │
Intercepta window.fetch()
    │
    ├── Captura paginada
    │        └── Scroll automático
    │
    └── Captura SSE
             └── Reconstrucción de turnos
    │
    ▼
Conversación cruda
    │
    ▼
Content Script
    │
    ▼
Background
    │
    ▼
AI Chat Exporter Core
```

## Responsabilidades

### Inject Script

- interceptar `window.fetch()`;
- identificar el flujo (paginado o SSE);
- capturar páginas paginadas;
- leer streams SSE;
- reconstruir turnos;
- conservar la conversación en estado interno.

### Content Script

- inyectar el capturador;
- actuar como puente entre ambos contextos;
- reenviar mensajes y progreso.

### Background

- coordinar la extensión;
- iniciar la captura;
- descargar el JSON o Markdown;
- notificar al usuario.

### AI Chat Exporter Core

- interpretar la conversación;
- normalizar los mensajes;
- generar Markdown;
- producir los formatos de salida.

---

# Tecnologías evaluadas

| Tecnología | Resultado |
|------------|-----------|
| DevTools | ✅ |
| Copy as fetch | ❌ |
| fetch() manual | ❌ |
| React Router | ❌ |
| React Query | ❌ |
| Response.prototype.json() | ❌ |
| ReadableStream | ✅ |
| Content Script | ⚠️ Parcial |
| Script inyectado | ✅ |
| window.fetch() | ✅ |
| chrome.downloads | ✅ |
| chrome.notifications | ✅ |
| Data URL | ✅ |

---

# Ideas descartadas

- reproducir la petición mediante `fetch()`;
- reutilizar "Copy as fetch";
- buscar el árbol dentro de React;
- interceptar `Response.prototype.json()`;
- utilizar únicamente Content Scripts;
- descargar mediante Blob y `URL.createObjectURL()`;
- utilizar `chrome.downloads` desde el Content Script.

Todas estas alternativas fueron sustituidas por una arquitectura basada en un script inyectado que intercepta `window.fetch()` y comunica el resultado mediante mensajes entre contextos, combinando captura paginada y captura SSE.

---

# Pendientes

- validar conversaciones con ramas y regeneraciones;
- evaluar captura incremental más avanzada;
- preparar materiales para futuras publicaciones;
- analizar integración con otros proveedores.

---

# Cronología

1. Identificación del endpoint de conversación.
2. Confirmación del árbol `mapping`.
3. Fracaso de las estrategias basadas en `fetch()` manual.
4. Investigación del estado interno de React.
5. Confirmación del contexto aislado de Manifest V3.
6. Desarrollo del script inyectado.
7. Primera captura automática del árbol completo.
8. Descubrimiento de múltiples respuestas bajo el mismo endpoint.
9. Filtrado por la propiedad `mapping`.
10. Implementación del flujo Background → Content → Inject.
11. Resolución de las limitaciones de descarga mediante Data URLs.
12. Validación completa utilizando el pipeline existente de AI Chat Exporter.
13. Migración a captura paginada tras cambio de API.
14. Detección del flujo SSE para conversaciones nuevas.
15. Integración de captura combinada y validación final.

---

# Conclusiones

La investigación permitió demostrar que la captura automática de conversaciones de ChatGPT es técnicamente viable sin depender de DevTools.

La estrategia original se basó en interceptar `window.fetch()` para capturar el JSON con `mapping`.

Tras el cambio de API, la captura se amplió para soportar:

- conversaciones existentes mediante paginación;
- conversaciones nuevas y mensajes en tiempo real mediante SSE.

El pipeline existente pudo reutilizarse sin modificaciones.

Con esta actualización, la extensión cubre los escenarios principales de uso real.

---

## Referencias

- [Bitácora de depuración: CAPTURE_PAGINATION_DEBUG](../../assets/docs/research/extension/CAPTURE_PAGINATION_DEBUG.md)
- [Evaluación de advertencia: CAPTURE_WARNING_BEHAVIOR](../../assets/docs/research/extension/CAPTURE_WARNING_BEHAVIOR.md)
- [Experimentos consolidados: LABORATORY](../LABORATORY.md)

---
