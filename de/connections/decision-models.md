# Decision-Modelle

Ein Decision-Modell ist ein kleines Modell, das Marinara kurze Fragen zu deinem Chat beantwortet, etwa „Verlegt die neueste Nachricht die Szene an einen neuen Ort?“ oder „Wie ist Kaelen gerade gestimmt: wütend, traurig oder ruhig?“. Manche können auch die Bilder und Clips im Chat ansehen. Lorebooks, eigene Agenten, Prompts, Gruppenchats und Illustrator nutzen es. Es ist optional. Ohne eines funktionieren Chats weiterhin, und jede Funktion nutzt das Ersatzverhalten, das unter [Wo Marinara es verwendet](#where-marinara-uses-it) beschrieben ist.

Seine Antworten steuern, was Marinara tut, und erscheinen nie im Chat. Die Fragearten und Beispiele findest du unter [Was ein Decision-Modell beantworten kann](#what-a-decision-model-can-answer).

Unser Rat: Lass es auf **None** (keines), wenn du unsicher bist. Willst du Decisions nutzen, nimm das eingebaute Modell, das du vielleicht schon hast, oder ein Chat-Modell auf einem Server, den du bereits betreibst. Beides kostet nichts extra.

## Was ein Decision-Modell beantworten kann

Jede Antwort kommt als Zahl von 0 bis 1 zurück: Sie gibt an, wie sicher sich das Modell ist. Marinara macht daraus die Antwort, die eine Funktion braucht.

### Ja oder nein

Das Modell liest eine Aussage und gibt an, wie wahrscheinlich sie wahr ist. Marinara vergleicht das mit einem [Schwellenwert](#thresholds): Ab diesem Wert zählt es als ja. Das ist die häufigste Frageart. Sie wird von Aktivierungsfragen, den **Entscheidung**-Feldern im Lorebook, `{{#if decision:"..."}}` und den Prüfungen des Illustrators genutzt.

| Aussage | Was sie steuern könnte |
| --- | --- |
| `In the latest message, the characters move to a different location` | Ein Tracker aktualisiert den Ort nur in Zügen, in denen er gewechselt hat. |
| `In the latest message, a dragon is physically present` | Ein Lorebook-Eintrag über Drachen kommt in den Prompt. |
| `{{user}} asked a question that {{char}} has not answered yet` | Eine Prompt-Zeile erinnert das Modell daran, sie zu beantworten. |
| `The latest message describes a fight` | Ein Kampfagent läuft nur in diesem Zug. |

### Eine von mehreren Antworten

Das Modell wählt die passendste Antwort aus einer kurzen Liste, die du schreibst. Marinara fragt nach jeder Option und behält die mit dem höchsten Wert. Du bekommst also eine Antwort, nicht mehrere. Verwende `{{#if decision_choice:"..." == "..."}}`:

```text
{{#if decision_choice:"Kaelen's mood in the latest message" == "angry"}}
Kaelen speaks in short, clipped sentences.
{{else if decision_choice:"Kaelen's mood in the latest message" == "sad"}}
Kaelen speaks quietly and avoids eye contact.
{{else if decision_choice:"Kaelen's mood in the latest message" == "calm"}}
Kaelen speaks normally.
{{/if}}
```

Weitere Listen, die gut funktionieren: die Art der Szene (`combat`, `dialogue`, `exploration`, `rest`), die Tageszeit (`morning`, `afternoon`, `evening`, `night`) oder der Raum eines Hauses, in dem die Szene spielt. Halte die Optionen klar unterscheidbar und ergänze eine wie `none of these`, wenn auch keine passen könnte. Agenten wählen auf dieselbe Weise eines von mehreren Anweisungssets, und Illustrator wählt damit die Art des Wetters.

### Ein Zahlenwert

Manche Funktionen nutzen die Zahl selbst statt eines Ja oder Nein. Die [Smart-Antwortreihenfolge](../chats/group-chats.md#response-order-individual-only) bewertet, wie wahrscheinlich jeder Charakter als Nächstes spricht, und wählt den höchsten Wert. [Advanced Memory](../agents/memory.md#optional-decision-model) bewertet, wie relevant jede frühere Szene ist. **Entscheidungen testen** in Peek Prompt zeigt den Wert jeder Aussage und hilft dir so, eine Schwelle zu wählen. Siehe [Entscheidungsaussagen testen](../chats/peek-prompt.md#testing-decision-statements).

### Bilder und Clips

Ein eingebautes Decision-Modell, das Bilder lesen kann, kann dieselben Fragearten zu den Bildern im Chat beantworten, etwa `The picture shows the character at the beach`. Liquid d1, Valen und Winnow lesen Bilder, die Vollversion von Valen auch kurze Clips. Andere Modelle und alle gehosteten Konten oder Serverkonten lesen nur Text und bekommen nie Bilder.

Bilder werden nur gesendet, wenn du sie anforderst, denn jedes verlangsamt die Antwort:

- Ergänze in einer Aussage `pictures:1` (bis zu 3) oder `clips:1`. Ergänze `media_within:2`, um nur dann zu fragen, wenn eine der neuesten 2 Nachrichten ein Bild enthält. Siehe [Bilder und Clips](../prompts/conditional-prompts.md#pictures-and-clips).
- Stell bei einem Lorebook-Eintrag **Show the decision model** unter seinem Feld **Entscheidung** ein. Siehe [Decision-Aktivierung](../lorebooks/entries.md#decision-activation).
- Stell bei der Aktivierungsfrage eines eigenen Agenten **Show the decision model** ein. Siehe [Aktivierungsfragen](../agents/custom-agents.md#activation-questions).
- Die eigenen Bildfunktionen von Marinara: siehe [Funktionen, die Bilder ansehen](#features-that-look-at-pictures).

### Was auf einer Modellseite steht

Die Seite jedes eingebauten Decision-Modells zeigt zwei Zeilen:

- **Answers** listet auf, wofür das Modell entwickelt wurde: **Yes/no**, **Weighted choice**, **Score on a scale** und bei manchen **Boxes on a picture** (wo etwas in einem Bild liegt). Marinara stellt Ja/Nein- und Auswahlfragen und liest ihre Werte. Nach Boxen fragt es noch nicht; diese Angabe beschreibt also nur das Modell.
- **Reads** listet **Text**, **Pictures** und **Video** auf. Eine Art, die nur eine andere Version des Modells lesen kann, wird nach den anderen genannt, etwa „Video in its full release“.

## Ein Decision-Modell auswählen

Lies vorher [Welche Möglichkeit passt?](#which-one-to-pick).

1. Öffne **Library → Connections** (Bibliothek → Verbindungen). Der Bereich **Defaults** (Standardwerte) steht oben.
2. Klick auf **Decision**. Eine Liste öffnet sich.
3. Wähle ein Modell. Die Liste hat drei Gruppen:
   - **None (decisions off)** ist der Standard. Es wird nichts gefragt, und die Felder für Aktivierungsfragen im Agenten-Editor bleiben deaktiviert.
   - **Built-in model** (eingebautes Modell) listet die Modelle, die Marinara auf deinem Rechner ausführt: **Built-in model**, **Built-in model (utility)** und **Built-in model (decisions)**. Nichts verlässt deinen Rechner.
   - **Connections** listet deine Konten, die Decisions beantworten können: gehostete oder ein Chat-Modell auf einem Server, den du bereits betreibst.

   Klick links auf ein Konto, um seine Modelle anzusehen. Ein Konto von NanoGPT, OpenRouter oder Google Gemini listet zuerst unter **Decision-Modelle** seine eigenen Decision-Modelle auf und darunter unter **Chat-Modelle** seine Chat-Modelle. Ein Google-Gemini-Konto zeigt nur seine Decision-Modelle, weil seine Chat-Modelle keine Decisions beantworten können. Ein zuvor gewähltes Decision-Modell erscheint über **Mit Stern markiert**, mit dem Kontonamen darunter.
4. Zum Testen klick in der Zeile auf das Zahnrad **Decision settings** (Decision-Einstellungen) und dann auf **Test**. Diese Schaltfläche erscheint bei den Einträgen des eingebauten Modells. Bei einem Decision-Modell von TypeSafe, OpenRouter, NanoGPT oder Google Gemini öffnest du **Edit model** (Modell bearbeiten) und klickst auf **Test provider** (Anbieter testen). Bei einem Konto vom Typ **Own decision server** (eigener Decision-Server) nutzt du **Test** im Menü **⋯** des Kontos.

Ein bestandener Test zeigt die Wahrscheinlichkeit für ja und wie lange die Antwort gedauert hat. Bei einem Modell auf deinem Rechner nennt er außerdem, ob Log-Wahrscheinlichkeiten verfügbar waren und ob das Modell direkt antwortet. Log-Wahrscheinlichkeiten sind die Zahlen, mit denen das Modell angibt, wie sicher es sich bei jedem Wort ist, das es schreiben könnte. Der Test sendet ein festes Beispiel, nicht deinen Chat.

Hat es nicht funktioniert, nennt die Meldung den Grund. Häufige Ursachen: Der Key wurde abgelehnt, der Dienst begrenzt Anfragen, das eingebaute Modell läuft nicht, oder die Antwort lag über dem Zeitlimit. Siehe [Fehlerbehebung](#troubleshooting).

Einträge, die gerade nicht antworten können, bleiben ausgegraut und mit Begründung in der Liste. Wählst du **None**, schaltest du Decisions aus, ohne eine Aktivierungsfrage oder Decision-Aussage zu löschen.

### Welche Möglichkeit passt?

- **Ein Modell, das bereits im eingebauten Modell läuft.** Kostet nichts extra. Am besten für die meisten, die das eingebaute Modell nutzen.
- **Ein Chat-Modell auf deinem eigenen Server** (Ollama, LM Studio, llama.cpp oder ein anderer OpenAI-kompatibler Server). Kostet nichts extra. Gut, wenn dein Modell außerhalb von Marinara läuft, damit es nicht doppelt geladen wird.
- **Ein gehostetes Decision-Modell** (TypeSafe, OpenRouter, NanoGPT oder Google Gemini). Wird pro Anfrage abgerechnet, und ein Zug kann mehrere auslösen. Ein NanoGPT-Abo enthält einige Decision-Modelle, und OpenRouter listet auch kostenlose Modelle auf. Gut für Handys und Rechner, auf denen kein lokales Modell läuft.
- **Das eingebaute Decision-Modell.** Ein eigens dafür entwickeltes Decision-Modell, das Marinara herunterlädt und neben deinem Chat-Modell ausführt, mit eigenem Platz auf der Festplatte und eigenem Arbeitsspeicher. Die meisten laufen auf fast jedem Rechner, manche allein auf dem Prozessor. Die einzige Möglichkeit, Bilder und Clips anzusehen. Siehe [Marinara ein Decision-Modell installieren lassen](#let-marinara-install-a-decision-model).

Läuft bei dir schon ein lokales Modell, probier es zuerst und teste Züge aus deinen eigenen Chats. Die Formulierung macht viel aus. Siehe [Aussagen formulieren](../prompts/conditional-prompts.md#writing-statements).

Jev und Open-Jev sind unterschiedliche Modelle. Jev ist das gehostete Modell von TypeSafe, direkt oder über OpenRouter verfügbar. [Open-Jev](https://huggingface.co/ZefanCai/Open-Jev-2B) ist ein separat veröffentlichtes Modell auf Qwen-Basis, das Marinara lokal ausführen kann. Die Tests mit Open-Jev messen nicht das gehostete Jev.

Unter Android (Termux) werden nur JevK5 und Liquid d1 als **Built-in decision model** angeboten, und der Prozessor eines Handys kann dafür zu langsam sein. Praktisch ist dort ein gehostetes Konto, etwa Jev über OpenRouter. Siehe [Ein Decision-Konto einrichten](#set-up-a-decision-account).

Schreib Presets, Karten und Agenten für „ein Decision-Modell“, niemals mit „benötigt Jev“. Eine Aussage, die Bilder anfordert, funktioniert auch mit einem Modell, das nur Text liest: Es bekommt allein den Text. Sie verwenden mit jedem Modell dieselbe Aussage-Syntax, aber Modelle können unterschiedlich antworten. Importierst du Inhalte, die Decisions nutzen, auch eigene Agenten und Installationen offizieller Agenten, zeigt Marinara einen Hinweis mit einem Link hierher. Beim Wiederherstellen eines vollständigen Profil-ZIP erscheint er nicht.

## Das eingebaute Modell verwenden

Hast du das eingebaute Modell heruntergeladen, kannst du es ohne Konto und ohne Kosten für Decisions verwenden. Siehe [Eingebautes Modell einrichten](local-model.md).

1. Klick auf der Connections-Seite im Bereich **Defaults** auf **Decision**.
2. Wähle **Built-in model** (oder **Built-in model (utility)**, falls du eines hast).
3. Klick auf das Zahnrad **Decision settings** und dann auf **Test**.

Marinara stellt dem Modell eine Ja/Nein-Frage, lässt es ein Token schreiben und liest die Antwort aus den Wahrscheinlichkeiten dieses Tokens. Es wird keine Chat-Antwort geschrieben, daher bleibt die Anfrage kurz. Eine Auswahl zwischen mehreren Antworten wird als eine Ja/Nein-Frage pro Antwort gestellt.

Die Einstellung **Thinking** (Nachdenken) legt fest, was passiert, wenn ein Modell nicht mit einem Wort antworten kann. Manche Modelle denken immer zuerst nach.

| Thinking | Was es bewirkt |
| --- | --- |
| **Auto (try one word, allow thinking if the model cannot)** | Standard. Nach zwei fehlgeschlagenen Ein-Wort-Antworten hintereinander darf das Modell zuerst nachdenken, und Marinara sagt dir Bescheid. |
| **Off (always answer in one word)** | Ein Modell, das nicht mit einem Wort antworten kann, liefert keine Antwort. |
| **Allowed (let the model think first)** | Bittet das Modell nie, das Nachdenken zu überspringen. |

Ein Modell, das zuerst nachdenkt, braucht Sekunden. Deshalb antwortet es standardmäßig nur bei Prüfungen, die laufen, nachdem die Antwort auf dem Bildschirm steht, etwa für nachverarbeitende Agenten. Soll es auch über Agenten entscheiden, die vor der Antwort laufen, schalte **Also gate agents that run before the reply** (auch Agenten vor der Antwort prüfen) ein. Dann wartet jede Antwort darauf.

Die Ja/Nein-Wahrscheinlichkeiten eines allgemeinen Chat-Modells taugen für eine Schwelle, wurden aber nicht darauf trainiert, so kalibriert zu sein wie die eines eigens dafür entwickelten Decision-Modells. Eine Laufzeit, die keine Log-Wahrscheinlichkeiten liefert, antwortet schlicht mit 1 oder 0. Stimm die Schwellen anhand deiner eigenen Chats ab.

### Auf einem bereits laufenden Server

Läuft dein Chat-Modell in Ollama, LM Studio, llama.cpp oder einem anderen OpenAI-kompatiblen Server, kann es Decisions beantworten, ohne dass Marinara eine zweite Kopie lädt.

1. Öffne **Library → Connections**, klick auf **Add connection** (Verbindung hinzufügen), öffne den Tab **Entscheidung** und wähle **Own decision server** (eigener Decision-Server). Gib dieselbe Adresse und denselben Key ein, die dein Chat-Modell verwendet. (Im klassischen Layout findest du am Modell unter **⋯** die Option **Use this model for decisions** (dieses Modell für Entscheidungen verwenden), die diese Angaben einträgt.)
2. Wähle das Modell und klick dann auf **Test decision** (Entscheidung testen). Ein bestandener Test nennt, ob der Server Log-Wahrscheinlichkeiten geliefert hat und ob das Modell zuerst nachdenken musste. Klick auf **Done** (Fertig).
3. Klick im Bereich **Defaults** auf **Decision** und wähle das neue Modell.

Du kannst es auch selbst anlegen. Nimm ein Decision-Konto mit der Quelle **OpenAI-compatible chat model (Ollama, LM Studio, llama.cpp)**, derselben Adresse wie dein Chat-Konto (zum Beispiel `http://localhost:11434/v1` für Ollama) und dem Modellnamen, den der Server verwendet.

Es wird gefragt wie das eingebaute Modell: ein Ja/Nein-Wort pro Aussage. Aussagen gehen einzeln hinaus, weil Marinara nicht wissen kann, wie viele Anfragen dein Server gleichzeitig bearbeitet. **Thinking** ist für ein Konto immer **Auto**. Ein Server auf einem anderen Rechner braucht `PROVIDER_LOCAL_URLS_ENABLED`. Siehe [Ein lokales oder selbst gehostetes Modell verbinden](local-self-hosted.md).

## Ein Decision-Konto einrichten

Ein gehostetes Decision-Konto sendet die ausgewählten jüngsten Nachrichten und Aussagen an den Dienst und kann Geld kosten. Die Smart-Antwortreihenfolge sendet zusätzlich eine [Charakterliste](#what-the-model-sees).

1. Öffne **Library → Connections** und klick auf **Add connection**.
2. Klick im Tab **Entscheidung** auf **TypeSafe** oder **Eigener Entscheidungsserver**. Für NanoGPT siehe [Über NanoGPT](#through-nanogpt). Für OpenRouter oder Google Gemini siehe [Über OpenRouter oder Google Gemini](#through-openrouter-or-google-gemini).
3. Gib den **API key** ein oder bei **Own decision server** die **Server address** (Serveradresse). Klick auf **Connect** (Verbinden). Das Fenster schließt sich, und die Connections-Seite zeigt das neue Konto.
4. Klick im Bereich **Defaults** auf **Decision** und wähle das neue Modell.
5. Zum Testen klick auf der Connections-Seite auf das Modell, um **Edit model** zu öffnen, und dann in der Karte **Provider tests** (Anbietertests) auf **Test provider**. Ein Modell vom Typ **Own decision server** hat dort keine Schaltfläche **Test provider**. Klick stattdessen am Konto auf **⋯**, wähl **Edit account** (Konto bearbeiten) und klick auf **Test account** (Konto testen).

Ein bestandener **Test provider** zeigt die Wahrscheinlichkeit, wie lange die Antwort gedauert hat, und das Zeitlimit des Kontos. **Test account** sagt nur, ob es funktioniert hat und wie lange es gedauert hat. Der Test wartet mindestens 10 Sekunden oder 5 Sekunden über ein längeres Limit hinaus. Hat die Antwort länger als das Limit gedauert, steht das im Ergebnis: Im Chat würde diese Antwort als keine Antwort zählen.

Hat es nicht funktioniert, sieh unter [Fehlerbehebung](#troubleshooting) nach.

Ein Decision-Modell hat diese Felder. Klick im Panel auf das Modell, um **Modell bearbeiten** zu öffnen, oder im Bereich **Standardwerte** auf das Zahnrad in der Zeile **Decision**, um **Decision settings** für das aktuelle Decision-Modell zu öffnen:

| Feld | Was es bewirkt |
| --- | --- |
| **Decision source** (Decision-Quelle) | **TypeSafe**, **OpenRouter**, **NanoGPT**, **Google Gemini**, **Custom System One endpoint** (eigener System-One-Endpunkt) oder **OpenAI-compatible chat model (Ollama, LM Studio, llama.cpp)**. Sie wird beim Anlegen des Modells festgelegt. |
| **API key source** (API-Key-Quelle) | **Enter a separate key (optional for local servers)** oder **Use key from …** (Key von … verwenden) mit einem anderen Konto. Verknüpfte Keys folgen späteren Änderungen am Key. Ein Modell mit eigenem System-One-Endpunkt oder ein OpenAI-kompatibles Modell kann den Key eines eigenen Chat-Kontos nur ausleihen, wenn beide Adressen dasselbe Schema, denselben Host und denselben Port haben. |
| **Recent-message token budget** (Token-Budget der jüngsten Nachrichten) | Wie viele geschätzte Tokens aus dem Chat gesendet werden. 1 bis 30.000. Standard 30.000 bei TypeSafe, OpenRouter, NanoGPT und Google Gemini und 3.500 bei eigenen Servern. Ein Decision-Modell eines NanoGPT-, OpenRouter- oder Google-Gemini-Kontos mit kleinerem Eingabelimit bekommt stattdessen drei Viertel dieses Limits. Marinara entfernt zuerst ältere Nachrichten und kürzt dann den ältesten Teil der neuesten Nachricht. Eine abgelehnte oder das Budget überschreitende Anfrage liefert keine Antwort. |
| **Time limit (seconds)** | Wie lange während eines Chats auf jede Aussage gewartet wird. 0,5 bis 30. Standard 1,5 oder 4 bei NanoGPT und bei einem OpenAI-kompatiblen Chat-Modell. Siehe [Zeitlimits](#time-limits). |
| **Eigene Anfrage-Header** | Zusätzliche Header, die mit jeder Decision-Anfrage gesendet werden, als JSON-Objekt, etwa `{"x-billing-mode": "paygo"}`. Nicht für Keys gedacht: Authentifizierungs-Header werden abgelehnt. |

TypeSafe sendet an `https://api.typesafe.ai`. Du kannst die **Base URL** durch einen anderen Server ersetzen, der die API von TypeSafe bereitstellt, ohne `/v1/systemone`. Er braucht trotzdem deinen TypeSafe-Key, der an diesen Server geht. **Custom System One endpoint** nimmt einen System-One-Server an, den du betreibst, etwa Open-Jev oder [Strands decider](#run-strands-decider-yourself). Gib seine Adresse ohne `/v1/systemone` ein. Ein Server für Chat-Modelle wie Ollama spricht kein System One. Nimm dafür **OpenAI-compatible chat model**.

### Über NanoGPT

NanoGPT listet eigene Decision-Modelle wie Jev Latest auf und beantwortet sie über seine Decisions API mit deinem NanoGPT-Key. Manche sind im NanoGPT-Abo enthalten, die übrigen werden vom Guthaben abgerechnet.

1. Verbinde NanoGPT wie gewohnt. Unter **Hinzufügen** listet auch der Typ-Chip **Entscheidung** den Anbieter auf.
2. Hake unter **In NanoGPT gefunden – verwenden für:** die Option **Entscheidung** an. Marinara wählt ein Decision-Modell, das in deinem Tarif enthalten ist, vorzugsweise Jev Latest.
3. Um ein anderes zu wählen, klick am NanoGPT-Konto auf **⋯**, dann auf **Modell hinzufügen** und den Tab **Entscheidung**. Dort stehen nur Decision-Modelle. Eine Markierung **Tarif** kennzeichnet die Modelle in deinem Abo. Wähl eines und klick auf **Entscheidung testen**.

Decision-Modelle erscheinen in keiner Chat-Modellliste, weil sie nicht chatten können.

Standardmäßig entscheidet NanoGPT, ob eine Anfrage dein Abo oder dein Guthaben nutzt. Soll immer das Guthaben verwendet werden, öffne am Decision-Modell **Modell bearbeiten** und trag unter **Eigene Anfrage-Header** `{"x-billing-mode": "paygo"}` ein.

### Über OpenRouter oder Google Gemini

Auch Konten von OpenRouter und Google Gemini listen eigene Decision-Modelle auf. Marinara fragt sie mit dem Key des Kontos über die Decision-API des Dienstes. OpenRouter listet viele Modelle auf, darunter kostenlose (ihre Namen enden auf `:free`). Google Gemini listet eines auf: **Gemini Decision 1**.

1. Verbinde OpenRouter oder Google Gemini wie gewohnt.
2. Klick im Bereich **Aufgaben** unter **Hinter den Kulissen** auf die Zeile **Entscheidung** und dann links auf das Konto. Wähl unter **Decision-Modelle** ein Modell.
3. Öffne zum Testen **Modell bearbeiten** und klick auf **Anbieter testen**.

Bei einem OpenRouter-Konto folgen unter **Chat-Modelle** die Chat-Modelle, die Log-Wahrscheinlichkeiten zurückgeben; auch sie funktionieren. Ein Google-Gemini-Konto bietet nur sein Decision-Modell an.

Ein vor dieser Version hinzugefügtes Konto zeigt anfangs möglicherweise keine **Decision-Modelle**, weil seine gespeicherte Modellliste älter ist. Klick auf die Aktualisieren-Schaltfläche in der Auswahl oder warte: Marinara aktualisiert gespeicherte Modelllisten einmal täglich.

Ein eigenständiges **OpenRouter**-Decision-Konto, das du unter **Hinzufügen** angelegt hast, funktioniert weiterhin. Es fragt dieselbe API mit seinem eigenen Key.

Manche gehosteten Dienste antworten zeitweise langsamer als 1,5 Sekunden; dann wirken Decisions zufällig kaputt. Teste mehrmals und setz das Limit über die langsamste Antwort. Aussagen, die vor der Antwort gefragt werden, etwa die Decisions eines Presets oder die Aktivierungsfrage eines Agenten, der vor der Antwort läuft, können die Antwort jeweils bis zu dieser Dauer aufhalten.

Löschst du ein Konto, dessen Key für Decisions verwendet wird, erscheint eine Warnung. Das Decision-Konto muss danach neu verknüpft werden; bis dahin liefern Decisions keine Antwort. Importierte Verbindungsdateien enthalten nie API-Keys oder Verknüpfungen zu ausgeliehenen Konten, stell sie also von Hand wieder her.

## Wo Marinara es verwendet

- [Aktivierungsfragen](../agents/custom-agents.md#activation-questions) entscheiden, ob ein eigener Agent läuft. Ohne Antwort: Die Frage hält ihn nicht auf. Schlüsselwörter und **Trigger Cadence** (Ausführungstakt) gelten weiterhin.
- [Prompt-Aussagen](../prompts/conditional-prompts.md#asking-the-decision-model) wählen Text aus, wenn ein Chat- oder Agenten-Prompt zusammengesetzt wird. Ohne Antwort: Die Decision gilt als nein, ein Decision-Block nutzt also seinen `{{else}}`-Zweig, falls es einen gibt.
- [Decision-Felder im Lorebook](../lorebooks/entries.md#decision-activation) prüfen Require oder Trigger beim Lorebook-Scan. Ohne Antwort: Require kann keinen neuen Eintrag zulassen, und Trigger ergänzt keinen Aktivierungsweg. Sticky-Haltezeiten und gewöhnliche Trigger-Aktivierungswege gelten weiterhin.
- Die [Smart-Antwortreihenfolge](../chats/group-chats.md#response-order-individual-only) bewertet, wenn sie eingeschaltet ist, wer in einem Gruppenchat als Nächstes spricht. Ohne Antwort: Die Smart-Reihenfolge macht ihren gewöhnlichen KI-Aufruf.
- [Aktive Charaktere automatisieren](../chats/group-chats.md#automate-active-characters-merged-only) fragt vor jeder Antwort in einer Merged-Roleplay-Gruppe, wer in der Szene ist, wenn die Option auf **Decision model** (Entscheidungsmodell) steht. Ohne Antwort: Bekommt kein Charakter eine Antwort, nutzt es die letzte Szene des Character Trackers oder behält die Liste bei.
- [Decision-Modell-Prüfungen von Illustrator](../media/scene-backgrounds.md#check-every-reply-with-a-decision-model) prüfen jede Roleplay-Antwort auf einen neuen Ort oder neues Wetter, wenn sie in den Illustrator-Einstellungen des Chats eingeschaltet sind. Ohne Antwort: Hintergründe ändern sich wie bisher nur dann, wenn Illustrator oder World State es anfordern.
- [Advanced Memory Recall](../agents/memory.md#optional-decision-model) kann für Szenengrenzen in Roleplay und die Auswahl von Erinnerungen ein eigenes Decision-Modell nutzen. Schalte **Use Decision model** (Entscheidungsmodell verwenden) in den Advanced-Memory-Einstellungen dieses Chats ein. Ohne Antwort: Fehlgeschlagene Decisions fallen auf den normalen Abruf oder die normale Szenenprüfung zurück. Zusammenfassungen nutzen weiterhin das Hilfsmodell.

- [Funktionen, die Bilder ansehen](#features-that-look-at-pictures), prüfen neue Bilder, überspringen Wiederholungen, verwenden Hintergründe erneut und markieren Sprite-Gesichter, wenn sie eingeschaltet sind. Sie brauchen ein Decision-Modell, das Bilder lesen kann.

Eine Aktivierungsfrage entscheidet, ob ein Agent läuft. Eine Decision-Aussage in seinem Prompt entscheidet, was dieser laufende Agent gesagt bekommt. Verwende `{{#if decision:"..."}}` für Ja/Nein-Bedingungen und `{{#if decision_choice:"..." == "..."}}` für die Wahl zwischen mehreren Antworten.

### Funktionen, die Bilder ansehen

Diese Funktionen brauchen ein eingebautes Decision-Modell, das Bilder lesen kann (Liquid d1, Valen oder Winnow). Sie sind alle aus, bis du sie einschaltest. Ohne ein solches Modell sind sie ausgegraut; ein ⓘ erklärt den Grund. Eine zuvor eingeschaltete Funktion kannst du weiterhin ausschalten.

| Funktion | Wo | Was sie bewirkt |
| --- | --- | --- |
| **Picture check** | **Chat-Einstellungen → Agenten → Illustrator** | Sieht sich jedes neue Illustrator-Bild, jede Wetterversion und jedes Selfie an und prüft, ob es das Gewünschte zeigt. Ein Selfie wird auch mit dem Avatar des Charakters verglichen. **Make another if it doesn't match** zeichnet bei einem Fehlschlag noch einmal. **Always make two, keep the better** zeichnet zwei Bilder und behält das, das besser passt. Jedes zusätzliche Bild kostet eine weitere Bildgenerierung. |
| **Also check** | Unter **Picture check** | Deine eigenen Prüfungen, eine pro Zeile, höchstens 6, etwa `Kaelen has short red hair`. Beginne eine Zeile mit `not:`, wenn das Bild etwas nicht zeigen darf, etwa `not: The picture has writing or a watermark`. |
| **Skip a picture the newest one already shows** | Illustrator-Karte | Vergleicht vor dem Zeichnen das neueste Bild im Chat mit dem geplanten Bild und überspringt es, wenn es dieselbe Szene noch einmal zeigen würde. Bilder, die du anforderst, werden immer erstellt. |
| **Reuse a library background that looks like the place** | Illustrator-Karte | Ist kein Hintergrund in deiner Bibliothek nach einem neuen Ort benannt, sieht es sich bis zu 4 an, deren Namen Wörter mit ihm gemeinsam haben, und zeigt einen passenden an, statt einen neuen zu malen. Siehe [Vorhandene Bilder wiederverwenden](../media/scene-backgrounds.md#reusing-pictures-you-already-have). |
| **Flag faces that don't match their expression** | Fenster **Sprites generieren**, nur Gesichtsausdrücke | Sieht sich jedes Gesicht nach dem Zeichnen an und markiert solche, die ihren Gesichtsausdruck möglicherweise nicht zeigen. Du kannst sie dann abwählen oder neu zeichnen lassen. Siehe [Sprites mit KI generieren](../characters/sprites.md#generate-sprites-with-ai). |

Eine Prüfung, die nicht ausgeführt werden kann, weil das Modell aus oder zu langsam ist oder fehlschlägt, gilt als bestanden: Das Bild bleibt so erhalten, wie es erstellt wurde.

## Was das Modell sieht

Bei Aktivierungsfragen und Aussagen in Prompts und Lorebooks bekommt das Modell die Aussage und die jüngsten Nachrichten so, wie sie im Chat gespeichert sind. Es bekommt weder dein Preset noch die Charakterkarte, die Persona, Lorebook-Einträge (auch keine Constant-Einträge), Zusammenfassungen oder Agentenausgaben. Text, der zwischen Nachrichten eingefügt wird, etwa ein Eintrag auf **@ Depth**, bleibt ebenfalls außen vor. Hängt eine Aussage von etwas davon ab, muss sie die Tatsache selbst nennen.

- Aussagen in Prompts und Lorebooks, die Smart-Antwortreihenfolge und Aktive Charaktere automatisieren lesen die letzten 5 Nachrichten. Diese Zahl ist fest.
- Aktivierungsfragen lesen die **Scan Depth** (Scan-Tiefe) des Agenten, standardmäßig 5.
- Jede Nachricht trägt den Namen ihres Sprechers. Vor der KI verborgene Nachrichten werden ausgelassen.
- Eine Prüfung, die nach der Antwort läuft, etwa die Frage eines nachverarbeitenden Agenten, sieht auch die geschriebene Antwort.
- Makros in der Aussage werden zuerst ausgefüllt; `{{char}}` kommt also als Name des Charakters an.
- Passen die Nachrichten nicht in das Budget des Modells, werden zuerst ältere Nachrichten weggelassen.

**Smart response order** (Smart-Antwortreihenfolge) sendet zusätzlich eine Charakterliste: Name, Status, Aktivität und Gesprächigkeit jedes Kandidaten, soweit bekannt, dazu bis zu 300 Zeichen Persönlichkeit oder, wenn diese leer ist, Beschreibung.

**Automate active characters** (Aktive Charaktere automatisieren) sendet ebenfalls eine Charakterliste: den Namen jedes Charakters und bis zu 300 Zeichen Beschreibung oder, wenn diese leer ist, Persönlichkeit, gekürzt auf 100 Zeichen oder auf reine Namen, wenn eine große Besetzung nicht hineinpasst, dazu die Namen, die der Character Tracker zuletzt gesehen hat. Lassen selbst reine Namen zu wenig Platz für die Nachrichten, wird das Modell nicht gefragt, und der Character Tracker springt ein. Antworten in einer Merged-Gruppe sind mit „the narrator“ gekennzeichnet, weil eine Antwort für alle spricht.

Ein gehosteter Decision-Dienst erhält diese Charakterlisten zusätzlich zu den Nachrichten.

**Advanced Memory** nutzt ein eigenes Decision-Modell pro Chat und nicht die Regel der letzten 5 Nachrichten. Szenenprüfungen lesen das betreffende Transkriptfenster. Der Abruf sendet aktuellen Gesprächstext und bis zu 24 vorausgewählte archivierte Zusammenfassungen – mehr, wenn **Maximum recalled scenes** (maximal abgerufene Szenen) höher ist –, danach Originalnachrichten aus den Szenen, die das Modell gewählt hat, nachdem der Charakterzugriff geprüft wurde. Gehostete Dienste erhalten diese Texte, manchmal in mehreren Paketen. Jeder Abrufdurchgang bekommt normalerweise 10 bis 25 Sekunden, je nach Geschwindigkeit des Modells. Beide Durchgänge teilen sich 40 Sekunden pro Antwort, sodass ein Durchgang auch weniger als 10 Sekunden bekommen kann. Erinnerungen ohne rechtzeitige Antwort fallen auf den normalen Abruf zurück. Siehe [Optionales Decision-Modell](../agents/memory.md#optional-decision-model).

## Schwellenwerte

Wahrscheinlichkeiten lassen sich zwischen Modellen nicht vergleichen. Dasselbe Beispiel kann bei einem Modell 0,99 erreichen und bei einem anderen 0,2. Die Standardschwelle für ja oder nein hängt vom Modell ab:

- **Eingebautes Modell oder ein Konto für ein OpenAI-kompatibles Chat-Modell:** 0,5
- **Konto für TypeSafe, OpenRouter, NanoGPT, Google Gemini oder Custom System One:** 0,5
- **Eingebautes Decision-Modell:** die eigene Empfehlung des Modells, soweit möglich an Roleplay-Zügen gemessen: 0,3 für JevK5, Liquid d1 und Valen-Decision 1.5 4B; 0,5 für die Vollversion von Valen und Winnow (noch nicht gemessen); 0,1 für Open-Jev 2B und 9B

**Run when probability is at least** (ab dieser Wahrscheinlichkeit ausführen) eines Agenten überschreibt diesen Wert. Weicht der gespeicherte Wert ab, bietet der Editor an, die Empfehlung des Modells wiederherzustellen. Prüf ihn bei jedem Modellwechsel. Prompt-Aussagen und Decision-Felder im Lorebook nutzen den Standard des Modells; die Schwelle eines Agenten ändert ihren nicht.

Ein selbst gehostetes Open-Jev hinter einem Custom-System-One-Konto nutzt weiterhin 0,5, weil Marinara beliebige eigene Endpunkte nicht kalibrieren kann. Seine Ergebnisse können vom eingebauten Open-Jev abweichen; unter anderem gilt ein positives Ergebnis unter 0,5 dann als nein.

## Zeitlimits

Eine Decision, die nicht rechtzeitig ankommt, liefert keine Antwort, und die Generierung läuft mit dem Ersatzverhalten der Funktion weiter (siehe [Wo Marinara es verwendet](#where-marinara-uses-it)). Jedes Limit gilt pro Aussage. Eine Anfrage mit mehreren Aussagen bekommt das Limit für jede davon, und jede Choice-Antwort zählt als eine Aussage. Ein lokales Modell bearbeitet nur wenige Anfragen gleichzeitig. Aussagen warten deshalb, bis sie an der Reihe sind, und die Zeit einer Aussage beginnt, wenn das Modell mit ihr anfängt.

- **Konto für TypeSafe, OpenRouter, Google Gemini oder Custom System One:** 1,5 Sekunden oder dein **Time limit**. Bei Messungen antworteten OpenRouter und Google Gemini in 0,2 bis 0,5 Sekunden.
- **NanoGPT-Decision-Modell:** 4 Sekunden oder dein **Zeitlimit (Sekunden)**. Bei Messungen antwortete es in 0,4 bis 2,5 Sekunden.
- **Konto für ein OpenAI-kompatibles Chat-Modell:** 4 Sekunden oder dein **Time limit**. Ein Modell, das zuerst nachdenken muss, bekommt mindestens 20 Sekunden.
- **Eingebautes Modell:** 4 Sekunden. Ein Modell, das zuerst nachdenken muss, bekommt 20 Sekunden.
- **Eingebautes Decision-Modell:** Open-Jev bekommt 4 Sekunden für die erste Aussage und für jede weitere seine gemessene Zeit: 0,35 Sekunden bei 2B und 0,8 Sekunden bei 9B. Die anderen Modelle messen bei jedem Start ihre Lesegeschwindigkeit und richten ihre Limits danach aus; ein langsamer Prozessor bekommt also mehr Zeit. Jedes von einer Aussage angeforderte Bild und jeder Clip gibt zusätzliche Zeit. Bis das Modell einmal gestartet wurde, bekommt es 4 Sekunden pro Aussage, 30 Sekunden pro Bild und 60 pro Clip.

Decision-Anfragen enden, wenn du eine Generierung abbrichst.

## Weitere Einstellungen

Diese findest du hinter dem Zahnrad **Decision settings**:

- **Also use it to pick who speaks in Smart response order** (auch die Sprecherwahl bei Smart-Reihenfolge übernehmen) ist standardmäßig aus. Siehe [Gruppenchats](../chats/group-chats.md#response-order-individual-only).
- **Decision statements per turn** (Decision-Aussagen pro Zug) begrenzt die Planung von Prompt- und Lorebook-Aussagen. Standard 32, höchstens 255. Das Aussagenkontingent gilt in mehreren Phasen und ist keine einzelne Obergrenze für alle Anfragen oder Kosten eines Zuges. Aktivierungsfragen von Agenten und die Smart-Antwortreihenfolge sind davon getrennt. Siehe [Grenzen und Kosten](../prompts/conditional-prompts.md#limits-and-cost).
- **Also gate agents that run before the reply** und **Thinking** erscheinen bei den Einträgen des eingebauten Modells, die nachdenken können. Das **Built-in decision model** denkt nie nach und hat deshalb keine der beiden Optionen.

## Falsche Antworten einplanen

Jedes Modell kann falsch antworten, und richtige Ja-Antworten können knapp an der Schwelle liegen.

- Nutze eine Decision zur Feinabstimmung einer Antwort, niemals für etwas, auf das der Chat nicht verzichten kann. Eine verpasste Decision soll eine Antwort weniger passgenau machen, sie aber nicht kaputt machen.
- Mach Einverständnis, Inhaltshinweise oder Sicherheitsanweisungen nicht von einer Decision abhängig.
- Setz bei einem Agenten, der nur über eine Aktivierungsfrage läuft, **Bypass the question after this many messages** (Frage nach dieser Anzahl Nachrichten umgehen), damit ein Modell, das immer wieder nein antwortet, ihn nicht für immer stilllegt.

## Fehlerbehebung

- **Der Test schlägt fehl.** Die Meldung nennt den Grund: Der Key wurde abgelehnt, der Dienst begrenzt Anfragen, das eingebaute Modell läuft nicht, das Decision-Modell ist nicht installiert, das Modell hat nicht mit ja oder nein geantwortet, oder die Zeit ist abgelaufen.
- **Ein Konto zeigt in der Auswahl keine Decision-Modelle.** Seine gespeicherte Modellliste ist älter als seine Decision-Modelle. Klick in der Auswahl auf die Aktualisieren-Schaltfläche neben dem Kontonamen.
- **Der Server hat keinen solchen Endpunkt.** Die Decision-Quelle passt nicht zum Server. Ollama, LM Studio und andere Server für Chat-Modelle brauchen **OpenAI-compatible chat model**. **Custom System One endpoint** ist nur für System-One-Server wie Open-Jev gedacht.
- **Die Antwort lag über dem Zeitlimit, oder Decisions funktionieren nur manchmal.** Der Dienst ist zeitweise langsamer als das **Time limit**. Teste mehrmals und erhöh das Limit über die langsamste Antwort.
- **Ein Agent mit Aktivierungsfrage läuft jeden Zug.** Es ist kein Decision-Modell festgelegt, oder es antwortet nicht; der Agent läuft deshalb, als hätte er keine Frage. Führ einen Test durch.
- **Ein Decision-Zweig in einem Prompt erscheint nie.** Siehe [Wenn ein Decision-Zweig nie erscheint](../prompts/conditional-prompts.md#when-a-decision-branch-never-appears).
- **Die Smart-Antwortreihenfolge macht weiterhin ihren gewöhnlichen KI-Aufruf.** Der Schalter ist aus, oder das Decision-Modell hat in diesem Zug nicht geantwortet.
- **Bildeinstellungen sind mit einem ⓘ ausgegraut.** Das gewählte Decision-Modell liest nur Text, oder es ist keines festgelegt. Wähl Liquid d1, Valen oder Winnow als **Built-in decision model**. Siehe [Welches eingebaute Decision-Modell?](#which-built-in-decision-model).
- **Eine Aussage mit `pictures:` gilt als nein.** Mit `media_within:` enthielt keine der neuesten Nachrichten ein Bild. Andernfalls hat das Bild die Antwort über ihr Zeitlimit hinaus verlangsamt. Die Zeile **On this computer** auf der Modellseite zeigt, wie lange ein Bild braucht.
- **Ein Modell meldet, dass es hier nicht laufen kann.** Die Begründung unter der Liste nennt, was fehlt, etwa eine Prozessorfunktion, eine Grafikkartengeneration oder eine Bibliothek. Wähl ein anderes Modell; Liquid d1 und JevK5 laufen auf fast jedem Rechner.
- **Aktive Charaktere automatisieren folgt dem Character Tracker.** Das Modell hat nicht für jeden Charakter geantwortet, es denkt zuerst nach und **Also gate agents that run before the reply** ist aus, oder die Besetzung ist selbst mit reinen Namen zu groß für die Eingabe des Modells.

Um Decision-Werte und -Ausgaben während der Generierung zu sehen, schalte Debug Mode ein oder setz das Log-Level auf debug. Siehe [Log-Stufen](../CONFIGURATION.md#logging-levels). Um eigene Aussagen zu testen, ohne eine Antwort zu generieren, öffne **Peek Prompt → Decision diagnostics → Test decisions** (Peek Prompt → Entscheidungsdiagnose → Entscheidungen testen). Ausdrückliche Tests rufen das gewählte Modell auf und können bei einem gehosteten Dienst Geld kosten. Siehe [Entscheidungsaussagen testen](../chats/peek-prompt.md#testing-decision-statements).

## Marinara ein Decision-Modell installieren lassen

Das **Built-in decision model** ist ein eigens dafür entwickeltes Decision-Modell, das Marinara herunterlädt und auf deinem Rechner neben deinem Chat-Modell ausführt. Nichts verlässt deinen Rechner. Sein Speicherbedarf kommt zu dem deines Chat-Modells hinzu. Läuft bei dir schon ein lokales Modell, probier zuerst dessen Decisions.

### Welches eingebaute Decision-Modell?

| Modell | Download | Liest | Sprachen | Läuft auf |
| --- | --- | --- | --- | --- |
| **JevK5 4B** | Etwa 2,7 GB | Text | Englisch | Fast jedem Rechner: mit NVIDIA-, AMD-, Intel- oder Apple-Grafik oder allein auf dem Prozessor. Nutzt dieselbe Laufzeit wie das eingebaute Modell. |
| **JevK5 2B** | Etwa 2 GB | Text | Englisch | Wie 4B. Schneller auf einem Prozessor oder einer kleinen Grafikkarte, etwas weniger genau. |
| **Liquid d1 3B** | Etwa 2,3 GB | Text, Bilder | 16, darunter Japanisch, Chinesisch, Koreanisch, Deutsch, Spanisch und Russisch | Fast jedem Rechner. Die passende Wahl für Chats, die nicht auf Englisch sind. Kostenlos für Privatpersonen und Unternehmen mit weniger als 10 Millionen US-Dollar Jahresumsatz. |
| **Valen-Decision 1.5 4B** | Etwa 5,8 GB | Text, Bilder | 8 geprüft | Linux auf einem 64-Bit-Prozessor von Intel oder AMD, nur auf dem Prozessor. |
| **Valen-Decision 1.5 2B (Vollversion)** | Etwa 6,4 GB | Text, Bilder, Clips | Nicht angegeben | Windows, macOS mit Apple Silicon und Linux, auf dem Prozessor. Braucht etwa 6 GB Arbeitsspeicher. |
| **Valen-Decision 1.5 4B (Vollversion)** | Etwa 11,8 GB | Text, Bilder, Clips | 8 geprüft | Wie 2B. Braucht etwa 12 GB Arbeitsspeicher und ist langsamer, aber genauer. |
| **Winnow E4B** | Etwa 9 GB | Text, Bilder | Nicht angegeben | Nur Linux mit einer NVIDIA-Karte der RTX-50-Serie, den CUDA-13-Bibliotheken und einem Prozessor mit AVX-512 (etwa AMD Ryzen 7000 oder 9000; aktuelle Intel-Chips für Laptops und Desktop-Rechner haben es nicht). Braucht etwa 11 GB Grafikspeicher. |
| **Open-Jev 2B** | Etwa 4,6 GB | Text | Englisch | Linux mit einer NVIDIA-Karte ab der RTX-20-Serie und Treiber 580 oder neuer. Nutzt etwa 4,8 GB Grafikspeicher und 10 GB auf der Festplatte. |
| **Open-Jev 9B** | Etwa 19,4 GB | Text | Englisch | Wie 2B. Nutzt etwa 23,6 GB Grafikspeicher; auf einer Karte mit 24 GB passt also nichts anderes daneben. |

Bei 20 Roleplay-Zügen in 8 Sprachen beantworteten JevK5 4B, Liquid d1 und Valen-Decision 1.5 4B alle 20 richtig. Wähl Liquid d1, wenn du unsicher bist, oder die Vollversion von Valen, wenn du Clips lesen lassen möchtest.

Bevor etwas heruntergeladen wird, prüft Marinara, ob dein Rechner das Modell ausführen kann: das System, die Prozessorfunktionen, die Grafikkarte mit ihren Bibliotheken und den freien Arbeitsspeicher. Ein Modell, das nicht laufen kann, bleibt mit **(cannot run here)** in der Liste und nennt den Grund.

### Ein Modell installieren

1. Öffne **Bibliothek → Verbindungen**. Klick unter **Auf diesem Gerät** auf **Built-in model (decisions)**. Du erreichst es auch über **Neue Verbindung → Integriertes Modell**.
2. Wähl ein Modell in der Liste **Modell**. Darunter siehst du seine Beschreibung, dann **Answers** und **Reads** (siehe [Was auf einer Modellseite steht](#what-a-model-page-lists)), seine Sprachen und Lizenzen.
3. Klick auf **Herunterladen** mit dem Namen und der Größe des Modells. Bestätige Größe, Hardwareeinschätzung und Lizenzen. Vorher wird nichts heruntergeladen.
4. Klick auf **Für Entscheidung verwenden** oder wähle **Built-in model (decisions)** in der Zeile **Decision** im Kasten **Standardwerte**.

Sobald ein Modell gelaufen ist, zeigt seine Seite auch **On this computer** mit den dort gemessenen Zeiten: für ein paar Chat-Züge, ein Bild und bei Modellen, die sie lesen können, einen Clip. Diese Zeiten stammen von deinem eigenen Rechner und zeigen dir deshalb, wie viel langsamer eine Aussage wird, wenn sie ein Bild anfordert.

Zum Wechseln wählst du ein anderes Modell in der Liste. Ein zuvor heruntergeladenes Modell ist mit **(downloaded)** markiert, und **Use this model** wechselt ohne erneuten Download dorthin.

Weitere Bedienelemente auf der Seite:

- **Ausschalten** stoppt das Modell und behält seine Dateien. **Einschalten** startet es wieder.
- **Läuft auf** wählt auf einem Rechner mit mehreren NVIDIA-Karten die Karte. Ein Wechsel stoppt das Modell, das dann auf der neuen Karte neu startet.
- **Startet** steht standardmäßig auf **Wenn ein Agent es zum ersten Mal braucht**, alternativ auf **Mit Marinara**.
- **Aus einem Repository installieren** nimmt ein Decision-Modell auf Hugging Face als `owner/model-name` an: einen Open-Jev-Checkpoint, eine GGUF-Datei, die sich als Decision-Modell ausweist, oder ein Valen-GGUF-Paket. Häng `:Q8_0` an den Namen an, um eine bestimmte GGUF-Größe zu wählen. Klick auf **Prüfen**. Marinara liest die Angaben der Dateien über sich selbst und zeigt Größe und Lizenzen. Ein Repository, für das Marinara nicht einstehen kann, wird mit Begründung abgelehnt. Klick dann auf **Dieses herunterladen und installieren**.
- **Dateien entfernen** löscht das Modell und seine Laufzeit.
- **Neu installieren** erscheint, wenn das installierte Modell nicht starten kann, weil seine Dateien oder seine Laufzeit fehlen oder veraltet sind, meist nach einem Update. Das Modell ist dann mit **Neuinstallation nötig** markiert. Bei der Neuinstallation bleiben die Dateien erhalten, die schon vollständig heruntergeladen sind. Meist wird also nur die Laufzeit erneut heruntergeladen.

Die erste Antwort eines Modells nach dem Start ist langsamer. Marinara stellt deshalb beim Laden eine Frage zum Aufwärmen. Schlägt sie fehl, startet das Modell trotzdem, und die Verzögerung fällt bei der ersten echten Frage an. Stoppt das Modell direkt nach dem Start, nennt die Seite den Grund, etwa eine fehlende Prozessorfunktion, die es braucht.

### Strands decider selbst betreiben

[Strands decider 2B](https://huggingface.co/StrandsAgents/strands-decider-2B-hobson-v19) ist ein weiteres offenes Decision-Modell (Apache-2.0), das System One spricht. Marinara kann es nicht installieren, aber es funktioniert als **Custom System One endpoint**, solange du es laufen lässt.

1. Installiere es in einer Umgebung mit Python 3.10 oder neuer und starte seinen Server:

   ```bash
   pip install strands-decider
   strands-decider serve StrandsAgents/strands-decider-2B-hobson-v19 --port 8000
   ```

   Es nutzt eine NVIDIA-GPU oder Apple silicon, wenn es eines davon findet, und sonst langsamer den Prozessor. Beim ersten Start werden das Modell und etwa 4,6 GB Basisgewichte heruntergeladen; seine Python-Pakete belegen etwa 5,5 GB. Der Server hat kein Passwort, lass ihn deshalb auf `127.0.0.1`.

2. Leg ein Konto vom Typ **Own decision server** mit der **Server address** `http://127.0.0.1:8000` an. Jeder Modellname funktioniert.
3. Wähle es in der Zeile **Decision** und teste es dann mit **Test** im Menü **⋯** des Kontos. Seine erste Antwort nach dem Start dauert etwa 2 Sekunden, länger als das Standard-Zeitlimit; teste es deshalb einmal, bevor du chattest.

Seine Wahrscheinlichkeiten sind kalibriert, deshalb passt die Standardschwelle 0,5 zu ihm, anders als bei einem selbst gehosteten Open-Jev (siehe [Schwellenwerte](#thresholds)). Seine Antworten hängen von der Formulierung ab, halte dich also an [Aussagen formulieren](../prompts/conditional-prompts.md#writing-statements).

## Verwandte Anleitungen

- [Eigene Agenten erstellen](../agents/custom-agents.md)
- [Bedingte Prompts](../prompts/conditional-prompts.md)
- [Gruppenchats](../chats/group-chats.md)
- [Eingebautes Modell einrichten](local-model.md)
- [Verbindung zu einem KI-Anbieter herstellen](connecting-to-a-provider.md)
