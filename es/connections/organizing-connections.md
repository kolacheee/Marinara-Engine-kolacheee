# Organizar las conexiones

Esta guía explica cómo mantener ordenadas tus cuentas y tus modelos en la página **Connections** (Conexiones) (**Library → Connections**, Biblioteca → Conexiones): marcar con estrella, ordenar, editar, quitar, Shuffle, las carpetas y la exportación. Para añadir una cuenta, consulta [Conectarse a un proveedor de IA](connecting-to-a-provider.md).

## La lista de cuentas

Debajo del cuadro **Defaults** (Valores predeterminados), la página enumera tus cuentas en una tabla con las columnas **Models** (Modelos), **Status** (Estado) y **Balance** (Saldo). **On this device** (En este dispositivo) contiene el [modelo integrado](local-model.md). Haz clic en una cuenta para mostrar debajo sus modelos guardados y haz clic de nuevo para plegarlos. Una fila de modelo muestra su nombre e insignias como la tarea que hace —**Main** (Principal), **Agents** (Agentes), **Images** (Imágenes)—, **Custom settings** (Ajustes personalizados), su precio o **Plan** para los modelos incluidos en una suscripción. Una cuenta local o autoalojada también puede mostrar **Default** (Predeterminado), que dice "Whatever model the server has loaded" (El modelo que tenga cargado el servidor) y no tiene estrella. Consulta [Usar el modelo que tenga cargado el servidor](local-self-hosted.md#use-whatever-model-the-server-has-loaded).

Encima de la tabla:

- **All kinds** (Todos los tipos) limita la lista a cuentas de **Chat**, **Images** (Imágenes), **Video** o **Voice** (Voz).
- **Search accounts and models** (Buscar cuentas y modelos) filtra la lista a medida que escribes.
- El menú de orden ofrece **Sort: Name** (Ordenar: nombre), **Sort: Most models** (Ordenar: más modelos) y **Sort: Recently changed** (Ordenar: cambios recientes).

Algunas cuentas llegan a modelos de varios creadores, como NanoGPT o un proxy. Sus modelos se agrupan bajo encabezados como **via NanoGPT**.

### Acciones de la cuenta

Haz clic en **⋯** en la fila de una cuenta:

| Acción | Qué hace |
| --- | --- |
| **Edit account** (Editar cuenta) | Abre sus ajustes: **Name** (Nombre), **Address** (Dirección), **API key** (clave de API), **Use this account** (Usar esta cuenta), que permite desactivarla sin borrarla, **Test account** (Probar cuenta), **Usage and balance** (Uso y saldo) y **More options** (Más opciones), que contiene **Requests per minute** (Solicitudes por minuto) y **Parallel requests** (Solicitudes en paralelo). **Delete** (Borrar) también está aquí. |
| **Replace key** (Reemplazar clave) | Pega una clave nueva. Si la clave antigua está en otras cuentas, Marinara pregunta si también quieres actualizarlas. |
| **Add model** (Añadir modelo) | Abre la lista de modelos de la cuenta. |

Para borrar una cuenta, abre **Edit account** y haz clic en **Delete**. Marinara te pide que confirmes y enumera lo que usa sus modelos en **Used by** (Lo usa): chats, agentes, modelos y tareas. Haz clic en **Delete with its N models** (Borrar con sus N modelos) para quitar la cuenta y sus modelos. Después, esos chats y esas tareas necesitan otro modelo. Si un modelo no se puede quitar, el editor lo enumera en **This account still has models. Remove these first:** (Esta cuenta todavía tiene modelos. Quita estos primero:). Abre cada uno y quítalo.

### Iconos de proveedor

Cada cuenta muestra el icono de su servicio. Los iconos vienen con Marinara y nunca se cargan desde internet. Una dirección personalizada muestra el icono de un servidor o una pasarela conocidos cuando su dirección o su nombre contiene uno, por ejemplo Ollama, LM Studio, KoboldCpp, Bifrost o LiteLLM. Si no, muestra la primera letra de su nombre. En el diseño clásico puedes elegir el tuyo: haz clic en la imagen de una cuenta y luego elige el logotipo de un servicio, sube una imagen o usa letras.

## Modelos con estrella

Una estrella marca los modelos que quieres encontrar rápido. Los modelos con estrella aparecen en **Starred** (Con estrella), cerca de la parte superior de cada selector de modelos: las ventanas **Model for** (Modelo para) del cuadro **Defaults**, **Model for this chat** (Modelo para este chat) y los campos de modelo de **Chat Settings** (Ajustes del chat) y del editor de agentes.

Para marcar un modelo con estrella, haz clic en la estrella de su fila o en la lista **Add model** de la cuenta. Darle una tarea a un modelo también lo guarda.

Para quitarle la estrella a un modelo, haz clic de nuevo en su estrella. Marinara quita el modelo y muestra **Undo** (Deshacer) durante unos segundos. El modelo se queda, sin su estrella, cuando un chat lo usa, tiene una tarea en **Defaults**, tiene sus propios ajustes o es el último modelo de su cuenta. El mensaje indica el motivo.

## Editar y quitar un modelo

Haz clic en una fila de modelo para abrir **Edit model** (Editar modelo), con todos sus ajustes. **Export model** (Exportar modelo) lo guarda en un archivo (consulta [Exportar e importar](#export-and-import)). Para darle una tarea a un modelo, haz clic en esa tarea en el cuadro **Defaults** y elígelo allí.

En una computadora, puedes arrastrar una fila de modelo sobre un chat para usar ese modelo en el chat.

### Acciones del modelo

Haz clic en **⋯** al final de una fila de modelo, o haz clic derecho en la fila:

| Acción | Qué hace |
| --- | --- |
| **Edit model** | Abre los ajustes del modelo. |
| **Make default for…** (Hacer predeterminado para…) | Le da una tarea al modelo, igual que elegirlo en **Defaults**. Una marca de verificación muestra las tareas que ya tiene. |
| **Move to account…** (Mover a la cuenta…) | Mueve el modelo a otra cuenta. Después usa la clave de esa cuenta. Su nombre, su imagen, sus tareas y sus chats se mueven con él, y las opciones del servicio se restablecen. |
| **Move to folder** (Mover a una carpeta) | Pone el modelo en una carpeta (consulta [Carpetas](#folders)). |
| **Duplicate** (Duplicar) | Hace una copia completa con los mismos ajustes y la abre. |
| **Add to Shuffle** (Añadir a Shuffle) / **Remove from Shuffle** (Quitar de Shuffle) | Consulta [Shuffle](#shuffle). Un modelo del grupo muestra una etiqueta **Shuffle** en su fila. |
| **Export** (Exportar) | Guarda el modelo en un archivo. |
| **Remove** (Quitar) | Borra el modelo después de que confirmes. La confirmación enumera lo que lo usa. |

<a id="folders"></a>

## Carpetas

Las carpetas agrupan tus modelos, por ejemplo **RP** y **Work**. Un modelo está en una sola carpeta.

1. Haz clic en **⋯** en un modelo y elige **Move to folder**.
2. Elige una carpeta, o haz clic en **New folder…** (Nueva carpeta…), escribe un nombre y haz clic en **Create** (Crear).
3. Para ver tus carpetas, cambia **By account** (Por cuenta) a **By folder** (Por carpeta) en el menú junto al de orden.

En **By folder**, cada carpeta enumera sus modelos con el nombre de su cuenta, y los modelos que no están en ninguna carpeta aparecen en **Not in a folder** (Sin carpeta). Haz clic en **⋯** en una carpeta, o haz clic derecho en ella, para cambiarle el nombre o borrarla. Borrar una carpeta conserva sus modelos, en **Not in a folder**. El panel clásico muestra las mismas carpetas y también te permite darles un icono y un color.

## Shuffle

Shuffle permite que un chat elija un modelo distinto cada vez que escribe una respuesta. Úsalo para repartir las solicitudes entre varios servicios o modelos.

1. Haz clic en **⋯** en cada modelo que quieras en el grupo y elige **Add to Shuffle**.
2. En un chat, abre **Model for this chat** desde la entrada del chat, o **Chat Settings → Connection → Model** (Ajustes del chat → Conexión → Modelo), y elige **Shuffle** (Aleatorio).

Entonces cada respuesta elige un modelo al azar de tu grupo de Shuffle.

Si el modelo que eligió una respuesta falla y **Main** tiene un modelo **If it fails** (Si falla), ese modelo escribe la respuesta en su lugar. Un aviso nombra el modelo que falló y un motivo breve, como "key rejected", "rate limited" o "not found". La respuesta conserva una pequeña etiqueta **Fallback** (Respaldo). Tócala, o pasa el puntero sobre ella, para volver a ver esa misma línea.

Una elección en **Model for this chat** cambia solo ese chat. Para cambiar el modelo de los chats nuevos, establece **Main** en el cuadro **Defaults**.

## En el diseño clásico

El panel Connections clásico tiene algunas herramientas más. Cámbialo con **New layout** (Nueva distribución) en **Settings → Appearance → Theme** (Configuración → Apariencia → Tema), y vuelve al diseño nuevo de la misma forma. Ambos diseños usan las mismas cuentas.

- **⋯** en un modelo también tiene **Change picture** (Cambiar imagen).
- **⋯** en una cuenta también tiene **Test** (Probar), **Select models** (Seleccionar modelos; mueve o borra varios a la vez), **Duplicate** y **Turn off** (Desactivar) / **Turn on** (Activar).
- **More actions** (Más acciones; tres puntos), en la parte superior del panel, tiene **Fold all accounts** (Plegar todas las cuentas), **Open all accounts** (Abrir todas las cuentas), **Show only Off or Needs key** (Mostrar solo las cuentas desactivadas o sin clave) y **Show cost badges** (Mostrar insignias de costo).

<a id="export-and-import"></a>

## Exportar e importar

Puedes exportar cuentas a un archivo para hacer una copia de seguridad o pasarlas a otra instalación, y luego importarlas más tarde.

> **Advertencia:** Las exportaciones nunca incluyen las API keys. Después de importar, abre cada cuenta y vuelve a escribir su clave. Nunca compartas una clave con nadie.

- **Exportar un modelo:** ábrelo con **Edit model** y haz clic en **Export model** (Exportar modelo).
- **Exportarlo todo:** haz clic en **Export all accounts** (Exportar todas las cuentas), el icono de subida junto a **Import** (Importar), en la parte superior de la página Connections. Marinara te recuerda que el archivo no contiene claves. Haz clic en **Export**.
- **Importar:** haz clic en **Import** en la parte superior de la página Connections. Suelta uno o más archivos (`.json`, `.jsonl` o `.zip`) sobre la ventana, o haz clic para buscarlos. Esto incluye el `marinara-connections.zip` que exportaste. Cada cuenta importada tiene una clave vacía hasta que la rellenas.

Un solo modelo se descarga como un archivo `.connection.json`. Varios se descargan juntos como `marinara-connections.zip`. Las estrellas se incluyen. El catálogo de modelos del servicio no, así que se vuelve a cargar la primera vez que abres los modelos de la cuenta.

## Guías relacionadas

- [Conectarse a un proveedor de IA](connecting-to-a-provider.md)
- [Resumen de Chat Settings](../chats/chat-settings.md)
