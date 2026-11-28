# Guía para crear temas

Esta guía es para quienes crean o comparten sus propios temas. La primera parte te lleva paso a paso por tu primer tema, sin necesidad de saber programar. El resto es una referencia: todos los colores, imágenes y partes que un tema puede cambiar, y las reglas de seguridad que siguen todos los temas. Para elegir, probar, importar o quitar un tema, consulta [Temas CSS personalizados](custom-css-themes.md).

**Versión 1 del contrato de tokens** (`--mari-tokens-version: 1` en `:root`). Los nombres de esta guía siguen funcionando entre versiones. Cuando alguno tiene que cambiar, la versión aumenta y el cambio aparece en [Cambios](#changes), al final. Todo lo demás (otras variables `--ov-*`, `--mari-*` y `--marinara-*`, clases de Tailwind, estructura de elementos) es interno y puede cambiar en cualquier actualización.

## Tu primer tema, paso a paso

Un tema es una lista breve de ajustes escritos en CSS, el lenguaje que usan las páginas web para los colores y las fuentes. No necesitas saber CSS para empezar. Cada línea tiene la forma `--name: value;`: un **token** (un ajuste con nombre que empieza por `--`), dos puntos, el valor y un punto y coma.

1. Abre **Library → Settings → Appearance** (Biblioteca → Ajustes → Apariencia) y haz clic en **CSS Themes** (Temas CSS) en la fila de secciones.
2. Para cambiar un tema inicial, descarga uno que te guste de **Browse the theme gallery** (Explorar la galería de temas), búscalo en **Starter themes** (Temas iniciales) y haz clic en **Clone + Edit** (Clonar y editar, el icono de copiar). Marinara crea tu propia copia, con un nombre como "Petal OS (mi copia)", y la abre en el editor. Los temas iniciales siguen siendo de solo lectura, así que el original siempre está ahí. Para empezar desde cero, haz clic en **Create Theme** (Tema nuevo). Su plantilla tiene líneas entre `/*` y `*/`, que están desactivadas. Borra esas marcas alrededor de una línea para activarla.
3. Escribe un nombre en el cuadro del nombre.
4. Cambia un color. Busca una línea como `--primary: #3fae7a;` y reemplaza el color. `#3fae7a` es un código de color hexadecimal. Cualquier selector de color en la web te da uno. También funcionan nombres como `teal`.
5. Deja **Preview** (Vista previa) activado. La app cambia mientras escribes, así que ves cada cambio al instante.
6. Mira debajo del editor. **No CSS problems found.** (No se encontraron problemas de CSS.) significa que el CSS está bien. Si no, cada problema aparece con su número de línea, como cuando falta un `;` o un `}`.
7. Haz clic en **Save** (Guardar). Tu nuevo tema se activa y Marinara pregunta **Keep this theme?** (¿Conservar este tema?). Haz clic en **Keep theme** (Conservar tema) antes de que pasen 15 segundos o volverá al aspecto anterior.

Los tokens que la mayoría cambia primero:

| Token            | Qué colorea                              |
| ---------------- | -------------------------------------------- |
| `--background`   | La página detrás de todo                   |
| `--foreground`   | El texto principal                                    |
| `--primary`      | Botones, enlaces y resaltados                |
| `--card`         | Tarjetas y paneles                             |
| `--sidebar`      | Las barras laterales de chats y de Biblioteca               |
| `--border`       | Los contornos de los elementos                          |
| `--mari-font-ui` | La fuente de la app, por ejemplo `"Georgia", serif` |

Un tema pequeño:

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }` contiene ajustes para todos los esquemas de colores. `[data-theme="dark"] { … }` contiene ajustes solo para Oscuro, y `[data-theme="light"] { … }` solo para Claro. Para ver la lista completa de tokens mientras trabajas, abre **CSS Variable Reference** (Referencia de variables CSS) debajo del editor, o lee [Tokens de color](#colour-tokens) más abajo.

### Agregar imágenes y fuentes

Abre **Pictures and sharing details (author, version, thumbnail, fonts)** (Imágenes y detalles para compartir: autor, versión, miniatura y fuentes) debajo del editor y haz clic en **Add pictures** (Añadir imágenes). Haz clic en el nombre de una imagen para colocarla en tu CSS donde está el cursor. Consulta [Imágenes](#pictures) y [Fondos](#backdrops) para saber dónde puedes colocar imágenes.

Las imágenes y las fuentes deben estar dentro del tema. Un tema no puede cargar nada de otro sitio web, así que un enlace a una imagen o a una fuente de Google en tu CSS no funcionará.

### Pedir a Professor Mari que cree el arte

Si tienes un modelo de imágenes configurado en **Connections** (Conexiones) (Codex, NovelAI, ComfyUI, un modelo de imágenes de OpenAI, etc.), Professor Mari puede crear las imágenes de un tema e incorporarlas. Pídeselo con palabras sencillas, por ejemplo "crea un fondo de cielo nocturno para mi tema Harbor" o "pon un marco de latón a las tarjetas de Inicio".

1. Mari solo trabaja en tus propios temas. Si es un tema inicial, haz clic primero en **Clone + Edit** y pídele que trabaje en la copia.
2. Ella escribe el prompt (las instrucciones enviadas a la IA) de la imagen y lo envía a tu modelo de imágenes exactamente como lo escribió. Se omiten tus perfiles de estilo de imagen y prefijos de prompt (que suelen estar configurados para arte de personajes), para que el fondo no termine siendo un retrato.
3. Mari revisa cada imagen por sí misma (amplía las pequeñas y muestra las partes transparentes sobre gris) antes de describirla, y tú la ves antes de que cambie nada. Pídele varias versiones para elegir (hasta 4 a la vez), o cambios como "recórtala a la mitad superior", "haz transparente el fondo blanco" o "hazla más pequeña". Cada cambio crea una versión nueva y las anteriores se conservan.
4. Cuando aceptas, Mari guarda la imagen en tu tema (como WebP, igual que **Add pictures**) y la coloca en el CSS del tema. Aparece en **Pictures and sharing details** (Imágenes y detalles para compartir) como cualquier imagen que hayas agregado tú.

Los adornos dibujados, como rieles, vallas y botones de envío, son imágenes SVG. Mari puede cambiarles el color directamente, sin tu modelo de imágenes, y se mantienen nítidos.

Cada imagen tarda lo que necesite tu modelo de imágenes, normalmente entre medio minuto y un minuto y medio. Si tu conexión de imágenes usa tu propio flujo de ComfyUI, el texto integrado en ese flujo se sigue enviando.

### Compartir tu tema

1. En **Pictures and sharing details**, completa **Author** (Autor), **Version** (Versión, como `1.0`), **Description** (Descripción) y **Thumbnail** (Miniatura), y elige **Made for** (Creado para: Oscuro, Claro o ambos). Para sugerir tus colores y fuente junto con el tema, haz clic en **Use my current Appearance** (Usar mi Apariencia actual) en **Settings** (Ajustes). Guarda.
2. Haz clic en **Export** (Exportar el tema, el icono de subir) en la fila de tu tema. Marinara guarda un archivo `.json` con el CSS, las imágenes y las fuentes dentro.
3. Si usaste arte o fuentes de otra persona, abre el archivo en un editor de texto y agrega los créditos y una licencia. Consulta [Archivos de tema](#theme-files).
4. Envía ese archivo. La otra persona lo importa con **Import File** (Importar archivo) y ve tu nombre, los créditos y una lista de todo lo que cambia el tema antes de instalarlo.

### Si algo sale mal

Marinara mantiene utilizables la barra superior, las barras laterales, <kbd>Ctrl</kbd>+<kbd>K</kbd> y el cuadro de mensaje, haga lo que haga un tema. Si tu tema oculta, mueve o cubre alguno de ellos, Guardar te indica qué falló. Aun así puedes elegir **Save anyway** (Guardar de todos modos), pero Marinara desactiva el tema en una pestaña en cuanto afecta al funcionamiento de alguno. Para recuperar tu aspecto normal en cualquier momento, pulsa <kbd>Esc</kbd> tres veces, agrega `?safe` al final de la dirección, o pulsa <kbd>Ctrl</kbd>+<kbd>K</kbd> y escribe "Tema personalizado".

Los temas iniciales son buenos ejemplos para aprender. Clona uno y lee su CSS para ver cómo usa los tokens y los puntos de extensión de partes que se describen a continuación.

## Cómo tiene prioridad un tema

El CSS de la app está en capas de cascada, declaradas al principio de `index.html`:

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- Un tema **no está en ninguna capa**, así que un selector simple de un tema tiene prioridad sobre cualquier regla de la app sin `!important`,
  sea cual sea la especificidad de esa regla.
- `mari-pickers` contiene los selectores de Apariencia (fondo, acento, fuentes, colores del chat). Está
  por encima de los valores predeterminados de la app y por debajo de un tema, así que los colores del tema tienen prioridad sobre los selectores, y
  Apariencia avisa cuando un tema anula un selector.
- `!important` sigue funcionando en un tema. Esas reglas se copian en `mari-theme-important`, que
  tiene prioridad sobre las reglas `!important` de la app.
- `mari-protected` mantiene en su sitio la barra superior, la barra lateral de chats, la barra lateral de Biblioteca y Ctrl+K.
  Un tema puede cambiar su estilo (colores, fuentes, bordes, radio, sombras), pero no ocultarlas, moverlas, reducirlas ni
  cubrirlas. Si lo intenta, el tema se desactiva en esa pestaña y se explica el motivo.
- Una transición puede esperar como máximo un segundo antes de empezar (`transition-delay`, o el segundo tiempo
  en `transition`). Se rechazan los temas que retrasan un cambio más tiempo, para que nada aparezca mucho
  después de haber comprobado la pantalla. Las animaciones pueden usar cualquier retraso.

Siempre puedes volver atrás: `?safe` en la URL, **Escape tres veces**, o Ctrl+K > "Tema personalizado"
desactiva el tema. Un tema nuevo pregunta "¿Conservar este tema?" y vuelve atrás después de 15 segundos.

## Tokens de color

### Básicos (todos los estilos visuales los definen)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

Los valores son colores CSS completos (`#1b1530`, `rgb(…)`, `oklch(…)`). Los tripletes HSL sueltos como
`270 25% 8%` (la convención de shadcn) **no** son válidos aquí.

