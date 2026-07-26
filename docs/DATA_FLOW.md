# Data Flow

## Objetivo

Este documento describe el recorrido que realiza una conversación desde que es obtenida por el sistema hasta que se convierte en uno o más formatos de salida.

No documenta módulos específicos ni decisiones de implementación.

Su propósito es definir el modelo conceptual que comparten todas las interfaces, el Core y los distintos mecanismos de exportación.

Este flujo representa la arquitectura lógica del proyecto y sirve como referencia para incorporar nuevas fuentes de conversación o nuevos formatos de salida sin modificar el comportamiento interno del motor.

---

## Visión general

Todo el proyecto puede entenderse como una tubería de transformación.

Cada etapa recibe una representación determinada de la conversación y produce una nueva representación con un mayor nivel de abstracción.

El objetivo es que cada etapa conozca únicamente el modelo que recibe y el modelo que entrega, sin depender de cómo se obtuvo la conversación ni de cómo será exportada posteriormente.

Esta separación permite incorporar nuevas interfaces, nuevas fuentes de datos o nuevos formatos de salida sin modificar el comportamiento interno del motor.

---

## Flujo general

El recorrido completo de una conversación puede resumirse de la siguiente manera:

```text
Conversation Source

↓

Conversation (RAW)

↓

Conversation Adapter

↓

Message[]

↓

Filter

↓

Normalizer

↓

Renderer

↓

Output
```

Cada bloque representa una responsabilidad distinta dentro del sistema.

Las etapas posteriores nunca necesitan conocer cómo trabajaron las anteriores.

---

## Conversation Sources

Las Conversation Sources representan cualquier mecanismo capaz de obtener una conversación.

Algunos ejemplos son:

- Archivo JSON.
- Extensión de Chrome.
- API REST.
- Clipboard.
- Memoria local.
- Otros proveedores de conversaciones.

La responsabilidad de una Source termina cuando entrega una `Conversation` correspondiente al proveedor que representa.

Puede obtenerla desde un archivo, una API, una extensión de navegador o cualquier otro mecanismo de adquisición.

No interpreta la estructura.

No normaliza los datos.

No realiza transformaciones.

Su única responsabilidad consiste en obtener la información y entregarla al siguiente componente.

El resultado siempre es una Conversation.

---

## Conversation

Una Conversation representa la estructura original entregada por una fuente determinada.

No pertenece al Core.

Pertenece al proveedor que originó la conversación.

Por este motivo, distintas fuentes pueden producir estructuras completamente diferentes.

Por ejemplo:

- ChatGPT Conversation.
- Claude Conversation.
- DeepSeek Conversation.
- Gemini Conversation.

Todas ellas representan conversaciones, aunque internamente utilicen modelos distintos.

El proyecto no intenta unificarlas en esta etapa.

Cada representación conserva íntegramente la estructura del proveedor que la generó.

El Core nunca realiza suposiciones sobre la estructura interna de una Conversation.

---

## Conversation Adapters

Los Conversation Adapters conocen la estructura específica de una `Conversation` determinada.

Actualmente el proyecto implementa este comportamiento para conversaciones de ChatGPT mediante `parser.js`, que adapta la estructura basada en `mapping` al modelo interno `Message[]`.

La arquitectura permite incorporar adaptadores adicionales para otros proveedores sin modificar el resto del Core.

Su responsabilidad consiste en transformar la representación original del proveedor hacia el modelo interno utilizado por el proyecto.

Cada proveedor implementa su propio adaptador.

Por ejemplo:

```text
ChatGPT Conversation

↓

ChatGPT Adapter

↓

Message[]
```

o

```text
Claude Conversation

↓

Claude Adapter

↓

Message[]
```

Todos los adaptadores producen exactamente el mismo contrato de salida.

Los adaptadores forman parte de la interfaz del proveedor y no del Core. Su existencia permite que el motor permanezca completamente independiente de la estructura interna utilizada por cada plataforma.

A partir de este punto el resto del sistema deja de depender del proveedor original.

---

## Modelo interno

El modelo interno utilizado por el proyecto es una colección de objetos `Message[]`.

Este modelo constituye el contrato compartido entre el Core y todas las implementaciones futuras.

Actualmente dicho contrato está representado por `Message[]`, aunque el resto del pipeline depende del contrato y no de la implementación concreta utilizada para representarlo.

A partir de este punto todas las etapas posteriores trabajan exclusivamente sobre este contrato.

