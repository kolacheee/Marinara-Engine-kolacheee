# Configuración de apariencia

La pestaña **Appearance** (Apariencia) cambia el aspecto de Marinara: colores, tamaño del texto, espaciado, fondos y los botones y ventanas del chat. Las pestañas **Conversation**, **Roleplay** y **Game** que están a su lado dan estilo a cada modo de chat.

¿Buscas otra cosa?

- Un aspecto ya preparado o tu propio tema: [Temas de CSS personalizado](custom-css-themes.md).
- Otra fuente: [Fuentes personalizadas y Google Fonts](fonts.md).
- Una imagen de fondo para el chat: [Biblioteca de fondos](chat-backgrounds.md).
- El aspecto propio de un personaje en el chat: [Guía de temas con CSS de tarjeta](card-css-theming.md).

## Abrir la configuración de apariencia

1. Abre **Library → Settings** (Biblioteca → Configuración).
2. Haz clic en la pestaña **Appearance** (Apariencia).
3. Haz clic en el nombre de una sección en la fila situada debajo de las pestañas para ir a ella, o desplázate.

| Pestaña | Secciones |
| --- | --- |
| **Appearance** | **Theme** (Tema), **Fonts & Text Size** (Fuentes y tamaño del texto), **Accessibility** (Accesibilidad), **Text Colors** (Colores del texto), **Layout** (Distribución), **Effects** (Efectos), **Backgrounds** (Fondos), **Chat Buttons & Windows** (Botones y ventanas del chat), **CSS Themes** (Temas CSS) |
| **Conversation** | **Conversation Layout** (Distribución de Conversation), **Conversation Background** (Fondo de Conversation) |
| **Roleplay** | **Tracker Panel** (Panel de trackers), **Roleplay Messages** (Mensajes de Roleplay), **Avatars** (Avatares), **Visual Novel** (Novela visual) |
| **Game** | **Game Text** (Texto de Game), **Game Art** (Arte de Game), **Game Assets** |

Para empezar de cero, haz clic en **Reset Appearance** (Restablecer apariencia) en la parte superior de **Theme**. Restablece el aspecto a los valores predeterminados de Marinara, borra el fondo del chat actual y desactiva cualquier tema personalizado.

En la distribución clásica, estas secciones están en la pestaña **Appearance**, detrás de cuatro botones: **App**, **Conversation**, **Roleplay** y **Game**.

## Tema

| Ajuste | Qué hace |
| --- | --- |
| **Visual Style** (Estilo visual) | **Default (Marinara)** es un aspecto retro Y2K con efectos de brillo. **SillyTavern** es un aspecto limpio y minimalista. Solo cambia el aspecto y no tiene nada que ver con importar desde SillyTavern. **Stage** usa los tonos ciruela, latón y carmesí de la nueva distribución. |
| **New layout (UI overhaul preview)** (Nueva distribución: vista previa de la renovación de la interfaz) | Está activada de forma predeterminada. Desactívala para volver a la distribución clásica. Estas guías describen primero la nueva distribución. |
| **Look on this device** (Aspecto en este dispositivo) | **Same as my other devices** (Igual que en mis otros dispositivos), la opción predeterminada, comparte tu Visual Style, colores, fuente y tema personalizado con todos los dispositivos. **Only this device** (Solo este dispositivo) da a este dispositivo un aspecto propio, por ejemplo, claro en el teléfono y oscuro en la computadora. |
| **Color Scheme** (Esquema de color) | **Dark** (el predeterminado), **Light**, **Follow system** (Seguir el sistema) o **Follow time of day** (Seguir la hora del día), que cambia según el reloj de este dispositivo a las horas que elijas. |
| **Custom Mouse Pointer** (Puntero del ratón personalizado) | Está activado de forma predeterminada. Usa el cursor de Marinara con el color de acento. Desactívalo para usar el cursor de tu sistema o para dejar que un tema personalizado lo configure. |
| **Accent Color** (Color de acento) | Botones, iconos activos, anillos de foco, resaltes y contornos. El predeterminado es **Marinara Gradient** (Degradado de Marinara), una mezcla de rosa, naranja y cian. |
| **Accent Pulse** (Pulso del acento) | Hace que el acento se aclare y oscurezca suavemente, o recorra los colores de un degradado. Está activado de forma predeterminada en el escritorio y desactivado en los teléfonos. |
| **RGB Mode** (Modo RGB) | Hace que el acento recorra un arcoíris. Tu **Accent Color** guardado se mantiene como está. Está desactivado de forma predeterminada. |

