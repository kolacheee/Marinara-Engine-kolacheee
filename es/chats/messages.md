# Acciones de mensaje: editar, borrar, hacer swipe y regenerar

Cada mensaje, tuyo o de la IA, tiene una barra de herramientas. Úsala para editar, borrar, regenerar, ocultar o crear una rama desde un mensaje.

En una computadora, pasa el cursor sobre un mensaje para que aparezca su barra de herramientas. En un teléfono o una tableta, mantén pulsado un mensaje: las mismas acciones se abren en un panel.

## La barra de herramientas del mensaje

Los más usados:

- **Edit** (Editar) cambia el texto del mensaje.
- **Regenerate** (Regenerar) le pide al modelo una nueva versión de una respuesta de la IA. Cada versión se llama swipe (respuesta alternativa).
- **Delete** (Borrar) quita el mensaje.

Los botones son iconos. Sus etiquetas están abajo. Algunos solo aparecen en ciertas situaciones.

| Botón | Qué hace |
| --- | --- |
| **Copy** (Copiar) | Copia el texto del mensaje. |
| **Edit** | Abre el mensaje para editarlo. |
| **Regenerate** | Crea un nuevo swipe (otra versión de la respuesta). Solo en los mensajes de la IA. También en tus mensajes en Roleplay, y en tus mensajes hechos con Impersonate en Conversation. |
| **Delete** | Borra el mensaje. |
| **Translate** (Traducir) / **Hide translation** (Ocultar traducción) | Traduce el mensaje a tu idioma y luego oculta la traducción. |
| **Add reaction** (Añadir reacción) | Abre un selector de emojis. Solo en Conversation. |
| **Hide from AI** (Ocultar a la IA) / **Unhide from AI** (Mostrar a la IA) | Deja de enviar o vuelve a enviar este mensaje al modelo. En un chat grupal de Roleplay, abre un selector de personajes. |
| **Bookmark, pin or note** (Marcar, fijar o añadir una nota) | Añade el mensaje a los marcadores, lo fija para que se quede en el prompt (las instrucciones enviadas a la IA) más allá del límite del historial (hasta 10 por chat) o añade una **Private note** (Nota privada). El modelo nunca ve una nota a menos que actives **Show the note to the narrator character** (Mostrar la nota al personaje narrador), que funciona en los chats de un solo personaje y en los chats grupales con respuestas individuales. |
| **Branch from here** (Ramificar desde aquí) | Copia el chat hasta este mensaje en una nueva rama. No está en los chats de escena. |
| **Clone from here** (Clonar desde aquí) | Copia un chat de escena hasta este mensaje en un nuevo Roleplay. Solo en los chats de escena. |
| **Peek prompt** (Ver el prompt) | Muestra el prompt exacto de esta respuesta. Solo en el mensaje más reciente de la IA. |
| **Stored guidance** (Guía guardada) | Muestra la dirección que orientó esta respuesta. Solo en las respuestas hechas con una dirección guiada o con Impersonate. |
| **View model thoughts** (Ver los pensamientos del modelo) | Abre el razonamiento oculto del modelo. Solo si el modelo devolvió razonamiento. |
| **Show original before rewrite** (Mostrar original antes de la reescritura) / **Show rewritten version** (Mostrar versión reescrita) | Alterna entre el texto original y el reescrito cuando un agente (un ayudante que se ejecuta junto a las respuestas) reescribió el mensaje. |
| **Mark as new start** (Marcar como nuevo inicio) | Solo en Roleplay. Hace que la memoria que el modelo tiene del chat empiece en este mensaje, cuando Advanced Memory (la función de memoria a largo plazo de Marinara) está activado. Consulta [Advanced Memory](../agents/memory.md). |
| **Pause speaking** (Pausar la voz) / **Resume speaking** (Reanudar la voz) / **Restart speaking** (Reiniciar la voz) | Controla el audio hablado cuando Text to Speech (una voz lee los mensajes en voz alta) está activado y hablando. |

