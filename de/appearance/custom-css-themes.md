# Eigene CSS-Themes

Ein Theme verändert das gesamte Aussehen von Marinara: Farben, Schriften, Bilder und die Form von Panels. Marinara hat eine Galerie mit fertigen Starter-Themes, die du herunterladen kannst. Du kannst auch ein Theme importieren, das jemand geteilt hat, oder dein eigenes erstellen.

Für eine schnelle Änderung ganz ohne Theme siehe [Darstellungseinstellungen](appearance-settings.md) oder [Fertige Stile für Chat-Fenster](#ready-made-chat-window-styles). Wenn du ein eigenes Theme erstellen möchtest, führt dich die [Anleitung für Theme-Autoren](theme-author-guide.md) Schritt für Schritt hindurch.

## Was ein eigenes Theme ist

Ein Theme besteht aus einem CSS-Block – also dem Code, mit dem Webseiten Farben, Schriften und Abstände festlegen – samt allen Bildern und Schriften, die es mitbringt. Themes werden auf deinem Marinara-Server gespeichert. Deshalb erscheint ein installiertes Theme auf jedem Gerät, das sich damit verbindet. Es kann immer nur ein Theme eingeschaltet sein, und du kannst so viele behalten, wie du möchtest.

## Wo du Themes findest

Öffne **Library → Settings → Appearance** (Bibliothek → Einstellungen → Darstellung) und klick in der Reihe der Bereiche auf **CSS Themes** (CSS-Themes). Im klassischen Layout findest du sie unter **Settings → Addons → Theme Library** (Einstellungen → Add-ons → Theme-Bibliothek).

Der Bereich enthält:

- Oben **Create Theme** (Theme erstellen) und **Import File** (Datei importieren).
- **Allow themes with HTML (I accept the risk)** (Themes mit HTML erlauben (ich akzeptiere das Risiko)), standardmäßig ausgeschaltet. Siehe [Themes mit HTML](#themes-with-html).
- **Installed Themes** (installierte Themes): zuerst **Default Theme** (Standard-Theme), dann deine eigenen Themes und danach die heruntergeladenen Starter-Themes.
- **Browse the theme gallery** (Theme-Galerie durchsuchen): die Starter-Themes, die du herunterladen kannst.

## Starter-Themes

Starter-Themes sind nicht Teil der Installation und belegen daher erst Speicherplatz, wenn du eines haben möchtest. Sie liegen in der Theme-Galerie, und Marinara lädt ein Theme erst herunter, wenn du es auswählst.

1. Klick auf **Browse the theme gallery** unter **Installed Themes**. Dafür braucht Marinara eine Internetverbindung.
2. Jedes Theme zeigt eine Vorschau, eine kurze Beschreibung, seine Größe und seine Tags.
3. Klick neben den gewünschten Themes auf **Download** (Herunterladen). Sie erscheinen unter **Starter themes** (Starter-Themes) in **Installed Themes** und können direkt eingeschaltet werden.

| Theme | Aussehen |
| --- | --- |
| **Apogee Lounge** | Die Aussichtslounge eines Weltraumliners aus den 1970ern, mit einem Gasriesen vor dem Fenster und Nachrichten auf geformten Panels. |
| **Crepuscular** | Ein Almanach der nächtlichen See: Kapuzengestalten halten auf einer Klippe Wache unter einem wachsamen Mond (sie essen Pfannkuchen), und die Nachrichten laufen eine linierte Hauptbuchspalte hinunter. |
| **Dewglass** | Glänzendes Glas der 2000er: Nachrichten sind Gel-Tropfen über einer sonnigen Lagune oder einer nächtlichen Aurora. |
| **Granite Watch** | Ein Befehlsstand aus dem Kalten Krieg unter einem Berg: Antworten werden auf Fernschreiberpapier gedruckt und Widgets hängen an Klemmbrettern. |
| **Gutterlight** | Eine regnerische gotische Stadt als Krimi-Comic, mit getuschten Panels und Textkästen. |
| **Lantern Meadow** | Ruhig und sehr gut lesbar, ohne Bewegung. |
| **Lantern Path** | Eine Lesespalte mit sanfter Bewegung. |
| **Maple's Bramble Cottage** | Ein gemütliches Cottage mit einer Lesespalte für lange Antworten. |
| **MARI to the Moon** | Ein Handelsterminal: Jede Antwort ist ein Orderzettel, die obere Leiste zeigt ein Börsenlaufband und die Chatliste ist eine Watchlist. |
| **NEON//GRID** | Neon-Cyberpunk für lange Antworten. |
| **Petal OS** | Ein verspielter Retro-Desktop mit Pixelschriften. |
| **Quiet Iris** | Eine ruhige Schiffsintelligenz: mattes Graphit-Instrumentarium, eine einzige rot-bernsteinfarbene Linse und jeder Chat angedockt an einem einzigen leuchtenden Rückgrat. |
| **Rosalind's Folio** | Ein Märchenbuch-Layout mit Visual-Novel-Elementen. |
| **Sanguine Keep** | Eine mondbeschienene gotische Burg: nachts karmesinroter Samt und Blattgold, tags heller Marmor, mit Porträts in Lanzettfenstern und Nachrichten auf Reliquientafeln. |
| **Swiss Poster** | Ruhiges, klares Posterdesign ohne Bewegung. |
| **Under Sail** | Das Deck eines Segelschiffs auf See: Jede Nachricht ist ein Segel aus Leinen, das an einer hölzernen Rah hängt. |
| **Velvet Casket** | Tagsüber Pastel Goth und nachts Traditional Goth, mit sargförmigen Nachrichten. |

Jedes Starter-Theme hat eine dunkle und eine helle Variante. Die kleinen Tags unter dem Namen, etwa **No motion** (keine Bewegung) oder **High legibility** (hohe Lesbarkeit), zeigen dir, was dich erwartet.

Wenn es in der Galerie eine neuere Version eines heruntergeladenen Themes gibt, steht beim Theme in der Galerieliste **Update** (Aktualisieren). Klick darauf, um die neue Version zu holen.

Heruntergeladene Starter-Themes sind schreibgeschützt und bleiben deshalb immer so, wie sie erstellt wurden. Jedes hat vier Schaltflächen:

- **(i) Credits and licences** (Credits und Lizenzen): Wer die Grafiken und Schriften erstellt hat und wie du sie weiterverwenden darfst.
- **Clone + Edit** (Klonen und bearbeiten; das Kopiersymbol): Erstellt deine eigene Kopie, etwa „Petal OS (my copy)“, und öffnet sie im Editor.
- **Export** (Exportieren; das Upload-Symbol): Speichert das Theme als Datei.
- **Remove** (Entfernen; das Papierkorb-Symbol): Entfernt das Theme aus dieser Installation. Du kannst es jederzeit wieder aus der Galerie herunterladen.

Du kannst die Theme-Dateien auch ohne die App herunterladen: Sie liegen im Ordner `themes` der Theme-Galerie auf GitHub ([Branch kolacheee-themes](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)). Lade dort eine `.json`-Datei herunter und nutze **Import File**.

<a id="activating-a-theme"></a>

## Ein Theme aktivieren

1. Klick unter **Installed Themes** auf den Namen eines Themes. Das Theme wird in diesem Browser-Tab eingeschaltet.
2. Eine Leiste fragt **Keep this theme?** und zählt 15 Sekunden herunter. Zeigst du auf die Leiste, pausiert der Countdown.
3. Klick auf **Keep theme** (Theme behalten), um es zu behalten. Jetzt erscheint es auch auf deinen anderen Geräten. Klick auf **Go back** (Zurück), oder lass den Countdown ablaufen, um zu deinem vorherigen Aussehen zurückzukehren.

Klick auf **Default Theme**, um eigene Themes auszuschalten. **Reset Appearance** (Darstellung zurücksetzen) oben unter **Settings → Appearance → Theme** (Einstellungen → Darstellung → Theme) schaltet das Theme ebenfalls aus.

Wenn du nur auf einem Gerät ein anderes Theme verwenden möchtest, stell zuerst **Look on this device** (Aussehen auf diesem Gerät) auf **Only this device** (nur dieses Gerät), und zwar unter **Settings → Appearance → Theme**.

### Dein gewohntes Aussehen wiederherstellen

Wenn ein Theme die Bedienung von Marinara erschwert, kannst du es mit jeder dieser Methoden in diesem Tab ausschalten:

- Drück dreimal <kbd>Esc</kbd>.
- Häng `?safe` an die Adresse in deinem Browser an.
- Drück <kbd>Ctrl</kbd>+<kbd>K</kbd> und gib „Custom theme“ ein.

Marinara schützt außerdem die obere Leiste, die Seitenleisten, <kbd>Ctrl</kbd>+<kbd>K</kbd> und das Nachrichtenfeld. Ein Theme kann sie umgestalten. Blendet es jedoch eines dieser Elemente aus, verschiebt oder überdeckt es, schaltet Marinara das Theme in diesem Tab aus und nennt dir den Grund.

## Ein Theme importieren

1. Klick auf **Import File**.
2. Wähle eine `.json`- oder `.css`-Theme-Datei.
3. Eine Vorschau zeigt Name, Autor, Version, Bilder und Größe des Themes sowie seine Credits und Lizenz. Sie führt alles auf, was du vor der Installation wissen solltest, etwa bewegte Bilder, vom Theme hinzugefügten Text oder Teile, die nicht funktionieren werden.
4. Wähle aus, was übernommen werden soll. Die Vorschau bietet die empfohlenen Einstellungen des Themes an, etwa Farbschema, Akzentfarbe und Schrift; die meisten davon sind angehakt. Sie kann auch die Hintergründe des Themes zu deiner Galerie für Chat-Hintergründe hinzufügen.
5. Klick auf **Install and try it** (installieren und ausprobieren), um sofort zu diesem Theme zu wechseln, oder auf **Install** (Installieren), um es der Liste hinzuzufügen.

Hast du bereits ein Theme mit demselben Namen, bietet die Vorschau an, es zu aktualisieren oder **Keep both** (beide behalten) zu wählen. Kehrst du von einem Theme zurück, das du ausprobierst, stellt Marinara auch alle Einstellungen wieder her, die das Theme geändert hat.

Ein Theme kann nicht installiert werden, wenn es Text schreibt, der nach Passwörtern oder Schlüsseln fragt oder sich als Marinara ausgibt. Gib niemals einen Schlüssel oder ein Passwort ein, weil ein Theme danach fragt.

<a id="themes-with-html"></a>

### Themes mit HTML

Manche Themes fügen jeder Nachricht ein kleines HTML-Feld hinzu, das Nachrichtenvorlage heißt. Marinara entfernt daraus Skripte, Links, Bilder und Formulare, doch HTML von jemand anderem könnte dich trotzdem täuschen. Diese Themes lassen sich nur installieren, solange **Allow themes with HTML (I accept the risk)** eingeschaltet ist. Ist der Schalter aus, wird ein installiertes Theme ohne sein HTML angezeigt.

## Ein Theme anlegen

Klick auf **Create Theme** oder bei einem Starter-Theme auf **Clone + Edit**, um mit etwas zu beginnen, das bereits gut aussieht. Der Editor hat ein Namensfeld, ein großes CSS-Feld, **Preview** (Vorschau) und **Save** (Speichern). Ein neues Theme wird beim Speichern eingeschaltet und fragt **Keep this theme?**

Die [Anleitung für Theme-Autoren](theme-author-guide.md#your-first-theme-step-by-step) führt dich Schritt für Schritt durch dein erstes Theme.

### Ein Theme mit Professor Mari erstellen

Du musst CSS nicht selbst schreiben. Sag Professor Mari in einfachen Worten, was du möchtest, etwa „Mach mir ein gemütliches Herbst-Theme, das auf meinem Handy funktioniert“ oder „Was stimmt mit meinem Harbor-Theme nicht?“. Sie hat ein Handbuch zum Gestalten und Prüfen von Themes und hält sich daran:

1. **Sie stimmt zuerst die Idee mit dir ab.** Sie fragt nach der Stimmung, hellem oder dunklem Modus (oder beidem), deinen Geräten und danach, ob du Bilder und Wetter möchtest. Dann fasst sie einen Look in einem Satz zusammen, etwa „Kapseln aus Milchglas vor einer Meereskulisse“.
2. **Sie erstellt es zunächst ausgeschaltet.** Sie sagt dir, wo du es ausprobieren kannst: Wähl es unter **CSS-Themes** aus und drück innerhalb von 15 Sekunden auf **Theme behalten**. Bittest du sie, es selbst einzuschalten, fragt dein Tab genauso **Dieses Theme behalten?** und wechselt zurück, wenn niemand antwortet.
3. **Sie bittet dich, hinzusehen.** Mari kann deinen Bildschirm nicht sehen. Deshalb nennt sie genaue Stellen, die du im hellen und dunklen Modus prüfen sollst, und bittet um einen Screenshot, wenn etwas nicht stimmt. Hat Marinara das Theme ausgeschaltet, sag ihr die Meldung: Sie nennt den Grund, und Mari behebt ihn.
4. **Sie kann die Bilder dafür erstellen.** Ist unter Verbindungen ein Bildmodell eingerichtet, erstellt sie Hintergründe, Rahmen und Symbole, zeigt dir jedes zuerst und speichert es im Theme, wenn du zustimmst. Sie kann auch gezeichnete Verzierungen (SVG-Bilder) in einem Theme umfärben. Siehe [Professor Mari um die Bilder bitten](theme-author-guide.md#ask-professor-mari-to-make-the-art).

Wenn sie ein Theme prüft, listet sie für jede Ansicht auf, was nicht zusammenpasst (unterschiedliche Eckenformen, Schatten, schwer lesbare Beschriftungen). Sie ändert nichts, bis du sagst, was sie beheben soll.

Mari arbeitet nur an deinen eigenen Themes. Starter-Themes sind schreibgeschützt. Klick deshalb zuerst bei einem auf **Klonen + bearbeiten** und bitte sie, die Kopie zu bearbeiten. Schriftarten, Namensnennungen und Vorschaubilder fügst du selbst unter **Bilder und Angaben zum Teilen (Autor, Version, Vorschaubild, Schriftarten)** hinzu.

## Eigene Themes bearbeiten, exportieren und entfernen

Deine eigenen Themes haben drei Schaltflächen in ihrer Zeile:

- **Edit theme CSS** (Theme-CSS bearbeiten; das Code-Symbol) öffnet den Editor. Das Bearbeiten ändert nicht, welches Theme eingeschaltet ist.
- **Export** (das Upload-Symbol) lädt eine `.json`-Datei herunter, die du teilen oder anderswo importieren kannst.
- **Remove** (das Papierkorb-Symbol) löscht das Theme nach deiner Bestätigung. Das lässt sich nicht rückgängig machen; exportiere es daher zuerst, falls du es später vielleicht wiederhaben möchtest.

## Ein Theme für einen Chat

Ein Chat kann ein eigenes Theme haben:

1. Öffne den Chat und dann **Chat Settings** (Chat-Einstellungen).
2. Wähl unter **Theme** (Theme) ein Theme aus. **Follow the app** (der App folgen) verwendet das App-Theme, und **Default look (no custom theme)** (Standardaussehen (kein eigenes Theme)) schaltet Themes für diesen Chat aus.
3. Hak in einem Chat mit einem Charakter **Use it for every chat with this character** (für jeden Chat mit diesem Charakter verwenden) an, um es zum Theme dieses Charakters zu machen.

Die Einstellungen und die Bibliothek verwenden immer das App-Theme.

## Wer Themes ändern kann

Auf dem Rechner, auf dem Marinara läuft, ist kein Secret nötig. Von einem anderen Gerät aus, etwa einem Handy, brauchst du zum Erstellen, Importieren, Klonen, Bearbeiten und Entfernen von Themes das Admin-Secret. Gib es unter **Settings → Advanced → Security** (Einstellungen → Erweitert → Sicherheit) ein. Um ein bereits installiertes Theme auszuwählen, ist kein Secret nötig. Siehe [Das Admin-Secret](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions).

<a id="ready-made-chat-window-styles"></a>

## Fertige Stile für Chat-Fenster

Bevor du anfängst: Dafür brauchst du kein CSS.

1. Öffne **Settings → Appearance → Chat Buttons & Windows** (Einstellungen → Darstellung → Chat-Schaltflächen und -Fenster).
2. Wähl unter **Chat widget style** (Chat-Widget-Stil) einen Stil.

| Stil | Aussehen |
| --- | --- |
| **Default** (Standard) | Das ursprüngliche Aussehen. |
| **Dottore** | Eisblaue Instrumentenrahmen, helle Metallkanten und abgeschrägte Ecken. |
| **Prof. Mari** | Goldgesäumte Märchenbuchrahmen, Edelsteinblau und Primogems an den Fenstertiteln. Seine Schaltflächen nutzen denselben Hintergrund wie seine Fenster. |

Jeder Stil hat eine eigene Schrift, funktioniert im hellen und dunklen Modus und gestaltet Schaltflächen, Fenster und aufklappbare Abschnitte gemeinsam. Die Wahl eines Stils setzt **Font** (Schrift), **Shape** (Form) und alle drei Farben zurück. Deine Fensterpositionen bleiben erhalten.

Diese Einstellungen kannst du einzeln ändern:

- **Font** und **Shape** folgen dem Stil (**Preset font**, **Preset shape**), bis du etwas anderes wählst.
- **Border & Buttons Color** (Rahmen- und Schaltflächenfarbe) färbt Umrisse und Schaltflächensymbole. Symbole nutzen die erste Farbe eines Farbverlaufs.
- **Background Color** (Hintergrundfarbe) füllt Schaltflächen, Fenster, aufklappbare Abschnitte und Eingabefelder.
- **Text Color** (Textfarbe) färbt den Widget-Text. Farbverläufe erscheinen auf Überschriften und Beschriftungen, und Eingabefelder nutzen die erste Farbe.

Jede Farbe hat einen Farbwähler für eine einheitliche Farbe und eine Option für einen Farbverlauf. **Reset color** (Farbe zurücksetzen) neben einer Einstellung folgt wieder den hellen oder dunklen Farben des Stils. Dekorative Embleme behalten ihre ursprünglichen Farben.

### Den Stil in den Chat übertragen

Drei Schalter unter den Farbwählern erweitern den Stil. Jeder ist anfangs aus und funktioniert für sich. Schaltest du einen aus, kehrt dieser Teil zur üblichen Chatgestaltung zurück, und die Wahl eines anderen Stils behält deine Schalterstellungen bei.

| Schalter | Was er anwendet |
| --- | --- |
| **Apply preset font** (Preset-Schrift anwenden) | Die Widget-Schrift, für Nachrichten, Eingabefelder und Chat-Bedienelemente. |
| **Apply preset shape** (Preset-Form anwenden) | Die Rahmenform, für Roleplay-Nachrichten (klassisch und Visual Novel), das Game-Dialogfeld, Eingabefelder und Bedienelemente. Conversation-Nachrichten behalten ihre eigene Form. |
| **Apply preset colors** (Preset-Farben anwenden) | Die Rahmen-, Hintergrund- und Textfarben für diese Bereiche, einschließlich Conversation-Nachrichten. Auch deine eigenen Farben und Farbverläufe gelten dort. Wörtliche Rede behält die eigene Dialogue Highlight Color des jeweiligen Charakters oder der jeweiligen Persona. Eine Nachricht aus HTML, etwa die gestaltete Karte eines Agenten, behält die Textfarben, die sie selbst festlegt. |

Die Verlaufsschaltflächen **Load More** (Mehr laden) und **Show older** (Ältere anzeigen) folgen den Schaltern wie andere Chat-Bedienelemente. Im Game Mode gelten die Schalter außerdem für Randbemerkungen, HUD-Widgets, das Kartenpanel, Charakterbögen, Protokolle, das Inventar, Kampfpanels und Dialogfenster. Professor Mari kann auch eigene Themes für diese Bereiche erstellen.

Ein eigenes Theme kann die Stile weiterhin überschreiben. Die Variablen für Fenster und Abschnitte unter [Chat-Fenster und aufklappbare Abschnitte gestalten](#styling-chat-windows-and-drawers) haben Vorrang vor den Farben des Stils. Nutze `--mari-window-font-family` für die Fensterschrift, `--mari-drawer-radius` für die Ecken der Abschnitte und `--mari-window-ornament: none`, um die Verzierung am Titel auszublenden. Um alle Verzierungen des Stils zu entfernen, wähle zuerst **Default**.

## Für Theme-Autoren

Der Rest dieser Anleitung ist Referenzmaterial für alle, die Theme-CSS von Hand schreiben. Beginne mit der [Anleitung für Theme-Autoren](theme-author-guide.md), die alle stabilen Tokens, Part-Hooks und Sicherheitsregeln auflistet.

<a id="themes-and-card-css"></a>

## Themes und Card CSS

Marinara kennt zwei Wege, eigenes CSS einzubringen, und beide können gleichzeitig aktiv sein.

- Ein eigenes Theme färbt die ganze App neu ein. Es darf Marinaras Kernvariablen überschreiben, `!important` verwenden und `position: fixed` nutzen.
- Card CSS ist in eine Charakterkarte oder Persona-Karte eingebettet und wird pro Chat eingeschaltet. Es wird strenger bereinigt: Es kann keine Kernvariablen überschreiben, `!important` wird entfernt, und aus `position: fixed` wird `position: absolute`. Es gestaltet Chatnachrichten, nicht die ganze App. Siehe die [Anleitung zum Card-CSS-Theming](card-css-theming.md).

## Grenzen für Größe und Name

Ein Theme-Name darf bis zu 200 Zeichen lang sein. Das CSS darf bis zu 256 KiB umfassen, gemessen in UTF-8-Bytes. Ein größeres Theme wird beim Speichern oder Importieren abgelehnt. Das CSS eigener Themes wird außerdem bereinigt, bevor es wirkt: Stile, die eine Datei von einer anderen Website laden, funktionieren nicht. Bette ein Bild oder eine Schrift stattdessen als `data:`-URI ein.

## Die CSS-Variablen-Referenz

Im Theme-Editor gibt es eine ausklappbare **CSS Variable Reference** (CSS-Variablen-Referenz). Ein Klick darauf zeigt die nützlichsten Variablen, die sich überschreiben lassen. Ein Theme verändert die App, indem es diese Variablen in einem `:root`-Block setzt. Die Referenz listet folgende Variablen:

| Variable | Wirkung |
| --- | --- |
| `--background` | Seitenhintergrund |
| `--foreground` | Haupttext |
| `--primary` | Akzent und Schaltflächen |
| `--primary-foreground` | Text auf Primärfarbe |
| `--secondary` | Karten und Eingabefelder |
| `--card` | Kartenhintergrund |
| `--border` | Rahmen |
| `--muted-foreground` | Gedimmter Text |
| `--sidebar` | Hintergrund der Seitenleiste |
| `--sidebar-border` | Rahmen der Seitenleiste |
| `--marinara-shell-edge-border` | Linker und rechter Rand der Hülle |
| `--destructive` | Fehler und Löschen |
| `--popover` | Hintergrund des Dropdown-Menüs |
| `--accent` | Hervorhebung beim Draufzeigen |

Ein Theme kann jede CSS-Variable setzen, die Marinara verwendet, nicht nur diese. Manche Effekte haben eigene Variablen. Zum Beispiel fordert `--marinara-theme-accent-pulse: enabled` die pulsierende Akzent-Animation an.

<a id="styling-chat-windows-and-drawers"></a>

## Chat-Fenster und aufklappbare Abschnitte gestalten

Am Computer öffnet sich **Chat Settings** als verschiebbares Fenster. Seine aufklappbaren Abschnitte heißen **drawers**. Ein Abschnitt lässt sich in ein eigenes Fenster herauslösen und anschließend zu einer kleinen verschiebbaren Schaltfläche minimieren, einer **bubble**.

Auch andere Chat-Tools nutzen diese Fenster und Schaltflächen: Game controls, Session, Volume, Game Assets, verknüpfte Chats und Paket-Bedienelemente. Am Telefon öffnen sich die meisten Fenster als Panels über die ganze Breite; Echo Chamber bleibt ein kompaktes Fenster, das du verschieben und dessen Größe du ändern kannst. Aus Chat Settings herausgelöste Tools erscheinen im verschiebbaren Drei-Punkte-Menü **Chat tools** (Chat-Tools); Tracker-Schaltflächen bleiben separat.

Mit den folgenden Klassen, Datenattributen und Variablen gestaltet ein Theme diese Teile gemeinsam. Deine Theme-Regeln überschreiben die Standardwerte ohne `!important`.

### Klassen

| Teil | Klasse |
| --- | --- |
| Fenster | `.mari-window` |
| Titelleiste | `.mari-window__header` |
| Titel und sein Symbol | `.mari-window__title-row` |
| Titel | `.mari-window__title` |
| Schaltflächen der Titelleiste (Reset View, Favoritenstern, Tracker Panel, Anheften, Sperren, Schließen, Put back) | `.mari-window__controls` (jede Schaltfläche hat `.mari-window__control`) |
| Fensterinhalt | `.mari-window__body` |
| Kanten und Ecken zur Größenänderung | `.mari-window__resize-handle` |
| Eckmarkierung, wenn Mauszeiger oder Tastaturfokus im Fenster liegen | `.mari-window__resize-grip` |
| Aufklappbarer Abschnitt | `.mari-drawer` |
| Kopfzeile und Titel des Abschnitts | `.mari-drawer__header`, `.mari-drawer__title` |
| Symbol, Anzahl und **?** des Abschnitts | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| Vorschau eines zugeklappten Abschnitts (das kleine Tracker-Widget) | `.mari-drawer__summary` |
| Schaltflächen neben dem Pfeil und zum Herauslösen | `.mari-drawer__actions`, `.mari-drawer__popout` |
| Pfeil und Inhalt des Abschnitts | `.mari-drawer__arrow`, `.mari-drawer__body` |
| Vorschau, die beim Herausziehen eines Abschnitts dem Mauszeiger folgt | `.mari-drawer-ghost` |
| Schaltfläche eines minimierten Fensters (bubble) | `.mari-window-bubble` |
| Aktuelle Übersicht, die eine Fensterschaltfläche statt ihres Symbols zeigt (das Banner von World State) | `.mari-window-bubble__banner` |
| Hilfslinie beim Ausrichten einer gezogenen Schaltfläche an einer anderen | `.mari-window-snap-guide` |
| Punkt während der Arbeit von Agenten (Chat-Settings-Schaltfläche, Trackers-Fenster) | `.mari-agents-running-dot` |

### Datenattribute

- `data-window` benennt ein Fenster und seine Schaltfläche: `chat-settings`, `trackers`, die Steuerungsfenster `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` und `control:beholder:<package>` sowie `drawer:<window>:<drawer>` für einen herausgelösten Abschnitt, etwa `drawer:chat-settings:chat-name`.
- `data-drawer` benennt einen Abschnitt, etwa `chat-name`. Einige Namen beginnen mit dem Chat-Modus, zum Beispiel `roleplay-agents` oder `conversation-agents`. Tracker nutzen `tracker-world`, `tracker-persona`, `tracker-characters`, `tracker-quests`, `tracker-inventory`, `tracker-custom` und `agent-activity`.
- `data-presentation` ist bei einem Computerfenster `"window"` und bei einem Telefon-Panel `"sheet"`.
- `data-pinned` und `data-locked` sind `"true"`, solange das Fenster angeheftet oder gesperrt ist.
- `data-window-control` benennt jede Schaltfläche der Titelleiste: `"pin"`, `"lock"`, `"close"` oder `"put-back"`. Eine aktivierte Anheft- oder Sperrschaltfläche hat außerdem `aria-pressed="true"`.
- `data-chat-settings-control` kennzeichnet die zusätzlichen Schaltflächen in der Titelleiste von Chat Settings: `"reset-view"`, `"favorite-layout"` und `"tracker-panel"`. Der Favoritenstern hat `aria-pressed="true"` und ein ausgefülltes Symbol, wenn die aktuelle Anordnung zum gespeicherten Favoriten passt.
- `data-edge` ist an den jeweiligen Größenänderungsgriffen `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"` oder `"sw"`.
- Die Schaltfläche eines offenen Abschnitts innerhalb von `.mari-drawer__header` hat `aria-expanded="true"`.
- `data-drawer-control="pop-out"` kennzeichnet die Schaltfläche zum Herauslösen eines Abschnitts.
- `data-outside="true"` kennzeichnet eine Ziehvorschau, die weit genug außerhalb ihres Fensters liegt, um beim Loslassen herausgelöst zu werden.
- `data-axis` ist `"x"` bei einer senkrechten Ausrichtungslinie und `"y"` bei einer waagerechten.
- `data-detached` ist `"true"`, wenn ein Abschnitt in einem eigenen Fenster erscheint, sowohl am Fenster als auch am Abschnitt darin. Das Fenster eines herausgelösten Abschnitts heißt `data-window="drawer:<window>:<drawer>"`, etwa `data-window="drawer:chat-settings:chat-name"`; `data-drawer-host` benennt sein Ursprungsfenster.
- `data-dragging` ist am Abschnitt `"true"`, während du seinen Titel ziehst. `data-drop-target` ist an einem Fenster `"true"`, während du einen herausgelösten Abschnitt darüber hältst, um ihn zurückzulegen.
- Eine Fensterschaltfläche trägt das `data-window` ihres Fensters und `data-minimized="true"`, etwa `.mari-window-bubble[data-window="control:volume"]`. Steuerungsfenster heißen `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` und `control:beholder:<package>`. Während du die Schaltfläche ziehst, ist ihr `data-dragging` gleich `"true"`. Eine Fensterschaltfläche, die statt ihres Symbols eine aktuelle Übersicht zeigt, etwa ein minimierter World-State-Tracker, hat `data-banner="true"` und wird so breit wie die Übersicht.
- Eine gesperrte Fensterschaltfläche hat `data-locked="true"`, auch die Chat-Settings-Schaltfläche. Sie öffnet weiterhin das Fenster, lässt sich aber erst nach dem Entsperren bewegen. Mit `.mari-window-bubble[data-locked="true"]` kannst du diese Schaltflächen anders gestalten.
- Am Telefon haben Fenster und ihre etwas größeren Schaltflächen `data-presentation="sheet"`. Die Schaltfläche des Tracker Panel ist `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`.
- Auch die Chat-Settings-Schaltfläche ist eine bubble: `.mari-window-bubble[data-chat-settings-button]`. Solange Chat Settings offen ist, hat sie `data-open="true"`.
- Ein herausgelöster Abschnitt verkleinert sich zu einer Schaltfläche mit `data-drawer-host` (dem Ursprungsfenster). Die **Put back**-Schaltfläche seines Fensters ist `[data-window-control="put-back"]`.

### Variablen

Jede Variable fällt auf die gemeinsamen Farben der Chat-Bedienelemente zurück. Ein Theme muss deshalb nur die Werte festlegen, die es ändern soll.

| Variable | Was sie steuert |
| --- | --- |
| `--mari-window-bg` | Fensterhintergrund |
| `--mari-window-text` | Fenstertext |
| `--mari-window-border`, `--mari-window-border-width` | Fensterrahmen |
| `--mari-window-radius` | Rundung der Fensterecken |
| `--mari-window-shadow` | Fensterschatten |
| `--mari-window-backdrop-filter` | Unschärfe hinter dem Fenster |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | Farben der Titelleiste |
| `--mari-window-header-padding` | Innenabstände der Titelleiste |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | Schaltflächen der Titelleiste, einschließlich Favoritenstern |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | Aktivierte Titelleisten-Schaltflächen, einschließlich Anheften, Sperren und ausgefülltem Favoritenstern |
| `--mari-window-control-radius`, `--mari-window-control-gap` | Rundung und Abstand der Schaltflächen |
| `--mari-window-focus-ring` | Umriss für den Tastaturfokus und für das Fenster, in das ein Abschnitt zurückgelegt wird |
| `--mari-window-resize-handle-size` | Breite der Kanten zur Größenänderung |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | Größe, Rundung und Schatten der Fensterschaltfläche |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | Hintergrund und Rahmen der Fensterschaltfläche |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | Symbolfarbe der Fensterschaltfläche |
| `--mari-window-snap-guide` | Farbe der Ausrichtungslinie |
| `--mari-drawer-bg`, `--mari-drawer-border` | Hintergrund und Trennlinie des Abschnitts |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | Farben der Abschnittskopfzeile |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | Abstände im Abschnitt |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | Text und Symbole der Abschnittskopfzeile |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | Anzahl-Markierung am Abschnitt |

Setze eine Variable in `:root`, um alle Fenster zu ändern, oder an einem Selektor für ein einzelnes Fenster:

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

<a id="styling-messages-input-boxes-and-chat-controls"></a>

## Nachrichten, Eingabefelder und Chat-Bedienelemente gestalten

Mit den drei **Apply preset**-Schaltern kann auch ein eigenes Theme das Widget-Design im restlichen Chat nutzen. Ein Theme kann jeden Teil mit den folgenden Variablen überschreiben. Bitte Professor Mari um ein passendes Chat-Theme, wenn du das CSS nicht selbst schreiben möchtest.

| Teil | Klasse |
| --- | --- |
| Nachrichtenfelder in Roleplay und Game, Randbemerkungen, HUD-Widgets, Kartenpanel und Charakterbögen in Game sowie Chat-Eingabefelder | `.mari-chat-style-surface` |
| Protokolle, Inventar, Kampfpanels, Entscheidungen und Dialogfenster in Game; die Panels tragen zusätzlich `data-game-section` mit ihrem Namen, etwa `logs`, `inventory` oder `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| Game-Inhalte in einem Fenster wie dem Journal, die sich nach den Farben des Fensters richten | `.mari-game-section` |
| Conversation-Nachrichten (nur Schrift und Farben) | `.mari-chat-style-conversation` |
| Conversation-Nachrichtentext ohne Rahmen | `.mari-chat-style-text` |
| Chat-Bedienelemente, einschließlich Calls und Conversation-Gruppensteuerung | `.mari-chat-style-control` |
| Verlaufsschaltflächen: **Load More**, **Show older**, **Show newer**, **Latest** sowie **Older**, **All** und **Show more older logs** in den Game-Protokollen. Sie haben zusätzlich `.mari-chat-style-control` | `.mari-chat-history-pager` |
| Eine Nachricht aus HTML, etwa die gestaltete Karte eines Agenten. Darin gesetzte Textfarben bleiben erhalten, wenn **Apply preset colors** an ist | `.mari-html-content` |

| Variable | Wirkung |
| --- | --- |
| `--mari-chat-font-family` | Schrift für die zugehörigen Chatbereiche |
| `--mari-chat-bg` | Hintergrund der Felder; nimmt eine Farbe oder einen Farbverlauf an |
| `--mari-chat-text` | Lesbare einheitliche Textfarbe |
| `--mari-chat-border` | Umriss der Felder; nimmt eine Farbe oder einen Farbverlauf an |
| `--mari-chat-border-color` | Einheitliche Ersatzfarbe für den Rahmen |
| `--mari-chat-radius` | Eckenrundung, außer bei Conversation-Nachrichten |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | Hintergründe der Chat-Schaltflächen |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | Symbolfarbe und Rundung der Chat-Schaltflächen |
| `--mari-chat-input-bg` | Hintergrund in Eingabefeldern |

Ein Beispiel mit eingeschaltetem **Apply preset font** und **Apply preset colors**:

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

Nicht gesetzte Variablen folgen den Widget-Einstellungen und dem Preset. Damit diese Variablen über die eingebaute Gestaltung wirken, muss der zugehörige Schalter an sein. Conversation-Nachrichten behalten ihre eigene Form, auch wenn **Apply preset shape** an ist. Eigene Themes können die Klassen auch direkt ansprechen; Fokusumrisse, Menüs und Nachrichteninhalte dürfen dabei nicht von dekorativen Formen abgeschnitten werden.

Am Telefon klappt das Drei-Punkte-Menü zu runden Schaltflächen auf. Sein Auslöser ist `[data-chat-tools-menu-button]`, die geöffnete Spalte ist `[data-chat-tools-menu]`, und bei jedem Listeneintrag enthält `data-chat-tools-menu-item` die Fenster-ID. Tool-Schaltflächen nutzen `.mari-window-bubble.mari-chat-tools-button` und `data-chat-tools-menu-tool` mit derselben ID. Die Spalte hat keinen Fensterrahmen. Ihre Schaltflächen folgen den Widget-Farben und der Schaltflächengröße unabhängig von den drei Schaltern für den restlichen Chat und behalten dabei ihre runde Form.

<a id="styling-character-sheets"></a>
## Charakter-Sheets gestalten

Das Charakter-Sheet eines Regelwerks sieht in Roleplay und Game gleich aus. Mit diesen Klassen und Datenattributen kann ein Theme es gestalten.

| Teil | Klasse | Datenattribute |
| --- | --- | --- |
| Ganzes Sheet | `.mari-ruleset-sheet` | `data-ruleset` (Regelwerk-ID, etwa `local/my-rules`), `data-rank-display` (`value`, `label`, `dots`, `roman` oder `number`), `data-editing="true"` beim Bearbeiten |
| Titel und **Bogen bearbeiten** | `.mari-ruleset-sheet__header` | |
| Tabs | `.mari-ruleset-sheet__tabs` | Jeder Tab hat `data-tab-id` und `aria-selected` |
| Gruppenüberschrift | `.mari-ruleset-sheet__heading` | |
| Feld oben im Sheet | `.mari-ruleset-sheet__field` (in `.mari-ruleset-sheet__fields`) | `data-field`, bei berechneten Werten `data-derived` |
| Attribut | `.mari-ruleset-sheet__ability` (in `.mari-ruleset-sheet__abilities`); Punktzahl und Probenwert sind `__ability-score` und `__ability-value` | `data-ability`; Attributgruppen haben `data-section` |
| Pool, etwa Gesundheit | `.mari-ruleset-sheet__pool` (in `.mari-ruleset-sheet__pools`) | `data-pool`; Poolgruppen haben `data-pool-group` |
| Leiste | `.mari-ruleset-sheet__track` (in `.mari-ruleset-sheet__tracks`) | `data-track`; Wundleisten zusätzlich `data-wound="true"` |
| Zustände | `.mari-ruleset-sheet__conditions` | |
| Erlernte Fertigkeit oder Rettungswurf | `.mari-ruleset-sheet__rank` (in `.mari-ruleset-sheet__trained`, gruppiert in `.mari-ruleset-sheet__rank-group`); Rang beziehungsweise Probenwert bei `data-rank-display="value"`: `__rank-value`; Probenwert daneben auf Handys: `__rank-check`; Übung: `__practice` | `data-skill` oder `data-save`, `data-tier` (Stufen-ID), `data-rank` (`0` ungelernt, `1` nächste Stufe usw.) |
| Fertigkeit oder Rettungswurf beim Bearbeiten | `.mari-ruleset-sheet-editor__rank` | `data-skill` oder `data-save`, `data-tier`, `data-rank` |
| Liste, etwa Ausrüstung | `.mari-ruleset-sheet__list`; jede Zeile: `.mari-ruleset-sheet__list-row` | `data-list`; angehakte Zeilen haben `data-marked="true"` |

Dieses Beispiel zeigt Rang 2 eines Regelwerks als zwei Sterne. Ergänze für jeden zu ändernden Rang ein solches Regelpaar. Nutze es nur bei Punkt-, Namens-, Ziffern- oder Zahlenanzeige: Bei Probenwerten enthält `__rank-value` den Probenwert, den du damit verstecken würdest.

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## Verwandte Anleitungen

- [Anleitung für Theme-Autoren](theme-author-guide.md)
- [Wetter in deinem Theme](theme-weather.md)
- [Anleitung zum Card-CSS-Theming](card-css-theming.md)
- [Darstellungseinstellungen](appearance-settings.md)
- [Referenz zur Server-Konfiguration](../CONFIGURATION.md)
- [Fernzugriff](../REMOTE_ACCESS.md)