**Accent Color** acepta un color plano o un degradado, una mezcla suave de dos o más colores. Haz clic en **Reset to default** (Restablecer al predeterminado) para volver al predeterminado. El fondo de la app sigue el modo Dark o Light, y un tema personalizado puede definir el suyo. Solo uno de **Accent Pulse** y **RGB Mode** puede estar activado a la vez.

## Fuentes y tamaño del texto

- **Font** (Fuente) elige la fuente de la app. Consulta [Fuentes personalizadas y Google Fonts](fonts.md).
- **Display Size** (Tamaño de visualización) fija el tamaño base del texto para toda la app en este dispositivo. Se aplica al instante.

| Opción | Tamaño |
| --- | --- |
| **Tiny** | 12 px |
| **Small** | 14 px |
| **Medium** | 16 px |
| **Default** | 17 px |
| **Large** | 19 px |
| **Huge** | 22 px |
| **Extra large** | 26 px |
| **Extra extra large** | 30 px |
| **Maximum** | 34 px |

- **Chat Font Size** (tamaño de fuente del chat) es un control deslizante para el texto de los mensajes del chat, de 12 px a 72 px. El predeterminado es 16 px.

## Accesibilidad

| Ajuste | Qué hace |
| --- | --- |
| **Line spacing** (Interlineado) | Espacio entre las líneas de los mensajes y el texto largo: **Default**, **Relaxed (1.6)**, **Loose (1.8)** o **Double (2.0)**. Los menús y botones conservan su tamaño. |
| **Letter spacing** (Espaciado entre letras) | Espacio entre las letras en todas partes: **Default**, **A little wider** (Un poco más ancho), **Wider** (Más ancho) o **Widest** (El más ancho). |
| **High contrast** (Contraste alto) | Colores más fuertes para el texto, los bordes y el foco. **Follow system** lo activa cuando tu dispositivo pide más contraste. |
| **Strong focus rings** (Anillos de foco marcados) | Un contorno grueso alrededor del elemento que tiene el foco del teclado. <kbd>Tab</kbd> también ofrece enlaces **Skip to content** (Saltar al contenido). |
| **Reduce motion** (Reducir movimiento) | Detiene las animaciones, las transiciones, **Accent Pulse** y los efectos del tema. Se activa por sí solo cuando tu dispositivo pide menos movimiento. |
| **Theme art strength** (Intensidad del arte del tema) | La intensidad con la que se muestran la imagen de fondo y la capa superpuesta de un tema personalizado (lluvia, hojas, líneas de escaneo). Bájala cuando el arte de un tema dificulte la lectura del texto. |
| **Colour-blind-safe colours** (Colores aptos para el daltonismo) | Azul y naranja en vez de verde y rojo para los puntos de estado, indicadores y botones Eliminar. |

## Colores del texto

- **Chat Text Color** (color del texto del chat) es el color principal del texto de los mensajes. El predeterminado es `#d4d4d4` en Dark y `#1a1025` en Light.
- **Default Dialogue Color** (color de diálogo predeterminado) da color al diálogo entrecomillado cuando un personaje o una persona no tiene su propio Dialogue Highlight Color. Los colores de la tarjeta tienen prioridad. Mientras **Apply preset colors** (aplicar colores del preset) está activado en **Chat Buttons & Windows**, el diálogo usa el color del texto de ese estilo.
- **Chat Chrome Text Color** (color del texto de la interfaz del chat) fija el texto de los controles alrededor del chat: los widgets del tracker, las etiquetas de las carpetas, las descripciones de la configuración y las ventanas abiertas desde los botones del chat. Tiene los mismos valores predeterminados que **Chat Text Color**.
- **Text Outline / Stroke** (contorno del texto) añade un contorno para que el texto siga siendo legible sobre fondos recargados. Fija el color y un **Width** (ancho) de 0 a 5 px. El predeterminado es 0,5 px, y 0 lo desactiva.

## Distribución

- **Desktop sidebar width** (ancho de las barras laterales en el escritorio) fija el ancho de las dos barras laterales en una computadora. **Reset width** (Restablecer el ancho) lo restablece. Los teléfonos conservan su distribución.
- **Show Android status bar** (Mostrar la barra de estado de Android) muestra la barra de estado del teléfono en la app de Android.

## Efectos

- **Dynamic weather effects (rain, snow, fog, etc.)** (efectos de clima dinámicos: lluvia, nieve, niebla, etc.) está activado de forma predeterminada. Muestra el clima según el clima y la hora del día de la historia, y necesita que el agente **World State** esté activado para el chat. Consulta [Agentes: ayudantes de IA para tus chats](../agents/agents-overview.md).
- **Reduce Ambient Animations & Effects** (reducir animaciones y efectos ambientales) detiene la animación decorativa, las partículas, las vistas previas giratorias y la aparición gradual del texto.

