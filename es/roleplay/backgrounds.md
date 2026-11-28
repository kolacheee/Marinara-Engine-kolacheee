# Fondos que siguen la historia

Un chat de Roleplay muestra una imagen de escena completa detrás de tus mensajes. Puede permanecer igual o cambiar a medida que avanza la historia: el agente **Background** (Fondo) elige entre tus imágenes, los lugares que fijas siempre muestran su propia imagen y las imágenes de la galería de un personaje lo acompañan a todos los chats. Cuando la imagen cambia, Marinara hace un fundido de la antigua a la nueva.

Nada de esto requiere generación de imágenes. Sin un modelo de imágenes, eliges entre las imágenes que subes y, si no hay ninguna imagen, el fondo es un color sólido.

## Los fondos de un vistazo

| Quieres | Usa | Guía |
| --- | --- | --- |
| Una imagen detrás de este chat | **Chat Background** (Fondo del chat) | [Fijar un fondo para un solo chat](#set-a-background-for-one-chat) |
| Que la imagen cambie con la escena | El agente **Background** | [Dejar que el agente Background elija](#let-the-background-agent-pick) |
| Que un lugar siempre se vea igual | Un lugar fijado | [Fijar un fondo a un lugar](#pin-a-background-to-a-place) |
| La habitación de un personaje en todos sus chats | Un fondo de galería | [Fondos que acompañan a un personaje](#backgrounds-that-follow-a-character) |
| Imágenes nuevas para lugares, climas y horas del día nuevos | El agente **Illustrator** | [Fondos creados por Illustrator](../media/scene-backgrounds.md) |
| Subir, etiquetar y ordenar tus imágenes, o desenfocarlas | La biblioteca de fondos | [Biblioteca de fondos](../appearance/chat-backgrounds.md) |

Cuando la historia llega a un lugar, Marinara decide en este orden: un fondo fijado a ese lugar en este chat, un fondo de galería que nombre el lugar y la elección del agente Background. Los lugares fijados y de galería solo cambian la imagen por sí solos cuando Marinara sabe dónde está la historia, por la ubicación de **World State** o por **World Maps**. Sin ninguno, el agente Background sigue viendo los fondos de galería por sus lugares. Illustrator solo pinta una imagen nueva si ninguna encaja. Sea cual sea la elegida, se muestra su versión de clima u hora del día cuando la biblioteca tiene una para el clima y la hora de la historia.

## Fijar un fondo para un solo chat

1. Abre el chat. Luego abre **Settings → Appearance → Backgrounds** (Configuración → Apariencia → Fondos).
2. En **Chat Background**, haz clic en **Browse library** (Explorar la biblioteca) y elige una imagen.

Solo cambia ese chat. Para volver al fondo predeterminado, haz clic en **Remove** (Quitar) junto a **Chat Background**. También puedes elegir uno desde **Chat Settings → Background** (Ajustes del chat → Fondo) en el chat. ¿Todavía no tienes imágenes? Consulta [Importar un fondo](../appearance/chat-backgrounds.md#import-a-background).

## Crear tú mismo una versión de clima u hora del día

Tu imagen muestra el dormitorio de día, pero la historia empieza allí de noche y con lluvia. No tienes que esperar a Illustrator:

1. Abre el chat y luego **Ajustes del chat → Fondo**.
2. En **Crear una versión de este fondo**, elige **Clima** y **Hora del día**. **Tal como se pintó** conserva esa parte tal como aparece en la imagen.
3. Haz clic en **Crear versión**.

La conexión de imágenes de Illustrator repinta la imagen desde la original, también si es de galería, y el chat muestra la nueva versión. Se guarda en tu biblioteca de fondos para reutilizarla después sin volver a generarla. Si ya existe, se muestra de inmediato. La conexión de imágenes debe poder partir de una imagen.

## Dejar que el agente Background elija

El agente **Background** se ejecuta después de cada respuesta. Lee la escena y elige, de entre todos tus fondos, la imagen que mejor encaja. Solo elige imágenes que ya tienes; para crear nuevas, usa Illustrator.

1. Abre tu chat de Roleplay y abre **Chat Settings** (Ajustes del chat) con el botón de controles deslizantes.
2. Abre **Agents** (Agentes) y activa **Enable Agents**.
3. Añade el agente **Background**.

Ahora el fondo cambia solo a medida que la historia se mueve entre lugares. El agente lee texto, no imágenes, así que elige según cómo se llama cada una:

- **Imágenes de biblioteca**, por su nombre de archivo y etiquetas, incluidas las de carpetas.
- **Fondos de galería** de los personajes y la persona del chat, por los lugares con los que están etiquetados (como `dorm kitchen`) y su descripción.
- **Lugares fijados** en este chat, por los nombres de las imágenes que fijan.

Se omiten las imágenes cuyo nombre solo tiene letras y números aleatorios (como `70c60b32-6b8c-….jpg`) y no tienen etiquetas, porque nada indica qué lugar muestran. Añade una etiqueta de lugar o un nombre claro para que puedan elegirse. Si nada de lo listado muestra el lugar de la escena, el agente conserva la imagen actual en lugar de adivinar.

**Ajustes del chat → Fondo** explica debajo de la vista previa por qué se eligió la imagen actual. La línea desaparece si eliges una tú.

Si no funcionó: con solo uno o dos fondos, el agente sigue eligiendo esos. Añade más a tu biblioteca. Si tarda, revisa su conexión: espera a otros agentes, como Lorebook Keeper, cuando esa conexión solo procesa una solicitud a la vez.

## Fijar un fondo a un lugar

Usa esto cuando un lugar deba verse siempre igual: la habitación de John siempre muestra `john-bedroom` y tu propia habitación siempre muestra `my-bedroom`. Cuando la historia llega a un lugar fijado, se muestra su imagen, sin importar lo que hubiera elegido el agente Background.

1. Abre **Chat Settings** con el botón de controles deslizantes del chat y abre **Background**.
2. En **Pinned places** (Lugares fijados), haz clic en **Add place** (Añadir lugar).
3. Haz clic en la imagen vacía y elige el fondo. Escribe el lugar tal como lo escribe la historia, por ejemplo `John's bedroom`.
4. Opcional: debajo, añade otros nombres que la historia podría usar, separados por comas, como `John's room, the master bedroom`.

Más rápido: cuando la historia esté en un lugar y se muestre la imagen correcta, haz clic en **Pin this picture to "John's bedroom"** (Fijar esta imagen a "John's bedroom").

Los fondos fijados necesitan saber dónde está la historia, así que usan la ubicación del agente **World State** (Estado del mundo) o World Maps. Al pie de la lista se muestra **Story is at** (La historia está en) y el lugar, y **Here** (Aquí) marca el fondo fijado en uso.

### Cómo se reconocen los lugares

- El nombre más específico tiene prioridad. `John's bedroom` y `{{user}}'s bedroom` nunca se confunden, y un fondo fijado simplemente a `bedroom` solo se usa para habitaciones que nadie haya fijado.
- Una o dos palabras intermedias no impiden la coincidencia: "John's guest bedroom" coincide con `John's bedroom`, salvo que otro fondo fijado nombre ese lugar exactamente. La coincidencia nunca abarca una coma ni otro propietario, así que "John's house, Mara's bedroom" no es la habitación de John.
- `{{user}}` es el nombre de tu persona y `{{char}}` el de cualquier personaje del chat, así que `{{user}}'s bedroom` coincide con "Alyssa's bedroom".
- "My" y "our" pertenecen a quien escribió el mensaje. Cuando la respuesta de John dice que la historia está en "my bedroom", es la habitación de John; "your bedroom" en su respuesta es la tuya. En tu propio mensaje, "your bedroom" es la del personaje cuando solo hay uno en el chat.
- Las mayúsculas, los acentos y los apóstrofos no importan. Los nombres coinciden con palabras completas: `John` nunca coincide con "Johnson".
- Con **World Maps**, elige el lugar de la lista **World Maps place** (Lugar de World Maps). Un edificio fijado también abarca sus habitaciones que no tengan un fondo fijado propio.

### Qué cambia al fijar un fondo

- La imagen se muestra una vez al llegar. Si eliges otro fondo a mano mientras estás allí, el tuyo permanece hasta que la historia se traslada a otro lugar.
- En un lugar fijado, el agente Background no puede cambiar la imagen e Illustrator no pinta un fondo nuevo. Con **Versiones de fondos según el clima** o **Versiones de fondos por hora del día** activado, la imagen fijada sigue recibiendo su versión de lluvia, nieve, niebla o noche.

Si no funcionó: comprueba que **Story is at**, debajo de la lista, muestre el lugar y que uno de los nombres del fondo fijado aparezca allí palabra por palabra.

## Fondos que acompañan a un personaje

Una imagen de la **Gallery** (Galería) de un personaje o una persona se puede etiquetar como fondo. Así aparece en todos los chats en los que esté ese personaje, sin tener que fijarla en cada chat.

1. Abre **Images → Gallery** (Imágenes → Galería) del personaje. Haz clic en el botón de etiqueta de una imagen y elige **Use as background** (Usar como fondo).
2. Escribe los lugares que muestra, separados por comas, como `{{char}}'s bedroom, {{char}}'s room`. En la galería de un personaje, `{{char}}` es ese personaje; en la de una persona, `{{user}}` es esa persona. Déjalo vacío si la imagen no representa un lugar concreto.

El botón de etiqueta de la imagen pasa a mostrar **Background:** (Fondo:) y sus lugares. Haz clic en él para **Edit places** (Editar lugares) o **Remove background tag** (Quitar la etiqueta de fondo).

En un chat con ese personaje, **Chat Settings → Background** enumera estas imágenes en **From character and persona galleries** (De las galerías de personajes y personas). Haz clic en una para usarla. Las que nombran lugares también funcionan como lugares fijados y aparecen en **Pinned places** con "In John's gallery, follows them into every chat" (En la galería de John, lo acompaña a todos los chats). Un fondo fijado en el propio chat tiene prioridad sobre una imagen de galería con el mismo lugar.

### Mover una imagen del chat a la galería de un personaje

Un fondo que Illustrator creó en un chat puede pasar a pertenecer a un personaje de forma permanente:

1. Abre **Chat Settings → Gallery** (Ajustes del chat → Galería) en el chat.
2. En la imagen, haz clic en el botón de silueta (**Add to a character's or persona's gallery**, Añadir a la galería de un personaje o una persona) y elige a quién pertenece.

Su etiqueta de fondo y sus lugares se conservan. La imagen no se copia y permanece en su galería cuando se elimina el chat. Exportar un personaje como **Marinara Native** conserva estas etiquetas.

Los fondos de galería también reciben versiones según el clima. La versión de lluvia o nieve se guarda en tu biblioteca de fondos como `gallery-…--wx-rain.png`.

## Guías relacionadas

- [Fondos creados por Illustrator](../media/scene-backgrounds.md): pintar lugares nuevos, versiones de clima y hora del día, y máscaras de ventanas.
- [Biblioteca de fondos](../appearance/chat-backgrounds.md): subidas, etiquetas, carpetas y desenfoque.
- [Galerías de personajes y personas](../characters/galleries.md)
- [Roleplay Mode: primeros pasos](getting-started.md)
