# Verbindungen organisieren

In dieser Anleitung erfährst du, wie du Konten und Modelle auf der Seite **Connections** (Verbindungen) unter **Library → Connections** (Bibliothek → Verbindungen) aufgeräumt hältst: mit Stern markieren, sortieren, bearbeiten, entfernen, Shuffle, Ordner und Export. Wie du ein Konto hinzufügst, steht unter [Verbindung zu einem KI-Anbieter herstellen](connecting-to-a-provider.md).

## Die Kontoliste

Unter dem Bereich **Defaults** (Standardwerte) listet die Seite deine Konten in einer Tabelle mit den Spalten **Models** (Modelle), **Status** und **Balance** (Guthaben). Unter **On this device** (auf diesem Gerät) findest du das [eingebaute Modell](local-model.md). Klick auf ein Konto, um seine gespeicherten Modelle darunter anzuzeigen, und erneut, um sie einzuklappen. Eine Modellzeile zeigt den Namen des Modells und Badges, etwa die Aufgabe, die es übernimmt (**Main**, **Agents**, **Images**), **Custom settings**, seinen Preis oder **Plan** für Modelle, die in einem Abo enthalten sind. Ein lokales oder selbst gehostetes Konto kann auch **Default** auflisten. Dabei steht „Whatever model the server has loaded“, und es hat keinen Stern. Siehe [Das jeweils geladene Servermodell nutzen](local-self-hosted.md#use-whatever-model-the-server-has-loaded).

Oberhalb der Tabelle:

- **All kinds** (Alle Arten) grenzt die Liste auf Konten für **Chat**, **Images** (Bilder), **Video** oder **Voice** (Stimme) ein.
- **Search accounts and models** (Konten und Modelle suchen) filtert die Liste beim Tippen.
- Das Sortiermenü bietet **Sort: Name** (Sortierung: Name), **Sort: Most models** (Sortierung: Meiste Modelle) und **Sort: Recently changed** (Sortierung: Kürzlich geändert).

Manche Konten erreichen Modelle mehrerer Hersteller, etwa NanoGPT oder ein Proxy. Ihre Modelle sind unter Überschriften wie **via NanoGPT** gruppiert.

### Kontoaktionen

Klick in der Zeile eines Kontos auf **⋯**:

| Aktion | Funktion |
| --- | --- |
| **Edit account** | Öffnet seine Einstellungen: **Name**, **Address**, **API key**, **Use this account** (schaltet es aus, ohne es zu löschen), **Test account**, **Usage and balance** sowie **More options** mit **Requests per minute** und **Parallel requests**. Auch **Delete** findest du hier. |
| **Replace key** | Fügt einen neuen Key ein. Steht der alte Key auch bei anderen Konten, fragt Marinara, ob es diese ebenfalls aktualisieren soll. |
| **Add model** | Öffnet die Modellliste des Kontos. |

Um ein Konto zu löschen, öffne **Edit account** (Konto bearbeiten) und klick auf **Delete** (Löschen). Marinara bittet dich um Bestätigung und listet unter **Used by** (genutzt von) auf, was seine Modelle nutzt: Chats, Agenten, Modelle und Aufgaben. Klick auf **Delete with its N models** (mit seinen N Modellen löschen), um das Konto samt seinen Modellen zu entfernen. Diese Chats und Aufgaben brauchen danach ein anderes Modell. Lässt sich ein Modell nicht entfernen, listet der Editor es unter **This account still has models. Remove these first:** auf. Öffne jedes davon und entferne es.

### Anbietersymbole

Jedes Konto zeigt das Symbol seines Dienstes. Die Symbole werden mit Marinara ausgeliefert und nie aus dem Internet geladen. Ein Konto mit eigener Adresse zeigt das Symbol eines bekannten Servers oder Gateways, wenn seine Adresse oder sein Name einen solchen enthält, etwa Ollama, LM Studio, KoboldCpp, Bifrost oder LiteLLM. Andernfalls zeigt es den ersten Buchstaben seines Namens. Im klassischen Layout kannst du ein eigenes wählen: Klick auf das Bild eines Kontos und wähl dann ein Dienst-Logo, lade ein Bild hoch oder nutze Buchstaben.

## Mit Stern markierte Modelle

Ein Stern markiert die Modelle, die du schnell finden willst. Mit Stern markierte Modelle stehen unter **Starred** (mit Stern markiert) weit oben in jeder Modellauswahl: in den Fenstern **Model for** (Modell für) des Bereichs **Defaults**, in **Model for this chat** (Modell für diesen Chat) und in den Modellfeldern der **Chat Settings** (Chat-Einstellungen) und des Agenten-Editors.

Um ein Modell mit einem Stern zu markieren, klick auf den Stern in seiner Zeile oder in der Liste **Add model** (Modell hinzufügen) des Kontos. Auch wenn du einem Modell eine Aufgabe gibst, wird es gespeichert.

Um den Stern zu entfernen, klick erneut darauf. Marinara entfernt das Modell und zeigt einige Sekunden lang **Undo** (rückgängig). Ohne Stern bleibt das Modell erhalten, wenn ein Chat es nutzt, es im Bereich **Defaults** eine Aufgabe hat, eigene Einstellungen besitzt oder das letzte Modell seines Kontos ist. Die Meldung nennt den Grund.

## Ein Modell bearbeiten und entfernen

Klick auf eine Modellzeile, um **Edit model** (Modell bearbeiten) mit allen Einstellungen zu öffnen. **Export model** (Modell exportieren) speichert es in einer Datei (siehe [Exportieren und importieren](#export-and-import)). Um einem Modell eine Aufgabe zu geben, klick im Bereich **Defaults** auf diese Aufgabe und wähl das Modell dort aus.

Am Computer kannst du eine Modellzeile auf einen Chat ziehen, um das Modell in diesem Chat zu verwenden.

### Modellaktionen

Klick am Ende einer Modellzeile auf **⋯**, oder klick mit der rechten Maustaste auf die Zeile:

| Aktion | Funktion |
| --- | --- |
| **Edit model** | Öffnet die Einstellungen des Modells. |
| **Make default for…** | Gibt dem Modell eine Aufgabe, genau wie die Auswahl unter **Defaults**. Ein Häkchen zeigt seine bestehenden Aufgaben. |
| **Move to account…** | Verschiebt das Modell in ein anderes Konto. Danach nutzt es den Key dieses Kontos. Sein Name, sein Bild, seine Aufgaben und seine Chats ziehen mit, und die Dienstoptionen werden zurückgesetzt. |
| **Move to folder** | Legt das Modell in einen Ordner (siehe [Ordner](#folders)). |
| **Duplicate** | Legt eine vollständige Kopie mit denselben Einstellungen an und öffnet sie. |
| **Add to Shuffle** / **Remove from Shuffle** | Siehe [Shuffle](#shuffle). Ein Modell im Pool trägt in seiner Zeile die Markierung **Shuffle**. |
| **Export** | Speichert das Modell in einer Datei. |
| **Remove** | Löscht das Modell nach einer Bestätigung. Die Bestätigung listet auf, was es nutzt. |

<a id="folders"></a>

## Ordner

Ordner gruppieren deine Modelle, zum Beispiel **RP** und **Work**. Ein Modell liegt jeweils in nur einem Ordner.

1. Klick an einem Modell auf **⋯** und wähl **Move to folder** (In Ordner verschieben).
2. Wähl einen Ordner, oder klick auf **New folder…** (neuer Ordner), tipp einen Namen ein und klick auf **Create** (Erstellen).
3. Um deine Ordner zu sehen, ändere im Menü neben dem Sortiermenü **By account** (nach Konto) in **By folder** (nach Ordner).

Unter **By folder** listet jeder Ordner seine Modelle mit dem Namen ihres Kontos auf; Modelle ohne Ordner stehen unter **Not in a folder**. Klick an einem Ordner auf **⋯**, oder klick mit der rechten Maustaste darauf, um ihn umzubenennen oder zu löschen. Löschst du einen Ordner, bleiben seine Modelle unter **Not in a folder** erhalten. Das klassische Panel zeigt dieselben Ordner und lässt dich einem Ordner außerdem ein Symbol und eine Farbe geben.

## Shuffle

Mit Shuffle wählt ein Chat jedes Mal ein anderes Modell, wenn er eine Antwort schreibt. Nutze es, um Anfragen über mehrere Dienste oder Modelle zu verteilen.

1. Klick an jedem Modell, das in den Pool soll, auf **⋯** und wähl **Add to Shuffle** (zu Shuffle hinzufügen).
2. Öffne in einem Chat **Model for this chat** im Eingabebereich des Chats oder **Chat Settings → Connection → Model** (Chat-Einstellungen → Verbindung → Modell) und wähl **Shuffle** (Zufallsauswahl).

Jede Antwort greift dann auf ein zufälliges Modell aus deinem Shuffle-Pool zurück.

Scheitert das Modell, das für eine Antwort gezogen wurde, und hat **Main** ein Modell unter **If it fails** (falls es fehlschlägt), schreibt stattdessen dieses Modell die Antwort. Ein Hinweis nennt das gescheiterte Modell und einen kurzen Grund wie „key rejected“, „rate limited“ oder „not found“. Die Antwort behält eine kleine Markierung **Fallback**. Tipp darauf oder zeig darauf, um dieselbe Zeile erneut zu sehen.

Eine Auswahl in **Model for this chat** ändert nur diesen Chat. Um das Modell für neue Chats zu ändern, leg **Main** im Bereich **Defaults** fest.

## Im klassischen Layout

Das klassische Connections-Panel hat einige zusätzliche Funktionen. Wechsle mit **New layout** (Neues Layout (Vorschau der UI-Überarbeitung)) unter **Settings → Appearance → Theme** (Einstellungen → Darstellung → Theme) dorthin und auf demselben Weg wieder zurück. Beide Layouts verwenden dieselben Konten.

- **⋯** an einem Modell enthält außerdem **Change picture** (Bild ändern).
- **⋯** an einem Konto enthält außerdem **Test**, **Select models** (mehrere Modelle verschieben oder löschen), **Duplicate** sowie **Turn off** / **Turn on**.
- **More actions** (Weitere Aktionen, drei Punkte) oben im Panel enthält **Fold all accounts**, **Open all accounts**, **Show only Off or Needs key** und **Show cost badges**.

<a id="export-and-import"></a>

## Exportieren und importieren

Konten lassen sich in eine Datei exportieren – als Backup oder für den Umzug auf eine andere Installation. Später importierst du sie wieder.

> **Warnung:** Exporte enthalten nie API-Keys. Öffne nach dem Import jedes Konto und trag seinen Key erneut ein. Gib einen Key niemals an andere weiter.

- **Ein Modell exportieren:** Öffne es mit **Edit model** (Modell bearbeiten) und klick auf **Export model** (Modell exportieren).
- **Alles exportieren:** Klick oben auf der Connections-Seite auf **Export all accounts** (alle Konten exportieren), das Upload-Symbol neben **Import**. Marinara erinnert dich daran, dass die Datei keine Keys enthält. Klick auf **Export** (Exportieren).
- **Importieren:** Klick oben auf der Connections-Seite auf **Import** (Importieren). Zieh eine oder mehrere Dateien (`.json`, `.jsonl` oder `.zip`) in das Fenster, oder klick, um sie auszuwählen. Das gilt auch für die exportierte `marinara-connections.zip`. Jedes importierte Konto hat einen leeren Key, bis du ihn ausfüllst.

Ein einzelnes Modell wird als `.connection.json`-Datei heruntergeladen. Mehrere kommen gemeinsam als `marinara-connections.zip`. Sterne sind enthalten. Der Modellkatalog des Dienstes ist es nicht; er wird neu geladen, wenn du die Modelle des Kontos zum ersten Mal öffnest.

## Verwandte Anleitungen

- [Verbindung zu einem KI-Anbieter herstellen](connecting-to-a-provider.md)
- [Chat Settings im Überblick](../chats/chat-settings.md)
