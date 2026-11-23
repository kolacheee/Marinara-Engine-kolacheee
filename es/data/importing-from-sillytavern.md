# Importar desde SillyTavern

Trae tus datos de SillyTavern a Marinara Engine. Importa un archivo a la vez, o escanea una carpeta completa de SillyTavern e importa todo de una vez.

## Qué puedes traer

| Datos de SillyTavern | En Marinara |
| --- | --- |
| Personajes | Personajes |
| Chats y chats grupales | Chats |
| Presets | Presets (las secciones del prompt y los ajustes de muestreo del preset) |
| World Info | Lorebooks (libros de trasfondo: notas que la IA lee cuando aparecen ciertas palabras) |
| Fondos | Fondos del chat |
| Personas | Personas (el perfil que te representa a ti) |
| Scripts de regex | Scripts de regex: los propios de cada tarjeta, los propios de un preset y los globales de `settings.json` (importación de carpeta) |

## Importaciones rápidas de un solo archivo

1. Abre **Settings → Data → SillyTavern Import** (Configuración → Datos → Importación de SillyTavern).
2. Haz clic en el botón de tu tipo de archivo.
3. Elige el archivo. **Import Character** (Importar personaje), **Import Preset** (Importar preset) e **Import Lorebook** (Importar lorebook) abren la misma ventana que **Import** (Importar) en la Biblioteca, con las mismas opciones y el mismo informe de lo que se importó y lo que no.

| Botón | Archivo |
| --- | --- |
| **Import Character (JSON/PNG)** | Una tarjeta de personaje `.json` o `.png`. |
| **Import Chat (JSONL)** | Un registro de chat `.jsonl` (un registro JSON por línea, el formato en que SillyTavern guarda los chats). |
| **Import Preset (JSON)** | Un preset `.json`. |
| **Import Lorebook (JSON)** | Un archivo World Info `.json`. |

Encima de los botones, **Tag imported** (Etiquetar como importado) y **Tag source** (Etiquetar origen), ambos activados de forma predeterminada, añaden las etiquetas **Imported** y **ST** a lo que importes. Desmarca cualquiera de ellos para omitir esa etiqueta. La ventana que se abre empieza con la misma elección. Las importaciones conservan su nombre y descripción. Un script de regex es una regla de buscar y reemplazar para texto. Consulta [Importar y exportar tarjetas de personaje](../characters/import-export.md).

Si una tarjeta de personaje tiene un lorebook incrustado, la ventana Import Character pregunta qué hacer con él: **Import lorebook** (Importar lorebook) lo conserva como un lorebook que puedes reutilizar, **Import hidden** (Importar oculto) lo mantiene vinculado al personaje pero fuera de la lista de lorebooks, y **Skip lorebook** (Omitir lorebook) importa solo el personaje.

**Import Chat (JSONL)** crea un chat Roleplay, a menos que el archivo registre otro modo, y lo abre. Un mensaje breve indica qué se importó: la nota del autor, la persona y los mensajes que permanecen ocultos para la IA.

### Importar un chat a un modo que elijas

Para elegir el modo, usa el botón de importación de la parte superior de la lista de chats. Su tooltip es **Import SillyTavern or Marinara chat JSONL**. En la ventana que se abre, **Open as** (Abrir como) establece Roleplay o Conversation para un archivo de SillyTavern. Una exportación de Marinara conserva su propio tipo. Consulta [Exportar e importar chats](../chats/export-import.md).

## Importar una carpeta de SillyTavern

Antes de empezar: el asistente lee archivos en la computadora del servidor. Si SillyTavern está en otra computadora, copia primero su carpeta (aquella donde instalaste SillyTavern) a la computadora de Marinara. En la computadora de Marinara el asistente funciona de inmediato. Desde otro dispositivo, define el secreto de administrador y escríbelo en **Settings → Advanced → Security** (Configuración → Avanzado → Seguridad). Consulta [Copia de seguridad y restauración de Marinara](backup-and-restore.md) y la sección "Privileged APIs (ADMIN_SECRET)" de la [Referencia de configuración del servidor](../CONFIGURATION.md).

