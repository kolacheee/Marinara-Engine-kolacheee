# Primeros pasos con Marinara Engine

Marinara Engine es una app para chatear y hacer roleplay con personajes de IA. Se ejecuta en tu propia computadora. Esta guía muestra la pantalla de inicio y los pasos hasta tu primer chat.

## Empezar tu primer chat

Antes de empezar: necesitas una API key (clave de API: un código secreto, como una contraseña) de un servicio de IA, o el **Built-in model** (Modelo integrado) que se describe más abajo.

1. Instala Marinara Engine y ábrelo en tu navegador. Elige tu plataforma en [Instalación de Marinara Engine](../INSTALLATION.md).
2. Agrega una conexión: una API key para un servicio de IA, o el **Built-in model**. Consulta [Conectarse a un proveedor de IA](../connections/connecting-to-a-provider.md).
3. Elige los modelos que debe usar la conexión. La misma guía muestra cómo.
4. Crea o importa un personaje. Abre **Library → Characters** (Biblioteca → Personajes; haz clic en **Library** en la parte superior derecha) y luego haz clic en **New character** (Nuevo personaje), o haz clic en **Import** (Importar) para traer una tarjeta desde un archivo. Consulta [Crear y editar personajes](../characters/creating-and-editing-characters.md).
5. Haz clic en **Conversation**, **Roleplay** o **Game** en la pantalla de inicio. O abre tus chats: haz clic en **Library** en la parte superior derecha, elige **Chats** en la parte superior de la barra lateral, elige la pestaña **Convo**, **Roleplay** o **Game** y haz clic en **New** (Nuevo).
6. La página de configuración se abre en la pestaña nueva. Elige un personaje y la opción **Content** (Contenido), y luego haz clic en **Start roleplay** (Iniciar roleplay), o en **Start chatting** (Empezar a chatear) para Conversation y **Create world** (Crear mundo) para Game.

Lo que ves: se abre el chat nuevo y puedes escribir tu primer mensaje.

Si todavía no tienes ninguna conexión, Marinara abre primero la ventana para agregar una conexión.

Marinara no incluye una IA en línea. La mayoría de la gente se conecta a un servicio en línea. También puedes descargar el **Built-in model**, un modelo pequeño que se ejecuta en tu computadora sin API key. Sirve para tareas ligeras de ayuda, no para tu chat principal. Consulta [Configuración del modelo integrado](../connections/local-model.md).

La primera vez que abres Marinara, empieza un breve recorrido guiado. Consulta [El tutorial de primera vez](tutorial.md). ¿Te atascaste en un paso? Pregúntale a Professor Mari, el asistente integrado: [Professor Mari, tu asistente dentro de la app](professor-mari.md).

## Orientarte por la app

Marinara tiene dos lugares fijos, que permanecen en su sitio sea cual sea el tema que uses:

- **La barra superior.** A la izquierda, **Home** (Inicio) y una pestaña por cada chat, personaje o página que abras. A la derecha, el botón de búsqueda (o <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>⌘</kbd>+<kbd>K</kbd> en un Mac) encuentra o abre cualquier cosa: un chat, un personaje, un ajuste, una guía o una pregunta para Professor Mari. A su lado están **Chat settings** (Ajustes del chat) mientras hay un chat abierto, **Docs** (Documentación) para estas guías y **Library** (Biblioteca), que muestra u oculta la barra lateral.
- **La barra lateral** a la derecha, con un selector **Chats | Library** (Chats | Biblioteca) en la parte superior. **Chats** muestra tus chats en las pestañas **Convo**, **Roleplay** y **Game** (consulta [Administrar tu lista de chats](../chats/managing-chats.md)). **Library** muestra **Characters** (Personajes), **Personas**, **Lorebooks**, **Presets**, **Regex scripts** (Scripts regex), **Connections** (Conexiones), **Agents** (Agentes) y **Custom tools** (Herramientas personalizadas), y después **Settings** (Configuración) y **Extensions** (Extensiones). Elige una opción para abrir su página en el centro.

