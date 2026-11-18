# Personas

Eine Persona ist die Charakterkarte, die dich in einem Chat vertritt: dein Name, deine Beschreibung und weitere optionale Angaben. Marinara schickt diese Angaben in jedem Prompt mit, damit die KI weiß, mit wem sie spricht. Du kannst viele Personas anlegen und pro Chat eine auswählen. Wie du eine verwendest, steht unter [Die Persona für einen Chat auswählen](choosing-your-persona.md).

## Eine Persona erstellen

1. Klick in der oberen Navigationsleiste auf **Personas**. Siehst du den Eintrag nicht, öffne zuerst **More** (Mehr).
2. Klick auf **New** (Neu). Das Fenster **Create Persona** öffnet sich.
3. Trag im Feld **Name** einen Namen ein. Das ist das einzige Pflichtfeld.
4. Klick auf **Create**.

Die Persona entsteht mit leerer Beschreibung und öffnet sich im Persona-Editor.

5. Öffne den Tab **Card** und schreib deine **Description**: deinen Namen, dein Aussehen und wie du dich verhältst.
6. Klick in der Kopfzeile auf **Save** (Speichern).

Wähle die Persona danach in dem Chat aus, in dem du sie verwenden möchtest. Siehe [Die Persona für einen Chat auswählen](choosing-your-persona.md).

## Was eine Persona bewirkt

Marinara schickt deine Persona in jedem Prompt an die KI. Wähle in einem Chat **None** (keine), um keine Persona zu senden. Ohne Persona nennt dich die KI „User“.

Das Makro `{{user}}` ist ein Platzhalter. Marinara ersetzt es durch den Namen der Persona, bevor es den Prompt sendet. Heißt deine Persona Alex, wird aus `{{user}}` Alex. Siehe [Makros](../prompts/macros.md).

## Die Seite „Personas“

