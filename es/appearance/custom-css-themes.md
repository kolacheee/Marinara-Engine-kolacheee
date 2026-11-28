# Temas de CSS personalizado

Un tema cambia todo el aspecto de Marinara: los colores, las fuentes, las imágenes y la forma de los paneles. Marinara tiene una galería de temas iniciales listos para usar que puedes descargar. También puedes importar un tema que alguien haya compartido o crear el tuyo.

Para hacer un cambio rápido sin usar ningún tema, consulta [Ajustes de apariencia](appearance-settings.md) o [Estilos de ventanas de chat listos para usar](#ready-made-chat-window-styles). Para crear tu propio tema, la [Guía para autores de temas](theme-author-guide.md) te lleva paso a paso por el proceso.

## Qué es un tema personalizado

Un tema es un bloque de CSS, el código que usan las páginas web para los colores, las fuentes y el espaciado, además de cualquier imagen o fuente que incluya. Los temas se guardan en tu servidor de Marinara, así que un tema que instales aparece en todos los dispositivos que se conecten a él. Solo puede haber un tema activado a la vez, y puedes conservar tantos como quieras.

## Dónde encontrar los temas

Abre **Library → Settings → Appearance** (Biblioteca → Configuración → Apariencia) y haz clic en **CSS Themes** (Temas CSS) en la fila de secciones. En el diseño clásico, la ruta es **Settings → Addons → Theme Library** (Configuración → Complementos → Biblioteca de temas).

La sección contiene:

- **Create Theme** (Crear tema) e **Import File** (Importar archivo) en la parte superior.
- **Allow themes with HTML (I accept the risk)** (Permitir temas con HTML [acepto el riesgo]), desactivado de forma predeterminada. Consulta [Temas con HTML](#themes-with-html).
- **Installed Themes** (Temas instalados): **Default Theme** (Tema predeterminado), luego tus propios temas y después los temas iniciales que hayas descargado.
- **Browse the theme gallery** (Explorar la galería de temas): los temas iniciales que puedes descargar.

## Temas iniciales

Los temas iniciales no forman parte de la instalación, así que no ocupan espacio hasta que quieras uno. Se encuentran en la galería de temas, y Marinara solo descarga un tema cuando lo eliges.

1. Haz clic en **Browse the theme gallery** debajo de **Installed Themes**. Marinara necesita una conexión a Internet para hacerlo.
2. Cada tema muestra una vista previa, una descripción breve, su tamaño y sus etiquetas.
3. Haz clic en **Download** (Descargar) junto a los que te gusten. Aparecen bajo **Starter themes** (Temas iniciales) en **Installed Themes**, listos para activarse.

| Tema | Aspecto |
| --- | --- |
| **Apogee Lounge** | La sala de observación de un transatlántico espacial de la década de 1970, con un gigante gaseoso tras la ventana y mensajes sobre paneles moldeados. |
| **Crepuscular** | Un almanaque del mar nocturno: figuras encapuchadas montan guardia en un acantilado bajo una luna vigilante (están comiendo tortitas), con los mensajes en una sola columna de libro mayor pautada. |
| **Dewglass** | Cristal brillante de los años 2000: los mensajes son gotas de gel sobre una laguna soleada o una noche de auroras. |
| **Granite Watch** | Un puesto de mando de la Guerra Fría bajo la montaña: las respuestas se imprimen como papel de teletipo y los widgets cuelgan de portapapeles. |
| **Gutterlight** | Una ciudad gótica lluviosa dibujada como un cómic policiaco, con viñetas entintadas y cuadros de texto. |
| **Lantern Meadow** | Tranquilo y muy legible, sin movimiento. |
| **Lantern Path** | Una columna de lectura con movimiento suave. |
| **Maple's Bramble Cottage** | Una cabaña acogedora, con una columna de lectura para respuestas largas. |
| **MARI to the Moon** | Una terminal de trading: cada respuesta es una orden de compra, la barra superior muestra una cinta de cotizaciones y la lista de chats es una lista de seguimiento. |
| **NEON//GRID** | Ciberpunk de neón, diseñado para respuestas largas. |
| **Petal OS** | Un escritorio retro y divertido con fuentes pixeladas. |
| **Quiet Iris** | Una inteligencia de nave serena: instrumentos de grafito mate, una sola lente rojo ámbar y cada chat acoplado a una única columna iluminada. |
| **Rosalind's Folio** | Un diseño de cuento con toques de novela visual. |
| **Sanguine Keep** | Un castillo gótico a la luz de la luna: terciopelo carmesí y dorados de noche, mármol pálido de día, con retratos en ventanas ojivales y mensajes en paneles de relicario. |
| **Swiss Poster** | Un diseño de cartel sobrio y limpio, sin movimiento. |
| **Under Sail** | La cubierta de un velero en el mar: cada mensaje es una vela de lona colgada de una verga de madera. |
| **Velvet Casket** | Gótico pastel de día y gótico tradicional de noche, con mensajes en forma de ataúd. |

Cada tema inicial tiene una versión Dark y otra Light. Las pequeñas etiquetas bajo cada nombre, como **No motion** (Sin movimiento) o **High legibility** (Alta legibilidad), te indican qué puedes esperar.

Cuando la galería tiene una versión más reciente de un tema que descargaste, el tema muestra **Update** (Actualizar) en la lista de la galería. Haz clic para obtener la versión nueva.

Los temas iniciales descargados son de solo lectura, por lo que siempre se mantienen tal como fueron creados. Cada uno tiene cuatro botones:

- **(i) Credits and licences** (Créditos y licencias): quién creó el arte y las fuentes, y cómo puedes reutilizarlos.
- **Clone + Edit** (Clonar y editar, el icono de copia): crea tu propia copia, como "Petal OS (my copy)", y la abre en el editor.
- **Export** (Exportar, el icono de subir): guarda el tema como archivo.
- **Remove** (Quitar, el icono de papelera): quita el tema de esta instalación. Puedes volver a descargarlo de la galería en cualquier momento.

También puedes obtener los archivos de los temas sin usar la app: están en la carpeta `themes` de la galería de temas en GitHub ([rama kolacheee-themes](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)). Descarga allí un archivo `.json` y usa **Import File**.

## Activar un tema

1. Haz clic en el nombre de un tema en **Installed Themes**. El tema se activa en esta pestaña del navegador.
2. Una barra pregunta **Keep this theme?** (¿Conservar este tema?) y hace una cuenta regresiva de 15 segundos. Al colocar el puntero sobre la barra, la cuenta se pausa.
3. Haz clic en **Keep theme** (Conservar el tema) para conservarlo. Ahora también aparece en tus otros dispositivos. Haz clic en **Go back** (Volver), o deja que termine la cuenta regresiva, para volver a tu aspecto anterior.

Haz clic en **Default Theme** para desactivar los temas personalizados. **Reset Appearance** (Restablecer apariencia), en la parte superior de **Settings → Appearance → Theme** (Configuración → Apariencia → Tema), también desactiva el tema.

Para usar un tema distinto solo en un dispositivo, primero establece **Look on this device** (Aspecto en este dispositivo) en **Only this device** (Solo este dispositivo) dentro de **Settings → Appearance → Theme**.

### Recuperar tu aspecto normal

Si un tema dificulta el uso de Marinara, cualquiera de estas opciones lo desactiva en esa pestaña:

- Pulsa <kbd>Esc</kbd> tres veces.
- Agrega `?safe` al final de la dirección en tu navegador.
- Pulsa <kbd>Ctrl</kbd>+<kbd>K</kbd> y escribe "Custom theme".

Marinara también protege la barra superior, las barras laterales, <kbd>Ctrl</kbd>+<kbd>K</kbd> y el cuadro de mensajes. Un tema puede cambiar su estilo, pero si oculta, mueve o cubre alguno de ellos, Marinara desactiva el tema en esa pestaña y te explica por qué.

## Importar un tema

1. Haz clic en **Import File**.
2. Elige un archivo de tema `.json` o `.css`.
3. Una vista previa muestra el nombre, el autor, la versión, las imágenes y el tamaño del tema, además de sus créditos y licencia. Enumera todo lo que debas saber antes de instalarlo, como imágenes en movimiento, texto agregado por el tema o partes que no funcionarán.
4. Elige qué elementos incluir. La vista previa ofrece los ajustes sugeridos por el tema, como su esquema de colores, color de acento y fuente, con la mayoría marcados. También puede agregar los fondos del tema a tu galería de fondos del chat.
5. Haz clic en **Install and try it** (Instalar y probar) para activarlo de inmediato, o en **Install** (Instalar) para agregarlo a la lista.

Si ya tienes un tema con el mismo nombre, la vista previa ofrece actualizarlo o **Keep both** (Conservar ambos). Cuando vuelves de un tema que estabas probando, Marinara también restaura todos los ajustes que haya cambiado.

No se puede instalar un tema si escribe texto que pide contraseñas o claves, o si se hace pasar por Marinara. Nunca escribas una clave o contraseña porque un tema la pida.

### Temas con HTML

Algunos temas agregan un pequeño cuadro HTML a cada mensaje, llamado plantilla de mensajes. Marinara elimina scripts, enlaces, imágenes y formularios, pero el HTML de otra persona todavía podría engañarte. Estos temas solo se instalan mientras **Allow themes with HTML (I accept the risk)** está activado. Con el interruptor desactivado, un tema instalado se muestra sin su HTML.

## Crear un tema

Haz clic en **Create Theme**, o en **Clone + Edit** sobre un tema inicial para partir de algo que ya se vea bien. El editor tiene un cuadro para el nombre, un cuadro grande para el CSS, **Preview** (Vista previa) y **Save** (Guardar). Un tema nuevo se activa cuando lo guardas y pregunta **Keep this theme?**

La [Guía para autores de temas](theme-author-guide.md#your-first-theme-step-by-step) contiene un recorrido paso a paso para crear tu primer tema.

### Crear un tema con Professor Mari

No tienes que escribir el CSS tú. Pídeselo a Professor Mari con palabras sencillas, como "hazme un tema otoñal acogedor que funcione en mi teléfono" o "¿qué falla en mi tema Harbor?". Tiene un manual para diseñar y revisar temas, y lo sigue:

1. **Primero acuerda la idea contigo.** Te pregunta por el ambiente, Light o Dark (o ambos), tus dispositivos y si quieres imágenes y clima; luego resume un aspecto en una frase, como "cápsulas de vidrio esmerilado sobre un fondo marino".
2. **Lo crea desactivado.** Te dice dónde probarlo: elígelo en **CSS Themes** y haz clic en **Keep theme** antes de que pasen 15 segundos. Si le pides que lo active ella misma, tu pestaña pregunta **Keep this theme?** de la misma manera, y vuelve al estado anterior si nadie responde.
3. **Te pide que lo mires.** Mari no puede ver tu pantalla, así que indica puntos concretos que revisar, en Light y Dark, y pide una captura de cualquier cosa que se vea mal. Si Marinara desactivó el tema, dile el mensaje: indica el motivo, y ella lo corrige.
4. **Puede crear sus imágenes.** Con un modelo de imágenes configurado en Connections, crea fondos, marcos e iconos, te muestra cada uno primero y lo guarda en el tema cuando le dices que sí. También puede cambiar los colores de los adornos dibujados (imágenes SVG) de un tema. Consulta [Pedirle a Professor Mari que cree el arte](theme-author-guide.md#ask-professor-mari-to-make-the-art).

Para revisar un tema, enumera lo que no encaja (formas de esquinas mezcladas, sombras, etiquetas difíciles de leer), pantalla por pantalla, y no cambia nada hasta que le digas qué corregir.

Mari solo trabaja en tus propios temas. Los temas iniciales son de solo lectura, así que haz clic primero en **Clone + Edit** en uno y pídele que trabaje en la copia. Las fuentes, los créditos y las miniaturas los añades tú en **Pictures and sharing details**.

## Editar, exportar y quitar tus temas

Tus propios temas tienen tres botones en su fila:

- **Edit theme CSS** (Editar el CSS del tema, el icono de código) abre el editor. Editar no cambia qué tema está activado.
- **Export** (el icono de subir) descarga un archivo `.json` que puedes compartir o importar en otro lugar.
- **Remove** (el icono de papelera) elimina el tema después de que lo confirmes. Esta acción no se puede deshacer, así que expórtalo primero si tal vez quieras recuperarlo más adelante.

## Un tema para un solo chat

Un chat puede tener su propio tema:

1. Abre el chat y luego **Chat Settings** (Ajustes del chat).
2. En **Theme** (Tema), elige un tema. **Follow the app** (Seguir la app) usa el tema de tu app, y **Default look (no custom theme)** (Aspecto predeterminado [sin tema personalizado]) desactiva los temas para ese chat.
3. En un chat con un solo personaje, marca **Use it for every chat with this character** (Usarlo en todos los chats con este personaje) para convertirlo en el tema de ese personaje.

Configuración y Biblioteca siempre usan el tema de la app.

## Quién puede cambiar los temas

En la computadora que ejecuta Marinara no hace falta ningún secreto. Desde otro dispositivo, como un teléfono, para crear, importar, clonar, editar y quitar temas se necesita el secreto de administrador. Ingrésalo en **Settings → Advanced → Security** (Configuración → Avanzado → Seguridad). Para elegir un tema que alguien ya haya instalado no hace falta ningún secreto. Consulta [El secreto de administrador](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions).

## Estilos de ventanas de chat listos para usar

Antes de empezar: esto no necesita CSS.

1. Abre **Settings → Appearance → Chat Buttons & Windows** (Configuración → Apariencia → Botones y ventanas del chat).
2. En **Chat widget style** (Estilo de widgets del chat), elige un estilo.

| Estilo | Aspecto |
| --- | --- |
| **Default** | El aspecto original. |
| **Dottore** | Marcos de instrumentos en azul hielo, bordes de metal claro y esquinas recortadas. |
| **Prof. Mari** | Marcos de cuento con ribetes dorados, azules de piedras preciosas y Protogemas en los títulos de las ventanas. Sus botones usan el mismo fondo que sus ventanas. |

Cada estilo tiene su propia fuente, funciona en modo claro y oscuro y da estilo a la vez a los botones, las ventanas y las secciones desplegables. Elegir un estilo restablece **Font**, **Shape** y los tres colores. Las posiciones de tus ventanas se mantienen.

Puedes cambiar estos por separado:

- **Font** y **Shape** siguen el estilo (**Preset font**, **Preset shape**) hasta que elijas otra.
- **Border & Buttons Color** cambia los contornos y los iconos de los botones. Los iconos usan el primer color de un degradado.
- **Background Color** rellena los botones, las ventanas, las secciones desplegables y los campos editables.
- **Text Color** cambia el texto de los widgets. Los degradados aparecen en títulos y etiquetas, y los campos editables usan el primer color.

Cada color tiene un selector de color para un color sólido y una opción de degradado. **Reset color**, junto a un control, vuelve a seguir los colores claros u oscuros del estilo. Los emblemas decorativos conservan sus colores originales.

### Llevar el estilo al chat

Tres interruptores debajo de los selectores de color extienden el estilo. Cada uno empieza desactivado y funciona por su cuenta. Desactivar uno restaura el estilo habitual del chat en esa parte, y elegir otro estilo conserva tus elecciones de los interruptores.

| Interruptor | Qué aplica |
| --- | --- |
| **Apply preset font** (Aplicar fuente del preset) | La fuente de los widgets, para los mensajes, los campos de entrada y los controles del chat. |
| **Apply preset shape** (Aplicar forma del preset) | La forma del marco, para los mensajes de Roleplay (clásico y novela visual), el cuadro de diálogo de Game, los campos de entrada y los controles. Los mensajes de Conversation conservan su propia forma. |
| **Apply preset colors** (Aplicar colores del preset) | Los colores del borde, el fondo y el texto en esas áreas, incluidos los mensajes de Conversation. También se aplican tus colores y degradados personalizados. El diálogo entrecomillado conserva el Dialogue Highlight Color propio de cada personaje o persona. Un mensaje hecho de HTML, como la tarjeta con estilo de un agente, conserva los colores de texto que fija por sí mismo. |

Los botones del historial —**Load More** (Cargar más), **Show older** (Mostrar anteriores)— siguen los interruptores igual que los demás controles del chat. En Game Mode también se aplican a los comentarios al margen, los widgets del HUD, el panel del mapa, las fichas de personaje, los registros, el inventario, los paneles de combate y los cuadros de diálogo. Professor Mari también puede crear temas personalizados para estas áreas.

Un tema personalizado puede seguir anulando los estilos. Las variables de ventanas y secciones de [Dar estilo a ventanas y secciones del chat](#styling-chat-windows-and-drawers) tienen prioridad sobre los colores del estilo. Usa `--mari-window-font-family` para las letras de las ventanas, `--mari-drawer-radius` para las esquinas de las secciones y `--mari-window-ornament: none` para ocultar el adorno del título. Para quitar toda la decoración del estilo, elige primero **Default**.

## Para autores de temas

El resto de esta guía es material de referencia para quienes escriben el CSS de los temas a mano. Empieza por la [Guía para autores de temas](theme-author-guide.md), que enumera cada token estable, hook de partes y regla de seguridad.

## Temas y Card CSS

Marinara tiene dos formas de agregar CSS personalizado, y ambas pueden estar activas a la vez.

- Un tema personalizado vuelve a pintar toda la app. Puede sobrescribir las variables base de Marinara, usar `!important` y usar `position: fixed`.
- Card CSS va incrustado en una tarjeta de personaje o de persona y se activa por chat. Se limpia de forma más estricta: no puede sobrescribir las variables base, se elimina `!important` y `position: fixed` se convierte en `position: absolute`. Da estilo a los mensajes del chat, no a toda la app. Consulta la [Card CSS Theming Guide](card-css-theming.md).

## Límites de tamaño y nombre

El nombre de un tema puede tener hasta 200 caracteres. El CSS puede tener hasta 256 KiB, medido en bytes UTF-8. Un tema más grande se rechaza cuando lo guardas o lo importas. El CSS de un tema personalizado también se limpia antes de ejecutarse: los estilos que cargan un archivo desde otro sitio web no funcionan. En su lugar, incrusta la imagen o la fuente como una URI `data:`.

## La referencia de variables de CSS

El editor de temas tiene una sección plegable **CSS Variable Reference**. Haz clic en ella para ver las variables más útiles que puedes sobrescribir. Un tema cambia la app al definir estas variables en un bloque `:root`. La referencia enumera estas variables:

| Variable | Qué controla |
| --- | --- |
| `--background` | Fondo de la página |
| `--foreground` | Texto principal |
| `--primary` | Acento y botones |
| `--primary-foreground` | Texto sobre el color primario |
| `--secondary` | Tarjetas y campos de entrada |
| `--card` | Fondo de las tarjetas |
| `--border` | Bordes |
| `--muted-foreground` | Texto atenuado |
| `--sidebar` | Fondo de la barra lateral |
| `--sidebar-border` | Borde de la barra lateral |
| `--marinara-shell-edge-border` | Borde del margen izquierdo y derecho |
| `--destructive` | Error y eliminación |
| `--popover` | Fondo del menú desplegable |
| `--accent` | Resaltados al pasar el cursor |

Un tema puede definir cualquier variable de CSS que use Marinara, no solo estas. Algunos efectos tienen sus propias variables. Por ejemplo, `--marinara-theme-accent-pulse: enabled` solicita la animación de pulso del acento.

## Dar estilo a ventanas y secciones del chat

En una computadora, **Chat Settings** se abre como ventana móvil. Sus secciones plegables se llaman **drawers**. Una sección puede salir a su propia ventana y luego minimizarse a un botón pequeño que puedes mover, llamado **bubble**.

Otras herramientas del chat también usan estas ventanas y botones, como Game controls, Session, Volume, Game Assets, los chats conectados y los controles de paquetes. En un teléfono, la mayoría de las ventanas se abren como paneles de ancho completo; Echo Chamber sigue siendo una ventana compacta que puedes mover y redimensionar. Las herramientas que sacas de Chat Settings aparecen en el menú móvil de tres puntos **Chat tools** (Herramientas del chat); los botones de los trackers siguen separados.

Las clases, los atributos de datos y las variables siguientes permiten dar estilo a estas partes juntas. Las reglas del tema reemplazan los valores predeterminados sin `!important`.

### Clases

| Parte | Clase |
| --- | --- |
| Ventana | `.mari-window` |
| Barra de título | `.mari-window__header` |
| Título y su icono | `.mari-window__title-row` |
| Título | `.mari-window__title` |
| Botones de la barra de título (Reset View, estrella de diseño favorito, Tracker Panel, fijar, bloquear, cerrar, Put back) | `.mari-window__controls` (cada botón es `.mari-window__control`) |
| Contenido de la ventana | `.mari-window__body` |
| Bordes y esquinas para redimensionar | `.mari-window__resize-handle` |
| Marca de esquina visible al tener el puntero o el foco en una ventana | `.mari-window__resize-grip` |
| Sección plegable | `.mari-drawer` |
| Encabezado y título de la sección | `.mari-drawer__header`, `.mari-drawer__title` |
| Icono, contador y **?** de la sección | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| Vista previa de una sección contraída (widget pequeño del tracker) | `.mari-drawer__summary` |
| Botones junto a la flecha y botón para sacar la sección | `.mari-drawer__actions`, `.mari-drawer__popout` |
| Flecha y contenido de la sección | `.mari-drawer__arrow`, `.mari-drawer__body` |
| Vista previa que sigue al puntero al arrastrar una sección hacia fuera | `.mari-drawer-ghost` |
| Botón de una ventana minimizada (burbuja) | `.mari-window-bubble` |
| Resumen en vivo que muestra una burbuja en lugar de su icono (el banner de World State) | `.mari-window-bubble__banner` |
| Línea que aparece al alinear una burbuja con otra al arrastrarla | `.mari-window-snap-guide` |
| Punto que aparece mientras trabajan los agentes (botón Chat Settings, ventana Trackers) | `.mari-agents-running-dot` |

### Atributos de datos

- `data-window` identifica una ventana y su burbuja: `chat-settings`, `trackers`, las ventanas de controles `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` y `control:beholder:<package>`, y `drawer:<window>:<drawer>` para una sección separada, por ejemplo `drawer:chat-settings:chat-name`.
- `data-drawer` identifica una sección, por ejemplo `chat-name`. Algunos nombres empiezan con el modo del chat, como `roleplay-agents` o `conversation-agents`. Los trackers usan `tracker-world`, `tracker-persona`, `tracker-characters`, `tracker-quests`, `tracker-inventory`, `tracker-custom` y `agent-activity`.
- `data-presentation` es `"window"` en una ventana de computadora o `"sheet"` en un panel de teléfono.
- `data-pinned` y `data-locked` valen `"true"` mientras la ventana está fijada o bloqueada.
- `data-window-control` identifica cada botón de la barra de título: `"pin"`, `"lock"`, `"close"` o `"put-back"`. Un botón de fijar o bloquear pulsado también tiene `aria-pressed="true"`.
- `data-chat-settings-control` identifica los botones adicionales de la barra de título de Chat Settings: `"reset-view"`, `"favorite-layout"` y `"tracker-panel"`. La estrella favorita tiene `aria-pressed="true"` y un icono relleno cuando el diseño actual coincide con el favorito guardado.
- `data-edge` vale `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"` o `"sw"` en cada tirador de redimensionado.
- El botón de una sección abierta dentro de `.mari-drawer__header` tiene `aria-expanded="true"`.
- `data-drawer-control="pop-out"` marca el botón para sacar una sección.
- `data-outside="true"` marca una vista previa de arrastre lo bastante alejada de su ventana como para separarse al soltarla.
- `data-axis` es `"x"` en una guía de alineación vertical y `"y"` en una horizontal.
- `data-detached` vale `"true"` cuando una sección se muestra en su propia ventana, tanto en esa ventana como en la sección interior. Esa ventana se identifica con `data-window="drawer:<window>:<drawer>"`, por ejemplo `data-window="drawer:chat-settings:chat-name"`, y `data-drawer-host` indica la ventana de origen.
- `data-dragging` vale `"true"` en una sección mientras se arrastra su título, y `data-drop-target` vale `"true"` en una ventana cuando se sostiene sobre ella una sección separada lista para volver.
- Una burbuja tiene el `data-window` de su ventana y `data-minimized="true"`, por ejemplo `.mari-window-bubble[data-window="control:volume"]`. Las ventanas de controles se llaman `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` y `control:beholder:<package>`. `data-dragging` vale `"true"` en una burbuja mientras se arrastra. Una burbuja que muestra un resumen en vivo en lugar de su icono, como un tracker World State minimizado, tiene `data-banner="true"` y se ensancha hasta el ancho del resumen.
- Una burbuja bloqueada tiene `data-locked="true"`, incluido el botón Chat Settings. Sigue abriendo su ventana, pero no se puede mover hasta desbloquearla. Usa `.mari-window-bubble[data-locked="true"]` para dar a estos botones un aspecto distinto.
- En un teléfono, las ventanas tienen `data-presentation="sheet"`, al igual que sus burbujas, que son algo mayores. La burbuja de Tracker Panel es `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`.
- El botón Chat Settings también es una burbuja: `.mari-window-bubble[data-chat-settings-button]`, con `data-open="true"` mientras Chat Settings está abierto.
- Una sección separada se reduce a una burbuja con `data-drawer-host` (su ventana de origen), y el botón **Put back** de su ventana es `[data-window-control="put-back"]`.

### Variables

Cada variable usa los colores compartidos de los controles del chat si no la defines, así que el tema solo necesita las que quieras cambiar.

| Variable | Qué controla |
| --- | --- |
| `--mari-window-bg` | Fondo de ventana |
| `--mari-window-text` | Texto de ventana |
| `--mari-window-border`, `--mari-window-border-width` | Borde de ventana |
| `--mari-window-radius` | Redondeo de esquinas |
| `--mari-window-shadow` | Sombra de ventana |
| `--mari-window-backdrop-filter` | Desenfoque detrás de la ventana |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | Colores de la barra de título |
| `--mari-window-header-padding` | Espaciado de la barra de título |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | Botones de título, incluida la estrella favorita |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | Botones de título activos, incluidos fijar, bloquear y estrella favorita rellena |
| `--mari-window-control-radius`, `--mari-window-control-gap` | Redondeo y espaciado de botones |
| `--mari-window-focus-ring` | Contorno del foco de teclado y de la ventana a la que volverá una sección |
| `--mari-window-resize-handle-size` | Ancho de bordes de redimensionado |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | Tamaño, redondeo y sombra de burbujas |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | Fondo y borde de burbujas |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | Color del icono de burbuja |
| `--mari-window-snap-guide` | Color de la guía de alineación |
| `--mari-drawer-bg`, `--mari-drawer-border` | Fondo y separador de sección |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | Colores del encabezado de sección |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | Espaciado de sección |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | Texto e iconos del encabezado |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | Contador de la sección |

Define una variable en `:root` para cambiar todas las ventanas, o en un selector para cambiar una:

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## Dar estilo a mensajes, campos de entrada y controles del chat

Los tres interruptores **Apply preset** también permiten que un tema personalizado use el diseño de los widgets en el resto del chat. Un tema puede sustituir cada parte con las variables siguientes. Pide a Professor Mari un tema de chat a juego si prefieres no escribir el CSS tú mismo.

| Parte | Clase |
| --- | --- |
| Cuadros de mensajes de Roleplay y Game, comentarios al margen de Game, widgets del HUD, panel del mapa y fichas de personaje, y campos de entrada del chat | `.mari-chat-style-surface` |
| Registros, inventario, paneles de combate, elecciones y cuadros de diálogo de Game; los paneles también tienen `data-game-section` con su nombre, como `logs`, `inventory` o `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| Contenido de Game dentro de una ventana, como el Journal, que sigue los colores de la ventana | `.mari-game-section` |
| Mensajes de Conversation (solo fuente y colores) | `.mari-chat-style-conversation` |
| Texto de mensajes de Conversation sin recuadro | `.mari-chat-style-text` |
| Controles del chat, incluidos Calls y los controles de grupo de Conversation | `.mari-chat-style-control` |
| Botones del historial: **Load More**, **Show older**, **Show newer**, **Latest** y, en los registros de Game, **Older**, **All** y **Show more older logs**. También tienen `.mari-chat-style-control` | `.mari-chat-history-pager` |
| Un mensaje hecho de HTML, como la tarjeta con estilo de un agente. Los colores de texto fijados dentro de él se conservan cuando **Apply preset colors** está activado | `.mari-html-content` |

| Variable | Qué controla |
| --- | --- |
| `--mari-chat-font-family` | Fuente de las áreas correspondientes del chat |
| `--mari-chat-bg` | Fondo del recuadro; acepta un color o degradado |
| `--mari-chat-text` | Color sólido legible del texto |
| `--mari-chat-border` | Contorno del recuadro; acepta un color o degradado |
| `--mari-chat-border-color` | Color sólido de respaldo para el borde |
| `--mari-chat-radius` | Redondeado del recuadro, salvo en los mensajes de Conversation |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | Fondos de los botones del chat |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | Color de los iconos y redondeado de los botones del chat |
| `--mari-chat-input-bg` | Fondo dentro de los campos editables |

Por ejemplo, con **Apply preset font** y **Apply preset colors** activados:

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

Las variables sin definir siguen los ajustes y el preset de los widgets. El interruptor correspondiente debe estar activado para que estas variables se apliquen mediante el estilo integrado. Los mensajes de Conversation conservan su propia forma incluso con **Apply preset shape** activado. Los temas personalizados también pueden apuntar directamente a las clases; mantén los contornos de foco, los menús y el contenido de los mensajes fuera de cualquier recorte decorativo.

En los teléfonos, el menú de tres puntos se despliega en botones redondos. Su activador es `[data-chat-tools-menu-button]`, la columna abierta es `[data-chat-tools-menu]` y cada elemento de la lista tiene `data-chat-tools-menu-item` con el ID de su ventana. Los botones de herramientas usan `.mari-window-bubble.mari-chat-tools-button` y `data-chat-tools-menu-tool` con ese mismo ID. La columna no tiene marco de ventana; sus botones siguen los colores de los widgets y el tamaño de los botones, independientemente de los tres interruptores para el resto del chat, y conservan su forma redonda.

<a id="styling-character-sheets"></a>
## Dar estilo a las hojas de personaje

La hoja de un conjunto de reglas se ve igual en Roleplay y Game. Estas clases y atributos permiten darle estilo desde un tema.

| Parte | Clase | Atributos de datos |
| --- | --- | --- |
| Hoja completa | `.mari-ruleset-sheet` | `data-ruleset` (ID del conjunto, como `local/my-rules`), `data-rank-display` (`value`, `label`, `dots`, `roman` o `number`), `data-editing="true"` al editar |
| Título y botón **Editar ficha** | `.mari-ruleset-sheet__header` | |
| Pestañas | `.mari-ruleset-sheet__tabs` | Cada una tiene `data-tab-id` y `aria-selected` |
| Encabezado de grupo | `.mari-ruleset-sheet__heading` | |
| Campo superior | `.mari-ruleset-sheet__field` (en `.mari-ruleset-sheet__fields`) | `data-field`, o `data-derived` para valores calculados |
| Atributo | `.mari-ruleset-sheet__ability` (en `.mari-ruleset-sheet__abilities`); puntuación y valor de prueba: `__ability-score` y `__ability-value` | `data-ability`; el grupo tiene `data-section` |
| Reserva, como Salud | `.mari-ruleset-sheet__pool` (en `.mari-ruleset-sheet__pools`) | `data-pool`; el grupo tiene `data-pool-group` |
| Medidor | `.mari-ruleset-sheet__track` (en `.mari-ruleset-sheet__tracks`) | `data-track`; el de heridas también `data-wound="true"` |
| Condiciones | `.mari-ruleset-sheet__conditions` | |
| Habilidad entrenada o salvación | `.mari-ruleset-sheet__rank` (en `.mari-ruleset-sheet__trained`, por grupo en `.mari-ruleset-sheet__rank-group`); rango, o valor de prueba con `data-rank-display="value"`: `__rank-value`; valor de prueba al lado en teléfono: `__rank-check`; práctica: `__practice` | `data-skill` o `data-save`, `data-tier` (ID del nivel), `data-rank` (`0` sin entrenamiento, `1` siguiente nivel, etc.) |
| Habilidad o salvación al editar | `.mari-ruleset-sheet-editor__rank` | `data-skill` o `data-save`, `data-tier`, `data-rank` |
| Lista, como Equipo | `.mari-ruleset-sheet__list`; cada fila: `.mari-ruleset-sheet__list-row` | `data-list`; una fila marcada tiene `data-marked="true"` |

Este ejemplo muestra el rango 2 de un conjunto como dos estrellas. Añade un par de reglas así por cada rango que quieras cambiar. Úsalo solo si muestra rangos como puntos, nombres, números romanos o números: si muestra valores de prueba, `__rank-value` contiene ese valor y esto lo ocultaría.

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## Guías relacionadas

- [Guía para autores de temas](theme-author-guide.md)
- [El clima en tu tema](theme-weather.md)
- [Card CSS Theming Guide](card-css-theming.md)
- [Appearance Settings](appearance-settings.md)
- [Server Configuration Reference](../CONFIGURATION.md)
- [Remote Access](../REMOTE_ACCESS.md)