En una computadora también puedes mostrar dos páginas lado a lado. Consulta [Vista dividida](tabs-and-drafts.md#split-view-two-pages-at-once).

En un teléfono o una tableta, **Home** está en la parte superior izquierda y **Library** (el botón de pila) en la parte superior derecha. Library desliza la barra lateral sobre la página, con el mismo selector **Chats | Library**; su vista Library tiene **Settings**, **Docs** y **All Tabs** (Todas las pestañas) en la parte inferior. Toca el título de la barra superior para buscar y el botón numérico para ver tus pestañas abiertas. Consulta [Pestañas, vista dividida y cambios sin guardar](tabs-and-drafts.md) y [Gestos táctiles](../chats/messages.md#touch-gestures).

## La pantalla de inicio de un vistazo

La pantalla de inicio aparece cuando no hay ningún chat abierto. En la parte superior hay un saludo, el número de versión y **Conversation**, **Roleplay** y **Game**, que inician un chat nuevo en el modo correspondiente. Si todavía no hay ningún modelo configurado, **Connect a model to start chatting** (Conecta un modelo para empezar a chatear) abre la página Connections. **Professor** abre Professor Mari en su propia pestaña; una app instalada (como Story Writer) también añade un botón aquí, y **Widgets** organiza las tarjetas de abajo.

En el diseño clásico, que se desactiva en **Settings → Appearance → Theme → New layout** (Configuración → Apariencia → Tema → Nuevo diseño), la pantalla de inicio se parece a un navegador web, con pestañas, una barra de búsqueda y marcadores para **Discord**, **Support** (Apoyo), **Credits** (Créditos), **Documentation** (Documentación), **Tutorial**, **FAQ**, **Achievements** (Logros) y **Widgets**.

## Elegir un modo de chat

Eliges un modo cuando empiezas un chat.

- **Conversation** (Conversación): un chat de IA sencillo, con el estilo de una app de mensajería. Consulta [Conversation Mode: primeros pasos](../conversation/getting-started.md).
- **Roleplay**: una historia con uno o más personajes. La app lleva el seguimiento de la escena, como el lugar y la hora. Consulta [Modo Roleplay: primeros pasos](../roleplay/getting-started.md).
- **Game** (Partida): un juego para un jugador. La IA hace de Game Master (director del juego), que narra la historia. Tienes un grupo de compañeros (un grupo de aventura), tiradas de dados, mapas y misiones. Consulta [Game Mode: primeros pasos](../game/getting-started.md).

## Widgets de inicio

Los widgets son tarjetas pequeñas que puedes mostrar, ocultar y mover.

1. Haz clic en **Widgets** en la pantalla de inicio. Se abre la ventana **Home Widgets** (Widgets de inicio). Enumera los widgets en **Built-in** (Integrados), **Agents** (Agentes) y **Personal**.
2. Haz clic en el botón del ojo junto a un widget para mostrarlo u ocultarlo. Un widget que vuelves a mostrar va al primer lugar libre de la pantalla de inicio.
3. Para mover un widget, arrastra el tirador de su esquina superior derecha. En una computadora, el tirador aparece cuando pasas el puntero sobre el widget.

Tu disposición se guarda en este navegador. Los widgets personales también tienen botones para editarlos o eliminarlos. En el diseño clásico, **Browser chrome** (Apariencia del navegador), en la parte inferior de la ventana, tiene un interruptor: **Show URL bar** (Mostrar la barra de direcciones) muestra u oculta la barra de búsqueda de la pantalla de inicio en una computadora.

Professor Mari puede crearte un widget personal si se lo pides. Los agentes instalados también pueden añadir widgets.

## Referencia: widgets integrados

| Widget | Qué hace | Visible al principio |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari** (Pregúntale a Professor Mari) abre su chat. | Sí |
| **Recent chats** (Chats recientes) | Tus últimos chats. Haz clic en uno para reabrirlo. Vacío: **Your chats will show here** (Tus chats aparecerán aquí). | Sí |
| **Things to try** (Cosas para probar) | Las siguientes tres pequeñas tareas para probar, una función por tarea. Cuando las hayas probado todas o desactives los consejos, muestra **Documentation**, **Replay tutorial** (Repetir tutorial) y **Read FAQ** (Leer la FAQ) en su lugar. Consulta [Cosas para probar](#things-to-try). | Sí |
| **What's New** (Novedades) | **See what's new** (Ver las novedades) y **Read release notes** (Leer las notas de la versión). | Sí |
| **Community** (Comunidad) | Enlaces a **Discord**, **Support** y **Credits**. | Sí |
| **Character Library** (Biblioteca de personajes) | Una selección nueva de tus personajes cada día. | No |
| **Discovery desk** (Mesa de descubrimientos) | Agentes que no has instalado. **Browse agents** (Explorar agentes) abre el catálogo. | No |
| **Character of the Day** (Personaje del día) | Un personaje de tu biblioteca, con **Start a chat** (Empezar un chat) y **View character** (Ver personaje). | No |
| **Clock & calendar** (Reloj y calendario) | La fecha y la hora de hoy. | No |
| **Achievements** | Tus logros más recientes y los más cercanos. Necesita el ajuste de logros activado. | No |

## Cosas para probar

El widget **Things to try** sugiere las siguientes tres funciones para probar. Cada tarea se apoya en la anterior: una imagen de la galería se convierte en un sticker y el sticker se envía en un chat.

- Haz clic en una tarea para abrir su lugar en la app. Si no tiene uno, se abre su guía.
- Haz clic en la marca para darla por hecha, o en la cruz para omitirla. Una tarea omitida no vuelve a aparecer.
- La mayoría de las tareas se marcan solas cuando Marinara detecta que las completaste, como un chat en ese modo o una etiqueta de sticker. Marca las demás tú.
- **Ver todo** enumera todas las tareas por recorrido, con **Muéstrame**. Las tareas de un recorrido aparecen cuando se completan aquellas en las que se apoyan. Los recorridos bajo **Solo en este diseño** abarcan funciones del nuevo diseño.
- Completar un recorrido desbloquea su logro de **Explorador**.

El widget respeta **Consejos de funciones** en **Settings > General > Confirmations & Help** (Configuración > General > Confirmaciones y ayuda). Con los consejos desactivados, muestra los enlaces a las guías. El progreso se guarda en este navegador.

### Conceptos básicos de IA y A fondo

**Ver todos** tiene dos pestañas más:

- **Conceptos básicos de IA**: un recorrido breve para quienes empiezan con la IA. Explica qué es un modelo, los tipos que usa Marinara, los tokens y el contexto, y te ayuda a configurar un modelo si quieres (puedes omitir ese paso). Termina con Professor Mari. Se ofrece una vez, en una ventana pequeña después del tutorial de bienvenida. Consulta [Conceptos básicos de IA](ai-basics.md).
- **A fondo**: ajustes en los que no es evidente qué elegir y funciones que poca gente encuentra, como el CSS en las Notas del creador de una tarjeta. Los grupos que más usas aparecen primero.

Cada uno abre su guía en el pasaje relevante, resaltado, con una tarjeta debajo que lo explica en palabras sencillas. Haz clic en **Entendido** para marcarlo como completado; en Conceptos básicos de IA, esto abre la siguiente parada. Cuando terminas el recorrido Esencial, la última fila del widget sugiere una guía de A fondo. Completar Conceptos básicos de IA o un grupo de A fondo desbloquea un logro de **Explorador**, y completar todas las guías de A fondo desbloquea uno más. La ventana que ofrece el recorrido también respeta el ajuste **Consejos de funciones**.

## Dónde conseguir ayuda

- Pregúntale a Professor Mari en la pantalla de inicio.
- Abre **Ver todo** en el widget **Things to try** y luego **Read FAQ** para obtener respuestas breves.
- Haz clic en **Docs** en la barra superior para abrir las guías dentro de la app.
- Haz clic en **Discord** en el widget **Community** (Comunidad) para llegar a la comunidad, o en **Support** para apoyar el proyecto.

Si algo está roto, consulta [Solución de problemas de Marinara Engine](../TROUBLESHOOTING.md).

## Guías relacionadas

- [Instalación de Marinara Engine](../INSTALLATION.md)
- [Conectarse a un proveedor de IA](../connections/connecting-to-a-provider.md)
- [Crear y editar personajes](../characters/creating-and-editing-characters.md)
- [El tutorial de primera vez](tutorial.md)
- [Pestañas, vista dividida y cambios sin guardar](tabs-and-drafts.md)
- [Professor Mari, tu asistente dentro de la app](professor-mari.md)