1. Abre **Settings → Data → SillyTavern Import**.
2. Haz clic en **Import from SillyTavern Folder**.
3. Elige tu carpeta de SillyTavern. Elige la carpeta principal, normalmente la que contiene una carpeta `data/` o `public/`. Usa una de estas formas:
   - Haz clic en **Browse** y elige la carpeta.
   - Si no hay selector de carpetas (un servidor remoto), se abre un explorador de carpetas dentro de la app. Solo muestra carpetas dentro de la carpeta personal del usuario que ejecuta el servidor. Haz clic en **Select This Folder**.
   - Escribe la ruta en **SillyTavern Folder Path**, por ejemplo `/home/you/SillyTavern`. Una ruta escrita funciona si está dentro de la carpeta de inicio del usuario que ejecuta el servidor. Si el ajuste `IMPORT_ALLOWED_ROOTS` del servidor está configurado, debe estar dentro de una de esas carpetas en su lugar.
4. Haz clic en **Scan Folder**. Marinara muestra cuántos elementos encontró en cada categoría.
5. En **Choose exactly what to import**, marca los elementos que quieras. Cada categoría tiene botones **All** y **None** y un interruptor **Show** o **Hide** para los elementos individuales.
6. Haz clic en **Import Selected**. Una barra de progreso muestra el elemento actual y un conteo por categoría.
7. Cuando veas **Import complete!**, lee el conteo de cada categoría y haz clic en **Done**. Cada fila indica cuántos se importaron y cuántos se omitieron porque ya los tenías. Debajo de los recuentos, **Not brought over** (No importados) enumera lo que contiene la carpeta sin una función equivalente aquí, y una lista breve indica cuántos chats conservaron su nota del autor y persona, qué nombres de usuario de SillyTavern no tenían una persona aquí, cómo colocan los presets World Info y qué ajustes de los presets se dejaron fuera.

**Skip what's already here** (Omitir lo que ya existe), activado de forma predeterminada, omite los personajes, chats y personas que ya tienes, ya sea de una importación anterior de carpeta o de archivos importados uno a uno. Una persona de SillyTavern con el mismo nombre que una de las tuyas no se copia: sus chats se vinculan a la tuya. Los chats importados uno a uno antes de este cambio no se reconocen y se importan una vez más.

Casi todo empieza seleccionado. Marinara deja sin marcar los presets de fábrica de SillyTavern, como `deterministic`, `neutral` y los presets `universal-*`, y un aviso lo indica. Déjalos sin marcar a menos que quieras copias.

Si el escaneo encuentra personajes, aparecen dos opciones más:

**Imported character tags** (el valor predeterminado es **All tags**):

- **All tags** conserva las etiquetas de origen.
- **No tags** las omite.
- **Existing only** conserva solo las etiquetas que ya tienes.

**Imported regex scripts** (el valor predeterminado es **Character only**):

