# Fondos creados por Illustrator

El agente **Illustrator** puede dibujar fondos para tu historia: uno cuando se lo pidas, uno cada vez que la historia llegue a un lugar nuevo y versiones con lluvia, nieve o niebla de un fondo cuando cambie el clima. Esta guía explica las tres opciones y cómo Illustrator reutiliza las imágenes que ya tienes en lugar de dibujar otras nuevas.

Para las imágenes que subes y eliges a mano, consulta [Biblioteca de fondos](../appearance/chat-backgrounds.md). Para saber cómo elige un chat qué imagen mostrar (el agente Background, los lugares fijados y las imágenes de la galería), consulta [Fondos que siguen la historia](../roleplay/backgrounds.md).

## Antes de empezar

- Instala **Illustrator** desde **Library → Agents** (Biblioteca → Agentes). Consulta [Agente Illustrator](illustrator-agent.md).
- Asígnale un modelo de imagen: configura la tarea **Images** (Imágenes) en el cuadro **Defaults** (Tareas) de la página Connections, o elige uno en la pantalla **Open Setup** (Abrir la configuración) de Illustrator. Consulta [Proveedores de generación de imágenes y configuración](image-providers.md).

Los fondos dibujados funcionan en los chats de Roleplay y Game, no en Conversation. En Conversation, la app dice "Scene background generation is available in Roleplay and Game modes."

## Dibujar un fondo ahora

1. Abre **Chat Settings** (Ajustes del chat) con el botón de controles deslizantes del chat y despliega **Gallery** (Galería).
2. Haz clic en **Background** (Fondo). Muestra **Generating...** (Generando...) mientras trabaja.
3. Cuando termina, la imagen nueva se agrega a tu biblioteca de fondos y se muestra detrás del chat. "Background generated." lo confirma.

No necesitas agregar Illustrator al chat para esto. Se ejecuta una vez y no inicia ejecuciones automáticas.

Marinara construye el prompt (las instrucciones enviadas a la IA) a partir de la escena: en un juego, esto incluye el género, el escenario, el lugar, el clima y la hora del día. La imagen usa el tamaño de lienzo **Backgrounds** (Fondos), de 1280 por 720 píxeles salvo que lo cambies en **Settings → Media → Image Generation** (Configuración → Medios → Generación de imágenes).

Si no funcionó: "Choose an image generation connection for the Illustrator agent, or mark one as the default image connection." significa que no se encontró ningún modelo de imagen. Configura uno como se describe en **Antes de empezar**. Si falta el botón **Background**, Illustrator no está instalado.

## Un fondo nuevo para cada lugar nuevo

Con esta opción activada, Illustrator dibuja un fondo cuando la historia llega a un lugar que no tiene ninguno, lo guarda en tu biblioteca y lo muestra.

1. Agrega **Illustrator** al chat: en **Chat Settings → Agents** (Ajustes del chat → Agentes), activa **Enable Agents** (Activar agentes) y luego agrega **Illustrator** desde **Misc Agents** (Agentes varios).
2. En la tarjeta **Illustrator**, activa **Generate Scene Backgrounds** (Generar fondos de escena).

