# Geführte Generierung und Impersonate

Zwei Wege, einen Chat zu lenken. Die geführte Generierung gibt der nächsten Antwort eine Richtung vor, ohne eine sichtbare Nachricht zu posten. Impersonate lässt das Modell deine eigene Antwort schreiben. Das Menü **Quick replies** (Schnellantworten) legt beides neben **Send** (Senden).

## Eine Antwort mit /guided lenken

Deine Vorgabe steht außerhalb der Rolle. Sie prägt die Antwort, erscheint aber nicht als Chat-Nachricht.

1. Tipp `/guided` und deine Vorgabe ins Nachrichtenfeld.
2. Drück <kbd>Enter</kbd> oder klick auf **Send**.

Das Modell schreibt seine nächste Antwort in Richtung deiner Vorgabe. Zum Beispiel:

```text
/guided make him admit he is lying
```

Du kannst auch `/narrator`, `/narrate` oder `/nar` statt `/guided` tippen. In einem Gruppenchat richtest du die Vorgabe mit `respond as`, `reply as` oder `respond for` an einen einzelnen Charakter:

```text
/guided respond as Alice make her admit she is lying
```

## Geführt neu generieren

Dabei dient der Text in deinem Nachrichtenfeld einmalig als Vorgabe für eine Neugenerierung.

1. Öffne **Settings → Chatting → Editing & Swipes** (Einstellungen → Chatten → Bearbeiten & Swipes) und schalte **Guide swipes/regens with chat input** (Swipes und Neugenerierungen mit der Chat-Eingabe lenken) ein. Standardmäßig ist die Einstellung aus.
2. Tipp in einem Chat eine Vorgabe ins Nachrichtenfeld, aber schick sie nicht ab.
3. Klick an der KI-Nachricht auf **Regenerate** (neu generieren). Steht Text im Feld, heißt die Schaltfläche **Regenerate (guided)**.

Deine Vorgabe bleibt danach im Feld stehen, sodass du sie anpassen und noch einmal neu generieren kannst. Soll das Feld stattdessen geleert werden, schalte **Keep guidance after regenerating** (Vorgabe nach dem Neugenerieren behalten) unter **Settings → Chatting → Message Box** aus.

Wenn es nicht funktioniert hat: Die Schaltfläche muss **Regenerate (guided)** heißen. Steht dort nur **Regenerate**, ist die Einstellung aus oder das Feld leer.

<a id="read-stored-guidance"></a>

## Stored guidance nachlesen

Marinara speichert die Vorgabe, die eine Antwort geprägt hat.

1. Klick an der KI-Nachricht auf das Symbol **Stored guidance** (gespeicherte Vorgabe), eine Schriftrolle.
2. Ein Fenster mit dem Titel **Stored guidance** zeigt die Vorgabe.

Das Fenster kennzeichnet, woher die Vorgabe stammt: **/guided**, **Guided regenerate** oder **Game start** (Einrichtung des Game Mode). Bei Vorgaben aus `/guided` und aus dem geführten Neugenerieren kopiert **Copy /guided** (als /guided kopieren) einen fertigen `/guided`-Befehl, den du in einen anderen Chat einfügen kannst.

## Deine Antwort mit Impersonate schreiben

Impersonate lässt das Modell deine nächste Nachricht im Tonfall deiner Persona schreiben. Eine Persona ist der Charakter, den du spielst, geschrieben als `{{user}}`. Siehe [Personas](../characters/personas.md).

Bevor du anfängst: Impersonate funktioniert nur in Roleplay-Chats. In Conversation siehst du „Impersonate is not available in Conversation mode.“ Auch in Game steht es nicht zur Verfügung.

1. Tipp `/impersonate` ins Nachrichtenfeld. Wenn du willst, häng eine Vorgabe an.
2. Drück <kbd>Enter</kbd> oder klick auf **Send**.

Das Modell postet eine Nutzernachricht als deine Persona. Dieses Beispiel schreibt eine Nachricht, die nach dem Wetter fragt:

```text
/impersonate ask about the weather
```

Der kurze Alias ist `/imp`. **Regenerate** funktioniert auch bei einer Nachricht, die Impersonate geschrieben hat, sodass du eine andere Fassung bekommst.