- **Character only** aplica los scripts a cada personaje.
- **Global** los agrega a **Library → Regex scripts** (Biblioteca → Scripts regex), **Presets → Regexes** en el diseño clásico, donde puedes gestionar los scripts que se ejecutan en varios chats. Consulta [Scripts de regex](../extending/regex-scripts.md#manage-your-scripts).

Si no funcionó:

- "Could not find SillyTavern data directory." significa que Marinara no puede leer esa carpeta. Elige la carpeta principal de SillyTavern.
- "Marinara can only read folders inside your home folder" significa que la carpeta está fuera de la carpeta de inicio del usuario que ejecuta el servidor. Mueve la carpeta de SillyTavern a ella o pide a quien ejecute el servidor que permita su ubicación con el ajuste `IMPORT_ALLOWED_ROOTS`. Si ese ajuste está configurado, incluso una carpeta elegida debe estar dentro de una de sus carpetas. Consulta la [Referencia de configuración del servidor](../CONFIGURATION.md).
- Si **Browse** recibe una ruta escrita fuera de la carpeta de inicio, el explorador de carpetas se abre en la carpeta de inicio en su lugar.
- Si un elemento falla, Marinara lo omite, sigue adelante y lo enumera en las advertencias del último paso, por ejemplo `Character "Foo": error message`.

## Qué pasa con tus datos

- Los archivos de chat que pertenecen a un personaje se importan como ramas de un solo chat. Una rama es una copia de un chat que continúas por separado. Cada chat recibe el nombre de su archivo de SillyTavern, igual que en una importación individual. Un archivo que todavía se llama "New Chat" toma el nombre del personaje.
- Los chats grupales se importan como chats Roleplay en modo **Individual**, para que cada personaje responda por turnos, en el orden de intervención de SillyTavern.
- Los mensajes ocultos para la IA en SillyTavern permanecen ocultos.
- Los elementos importados conservan la fecha del último cambio del archivo de origen, no la fecha de la importación. Cada mensaje del chat conserva la fecha con la que SillyTavern lo guardó.
- La **Author's Note** (Nota del autor) de un chat se importa con su profundidad. Si SillyTavern usaba otra frecuencia, posición o rol, Marinara la agrega de todos modos a cada respuesta a esa profundidad, y la importación lo indica. Una nota que estaba desactivada en SillyTavern sigue desactivada.
- Un chat se vincula a la persona que usaba SillyTavern: la persona fijada para él o, si no había una, la persona con el mismo nombre que el usuario del chat. Importa las personas en la misma operación o crea primero una con ese nombre. Cuando no hay coincidencia, el chat queda sin persona y la importación indica el nombre de la persona que falta.
- Un preset conserva las dos ubicaciones de World Info de SillyTavern. **World Info (before)** (World Info (antes)) y **World Info (after)** (World Info (después)) se convierten en secciones independientes, para que las entradas configuradas después del personaje sigan yendo después. Un preset que desactiva una de ellas deja fuera esas entradas, igual que SillyTavern. Un preset con una sola ubicación de World Info recibe una sección **World Info** que envía ambas. Un preset importado antes de este cambio tiene una sección **World Info**. Para corregirlo, impórtalo de nuevo o, en su **Prompt order** (Orden del prompt), agrega **Lorebook Marker (Before)** (Marcador de lorebook (Antes)) y **Lorebook Marker (After)** (Marcador de lorebook (Después)) donde quieras y elimina la antigua sección **World Info**.
- Las entradas de World Info colocadas alrededor de la nota del autor de SillyTavern se insertan a profundidad 4 como mensajes del sistema, donde está la nota del autor (las entradas posteriores a la nota van justo detrás de las anteriores). Las entradas colocadas alrededor de los mensajes de ejemplo van después de las definiciones del personaje. La importación indica cuántas se movieron.
- Un preset trae sus ajustes de muestreo: temperatura, Top P, Top K, Min P, penalización de frecuencia y presencia, y esfuerzo de razonamiento. Son los valores iniciales de los chats que usan el preset; los valores propios de una conexión o chat siguen teniendo prioridad. La longitud máxima de respuesta y el tamaño del contexto permanecen en tu conexión. Top A y la penalización por repetición no tienen un ajuste aquí y se dejan fuera.
- Los personajes, las personas, los lorebooks, los presets y los chats reciben las etiquetas **Imported** y **ST**, a menos que desmarques **Tag imported** o **Tag source** encima de **Import Selected**. Sus nombres y descripciones se conservan como estaban.

## Qué no se transfiere

El asistente lee solo las categorías de la primera tabla. Otros datos de SillyTavern, como los ajustes globales de la app y los perfiles de conexión, no se importan. La lista **Not brought over** del resultado de la importación de carpeta cuenta lo que encontró sin una función equivalente aquí: conjuntos de Quick Reply, plantillas de instrucciones, plantillas de contexto y prompts del sistema. Los chats importados antes de esta corrección recibieron la hora de importación como fecha de sus mensajes. Para corregir uno, elimínalo e importa su archivo de nuevo (en una importación de carpeta, desmarca **Skip what's already here** (Omitir lo que ya está aquí)).

## Guías relacionadas

- [Importar y exportar tarjetas de personaje](../characters/import-export.md)
- [Importar y exportar lorebooks](../lorebooks/import-export.md)
- [Exportar e importar chats](../chats/export-import.md)
- [Scripts de regex](../extending/regex-scripts.md)
