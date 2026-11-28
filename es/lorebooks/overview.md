# Descripción general de los lorebooks

Un lorebook (libro de trasfondo) es un conjunto de datos del mundo que la IA lee cuando sus palabras clave aparecen en el chat. Úsalo para lugares, facciones, trasfondos y reglas, para no tener que repetirlos en cada mensaje.

Cada lorebook contiene entradas. Una entrada tiene palabras clave disparadoras y un bloque de texto. Cuando una palabra clave aparece en el chat reciente, Marinara agrega el texto de la entrada al prompt, el texto que se envía al modelo para una respuesta. En otras herramientas, los lorebooks también se llaman World Info.

Por ejemplo, una entrada con la palabra clave `Eldoria` y el texto de abajo hace que la IA conozca la ciudad cada vez que alguien la menciona.

```text
Eldoria is a rainy port city ruled by a council of nine merchants.
```

La coincidencia por palabra clave funciona con cualquier modelo y no necesita configuración. Para hacer coincidir por significado en lugar de por palabras exactas, consulta [Búsqueda semántica para lorebooks](semantic-search.md).

## Crear un lorebook y agregar una entrada

1. Abre **Library** > **Lorebooks** (Biblioteca > Lorebooks). La Library está a la derecha.
2. Haz clic en **New** (Nuevo: el icono del signo más). Se abre la ventana **Create Lorebook** (Crear lorebook).
3. Escribe un **Name** (Nombre). Este campo es obligatorio.
4. Agrega una **Description** (Descripción) si quieres.
5. Elige una **Category** (Categoría). La predeterminada es **Other**. Si vas a vincular este lorebook a un personaje, elige **Character**, porque el selector del personaje solo muestra esa categoría.
6. Haz clic en **Create Lorebook**. El nuevo lorebook aparece en la lista.
7. Haz clic en la fila del lorebook. Se abre el editor de página completa.
8. Haz clic en la pestaña **Entries** (Entradas).
9. Haz clic en **Add Entry** (Agregar entrada). Aparece una fila de entrada nueva y vacía.
10. Escribe un nombre en la fila, como `Eldoria`, y luego haz clic en la fila para abrirla.
11. En **Primary Keys** (Palabras clave principales), escribe `Eldoria` y pulsa <kbd>Enter</kbd>.
12. En **Content** (Contenido), escribe el texto para la IA.

La entrada se guarda sola un momento después de que dejas de escribir, y ves **Saved automatically** (Guardado automáticamente). Ahora la entrada se une al prompt cada vez que su palabra clave coincide. Para las palabras clave, la posición y el momento de activación, consulta [Entradas de lorebook: claves, posición y momento de activación](entries.md).

Si no funcionó: comprueba que el lorebook esté activo en el chat (consulta abajo), que su interruptor **Enabled** (Activado) esté activado y que la palabra clave aparezca en los últimos mensajes. Marinara solo revisa tantos mensajes como indica el ajuste **Scan Depth** (Profundidad de análisis).

## Activar un lorebook en un chat

Un lorebook solo alimenta a la IA cuando está activo en el chat abierto. Hay tres maneras.

| Manera | Dónde se configura | Activo en |
| --- | --- | --- |
| Global | El interruptor **Global** de la pestaña **Overview** (Descripción general) del lorebook | Todos los chats |
| Vinculado | La pestaña **Overview** del lorebook, o el editor del personaje o de la persona | Los chats con ese personaje o esa persona |
| Agregado a un chat | **Chat Settings → Lorebooks** (Ajustes del chat → Lorebooks) | Solo ese chat |

Un lorebook no puede ser global y estar vinculado a la vez. Activar **Global** borra sus vínculos con personajes y personas al guardar.

Un lorebook activo también necesita tener activado su interruptor **Enabled**. Para los vínculos, consulta [Vincular lorebooks a personajes y personas](linking-to-characters.md).

## Los ajustes de la pestaña Overview

Abre un lorebook y haz clic en **Overview** para definir cómo se comporta el lorebook completo.

| Ajuste | Qué hace | Predeterminado |
| --- | --- | --- |
| **Scan Depth** | Cuántos mensajes recientes revisa Marinara en busca de palabras clave. 0 revisa el chat completo. | 2 |
| **Token Budget** (Presupuesto de tokens) | La mayor cantidad de tokens que este lorebook puede agregar a una respuesta. 0 significa sin límite. | 2048 |
| **Entry Limit** (Límite de entradas) | La mayor cantidad de entradas que este lorebook puede agregar a una respuesta. Rango de 1 a 1000. | 100 |
| **Max Depth** (Profundidad máxima) | Pasadas extra para la recursión. Solo se muestra cuando **Recursive** (Recursivo) está activado. Rango de 1 a 10. | 3 |

