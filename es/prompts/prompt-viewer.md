# Visor de prompts

El visor de prompts pone un preset, lorebooks, personajes y una persona lado a lado y muestra el prompt que forman, en el orden en que Marinara lo envía. Haz clic en cualquier parte para editarla allí mismo. Las ediciones se guardan en el preset, lorebook, tarjeta o persona real, así que los otros editores las muestran enseguida.

Empezó como la extensión AIO Prompt Viewer and Editor de kolache y ahora forma parte del nuevo diseño.

<a id="opening-it"></a>
## Cómo abrirlo

- **Computadora:** el botón del visor de prompts (🥞) en la barra superior, justo después de Search.
- **Teléfono o tableta:** toca el contador de pestañas para abrir All Tabs y luego el botón del visor (🥞) junto a **+**.
- **Desde cualquier lugar:** abre Search y escribe `prompt viewer`.

Se abre en su propia pestaña. Cambiar de pestaña conserva las selecciones y ediciones pendientes; si cierras con cambios sin guardar, pide confirmación.

<a id="the-three-columns"></a>
## Las tres columnas

| Columna | Para qué sirve |
| --- | --- |
| **Sources** | Elige un preset, uno o más lorebooks, un personaje (varios para un grupo) y una persona. Marca entradas o carpetas de lorebooks para incluirlas en el prompt. **+** crea un elemento; el lápiz abre sus ajustes. |
| **Prompt** | Tu selección en el orden de ensamblaje: secciones del preset, entradas en sus posiciones y profundidades, personaje y persona en sus marcadores. **Validate** busca etiquetas XML sin cerrar y `{{macros}}` rotas. Arrastra secciones para reordenar el preset. |
| **Editor** | Los campos de la parte elegida. **Guardar** guarda; **Revertir** descarta la edición. |

En un teléfono o tableta vertical, las columnas se eligen con **Sources / Prompt / Editor**. Al tocar un bloque se abre Editor.

<a id="inspect-summaries-and-settings"></a>
## Inspect, Summaries y Settings

Los botones superiores abren estas vistas dentro de la página; **Volver** vuelve a las columnas.

- **Inspeccionar** muestra el prompt como se enviaría al modelo. Con un chat abierto, **Include history** solicita el prompt exacto (macros resueltas e historial recortado); **Omit history** muestra la estructura con un marcador para el chat. Cópialo como texto o lista JSON de mensajes.
- **Summaries** exporta todos los resúmenes de chats de la biblioteca como Markdown o JSON, incluidas las entradas desactivadas. No necesitas un chat abierto.
- **Settings** configura cómo Inspect trata el historial, cuántos turnos muestra un chat sin conexión, las insignias de la columna Prompt y los colores de Inspect.

<a id="what-it-does-not-show"></a>
## Lo que no muestra

- La columna Prompt excluye agentes; Inspect los incluye porque consulta a la Engine.
- El historial, resúmenes, ejemplos de diálogo y datos de agentes son marcadores en Prompt: su contenido solo existe al ejecutar un chat.
- El comportamiento del grupo por turno (quién responde, «Respond only as…») se describe, pero no se construye hasta abrir un chat.
