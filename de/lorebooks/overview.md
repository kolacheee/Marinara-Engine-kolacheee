# Lorebooks – Überblick

Ein Lorebook ist eine Sammlung von Fakten über deine Welt, die die KI liest, sobald ihre Schlüsselwörter im Chat auftauchen. Nutze eines für Orte, Fraktionen, Vorgeschichten und Regeln, damit du sie nicht in jeder Nachricht wiederholen musst.

Jedes Lorebook enthält Einträge. Ein Eintrag hat auslösende Schlüsselwörter und einen Textblock. Taucht ein Schlüsselwort im jüngsten Chatverlauf auf, fügt Marinara den Text des Eintrags in den Prompt ein, also in den Text, der für eine Antwort an das Modell geht. In anderen Tools heißen Lorebooks auch World Info.

Ein Beispiel: Ein Eintrag mit dem Schlüsselwort `Eldoria` und dem folgenden Text sorgt dafür, dass die KI die Stadt kennt, sobald jemand sie erwähnt.

```text
Eldoria is a rainy port city ruled by a council of nine merchants.
```

Der Abgleich über Schlüsselwörter funktioniert mit jedem Modell und braucht keine Einrichtung. Wie du nach Bedeutung statt nach exakten Wörtern abgleichst, steht unter [Semantische Suche für Lorebooks](semantic-search.md).

## Ein Lorebook anlegen und einen Eintrag hinzufügen

1. Öffne **Library** (Bibliothek) > **Lorebooks**. Die Bibliothek befindet sich rechts.
2. Klick auf **New** (Neu, das Plus-Symbol). Das Fenster **Create Lorebook** (Lorebook erstellen) öffnet sich.
3. Gib im Feld **Name** einen Namen ein. Dieses Feld ist Pflicht.
4. Ergänze bei Bedarf eine **Description** (Beschreibung).
5. Wähle eine **Category** (Kategorie). Der Standard ist **Other**. Willst du dieses Lorebook mit einem Charakter verknüpfen, wähle **Character**, denn die Auswahl beim Charakter listet nur diese Kategorie.
6. Klick auf **Create Lorebook**. Das neue Lorebook erscheint in der Liste.
7. Klick auf die Zeile des Lorebooks. Der ganzseitige Editor öffnet sich.
8. Klick auf den Tab **Entries** (Einträge).
9. Klick auf **Add Entry** (Eintrag hinzufügen). Eine neue, leere Eintragszeile erscheint.
10. Gib in der Zeile einen Namen ein, etwa `Eldoria`, und klick dann auf die Zeile, um sie zu öffnen.
11. Gib in **Primary Keys** (Hauptschlüsselwörter) `Eldoria` ein und drück <kbd>Enter</kbd>.
12. Schreib in **Content** (Inhalt) den Text für die KI.

Kurz nachdem du aufhörst zu tippen, speichert sich der Eintrag von selbst, und du siehst **Saved automatically**. Ab jetzt kommt der Eintrag in den Prompt, sobald sein Schlüsselwort passt. Schlüsselwörter, Position und Timing erklärt [Lorebook-Einträge: Schlüsselwörter, Position und Timing](entries.md).

Wenn es nicht funktioniert hat: Prüf, ob das Lorebook im Chat aktiv ist (siehe unten), ob sein Schalter **Enabled** (Aktiviert) an ist und ob das Schlüsselwort in den letzten Nachrichten vorkommt. Marinara durchsucht nur so viele Nachrichten, wie die Einstellung **Scan Depth** angibt.

## Ein Lorebook in einem Chat aktiv machen

Ein Lorebook speist die KI nur, wenn es im geöffneten Chat aktiv ist. Dafür gibt es drei Wege.

| Weg | Wo du ihn einstellst | Aktiv in |
| --- | --- | --- |
| Global | Schalter **Global** im Tab **Overview** (Übersicht) des Lorebooks | Jedem Chat |
| Verknüpft | Tab **Overview** des Lorebooks oder Charakter- bzw. Persona-Editor | Chats mit diesem Charakter oder dieser Persona |
| Zu einem Chat hinzugefügt | **Chat Settings → Lorebooks** | Nur diesem Chat |

