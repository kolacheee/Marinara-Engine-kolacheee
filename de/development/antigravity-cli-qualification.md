# Voraussetzungen für eine Antigravity-CLI-Abonnementintegration

Dies ist eine Recherche für Entwickler zu [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143), erstmals geprüft am 2026-10-23 und erneut am 2026-11-19 anhand der offiziellen Windows-Veröffentlichungen von `agy` 1.5.11 und 1.5.12. Marinara Engine implementiert **keine** Antigravity-Abonnementverbindung, und das Issue bleibt als nicht geplant geschlossen. Die Ausschlüsse des eigenen Agenten unterdrückten die bei dieser Nachprüfung getesteten Hooks, aber der MCP-Unterprozess eines global gefundenen Plugins startete weiterhin in beiden Versionen. Die Ausführungsisolation ist weiterhin nicht ausreichend belegt.

## Belegte offizielle Schnittstellen

Die offizielle CLI `agy` unterstützt die Kontoanmeldung mit gespeicherten Anmeldedaten und die Textgenerierung ohne interaktive Oberfläche. Ihr dokumentiertes Protokoll umfasst die Ereignisse `init`, `step_update` und `result`; für die Streaming-Eingabe werden JSON-Benutzernachrichten über stdin übergeben. Bei der Windows-Nachprüfung führte `agy models` das Modell `gemini-4-neon-high` auf. Anfragen an dieses Modell mit festem Zeitlimit waren mit der bestehenden Google-AI-Pro-Anmeldung des Nutzers erfolgreich. Welche Modelle das Konto nutzen kann, muss die installierte CLI liefern; das darf nicht aus diesem Beispiel abgeleitet werden. `--print-timeout 0` wartet bis zum Abschluss, und `--disable-slash-commands` deaktiviert die Befehlsexpansion im Print-Modus. Siehe [Betrieb ohne interaktive Oberfläche](https://antigravity.google/docs/cli/headless/) und die [Referenz der CLI-Optionen](https://antigravity.google/docs/cli/reference/).

Die Kontoanmeldung der CLI nutzt den Anmeldedatenspeicher des Betriebssystems. Ihr gesonderter Gemini-API-Schlüsselmodus erfordert `modelProvider: "gemini"` und `GEMINI_API_KEY`; ein Abonnementadapter darf diesen Abrechnungsweg nicht stillschweigend wählen. Die dokumentierten Methoden zur programmatischen Authentifizierung des Python-SDK sind Gemini-API-Schlüssel, Vertex-/Google-Cloud-Anmeldedaten und lokale Modelle. Diese Methoden belegen keine Authentifizierung über ein Endkundenabonnement für einen SDK-basierten Ersatz. Siehe [Authentifizierung](https://antigravity.google/docs/install/#programmatic-authentication) und die [SDK-Übersicht](https://antigravity.google/docs/sdk/overview/).

## Aktuelles Ergebnis zur Ausführungsisolation

Die offiziellen Definitionen eigener Agenten bieten Einstellungen für Tools, MCP und Anpassungen. Laut Plugin-Anleitung steuert `inheritCustomizations` die Übernahme von Skills, Regeln und Hooks; `inheritMcp` steuert die Übernahme von MCP-Servern des Arbeitsbereichs. Die damalige Ankündigung von `excludeDefaultComponents: true` behält Hooks nach dem Modellaufruf bei, daher belegt diese Option allein keine Isolation. Die unten gezeigte Kombination von Einstellungen unterdrückte die eingerichteten Test-Hooks in 1.5.11, verhinderte aber nicht den Start sämtlicher MCP-Unterprozesse. Siehe [Eigene Unteragenten](https://antigravity.google/docs/subagents/), [Plugins erstellen](https://antigravity.google/docs/build-plugins/) und das [CLI-Änderungsprotokoll](https://antigravity.google/docs/changelog).

Hooks können aus einem Arbeitsbereich, der globalen Datei `~/.gemini/config/hooks.json` und installierten Plugins stammen. Sie umfassen Sitzungs-, Modellaufruf-, Tool- und Stoppereignisse. Die aktuelle Einstellungsdokumentation und das [offizielle Einstellungsschema](https://antigravity.google/schemas/v1/settings.json) besagen ausdrücklich, dass ein Eintrag `hooks` in `settings.json` nicht geladen wird. Ein leerer Eintrag dort würde die tatsächlichen Hook-Quellen nicht deaktivieren. Siehe [Hooks](https://antigravity.google/docs/hooks) und [CLI-Einstellungen](https://antigravity.google/docs/settings?tab=cli).

Die Hilfe der installierten Version 1.5.11 dokumentiert `--settings` als nur für die Sitzung geltende Überschreibungen von Schlüsseln aus `settings.json`, direkt übergeben oder aus einer Datei. Damit lassen sich Vertrauen für den Arbeitsbereich und Berechtigungen vorübergehend festlegen, ohne dauerhafte Einstellungen zu überschreiben. Ein getrenntes Konfigurationsprofil entsteht dadurch nicht: `--settings '{"hooks":{}}'` endet mit Code 1 und `unknown setting "hooks"`. Die installierte Hilfe führte weder eine Hook-Deaktivierung noch eine Option für ein authentifiziertes isoliertes Profil auf.

Die aktuelle Einstellungsdokumentation beschreibt `/hooks` als Möglichkeit, Hooks hinzuzufügen, zu bearbeiten und umzuschalten; Änderungen werden in Konfigurationsdateien gespeichert. Ohne interaktive Oberfläche lieferte `-p "/hooks" --output-format json` bei der Nachprüfung eine strukturierte Bestandsaufnahme. Eine Bestandsaufnahme und gespeicherte Schalterstellungen garantieren nicht, dass ein späterer Aufruf ausführbare Anpassungen ausschließt. Ein Verzeichniswechsel, eine leere Liste `tools`, die Anweisung, keine Tools zu nutzen, oder ein Abbruch nach dem Start reichen als Nachweis der Ausführungsisolation nicht aus.

Berichte über Integrationen von Drittanbietern sind Ansatzpunkte für die Untersuchung. Ihre Aussagen über wirkungslose Tools, Protokolle zur Agentenauflösung oder die Übernahme von Anpassungen müssen mit der offiziellen Veröffentlichung reproduziert werden, bevor die Engine sich darauf stützen darf.

## Prüfung der Veröffentlichung im Oktober 2026

Das [offizielle Installationsskript](https://antigravity.google/cli/install.sh) und sein [Veröffentlichungsmanifest für Darwin ARM64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json) wurden geprüft, ohne das Installationsskript auszuführen. Das Manifest wählte das [versionierte `agy`-Archiv 1.4.6 für Darwin ARM64](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz) mit dieser SHA-512-Prüfsumme:

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

Die Archivprüfsumme stimmte überein. Die Binärdatei wurde in ein temporäres Verzeichnis dieser Aufgabe entpackt. Ausgeführt wurden nur `--version` und `--help`, in einer macOS-Sandbox, die Netzwerkzugriff, Lese- und Schreibzugriff auf das Benutzerverzeichnis sowie den Zugriff auf den Schlüsselbunddienst verweigerte. Beide Aufrufe endeten erfolgreich. Die Hilfe führte keine Option zum Deaktivieren von Hooks und kein isoliertes Profil- oder Konfigurationsverzeichnis auf.

Diese Prüfung hat die CLI **nicht** installiert oder authentifiziert, keine Anmeldedaten eingesehen, kein Modell aufgerufen, keine Modelle eines angemeldeten Kontos aufgelistet und keine Hook-Ausführung getestet. Sie bestätigt die öffentliche Optionsliste; sie beweist weder, dass Isolation unmöglich ist, noch validiert sie die Generierung über ein Abonnement.

## Windows-Prüfung im November 2026

Das installierte `agy` meldete Version 1.5.11. Seine SHA-512-Prüfsumme stimmte mit der im [offiziellen Windows-AMD64-Manifest](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json) beobachteten Prüfsumme überein; diese ursprüngliche Manifestantwort wurde jedoch nicht aufbewahrt. Das laufend aktualisierte Manifest wechselte später auf 1.5.12. Während der Überprüfung wurde die [versionierte ausführbare Windows-Datei für 1.5.11](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe) unabhängig heruntergeladen und ihre Prüfsumme berechnet, ohne sie auszuführen. Ihre 234.827.416 Bytes ergaben dieselbe SHA-512-Prüfsumme wie die installierte ausführbare Datei:

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

Die Tests liefen in einem temporären Arbeitsbereich dieser Aufgabe mit folgendem Frontmatter in `.agents/agents/me-isolation-probe.md`:

```yaml
name: me-isolation-probe
description: Harmless execution-isolation qualification fixture.
mainAgent: true
subagent: false
tools: []
inheritCustomizations: false
inheritMcp: false
excludeDefaultComponents: true
commandExecutionPolicy: off
```

Die offizielle [Frontmatter-Referenz für eigene Agenten](https://antigravity.google/docs/subagents/) dokumentiert `mainAgent`, `subagent`, `tools` und `commandExecutionPolicy`. Die Einstellungen zur Übernahme und zum Ausschluss beschreibt die oben verlinkte Plugin-Anleitung samt Änderungsprotokoll. Die Testkonfiguration wurde als Kombination geprüft; eine erfolgreiche Agentenauswahl belegt nicht, dass jedes Feld einzeln durchgesetzt wurde.

Die Generierung nutzte `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`, mit einem unabhängigen Zeitlimit von 55 Sekunden für den Unterprozess. Die direkt übergebenen JSON-Einstellungen stuften den temporären Arbeitsbereich als vertrauenswürdig ein, wählten den Standard-Agentenmodus, deaktivierten eigene Status-/Titelskripte und wählten den unten genannten Berechtigungsmodus. Es wurden keine Berechtigungsprüfungen übersprungen.

Das Einstellungsobjekt hatte diese Form, wobei `<temporary-workspace>` durch das Prüfverzeichnis ersetzt und `toolPermission` auf den Berechtigungsmodus der jeweiligen Tabellenzeile gesetzt wurde:

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

Umgebungsschalter für API-Schlüssel und ADC wurden aus der Umgebung des Prüfunterprozesses entfernt; es wurden keine Anmeldedaten extrahiert oder kopiert.

Die Hook-Testkonfigurationen hängten Ereignisnamen an getrennte Markerdateien für `SessionStart`, `PreInvocation`, `PostInvocation` und `Stop` an. Lokale Python-MCP-Testprogramme schrieben einen Startmarker, bevor sie `initialize` und `tools/list` über stdio beantworteten. Die MCP-Konfiguration des Arbeitsbereichs nutzte `.agents/mcp_config.json`. Plugins enthielten `plugin.json`, `hooks.json` und `mcp_config.json` und wurden über ein `entries`-Manifest unter `.agents/plugins.json` oder `~/.gemini/config/plugins.json` gefunden, wie unter [Erkennung von Anpassungen](https://antigravity.google/docs/customization-discovery/) beschrieben. Die Kontrollläufe für Hooks, MCP und Dateilesen ließen `--agent` weg, behielten aber dieselben Testkonfigurationen und Sitzungseinstellungen bei. Die Prüfung mit einem nicht vorhandenen Namen verglich dagegen das gültige `--agent me-isolation-probe` mit einem nicht auflösbaren Agentennamen.

| Prüfung | Kontrolllauf | Eigener Agent |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Hooks im Arbeitsbereich und globale Hooks; Hooks eines im Arbeitsbereich gefundenen Plugins (Berechtigungen: `strict`) | Alle vier Ereignisse schrieben in jeder Quelle Marker | Keine Hook-Marker |
| MCP im Arbeitsbereich und MCP eines dort gefundenen Plugins (Berechtigungen: `strict`) | Beide Unterprozesse schrieben Startmarker | Keiner der beiden Startmarker erschien |
| Hooks eines global gefundenen Plugins (Berechtigungen: `request-review`) | Alle vier Ereignisse schrieben Marker | Keine Hook-Marker |
| MCP eines global gefundenen Plugins (Berechtigungen: `request-review`) | Der Unterprozess schrieb seinen Startmarker | Der Unterprozess schrieb weiterhin seinen Startmarker |
| Ausdrückliche `view_file`-Anfrage für einen nicht vorhersagbaren Testwert (Berechtigungen: `request-review`) | Gab den Testwert zurück | Gab `FILE_UNAVAILABLE` zurück; gab den Testwert nicht zurück |
| Nicht vorhandener `--agent`-Name (Berechtigungen: `strict`) | `--agent me-isolation-probe` schloss die Generierung ab | Der ungültige Name endete mit Code 1, einem Fehlerergebnis, null Verbrauch und ohne Hook-/MCP-Marker |

Das MCP-Ergebnis des global gefundenen Plugins wurde zweimal mit Berechtigungen vom Typ `strict` und einem neuen Startmarkerpfad für jeden Aufruf wiederholt. Beide Anfragen mit eigenem Agenten endeten mit Code 0, und beide Unterprozesse schrieben ihren Marker. Ein verspäteter Schreibvorgang aus dem früheren Kontrolllauf konnte diese neuen Pfade nicht treffen. Das ist das verbleibende beobachtete Ausführungshindernis für die Integration, obwohl die generierte Antwort kein MCP-Tool nutzte.

Der Prompt zum Dateilesen lautete `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`, wobei der absolute Pfad der temporären Testdatei eingesetzt wurde. Der Markdown-Text des eigenen Agenten wies ihn an, `FILE_UNAVAILABLE` zu antworten, falls er die Datei nicht lesen konnte.

Als das offizielle Manifest während der Untersuchung auf die nächste Version wechselte, wurde die [ausführbare Windows-Datei für 1.5.12](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe) in das Prüfverzeichnis dieser Aufgabe heruntergeladen, ohne die installierte CLI zu ersetzen. Ihre SHA-512-Prüfsumme wurde anhand dieser aufbewahrten Manifestantwort überprüft:

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

Das Paar aus Kontrolllauf und Lauf mit eigenem Agenten für das global gefundene Plugin und das Dateilesen wurde mit 1.5.12 wiederholt, mit derselben bestehenden Anmeldung und Berechtigungen vom Typ `request-review`. Der Kontrolllauf führte alle Plugin-Hook-Ereignisse aus, startete den MCP-Unterprozess und gab den Testwert zurück. Der eigene Agent gab `FILE_UNAVAILABLE` zurück und unterdrückte diese Hooks, startete aber weiterhin den MCP-Unterprozess. Beide Generierungsanfragen endeten mit Code 0. Die anderen Tabellenzeilen wurden nur mit 1.5.11 getestet.

`init.agent` im Stream benannte den ausgewählten eigenen Agenten, und ein separater Prompt unter 1.5.11 gab einen Marker zurück, der nur im Markdown-Text dieses Agenten definiert war. Allerdings führte `init.tools` für den Kontrolllauf und den eigenen Agenten dieselben eingebauten Tools auf, darunter `run_command` und `view_file`. Betrachte diese Bestandsliste nicht als schlüssigen Nachweis des tatsächlichen Tool-Zugriffs. Die Dateileseprüfung belegt das beobachtete Verhalten eines Tools; andere Tools müssen noch geprüft werden.

Globale Testdateien wurden nur an zuvor nicht vorhandenen Hook-/Manifestpfaden angelegt, mit exklusiver Dateierstellung und einer Bereinigung, die vor dem Entfernen ihren Inhalt prüfte. Beide temporären globalen Dateien wurden entfernt, und die dauerhaften CLI-Einstellungen stimmten mit ihren Prüfsummen vor dem Test überein. Die CLI behielt ihren normalen Gesprächszustand. Die Prüfungen ersetzten keine bestehende globale Konfiguration.

Die Prüfungen sahen keine Inhalte von Anmeldedaten ein; die Authentifizierung blieb innerhalb der offiziellen CLI.

Diese Live-Ergebnisse unter Windows belegen die Generierung mit Abonnementauthentifizierung und grenzen die ursprünglichen Bedenken zu Hooks ein. Sie reichen nicht zur Freigabe eines Adapters: Der MCP-Unterprozess eines global gefundenen Plugins startet weiterhin. Globale eigenständige MCP-Server, übernommene Skills/Regeln/Unteragenten, sämtliche handlungsfähigen Tools, Abbruch, Verhalten bei langer Stille und die tatsächliche Ausführung unter Linux/macOS bleiben ungeprüft. Die neueren Korrekturen an Plugin-Richtlinien und Sandbox im CLI-Änderungsprotokoll belegen nicht, dass eine gewöhnliche Anfrage über ein Endkundenabonnement sämtliche ausführbaren Anpassungen ausschließt.

## Erforderliche Nachweise vor der Auslieferung eines Adapters

1. Belege einen unterstützten Weg, globale und arbeitsbereichsbezogene Hooks, Plugins, Skills, Regeln, Unteragenten, MCP-Server und handlungsfähige Tools auszuschließen, bevor eine Anfrage sie ausführen kann. Die normale Kontoanmeldung bleibt in der offiziellen CLI; extrahiere oder kopiere keine Tokens.
2. Prüfe diesen Mechanismus mit der tatsächlichen offiziellen CLI gegen kontrollierte lokale Modell-Testumgebungen. Richte beobachtbare Testmarker für globale und arbeitsbereichsbezogene Hooks sowie Plugins/MCP ein, dazu Regeln und Tool-Anfragen. Prüfe sowohl den isolierten Lauf als auch Negativkontrollen, die zeigen, dass die Testmarker ohne Isolation beobachtbar sind.
3. Belege vor der Ausführung, dass der ausgewählte eigene Agent tatsächlich aufgelöst wird. Lehne nicht unterstützte Versionen, nicht aufgelöste Agentennamen, unbekannte Bestandsformate und uneindeutige Isolationsprüfungen ab; verlasse dich weder auf interne Protokollformulierungen noch auf eine scheinbar leere Tool-Liste beim Start.
4. Ergänze begrenzte Ein-/Ausgabe für Unterprozesse, private temporäre Dateien samt Bereinigung, Abbruch, die Behandlung von Fehler-Exitcodes und Ergebnisfehlern sowie Tests für aktivitätsabhängige Zeitlimits – auch für langes Nachdenken ohne sichtbaren Text. Rufe kontospezifische Modelle über den offiziellen Befehl ab und behalte das ausgewählte Modell sowie den unterstützten Denkaufwand bei.
5. Nutze die bestehenden Verbindungs-/Anbieterverträge. SDK-Optionen von Claude wie `settingSources: []` sind anbieterspezifisch; sie sind keine Optionen, die auf `agy` übertragen werden dürfen. Benenne verbleibende Prüflücken bei echter Authentifizierung, Abonnementabrechnung und physischen Plattformen ausdrücklich.

Die Windows-Ergebnisse für 1.5.11 und 1.5.12 erfüllen einige dieser Prüfpunkte, lassen aber einen reproduzierbaren Fehler beim Verhindern des Unterprozessstarts offen. #8143 bleibt als nicht geplant geschlossen; diese Nachprüfung öffnet das Issue nicht erneut und gibt keine Laufzeitarbeiten frei. Ohne Entscheidung eines Maintainers und abgeschlossene Eignungsprüfung darf kein Laufzeitanbieter hinzugefügt werden.