Eine gepostete Nachricht zählt als dein Zug. Agenten und Tracker laufen deshalb wie bei einer selbst getippten Nachricht, sofern **Agenten überspringen** nicht an ist. Wählst du bei eingeschaltetem **CYOA als Anweisung verwenden** eine CYOA-Option, wird direkt danach auch die Antwort des Charakters angefordert. Um den Text vorher zu lesen und zu bearbeiten, lass Impersonate stattdessen einen Entwurf schreiben.

### Zuerst einen Entwurf schreiben

Ein Entwurf landet im Nachrichtenfeld statt im Chat. Er wird nicht gespeichert, und bis du ihn sendest, läuft nichts: keine Charakterantwort, keine Agenten, keine Tracker und keine Änderungen am Weltzustand.

1. Öffne in einem Roleplay-Chat **Chat-Einstellungen** und such den Abschnitt **Verkörpern**.
2. Setz **Ergebnis senden an** auf **Nachrichtenentwurf**. Der Standard ist **Senden**.
3. Tipp `/impersonate` und bei Bedarf eine Vorgabe und drück <kbd>Enter</kbd>.

Der Entwurf erscheint nach und nach im Nachrichtenfeld. Darüber steht währenddessen **Deine nächste Nachricht wird geschrieben…**. Klick dort auf **Stoppen** oder auf die Stoppschaltfläche im Feld, um den bisherigen Text zu behalten. Bearbeite den fertigen Text und klick auf **Senden**. Bis du ihn sendest, bietet die Zeile darüber:

| Schaltfläche | Funktion |
| --- | --- |
| **Wiederholen** | Schreibt den Entwurf mit derselben Vorgabe neu und ersetzt den Text im Feld. |
| **Rückgängig** | Verwirft den Entwurf und stellt den vorherigen Inhalt des Felds wieder her. |

Der Entwurf wird weitergeschrieben, wenn du zu einem anderen Chat oder Tab wechselst. Bei deiner Rückkehr steht er im Nachrichtenfeld dieses Chats. Jeder Chat hat seinen eigenen Entwurf.

Für eine einmalige Auswahl, ohne die Einstellung zu ändern:

| Befehl | Funktion |
| --- | --- |
| `/impersonate_draft` | Schreibt einen Entwurf. Auch `/impd` und `/imp_draft`. |
| `/impersonate_post` | Postet die Nachricht. Auch `/impp` und `/imp_post`. |

Mit eingeschaltetem **Schnell-Antworten** bietet das Menü neben **Senden** ebenfalls beides: **Verkörpern** folgt der Einstellung, die zweite Aktion macht das jeweils andere. Ein Entwurf kann mit leerem Feld beginnen; dann entscheidet das Modell, was du sagst.

Sind **CYOA als Anweisung verwenden** und **Ergebnis senden an** unter **Nachrichtenentwurf** gewählt, schreibt ein Klick auf eine CYOA-Option einen Entwurf mit dieser Option als Vorgabe. Die Optionen bleiben sichtbar, bis du sendest.

### Die Impersonate-Einstellungen

Diese Einstellungen gelten für jedes `/impersonate` in all deinen Chats, in jedem Fenster und auf jedem Gerät. Öffne in einem Roleplay-Chat **Chat-Einstellungen** und such den Abschnitt **Verkörpern**. Wie du das Panel öffnest, steht in [Chat Settings](chat-settings.md).