Illustrator revisa la escena según su **Image Run Interval** (Intervalo de generación de imágenes), cada 5 mensajes salvo que lo cambies. Para que revise cada respuesta, usa las [comprobaciones con un modelo de decisión](#check-every-reply-with-a-decision-model). En Game Mode, el interruptor **Game Illustrator** también abarca los fondos.

### Reutilizar las imágenes que ya tienes

Antes de dibujar un lugar nuevo, Illustrator busca una imagen que ya tengas, en este orden:

1. Un fondo fijado a ese lugar, en el chat o en la galería de un personaje. Consulta [Fijar un fondo a un lugar](../roleplay/backgrounds.md#pin-a-background-to-a-place).
2. Una imagen de la biblioteca cuyo nombre, o una etiqueta de dos o más palabras, aparezca en la ubicación de World State. Por ejemplo, `generated-guest-bedroom.png`, o una imagen con la etiqueta `guest bedroom`, sirve para "Smith House, guest bedroom".
3. Si no hay una ubicación de World State, se busca de la misma forma una coincidencia con el nombre del lugar que escriba el modelo de prompts de Illustrator.

No importan las mayúsculas, los acentos ni "'s", y el nombre más específico tiene prioridad sobre un simple `bedroom.png`. Si alguna coincide, se muestra (con el clima de la historia, cuando existe esa versión) y no se dibuja nada. Solo un lugar sin coincidencias recibe una imagen nueva.

Para asegurarte de que un lugar conserve su imagen, ponle al archivo el nombre del lugar (`kitchen.png` para "Kitchen") o asígnale una etiqueta de dos o más palabras, como `smith house kitchen` (consulta [Etiquetar un fondo](../appearance/chat-backgrounds.md#tag-a-background)). Las etiquetas de una sola palabra como `kitchen` o `night` se ignoran aquí, porque suelen describir el aspecto de una imagen.

## Versiones de fondos según el clima

Con esta opción activada, el fondo sigue el clima de la historia. Cuando empieza a llover en la posada, Illustrator vuelve a dibujar su fondo con lluvia en las ventanas. En interiores, la lluvia animada cae solo detrás de los vidrios de las ventanas, nunca por toda la habitación.

1. Abre **Chat Settings → Agents → Illustrator** (Ajustes del chat → Agentes → Illustrator).
2. Activa **Weather Versions of Backgrounds** (Versiones de fondos según el clima).

Necesita un modelo de imagen que pueda partir de una imagen. La mayoría puede, incluidos OpenAI, Gemini, NovelAI y ComfyUI con una entrada de imagen. Con uno que no pueda, la imagen se queda como está.

Qué ocurre:

- Cada imagen con cada clima se dibuja **una vez**. Cuando el clima vuelve a cambiar, o la historia regresa a la posada bajo la lluvia, se vuelve a mostrar la versión guardada sin costo.
- La versión se guarda junto al original como `name--wx-rain.png`. Los otros tipos son `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom` y `aurora`, además de `clear` para una copia sin precipitaciones de una imagen creada originalmente con mal clima. El clima inusual recibe una versión con las palabras de la propia historia: una lluvia de meteoros es `name--wx-meteor-shower.png`.
- El tiempo despejado, soleado, nublado, ventoso y otras condiciones leves conservan la imagen normal.
- Lee el clima del agente **World State**, o de una comprobación con un modelo de decisión (abajo).
- Abarca todos los fondos de tu biblioteca, tanto si los elegiste tú como si los eligió el agente Background o los dibujó Illustrator, además de los lugares fijados y los fondos de galería que siguen a un personaje. El agente **Background** elige entre tus imágenes normales y se muestra la versión del clima correspondiente cuando existe.

### Ventanas: dónde caen los efectos climáticos animados

La primera vez que una imagen de interior recibe una versión según el clima, Illustrator también le pregunta al modelo de imagen dónde están las ventanas. Guarda la respuesta como una pequeña máscara en blanco y negro que comparten todas las versiones de esa habitación según el clima. Los efectos climáticos animados (líneas de lluvia, copos de nieve, pétalos) se dibujan entonces solo sobre el vidrio.

- Una habitación sin ventanas no recibe efectos climáticos animados, solo el color del clima y los destellos de los relámpagos.
- Una aurora, una lluvia de meteoros y otros fenómenos sin elementos que caigan permanecen estáticos: la imagen los muestra y nada se mueve sobre ella.
- Las máscaras se guardan en `backgrounds/weather-masks` dentro de tu carpeta de datos.

### Volver a crear una imagen del clima o sus ventanas

Mientras el chat muestra una versión según el clima, **Chat Settings → Agents → Illustrator** tiene una fila debajo de **Weather Versions of Backgrounds** con el nombre del clima, como **This rain picture** (Esta imagen de lluvia):

- **Remake picture** (Volver a crear la imagen) dibuja de nuevo esta versión según el clima a partir de la imagen normal.
- **Remake windows** (Volver a crear las ventanas) vuelve a pedirle al modelo de imagen la máscara de las ventanas. Úsalo cuando la lluvia caiga sobre los cojines o no aparezca en una ventana.
- **No moving weather** (Sin efectos climáticos animados) desactiva la máscara para esta habitación. Sus versiones según el clima muestran solo el color del clima y los relámpagos. **Remake windows** la restaura.

Si no funcionó: comprueba que World State del chat muestre un **Weather** (Clima), o que la comprobación del clima de abajo esté activada, y que **Illustrator** esté agregado al chat con un modelo de imagen.

## Comprobar cada respuesta con un modelo de decisión

Illustrator normalmente solo revisa la escena según su intervalo de ejecución, así que un lugar nuevo puede esperar varias respuestas hasta recibir su fondo. Un [modelo de decisión](../connections/decision-models.md), un modelo pequeño que responde sí o no, puede comprobar cada respuesta en su lugar.

Antes de empezar: elige un modelo de decisión en el cuadro **Defaults** de la página Connections y activa **Generate Scene Backgrounds**, **Weather Versions of Backgrounds** o ambas opciones.

1. Abre **Chat Settings → Agents → Illustrator**.
2. En **Decision Model Checks** (Comprobaciones con un modelo de decisión), elige **The scene moved to a new place** (La escena se trasladó a un lugar nuevo), **The weather changed** (El clima cambió) o **New place and weather changes** (Lugar nuevo y cambios de clima). De forma predeterminada está en **Off** (Desactivado).

Después de cada respuesta:

- La comprobación de lugar nuevo pregunta si el mensaje más reciente traslada la escena a un lugar nuevo. Un sí hace que el lugar reciba un fondo, reutilizando uno que ya tengas cuando sea posible. El modelo de prompts solo escribe un fondo nuevo después de un sí.
- La comprobación del clima pregunta si el clima cambia en el mensaje más reciente. Un sí muestra o dibuja la versión del fondo actual según el clima. Si World State no indica un clima, el modelo de decisión también elige el tipo de clima.
- Las comprobaciones solo agregan oportunidades para actuar. La ejecución propia de Illustrator y los cambios de ubicación de World State siguen contando.
- Si no hay respuesta (por falta de modelo, tiempo de espera agotado o un error), se omite la comprobación.

Si no funcionó: sin un modelo de decisión elegido, la lista aparece desactivada e indica dónde elegir uno.

## Revisar el prompt antes de enviarlo

1. Abre **Settings → Media → Generation Defaults** (Configuración → Medios → Valores predeterminados de generación).
2. Activa **Expose media prompts before sending**.

Entonces se abre una ventana **Review Image Prompt** (Revisar prompt de imagen) antes de cada solicitud de imagen, incluidos los fondos dibujados. Edita el prompt y el prompt negativo y luego haz clic en **Generate** (Generar) para enviar o en **Cancel** (Cancelar) para detener. El texto que escribes se envía exactamente como está escrito.

## Guías relacionadas

- [Fondos que siguen la historia](../roleplay/backgrounds.md): qué imagen muestra un chat, lugares fijados y fondos de galería.
- [Biblioteca de fondos](../appearance/chat-backgrounds.md): subir, etiquetar y organizar imágenes, y desenfoque.
- [Agente Illustrator](illustrator-agent.md): ilustraciones de escena, clips e intervalo de ejecución.
- [La galería del chat](../chats/chat-gallery.md): la sección Gallery y sus botones.
- [Modelos de decisión](../connections/decision-models.md)
