# Text to Speech (TTS) einrichten

Text to Speech (TTS) liest Chat-Nachrichten und Spielerzählungen laut vor. In dieser Anleitung erfährst du, wie du es einschaltest, einen Sprachdienst und Stimmen wählst, die automatische Wiedergabe einrichtest und die Steuerung an einzelnen Nachrichten nutzt.

## Schnellstart

1. Klick in der oberen Leiste auf **Verbindungen** und dann auf **Hinzufügen**.
2. Klick bei den Typfiltern auf **Stimme**, wähle einen Dienst und füge deinen Key in **API-Schlüssel** ein. Klick auf **Verbinden**.
3. Setz unter **Found in … — use it for:** ein Häkchen bei **Stimme** und klick auf **Fertig**. Mit der Auswahl eines Modells für die Sprachausgabe schaltest du sie ein.
4. Klick im Kasten **Aufgaben** auf das Zahnrad der Zeile **Stimme (Text to Speech)** und dann auf **Vorschau**, um eine Hörprobe abzuspielen. Klick in einem Chat unter einer Nachricht auf **Sprechen**.

## Text to Speech einschalten

Wählst du ein Modell für die Aufgabe **Stimme (Text to Speech)**, schaltest du Text to Speech ein. Das bringt noch nichts zum Sprechen. Es blendet die Schaltfläche **Sprechen** an jeder Nachricht und die Optionen unter **Automatisch abspielen** ein. Was wann vorgelesen wird, entscheidest weiterhin du.

1. Öffne **Bibliothek → Verbindungen**. Klick im Kasten **Aufgaben** auf **Stimme (Text to Speech)**. Das Fenster **Modell für Stimme (Text to Speech)** öffnet sich.
2. Wähle ein Sprachmodell aus einem deiner Konten oder eine Sprach-Engine auf diesem Gerät wie **Local PocketTTS**. Die Zeile **Stimme (Text to Speech)** zeigt deine Auswahl.
3. Noch kein Sprachkonto? Klick unten im Fenster auf **Konto hinzufügen** oder auf der Seite Verbindungen auf **Neue Verbindung** und öffne den Tab **Stimme**.
4. Um Text to Speech auszuschalten, klick erneut auf **Stimme (Text to Speech)** und wähle **Turn voice off**. Solange es aus ist, wird nichts vorgelesen.

Ein Sprachdienst ist der Dienst, der das Audio erzeugt. Marinara unterstützt diese:

- **OpenAI-compatible**: OpenAI oder jeder Server, der das TTS-Format von OpenAI nachbildet. Das ist der Standard.
- **ElevenLabs**: der Sprachdienst von ElevenLabs.
- **PocketTTS**: ein kostenloser Sprachserver, den du auf deinem eigenen Rechner betreibst.
- **xAI Voice**: der Sprachdienst von xAI.

Marinara speichert für jeden Sprachdienst ein eigenes Profil: Key, Adresse, Modell, Stimmen und Parameter. Wechselst du den Dienst, kehrt dessen frühere Einrichtung zurück. Ein Dienst, den du noch nicht eingerichtet hast, startet mit Standardwerten.

Anfragen laufen über Marinaras eigenen Server. Dein API-Key wird verschlüsselt auf dem Server gespeichert. Nach dem Speichern zeigt das Feld nur maskierte Punkte, und der echte Key geht nie an deinen Browser zurück.

### Ein Sprachmodell aus einem Konto verwenden

