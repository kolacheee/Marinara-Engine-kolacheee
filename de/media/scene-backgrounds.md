# Hintergründe von Illustrator

Der Agent **Illustrator** kann Hintergründe für deine Geschichte malen: auf Wunsch, bei jedem neuen Ort und als Regen-, Schnee- oder Nebelversion, wenn sich das Wetter ändert. Diese Anleitung erklärt alle drei Möglichkeiten und wie Illustrator vorhandene Bilder wiederverwendet, statt neue zu malen.

Für Bilder, die du selbst hochlädst und auswählst, siehe [Hintergrund-Bibliothek](../appearance/chat-backgrounds.md). Wie ein Chat das angezeigte Bild auswählt – über den Background-Agenten, angeheftete Orte und Galeriebilder –, erklärt [Hintergründe, die der Geschichte folgen](../roleplay/backgrounds.md).

## Bevor du anfängst

- Installiere **Illustrator** unter **Bibliothek → Agenten**. Siehe [Illustrator-Agent](illustrator-agent.md).
- Weise ihm ein Bildmodell zu: Lege auf der Seite Verbindungen im Kasten **Aufgaben** die Aufgabe **Bilder** fest oder wähle ein Modell unter **Einrichtung öffnen** bei Illustrator. Siehe [Anbieter für Bildgenerierung und Einrichtung](image-providers.md).

Gemalte Hintergründe funktionieren in Roleplay- und Game-Chats, nicht in Conversation. In Conversation meldet die App „Scene background generation is available in Roleplay and Game modes.“

## Jetzt einen Hintergrund malen

1. Öffne mit der Schaltfläche mit den Schiebereglern im Chat die **Chat-Einstellungen** und klapp die **Galerie** auf.
2. Klick auf **Hintergrund**. Während der Generierung steht dort **Wird generiert…**.
3. Sobald das Bild fertig ist, wird es deiner Hintergrund-Bibliothek hinzugefügt und hinter dem Chat angezeigt. „Background generated.“ bestätigt das.

Du musst Illustrator dafür nicht zum Chat hinzufügen. Er läuft einmal und startet keine automatischen Durchläufe.

Marinara erstellt den Prompt aus der Szene: In einem Game gehören dazu Genre, Setting, Ort, Wetter und Tageszeit. Das Bild verwendet die Bildgröße für **Hintergründe**, also 1.280 mal 720 Pixel, sofern du sie nicht unter **Einstellungen → Medien → Bildgenerierung** änderst.

Wenn es nicht funktioniert hat: „Choose an image generation connection for the Illustrator agent, or mark one as the default image connection.“ bedeutet, dass kein Bildmodell gefunden wurde. Richte eines wie unter **Bevor du anfängst** beschrieben ein. Fehlt die Schaltfläche **Hintergrund**, ist Illustrator nicht installiert.

## Ein neuer Hintergrund für jeden neuen Ort

Ist diese Option eingeschaltet, malt Illustrator einen Hintergrund, wenn die Geschichte einen Ort ohne Hintergrund erreicht, speichert ihn in deiner Bibliothek und zeigt ihn an.

1. Füge **Illustrator** zum Chat hinzu: Öffne **Chat-Einstellungen → Agenten**, schalte **Agenten aktivieren** ein und füge **Illustrator** aus **Sonstige Agenten** hinzu.
2. Schalte auf der Karte **Illustrator** die Option **Szenenhintergründe generieren** ein.

