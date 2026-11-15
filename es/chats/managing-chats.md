# Cómo gestionar tu lista de chats

Tus chats están en la barra lateral de la derecha, en **Chats**. Haz clic en **Library** (Biblioteca) arriba a la derecha para mostrar u ocultar la barra lateral y luego elige **Chats** en el selector de su parte superior (el otro lado es **Library**). En un teléfono o una tableta, toca el botón de la pila arriba a la derecha; la barra lateral se desliza sobre la página con el mismo selector. Usa la lista de Chats para empezar, encontrar, ordenar, organizar y eliminar chats.

## La lista de chats y las pestañas de modo

En la parte superior están **Import** (Importar), **New folder** (Nueva carpeta), **Select chats** (Seleccionar chats) y **New** (Nuevo). En un teléfono, todos salvo **New** están en el menú **⋯** que tiene al lado. Debajo hay tres pestañas de modo, cada una con el número de chats que contiene (en un teléfono, la primera dice **Conversation**, Conversación). Cada pestaña muestra solo los chats de ese modo.

| Pestaña | Modo |
| --- | --- |
| **Convo** | Conversation (Conversación): un chat estilo mensajería. |
| **Roleplay** | Roleplay: una escena con personajes y seguimiento del mundo. |
| **Game** | Game (Juego): un RPG para un solo jugador dirigido por la IA. |

Cada fila muestra el nombre del chat y los avatares de sus personajes. En los chats de Conversation, un punto de color sobre un avatar muestra el estado de ese personaje. Una insignia roja es el número de mensajes sin leer. Una fila con un pequeño icono de rama y un número es un chat con varias ramas, agrupadas en una sola fila. Consulta [Ramas de chat](branches.md). En una computadora, al pasar el cursor sobre una fila se muestra una vista previa del chat y sus botones **Rename chat** (Cambiar nombre del chat) y **Chat tags** (Etiquetas del chat).

Los chats fijados encabezan la lista. Para fijar uno, haz clic derecho sobre él (o deslízalo hacia la izquierda en una pantalla táctil) y elige **Pin** (Fijar).

## Cómo empezar un chat

Antes de empezar: añade al menos una cuenta en **Connections** (Conexiones). Consulta [Cómo conectarte a un proveedor de IA](../connections/connecting-to-a-provider.md).

1. Haz clic en la pestaña del modo que quieras.
2. Haz clic en **New** (Nuevo) en la parte superior de la lista. Su tooltip es **New Conversation**, **New Roleplay** o **New Game**, según la pestaña. También puedes iniciar uno desde **Conversation**, **Roleplay** o **Game** en Home.

Marinara crea el chat y lo abre. **Chat Settings** (Ajustes del chat) y un asistente de configuración se abren a su lado. Hasta que termines la configuración, el chat no aparece en la lista. Si sales de la configuración y eliges conservarlo, aparece como **Setup not finished** (Configuración sin terminar), para que puedas retomarlo. El chat empieza con el nombre **New Conversation**, **New Roleplay** o **New Game**. Si guardaste un perfil de ajustes predeterminado con estrella para Conversation o Roleplay, Marinara lo aplica al chat nuevo. Consulta [Perfiles de ajustes](settings-profiles.md).

Si no funcionó: si no tienes ninguna cuenta guardada, se abre la ventana **Add account** (Añadir cuenta) en lugar de un chat. Elige un servicio, haz clic en **Connect** (Conectar) y luego elige un modelo. Los pasos completos están en [Cómo conectarte a un proveedor de IA](../connections/connecting-to-a-provider.md).

## Cómo importar un chat

Puedes importar un registro de chat `.jsonl` desde SillyTavern o desde Marinara.

1. Haz clic en la pestaña del modo en el que debe quedar el chat.
2. Haz clic en el botón **Import** (Importar; la flecha de descarga) en la parte superior de la lista. Su etiqueta es **Import SillyTavern or Marinara chat JSONL**.
3. Elige tu archivo `.jsonl`.

Marinara crea el chat, lo abre y muestra **Imported N messages**. Para los formatos de exportación y la exportación en lote, consulta [Cómo exportar e importar chats](export-import.md).

Si no funcionó: un mensaje pequeño en la parte inferior de la pantalla dice **Import failed** con el motivo. Solo se aceptan archivos `.jsonl`.

## Cómo renombrar un chat

El nombre del chat es solo para ti. No se envía al modelo.

1. Abre el chat y luego abre **Chat Settings**.
2. En **Chat Name** (Nombre del chat), haz clic en el nombre actual.
3. Escribe el nombre nuevo y luego pulsa <kbd>Enter</kbd> o haz clic en la marca de verificación.

Consulta [Descripción general de Chat Settings](chat-settings.md) para saber cómo abrir el panel.

<a id="delete-a-chat"></a>

## Cómo eliminar un chat

1. Haz clic derecho en la fila del chat y elige **Delete** (Eliminar). En una pantalla táctil, desliza la fila hacia la izquierda o mantenla pulsada y toca **Delete**.
2. En el cuadro de diálogo **Delete Chat** (Eliminar chat), haz clic en **Delete** (Eliminar).