Ningún módulo posterior necesita conocer cómo estaba organizada la conversación original.

Toda la lógica del proyecto opera únicamente sobre este modelo común.

Esto permite incorporar nuevas Conversation Sources o nuevos Conversation Adapters sin modificar el resto del pipeline.

Una vez construido `Message[]`, el procesamiento continúa siendo exactamente el mismo independientemente del origen de la conversación.

---

## Core

Una vez obtenida la `Conversation`, el flujo se divide en dos responsabilidades claramente diferenciadas.

La primera corresponde al **orquestador** (`runExporter`), cuya función consiste en coordinar el proceso completo:

- resolver la Conversation Source;
- obtener la conversación;
- ejecutar el pipeline;
- invocar el Renderer correspondiente;
- entregar el resultado al mecanismo de salida.

La segunda corresponde al **pipeline** (`runPipeline`), que implementa exclusivamente el procesamiento interno del Core.

Su flujo actual puede resumirse de la siguiente manera:

```text
Conversation

↓

Inspector

↓

Parser

↓

Message[]

↓

Filter

↓

Normalizer
```

Cada módulo posee una única responsabilidad y trabaja exclusivamente sobre el contrato recibido.

El Core nunca conoce el proveedor original de la conversación.

Tampoco conoce cómo será exportado el resultado.

Su único objetivo consiste en transformar información utilizando el modelo interno compartido.

El Renderer y el Output forman parte de la capa de orquestación y permanecen desacoplados del procesamiento interno.

## Renderers

Los Renderers convierten el modelo interno hacia un formato de representación determinado.

Actualmente el proyecto implementa un renderer Markdown.

La arquitectura, sin embargo, permite incorporar nuevos renderers sin modificar el resto del sistema.

Por ejemplo:

- Markdown.
- HTML.
- TXT.
- PDF.
- Otros formatos futuros.

Todos reciben exactamente el mismo modelo de entrada (`Message[]`).

La diferencia entre ellos reside únicamente en la representación final generada.

Actualmente el renderer Markdown continúa formando parte del flujo principal de exportación, aunque la arquitectura ya se encuentra preparada para desacoplar completamente esta capa mediante el directorio `core/renderers/`.

---

## Outputs

Una vez generado el contenido final, éste puede enviarse a distintos destinos.

Algunos ejemplos son:

- Archivo.
- Descarga desde el navegador.
- Clipboard.
- Respuesta HTTP.
- Memoria.

Los mecanismos de salida tampoco forman parte del Core.

Simplemente consumen el resultado producido por un Renderer.

Esto permite reutilizar el mismo renderer independientemente del destino elegido.

La responsabilidad de seleccionar el Renderer y el mecanismo de salida pertenece al orquestador (`runExporter`), manteniendo el Core completamente independiente de estas decisiones.

---

## Desacoplamiento

La arquitectura persigue un objetivo principal:

Cada componente debe conocer únicamente el contrato con el que trabaja.

Una Conversation Source no necesita conocer el Core.

Un Renderer no necesita conocer el proveedor original.

El Core no necesita conocer cómo fue obtenida la conversación ni dónde terminará siendo exportada.

Cada responsabilidad permanece aislada de las demás.

Este desacoplamiento permite incorporar nuevas interfaces o nuevos proveedores minimizando el impacto sobre el resto del sistema.

---

## Evolución del sistema

La incorporación de nuevas funcionalidades normalmente ocurre en alguno de estos niveles:

- nuevas Conversation Sources;
- nuevos Conversation Adapters;
- nuevos Renderers;
- nuevos Outputs.

El Core intenta permanecer estable.

Cuando aparece un nuevo proveedor, normalmente sólo es necesario implementar un nuevo adaptador.

Cuando aparece un nuevo formato de exportación, únicamente se incorpora un nuevo renderer.

La mayor parte del sistema permanece inalterada.

---

## Objetivo arquitectónico

El proyecto no busca construir un exportador específico para ChatGPT.

Busca construir un motor capaz de transformar conversaciones provenientes de distintos orígenes hacia distintos formatos de salida.

Cada nueva interfaz debe integrarse reutilizando el mismo pipeline.

Cada nuevo proveedor debe adaptarse al mismo modelo interno.

Cada nuevo formato debe consumir exactamente la misma representación de mensajes.

La evolución del sistema consiste en agregar componentes alrededor del Core, manteniendo inalterado su comportamiento interno siempre que sea posible.

---

