# Game Mode: Karte, Zeit und Wetter

Im Karten-Panel siehst du, wo deine Party gerade ist, und bewegst sie weiter. Diese Anleitung behandelt außerdem die Systeme, die die Welt rund um die Party mitführen: Tag und Uhrzeit, das Wetter und die Moral der Party.

## Das Karten-Panel

Im Game Mode sitzt auf dem Spielbildschirm ein Karten-Panel. Es zeigt den Namen der aktuellen Karte, den Spieltag und ein Himmelssymbol für die Tageszeit.

- **Am Computer** ist die Karte ein eingebettetes Panel, das du auf einen Blick erfassen kannst. Du kannst es verschieben und an Ort und Stelle fixieren. Wie verschiebbare Panels funktionieren, steht unter [Game Mode: HUD-Widgets](hud-widgets.md).
- **Am Handy** tippst du auf **Map** (Karte), um das Panel zu öffnen. Seine Schaltfläche startet oben links und lässt sich im Chat herumziehen. Mit **Lock window** (Fenster sperren) bleibt die Schaltfläche an ihrem Platz, mit **Close** (Schließen) kehrst du zu ihr zurück. Die Position wird mit dem Chat gespeichert. Die Handy-Karte nutzt deinen Chat-Widget-Stil aus **Settings → Appearance → Chat Buttons & Windows** (Einstellungen → Darstellung → Chat-Schaltflächen & Fenster), und ihre Schaltfläche bleibt vom Drei-Punkte-Menü **Chat tools** getrennt.