Define los ámbitos claro y oscuro por separado con `[data-theme="light"]` y `[data-theme="dark"]`.

### Diseño nuevo

| Token                                                            | Uso                                                                                                                      |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--ov-line`                                                      | Líneas finas y bordes de paneles                                                                                                   |
| `--ov-text`, `--ov-muted`, `--ov-dim`                            | Texto, texto secundario, texto tenue                                                                                              |
| `--ov-accent`                                                    | Puntos de acento (el valor predeterminado es `--primary`)                                                                                        |
| `--ov-hover`, `--ov-active-bg`                                   | Fondos al pasar el cursor y al presionar                                                                                                 |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | Colores de los modos de chat en la barra lateral de chats y los editores                                                                            |
| `--ov-serif`                                                     | Fuente de los títulos (sigue `--mari-font-heading`)                                                                                    |
| `--mari-selected-tint`                                           | Filas, etiquetas redondeadas e interruptores seleccionados. Neutro (`--foreground`) de forma predeterminada; usa `var(--primary)` para teñir la selección con el acento |
| `--mari-selected-bg`, `--mari-selected-ring`                     | Derivados del tinte (10% y 18%)                                                                                           |

### Tokens de tema (v1)

Cada uno usa el aspecto de la app de forma predeterminada. El modo claro tiene sus propios valores legibles.

| Token                                                                                                    | Uso                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--mari-font-ui`                                                                                         | La fuente de toda la app                                                                                                        |
| `--mari-font-heading`                                                                                    | Títulos de páginas y secciones                                                                                                     |
| `--mari-font-chat`                                                                                       | Texto de los mensajes en chats de los modos Roleplay y Conversation                                                                             |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game`                                   | Fichas de Inicio, chats recientes, el lanzador de chats nuevos, etiquetas sobre los títulos de widgets de Inicio                                                       |
| `--mari-home-pink`, `--mari-home-violet`                                                                 | Los demás acentos de los widgets de Inicio                                                                                               |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline`               | Puntos y etiquetas de presencia                                                                                                    |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger`                                            | Medidores del juego y barras de HP. El color propio de un widget sigue teniendo prioridad en su estado normal; el estado de peligro siempre usa el token                 |
| `--mari-game-combat`, `--mari-game-combat-text`                                                          | El botón Combate del juego                                                                                                    |
| `--mari-stage-empty-bg`                                                                                  | El escenario del juego antes de que cargue una imagen de escena (cualquier `background`, incluidos los degradados)                                            |
| `--mari-scrim`                                                                                           | El fondo atenuado detrás de Ctrl+K                                                                                           |
| `--mari-user-avatar-placeholder`                                                                         | Tu avatar cuando no tienes imagen (un degradado)                                                                           |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | El degradado de las tarjetas sin imagen. Cada tarjeta conserva su propio tono; configura estos valores (como porcentajes) para suavizar los degradados |
| `--mari-app-backdrop`                                                                                    | Una imagen o un degradado detrás de toda la app, dibujado una sola vez (ver más abajo)                                                         |
| `--mari-accent-fx-animation`                                                                             | La animación de Pulso del acento o Modo RGB mientras alguno está activado; en caso contrario, `none`                                                    |

### Tokens de tema agregados en v1.1

No tienen valor hasta que un tema les asigna uno, así que hasta entonces se aplica el ajuste del usuario.

| Token                                                                                                                                                                                                                        | Uso                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-text-outline`                                                                                                                                                                                                        | El contorno del texto de los mensajes, por ejemplo `0` para desactivarlo o `1px #3b2a1a`. En caso contrario se usa el ajuste Contorno del texto del usuario                                                                                                      |
| `--mari-dialogue-color`                                                                                                                                                                                                      | Color del diálogo cuando el personaje o la persona (el perfil que te representa) no tiene uno propio (su propio color sigue teniendo prioridad)                                                                                                                                   |
| `--mari-chat-font-size`                                                                                                                                                                                                      | Tamaño del texto de los mensajes. El mínimo de Accesibilidad sigue aplicándose                                                                                                                                                                        |
| `--mari-composer-placeholder`                                                                                                                                                                                                | El marcador de posición del cuadro de mensaje, como cadena entre comillas: `"> waiting for user input..."`. Defínelo en `:root` o en un cuadro de mensaje, como `[data-composer="game"]`. Se ignora el texto que pide claves o contraseñas                         |
| `--mari-page-veil`                                                                                                                                                                                                           | Un color superpuesto a Ajustes, Biblioteca, editores y Documentación, para mantener legibles los textos largos sobre un fondo. `transparent` de forma predeterminada                                                                                                 |
| `--mari-page-floor` | La lámina casi opaca sobre la que se apoya cada página completa encima de un fondo. Por defecto `color-mix(in srgb, var(--background) 94%, transparent)`; `transparent` la quita |
| `--mari-top-bar-bg`                                                                                                                                                                                                          | Un valor `background` completo para la barra superior: una imagen, un degradado o varias capas. `--mari-top-bar-rendering: pixelated` mantiene nítido el pixel art. Las pestañas y los iconos siempre permanecen encima y visibles                                |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius`                                                                                                                                                                        | Sobre el arte de la barra superior, cada pestaña, pestaña de chat abierto, botón de icono y el logo se apoyan en una placa para mantener su legibilidad. Estos valores definen el color de la placa y el radio de sus esquinas (predeterminado: `0.5rem`); usa un radio de `0` para botones de píxeles cuadrados. |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | Una franja bajo las pestañas de la barra superior (un teletipo o una cerca) pasa a la fila del grupo mientras esta aparece (`:root[data-ov-tabrow]`; la fila es `[data-tab-row]`). Define en `[data-tab-row]` un `background`, su altura y el espacio que ocupa debajo (por defecto, su altura; `0px` la deja detrás). Puedes animar `[data-mari-part="tab-row-strip"]`. Retira tú la franja de la barra bajo `:root[data-ov-tabrow]`. |
| `--mari-msg-head-rule`                                                                                                                                                                                                       | La línea bajo el nombre en los mensajes del modo Roleplay (un valor `border-bottom`, como `none` o `2px dashed currentColor`)                                                                                                               |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg`                                                                                                         | El marco y la superficie de cada widget de Inicio, incluido Professor Mari                                                                                                                                                                    |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Tipografía de los widgets de Inicio. Los widgets crecen en altura cuando el texto necesita más espacio en lugar de recortarlo                                                                                                                                        |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale`                                                                                                                        | La etiqueta pequeña sobre los títulos de los widgets, el texto del botón Preguntar de Professor Mari y el tamaño de la imagen de Mari (1 = predeterminado)                                                                                                                 |
| `--mari-home-wash`                                                                                                                                                                                                           | El tinte que Inicio superpone a un fondo (predeterminado: 65% del color de la tarjeta); `transparent` muestra el arte con toda su intensidad                                                                                                                  |
| `--mari-home-art`                                                                                                                                                                                                            | `none` oculta las imágenes predeterminadas de las tarjetas de Inicio; se cargan bajo demanda, así que las ocultas nunca se descargan. Son imágenes pequeñas dentro de tarjetas individuales (Novedades, Alrededor de la mesa), no un fondo de Inicio: el arte detrás de Inicio es el fondo de la app                                                                                                                            |
| `--mari-ambient` (y `-opacity`, `-blend`, `-animation`)                                                                                                                                                                    | La superposición ambiental: consulta Superposición ambiental                                                                                                                                                                                          |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji`                                                                                                                                            | Una imagen en lugar del icono del cuadro de mensaje (un valor `background-image`)                                                                                                                                                          |
| `--mari-cursor`, `--mari-cursor-pointer`                                                                                                                                                                                     | Un cursor con imagen (un valor `cursor` completo). Tiene prioridad sobre Puntero del ratón personalizado mientras el tema está activado                                                                                                                               |

### Tokens de tema agregados en v1.4

Como los tokens de v1.1, el primer grupo no hace nada hasta que un tema lo configura.

