# Si vienes de SillyTavern

La mayoría de lo que usabas en SillyTavern está en Marinara Engine (Marinara de aquí en adelante), a veces con otro nombre. Busca la palabra que conoces en la tabla y luego haz clic en **Show me** (Muéstrame) para abrir ese lugar en la app, o en el nombre para leer su guía.

También puedes escribir la palabra de SillyTavern en la búsqueda (**Ctrl+K**, o toca el título en un teléfono). "chat completion preset", "world info", "regex" y "author's note" llevan a la función de Marinara.

Para traer tus personajes, chats, presets y World Info, consulta [Importar desde SillyTavern](importing-from-sillytavern.md). Los chats conservan las fechas de sus mensajes, la nota del autor y la persona, y los presets conservan sus ajustes de muestreo.

## Lo mismo, con el nombre de Marinara

| En SillyTavern | En Marinara | Dónde | |
| --- | --- | --- | --- |
| Presets de Chat Completion, AI Response Configuration (muestreadores) | [Presets](../prompts/presets.md) | Biblioteca → **Presets**. Temperatura, Top P/K, Min P y las penalizaciones son los **Parameters** (Parámetros) del preset | [Muéstrame](#show-presets) |
| Prompt Manager | [Secciones del preset](../prompts/presets.md) | Biblioteca → **Presets**, abre un preset → **Sections** (Secciones) | [Muéstrame](#show-presets) |
| Configuraciones de chat guardadas, valores predeterminados del chat | [Perfiles de ajustes](../chats/settings-profiles.md) | Biblioteca → **Settings profiles** (Perfiles de ajustes), o Nuevo Roleplay → **Use a Profile** (Usar un perfil) | [Muéstrame](#show-settingsProfiles) |
| World Info, World Book | [Lorebooks](../lorebooks/overview.md) | Biblioteca → **Lorebooks** | [Muéstrame](#show-lorebooks) |
| Nota del autor | [Notas del autor](../roleplay/getting-started.md) | Ajustes del chat (Roleplay) | [Muéstrame](#show-authorsNotes) |
| Regex | [Scripts regex](../extending/regex-scripts.md) | Biblioteca → **Regex scripts** (Scripts regex) | [Muéstrame](#show-regexScripts) |
| Chats grupales | [Chats grupales](../chats/group-chats.md) | Agrega dos o más personajes a un chat | [Muéstrame](#show-groupChats) |
| Tarjetas de personaje, saludos alternativos | [Tarjetas de personaje](../characters/import-export.md) | Biblioteca → **Characters** (Personajes) → **Import** (Importar). Eliges un saludo alternativo al iniciar un chat de Roleplay | |
| Respuestas rápidas, STscript | [Respuestas rápidas y comandos de barra](../chats/guided-and-impersonate.md) | Junto a **Send** (Enviar), o escribe `/` | [Muéstrame](#show-quickReplies) |
| Extensiones (Resumir, Generación de imágenes…) | [Agentes](../agents/agents-overview.md) | Biblioteca → **Agents** (Agentes), y luego se activan por chat | [Muéstrame](#show-agents) |
| Resumir, Almacenamiento vectorial, Banco de datos | [Recuperación de recuerdos y resúmenes](../agents/memory.md) | Ajustes del chat → **Memory Recall** (Recuperación de recuerdos) | [Muéstrame](#show-memory) |
| Conexiones de API, Perfiles de conexión | [Conexiones](../connections/connecting-to-a-provider.md) | Biblioteca → **Connections** (Conexiones) | [Muéstrame](#show-connections) |
| Desglose del prompt | [Ver el prompt](../chats/peek-prompt.md) | La respuesta más reciente de la IA → **Peek prompt** (Ver el prompt) | [Muéstrame](#show-peekPrompt) |
| Puntos de control, ramas | [Ramas](../chats/branches.md) | Un mensaje → **Branch from here** (Crear rama desde aquí) | [Muéstrame](#show-branches) |
| Swipes, volver a generar | [Swipes](../chats/messages.md) | Las flechas bajo una respuesta, o desliza en una pantalla táctil | [Muéstrame](#show-swipes) |
| Gestión de personas | [Personas](../characters/personas.md) | Biblioteca → **Personas** | [Muéstrame](#show-personas) |
| Temas de interfaz, CSS personalizado | [Temas y temas CSS](../appearance/custom-css-themes.md) | Configuración → **Appearance** (Apariencia) | [Muéstrame](#show-themes) |

**Show me** abre la página o inicia el paso cuando puede. Para las funciones que están dentro de un chat (Peek prompt, Memory), abre primero un chat; de lo contrario, abre la guía.

## Cosas que funcionan de otra manera

- **Sin plantillas de instrucciones ni de contexto.** Marinara envía mensajes de chat y el servidor del modelo aplica la plantilla del propio modelo, así que no hay nada que elegir en **Advanced Formatting** (Formato avanzado) de SillyTavern. Las secciones de un preset reemplazan la cadena de historia.
- **Muestreadores.** Los ajustes de un preset son los valores iniciales de los chats que lo usan. Los valores configurados en la conexión o en un chat tienen prioridad. La longitud máxima de respuesta y el tamaño del contexto pertenecen a la conexión. Top A y la penalización por repetición no tienen un ajuste aquí.
- **Nota del autor.** Se introduce en el chat a su profundidad en cada respuesta. Con **Post-processing messages** (Posprocesamiento de mensajes) en **Apply** (Aplicar), el valor predeterminado, se envía dentro del mensaje del usuario cercano. Los ajustes de frecuencia, posición y rol de SillyTavern no tienen equivalente aquí. **Peek prompt** marca dónde se colocó.
- **Chats grupales.** En Roleplay, un narrador da voz a todos los personajes de forma predeterminada, lo que usa menos tokens. Para que cada personaje responda por turnos, como en SillyTavern, abre Ajustes del chat → **Group Chat** (Chat grupal) y cambia el modo. Los grupos importados desde SillyTavern ya usan el modo **Individual**.
- **Teclas.** Enter agrega una línea nueva en un chat y **Ctrl+Enter** envía. Activa **Send on Enter** (Enviar con Enter) en Configuración → **Chatting** (Chateando) para enviar con Enter. Las flechas solo cambian entre swipes después de activar **Intuitive swipe navigation** (Navegación intuitiva entre swipes) en la misma pestaña.
- **Respuestas rápidas.** Aquí son las acciones de un clic junto a **Send** (suplantar, respuestas guiadas). Los conjuntos de Quick Reply de SillyTavern no se importan.

- **Tres modos de chat.** Marinara divide los chats en **Conversation** (mensajes de texto, como mensajes directos), **Roleplay** (escenas largas con narración) y **Game** (un director del juego dirige un mundo con reglas). Cada chat nuevo pregunta cuál quieres, y su configuración solo muestra lo que usa ese modo.
- **Empezar un chat.** Un chat nuevo abre una configuración breve. Guarda una configuración que uses a menudo como perfil de ajustes, y el siguiente será un solo paso: **Use a Profile** y luego **Apply & Start** (Aplicar e iniciar). Marca un perfil con una estrella para convertirlo en el predeterminado de los chats nuevos de ese modo.
- **La búsqueda lo encuentra todo.** **Ctrl+K** encuentra chats, personajes, ajustes y guías, ejecuta comandos y responde preguntas con ayuda de Professor Mari.
- **Professor Mari.** El asistente integrado de Marinara responde preguntas sobre la app y puede crear personajes, lorebooks y agentes para ti. Ábrelo desde Inicio.

## Guías relacionadas

- [Importar desde SillyTavern](importing-from-sillytavern.md)
- [Perfiles de ajustes](../chats/settings-profiles.md)
- [Ajustes del chat](../chats/chat-settings.md)
