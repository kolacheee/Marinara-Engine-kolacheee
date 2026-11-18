# Conectarte a un proveedor de IA

Para chatear, Marinara Engine necesita un modelo de IA. Puedes añadir una cuenta de un servicio de IA, pegar su API key (clave de API) y elegir un modelo. Una API key es un código secreto del servicio que permite que Marinara use tu cuenta allí. Trátala como una contraseña. También puedes usar el [modelo integrado](local-model.md), un modelo pequeño que se ejecuta en tu computadora sin clave.

## Añadir una cuenta

Antes de empezar, consigue una API key de un servicio que quieras usar. Después de elegir un servicio, el paso de la clave tiene un enlace **Where do I find my key?** (¿Dónde encuentro mi clave?). Estas son las páginas que abre para los servicios más comunes.

- OpenRouter (tiene modelos gratuitos): `openrouter.ai/keys`
- NanoGPT: `nano-gpt.com/api`
- OpenAI: `platform.openai.com/api-keys`
- Anthropic: `console.anthropic.com/settings/keys`
- Google Gemini: `aistudio.google.com/apikey`

La mayoría de los servicios te piden que te registres, y algunos que añadas crédito, antes de que una clave funcione. Para otros servicios, consulta [Proveedores de IA compatibles](providers-reference.md). Para usar un modelo en tu propia computadora sin clave, consulta [Configuración del modelo integrado](local-model.md).

1. Abre **Library → Connections** (Biblioteca → Conexiones). (Haz clic en **Library** arriba a la derecha y luego en **Connections**. O pulsa <kbd>Ctrl</kbd>+<kbd>K</kbd> y escribe `connections`.)
2. Haz clic en **Add connection** (Añadir conexión; en un teléfono, **New**, Nuevo). Se abre una lista de servicios, ordenada en **Text** (Texto), **Image** (Imagen), **Video**, **Voice** (Voz) y **Decision** (Decisión). Para un modelo de chat normal, quédate en **Text**.
3. Haz clic en el servicio que quieras. Escribe en **Search services** (Buscar servicios) para encontrar uno que no aparezca en la lista.
4. Pega tu clave en **API key**. Haz clic en el botón del ojo para comprobar que la pegaste completa.
5. Haz clic en **Connect** (Conectar). Marinara prueba la clave. Cuando funciona, ves **Connected** con el número de modelos que encontró.
6. En **Found in … — use it for:** (Encontrado en … — usar para:), cada fila es una tarea, como **Main** (Principal) o **Images** (Imágenes). Marca las tareas que deben usar el modelo que encontró Marinara. Si el servicio no tiene una lista de modelos, escribe el ID del modelo en la fila. Haz clic en **Done** (Listo), o en **Skip** (Omitir) para conservar la cuenta sin asignarle una tarea.
7. Lo que pasa después depende de si ya tienes un modelo Main. Main (Principal) es la tarea de escribir las respuestas de tus chats.
   - **Todavía no tienes un modelo Main, o abriste Add desde un chat nuevo:** la ventana muestra los modelos del servicio. Los modelos **Recommended** (Recomendados) están arriba. Haz clic en un modelo para añadirlo, o escribe un nombre en **Search or enter model ID…** (Buscar o escribir un ID de modelo…). Si no sabes cuál elegir, toma uno **Recommended**. Puedes cambiarlo más tarde. Deja marcada la opción **Make … my Main model** (Convertir … en mi modelo principal). Solo aparece cuando no tienes un modelo Main. Si abriste Add desde un chat nuevo y ya tienes un modelo Main, en su lugar aparece un botón **Set … as Main** (Establecer … como principal). Luego haz clic en **Done** (Listo), o en **Start chatting** (Empezar a chatear) desde un chat nuevo.
   - **Abriste Add desde un selector de tareas:** la ventana se cierra y Marinara te devuelve a esa tarea, con el modelo nuevo en su lista.
   - **Ya tienes un modelo Main:** la ventana se cierra y un mensaje dice que se añadió la cuenta, con su número de modelos. Para añadir más modelos, haz clic en **⋯** en la cuenta y elige **Add model** (Añadir modelo).