| Token                                                                                          | Uso                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-message-time`                                                                          | El color de las horas de los mensajes (`[data-mari-part="time"]`) en todos los modos de chat                                                                          |
| `--mari-chat-wash`                                                                             | El tinte sobre el fondo de un chat del modo Roleplay, como valor `background` completo. El predeterminado es una capa oscura, de color blanco lavanda en Claro. `none` lo quita |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal`                          | Los puntos de estado de las entradas de lorebook (libro de trasfondo, también llamado World Info)                                                                                                                      |
| `--mari-toast-font-size`                                                                       | Tamaño del texto de los avisos emergentes (ya usan `--mari-font-ui`)                                                                                               |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size`                                  | Las líneas de los accesos directos Aprender y Comunidad de Inicio. Si solo se configura `--mari-home-widget-text-size`, lo siguen, con las descripciones a 0,85x                  |
| `--mari-min-ui-text`                                                                           | Un mínimo para el texto más pequeño de la app (etiquetas, recuentos y fichas de 9-12 px). También se pueden configurar `--text-xs`, `--text-sm` y `--text-base` de Tailwind           |
| `--mari-user-avatar-image`                                                                     | Una imagen para tu avatar cuando la persona no tiene una. Sin el token, el marcador de posición ahora muestra la imagen propia de la persona cuando tiene una             |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | Espacios, ver más abajo                                                                                                                                    |

Estos reemplazan valores que eran fijos en la app y usan el aspecto predeterminado como alternativa:

| Token                                                                               | Uso                                                                                                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chrome-accent`                                                              | El subrayado de la pestaña activa, los contenedores de los editores, los selectores y las pantallas de conexiones                                                                                          |
| `--mari-chrome-muted`                                                               | Texto secundario gris en paneles, barras laterales e Inicio (predeterminado: 58% del texto de los controles de la interfaz)                                                                                 |
| `--mari-resource-accent`, `--mari-resource-<type>`                                  | Los colores de Biblioteca por tipo: `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser`                    |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game`           | Colores de las filas de Ctrl+K por modo                                                                                                                                      |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | El botón Combate del modo Game (los dos fondos son un `background` completo, así que admiten un degradado; agrega también una capa de color sólido)                                     |
| `--mari-accent-text`                                                                | El acento cuando se usa en texto pequeño o en un icono (pestañas activas, etiquetas de sección, enlaces). Predeterminado: el acento, oscurecido en Claro y aclarado en Oscuro lo justo para poder leerlo |
| `--mari-top-bar-plate-active`                                                       | La placa detrás de un control activo de la barra superior cuando la barra tiene arte (predeterminado: la placa mezclada con un 20% de acento)                                                         |
| `--mari-chat-header-bg`                                                             | El degradado detrás del encabezado del modo Conversation (predeterminado: el color de página al 88% que se desvanece; `none` bajo un fondo de la app)                                                 |
| `--mari-home-hero-padding`, `--mari-home-widget-glow`                               | El espacio interior del saludo de Inicio y el resplandor detrás del encabezado de un widget de Inicio                                                                                                 |

La app también publica `--mari-top-bar-height` en `<html>` (la altura real de la barra superior, que
cambia cuando un tema hace la barra más alta), para que el tema pueda dejar espacio para sus propias capas debajo.

### Tokens de tema agregados en v1.5

Para respuestas largas y partes que antes necesitaban clases internas. Ninguno hace nada hasta que un tema
lo configura, salvo donde se indica un valor predeterminado.

| Token                                                      | Uso                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chat-column`                                       | La columna del modo Roleplay que comparten los mensajes y el cuadro de mensaje (predeterminado: 58rem). El ajuste propio del lector Ajustes del chat → Ancho del chat sigue teniendo prioridad                                   |
| `--mari-message-measure`                                   | La línea más larga del texto de un mensaje, por ejemplo `68ch` (modos Roleplay y Conversation)                                                                                    |
| `--mari-chat-line-height`                                  | Interlineado del texto de los mensajes en todos los modos de chat (predeterminado: 1,5). Accesibilidad → Interlineado sigue teniendo prioridad                                                                 |
| `--mari-dialogue-weight`                                   | El grosor del diálogo entre comillas (`[data-mari-part="dialogue"]`), por ejemplo `400` para que un discurso largo no sea un bloque en negrita                                                   |
| `--mari-dialogue-color`                                    | Ahora también se muestra cuando los colores `--mari-chat-*` del tema activan la coloración del chat, al igual que los colores que el tema asigna a las cursivas y los enlaces                      |
| `--mari-paragraph-gap`                                     | Espacio entre párrafos en lugar de una línea en blanco, por ejemplo `0.85em`                                                                                            |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg`        | `on`: la línea del nombre de una respuesta larga del modo Roleplay permanece en la parte superior del chat mientras te desplazas por ella (computadora y tableta). El fondo usa el de la burbuja de forma predeterminada |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | La posición de la línea fijada (predeterminado: el borde superior del chat visible) y cuánto se extiende más allá del texto (predeterminado: 1rem)                                              |
| `--mari-phone-avatar`                                      | `hidden`: los teléfonos omiten la columna del avatar en el modo Roleplay, para que la respuesta ocupe todo el ancho                                                                              |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring`       | La imagen pequeña junto al nombre en teléfonos (**Profile pictures on phones: Mini** (Fotos de perfil en teléfonos: Mini), el valor predeterminado): su tamaño y su anillo como `box-shadow`. Es `[data-mari-part="mini-avatar"]` con `data-role` (`user`, `assistant`) |
| `--mari-phone-convo-avatar`                                | `full`: los chats del modo Conversation conservan la columna completa del avatar en teléfonos aunque el usuario haya elegido **Mini** |
| `--mari-vn-fade`                                           | El degradado al pie del cuadro de texto de novela visual mientras hay más contenido del párrafo debajo (predeterminado: 1,75rem; `0` lo desactiva)                                                      |
| `--mari-message-actions`, `--mari-swipe-counter`           | El color de las herramientas bajo un mensaje y de su contador de swipes (respuestas alternativas) "2 / 5"                                                                                            |
| `--mari-card-art-placeholder`                              | Un `background` completo para las tarjetas de Biblioteca sin imagen, en lugar del degradado de tono aleatorio                                                                          |
| `--mari-chat-row-art-opacity`                              | La imagen del chat abierto detrás de su fila en la barra lateral de chats (predeterminado: 0,14; `0` la oculta)                                                                              |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient`    | Ahora también afectan a las superficies que leen el acento de `<html>` (las pestañas Convo / Roleplay / Game, los bordes de los controles de la interfaz)                                                   |
| `--mari-focus-frame-outset`                                | Cuánto se extiende el marco de foco más allá de su superficie (una longitud, como máximo 2rem; consulta Espacios)                                                                                |
| `--mari-scrim`                                             | La capa atenuada detrás de los diálogos                                                                                                                                        |
| `--mari-confirm-scrim`                                     | La capa clara y transparente detrás de los diálogos breves de confirmación (mantenla tenue para que los temas luminosos resulten tranquilos)                                                          |

La app también publica `--mari-center-x` en `<html>` mientras un tema tiene una superposición ambiental: el
centro horizontal del panel del chat, para que una máscara pueda dejar despejada la columna de lectura tanto si las barras laterales
están abiertas como si no. `--mari-gutter-mask` lo usa.

## Imágenes

Un tema lleva sus imágenes en `images` dentro del archivo de tema, y su CSS las usa por nombre:

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- Las imágenes cuentan para el límite de 6 MiB del paquete, no para el límite de 256 KiB del CSS, así que cabe arte a tamaño completo.
- En el editor, abre **Pictures and sharing details** y haz clic en **Add pictures**. Los PNG y JPEG se
  guardan como WebP al incorporarlos (los pequeños sin pérdida, para mantener nítidos el pixel art y los marcos de 9 segmentos;
  como máximo 2560 px en el lado más largo). Haz clic en el nombre de una imagen para colocar `url("theme:name")` donde está el cursor.
- Importar un tema hace lo mismo: las imágenes escritas dentro del CSS como URL `data:` se trasladan
  a `images`, los PNG y JPEG fijos se convierten en WebP y la vista previa enumera cada imagen con su tamaño
  (con una casilla "Conservar los archivos originales (más grandes)").
- Los nombres `theme:` también encuentran los `backgrounds` del tema por nombre, así que el arte que incluyas para la galería
  de fondos del chat también puede usarse en el CSS, tanto si el usuario lo agrega a la galería como si no.
- Cuando se aplica el tema, cada imagen se convierte en una URL `blob:` corta del mismo origen: no se
  descarga nada y una imagen usada en muchos lugares se decodifica una sola vez.
- Los GIF, APNG, WebP animados y SVG con `<animate>` cuentan como imágenes en movimiento. La vista previa de importación
  lo indica y, con Reducir movimiento activado, se muestran como su primer fotograma.

## Fondos

Configura `--mari-app-backdrop` en `:root` para dibujar arte detrás de la app:

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

Se dibuja una sola vez, en su propia capa fija bajo toda la app (`[data-mari-part="app-backdrop"]`, para que
las decoraciones de Inicio y el esquema claro nunca lo oculten), y también aparece detrás de los chats: las superficies de los modos Roleplay,
Conversation y Game se vuelven transparentes y el fondo predeterminado del chat deja de mostrarse. Un
fondo elegido por el usuario para un chat sigue apareciendo encima. Los paneles conservan `--card` y
`--sidebar`, así que hazlos translúcidos si quieres que se vea el arte detrás, y usa
`--mari-page-veil` para teñir las páginas completas. Para dar a las páginas un panel propio, aplica estilos a
`[data-mari-part="page"]` (consulta Puntos de extensión): contiene todas las páginas de Biblioteca, los editores, Ajustes y Documentación, así que
Lorebooks recibe el mismo panel que Personajes. Sobre un fondo, cada página completa se apoya además en una lámina casi opaca de tu `--background` (`--mari-page-floor`, 94 % por defecto), para que las listas largas y los editores sigan siendo legibles. Pon `--mari-page-floor` en otro color, o en `transparent` para que se vea más arte. Un tema que da estilo a `[data-mari-part="page"]` con `!important` sustituye esa lámina por su propio panel.

| Token                            | Predeterminado                                                                                                                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-app-backdrop`            | Una imagen o un degradado                                                                                                                                                                                             |
| `--mari-app-backdrop-size`       | `cover` (prueba `auto` o `64px` para mosaicos)                                                                                                                                                                          |
| `--mari-app-backdrop-position`   | `center`                                                                                                                                                                                                          |
| `--mari-app-backdrop-repeat`     | `no-repeat`                                                                                                                                                                                                       |
| `--mari-app-backdrop-attachment` | `fixed`                                                                                                                                                                                                           |
| `--mari-app-backdrop-rendering`  | `auto` (`pixelated` para pixel art)                                                                                                                                                                                |
| `--mari-app-backdrop-layers`     | Un valor `background` completo con varias capas, como `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. Tiene prioridad sobre los tokens de una sola imagen |

Las imágenes personalizadas son la parte más flexible de un tema: fondos, una franja en la barra superior, marcos
de widgets de Inicio y de mensajes (`border-image`, o un `background` en cualquier punto de extensión de parte), patrones en mosaico
y fuentes de píxeles incluidas se distribuyen dentro del archivo de tema, y la vista previa de importación los enumera.
El ajuste Apariencia > Accesibilidad > Intensidad del arte del tema atenúa el fondo y la superposición
ambiental, y Contraste alto los mantiene al 25% o menos; un tema no puede anular ninguno de los dos.

## Superposición ambiental

`--mari-ambient` acepta un valor `background` completo para una capa sobre el chat y las páginas, pero
**debajo** de la barra superior y ambas barras laterales: lluvia, hojas que caen, líneas de escaneo, una viñeta.

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend` define un `mix-blend-mode`, y `[data-mari-part="ambient"]::before` y
`::after` quedan libres para dos capas más. La capa nunca intercepta clics, deja de moverse con Reducir
movimiento (sus imágenes se convierten en fotogramas fijos) y debe ser mayormente transparente: si la capa ambiental de un tema
oculta el chat, se desactiva el tema. Usa esto en lugar de un `body::after` de pantalla completa, que
el mecanismo de protección considera que cubre la app.