Más: [Peek Prompt](peek-prompt.md), [Ramas de chat](branches.md), [Escenas](../roleplay/scenes.md) (un chat de escena es un Roleplay corto que se ramifica de un chat), [Traducción de mensajes](../integrations/message-translation.md), [Configuración de Text to Speech (TTS)](../media/tts-setup.md), [Generación guiada e Impersonate](guided-and-impersonate.md), [notas privadas](../roleplay/getting-started.md#your-private-notes).

## Editar un mensaje

1. Haz clic en **Edit** en el mensaje. El texto se convierte en una caja editable.
2. Cambia el texto.
3. Haz clic en **Save** (Guardar), o pulsa <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (<kbd>Cmd</kbd>+<kbd>Enter</kbd> en un Mac).
4. Para parar sin guardar, haz clic en **Cancel** (Cancelar) o pulsa <kbd>Esc</kbd>.

Dos ajustes de **Settings → Chatting → Editing & Swipes** (Configuración → Chateando → Edición y swipes) te permiten empezar a editar más rápido. Ambos están activados de forma predeterminada.

- **Up Arrow edits last message**: pulsa <kbd>Up</kbd> mientras la caja de entrada está vacía.
- **Double-click edits messages**: haz doble clic o doble toque en un mensaje de Roleplay.

## Borrar un mensaje

1. Haz clic en **Delete** en el mensaje. Se abre el cuadro de diálogo **Delete message** (Borrar mensaje).
2. Elige una opción.

| Opción | Qué hace |
| --- | --- |
| **Delete only this swipe (1/3)** | Quita el swipe que estás viendo. Solo aparece cuando hay más de un swipe. |
| **Delete all other swipes** | Conserva el swipe que estás viendo y quita los demás. Solo aparece cuando hay más de un swipe. |
| **Delete this message** | Quita el mensaje y todos sus swipes. |
| **Delete more** | Selecciona este mensaje y todos los mensajes de abajo, y abre la barra de selección. |
| **Cancel** | Cierra el cuadro de diálogo. |

En la barra de selección, haz clic en los mensajes para añadirlos. **Select all messages above** (Seleccionar todos los mensajes de arriba) y **Select all messages below** (Seleccionar todos los mensajes de abajo) amplían la selección, **Unselect all** (Deseleccionar todo) la vacía y **Delete selected** (Borrar seleccionados) quita el resto. La barra muestra cuántos hay seleccionados.

Los mensajes del sistema, como una línea de "joined the chat", se borran con un clic y sin cuadro de diálogo.

## Swipes: respuestas alternativas

Un swipe es una versión de una respuesta de la IA. Un mensaje puede contener varios, así que puedes comparar respuestas y quedarte con la que te guste. Un control de swipe aparece cuando un mensaje tiene dos o más. Muestra el swipe activo y el total, por ejemplo "2/4".

- **Previous swipe** (Swipe anterior) y **Next swipe** (Swipe siguiente) recorren los swipes.
- La caja de número salta a un swipe. Escribe un número y pulsa <kbd>Enter</kbd>. Su etiqueta es **Jump to swipe 1-N**.
- En el swipe más nuevo, el botón de avance se convierte en **Generate next swipe** (Generar swipe siguiente) y crea un nuevo swipe.

No puedes borrar el último swipe. La app dice "Cannot delete the last remaining swipe" (No se puede borrar el único swipe restante). Usa **Delete this message** en su lugar.

## Gestos táctiles

En la nueva distribución de un teléfono o una tableta, los swipes y las pulsaciones largas reemplazan los botones que aparecen al pasar el cursor en una computadora.

- **Desliza la respuesta más reciente** hacia la izquierda o la derecha para moverte entre sus swipes. Si deslizas hacia la izquierda más allá del último, pregunta "Generate a new reply?" (¿Generar una respuesta nueva?) antes de crearla, porque una respuesta nueva cuesta una solicitud.
- **Desliza el título** de la barra superior hacia la izquierda o la derecha para moverte entre las pestañas abiertas. Inicio cuenta como la pestaña anterior a la primera. Esto funciona en la distribución para teléfonos, que usa una tableta cuando se sostiene en vertical; cuando se gira de lado, la tableta muestra la barra de pestañas en su lugar.
- **Desliza un chat** de la lista de chats hacia la izquierda para mostrar **Pin** (Fijar), **Rename** (Renombrar), **Tags** (Etiquetas) y **Delete**.
- **Mantén pulsado un mensaje** para ver sus acciones: Regenerate, Edit, Copy, Branch y las demás. Mantener pulsado un mensaje no selecciona su texto. Para copiar parte de un mensaje, abre **Edit** y selecciona allí las palabras.
- **Mantén pulsado un chat** de la lista de chats para ver las mismas acciones.

Desactiva los swipes con **Swipe gestures on touch screens** (Gestos de swipe en pantallas táctiles), en Settings > Chatting > Editing & Swipes. Las pulsaciones largas siguen funcionando de cualquier forma.

La primera vez que Marinara se abre en un teléfono, una tableta o una computadora, un tutorial breve muestra dónde está cada cosa en ese tipo de dispositivo, incluidos estos gestos en las pantallas táctiles. Cada modo de chat también muestra sus consejos la primera vez que se abre allí. Puedes repetir cualquiera de ellos desde Settings > General > Walkthroughs.

## Regenerar, continuar y reintentar

Estas tres acciones se parecen y hacen cosas distintas.

| Acción | Resultado |
| --- | --- |
| **Regenerate** | Un nuevo swipe. El original se conserva. En una pantalla táctil, la app primero pregunta "Regenerate this message as a new swipe?" (¿Regenerar este mensaje como un nuevo swipe?). Con una dirección guiada preparada, el botón dice **Regenerate (guided)**. |
| **Seguir escribiendo** (o `/continue`) | Más texto en el mismo mensaje, sin un nuevo swipe. |
| **Send** (Enviar) vacío | Una respuesta nueva. |

### Continuar una respuesta

Abre **⋯** en la última respuesta de la IA y elige **Seguir escribiendo** (en un teléfono o tablet, mantén pulsado el mensaje). El modelo retoma donde se detuvo su última respuesta y el texto nuevo aparece poco a poco en el mismo mensaje, en el swipe que estás viendo. Seguir escribiendo solo aparece en el último mensaje del chat, cuando es una respuesta de la IA.

Para dejar Seguir escribiendo en el mensaje, selecciónalo en **Configuración → Chateando → Botones de mensajes**. Queda debajo del mensaje, junto a **Regenerar**.

También puedes escribir `/continue` (o `/cont`) en la caja de entrada y enviarlo:

```text
/continue
```

Marinara añade una línea en blanco antes del texto nuevo. Para adjuntarlo directamente al último carácter, desactiva **Configuración → Chateando → Respuestas → Añadir una línea nueva antes del texto de Seguir escribiendo**.

### Reintentar con un Send vacío

Si el último mensaje es tuyo y la caja de entrada está vacía, **Send** reintenta en lugar de enviar. En Roleplay, un **Send** vacío también empieza un turno nuevo después de que la IA ya respondió. Nunca se suma a la respuesta anterior. Consulta [Enviar mensajes y streaming](sending-and-streaming.md#retry-without-retyping).

## Ocultar un mensaje a la IA

Haz clic en **Hide from AI** para mantener un mensaje fuera del prompt en los turnos siguientes. El mensaje sigue visible para ti con una etiqueta **Hidden from AI** (Oculto a la IA). Haz clic en **Unhide from AI** para volver a enviarlo.

En un chat grupal de Roleplay, **Hide from AI** abre un selector de avatares. Elige el avatar del grupo para ocultar el mensaje a todos, o elige uno o más personajes para ocultarlo solo a ellos. Una marca de ojo tachado en el mensaje muestra quién no puede verlo. En un chat de un solo personaje, el botón oculta o muestra el mensaje directamente.

Si ocultas un mensaje a un personaje, ese personaje sigue recibiendo un susurro que haya en él, pero nada del resto. Ocultarlo a todos también quita los susurros. Consulta [Susurros y secretos](../roleplay/getting-started.md#whispers-and-secrets).

Para ocultar un rango, usa `/hide` y `/unhide`. Consulta [Referencia de comandos slash](slash-commands.md). Los números de mensaje empiezan en 1 en el primer mensaje.

Cuando **Decide who sees new messages** (Decidir quién ve los mensajes nuevos) de Advanced Memory está activado, los mensajes nuevos de un chat grupal en el que los personajes responden de uno en uno se ocultan automáticamente a los personajes ausentes. Tu propia elección siempre tiene prioridad. Consulta [Decidir quién ve los mensajes nuevos](../agents/memory.md#deciding-who-sees-new-messages).

<a id="message-display-toggles"></a>

## Interruptores de visualización de mensajes

Están en **Settings → Chatting → Message Info** (Configuración → Chateando → Información del mensaje).

| Interruptor | Predeterminado | Qué muestra |
| --- | --- | --- |
| **Show message numbers** | Desactivado | Un número en cada mensaje, los mismos números que usan `/goto`, `/hide` y `/unhide`. |
| **Show token usage on messages** | Desactivado | Los tokens del prompt y los de la respuesta en cada respuesta de la IA (los tokens son pequeños fragmentos de texto que cuenta el modelo), más los aciertos de caché y el tiempo de respuesta cuando están disponibles. |
| **Show model name on messages** | Desactivado | El modelo que escribió cada respuesta. |
| **Show "older messages not sent" note** (Mostrar la nota "mensajes antiguos no enviados") | Activado | Una nota debajo de una respuesta, por ejemplo "1109 older messages not sent", cuando los mensajes antiguos no cupieron en el prompt. Las notas sobre una respuesta cortada o vacía siempre se muestran. |