Hast du bereits ein **Audio**-Konto hinzugefügt (siehe [Unterstützte KI-Anbieter](../connections/providers-reference.md#audio)), musst du seine Daten nicht noch einmal eintragen. Seine Sprachmodelle erscheinen in der Auswahl **Stimme (Text to Speech)**.

1. Klick im Kasten **Aufgaben** auf die Zeile **Stimme (Text to Speech)** und wähle das Modell.
2. Klick auf das Zahnrad der Zeile. Wähle deine Stimmen und die übrigen Einstellungen.

Marinara verwendet dann Adresse, Key, Modell und **Anfrage-Zeitlimit (Sekunden)** dieses Kontos, deshalb zeigen die Spracheinstellungen diese Felder nicht. Der Key bleibt im Konto. Er wird weder in die Spracheinstellungen kopiert noch an deinen Browser geschickt. Änderungen am Konto, etwa ein neuer Key, gelten sofort.

Stimmen, Tempo und die übrigen Spracheinstellungen werden für jedes Konto getrennt gespeichert. Zwei Konten derselben Art teilen sie nie. Deine Einstellungen für die vier regulären Sprachdienste bleiben, wie sie waren.

Wird das gewählte Konto gelöscht oder lässt es sich nicht verwenden, zeigt die Zeile **Das Konto für die Sprachausgabe fehlt**, und es wird nichts gesprochen, bis du ein anderes Sprachmodell wählst. Marinara wechselt nie von selbst.

## Adresse, Key und Modell festlegen

Das Fenster **Konto hinzufügen** fragt nur nach dem Key oder der Adresse. Um sie später zu ändern, klick unter **Verbindungen** beim Konto auf **⋯** und dann auf **Konto bearbeiten**. Überspring diesen Abschnitt, wenn du ein Audio-Konto gewählt hast. Das Konto liefert diese Angaben.

1. Prüf **Adresse**. Jeder Dienst trägt einen Standard ein (Tabelle unten). Ändere ihn nur für einen Proxy oder einen Server, den du selbst betreibst.
2. Füge deinen Key in **API key** ein. Soll ein vorhandener Key bleiben, lass die maskierten Punkte stehen. Zum Entfernen leerst du das Feld.
3. Wähle das Modell oder tipp eine andere Modell-ID ein, die dein Dienst unterstützt.

| Sprachdienst | Standardadresse | Standardmodell | Standardstimme |
| ----------------- | --------------------------- | ------------------------ | ----------------------- |
| OpenAI-compatible | `https://api.openai.com/v1` | `tts-1` | `alloy` |
| ElevenLabs | `https://api.elevenlabs.io` | `eleven_multilingual_v2` | keine, du musst eine wählen |
| PocketTTS | `http://localhost:8000` | `pocket-tts` | `alba` |
| xAI Voice | `https://api.x.ai/v1` | `grok-tts` | `eve` |

Bei **ElevenLabs** lädt die Modellliste die Sprachmodelle, die dein Konto nutzen kann. Wähle ein normales Sprachmodell. Modell-IDs mit `ttv` sind Voice-Design-Modelle, die keinen Text vorlesen können. Wählst du eines davon, scheitert die Wiedergabe mit einer Fehlermeldung, die dich auffordert, ein Sprachmodell zu verwenden.

### PocketTTS

PocketTTS ist nicht in Marinara eingebaut. Installiere [den offiziellen PocketTTS-Server](https://github.com/kyutai-labs/pocket-tts) separat und starte ihn mit `uvx pocket-tts serve`. Marinara lädt ihn weder herunter, noch verwaltet es ihn. Der offizielle Server verwendet `http://localhost:8000`. Lass **Adresse** auf diesem Wert, sofern du Host oder Port nicht geändert hast. Marinara erkennt die offizielle Multipart-API `/tts`. Eigene URLs für den [OpenAI-kompatiblen PocketTTS-Wrapper](https://github.com/teddybear082/pocket-tts-openai_streaming_server) funktionieren weiterhin.

### Zeitlimit für Anfragen

Marinara wartet bis zu 60 Sekunden auf jede gesprochene Zeile. Ein Sprachserver auf deinem eigenen Rechner, vor allem auf einem Laptop, kann für eine lange Zeile länger brauchen. Erhöhe dann **Anfrage-Zeitlimit (Sekunden)** unter **Mehr** in **Voice settings** (das Zahnrad an der Zeile **Stimme (Text to Speech)** im Kasten **Aufgaben**). Möglich sind 10 bis 3.600 Sekunden.

Ein Audio-Konto hat ein eigenes Feld **Anfrage-Zeitlimit (Sekunden)** unter **Standardstimme**, sowohl im Fenster **Modell bearbeiten** seines Modells als auch in **Voice settings**. Chats, die über ein Audio-Konto sprechen, auch über eines, das für die Aufgabe **Stimme (Text to Speech)** gewählt ist, nutzen dieses Limit. Das Limit in **Voice settings** gilt für Sprachausgabe mit diesen Einstellungen, einschließlich **Vorschau**. Dauert eine Zeile zu lange, nennt die Fehlermeldung, wie viele Sekunden Marinara gewartet hat und welche Einstellung du erhöhen solltest.

## Stimmen wählen

Alle Sprechenden nutzen **Shared voice**, bis du einem Charakter oder einer Persona eine eigene Stimme gibst. Der Bereich **Who speaks** in **Voice settings** enthält beide Optionen.

### One voice for all

Wähle die Stimme in **Shared voice**. Um die echte Stimmenliste deines Dienstes zu laden, klick auf **Stimmen vom Anbieter aktualisieren** (das Symbol mit dem Kreispfeil). Bevor du verbunden bist, zeigt die App eine kurze eingebaute Liste, damit das Feld nicht leer bleibt. Ein Fehler des Dienstes wird angezeigt, statt die Ersatzliste als geglücktes Neuladen auszugeben.

Der offizielle PocketTTS-Server hat keinen Endpunkt für eine Stimmenliste. Marinara zeigt deshalb seine eingebauten Stimmen und daneben ein Textfeld für einen anderen eingebauten Namen oder eine unterstützte Stimmen-URL. Kompatible Wrapper-Server können eine eigene Liste liefern und eigene IDs oder Pfade annehmen.

Bei **ElevenLabs** musst du eine Stimme wählen. Marinara lädt die gesamte Bibliothek des Kontos: persönliche, Workspace-, gespeicherte und Standardstimmen. Die Auswahl hat ein Suchfeld und zeigt, wie viele Stimmen geladen sind. Sie startet auf „Select an ElevenLabs voice“, und die Wiedergabe bleibt gesperrt, bis du eine echte Stimme wählst.

### Selected per character or persona

1. Klick in **Character and persona voices** auf **Add voice**.
2. Wähle in der linken Liste einen Charakter oder eine Persona und in der rechten Liste eine Stimme.
3. Wiederhol das für jeden weiteren Eintrag.

Die Stimme eines Charakters kannst du auch im **Charakter-Editor** auf dem Tab **Stimme** festlegen. Das ändert dieselbe Zeile. Solange die Charaktere eine gemeinsame Stimme nutzen, steht dort **Alle Charaktere teilen sich derzeit eine Stimme.** Klick auf **Eigene Stimme pro Charakter verwenden**, um umzuschalten, und wähle dann eine Stimme. Über **Einstellungen für Sprachausgabe öffnen** gelangst du zu **Voice settings**. **Aktualisieren** in **Character and persona voices** lädt die Stimmenliste neu. Leg deine Charaktere zuerst an. Gibt es noch keine, weist die App dich darauf hin, vor dem Zuweisen von Stimmen einen Charakter oder eine Persona hinzuzufügen.

Ein Charakter ohne eigene Stimme verwendet die Stimme einer Karte mit passendem Namen, etwa die des Originals einer AU-Kopie. Andernfalls nutzt er die gemeinsame Stimme. Siehe [Charaktere anlegen und bearbeiten](../characters/creating-and-editing-characters.md).

### Erzählerstimme

Erzählung ist Text, den kein einzelner Charakter spricht, etwa eine Szenenbeschreibung oder die Zeilen eines Game Masters.

1. Schalte in **Narrator voice** (Erzählerstimme) die Option **Use separate narrator voice** (eigene Erzählerstimme verwenden) ein.
2. Wähle eine Stimme.

Sie wird verwendet, wenn der Sprecher einer Zeile Narrator, GM, Game Master oder System ist, in Nachrichten in Roleplay und Conversation sowie bei Erzählung im Game Mode ohne benannten Sprecher. Bei ElevenLabs wählst du hier eine Erzählerstimme. Lässt du das Feld leer, greift die Erzählung nur dann auf eine Ersatzstimme zurück, wenn eine globale Stimme gesetzt ist.

### Zufällige NPC-Stimmen (nur im Game Mode)

Damit bekommen Nebencharaktere, die der Game Mode mitführt, übrige Stimmen. In Roleplay und Conversation hat das keine Wirkung.

1. Schalte in **Random NPC voices** (zufällige NPC-Stimmen) die Option **Use default voices for random NPCs** (Standardstimmen für zufällige NPCs verwenden) ein.
2. Setz Häkchen bei Stimmen in **Male NPC defaults** und **Female NPC defaults**.

Ein mitgeführter NPC (Nicht-Spieler-Charakter) ohne eigene Stimme bekommt eine feste Zuteilung aus dem passenden Pool und behält sie für die Sitzung. Ein NPC mit zugewiesener Stimme behält diese Stimme. NPCs mit unklarem Geschlecht wählen aus beiden Pools. Findet die App keine als männlich oder weiblich gekennzeichneten Stimmen, nutzt jeder Pool die vollständige Liste.

## Audioformat und Tempo

**Audio format** (Audioformat) ist **MP3** (Standard) oder **WAV**. Nimm WAV für lokale Server, die kein MP3 erzeugen können. Bei ElevenLabs ist das Steuerelement ausgeblendet, dort läuft immer MP3. Bei xAI Voice erscheint es, bleibt aber wirkungslos, weil xAI immer MP3 liefert.

Der Bereich des Schiebereglers **Speed** (Tempo) hängt vom Sprachdienst ab:

| Sprachdienst | Bereich |
| ----------------- | ------------------------------------------------------------------------------ |
| OpenAI-compatible | 0,25- bis 4,0-fach |
| PocketTTS | 0,25 bis 4,0 bei kompatiblen Wrappern. Der offizielle Server steuert das Tempo selbst. |
| ElevenLabs | 0,7- bis 1,2-fach |
| xAI Voice | 0,7- bis 1,5-fach |

Ein gespeichertes Tempo außerhalb des Bereichs wird auf den nächstliegenden erlaubten Wert begrenzt. Bei ElevenLabs gibt es zwei weitere Steuerelemente: **Language** (Sprache) erzwingt eine Sprache oder bleibt auf **Auto detect**, und **Stability** (Stabilität) reicht von ausdrucksstärker bis gleichmäßiger.

## Auto-play

Jeder Schalter unter **Automatisch abspielen** liest eine bestimmte Art neuer Nachricht vor, sobald ihre Generierung abgeschlossen ist. Alle setzen ein Modell für die Aufgabe **Stimme (Text to Speech)** voraus. Alle starten ausgeschaltet.

- **Roleplay messages**: neue Antworten in Roleplay.
- **Conversation messages**: neue Antworten in Conversation.
- **Game narration**: neue Erzähl- und Kampfzeilen im Game Mode.
- **Progressive playback**: startet bei einer Antwort aus mehreren Zeilen sofort die erste Zeile, statt auf die ganze Antwort zu warten.
- **Only read dialogues**: liest nur zitierte oder markierte Sprechzeilen und überspringt reine Erzählung.

Die automatische Wiedergabe greift genau einmal, bei der neuesten Antwort, sobald sie fertig ist. Alte Nachrichten liest sie nicht erneut vor, wenn du einen Chat wieder öffnest oder scrollst.

In Roleplay beginnt die Vorbereitung der Sprachausgabe, sobald die Hauptantwort gespeichert ist. Schreibt ein aktivierter Agent wie Prose Guardian die Antwort um, wartet Marinara auf den endgültigen Text.

### Textfilter und Emotionsanweisungen

Diese Filter gelten für die manuelle und die automatische Wiedergabe, einschließlich Game-Erzählung und Sprechererkennung in Roleplay. Codeblöcke werden standardmäßig übersprungen. Die anderen beiden Filter sind anfangs aus.

- **Skip text inside HTML and custom tags** (Text in HTML- und eigenen Tags überspringen): entfernt den eingeschlossenen Text, etwa einen verborgenen Block `<simulation>...</simulation>`. Sprecher-Tags für die Stimmenwahl bleiben erhalten.
- **Skip fenced code blocks** (abgegrenzte Codeblöcke überspringen).
- **Skip text inside square brackets** (Text in eckigen Klammern überspringen).

Schalte **Roleplay speaker extractor** (Sprechererkennung in Roleplay) ein, damit **Enable emotion indicators** (Emotionshinweise aktivieren) erscheint. Damit kommen Sprechanweisungen hinzu, ohne dass sich der Wortlaut der Dialoge ändert. Sind die Emotionshinweise eingeschaltet, geht Text in eckigen Klammern an den Sprachdienst, auch wenn **Skip text inside square brackets** eingeschaltet ist. Das kann auch Notizen einschließen. Sollen Notizen in Klammern nicht vorgelesen werden, schalte die Emotionshinweise aus und lass das Überspringen eingeschaltet. Anweisungen wie `[Low, steady voice, restrained urgency]` bleiben vollständig, wenn eine lange Zeile aufgeteilt wird. Bekannte Sprecher- und Szenenmarkierungen werden weiterhin entfernt. Das Sprachmodell entscheidet, wie es jede Anweisung umsetzt. Ist für die Aufgabe **Stimme (Text to Speech)** ein Modell gewählt und sind **Game narration** und die Emotionshinweise eingeschaltet, können auch Szenen-, Party- und Kampfdialoge im Game Mode Anweisungen enthalten.

## Eine einzelne Nachricht vorlesen

Sobald für die Aufgabe **Stimme (Text to Speech)** ein Modell gewählt ist, erscheint in der Werkzeugleiste unter jeder Charakter- oder Erzählernachricht eine Schaltfläche **Sprechen** (ein Mikrofonsymbol).

- Klick auf **Speak**, um die Nachricht vorzulesen. Während das Audio geladen wird, zeigt die Schaltfläche einen Ladezustand.
- Ein erneuter Klick während der Wiedergabe stoppt sie. Der Tooltip lautet dann **Stop speaking**.
- Eine Nachricht ohne lesbaren Text, etwa nur mit einem Bild, zeigt **No dialogue to speak** und bleibt deaktiviert.

Während eine Nachricht gesprochen wird, erscheinen die Schaltflächen **Pause speaking**, **Resume speaking** und **Restart speaking**. Die Schaltfläche mit dem Lautsprechersymbol öffnet den Regler **Line volume** (Zeilenlautstärke) von 0 bis 100 Prozent (Standard 50). Er ist unabhängig vom Mischpult im Game Mode und von der Anruflautstärke in Conversation.

Wenn es nicht funktioniert hat, sieh unter [Fehlerbehebung](#troubleshooting) nach.

## Zwischengespeicherte Clips

Marinara legt generiertes Audio in deinem Browser ab, damit dieselbe Zeile nicht zweimal generiert wird. Der Bereich **Zwischengespeicherte Clips** in **Voice settings** zeigt Anzahl und Gesamtgröße in Echtzeit. Klick auf **Export cached TTS clips** (zwischengespeicherte TTS-Clips exportieren, das Download-Symbol), um alle zwischengespeicherten Clips als einzelne Audiodateien zu sichern. Der Cache entfernt seine ältesten Clips von selbst. Eine Schaltfläche zum Leeren gibt es in der App nicht. Lösch deine Browserdaten, um ihn zu leeren.

## TTS in den einzelnen Chat-Modi

- **Roleplay** nutzt den Schalter **Roleplay messages** und die **Speak**-Steuerung. Siehe [Roleplay Mode: Erste Schritte](../roleplay/getting-started.md).
- **Conversation** nutzt den Schalter **Conversation messages** und dieselbe Steuerung. Audioanrufe sind in [Audio- und Videoanrufe in Conversation](../conversation/calls.md) beschrieben.
- **Game Mode** nutzt den Schalter **Game narration**. Sein Mischpult hat einen Kanal **TTS** neben **Master**, **Music**, **Sound Effects** und **Ambient**. Er regelt die Lautstärke des gesprochenen Spiel-Audios und startet bei 100 Prozent. Siehe [Die Bedienelemente des Spiels](../game/getting-started.md#the-games-controls).

### Phonetic name (Aussprache in Anrufen)

Spricht die Stimme einen Charakter- oder Persona-Namen falsch aus, füge einen **Phonetic name** (phonetischer Name) hinzu und tipp ein, wie er klingen soll. Im **Character Editor** liegt das Feld auf dem Tab **Voice**. Im **Persona Editor** steht es bei den Basisangaben. Es wird nur bei Audio- und Videoanrufen in Conversation verwendet. **Speak**, die automatische Wiedergabe und die Erzählung im Game Mode ignorieren es.

## Fehlerbehebung

- **Nichts wird gesprochen**: Prüf, ob die Zeile **Stimme (Text to Speech)** im Kasten **Aufgaben** nicht auf **Aus** steht. Prüf dann den passenden Schalter unter **Automatisch abspielen** oder nutze **Sprechen** an einer Nachricht.
- **Die Zeile Stimme (Text to Speech) zeigt Das Konto für die Sprachausgabe fehlt**: Das Konto hinter dem Sprachmodell wurde gelöscht oder lässt sich nicht verwenden. Wähle ein anderes Sprachmodell. Siehe [Ein Sprachmodell aus einem Konto verwenden](#use-a-voice-model-from-an-account).
- **Keine Stimmen in der Liste**: Prüf, ob die Zeile **Stimme (Text to Speech)** ein Modell und einen gültigen Key hat, und klick dann auf **Stimmen vom Anbieter aktualisieren**. Der offizielle PocketTTS-Server verwendet Marinaras eingebaute Liste. Bei einem kompatiblen PocketTTS-Wrapper prüf, ob `<Base URL>/v1/voices` antwortet.
- **ElevenLabs spricht nicht**: Wähle eine echte Stimme, nicht den Platzhalter „ElevenLabs-Stimme auswählen“. Prüf, ob das Sprachmodell ein Modell für Sprachausgabe ist und kein Voice-Design-Modell, dessen ID `ttv` enthält.
- **Eine Zeile bricht mit „No audio after 60 s“ ab**: Der Sprachserver braucht mehr Zeit. Erhöhe **Request timeout (seconds)** dort, wo die Meldung es angibt. Siehe [Zeitlimit für Anfragen](#request-timeout).
- **Ein selbst gehosteter Server auf einer lokalen Adresse wird blockiert**: Schalte `TTS_LOCAL_URLS_ENABLED` in `.env` ein. Damit erreicht Marinara lokale oder private Adressen für OpenAI-kompatible oder ElevenLabs-artige Server. PocketTTS braucht das nicht. Siehe [Referenz zur Server-Konfiguration](../CONFIGURATION.md).
- **Schnell testen**: Klick in **Voice settings** auf **Vorschau**, um mit deinen aktuellen Einstellungen eine kurze Hörprobe abzuspielen.

## Referenz: Musik, Soundeffekte und Gacha Forge

Diese Abschnitte sind für fortgeschrittene Setups gedacht.

### Game-Musik und Soundeffekte über einen kompatiblen Audioserver

1. Öffne in **Connections** dein Konto für **Music & Sound Effects** (Musik und Soundeffekte) mit **Edit model** (Modell bearbeiten) und wähle **Custom compatible server** (eigener kompatibler Server). In der Liste **Add connection** gibt es keinen Eintrag für diese Kontoart; solche Konten entstehen durch ein Upgrade oder einen Import (siehe [die Kontoreferenz](../connections/providers-reference.md#music--sound-effects)).
2. Trag Adresse, Key und Modell deines Musik- oder Soundeffektservers ein.
3. Lege **Generation API format** (API-Format für die Generierung) fest und trag die Endpunktpfade ein, die dein Server anbietet. Ein leerer Pfad lässt die jeweilige Funktion unverfügbar.
4. Schalte **Music generation** (Musikgenerierung), **Sound-effect generation** (Soundeffektgenerierung) oder beides ein.
5. Wähle dieses Konto in der Game-Einrichtung oder in den Audioeinstellungen des Games. Lass dein Sprachkonto separat in den Spracheinstellungen der Aufgabe **Stimme (Text to Speech)** ausgewählt.

Endpunktpfade werden an die Base URL des Kontos angehängt. Verwende bei `http://localhost:8002/v1` den Pfad `chat/completions`, um `/v1/chat/completions` zu erreichen. Lokale HTTP-Endpunkte brauchen wie andere lokale kompatible Audioanfragen `TTS_LOCAL_URLS_ENABLED=true` in `.env`.

Zwei API-Formate werden unterstützt:

- **Prompt JSON → MP3 audio** sendet `{ "model": "your-model", "prompt": "the requested sound", "duration": 5, "response_format": "mp3" }` und erwartet MP3-Bytes. Game-Musik verwendet die Dauer des Kontexttracks (standardmäßig 120 Sekunden). Soundeffekte fordern 5 Sekunden an.
- **Chat Completions → inline audio (ACE-Step compatible)** sendet `model`, einen Benutzereintrag in `messages`, `stream: false` und `audio_config` mit `duration`, `instrumental: true` und `format: "mp3"`. Es nimmt Inline-MP3 aus `choices[0].message.audio` an: entweder ein ACE-Step-Array von Audio-URLs mit einer Base64-Daten-URL oder ein Objekt mit Base64-`data`. Siehe den [ACE-Step-kompatiblen API-Vertrag](https://github.com/ace-step/ACE-Step-1.5/blob/main/docs/en/Openrouter_API_DOC.md). Entfernte Ergebnis-URLs und asynchrone Job-APIs werden nicht unterstützt.

Schalte nur ein, was dein Server tatsächlich umsetzt. Ein OpenAI-kompatibler Sprachendpunkt allein heißt nicht, dass er Musik oder Soundeffekte unterstützt. Ein Dienst wie Infermatic muss eines dieser Formate bereitstellen oder einen Adapter liefern. Sein tatsächlicher Musikendpunkt wurde hier nicht geprüft. Für native Generierung über ElevenLabs oder SunoAPI wählst du die entsprechende Quelle unter **Music & Sound Effects**. Siehe [die Kontoreferenz](../connections/providers-reference.md#music--sound-effects).

Generierte Kontextmusik wird einmal pro Gebiet oder Begegnungsstufe komponiert und wiederverwendet. Wiederholte Soundeffekte nutzen den Audiocache. Nach einem Generierungsfehler bleibt der Cache für einen erneuten Versuch verfügbar.

### Dialoge und Audio in Gacha Forge

Gacha Forge ab Version 1.11.0 verwendet das für die Aufgabe **Stimme (Text to Speech)** gewählte Konto und dessen Stimmenzuweisungen pro Charakter. - Schalte **Read character dialogue** (Charakterdialoge vorlesen) ein, um Dialoge importierter Charaktere mit zugewiesener Stimme vorlesen zu lassen. Die Option steht bei einer neuen Welt im Einrichtungsschritt **Lore** (Hintergrundwissen) und bei einer bestehenden Welt in den eigenen Welteinstellungen von Gacha Forge. Erzähltext, Gedanken, generierte Einheiten ohne Engine-Charakter-ID und Charaktere ohne Stimme bleiben stumm. Ein Name allein übernimmt nie die Stimme eines anderen Charakters.

- Ein gewähltes Audio-Konto lässt sich verwenden, wenn die Aufgabe **Stimme (Text to Speech)** nicht auf **Aus** steht.
- Die mitgelieferte Game-Musik und die Soundeffekte brauchen kein Generierungskonto. Um neue Titel zu komponieren, schalte in Gacha Forge **Generate music and sound effects** (Musik und Soundeffekte generieren) ein und wähle unter **Audio connection** (Audioverbindung) ein Konto für Music & Sound Effects. Diese Auswahl erscheint, wenn die Generierung eingeschaltet ist. Titel für Home, Kampf, Boss, Story-Szenen und Charaktergeschichten werden beim ersten Bedarf erzeugt und danach wiederverwendet. Diese Anfragen laufen über dein Konto bei dem jeweiligen Dienst.
- Die Stummschaltung oben rechts schaltet Musik, Dialoge und Soundeffekte gemeinsam stumm. Die visuellen Einstellungen von Gacha Forge haben getrennte Lautstärkeregler für alle drei, auch bis auf null, und dazu die Pause beim automatischen Weiterblättern (standardmäßig **3 Sekunden**, nach dem Einblenden des Textes und einem möglichen gesprochenen Dialog). Entscheidungen warten weiterhin auf den Spieler. Gesprochene Dialoge werden abgebrochen, wenn du eine Szene verlässt. Beim Verlassen der Welt stoppt ihr Audio.

Aktualisiere neben der Engine auch das installierte Gacha-Forge-Paket, um diese Bedienelemente zu erhalten.

## Weiterführende Anleitungen

- [Audio- und Videoanrufe in Conversation](../conversation/calls.md)
- [Lippensynchronisation mit Sprachausgabe](../agents/avatars.md#lip-sync-with-text-to-speech) für 2D- und 3D-Avatare
- [Roleplay Mode: Erste Schritte](../roleplay/getting-started.md)
- [Game Mode: Erste Schritte](../game/getting-started.md)
- [Unterstützte KI-Anbieter](../connections/providers-reference.md)
- [Charaktere anlegen und bearbeiten](../characters/creating-and-editing-characters.md)
- [Referenz zur Server-Konfiguration](../CONFIGURATION.md)
