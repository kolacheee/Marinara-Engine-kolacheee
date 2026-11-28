# Hintergründe, die der Geschichte folgen

Ein Roleplay-Chat zeigt hinter deinen Nachrichten ein bildfüllendes Szenenbild. Es kann gleich bleiben oder sich mit der Geschichte ändern: Der Agent **Background** wählt aus deinen Bildern, Orte mit einem festgelegten Hintergrund zeigen immer ihr eigenes Bild, und Bilder aus der Galerie eines Charakters begleiten ihn in jeden Chat. Wechselt das Bild, blendet Marinara vom alten zum neuen über.

Bildgenerierung brauchst du für nichts davon. Ohne Bildmodell wählst du aus selbst hochgeladenen Bildern, und ganz ohne Bild bleibt der Hintergrund eine einfarbige Fläche.

## Hintergründe auf einen Blick

| Du möchtest | Nutze | Anleitung |
| --- | --- | --- |
| Ein Bild hinter diesem Chat | **Chat-Hintergrund** | [Einen Hintergrund für einen einzelnen Chat festlegen](#set-a-background-for-one-chat) |
| Ein Bild, das sich mit der Szene ändert | Den Agenten **Background** | [Den Agenten Background wählen lassen](#let-the-background-agent-pick) |
| Einen Ort, der immer gleich aussieht | Einen Ort mit festgelegtem Hintergrund | [Einen Hintergrund an einen Ort binden](#pin-a-background-to-a-place) |
| Das Zimmer eines Charakters in jedem Chat, an dem er teilnimmt | Einen Galerie-Hintergrund | [Hintergründe, die einen Charakter begleiten](#backgrounds-that-follow-a-character) |
| Neue Bilder für neue Orte, neues Wetter und neue Tageszeiten | Den Agenten **Illustrator** | [Von Illustrator erstellte Hintergründe](../media/scene-backgrounds.md) |
| Deine Bilder hochladen, mit Tags versehen, sortieren oder weichzeichnen | Die Hintergrundbibliothek | [Hintergrundbibliothek](../appearance/chat-backgrounds.md) |

Wenn die Geschichte einen Ort erreicht, entscheidet Marinara in dieser Reihenfolge: zuerst der in diesem Chat für den Ort festgelegte Hintergrund, dann ein Galerie-Hintergrund, der den Ort nennt, dann die Auswahl des Agenten Background. Feste Zuordnungen und Galerie-Orte wechseln das Bild nur dann selbstständig, wenn Marinara den Ort der Geschichte kennt: über **World State** oder **World Maps**. Ohne beides sieht der Agent Background Galerie-Hintergründe trotzdem anhand ihrer Orte. Illustrator malt nur ein neues Bild, wenn nichts davon passt. Gibt es in der Bibliothek eine Variante für Wetter und Tageszeit der Geschichte, wird diese angezeigt.

## Einen Hintergrund für einen einzelnen Chat festlegen

1. Öffne den Chat. Öffne dann **Settings → Appearance → Backgrounds** (Einstellungen → Darstellung → Hintergründe).
2. Klick unter **Chat-Hintergrund** auf **Bibliothek durchstöbern** und wähle ein Bild.

Das ändert nur diesen Chat. Um zum Standard zurückzukehren, klick auf **Entfernen** neben **Chat-Hintergrund**. Du kannst auch im Chat unter **Chat-Einstellungen → Hintergrund** ein Bild auswählen. Noch keine Bilder? Siehe [Einen Hintergrund importieren](../appearance/chat-backgrounds.md#import-a-background).

## Eine Wetter- oder Tageszeitvariante selbst erstellen

Dein Bild zeigt das Schlafzimmer bei Tag, doch die Geschichte beginnt dort nachts im Regen. Du musst nicht auf Illustrator warten:

1. Öffne den Chat und dann **Chat-Einstellungen → Hintergrund**.
2. Wähle unter **Version dieses Hintergrunds erstellen** ein **Wetter** und eine **Tageszeit**. **Wie gemalt** behält den jeweiligen Teil so bei, wie das Bild ihn zeigt.
3. Klick auf **Version erstellen**.

Illustrators Bildverbindung malt das Bild ausgehend vom Original neu, auch bei einem Galeriebild, und der Chat zeigt die neue Variante. Sie wird in deiner Hintergrundbibliothek gespeichert, damit die Geschichte sie später ohne erneute Generierung verwenden kann. Gibt es die Variante schon, erscheint sie sofort. Die Bildverbindung muss von einem Bild ausgehen können.

## Den Agenten Background wählen lassen

Der Agent **Background** läuft nach jeder Antwort. Er liest die Szene und wählt aus all deinen Hintergründen das Bild, das am besten passt. Er wählt nur Bilder, die du schon hast; für neue Bilder nutzt du Illustrator.

1. Öffne deinen Roleplay-Chat und öffne **Chat-Einstellungen** über die Schieberegler-Schaltfläche.
2. Öffne **Agents** (Agenten) und schalte **Enable Agents** (Agenten aktivieren) ein.
3. Füge den Agenten **Background** hinzu.

Der Hintergrund ändert sich jetzt von allein, wenn die Geschichte von Ort zu Ort zieht. Der Agent liest Text statt Bilder und wählt deshalb anhand der Bezeichnungen:

- **Bibliotheksbilder** anhand von Dateinamen und Tags, auch in Ordnern.
- **Galerie-Hintergründe** der Charaktere und der Persona im Chat anhand ihrer Ortsmarkierungen (etwa `dorm kitchen`) und Beschreibung.
- **Angeheftete Orte** dieses Chats anhand der Namen der zugeordneten Bilder.

Ein Bibliotheksbild, dessen Dateiname nur aus zufälligen Buchstaben und Zahlen besteht (etwa `70c60b32-6b8c-….jpg`) und das keine Tags hat, wird ausgelassen: Nichts sagt, welchen Ort es zeigt. Gib ihm einen Orts-Tag oder einen eindeutigen Namen, damit es auswählbar wird. Zeigt kein Eintrag den Schauplatz, behält der Agent das aktuelle Bild, statt zu raten.

**Chat-Einstellungen → Hintergrund** zeigt unter der Vorschau, warum das aktuelle Bild gewählt wurde. Die Zeile verschwindet, wenn du selbst ein Bild auswählst.

Wenn es nicht funktioniert hat: Hast du nur ein oder zwei Hintergründe, wählt der Agent immer wieder diese. Füge deiner Bibliothek weitere hinzu. Ist er langsam, prüfe seine Verbindung: Verarbeitet sie nur eine Anfrage gleichzeitig, wartet er auf andere Agenten wie Lorebook Keeper.

## Einen Hintergrund an einen Ort binden

Nutze das, wenn ein Ort immer gleich aussehen soll: Johns Schlafzimmer zeigt immer `john-bedroom`, und dein eigenes Schlafzimmer zeigt immer `my-bedroom`. Wenn die Geschichte einen Ort mit festgelegtem Hintergrund erreicht, erscheint dessen Bild – unabhängig davon, was der Agent Background gewählt hätte.

1. Öffne **Chat-Einstellungen** über die Schieberegler-Schaltfläche im Chat und öffne **Hintergrund**.
2. Klick unter **Pinned places** auf **Add place**.
3. Klick auf das leere Bild und wähle den Hintergrund. Gib den Ort so ein, wie er in der Geschichte geschrieben wird, etwa `John's bedroom`.
4. Optional: Füge darunter weitere Namen hinzu, die die Geschichte verwenden könnte, durch Kommas getrennt, etwa `John's room, the master bedroom`.

Schneller geht es so: Wenn die Geschichte gerade an einem Ort spielt und das richtige Bild angezeigt wird, klick auf **Pin this picture to "John's bedroom"**.

Damit diese Zuordnungen greifen, muss der aktuelle Ort der Geschichte bekannt sein. Dafür wird die Ortsangabe des Agenten **World State** (oder von World Maps) genutzt. Unter der Liste steht **Story is at** mit dem Ort, und **Here** markiert die gerade verwendete Zuordnung.

### Wie Orte zugeordnet werden

- Der genaueste Name gewinnt. `John's bedroom` und `{{user}}'s bedroom` werden nie verwechselt, und eine Zuordnung mit dem schlichten Namen `bedroom` greift nur bei Schlafzimmern, für die niemand einen Hintergrund festgelegt hat.
- Ein oder zwei Wörter dazwischen sind erlaubt: „John's guest bedroom“ passt zu `John's bedroom`, solange keine andere Zuordnung genau diesen Ort nennt. Der Abgleich reicht nie über ein Komma oder einen anderen Besitzer hinweg: „John's house, Mara's bedroom“ zählt also nicht als Johns Schlafzimmer.
- `{{user}}` steht für den Namen deiner Persona und `{{char}}` für jeden Charakter im Chat. Deshalb passt `{{user}}'s bedroom` zu „Alyssa's bedroom“.
- „Mein“ und „unser“ beziehen sich auf den Verfasser der Nachricht. Steht in Johns Antwort, dass die Geschichte in „meinem Schlafzimmer“ spielt, ist Johns Schlafzimmer gemeint; „dein Schlafzimmer“ in seiner Antwort ist deines. In deiner eigenen Nachricht meint „dein Schlafzimmer“ das des Charakters, wenn nur einer im Chat ist.
- Groß- und Kleinschreibung, Akzente und Apostrophe spielen keine Rolle. Namen werden nur als ganze Wörter erkannt: `John` passt nie zu „Johnson“.
- Mit **World Maps** wählst du den Ort stattdessen aus der Liste **World Maps place**. Ein für ein Gebäude festgelegter Hintergrund gilt auch für dessen Räume, sofern sie keine eigene Zuordnung haben.

### Was eine feste Zuordnung bewirkt

- Das Bild wird bei der Ankunft einmal angezeigt. Wählst du vor Ort von Hand einen anderen Hintergrund, bleibt deine Auswahl bestehen, bis die Geschichte weiterzieht.
- An einem Ort mit festgelegtem Hintergrund kann der Agent Background das Bild nicht wechseln, und Illustrator malt keinen neuen Hintergrund. Mit **Wettervarianten für Hintergründe** oder **Tageszeitversionen von Hintergründen** bekommt das festgelegte Bild trotzdem seine Regen-, Schnee-, Nebel- oder Nachtvariante.

Wenn es nicht funktioniert hat: Prüfe, ob **Story is at** unter der Liste den Ort anzeigt und ob einer der zugeordneten Namen darin Wort für Wort vorkommt.

## Hintergründe, die einen Charakter begleiten

Ein Bild in der **Galerie** eines Charakters oder einer Persona kann als Hintergrund markiert werden. Es erscheint dann in jedem Chat, an dem dieser Charakter teilnimmt, ohne dass du die Zuordnungen in jedem Chat einzeln festlegen musst.

1. Öffne **Bilder → Galerie** des Charakters. Klick auf die Tag-Schaltfläche eines Bildes und wähle **Use as background**.
2. Gib die dargestellten Orte durch Kommas getrennt ein, etwa `{{char}}'s bedroom, {{char}}'s room`. In der Galerie eines Charakters steht `{{char}}` für diesen Charakter; in der einer Persona steht `{{user}}` für diese Persona. Lass das Feld leer, wenn das Bild keinen bestimmten Ort darstellt.

Die Tag-Schaltfläche des Bildes zeigt dann **Hintergrund:** und seine Orte. Klick darauf, um **Edit places** oder **Remove background tag** zu wählen.

In einem Chat mit diesem Charakter findest du diese Bilder unter **Chat-Einstellungen → Hintergrund** im Abschnitt **From character and persona galleries**. Klick auf eines, um es zu verwenden. Bilder, die Orte nennen, funktionieren auch wie fest zugeordnete Hintergründe und stehen unter **Pinned places** mit dem Hinweis „In John's gallery, follows them into every chat“. Eine im Chat selbst festgelegte Zuordnung hat Vorrang vor einem Galeriebild für denselben Ort.

### Ein Chat-Bild in die Galerie eines Charakters verschieben

Ein Hintergrund, den Illustrator in einem Chat gemalt hat, kann dauerhaft zu einem Charakter gehören:

1. Öffne im Chat **Chat-Einstellungen → Galerie**.
2. Klick am Bild auf die Personen-Schaltfläche (**Add to a character's or persona's gallery**) und wähle, wem es gehört.

Die Hintergrundmarkierung und die Orte werden übernommen. Das Bild wird nicht kopiert und bleibt in der Galerie, wenn der Chat gelöscht wird. Beim Export eines Charakters als **Marinara Native** bleiben diese Markierungen erhalten.

Auch Galerie-Hintergründe bekommen Wettervarianten. Die Regen- oder Schneevariante wird in deiner Hintergrundbibliothek als `gallery-…--wx-rain.png` gespeichert.

## Verwandte Anleitungen

- [Von Illustrator erstellte Hintergründe](../media/scene-backgrounds.md): neue Orte malen, Wetter- und Tageszeitvarianten sowie Fensterschablonen.
- [Hintergrundbibliothek](../appearance/chat-backgrounds.md): Hochladen, Tags, Ordner und Unschärfe.
- [Charakter- und Persona-Galerien](../characters/galleries.md)
- [Roleplay Mode: Erste Schritte](getting-started.md)
