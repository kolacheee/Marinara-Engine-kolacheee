# Marinara sichern und wiederherstellen

Speichere eine Kopie deiner Daten aus Marinara Engine, damit du sie später wiederherstellen kannst. Tu das vor einem Update, einem Gerätewechsel oder bevor du [deine Daten löschst](clearing-data.md).

## Welche Option passt?

| Option | Ergebnis | Zweck |
| --- | --- | --- |
| **Download Backup** | Eine `.zip` mit allen Daten und Dateien. | Eine vollständige Kopie von allem. |
| **Export Profile** | Eine kleinere Datei mit deinen Kontodaten (Charaktere, Chats, Lorebooks und mehr). | Eine Kopie ohne geheime Werte oder Dateien für andere Tools. |

Eine `.zip` ist eine Datei, die viele Dateien enthält. Beide Optionen und die Wiederherstellung findest du unter **Settings → Data → Backup & Restore** (Einstellungen → Daten → Backup & Wiederherstellung).

**Bevor du anfängst:** Auf dem Rechner, auf dem Marinara läuft, funktionieren diese Funktionen sofort. Von einem Handy, Tablet oder anderen Gerät aus musst du das Admin-Secret auf dem Server festlegen und denselben Wert unter **Settings → Advanced → Security** (Einstellungen → Erweitert → Sicherheit) eingeben. Das Admin-Secret ist ein Passwort in der `.env`-Datei des Servers, unter `ADMIN_SECRET`. Siehe den Abschnitt „Privileged APIs (ADMIN_SECRET)“ in der [Referenz zur Server-Konfiguration](../CONFIGURATION.md) und [Fernzugriff](../REMOTE_ACCESS.md).

## Download Backup

1. Öffne **Settings → Data**.
2. Klick unter **Backup & Restore** auf **Download Backup**. Die Schaltfläche zeigt **Creating backup…**.
3. Speichere die Datei, wenn dein Browser danach fragt, oder suche sie im Downloads-Ordner.

Die `.zip` enthält:

