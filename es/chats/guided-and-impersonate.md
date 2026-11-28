# Generación guiada e Impersonate

Dos formas de dirigir un chat. La generación guiada orienta la próxima respuesta en una dirección sin publicar un mensaje visible. Impersonate hace que el modelo escriba tu propia respuesta. El menú Quick replies (respuestas rápidas) pone ambas junto a **Send** (Enviar).

## Dirigir una respuesta con /guided

Tu dirección es fuera de personaje. Da forma a la respuesta, pero no aparece como un mensaje del chat.

1. Escribe `/guided` y tu dirección en el cuadro de mensaje.
2. Pulsa <kbd>Enter</kbd> o haz clic en **Send**.

El modelo escribe su próxima respuesta orientada hacia tu dirección. Por ejemplo:

```text
/guided make him admit he is lying
```

Puedes escribir `/narrator`, `/narrate` o `/nar` en lugar de `/guided`. En un chat grupal, apunta la dirección a un personaje con `respond as`, `reply as` o `respond for`:

```text
/guided respond as Alice make her admit she is lying
```

## Guiar una regeneración

Esto reutiliza el texto de tu cuadro de mensaje como una dirección de una sola vez para una regeneración.

1. Abre **Settings → Chatting → Editing & Swipes** (Configuración → Chateando → Edición y swipes) y activa **Guide swipes/regens with chat input** (Guiar swipes/regeneraciones con la entrada del chat). Está desactivado de forma predeterminada.
2. En un chat, escribe una dirección en el cuadro de mensaje, pero no la envíes.
3. Haz clic en **Regenerate** (Regenerar) en el mensaje de la IA. Con texto en el cuadro, la etiqueta del botón es **Regenerate (guided)**.

Después, tu dirección se queda en el cuadro, así que puedes ajustarla y volver a regenerar. Para que se borre en su lugar, desactiva **Keep guidance after regenerating** (Mantener la dirección después de regenerar) en **Settings → Chatting → Message Box** (Configuración → Chateando → Cuadro de mensaje).

Si no funcionó: la etiqueta del botón debe ser **Regenerate (guided)**. Si dice solo **Regenerate**, el ajuste está desactivado o el cuadro está vacío.

<a id="read-stored-guidance"></a>

## Leer la Stored guidance

Marinara guarda la dirección que dio forma a una respuesta.

1. Haz clic en el icono **Stored guidance** (Guía guardada), un pergamino, en el mensaje de la IA.
2. Una ventana titulada **Stored guidance** muestra la dirección.

La ventana indica de dónde vino la dirección: **/guided**, **Guided regenerate** o **Game start** (la configuración de Game Mode). Para las direcciones de `/guided` y de regeneración guiada, **Copy /guided** copia un comando `/guided` listo para usar que puedes pegar en otro chat.

## Escribir tu respuesta con Impersonate

Impersonate hace que el modelo escriba tu próximo mensaje con la voz de tu persona. Una persona es el personaje que interpretas, escrito como `{{user}}`. Consulta [Personas de usuario](../characters/personas.md).

Antes de empezar: Impersonate solo funciona en los chats de Roleplay. En Conversation ves "Impersonate is not available in Conversation mode." (Impersonate no está disponible en el modo Conversation). Tampoco está disponible en Game.

1. Escribe `/impersonate` en el cuadro de mensaje. Si quieres, añade una dirección después.
2. Pulsa <kbd>Enter</kbd> o haz clic en **Send**.

El modelo publica un mensaje de usuario como tu persona. Por ejemplo, esto escribe un mensaje que pregunta por el clima:

```text
/impersonate ask about the weather
```

El alias corto es `/imp`. **Regenerate** funciona en un mensaje que escribió Impersonate, así que puedes obtener otra versión.

Un mensaje publicado cuenta como tu turno, así que los agentes y trackers se ejecutan igual que con uno que escribes tú, salvo que **Omitir agentes** esté activado. Elegir una opción CYOA con **Usar CYOA como dirección** activado también pide la respuesta del personaje justo después. Para leer y editar el mensaje antes, haz que Impersonate escriba un borrador.

### Escribir primero un borrador

El borrador va al cuadro de mensaje en vez de al chat. No se guarda y nada se ejecuta hasta que lo envías: ni respuesta del personaje, ni agentes, ni trackers, ni cambios en el estado del mundo.

1. Abre **Ajustes del chat** en un chat de Roleplay y busca la sección **Suplantar**.
2. Establece **Destino del resultado** en **Borrador de mensaje**. El valor predeterminado es **Publicar**.
3. Escribe `/impersonate` y una dirección si quieres, y pulsa <kbd>Enter</kbd>.

El borrador aparece poco a poco en el cuadro de mensaje. Una línea encima indica **Escribiendo tu próximo mensaje…** mientras se escribe; haz clic en **Detener** allí o en el botón de detener del cuadro para conservar lo escrito hasta entonces. Cuando termine, edita el texto y haz clic en **Enviar**. Hasta que lo envíes, la línea ofrece:

| Botón | Qué hace |
| --- | --- |
| **Rehacer** | Vuelve a escribir el borrador con la misma dirección y sustituye el del cuadro. |
| **Deshacer** | Descarta el borrador y restaura lo que había antes en el cuadro. |

El borrador sigue escribiéndose si cambias de chat o pestaña; al volver, estará en el cuadro de ese chat. Cada chat tiene su propio borrador.

Para elegir una sola vez sin cambiar el ajuste:

| Comando | Qué hace |
| --- | --- |
| `/impersonate_draft` | Escribe un borrador. También `/impd` y `/imp_draft`. |
| `/impersonate_post` | Publica el mensaje. También `/impp` y `/imp_post`. |

Con **Respuestas rápidas** activado, el menú junto a **Enviar** también ofrece ambas opciones: **Suplantar** sigue el ajuste y la segunda acción hace lo contrario. Se puede iniciar un borrador con el cuadro vacío; en ese caso, el modelo elige lo que dices.

Con **Usar CYOA como dirección** activado y **Destino del resultado** en **Borrador de mensaje**, hacer clic en una opción CYOA escribe un borrador que usa esa opción como dirección. Las opciones permanecen visibles hasta que lo envíes.

### Los ajustes de Impersonate

Estos ajustes se aplican a cada `/impersonate` en todos tus chats, en todas las ventanas y dispositivos. Abre **Ajustes del chat** en un chat de Roleplay y busca **Suplantar**. Consulta [Descripción general de Chat Settings](chat-settings.md) para saber cómo abrir el panel.

| Control | Qué hace |
| --- | --- |
| **Destino del resultado** | **Publicar** añade el mensaje al chat de inmediato. **Borrador de mensaje** lo escribe en el cuadro de mensaje para que lo edites y envíes. Consulta [Escribir primero un borrador](#write-a-draft-first). Predeterminado: **Publicar**. |
| **Prompt Template** | Una instrucción opcional que se envía cada vez que usas impersonate. Si está vacía, se usa el prompt (las instrucciones enviadas a la IA) propio del chat o el predeterminado integrado. Admite `{{user}}`, `{{persona_description}}` y `{{impersonate_direction}}`, marcadores de posición que Marinara reemplaza por texto real. Elige **Built-in default** para leer el predeterminado, **Copy built-in default to edit** para empezar una copia, **Save as** para guardar una plantilla con nombre y **Delete template** para quitar una. |
| **Preset** | Un preset de prompt (ajuste guardado) solo para las respuestas de impersonate. Predeterminado: **Use chat default** (Usar el predeterminado del chat). Consulta [Presets](../prompts/presets.md). |
| **Connection** | El modelo para las respuestas de impersonate, por ejemplo uno más barato o más rápido. Predeterminado: **Use chat default**. También puedes elegir **Random** (Aleatorio). Consulta [Conectarte a un proveedor de IA](../connections/connecting-to-a-provider.md). |
| **Omitir agentes** | Omite los agentes (trackers, enrutadores de lorebook y ayudantes similares) durante impersonate. Así se mantiene rápido y no cambia el estado del mundo. Desactivado de forma predeterminada. Un borrador siempre los omite. Consulta [Agentes](../agents/agents-overview.md). |
| **Send Public Faces** (Enviar facetas públicas) | En los chats de Roleplay, un personaje con **Public Face** (Faceta pública) aparece en el prompt de impersonate solo con su nombre y Public Face, para que tu respuesta sepa únicamente lo que tú podrías saber. Eso reemplaza todo lo demás que envía su tarjeta: Description, Personality, Backstory, Appearance, Scenario, System Prompt, el diálogo de ejemplo, los atributos RPG, Post-History Instructions y Depth Prompt. Un personaje con Public Face vacío conserva su tarjeta completa. Las macros que pongas en un preset de impersonate o una plantilla de prompt, como `{{description}}`, siguen enviando lo que nombran. **Regenerate** (Regenerar) conserva el ajuste con el que se escribió el mensaje. Desactivado de forma predeterminada. Consulta [Pestaña Card](../characters/creating-and-editing-characters.md#card-tab). |
| **Use CYOA as direction** | Al hacer clic en una opción CYOA (choose your own adventure, elige tu propia aventura), se usa como dirección de impersonate en lugar de publicarse. Está desactivado de forma predeterminada. Si **Add CYOA choices to the message box instead of sending them** (Añadir las opciones CYOA al cuadro de mensaje en lugar de enviarlas) está activado en **Settings → Chatting → Message Box**, un clic solo añade el texto a tu cuadro de mensaje y este ajuste no tiene efecto. |

### Establecer un prompt para un solo chat

1. Escribe `/impersonate_prompt` y tu prompt entre comillas.
2. Pulsa <kbd>Enter</kbd>.

```text
/impersonate_prompt "You will now play as my OC:"
```

Para volver al predeterminado, escribe `/impersonate_prompt reset`. El alias es `/imp_prompt`.

## Añadir Quick replies junto a Send

Las Quick replies añaden alternativas a **Send** con un solo clic, así que no necesitas escribir un comando slash.

1. Abre **Settings → Chatting → Message Box**.
2. Activa **Quick replies** (Respuestas rápidas). Está desactivado de forma predeterminada.
3. Despliégalo para elegir qué acciones aparecen. Una vez activado, las tres acciones están activadas de forma predeterminada.

| Acción | Qué hace |
| --- | --- |
| **Post only** (Solo publicar) | Añade al chat el mensaje que escribiste sin una respuesta. El comando `/send <message>` hace lo mismo. |
| **Guide reply** (Guiar la respuesta) | Envía el texto que escribiste como una dirección `/guided`. |
| **Suplantar** | Genera una respuesta de tu persona usando el texto escrito como dirección. Sigue **Destino del resultado** y, en Roleplay, una segunda acción junto a ella hace lo contrario (**Suplantar como borrador** o **Suplantar y publicar**). Se oculta en los chats de Conversation. |

Con una acción activada, su botón aparece junto a **Send**. Con más de una, se agrupan en un botón de tres puntos (**Quick replies**) que abre un menú.