La capa permanece inmóvil cuando nadie puede verla: mientras la app está en segundo plano (otra pestaña
o app tiene el foco) y, en teléfonos y tabletas, mientras una página completa, como una página de Biblioteca, un editor o
Ajustes, cubre el chat. Las animaciones infinitas en otras partes de un tema también se pausan en segundo plano. Continúan
desde donde se quedaron, así que no sincronices nada importante con ellas.

El fondo propio de un chat es un `<img data-mari-part="backdrop">`. El predeterminado (sin fondo elegido)
también tiene `data-default-background="true"`, así que un tema puede reemplazar solo ese:

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## Clima

Cuando la historia tiene clima (Ajustes > Apariencia > Efectos > Efectos de clima dinámicos, con el agente World State
activado), la app dibuja lluvia, nieve, niebla, pétalos, estrellas, un sol o una luna sobre el chat. Un tema puede cambiar el estilo
de todo ello con los tokens `--mari-weather-*`, y cambiar su propio arte para adaptarse al clima.

¿Es tu primera vez? [Clima en tu tema](theme-weather.md) te guía paso a paso, con imágenes.

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

La app sigue encargándose de dibujar todo. Lee estos tokens cuando el tema carga, cuando cambia el esquema
de colores y cuando editas el tema, comprueba cada valor e ignora lo que no
entiende. Así, el clima diurno y nocturno (o por chat) funciona como cualquier otro token.

| Token                            | Valores                                                                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-weather-style`           | `smooth` (predeterminado) o `pixel`: la capa se dibuja a baja resolución y se amplía con nitidez, y las partículas se convierten en celdas cuadradas                                      |
| `--mari-weather-pixel-size`      | De 2 a 6 (px por celda), predeterminado: 3                                                                                                                                 |
| `--mari-weather-<kind>-color`    | Un color simple (`#hex`, un nombre de color, `rgb()`, `hsl()`), sin degradados ni imágenes                                                                              |
| `--mari-weather-<kind>-image`    | Hasta 4 imágenes propias del tema, `url("theme:a.png") url("theme:b.png")`; cada partícula elige una. En el estilo suave, las hojas, los pétalos y las cenizas giran al caer |
| `--mari-weather-<kind>-size`     | De 0,5 a 3 veces. En el estilo de píxeles, una imagen se dibuja a su tamaño multiplicado por este valor, para que el pixel art conserve sus píxeles (píxel del arte = tamaño x 1 px)                           |
| `--mari-weather-<kind>-shape`    | `round` o `square` (estilo suave; cuadrados para "nieve de datos" o chispas)                                                                                           |
| `--mari-weather-amount`          | De 0,25 a 1: un tema puede reducir la cantidad de efectos climáticos, nunca aumentarla                                                                                                     |
| `--mari-weather-speed`           | De 0,5 a 1,5 veces                                                                                                                                                |
| `--mari-weather-strength`        | De 0,5 a 1,5 veces la intensidad con la que se muestran las partículas (lluvia tenue sobre una ciudad oscura)                                                                                         |
| `--mari-weather-tint-strength`   | De 0 a 1 veces el tinte predeterminado del cielo (azul con lluvia, oscuro de noche)                                                                                                   |
| `--mari-weather-rain-length`     | De 0,5 a 3 veces la longitud de los trazos de lluvia                                                                                                                       |
| `--mari-weather-sun`, `-moon`    | `none` cuando tu fondo dibuja su propio sol o luna                                                                                                            |
| `--mari-weather-lightning-color` | El color del destello. Su intensidad y ritmo conservan los valores suaves de la app, seguros para personas con epilepsia                                                                           |
| `--mari-weather-lightning-bolt`  | `on`, `none` o 0,5-3 (ancho): un rayo ramificado por el lado izquierdo o derecho con cada destello, que se desvanece con él                                                        |

Tipos: `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (clima ventoso), `petal` (floración), `ember`, `ash`,
`sand`, `firefly`, `star`, `aurora`, y `sun` y `moon` (color, tamaño y una imagen).

### Arte que sigue el clima

Mientras se muestra el clima de un chat, `<html>` contiene dos palabras de listas fijas (nunca el texto de la propia historia):

| Atributo           | Valores                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky`     | `dawn`, `day`, `dusk`, `night`                                                                                  |
| `data-mari-shelter` | `indoors` o `outdoors` (ausente cuando la app no puede determinarlo)                                                       |

En interiores la app no dibuja partículas, bancos de niebla, sol, luna ni estrellas, solo el tinte y el
destello del relámpago, así que los tokens climáticos de un tema solo se muestran en exteriores. Se establecen tanto si Reducir animaciones y efectos ambientales está activado como si no (cambiar un fondo no produce movimiento), y
se quitan cuando el chat no tiene clima o el usuario lo desactiva. Úsalos para volver gris un
fondo soleado cuando llueve, o para apartar tu propia capa ambiental y evitar que duplique el clima:

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### Lo que sigue decidiendo el usuario

- Un tema no puede activar ni desactivar el clima; lo decide el interruptor del usuario.
- Reducir animaciones y efectos ambientales (o el ajuste del dispositivo para reducir el movimiento) impide dibujar cualquier efecto climático.
- Efectos de pintura reducidos elimina el tinte, los resplandores y la capa del atardecer, y dibuja el 60% de las partículas.
- Intensidad del arte del tema atenúa el clima de un tema igual que su fondo, y Contraste alto lo mantiene al 25% o menos.
- En todos los dispositivos, el clima deja de dibujarse mientras un panel, un editor o Mari cubre el chat.

Petal OS (clima de píxeles y sus propios pétalos), NEON//GRID (lluvia de trazos cian) y Lantern Path (hojas
pintadas, fondos que se vuelven grises con mal tiempo) son ejemplos completos: usa **Clone + Edit** en uno para leer su CSS.

## Efectos de acento

Pulso del acento y Modo RGB animan algunos puntos de acento en el diseño nuevo ("+ Nuevo", botones principales,
la ficha del avatar del asistente) con un filtro CSS. No se reescribe nada en cada fotograma. Un tema puede:

- activar Pulso del acento para sus usuarios con `:root { --marinara-theme-accent-pulse: enabled; }`;
- agregar sus propios elementos con `animation: var(--mari-accent-fx-animation);`.

Ambos se detienen con `prefers-reduced-motion` y el ajuste "Reducir animaciones y efectos ambientales" de la app.

## Puntos de extensión

### En `<html>`

| Atributo                       | Valores                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data-theme`                    | `dark`, `light`                                                                                          |
| `data-visual-theme`             | `default` (Marinara), `sillytavern` (Dottore), `stage`                                                   |
| `data-overhaul`                 | `on` (diseño nuevo, computadora), `mobile` (diseño nuevo, teléfono y tableta); ausente en el diseño anterior            |
| `data-custom-theme`             | El id del tema activo                                                                                    |
| `data-seasonal-theme`           | El aspecto de temporada, cuando hay uno activado                                                                        |
| `data-mari-accent-fx`           | `pulse` o `rgb` mientras se ejecuta un efecto de acento                                                             |
| `data-chat-id`                  | El id del chat abierto                                                                                       |
| `data-chat-open-mode`           | El modo del chat abierto: `roleplay`, `conversation`, `game`                                                 |
| `data-chat-tags`                | Las etiquetas del chat abierto, en minúsculas y con los espacios convertidos en `-`: aplica estilos a una historia con `:root[data-chat-tags~="horror"]` |
| `data-mari-chat-art-behind`     | Presente mientras el fondo del chat se muestra detrás de los paneles laterales (`--mari-chat-art` es la imagen)   |
| `data-marinara-reduced-effects` | Presente cuando se reduce la animación ambiental                                                                |
| `data-mari-a11y-line-height`    | Presente cuando el usuario aumenta el interlineado (`--mari-a11y-line-height`)                                   |
| `data-mari-a11y-letter-spacing` | Presente cuando el usuario aumenta el espaciado entre letras (`--mari-a11y-letter-spacing`)                              |
| `data-mari-a11y-focus`          | Presente cuando están activados los anillos de foco marcados                                                                   |
| `data-mari-contrast`            | `more` cuando está activado el contraste alto (por elección del usuario o porque el dispositivo lo solicita)                           |
| `data-mari-cvd-safe`            | Presente cuando están activados los colores aptos para daltonismo                                                            |
| `data-mari-weather`             | El clima de la historia mientras se muestra: `rain`, `snow`, `fog`… (consulta [Clima](#weather))                       |
| `data-mari-sky`                 | `dawn`, `day`, `dusk` o `night` mientras se muestra el clima de la historia                                           |
| `data-mari-shelter`             | `indoors` o `outdoors` mientras se muestra el clima de la historia, cuando la app puede determinarlo a partir de la ubicación           |

### Áreas

`[data-component="…"]` nombra las áreas grandes: `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`,
`RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`,
`OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`,
`OverhaulEditorRail`.

### Partes

| Selector                                                                               | Qué es                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-mari-part="message"]`                                                           | Una fila de mensaje, en todos los modos de chat: todo el ancho del chat, con el avatar, la línea del nombre y la burbuja dentro. Colorea la burbuja (`bubble` más abajo), no esta fila, o cada burbuja quedará dentro de un segundo cuadro. También tiene `data-message-id` y `data-message-role` (`user`, `assistant`, `system`, …) y los datos del mensaje que se describen más abajo                                                                                                                                                                                               |
| `[data-mari-part="bubble"]`                                                            | La propia burbuja del mensaje, en los modos Roleplay y Conversation (`.mari-rp-bubble` / `.texting-bubble`). El fondo, el borde, el radio y la sombra van aquí |
| `[data-mari-part="message"][data-latest]`                                              | La respuesta más reciente del personaje                                                                                                                                                                                                                                                                                                             |
| `[data-mari-part="message"][data-streaming]`                                           | Una respuesta que todavía se está escribiendo                                                                                                                                                                                                                                                                                                             |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | Dentro de un mensaje: el avatar, la línea del nombre y las herramientas del mensaje                                                                                                                                                                                                                                                                               |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]`                    | El interruptor (o cuadro) de razonamiento y su texto, el mismo punto de extensión en computadoras y teléfonos                                                                                                                                                                                                                                                              |
| `[data-mari-part="composer"]`                                                          | El cuadro de mensaje. `data-composer` es `roleplay`, `conversation` o `game`                                                                                                                                                                                                                                                                        |
| `[data-mari-part="home-art"]`                                                          | Las imágenes predeterminadas de las tarjetas de Inicio                                                                                                                                                                                                                                                                                                              |
| `[data-mari-part="message"][data-vn]`                                                  | El cuadro de diálogo de novela visual: un mensaje con los mismos datos (personaje, rol, índice), más las partes `avatar` y `header` dentro                                                                                                                                                                                                                   |
| `[data-mari-part="vn-sprite"]`                                                         | Una capa vacía detrás del cuadro de diálogo de novela visual, que llega hasta la parte inferior de la escena. Tiene `data-vn-speaker` (el nombre de quien habla como slug, o su rol), `data-vn-speaker-role`, `data-character` y `data-character-id` de quien esté hablando, para que un tema pueda colocar su imagen ahí. `[data-roleplay-vn-media]` tiene los mismos atributos |
| `[data-mari-part="message"][data-game-narration]`                                      | El cuadro de narración del modo Game. `data-message-role` es `narrator`, o `assistant` con `data-character` y `data-character-name` mientras habla un personaje; `data-segment-type` y `data-expression` describen la línea actual                                                                                                                         |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]`                        | Las capas de fondo y ambiental. Su lugar en la página es fijo; aplica estilos con los tokens                                                                                                                                                                                                                                                   |
| `[data-mari-part="home-widget"]`                                                       | Una tarjeta de widget de Inicio, incluido Professor Mari. Su marco tiene `data-home-widget-id` (`recent`, `professor`, `whats-new`, `character-library`, …). Dentro: `home-widget-eyebrow`, `home-widget-title`, `home-widget-text`                                                                                                                           |
| `[data-mari-part="top-bar"]`                                                           | La barra superior en todos los dispositivos. El segundo lado de la vista dividida tiene su propia barra delgada con los mismos puntos de extensión (`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`), marcada con `[data-split-bar]`, para que el arte y las fuentes de la barra superior también le lleguen                                                                                                     |
| `[data-mari-part="page-title"]`                                                        | El título grande de una página principal: todas las secciones de Biblioteca (Personajes, Lorebooks, Conexiones, Agentes…), Ajustes, Extensiones y Documentación. Aplica estilos a los títulos con este único punto de extensión para que coincidan en todas las páginas                                                                                                                                              |
| `[data-mari-part="backdrop"]`                                                          | La imagen de fondo de un chat (consulta Fondos)                                                                                                                                                                                                                                                                                                       |
| `[data-mari-part="stage-empty"]`                                                       | El escenario del juego sin imagen de escena                                                                                                                                                                                                                                                                                                              |
| `[data-mari-part="time"]`                                                              | La hora de un mensaje, en todos los modos de chat                                                                                                                                                                                                                                                                                                            |
| `[data-mari-part="chat-header"]`                                                       | El encabezado del modo Conversation (`data-chat-mode="conversation"`)                                                                                                                                                                                                                                                                                       |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]`                         | El panel flotante de mapa y grupo del modo Game y la fila de herramientas de narración                                                                                                                                                                                                                                                                                         |
| `[data-mari-part="avatar-placeholder"]`                                                | El círculo del avatar vacío; `data-role` es `user` o `assistant`                                                                                                                                                                                                                                                                                   |
| `[data-mari-part="header"][data-placement]`                                            | En mensajes del modo Roleplay: `outside` (nombre encima de la burbuja) o `inside`                                                                                                                                                                                                                                                                             |
| `[data-mari-part="home-widget-glow"]`                                                  | El resplandor detrás del encabezado de un widget de Inicio                                                                                                                                                                                                                                                                                                          |
| `[data-mari-part="dialogue"]`                                                          | Diálogo entre comillas en un mensaje                                                                                                                                                                                                                                                                                                                      |
| `[data-mari-part="paragraph-gap"]`                                                     | La línea en blanco entre dos párrafos (se convierte en un bloque al configurar `--mari-paragraph-gap`)                                                                                                                                                                                                                                                   |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav`                                   | El cuadro de texto de novela visual (`data-more-below` mientras continúa el desplazamiento), el contador "3 / 9" y los botones Anterior / Siguiente (`data-direction`)                                                                                                                                                                                                                 |
| `[data-mari-part="card-art"]`                                                          | La imagen de una tarjeta de Biblioteca; `data-placeholder` cuando no tiene ninguna                                                                                                                                                                                                                                                                                   |
| `[data-mari-part="page"]`                                                              | La superficie donde se apoya cada página completa: todas las páginas de Biblioteca (Personajes, Lorebooks, Presets, Scripts regex, Conexiones, Agentes, Herramientas personalizadas), todos los editores, Ajustes y Documentación. Dibuja un panel o una hoja aquí, no en la clase propia de una página, para que todas tengan la misma superficie legible. Chats e Inicio no están dentro                            |
| `[data-mari-part="chat-row-art"]`                                                      | La imagen del chat abierto detrás de su fila de la barra lateral                                                                                                                                                                                                                                                                                                  |
| `[data-mari-part="avatar-placeholder"]`                                                | Ahora en todos los lugares donde aparece un avatar vacío: líneas del modo Conversation, filas de chats (iniciales), el selector de persona, el cuadro de mensaje y el modo Game                                                                                                                                                                                                              |
| `.ov-lrow__dot[data-status]`                                                           | Un punto de entrada de lorebook: `constant`, `selective` o `normal`                                                                                                                                                                                                                                                                                       |
| `[data-chat-row]`                                                                      | Una fila de la barra lateral de chats; `data-selected="true"` en el chat abierto                                                                                                                                                                                                                                                                             |
| `[data-chat-mode]`                                                                     | La superficie del chat, por modo                                                                                                                                                                                                                                                                                                                       |
| `.mari-messages-scroll`                                                                | La lista de mensajes con desplazamiento                                                                                                                                                                                                                                                                                                                      |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant`                  | Burbujas de los modos Roleplay y Conversation                                                                                                                                                                                                                                                                                                               |
| `.mari-window`, `.mari-drawer`                                                         | Ventanas emergentes y paneles deslizantes                                                                                                                                                                                                                                                                                                                     |

### Espacios

Solo aparecen mientras el tema activo los solicita, así que la página predeterminada no lleva partes adicionales.

- **Marco de foco.** `--mari-focus-frame` acepta un valor `border-image` completo, por ejemplo
  `url("theme:frame.png") 24 fill / 24px / 6px stretch`, y lo dibuja sobre lo que tiene la
  atención del lector: la respuesta más reciente, Ctrl+K, un diálogo abierto y Chats recientes de Inicio. Agrega
  `data-mari-focus-surface` a cualquier otro elemento (en una plantilla de mensaje) para enmarcarlo también.
  Desde v1.5 el marco solo se extiende más allá de su superficie mediante `--mari-focus-frame-outset` (como máximo
  2rem), y no se extiende nada cuando el valor tiene `fill`, para que no pueda dibujar sobre el chat; se ignora una extensión escrita
  dentro de `--mari-focus-frame`. El marco es un `border-image`: una propiedad abreviada `border` posterior en
  tu CSS sobre el mismo elemento lo restablece, así que configura `border-color`, `border-width` y `border-style`
  ahí en su lugar.
- **Títulos de ventana.** Configurar `--mari-window-title` (cualquier valor, como `on`) agrega una fila de título en la
  parte superior de cada mensaje, widget de Inicio y cuadro de mensaje: `[data-mari-part="window-title"]` con
  `data-window` (`message`, `home-widget`, `composer`, y desde v1.5 `narration`, `omnibar`,
  `window` y `dialog`), que contiene `window-title-text` (quien habla,
  el título del widget, o "Mensaje") y un `window-buttons` vacío para tus adornos `_ [] X`.
- **Vistas previas en filas de chats.** Configurar `--mari-chat-row-preview` (cualquier valor, como `on`) agrega la línea más reciente
  de cada chat bajo su nombre en la lista de Chats: `[data-mari-part="chat-row-preview"]` con
  `data-role` (`user`, `assistant`, `narrator`…), que empieza por `[data-mari-part="chat-row-preview-who"]`
  ("Tú:" para tus propias líneas, o el nombre de quien habla en un chat grupal). Cede su lugar a la línea de estado
  de la fila ("escribiendo…", "Borrador sin enviar"), así que una fila nunca muestra dos. Sin el token, la línea no se obtiene
  ni se dibuja.
- **Ambiente detrás de las tarjetas.** `--mari-ambient-placement: behind-cards` mueve la capa ambiental debajo de
  los mensajes, los widgets de Inicio y los paneles (todavía sobre el fondo), en lugar de sobre el chat.
  `--mari-ambient-mask` (un valor `mask` completo) determina dónde se muestra, y
  `--mari-ambient-mask: var(--mari-gutter-mask)` mantiene despejado el centro de la ventana, para que la lluvia caiga
  en los márgenes laterales y no sobre el texto. `--mari-gutter-clear` define la mitad del ancho despejado (26rem).

### Datos del mensaje

Cada mensaje lleva quién lo escribió, su número y cuánto tardó, como atributos para selectores
y `attr()`, y como variables CSS para `content:` y `counter()`:

| Atributo             | Variable           | Valor                                                                                      |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `data-character-id`   |                    | El id del personaje (ausente en tus propios mensajes)                                           |
| `data-character-name` | `--mari-msg-char`  | El nombre para mostrar (`--mari-msg-char` es una cadena entre comillas)                                    |
| `data-character`      |                    | El nombre en minúsculas y con los espacios convertidos en `-`, para selectores: `[data-character="captain-faye"]` |
| `data-message-index`  | `--mari-msg-index` | El número del mensaje que muestra "Números de mensaje"                                              |
| `data-gen-ms`         | `--mari-msg-gen`   | Tiempo de generación en ms (`--mari-msg-gen` es una cadena como `"3.2s"`)                      |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### Plantilla de mensaje (HTML)

Cuando CSS no basta, por ejemplo para un cuadro de estado con el nombre de quien habla y el número del mensaje, un
archivo de tema puede llevar una pequeña plantilla HTML por rol. Se completa para cada mensaje y se muestra
en un cuadro al final del mensaje, `[data-mari-part="message-extra"]`, al que tu CSS aplica estilo y
posición:

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

Claves: `message` (todos los roles), `assistant`, `user`, `narrator` (la plantilla propia de un rol tiene prioridad sobre
`message`). Campos: `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}`; los campos desconocidos
quedan vacíos. Cada plantilla tiene como máximo 4.000 caracteres. Marinara conserva el texto y las etiquetas de estructura
(`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress`, …) con atributos `class`, `title`,
`role` y `data-*`, y elimina scripts, estilos, `style` en línea, enlaces, imágenes, formularios y
atributos de eventos. Se descarta cualquier plantilla cuyo texto pida claves o contraseñas.

El usuario debe autorizar el HTML: un tema con una plantilla solo puede instalarse mientras **Settings →
Appearance → CSS Themes → Allow themes with HTML** (Ajustes → Apariencia → Temas CSS → Permitir temas con HTML) esté activado (desactivado de forma predeterminada). La vista previa de importación avisa
de ello y, con el interruptor desactivado, un tema instalado se muestra sin su HTML.

## Aspectos por chat

Ajustes del chat > Tema da a un chat su propio tema ("Aspecto predeterminado" desactiva los temas personalizados para
ese chat). En un chat con exactamente un personaje, la elección puede convertirse en el valor predeterminado de ese personaje
para sus otros chats individuales; los chats grupales y los grupos del juego nunca toman el valor predeterminado de un miembro.
La sección Tema indica de dónde viene el aspecto actual: del chat, del personaje o de la app.
Ajustes, Biblioteca, editores y Documentación siempre usan el tema de la app, y `data-chat-id` y
`data-chat-tags` solo están en `<html>` mientras se muestra el propio chat.

Las etiquetas son la forma portable de aplicar estilos a historias concretas dentro de un tema:
`:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Agrega etiquetas en Ajustes del chat > Nombre del chat
("+ Añadir etiqueta"), desde el botón de etiquetas de una fila de chat (o "Etiquetas" en el menú de pulsación larga de pantallas táctiles).
Las etiquetas se convierten a minúsculas y los espacios a `-` en el atributo, así que "Noir Mystery" coincide con `noir-mystery`.