Öffne **Bibliothek → Personas**. Die Seite funktioniert wie die [Characters-Seite](library-organization.md#the-characters-page): Porträtkarten, **Importieren**, **Neue Persona** – leer oder mit einer Vorlage –, ein Suchfeld mit der Schaltfläche **Tags** daneben, **Kürzlich bearbeitet**, das Sortiermenü mit **A bis Z**, **Z bis A**, **Neueste**, **Älteste** und **Meine Reihenfolge** sowie drei Kartengrößen. Klick auf eine Karte, um die Persona im Persona-Editor zu öffnen.

Hier funktionieren dieselben Tools wie auf der Characters-Seite: **⋯** auf einer Karte mit **Duplicate** (Duplizieren), **Move to folder** (In Ordner verschieben), **Export** (Exportieren), **Select** (Auswählen) und **Delete** (Löschen), Karten durch Ziehen in **My order** anordnen, **New folder** (Neuer Ordner) und mit **Select** mehrere Personas auf einmal als `marinara-personas.zip` exportieren oder löschen. Siehe [Aktionen einer Karte](library-organization.md#a-cards-actions).

## Im klassischen Layout: das Personas-Panel

Das klassische Panel **Personas** zeigt dieselben Ordner und dieselbe Reihenfolge als Liste. Klick auf eine Zeile, um diese Persona im Persona-Editor zu öffnen.

| Bedienelement | Funktion |
| --- | --- |
| **Download** (Herunterladen) | Öffnet den [Card Browser](bot-browser.md), in dem du auf PlotLight auch Personas findest. |
| **Open Library** (Bibliothek öffnen) | Öffnet die ganzseitige Persona-Bibliothek mit demselben Raster und derselben Vorschau wie die Charakter-Bibliothek. |
| **New** | Erstellt eine Persona. |
| **Import** | Öffnet das Fenster **Import Persona**. |
| **Select** | Schaltet den Auswahlmodus ein, um mehrere Personas auf einmal zu löschen oder zu exportieren. |
| Suchfeld | Platzhaltertext **Search personas/tags** (Personas/Tags durchsuchen). Es durchsucht Name, Beschreibung, Kommentar und Tags. Zur Suche nach Tags siehe [Suche](library-organization.md#search). |
| Sortier-Dropdown | **Manual order** (manuelle Reihenfolge), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Meiste Tokens** oder **Wenigste Tokens** (geschätzte Größe, die auch in jeder Zeile steht). |
| **New Folder** (Neuer Ordner) | Legt einen Ordner an. |
| **Tags** | Klappt die Tag-Liste zum Filtern auf. |

In **Manual order** ziehst du eine Zeile oder drückst auf einer fokussierten Zeile <kbd>Alt</kbd>+<kbd>Up</kbd> oder <kbd>Alt</kbd>+<kbd>Down</kbd>. Auf einem Touchscreen hältst du eine Zeile gedrückt, um sie aufzunehmen. Zeigst du auf eine Zeile, erscheinen **Duplicate** und **Delete**. Gibt es mehr Personas, als eine Seite zeigt, erscheint die Schaltfläche **Load more** (Mehr laden). Ohne Personas zeigt das Panel **No personas yet**.

## Der Persona-Editor

Öffnest du eine Persona, ersetzt der ganzseitige Persona-Editor den Chatbereich. Die Kopfzeile enthält:

- Einen Pfeil **Back** (Zurück).
- Die Avatar-Kachel. Klick darauf, um ein Bild hochzuladen. Ist eine Verbindung für die Bildgenerierung eingerichtet, erzeugt eine Zauberstab-Schaltfläche auch eines.
- Das Namensfeld und ein Kommentarfeld für eine kurze Bezeichnung wie `Modern AU version`.
- **Save**. Die Schaltfläche bleibt ausgegraut, bis du etwas änderst.
- Das Menü **…** (**Weitere Aktionen**) mit **Professor Mari fragen**, **Persona exportieren**, **Persona als Charakter hinzufügen**, **Persona duplizieren** und **Persona löschen**.

Beim Verlassen des Editors werden deine Änderungen zuerst gespeichert. Schlägt das Speichern fehl, bleibt der Editor mit deinem Entwurf geöffnet.

Die Tabs sind, in dieser Reihenfolge, **Metadaten**, **Karte**, **Gespräch**, **Lorebook**, **Bilder**, **Farben** und **Statistik**. Jeder Tab springt zu seinem Abschnitt in einem einzigen langen Formular.

Der Persona-Editor funktioniert wie der [Charakter-Editor](creating-and-editing-characters.md). Die Hinweise unten beschreiben, was anders ist.

| Tab | Hinweise für Personas |
| --- | --- |
| **Metadata** | Identität und Bibliotheksangaben. Siehe die Liste unter dieser Tabelle. |
| **Card** | Siehe [Tab „Card“](#card-tab) unten. |
| **Convo** | Felder, die nur im Conversation Mode gelten. Siehe [Conversation-Mode-Profile](../conversation/profiles.md). |
| **Lorebook** | Hänge Lorebook-Einträge an, die auslösen, wenn diese Persona im Chat ist. Siehe [Lorebooks – Überblick](../lorebooks/overview.md). |
| **Bilder** | **Charakterbogen**, **Sprites** (stehende Bilder für Game Mode und Roleplay, mit **Gesichtsausdrücke**, **Ganzkörper**, **Clips** und **Ordner hochladen**) und **Galerie** (Referenzbilder und Videos, mit **Persona-Bilder hochladen** und **Persona-Videos hochladen**). Siehe [Charakter-Sprites](sprites.md) und [Galerien für Charaktere und Personas](galleries.md). |
| **Colors** | Farben für Name, Dialog und Nachrichtenbox. Siehe [Charakterfarben und Roleplay-Werte](colors-and-stats.md). |
| **Stats** | Statusbalken und RPG-Attribute. Siehe [Tab „Stats“](#stats-tab) unten. |

Der Tab **Metadata** zeigt:

- **Persona ID** mit **Copy** (Kopieren).
- Den Zuschnitt des Avatars.
- **Name** und **Creator**.
- **Other names** (weitere Namen), Spitznamen, vollständige Namen oder Titel, unter denen die Persona ebenfalls bekannt ist. Roleplay-Chats können sie in der Namensfarbe darstellen, siehe [Deinen Namen in Nachrichten einfärben](choosing-your-persona.md#color-your-name-in-messages).
- **Phonetic name**, das nur verwendet wird, wenn Text to Speech deinen Namen vorliest.
- **Title / Comment**, eine kurze Bezeichnung.
- **Version**, standardmäßig `1.0`, mit dem Schalter **Automatic versioning** (automatische Versionierung).
- **Tags**.
- **Creator Notes**, die nie an die KI gehen.

### Tab „Card“

Der Tab **Card** enthält die Felder, die dich der KI beschreiben. Jedes zeigt eine laufend aktualisierte Token-Schätzung.

| Feld | Was du schreibst | An die KI gesendet |
| --- | --- | --- |
| **Summary** (Zusammenfassung) | Ein Überblick für die Bibliothek und Vorschauen. | Nein |
| **Description** | Deine allgemeine Identität und Rolle. | In jedem Prompt |
| **Personality** | Temperament, Verhalten, Sprechgewohnheiten. | Ja |
| **Backstory** | Vorgeschichte, Herkunft, Beziehungen. | Ja |
| **Appearance** | Aussehen, Kleidung, visuelle Details. | Ja |
| **Scenario** | Deine Standardsituation in Roleplays. | Ja |
| **Example Dialogue** (Beispieldialog) | Beispielgespräche. Trenne sie mit `<START>`. Verwende `{{user}}` für deine Persona und `{{char}}` für den anderen Charakter. | Ja |

**Image Appearance Override** (eigene Aussehensbeschreibung für Bilder) unter **Appearance** funktioniert wie bei Charakteren. Siehe [Tab „Card“](creating-and-editing-characters.md#card-tab). Die Textfelder unterstützen Makros.

Diese Funktionen arbeiten wie bei Charakteren, nur mit der Persona als Gegenstand:

- Die Zauberstab-Schaltfläche über jedem Feld schreibt es für dich. Siehe [Ein Kartenfeld mit dem Zauberstab schreiben](creating-and-editing-characters.md#write-a-card-field-with-the-wand).
- **Add Alternative Field** (alternatives Feld hinzufügen) unter jedem Feld gibt ausgewählten Chats eine andere Fassung. Die Liste **Active in** zeigt nur Chats, die diese Persona verwenden, und Zuordnungen pausieren, wenn ein Chat eine andere Persona wählt. Du kannst jede Alternative benennen und unter **Chat Settings → Card Field Alternatives** (Chat-Einstellungen → Alternativen für Kartenfelder) zwischen ihnen wechseln. Siehe [Ein alternatives Feld in ausgewählten Chats verwenden](creating-and-editing-characters.md#use-an-alternative-field-in-selected-chats).
- **Version history** (Versionsverlauf) liegt im Tab **Metadata**. Vor deiner ersten Bearbeitung steht dort `Previous persona states will appear here after the next edit.` **Reset** (Zurücksetzen) löscht jede Momentaufnahme und setzt die Version auf 1.0. Siehe [Versionsverlauf](creating-and-editing-characters.md#version-history).

### Tab „Stats“

Der Tab **Stats** hat zwei getrennte Blöcke. Beide speisen das HUD, die Werteanzeige, die während eines Chats auf dem Bildschirm erscheint.

- **Enable Persona Stats** (Persona-Werte aktivieren) schaltet Statusbalken ein, also Anzeigen für Bedürfnisse wie Hunger und Stimmung. Neu eingeschaltet beginnt der Block mit Satiety, Energy, Hygiene und Mood, jeweils bei 100 von 100. Der Agent **Persona Stats** passt sie im Lauf der Geschichte an.
- **Enable Roleplay Stats** (Roleplay-Werte aktivieren) schaltet Pools (Balken wie HP und MP) und Attribute (Zahlen wie Stärke) ein. Beides erklärt [Charakterfarben und Roleplay-Werte](colors-and-stats.md). Neu eingeschaltet beginnt der Block mit HP und MP bei 100 von 100 sowie STR, DEX, CON, INT, WIS und CHA bei 10. Diese Werte werden für Kampf und Game Mode sowie für optionale Würfe mit der Persona gesendet. Agenten aktualisieren sie nicht.

Der Block **Game Mode Icon** (Symbol für Game Mode) legt das Bild auf deinem Token bei einem Kampf in Game Mode fest. Siehe [Symbol für Game Mode](colors-and-stats.md#game-mode-icon). Ist ein Game-Mode-Regelsatz (ein Regelwerk für Spiele im Tabletop-Stil) installiert, enthält der Block **Ruleset sheets** (Regelsatzbögen) deine Startkonfiguration dafür. Siehe [Regelsatzbögen](colors-and-stats.md#ruleset-sheets). Die Werte, die du hier setzt, sind die Startvorgaben für neue Chats.

## Personas importieren und exportieren

Zum Importieren klick im Panel **Personas** auf **Import**. Das Fenster **Import Persona** nimmt `.marinara`- und `.json`-Dateien an, auch mehrere auf einmal. Eine Marinara-Datei stellt alle Details, Sprites und die Struktur der Galerie wieder her. Eine allgemeine JSON-Datei aus einem anderen Werkzeug wird Feld für Feld einer neuen Persona zugeordnet. Ein Name ist Pflicht. Jede Datei zeigt ein Zeichen für Erfolg oder Fehlschlag.

Zum Exportieren klick im Editor auf **…** und dann auf **Persona exportieren** oder nutze im Auswahlmodus **Exportieren**. Das Fenster **Persona exportieren** bietet zwei Formate:

| Format | Was du bekommst |
| --- | --- |
| **Marinara Native** | Alle Marinara-Persona-Details, Sprites und angehängten Lorebooks. Nimm dieses Format, um eine Persona zwischen Marinara-Installationen umzuziehen. |
| **Compatible JSON** | Nur die einfachen Persona-Felder, für andere Werkzeuge. |

Ein Sammelexport lädt eine ZIP-Datei mit je einer Datei pro Persona herunter.

## Eine Persona duplizieren oder löschen

Zum Duplizieren klick in einer Zeile auf **Duplizieren** oder im Menü **…** des Editors auf **Persona duplizieren**. Die Kopie heißt „{original name} (Copy)“ und behält alle Kartenfelder, Farben, Werte und Convo-Felder. Kein Chat wechselt dadurch seine Persona.

Zum Löschen klick in einer Zeile auf **Delete** oder im Editor auf **Delete persona** und bestätige. Das lässt sich nicht rückgängig machen. Um mehrere zu löschen, klick auf **Select**, hak die Personas ab und nutze **Delete** in der Auswahlleiste. Schlägt eine Löschung fehl, bleiben diese Personas ausgewählt, damit du es erneut versuchen kannst.

## Eine Persona als Charakter hinzufügen

**Persona als Charakter hinzufügen** im Menü **…** in der Kopfzeile des Editors legt eine neue Karte bei deinen Charakteren an. Sie übernimmt Name, Beschreibung, Persönlichkeit, Szenario, Vorgeschichte, Aussehen, Tags, Ersteller, Version und Avatar. Die Persona bleibt, wie sie war. Wie du die neue Karte bearbeitest, steht unter [Charaktere anlegen und bearbeiten](creating-and-editing-characters.md).

## Verwandte Anleitungen

- [Die Persona für einen Chat auswählen](choosing-your-persona.md)
- [Charakterfarben und Roleplay-Werte](colors-and-stats.md)
- [Charaktere anlegen und bearbeiten](creating-and-editing-characters.md)
- [Conversation-Mode-Profile](../conversation/profiles.md)
- [Makros](../prompts/macros.md)