Los tokens son pequeños fragmentos de texto que cuentan los modelos; en inglés, más o menos tres cuartos de una palabra. Para saber qué hace cada límite y qué significa la recursión, consulta [Presupuestos de tokens y recursión en lorebooks](token-budgets.md).

La pestaña también tiene estos interruptores.

- **Enabled** activa o desactiva el lorebook completo. Está activado de forma predeterminada.
- **Global** hace que el lorebook esté activo en todos los chats.
- **Recursive** permite que el texto de una entrada activada dispare más entradas. Está desactivado de forma predeterminada.
- **Vectors** (Vectores) permite que las entradas también coincidan por significado. Está desactivado de forma predeterminada, y las palabras clave funcionan de todos modos.

El panel **Semantic search (embeddings)** (Búsqueda semántica: embeddings), debajo de los interruptores, se explica en [Búsqueda semántica para lorebooks](semantic-search.md).

## Dar una imagen a un lorebook

La imagen aparece en la página **Lorebooks** (en la tabla y en las fichas de la galería) y en los selectores de lorebooks.

1. Abre el lorebook y haz clic en **Book settings** (Ajustes del libro). **Picture** (Imagen) está junto a **Enabled**.
2. Haz clic en **Upload** (Subir) o **Replace** (Reemplazar) y elige un archivo, o haz clic en **Generate with AI** (Generar con IA) para crear una portada con tu conexión de generación de imágenes. **Generate with AI** aparece cuando configuras una.
3. Haz clic en **Adjust crop** (Ajustar recorte) o en la imagen pequeña. Arrastra el cuadrado sobre la imagen para elegir la parte que se muestra y arrastra sus esquinas para cambiar su tamaño.
4. Haz clic en **Save** (Guardar).

Una imagen nueva empieza sin recortar. Para quitarla, abre **Adjust crop** y haz clic en **Remove** (Quitar).

En el diseño clásico, la imagen está en la sección **Image** (Imagen), en la parte superior de la pestaña **Overview** del lorebook, con los mismos botones.

## La página Lorebooks