Configurar cualquier variable `--mari-chat-*` (por ejemplo `--mari-chat-bg`, `--mari-chat-text`,
`--mari-chat-radius`, `--mari-chat-font-family`) activa por sí solo el estilo correspondiente de la superficie
del chat; los usuarios no necesitan los interruptores "Aplicar … del preset" para ver los colores de chat de un tema.

## Día y noche

Ajustes > Apariencia > Esquema de colores puede seguir al sistema o la hora del día (Claro desde las 07:00,
Oscuro desde las 19:00 de forma predeterminada, ambos ajustables). En ambos casos solo cambia `data-theme` en `<html>`,
así que un tema obtiene un aspecto diurno y otro nocturno al aplicar estilos a ambos:

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

El esquema se calcula en cada dispositivo con su propio reloj (no se sincroniza), así que un teléfono y una PC en
lugares distintos muestran cada uno la mitad correcta. Un archivo de tema puede sugerir el propio cambio:
`"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (o
`"system"`). La vista previa de importación lo ofrece como cualquier otro ajuste.

## Archivos de tema

Exportar escribe un tema como un archivo JSON:

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

Los créditos (v1.5) van en el mismo archivo y aparecen en la lista de temas (el botón (i)) y en la vista previa de
importación:

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` admite hasta cuatro etiquetas breves (40 caracteres cada una) que se muestran bajo el nombre del tema. Una fuente o
crédito con licencia `OFL-1.1` enlaza al texto de SIL Open Font License incluido en la app. Las imágenes de más
de 1920 px de ancho (o 2560 px en el lado largo) se reducen al importar el tema.

