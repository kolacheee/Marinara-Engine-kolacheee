# Organiza tu biblioteca de personajes

La página **Characters** (Personajes) de la Library (a la derecha) enumera todos los personajes que has creado o importado. Úsala para buscar, ordenar, agrupar personajes en carpetas, marcar favoritos, filtrar por etiquetas y exportar o eliminar muchos a la vez.

<a id="the-characters-page"></a>

## La página Characters

Abre **Library → Characters** (Biblioteca → Personajes). La página muestra tus personajes como tarjetas de retrato. En la parte superior:

- **Browse online** (Explorar en línea) abre el [Card Browser](bot-browser.md) para buscar personajes en sitios públicos.
- **Import** (Importar) trae un archivo de personaje. Consulta [Importar y exportar tarjetas de personaje](import-export.md).
- **New character** (Nuevo personaje) abre la ventana **Create Character** (Crear personaje), en blanco o a partir de una plantilla. La tarjeta **New character** de la cuadrícula hace lo mismo.
- **Search characters or tag:name** (Buscar personajes o tag:nombre) filtra las tarjetas (consulta [Búsqueda](#search)).
- **Tags** (Etiquetas), junto al cuadro de búsqueda, restringe las tarjetas a las etiquetas que elijas (consulta [Etiquetas](#tags)).
- **Favourites** (Favoritos) y **Recently edited** (Editados recientemente) restringen las tarjetas. En un teléfono, están en una sola lista **Filter** (Filtrar).
- El menú de orden ofrece **A to Z** (De la A a la Z), **Z to A** (De la Z a la A), **Newest** (Más recientes), **Oldest** (Más antiguos) y **My order** (Mi orden).
- Los tres botones de tamaño hacen que las tarjetas sean pequeñas, medianas o grandes.
- **New folder** (Nueva carpeta; el icono de carpeta) y **Select** (Seleccionar; el icono de marca de verificación) están junto al título de la página.

Haz clic en una tarjeta para abrir el personaje. Su botón **Chat** (Chatear) inicia un chat con ese personaje. Si tienes muchos personajes, haz clic en **Load more** (Cargar más) al final.

<a id="a-cards-actions"></a>

### Acciones de una tarjeta

Pasa el cursor sobre una tarjeta y haz clic en **⋯** en la esquina superior izquierda, o haz clic derecho en la tarjeta. En una pantalla táctil, mantén pulsada la tarjeta. El menú tiene:

- **Duplicate** (Duplicar) crea una copia del personaje.
- **Move to folder** (Mover a una carpeta) mete el personaje en una carpeta, o lo saca con **No folder** (Sin carpeta).
- **Export** (Exportar) descarga el personaje en el formato nativo de Marinara.
- **Select** inicia la selección con esta tarjeta ya elegida.
- **Delete** (Eliminar) elimina el personaje después de que lo confirmes.

### Tu propio orden

Arrastra una tarjeta y suéltala antes o después de otra. El menú de orden cambia a **My order** y conserva ese orden hasta que elijas otro. Vuelve a elegir **My order** para regresar a él. El **Manual order** (Orden manual) del panel clásico es el mismo orden.

### Carpetas

1. Haz clic en **New folder** junto al título de la página. Aparece una carpeta llamada **unnamed** encima de las tarjetas.
2. Para renombrarla, haz clic en **⋯** en la carpeta y elige **Rename** (Renombrar).
3. Arrastra una tarjeta sobre la carpeta o usa **Move to folder** en el menú de la tarjeta.

Haz clic en el nombre de una carpeta para plegarla o desplegarla. El número junto al nombre indica cuántos personajes contiene. La opción **Delete folder** (Eliminar carpeta) del menú **⋯** de la carpeta elimina solo la carpeta: sus personajes vuelven a la página.

### Exportar o eliminar muchos personajes

1. Haz clic en **Select** junto al título de la página. Aparece una casilla en cada tarjeta.
2. Haz clic en las tarjetas que quieras. Una barra en la parte inferior muestra cuántas están seleccionadas, con **Select all** (Seleccionar todo).
3. Elige **Move to folder**, **Export** o **Delete** en la barra.

**Export** descarga un único zip llamado `marinara-characters.zip`. **Delete** te pide que confirmes primero. Haz clic en **X** en la barra o pulsa <kbd>Esc</kbd> para detener la selección.

El orden **Favorites first** (Favoritos primero) y la eliminación de una etiqueta de todos los personajes están en el panel Characters del diseño clásico, descrito a continuación. Cambia a él con **New layout** (Diseño nuevo) en **Settings → Appearance → Theme** (Configuración → Apariencia → Tema), y vuelve de la misma forma.

## En el diseño clásico: el panel Characters

Desde la parte superior del panel puedes:

- Haz clic en **Download** (Descargar) para abrir el [Card Browser](bot-browser.md) y encontrar personajes en sitios públicos.
- Haz clic en **Open Library** (Abrir biblioteca) para abrir una cuadrícula más grande, a página completa, con los mismos personajes.
- Haz clic en **New** (Nuevo; el icono de más) para abrir la ventana **Create Character** (Crear personaje).
- Haz clic en **Import** (Importar; el icono de descarga) para importar un archivo de personaje. Consulta [Importar y exportar tarjetas de personaje](import-export.md).
- Haz clic en **Select** (Seleccionar; el icono de marca de verificación) para activar el modo de selección y hacer acciones en lote.

La biblioteca completa conserva la tarjeta seleccionada, el orden y la posición de desplazamiento cuando abres un personaje para editarlo y vuelves.

Cada fila muestra el avatar, el nombre, una línea de título opcional, el creador y la versión, hasta 3 etiquetas y una estimación aproximada de tokens (fragmentos de texto). Una pequeña insignia de estrella marca un favorito. Pasa el cursor sobre una fila para ver **Duplicate** (Duplicar) y **Delete** (Eliminar). Si tienes muchos personajes, haz clic en **Load more** (Cargar más) en la parte inferior para cargar la siguiente página.

<a id="search"></a>

## Búsqueda

Escribe en el cuadro de búsqueda de la parte superior. El texto de marcador de posición dice **Search characters or tag:name** (Buscar personajes o tag:nombre); en el diseño clásico, dice **Search characters/tags** (Buscar personajes/etiquetas). El texto simple coincide con el nombre, el título, la descripción y las etiquetas de un personaje, sin distinguir mayúsculas de minúsculas. Si escribes `knight`, se muestran todos los personajes con "knight" en cualquiera de esos campos.

| Búsqueda | Qué encuentra |
| --- | --- |
| `male genshin` o `male,genshin` | Tarjetas que tienen ambas etiquetas exactas. |
| `male "Modern AU"` | Pon entre comillas una etiqueta que tenga espacios o comas. |
| `-tag:"slow burn"` | Oculta todas las tarjetas con esa etiqueta, aunque el resto de tu búsqueda coincida. |
| `-vampire` | Lo mismo, para una etiqueta de una sola palabra. Puedes omitir las comillas. |
| `mage -tag:"villain"` | Tarjetas que coinciden con "mage", sin las etiquetadas como "villain". |

Las búsquedas normales de frases siguen funcionando. La misma búsqueda funciona en la Character Library a página completa y para las personas.

## Ordenar (diseño clásico)

El menú desplegable de orden del panel clásico tiene:

| Opción | Qué hace |
| --- | --- |
| **Manual order** (Orden manual) | El orden que fijas tú. |
| **A-Z** | Nombres de la A a la Z. |
| **Z-A** | Nombres de la Z a la A. |
| **Newest** (Más recientes) | Primero los creados más recientemente. |
| **Oldest** (Más antiguos) | Primero los creados hace más tiempo. |
| **Favorites** (Favoritos) | Primero los favoritos, luego el resto. |

Para fijar un orden manual, arrastra una fila hacia arriba o hacia abajo, o pulsa <kbd>Alt</kbd>+<kbd>Up</kbd> o <kbd>Alt</kbd>+<kbd>Down</kbd> en una fila con el foco. Cualquiera de las dos cosas cambia el orden a **Manual order**.

## Carpetas (diseño clásico)

Las carpetas agrupan personajes relacionados, por ejemplo por historia o por serie, para que una lista larga sea más fácil de recorrer. Son opcionales, y el diseño nuevo muestra las mismas carpetas.

1. Haz clic en **New Folder** (Nueva carpeta). Aparece una carpeta llamada **unnamed**.
2. Renómbrala: haz doble clic en ella, tócala dos veces, o selecciónala y pulsa <kbd>F2</kbd>. Escribe el nuevo nombre y pulsa <kbd>Enter</kbd>.
3. Arrastra la fila de un personaje sobre la carpeta para meterlo dentro. Una vez que tienes una carpeta, una línea de ayuda dice **Drag and drop characters to folders, double-click or double-tap to rename** (Arrastra y suelta personajes en carpetas, haz doble clic o toca dos veces para renombrar).

Para sacar un personaje, pasa el cursor sobre su fila dentro de la carpeta y haz clic en el botón de quitar de la carpeta, o arrástralo fuera. Haz clic en una carpeta para expandirla o contraerla. El número junto a su nombre es cuántos personajes contiene.

En una pantalla táctil, mantén pulsada una fila para tomarla y luego arrástrala. Deslizar el dedo con normalidad sigue desplazando la lista.

Para mover varios a la vez, sostén una fila y toca otras filas con un segundo dedo para llevarlas también como una pila. Luego suelta la pila sobre una carpeta.

Para eliminar una carpeta, pasa el cursor sobre ella y haz clic en su botón de papelera. Una carpeta con personajes te pide que confirmes: **Delete "name"? Its N characters will stay in the library and move out of the folder.** (¿Eliminar "nombre"? Sus N personajes permanecerán en la biblioteca y saldrán de la carpeta). Una carpeta vacía se elimina de inmediato. Eliminar una carpeta nunca elimina los personajes que contiene.

## Usar una carpeta como lista de un chat grupal

Cada carpeta es también una lista guardada para los chats grupales. Cuando configuras un chat con más de un personaje, **Add from Folder** (Añadir desde una carpeta) añade en un solo paso todos los personajes de una carpeta. Consulta [Chats grupales y conversaciones grupales](../chats/group-chats.md).

## Favoritos y etiquetas

### Favoritos

Abre un personaje y haz clic en su estrella **Favorite** (Favorito) para activarla o desactivarla. En la página Characters, el chip **Favourites** muestra solo los favoritos. En el panel clásico, los favoritos muestran una pequeña insignia de estrella y tres botones debajo del cuadro de búsqueda filtran la lista:

- **All** muestra todos los personajes.
- **Favs** muestra solo los favoritos.
- **Non-favs** muestra solo los personajes que no son favoritos.

También puedes elegir **Favorites** en el menú desplegable de orden para poner los favoritos arriba.

### Etiquetas

Las etiquetas son marcas como `fantasy` o `slow burn`. Las añades en el editor de personajes. Consulta [Crear y editar personajes](creating-and-editing-characters.md#metadata-tab). Las importaciones añaden **Imported** (Importado) y una etiqueta que indica de dónde vino la tarjeta, como **ST** o **CharX**. Consulta [Opciones de importación](import-export.md#import-options).

Para filtrar por etiqueta en la página Characters:

1. Haz clic en **Tags** junto al cuadro de búsqueda. Se abre una lista de todas las etiquetas, con el número de personajes que tiene cada una.
2. Escribe en **Search tags** (Buscar etiquetas) para encontrar una, y haz clic en las etiquetas que quieras. Si eliges varias, solo se muestran los personajes que tengan **todas**. **Untagged** (Sin etiquetas) muestra los personajes sin etiquetas.
3. El botón **Tags** muestra cuántas elegiste. Haz clic en **Clear** (Borrar) en la lista para quitarlas.

Las páginas **Personas** y **Lorebooks** tienen el mismo botón **Tags**, y **Presets** también tiene uno. Escribir `tag:name` en el cuadro de búsqueda sigue funcionando en todas ellas.

En el panel clásico, cuando tus personajes tienen etiquetas, aparece un botón **Tags** (Etiquetas) con un recuento, como **Tags (12)**. Haz clic en él para expandir la lista completa:

- Haz clic en una etiqueta para incluirla como filtro. Con varias etiquetas seleccionadas, un personaje coincide si tiene cualquiera de ellas.
- Haz clic en la X de una etiqueta para eliminar esa etiqueta de todos los personajes que la tienen. Se te pide que confirmes: **Remove tag "name" from all characters?** (¿Quitar la etiqueta "nombre" de todos los personajes?)
- **Clear** (Limpiar) aparece una vez que hay un filtro de etiqueta activo. Haz clic en él para limpiar los filtros de etiqueta.

Para excluir una etiqueta, en cambio, usa `-tag:` en el cuadro de búsqueda, como se muestra en [Búsqueda](#search).

<a id="export-or-delete-many-characters"></a>

## Exportar o eliminar muchos personajes (diseño clásico)

1. Haz clic en **Select** en la parte superior del panel. Aparece una casilla en cada fila.
2. Haz clic en los personajes que quieras. El encabezado del panel muestra cuántos están seleccionados.
3. Usa la barra de acciones de la parte inferior.

La barra de acciones tiene dos botones:

- **Export** (Exportar) descarga los personajes seleccionados en un solo zip llamado `marinara-characters.zip`, en el formato nativo de Marinara.
- **Delete** elimina los personajes seleccionados. Antes se te pregunta: **Delete N characters?** (¿Eliminar N personajes?)

En el modo de selección también puedes arrastrar juntos los personajes seleccionados a una carpeta. Para los formatos de archivo, consulta [Importar y exportar tarjetas de personaje](import-export.md).

## Guías relacionadas

- [Importar y exportar tarjetas de personaje](import-export.md)
- [Crear y editar personajes](creating-and-editing-characters.md)
- [Chats grupales y conversaciones grupales](../chats/group-chats.md)
