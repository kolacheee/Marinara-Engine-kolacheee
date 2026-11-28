# La galería del chat

La sección **Gallery** (Galería) contiene las imágenes y los videos de un chat: ilustraciones, selfies, fondos pintados, fotogramas de storyboard y cualquier archivo que subas. Es una sección de **Chat Settings** (Ajustes del chat). En una computadora puedes abrirla en su propia ventana (consulta [Descripción general de los ajustes del chat](chat-settings.md#popping-a-section-out-into-its-own-window)).

La Gallery de un chat pertenece a ese chat. Las imágenes que quieras conservar para un personaje, sin importar en qué chat esté, van en la Gallery del propio personaje. Consulta [Galerías de personajes y personas](../characters/galleries.md).

## Imágenes y videos

La sección **Gallery** tiene dos pestañas, **Images** (Imágenes) y **Videos**. Cada pestaña muestra cuántos elementos contiene. La pestaña **Videos** contiene videos de escena en los chats de Roleplay y Game, y mensajes de video en los chats de Conversation.

En la parte superior de la sección, los botones de acción aparecen solo cuando la función correspondiente se aplica al chat:

- **Illustrate** (Ilustrar): ejecuta el agente Illustrator para generar una imagen puntual de la escena. Consulta [Agente Illustrator](../media/illustrator-agent.md).
- **Selfie**: genera un selfie de un personaje en el modo Conversation.
- **Background** (Fondo): pinta y aplica un fondo para la escena actual. Consulta [Fondos creados por Illustrator](../media/scene-backgrounds.md#paint-a-background-now).
- **Video**: crea un video de escena a partir de la última ilustración. En el modo Conversation, envía en su lugar un mensaje de video de un personaje; consulta [Mensajes de video](../conversation/selfies.md#video-messages).
- **Create storyboard** (Crear storyboard): genera fotogramas clave para el último turno de Game Mode o el último episodio completado de Roleplay cuando Storyboard está activo.
- **Browse Images** (Explorar imágenes): abre un explorador de imágenes guardadas para insertarlas.
- **View storyboard** (Ver storyboard): abre el último storyboard de Game Mode.

Debajo de los botones está la zona **Upload Images** (Subir imágenes). Arrastra imágenes a esa zona para agregar tus propias imágenes a la Gallery de este chat.

### Acciones por imagen

Pasa el puntero sobre una imagen en la pestaña **Images**, o tócala en un teléfono, para ver sus acciones:

- Abre la imagen a tamaño completo (**Open gallery image**, Abrir imagen de la galería).
- **Pin to chat** (Fijar al chat): fija la imagen al chat como una imagen flotante. Arrástrala para moverla y usa el control de la esquina para cambiar su tamaño. Conserva su posición y tamaño cuando recargas la página en este navegador. El botón del candado junto al botón de cerrar impide moverla o cambiar su tamaño hasta que la desbloquees.
- **Download image** (Descargar imagen): guarda la imagen en tu dispositivo.
- **Animate illustration** (Animar ilustración): convierte esa imagen en un video de escena.
- **Copy prompt** (Copiar prompt): copia el prompt (las instrucciones enviadas a la IA) guardado de la imagen. Si la imagen no tiene un prompt guardado, muestra **No prompt saved** (Ningún prompt guardado) y está desactivado.
- El botón de etiqueta en la esquina superior izquierda de la imagen: **Use as background** (Usar como fondo) la etiqueta como fondo y pregunta qué lugares muestra, como `John's bedroom`.
- **Add to a character's or persona's gallery** (Agregar a la galería de un personaje o una persona), el botón con una silueta: conserva la imagen en la galería del propio personaje o de la persona (el perfil que te representa), para que se conserve más allá de este chat. Su etiqueta de fondo y sus lugares también se conservan, y la imagen acompaña a ese personaje en todos los chats. Consulta [Fondos que acompañan a un personaje](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).
- **Delete gallery image** (Eliminar imagen de la galería): elimina la imagen después de que lo confirmes.

### Regenerar una imagen

Puedes volver a generar una imagen sin regenerar la respuesta a la que pertenece. Esto funciona con las imágenes de la Gallery del chat que tienen un prompt guardado, como ilustraciones, selfies y fotogramas de storyboard.

1. Abre la imagen a tamaño completo, desde la Gallery o desde el mensaje en el que aparece.
2. Haz clic en **Regenerate image** (Regenerar imagen), el botón con una flecha circular en la parte superior derecha de la imagen.
3. Cambia lo que quieras en los cuadros debajo de la imagen: **Prompt**, **Negative prompt** (Prompt negativo), un cuadro para cada personaje en **Character prompts** (Prompts de personajes) cuando la imagen los tenga, y el modelo de imagen.
4. Haz clic en **Generate image** (Generar imagen), o en **Cancel** (Cancelar) para dejar la imagen como está.

La imagen nueva pasa a ser la versión seleccionada del mensaje. Los resultados anteriores quedan en una sola ficha de Gallery con contador de versiones. Cada versión conserva su prompt, prompt negativo y demás datos guardados. Se reenvían los avatares actuales, seguidos de las imágenes de entradas de lorebook usadas originalmente. Stability AI, Arli AI, SD Web UI y Draw Things no reciben imágenes de entradas. Algunas imágenes antiguas no guardaron prompts negativos o de personajes; el editor lo indica.

<a id="image-versions"></a>
### Versiones de imagen

Abre una imagen apilada para elegir versión. En una Gallery, flechas izquierda/derecha, teclas y deslizamientos horizontales cambian de ficha. Abrir desde un mensaje mantiene la navegación dentro de esa pila. Controles arriba/abajo, teclas y deslizamientos verticales sobre la imagen cambian de versión. Aleja el zoom antes de navegar. Desplazar el prompt no cambia versiones.

Haz clic en imagen, cabecera del prompt o botón de contraer para usar Arriba/Abajo con versiones. Haz clic en texto o botón de copiar para desplazar el prompt. Los controles siguen visibles al regenerar o editar. Aplica o borra la máscara antes de cambiar; los controles se pausan durante la generación.

La elección se guarda y aparece en el chat tras recargar. Regenerar o editar una versión antigua añade al mismo grupo y conserva las posteriores. Un chat ramificado tiene su propia selección.

Con **Guardar automáticamente las imágenes generadas en las galerías de personajes**, regeneraciones y ediciones conservan los destinos de galerías de personaje y persona originales. También agrupan versiones. Cada galería guarda su selección sin cambiar la del chat. Las entradas comparten archivos sin copias extra. Abrir una galería restaura versiones faltantes de pilas antiguas si la entrada original aún enlaza al chat fuente. Las versiones borradas de una galería ya agrupada siguen borradas.

En la Gallery del chat, usa **Eliminar imagen de la galería** en la ficha o el botón de borrar del visor:

- **Delete this version** quita la mostrada. Si estaba seleccionada, muestra la más nueva restante.
- **Delete other versions** conserva la mostrada y quita el resto.
- **Delete entire stack** quita todas las versiones y sus adjuntos del chat.

Son eliminaciones permanentes. **Cancelar** las conserva todas.

## Guías relacionadas

- [Agente Illustrator](../media/illustrator-agent.md): ilustraciones de escena y clips.
- [Fondos creados por Illustrator](../media/scene-backgrounds.md): el botón **Background**, versiones del clima y plantillas de ventanas.
- [Galerías de personajes y personas](../characters/galleries.md)
- [Generación de videos de escena](../media/scene-video.md): convierte una imagen de la Gallery en un video.
