# Editor de presets y gestor de prompts

Un preset (ajuste guardado) es un plano guardado del prompt, el texto que Marinara envía al modelo en cada respuesta. Decide qué entra y en qué orden: tus instrucciones, la tarjeta de personaje, tu persona, el historial del chat, las entradas de lorebook (libro de trasfondo) y más. Usa el **Preset Editor** (Editor de presets) para construir uno y después asígnalo a un chat.

Los presets construyen el prompt en los chats de **Roleplay**. Los chats de **Conversation** y **Game** usan en su lugar un solo cuadro de prompt (consulta [Chats de Conversation y Game](#conversation-and-game-chats)). Los presets no necesitan una API key (clave de API), pero aún necesitas una cuenta que funcione para enviar el prompt. Consulta [Conectar con un proveedor de IA](../connections/connecting-to-a-provider.md).

## Asignar un preset a un chat

Un preset no hace nada hasta que un chat lo usa. En un chat de **Roleplay**, usa cualquiera de las dos maneras. Para elegir uno, asígnalo. Para hacer el tuyo, consulta [Crear un preset](#create-a-preset).

Desde el panel **Presets**:

1. Abre el chat.
2. En el panel **Presets**, busca la fila de un preset. En una computadora, pasa el cursor sobre la fila para mostrar sus botones.
3. Haz clic en el botón de marca **Assign to chat** (Asignar al chat). Una marca indica que el preset está en uso. Vuelve a hacer clic para quitar la asignación.

Desde **Chat Settings** (Ajustes del chat):

1. Abre el chat y luego **Chat Settings**.
2. Busca **Prompt Preset** (Preset de prompt) y elige un preset en el menú desplegable.

Si el preset tiene variables, se abre la ventana **Configure Preset Variables** (Configurar variables del preset). Consulta [Variables de preset](preset-variables.md). Cambiar de preset borra las opciones de variables anteriores.

## Crear un preset

1. Abre **Library → Presets** (Biblioteca → Presets). La biblioteca está a la derecha.
2. Haz clic en **New preset** (Nuevo preset). Se abre la ventana **Create Preset** (Crear preset).
3. Escribe un **Name** (Nombre). Es obligatorio. Agrega una **Description** (Descripción) si quieres.
4. Haz clic en **Create** (Crear). El preset se abre en el **Preset Editor**.
5. Arma el prompt en la pestaña **Sections** (Secciones).
6. Haz clic en **Save** (Guardar) en la esquina superior derecha.

El editor no guarda por su cuenta. Haz clic en **Save** después de cada cambio. Si sales con ediciones sin guardar, un aviso ofrece **Keep editing** (Seguir editando), **Discard** (Descartar) y **Save & close** (Guardar y cerrar).

Para exportar un preset, haz clic en el icono de flecha hacia arriba de la barra superior (su tooltip dice **Export preset**). Marinara te pide guardar primero si tienes ediciones sin guardar. Para borrarlo, haz clic en el icono de papelera.

## La página Presets

**Library → Presets** enumera tus presets en una tabla con las columnas **Description**, **Sections**, **Author** (Autor), **Default** (Predeterminado) y **Updated** (Actualizado). En la parte superior están **Import** (Importar; carga un archivo `.json`) y **New preset**. **All** (Todos) / **Defaults** (Valores predeterminados) limita la lista, **Tags** (Etiquetas), junto a la búsqueda, muestra solo los presets con las etiquetas que elijas (los presets importados llevan **Imported** (Importado) y el lugar de donde vienen, como **ST**), **List** (Lista) / **Gallery** (Galería) cambia la vista, y el menú de orden ofrece **Recently edited** (Editados recientemente), **A to Z** (De A a Z), **Z to A** (De Z a A) y **My order** (Mi orden). Haz clic en un preset para abrirlo.

Para organizar los presets:

- **⋯** al final de una fila (o haz clic derecho en ella) tiene **Duplicate** (Duplicar), **Move to folder** (Mover a una carpeta), **Export** (Exportar), **Select** (Seleccionar) y **Delete** (Eliminar). **Duplicate** crea una copia editable y la abre; así es como personalizas un preset integrado. El preset predeterminado no se puede eliminar.
- Arrastra una fila encima o debajo de otra para establecer tu propio orden. El menú de orden cambia a **My order**.
- **New folder** (Nueva carpeta; el icono de carpeta junto al título) agrupa presets. Arrastra un preset sobre una carpeta o usa **Move to folder**.
- **Select** (el icono de marca junto al título) te permite elegir varios presets y luego **Move to folder**, **Export** (un solo `marinara-presets.zip`) o **Delete** desde la barra inferior.

Los scripts regex tienen su propia página, [Library → Scripts regex](../extending/regex-scripts.md), y también las herramientas personalizadas, [Library → Herramientas personalizadas](../extending/custom-tools.md).

## En la distribución clásica: el panel Presets

El panel tiene cuatro pestañas: **Prompts**, **Regexes**, **Tools** (Herramientas) y **Profiles** (Perfiles). Cada pestaña tiene la misma fila de botones en la parte superior y un cuadro de búsqueda. En la pestaña **Prompts**, usa **Create preset** (Crear preset) para crear uno, **Import preset** (Importar preset) para cargar un archivo `.json` o **Select presets** (Seleccionar presets) para exportar o borrar varios a la vez; **Select all presets** (Seleccionar todos los presets) marca todos los presets que muestra la búsqueda. La pestaña **Regexes** contiene tus scripts de regex; consulta [Scripts de regex](../extending/regex-scripts.md#manage-your-scripts). La pestaña **Tools** contiene tus herramientas personalizadas; consulta [Herramientas personalizadas](../extending/custom-tools.md). La pestaña **Profiles** contiene tus perfiles de ajustes del chat; consulta [Perfiles de ajustes](../chats/settings-profiles.md#the-profiles-tab).

- **Search presets** (Buscar presets) filtra la lista.
- El menú de orden ofrece **Manual order** (Orden manual), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Most tokens** (Más tokens) y **Fewest tokens** (Menos tokens). El tamaño cuenta el texto propio de las secciones activadas, las instrucciones que un preset siempre envía. Las secciones de marcadores, como el personaje, el lorebook y el historial del chat, se rellenan por chat y no se cuentan. Cada fila muestra la estimación. Con **Manual order**, arrastra una fila, o pulsa <kbd>Alt</kbd>+<kbd>Up</kbd> o <kbd>Alt</kbd>+<kbd>Down</kbd> en una fila con el foco. En una pantalla táctil, mantén pulsada una fila para tomarla.
- **New Folder** (Nueva carpeta) agrupa presets. Arrastra un preset sobre una carpeta, y haz doble clic o doble toque en una carpeta para cambiarle el nombre.

Cada fila muestra el nombre, el formato de envoltura, el número de secciones y el autor. Una insignia **DEFAULT** marca el predeterminado con estrella. Haz clic en una fila para abrirla.

## Las pestañas del Preset Editor

| Pestaña | Qué contiene |
| --- | --- |
| **Overview** (Resumen) | Nombre, descripción, formato de envoltura y autor. |
| **Sections** | La estructura del prompt, construida a partir de bloques y marcadores. |
| **Prompts** | Los prompts de modo de los chats de Conversation y Game. |
| **Parameters** (Parámetros) | Los ajustes de generación iniciales. Consulta [Parámetros de generación](generation-parameters.md). |
| **Regex** | Los scripts de regex vinculados a este preset y el **Scoped regex default** (Valor predeterminado de los regex limitados). Consulta [Scripts de regex](../extending/regex-scripts.md). |

### Pestaña Overview

- **Name** es el título en el panel **Presets**.
- **Description** es un resumen corto.
- **Wrap Format** (Formato de envoltura) controla cómo se formatean las secciones (consulta [Formatos de envoltura](#wrap-formats)).
- **Author** (Autor) es un nombre de creador opcional, útil cuando compartes un preset.
- **Tags** ordena los presets para el filtro **Tags** de la página Presets. Escribe una etiqueta y pulsa Enter, o haz clic en la **×** de una etiqueta para quitarla.

Dos tarjetas de solo lectura muestran los recuentos de **Sections** y **Groups** (Grupos).

### Pestaña Prompts

- **Conversation Mode** (Modo Conversation) es un cuadro de texto para el prompt de Conversation de este preset. Déjalo vacío para usar el prompt integrado.
- **Roleplay Mode** (Modo Roleplay) no se edita aquí. Roleplay usa el prompt ensamblado a partir de tus **Sections**.
- **Game Mode** (Modo Game) es un cuadro de texto para el prompt de Game de este preset. Déjalo vacío para usar el prompt integrado.
- **Game story settings** (Ajustes de historia de Game) lleva un estilo de historia, la violencia y los límites de contenido a Game Mode. Consulta [Ajustes de historia de Game](#game-story-settings).

#### Ajustes de historia de Game

Un preset puede llevar un estilo de historia, un nivel de violencia y límites de contenido a Game Mode, para que no tengas que configurarlos en cada partida. Consulta [Estilo de la historia, violencia y límites de contenido](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. En la pestaña **Prompts**, bajo **Game story settings**, activa **Bring story settings to games that use this preset** (Llevar los ajustes de historia a los juegos que usen este preset).
2. Elige un **Story style** (Estilo de la historia) y un nivel de **Violence** (Violencia). **Follow rating** (Seguir clasificación) mantiene la violencia de cada partida en el valor predeterminado de su clasificación.
3. Opcional: escribe **Content boundaries** (Límites de contenido), uno por línea.
4. Haz clic en **Save**.

Cuando eliges el preset para una partida, en el asistente de configuración o en **Chat Settings → Prompt Preset** (Ajustes del chat → Preset de prompt), la partida toma el estilo de historia y la violencia del preset. Los límites del preset se agregan a los que ya tiene la partida, así que no se elimina ninguno de sus propios límites. Los cambios posteriores al preset no modifican las partidas que ya lo eligieron. El ajuste se conserva al duplicar, exportar o importar el preset.

#### Ajustes de historia de Game

Un preset puede llevar un estilo de historia, un nivel de violencia y límites de contenido a Game Mode, para que no tengas que configurarlos en cada partida. Consulta [Estilo de la historia, violencia y límites de contenido](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. En la pestaña **Prompts**, bajo **Game story settings**, activa **Bring story settings to games that use this preset** (Llevar los ajustes de historia a los juegos que usen este preset).
2. Elige un **Story style** (Estilo de la historia) y un nivel de **Violence** (Violencia). **Follow rating** (Seguir clasificación) mantiene la violencia de cada partida en el valor predeterminado de su clasificación.
3. Opcional: escribe **Content boundaries** (Límites de contenido), uno por línea.
4. Haz clic en **Save**.

Cuando eliges el preset para una partida, en el asistente de configuración o en **Chat Settings → Prompt Preset** (Ajustes del chat → Preset de prompt), la partida toma el estilo de historia y la violencia del preset. Los límites del preset se agregan a los que ya tiene la partida, así que no se elimina ninguno de sus propios límites. Los cambios posteriores al preset no modifican las partidas que ya lo eligieron. El ajuste se conserva al duplicar, exportar o importar el preset.

El **Marinara's Universal Preset** integrado aporta el texto del prompt, pero ningún parámetro de generación. Sus ajustes antiguos guardados de muestreo, razonamiento, formato y tokens se ignoran, y en su lugar se aplican los ajustes de tu cuenta, las sustituciones del chat y los valores predeterminados de la app. Crea una copia editable para personalizarlo.

## Secciones y marcadores

La pestaña **Sections** es donde construyes el prompt. Las secciones se ensamblan de arriba hacia abajo.

1. Haz clic en **Add Section** (Agregar sección).
2. Elige **Prompt Block** (Bloque de prompt) o un marcador.

Un **Prompt Block** es texto que escribes tú: instrucciones de sistema, reglas de tono, cualquier cosa que quieras en cada prompt. Un marcador no tiene texto propio. Marinara lo rellena con contenido en vivo del chat cuando envía el prompt.

| Marcador | Qué inserta |
| --- | --- |
| **Character Info** | Los detalles de la tarjeta de personaje activa. |
| **Persona** | Los detalles de tu persona activa. |
| **Chat History** | Los mensajes del chat. |
| **Historial reciente** | Mensajes nuevos de **Historial del chat**. Consulta [Dividir el historial con Recent History](#split-the-history-with-recent-history). |
| **Chat Summary** | El resumen compilado del chat. |
| **Dialogue Examples** | El diálogo de ejemplo del personaje. |
| **Lorebook Marker (All)** | Todas las entradas de lorebook activas. |
| **Lorebook Marker (Before)** | Las entradas de lorebook configuradas para ir antes. |
| **Lorebook Marker (After)** | Las entradas de lorebook configuradas para ir después. |
| **Memory Recall** | Los recuerdos que [Memory Recall](../agents/memory.md) encuentra para cada respuesta. Sin este marcador, van justo antes del historial del chat. |

La fila de un marcador muestra una insignia **MARKER**. No puedes escribir en la mayoría de los marcadores. Usa **Lorebook Marker (All)** salvo que quieras separar las entradas de lorebook en antes y después.

Tres marcadores menos comunes:

- **Current Scene Summary** y **Recalled Scenes** colocan los resúmenes que crea Advanced Memory Recall. Sin un marcador **Recalled Scenes**, aparecen antes del historial del chat. Consulta [Memoria](../agents/memory.md).
- **ID Macro Cards** coloca las tarjetas de personaje que traes a un prompt escribiendo el ID de la tarjeta de un personaje entre llaves dobles. Sin este marcador, van en el lugar predeterminado. Consulta [Macros de prompt](macros.md).

Sin un marcador **Dialogue Examples** activado, el diálogo de ejemplo no vacío se agrega a **Character Info** después del escenario, en el formato de envoltura del preset. Agrega el marcador para elegir la ubicación. Marinara nunca lo incluye dos veces.

Si tu chat tiene lorebooks activos pero el preset no tiene ningún marcador de lorebook, un aviso dice: "Add a lorebook marker when this preset should receive active lorebook entries." Agrega uno para que las entradas lleguen al modelo. Consulta [Introducción a los lorebooks](../lorebooks/overview.md).

Si tienes agentes personalizados con "inject as section" activado, el menú de agregar muestra **Agent Sections** (Secciones de agente). Cada una inserta la última salida de ese agente, y puedes agregar tus propias instrucciones alrededor.

### Editar una sección

1. Haz clic en el nombre o en la flecha de una sección para expandirla.
2. Cambia su **Name** o su rol (**System**, **User** o **Assistant**).
3. En un **Prompt Block**, edita **Content** (Contenido). Admite [macros](macros.md).
4. Haz clic en **Save** en la esquina superior derecha.

Los controles de la fila:

- **Duplicate** (Duplicar) copia la sección.
- El icono de ojo la activa o la desactiva.
- **Delete** (Borrar) la elimina.
- Para reordenar, arrastra el tirador, usa las flechas hacia arriba y hacia abajo, o mantén pulsado en una pantalla táctil.

### Grupos

Un grupo envuelve varias secciones en un contenedor.

1. En la pestaña **Sections**, haz clic en **Groups** y luego en **New Group** (Nuevo grupo).
2. Haz clic en el nombre del grupo para cambiarlo.
3. Expande una sección y elige el grupo en su menú desplegable **Group**.

Con **XML**, un grupo se convierte en una etiqueta padre. Con **Markdown**, se convierte en un encabezado. Borrar un grupo no borra sus secciones. Solo pierden el grupo. Las secciones del mismo grupo que no sean contiguas reciben cada una su etiqueta o encabezado.

### Posición y profundidad

Cada sección tiene un ajuste **Position** (Posición) en su editor.

- **Ordered (in sequence)** (Ordenado: en secuencia) coloca la sección donde está en la lista. Esta es la opción normal.
- **Depth (from end of chat)** (Profundidad: desde el final del chat) la coloca un número fijo de mensajes hacia arriba desde el final del chat, según el número **Depth** (Profundidad). Una profundidad de 0 va después del último mensaje. Úsalo para recordatorios que el modelo debe ver cerca de los mensajes más nuevos.

## Formatos de envoltura

**Wrap Format**, en la pestaña **Overview**, fija cómo se envuelve cada sección.

| Formato | Resultado |
| --- | --- |
| **XML** | Cada sección va dentro de etiquetas. Los grupos se convierten en etiquetas padre. Este es el predeterminado. |
| **MARKDOWN** | Cada sección recibe un encabezado. Los grupos se convierten en encabezados de nivel superior. |
| **NONE** | No se agrega ninguna envoltura. El contenido se envía tal como está escrito. |

XML sirve para la mayoría de los modelos. Prueba los demás solo si un modelo responde mejor sin etiquetas.

Para enviar un solo **Prompt Block** sin su etiqueta ni su encabezado, expándelo y activa **Send without wrapper** (Enviar sin envoltura). La etiqueta de un grupo todavía puede rodearlo, así que quita el bloque de su grupo para enviarlo completamente sin envoltura. Los marcadores siempre conservan su envoltura, y el interruptor se oculta cuando el formato es **NONE**.

## Chats de Conversation y Game

Estos chats no construyen un prompt a partir de Sections. Usan un solo prompt de modo. En **Chat Settings**, la sección **Prompt Preset** tiene un menú desplegable **Prompt source** (Fuente del prompt) con tus presets. Empieza en **Default conversation prompt** o **Default game prompt**, o dice **No presets available** (No hay presets disponibles) cuando no tienes ninguno. En el panel **Presets**, el botón de asignar muestra "Prompt presets are not available in conversation mode."

Debajo del menú desplegable, una insignia muestra de dónde viene el prompt.

| Insignia | Significado |
| --- | --- |
| **Default** | El prompt integrado. |
| **Preset** | El prompt del preset elegido. |
| **Style** | El prompt del estilo de prompt del GM seleccionado. Solo en los chats de Game. |
| **Custom** | Una edición local solo para este chat. Tiene prioridad sobre todas las demás. |

El cuadro de texto muestra el prompt en uso. Edítalo para crear una copia local del chat. Si tu texto coincide exactamente con el del preset o el predeterminado, Marinara lo trata como no personalizado. Mientras exista una edición personalizada, aparece un icono de restablecer (su tooltip dice **Reset to default prompt**).

Los chats de Game añaden más controles. **Story style**, **Violence**, **Content boundaries** y **Rating guidelines** (Directrices de clasificación) establecen qué puede contener la historia de la partida. Consulta [Cambiarlos durante una partida](../game/getting-started.md#change-them-during-a-game). Otros dos dan forma al prompt. **GM prompt style** (Estilo de prompt del GM) solo sustituye el prompt de Game, y una edición local del chat sigue teniendo prioridad. **Extra instructions** (Instrucciones adicionales) agrega texto al prompt de Game, hasta 2000 caracteres, como "Write in the style of Terry Pratchett."

## Ordenar las secciones para la caché de prompts

La caché de prompts permite que un servicio reutilice el inicio de un prompt que ya leyó, para que los chats largos cuesten menos y respondan antes. El servicio solo reutiliza el prompt hasta el primer texto que cambió desde el último mensaje. Los recuerdos recuperados cambian con casi cada mensaje, así que, si están antes del historial del chat, dejan todo el historial fuera de la caché.

Para colocarlos tú, agrega un marcador **Memory Recall** al preset. Arrástralo debajo de **Chat History**, o configura su **Position** (Posición) en **Depth (from end of chat)** (Profundidad (desde el final del chat)) para colocarlo dentro del historial. Los recuerdos que se leen antes de la historia hacen que las respuestas se ajusten más a ellos, así que la ubicación predeterminada sigue siendo antes del historial.

<a id="split-the-history-with-recent-history"></a>
## Dividir el historial con Recent History

**Historial reciente** envía los mensajes nuevos en su posición y **Historial del chat** los antiguos. Las secciones entre ellos quedan entre ambos grupos. Úsalo para detalles cambiantes, como lugar o presentes. Los permanentes van encima de **Historial del chat**.

1. En **Secciones**, pulsa **Agregar sección** y **Historial reciente**. Aparece después de **Historial del chat**.
2. Expándelo y fija **Mensajes recientes** (por defecto 4).
3. Arrastra secciones cambiantes, como **Lorebook Marker** o agentes, entre ambos marcadores.
4. Haz clic en **Guardar**.

El modelo lee detalles cambiantes cerca de los mensajes nuevos y los recuerda mejor. El historial antiguo permanece igual y la caché puede reutilizarlo. Con Claude y caché, la marca queda al final de los mensajes antiguos.

- **Máximo de mensajes** de **Historial del chat** cuenta ambas partes; vacío envía todo.
- Si hay menos que **Mensajes recientes**, todos van a **Historial reciente**.
- **Profundidad (desde el final del chat)** cuenta solo mensajes. Una profundidad mayor que **Mensajes recientes** cae en la parte antigua e impide reutilizarla.
- Sin **Historial del chat**, **Historial reciente** envía todo. Si está antes, o es un segundo marcador, no envía nada. La fila avisa en cada caso.
- Con **XML**, los antiguos usan `<chat_history>`, los nuevos `<recent_history>` y el último `<last_message>`.
- Versiones antiguas de Marinara no conocen **Historial reciente** y pueden rechazar el preset al importarlo.

## Bloques de decisión y caché de prompts

Una sección puede contener un bloque de decisión, `{{#if decision:"..."}}`, para que esa parte solo se envíe cuando una declaración sobre el chat sea verdadera. Consulta [Consultar al Decision model](conditional-prompts.md#asking-the-decision-model).

Coloca al final del prompt los bloques de decisión que cambian a menudo, por ejemplo en las instrucciones posteriores al historial. Una rama que cambia puede impedir que un proveedor reutilice el prompt desde ese punto, así que un cambio temprano pierde la mayor parte del ahorro de caché. Una parte anterior sin cambios todavía se puede reutilizar. Mantén una decisión cerca del inicio solo cuando su respuesta cambie poco. Consulta [Caché de prompts](conditional-prompts.md#prompt-caching).

Las declaraciones en secciones y grupos desactivados nunca se preguntan y no cuentan para **Decision statements per turn** (Declaraciones de decisión por turno).

## Comprobar qué recibió la IA

**Peek Prompt** muestra el prompt completamente ensamblado de un mensaje. Es la manera más rápida de depurar una respuesta rara. Consulta [Peek Prompt: ver qué recibió la IA](../chats/peek-prompt.md).

## Guías relacionadas

- [Variables de preset](preset-variables.md)
- [Macros de prompt](macros.md)
- [Parámetros de generación](generation-parameters.md)
- [Perfiles de ajustes](../chats/settings-profiles.md)
- [Introducción a Chat Settings](../chats/chat-settings.md)
- [Peek Prompt: ver qué recibió la IA](../chats/peek-prompt.md)