Solo se requieren `kind`, `name` y `css`. `templates` se describe en Plantilla de mensaje. Claves de `settings`: `colorScheme` (`dark`, `light`, `time` o `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`,
`accentLight`, `background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Tamaño de
visualización en px: 12, 14, 16, 17, 19, 22, 26, 30 o 34) y `reduceMotion` (true o false). Al importar se muestra primero una
vista previa con los ajustes sugeridos marcados, excepto Estilo visual, Pulso del acento, Tamaño de visualización y
Reducir movimiento, que el usuario marca si los quiere; además, el usuario elige si agrega los
fondos a su galería. Las imágenes de menos de 4 KiB permanecen en línea y se muestran como una ficha de "iconos pequeños".
Las fuentes se cargan con el tema (como reglas `@font-face`) y se quitan con él. Importar un tema con el mismo
nombre que uno instalado ofrece actualizarlo, y una actualización no agrega el mismo fondo a la
galería dos veces. El límite del CSS es de 256 KiB de texto CSS; las imágenes, la miniatura, las fuentes y los fondos
tienen 6 MiB en conjunto. Si una imagen no cabe, se omite solo esa, se indica su tamaño, y el resto
del tema se instala de todos modos. Los archivos `.css` simples, `{ "name", "css" }` y la exportación anterior
`marinara.theme-folder` se siguen importando.

## Mantener rápido un tema

En teléfonos y tabletas, sobre todo iPads con Safari, el CSS lento se nota en cada toque. La mayoría de los temas funcionan bien;
estos son los patrones que ralentizaron los temas en las pruebas:

- **`:has()` en un padre que luego aplica estilos a sus hijos**, como `.panel:has(> .row) > *` o
  `body:has(.open) .chat *`. El navegador vuelve a comprobar toda la página con cada letra escrita y
  cada palabra que llega por streaming. Pon `:has()` en el elemento al que aplicas estilos (`.row:has(> img)`), o usa un
  punto de extensión `data-mari-part` en su lugar.
- **`backdrop-filter` en muchos elementos a la vez**, como cada mensaje o cada fila de chat. Uno o dos
  paneles con efecto de vidrio esmerilado están bien; un desenfoque en cada una de cien filas, no. Usa un color transparente en su lugar.
- **Animar la disposición** (`width`, `height`, `top`, `margin`) o valores grandes de `box-shadow`. Anima `opacity`
  y `transform`, o `background-position` en la capa ambiental.

**Settings → Advanced → Troubleshooting → Show tap timings** (Ajustes → Avanzado → Solución de problemas → Mostrar tiempos de toque) muestra cuánto tarda cada toque en ese
dispositivo, con tu tema y sin él. Compara ambos para encontrar una regla lenta.

## Accesibilidad

Ajustes > Apariencia > Accesibilidad aplica el interlineado y el espaciado entre letras, los anillos de foco,
el contraste alto, los colores aptos para daltonismo y un mínimo de 12 px para el texto de los mensajes. Los valores se
escriben en la capa `mari-protected` como literales en cada elemento (lib/accessibility-css.ts), así que
un tema no puede anularlos, ni siquiera redefiniendo variables. Mientras una opción está desactivada, un tema puede configurar:

| Token                                                  | Uso                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `--mari-focus-ring-color`                              | El anillo de foco normal de la app (el valor predeterminado es `--primary`)            |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | Colores de estado y medidores cuando quieres tu propia combinación de azul y naranja |

Con el arte, otras tres opciones tienen prioridad sobre un tema:

- **Theme art strength** (Intensidad del arte del tema) (0-100%) atenúa el fondo y la superposición ambiental.
- **High contrast** (Contraste alto) también hace opacas las superficies con los colores propios del esquema (`--background`, `--card`,
  `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, el velo de página, la capa de tinte de
  Inicio, los widgets de Inicio y la placa de la barra superior) y mantiene el arte del tema al 25% o menos, para que el texto nunca quede sobre
  una imagen de tonos pastel. Los colores que un tema escribe como literales en sus propios selectores no cambian, así que
  da preferencia a los tokens.
- **Reduce motion** (Reducir movimiento) muestra las imágenes en movimiento como su primer fotograma y detiene la superposición ambiental.
  Los colores forzados (Contraste alto de Windows) ocultan el arte y los marcos `border-image`.

Usa los tokens de estado y medidores anteriores en lugar de verdes y rojos fijos, y el interruptor de colores aptos
para daltonismo también afectará a tu tema. Los enlaces para saltar contenido (`.mari-skip-link`) siguen siendo accesibles, haga lo que haga un tema.
La vista previa de importación avisa cuando un tema intenta cambiar cualquiera de estos valores.

## Seguridad

- La barra superior (incluido su estado de ocultación automática en pantalla completa), la barra lateral de chats y sus filas de chat, la
  barra lateral de Biblioteca, Ctrl+K y el cuadro de mensaje admiten cambios de estilo, pero no se pueden ocultar, mover, cubrir, atenuar,
  hacer desaparecer con filtros ni dejar sin posibilidad de hacer clic. El mecanismo de protección los mide con y sin el tema después de que
  este carga, a los 2,5 s y a los 10 s, cuando se abre un chat, cuando se abre un panel, cuando cambia el esquema
  de colores, al cambiar el tamaño y cuando empieza o termina una animación del propio tema, y desactiva el
  tema en esa pestaña si afecta al funcionamiento de alguno.
- Las imágenes cuentan (protección v3). Todo lo que se dibuja sobre una pestaña, un icono, una fila de chat o el cuadro de
  mensaje se detecta en el centro del control, tenga o no `pointer-events: none` y con cualquier tamaño, y una capa
  que lo oculta (un color, un degradado o una imagen cuyos píxeles ahí son mayormente opacos) cuenta como
  cobertura. También cuentan una extensión de `border-image` que invade un control y una `mask` de imagen sobre uno.
  Dentro de la barra superior, cada `::before` y `::after` se apila bajo las etiquetas y los iconos, y
  las máscaras, `list-style-image` y `border-image-outset` no se aplican. El fondo y la superposición
  ambiental nunca cuentan: están debajo de las barras por diseño.
- Protección v4 (ronda 4). La comprobación del contraste lee las capas detrás del texto en el orden de dibujo (un relleno de `border-image`,
  luego cada capa de fondo desde arriba, después el color), pondera cada una según la parte del
  texto que realmente cubre (tamaño, posición y repetición) y toma muestras de una imagen solo debajo del texto.
  Una línea fina o un pequeño adorno en una esquina ya no cuentan, y un velo oscuro sobre una página clara se
  interpreta como oscuro. La barra superior y el cuadro de mensaje se comprueban con más rigor: su texto debe conservar
  3:1 en el punto de menor contraste si ya lo tenía antes. Una imagen en el `::before` o
  `::after` del propio control que cubra el control cuenta como cobertura en la barra superior, las filas de chat y el
  cuadro de mensaje. Una imagen con `position: fixed` en un pseudoelemento genera una advertencia en el editor; usa
  `position: absolute`, `--mari-ambient` o `--mari-app-backdrop` en su lugar. Cuando se encuentra arte de la barra superior en
  un pseudoelemento, las pestañas y los iconos reciben sus placas como con `--mari-top-bar-bg`.
- Contraste sobre el arte: cuando hay una imagen detrás del texto, la protección lee los colores de la imagen en lugar
  de omitir la comprobación.
- Texto del chat (v1.5): la protección toma muestras de las últimas líneas del chat que aparecen en pantalla y desactiva el tema
  cuando dibuja sobre la mitad de ellas (una cobertura de pseudoelemento, una capa ambiental opaca detrás de las tarjetas o un
  marco de foco cuya extensión invade el texto). Una línea que el propio diseño del tema mueve fuera de la pantalla
  no cuenta, como tampoco una línea de nombre que el tema fija sobre la respuesta.