Ein VN-Spiel hat die hier beschriebene Szenenkarte. Oberwelt, Städte und Dungeon-Karten gehören zu Overworld-Spielen, die noch nicht verfügbar sind (siehe [VN oder Overworld](getting-started.md#vn-or-overworld)).

### Grid-Ansicht und Node-Ansicht

Marinara wählt die Ansicht nach der Art des Ortes, den die Karte zeigt. Von Hand umschalten kannst du nicht.

- Die **grid**-Ansicht (Raster) ist für offene Gebiete gedacht, etwa eine Region oder eine Stadt. Sie zeigt Quadrate, die nach Gelände eingefärbt sind: Gras, Wald, Wasser, Gebirge, Wüste, Schnee, Stadt, Straße und Höhle.
- Die **node**-Ansicht (Knotenpunkte) ist für geschlossene Bereiche wie Dungeons und Innenräume gedacht. Sie zeigt Orte als Kreise, die durch Linien verbunden sind. Ein unentdeckter Ort zeigt ein Fragezeichen. Eine gestrichelte Linie ist ein Weg, den du noch nicht gegangen bist, eine durchgezogene einer, den du schon genutzt hast.

## Die Party bewegen

Anwählen kannst du nur bestimmte Orte. Auf einer Grid-Karte muss ein Quadrat direkt an deine Party grenzen und bereits entdeckt sein. Auf einer Node-Karte muss ein Knoten mit deinem aktuellen Ort verbunden oder bereits entdeckt sein. Andere Quadrate und Knoten reagieren nicht, wenn du sie anklickst.

1. Klick auf ein Rasterquadrat oder auf einen Knoten einer Node-Karte.
2. Über dem Nachrichtenfeld erscheint ein Chip **Map position:** (Kartenposition:) mit dem Namen des Ortes.
3. Schreib deine Nachricht und schick sie ab. Marinara stellt ihr eine kurze Zeile wie `*moves to <place>*` voran.

Zum Abbrechen klickst du auf die Löschen-Schaltfläche (X) am Chip **Map position:**. Ihr Tooltip lautet **Clear destination** (Ziel entfernen).

Am Handy tippst du einmal auf einen Knoten, um ihn auszuwählen, und dann in der Fußzeile auf **Set destination** (Ziel festlegen). Ein Knoten mit der Markierung **You are here** (Du bist hier) ist dein aktueller Standort.

Wenn es nicht funktioniert hat, prüf, ob das Quadrat an deine Party grenzt und entdeckt ist oder ob der Knoten mit deinem Standort verbunden ist.

### Karten zoomen, wechseln und generieren

- **Zoomen.** Nutze **Zoom in** (Plus) und **Zoom out** (Minus) oben rechts. Der Zoom reicht von 75 % bis 180 % in Schritten von 25 %.
- **Karten wechseln.** Hat ein Spiel mehr als eine Karte oder Region, kannst du über ein Dropdown-Menü oben im Panel eine andere aufrufen. Die Karte, auf der du bist, ist mit **(Current)** markiert.
- **Eine Karte generieren.** Klick oben links auf die Zauberstab-Schaltfläche **Generate another map** (weitere Karte generieren), um die aktuelle Karte durch eine neue zu ersetzen. Ein Spiel ohne Karte zeigt **No map yet** und eine Schaltfläche **Generate** (Generieren), die dasselbe tut.

## Tag und Uhrzeit von Hand setzen

Oben im Karten-Panel sitzt die Steuerung für Tag und Uhrzeit. Sie zeigt **Day** (Tag) mit einer Zahl und dazu ein Himmelssymbol.

1. Klick auf die Steuerung **Day**.
2. Gib eine Tageszahl von 1 bis 9999 ein.
3. Wähl eine Tageszeit: **Dawn**, **Morning**, **Afternoon**, **Evening**, **Night** oder **Midnight**.
4. Klick daneben oder drück <kbd>Enter</kbd>, um zu speichern.

Das ist eine manuelle Übersteuerung, unabhängig von der automatischen Uhr. Die Uhr kann von sich aus auch **Noon** anzeigen, doch Noon lässt sich nicht von Hand wählen.

## Wie die Zeit vergeht

Die Spieluhr rechnet mit festen Werten, nicht mit der KI. Jedes neue Spiel startet an Tag 1 um 08:00 Uhr. Jede Aktion stellt die Uhr vor:

| Aktion | Zeit, die vergeht |
| --- | --- |
| Reden | 15 Minuten |
| Erkunden | 30 Minuten |
| Eine Kampfrunde | 5 Minuten |
| Eine kurze Rast | 1 Stunde |
| Eine lange Rast | 8 Stunden |
| Reisen | 2 Stunden |

Sobald die Uhr Mitternacht überschreitet, steigt die Tageszahl um eins.

In einem Spiel mit Welt vergeht die Zeit außerdem von selbst:

- Solange die Oberwelt vorne ist und das Spiel auf dich wartet, vergeht alle fünf echten Sekunden eine Spielminute. Die Uhr steht still, während der GM schreibt, bevor du seine Antwort gelesen hast, während die Szenenansicht vorne ist und während die App im Hintergrund läuft.
- Ein Weg auf der Oberwelt lässt die Tage vergehen, die seine Route dauert.
- Sagt der Game Master (GM), dass Tage vergehen (eine Reise, eine lange Rast, eine Wartezeit), rückt die Uhr um diese Tage vor. Eine neu generierte Antwort stellt sie nicht noch einmal vor. Setz den Tag von Hand, wenn die neue Erzählung eine andere Dauer hat.

## Wetter

Das Spiel führt das Wetter mit festen Werten, nicht mit der KI. Beispiele sind klar, bewölkt, Regen, Sturm, Schnee, Blizzard, Nebel, Hitzewelle und Sandsturm. Es färbt darauf ab, wie der GM jede Szene beschreibt.

In einem Spiel mit generierter Welt richtet sich das Wetter nach dem Klima dort, wo die Party auf der Karte steht:

- **Das Land um die Party.** Wüsten sind trocken, und es regnet selten. Dschungel sind feucht und warm, Schneefelder kalt und Gebirge kälter und nebliger als die Täler darunter.
- **Breitengrad und Meer.** Auf einer Karte der ganzen Welt liegen der obere und untere Rand nahe den Polen und die Mitte nahe dem Äquator. Auch die Entfernung zum Meer zählt: Küsten haben milde Winter, weit im Landesinneren sind die Sommer heiß und die Winter bitterkalt.
- **Die Jahreszeit vor Ort.** Südlich des Äquators fällt der Sommer in den Winter des Kalenders. Nahe dem Äquator gibt es statt eines Winters eine Regenzeit und eine Trockenzeit.
- **Wetter, das weiterzieht.** Wettersysteme ziehen über Stunden und Tage über die Karte. So wechselt der Himmel nicht auf einen Schlag von einer Hitzewelle zu Nebel, und nahe gelegene Orte teilen sich ihr Wetter. In warmen Klimazonen bilden sich Schauer und Gewitter am Nachmittag.

Verlangt die Geschichte oder der GM nach einem Wetter, das am Ort gerade nicht möglich ist, etwa Schnee in einer heißen Wüste im Sommer, nutzt das Spiel stattdessen das nächstliegende passende Wetter (in diesem Fall einen kalten, scharfen Wind). Der GM erfährt, welches Klima herrscht und was dort nicht möglich ist.

Ein Spiel ohne generierte Welt schätzt das Klima anhand des Ortsnamens ein, etwa „Wüste“, „Hafen“ oder „Gebirge“.

### Orte außerhalb der natürlichen Ordnung

Ein Fluch, ein Gott oder eine andere große Macht kann die Umwelt eines Ortes festhalten: eine Stadt in ewiger Nacht, ein Wald im dauernden Herbst, ein Tal unter Schnee, der nie schmilzt. Der GM legt eine solche Bindung in der Geschichte fest. Sie hat Vorrang vor Klima und Uhrzeit, bis der GM sie aufhebt:

- **Wetter.** Der Ort behält das festgelegte Wetter, auch wenn sein Klima es nie zuließe, etwa Schnee in einer Wüste.
- **Jahreszeit.** Der Ort bleibt in einer Jahreszeit, während die übrige Welt weiterzieht.
- **Licht.** Am Ort ist immer Nacht, Dämmerung oder Tag. Beleuchtung und Wettereffekte der Szene richten sich danach, und die Oberweltkarte schattiert das betroffene Land.

Eine Welt kann bereits mit solchen Bindungen beginnen. Wenn du eine Welt aus deinen Lorebooks erstellst, gilt die Bindung für jeden laut Lore betroffenen Ort vom ersten Tag an, etwa „Im Sallow Vale ist immer Herbst“ oder „Gotham sieht nie die Sonne“. Dasselbe gilt für eine Bindung, die der Schauplatz beschreibt. Der GM erfährt von diesen Orten und kann eine Bindung weiterhin in der Geschichte aufheben.

Eine Bindung gilt für den Ort und alles darin. Wird eine Region gebunden, gilt das auch für ihre Städte. Überschneiden sich Bindungen, hat der nächstgelegene Ort Vorrang. So kann eine Stadt in einer verfluchten Region ihr eigenes festgelegtes Wetter haben. Eine Bindung kann auch die ganze Welt umfassen. Die Szene kann sie nicht durch eine Bitte um anderes Wetter aufheben; das kann nur der GM.

Damit du das Wetter auf dem Bildschirm siehst, schalte in den Darstellungseinstellungen **Dynamic weather effects (rain, snow, fog, etc.)** ein. Die Option ist standardmäßig an. Dann legen sich Regen-, Schnee- und Nebelpartikel über das Spiel, passend zu Wetter und Tageszeit. Siehe [Darstellungseinstellungen](../appearance/appearance-settings.md).

## Moral der Party

Das Spiel führt im Verborgenen einen Moralwert der Party von 0 bis 100. Er hat fünf Stufen, von der niedrigsten zur höchsten: Broken, Low, Steady, High und Inspired.

Die Moral steigt, wenn du einen Kampf gewinnst, eine Quest abschließt oder einen Schatz findest. Sie sinkt, wenn du einen Kampf verlierst, bei einer Quest scheiterst oder einen Verbündeten verlierst. Mit der Zeit driftet sie wieder zur Mitte zurück. Als Zahl wird sie nicht angezeigt. Sie färbt darauf ab, wie der GM die Stimmung deiner Party beschreibt. Auf deine Würfelwürfe wirkt sie sich nicht aus.

## Die Oberwelt und andere Overworld-Karten

Die folgenden Abschnitte beschreiben **Overworld**-Spiele, die noch nicht verfügbar sind. Sie gelten nur, wenn dein Server die Funktion eingeschaltet hat.

<a id="the-overworld"></a>

### Die Oberwelt

Ein Spiel mit generierter Welt (siehe [Eine Welt erstellen](getting-started.md#making-a-world)) öffnet sich auf der **Oberwelt**: Der Boden der Welt ist als Pixelkarte hinter der Erzählung gezeichnet, mit Wäldern, Hügeln, Küsten und Meeren, den Straßen und Wegen zwischen den Siedlungen, jeder Siedlung in ihrer Größe und deiner Party. Die größeren Orte sind beschriftet, ebenso der, an dem du gerade bist. Zieh die Karte, um dich umzusehen.

1. Tippe oder klick auf eine Siedlung oder wähl sie unter **Places** (Orte) aus (die nächstgelegenen zuerst, mit der Reisedauer).
2. Lies ihre Größe und die Reise von deinem Standort aus ab: Tage oder Stunden und auf welchen Wegen.
3. Klick auf **Walk there** (dorthin gehen). Die Party zieht auf der schnellsten Route über die Wege der Welt, und die Tage der Reise vergehen sofort auf der Uhr.

Dein nächster Zug teilt dem GM mit, wohin du gegangen bist, wie lange es gedauert hat und auf welchen Wegen, damit er die Ankunft erzählen kann. Ein zweiter Weg vor deinem nächsten Zug setzt dort an, wo der erste geendet hat.

Höhlen, Minen, Krypten und Ruinen ein paar Schritte außerhalb einer Siedlung sind als **Stätten** eingezeichnet. Eine neue Welt hat in jeder Region eine oder zwei davon, benannt nach der Siedlung daneben („Hollin Caves“, „Ashby Ruins“). **Walk there** führt über die Wege zu ihrer Siedlung und dann zu Fuß abseits der Straße weiter. An einer Stätte öffnet **Enter** (betreten) ihre Karte (siehe [Dungeons, Höhlen und Stationen](#dungeons-caves-and-stations)). Eine Stätte, die für die Geschichte wichtig ist, bleibt **geschlossen** (blass, keine Reise, kein Betreten), bis der GM sie öffnet. Wer eine Welt baut, kann eine Stätte bis dahin auch verbergen oder sie von Anfang an öffnen.

Ein Ort in Trümmern wird in Trümmern gezeichnet. Nach Einbruch der Dunkelheit wird die Karte dunkler, und Fenster leuchten auf. Jede Stilfamilie eines Settings (Fantasy, Wuxia, die Gegenwart, die 1920er-Jahre, Science-Fiction, das Ödland) hat ihre eigenen Tiles. Ein Kit ohne Familie zeichnet schlichte Tiles.

Zum Wechseln zwischen den Ansichten nutzt du **Show the scene** (Szene zeigen) und **Show the overworld** (Oberwelt zeigen) in **Game controls** (Spielsteuerung), am Handy im Drei-Punkte-Menü **Chat tools**. Das Spiel merkt sich deine Wahl. Ein Kampf und die Wiederholung einer Sitzung nutzen ihre eigenen Bildschirme.

### Tile-Packs

Tile-Packs enthalten die Farbpalette und jedes Tile als Reihen von Pixeln: jede Bodenart, die Siedlungen nach Größe, die Party sowie die Straßen, Dächer und Bewohner einer Stadt. Jede Stilfamilie hat ein eingebautes Pack. Öffne **Library → Agents** (Bibliothek → Agenten) und such **Tile packs** (Tile-Packs). Dort kannst du:

- festlegen, mit welchem Pack jedes Setting gezeichnet wird; **Built in** (eingebaut) ist sein eigenes,
- mit **Import a tile pack** (Tile-Pack importieren) ein Pack aus einer `.tilepack.json`-Datei importieren,
- ein Pack mit **Export** (Exportieren) teilen oder es mit **Remove** (Entfernen) löschen. Jedes Setting, das damit gezeichnet wurde, nutzt dann wieder seine eigenen Tiles.

Ein Pack braucht nur die Tiles, die es ändert, und alles, was es weglässt, wird schlicht gezeichnet. Nennt ein Pack ein Tile, das Marinara nicht zeichnet, behält es den Rest und sagt, was es weggelassen hat.

<a id="the-town"></a>

### Die Stadt

Ist die Party in einer Siedlung, wähl sie auf der Oberwelt aus und dann **Enter**, um die Stadt zu sehen. Sie ist aus der Welt heraus angelegt: Straßen und ein Platz, die Orte, die die Welt oder die Geschichte darin hat (an ihren Gebäuden beschriftet), in einem größeren Ort eine Halle, Werkstätten für die Gewerbe, für die der Ort bekannt ist, und Wohnhäuser. Die Leute sind dort, wo die Stunde sie hinführt: tagsüber bei der Arbeit, in der Abenddämmerung auf dem Platz, nachts zu Hause.

Wähl ein Gebäude oder den Platz aus, direkt oder unter **Places in town** (Orte in der Stadt), um zu sehen, wer dort ist und wie viele Minuten es entfernt ist. **Walk there** führt quer durch die Stadt über die Straßen, um Gebäude und alles herum, was eine Anlage von Hand gemalt hat, und über ihre Brücken. Die Minuten vergehen auf der Uhr, und dein nächster Zug teilt dem GM mit, wohin die Party gegangen ist und wer dort ist. Ein Besuch an einem benannten Ort, etwa einem Gasthaus, das die Geschichte hinzugefügt hat, macht ihn zum aktuellen Ort der Party. **Leave town** (Stadt verlassen) führt zurück zur Oberwelt. Das Spiel merkt sich, in welcher Ansicht du warst.

Eine Stadt lässt sich mit einem Welteditor wie Pixelforge **von Hand anlegen**, als Teil der Änderungen von Hand an der Welt.

- Gebäude lassen sich auf andere Grundstücke verschieben. Ein Gebäude, das auf das Grundstück eines anderen verschoben wird, tauscht mit diesem den Platz, und jedes Gebäude zeigt weiterhin zu einer Straße.
- Der Boden lässt sich mit Straßen, Pflaster, freier Fläche, Bäumen oder einem Brunnen bemalen, nie aber unter einem Gebäude, vor seiner Tür, mitten auf dem Platz oder unter einem Marktstand.
- Wer wo wohnt und arbeitet, ändert sich nie, und ein Weg zu einem verschobenen Gebäude wird ab seiner neuen Tür berechnet.
- Der Editor lehnt eine Anlage ab, die nicht zur Stadt passt, und sagt, warum. Orte, die die Geschichte im Spiel hinzufügt, finden trotzdem ein Grundstück.
- Eine Anlage kann auch Gebäude abseits der Grundstücke platzieren, Felder, Trampelpfade, Wasser mit Brücken und Hecken malen und Dekorationen setzen. Die Stadtansicht zeichnet all das (Dekorationen nur mit einem Bildpaket, das sie enthält).

<a id="dungeons-caves-and-stations"></a>

### Dungeons, Höhlen und Stationen

Führt die Geschichte unter die Erde oder an Bord, kann der GM eine **Karte des Ortes** öffnen: einen Dungeon, eine Höhle oder eine Station, über die Szene gezeichnet. Sie wird aus dem Spiel und dem Namen des Ortes angelegt, sodass derselbe Ort immer dieselben Räume hat, und bei einer Rückkehr bleibt die Karte, wie sie war. Der GM wählt eines von elf Aussehen: Fels-, Eis-, Kristall- und Lavahöhlen; eine Krypta, eine Kanalisation und einen Tempel; sowie die Korridore, das Labor, das Maschinendeck und die Hydroponik einer Station. Gibt es ein Tile-Pack für dieses Aussehen, nutzt die Karte dessen Grafik. Ohne eines bleibt sie in schlichten Farben.

Ein Ort in der Stadt, in den die Party hinabsteigen kann (je nach Name eine Höhle, Mine, Krypta, Kanalisation oder Ruine, in Science-Fiction ein Wrack oder ein Bunker), zeigt **Go down** (hinabsteigen), wenn die Party dort ist.

- Damit öffnet sich jedes Mal dieselbe Karte, und beim Verlassen steht die Party wieder in der Stadt.
- Ist die Party gerade auf einer anderen Karte, verlass zuerst diese.
- Ein Ort kann auch eine von Hand gemachte Karte haben, erstellt mit einem Welteditor wie Pixelforge. **Go down** öffnet dann diese Karte, egal wie der Ort heißt, gezeichnet mit dem Pack, das sie nennt. Auf so einer Karte ist der Ausgang dort, wo die Party hereingekommen ist, Requisiten versperren nie den Weg, und Leute stehen zu den Uhrzeiten, die die Karte ihnen gibt, auf benannten Plätzen. Der GM erfährt, wer dort ist.

Klick auf eine Stelle der Karte oder nutze die Pfeiltasten, um auf dem kürzesten Weg dorthin zu gehen. Die Minuten vergehen auf der Uhr (etwa eine Minute pro dreißig Schritte), und dein nächster Zug teilt dem GM mit, aus welchem Bereich in welchen die Party gegangen ist. Die Beschriftung oben nennt den aktuellen Bereich. **Show the scene** und **Show the map** (Karte zeigen) in **Game controls** wechseln zwischen Szene und Karte.

Zum Verlassen geh zurück zum Ausgang (eine Treppe, eine Leiter oder eine Luke) und wähl **Leave** (verlassen). Der GM kann die Karte auch beenden, wenn die Geschichte den Ort verlässt. Wird ein Zug neu generiert, in dem eine Karte geöffnet, auf ihr gelaufen oder sie verlassen wurde, kehrt die Karte zu ihrem Stand vor diesem Zug zurück.

## Verwandte Anleitungen

- [Game Mode: Erste Schritte](getting-started.md)
- [Game Mode: HUD-Widgets](hud-widgets.md)
- [Darstellungseinstellungen](../appearance/appearance-settings.md)