- deine gespeicherten Textdaten (Charaktere, Chats, Lorebooks, Presets, Verbindungen, Einstellungen);
- deine hochgeladenen und erzeugten Dateien, etwa Avatare, Sprites, Hintergründe, Galeriebilder, Schriften, eigene Emojis und Sticker sowie deinen eigenen Benachrichtigungston;
- die Datei `.encryption-key`, sofern vorhanden;
- eine Anleitung `RESTORE.txt` zur Wiederherstellung von Hand (siehe [Von Hand wiederherstellen](#restore-by-hand)).

Die Ordnernamen stehen unter [Wo Marinara deine Daten speichert](where-data-is-stored.md).

> **Warnung:** Ein Backup enthält deine gespeicherten API-Keys und die Datei `.encryption-key`, mit der sie entschlüsselt werden können. Gib es niemals weiter. Bewahre es an einem privaten Ort auf.

Unter Android kannst du den Datenordner der App nicht öffnen. Mit **Download Backup** bekommst du eine Kopie vom Gerät.

Wenn es nicht funktioniert: Erscheint „Backup preparation timed out after one hour.“, versuche es erneut. Kann ein anderes Gerät das Backup nicht herunterladen, prüf das Admin-Secret (siehe oben).

<a id="automatic-backups"></a>

## Automatische Backups

Marinara kann auf dem Rechner, auf dem es läuft, regelmäßig ein vollständiges Backup anlegen.

1. Öffne **Settings → Data → Backup & Restore**.
2. Aktiviere **Automatic backups**.
3. Wähle **Daily**, **Weekly** oder **Monthly**.
4. Stell **Automatic backups kept** auf einen Wert von 1 bis 9999.

Marinara erstellt das erste Backup kurz nach dem Aktivieren. Nach jedem Durchlauf behält es die festgelegte Anzahl der neuesten Backups und löscht ältere automatische Backups. Backups, die du mit **Download Backup** erstellt hast, löscht es nie.

Automatische Backups liegen im Ordner `backups/` innerhalb des Datenordners. Das neueste heißt `marinara-automatic-backup.zip`. Ältere Dateien tragen Datum und Uhrzeit im Namen. Sie verwenden dasselbe Format wie **Download Backup**.

Für jeden Durchlauf muss Platz für ein weiteres vollständiges Archiv frei sein, da das alte bestehen bleibt, bis das neue fertig ist. Reicht der Platz nicht aus, überspringt Marinara den Durchlauf und zeigt den Grund neben der Einstellung an. Sobald wieder Platz frei ist, versucht Marinara es erneut.

> **Tipp:** Bewahre eine zweite Kopie außerhalb des Datenordners auf. Bei einem Festplattenausfall oder wenn die App gelöscht wird, gehen auch die automatischen Backups verloren.

## Ein Profil exportieren

1. Öffne **Settings → Data → Backup & Restore**.
2. Klick auf **Export Profile**. Ein Dialog mit demselben Titel öffnet sich.
3. Wähle ein Format.
4. Dein Browser lädt die Datei herunter.

- **Marinara Native** behält Charaktere, Personas, Chats, Lorebooks, Presets, Agenten, Themes, den Code von Personal Extensions und Medien. API-Keys, Webhook-Links und manche Chat-Einstellungen werden nicht wiederhergestellt (siehe [Keys erneut eingeben](#enter-your-keys-again)). Du kannst das Profil in Marinara wiederherstellen.
- **Compatible JSON** erstellt eine `.zip` mit einfachen Charakter-, Persona- und Lorebook-Dateien für andere Tools. Du kannst sie nicht in Marinara wiederherstellen.

Ein natives Profil wird als `marinara-profile.json` heruntergeladen. Ist es zu groß, bietet Marinara stattdessen eine ZIP-Datei an. Klick auf **Export ZIP**, um `marinara-profile.zip` herunterzuladen.

Ein natives Profil bewahrt Regex-Skripte, ihre Ordner und die Pauseneinstellung jedes Ordners auf. Wie du einzelne Skripte als JSON teilst, steht unter [Regex-Skripte](../extending/regex-scripts.md#import-and-replace-scripts).

Ein natives Profil behält den Code von Personal Extensions, aber nicht den Aktivierungs- oder Freigabestatus. Jede wiederhergestellte Erweiterung ist deaktiviert. Prüfe sie erneut unter **Library → Extensions** (Bibliothek → Erweiterungen).

## Mit Import Profile wiederherstellen

**Import Profile** lädt eine Profildatei oder eine `.zip` von **Download Backup**.

1. Öffne **Settings → Data → Backup & Restore**.
2. Lass unter der Schaltfläche **Tag imported** (als importiert markieren) und **Tag source** (Quelle markieren) angehakt, damit die importierten Charaktere, Personas, Lorebooks, Presets und Chats die Tags **Imported** und **Backup** erhalten. Entferne die Häkchen, um alles genau so wiederherzustellen, wie es war.
3. Klick auf **Import Profile (JSON/ZIP)**.
4. Wähle `marinara-profile.json`, `marinara-profile.zip` oder eine Backup-`.zip`. Die Schaltfläche zeigt **Scanning Profile...**.
5. Lies den Dialog **Profil importieren**. Er listet die gefundenen Daten auf. Bereits in Marinara vorhandene Elemente werden durch die Versionen aus der Datei ersetzt, sofern du nicht [nur Fehlendes hinzufügst](#only-add-whats-missing).
6. Klick auf **Importieren** oder zum Abbrechen auf **Abbrechen**. Die Schaltfläche zeigt **Profil wird importiert…**. Marinara speichert zuerst eine Sicherheitskopie deiner Daten, danach folgt ein Fortschrittsbalken. Nach Abschluss bestätigt eine Meldung den Import.

Wenn es nicht funktioniert:

- Außer unter `localhost`, `127.0.0.1` oder `[::1]` ist für den Profilimport HTTPS erforderlich. Die Fehlermeldung lautet „Profile import requires HTTPS outside local development.“ Öffne Marinara über eine HTTPS-Adresse.
- Fehlen Mediendateien in einer `.zip`, wird der Import trotzdem abgeschlossen. Eine Warnung listet die fehlenden Dateien auf; den Rest importiert Marinara.
- Ist die Festplatte für die Sicherheitskopie zu voll, wird nichts importiert. Die Fehlermeldung beginnt mit „Nothing was imported, because a safety copy could not be saved first.“ Gib ungefähr so viel Platz frei, wie ein vollständiges Backup benötigt, und importiere erneut.

Importierst du dasselbe Profil zweimal, aktualisiert Marinara die vorhandenen Elemente, statt Kopien anzulegen. Profile aus sehr alten Versionen können Duplikate erzeugen.

### Nur Fehlendes hinzufügen

Um etwas Gelöschtes zurückzuholen, ohne seitdem vorgenommene Änderungen zu verlieren, schalte **Keep my current versions, only add what's missing** über **Profil importieren (JSON/ZIP)** ein und importiere dann wie oben beschrieben. Alle bereits in Marinara vorhandenen Elemente und Dateien bleiben unverändert; nur Fehlendes wird hinzugefügt. Dazu gehört alles, was du seit dem Speichern der Datei gelöscht hast, etwa einzelne Nachrichten oder Lorebook-Einträge, nicht nur das Element, das du zurückhaben wolltest. Das Langzeitgedächtnis zählt als ein Element: Hat Marinara bereits Erinnerungen darin, werden die aus der Datei nicht hinzugefügt.

Da nichts ersetzt wird, speichert Marinara keine Sicherheitskopie, und **Undo Last Import** macht weiterhin den Import davor rückgängig.

Profile aus sehr alten Versionen unterstützen dies nicht: Sie fügen ihre Elemente immer neben deinen hinzu. Der Dialog **Profil importieren** weist darauf hin.

### Einen Import rückgängig machen

Vor jedem Import, der Elemente ersetzt, speichert Marinara eine vollständige Kopie deiner Daten im Ordner `backups/` innerhalb des Datenordners. Der Dateiname beginnt mit `marinara-before-import-`, gefolgt von Datum und Uhrzeit. Nach Abschluss des Imports wird die Kopie des vorherigen Imports gelöscht, sodass nur die neueste erhalten bleibt.

1. Öffne **Einstellungen → Daten → Backup & Wiederherstellung**.
2. Klick auf **Undo Last Import**. Die Zeile darunter zeigt, wann die Sicherheitskopie gespeichert wurde.
3. Klick im Dialog zur Bestätigung auf **Undo Last Import**.

Beim Rückgängigmachen werden deine Versionen der Elemente und Dateien wiederhergestellt, die der letzte Import ersetzt hat. Hast du eines dieser Elemente nach dem Import geändert, geht diese Änderung verloren. Alles andere bleibt unverändert, einschließlich der Elemente, die der Import hinzugefügt hat. Du kannst einen Import einmal rückgängig machen; danach wird die Sicherheitskopie gelöscht.

Was der Import aus Sicherheitsgründen ausgeschaltet hat, wird beim Rückgängigmachen nicht wieder eingeschaltet. Schalte Folgendes von Hand wieder ein:

- dein aktives Theme;
- Personal Extensions (prüfe sie erneut unter **Einstellungen → Add-ons**);
- eigene Tools, die ein Skript oder einen Webhook ausführen;
- Erinnerungen von Professor Mari.

Hat der Import den API-Key einer Verbindung gelöscht, gib ihn erneut ein (siehe [Keys erneut eingeben](#enter-your-keys-again)). War die Verbindung als Standard oder Fallback gesetzt, lege sie wieder dafür fest.

Verzweigte Chats, die der Import ersetzt hat, bleiben vom ursprünglichen Chat getrennt. Der Import hat diese Verknüpfung bereits entfernt, und sie lässt sich beim Rückgängigmachen nicht wiederherstellen.

Profile aus sehr alten Versionen fügen nur Elemente hinzu. Deshalb speichert Marinara für sie keine Sicherheitskopie, und es gibt nichts rückgängig zu machen.

Die Sicherheitskopie braucht so viel Platz wie ein vollständiges Backup. Um diesen Platz freizugeben, ohne den Import rückgängig zu machen, klick unter **Einstellungen → Daten → Backup & Wiederherstellung** auf **Delete Safety Copy** und bestätige. Deine Daten bleiben unverändert, aber du kannst diesen Import dann nicht mehr rückgängig machen. Wurde ein Import unterbrochen, kann **Delete Safety Copy** allein erscheinen. Die Kopie lässt sich dann nicht zum Rückgängigmachen nutzen, aber du kannst sie weiterhin löschen.

<a id="enter-your-keys-again"></a>

## Keys erneut eingeben

**Import Profile** stellt API-Keys und Webhook-Links nie wieder her, auch nicht aus einer `.zip` von **Download Backup**. Ein API-Key ist ein geheimer Code, den du von einem Dienst bekommst. In der Profildatei und im Profil innerhalb eines Backups sind diese Werte entfernt. Nach dem Import auf einem neuen Rechner musst du sie erneut eingeben:

1. Öffne **Library → Connections** (Bibliothek → Verbindungen).
2. Öffne jedes Konto, das du nutzt, gib den API-Key ein und speichere. Siehe [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md).
3. Gib den Webhook-Link bei jedem eigenen Tool, das ihn verwendet, erneut ein.

Auch manche Chat-Einstellungen mit Adressen oder Keys (Discord, DeepL, Intiface) bleiben leer. Gib sie in den **Chat Settings** jedes betroffenen Chats erneut ein.

Beim Import werden bereits gesetzte Keys derselben Installation nicht gelöscht.

## Auf einen neuen Rechner umziehen

1. Installiere Marinara auf dem neuen Rechner und starte es. Siehe [Installation](../INSTALLATION.md).
2. Öffne **Settings → Data → Backup & Restore** und klick auf **Import Profile (JSON/ZIP)**.
3. Wähle deine `.zip` von **Download Backup** oder deine Profildatei und klick auf **Import**.
4. Gib deine API-Keys erneut ein, wie oben beschrieben.

Die Schlüsseldatei im Backup hilft nur, wenn du den gesamten Datenordner von Hand kopierst, wie unten beschrieben.

<a id="restore-by-hand"></a>

## Von Hand wiederherstellen

Nutze diesen Weg nur, wenn **Import Profile** nicht verfügbar ist. Die `.zip` enthält einen Ordner, beispielsweise `marinara-backup-...`, mit einer Anleitung `RESTORE.txt`.

1. Stoppe Marinara.
2. Entpacke das Backup.
3. Kopiere die Ordner und die Datei `.encryption-key` aus dem entpackten Ordner in deinen Datenordner. Siehe [Wo Marinara deine Daten speichert](where-data-is-stored.md).
4. Starte Marinara.

Bewahre die Datei `.encryption-key` zusammen mit dem Ordner `storage` auf. Sonst können die gespeicherten API-Keys nicht gelesen werden.

Die Liste **Existing backups** unter **Backup & Restore** ist normalerweise leer. Du brauchst sie nicht.

## Verwandte Anleitungen

- [Wo Marinara deine Daten speichert](where-data-is-stored.md)
- [Daten löschen oder zurücksetzen](clearing-data.md)
- [Marinara Engine aktualisieren](../UPGRADING.md)
- [Verbindung zu einem KI-Anbieter herstellen](../connections/connecting-to-a-provider.md)
- [Fernzugriff: Anmeldung und IP-Allowlist](../REMOTE_ACCESS.md)