- **Mostrar tiradas como texto** (desactivado por defecto) muestra cada tirada como una línea breve con los dados, sus resultados y el total, en lugar de dados animados. Las tiradas siguen ocurriendo y el modelo y el juego reciben sus resultados. Se aplica en todos los modos de chat, incluidos los dados de las pruebas de habilidad.
- **Reduced paint effects** (efectos de pintura reducidos) aplana las transparencias y las sombras costosas, para que los dispositivos más lentos sigan funcionando con fluidez.

## Fondos

Esta sección contiene el selector **Chat Background** (Fondo del chat) y **Background Blur** (Desenfoque del fondo). El selector muestra el fondo del chat actual (o **Default background**, Fondo predeterminado) y tus elecciones recientes. Haz clic en la imagen o en **Browse library** (Explorar la biblioteca) para elegir otro. También tiene:

- **Conversation background image opacity** (Opacidad de la imagen de fondo de Conversation): con qué intensidad se ve el fondo del chat en el modo Conversation.
- **Chat background behind side panels** (Fondo del chat detrás de los paneles laterales): extiende el fondo suavizado del chat abierto detrás de las barras laterales y la barra superior.
- **Chat List Backgrounds** (Fondos en la lista de chats): muestra el fondo de cada chat como un banner atenuado detrás de su fila en la lista de chats. Elige **Active & Hovered**, **Every Row** u **Off**.

Consulta [Biblioteca de fondos](chat-backgrounds.md).

## Botones y ventanas del chat

**Chat widget style** (Estilo de widgets del chat) fija el aspecto de los botones, las ventanas y las secciones móviles del chat. Elige **Default**, **Dottore** (azul helado, metal pálido y esquinas cortadas) o **Prof. Mari** (marcos de cuento con ribetes dorados). Al elegir uno se restablecen los controles que aparecen debajo.

| Control | Qué hace |
| --- | --- |
| **Font** | **Preset font** (Fuente del preset), **App font** (Fuente de la app), **Sans serif** (Sin serifas), **Storybook serif** (Serif de cuento) o **Technical monospace** (Monoespaciada técnica). |
| **Shape** (Forma) | **Preset shape** (Forma del preset), **Rounded** (Redondeada), **Square** (Cuadrada), **Cut corners** (Esquinas cortadas) o **Arched** (En arco). |
| **Button size (px)** (Tamaño del botón en píxeles) | Cambia el tamaño de los botones móviles del chat y de sus iconos. Introduce un valor de 32 a 96, o deja el campo vacío para usar el predeterminado. |
| **Border & Buttons Color** (Color de bordes y botones), **Background Color**, **Text Color** (Color del texto) | Los tres colores principales. Restablece uno para que siga el preset y Dark o Light. |
| **Apply preset font** (Aplicar fuente del preset), **Apply preset shape** (Aplicar forma del preset), **Apply preset colors** | Llevan el estilo también a los mensajes, los campos de entrada y los controles del chat. Están desactivados de forma predeterminada. |

Professor Mari puede crear un estilo de chat personalizado para ti. Pídelo en su chat.

## Temas CSS

Temas ya preparados y temas que creas o importas. Consulta [Temas de CSS personalizado](custom-css-themes.md).

## Pestaña Conversation

- **Chat Layout** (distribución del chat), en **Conversation Layout**, cambia el aspecto de los mensajes de Conversation, con una vista previa en vivo. **Linear** (el predeterminado) muestra filas al estilo de un chat. **Bubbles** muestra burbujas al estilo de una app de mensajería.
- **Avatar Shape** (forma del avatar) es **Circular** o **Square**. El tamaño del avatar no cambia.
- **Profile pictures on phones** (Fotos de perfil en teléfonos) define las imágenes junto a los mensajes en un teléfono, en todos los modos de chat. **Mini** (el valor predeterminado) coloca una imagen pequeña junto a cada nombre, antes del nombre de un personaje y después del tuyo, para que los mensajes conserven todo el ancho. **Full** (Completa) mantiene la columna de imágenes, y **Off** (Desactivadas) no muestra imágenes. Las tabletas y las computadoras siempre muestran la imagen completa.
- **Conversation Theme** (tema de Conversation), en **Conversation Background**, fija un degradado de dos colores detrás de cada chat de Conversation. Las pestañas **Dark** y **Light** conservan cada una su propio degradado. Es un valor predeterminado para todos los chats de Conversation, no un ajuste por chat.

Los interruptores del menú de swipes están en **Settings → Chatting → Editing & Swipes** (Configuración → Chateando → Edición y swipes).

## Pestaña Roleplay

**Tracker Panel** da estilo al panel de estadísticas, atuendo y ubicación que aparece junto a los chats de Roleplay. Consulta [HUD y trackers de Roleplay](../roleplay/hud-and-trackers.md).

