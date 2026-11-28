# Charaktere anlegen und bearbeiten

Eine Charakterkarte ist die Datei, die einen KI-Charakter definiert: wer er ist, wie er spricht, wie er aussieht und wie ein Chat mit ihm beginnt. Du schreibst sie im Character Editor. Die KI liest die Kartenfelder bei jeder Antwort mit, deshalb ergeben klare, konkrete Formulierungen einen stimmigeren Charakter.

## Einen Charakter anlegen

1. Klick in der oberen Navigationsleiste auf **Characters** (Charaktere). Siehst du den Eintrag nicht, öffne zuerst **More** (Mehr).
2. Klick auf **New** (Neu, das Plus-Symbol). Das Fenster **Create Character** (Charakter erstellen) öffnet sich.
3. Gib in **Name \*** einen Namen ein. Ein Name ist Pflicht.
4. Klick auf den runden Avatar-Kreis, um ein Bild hinzuzufügen. Dieser Schritt ist optional.
5. Klick auf **Create** (Anlegen).

Die Karte wird mit leeren Feldern gespeichert, und der Character Editor öffnet sich.

6. Öffne den Tab **Card** und schreib die **Description**: wer der Charakter ist. Füg unter **Dialogue & Greetings** eine **First Message** hinzu – damit beginnt ein Roleplay-Chat.
7. Klick in der Kopfzeile auf **Save** (Speichern).

Wenn du bereits eine Kartendatei hast, klick stattdessen auf **Import** (Importieren). Siehe [Charakterkarten importieren und exportieren](import-export.md).

### Einen Chat mit deinem Charakter starten

Wähl den Charakter aus, wenn du einen Chat startest. Siehe [Roleplay Mode: Erste Schritte](../roleplay/getting-started.md) oder [Conversation Mode: Erste Schritte](../conversation/getting-started.md).

## Der Character Editor im Überblick

Der Character Editor ersetzt den Chatbereich durch einen seitenfüllenden Arbeitsbereich. Auf einem breiten Bildschirm stehen die Tabs als Schaltflächenreihe in der Kopfzeile. Bei manchen mittleren Breiten zeigen die Schaltflächen nur ihre Symbole; zeig darauf, um den Namen zu sehen. Auf einem schmalen Bildschirm werden sie in einem Menü unter dem Namen zusammengefasst. Die Tabs lauten der Reihe nach **Metadaten**, **Karte**, **Einführung**, **Gespräch**, **Lorebook**, **Bilder**, **Farben**, **Stimme**, **Statistik** und **Erweitert**. Jeder Tab springt zu seinem Abschnitt in einem langen Formular, du kannst also auch einfach scrollen.

Die Kopfzeile enthält die Elemente, die du am häufigsten brauchst:

- Den Pfeil **Back** (Zurück), die Avatar-Kachel, ein Namensfeld und ein Feld für Titel oder Kommentar, gedacht für eine kurze Kennzeichnung wie `Modern AU version`. Eine Zeile darunter zeigt Ersteller und Version.
- **Save**. Die Schaltfläche ist inaktiv, bis du etwas änderst. Während sie arbeitet, zeigt sie **Uploading…** (ein Avatar wird hochgeladen), **Embedding…** (ein Lorebook wird der Karte hinzugefügt) oder **Saving…**.
- Den Stern **Favorite** (Favorit).
- Das Menü **…** (**Weitere Aktionen**) mit:
  - **Professor Mari fragen**, das Professor Mari zu dieser Karte befragt.
  - **Charakter exportieren**. Siehe [Charakterkarten importieren und exportieren](import-export.md).
  - **Charakter als Persona importieren**, das diese Karte in eine neue Persona kopiert. Siehe [Personas](personas.md).
  - **Charakter duplizieren**.
  - **Charakter löschen**.

Beim Verlassen des Editors werden deine Änderungen zuerst gespeichert. Schlägt das Speichern fehl, bleibt der Editor mit deinem Entwurf geöffnet, damit du es erneut versuchen kannst.

Tabs mit eigener Anleitung:

| Tab | Anleitung |
| --- | --- |
| **Onboarding** | [Interaktives Onboarding](interactive-onboarding.md) |
| **Convo** | [Conversation-Mode-Profile](../conversation/profiles.md) |
| **Lorebook** | [Lorebooks mit Charakteren und Personas verknüpfen](../lorebooks/linking-to-characters.md) |
| **Bilder** | [Charakter-Sprites](sprites.md) und [Galerien für Charaktere und Personas](galleries.md). Siehe unten [Tab „Bilder“](#images-tab). |
| **Colors** und **Stats** | [Charakterfarben und Roleplay-Werte](colors-and-stats.md) |

Die Abschnitte unten behandeln **Metadaten**, **Karte**, **Bilder**, **Stimme** und **Erweitert**, dazu Avatare und den Versionsverlauf.


## Tab „Bilder“

Der Tab **Bilder** bündelt alles rund um das Aussehen eines Charakters auf Bildern. Über die Schaltflächen oben springst du zum jeweiligen Bereich:

- **Charakterbogen**: ein Referenzbild des Charakters. Klick auf **Verwalten**, um eines zu erstellen, hochzuladen oder auszuwählen, und aktiviere **Als Referenzbild verwenden**, damit es bei der Bildgenerierung dem Avatar vorgezogen wird. Siehe [Charakterbogen](sprites.md#character-sheet).
- **Selfie instructions**: optionale Vorgaben für die Conversation-Selfies dieses Charakters, etwa zum Kamerastil oder zu Gesichtsausdrücken. Auch Noodle und Slurp können sie verwenden, wenn du das in ihren Einstellungen einschaltest. Siehe [Selfies](../conversation/selfies.md).
- **Sprites**: Gesichtsausdrücke, Ganzkörper-Sprites und Anruf-Clips. Siehe [Charakter-Sprites](sprites.md).
- **Galerie**: Bilder und Videos, die beim Charakter gespeichert sind. Siehe [Galerien für Charaktere und Personas](galleries.md).

Der Tab **Bilder** einer Persona hat dieselben Bereiche, außer **Selfie instructions**.

## Tab „Metadata“

Der Tab **Metadata** enthält Angaben zu Identität und Organisation. Sie helfen dir, eine Karte zu sortieren, zu teilen und nachzuverfolgen. Die meisten gehen nicht an die KI.

- **Character ID**. Schreibgeschützt. Sie erscheint, sobald die Karte gespeichert ist. Mit **Copy** kopierst du sie.
- **Name**. Der angezeigte Name. In Prompts steht er als `{{char}}`, ein Platzhalter, den Marinara durch den Namen des Charakters ersetzt.
- **Other names** (Weitere Namen). Spitznamen, vollständige Namen oder Titel, unter denen der Charakter auch bekannt ist, etwa `Clark Kent, Kal-El, Mr. Kent`. Trenn mehrere Namen mit Kommas und drück <kbd>Enter</kbd> oder klick auf **Add**. In Roleplay-Chats können sie in der Namensfarbe erscheinen, und der Character Tracker verknüpft einen Charakter, den er unter einem dieser Namen verfolgt, mit der Karte. Siehe [Charakterfarben](colors-and-stats.md#the-three-colors).
- **Creator**. Wer die Karte erstellt hat – für die Namensnennung, wenn du sie teilst.
- **Version**. Eine Versionsnummer, die du selbst festlegst, etwa `1.0`. Der Schalter **Automatic versioning** (automatische Versionierung) daneben behält frühere Versionen und erhöht diese Nummer, wenn sich die Karte ändert. Der Versionsverlauf speichert nur Momentaufnahmen, solange dieser Schalter an ist.
- **Talkativeness**. Ein Schieberegler von 0 bis 100 Prozent. Er legt fest, wie oft dieser Charakter in Gruppenchats spricht. Der Standard sind 50 Prozent.
- **Tags**. Gib Tags (Schlagwörter) in das Feld zum Hinzufügen ein und drück <kbd>Enter</kbd> oder klick auf **Add**. Mehrere Tags trennst du mit Kommas. Das Feld schlägt Tags vor, die deine Bibliothek bereits nutzt, die meistgenutzten zuerst. Ein einzelnes Tag entfernst du über sein X, alle zusammen über **Remove All**.
- **Creator Notes**. Private Notizen, die nie an die KI gehen.

**Split description into fields** (Beschreibung in Felder aufteilen) ist eine Schaltfläche unter **Version**. Sie verschiebt gekennzeichneten Text (Persönlichkeit, Aussehen, Vorgeschichte, Szenario, Regeln, Beispieldialog) aus **Description** in eigene Felder. Zuerst siehst du eine kurze Zusammenfassung. Übernimmst du sie, wird die Karte als neue Version gespeichert. Die Schaltfläche ist inaktiv, solange **Description** leer ist.

Das Panel **Version history** (Versionsverlauf) liegt ebenfalls auf diesem Tab. Siehe [Versionsverlauf](#version-history).

## Tab „Card“

Der Tab **Card** ist der zentrale Schreibbereich. Über die Sprunglinks oben erreichst du jeden Abschnitt, und jedes Feld hat einen laufend aktualisierten Zeichenzähler.

| Feld | Was du schreibst | Geht an die KI |
| --- | --- | --- |
| **Summary** | Ein kurzer Überblick für deine Bibliothek und die Kartenvorschau. | Nein |
| **Description** | Identität und Rolle des Charakters im Allgemeinen. | In jedem Prompt |
| **Personality** | Temperament, Sprechgewohnheiten, Verhaltensmuster. | Ja |
| **Backstory** | Vorgeschichte, Herkunft, wichtige Beziehungen. | Ja |
| **Appearance** | Aussehen, Kleidung, optische Details. Dient außerdem als Grundlage für einen KI-Avatar-Prompt. | Ja |
| **Scenario** | Der Standardrahmen für neue Chats mit diesem Charakter. | Ja |
| **Public Face** | Die Karte ohne ihre privaten Teile. | Nur dort, wo ein Makro oder eine Einstellung sie anfordert |

**Public Face** enthält das, was die anderen Charaktere über den Charakter sehen oder wissen könnten: Aussehen, Auftreten, Rolle, Ruf und Beziehungen, die kein Geheimnis sind. Lass Geheimnisse, innere Gedanken, private Vorgeschichte und Anweisungen zum Spielen des Charakters weg. Das Feld wird nie als Teil der Karte dieses Charakters gesendet. Ein Prompt liest es nur dort, wo du das Makro `{{publicFace}}` platzierst, oder `{{personaPublicFace}}` für deine Persona. Siehe [Prompt-Makros](../prompts/macros.md#identity-character-and-persona-macros). In einem Roleplay-Gruppenchat im Modus Individual sendet **Others' Public Faces** es bei den Zügen der anderen Charaktere mit. Siehe [Weitere Einstellungen für Individual](../chats/group-chats.md#more-individual-settings). Ein Agent, dessen Quelle **Charaktere** oder **Persona** auf **Public Face** steht, liest es anstelle der Karte. Siehe [Weitere Einstellungen](../agents/custom-agents.md#other-settings). Ist **Send Public Faces** eingeschaltet, liest Impersonate in Roleplay es anstelle der Karte. Siehe [Die Impersonate-Einstellungen](../chats/guided-and-impersonate.md#the-impersonate-settings).

**Aussehen** hat zwei Tabs: **Prosa** und **Bild-Tags**. **Prosa** ist der eigentliche Aussehenstext. **Bild-Tags** enthält kurze Tags für Bild-Prompts, etwa ein LoRA-Triggerwort (ein Schlüsselwort, das einen eigenen Bildstil aktiviert). Wenn du Tags eingibst, wird **Für Bild-Prompts verwenden** angehakt. Ein Punkt auf dem Tab zeigt, dass sie verwendet werden. Solange die Option angehakt ist und die Tags ausgefüllt sind, verwenden Bild-Prompts diese Tags genau wie geschrieben; die Prosa bleibt als Hintergrund erhalten. Entferne das Häkchen, um die Tags zu behalten, ohne sie zu verwenden: Bild-Prompts greifen dann auf **Prosa** zurück. Auch ein KI-Avatar-Prompt wird aus den Tags vorbelegt. Der Erzähler sieht immer den Text aus **Prosa**. Der Tab **Bilder** verlinkt mit **Zu „Aussehen“** hierher. Der Tab hat einen eigenen Zauberstab. Siehe [Bild-Tags mit dem Zauberstab](#image-tags-from-the-wand).

Der Abschnitt **Dialogue & Greetings** legt fest, wie ein Chat beginnt und wie der Charakter klingt:

- **First Message**. Die Eröffnungsnachricht eines neuen Roleplay-Chats. Conversation- und Game-Chats beginnen ohne Begrüßung.
- **Alternate Greetings**. Zusätzliche Eröffnungsnachrichten. Beim Start eines Roleplay-Chats kannst du auswählen, welche davon zum Einsatz kommt. Mit den Steuerelementen nach oben und unten sortierst du sie um, mit dem X entfernst du eine.
- **Example Dialogue**. Beispielwechsel, die die Stimme des Charakters vermitteln. Trenn die Wechsel mit `<START>` und verwende `{{user}}` und `{{char}}` als Platzhalter.

```text
<START>
{{user}}: Hello!
{{char}}: *waves excitedly* Hey there!
```

Begrüßungen und Beispielnachrichten können Bilder aus der Galerie des Charakters anzeigen. Siehe [Ein Galeriebild in Nachrichten und Begrüßungen wiederverwenden](galleries.md#reuse-a-gallery-image-in-messages-and-greetings). Zeigen Begrüßungen Bilder von anderen Websites, legt **Save images locally** (Bilder lokal speichern) eine Kopie in der Galerie ab. Siehe [Webbilder aus Begrüßungen speichern](galleries.md#save-web-images-from-greetings).

### Ein Kartenfeld mit dem Zauberstab schreiben

Über **Zusammenfassung**, **Beschreibung**, **Persönlichkeit**, **Hintergrundgeschichte**, **Aussehen** (beide Tabs), **Szenario**, **Public Face**, **Beispieldialog**, **Erste Nachricht** und jedem **Alternate Greeting** sitzt eine Zauberstab-Schaltfläche, die nur ein Symbol zeigt. Ihr Tooltip nennt das Feld, das sie schreibt.

Bevor du anfängst: Richte eine funktionierende Textverbindung ein. Siehe [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md).

1. Schreib Ideen, die erhalten bleiben sollen, in das Feld, etwa `smart, scientist, handsome`, oder lass es leer.
2. Füll andere Kartenfelder aus, die die KI als Referenz nutzen soll. Du musst vorher nicht speichern.
3. Klick auf den Zauberstab des Felds. Marinara fordert 100–300 Wörter für dieses Feld an und nimmt deinen Text als Ausgangsdetails. Example Dialogue fordert Beispielwechsel an. **Erste Nachricht** und jedes **Alternate Greeting** fordern eine Eröffnungsnachricht an, die deine Antwort offenlässt. Für **Public Face** gibt es keine Wortvorgabe: Der Zauberstab formuliert den Rest der Karte ohne die privaten Teile neu. Die Länge richtet sich deshalb nach deiner Karte. Im Tab **Bild-Tags** unter **Aussehen** verwandelt der Zauberstab das Aussehen der Karte stattdessen in eine Zeile Bild-Tags. Siehe [Bild-Tags mit dem Zauberstab](#image-tags-from-the-wand).
4. Bearbeite das Ergebnis und klick dann auf **Save**.

Der Zauberstab verwendet deine Standard-Textverbindung für Agenten oder, falls es keine gibt, deine Standard-Textverbindung. Eine eingerichtete Ausweichverbindung für Agenten gilt weiterhin.

Der Zauberstab ersetzt nur das gewählte Feld in deinem ungespeicherten Entwurf. Schlägt die Generierung fehl, bleibt dein Text erhalten. Bearbeitest du das Feld während des Wartens oder wechselst zu einer anderen Karte, überschreibt ein verspätetes Ergebnis deine Arbeit nicht. Für den Zauberstab brauchst du Professor Mari nicht.

<a id="image-tags-from-the-wand"></a>
#### Bild-Tags mit dem Zauberstab

Der Zauberstab im Tab **Bild-Tags** unter **Aussehen** schreibt Tags aus der Aussehensbeschreibung der Karte, vor allem **Aussehen** selbst. Er aktiviert **Für Bild-Prompts verwenden**.

- Vorhandene Tags, die der Aussehenstext nicht erklärt, etwa LoRA-Triggerwörter, bleiben unverändert am Zeilenanfang.
- Danach folgen neue Tags: `1girl`, `1boy` oder `1other`, dann dauerhafte Merkmale von Körper, Haaren, Augen, Haut, Gesicht und Zeichnung. Ohne beibehaltene Tags beginnt die Zeile mit `1girl`, `1boy` oder `1other`.
- Neue Tags sind englisch, kleingeschrieben und kommagetrennt im Stil von Danbooru (einer Anime-Bildseite, deren Tags viele Modelle gelernt haben).
- Sie nutzen nur Merkmale der Karte. Kleidung, Mimik, Posen und Orte bleiben weg, da sie je nach Szene wechseln.

Die Tags stammen vom Modell, nicht aus einer Liste echter Danbooru-Tags. Daher kennt dein Bildmodell möglicherweise die Formulierung eines Tags nicht. Prüfe und bearbeite die Zeile vor dem Speichern.

## Einen Avatar hinzufügen

Ein Avatar ist das Bild, das im Chat und in deiner Bibliothek für den Charakter erscheint.

### Ein Bild hochladen

1. Klick auf die Avatar-Kachel in der Kopfzeile des Editors.
2. Wähl eine Bilddatei aus. Das neue Bild erscheint sofort.

Sobald ein Charakter einen Avatar hat, erscheint auf dem Tab **Metadata** ein Zuschneidewerkzeug für den Avatar. Damit verschiebst oder zoomst du das Bild innerhalb seines Kreises oder entfernst den Avatar.

### Einen Avatar per KI generieren

Bevor du anfängst: Füg eine Verbindung zur Bildgenerierung hinzu. Die Schaltfläche für den KI-Avatar erscheint nur, wenn du eine hast. Siehe [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md).

1. Zeig mit der Maus auf die Avatar-Kachel und klick auf die Zauberstab-Schaltfläche. Das Fenster **Generate Character Avatar** öffnet sich.
2. Wähl eine **Image Generation Connection** (Verbindung zur Bildgenerierung).
3. Prüfe oder bearbeite den **Avatar-Prompt**. Er startet mit den **Bild-Tags** unter **Aussehen**, wenn **Für Bild-Prompts verwenden** angehakt ist und sie ausgefüllt sind. Andernfalls nutzt er **Aussehen**, dann **Beschreibung**, dann **Persönlichkeit** – das erste Feld, das Text enthält.
4. Hat die Karte bereits einen Avatar, kannst du **Use current avatar as a reference** ankreuzen.
5. Klick auf **Generate**. Für einen weiteren Versuch klick auf **Regenerate**.
6. Gefällt dir das Ergebnis, klick auf **Use Avatar**.

Die Bildgröße stammt aus der Bildgröße **Portraits** in den Einstellungen zur Bildgenerierung. Standardmäßig sind das 1024 mal 1024. Ist **Expose media prompts before sending** an, erscheint vor jeder Anfrage ein Prüfschritt für den Prompt.

## Tab „Voice“

Der Tab **Voice** (Stimme) legt fest, wie der Charakter klingt, wenn Text to Speech (Sprachausgabe) ihn vorliest.

- **Voice**. Die Stimme für diesen Charakter. Eine Änderung wird sofort gespeichert, ohne **Save**. Es ist dieselbe Einstellung wie die Zeile dieses Charakters in den Einstellungen der Aufgabe **Stimme** unter **Verbindungen**. Lass das Feld leer, um die Standardstimme zu verwenden. Hat eine Karte mit passendem Namen eine Stimme – etwa das Original einer AU-Kopie –, nennt das leere Feld diese Stimme, denn diese Karte verwendet sie ebenfalls.
- **Preview** (Vorschau). Spielt eine kurze Zeile mit dieser Stimme ab. Die Zeile nennt den Namen des Charakters oder, falls einer eingetragen ist, den **Phonetic name**.
- **Phonetic name**. Eine optionale Schreibweise, die nur die Aussprache korrigiert. Sie gehört zur Karte, klick also auf **Save**, um sie zu behalten.

Ist Text to Speech aus oder teilen sich alle Charaktere eine Stimme, ersetzt ein kurzer Hinweis das Feld **Voice**. Bei einer gemeinsamen Stimme bietet der Hinweis **Use a voice per character** (eigene Stimme pro Charakter verwenden) an. **Open Text to Speech settings** (Text-to-Speech-Einstellungen öffnen) öffnet die Einstellungen der Aufgabe **Stimme** unter **Verbindungen**. Siehe [Text to Speech (TTS) einrichten](../media/tts-setup.md).

## Tab „Advanced“

Der Tab **Advanced** enthält Prompt-Steuerungen. Für einen normalen Charakter lässt du sie leer. Sie gelten in den Modi Conversation, Roleplay und Game. Ein Conversation- oder Game-Preset ändert den umgebenden Prompt, schaltet die Post-History Instructions oder den Depth Prompt des Charakters aber nicht ab.

- **System Prompt**. Charakterspezifische Anweisungen, die über den Charakterblock des aktiven Presets, den Conversation-Charakterkontext oder die Game-Charakterkarte hinzukommen. Den Haupt-System-Prompt des Chats ersetzt er nicht.
- **Post-History Instructions**. Text, der nach dem Chatverlauf steht, direkt bevor die KI schreibt, etwa „Stay in character“.
- **Depth Prompt**. Text, der in den Chatverlauf eingefügt wird. **Depth** gibt an, wie viele Nachrichten weit zurück: 0 liegt direkt hinter der neuesten Nachricht. Der Standard ist 4. **Role** ist **System**, **User** oder **Assistant**. Der Standard ist System.

Der Abschnitt **Regex Scripts** enthält Suchen-und-Ersetzen-Skripte für genau diesen einen Charakter. Siehe [Regex-Skripte](../extending/regex-scripts.md).

## Ein alternatives Feld in ausgewählten Chats verwenden

Ein alternatives Feld gibt demselben Charakter in ausgewählten Chats eine andere Beschreibung, ein anderes Aussehen, eine andere Vorgeschichte oder ein anderes Detail, während alle übrigen Chats beim Original bleiben. Unter jedem der acht Kartenfelder steht **Add Alternative Field** (alternatives Feld hinzufügen).

1. Klick unter dem Feld, das du abwandeln willst, auf **Add Alternative Field**. Marinara kopiert den Text des Felds in eine neue Alternative.
2. Optional: Klick auf ihren Titel, etwa **Backstory alternative 1** (Hintergrundgeschichte – Alternative 1), und gib einen Namen wie `Young` ein. Namen dürfen bis zu 60 Zeichen lang sein. Lässt du den Namen leer, bleibt der nummerierte Titel.
3. Bearbeite die Alternative. Sie hat einen eigenen Zauberstab, der den Text der Alternative als Ausgangsdetails nimmt und das Originalfeld nicht ändert.
4. Öffne **Active in 0 chats** (in 0 Chats aktiv) und kreuz die Chats an, die sie verwenden sollen. Aufgelistet werden nur Chats, in denen dieser Charakter vorkommt.
5. Klick auf **Save**.

Du kannst auch direkt im Chat wählen. Öffne **Chat Settings** (Chat-Einstellungen) und klapp **Card Field Alternatives** (Alternativen für Kartenfelder) auf. Dort stehen die Persona des Chats und jeder Charakter im Chat, der Alternativen hat, mit einem Menü pro Feld. Wähl **Original** oder eine Alternative über ihren Namen. Die Karte wird sofort gespeichert, und die Auswahl gilt ab der nächsten Antwort. Gibt es im Chat keine Alternativen, ist der Abschnitt ausgeblendet.

Regeln:

- Ein Chat kann pro Feld nur eine Alternative verwenden. Kreuzt du einen Chat in einer anderen Alternative an oder wählst du in Chat Settings eine andere, wandert er dorthin.
- Ohne angekreuzte Chats bleibt die Alternative für später inaktiv.
- Eine leere Alternative leert das Feld in ihren Chats.
- Eine Alternative für **Aussehen** hat eigene Tabs für **Prosa** und **Bild-Tags**. In ihren Chats ersetzen ihre Tags die der Karte. Sind ihre Tags leer oder nicht angehakt, verwenden Bild-Prompts die Prosa der Alternative, nie die Tags der Karte. Eine neue Alternative kopiert auch die Tags der Karte. Ihr Tab **Bild-Tags** hat einen eigenen Zauberstab, der Prosa und Tags der Alternative liest.
- Chatspezifische Überschreibungen für Szenario und Bildaussehen haben weiterhin Vorrang.
- Alternativen für **Summary** bleiben Metadaten und gehen nicht an die KI.
- Verlässt der Charakter einen Chat, pausiert die Zuordnung und wird wieder aktiv, wenn du den Charakter erneut hinzufügst.
- Kartenexport, Import, Duplizieren und die Umwandlung zwischen Charakteren und Personas behalten den alternativen Text, entfernen aber die Häkchen bei den Chats. Backups des gesamten Profils behalten die Häkchen.

Zum Entfernen einer Alternative klick auf ihren Papierkorb, bestätige mit **Delete** (Löschen) und klick dann auf **Save**. Ihre Chats verwenden danach wieder das Originalfeld. Das Originalfeld wird mit einer Alternative nie gelöscht.

## Versionsverlauf

Solange **Automatic versioning** an ist, kann jedes Speichern eine Momentaufnahme zu **Version history** auf dem Tab **Metadata** hinzufügen. Bis dahin steht dort `Previous card states will appear here after the next edit.` Ein Zähler zeigt, wie viele Momentaufnahmen gespeichert sind. Beim Aktualisieren des Charakters aus einer neueren Karte wird immer zuerst eine Momentaufnahme gespeichert, auch wenn der Schalter aus ist. Siehe [Einen vorhandenen Charakter aktualisieren](import-export.md#update-a-character-you-already-have).

So vergleichst du eine gespeicherte Version mit deiner aktuellen Karte:

1. Öffne den Tab **Metadata**.
2. Klick unter **Version history** auf eine gespeicherte Version. Ein Vergleichsfenster stellt die Kartenfelder nebeneinander und markiert jedes geänderte Feld.

So kehrst du zu einer älteren Version zurück:

1. Öffne das Vergleichsfenster für diese Version oder klick in der Liste auf ihr Wiederherstellen-Symbol.
2. Klick auf **Restore this version** (diese Version wiederherstellen) und bestätige.

Marinara speichert zuerst deine aktuelle Karte im Versionsverlauf (außer sie entspricht dieser Version bereits), damit du später zurückwechseln kannst.

Weitere Steuerelemente im Panel:

- Das Stift-Symbol ändert die Kartenversionsnummer einer Momentaufnahme, ohne sie wiederherzustellen.
- Das Papierkorb-Symbol löscht eine Momentaufnahme. Deine aktuelle Karte ändert sich dabei nicht.
- **Reset** (Zurücksetzen) löscht alle gespeicherten Momentaufnahmen und setzt die Kartenversion auf 1.0. Marinara bittet dich um Bestätigung, und du kannst es nicht rückgängig machen. **Reset** ist inaktiv, solange du ungespeicherte Änderungen hast.

## Von Agenten vorgeschlagene Kartenänderungen prüfen

In einem Roleplay-Chat kann ein optionaler Agent anhand der Szene kleine Änderungen an Kartenfeldern vorschlagen. Dann öffnet sich das Fenster **Review Character Card Updates** (Kartenänderungen prüfen), und du entscheidest, was du behältst. Für jede vorgeschlagene Änderung gilt:

- **Approve** übernimmt sie, erhöht die Versionsnummer und fügt einen Eintrag im Versionsverlauf hinzu.
- **Regenerate** lässt den Agenten einen neuen Versuch machen.
- **Reject** verwirft sie.

Hat sich der Text seit dem Vorschlag geändert, warnt dich die App, bevor sie dich die Änderung erzwingen lässt. Wie du diese Agenten ein- oder ausschaltest, steht unter [Agenten: KI-Helfer für deine Chats](../agents/agents-overview.md).

## Wenn es nicht funktioniert hat

- **Der Zauberstab tut nichts oder schlägt fehl.** Prüf, ob du eine funktionierende Textverbindung hast. Dein Entwurf wird bei einem Fehler nie überschrieben.
- **Keine Schaltfläche für den KI-Avatar.** Füg zuerst eine Verbindung zur Bildgenerierung hinzu.
- **Professor Mari lässt sich nicht löschen.** Sie ist ein eingebauter Charakter, den Marinara bei jedem Start zurücksetzt. Siehe [Professor Mari, deine Assistentin in der App](../home/professor-mari.md).

## Verwandte Anleitungen

- [Personas](personas.md)
- [Charakterkarten importieren und exportieren](import-export.md)
- [Die Charakter-Bibliothek organisieren](library-organization.md)