Abre **Library → Lorebooks** (Biblioteca → Lorebooks). En la parte superior están **Browse online** (Explorar en línea; lorebooks que puedes descargar de Chub, consulta [Importar y exportar lorebooks](import-export.md#download-a-lorebook-from-chub)), **Import** (Importar; consulta [Importar y exportar lorebooks](import-export.md)) y **New lorebook** (Nuevo lorebook). Debajo:

- **All kinds** (Todos los tipos) limita la lista a lorebooks **Global**, **World**, **Character**, **NPC** o **Spellbook**.
- **List** (Lista) y **Gallery** (Galería) alternan entre una tabla y fichas con imágenes.
- El menú de orden ofrece **Recently edited** (Editados recientemente), **A to Z** (De A a Z), **Z to A** (De Z a A) y **My order** (Mi orden).

Haz clic en un lorebook para abrirlo.

### Organizar tus lorebooks

- **⋯** al final de una fila (o haz clic derecho en la fila) tiene **Duplicate** (Duplicar), **Move to folder** (Mover a carpeta), **Export** (Exportar), **Select** (Seleccionar) y **Delete** (Eliminar). En una pantalla táctil, mantén pulsada la fila. **Duplicate** copia el lorebook con todas sus entradas y abre la copia.
- Arrastra una fila por encima o por debajo de otra para establecer tu propio orden. El menú de orden cambia a **My order**.
- **New folder** (Nueva carpeta; el icono de carpeta junto al título) añade una carpeta de biblioteca. Arrastra un lorebook sobre ella o usa **Move to folder**. Estas carpetas son distintas de las carpetas de entradas que hay dentro de un lorebook. Haz clic en una carpeta para plegarla y usa su **⋯** para cambiarle el nombre o eliminarla. Al eliminar una carpeta, se conservan sus lorebooks.
- **Select** (Seleccionar; el icono de marca junto al título) pone una casilla en cada fila. Elige lorebooks y luego usa la barra de la parte inferior: **Move to folder**, **On or off** (Activar o desactivar), **Export** (un archivo `marinara-lorebooks.zip`) o **Delete**.

## En el diseño clásico: el panel Lorebooks

El panel clásico muestra las mismas carpetas y el mismo orden en forma de lista. En la parte superior del panel, **Download** (Descargar) abre el Card Browser con los lorebooks descargables, y **Open Library** (Abrir biblioteca) abre la Lorebook Library, una vista de página completa de tus lorebooks con sus imágenes, descripciones y recuentos de entradas. Haz clic en un lorebook allí para verlo más grande; **Edit Lorebook** (Editar lorebook) abre el editor, y **Active** (Activo) activa o desactiva el lorebook para todos los chats.

Debajo, tres botones de icono muestran su nombre cuando pasas el cursor sobre ellos.

- **New** abre la ventana **Create Lorebook**.
- **Import** (Importar) abre la ventana **Import Lorebook** (Importar lorebook). Consulta [Importar y exportar lorebooks](import-export.md).
- **Select** (Seleccionar) activa la selección múltiple, para que puedas exportar o eliminar varios lorebooks a la vez.

Debajo de los botones:

- **Search lorebooks** (Buscar lorebooks) filtra por nombre, descripción, nombres de personajes o personas vinculados y etiquetas. `tag:name` también funciona aquí.
- **Tags** (Etiquetas), junto al cuadro de búsqueda, muestra solo los lorebooks con todas las etiquetas que elijas, o **Untagged** (Sin etiquetas). Consulta [Etiquetas](../characters/library-organization.md#tags).
- **Sort order** (Orden) ofrece **Manual order** (Orden manual), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Most tokens** (Más tokens) y **Fewest tokens** (Menos tokens). Los órdenes por tamaño usan el tamaño estimado de todas las entradas de un lorebook, incluidas las desactivadas, que también se muestra en cada fila. Con **Manual order**, arrastra los lorebooks a su lugar, o usa <kbd>Alt</kbd>+<kbd>Up</kbd> y <kbd>Alt</kbd>+<kbd>Down</kbd>.
- **New Folder** (Nueva carpeta) crea una carpeta de biblioteca. Arrastra un lorebook sobre ella. En un teléfono, mantén pulsado el lorebook y luego arrástralo. Estas carpetas son distintas de las carpetas de entradas que hay dentro de un lorebook.

Cada fila tiene los botones **Copy** (Copiar: duplica el lorebook) y **Delete** (Eliminar). Aparecen cuando pasas el cursor sobre la fila y en los teléfonos siempre están visibles. Un lorebook desactivado muestra una insignia **OFF**. Haz clic en la imagen para subirla o reemplazarla.

<a id="save-a-lorebook-set"></a>
### Guardar un conjunto de lorebooks

Un conjunto de lorebooks es un grupo con nombre que usas junto, por ejemplo para un mismo mundo. Eliges todo el grupo en lugar de cada lorebook. El conjunto apunta a tus lorebooks sin copiarlos.

1. En **Lorebooks**, haz clic en **Nuevo conjunto**. Se abre en **Conjuntos de lorebooks**.
2. Escribe un nombre en **Nombre del conjunto**.
3. Haz clic en **Elegir lorebooks** y marca los lorebooks del conjunto. Cada cambio se guarda solo.

Para editarlo, haz clic en él en **Conjuntos de lorebooks**. **Eliminar conjunto** borra el conjunto y deja sus lorebooks en tu biblioteca. Al borrar un lorebook, sale de todos los conjuntos.

Elige un conjunto en **Usar un conjunto guardado**, encima de **Elegir lorebooks**. El campo aparece cuando tienes un conjunto, en estos lugares:

- El paso **Attach Lorebooks** de un nuevo roleplay.
- Los lorebooks de fuentes fijas de un agente, como Knowledge Router. Consulta [Fuentes de conocimiento: agentes de recuperación y enrutamiento](../agents/knowledge-sources.md#choose-the-sources).

Elegir un conjunto sustituye los lorebooks seleccionados. Después puedes añadir o quitar lorebooks para ese chat o agente sin cambiar el conjunto guardado.

Para activar o desactivar entradas solo en un chat, abre **Ajustes del chat → Lorebooks** y haz clic en el lápiz (**Editar las entradas del lorebook**) junto al lorebook. Los interruptores de entradas solo afectan a ese chat; otras ediciones cambian el lorebook mismo.

### Categorías

Una categoría es una etiqueta para tu biblioteca. No cambia cuándo se activa el lorebook. Las pestañas son **All** (Todos), **Active** (Activos: los lorebooks relevantes para el chat abierto), **World**, **Character**, **NPC**, **Spellbook** y **Other**. Puedes cambiar la categoría de un lorebook en su pestaña **Overview**, donde **Other** se llama **Uncategorized**.

## Guías relacionadas

- [Entradas de lorebook: claves, posición y momento de activación](entries.md)
- [Presupuestos de tokens y recursión en lorebooks](token-budgets.md)
- [Búsqueda semántica para lorebooks](semantic-search.md)
- [Vincular lorebooks a personajes y personas](linking-to-characters.md)
- [Importar y exportar lorebooks](import-export.md)
- [Fuentes de conocimiento: agentes de recuperación y de enrutamiento](../agents/knowledge-sources.md)
