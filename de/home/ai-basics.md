# KI-Grundlagen: Modelle, Tokens und Kontext

Neu beim Chatten mit KI? In dieser Anleitung erfährst du, was die wenigen Fachbegriffe bedeuten, die in den anderen Anleitungen vorkommen. Zum Lesen brauchst du kein Konto. Die Tour **KI-Grundlagen** auf der Startseite führt dich Schritt für Schritt durch das Thema.

## Was ein KI-Modell ist

Ein KI-Modell (auch großes Sprachmodell oder LLM genannt) ist ein Programm, das riesige Textmengen gelesen und daraus gelernt hat, vorherzusagen, was als Nächstes kommt. Wenn du eine Nachricht sendest, schreibt es die Antwort Stück für Stück und wählt dabei jeweils eine wahrscheinliche Fortsetzung.

Während es schreibt, schlägt es nichts nach. Alles, was es weiß, stammt aus dem, was es vor seiner Fertigstellung gelesen hat, und aus dem, was Marinara ihm mit deiner Nachricht schickt. Deshalb kennt ein Charakter nur das, was in seiner Karte, im Chat und im Weltwissen steht, das Marinara hinzufügt.

## Wo ein Modell läuft

Marinara ist die App, in der du chattest. Sie enthält selbst kein großes Modell, sondern schickt deinen Chat an eines:

- **Ein Dienst im Internet**, etwa OpenRouter, NanoGPT, OpenAI oder Anthropic. Du legst dort ein Konto an und holst dir einen API-Key (einen geheimen Code, mit dem Marinara dein Konto nutzen kann). Der Dienst betreibt das Modell. Die meisten Dienste rechnen nach Nutzung ab. Manche bieten kostenlose Modelle an.
- **Ein Modell auf deinem eigenen Computer**, etwa das [integrierte Modell](../connections/local-model.md). Es braucht kein Konto und kostet nichts, ist aber kleiner und langsamer als die großen Dienste. Die Rechenarbeit übernimmt dein Computer.

Wie du eines von beiden hinzufügst, steht unter [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md).

## Tokens

Modelle lesen und schreiben in Tokens, kleinen Textstücken. Ein Token entspricht ungefähr einem Dreiviertelwort im Englischen, also sind 100 Tokens etwa 75 englische Wörter. Dienste zählen Tokens, um Preise und Limits festzulegen: Meist bezahlst du sowohl für die gesendeten Tokens als auch für die, die du zurückbekommst.

## Das Kontextfenster

Ein Modell kann nur eine begrenzte Anzahl von Tokens auf einmal lesen. Diese Grenze ist sein Kontextfenster. Für jede Antwort schickt Marinara dem Modell die Anweisungen, die Charakterkarte, deine Persona, vorhandenes Weltwissen und so viel vom Chat, wie hineinpasst.

In einem langen Chat passen die ältesten Nachrichten irgendwann nicht mehr hinein, und das Modell vergisst sie. Marinara kann die wichtigen Teile mit Zusammenfassungen und Memory Recall zurückholen. Siehe [Memory Recall und Chat-Zusammenfassungen](../agents/memory.md).

## Verschiedene Modelle für verschiedene Aufgaben

Marinara kann mehrere Arten von Modellen nutzen:

| Art | Was sie macht | Nötig? |
| --- | --- | --- |
| **Chat-Modell** | Schreibt die Antworten. | Ja, eines reicht für den Anfang. |
| **Decision-Modell** | Beantwortet kleine Fragen zum Chat: mit Ja oder Nein, mit einer von wenigen Optionen oder mit einer Mengenangabe. Manche können auch Bilder ansehen. | Optional. |
| **Embedding-Modell** | Verwandelt Text in Zahlen, die seine Bedeutung abbilden. So kann Marinara Weltwissen und Erinnerungen nach Bedeutung finden. Es schreibt selbst keinen Text. | Optional. Ein kleines ist eingebaut. |
| **Bilder lesen** | Ein Modell, das ein Bild ansehen und beschreiben kann. | Optional. |
| **Bild, Video und Stimme** | Eigene Dienste, die Bilder, Clips und Sprache erzeugen. Ein Chat-Modell kann das nicht. | Optional. |

Für den Anfang kannst du ein Chat-Modell für alles nutzen und die anderen hinzufügen, sobald eine Funktion sie braucht. Siehe [Das Modell für jede Aufgabe wählen](../connections/connecting-to-a-provider.md#choosing-the-model-for-each-job).

## Prompts und Presets

Der Prompt ist alles, was Marinara dem Modell für eine Antwort schickt. Ein Preset bestimmt, was in den Prompt kommt und in welcher Reihenfolge. **Prompt ansehen** in einem Chat zeigt dir genau den Prompt, der gesendet wurde. Siehe [Preset-Editor und Prompt-Manager](../prompts/presets.md).

## Verwandte Anleitungen

- [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md)
- [Decision-Modelle](../connections/decision-models.md)
- [Semantische Suche für Lorebooks](../lorebooks/semantic-search.md)
- [Professor Mari](professor-mari.md)
