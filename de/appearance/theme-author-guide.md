# Leitfaden für Theme-Autoren

In dieser Anleitung erfährst du, wie du eigene Themes erstellst und teilst. Der erste Teil führt dich Schritt für Schritt zu deinem ersten Theme – ohne Programmiererfahrung. Der Rest dient als Referenz: alle Farben, Bilder und Bereiche, die ein Theme ändern kann, und die Sicherheitsregeln für jedes Theme. Wie du ein Theme auswählst, ausprobierst, importierst oder entfernst, steht unter [Eigene CSS-Themes](custom-css-themes.md).

**Token-Vertrag Version 1** (`--mari-tokens-version: 1` auf `:root`). Die Namen in dieser Anleitung funktionieren auch nach neuen Releases weiter. Muss sich einer ändern, steigt die Versionsnummer, und die Änderung steht am Ende unter [Änderungen](#changes). Alles andere (weitere `--ov-*`-, `--mari-*`- und `--marinara-*`-Variablen, Tailwind-Klassen, Elementstruktur) ist intern und kann sich mit jedem Update ändern.

## Dein erstes Theme, Schritt für Schritt

Ein Theme ist eine kurze Liste von Einstellungen in CSS, der Sprache, mit der Webseiten Farben und Schriftarten festlegen. Für den Einstieg brauchst du keine CSS-Kenntnisse. Jede Zeile sieht so aus: `--name: value;` – ein **Token** (eine benannte Einstellung, die mit `--` beginnt), ein Doppelpunkt, der Wert und ein Semikolon.

1. Öffne **Bibliothek → Einstellungen → Darstellung** und klick in der Abschnittsleiste auf **CSS-Themes**.
2. Um ein Starter-Theme zu ändern, lade unter **Theme-Galerie durchsuchen** eines herunter, das dir gefällt. Such es unter **Starter-Themes** und klick auf **Klonen + bearbeiten** (das Kopiersymbol). Marinara erstellt deine eigene Kopie, zum Beispiel mit dem Namen „Petal OS (meine Kopie)“, und öffnet sie im Editor. Starter-Themes bleiben schreibgeschützt, das Original bleibt also immer erhalten. Um stattdessen ganz neu anzufangen, klick auf **Neues Theme**. Die Vorlage enthält Zeilen zwischen `/*` und `*/`, die ausgeschaltet sind. Entferne diese Zeichen um eine Zeile, um sie einzuschalten.
3. Gib im Namensfeld einen Namen ein.
4. Ändere eine Farbe. Such eine Zeile wie `--primary: #3fae7a;` und ersetze die Farbe. `#3fae7a` ist ein Hex-Farbcode. Jede Farbauswahl im Web liefert dir so einen Code. Auch Namen wie `teal` funktionieren.
5. Lass **Vorschau** eingeschaltet. Die App verändert sich beim Tippen, sodass du jede Änderung sofort siehst.
6. Schau unter den Editor. **Keine CSS-Probleme gefunden.** bedeutet, dass das CSS in Ordnung ist. Andernfalls erscheint jedes Problem mit seiner Zeilennummer, etwa ein fehlendes `;` oder `}`.
7. Klick auf **Speichern**. Dein neues Theme wird eingeschaltet, und Marinara fragt **Dieses Theme behalten?** Klick innerhalb von 15 Sekunden auf **Theme behalten**, sonst kehrt die App zur vorherigen Darstellung zurück.

Die Tokens, die die meisten zuerst ändern:

| Token | Was es einfärbt |
| ---------------- | -------------------------------------------- |
| `--background`   | Die Seite hinter allem |
| `--foreground`   | Haupttext |
| `--primary`      | Schaltflächen, Links und Hervorhebungen |
| `--card`         | Karten und Panels |
| `--sidebar`      | Die Seitenleisten für Chats und Bibliothek |
| `--border`       | Umrandungen |
| `--mari-font-ui` | Die App-Schrift, zum Beispiel `"Georgia", serif` |

Ein kleines Theme:

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

`:root { … }` enthält Einstellungen für jedes Farbschema. `[data-theme="dark"] { … }` enthält nur Einstellungen für Dunkel, `[data-theme="light"] { … }` nur für Hell. Um beim Arbeiten die vollständige Token-Liste zu sehen, öffne **Referenz der CSS-Variablen** unter dem Editor oder lies unten unter [Farb-Tokens](#colour-tokens) weiter.

### Bilder und Schriftarten hinzufügen

Öffne **Bilder und Angaben zum Teilen (Autor, Version, Vorschaubild, Schriftarten)** unter dem Editor und klick auf **Bilder hinzufügen**. Klick auf den Namen eines Bildes, um es an der Cursorposition in dein CSS einzufügen. Unter [Bilder](#pictures) und [Hintergrundbilder](#backdrops) erfährst du, wo Bilder eingesetzt werden können.

Bilder und Schriftarten müssen im Theme enthalten sein. Ein Theme kann nichts von anderen Webseiten laden. Ein Link zu einem Bild oder einer Google-Schrift in deinem CSS funktioniert daher nicht.

### Professor Mari um Grafiken bitten

Wenn du unter **Verbindungen** ein Bildmodell eingerichtet hast (Codex, NovelAI, ComfyUI, ein OpenAI-Bildmodell und so weiter), kann Professor Mari die Bilder für ein Theme erstellen und darin einfügen. Bitte sie in einfachen Worten darum, zum Beispiel „erstelle für mein Harbor-Theme einen Nachthimmel als Hintergrund“ oder „gib den Home-Karten einen Messingrahmen“.

1. Mari bearbeitet nur deine eigenen Themes. Klick bei einem Starter-Theme zuerst auf **Klonen + bearbeiten** und bitte sie, die Kopie zu bearbeiten.
2. Sie schreibt den Bild-Prompt selbst und sendet ihn genau so an dein Bildmodell. Deine Bildstilprofile und Prompt-Präfixe (meist für Charakterbilder eingerichtet) bleiben außen vor, damit aus einem Hintergrund kein Porträt wird.
3. Mari schaut sich jedes Bild selbst an (kleine Bilder vergrößert, durchsichtige Bereiche auf Grau), bevor sie es beschreibt. Auch du siehst es, bevor sich etwas ändert. Bitte um mehrere Versionen zur Auswahl (bis zu 4 gleichzeitig) oder um Korrekturen wie „schneide es auf die obere Hälfte zu“, „mach den weißen Hintergrund durchsichtig“ oder „mach es kleiner“. Jede Korrektur ergibt eine neue Version, die früheren bleiben erhalten.
4. Wenn du zustimmst, speichert Mari das Bild in deinem Theme (als WebP, genau wie **Bilder hinzufügen**) und fügt es in das Theme-CSS ein. Es erscheint unter **Bilder und Angaben zum Teilen** wie jedes selbst hinzugefügte Bild.

Gezeichnete Verzierungen wie Leisten, Zäune und Senden-Schaltflächen sind SVG-Bilder. Mari kann sie direkt umfärben, ohne dein Bildmodell, und sie bleiben scharf.

Jedes Bild dauert so lange, wie dein Bildmodell braucht, oft eine halbe bis anderthalb Minuten. Nutzt deine Bildverbindung einen eigenen ComfyUI-Workflow, wird darin enthaltener Text weiterhin mitgesendet.

### Dein Theme teilen

1. Fülle unter **Bilder und Angaben zum Teilen** die Felder **Autor**, **Version** (etwa `1.0`), **Beschreibung** und **Vorschaubild** aus und wähle **Erstellt für** (Dunkel, Hell oder beides). Um zusammen mit dem Theme deine Farben und Schriftart vorzuschlagen, klick unter **Einstellungen** auf **Meine aktuelle Darstellung verwenden**. Speichere.
2. Klick in der Zeile deines Themes auf **Exportieren** (das Upload-Symbol). Marinara speichert eine einzelne `.json`-Datei mit CSS, Bildern und Schriftarten.
3. Hast du Grafiken oder Schriftarten anderer verwendet, öffne die Datei in einem Texteditor und ergänze Urheberangaben und eine Lizenz. Siehe [Theme-Dateien](#theme-files).
4. Verschicke diese Datei. Die andere Person importiert sie mit **Datei importieren** und sieht vor der Installation deinen Namen, die Urheberangaben und eine Liste aller Änderungen durch das Theme.

### Wenn etwas schiefgeht

Marinara hält die obere Leiste, die Seitenleisten, <kbd>Ctrl</kbd>+<kbd>K</kbd> und die Nachrichtenbox bedienbar, egal was ein Theme macht. Blendet dein Theme einen dieser Bereiche aus, verschiebt oder verdeckt ihn, zeigt dir Speichern das Problem. Du kannst trotzdem **Trotzdem speichern** wählen, aber Marinara schaltet das Theme in einem Tab aus, sobald es einen dieser Bereiche beeinträchtigt. Um jederzeit zur normalen Darstellung zurückzukehren, drück dreimal <kbd>Esc</kbd>, häng `?safe` an die Adresse an oder drück <kbd>Ctrl</kbd>+<kbd>K</kbd> und gib „Eigenes Theme“ ein.

Starter-Themes eignen sich gut zum Lernen. Klone eines und lies sein CSS, um zu sehen, wie es die Tokens und Bereichs-Hooks unten verwendet.

## Wie ein Theme Vorrang bekommt

Das CSS der App liegt in Kaskadenebenen, die ganz am Anfang von `index.html` deklariert werden:

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- Ein Theme liegt **außerhalb der Ebenen**, daher gewinnt ein einfacher Selektor im Theme gegen jede App-Regel ohne `!important`,
  unabhängig von der Spezifität der App-Regel.
- `mari-pickers` enthält die Auswahlfelder unter Darstellung (Hintergrund, Akzent, Schriftarten, Chat-Farben). Diese Ebene liegt
  über den App-Standardwerten und unter einem Theme. Die Theme-Farben haben also Vorrang, und
  Darstellung zeigt an, wenn ein Theme eine Auswahl überschreibt.
- `!important` funktioniert auch im Theme. Solche Regeln werden nach `mari-theme-important` kopiert, das
  Vorrang vor den `!important`-Regeln der App hat.
- `mari-protected` hält die obere Leiste, die Chat-Seitenleiste, die Bibliotheksseitenleiste und Strg+K an ihrem Platz.
  Ein Theme darf sie umgestalten (Farben, Schriftarten, Rahmen, Radius, Schatten), aber nicht ausblenden, verschieben, verkleinern oder
  verdecken. Versucht es das, wird es in diesem Tab ausgeschaltet und der Grund angezeigt.
- Ein Übergang darf höchstens eine Sekunde warten, bevor er beginnt (`transition-delay` oder die zweite Zeitangabe
  in `transition`). Ein Theme mit längerer Verzögerung wird abgelehnt, damit nichts erst lange
  nach der Prüfung des Bildschirms erscheint. Animationen dürfen beliebige Verzögerungen verwenden.

Der Weg zurück funktioniert immer: `?safe` in der URL, **dreimal Escape** oder Strg+K > „Eigenes Theme“
schaltet das Theme aus. Ein neues Theme fragt „Dieses Theme behalten?“ und kehrt nach 15 Sekunden zur vorherigen Darstellung zurück.

## Farb-Tokens

### Basis (von jedem visuellen Stil definiert)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

Werte sind vollständige CSS-Farben (`#1b1530`, `rgb(…)`, `oklch(…)`). Bloße HSL-Tripel wie
`270 25% 8%` (die shadcn-Konvention) sind hier **nicht** gültig.

Grenze Hell und Dunkel getrennt mit `[data-theme="light"]` und `[data-theme="dark"]` ein.

### Neues Layout

| Token | Verwendung |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--ov-line`                                                      | Feine Linien und Panel-Rahmen |
| `--ov-text`, `--ov-muted`, `--ov-dim`                            | Text, sekundärer Text, blasser Text |
| `--ov-accent`                                                    | Akzentstellen (standardmäßig `--primary`) |
| `--ov-hover`, `--ov-active-bg`                                   | Hintergründe beim Darüberfahren und Drücken |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | Farben der Chat-Modi in der Chat-Seitenleiste und in Editoren |
| `--ov-serif`                                                     | Titelschrift (folgt `--mari-font-heading`) |
| `--mari-selected-tint`                                           | Ausgewählte Zeilen, abgerundete Labels und Schalter. Standardmäßig neutral (`--foreground`); mit `var(--primary)` wird die Auswahl akzentfarben |
| `--mari-selected-bg`, `--mari-selected-ring`                     | Aus der Tönung abgeleitet (10 % und 18 %) |

### Theme-Tokens (v1)

Jedes Token verwendet standardmäßig die Darstellung der App. Der helle Modus hat eigene, gut lesbare Werte.

| Token | Verwendung |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `--mari-font-ui`                                                                                         | Die Schrift der gesamten App |
| `--mari-font-heading`                                                                                    | Seiten- und Abschnittstitel |
| `--mari-font-chat`                                                                                       | Nachrichtentext in Roleplay- und Conversation-Chats |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game`                                   | Home-Chips, letzte Chats, der Launcher für neue Chats, kleine Labels über Home-Widget-Titeln |
| `--mari-home-pink`, `--mari-home-violet`                                                                 | Die übrigen Akzente der Home-Widgets |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline`               | Anwesenheitspunkte und -beschriftungen |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger`                                            | Game-Anzeigen und HP-Balken. Im normalen Zustand hat die eigene Widget-Farbe weiterhin Vorrang; bei Gefahr gilt immer das Token |
| `--mari-game-combat`, `--mari-game-combat-text`                                                          | Die Kampf-Schaltfläche im Game-Chat |
| `--mari-stage-empty-bg`                                                                                  | Die Game-Bühne, bevor ein Szenenbild geladen ist (beliebiger `background`, auch Verläufe) |
| `--mari-scrim`                                                                                           | Der abgedunkelte Hintergrund hinter Strg+K |
| `--mari-user-avatar-placeholder`                                                                         | Dein Avatar, wenn du kein Bild hast (ein Verlauf) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | Der Verlauf auf Karten ohne Bild. Jede Karte behält ihren eigenen Farbton; mit diesen Werten (als Prozentangaben) werden die Verläufe dezenter |
| `--mari-app-backdrop`                                                                                    | Ein Bild oder Verlauf hinter der gesamten App, einmal gezeichnet (siehe unten) |
| `--mari-accent-fx-animation`                                                                             | Die Animation von Akzentpuls oder RGB-Modus, solange einer davon eingeschaltet ist, sonst `none` |

### In v1.1 ergänzte Theme-Tokens

Diese haben erst einen Wert, wenn ein Theme ihn setzt. Bis dahin gilt die eigene Einstellung des Nutzers.

| Token | Verwendung |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-text-outline`                                                                                                                                                                                                        | Der Umriss des Nachrichtentexts, zum Beispiel `0` zum Ausschalten oder `1px #3b2a1a`. Sonst gilt die Einstellung Text-Umriss / Kontur des Nutzers |
| `--mari-dialogue-color`                                                                                                                                                                                                      | Dialogfarbe, wenn Charakter oder Persona keine eigene hat (deren eigene Farbe hat weiterhin Vorrang) |
| `--mari-chat-font-size`                                                                                                                                                                                                      | Größe des Nachrichtentexts. Die Mindestgröße unter Barrierefreiheit gilt weiterhin |
| `--mari-composer-placeholder`                                                                                                                                                                                                | Der Platzhalter der Nachrichtenbox als Zeichenfolge in Anführungszeichen: `"> waiting for user input..."`. Setze ihn auf `:root` oder auf eine einzelne Nachrichtenbox, etwa `[data-composer="game"]`. Text, der nach Schlüsseln oder Passwörtern fragt, wird ignoriert |
| `--mari-page-veil`                                                                                                                                                                                                           | Eine Farbe über Einstellungen, Bibliothek, Editoren und Dokumentation, damit lange Texte vor einem Hintergrundbild lesbar bleiben. Standardmäßig `transparent` |
| `--mari-page-floor` | Die fast deckende Fläche, auf der jede ganze Seite über einem Hintergrundbild steht. Standard: `color-mix(in srgb, var(--background) 94%, transparent)`; `transparent` entfernt sie |
| `--mari-top-bar-bg`                                                                                                                                                                                                          | Ein vollständiger `background`-Wert für die obere Leiste: ein Bild, ein Verlauf oder mehrere Ebenen. `--mari-top-bar-rendering: pixelated` hält Pixel-Art scharf. Tabs und Symbole bleiben immer sichtbar darüber |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius`                                                                                                                                                                        | Über Grafiken in der oberen Leiste liegen alle Tabs, Tabs offener Chats, Symbolschaltflächen und das Logo auf einer Fläche, damit sie lesbar bleiben. Diese Tokens setzen deren Farbe und Eckenradius (Standard `0.5rem`); setze den Radius für eckige Pixel-Schaltflächen auf `0`. |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | Ein Streifen unter den Tabs der Topbar (etwa Ticker oder Zaun) wandert in die Zeile einer Tab-Gruppe, solange diese sichtbar ist (`:root[data-ov-tabrow]`; die Zeile ist `[data-tab-row]`). Setze auf `[data-tab-row]` einen `background`-Wert, die Höhe und den Platz unter den Tabs (standardmäßig die Höhe; `0px` legt ihn dahinter). `[data-mari-part="tab-row-strip"]` lässt sich animieren. Entferne den Streifen unter `:root[data-ov-tabrow]` selbst aus der Topbar. |
| `--mari-msg-head-rule`                                                                                                                                                                                                       | Die Linie unter dem Namen in Roleplay-Nachrichten (ein `border-bottom`-Wert wie `none` oder `2px dashed currentColor`) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg`                                                                                                         | Rahmen und Fläche jedes Home-Widgets, einschließlich Professor Mari |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Typografie der Home-Widgets. Widgets werden höher, wenn der Text mehr Platz braucht, statt ihn abzuschneiden |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale`                                                                                                                        | Das kleine Label über Widget-Titeln, der Text auf Professor Maris Schaltfläche Frag Professor Mari und die Größe von Maris Bild (1 = Standard) |
| `--mari-home-wash`                                                                                                                                                                                                           | Die Tönung, die Home über ein Hintergrundbild legt (Standard: 65 % der Kartenfarbe); `transparent` zeigt die Grafik in voller Stärke |
| `--mari-home-art`                                                                                                                                                                                                            | `none` blendet die Standardbilder auf Home-Karten aus; sie werden erst bei Bedarf geladen, ausgeblendete also nie heruntergeladen. Das sind kleine Bilder in einzelnen Karten (Neuigkeiten, Rund um den Tisch), kein Home-Hintergrund: Grafiken hinter Home sind der App-Hintergrund |
| `--mari-ambient` (und `-opacity`, `-blend`, `-animation`)                                                                                                                                                                    | Die Umgebungsebene: siehe Umgebungsebene |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji`                                                                                                                                            | Ein Bild statt des Symbols in der Nachrichtenbox (ein `background-image`-Wert) |
| `--mari-cursor`, `--mari-cursor-pointer`                                                                                                                                                                                     | Ein Mauszeiger als Bild (ein vollständiger `cursor`-Wert). Er hat Vorrang vor Eigener Mauszeiger, solange das Theme eingeschaltet ist |

### In v1.4 ergänzte Theme-Tokens

Wie die v1.1-Tokens hat die erste Gruppe keine Wirkung, bis ein Theme sie setzt.

| Token | Verwendung |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-message-time`                                                                          | Die Farbe der Nachrichtenzeiten (`[data-mari-part="time"]`) in jedem Chat-Modus |
| `--mari-chat-wash`                                                                             | Die Tönung über dem Hintergrund eines Roleplay-Chats als vollständiger `background`-Wert. Standardmäßig dunkel, in Hell lavendelweiß. `none` entfernt sie |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal`                          | Die Statuspunkte der Lorebook-Einträge |
| `--mari-toast-font-size`                                                                       | Textgröße von Kurzmeldungen (sie nutzen bereits `--mari-font-ui`) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size`                                  | Die Verknüpfungszeilen Die Engine kennenlernen und Community auf Home. Ist nur `--mari-home-widget-text-size` gesetzt, folgen sie diesem Wert; Beschreibungen mit dem Faktor 0,85 |
| `--mari-min-ui-text`                                                                           | Eine Untergrenze für die kleinsten App-Texte (Labels, Zähler und Chips mit 9–12 px). Auch Tailwinds `--text-xs`, `--text-sm` und `--text-base` lassen sich setzen |
| `--mari-user-avatar-image`                                                                     | Ein Bild für deinen Avatar, wenn die Persona keines hat. Ohne Token zeigt der Platzhalter jetzt das eigene Bild der Persona, falls vorhanden |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | Plätze für zusätzliche Gestaltung, siehe unten |

Diese ersetzen zuvor fest in der App vorgegebene Werte und fallen auf die Standarddarstellung zurück:

| Token | Verwendung |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chrome-accent`                                                              | Die Unterstreichung des aktiven Tabs, Editor-Rahmen, Auswahlfelder und Verbindungsansichten |
| `--mari-chrome-muted`                                                               | Grauer sekundärer Text in Panels, Seitenleisten und Home (Standard: 58 % der Textfarbe der Bedienoberfläche) |
| `--mari-resource-accent`, `--mari-resource-<type>`                                  | Die Bibliotheksfarben je Typ: `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game`           | Zeilenfarben in Strg+K je Modus |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | Die Kampf-Schaltfläche im Game-Chat (beide Hintergründe sind ein vollständiger `background`, Verläufe funktionieren also; gib ihr auch eine einfarbige Ebene) |
| `--mari-accent-text`                                                                | Der Akzent als kleiner Text oder Symbol (aktive Tabs, Abschnittslabels, Links). Standard: die Akzentfarbe, in Hell gerade so weit abgedunkelt und in Dunkel aufgehellt, dass sie lesbar ist |
| `--mari-top-bar-plate-active`                                                       | Die Fläche hinter einem aktiven Bedienelement in der oberen Leiste, wenn diese Grafiken enthält (Standard: die Flächenfarbe mit 20 % Akzent gemischt) |
| `--mari-chat-header-bg`                                                             | Der Verlauf hinter der Conversation-Kopfzeile (Standard: die Seitenfarbe mit 88 %, die ins Transparente ausläuft; `none` bei einem App-Hintergrundbild) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow`                               | Der Innenabstand der Home-Begrüßung und das Leuchten hinter der Kopfzeile eines Home-Widgets |

Die App stellt außerdem `--mari-top-bar-height` auf `<html>` bereit (die tatsächliche Höhe der oberen Leiste, die
sich ändert, wenn ein Theme die Leiste höher macht), damit ein Theme seine eigenen Ebenen darunter mit Abstand platzieren kann.

### In v1.5 ergänzte Theme-Tokens

Für lange Antworten und Bereiche, die zuvor interne Klassen erforderten. Jedes wirkt erst, wenn ein Theme
es setzt, außer dort, wo ein Standardwert angegeben ist.

| Token | Verwendung |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-chat-column`                                       | Die gemeinsame Roleplay-Spalte für Nachrichten und Nachrichtenbox (Standard 58rem). Die eigene Einstellung unter Chat-Einstellungen → Breite des Chat-Bereichs hat weiterhin Vorrang |
| `--mari-message-measure`                                   | Die maximale Zeilenlänge des Nachrichtentexts, zum Beispiel `68ch` (Roleplay und Conversation) |
| `--mari-chat-line-height`                                  | Zeilenhöhe des Nachrichtentexts in jedem Chat-Modus (Standard 1,5). Barrierefreiheit → Zeilenabstand hat weiterhin Vorrang |
| `--mari-dialogue-weight`                                   | Die Schriftstärke wörtlicher Rede (`[data-mari-part="dialogue"]`), zum Beispiel `400`, damit eine lange Rede kein fetter Textblock wird |
| `--mari-dialogue-color`                                    | Wirkt jetzt auch, wenn die `--mari-chat-*`-Farben des Themes die Chat-Einfärbung einschalten; dasselbe gilt für Theme-Farben für Kursivtext und Links |
| `--mari-paragraph-gap`                                     | Abstand zwischen Absätzen statt einer Leerzeile, zum Beispiel `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg`        | `on`: Die Namenszeile einer langen Roleplay-Antwort bleibt beim Scrollen durch die Antwort am oberen Chatrand stehen (Desktop und Tablet). Der Hintergrund entspricht standardmäßig dem der Sprechblase |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | Position der angehefteten Zeile (Standard: obere Kante des sichtbaren Chats) und wie weit sie über den Text hinausragt (Standard 1rem) |
| `--mari-phone-avatar`                                      | `hidden`: Auf Smartphones entfällt die Avatarspalte in Roleplay, sodass die Antwort die gesamte Breite bekommt |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring`       | Das kleine Bild neben dem Namen auf Smartphones (**Profilbilder auf Handys: Mini**, der Standard): Größe und Ring als `box-shadow`. Es ist `[data-mari-part="mini-avatar"]` mit `data-role` (`user`, `assistant`) |
| `--mari-phone-convo-avatar`                                | `full`: Conversation-Chats behalten auf Smartphones die volle Avatarspalte, auch wenn der Nutzer **Mini** gewählt hat |
| `--mari-vn-fade`                                           | Der Verlauf am unteren Rand des VN-Textfelds, solange darunter noch weiterer Absatztext liegt (Standard 1,75rem, `0` schaltet ihn aus) |
| `--mari-message-actions`, `--mari-swipe-counter`           | Die Farbe der Tools unter einer Nachricht und ihres Swipe-Zählers „2 / 5“ |
| `--mari-card-art-placeholder`                              | Ein vollständiger `background` für Bibliothekskarten ohne Bild statt des Verlaufs mit zufälligem Farbton |
| `--mari-chat-row-art-opacity`                              | Das Bild des offenen Chats hinter seiner Zeile in der Chat-Seitenleiste (Standard 0,14; `0` blendet es aus) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient`    | Erreichen jetzt auch Flächen, die den Akzent von `<html>` lesen (die Tabs Convo / Roleplay / Game, Rahmen der Bedienoberfläche) |
| `--mari-focus-frame-outset`                                | Wie weit der Fokusrahmen über seine Fläche hinausragt (eine Länge, höchstens 2rem; siehe Gestaltungsplätze) |
| `--mari-scrim`                                             | Die abgedunkelte Ebene hinter Dialogfenstern |
| `--mari-confirm-scrim`                                     | Die helle, durchsichtige Ebene hinter kurzen Bestätigungsdialogen (halte sie dezent, damit helle Themes ruhig bleiben) |

Die App stellt außerdem `--mari-center-x` auf `<html>` bereit, solange ein Theme eine Umgebungsebene hat: die
horizontale Mitte des Chat-Bereichs. So kann eine Maske die Lesespalte freihalten, unabhängig davon, ob die Seitenleisten
geöffnet sind. `--mari-gutter-mask` verwendet diesen Wert.

## Bilder

Ein Theme enthält seine Bilder unter `images` in der Theme-Datei. Sein CSS verwendet sie anhand ihres Namens:

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- Bilder zählen zum Paketbudget von 6 MiB, nicht zum CSS-Limit von 256 KiB, damit auch große Grafiken hineinpassen.
- Öffne im Editor **Bilder und Angaben zum Teilen** und drück **Bilder hinzufügen**. PNG und JPEG werden
  beim Einfügen als WebP gespeichert (kleine Bilder verlustfrei, damit Pixel-Art und 9-Slice-Rahmen scharf bleiben;
  höchstens 2.560 px an der längsten Seite). Klick auf einen Bildnamen, um `url("theme:name")` an der Cursorposition einzufügen.
- Beim Import eines Themes passiert dasselbe: Als `data:`-URLs eingebettete Bilder wandern aus dem CSS
  nach `images`, unbewegte PNG- und JPEG-Bilder werden WebP, und die Vorschau listet jedes Bild mit seiner Größe auf
  (mit dem Kontrollkästchen „Stattdessen Originaldateien behalten (größer)“).
- Namen mit `theme:` finden auch die `backgrounds` des Themes anhand ihres Namens. Grafiken für die
  Chat-Hintergrundgalerie lassen sich so auch im CSS nutzen, unabhängig davon, ob der Nutzer sie zur Galerie hinzufügt.
- Beim Übernehmen des Themes wird jedes Bild zu einer kurzen `blob:`-URL desselben Ursprungs: Nichts wird
  heruntergeladen, und ein mehrfach verwendetes Bild wird nur einmal dekodiert.
- GIF, APNG, animiertes WebP und SVG mit `<animate>` gelten als bewegte Bilder. Die Importvorschau
  weist darauf hin; mit Bewegung reduzieren zeigen sie ihren ersten Frame.

## Hintergrundbilder

Setze `--mari-app-backdrop` auf `:root`, um eine Grafik hinter der App anzuzeigen:

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

Sie wird einmal auf einer eigenen festen Ebene unter der gesamten App gezeichnet (`[data-mari-part="app-backdrop"]`, sodass
Home-Dekorationen und das helle Schema sie nie verdecken) und erscheint auch hinter Chats: Die Flächen von Roleplay,
Conversation und Game werden transparent, der Standard-Chat-Hintergrund tritt zurück. Ein
vom Nutzer gewählter Chat-Hintergrund bleibt darüber sichtbar. Panels behalten `--card` und
`--sidebar`. Mach diese also halbtransparent, wenn die Grafik dahinter sichtbar sein soll, und nutze
`--mari-page-veil`, um ganze Seiten zu tönen. Um Seiten ein eigenes Panel zu geben, gestalte
`[data-mari-part="page"]` (siehe Hooks): Darin liegen jede Bibliotheksseite, Editoren, Einstellungen und Dokumentation,
sodass Lorebooks dasselbe Panel erhalten wie Charaktere. Über einem Hintergrundbild steht jede ganze Seite außerdem auf einer fast deckenden Fläche aus deinem `--background` (`--mari-page-floor`, standardmäßig 94 %), damit lange Listen und Editoren lesbar bleiben. Setz `--mari-page-floor` auf eine andere Farbe oder auf `transparent`, damit mehr vom Bild durchscheint. Ein Theme, das `[data-mari-part="page"]` mit `!important` gestaltet, ersetzt die Fläche durch sein eigenes Panel.

| Token | Standard |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-app-backdrop`            | Ein Bild oder Verlauf |
| `--mari-app-backdrop-size`       | `cover` (versuch `auto` oder `64px` für Kacheln) |
| `--mari-app-backdrop-position`   | `center` |
| `--mari-app-backdrop-repeat`     | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering`  | `auto` (`pixelated` für Pixel-Art) |
| `--mari-app-backdrop-layers`     | Ein vollständiger `background`-Wert mit mehreren Ebenen, etwa `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. Er hat Vorrang vor den Tokens für ein einzelnes Bild |

Eigene Bilder sind der flexibelste Teil eines Themes: Hintergrundbilder, ein Streifen für die obere Leiste, Rahmen für Home-Widgets
und Nachrichten (`border-image` oder ein `background` auf einem beliebigen Bereichs-Hook), Kachelmuster
und mitgelieferte Pixelschriften liegen alle in der Theme-Datei und werden in der Importvorschau aufgelistet.
Die Nutzereinstellung Darstellung > Barrierefreiheit > Stärke der Theme-Grafik schwächt Hintergrundbild und Umgebungsebene
ab. Hoher Kontrast begrenzt sie auf höchstens 25 %; ein Theme kann beides nicht aufheben.

## Umgebungsebene

`--mari-ambient` nimmt einen vollständigen `background`-Wert für eine Ebene über Chat und Seiten, aber
**unter** der oberen Leiste und beiden Seitenleisten an: Regen, fallende Blätter, Scanlinien, eine Vignette.

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

`--mari-ambient-blend` setzt einen `mix-blend-mode`; `[data-mari-part="ambient"]::before` und
`::after` stehen für zwei weitere Ebenen zur Verfügung. Die Ebene fängt nie Klicks ab, hält bei Bewegung reduzieren
an (ihre Bilder werden zu Standbildern) und muss überwiegend durchsichtig bleiben: Würde die Umgebungsebene
von einem Theme den Chat verdecken, wird es ausgeschaltet. Verwende sie statt eines bildschirmfüllenden `body::after`, das
die Schutzprüfung als Abdeckung der App behandelt.

Die Ebene hält an, wenn niemand sie sehen kann: während die App im Hintergrund ist (ein anderer Tab
oder eine andere App hat den Fokus) und auf Smartphones und Tablets, wenn eine ganze Seite wie eine Bibliotheksseite, ein Editor oder
die Einstellungen den Chat verdeckt. Endlose Animationen an anderen Stellen des Themes pausieren im Hintergrund ebenfalls. Sie
laufen danach an derselben Stelle weiter. Stimme daher nichts Wichtiges zeitlich auf sie ab.

Der eigene Hintergrund eines Chats ist ein `<img data-mari-part="backdrop">`. Der Standardhintergrund (wenn keiner gewählt ist)
hat außerdem `data-default-background="true"`, sodass ein Theme nur diesen ersetzen kann:

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## Wetter

Wenn die Geschichte Wetter hat (Einstellungen > Darstellung > Effekte > Dynamische Wettereffekte, mit eingeschaltetem World State-Agenten),
zeichnet die App Regen, Schnee, Nebel, Blütenblätter, Sterne, eine Sonne oder einen Mond über den Chat. Ein Theme kann
all das mit `--mari-weather-*`-Tokens umgestalten und seine eigenen Grafiken an das Wetter anpassen.

Neu dabei? [Wetter in deinem Theme](theme-weather.md) führt dich Schritt für Schritt mit Bildern durch das Thema.

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

Die App übernimmt weiterhin das gesamte Zeichnen. Sie liest diese Tokens beim Laden des Themes, beim Wechsel des
Farbschemas und beim Bearbeiten des Themes, prüft jeden Wert und ignoriert alles, was sie nicht
versteht. So funktioniert Wetter für Tag und Nacht (oder je Chat) wie jedes andere Token.

| Token | Werte |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mari-weather-style`           | `smooth` (Standard) oder `pixel`: Die Ebene wird in niedriger Auflösung gezeichnet und scharf hochskaliert; Partikel werden zu quadratischen Zellen |
| `--mari-weather-pixel-size`      | 2 bis 6 (px pro Zelle), Standard 3 |
| `--mari-weather-<kind>-color`    | Eine einfache Farbe (`#hex`, ein Farbname, `rgb()`, `hsl()`), keine Verläufe oder Bilder |
| `--mari-weather-<kind>-image`    | Bis zu 4 eigene Bilder des Themes, `url("theme:a.png") url("theme:b.png")`; jedes Partikel wählt eines. Im glatten Stil drehen sich Blätter, Blütenblätter und Asche beim Fallen |
| `--mari-weather-<kind>-size`     | Faktor 0,5 bis 3. Im Pixelstil wird ein Bild in seiner eigenen Größe mal diesem Faktor gezeichnet, sodass Pixel-Art ihre Pixel behält (Grafikpixel = Größe x 1 px) |
| `--mari-weather-<kind>-shape`    | `round` oder `square` (glatter Stil; Quadrate für „Datenschnee“ oder Funken) |
| `--mari-weather-amount`          | 0,25 bis 1: Ein Theme kann das Wetter ausdünnen, nie verstärken |
| `--mari-weather-speed`           | Faktor 0,5 bis 1,5 |
| `--mari-weather-strength`        | Faktor 0,5 bis 1,5 für die Sichtbarkeit der Partikel (feiner Regen über einer dunklen Stadt) |
| `--mari-weather-tint-strength`   | Faktor 0 bis 1 für die Standard-Himmelstönung (blau bei Regen, dunkel bei Nacht) |
| `--mari-weather-rain-length`     | Faktor 0,5 bis 3 für die Länge der Regenstreifen |
| `--mari-weather-sun`, `-moon`    | `none`, wenn dein Hintergrundbild eine eigene Sonne oder einen eigenen Mond zeigt |
| `--mari-weather-lightning-color` | Die Blitzfarbe. Stärke und Zeitabstände bleiben bei den sanften, epilepsiesicheren Werten der App |
| `--mari-weather-lightning-bolt`  | `on`, `none` oder 0,5–3 (Breite): ein verzweigter Blitz entlang der linken oder rechten Seite bei jedem Aufleuchten, der damit verblasst |

Arten: `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (windiges Wetter), `petal` (Blüten), `ember`, `ash`,
`sand`, `firefly`, `star`, `aurora` sowie `sun` und `moon` (Farbe, Größe und ein Bild).

### Grafiken, die dem Wetter folgen

Während das Wetter eines Chats angezeigt wird, trägt `<html>` zwei Wörter aus festen Listen (nie den eigenen Text der Geschichte):

| Attribut | Werte |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky`     | `dawn`, `day`, `dusk`, `night`                                                                                  |
| `data-mari-shelter` | `indoors` oder `outdoors` (fehlt, wenn die App es nicht erkennen kann) |

In Innenräumen zeichnet die App keine Partikel, Nebelbänke, Sonne, Mond oder Sterne, nur die Tönung und das Aufleuchten
von Blitzen. Die Wetter-Tokens eines Themes wirken daher nur draußen. Die Attribute werden unabhängig von Umgebungsanimationen & -effekte reduzieren gesetzt (ein Hintergrundwechsel bewegt nichts) und
entfernt, wenn der Chat kein Wetter hat oder der Nutzer es ausschaltet. Verwende sie, um einen sonnigen
Hintergrund bei Regen grau werden zu lassen oder die eigene Umgebungsebene auszublenden, damit sie das Wetter nicht verdoppelt:

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### Was der Nutzer bestimmt

- Ein Theme kann Wetter weder ein- noch ausschalten; das entscheidet der Schalter des Nutzers.
- Umgebungsanimationen & -effekte reduzieren (oder die Einstellung für reduzierte Bewegung auf dem Gerät) unterdrückt die Wetterdarstellung ganz.
- Reduzierte Paint-Effekte entfernt Tönung, Leuchteffekte und Sonnenuntergangsfärbung und zeichnet 60 % der Partikel.
- Stärke der Theme-Grafik schwächt das Wetter eines Themes wie dessen Hintergrundbild ab, und Hoher Kontrast begrenzt es auf höchstens 25 %.
- Auf jedem Gerät hält die Wetterdarstellung an, während ein Panel, ein Editor oder Mari den Chat verdeckt.

Petal OS (Pixelwetter und eigene Blütenblätter), NEON//GRID (türkisfarbener Streifenregen) und Lantern Path (gemalte
Blätter, bei schlechtem Wetter vergrauende Hintergründe) sind praktische Beispiele: Öffne eines mit **Klonen + bearbeiten**, um sein CSS zu lesen.

## Akzenteffekte

Akzentpuls und RGB-Modus animieren im neuen Layout einige Akzentstellen („+ Neu“, primäre Schaltflächen,
die Avatar-Kachel des Assistenten) mit einem CSS-Filter. Pro Frame wird nichts umgeschrieben. Ein Theme kann:

- Akzentpuls mit `:root { --marinara-theme-accent-pulse: enabled; }` für seine Nutzer einschalten;
- eigene Elemente mit `animation: var(--mari-accent-fx-animation);` hinzufügen.

Beide halten bei `prefers-reduced-motion` und der App-Einstellung „Umgebungsanimationen & -effekte reduzieren“ an.

## Hooks

### Auf `<html>`

| Attribut | Werte |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `data-theme`                    | `dark`, `light`                                                                                          |
| `data-visual-theme`             | `default` (Marinara), `sillytavern` (Dottore), `stage`                                                   |
| `data-overhaul`                 | `on` (neues Layout, Desktop), `mobile` (neues Layout, Smartphone und Tablet); im alten Layout nicht vorhanden |
| `data-custom-theme`             | Die ID des aktiven Themes |
| `data-seasonal-theme`           | Die saisonale Darstellung, wenn eine eingeschaltet ist |
| `data-mari-accent-fx`           | `pulse` oder `rgb`, während ein Akzenteffekt läuft |
| `data-chat-id`                  | Die ID des offenen Chats |
| `data-chat-open-mode`           | Der Modus des offenen Chats: `roleplay`, `conversation`, `game` |
| `data-chat-tags`                | Die Tags des offenen Chats, kleingeschrieben mit `-` statt Leerzeichen: Gestalte eine Geschichte mit `:root[data-chat-tags~="horror"]` |
| `data-mari-chat-art-behind`     | Vorhanden, solange der Chat-Hintergrund hinter den Seitenpanels angezeigt wird (`--mari-chat-art` ist das Bild) |
| `data-marinara-reduced-effects` | Vorhanden, wenn Umgebungsanimationen reduziert sind |
| `data-mari-a11y-line-height`    | Vorhanden, wenn der Nutzer den Zeilenabstand vergrößert hat (`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | Vorhanden, wenn der Nutzer den Zeichenabstand vergrößert hat (`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus`          | Vorhanden, wenn starke Fokusringe eingeschaltet sind |
| `data-mari-contrast`            | `more`, wenn hoher Kontrast eingeschaltet ist (durch den Nutzer oder auf Anforderung des Geräts) |
| `data-mari-cvd-safe`            | Vorhanden, wenn Farben für Farbsehschwäche eingeschaltet sind |
| `data-mari-weather`             | Das Wetter der Geschichte, solange es angezeigt wird: `rain`, `snow`, `fog`… (siehe [Wetter](#weather)) |
| `data-mari-sky`                 | `dawn`, `day`, `dusk` oder `night`, solange das Wetter der Geschichte angezeigt wird |
| `data-mari-shelter`             | `indoors` oder `outdoors`, solange das Wetter der Geschichte angezeigt wird und die App es aus dem Ort ableiten kann |

### Bereiche

`[data-component="…"]` benennt die großen Bereiche: `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`,
`RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`,
`OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`,
`OverhaulEditorRail`.

### Einzelne Teile

| Selektor | Bedeutung |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[data-mari-part="message"]`                                                           | Eine Nachrichtenzeile in jedem Chat-Modus: die volle Chat-Breite mit Avatar, Namenszeile und Sprechblase darin. Gestalte die Sprechblase (`bubble` unten), nicht diese Zeile, sonst sitzt jede Sprechblase in einem zweiten Kasten. Hat auch `data-message-id` und `data-message-role` (`user`, `assistant`, `system`, …) sowie die Nachrichtendaten unten |
| `[data-mari-part="bubble"]`                                                            | Die Sprechblase selbst, in Roleplay und Conversation (`.mari-rp-bubble` / `.texting-bubble`). Hintergrund, Rahmen, Radius und Schatten gehören hierher |
| `[data-mari-part="message"][data-latest]`                                              | Die neueste Antwort des Charakters |
| `[data-mari-part="message"][data-streaming]`                                           | Eine Antwort, die noch geschrieben wird |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | Innerhalb einer Nachricht: Avatar, Namenszeile und Nachrichten-Tools |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]`                    | Der Schalter (oder Kasten) für Gedankengänge und dessen Text; derselbe Hook auf Desktop und Smartphone |
| `[data-mari-part="composer"]`                                                          | Die Nachrichtenbox. `data-composer` ist `roleplay`, `conversation` oder `game` |
| `[data-mari-part="home-art"]`                                                          | Die Standardbilder auf Home-Karten |
| `[data-mari-part="message"][data-vn]`                                                  | Das Visual-Novel-Dialogfeld: eine Nachricht mit denselben Daten (Charakter, Rolle, Index) sowie den Teilen `avatar` und `header` darin |
| `[data-mari-part="vn-sprite"]`                                                         | Eine leere Ebene hinter dem VN-Dialogfeld, die bis zum unteren Szenenrand reicht. Sie hat `data-vn-speaker` (den Sprechernamen als Slug oder dessen Rolle), `data-vn-speaker-role`, `data-character` und `data-character-id` für den aktuellen Sprecher, damit ein Theme dessen Bild dort aufstellen kann. `[data-roleplay-vn-media]` hat dieselben Attribute |
| `[data-mari-part="message"][data-game-narration]`                                      | Das Game-Erzählfeld. `data-message-role` ist `narrator` oder, während ein Charakter spricht, `assistant` mit `data-character` und `data-character-name`; `data-segment-type` und `data-expression` beschreiben die aktuelle Zeile |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]`                        | Die Hintergrund- und Umgebungsebenen. Ihr Platz auf der Seite ist fest; gestalte sie mit den Tokens |
| `[data-mari-part="home-widget"]`                                                       | Eine Home-Widget-Karte, einschließlich Professor Mari. Ihr Rahmen hat `data-home-widget-id` (`recent`, `professor`, `whats-new`, `character-library`, …). Darin: `home-widget-eyebrow`, `home-widget-title`, `home-widget-text` |
| `[data-mari-part="top-bar"]`                                                           | Die obere Leiste auf jedem Gerät. Die zweite Seite der geteilten Ansicht hat eine eigene schmale Leiste mit denselben Hooks (`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`), markiert mit `[data-split-bar]`, damit Grafiken und Schriftarten der oberen Leiste auch dort ankommen |
| `[data-mari-part="page-title"]`                                                        | Der große Titel einer Hauptseite: jeder Bibliotheksbereich (Charaktere, Lorebooks, Verbindungen, Agenten…), Einstellungen, Erweiterungen und Dokumentation. Gestalte Seitentitel mit diesem einen Hook, damit sie auf jeder Seite zusammenpassen |
| `[data-mari-part="backdrop"]`                                                          | Das Hintergrundbild eines Chats (siehe Hintergrundbilder) |
| `[data-mari-part="stage-empty"]`                                                       | Die Game-Bühne ohne Szenenbild |
| `[data-mari-part="time"]`                                                              | Die Uhrzeit einer Nachricht in jedem Chat-Modus |
| `[data-mari-part="chat-header"]`                                                       | Die Conversation-Kopfzeile (`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]`                         | Das schwebende Game-Panel für Karte und Gruppe sowie die Werkzeugleiste der Erzählung |
| `[data-mari-part="avatar-placeholder"]`                                                | Der leere Avatar-Kreis; `data-role` ist `user` oder `assistant` |
| `[data-mari-part="header"][data-placement]`                                            | Bei Roleplay-Nachrichten: `outside` (Name über der Sprechblase) oder `inside` |
| `[data-mari-part="home-widget-glow"]`                                                  | Das Leuchten hinter der Kopfzeile eines Home-Widgets |
| `[data-mari-part="dialogue"]`                                                          | Wörtliche Rede in einer Nachricht |
| `[data-mari-part="paragraph-gap"]`                                                     | Die Leerzeile zwischen zwei Absätzen (wird zu einem Block, wenn `--mari-paragraph-gap` gesetzt ist) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav`                                   | Das VN-Textfeld (`data-more-below`, solange es weitergescrollt werden kann), der Zähler „3 / 9“ und die Schaltflächen Zurück / Weiter (`data-direction`) |
| `[data-mari-part="card-art"]`                                                          | Das Bild einer Bibliothekskarte; `data-placeholder`, wenn sie keines hat |
| `[data-mari-part="page"]`                                                              | Die Fläche, auf der jede vollständige Seite liegt: jede Bibliotheksseite (Charaktere, Lorebooks, Presets, Regex-Skripte, Verbindungen, Agenten, eigene Tools), jeder Editor, Einstellungen und Dokumentation. Gestalte hier ein Panel oder Blatt, nicht auf der eigenen Klasse einer einzelnen Seite, damit jede Seite dieselbe lesbare Fläche bekommt. Chats und Home liegen nicht darin |
| `[data-mari-part="chat-row-art"]`                                                      | Das Bild des offenen Chats hinter seiner Seitenleistenzeile |
| `[data-mari-part="avatar-placeholder"]`                                                | Jetzt überall, wo ein leerer Avatar erscheint: Conversation-Zeilen, Chat-Zeilen (Initialen), Persona-Auswahl, Nachrichtenbox und Game |
| `.ov-lrow__dot[data-status]`                                                           | Ein Lorebook-Eintragspunkt: `constant`, `selective` oder `normal` |
| `[data-chat-row]`                                                                      | Eine Zeile in der Chat-Seitenleiste; `data-selected="true"` beim offenen Chat |
| `[data-chat-mode]`                                                                     | Die Chat-Fläche, nach Modus |
| `.mari-messages-scroll`                                                                | Die scrollbare Nachrichtenliste |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant`                  | Sprechblasen in Roleplay und Conversation |
| `.mari-window`, `.mari-drawer`                                                         | Ausgelagerte Fenster und ausklappbare Panels |

### Gestaltungsplätze

Diese erscheinen nur, solange das aktive Theme sie anfordert. Die Standardseite enthält also keine zusätzlichen Teile.

- **Fokusrahmen.** `--mari-focus-frame` nimmt einen vollständigen `border-image`-Wert an, zum Beispiel
  `url("theme:frame.png") 24 fill / 24px / 6px stretch`, und zeichnet ihn um das, worauf sich die
  Aufmerksamkeit richtet: die neueste Antwort, Strg+K, ein offenes Dialogfenster und Letzte Chats auf Home. Füge
  `data-mari-focus-surface` einem anderen Element (in einer Nachrichtenvorlage) hinzu, um es ebenfalls einzurahmen.
  Seit v1.5 ragt der Rahmen nur über `--mari-focus-frame-outset` über seine Fläche hinaus (höchstens
  2rem), bei einem Wert mit `fill` gar nicht, damit er den Chat nicht übermalen kann. Ein Außenüberstand
  innerhalb von `--mari-focus-frame` wird ignoriert. Der Rahmen ist ein `border-image`: Eine spätere `border`-Kurzschreibweise
  im CSS auf demselben Element setzt ihn zurück. Setze dort daher stattdessen `border-color`, `border-width` und `border-style`
  einzeln.
- **Fenstertitel.** `--mari-window-title` (beliebiger Wert, etwa `on`) fügt oben an jeder Nachricht,
  jedem Home-Widget und jeder Nachrichtenbox eine Titelzeile hinzu: `[data-mari-part="window-title"]` mit
  `data-window` (`message`, `home-widget`, `composer` und seit v1.5 `narration`, `omnibar`,
  `window` und `dialog`), darin `window-title-text` (der Sprecher,
  der Widget-Titel oder „Nachricht“) sowie ein leeres `window-buttons` für deine `_ [] X`-Dekorationen.
- **Vorschauen in Chat-Zeilen.** `--mari-chat-row-preview` (beliebiger Wert, etwa `on`) fügt die neueste
  Zeile jedes Chats unter dessen Namen in der Chat-Liste ein: `[data-mari-part="chat-row-preview"]` mit
  `data-role` (`user`, `assistant`, `narrator`…), beginnend mit `[data-mari-part="chat-row-preview-who"]`
  („Du:“ bei deinen eigenen Zeilen oder dem Sprechernamen in einem Gruppenchat). Sie weicht der Live-Anzeige
  der Zeile („tippt…“, „Ungesendeter Entwurf“), sodass nie beide erscheinen. Ohne das Token wird die Zeile weder abgerufen
  noch gezeichnet.
- **Umgebung hinter Karten.** `--mari-ambient-placement: behind-cards` verschiebt die Umgebungsebene unter
  Nachrichten, Home-Widgets und Panels (weiterhin über das Hintergrundbild), statt über den Chat.
  `--mari-ambient-mask` (ein vollständiger `mask`-Wert) bestimmt, wo sie sichtbar ist, und
  `--mari-ambient-mask: var(--mari-gutter-mask)` hält die Fenstermitte frei, sodass Regen in den
  seitlichen Rändern statt über dem Text fällt. `--mari-gutter-clear` setzt die freie halbe Breite (26rem).

### Nachrichtendaten

Jede Nachricht enthält Angaben zum Verfasser, ihrer Nummer und der benötigten Zeit – als Attribute für Selektoren
und `attr()` sowie als CSS-Variablen für `content:` und `counter()`:

| Attribut | Variable | Wert |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `data-character-id`   |                    | Die ID des Charakters (fehlt bei deinen eigenen Nachrichten) |
| `data-character-name` | `--mari-msg-char`  | Der Anzeigename (`--mari-msg-char` ist eine Zeichenfolge in Anführungszeichen) |
| `data-character`      |                    | Der Name kleingeschrieben mit `-` statt Leerzeichen, für Selektoren: `[data-character="captain-faye"]` |
| `data-message-index`  | `--mari-msg-index` | Die unter „Nachrichtennummern anzeigen“ angezeigte Nachrichtennummer |
| `data-gen-ms`         | `--mari-msg-gen`   | Generierungszeit in ms (`--mari-msg-gen` ist eine Zeichenfolge wie `"3.2s"`) |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### Nachrichtenvorlage (HTML)

Wenn CSS nicht ausreicht, etwa für einen Statuskasten mit Sprechername und Nachrichtennummer, kann eine
Theme-Datei eine kleine HTML-Vorlage je Rolle enthalten. Sie wird für jede Nachricht ausgefüllt und
in einem Kasten am Nachrichtenende angezeigt, `[data-mari-part="message-extra"]`, den dein CSS gestaltet und
platziert:

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

Schlüssel: `message` (jede Rolle), `assistant`, `user`, `narrator` (die eigene Vorlage einer Rolle hat Vorrang vor
`message`). Felder: `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}`; unbekannte
Felder bleiben leer. Jede Vorlage darf höchstens 4.000 Zeichen lang sein. Marinara behält Text und Layout-Tags
(`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress`, …) mit den Attributen `class`, `title`,
`role` und `data-*` und entfernt Skripte, Styles, Inline-`style`, Links, Bilder, Formulare und
Ereignisattribute. Eine Vorlage, deren Text nach Schlüsseln oder Passwörtern fragt, wird verworfen.

HTML müssen Nutzer ausdrücklich erlauben: Ein Theme mit Vorlage lässt sich nur installieren, wenn **Einstellungen →
Darstellung → CSS-Themes → Themes mit HTML erlauben (ich akzeptiere das Risiko)** eingeschaltet ist (standardmäßig aus). Die Importvorschau warnt
davor. Bei ausgeschaltetem Schalter wird ein installiertes Theme ohne sein HTML angezeigt.

## Darstellung je Chat

Chat-Einstellungen > Theme gibt einem Chat ein eigenes Theme („Standarddarstellung“ schaltet eigene Themes für
diesen Chat aus). In einem Chat mit genau einem Charakter kann die Auswahl zum Standard dieses Charakters
für seine anderen Einzelchats werden; Gruppenchats und Game-Gruppen übernehmen nie den Standard eines einzelnen Mitglieds.
Der Abschnitt Theme zeigt, woher die aktuelle Darstellung kommt: vom Chat, vom Charakter oder von der App.
Einstellungen, Bibliothek, Editoren und Dokumentation verwenden immer das App-Theme. `data-chat-id` und
`data-chat-tags` stehen nur auf `<html>`, solange der Chat selbst angezeigt wird.

Mit Tags kannst du bestimmte Geschichten innerhalb eines Themes gestalten und diese Gestaltung weitergeben:
`:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Füge Tags unter Chat-Einstellungen > Chatname
(„+ Tag hinzufügen“) oder über die Tag-Schaltfläche einer Chat-Zeile hinzu (auf Touchscreens über „Tags“ im Menü nach langem Drücken).
Im Attribut werden Tags kleingeschrieben und Leerzeichen durch `-` ersetzt; „Noir Mystery“ entspricht also `noir-mystery`.

Jede gesetzte `--mari-chat-*`-Variable (zum Beispiel `--mari-chat-bg`, `--mari-chat-text`,
`--mari-chat-radius`, `--mari-chat-font-family`) schaltet die passende Gestaltung der Chat-Fläche von
selbst ein. Die Schalter „Preset … anwenden“ sind nicht nötig, damit die Chat-Farben eines Themes erscheinen.

## Tag und Nacht

Einstellungen > Darstellung > Farbschema kann dem System oder der Tageszeit folgen (standardmäßig Hell ab 07:00,
Dunkel ab 19:00, beides anpassbar). In beiden Fällen wird nur `data-theme` auf `<html>` umgeschaltet.
Ein Theme bekommt also eine Tages- und eine Nachtdarstellung, indem es beide gestaltet:

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

Das Schema wird auf jedem Gerät nach dessen eigener Uhr bestimmt (es wird nicht synchronisiert). Ein Smartphone und ein PC an
verschiedenen Orten zeigen also jeweils die richtige Hälfte. Eine Theme-Datei kann den Wechsel selbst vorschlagen:
`"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (oder
`"system"`). Die Importvorschau bietet das wie jede andere Einstellung an.

## Theme-Dateien

Beim Export wird ein Theme als eine JSON-Datei gespeichert:

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

Urheberangaben (v1.5) gehören in dieselbe Datei und erscheinen in der Theme-Liste (die (i)-Schaltfläche) und der
Importvorschau:

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` sind bis zu vier kurze Tags (je 40 Zeichen), die unter dem Theme-Namen erscheinen. Eine Schriftart oder
Urheberangabe mit der Lizenz `OFL-1.1` verlinkt auf den mitgelieferten Text der SIL Open Font License. Bilder mit mehr
als 1.920 px Breite (oder 2.560 px an der langen Seite) werden beim Theme-Import verkleinert.

Nur `kind`, `name` und `css` sind erforderlich. `templates` ist unter Nachrichtenvorlage beschrieben. `settings`-Schlüssel: `colorScheme` (`dark`, `light`, `time` oder `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`,
`accentLight`, `background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Anzeigegröße
in px: 12, 14, 16, 17, 19, 22, 26, 30 oder 34) und `reduceMotion` (true oder false). Beim Import erscheint zuerst eine
Vorschau mit angehakten Einstellungsvorschlägen, außer Visueller Stil, Akzentpuls, Anzeigegröße und
Bewegung reduzieren, die der Nutzer bei Bedarf selbst anhakt. Außerdem entscheidet er, ob die
Hintergründe zur Galerie hinzugefügt werden. Bilder unter 4 KiB bleiben inline und erscheinen zusammen als Chip „kleine Symbole“.
Schriftarten werden mit dem Theme geladen (als `@font-face`-Regeln) und mit ihm entfernt. Beim Import eines Themes mit demselben
Namen wie ein installiertes wird ein Update angeboten; dabei wird derselbe Hintergrund nicht zweimal zur
Galerie hinzugefügt. Das CSS-Limit beträgt 256 KiB CSS-Text; Bilder, Vorschaubild, Schriftarten und Hintergründe
haben zusammen 6 MiB. Ein Bild, das nicht hineinpasst, wird einzeln unter Angabe seiner Größe ausgelassen. Der Rest
des Themes wird trotzdem installiert. Reine `.css`-Dateien, `{ "name", "css" }` und der ältere
`marinara.theme-folder`-Export lassen sich weiterhin importieren.

## Ein Theme schnell halten

Auf Smartphones und Tablets, vor allem iPads mit Safari, macht sich langsames CSS bei jedem Tippen bemerkbar. Die meisten Themes laufen gut;
diese Muster haben Themes in Tests verlangsamt:

- **`:has()` auf einem Elternelement, das dann seine Kinder gestaltet**, etwa `.panel:has(> .row) > *` oder
  `body:has(.open) .chat *`. Der Browser prüft dann bei jedem eingegebenen Buchstaben und
  jedem gestreamten Wort die gesamte Seite erneut. Setze `:has()` auf das zu gestaltende Element (`.row:has(> img)`) oder nutze
  stattdessen einen `data-mari-part`-Hook.
- **`backdrop-filter` auf vielen Elementen gleichzeitig**, etwa auf jeder Nachricht oder jeder Chat-Zeile. Ein oder zwei
  Milchglas-Panels sind in Ordnung; ein Weichzeichner auf jeder von hundert Zeilen nicht. Nutze stattdessen eine durchsichtige Farbe.
- **Layout animieren** (`width`, `height`, `top`, `margin`) oder große `box-shadow`-Schatten. Animiere `opacity`
  und `transform` oder `background-position` auf der Umgebungsebene.

**Einstellungen → Erweitert → Fehlerbehebung → Show tap timings** zeigt, wie lange jedes Tippen auf diesem
Gerät dauert, mit und ohne dein Theme. Vergleiche beides, um eine langsame Regel zu finden.

## Barrierefreiheit

Einstellungen > Darstellung > Barrierefreiheit übernimmt die Nutzerwahl für Zeilen- und Zeichenabstände, Fokusringe,
hohen Kontrast, Farben für Farbsehschwäche und eine Mindestgröße von 12 px für Nachrichtentext. Die Werte werden
als Literale auf jedem Element in die Ebene `mari-protected` geschrieben (lib/accessibility-css.ts), sodass
ein Theme sie nicht aufheben kann, auch nicht durch Neudefinieren von Variablen. Solange eine Option aus ist, kann ein Theme Folgendes setzen:

| Token | Verwendung |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `--mari-focus-ring-color` | Der normale Fokusring der App (standardmäßig `--primary`) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | Status- und Anzeigefarben, wenn du ein eigenes Blau-Orange-Paar möchtest |

Bei Grafiken haben drei weitere Einstellungen Vorrang vor einem Theme:

- **Stärke der Theme-Grafik** (0–100 %) schwächt Hintergrundbild und Umgebungsebene ab.
- **Hoher Kontrast** macht außerdem Flächen undurchsichtig in den eigenen Farben des Schemas (`--background`, `--card`,
  `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, Seitentönung, Home-Tönung,
  Home-Widgets und die Flächen in der oberen Leiste) und begrenzt Theme-Grafiken auf höchstens 25 %, damit Text nie auf
  einem pastellfarbenen Bild liegt. Farben, die ein Theme als Literale auf eigenen Selektoren setzt, werden nicht geändert.
  Verwende daher bevorzugt die Tokens.
- **Bewegung reduzieren** zeigt bewegte Bilder als ersten Frame und stoppt die Umgebungsebene.
  Erzwungene Farben (Windows High Contrast) blenden die Grafiken und `border-image`-Rahmen aus.

Nutze die Status- und Anzeige-Tokens oben statt fester Grün- und Rottöne, damit der Schalter für Farben bei Farbsehschwäche
auch dein Theme erreicht. Sprunglinks (`.mari-skip-link`) bleiben erreichbar, egal was ein Theme macht.
Die Importvorschau zeigt dem Nutzer an, wenn ein Theme eine dieser Einstellungen zu ändern versucht.

## Sicherheit

- Die obere Leiste (einschließlich ihres automatischen Ausblendens im Vollbild), die Chat-Seitenleiste samt Chat-Zeilen,
  die Bibliotheksseitenleiste, Strg+K und die Nachrichtenbox dürfen umgestaltet, aber nicht ausgeblendet, verschoben, verdeckt, verblasst,
  weggefiltert oder unanklickbar gemacht werden. Die Schutzprüfung misst sie mit und ohne Theme nach dessen
  Laden, nach 2,5 s und 10 s, beim Öffnen eines Chats oder Panels, beim Wechsel des Farbschemas,
  bei Größenänderungen und beim Start oder Ende einer Theme-Animation. Beeinträchtigt das Theme einen dieser Bereiche,
  wird es in diesem Tab ausgeschaltet.
- Bilder zählen mit (Schutzprüfung v3). Alles, was über einen Tab, ein Symbol, eine Chat-Zeile oder die Nachrichtenbox
  gezeichnet wird, wird in der Mitte des Bedienelements erkannt, unabhängig von `pointer-events: none` und seiner Größe. Eine Ebene,
  die es verbirgt (eine Farbe, ein Verlauf oder ein Bild mit dort überwiegend undurchsichtigen Pixeln), zählt als
  Abdeckung. Dasselbe gilt für einen über ein Bedienelement ragenden `border-image`-Außenüberstand und eine Bild-`mask` darauf.
  Innerhalb der oberen Leiste liegen alle `::before` und `::after` unter Labels und Symbolen;
  Masken, `list-style-image` und `border-image-outset` wirken dort nicht. Hintergrundbild und Umgebungsebene
  zählen nie: Sie liegen konstruktionsbedingt unter den Leisten.
- Schutzprüfung v4 (Runde 4). Die Kontrastprüfung liest die Ebenen hinter Text in Zeichenreihenfolge (eine `border-image`-Füllung,
  dann jede Hintergrundebene von oben, dann die Farbe), gewichtet sie nach dem tatsächlich bedeckten Textanteil
  (Größe, Position und Wiederholung) und prüft ein Bild nur unter dem Text.
  Eine dünne Linie oder kleine Eckverzierung zählt nicht mehr, und ein dunkler Schleier über einer hellen Seite wird
  als dunkel gewertet. Obere Leiste und Nachrichtenbox werden strenger geprüft: Ihr Text muss an der ungünstigsten
  Stelle 3:1 beibehalten, wenn er diesen Wert vorher erreicht hat. Ein Bild auf dem eigenen `::before` oder
  `::after` eines Bedienelements, das dieses verdeckt, zählt als Abdeckung – in der oberen Leiste, den Chat-Zeilen und der
  Nachrichtenbox. Ein Bild mit `position: fixed` auf einem Pseudoelement erzeugt eine Warnung im Editor; nutze
  stattdessen `position: absolute`, `--mari-ambient` oder `--mari-app-backdrop`. Wird eine Grafik der oberen Leiste
  auf einem Pseudoelement erkannt, erhalten Tabs und Symbole ihre Flächen wie bei `--mari-top-bar-bg`.
- Kontrast über Grafiken: Liegt ein Bild hinter Text, liest die Schutzprüfung die Bildfarben, statt
  die Prüfung zu überspringen.
- Chat-Text (v1.5): Die Schutzprüfung prüft die letzten sichtbaren Chat-Zeilen stichprobenartig und schaltet das Theme
  aus, wenn es mehr als die Hälfte übermalt (durch ein Pseudoelement, eine undurchsichtige Umgebungsebene hinter den Karten oder einen
  Fokusrahmen, dessen Überstand über den Text reicht). Eine Zeile, die das eigene Layout des Themes aus dem sichtbaren Bereich schiebt,
  zählt nicht, ebenso wenig eine Namenszeile, die das Theme über der Antwort anheftet.
- Text, den ein Theme mit `content:` hinzufügt, wird in der Importvorschau angezeigt.
- Regeln für Theme-Texte (Sicherheitsaudit, November 2026). Jede Zeichenfolge, die ein Theme anzeigen kann, wird geprüft, bevor das
  Theme übernommen wird, unabhängig von ihrer Quelle (Datei, Editor, Mari, Backup, Auswahl je Chat):
  Zeichenfolgen in `content:` und `quotes`, benutzerdefinierte Eigenschaften (also auch `content: var(--x)`),
  `@counter-style`-Symbole, der Platzhalter der Nachrichtenbox, Nachrichtenvorlagen (Wörter und `title`) und
  Text in SVG-Bildern. Text wird abgelehnt, wenn er nach Schlüsseln, Passwörtern, Anmeldungen oder Kontodaten fragt,
  sich als die App ausgibt („gehackt“, „RCE“, „Sicherheitswarnung“, „von Marinara verifiziert“, „Support
  anrufen“), eine Telefonnummer oder Webadresse enthält oder in einer Deklaration mehr als 80 Buchstaben und Ziffern
  hat: Das Theme kann nicht installiert werden, ein bereits installiertes wird nicht übernommen. Ähnlich aussehende
  Buchstaben, Akzente, Zeichen ohne Breite, Abstände und 1337-Schreibweisen werden vorher vereinheitlicht. Zeichenfolgen in
  Selektoren, `font-family` und Namen von Rasterbereichen zählen nicht. Auch Name, Autor, Beschreibung
  und Urheberangaben des Themes dürfen nicht nach Geheimwerten fragen oder einen offiziellen Status behaupten (Webadressen sind dort erlaubt).
- URLs: Zusätzlich zur Textbereinigung (Erlaubnisliste für url(), kein `@import`, nur data:-Schriftarten) wird das
  Stylesheet vor dem Übernehmen vom Browser geparst. Jede Adresse außer den eigenen Bildern des Themes,
  eingebetteten data:-Bildern und -Schriftarten, `#fragments` und `about:invalid` führt zur Ablehnung des
  Themes. `src()` folgt den url()-Regeln; ein am Ende offenes `image-set(` wird entfernt.
- Vorgeschlagene Farben in einer Theme-Datei (`settings.accent`, `background` und ihre hellen Gegenstücke) müssen
  einfache Farben oder Verläufe sein: kein `url()`, `image-set()` oder etwas, das aus dem Wert ausbricht.
- SVG-Bilder werden vor der Verwendung anhand einer Erlaubnisliste neu aufgebaut: kein `<script>`, `<foreignObject>`, `<a>`,
  keine Ereignisattribute, externen Links, `<?xml-stylesheet?>` oder DOCTYPE-Entitäten. Ihr CSS wird
  wie das eines Themes bereinigt. Rasterbilder, die dekodiert mehr als 8.192 px je Seite oder 40 Megapixel
  hätten, werden abgelehnt.
- Wetter-Tokens werden anhand einer Erlaubnisliste gelesen: bekannte Token-Namen, auf ihre Bereiche begrenzte Zahlen,
  Wörter aus festen Listen und einfache Farben (kein `url()`, keine Verläufe oder Funktionen außer Farbfunktionen).
  Wetterbilder müssen eigene Bilder des Themes sein (die von der App dafür erstellten Adressen desselben Ursprungs,
  nach SVG-Neuaufbau und Größenbegrenzung); jede andere Adresse wird ignoriert. Nichts, was ein Theme schreibt,
  wird ausgeführt, und das Aufleuchten von Blitzen behält Stärke und Zeitabstände der App.
- Nachrichtenvorlagen dürfen keine Rollen verwenden, die ein Dialogfenster, Menü oder eine Ankündigung erzeugen, und auch nicht
  die eigenen `data-`-Attribute oder `mari-`-/`ov-`-Klassennamen der App.
- Das Ausprobieren eines Themes („Dieses Theme behalten?“) findet nur in diesem Tab statt: Andere Geräte erhalten es erst nach
  dem Behalten. Ohne Antwort wird zurückgekehrt; Darüberfahren oder Fokussieren der Leiste pausiert den Countdown. Dreimal Escape
  schaltet eigene Themes im Tab aus. Ein Escape, das Strg+K, ein Menü oder ein von der App angezeigtes Dialogfenster
  schließt, zählt nicht.

## Änderungen

- **Mini-Bilder auf Smartphones, ruhigere Animationen** (12. bis 14. November 2026, Vertrag weiterhin Version 1):
  `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` und `--mari-phone-convo-avatar` für das
  kleine Bild neben dem Namen auf Smartphones; `--mari-chat-row-preview` ergänzt die neueste Zeile jedes Chats in der
  Chat-Liste; ein Übergang darf höchstens eine Sekunde warten; Umgebungsebene und Endlosanimationen
  halten an, wenn niemand sie sehen kann; [Ein Theme schnell halten](#keeping-a-theme-fast).

- **Lesbarer Akzenttext und Hook für die Leiste der geteilten Ansicht** (11. November 2026, Vertrag weiterhin Version 1): Der
  als kleiner Text verwendete Akzent wird in Hell etwas dunkler und in Dunkel etwas heller, damit Labels lesbar sind,
  während Schaltflächen den vollen Akzent behalten; mit `--mari-accent-text` setzt du diese Textfarbe selbst.
  `[data-mari-part="top-bar"]` ist die obere Leiste auf jedem Gerät. Die zweite Seite der geteilten Ansicht hat ihre
  eigene Leiste mit denselben `[data-component="TopBar"]`-Hooks (plus `[data-split-bar]`), sodass Grafiken,
  Schriftarten und Tab-Farben der oberen Leiste auch dort wirken. `--mari-game-combat-bg` und `-bg-hover` sind ein vollständiger
  `background`, Verläufe funktionieren also.

- **Hook für die Seitenfläche** (10. November 2026, Vertrag weiterhin Version 1): `[data-mari-part="page"]`
  ist die gemeinsame Fläche unter jeder Bibliotheksseite, jedem Editor, Einstellungen und Dokumentation. Ein Theme kann ihnen
  damit allen dasselbe Panel geben.

- **Theme-Galerie und Blitze** (9. November 2026, Vertrag weiterhin Version 1): Starter-Themes
  werden bei Bedarf aus der Theme-Galerie heruntergeladen; `--mari-weather-lightning-bolt` (`on`, `none` oder eine Breite
  von 0,5 bis 3) zeichnet bei jedem Gewitteraufleuchten einen verzweigten Blitz entlang einer Bildschirmseite.

- **Theme-Wetter** (November 2026, Vertrag weiterhin Version 1): `--mari-weather-*`-Tokens (Pixelstil,
  Farben, Bilder, Größe, Geschwindigkeit, Menge, Stärke, Tönung, Sonne und Mond aus),
  `data-mari-weather` und `data-mari-sky` auf `<html>`; Wetter pausiert unter verdeckenden Panels.
  Petal OS, NEON//GRID und Lantern Path verwenden sie.

- **Runde 6 und Sicherheitsaudit** (November 2026, keine neuen Tokens, Vertrag weiterhin Version 1):
  Starter-Themes sind schreibgeschützt; **Klonen + bearbeiten** erstellt eine bearbeitbare Kopie (seit dem 9. November werden sie
  bei Bedarf aus der Theme-Galerie heruntergeladen, statt mit der Installation geliefert zu werden); Urheberangaben,
  Lizenz und Labels erscheinen in der Importvorschau und hinter der (i)-Schaltfläche; ein Theme wird bis **Theme behalten**
  nur im jeweiligen Tab ausprobiert; die unter [Sicherheit](#safety) beschriebenen Theme-Textregeln, URL-Prüfung, der SVG-Neuaufbau und
  die Prüfung vorgeschlagener Farben.

- **v1.5** (Theming-Runde 5, lange Antworten): `--mari-chat-column`, `--mari-message-measure`,
  `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, angehefteter Sprecher,
  `--mari-phone-avatar`, Teile und Verlauf des VN-Textfelds, `--mari-message-actions`,
  `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`,
  `--mari-focus-frame-outset`, `--mari-scrim` und `--mari-center-x`; Teile für Dialog, Absatzabstand,
  Kartenbilder und Chat-Zeilen-Bilder sowie Avatar-Platzhalter überall; Fenstertitel für Erzählung,
  Strg+K, Fenster und Dialogfenster; der Akzent der Bedienoberfläche erreicht auch auf Root-Ebene gestaltete Bereiche; Schutzprüfung für Chat-Text;
  Theme-Urheberangaben, Lizenz und Labels mit mitgeliefertem OFL-Text; große Bilder werden beim Import verkleinert.

- **v1.4** (Theming-Runde 4): Schutzprüfung v4 (geschichtete Hintergründe, bemalte Fläche, strengere Prüfung von oberer Leiste und
  Nachrichtenbox, Abdeckungen durch Pseudoelemente); `fontSize` und `reduceMotion` in Theme-Dateien und
  angehakte Einstellungsvorschläge in der Importvorschau; Tokens für Nachrichtenzeiten, Roleplay-Tönung, Akzent
  und gedämpften Text der Bedienoberfläche, Bibliotheks- und Strg+K-Farben, Kampf, Kurzmeldungen, Lorebook-Punkte, Home-Verknüpfungen,
  eine Textgrößenuntergrenze und den Nutzeravatar; `--mari-top-bar-height` und `--mari-top-bar-plate-active`;
  Teile für Zeit, Chat-Kopfzeile, Game-HUD, Game-Tools, Avatar-Platzhalter und Home-Widget-Leuchten; Gestaltungsplätze für
  Fokusrahmen, Fenstertitel, Umgebung hinter Karten und Randmaske.

- **v1.3** (Theming-Runde 3, Bilder): `images` in der Theme-Datei und `url("theme:name")`;
  das CSS-Limit zählt nur CSS-Text; WebP beim Import; Hintergrundbild auf eigener Ebene; `--mari-page-veil`
  bleibt über einem Hintergrundbild erhalten; `!important`-Kurzschreibweisen mit `var()` bleiben erhalten; Umgebungsebene; Bildsymbole
  und Mauszeiger; `--mari-home-wash`, `--mari-home-art` und weitere Home-Widget-Tokens; Hooks für VN-Dialog, den VN-Sprite-Platz
  und Game-Erzählung; Theme-Dateien können Tageszeit folgen vorschlagen; Schutzprüfung v3.

- **v1.2**: Platz für Nachrichtenvorlagen (`templates` in der Theme-Datei, `[data-mari-part="message-extra"]`),
  ausdrückliche Zustimmung der Nutzer über „Themes mit HTML erlauben“.

- **v1.1**: Nachrichten-Hooks in jedem Chat-Modus mit Charakter, Index und Generierungszeit; Teile für Avatar,
  Kopfzeile, Aktionen und Gedankengänge; `--mari-composer-placeholder`; Hintergrundbild v2 (Größe, Position,
  Wiederholung, Pixelstil, Ebenen), das auch hinter Chats erscheint; `--mari-page-veil`; `--mari-top-bar-bg`;
  `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule`;
  Home-Widget-Tokens, mit Professor Mari als `home-widget`. `--mari-stage-empty-bg` ist jetzt ein
  `background` (Verläufe funktionieren).
- **v1.0.1**: Schutzprüfung v2, geschützte Barrierefreiheitswerte, Prüfung hinzugefügter Texte. Installation ganz oder gar nicht,
  mitgelieferte Hintergründe werden installiert, Zurück stellt auch vom Theme übernommene Einstellungen wieder her, Theme-Schriftarten erscheinen
  in der Schriftartenliste, `url(#id)`-Verweise bleiben erhalten, und Namen mitgelieferter Schriftarten werden aus der Schriftdatei gelesen.
- **v1** (erster veröffentlichter Vertrag): die oben beschriebenen Theme-Tokens, Bereichs-Hooks, Hintergrundbilder und Akzenteffekte.