| Bedienelement | Funktion |
| --- | --- |
| **Ergebnis senden an** | **Senden** stellt die Nachricht sofort in den Chat. **Nachrichtenentwurf** schreibt sie zum Bearbeiten und eigenen Senden ins Nachrichtenfeld. Siehe [Zuerst einen Entwurf schreiben](#write-a-draft-first). Standard: **Senden**. |
| **Prompt Template** (Prompt-Vorlage) | Eine optionale Anweisung, die bei jedem Impersonate mitgeschickt wird. Bleibt sie leer, gilt der Prompt des Chats oder der eingebaute Standard. Sie unterstützt `{{user}}`, `{{persona_description}}` und `{{impersonate_direction}}` – Platzhalter, die Marinara durch echten Text ersetzt. Wähl **Built-in default** (eingebauter Standard), um den Standard zu lesen, **Copy built-in default to edit** (eingebauten Standard zum Bearbeiten kopieren), um eine Kopie anzulegen, **Save as** (Speichern unter), um eine Vorlage unter einem Namen zu behalten, und **Delete template** (Vorlage löschen), um eine zu entfernen. |
| **Preset** | Ein Prompt-Preset nur für Impersonate-Antworten. Standard: **Use chat default** (Chat-Standard verwenden). Siehe [Presets](../prompts/presets.md). |
| **Connection** (Verbindung) | Das Modell für Impersonate-Antworten, etwa ein günstigeres oder schnelleres. Standard: **Use chat default**. Du kannst auch **Random** (Zufall) wählen. Siehe [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md). |
| **Agenten überspringen** | Überspringt während Impersonate die Agenten (Tracker, Lorebook-Router und ähnliche Helfer). Das hält Impersonate schnell und verhindert Änderungen am Weltzustand. Standardmäßig aus. Ein Entwurf überspringt sie immer. Siehe [Agenten](../agents/agents-overview.md). |
| **Send Public Faces** | In Roleplay-Chats erscheint ein Charakter mit **Public Face** im Impersonate-Prompt nur mit seinem Namen und Public Face, damit deine Antwort nur berücksichtigt, was du wissen könntest. Das ersetzt alles andere, was seine Karte sendet: Beschreibung, Persönlichkeit, Hintergrundgeschichte, Aussehen, Szenario, System-Prompt, Beispieldialog, RPG-Attribute, Anweisungen nach dem Verlauf und Tiefen-Prompt. Ein Charakter mit leerem Public Face behält seine vollständige Karte. Makros, die du in ein Impersonate-Preset oder eine Prompt-Vorlage setzt, etwa `{{description}}`, senden weiterhin das, was sie benennen. **Neu generieren** behält die Einstellung bei, mit der die Nachricht geschrieben wurde. Standardmäßig aus. Siehe [Tab „Card“](../characters/creating-and-editing-characters.md#card-tab). |
| **Use CYOA as direction** (CYOA als Vorgabe verwenden) | Ein Klick auf eine CYOA-Option (choose your own adventure, „wähle dein eigenes Abenteuer“) dient als Impersonate-Vorgabe, statt sie zu posten. Standardmäßig aus. Ist **Add CYOA choices to the message box instead of sending them** (CYOA-Auswahlmöglichkeiten ins Nachrichtenfeld einfügen, statt sie abzuschicken) unter **Settings → Chatting → Message Box** an, fügt ein Klick nur den Text in dein Nachrichtenfeld ein, und diese Einstellung hat keine Wirkung. |

### Einen Prompt für einen Chat festlegen

1. Tipp `/impersonate_prompt` und deinen Prompt in Anführungszeichen.
2. Drück <kbd>Enter</kbd>.

```text
/impersonate_prompt "You will now play as my OC:"
```

Um zum Standard zurückzukehren, tipp `/impersonate_prompt reset`. Der Alias ist `/imp_prompt`.

## Quick replies neben Send hinzufügen

Quick replies ergänzen **Send** um Alternativen mit einem Klick, sodass du keinen Slash-Befehl tippen musst.

1. Öffne **Settings → Chatting → Message Box**.
2. Schalte **Quick replies** ein. Standardmäßig ist es aus.
3. Klapp es auf, um zu wählen, welche Aktionen erscheinen. Sobald es an ist, sind alle drei Aktionen standardmäßig an.

| Aktion | Funktion |
| --- | --- |
| **Post only** (nur posten) | Stellt deine getippte Nachricht ohne Antwort in den Chat. Der Befehl `/send <message>` bewirkt dasselbe. |
| **Guide reply** (Antwort lenken) | Schickt deinen getippten Text als `/guided`-Vorgabe. |
| **Verkörpern** | Erzeugt eine Antwort deiner Persona mit deinem getippten Text als Vorgabe. Folgt **Ergebnis senden an**; in Roleplay macht eine zweite Aktion daneben das jeweils andere (**Impersonate als Entwurf** oder **Impersonate und senden**). In Conversation-Chats ist sie ausgeblendet. |

Ist eine Aktion an, sitzt ihre Schaltfläche neben **Send**. Sind es mehrere, wandern sie in eine Drei-Punkte-Schaltfläche (**Quick replies**), die ein Menü öffnet.
