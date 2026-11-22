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

## Importaciones rápidas de un solo archivo

1. Abre **Settings → Data → SillyTavern Import** (Configuración → Datos → Importación de SillyTavern).
2. Haz clic en el botón de tu tipo de archivo.
3. Elige el archivo.

| Botón | Archivo |
| --- | --- |
| **Import Character (JSON/PNG)** | Una tarjeta de personaje `.json` o `.png`. |
| **Import Chat (JSONL)** | Un registro de chat `.jsonl` (un registro JSON por línea, el formato en que SillyTavern guarda los chats). |
| **Import Preset (JSON)** | Un preset `.json`. |
| **Import Lorebook (JSON)** | Un archivo World Info `.json`. |

Encima de los botones, **Tag imported** (Etiquetar como importado) y **Tag source** (Etiquetar origen), ambos activados de forma predeterminada, añaden las etiquetas **Imported** y **ST** a lo que importes. Desmarca cualquiera de ellos para omitir esa etiqueta. Las importaciones conservan su nombre y descripción. Por lo demás, los botones no tienen opciones. Una importación de personaje conserva todas las etiquetas de origen y limita los scripts de regex al personaje. Un script de regex es una regla de buscar y reemplazar para texto. Para elegir estas opciones, usa **Import** en la página **Library → Characters** (Biblioteca → Personajes). Consulta [Importar y exportar tarjetas de personaje](../characters/import-export.md).

Si una tarjeta de personaje tiene un lorebook incrustado, tu navegador pregunta si quieres importarlo como un lorebook independiente. Haz clic en **OK** para conservarlo como un lorebook que puedes reutilizar, o en **Cancel** para importar solo el personaje.

**Import Chat (JSONL)** crea un chat Roleplay, a menos que el archivo registre otro modo, y lo abre.

### Importar un chat a un modo que elijas

Para elegir el modo, usa el botón de importación de la parte superior de la lista de chats. Su tooltip es **Import SillyTavern or Marinara chat JSONL**. Importa a la pestaña de modo que tengas abierta (Conversation, Roleplay o Game). Consulta [Exportar e importar chats](../chats/export-import.md).

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
7. Cuando veas **Import complete!**, lee el conteo de cada categoría y haz clic en **Done**. Debajo de los recuentos, una lista breve indica cuántos chats conservaron su nota del autor y persona, qué nombres de usuario de SillyTavern no tenían una persona aquí y qué ajustes de los presets se dejaron fuera.

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

- Los archivos de chat que pertenecen a un personaje se importan como ramas de un solo chat. Una rama es una copia de un chat que continúas por separado.
- Los chats grupales se importan como chats Roleplay.
- Los elementos importados conservan la fecha del último cambio del archivo de origen, no la fecha de la importación. Cada mensaje del chat conserva la fecha con la que SillyTavern lo guardó.
- La **Author's Note** (Nota del autor) de un chat se importa con su profundidad. Si SillyTavern usaba otra frecuencia, posición o rol, Marinara la agrega de todos modos a cada respuesta a esa profundidad, y la importación lo indica. Una nota que estaba desactivada en SillyTavern sigue desactivada.
- Un chat se vincula a la persona que usaba SillyTavern: la persona fijada para él o, si no había una, la persona con el mismo nombre que el usuario del chat. Importa las personas en la misma operación o crea primero una con ese nombre. Cuando no hay coincidencia, el chat queda sin persona y la importación indica el nombre de la persona que falta.
- Un preset trae sus ajustes de muestreo: temperatura, Top P, Top K, Min P, penalización de frecuencia y presencia, y esfuerzo de razonamiento. Son los valores iniciales de los chats que usan el preset; los valores propios de una conexión o chat siguen teniendo prioridad. La longitud máxima de respuesta y el tamaño del contexto permanecen en tu conexión. Top A y la penalización por repetición no tienen un ajuste aquí y se dejan fuera.
- Los personajes, las personas, los lorebooks, los presets y los chats reciben las etiquetas **Imported** y **ST**, a menos que desmarques **Tag imported** o **Tag source** encima de **Import Selected**. Sus nombres y descripciones se conservan como estaban.

## Qué no se transfiere

El asistente lee solo las categorías de la primera tabla. Otros datos de SillyTavern, como los ajustes globales de la app, las respuestas rápidas, las plantillas de instrucciones y contexto y los perfiles de conexión, no se importan. Los chats importados antes de esta corrección recibieron la hora de importación como fecha de sus mensajes. Para corregir uno, elimínalo e importa su archivo de nuevo (en una importación de carpeta, desmarca **Skip what's already here** (Omitir lo que ya está aquí)).

## Guías relacionadas

- [Importar y exportar tarjetas de personaje](../characters/import-export.md)
- [Importar y exportar lorebooks](../lorebooks/import-export.md)
- [Exportar e importar chats](../chats/export-import.md)
- [Scripts de regex](../extending/regex-scripts.md)