- El texto que un tema agrega con `content:` se muestra en la vista previa de importación.
- Reglas de texto de los temas (auditoría de seguridad, noviembre de 2026). Todas las cadenas que un tema puede dibujar se comprueban antes de
  aplicarlo, vengan de donde vengan (un archivo, el editor, Mari, una copia de seguridad, una elección por chat):
  cadenas de `content:` y `quotes`, propiedades personalizadas (así que `content: var(--x)` cuenta),
  símbolos de `@counter-style`, el marcador de posición del cuadro de mensaje, plantillas de mensaje (palabras y `title`) y
  el texto dentro de imágenes SVG. El texto que pide claves, contraseñas, inicios de sesión o datos de cuenta,
  se hace pasar por la app ("hacked", "RCE", "security alert", "verified by Marinara", "call
  support"), contiene un número de teléfono o una dirección web, o supera las 80 letras y dígitos en una
  declaración se rechaza: el tema no puede instalarse, y uno instalado no se aplica. Las letras de aspecto
  similar, los acentos, los caracteres de ancho cero, el espaciado y la escritura 1337 se normalizan primero. Las cadenas en
  selectores, `font-family` y nombres de áreas de cuadrícula no cuentan. El nombre, el autor, la descripción
  y los créditos del tema tampoco pueden pedir secretos ni afirmar que son oficiales (ahí se permiten direcciones web).
- URL: además del saneador de texto (lista de permitidos para url(), sin `@import`, data: solo para fuentes), el
  navegador analiza la hoja de estilos antes de aplicarla, y cualquier dirección distinta de las imágenes
  propias del tema, las imágenes y fuentes data: integradas, `#fragments` y `about:invalid` hace que se rechace el
  tema. `src()` sigue las reglas de url(), y se descarta un `image-set(` que quede abierto al final.
- Los colores sugeridos en un archivo de tema (`settings.accent`, `background` y sus equivalentes claros) deben ser
  colores simples o degradados: sin `url()`, `image-set()` ni nada que escape del valor.
- Las imágenes SVG se reconstruyen a partir de una lista de permitidos antes de usarse: sin `<script>`, `<foreignObject>`, `<a>`,
  atributos de eventos, enlaces externos, `<?xml-stylesheet?>` ni entidades DOCTYPE, y su CSS se
  limpia igual que el de un tema. Se rechazan las imágenes rasterizadas que al decodificarse superarían los 8192 px por lado o los 40 megapíxeles
  de resolución.
- Los tokens climáticos se leen mediante una lista de permitidos: nombres de token conocidos, números limitados a sus rangos,
  palabras de listas fijas y colores simples (sin `url()`, degradados ni funciones aparte de las de color).
  Las imágenes climáticas deben ser las propias del tema (las direcciones del mismo origen que la app creó para
  ellas, tras la reconstrucción del SVG y el límite de tamaño); cualquier otra dirección se ignora. Nada de lo que escribe un tema
  se ejecuta, y el destello del relámpago conserva la intensidad y el ritmo de la app.
- Las plantillas de mensaje no pueden usar roles que creen un diálogo, menú o anuncio, ni los atributos
  `data-` o los nombres de clase `mari-`/`ov-` de la propia app.
- Probar un tema ("¿Conservar este tema?") ocurre solo en esa pestaña: los demás dispositivos lo reciben únicamente después de
  Conservar. No responder significa volver atrás; pasar el cursor sobre la barra o darle el foco pausa la cuenta regresiva. Escape tres
  veces desactiva los temas personalizados en la pestaña; un Escape que cierra Ctrl+K, un menú o un diálogo que
  muestra la app no cuenta.

## Cambios

- **Miniaturas en teléfonos, animaciones más tranquilas** (del 12 al 14 de noviembre de 2026, el contrato sigue en la versión 1):
  `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` y `--mari-phone-convo-avatar` para la
  imagen pequeña junto al nombre en teléfonos; `--mari-chat-row-preview` agrega la línea más reciente de cada chat en la
  lista de Chats; una transición puede esperar como máximo un segundo; la capa ambiental y las animaciones infinitas
  permanecen inmóviles cuando nadie puede verlas; [Mantener rápido un tema](#keeping-a-theme-fast).

- **Texto de acento legible y punto de extensión de la barra dividida** (11 de noviembre de 2026, el contrato sigue en la versión 1): el
  acento usado como texto pequeño se oscurece un poco en Claro y se aclara un poco en Oscuro para que las etiquetas sean legibles,
  mientras los botones conservan el acento completo; `--mari-accent-text` te permite definir ese color de texto.
  `[data-mari-part="top-bar"]` es la barra superior en todos los dispositivos, y el segundo lado de la vista dividida tiene su
  propia barra con los mismos puntos de extensión `[data-component="TopBar"]` (más `[data-split-bar]`), para que le lleguen
  el arte de la barra superior, las fuentes y los colores de pestañas del tema. `--mari-game-combat-bg` y `-bg-hover` son un
  `background` completo, así que admiten degradados.

- **Punto de extensión de la superficie de página** (10 de noviembre de 2026, el contrato sigue en la versión 1): `[data-mari-part="page"]`
  es la única superficie donde se apoyan todas las páginas de Biblioteca, los editores, Ajustes y Documentación, para que un tema pueda darles
  el mismo panel a todas.

- **Galería de temas y rayos** (9 de noviembre de 2026, el contrato sigue en la versión 1): los temas iniciales
  se descargan bajo demanda de la galería de temas; `--mari-weather-lightning-bolt` (`on`, `none` o un ancho
  de 0,5 a 3) dibuja un rayo ramificado por un lado de la pantalla con cada destello de tormenta.

- **Clima de los temas** (noviembre de 2026, el contrato sigue en la versión 1): tokens `--mari-weather-*` (estilo de
  píxeles, colores, imágenes, tamaño, velocidad, cantidad, intensidad, tinte, sol y luna desactivados),
  `data-mari-weather` y `data-mari-sky` en `<html>`, y el clima se pausa bajo paneles que lo cubren.
  Petal OS, NEON//GRID y Lantern Path los usan.

- **Ronda 6 y auditoría de seguridad** (noviembre de 2026, sin tokens nuevos, el contrato sigue en la versión 1): los
  temas iniciales son de solo lectura y **Clone + Edit** crea una copia editable (desde el 9 de noviembre se
  descargan bajo demanda de la galería de temas en lugar de incluirse en la instalación); los créditos,
  la licencia y las etiquetas aparecen en la vista previa de importación y detrás del botón (i); la prueba de un tema ocurre
  solo en esa pestaña hasta pulsar **Keep theme**; las reglas de texto del tema, la comprobación de URL, la reconstrucción de SVG y la comprobación
  de colores sugeridos se describen en [Seguridad](#safety).

- **v1.5** (ronda 5 de temas, respuestas largas): `--mari-chat-column`, `--mari-message-measure`,
  `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, nombre de quien habla fijado,
  `--mari-phone-avatar`, partes y degradado del cuadro de texto de novela visual, `--mari-message-actions`,
  `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`,
  `--mari-focus-frame-outset`, `--mari-scrim` y `--mari-center-x`; partes de diálogo, separación entre párrafos,
  arte de tarjetas y arte de filas de chat, y marcadores de posición de avatar en todas partes; títulos de ventana en narración,
  Ctrl+K, ventanas y diálogos; el acento de los controles de la interfaz llega a los del ámbito raíz; la protección comprueba el texto del chat;
  créditos, licencia y etiquetas del tema, con el texto OFL incluido; las imágenes grandes se reducen al importar.

- **v1.4** (ronda 4 de temas): protección v4 (fondos en capas, área dibujada, barra superior y
  cuadro de mensaje estrictos, coberturas de pseudoelementos); `fontSize` y `reduceMotion` en archivos de tema y la
  vista previa de importación marca los ajustes sugeridos; tokens para horas de mensajes, capa de tinte del modo Roleplay, acento de los controles
  de la interfaz y texto atenuado, colores de Biblioteca y Ctrl+K, Combate, avisos emergentes, puntos de lorebook, accesos directos de Inicio,
  un mínimo de tamaño de texto y el avatar del usuario; `--mari-top-bar-height` y `--mari-top-bar-plate-active`;
  partes de hora, encabezado del chat, HUD del juego, herramientas del juego, marcador de posición del avatar y resplandor de widgets de Inicio; espacios de marco
  de foco, título de ventana, ambiente detrás de las tarjetas y máscara de márgenes.

- **v1.3** (ronda 3 de temas, imágenes): `images` en el archivo de tema y `url("theme:name")`; el
  límite de CSS cuenta solo el texto CSS; WebP al importar; fondo en su propia capa; `--mari-page-veil`
  se mantiene sobre un fondo; se conservan las propiedades abreviadas `!important` con `var()`; superposición ambiental; iconos
  y cursor con imágenes; `--mari-home-wash`, `--mari-home-art` y más tokens de widgets de Inicio; puntos de extensión del diálogo de novela visual, del espacio
  para sprites de novela visual y de la narración del modo Game; los archivos de tema pueden sugerir Seguir la hora del día; protección v3.

- **v1.2**: espacio para plantilla de mensaje (`templates` en el archivo de tema, `[data-mari-part="message-extra"]`),
  que el usuario autoriza con "Permitir temas con HTML".

- **v1.1**: puntos de extensión de mensajes en todos los modos de chat con personaje, índice y tiempo de generación; partes de avatar,
  encabezado, acciones y razonamiento; `--mari-composer-placeholder`; fondo v2 (tamaño, posición,
  repetición, pixelado, capas) que también aparece detrás de los chats; `--mari-page-veil`; `--mari-top-bar-bg`;
  `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule`;
  tokens de widgets de Inicio, con Professor Mari como un `home-widget`. `--mari-stage-empty-bg` ahora es un
  `background` (admite degradados).
- **v1.0.1**: protección v2, valores de Accesibilidad protegidos, comprobaciones del texto agregado. La instalación es de todo o nada,
  se instalan los fondos incluidos, Volver también restaura los ajustes aplicados por un tema, las fuentes del tema aparecen
  en la lista Fuente, se conservan las referencias `url(#id)` y los nombres de las fuentes incluidas se leen de la fuente.
- **v1** (primer contrato publicado): tokens de tema, puntos de extensión de partes, fondo y efectos de acento anteriores.