Eliminar es permanente. También detiene cualquier respuesta que aún se esté escribiendo para ese chat. Para eliminar varios a la vez, consulta [Cómo seleccionar varios chats](#selecting-multiple-chats).

Si el chat tiene varias ramas, el cuadro de diálogo dice cuántas y ofrece dos opciones:

- **Delete This Branch Only** (Eliminar solo esta rama) quita la rama en la que hiciste clic.
- **Delete All N branches** (Eliminar las N ramas) quita todas las ramas del grupo.

Para gestionar las ramas sin eliminar el chat, consulta [Ramas de chat](branches.md).

El ajuste de toda la app **Confirm before deleting** (Confirmar antes de eliminar) controla estos cuadros de diálogo. Está activado de forma predeterminada. Lo encontrarás en **Settings → General → Confirmations & Help** (Configuración → General → Confirmaciones y ayuda).

## Carpetas de chat

Las carpetas agrupan chats dentro de una pestaña de modo.

1. Abre una pestaña que tenga al menos un chat.
2. Haz clic en **New folder** (Nueva carpeta; el botón de carpeta en la parte superior de la lista). La carpeta se llama **unnamed** (Sin nombre), y las siguientes, **unnamed 2** y **unnamed 3**.

| Para hacer esto | Haz esto |
| --- | --- |
| Renombrar una carpeta | Haz doble clic o doble toque en ella, o selecciónala y pulsa <kbd>F2</kbd>. Un nombre vacío se ignora. |
| Eliminar una carpeta | Haz clic en el botón de la papelera de la fila de la carpeta. Aparece un cuadro de diálogo **Delete Folder** (Eliminar carpeta) cuando la carpeta contiene chats. Los chats pasan al nivel superior y no se eliminan. |
| Reordenar las carpetas | Arrastra una carpeta hacia arriba o hacia abajo. El menú de orden cambia a **Custom** (Personalizado). |
| Mover un chat a una carpeta | Arrastra la fila del chat sobre la carpeta. En una pantalla táctil, primero mantén pulsado el chat durante medio segundo aproximadamente. |
| Sacar un chat de una carpeta | Arrástralo al área vacía debajo de las carpetas. |

Con varios chats seleccionados, arrastrar uno mueve toda la selección. Los chats que no están en carpetas aparecen debajo de las carpetas.

## Cómo buscar, ordenar y filtrar

### Encontrar un chat por su nombre

Cada pestaña tiene un cuadro de búsqueda. Su marcador de posición es **Search conversations**, **Search roleplays** o **Search games**. Escribe una palabra. La búsqueda coincide con los nombres de los chats, las etiquetas y los nombres de los personajes, no con el texto de los mensajes.

### Filtrar por etiqueta

Haz clic en **Tags** (Etiquetas; el botón de etiqueta junto al cuadro de búsqueda). Elige una o más etiquetas, o **Untagged** (Sin etiquetas). El botón muestra cuántas elegiste. Un chat y sus ramas cuentan una sola vez. Añade etiquetas a un chat con **Chat tags** en su fila, o con **Tags** en el menú que se abre al hacer clic derecho o deslizarlo.

### Encontrar un mensaje en todos los chats

Pulsa <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> en Mac), o búscalo con el botón de búsqueda de la barra superior. Busca en todos los chats y puede filtrar por modo, personaje, remitente y fecha.

### Ordenar

El menú de orden (**Sort chats**, Ordenar chats) tiene estas opciones:

| Opción | Orden |
| --- | --- |
| **Custom** | El orden de tus carpetas. |
| **Manual order** (Orden manual) | Los chats en el orden en que los arrastras. Con el teclado, pon el foco en un chat y pulsa <kbd>Alt</kbd>+<kbd>Up</kbd> o <kbd>Alt</kbd>+<kbd>Down</kbd>. |
| **Recent** (Recientes) | Primero los que tuvieron actividad más reciente. Es el valor predeterminado. |
| **Newest** (Más nuevos) | Primero los creados más recientemente. |
| **Oldest** (Más antiguos) | Primero los más antiguos. |
| **A to Z** (De A a Z) y **Z to A** (De Z a A) | Por nombre. |

La lista muestra 40 chats al principio y añade los siguientes 40 cuando te desplazas cerca del final.

## Cuándo se actualiza la lista

Para mantener la app rápida, la lista de Chats no se recarga constantemente:

- Se actualiza de inmediato cuando creas, cambias o eliminas un chat en este dispositivo.
- Los cambios desde otro dispositivo (por ejemplo, un chat que empezaste en tu teléfono) aparecen cuando vuelves a la app desde otra app o pestaña del navegador: la lista se actualiza una vez en ese momento.
- El servidor no puede enviar los cambios directamente a tu dispositivo. Si tienes dos dispositivos abiertos uno al lado del otro, sal de la app y vuelve a ella para ver los cambios del otro.

<a id="selecting-multiple-chats"></a>

## Cómo seleccionar varios chats

1. Haz clic en el botón de la marca de verificación (**Select chats**, Seleccionar chats) de la parte superior de la lista.
2. Haz clic en cada chat que quieras. Las filas muestran una casilla en lugar de abrirse.
3. Usa la barra de la parte inferior, que muestra cuántos chats hay seleccionados.

**Export** (Exportar) descarga los chats seleccionados como un solo archivo `.zip` de archivos `.jsonl`. **Delete** te pide que confirmes en un cuadro de diálogo **Delete Chats** (Eliminar chats) y luego los quita. Haz clic otra vez en el botón de la marca de verificación para salir del modo de selección. Cambiar de pestaña también borra la selección.

## Chats recientes en la pantalla de inicio

La pantalla de inicio tiene un widget **Recent chats** (Chats recientes) con tus chats más recientes. Cada uno muestra su nombre, una insignia de modo y su último mensaje. Haz clic en un chat para abrirlo. Si no tienes chats, dice **Your chats will show here** (Tus chats aparecerán aquí). Consulta [Widgets de inicio](../home/welcome.md#home-widgets).
