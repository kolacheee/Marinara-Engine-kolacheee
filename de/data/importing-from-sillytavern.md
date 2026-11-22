# Aus SillyTavern importieren

Hol deine SillyTavern-Daten in Marinara Engine. Importiere jeweils eine Datei oder lass einen ganzen SillyTavern-Ordner durchsuchen und importiere alles auf einmal.

## Was du übernehmen kannst

| SillyTavern-Daten | In Marinara |
| --- | --- |
| Charaktere | Charaktere |
| Chats und Gruppenchats | Chats |
| Presets | Presets (die Abschnitte des Prompts und die Sampler-Einstellungen des Presets) |
| World Info | Lorebooks (Notizen, die die KI liest, wenn bestimmte Wörter vorkommen) |
| Hintergründe | Chat-Hintergründe |
| Personas | Personas (das Profil, das dich vertritt) |

## Schneller Import einzelner Dateien

1. Öffne **Settings → Data → SillyTavern Import** (Einstellungen → Daten → SillyTavern-Import).
2. Klick auf die Schaltfläche für deinen Dateityp.
3. Wähle die Datei.

| Schaltfläche | Datei |
| --- | --- |
| **Import Character (JSON/PNG)** | Eine `.json`- oder `.png`-Charakterkarte. |
| **Import Chat (JSONL)** | Ein `.jsonl`-Chatprotokoll (ein JSON-Eintrag pro Zeile, das Format, in dem SillyTavern Chats speichert). |
| **Import Preset (JSON)** | Ein `.json`-Preset. |
| **Import Lorebook (JSON)** | Eine `.json`-World-Info-Datei. |

Über den Schaltflächen fügen **Tag imported** (als importiert markieren) und **Tag source** (Quelle markieren), die beide standardmäßig eingeschaltet sind, den importierten Elementen die Tags **Imported** und **ST** hinzu. Entferne bei einer der Optionen den Haken, wenn der entsprechende Tag nicht hinzugefügt werden soll. Namen und Beschreibungen der Importe bleiben erhalten. Ansonsten haben die Schaltflächen keine Optionen. Ein Charakterimport behält alle Tags der Quelle und beschränkt jedes Regex-Skript auf diesen Charakter. Ein Regex-Skript ist eine Suchen-und-Ersetzen-Regel für Text. Um diese Optionen selbst zu wählen, nimm **Import** auf der Seite **Library → Characters** (Bibliothek → Charaktere). Siehe [Charakterkarten importieren und exportieren](../characters/import-export.md).

Enthält eine Charakterkarte ein Lorebook, fragt dein Browser, ob er es als eigenes Lorebook importieren soll. Klicke auf **OK**, um es als wiederverwendbares Lorebook zu behalten, oder auf **Cancel**, um nur den Charakter zu importieren.

**Import Chat (JSONL)** erstellt einen Roleplay-Chat, sofern die Datei keinen anderen Modus festhält, und öffnet ihn.

### Einen Chat in einen Modus deiner Wahl importieren

Um den Modus zu wählen, nutze die Import-Schaltfläche oben in der Chatliste. Ihr Tooltip lautet **Import SillyTavern or Marinara chat JSONL**. Sie importiert in den Modus-Tab, den du gerade geöffnet hast (Conversation, Roleplay oder Game). Siehe [Chats exportieren und importieren](../chats/export-import.md).

## Einen SillyTavern-Ordner importieren

Bevor du anfängst: Der Assistent liest Dateien auf dem Server-Rechner. Liegt SillyTavern auf einem anderen Rechner, kopiere zuerst seinen Ordner (den, in dem du SillyTavern installiert hast) auf den Marinara-Rechner. Auf dem Rechner mit Marinara funktioniert der Assistent sofort. Von einem anderen Gerät aus musst du das Admin-Secret auf dem Server festlegen und unter **Settings → Advanced → Security** (Einstellungen → Erweitert → Sicherheit) eingeben. Siehe [Marinara sichern und wiederherstellen](backup-and-restore.md) und den Abschnitt „Privileged APIs (ADMIN_SECRET)“ der [Referenz zur Server-Konfiguration](../CONFIGURATION.md).

1. Öffne **Settings → Data → SillyTavern Import**.
2. Klicke auf **Import from SillyTavern Folder**.
3. Wähle deinen SillyTavern-Ordner. Nimm den Hauptordner, meist den, der `data/` oder `public/` enthält. Nutze einen dieser Wege:
   - Klicke auf **Browse** und wähle den Ordner.
   - Gibt es keine Ordnerauswahl (ein entfernter Server), öffnet sich ein Ordner-Browser in der App. Er listet nur Ordner im Home-Ordner des Benutzers, der den Server betreibt. Klicke auf **Select This Folder**.
   - Gib den Pfad in **Pfad zum SillyTavern-Ordner** ein, zum Beispiel `/home/you/SillyTavern`. Ein eingegebener Pfad funktioniert, wenn er innerhalb des Home-Ordners des Benutzers liegt, der den Server ausführt. Ist die Server-Einstellung `IMPORT_ALLOWED_ROOTS` gesetzt, muss er stattdessen in einem der dort angegebenen Ordner liegen.
