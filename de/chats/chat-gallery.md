# Die Chat-Galerie

Die **Galerie** enthält die Bilder und Videos eines Chats: Illustrationen, Selfies, gemalte Hintergründe, Storyboard-Frames und alles, was du hochlädst. Sie ist ein Abschnitt der **Chat-Einstellungen**. Am Computer kannst du sie in einem eigenen Fenster öffnen (siehe [Chat-Einstellungen im Überblick](chat-settings.md#popping-a-section-out-into-its-own-window)).

Die Galerie eines Chats gehört zu diesem Chat. Bilder, die du unabhängig vom Chat für einen Charakter behalten möchtest, gehören in die eigene Galerie des Charakters. Siehe [Charakter- und Persona-Galerien](../characters/galleries.md).

## Bilder und Videos

Die **Galerie** hat zwei Tabs: **Bilder** und **Videos**. Jeder Tab zeigt an, wie viele Einträge er enthält. Im Tab **Videos** findest du Szenenvideos aus Roleplay- und Game-Chats sowie Videonachrichten aus Conversation-Chats.

Oben im Abschnitt erscheinen Aktionsschaltflächen nur dann, wenn die jeweilige Funktion für den Chat verfügbar ist:

- **Illustrieren**: führt den Illustrator-Agenten einmal aus, um ein Szenenbild zu erstellen. Siehe [Illustrator-Agent](../media/illustrator-agent.md).
- **Selfie**: generiert im Modus Conversation ein Selfie eines Charakters.
- **Hintergrund**: malt einen Hintergrund für die aktuelle Szene und wendet ihn an. Siehe [Von Illustrator erstellte Hintergründe](../media/scene-backgrounds.md#paint-a-background-now).
- **Video**: erstellt aus der neuesten Illustration ein Szenenvideo. Im Modus Conversation sendet die Funktion stattdessen eine Videonachricht eines Charakters; siehe [Videonachrichten](../conversation/selfies.md#video-messages).
- **Storyboard erstellen**: generiert Keyframes für den letzten Game-Mode-Zug oder die letzte abgeschlossene Roleplay-Episode, wenn Storyboard aktiv ist.
- **Browse Images** (Bilder durchsuchen): öffnet eine Übersicht gespeicherter Bilder zum Einfügen.
- **Storyboard ansehen**: öffnet das neueste Game-Mode-Storyboard.

Unter den Schaltflächen liegt die Ablagefläche **Bilder hochladen**. Zieh Bilder darauf, um eigene Bilder zur Galerie dieses Chats hinzuzufügen.

### Aktionen für einzelne Bilder

Bewege den Mauszeiger im Tab **Bilder** über ein Bild oder tippe auf dem Mobilgerät darauf, um seine Aktionen anzuzeigen:

- Öffne das Bild in voller Größe (**Galeriebild öffnen**).
- **An den Chat anheften**: heftet das Bild als frei schwebendes Bild an den Chat. Zieh es zum Verschieben und nutze den Griff an der Ecke, um seine Größe zu ändern. Position und Größe bleiben erhalten, wenn du die Seite in diesem Browser neu lädst. Die Schaltfläche mit dem Schloss neben der Schaltfläche zum Schließen verhindert das Verschieben und Ändern der Größe, bis du das Bild wieder entsperrst.
- **Bild herunterladen**: speichert das Bild auf deinem Gerät.
- **Illustration animieren**: macht aus diesem Bild ein Szenenvideo.
- **Prompt kopieren**: kopiert den gespeicherten Bild-Prompt. Ist für das Bild kein Prompt gespeichert, steht hier **Kein Prompt gespeichert** und die Schaltfläche ist deaktiviert.
- Die Schaltfläche mit dem Etikett oben links im Bild: **Use as background** (als Hintergrund verwenden) kennzeichnet es als Hintergrund und fragt, welche Orte es zeigt, etwa `John's bedroom`.
- **Add to a character's or persona's gallery** (zur Galerie eines Charakters oder einer Persona hinzufügen; die Schaltfläche mit dem Personensymbol): bewahrt das Bild in der eigenen Galerie dieses Charakters oder dieser Persona auf, sodass es auch nach dem Löschen dieses Chats erhalten bleibt. Seine Kennzeichnung als Hintergrund und die Orte werden mit übernommen, und es begleitet den Charakter dann in jeden Chat. Siehe [Hintergründe, die einen Charakter begleiten](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).
- **Galeriebild löschen**: entfernt das Bild nach deiner Bestätigung.

### Ein Bild neu generieren

Du kannst ein generiertes Bild erneut erstellen, ohne die zugehörige Antwort neu zu generieren. Das funktioniert bei Bildern in der Chat-Galerie, für die ein Prompt gespeichert ist, etwa bei Illustrationen, Selfies und Storyboard-Frames.

1. Öffne das Bild in voller Größe, entweder aus der Galerie oder aus der Nachricht, in der es enthalten ist.
2. Klick auf **Bild neu generieren** (die Schaltfläche mit dem kreisförmigen Pfeil oben rechts im Bild).
3. Ändere unter dem Bild, was du möchtest: die Felder **Prompt** und **Negativer Prompt**, unter **Charakter-Prompts** ein Feld pro Charakter, sofern das Bild solche Prompts hatte, sowie das Bildmodell.
4. Klick auf **Bild generieren** oder auf **Abbrechen**, um das Bild unverändert zu lassen.

Das neue Bild wird die gewählte Version in der Nachricht. Frühere Ergebnisse bleiben in einer Gallery-Kachel mit Versionsanzahl zusammen. Jede Version behält Prompt, negativen Prompt und weitere gespeicherte Generierungsdetails. Referenzbilder kommen erneut von den aktuellen Charakteravataren, gefolgt von den ursprünglich verwendeten Lorebook-Eintragsbildern. Stability AI, Arli AI, SD Web UI und Draw Things erhalten keine Eintragsbilder. Bei älteren Bildern fehlen manchmal negativer Prompt und Charakter-Prompts; der Editor weist darauf hin.

<a id="image-versions"></a>
### Bildversionen

Öffne ein gestapeltes Bild, um eine Version zu wählen. In einer Gallery wechseln Links-/Rechtspfeile, Pfeiltasten und horizontales Wischen zwischen Kacheln. Aus einer Chat-Nachricht geöffnet bleibst du im selben Stapel. Auf-/Ab-Steuerelemente, Pfeiltasten und vertikales Wischen auf dem Bild wechseln dessen Version. Zoome vorher heraus. Scrollen im Prompt wechselt keine Version.

Klick auf Bild, Prompt-Kopfzeile oder Einklappbutton, um mit Auf/Ab Versionen zu wechseln. Klick auf Prompt-Text oder Kopierbutton, um stattdessen zu scrollen. Versionssteuerung bleibt beim Regenerieren oder Bearbeiten sichtbar. Übernimm oder lösche eine gemalte Maske vor dem Wechsel; während der Generierung pausieren die Steuerelemente.

Die Auswahl wird gespeichert und im Chat auch nach Neuladen angezeigt. Regenerieren oder Bearbeiten einer älteren Version ergänzt denselben Stapel und behält spätere Versionen. Ein verzweigter Chat hat eine eigene Auswahl.

Mit **Erzeugte Bilder automatisch in Charaktergalerien speichern** behalten neue Generierungen und Bearbeitungen die ursprünglichen Zielgalerien für Charakter und Persona. Auch diese gruppieren Versionen. Jede Galerie speichert ihre Auswahl unabhängig vom Chat. Einträge teilen Bilddateien, ohne zusätzliche Kopien. Beim Öffnen werden fehlende Versionen alter Chat-Stapel wiederhergestellt, sofern der ursprüngliche Eintrag noch auf den Quellchat verweist. Aus bereits gruppierten Galerien gelöschte Versionen bleiben gelöscht.

Wähle in der Chat-Gallery **Galeriebild löschen** auf der Kachel oder den Löschbutton im Betrachter:

- **Delete this version** entfernt die angezeigte Version. War sie ausgewählt, erscheint die neueste verbleibende.
- **Delete other versions** behält die angezeigte und entfernt die anderen.
- **Delete entire stack** entfernt alle Versionen und deren Bildanhänge aus dem Chat.

Das löscht gespeicherte Versionen endgültig. **Abbrechen** behält alle.

## Weiterführende Anleitungen

- [Illustrator-Agent](../media/illustrator-agent.md): Szenenillustrationen und Clips.
- [Von Illustrator erstellte Hintergründe](../media/scene-backgrounds.md): die Schaltfläche **Hintergrund**, Wettervarianten und Fensterschablonen.
- [Charakter- und Persona-Galerien](../characters/galleries.md)
- [Szenenvideos generieren](../media/scene-video.md): ein Bild aus der Galerie in ein Video verwandeln.
