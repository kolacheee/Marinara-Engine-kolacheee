# Galerien für Charaktere und Personas

Die **Galerie** im Tab **Bilder** in den Editoren für Charaktere und Personas bewahrt Bilder und Videos auf, die an einem Charakter oder einer Persona hängen. So bleiben sie erhalten, auch wenn du Chats löschst. Nutze sie für Referenzbögen, Outfit-Varianten und importierte Bildpakete. Außerdem kannst du neue Bilder mit KI erstellen und ein Galerie-Bild als eigenes Emoji, als Sticker oder als Hintergrund markieren, der den Charakter in jeden Chat begleitet.

## Die Galerie finden

Jeder Charakter und jede Persona hat eine eigene Galerie. Öffne den Charakter im Charakter-Editor oder die Persona im Persona-Editor, klick auf den Tab **Bilder** und dann oben darin auf **Galerie**. Bei einem Charakter heißt die Galerie **Charaktergalerie**, bei einer Persona **Persona-Galerie**. Beide funktionieren gleich.

Die Galerie hat zwei Unter-Tabs:

- **Images** (Bilder) enthält Bilder, die du hochlädst.
- **Videos** enthält Videos, die du hochlädst, dazu Szenenvideos und Clips von Videoanrufen, die zu diesem Charakter gehören.

Die Galerie eines Chats ist etwas anderes. Sie enthält Szenenillustrationen und generierte Anhänge für genau diesen einen Chat. Kurzlebige Szenenbilder gehören dorthin, dauerhafte Bilder hierher.

### Bilder hinzufügen

1. Öffne **Bilder → Galerie** und wähle **Bilder**.
2. Zieh Bilddateien auf **Upload Character Images** (Charakterbilder hochladen) oder klick darauf, um Dateien auszuwählen. Bei einer Persona heißt das Feld **Upload Persona Images**.
3. Warte, bis der Upload abgeschlossen ist. Die neuen Bilder erscheinen im Raster.

Klick auf ein Bild, um es größer zu sehen. Jede Kachel hat ein Bedienelement zum Herunterladen und eines zum Löschen.

### Videos hinzufügen

1. Öffne **Bilder → Galerie** und wähle **Videos**.
2. Zieh Videodateien auf **Upload Character Videos** (Charaktervideos hochladen) oder klick darauf, um Dateien auszuwählen. Bei einer Persona heißt das Feld **Upload Persona Videos**.
3. Warte, bis der Upload abgeschlossen ist.