**Roleplay Messages**

| Ajuste | Qué hace | Predeterminado |
| --- | --- | --- |
| **Chat position** | Dónde se ubican los mensajes y el cuadro de entrada en pantallas anchas: **Left**, **Center** o **Right**. Los teléfonos conservan todo el ancho. | **Center** |
| **Custom chat width** (Ancho de chat personalizado) | Fija un ancho propio para la columna de mensajes. | Desactivado |
| **Roleplay Messages Background Opacity** | Bájalo para dejar que el fondo se vea a través de las burbujas de mensaje. Tiene prioridad sobre los colores transparentes de las tarjetas y los presets. | 90% |
| **Stretch Messages** (Expandir mensajes) | Cada mensaje ocupa toda la fila, para que los mensajes cortos se alineen con los largos. | Desactivado |
| **Hide line under names** (Ocultar la línea bajo los nombres) | Quita la línea fina que hay debajo de los nombres. | Desactivado |

**Avatars**

| Ajuste | Qué hace | Predeterminado |
| --- | --- | --- |
| Estilo del avatar | **None**, **Small Circles**, **Small Rectangles**, **Glued Side Panel** o **Faded Side Panel** (Panel lateral difuminado), un retrato ancho que se difumina hacia el mensaje. | **Small Circles** |
| **Scrollable Avatars** | Mantiene los avatares visibles mientras te desplazas por un mensaje largo. | Desactivado |
| **Narrator's Cycling Avatars**, **Narrator's Avatar Borders** (Bordes del avatar del Narrator) | El aspecto del avatar del Narrator. | |
| **Message avatar scale** | De 75% a 250%. | 100% |
| **Default sprite scale** | De 50% a 175%. El tamaño de sprite propio de un chat sigue teniendo prioridad. | 100% |

**Visual Novel**

**Visual Novel display** (visualización de novela visual) muestra un párrafo terminado a la vez, con un retrato de diálogo y tus sprites (imágenes del personaje). Fija la visualización de los Roleplays nuevos y de los que no tienen una elección propia. **Auto-play VN paragraphs** (reproducir automáticamente los párrafos de la novela visual), con **Paragraph delay** (pausa entre párrafos), **Dialogue portrait scale** (escala de los retratos de diálogo) y **Full-body sprite scale** (escala de los sprites de cuerpo entero), determina cómo se reproduce.

**Show Thinking In Messages** (mostrar el razonamiento en los mensajes) y **Don't Collapse Thinking** (no contraer el razonamiento) están en **Settings → Chatting → Thinking** (Configuración → Chateando → Razonamiento).

## Pestaña Game

**Game Text**

- **Instantly reveal game text** (Mostrar el texto del juego al instante) omite el efecto de escritura.
- **Mouse-wheel + click navigation** (Navegación con rueda del ratón y clic) permite avanzar por la historia con el ratón.
- **Game narration speed** (Velocidad de narración de Game) y **Game auto-play segment delay** (Pausa entre segmentos de la reproducción automática de Game) fijan la velocidad con la que se reproduce y avanza el texto.
- **Game Dialogue Display** (Visualización del diálogo de Game): **Classic Dialogue Box** (el predeterminado) muestra un segmento, con las líneas más antiguas en **Logs**. **History Above Dialogue Box** muestra los segmentos anteriores encima del cuadro.
- **Game text effects** (efectos de texto del juego, activado de forma predeterminada) anima las palabras dramáticas, las MAYÚSCULAS, los apartes y las etiquetas de efectos de texto. Desactívalo para ver el texto sin efectos.

**Game Art** tiene dos controles deslizantes: **Dialogue portrait scale** (de 75% a 175%, predeterminado 100%) y **Full-body sprite scale** (de 75% a 275%, predeterminado 135%).

**Game Assets** se explica en [Recursos del juego](../game/game-assets.md).

## Configuraciones que se quedan en este dispositivo

La mayoría de las configuraciones de Appearance se sincronizan con tus otros dispositivos. **Display Size** y **Chat Font Size** no. Se guardan en el navegador que usas. Para dar un aspecto completamente distinto a un dispositivo, usa **Look on this device** en **Theme**. Consulta [Resumen de configuración](../settings/settings-overview.md) para ver qué se sincroniza.

## Guías relacionadas

- [Temas de CSS personalizado](custom-css-themes.md)
- [Fuentes personalizadas y Google Fonts](fonts.md)
- [Biblioteca de fondos](chat-backgrounds.md)
- [Guía de temas con CSS de tarjeta](card-css-theming.md)
- [Resumen de configuración](../settings/settings-overview.md)