Ein Lorebook kann nicht zugleich global und verknüpft sein. Schaltest du **Global** ein, entfernt Marinara beim Speichern seine Charakter- und Persona-Verknüpfungen.

Auch ein aktives Lorebook braucht einen eingeschalteten Schalter **Enabled**. Wie du Lorebooks verknüpfst, steht unter [Lorebooks mit Charakteren und Personas verknüpfen](linking-to-characters.md).

## Die Einstellungen im Tab Overview

Öffne ein Lorebook und klick auf **Overview**, um festzulegen, wie sich das ganze Lorebook verhält.

| Einstellung | Was sie bewirkt | Standard |
| --- | --- | --- |
| **Scan Depth** | Wie viele der letzten Nachrichten Marinara auf Schlüsselwörter prüft. 0 durchsucht den ganzen Chat. | 2 |
| **Token Budget** | Die Höchstzahl an Tokens, die dieses Lorebook zu einer Antwort beisteuern kann. 0 bedeutet keine Grenze. | 2048 |
| **Entry Limit** | Die Höchstzahl an Einträgen, die dieses Lorebook zu einer Antwort beisteuern kann. Bereich 1 bis 1000. | 100 |
| **Max Depth** | Zusätzliche Durchläufe für die Rekursion. Erscheint nur, wenn **Recursive** an ist. Bereich 1 bis 10. | 3 |

Tokens sind kleine Textstücke, die Modelle zählen; im Englischen entspricht ein Token etwa drei Vierteln eines Worts. Was jede Grenze bewirkt und was Rekursion bedeutet, steht unter [Token-Budgets und Rekursion bei Lorebooks](token-budgets.md).

Der Tab hat außerdem diese Schalter.

- **Enabled** schaltet das ganze Lorebook ein oder aus. Standardmäßig ist es an.
- **Global** macht das Lorebook in jedem Chat aktiv.
- **Recursive** erlaubt, dass der Text eines aktivierten Eintrags weitere Einträge auslöst. Standardmäßig ist es aus.
- **Vectors** erlaubt Einträgen, auch über ihre Bedeutung zu passen. Standardmäßig ist es aus, und Schlüsselwörter funktionieren in jedem Fall.

Das Panel **Semantic search (embeddings)** unter den Schaltern beschreibt [Semantische Suche für Lorebooks](semantic-search.md).

## Einem Lorebook ein Bild geben

Das Bild erscheint auf der Seite **Lorebooks** (in der Tabelle und auf den Galeriekacheln) und in der Lorebook-Auswahl.

1. Öffne das Lorebook und klick auf **Book settings** (Bucheinstellungen). **Bild** steht neben **Aktiviert**.
2. Klick auf **Hochladen** (oder **Ersetzen**) und wähle eine Datei, oder klick auf **Mit KI generieren**, um mit deiner Verbindung zur Bildgenerierung ein Titelbild zu erstellen. **Mit KI generieren** erscheint, sobald du eine solche Verbindung eingerichtet hast.
3. Klick auf **Zuschnitt anpassen** (oder das kleine Bild). Verschiebe das Quadrat auf dem Bild, um den sichtbaren Ausschnitt zu wählen, und zieh an seinen Ecken, um die Größe zu ändern.
4. Klick auf **Speichern**.

Ein neues Bild ist anfangs nicht zugeschnitten. Um das Bild zu entfernen, öffne **Zuschnitt anpassen** und klick auf **Entfernen**.

Im klassischen Layout findest du das Bild im Abschnitt **Bild** oben im Tab **Übersicht** des Lorebooks, mit denselben Schaltflächen.

## Die Lorebooks-Seite

