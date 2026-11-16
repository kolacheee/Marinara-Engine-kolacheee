# Wetter in deinem Theme

Wenn es in einer Geschichte Wetter gibt, zeichnet Marinara es über den Chat: Regen, Schnee, Nebel, fallende Blätter, Blütenblätter, Sterne, eine Sonne oder einen Mond. Dein Theme kann all dem ein eigenes Aussehen geben. Du kannst den Regen umfärben, Schnee als Pixelquadrate fallen lassen, Blätter durch selbst gezeichnete Bilder ersetzen oder deinen Hintergrund bei Regen grau werden lassen.

In dieser Anleitung erfährst du Schritt für Schritt, wie das geht. Zuerst brauchst du ein eigenes Theme. Wenn du noch keines hast, zeigt dir die [Anleitung für Theme-Autoren](theme-author-guide.md), wie du in wenigen Minuten eines erstellst. Der Abschnitt [Wetter](theme-author-guide.md#weather) dort ist die kurze Referenzfassung dieser Seite.

## So funktioniert das Wetter

Das Wetter stammt aus der Geschichte. In einem Roleplay- oder Game-Chat verfolgt der **World State**-Agent das Wetter und die Tageszeit, etwa „heavy rain“ und „night“. Marinara liest diese Wörter und wählt aus, was gezeichnet wird: Regenstreifen für „rain“, Flocken für „snow“, Sterne und einen Mond für „night“ und so weiter.

Die App übernimmt das Zeichnen immer selbst. Dein Theme zeichnet nichts. Es setzt einige `--mari-weather-`-Tokens (benannte Einstellungen wie `--primary`), die von der App gelesen werden, damit sie das Wetter auf deine Art zeichnet. So bleiben Themes sicher: Nichts in einem Theme kann Code ausführen, und die eigenen Einstellungen des Nutzers, etwa für reduzierte Bewegung, haben immer Vorrang.

### In Innenräumen bleibt das Wetter draußen

Spielt die Geschichte drinnen, etwa in einem Gasthaus, einem Schlafzimmer oder einem Raum in World Maps, regnet es in der App nicht über den ganzen Bildschirm. Nur die Wetterfarbe und das Aufleuchten der Blitze bleiben, und der Raum bleibt trocken. Ob die Szene drinnen spielt, ermittelt die App aus dem Ort in World State („Tideglass Inn, Brinewatch“) oder dem Ortstyp in World Maps. Kann sie es nicht erkennen, wird das Wetter wie gewohnt gezeichnet. Ist **Weather Versions of Backgrounds** eingeschaltet (siehe [Wettervarianten von Hintergründen](../media/scene-backgrounds.md#weather-versions-of-backgrounds)), zeigt das Hintergrundbild selbst den Regen an den Fenstern, und das bewegte Wetter kehrt zurück – nur auf den Fensterscheiben. Der Wetter-Look deines Themes gilt auch dort.

### Das Wetter ohne Theme

So sieht eine regnerische Nacht ohne Theme aus: dünne, blasse Streifen über einem dunkelblauen Farbschleier. Die Bilder weiter unten zeigen denselben Chat mit drei Starter-Themes.

## Das Wetter während der Arbeit ansehen

Du musst nicht warten, bis es in der Geschichte regnet. Du kannst das Wetter selbst festlegen.

1. Öffne **Library → Settings → Appearance** (Bibliothek → Einstellungen → Erscheinungsbild) und prüfe, ob **Dynamic weather effects** (dynamische Wettereffekte) eingeschaltet ist (unter **Effects** (Effekte)) und **Reduce Ambient Animations & Effects** (Umgebungsanimationen & -effekte reduzieren) ausgeschaltet ist.
2. Öffne einen Roleplay-Chat, dann **Chat Settings → Agents** (Chat-Einstellungen → Agenten) und schalte **World State** ein.
3. Öffne den **World State**-Tracker. Am Computer findest du ihn im Tracker-Panel. Tipp auf einem Telefon auf die Schaltfläche **World State**.
4. Klick auf den Wert **Weather** (Wetter) und gib ein Wetterwort wie `heavy rain` ein. Klick auf **Time** (Zeit) und gib `night` ein.
5. Das Wetter setzt sofort ein. Der Chat hat nun einen eigenen Tab in der oberen Leiste.

Während du an deinem Theme arbeitest, füllen die Einstellungen die Mitte des Fensters aus und das Wetter pausiert dahinter. Speichere dein Theme und klick dann in der oberen Leiste auf den Tab des Chats, um das Ergebnis zu sehen. Ändere die Wörter aus Schritt 4, um anderes Wetter auszuprobieren. Die Tabelle unter **Welche Wörter welches Wetter erzeugen** führt sie alle auf.

> **Tipp:** Sperre den Wert Weather (Sperrmodus im Tracker), damit die KI ihn während deines Tests nicht ändert. Siehe [Roleplay-HUD und Tracker](../roleplay/hud-and-trackers.md).

## Dein erster Wetter-Look, Schritt für Schritt

Geben wir dem Regen eine Farbe und verlängern wir die Streifen, wie es das Starter-Theme NEON//GRID macht.

1. Öffne **Library → Settings → Appearance → CSS Themes** (Bibliothek → Einstellungen → Erscheinungsbild → CSS-Themes) und klick bei deinem Theme auf **Edit theme CSS** (Design-CSS bearbeiten), das Symbol für Code.
2. Such oben in deinem CSS nach der Zeile `:root {`. Wenn dein Theme keine hat, füge `:root {` in einer neuen Zeile und `}` in der Zeile darunter ein.
3. Füge darin vor dem `}` diese Zeilen ein:

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. Klick auf **Save** (Speichern). Wenn Marinara **Keep this theme?** fragt, klick auf **Keep theme** (Theme behalten).
5. Klick in der oberen Leiste auf den Tab deines Test-Chats. Der Regen ist jetzt cyanfarben, die Streifen sind etwa doppelt so lang und deutlicher sichtbar.

Das bewirken die einzelnen Zeilen:

- `--mari-weather-rain-color` ist die Farbe der Regentropfen. Jede Farbe ist möglich: ein Hex-Code wie `#3ff0ff`, ein Name wie `skyblue` oder `rgb(63 240 255)`.
- `--mari-weather-rain-length` macht die Streifen länger oder kürzer. `1` ist normal, `2.2` ist etwas mehr als doppelt so lang.
- `--mari-weather-strength` macht alle Partikel deutlicher (über `1`) oder schwächer (unter `1`) sichtbar.

### Das Ergebnis

Das ist dieselbe regnerische Nacht in NEON//GRID, das diese drei und einige weitere Zeilen verwendet.

### Farben für Tag und Nacht auswählen

Farben, die auf einem dunklen Hintergrund gut aussehen, können auf einem hellen verschwinden. Schreib die Farben für den Tag in einen `[data-theme="light"]`-Block und die Farben für die Nacht in einen `[data-theme="dark"]`-Block, so wie du jede andere Farbe festlegst:

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

## Welche Wörter welches Wetter erzeugen

Jede Wetterart hat einen Kurznamen. Diesen Namen verwendest du im Token, etwa `snow` in `--mari-weather-snow-color`.

| Wenn die Geschichte sagt | Die App zeichnet | Name in den Tokens |
| --- | --- | --- |
| rain, downpour | Regenstreifen | `rain` |
| storm, thunder, lightning | Starkregen mit aufleuchtenden Blitzen | `rain` (Aufleuchten: `lightning-color`, Blitze: `lightning-bolt`) |
| snow, sleet, blizzard, frost, cold | Schneeflocken | `snow` |
| hail | Hagelkörner | `hail` |
| fog, mist, haze | Sanfte Nebelbänke tief auf dem Bildschirm über Bodennebel | `fog` |
| sand, dust storm | Treibender Sand | `sand` |
| ash, smoke, volcanic | Fallende Asche | `ash` |
| fire, embers, inferno | Aufsteigende Glut | `ember` |
| wind, breeze, gusts | Fallende Blätter | `leaf` |
| cherry blossom, petals | Fallende Blütenblätter | `petal` |
| aurora, northern lights | Polarlichtbänder | `aurora` |
| clear, sunny, cloudy, anything else | Einige schwebende Staubkörnchen | `dust` |
| night (die Tageszeit) | Sterne und Glühwürmchen | `star`, `firefly` |
| dusk, evening (die Tageszeit) | Glühwürmchen | `firefly` |
| morning, day, dusk (klarer Himmel) | Die Sonne | `sun` |
| night (klarer Himmel) | Der Mond | `moon` |

In nebligen und verschneiten Nächten bleiben die Sterne aus, und Glühwürmchen meiden den Regen. Sonne und Mond erscheinen nur bei klarem Himmel.

## Farbe, Größe und Form ändern

Jede Art in der Tabelle akzeptiert dieselben drei Einstellungen. Setze den Namen der Art in die Mitte des Tokens.

| Token | Wirkung | Werte |
| --- | --- | --- |
| `--mari-weather-snow-color` | Die Farbe | Eine einfache Farbe: `#fff0f7`, `white`, `rgb(...)`, `hsl(...)` |
| `--mari-weather-snow-size` | Die Größe der einzelnen Partikel | `0.5` (halb so groß) bis `3` (dreimal so groß) |
| `--mari-weather-snow-shape` | Runde Punkte oder kleine Quadrate | `round` oder `square` |

Ersetze `snow` durch einen beliebigen anderen Namen aus der Tabelle, etwa `--mari-weather-ember-color` oder `--mari-weather-leaf-shape`.

Beispiel: „Datenschnee“ für ein Theme im Computerstil, mit kleinen cyanfarbenen Quadraten statt Flocken.

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

Formen gelten nicht für Regen, Nebel oder das Polarlicht, die ihre eigene Form behalten. Bei Nebel färbt `--mari-weather-fog-color` sowohl die treibenden Bänke als auch den Bodennebel, und `--mari-weather-tint-strength` macht den Nebel dünner oder dichter.

## Eigene Bilder verwenden

Statt Punkten und Streifen kann jede Art in Form deiner eigenen Bilder herabfallen: Ahornblätter, Sakura-Blütenblätter, Papiersterne oder kleine Pixel-Schneeflocken.

1. Zeichne oder such kleine Bilder mit transparentem Hintergrund, etwa PNGs. Halte sie klein: Für ein Blatt reichen etwa 24–64 Pixel Breite. Alles Größere wird auf der längsten Seite auf 160 Pixel verkleinert.
2. Öffne im Theme-Editor **Pictures and sharing details** (Bilder und Freigabedetails) und klick auf **Add pictures** (Bilder hinzufügen). Füge bis zu vier Bilder für eine Art hinzu.
3. Führe sie in deinem CSS im `-image`-Token der Art auf, jeweils durch ein Leerzeichen getrennt:

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. Speichere, öffne deinen Test-Chat und setze sein Wetter auf `windy`. Deine Blätter treiben nun herab und jedes wählt eines deiner Bilder aus.

Tipps für Bilder:

- Klick unter **Pictures and sharing details** auf den Namen eines Bildes, um sein `url("theme:...")` an der Cursorposition in dein CSS einzufügen. So musst du den Namen nicht abtippen.
- Ein Bild behält den hinzugefügten Dateinamen samt Endung, etwa `leaf-1.png`. Verwende den Namen genau so, wie er in der Liste steht.
- Ein Bild wird in seinen eigenen Farben gezeichnet, daher hat das `-color`-Token auf diese Art keine Wirkung.
- Mit `-size` machst du alle Bilder größer oder kleiner. Der glatte Stil variiert die Größe außerdem ein wenig, damit sie nicht alle gleich aussehen.
- Blätter, Blütenblätter und Asche drehen sich beim Fallen im glatten Stil sanft. Andere Arten bleiben aufrecht.
- Bilder müssen in deinem Theme enthalten sein. Ein Link zu einem Bild auf einer anderen Website wird ignoriert.

Das Starter-Theme Lantern Path verwendet auf diese Weise vier gemalte Blätter.

## Pixelstil

Der Pixelstil legt die gesamte Wetterschicht auf ein Raster aus großen quadratischen Pixeln, sodass sie zu Pixel-Art-Themes passt. Regentropfen, Flocken und Sterne werden zu klar abgegrenzten kleinen Blöcken.

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` schaltet den Pixelstil ein. `smooth` (oder das Weglassen der Einstellung) ist der normale Look.
- `--mari-weather-pixel-size` bestimmt die Größe jedes Blocks von `2px` bis `6px`. `3px` ist ein guter Ausgangspunkt.
- Im Pixelstil werden deine Bilder in ihrer eigenen Größe multipliziert mit `-size` gezeichnet. Zeichne deine Pixel-Art mit einem Bildpixel pro Kunstpixel und setze `-size` auf dieselbe Zahl wie die Pixelgröße, damit die Pixel deiner Kunst am Wetterraster ausgerichtet sind. Petal OS zeichnet 11 Pixel große Blütenblätter mit Größe `3`.
- Im Pixelstil drehen sich Bilder beim Fallen nicht und werden deckend gezeichnet (sie blenden sich in drei harten Stufen ein und aus), sodass Pixel-Art scharf bleibt.

### Beispiel: Petal OS

Das ist das Starter-Theme Petal OS in einer Blütennacht. Die Blütenblätter sind seine eigenen 11 Pixel großen Zeichnungen, und die Sterne liegen auf demselben Raster aus 3 px großen Blöcken.

## Sonne und Mond

Sonne und Mond akzeptieren wie jede andere Art eine Farbe, eine Größe und ein Bild:

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

Wenn dein Hintergrund bereits einen gemalten Mond enthält, schalte den Mond der App aus, damit nicht zwei zu sehen sind:

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` bewirkt dasselbe für die Sonne.

## Wetter abschwächen oder verstärken

Diese Einstellungen ändern die gesamte Wetterschicht auf einmal:

| Token | Wirkung | Werte |
| --- | --- | --- |
| `--mari-weather-amount` | Anzahl der fallenden Partikel | `0.25` (ein Viertel) bis `1` (normal). Ein Theme kann das Wetter ausdünnen, aber nie mehr Partikel hinzufügen. |
| `--mari-weather-speed` | Fallgeschwindigkeit | `0.5` (halbe Geschwindigkeit) bis `1.5` |
| `--mari-weather-strength` | Sichtbarkeit der Partikel | `0.5` (schwach) bis `1.5` (kräftig) |
| `--mari-weather-tint-strength` | Der Farbschleier über dem Chat (blau bei Regen, dunkel bei Nacht) | `0` (keiner) bis `1` (normal) |
| `--mari-weather-lightning-color` | Farbe des Aufleuchtens | Eine einfache Farbe. Das Aufleuchten bleibt sanft und langsam, damit es für Menschen mit Lichtempfindlichkeit sicher ist. |
| `--mari-weather-lightning-bolt` | Zeichnet bei jedem Aufleuchten einen gegabelten Blitz in der Blitzfarbe | `on` oder eine Breite von `0.5` bis `3`. `none` (der Standard) behält nur das Aufleuchten bei. |

Probier für ein ruhiges Lese-Theme `--mari-weather-amount: 0.5;` und `--mari-weather-tint-strength: 0.3;` aus.

### Blitze

Standardmäßig lässt ein Sturm nur den Bildschirm aufleuchten. Füge `--mari-weather-lightning-bolt` hinzu, um bei jedem Aufleuchten einen echten gegabelten Blitz zu zeichnen:

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

Der Blitz schlägt am linken oder rechten Bildschirmrand ein, nie in der Mitte über dem Chat-Text. Er gabelt sich in mehrere Zweige und leuchtet in deiner Blitzfarbe. Er ist nur zu sehen, solange das Aufleuchten der App aktiv ist, und verblasst damit. Ein Theme kann also weder zusätzliches Aufleuchten erzeugen noch es beschleunigen. Im Pixelstil wird der Blitz in Blöcken auf dem Pixelraster gezeichnet. Die meisten Starter-Themes verwenden Blitze: Apogee Lounge, Crepuscular, Dewglass, Gutterlight, MARI to the Moon, Sanguine Keep, Under Sail und Velvet Casket. Granite Watch und Quiet Iris schalten sie aus, weil sie in Innenräumen spielen.

## Den Hintergrund dem Wetter anpassen

Auch die eigene Kunst deines Themes kann sich mit dem Wetter ändern. Während in einem Chat Wetter angezeigt wird, fügt Marinara der Seite zwei Wörter hinzu, die dein CSS prüfen kann:

- `data-mari-weather` ist entweder `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom` oder `aurora`.
- `data-mari-sky` ist entweder `dawn`, `day`, `dusk` oder `night`.

Dabei handelt es sich immer um eines der oben genannten Wörter, nie um den eigenen Text der Geschichte. Sie verschwinden, wenn der Chat kein Wetter hat oder der Nutzer das Wetter ausschaltet.

### Beispiel: Lantern Path im Regen

Lantern Path ersetzt seinen sonnigen Wald bei Regen durch einen grauen, bedeckten Wald. Links: ein klarer Morgen. Rechts: derselbe Chat im Regen.

### Den Hintergrund austauschen

Füge dazu einen Block hinzu, der nur bei Regen oder Sturm gilt, und weise ihm ein zweites Hintergrundbild zu:

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

So liest du ihn: `:root[data-mari-weather="rain"]` bedeutet „nur während es regnet“. Das Komma bedeutet „oder“.

- Wenn dein Theme `--mari-app-backdrop-layers` statt `--mari-app-backdrop` setzt, ändere auch `--mari-app-backdrop-layers` im Wetterblock, da es Vorrang vor dem einzelnen Bild hat.
- Um zusätzlich Tag und Nacht abzustimmen, füge das Schema hinzu: `:root[data-theme="dark"][data-mari-weather="rain"]` bedeutet „eine regnerische Nacht in Dark“.
- `data-mari-sky` funktioniert genauso, zum Beispiel `:root[data-mari-sky="dusk"]` für eine Sonnenuntergangsversion deiner Kunst.

### Das Wetter nicht verdoppeln

Wenn dein Theme ein eigenes Umgebungs-Overlay mit fallenden Blättern oder Regen (`--mari-ambient`) hat, kann es sich über das Wetter der Geschichte legen. Schalte es aus, sobald echtes Wetter fällt:

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

Das bedeutet: „Wenn es Wetter gibt und es weder klar noch bewölkt ist, blende das Umgebungs-Overlay aus.“

Auch dein eigenes Overlay mit fallenden Blättern oder Regen kann draußen bleiben. `data-mari-shelter` ist `indoors` oder `outdoors`, solange das Wetter angezeigt wird (und fehlt, wenn die App es nicht erkennen kann):

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## Was der Nutzer selbst bestimmt

Dein Theme ändert, wie das Wetter aussieht, nie, ob es jemand sieht:

- Ein Theme kann Wetter nicht ein- oder ausschalten. Darüber entscheidet **Dynamic weather effects** in den Einstellungen.
- Wenn **Reduce Ambient Animations & Effects** eingeschaltet ist oder auf dem Gerät reduzierte Bewegung eingestellt wurde, wird gar kein Wetter gezeichnet. Hintergründe richten sich weiterhin nach `data-mari-weather`, da sich ein Bildwechsel nicht bewegt.
- **Reduced paint effects** (reduzierte Paint-Effekte) entfernt den Farbschleier und die Leuchteffekte und zeichnet weniger Partikel.
- **Theme art strength** (Stärke der Theme-Kunst) lässt dein Wetter wie deinen Hintergrund verblassen, und **High contrast** (hoher Kontrast) hält es schwach.
- Das Wetter pausiert, während ein Panel, ein Editor oder Mari den Chat verdeckt, um den Akku zu schonen.

## Wenn es nicht funktioniert hat

- **Nichts hat sich geändert.** Prüfe, ob das Token in einem `{ }`-Block steht und mit `;` endet. Prüfe die Schreibweise: Es heißt `--mari-weather-rain-color`, wobei `color` auf amerikanische Art geschrieben wird.
- **Ein Wert wird ignoriert.** Zahlen außerhalb des Bereichs eines Tokens werden auf das nächstgelegene Ende verschoben, und Werte, welche die App nicht versteht, werden verworfen. Farben müssen einfache Farben sein: Farbverläufe und `url()` werden ignoriert.
- **Meine Bilder werden nicht angezeigt.** Das Bild muss in der Bilderliste deines Themes stehen, und der Name in `url("theme:...")` muss exakt mit ihm übereinstimmen, einschließlich der richtigen Endung (`.webp` oder `.png`).
- **Überhaupt kein Wetter.** Prüfe, ob **World State** für den Chat eingeschaltet ist, ob der Wert Weather ein Wort aus der Tabelle enthält, ob **Dynamic weather effects** eingeschaltet und **Reduce Ambient Animations & Effects** ausgeschaltet ist.
- **Das Wetter erscheint in Roleplay, aber nicht in Conversation.** Das ist normal. Wetter erscheint nur in Roleplay- und Game-Chats.

## Von den Starter-Themes lernen

Jedes Starter-Theme in der Theme-Galerie zeigt Wettereffekte. Lade eines herunter, klick auf **Clone + Edit** (klonen und bearbeiten) und scrolle zu dem mit `Weather` markierten Teil seines CSS, um zu sehen, wie es gemacht ist.

- **NEON//GRID**: lange cyanfarbene Regenstreifen, quadratischer „Datenschnee“, magentafarbene Funken als Blätter und Blütenblätter. Sein gemaltes Regen-Overlay weicht echtem Wetter aus.
- **Petal OS**: Pixelstil auf einem 3-px-Raster, eigene Pixel-Blütenblätter, blassrosa Regen bei Nacht und tief beerenfarbener Regen am Tag sowie eine Stadt, die bei schlechtem Wetter grau wird.
- **Lantern Path**: eigene gemalte Blätter, warme Glühwürmchen, keine Sonne der App (der Hintergrund malt sein eigenes Licht) und Hintergründe, die je nach Wetter bedeckt oder verschneit werden.
- **Dewglass**: eigene Seifenblasen als Staubkörnchen, per Code gezeichnete Kristallschneeflocken, aquafarbener Regen, cyanfarbene Blitze und Lagunen-Hintergründe, die bedeckt, gefroren oder neblig werden.
- **Velvet Casket**: unterschiedliche Stürme bei Tag und Nacht: rosa Blitze und fliederfarbener Regen am Tag, violett-weiße Blitze und silberner Regen über dem Friedhof bei Nacht, dazu eigene Fledermäuse und Rosenblätter im Wind.
- **Gutterlight**: kalter Comic-Regen, zerrissenes Zeitungspapier im Wind, natriumgelber Smog und ein Sturm-Hintergrund, bei dem Wasser von den Wasserspeiern strömt, während die Blitze einschlagen.
- **Under Sail**: eine Bö auf See mit weiß-blauen Blitzen entlang der Takelage, Seenebel, Schnee auf Reling und Wanten sowie Möwenfedern im Wind.
- **Apogee Lounge**: Weltraumwetter durch das Lounge-Fenster. Ein Sturm wird zu einem Ionensturm in einem Nebel mit violetten Plasmablitzen, Regen zu Mikrometeorstreifen, Schnee zu einem Eisfeld und Nebel zu Nebeldunst. Eine Maske hält alles hinter dem Glas.
- **Granite Watch**: ein Theme für Innenräume, daher bleibt das Wetter so schwach, wie es ein Theme erlaubt. Regen wirkt wie Tropfen aus den Leitungen, Schnee wie Gipsstaub, Blitze sind ausgeschaltet und das Leuchten der App wird wie das Flackern einer Lampe eingefärbt. Hier siehst du, wie du das Wetter in Innenräumen abschwächst.
- **Quiet Iris**: ein weiteres Theme für Innenräume, aber mit einem Sichtfenster. Wetter zeigt sich nur hinter dem Glas, der Hintergrund wechselt zu einer Version mit Regen, Frost oder Nebel auf dem Sichtfenster, Blitze sind aus und die Bucht wird bei Sturm etwas dunkler.
- **MARI to the Moon**: Börsenwetter, gesehen durch das Fenster des Trading-Zimmers. Regen fällt als grüne Kursticks, ein Sturm ist ein Crash mit roten Blitzen und roten Bildschirmen, Schnee sind fallende Münzen und Diamanten, Wind weht Geldscheine, Blüten starten kleine Raketen und Nebel ist FUD über der Skyline.
- **Sanguine Keep**: Wetter, gesehen durch die Fenster der Burg. Eine Schablone pro Hintergrund hält Regen, Schnee, Blütenblätter, Blätter und Blitze im Fensterglas der großen Halle (auf Handys im Treppenturm), nie über dem Stein.
- **Crepuscular**: dieselbe See, gelesen durch einen Almanach. Schnee ist Puderzucker, Staub sind Krümel, Glühwürmchen sind wachende Augen, Wind weht Papierfetzen, Blitze sind dünne gravierte Äste und die Wache geht unter Regenschirmen weiter. In Innenräumen sieht man die See durch ein Bleiglasfenster.

## Verwandte Anleitungen

- [Anleitung für Theme-Autoren](theme-author-guide.md)
- [Eigene CSS-Themes](custom-css-themes.md)
- [Roleplay-HUD und Tracker](../roleplay/hud-and-trackers.md)
- [Einstellungen für das Erscheinungsbild](appearance-settings.md)
