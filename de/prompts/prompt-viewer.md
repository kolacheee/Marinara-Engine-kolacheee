# Prompt Viewer

Der Prompt Viewer stellt Preset, Lorebooks, Charaktere und Persona nebeneinander und zeigt ihren gemeinsamen Prompt in der Reihenfolge, in der Marinara ihn sendet. Klick auf einen Teil, um ihn direkt zu bearbeiten. Änderungen werden im tatsächlichen Preset, Lorebook, der Karte oder Persona gespeichert und erscheinen sofort in den anderen Editoren.

Er entstand als kolaches Erweiterung AIO Prompt Viewer and Editor und gehört jetzt zum neuen Layout.

<a id="opening-it"></a>
## Öffnen

- **Computer:** der Prompt-Viewer-Button (🥞) in der Topbar, direkt nach Search.
- **Handy oder Tablet:** Tippe auf die Tab-Anzahl in der Topbar, um All Tabs zu öffnen, dann auf den Prompt-Viewer-Button (🥞) neben **+**.
- **Überall:** Öffne Search und tippe `prompt viewer` ein.

Er öffnet sich in einem eigenen Tab. Beim Tabwechsel bleiben Auswahl und ungespeicherte Änderungen erhalten. Beim Schließen fragt er nach, falls etwas ungespeichert ist.

<a id="the-three-columns"></a>
## Die drei Spalten

| Spalte | Zweck |
| --- | --- |
| **Sources** | Wähle Preset, ein oder mehrere Lorebooks, einen Charakter (mehrere für eine Gruppe) und eine Persona. Hake Lorebook-Einträge oder Ordner an, um sie in den Prompt aufzunehmen. **+** erstellt ein neues Element, der Stift öffnet seine Einstellungen. |
| **Prompt** | Deine Auswahl in der Zusammenbaureihenfolge der Engine: Preset-Abschnitte, Lorebook-Einträge an ihrer Position und Tiefe, Charakter und Persona an ihren Markern. **Validate** sucht nicht geschlossene XML-Tags und fehlerhafte `{{macros}}`. Ziehe Abschnitte, um das Preset umzuordnen. |
| **Editor** | Die Felder des angeklickten Elements. **Speichern** speichert zurück, **Zurücksetzen** verwirft die Änderung. |

Auf Handys und hochkant gehaltenen Tablets liegen die Spalten hinter dem Schalter **Sources / Prompt / Editor**. Ein Klick auf einen Block führt zum Editor.

<a id="inspect-summaries-and-settings"></a>
## Inspect, Summaries und Settings

Die Buttons oben öffnen diese Ansichten innerhalb der Seite. **Zurück** führt zu den Spalten zurück.

- **Untersuchen** zeigt den Prompt, wie er ans Modell gesendet würde. Bei offenem Chat fordert **Include history** den exakten Prompt an (Makros aufgelöst, Verlauf passend gekürzt); **Omit history** zeigt die Struktur mit einem Chat-Platzhalter. Kopiere ihn als Text oder JSON-Nachrichtenliste.
- **Summaries** exportiert alle Chat-Zusammenfassungen deiner Bibliothek als Markdown oder JSON, auch deaktivierte Einträge. Dafür muss kein Chat geöffnet sein.
- **Einstellungen** legt fest, wie Inspect mit dem Verlauf umgeht, wie viele Runden Chats ohne Verbindung zeigen, welche Abzeichen die Prompt-Spalte zeigt und welche Farben Inspect nutzt.

<a id="what-it-does-not-show"></a>
## Was nicht angezeigt wird

- Die Prompt-Spalte lässt Agenten aus. Inspect enthält sie, da es die Engine fragt.
- Chatverlauf, Zusammenfassungen, Dialogbeispiele und Agentendaten sind in der Prompt-Spalte Platzhalter: Ihr Inhalt existiert erst beim Ausführen eines Chats.
- Das Verhalten einer Gruppe pro Runde (wer antwortet, „Respond only as…“) wird beschrieben, aber erst mit geöffnetem Chat aufgebaut.