Öffne **Library → Lorebooks**. Oben findest du **Online suchen** (Lorebooks zum Herunterladen von Chub, siehe [Lorebooks importieren und exportieren](import-export.md#download-a-lorebook-from-chub)), **Import** (Importieren; siehe [Lorebooks importieren und exportieren](import-export.md)) und **New lorebook** (neues Lorebook). Darunter:

- **All kinds** (alle Arten) beschränkt die Liste auf Lorebooks der Arten **Global**, **World**, **Character**, **NPC** oder **Spellbook**.
- **List** (Liste) und **Gallery** (Galerie) wechseln zwischen einer Tabelle und Bildkacheln.
- Das Sortiermenü bietet **Recently edited** (zuletzt bearbeitet), **A to Z**, **Z to A** und **My order** (meine Reihenfolge).

Klick auf ein Lorebook, um es zu öffnen.

### Deine Lorebooks ordnen

- **⋯** am Ende einer Zeile (oder ein Rechtsklick auf die Zeile) bietet **Duplicate** (Duplizieren), **Move to folder** (in Ordner verschieben), **Export** (Exportieren), **Select** (Auswählen) und **Delete** (Löschen). Auf einem Touchscreen hältst du die Zeile gedrückt. **Duplicate** kopiert das Lorebook mit allen Einträgen und öffnet die Kopie.
- Zieh eine Zeile über oder unter eine andere, um deine eigene Reihenfolge festzulegen. Das Sortiermenü wechselt zu **My order**.
- **New folder** (neuer Ordner; das Ordnersymbol neben dem Titel) fügt einen Bibliotheksordner hinzu. Zieh ein Lorebook darauf oder nutze **Move to folder**. Diese Ordner sind von den Eintragsordnern innerhalb eines Lorebooks getrennt. Klick auf einen Ordner, um ihn ein- oder auszuklappen, und nutze sein **⋯**, um ihn umzubenennen oder zu löschen. Beim Löschen eines Ordners bleiben seine Lorebooks erhalten.
- **Select** (das Häkchensymbol neben dem Titel) versieht jede Zeile mit einem Kontrollkästchen. Wähl Lorebooks aus und nutze dann die Leiste unten: **Move to folder**, **On or off** (an oder aus), **Export** (ein `marinara-lorebooks.zip`) oder **Delete**.

## Im klassischen Layout: das Lorebooks-Panel

Das klassische Panel zeigt dieselben Ordner und dieselbe Reihenfolge als Liste. Oben im Panel öffnet **Herunterladen** den Card Browser mit Lorebooks zum Herunterladen. **Bibliothek öffnen** öffnet die Lorebook-Bibliothek, eine ganzseitige Ansicht deiner Lorebooks mit Bildern, Beschreibungen und Eintragszahlen. Klick dort auf ein Lorebook, um es größer zu sehen; **Lorebook bearbeiten** öffnet den Editor, und **Aktiv** schaltet das Lorebook für alle Chats ein oder aus.

Darunter sitzen drei Symbol-Schaltflächen. Zeig mit der Maus darauf, um ihren Namen einzublenden.

- **New** öffnet das Fenster **Create Lorebook**.
- **Import** (Importieren) öffnet das Fenster **Import Lorebook** (Lorebook importieren). Siehe [Lorebooks importieren und exportieren](import-export.md).
- **Select** (Auswählen) schaltet die Mehrfachauswahl ein, damit du mehrere Lorebooks auf einmal exportieren oder löschen kannst.

Unter den Schaltflächen:

- **Search lorebooks** (Lorebooks durchsuchen) filtert nach Name, Beschreibung, verknüpften Charakter- oder Persona-Namen und Tags (Schlagwörtern). `tag:name` funktioniert hier ebenfalls.
- **Tags** neben dem Suchfeld zeigt nur Lorebooks mit allen von dir ausgewählten Tags oder **Ohne Tags**. Siehe [Tags](../characters/library-organization.md#tags).
- **Sort order** (Sortierreihenfolge) bietet **Manual order** (manuelle Reihenfolge), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Meiste Tokens** und **Wenigste Tokens**. Die Größensortierungen nutzen die geschätzte Größe aller Einträge eines Lorebooks, einschließlich deaktivierter Einträge. Diese Größe steht auch in jeder Zeile. Mit **Manual order** ziehst du die Lorebooks an ihren Platz oder nutzt <kbd>Alt</kbd>+<kbd>Pfeil nach oben</kbd> und <kbd>Alt</kbd>+<kbd>Pfeil nach unten</kbd>.
- **New Folder** (Neuer Ordner) legt einen Bibliotheksordner an. Zieh ein Lorebook darauf. Auf dem Handy hältst du das Lorebook gedrückt und ziehst es dann. Diese Ordner sind unabhängig von den Eintragsordnern innerhalb eines Lorebooks.

Jede Zeile hat die Schaltflächen **Copy** (Kopieren; dupliziert das Lorebook) und **Delete** (Löschen). Sie erscheinen, wenn du mit der Maus über die Zeile fährst, und sind auf Mobilgeräten immer sichtbar. Ein ausgeschaltetes Lorebook zeigt ein **OFF**-Badge. Klick auf das Bild, um es hochzuladen oder zu ersetzen.

<a id="save-a-lorebook-set"></a>
### Ein Lorebook-Set speichern

Ein Lorebook-Set ist eine benannte Gruppe von Lorebooks, die du gemeinsam nutzt, etwa für eine Spielwelt. Du wählst die ganze Gruppe statt jedes Lorebook einzeln. Ein Set verweist auf deine Lorebooks und kopiert sie nicht.

1. Klick im Bereich **Lorebooks** auf **Neues Set**. Das neue Set öffnet sich unter **Lorebook-Sets**.
2. Gib unter **Setname** einen Namen ein.
3. Klick auf **Lorebooks auswählen** und hake die Lorebooks an. Jede Änderung wird automatisch gespeichert.

Zum späteren Bearbeiten klickst du unter **Lorebook-Sets** auf das Set. **Set löschen** entfernt nur das Set; seine Lorebooks bleiben in der Bibliothek. Ein gelöschtes Lorebook verschwindet aus allen Sets.

Wähle ein Set unter **Gespeichertes Set verwenden** oberhalb von **Lorebooks auswählen**. Sobald ein Set existiert, erscheint das Feld hier:

- Im Schritt **Attach Lorebooks** eines neuen Roleplay-Chats.
- Bei den festen Quell-Lorebooks eines Agenten, etwa Knowledge Router. Siehe [Wissensquellen: Retrieval- und Router-Agenten](../agents/knowledge-sources.md#choose-the-sources).

Ein Set ersetzt die dort gewählten Lorebooks. Danach kannst du für den Chat oder Agenten Lorebooks ergänzen oder entfernen, ohne das gespeicherte Set zu ändern.

Um einzelne Einträge nur für einen Chat ein- oder auszuschalten, öffne **Chat-Einstellungen → Lorebooks** und klick auf den Stift (**Lorebook-Einträge bearbeiten**) neben dem Lorebook. Die Eintragsschalter gelten nur für diesen Chat. Andere Änderungen dort ändern das Lorebook selbst.

### Kategorien

Eine Kategorie ist eine Beschriftung für deine Bibliothek. Sie ändert nichts daran, wann das Lorebook aktiv wird. Die Tabs sind **All**, **Active** (Lorebooks, die für den geöffneten Chat relevant sind), **World**, **Character**, **NPC**, **Spellbook** und **Other**. Die Kategorie eines Lorebooks änderst du in seinem Tab **Overview**, wo **Other** **Uncategorized** heißt.

## Verwandte Anleitungen

- [Lorebook-Einträge: Schlüsselwörter, Position und Timing](entries.md)
- [Token-Budgets und Rekursion bei Lorebooks](token-budgets.md)
- [Semantische Suche für Lorebooks](semantic-search.md)
- [Lorebooks mit Charakteren und Personas verknüpfen](linking-to-characters.md)
- [Lorebooks importieren und exportieren](import-export.md)
- [Wissensquellen: die Agenten Knowledge Retrieval und Knowledge Router](../agents/knowledge-sources.md)
