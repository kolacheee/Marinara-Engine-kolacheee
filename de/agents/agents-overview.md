# Agenten: KI-Helfer für deine Chats

Agenten sind kleine KI-Helfer, die rund um die Hauptantwort in deinem Chat mitlaufen. Einer führt Uhrzeit und Wetter mit, ein anderer wählt einen Gesichtsausdruck für den Charakter, wieder ein anderer zeichnet ein Bild für einen wichtigen Moment. In dieser Anleitung erfährst du, wie du Agenten installierst, für einen Chat einschaltest und prüfst, ob sie gelaufen sind.

## Was Agenten sind

Agenten werden pro Chat eingeschaltet, nicht pro Charakter. Zwei Chats mit demselben Charakter können unterschiedliche Agenten nutzen.

Eine frische Installation bringt keine optionalen Agenten mit. Du installierst sie über **Library → Agents** (Bibliothek → Agenten), den Store für offizielle Pakete zur Installation per Klick. Im klassischen Layout heißt er **Agent Organizer** (Agentenverwaltung). Quellcode und Katalog sind öffentlich unter [Pasta-Devs/Marinara-Agents](https://github.com/Pasta-Devs/Marinara-Agents) einsehbar. Installier über diese Seite, damit Marinara Kompatibilität, Berechtigungen und Datei-Hashes prüfen kann. Was jeder Agent macht, steht in der [Referenz der herunterladbaren Agenten](built-in-agents.md). Wie du eigene baust, zeigt [Eigene Agenten erstellen](custom-agents.md).

## Einen Agenten zu einem Chat hinzufügen

Bevor du loslegst: Installier zuerst den Agenten. Öffne **Library → Agents**, such den Agenten unter **Available** (verfügbar) und klick auf **Get** (Herunterladen). Siehe [Agenten installieren und aktualisieren](#install-and-update-agents).

1. Öffne den Chat.
2. Öffne **Chat Settings** (Chat-Einstellungen) und such den Abschnitt **Agents**.
3. Schalte **Enable Agents** (Agenten aktivieren) ein. Das ist der Hauptschalter: Steht er aus, läuft in diesem Chat kein Agent.
4. Klick auf **Add Agent** (Agent hinzufügen), öffne die Gruppe, zu der der Agent gehört (etwa **Writer Agents** oder **Misc Agents**), und wähl ihn aus.

Die hinzugefügten Agenten erscheinen als aktiv, jeweils mit einer kleinen Schaltfläche zum Entfernen. Du kannst Agenten jederzeit hinzufügen oder entfernen.

> **Hinweis:** Jeder Chat-Modus zeigt nur die Agenten, die in diesem Modus funktionieren. In Conversation erscheinen installierte Spiele in der Spieleauswahl, und **Calls** ergänzt Bedienelemente in der Werkzeugleiste. Im Game Mode wählst du Agenten beim Anlegen des Spiels aus oder fügst sie später hinzu.

Ist ein Agent nicht gelaufen, prüf, ob **Enable Agents** an ist, ob der Agent in diesem Chat aktiv ist und ob sein Modus zu deinem Chat passt.

### Weitere Bedienelemente im Abschnitt Agents

Diese Bedienelemente stehen im selben Abschnitt **Agents**.

- **Agent Menus** (Agent-Menüs, nur in Roleplay): Ein Klick auf den Namen eines Agenten bringt dich zu seinen Einstellungen.
- **Trackers Control** (Tracker-Steuerung, nur in Roleplay): eine zugeklappte Karte mit den unten aufgeführten Tracker-Optionen.
- **Agent Suite**: öffnet eine Ansicht, in der du liest und bearbeitest, was die Agenten für diesen Chat gespeichert haben.
- **Review Agent Outputs** (Agent-Ausgaben prüfen): Änderungen an Lorebook, Zusammenfassung und Charakterkarte warten auf deine Freigabe. In Roleplay steckt die Option in **Trackers Control**. Siehe [Agent-Freigaben und die Agent Suite](approvals-and-agent-suite.md).

Optionen in **Trackers Control**:

- **Attach chat summaries** (Chat-Zusammenfassungen anhängen): standardmäßig aus. Hängt gespeicherte Chat-Zusammenfassungen an Agent-Anfragen an, auch bei Wiederholungen. Aus der Hauptantwort verschwinden die Zusammenfassungen dadurch nicht, und sie werden weiterhin erzeugt. Agenten mit vollem Zugriff auf den Hauptprompt können Zusammenfassungen dort weiterhin lesen.
- **Attach Lorebooks to Trackers** (Lorebooks an Tracker anhängen): Tracker-Agenten bekommen zusätzlich die Lorebook-Einträge, die für die Hauptantwort verwendet wurden. Erscheint, sobald der Chat einen Tracker-Agenten hat.
- **Individual tracker schedule** (Zeitplan pro Tracker): Ein Tracker läuft dann nicht mehr nach jeder Antwort. Du startest ihn von Hand über das HUD (die Statusanzeige auf dem Bildschirm in Roleplay).

### Einem Agenten ein Referenz-Lorebook geben

1. Öffne in **Chat Settings** den Abschnitt **Agents** und dann die Einstellungen des Agenten.
2. Schalte **Attach lorebook for the specific agent** (Lorebook für diesen Agenten anhängen) ein. Anfangs ist es aus.
3. Wähl unter **Reference lorebook** (Referenz-Lorebook) ein Buch.

Die Auswahl gehört zu diesem Agenten in diesem Chat. Passende Einträge folgen den normalen Lorebook-Auslöseregeln und gehen an diesen Agenten, auch bei manuellen Wiederholungen. Die Einstellung fügt das Buch weder der Hauptantwort noch unbeteiligten Agenten hinzu, gemeinsam laufende Agenten können dieselben Einträge aber ebenfalls sehen. Gelöschte oder nicht verfügbare Bücher liefern nichts.

## Wann Agenten laufen

Jeder Agent läuft an einem bestimmten Punkt rund um die Antwort, seiner **pipeline phase** (Pipeline-Phase). Jeder mitgelieferte Agent hat dafür einen Standard. Ändern kannst du ihn im Agent-Editor.

| Phase | Wann sie läuft | Beispiele |
| --- | --- | --- |
| **Pre-Generation** | Vor der Antwort. Kann dem Prompt Kontext hinzufügen. | Wissen nachschlagen |
| **Parallel** | Gleichzeitig mit der Antwort. Kann die Antwort nicht verändern. | Live-Publikumsreaktionen |
| **Post-Processing** | Nach der Antwort. Kann die Antwort lesen; umschreibende Agenten können sie bearbeiten. | Die meisten Tracker, Textbereinigung, Bilder |

<a id="tell-whether-an-agent-ran"></a>

## Erkennen, ob ein Agent gelaufen ist

- Tracker-Agenten schreiben ins HUD und in die Tracker-Panels. Haben sich Zeit, Ort, Stimmung oder Werte geändert, ist ein Tracker gelaufen.
- **Agent activity** (Agentenaktivität) in **Chat Settings** listet kurze Notizen der Agenten auf. Das Symbol dreht sich, während sie arbeiten, und zeigt einen Punkt, wenn einer fehlschlägt. Siehe [Agent activity](../roleplay/getting-started.md#agent-activity).
- **Prose Guardian** und **Continuity Checker** verändern den Antworttext. Eine geglättete oder korrigierte Antwort heißt, dass sie gelaufen sind.
- Für eine lückenlose Spur schalte **Debug mode** (Debug-Modus) unter **Settings → Advanced → Troubleshooting** ein. Er protokolliert Prompt und Antwort jedes Agenten in der Server-Konsole, und Debug-Einträge der Agenten erscheinen zusätzlich in der Browser-Konsole. Zwischengespeicherte Prompt-Injektionen zeigt der Tab **Injections** (Injektionen) von **Agent activity**.

## Die Kosten im Blick behalten

Jeder Agent bringt eigene Anweisungen mit und oft auch einen eigenen Modellaufruf. Wo möglich, bündelt Marinara Agenten mit derselben Verbindung in einem Aufruf.

Eine Anzeige über der Agentenliste schätzt die zusätzlichen Tokens und Aufrufe pro Zug. Tipp auf das Hilfesymbol daneben, um Details zu sehen. Ist die Last hoch, färbt sich die Anzeige bernsteinfarben und zeigt ein Warnsymbol. Die tatsächlichen Kosten liegen höher, denn mit jedem Aufruf gehen auch Chatverlauf und Charakterdetails mit.

Erscheint die Warnung, entferne Agenten, die du nicht brauchst, oder verschiebe einige auf eine günstigere oder lokale Verbindung. Ein **Reasoning Effort** (Denkaufwand), der an einer Verbindung gespeichert ist, gilt auch für die Agenten, die sie nutzen. Siehe [Parameter für Agenten](../prompts/generation-parameters.md#parameters-for-agents).

<a id="install-and-update-agents"></a>

## Agenten installieren und aktualisieren

Öffne **Library → Agents**. Das funktioniert am Rechner wie am Handy.

- **Installed** (Installiert) listet alles, was du hast, **Available** (verfügbar) alles, was du herunterladen kannst, und **Updates** installierte Agenten mit einer neueren Version.
- **All sections** (Alle Abschnitte) grenzt die Liste auf einen Bereich wie **Apps**, **Chat games** (Chat-Spiele), **Writing help** (Schreibhilfe) oder **Trackers** (Tracker) ein, **All modes** (Alle Modi) auf einen Chat-Modus. **Search agents** (Agenten durchsuchen), das Sortiermenü und **List** (Liste) / **Gallery** (Galerie) funktionieren in jeder Liste.
- **Starter kits** (Einsteigerpakete) installiert einen fertigen Satz Agenten auf einmal. **New agent** (Neuer Agent) beginnt einen [eigenen Agenten](custom-agents.md).
- Wähl einen Agenten aus, um Beschreibung, Download-Größe, Berechtigungen, Kompatibilität und **Version history** (Versionsverlauf) zu sehen. Klick auf **Get**, um ihn zu installieren. Das Menü **⋯** bietet **Uninstall** (Deinstallieren).
- Das Menü **⋯** neben dem Titel enthält **Update all** (Alle aktualisieren), **Install all** (Alle installieren), **Refresh catalog** (Katalog neu laden) und **Uninstall all** (Alle deinstallieren).

Installierte Agenten sind in **Apps**, **Writer Agents**, **Tracker Agents** und **Misc Agents** gruppiert, dazu kommt **Custom Agents** für selbst gebaute. **Apps** sind Pakete mit einem eigenen Home-Tab, etwa Noodle und Slurp. Du nutzt sie eigenständig, statt sie einem Chat hinzuzufügen.

Ein mit **Rules** gekennzeichnetes Paket ist kein Agent. Es liefert einen Game-Mode-Regelsatz wie 5e (SRD 5.1), den du beim Anlegen eines Spiels unter **Rules** wählst. Siehe [Mit einem Regelsatz spielen](../game/rulesets.md). Das 5e-Paket ist eine Vorschau, deshalb listet es nur eine Engine aus dem Branch `staging`.

Deinstallierst du ein Paket, verschwinden sein Code und seine Einstellungen, deine Chatnachrichten und dein Verlauf bleiben aber erhalten. Löschst du einen eigenen Agenten, ist er endgültig weg.

<a id="read-an-agents-guides"></a>
### Anleitungen eines Agenten lesen

Öffne die Seite des Agenten im **Agent Organizer** und klick auf **Lies, wie dieser Agent funktioniert**. Seine Übersicht öffnet sich im Dokumentationsfenster. Wähle ein Thema aus der Liste, um mehr zu lesen. Auf dem Handy kommst du mit dem Zurück-Pfeil zur Themenliste zurück. Schließe das Fenster, um zur Agentenseite zurückzukehren.

**Quelle ansehen** öffnet die Originalanleitung. Einige Agenten haben vorerst nur eine kurze Beschreibung oder einen externen Link, während ihre Autoren Themenanleitungen ergänzen. Kann eine Anleitung nicht geladen werden, versuch es erneut, sobald du online bist. Bereits geöffnete Anleitungen können bis zu sieben Tage verfügbar bleiben; eine gespeicherte Anleitung kann veraltet sein.

**Versionsverlauf** zeigt die drei neuesten Einträge. Klick auf **Ältere Versionen anzeigen**, um mehr zu sehen, oder auf **Weniger Versionen anzeigen**, um die Liste wieder zu kürzen. Die neueste Veröffentlichung steht auch unter **Neuigkeiten**.

### Agenten aktualisieren

Gibt es für ein installiertes Paket eine neuere kompatible Version, öffnet sich das Fenster **Agent updates available**. Es listet jedes Update mit seiner Version auf und zeigt, ob es einen Neustart braucht.

1. Entferne das Häkchen bei jedem Update, das du überspringen willst. Anfangs sind alle Updates ausgewählt.
2. Lies **What's new** (Was ist neu), falls das Paket Release Notes veröffentlicht hat. **More** (Mehr) zeigt lange Notes vollständig an. Ein Punkt markiert eine Änderung, die dir auffallen wird.
3. Klick auf **Update all** – oder auf **Update 2 of 3** (2 von 3 aktualisieren), wenn du einige Häkchen entfernt hast. Jede Zeile zeigt **Updated** oder **Failed**. Eine fehlgeschlagene Zeile nennt den Grund und zeigt **Retry** (wiederholen).
4. Braucht ein Update einen Neustart, klick auf **Restart now** (Jetzt neu starten) oder starte Marinara später neu.

Klick auf **Not now** (Jetzt nicht), um deine Versionen zu behalten. Zu einer übersprungenen Version fragt Marinara nicht noch einmal nach. Über den Tab **Updates** unter **Library → Agents** kannst du jederzeit aktualisieren. Installierte Pakete laufen in ihrer aktuellen Version weiter, auch wenn der Katalog nicht erreichbar ist. **See in Agent Organizer** (in der Agentenverwaltung ansehen) öffnet die Seite des Agenten.

Updates betreffen nur Pakete, die du installiert hast. Pakete liegen auf dem Marinara-Server, deshalb nutzen Browser-Clients, was der Server installiert hat.

Kommst du von einer Engine-Version, die diese Funktionen noch fest mitbrachte, lädt Marinara die passenden Pakete einmalig herunter und behält deine Chat-Auswahl, deine Einstellungen und deinen Verlauf. Ist der Katalog nicht erreichbar, versucht Marinara es beim nächsten Start erneut.

## Verwandte Anleitungen

- [Referenz der herunterladbaren Agenten](built-in-agents.md)
- [2D- und 3D-Avatare](avatars.md)
- [Eigene Agenten erstellen](custom-agents.md)
- [Agent-Freigaben und die Agent Suite](approvals-and-agent-suite.md)
- [Roleplay-HUD und Tracker](../roleplay/hud-and-trackers.md)
