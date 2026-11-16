# El clima en tu tema

Cuando una historia tiene clima, Marinara lo dibuja sobre el chat: lluvia, nieve, niebla, hojas que caen, pétalos, estrellas, un sol o una luna. Tu tema puede darle a todo un aspecto propio. Puedes cambiar el color de la lluvia, hacer que la nieve caiga como cuadrados de píxeles, sustituir las hojas por dibujos tuyos o hacer que el fondo se vuelva gris cuando llueve.

Esta guía te explica cómo hacerlo paso a paso. Primero necesitas un tema propio. Si todavía no tienes uno, la [Guía para crear temas](theme-author-guide.md) te enseña a crear uno en pocos minutos. La sección [Clima](theme-author-guide.md#weather) de esa guía es la versión breve de referencia de esta página.

## Cómo funciona el clima

El clima viene de la historia. En un chat de Roleplay o Game, el agente **World State** lleva el seguimiento del clima y la hora del día, por ejemplo, "heavy rain" y "night". Marinara lee esas palabras y elige qué dibujar: trazos de lluvia para "rain", copos para "snow", estrellas y una luna para "night", y así sucesivamente.

La app siempre se encarga del dibujo. Tu tema no dibuja nada. Establece unos cuantos tokens `--mari-weather-` (ajustes con nombre, como `--primary`), y la app los lee y dibuja el clima a tu manera. Así los temas se mantienen seguros: nada de un tema puede ejecutar código y los ajustes propios de quien usa la app, como el movimiento reducido, siempre tienen prioridad.

### En interiores, el clima se queda afuera

Cuando la historia transcurre en un interior, como una posada, un dormitorio o una habitación de World Maps, la app no muestra lluvia por toda la pantalla. Solo mantiene el color del clima y el destello de los relámpagos, y la habitación sigue seca. La app deduce si estás "dentro" a partir de la ubicación de World State ("Tideglass Inn, Brinewatch") o del tipo de lugar de World Maps. Cuando no puede determinarlo, dibuja el clima como siempre. Con **Weather Versions of Backgrounds** (Versiones de fondos según el clima) activado (consulta [Versiones de fondos según el clima](../media/scene-backgrounds.md#weather-versions-of-backgrounds)), la propia imagen de fondo muestra la lluvia en las ventanas, y el clima en movimiento vuelve, dibujado solo sobre el vidrio de las ventanas. El aspecto del clima de tu tema también se aplica allí.

### El clima sin tema

Esta es una noche lluviosa sin tema: trazos finos y pálidos sobre un velo azul oscuro. Las imágenes que aparecen más abajo muestran el mismo chat con tres temas iniciales.

## Ver el clima mientras trabajas

No tienes que esperar a que llueva en la historia. Puedes establecer el clima por tu cuenta.

1. Abre **Library → Settings → Appearance** (Biblioteca → Configuración → Apariencia), comprueba que **Dynamic weather effects** (Efectos de clima dinámicos: lluvia, nieve, niebla, etc.) esté activado (en **Effects**, Efectos) y que **Reduce Ambient Animations & Effects** (Reducir animaciones y efectos ambientales) esté desactivado.
2. Abre un chat de Roleplay, abre **Chat Settings → Agents** (Ajustes del chat → Agentes) y activa **World State**.
3. Abre el tracker **World State**. En una computadora, está en el Tracker Panel. En un teléfono, toca el botón **World State**.
4. Haz clic en el valor **Weather** (Clima) y escribe una palabra de clima, como `heavy rain`. Haz clic en **Time** (Hora) y escribe `night`.
5. El clima empieza de inmediato. Ahora el chat tiene su propia pestaña en la barra superior.

Mientras trabajas en tu tema, Settings ocupa el centro de la ventana y el clima se pausa detrás. Guarda el tema y haz clic en la pestaña del chat de la barra superior para ver el resultado. Para probar otro clima, cambia las palabras del paso 4. La tabla de **Which words make which weather** (Qué palabras producen cada clima), más abajo, las enumera todas.

> **Consejo:** Bloquea el valor Weather (modo de bloqueo en el tracker) para que la IA no lo cambie mientras haces pruebas. Consulta [HUD y trackers de Roleplay](../roleplay/hud-and-trackers.md).

## Tu primer aspecto de clima, paso a paso

Vamos a darle color a la lluvia y hacer los trazos más largos, como lo hace el tema inicial NEON//GRID.

1. Abre **Library → Settings → Appearance → CSS Themes** (Biblioteca → Configuración → Apariencia → Temas CSS) y haz clic en **Edit theme CSS** (Editar el CSS del tema), el icono de código de tu tema.
2. Busca la línea `:root {` cerca del principio de tu CSS. Si tu tema no tiene una, agrega `:root {` en una línea nueva y `}` en la siguiente.
3. Agrega estas líneas dentro, antes de `}`:

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. Haz clic en **Save** (Guardar). Si Marinara pregunta **Keep this theme?** (¿Conservar este tema?), haz clic en **Keep theme** (Conservar tema).
5. Haz clic en la pestaña de tu chat de prueba en la barra superior. Ahora la lluvia es cian, los trazos son aproximadamente el doble de largos y se ven con más intensidad.

Qué hace cada línea:

- `--mari-weather-rain-color` es el color de las gotas de lluvia. Sirve cualquier color: un código hexadecimal como `#3ff0ff`, un nombre como `skyblue` o `rgb(63 240 255)`.
- `--mari-weather-rain-length` hace que los trazos sean más largos o más cortos. `1` es normal; `2.2` es un poco más del doble.
- `--mari-weather-strength` hace que todas las partículas se vean más (por encima de `1`) o menos (por debajo de `1`).

### El resultado

Esta es la misma noche lluviosa en NEON//GRID, que usa estas tres líneas y algunas más.

### Elegir los colores del día y la noche

Los colores que se ven bien sobre un fondo oscuro pueden desaparecer sobre uno claro. Coloca los colores diurnos en un bloque `[data-theme="light"]` y los nocturnos en un bloque `[data-theme="dark"]`, igual que estableces cualquier otro color:

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## Qué palabras producen cada clima

Cada tipo de clima tiene un nombre corto. Usas ese nombre en el token, como `snow` en `--mari-weather-snow-color`.

| Cuando la historia dice | La app dibuja | Nombre en los tokens |
| ----------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| rain, downpour | Trazos de lluvia | `rain` |
| storm, thunder, lightning | Lluvia intensa con destellos de relámpagos | `rain` (destello: `lightning-color`, rayos: `lightning-bolt`) |
| snow, sleet, blizzard, frost, cold | Copos de nieve | `snow` |
| hail | Granizo | `hail` |
| fog, mist, haze | Bancos de niebla suave en la parte baja de la pantalla sobre una neblina a ras del suelo | `fog` |
| sand, dust storm | Arena arrastrada por el viento | `sand` |
| ash, smoke, volcanic | Ceniza que cae | `ash` |
| fire, embers, inferno | Brasas que ascienden | `ember` |
| wind, breeze, gusts | Hojas que caen | `leaf` |
| cherry blossom, petals | Pétalos que caen | `petal` |
| aurora, northern lights | Cintas de aurora | `aurora` |
| clear, sunny, cloudy, anything else | Algunas motas flotantes | `dust` |
| night (la hora) | Estrellas y luciérnagas | `star`, `firefly` |
| dusk, evening (la hora) | Luciérnagas | `firefly` |
| morning, day, dusk (cielo despejado) | El sol | `sun` |
| night (cielo despejado) | La luna | `moon` |

Las estrellas no aparecen en noches con niebla o nieve, y las luciérnagas se mantienen alejadas de la lluvia. El sol y la luna solo aparecen cuando el cielo está despejado.

## Cambiar el color, el tamaño y la forma

Cada tipo de la tabla acepta los mismos tres ajustes. Coloca el nombre del tipo en medio del token.

| Token | Qué hace | Valores |
| --------------------------- | ---------------------------- | ---------------------------------------------------------- |
| `--mari-weather-snow-color` | El color | Un color simple: `#fff0f7`, `white`, `rgb(...)`, `hsl(...)` |
| `--mari-weather-snow-size` | El tamaño de cada partícula | De `0.5` (la mitad) a `3` (el triple) |
| `--mari-weather-snow-shape` | Puntos redondos o cuadrados pequeños | `round` o `square` |

Sustituye `snow` por cualquier otro nombre de la tabla, como `--mari-weather-ember-color` o `--mari-weather-leaf-shape`.

Ejemplo: "nieve de datos" para un tema de estilo informático, con cuadrados cian pequeños en lugar de copos.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

Las formas no se aplican a la lluvia, la niebla ni la aurora, que conservan su propia forma. Para la niebla, `--mari-weather-fog-color` tiñe tanto los bancos que se desplazan como la neblina a ras del suelo, y `--mari-weather-tint-strength` hace que la neblina sea más fina o más espesa.

## Usar tus propias imágenes

En lugar de puntos y trazos, cada tipo puede caer como imágenes que hayas creado: hojas de arce, pétalos de sakura, estrellas de papel o pequeños copos de nieve pixelados.

1. Dibuja o busca imágenes pequeñas con fondos transparentes, como PNG. Mantenlas pequeñas: una hoja de entre 24 y 64 píxeles de ancho es suficiente. Todo lo que sea más grande se reduce a 160 píxeles en su lado más largo.
2. En el editor de temas, abre **Pictures and sharing details** (Imágenes y detalles para compartir) y haz clic en **Add pictures** (Añadir imágenes). Agrega hasta cuatro imágenes para un tipo.
3. En tu CSS, enuméralas en el token `-image` del tipo, separadas por un espacio:

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. Guarda, abre tu chat de prueba y establece su clima en `windy`. Ahora tus hojas flotan hacia abajo y cada una elige una de tus imágenes.

Consejos para las imágenes:

- Haz clic en el nombre de una imagen bajo **Pictures and sharing details** para insertar su `url("theme:...")` en tu CSS donde esté el cursor, así no tienes que escribir el nombre.
- Una imagen conserva el nombre de archivo con el que la agregaste, incluida la extensión, como `leaf-1.png`. Usa el nombre exactamente como aparece en la lista.
- Una imagen se dibuja con sus propios colores, por lo que el token `-color` no hace nada para ese tipo.
- Usa `-size` para hacerlas todas más grandes o más pequeñas. El estilo smooth también varía un poco el tamaño para que no todas se vean iguales.
- Las hojas, los pétalos y la ceniza giran suavemente mientras caen en el estilo smooth. Los demás tipos se mantienen verticales.
- Las imágenes deben estar dentro de tu tema. Los enlaces a imágenes de otros sitios web se ignoran.

El tema inicial Lantern Path usa cuatro hojas pintadas de esta manera.

## Estilo pixelado

El estilo pixelado coloca toda la capa del clima sobre una cuadrícula de píxeles cuadrados grandes para que combine con los temas de pixel art. Las gotas de lluvia, los copos y las estrellas se convierten en pequeños bloques nítidos.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` activa el estilo pixelado. `smooth` (o no incluirlo) es el aspecto normal.
- `--mari-weather-pixel-size` es el tamaño de cada bloque, de `2px` a `6px`. `3px` es un buen punto de partida.
- En el estilo pixelado, tus imágenes se dibujan con su propio tamaño multiplicado por `-size`. Dibuja el pixel art a 1 píxel por cada píxel del dibujo y establece `-size` en el mismo número que el tamaño del píxel, de modo que los píxeles del dibujo se alineen con los del clima. Petal OS dibuja pétalos de 11 píxeles con un tamaño de `3`.
- En el estilo pixelado, las imágenes no giran mientras caen y se dibujan sólidas (aparecen y desaparecen gradualmente en tres pasos bruscos), por lo que el pixel art se mantiene nítido.

### Ejemplo: Petal OS

Este es el tema inicial Petal OS en una noche de flores. Los pétalos son sus propios dibujos de 11 píxeles y las estrellas están en la misma cuadrícula de 3 px.

## El sol y la luna

El sol y la luna aceptan un color, un tamaño y una imagen, como cualquier otro tipo:

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

Si tu fondo ya tiene una luna pintada, desactiva la luna de la app para que no haya dos:

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` hace lo mismo con el sol.

## Suavizarlo o intensificarlo

Estos ajustes cambian toda la capa del clima a la vez:

| Token | Qué hace | Valores |
| -------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--mari-weather-amount` | Cuántas partículas caen | De `0.25` (un cuarto) a `1` (normal). Un tema puede reducir el clima, pero nunca añadir más. |
| `--mari-weather-speed` | La velocidad a la que caen las cosas | De `0.5` (media velocidad) a `1.5` |
| `--mari-weather-strength` | La intensidad con la que se ven las partículas | De `0.5` (tenue) a `1.5` (intenso) |
| `--mari-weather-tint-strength` | El velo de color sobre el chat (azul con lluvia, oscuro de noche) | De `0` (ninguno) a `1` (normal) |
| `--mari-weather-lightning-color` | El color del destello del relámpago | Un color simple. El destello se mantiene suave y lento, por lo que es seguro para las personas sensibles a las luces intermitentes. |
| `--mari-weather-lightning-bolt` | Dibuja un rayo bifurcado con cada destello, en el color del relámpago | `on` o un ancho de `0.5` a `3`. `none` (el valor predeterminado) conserva solo el destello. |

Para un tema de lectura tranquilo, prueba `--mari-weather-amount: 0.5;` y `--mari-weather-tint-strength: 0.3;`.

### Rayos

De forma predeterminada, una tormenta solo hace destellar la pantalla. Agrega `--mari-weather-lightning-bolt` para dibujar un rayo bifurcado de verdad con cada destello:

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

El rayo cae por el borde izquierdo o derecho de la pantalla, nunca por el centro, donde está el texto del chat. Se bifurca en varias ramas y brilla con el color que elegiste para los relámpagos. Solo se muestra mientras está activo el destello de la app y se desvanece con él, por lo que un tema no puede añadir destellos ni hacerlos más rápidos. En el estilo pixelado, el rayo se dibuja en bloques sobre la cuadrícula de píxeles. La mayoría de los temas iniciales usan rayos: Apogee Lounge, Crepuscular, Dewglass, Gutterlight, MARI to the Moon, Sanguine Keep, Under Sail y Velvet Casket. Granite Watch y Quiet Iris los desactivan porque están ambientados en interiores.

## Hacer que el fondo siga el clima

El arte de tu tema también puede cambiar con el clima. Mientras un chat muestra el clima, Marinara añade a la página dos palabras que tu CSS puede comprobar:

- `data-mari-weather` es uno de `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom` o `aurora`.
- `data-mari-sky` es uno de `dawn`, `day`, `dusk` o `night`.

Siempre son una de las palabras anteriores, nunca el texto propio de la historia. Desaparecen cuando el chat no tiene clima o cuando se desactiva el clima.

### Ejemplo: Lantern Path bajo la lluvia

Lantern Path cambia su bosque soleado por uno gris y cubierto cuando llueve. Izquierda: una mañana despejada. Derecha: el mismo chat bajo la lluvia.

### Cambiar el fondo

Para hacer lo mismo, agrega un bloque que solo se aplique con lluvia o tormentas y asígnale una segunda imagen de fondo:

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

Cómo leerlo: `:root[data-mari-weather="rain"]` significa "solo mientras llueve". La coma significa "o".

- Si tu tema establece `--mari-app-backdrop-layers` en lugar de `--mari-app-backdrop`, cambia también `--mari-app-backdrop-layers` en el bloque del clima, porque tiene prioridad sobre la imagen única.
- Para que también coincida con el día y la noche, agrega el esquema: `:root[data-theme="dark"][data-mari-weather="rain"]` significa "una noche lluviosa en Dark".
- `data-mari-sky` funciona de la misma manera; por ejemplo, `:root[data-mari-sky="dusk"]` sirve para una versión de tu arte al atardecer.

### No dupliques el clima

Si tu tema tiene su propia superposición ambiental con hojas o lluvia que caen (`--mari-ambient`), puede acumularse sobre el clima de la historia. Desactívala siempre que se manifieste el clima real:

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

Esto significa: "cuando haya clima y no esté despejado ni nublado, oculta la superposición ambiental".

Tu propia capa de hojas que caen o de lluvia también puede quedarse afuera. `data-mari-shelter` vale `indoors` o `outdoors` mientras se muestra el clima (y no está presente cuando la app no puede determinarlo):

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## Lo que sigue siendo elección de quien usa la app

Tu tema cambia el aspecto del clima, nunca si las personas lo ven:

- Un tema no puede activar ni desactivar el clima. **Dynamic weather effects** en Settings lo decide.
- Con **Reduce Ambient Animations & Effects** activado, o con el ajuste de movimiento reducido del dispositivo, no se dibuja ningún clima. Los fondos siguen a `data-mari-weather`, porque cambiar una imagen no implica movimiento.
- **Reduced paint effects** (Efectos de pintura reducidos) elimina el tinte y los brillos y dibuja menos partículas.
- **Theme art strength** (Intensidad del arte del tema) desvanece el clima como el fondo, y **High contrast** (Alto contraste) lo mantiene tenue.
- El clima se pausa mientras un panel, un editor o Mari cubre el chat, para ahorrar batería.

## Si no funcionó

- **No cambió nada.** Comprueba que el token esté dentro de un bloque `{ }` y termine en `;`. Comprueba la ortografía: es `--mari-weather-rain-color`, con `color` escrito a la manera estadounidense.
- **Se ignora un valor.** Los números que quedan fuera del intervalo de un token se mueven al extremo más cercano, y los valores que la app no entiende se descartan. Los colores deben ser simples: los degradados y `url()` se ignoran.
- **Mis imágenes no aparecen.** La imagen debe estar en la lista de imágenes de tu tema, y el nombre en `url("theme:...")` debe coincidir exactamente, con la extensión correcta (`.webp` o `.png`).
- **No aparece ningún clima.** Comprueba que **World State** esté activado para el chat, que el valor Weather contenga una palabra de la tabla, que **Dynamic weather effects** esté activado y que **Reduce Ambient Animations & Effects** esté desactivado.
- **El clima aparece en Roleplay, pero no en Conversation.** Es lo esperado. El clima solo aparece en chats de Roleplay y Game.

## Aprender de los temas iniciales

Todos los temas iniciales de la galería de temas exhiben el clima. Descarga uno, haz clic en **Clone + Edit** (Clonar y editar) y desplázate hasta la parte de su CSS marcada `Weather` para ver cómo se hace.

- **NEON//GRID**: trazos largos de lluvia cian, "nieve de datos" cuadrada y chispas magenta como hojas y pétalos. Su superposición de lluvia pintada se aparta cuando cae el clima real.
- **Petal OS**: estilo pixelado en una cuadrícula de 3 px, sus propios pétalos pixelados, lluvia rosa pálido por la noche y color baya intenso durante el día, y una ciudad que se vuelve gris cuando hace mal tiempo.
- **Lantern Path**: sus propias hojas pintadas, luciérnagas cálidas, sin sol de la app (el fondo pinta su propia luz) y fondos que se vuelven cubiertos o nevados con el clima.
- **Dewglass**: sus propias burbujas de jabón como motas, copos de nieve de cristal dibujados con código, lluvia aguamarina, rayos cian y fondos de laguna que se vuelven cubiertos, helados o neblinosos.
- **Velvet Casket**: una tormenta distinta para el día y la noche: rayos rosas y lluvia lila de día, rayos blancos con tonos violeta y lluvia plateada sobre el cementerio de noche, con sus propios murciélagos y pétalos de rosa al viento.
- **Gutterlight**: lluvia fría de cómic, papel de periódico rasgado al viento, esmog amarillo de sodio y un fondo de tormenta con agua que cae de las gárgolas mientras golpean los rayos.
- **Under Sail**: una borrasca en el mar con rayos blancos azulados que bajan por el aparejo, niebla marina, nieve sobre la borda y los obenques, y plumas de gaviota al viento.
- **Apogee Lounge**: clima espacial visto por la ventana del salón. Una tormenta se convierte en una tormenta de iones dentro de una nebulosa con rayos de plasma violeta, la lluvia se convierte en trazos de micrometeoros, la nieve en un campo de hielo y la niebla en bruma de nebulosa. Una máscara lo mantiene todo dentro del cristal.
- **Granite Watch**: un tema de interior, por lo que el clima se mantiene tan tenue como permite un tema. La lluvia parece gotear de los conductos, la nieve parece polvo de yeso, los rayos están desactivados y el destello de la app se tiñe como el parpadeo de una lámpara. Consulta este tema para ver cómo suavizar el clima en un espacio interior.
- **Quiet Iris**: otro tema de interior, pero con un ventanal. El clima solo se ve a través del cristal, el fondo cambia a una versión con lluvia, escarcha o niebla en el ventanal, los rayos están desactivados y la bahía se oscurece un poco durante una tormenta.
- **MARI to the Moon**: clima bursátil visto por la ventana de la sala de trading. La lluvia cae como ticks verdes, una tormenta es un desplome con rayos rojos y pantallas rojas, la nieve son monedas y diamantes que caen, el viento arrastra billetes, las flores lanzan cohetitos y la niebla es FUD sobre el horizonte.
- **Sanguine Keep**: clima visto por las ventanas del castillo. Una plantilla por fondo mantiene la lluvia, la nieve, los pétalos, las hojas y los rayos dentro del cristal de las ventanas del gran salón (o de la torre de la escalera en el móvil), nunca sobre la piedra.
- **Crepuscular**: el mismo mar leído a través de un almanaque. La nieve es azúcar glas, el polvo son migas, las luciérnagas son ojos que vigilan, el viento arrastra trozos de papel, los rayos son finas ramas grabadas y la vigilia continúa bajo los paraguas. En interiores, el mar se ve a través de una vidriera emplomada.

## Guías relacionadas

- [Guía para crear temas](theme-author-guide.md)
- [Temas CSS personalizados](custom-css-themes.md)
- [HUD y trackers de Roleplay](../roleplay/hud-and-trackers.md)
- [Ajustes de apariencia](appearance-settings.md)