Illustrator prüft die Szene im **Bild-Ausführungsintervall** (alle 5 Nachrichten, sofern du es nicht änderst). Soll er stattdessen jede Antwort prüfen, nutze [Prüfungen mit einem Decision-Modell](#check-every-reply-with-a-decision-model). Im Game Mode umfasst der Schalter **Game Illustrator** auch Hintergründe.

### Vorhandene Bilder wiederverwenden

Bevor Illustrator einen neuen Ort malt, sucht er in dieser Reihenfolge nach einem vorhandenen Bild:

1. Ein Hintergrund, der an diesen Ort angeheftet ist, im Chat oder in der Galerie eines Charakters. Siehe [Einen Hintergrund an einen Ort anheften](../roleplay/backgrounds.md#pin-a-background-to-a-place).
2. Ein Bibliotheksbild, dessen Name oder ein Tag aus mindestens zwei Wörtern im Ort von World State vorkommt. Zum Beispiel passt `generated-guest-bedroom.png` oder ein Bild mit dem Tag `guest bedroom` zu „Smith House, guest bedroom“.
3. Gibt es keinen Ort von World State, wird der Ortsname aus Illustrators Prompt-Modell auf dieselbe Weise abgeglichen.

Groß- und Kleinschreibung, Akzente und „'s“ spielen keine Rolle, und der genaueste Name hat Vorrang vor einem einfachen `bedroom.png`. Passt ein Bild, wird es angezeigt (mit dem Wetter der Geschichte, falls diese Version existiert), und es wird nichts gemalt. Nur ein Ort ohne passenden Treffer bekommt ein neues Bild.

Damit ein Ort sein Bild behält, benenn die Datei nach dem Ort (`kitchen.png` für „Kitchen“) oder gib ihr ein Tag aus mindestens zwei Wörtern, etwa `smith house kitchen` (siehe [Einen Hintergrund taggen](../appearance/chat-backgrounds.md#tag-a-background)). Tags aus nur einem Wort wie `kitchen` oder `night` werden hier ignoriert, weil sie meist beschreiben, wie ein Bild aussieht.

## Wetterversionen von Hintergründen

Ist diese Option eingeschaltet, folgt der Hintergrund dem Wetter der Geschichte. Fängt es am Gasthaus an zu regnen, malt Illustrator dessen Hintergrund mit Regen an den Fenstern neu. In Innenräumen fällt der animierte Regen nur hinter dem Fensterglas, nie quer durch den Raum.

1. Öffne **Chat-Einstellungen → Agenten → Illustrator**.
2. Schalte **Weather Versions of Backgrounds** ein.

Dafür brauchst du ein Bildmodell, das von einem Bild ausgehen kann. Die meisten können das, darunter OpenAI, Gemini, NovelAI und ComfyUI mit einer Bildeingabe. Kann dein Modell das nicht, bleibt das Bild unverändert.

So funktioniert es:

- Jede Kombination aus Bild und Wetter wird **einmal** gemalt. Kehrt das Wetter zurück oder kommt die Geschichte bei Regen wieder zum Gasthaus, wird die gespeicherte Version ohne weitere Kosten angezeigt.
- Die Version wird neben dem Original als `name--wx-rain.png` gespeichert. Die anderen Arten heißen `storm`, `snow`, `blizzard`, `hail`, `fog`, `sand`, `ash`, `embers`, `blossom` und `aurora`. Dazu kommt `clear` für eine trockene Kopie eines Bildes, das ursprünglich bei schlechtem Wetter entstand. Ungewöhnliches Wetter bekommt eine Version mit den Worten der Geschichte: Ein Meteorschauer wird zu `name--wx-meteor-shower.png`.
- Bei klarem, sonnigem, bewölktem, windigem und anderem mildem Wetter bleibt das normale Bild.
- Das Wetter stammt vom Agenten **World State** oder von einer Prüfung mit einem Decision-Modell (siehe unten).
- Das gilt für jeden Hintergrund deiner Bibliothek, ob du ihn ausgewählt hast, der Background-Agent ihn gewählt oder Illustrator ihn gemalt hat. Dazu kommen angeheftete Orte und Galeriehintergründe, die einem Charakter folgen. Der Agent **Background** wählt unter deinen normalen Bildern aus. Gibt es eine passende Wetterversion, wird diese angezeigt.

### Fenster: wo das animierte Wetter fällt

Wenn ein Innenraumbild zum ersten Mal eine Wetterversion bekommt, fragt Illustrator das Bildmodell auch nach den Fenstern im Bild. Die Antwort wird als kleine Schwarz-Weiß-Maske gespeichert, die alle Wetterversionen dieses Raums gemeinsam nutzen. Das animierte Wetter (Regenstreifen, Schneeflocken, Blütenblätter) wird dann nur auf dem Glas dargestellt.

- Ein Raum ohne Fenster bekommt kein animiertes Wetter, nur die Wetterfärbung und Blitze.
- Polarlichter, Meteorschauer und anderes Wetter ohne fallende Teilchen bleiben unbewegt: Das Bild zeigt sie, darüber bewegt sich nichts.
- Die Masken liegen unter `backgrounds/weather-masks` in deinem Datenordner.

### Ein Wetterbild oder seine Fenster neu erstellen

Solange der Chat eine Wetterversion zeigt, steht unter **Chat-Einstellungen → Agenten → Illustrator** unter **Weather Versions of Backgrounds** eine nach dem Wetter benannte Zeile, etwa **This rain picture**:

- **Remake picture** malt diese Wetterversion ausgehend vom normalen Bild neu.
- **Remake windows** fragt das Bildmodell erneut nach der Fenstermaske. Nutze das, wenn Regen auf die Kissen fällt oder ein Fenster auslässt.
- **No moving weather** schaltet die Maske für diesen Raum aus. Seine Wetterversionen zeigen nur die Wetterfärbung und Blitze. **Remake windows** stellt sie wieder her.

Wenn es nicht funktioniert hat: Prüf, ob World State im Chat ein **Wetter** zeigt (oder die Wetterprüfung unten eingeschaltet ist) und ob **Illustrator** mit einem Bildmodell zum Chat hinzugefügt wurde.

## Jede Antwort mit einem Decision-Modell prüfen

Illustrator prüft die Szene normalerweise nur in seinem Ausführungsintervall. Ein neuer Ort muss deshalb unter Umständen einige Antworten auf seinen Hintergrund warten. Ein [Decision-Modell](../connections/decision-models.md), ein kleines Ja-Nein-Modell, kann stattdessen jede Antwort prüfen.

Bevor du anfängst: Wähle auf der Seite Verbindungen im Kasten **Aufgaben** ein Decision-Modell und schalte **Szenenhintergründe generieren**, **Weather Versions of Backgrounds** oder beides ein.

1. Öffne **Chat-Einstellungen → Agenten → Illustrator**.
2. Wähle unter **Decision Model Checks** die Option **The scene moved to a new place**, **The weather changed** oder **New place and weather changes**. Standardmäßig steht sie auf **Aus**.

Nach jeder Antwort:

- Die Ortsprüfung fragt, ob die neueste Nachricht die Szene an einen neuen Ort verlegt. Bei einem Ja bekommt der Ort einen Hintergrund; wenn möglich, wird ein vorhandener wiederverwendet. Das Prompt-Modell schreibt erst nach einem Ja einen neuen Hintergrund-Prompt.
- Die Wetterprüfung fragt, ob sich das Wetter in der neuesten Nachricht ändert. Bei einem Ja wird die Wetterversion des aktuellen Hintergrunds angezeigt oder gemalt. Gibt World State kein Wetter vor, wählt das Decision-Modell auch die Wetterart.
- Die Prüfungen schaffen nur zusätzliche Gelegenheiten zum Handeln. Illustrators eigener Durchlauf und Ortswechsel in World State zählen weiterhin.
- Ohne Antwort (kein Modell, Zeitüberschreitung oder Fehler) wird die Prüfung übersprungen.

Wenn es nicht funktioniert hat: Ist kein Decision-Modell gewählt, ist die Liste ausgegraut und zeigt, wo du eines wählen kannst.

## Den Prompt vor dem Senden prüfen

1. Öffne **Settings → Media → Generation Defaults** (Einstellungen → Medien → Generierungs-Standardwerte).
2. Schalte **Expose media prompts before sending** (Medien-Prompts vor dem Senden anzeigen) ein.

Dann öffnet sich vor jeder Bildanfrage das Fenster **Bild-Prompt prüfen**, auch bei gemalten Hintergründen. Bearbeite den Prompt und den negativen Prompt und klick auf **Generieren**, um die Anfrage zu senden, oder auf **Abbrechen**, um abzubrechen. Der eingetippte Text wird genau so gesendet, wie du ihn schreibst.

## Verwandte Anleitungen

- [Hintergründe, die der Geschichte folgen](../roleplay/backgrounds.md): welches Bild ein Chat zeigt, angeheftete Orte und Galeriehintergründe.
- [Hintergrund-Bibliothek](../appearance/chat-backgrounds.md): Bilder hochladen, taggen und organisieren sowie Unschärfe.
- [Illustrator-Agent](illustrator-agent.md): Szenen-Illustrationen, Clips und das Ausführungsintervall.
- [Die Chat-Galerie](../chats/chat-gallery.md): der Bereich Galerie und seine Schaltflächen.
- [Decision-Modelle](../connections/decision-models.md)
