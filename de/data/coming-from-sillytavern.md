# Von SillyTavern umsteigen

Das meiste, was du in SillyTavern genutzt hast, gibt es auch in Marinara Engine (ab hier Marinara), manchmal unter einem anderen Namen. Such in der Tabelle den Begriff, den du kennst. Klick dann auf **Zeig es mir**, um die passende Stelle in der App zu öffnen, oder auf den Namen, um die Anleitung zu lesen.

Du kannst auch den SillyTavern-Begriff in die Suche eingeben (**Strg+K**, oder auf dem Handy auf den Titel tippen). „chat completion preset“, „world info“, „regex“ und „author's note“ führen alle zur entsprechenden Marinara-Funktion.

Wie du deine Charaktere, Chats, Presets und World Info übernimmst, steht unter [Aus SillyTavern importieren](importing-from-sillytavern.md). Chats behalten ihre Nachrichtendaten, Author's Note und Persona, Presets ihre Sampler-Einstellungen.

## Gleiche Funktion, Marinara-Name

| In SillyTavern | In Marinara | Wo | |
| --- | --- | --- | --- |
| Chat-Completion-Presets, AI Response Configuration (Sampler) | [Presets](../prompts/presets.md) | Bibliothek → **Voreinstellungen**. Temperatur, Top P/K, Min P und die Penalties stehen unter **Parameter** des Presets | [Zeig es mir](#show-presets) |
| Prompt Manager | [Preset-Abschnitte](../prompts/presets.md) | Bibliothek → **Voreinstellungen**, ein Preset öffnen → **Abschnitte** | [Zeig es mir](#show-presets) |
| Gespeicherte Chat-Konfigurationen, Chat-Standardwerte | [Einstellungsprofile](../chats/settings-profiles.md) | Bibliothek → **Einstellungsprofile**, oder Neues Roleplay → **Profil verwenden** | [Zeig es mir](#show-settingsProfiles) |
| World Info, World Book | [Lorebooks](../lorebooks/overview.md) | Bibliothek → **Lorebooks** | [Zeig es mir](#show-lorebooks) |
| Author's Note | [Autorennotizen](../roleplay/getting-started.md) | Chat-Einstellungen (Roleplay) | [Zeig es mir](#show-authorsNotes) |
| Regex | [Regex-Skripte](../extending/regex-scripts.md) | Bibliothek → **Regex-Skripte** | [Zeig es mir](#show-regexScripts) |
| Gruppenchats | [Gruppenchats](../chats/group-chats.md) | Füge einem Chat zwei oder mehr Charaktere hinzu | [Zeig es mir](#show-groupChats) |
| Charakterkarten, alternative Begrüßungen | [Charakterkarten](../characters/import-export.md) | Bibliothek → **Charaktere** → **Importieren**. Eine alternative Begrüßung wählst du beim Start eines Roleplay-Chats | |
| Quick Replies, STscript | [Schnellantworten und Slash-Befehle](../chats/guided-and-impersonate.md) | Neben **Senden** oder gib `/` ein | [Zeig es mir](#show-quickReplies) |
| Erweiterungen (Summarize, Image Generation…) | [Agenten](../agents/agents-overview.md) | Bibliothek → **Agenten**, dann pro Chat einschalten | [Zeig es mir](#show-agents) |
| Summarize, Vector Storage, Data Bank | [Erinnerungsabruf und Zusammenfassungen](../agents/memory.md) | Chat-Einstellungen → **Memory Recall** | [Zeig es mir](#show-memory) |
| API-Verbindungen, Verbindungsprofile | [Verbindungen](../connections/connecting-to-a-provider.md) | Bibliothek → **Verbindungen** | [Zeig es mir](#show-connections) |
| Prompt Itemization | [Prompt ansehen](../chats/peek-prompt.md) | Die neueste KI-Antwort → **Prompt ansehen** | [Zeig es mir](#show-peekPrompt) |
| Checkpoints, Verzweigungen | [Verzweigungen](../chats/branches.md) | Eine Nachricht → **Ab hier verzweigen** | [Zeig es mir](#show-branches) |
| Swipes, erneut würfeln | [Swipes](../chats/messages.md) | Die Pfeile unter einer Antwort oder wische auf einem Touchscreen | [Zeig es mir](#show-swipes) |
| Persona-Verwaltung | [Personas](../characters/personas.md) | Bibliothek → **Personas** | [Zeig es mir](#show-personas) |
| UI-Themes, eigenes CSS | [Themes und CSS-Themes](../appearance/custom-css-themes.md) | Einstellungen → **Darstellung** | [Zeig es mir](#show-themes) |

**Zeig es mir** öffnet die Seite oder startet den Schritt, wenn das möglich ist. Für Funktionen innerhalb eines Chats (Prompt ansehen, Erinnerungen) öffne zuerst einen Chat; andernfalls öffnet sich die Anleitung.

## Was anders funktioniert

- **Keine Instruct- oder Kontextvorlagen.** Marinara sendet Chat-Nachrichten, und der Server des Modells wendet dessen eigene Vorlage an. Unter SillyTaverns **Advanced Formatting** gibt es daher nichts auszuwählen. Die Abschnitte eines Presets ersetzen den Story-String.
- **Sampler.** Die Einstellungen eines Presets sind die Anfangswerte für Chats, die es verwenden. Werte an der Verbindung oder im Chat haben Vorrang. Maximale Antwortlänge und Kontextgröße gehören zur Verbindung. Für Top A und Repetition Penalty gibt es hier keine Einstellung.
- **Autorennotizen.** Sie werden bei jeder Antwort in der eingestellten Tiefe in den Chat eingefügt. Steht **Nachbearbeitung der Nachrichten** auf **Anwenden** (Standard), werden sie innerhalb der benachbarten Nutzernachricht gesendet. SillyTaverns Einstellungen für Häufigkeit, Position und Rolle haben hier keine Entsprechung. **Prompt ansehen** kennzeichnet ihre Position.
- **Gruppenchats.** In Roleplay spricht standardmäßig ein Erzähler für alle Charaktere, was weniger Tokens verbraucht. Damit wie in SillyTavern jeder Charakter der Reihe nach antwortet, öffne Chat-Einstellungen → **Gruppenchat** und wechsle den Modus. Aus SillyTavern importierte Gruppen verwenden bereits den Modus **Einzeln**.
- **Tasten.** Enter fügt im Chat eine neue Zeile ein, **Strg+Enter** sendet. Schalte **Sende auf Enter** unter Einstellungen → **Chatten** ein, um mit Enter zu senden. Die Pfeiltasten wechseln erst dann zwischen Swipes, wenn du im selben Tab **Intuitive Swipe-Navigation** einschaltest.
- **Schnellantworten.** Hier sind das die Aktionen neben **Senden**, die du mit einem Klick ausführst (Impersonate, geführte Antworten). SillyTaverns Quick-Reply-Sets werden nicht importiert.

- **Drei Chat-Modi.** Marinara unterteilt Chats in **Conversation** (Nachrichten wie in einem Messenger), **Roleplay** (lange Szenen mit Erzähltext) und **Game** (ein Game Master leitet eine Welt mit Regeln). Bei jedem neuen Chat wählst du den Modus, und die Einrichtung zeigt nur, was dieser Modus verwendet.
- **Einen Chat starten.** Ein neuer Chat öffnet eine kurze Einrichtung. Speichere eine häufig verwendete Einrichtung als Einstellungsprofil. Dann geht es beim nächsten Mal in einem Schritt: **Profil verwenden**, dann **Anwenden & starten**. Markiere ein Profil mit einem Stern, um es zum Standard für neue Chats dieses Modus zu machen.
- **Die Suche findet alles.** **Ctrl+K** findet Chats, Charaktere, Einstellungen und Anleitungen, führt Befehle aus und beantwortet Fragen mit Professor Maris Hilfe.
- **Professor Mari.** Marinaras eingebaute Assistentin beantwortet Fragen zur App und kann Charaktere, Lorebooks und Agenten für dich erstellen. Öffne sie auf der Startseite.

## Verwandte Anleitungen

- [Aus SillyTavern importieren](importing-from-sillytavern.md)
- [Einstellungsprofile](../chats/settings-profiles.md)
- [Chat-Einstellungen](../chats/chat-settings.md)