Unterstützt werden MP4, WebM und MOV. Die neuesten Videos stehen oben. Welche Szenenvideos und Clips bei welchem Charakter erscheinen, steht unter [Welche Videos aufgelistet werden](#which-videos-are-listed).

## Bilder mit KI erstellen

**Mit KI erstellen** in der Galerie erzeugt über deine Verbindung zur Bildgenerierung neue Bilder für diesen Charakter oder diese Persona. Wähle unter **Typ**, was entstehen soll:

| Typ | Was du bekommst |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Charakterbogen** | Ein Referenzbogen, der genauso gespeichert wird wie über den Abschnitt **Charakterbogen**. |
| **Hintergrund** | Ein breites Bild eines Ortes, ausgehend vom Szenario der Karte. Es wird in der Galerie gespeichert und als Chat-Hintergrund markiert. |
| **Sticker-Bogen** | Ein Bild mit mehreren Stickern, das in einzelne Sticker-Bilder zerlegt wird. |
| **Emoji-Bogen** | Dasselbe mit kleinen Gesichts-Emojis. |

Bevor du anfängst: Füge eine Verbindung zur Bildgenerierung hinzu.

1. Öffne **Bilder → Galerie** und klick auf **Mit KI erstellen**.
2. Wähle einen **Typ** und bearbeite den Prompt, wenn du ein anderes Aussehen oder einen anderen Ort möchtest.
3. Liste bei einem Sticker- oder Emoji-Bogen die Namen unter **Zu zeichnende Sticker** oder **Zu zeichnende Emojis** auf, durch Kommas getrennt. Auf einen Bogen passen bis zu 16.
4. Klick auf **Generieren**.
5. Klick auf **Als Hintergrund speichern**, **Sticker speichern** oder **Emojis speichern** oder auf **Als Charakterbogen speichern**.

### Den Zuschnitt eines Bogens korrigieren

Nach dem Generieren eines Sticker- oder Emoji-Bogens wird jeder Sticker an seinem Umriss erkannt, sein grüner Hintergrund entfernt und er erscheint als eigene Kachel mit seinem Namen. Gespeicherte Sticker sind höchstens 512 mal 512 Pixel groß, Emojis höchstens 256 mal 256. Jedes Bild wird mit seinem Namen markiert.

- Klick auf eine Kachel, um sie zu behalten oder auszulassen. Ausgelassene Kacheln werden nicht gespeichert.
- Bearbeite den Namen unter einer Kachel, um sie umzubenennen.
- Klick auf einer Kachel auf **Mit einem Rahmen neu schneiden**, um einen Rahmen auf dem gesamten Bogen zu platzieren. Verschiebe den Rahmen, zieh an seinen Ecken oder zeichne einen neuen Rahmen um den Sticker. Klick dann auf **Diesen Rahmen verwenden**.
- Klick auf **Sticker hinzufügen** oder **Emoji hinzufügen**, um ein übersehenes Bild auszuschneiden.
- Klick auf **Neu zuschneiden**, um den Zuschnitt von vorn zu beginnen und deine Rahmen zu verwerfen.

### Den ganzen Prompt selbst schreiben

Der Prompt für das Bildmodell wird aus den Feldern im Dialogfenster zusammengestellt. Um ihn vollständig zu ändern, etwa für Sticker von Dingen, die der Charakter mag, statt nur vom Charakter selbst, klick auf **Vollständigen Prompt bearbeiten**. Er wird genau so gesendet, wie du ihn schreibst. Änderungen an den anderen Feldern werden erst übernommen, wenn du auf **Neu erstellen** klickst; dabei werden auch deine Bearbeitungen ersetzt. Klick auf die Schließen-Schaltfläche neben **Neu erstellen**, um zum zusammengestellten Prompt zurückzukehren.

## Ein Galerie-Bild als eigenes Emoji oder Sticker markieren

Ein eigenes Emoji ist ein kleines Bild mitten im Text, geschrieben als `:name:`. Ein Sticker ist ein größeres Bild als eigener Block, geschrieben als `sticker:name:`. Beides funktioniert nur in Chats im Conversation Mode, dem Chat-Modus im Messenger-Stil.

1. Öffne **Bilder → Galerie** und wähle **Bilder**.
2. Klick auf die kleine Tag-Schaltfläche oben links im Bild (Tooltip **Tag as emoji or sticker**).
3. Klick auf **Make emoji** oder **Make sticker**.
4. Gib im Dialogfenster **Custom Emoji** bzw. **Custom Sticker** einen Namen ein und bestätige.

Ein Name besteht aus 1 bis 32 Kleinbuchstaben, Ziffern und Unterstrichen. Andere Zeichen wandelt Marinara für dich um, sodass aus „Big Grin“ `big_grin` wird.

Wenn es nicht funktioniert hat: Ein Emoji-Bild darf höchstens 256 mal 256 Pixel messen, ein Sticker höchstens 512 mal 512. Ist das Bild zu groß, erscheint eine Fehlermeldung, und nichts wird markiert.

### Ein markiertes Bild verwalten

Sobald ein Bild markiert ist, zeigt seine eingeblendete Schaltfläche den Namen. Klick darauf für weitere Optionen:

- **Rename** (Umbenennen) ändert den Namen.
- **Switch to sticker** oder **Switch to emoji** wechselt die Art. Dabei wird das Größenlimit der neuen Art geprüft, sodass ein Sticker größer als 256 mal 256 kein Emoji werden kann. Es erscheint eine Fehlermeldung, und die Art bleibt.
- **Remove emoji** oder **Remove sticker** hebt die Markierung auf. Das Bild bleibt in der Galerie.

Ein in der Galerie markiertes Emoji oder Sticker gilt nur für genau diesen einen Charakter oder diese Persona, und zwar in Chats im Conversation Mode, an denen sie beteiligt sind. Davon getrennt sind die globalen Sammlungen für Emojis und Sticker im Nachrichtenfeld. Trägt ein Galerie-Bild denselben Namen wie ein globaler Eintrag, gewinnt in diesem Chat die Galerie-Version. Namen werden nicht auf Eindeutigkeit geprüft, vergib deshalb pro Bild einen eigenen Namen.

## Ein Galeriebild als Hintergrund verwenden

Ein als Hintergrund markiertes Bild steht in jedem Chat zur Auswahl, in dem der Charakter (oder die Persona) vorkommt. Es kann einen Ort darstellen, etwa sein Schlafzimmer.

1. Öffne **Bilder → Galerie** und wähle **Bilder**.
2. Klick auf die Tag-Schaltfläche oben links im Bild und wähle **Use as background**.
3. Gib die dargestellten Orte durch Kommas getrennt ein, etwa `{{char}}'s bedroom, {{char}}'s room`, oder lass das Feld leer. In der Galerie einer Persona verwendest du `{{user}}`.

Die Schaltfläche zeigt dann **Background:** mit den Orten. Klick darauf, um **Edit places** oder **Remove background tag** zu wählen. Wie diese Bilder in Chats erscheinen, steht unter [Hintergründe, die einen Charakter begleiten](../roleplay/backgrounds.md#backgrounds-that-follow-a-character).

Bilder, die in einem Chat gemalt wurden, kannst du über die Schaltfläche mit dem Personensymbol aus der Chat-Galerie hierher verschieben. Siehe [Die Chat-Galerie](../chats/chat-gallery.md#per-image-actions).

Beim Export als **Marinara Native** bleiben alle Markierungen (Emoji, Sticker und Hintergrund) in der Galerie erhalten.

## Bilder beschreiben

Jedes Galeriebild kann eine kurze Beschreibung seines Inhalts haben. Conversation-Chats nutzen die Beschreibungen markierter Emojis und Sticker, um auszuwählen, welche sie anbieten (siehe [Emojis und Sticker beschreiben](../conversation/emoji-stickers-gifs.md#describe-emojis-and-stickers)). Die Beschreibung wird mit dem Bild gespeichert und bei einem Export als **Marinara Native** mitgenommen.

- Um selbst eine zu schreiben, klick auf die Tag-Schaltfläche oben links im Bild und wähle **Beschreibung hinzufügen** oder zum Ändern **Beschreibung bearbeiten**.
- Soll die KI sie schreiben, klick auf **Bilder auswählen**, wähle die Bilder aus und klick dann auf **Mit KI beschreiben**. Das Modell für **Bilder lesen** sieht sich jedes Bild an und schreibt eine kurze Beschreibung. Haben einige schon eine, kannst du nur die Bilder ohne Beschreibung oder alle erneut beschreiben lassen.

Bevor du anfängst: KI-Beschreibungen brauchen ein Modell, das Bilder lesen kann. Marinara nutzt das Modell für **Bilder lesen**, wenn du unter **Hinter den Kulissen** in deinen Verbindungseinstellungen eines festgelegt hast, sonst das Modell deiner Agenten. Es werden bis zu 8 Bilder auf einmal gesendet, deshalb dauert eine große Auswahl einen Moment.

Auch die Galerie eines Chats hat im Auswahlmodus **Mit KI beschreiben**.

## Ein Galerie-Bild in Nachrichten und Begrüßungen wiederverwenden

Jedes Bild in der Galerie eines Charakters kann im Chattext erscheinen: in einer Begrüßung, einer Beispielnachricht oder einer Nachricht, die der Charakter sendet. Zeig auf ein Galerie-Bild und klick auf **Copy image reference** (das Link-Symbol). Dadurch wird ein Stück Markdown kopiert, das du überall einfügen kannst, wo der Charakter spricht:

```text
![sunset selfie](card://self/gallery/k3m2xq7.png)
```

`self` bezeichnet den Charakter, der diese Nachricht spricht. Wenn die Nachricht angezeigt wird, ersetzt Marinara `self` durch diesen Charakter und lädt das Bild aus seiner Galerie.

Es funktioniert:

- In **First Message**, **Alternate Greetings** und **Example Dialogue** auf der Charakterkarte. Die Markdown-Vorschau des Felds zeigt das Bild schon beim Bearbeiten.
- In jeder Nachricht, die ein Charakter sendet, in Roleplay und im Conversation Mode.
- In Gruppenchats. Bei einer Antwort mit mehreren Sprechern wird `self` für jeden Sprecher aufgelöst. Fehlt die Datei in der Galerie des Sprechers, prüft Marinara die anderen Charaktere im Chat, in der Reihenfolge des Chats. Haben zwei Charaktere denselben Dateinamen, gewinnt das eigene Bild des Sprechers.

Es funktioniert nicht:

- **In deinen eigenen Nachrichten**. Sie haben keinen sprechenden Charakter, deshalb erscheint ein Verweis mit `self` als defektes Bild. Willst du selbst ein Bild eines Charakters posten, nutze die Einfügefunktion des Asset-Browsers im Chat. Sie schreibt die vollständige Form `card://characters/<id>/...`.
- **In Systemnachrichten**. Sie zeigen keine Markdown-Bilder, deshalb erscheint der Verweis als Text.
- **In Persona-Galerien**. Deine Nachrichten haben keinen Sprecher, verwende deshalb die Persona-Form `card://personas/<id>/gallery/<file>`.

Ein vollständiger Link enthält die interne ID des Charakters, und IDs werden beim Import eines Charakters neu erzeugt. Vollständige Links brechen deshalb bei allen, mit denen du den Charakter teilst. Die Form mit `self` enthält keine ID. Sie überlebt einen Export und Import als **Marinara Native**, weil die Galerie-Bilder mit ihren Dateinamen im Export mitreisen. Exporte als **Compatible PNG Card** und **Compatible JSON** enthalten die Galerie nicht, sodass nach dem Teilen auf diesem Weg kein Galerie-Verweis funktionieren kann. Nimm **Marinara Native**, wenn ein Charakter Galerie-Bilder verwendet.

### Webbilder aus Begrüßungen speichern

Viele Karten zeigen in ihren Begrüßungen Bilder von anderen Websites, und solche Links können ins Leere laufen. Zeigen **First Message** oder **Alternate Greetings** Webbilder, hat **Dialogue & Greetings** die Schaltfläche **Save images locally** (Bilder lokal speichern).

1. Öffne den Tab **Card** und such **Dialogue & Greetings**.
2. Klick auf **Save images locally**. Marinara lädt die Bilder in die Galerie herunter und ersetzt jeden Link durch einen Verweis `card://self/gallery/...`.
3. Klick auf **Save** (Speichern), um die neuen Links zu behalten.

Heruntergeladen wird erst, wenn du auf die Schaltfläche klickst. Gespeichert werden nur PNG-, JPEG-, GIF- und WebP-Bilder bis 10 MB und 40 Megapixel. Links auf deinen eigenen Rechner oder dein Heimnetz werden abgelehnt. Ein Bild, das sich nicht speichern lässt, behält seinen Weblink, und ein Hinweis nennt den Grund.

**Restore web links** (Weblinks wiederherstellen) setzt die ursprünglichen Links wieder in die Begrüßungen ein. Die gespeicherten Kopien bleiben in der Galerie, bis du sie löschst. Bilder aus Lorebooks sind davon nicht erfasst.

## Welche Videos aufgelistet werden

Der Unter-Tab **Videos** listet Szenenvideos auf, die in Chats mit diesem Charakter erzeugt wurden, sowie Clips von Videoanrufen. Bei welchem Charakter ein Video erscheint, hängt davon ab, woher es stammt:

- Eine Videonachricht in einem Conversation-Chat erscheint bei den Charakteren, die sie zeigt: beim Charakter, der sie geschickt hat, und bei allen, die sie namentlich nennt. Ein Vorname genügt, wenn ihn niemand sonst im Chat trägt und er großgeschrieben ist. Bittet der Text um ein Gruppenfoto oder Gruppen-Selfie, gehören alle im Chat dazu. Namen in Anführungszeichen zählen nicht.
- Die Galerie deiner Persona listet einen Clip nur, wenn er deine Persona nennt.
- Ältere Videos und Videos aus Roleplay- und Game-Chats erscheinen bei jedem Charakter und bei der Persona ihres Chats.

## Verwandte Anleitungen

- [Charaktere anlegen und bearbeiten](creating-and-editing-characters.md)
- [Personas](personas.md)
- [Eigene Emojis, Sticker und GIFs](../conversation/emoji-stickers-gifs.md)
- [Hintergründe, die der Geschichte folgen](../roleplay/backgrounds.md)
- [Die Chat-Galerie](../chats/chat-gallery.md)