4. Klicke auf **Scan Folder**. Marinara zeigt, wie viele Elemente es in jeder Kategorie gefunden hat.
5. Wähle unter **Choose exactly what to import** die gewünschten Elemente aus. Jede Kategorie hat die Schaltflächen **All** und **None** sowie einen Schalter **Show** oder **Hide** für die einzelnen Elemente.
6. Klicke auf **Import Selected**. Ein Fortschrittsbalken zeigt das aktuelle Element und eine Zahl pro Kategorie.
7. Sobald **Import abgeschlossen!** erscheint, lies die Anzahl je Kategorie und klick auf **Fertig**. Unter den Zahlen steht eine kurze Liste: wie viele Chats ihre Author's Note und Persona behalten haben, für welche SillyTavern-Benutzernamen hier keine Persona existierte und welche Preset-Einstellungen ausgelassen wurden.

Die meisten Elemente sind vorausgewählt. Die Standard-Presets von SillyTavern, etwa `deterministic`, `neutral` und die `universal-*`-Presets, lässt Marinara unmarkiert, und ein Banner weist darauf hin. Lass sie unmarkiert, solange du keine Kopien willst.

Findet die Suche Charaktere, erscheinen zwei weitere Optionen:

**Imported character tags** (Standard **All tags**):

- **All tags** behält die Tags der Quelle.
- **No tags** überspringt sie.
- **Existing only** behält nur Tags, die du schon hast.

**Imported regex scripts** (Standard **Character only**):

- **Character only** wendet die Skripte auf den jeweiligen Charakter an.
- **Global** fügt sie unter **Bibliothek → Regex-Skripte** hinzu (im klassischen Layout **Voreinstellungen → Regex-Skripte**). Dort verwaltest du Skripte, die chatübergreifend laufen. Siehe [Regex-Skripte](../extending/regex-scripts.md#manage-your-scripts).

Wenn es nicht funktioniert hat:

- „Could not find SillyTavern data directory.“ heißt, dass Marinara diesen Ordner nicht lesen kann. Wähle den SillyTavern-Hauptordner.
- „Marinara can only read folders inside your home folder“ bedeutet, dass der Ordner außerhalb des Home-Ordners des Benutzers liegt, der den Server ausführt. Verschiebe den SillyTavern-Ordner dorthin oder bitte den Serverbetreiber, seinen Speicherort mit `IMPORT_ALLOWED_ROOTS` zu erlauben. Ist diese Einstellung gesetzt, muss auch ein ausgewählter Ordner innerhalb eines ihrer Ordner liegen. Siehe die [Server-Konfiguration – Referenz](../CONFIGURATION.md).
- Erhält **Durchsuchen** einen eingegebenen Pfad außerhalb des Home-Ordners, öffnet sich der Ordnerbrowser stattdessen im Home-Ordner.
- Schlägt ein Element fehl, überspringt Marinara es, macht weiter und listet es im letzten Schritt unter den Warnungen auf, zum Beispiel `Character "Foo": error message`.

## Was mit deinen Daten passiert

- Chatdateien, die zu einem Charakter gehören, werden als Verzweigungen eines Chats importiert. Eine Verzweigung ist eine Kopie eines Chats, die du getrennt fortsetzt.
- Gruppenchats werden als Roleplay-Chats importiert.
- Importierte Einträge behalten das Datum der letzten Änderung der Quelldatei, nicht das Importdatum. Jede Chat-Nachricht behält das Datum, mit dem SillyTavern sie gespeichert hat.
- Die **Author's Note** eines Chats wird samt ihrer Tiefe übernommen. Hatte SillyTavern dafür eine andere Häufigkeit, Position oder Rolle, fügt Marinara sie trotzdem bei jeder Antwort in dieser Tiefe ein und weist beim Import darauf hin. Eine in SillyTavern ausgeschaltete Notiz bleibt aus.
- Ein Chat wird mit der Persona verknüpft, die SillyTavern verwendet hat: mit der fest zugewiesenen Persona, sonst mit der Persona, die genauso heißt wie der Benutzer des Chats. Importiere Personas im selben Durchlauf oder lege vorher eine mit diesem Namen an. Gibt es keine passende, bleibt der Chat ohne Persona, und der Import nennt die fehlende Persona.
- Ein Preset bringt seine Sampler-Einstellungen mit: Temperatur, Top P, Top K, Min P, Frequency und Presence Penalty sowie Reasoning Effort. Sie sind die Anfangswerte für Chats, die dieses Preset verwenden; eigene Werte der Verbindung oder des Chats haben weiterhin Vorrang. Maximale Antwortlänge und Kontextgröße bleiben bei deiner Verbindung. Für Top A und Repetition Penalty gibt es hier keine Einstellung; sie werden ausgelassen.
- Charaktere, Personas, Lorebooks, Presets und Chats erhalten die Tags **Imported** und **ST**, sofern du nicht bei **Tag imported** oder **Tag source** oberhalb von **Import Selected** den Haken entfernst. Ihre Namen und Beschreibungen bleiben unverändert.

## Was sich nicht übernehmen lässt

Der Assistent liest nur die Kategorien aus der ersten Tabelle. Andere SillyTavern-Daten wie globale App-Einstellungen, Schnellantworten, Instruct- und Kontextvorlagen sowie Verbindungsprofile werden nicht importiert. Vor dieser Korrektur importierte Chats erhielten den Importzeitpunkt als Nachrichtendatum. Um das bei einem Chat zu korrigieren, lösche ihn und importiere seine Datei erneut (entferne bei einem Ordnerimport das Häkchen bei **Bereits Vorhandenes überspringen**).

## Verwandte Anleitungen

- [Charakterkarten importieren und exportieren](../characters/import-export.md)
- [Lorebooks importieren und exportieren](../lorebooks/import-export.md)
- [Chats exportieren und importieren](../chats/export-import.md)
- [Regex-Skripte](../extending/regex-scripts.md)