La página Connections muestra tu cuenta. **Connected** en el paso 5 ya significa que la clave funciona. Si el modelo nuevo es tu modelo Main, empieza un chat y envía un mensaje: una respuesta significa que todo funciona. Si ya tenías un modelo Main, los chats nuevos lo siguen usando. Para usar la cuenta nueva, añádele un modelo (**⋯** → **Add model**) y luego elige ese modelo para un chat o una tarea (consulta [Elegir el modelo para cada tarea](#choosing-the-model-for-each-job)).

Si no funcionó:

- **The key was not accepted. Check that you copied all of it.** (No se aceptó la clave. Comprueba que la copiaste completa.) Vuelve a pegar la clave y haz clic en **Try again** (Intentar de nuevo). La clave debe venir del servicio que elegiste.
- **The service is busy, or your credit is used up.** (El servicio está ocupado o se acabó tu crédito.) Añade crédito en el sitio web del servicio, o espera e inténtalo de nuevo.
- **Marinara could not reach** el servicio (Marinara no pudo llegar al servicio). Comprueba tu conexión a internet y luego haz clic en **Try again**.

### Campos opcionales de la cuenta

Haz clic en **More options** (Más opciones) en el paso de la clave para ver estos campos. Déjalos vacíos a menos que los necesites.

- **Name (optional)** (Nombre: opcional): el nombre que se muestra en la página Connections. Si está vacío, se usa el nombre del servicio. Una segunda cuenta del mismo servicio recibe los últimos 4 caracteres de su clave, por ejemplo `OpenAI · …a1b2`.
- **Address** (Dirección): adónde envía Marinara las solicitudes. Marinara usa la dirección propia del servicio cuando el campo está vacío. Rellénalo solo para un proxy, una pasarela o un servidor que tú ejecutes. Los servicios que inician sesión en tu computadora no lo muestran.
- **Requests per minute** (Solicitudes por minuto): frena a Marinara en esta cuenta. Vacío significa sin límite. Los valores permitidos van de 1 a 600.
- **Parallel jobs** (Tareas en paralelo): cuántas solicitudes se ejecutan a la vez. Vacío significa sin límite, excepto para una cuenta Custom en tu propia computadora o red doméstica (o una marcada como autoalojada), donde vacío significa dos a la vez. Los valores permitidos van de 1 a 16. En **Edit account** (Editar cuenta), el mismo ajuste se llama **Parallel requests** (Solicitudes en paralelo). Cuando las solicitudes esperan un espacio libre, se procesan por orden de tarea: primero los agentes que se ejecutan antes de la respuesta, luego la respuesta, después los agentes que se ejecutan junto a ella o después de ella y, por último, todo lo demás. Con dos o más, la respuesta siempre encuentra un espacio libre.

Algunos servicios usan un inicio de sesión en tu computadora en lugar de una clave. Muestran una etiqueta **Sign in** (Iniciar sesión) y no tienen campo de clave. Consulta [Conexiones de suscripción de Claude, ChatGPT y Grok](subscription-clis.md). Para un servidor en tu propia computadora, consulta [Conectar un modelo local o autoalojado](local-self-hosted.md). Después de una prueba fallida aparece **Continue anyway** (Continuar de todos modos). Guarda la cuenta sin que la prueba haya pasado.

### Empezar un chat sin cuenta

Si empiezas un chat antes de tener un modelo, Marinara abre primero la ventana **Add account**. Después de **Connect**, haz clic en un modelo y luego en **Start chatting**.

## La página Connections

Gestionas las cuentas en la página **Connections** (**Library → Connections**). De arriba abajo, muestra:

- **Import** (Importar; carga un archivo de cuenta) y **Add connection**.
- **All kinds** (Todos los tipos), que limita la lista a cuentas de **Chat**, **Images**, **Video** o **Voice**, un cuadro de búsqueda (**Search accounts and models**, Buscar cuentas y modelos) y el menú de orden.
- **Defaults** (Valores predeterminados), el cuadro que indica qué modelo hace cada tarea. Consulta [Elegir el modelo para cada tarea](#choosing-the-model-for-each-job).
- La tabla de cuentas, con las columnas **Models** (Modelos), **Status** (Estado) y **Balance** (Saldo). **On this device** (En este dispositivo) enumera el [modelo integrado](local-model.md). Haz clic en una cuenta para mostrar debajo sus modelos guardados.

Cada cuenta tiene un botón **⋯** con **Edit account** (Editar cuenta), **Replace key** (Reemplazar clave) y **Add model**. **Edit account** también contiene **Test account** (Probar cuenta), **Use this account** (Usar esta cuenta; desactívala sin borrarla) y los [campos opcionales](#optional-account-fields). Para agrupar cuentas en carpetas, consulta [Organizar las conexiones](organizing-connections.md).

Una **cuenta** es una clave, un inicio de sesión o una dirección guardados para un servicio. Si usas dos claves para el mismo servicio, tienes dos cuentas. Un **modelo** es un modelo de IA que guardaste desde una cuenta. Cada modelo guardado conserva sus propios ajustes.

<a id="choosing-the-model-for-each-job"></a>

## Elegir el modelo para cada tarea

Una tarea es algo que un modelo hace por ti. El cuadro **Defaults** las enumera:

| Grupo | Tareas |
| --- | --- |
| **Chat** | **Main** (Principal) escribe las respuestas en tus chats. **Agents** (Agentes) ejecuta los agentes auxiliares. **Impersonate** escribe como tú. |
| **Omnibar** | **Professor Mari** y **Quick answers** (Respuestas breves). |
| **Pictures & sound** (Imágenes y sonido) | **Images** (Imágenes), **Video**, **Voice** (Voz) y **Dictation** (Dictado) cuando está disponible. |
| **Behind the scenes** (Entre bastidores) | **Decision** (Decisión), **Embeddings** e **Image reading** (Lectura de imágenes). |

Cada una muestra el modelo que hace esa tarea, o lo que hace la tarea sin modelo, como **Follows Main** u **Off**. Una tarea que necesita un modelo muestra **Not set** (Sin configurar), y el cuadro cuenta cuántas necesitan atención. Haz clic en **Defaults** para plegar el cuadro.

Para cambiar el modelo de una tarea, haz clic en ella. Se abre **Model for** (Modelo para) esa tarea, excepto en tres filas. **Decision** y **Embeddings** abren sus propios controles (consulta [Modelos de decisión](decision-models.md) y [Proveedores de IA compatibles](providers-reference.md#embeddings)). **Dictation (Speech to Text)** abre la configuración de voz.

En **Model for**:

1. Mira la lista.
2. Haz clic en un modelo. La lista lo muestra en **Now** (Ahora), luego tus modelos **Starred** (Con estrella) y después tus modelos guardados por cuenta. **All models** (Todos los modelos), debajo de una cuenta, abre su lista completa. Escribe en **Search all models or paste a model ID** (Buscar en todos los modelos o pegar un ID de modelo) para buscar en todas las cuentas a la vez. No tienes que guardar un modelo antes.

**If it fails** (Si falla), en la parte superior de la ventana, elige un segundo modelo que responde cuando el primero falla. **Add account**, en la parte inferior, abre la ventana Add.

### Cuando una función necesita un modelo

Una función que no puede funcionar sin cierto tipo de modelo muestra una etiqueta **Needs an image model** (Necesita un modelo de imagen), o su equivalente para video, audio, decisión o chat. La ves en la tarjeta del agente en la página **Agents**, en **Chat Settings** (Ajustes del chat), en el editor de agentes y en las ventanas de imagen y video. Haz clic en **Set up** (Configurar), junto a ella, y luego elige un modelo o haz clic en **Add account**. La etiqueta desaparece en cuanto la tarea tiene un modelo.

## Probar una cuenta

**Connect** ya prueba la clave. Para volver a probarla más tarde, haz clic en **⋯** en la cuenta, elige **Edit account** y haz clic en **Test account**. Comprueba la clave y la dirección tal como las escribiste, antes de guardar.

<a id="choosing-a-model-for-one-chat"></a>

## Elegir un modelo para un chat

Un chat nuevo usa tu modelo **Main**. Para darle a un chat un modelo distinto, haz clic en el botón de modelo de la entrada del chat (el icono de enlace, con el nombre del modelo actual), o usa el campo **Model** (Modelo) en **Chat Settings → Connection** (Ajustes del chat → Conexión). Ambos abren **Model for this chat** (Modelo para este chat):

- **Now** muestra el modelo que usa el chat. **This chat only** (Solo este chat) significa que el chat tiene su propia elección. **follows Main** (sigue al principal) significa que usa Main.
- **Recent** (Recientes) y **Starred** enumeran tus modelos por cuenta.
- **Search models or paste an ID…** (Buscar modelos o pegar un ID…) busca en todas las cuentas. **Browse** (Explorar) abre la lista completa de una cuenta.
- **Follow Main** (Seguir al principal) quita la elección propia del chat. **Shuffle** (Aleatorio) elige un modelo distinto cada vez.

Una elección cambia solo ese chat. El mensaje que aparece después de una elección ofrece **Make it my Main model** (Convertirlo en mi modelo principal) y **Undo** (Deshacer). En Game Mode el campo se llama **Game Master model** (Modelo del Game Master).

## Errores comunes

Si una prueba o un mensaje falla, comprueba esto primero:

- Una clave incorrecta o vencida. Haz clic en **⋯** en la cuenta, elige **Replace key** (Reemplazar clave) y vuelve a pegar la clave. Una cuenta sin clave muestra **Needs key**.
- Una cuenta desactivada. Muestra **Off**. Haz clic en **⋯**, elige **Edit account** y activa **Use this account**.
- Una clave de otro servicio. Cada servicio necesita su propia clave.
- Una dirección bloqueada en **Address**. Si el campo está vacío, se usa la dirección propia del servicio.

Para más soluciones, consulta [Solución de problemas de Marinara Engine](../TROUBLESHOOTING.md).

## Guías relacionadas

- [Organizar las conexiones](organizing-connections.md)
- [Proveedores de IA compatibles](providers-reference.md)
- [Conexiones de suscripción de Claude, ChatGPT y Grok](subscription-clis.md)
- [Conectar un modelo local o autoalojado](local-self-hosted.md)
