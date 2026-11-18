# Server-Logging

Diese Seite erklärt, wie du Server-Logs von Marinara Engine liest und hilfreiche Log-Zeilen schreibst. Sie ergänzt den [Logging-Abschnitt in CONTRIBUTING.md](../../CONTRIBUTING.md#logging), ersetzt ihn aber nicht. Der gemeinsame Pino-Logger, Aufrufe mit Fehlerobjekt zuerst, Formatplatzhalter und die Tabelle mit vier Log-Stufen gelten weiterhin.

## Was jede Zeile enthält

Alle Serverzeilen stammen von einer Pino-Instanz: `logger` in `packages/server/src/lib/logger.ts`. Fastify nutzt sie über `loggerInstance`; `req.log`, `reply.log` und `app.log` sind daher ihre Kinder. Sie verwenden dieselben Serializer und übernehmen `LOG_LEVEL`-Hot-Reloads des Umgebungs-Watchers.

| Feld | Vorhanden bei | Bedeutung |
| --- | --- | --- |
| `pid` | jeder Zeile | Prozess-ID (Pino-Standard). |
| `hostname` | jeder Zeile | Hostname (Pino-Standard). |
| `bootId` | jeder Zeile | 8 Hexzeichen, bei jedem Prozessstart neu. Unterscheidet zwei Läufe in derselben Log-Datei. |
| `requestId` | jeder durch eine Anfrage ausgelösten Zeile | Identisch mit dem Antwortheader `x-request-id`. Steht sowohl auf `req.log`-Zeilen als auch auf Zeilen des gemeinsamen `logger` in Diensten. |
| `route` | Zeilen nach dem Body-Parsing | Passendes Routenmuster, etwa `/api/chats/:id`. Enthält nie die rohe URL. |

### Anfrage-IDs

`lib/request-logging.ts` gibt jeder Anfrage eine ID:

- Ein Client darf `x-request-id` senden. Der Server übernimmt 8 bis 80 Zeichen aus `A-Z a-z 0-9 . _ : -`; alles andere ersetzt er.
- Sonst erzeugt der Server eine UUID. Fastifys standardmäßiger `req-1`-Zähler begann bei jedem Start neu, sodass sich IDs wiederholten.
- Die ID geht im durch CORS freigegebenen Header `x-request-id` an den Client zurück. Fehlerberichte können sie nennen; `grep <id>` findet dann jede Zeile dieser Anfrage.

Die ID liegt in einem `AsyncLocalStorage`-Kontext (`lib/log-context.ts`). Ein Pino-Mixin kopiert sie auf jede Zeile. Du musst sie nicht weiterreichen: Selbst `logger.warn(err, "...")` tief in einem Dienst übernimmt sie automatisch. Nach dem Body-Parsing wird der Kontext erneut gesetzt, weil das Parsing im eigenen asynchronen Kontext des HTTP-Parsers läuft.

Der Kontext folgt allem, was innerhalb der Anfrage startet, auch Timern, Listenern und Kindprozessen. Beginnt Arbeit, die die Anfrage überlebt, etwa ein Timer, Poller oder Kindprozess, wird dieser Start in `runWithRootLogContext({}, fn)` eingeschlossen. Spätere Zeilen tragen dann nicht die ID der auslösenden Anfrage. Der lokale Sidecar macht dies für seine llama-server- und MLX-Prozesse; Decision- und Utility-Sidecar starten ebenso, damit ein später gemeinsam genutzter Prozess nicht die ID des ersten Aufrufers behält. Andere langlebige Arbeit aus einem Routenhandler behält dessen `requestId`, bis ihr Start ebenfalls so eingeschlossen wird.

### Anfragezeilen

`RequestLogController` ist Fastifys standardmäßiger `LogController` mit folgenden Änderungen:

- Das ID-Feld heißt `requestId`, nicht Fastifys `reqId`. Gespeicherte Suchen und Filter auf `reqId` brauchen den neuen Namen.
- Zeilen für `incoming request` und `Route ... not found` lassen Query-Strings weg, weil diese Tokens oder Suchtext enthalten können. Die Eingangszeile behält Fastifys andere `req`-Felder (`method`, `version`, `host`, `remoteAddress`, `remotePort`) und ergänzt `route`.
- Schließt ein Client eine Anfrage vorzeitig, erscheint eine `Client aborted request`-Zeile auf info. Fastify protokollierte hier nichts.

`LOG_DISABLE_REQUEST_LOGGING` funktioniert wie bisher und deaktiviert auch die Abbruchzeile.

Ein Terminal erhält pino-pretty-Zeilen: bei `pnpm dev` und bei einem Produktionsserver, dessen stdout ein Terminal ist (die Launcher). Produktionsausgaben an andere Ziele sind JSON, ein Objekt pro Zeile. `LOG_FORMAT=pretty|json` überschreibt diese Wahl. Der Termux-Launcher setzt `pretty`, weil seine Ausgabe über `tee` ins Terminal gelangt. pino-pretty blendet `hostname` (seinen Standard) und `bootId` aus; die JSON-Ausgabe behält beide.

## Startzeitablauf

`lib/startup-timeline.ts` misst jeden Startschritt:

```ts
const db = await startup.phase("storage.open", () => getDB());
```

- Jede Zeile enthält `event: "startup.phase"`, `stage`, `elapsedMs` (verstrichene Zeit) und `selfMs` (eigene Dauer ohne verschachtelte Phasen). Die Stufe folgt `selfMs`: debug unter 1 s, info über 1 s, warn über 15 s. Mit dem Standard `LOG_LEVEL=warn` erzeugt ein normaler Start keine Phasenzeilen, auch kein langsamer Erststart.
- Phasen sind verschachtelt. `app.build` in `index.ts` umfasst alle Phasen in `buildApp`. Da die Stufe von `selfMs` abhängt, meldet sich ein langsamer innerer Schritt nur einmal selbst. `app.build` bleibt auf debug, sofern seine eigene Arbeit außerhalb der inneren Phasen nicht langsam ist.
- Ein fehlgeschlagener Schritt wird nicht in der Phase protokolliert. Der Fehler wandert unverändert nach oben; `main().catch` in `index.ts` schreibt eine `startup.failed`-Zeile mit dem Schrittnamen (`startup.stageOf(err)`).
- Sobald der Server lauscht, schreibt `index.ts` eine info-Zeile `[startup] Ready in N ms` mit `event: "startup.ready"`, Phasenanzahl und den fünf größten `selfMs`-Werten.

Phasen fügen dem Log-Kontext kein `stage` hinzu. Während einer Phase gestartete Dienste behalten Timer; diese würden die Phase sonst über die gesamte Prozesslaufzeit tragen.

## Eine Zeile pro Fehler

Ein Fehler soll genau eine Zeile erzeugen, geschrieben von dem Code, der über das weitere Vorgehen entscheidet.

- **Protokollieren oder weiterwerfen, nicht beides.** Beim Weiterwerfen protokolliert der Aufrufer. Nützliche Zusatzdetails gehören auf debug, etwa der Tool-Name in `[agent-tools] ... failed`.
- **Ort der einen Zeile:**
  - unbekannte 500er: `middleware/error-handler.ts`
  - Agentenfehler: `executeAgent` (warn, da nicht kritisch)
  - fehlgeschlagene Chat-Generierung: der Haupt-catch in `generate.routes.ts`
  - Der zugehörige Anbieter-Code wirft und protokolliert nicht. Höchstens ergänzt er eine debug-Zeile mit Modellname und rohem Fehler, wie die Anbieter Grok CLI und Claude (Subscription). Claude (Subscription) wirft eine verständliche Meldung, die den SDK-Fehlertext bereits enthält; der SDK-Fehler wird deshalb nicht zusätzlich als `cause` angehängt. SSE-Fehler des Chats und Agentenfehlertexte hängen die Ursache an und würden denselben Text sonst doppelt zeigen.
- **Abbrüche sind info.** Nutzer-Stopp, geschlossener Tab oder abgebrochenes Signal sind erwartete Ergebnisse. Nutze `failureLevel(err)` oder `failureLevel(err, "warn")` aus `lib/log-context.ts`. Bei `isCancellation(err)` gleich true liefert es `"info"`. Ein `TimeoutError` ist ein echter Fehler, kein Abbruch.

  ```ts
  logger[failureLevel(err)](err, "[agent-batch] Batch call FAILED: %s", errMsg);
  ```

- **Ursache erhalten.** Umschließe mit `new Error("Could not save chat", { cause: err })`. Die Serializer für `err` und `error` ergänzen Meldung und Stack der Ursache (`caused by: ...`). Auch ein als `{ error }` protokollierter Error wird serialisiert und nicht mehr als `{}` ausgegeben.

## Wiederkehrende Fehler

Poller, Zustandsprüfungen und Hooks pro Zug können alle paar Sekunden gleich scheitern. Nutze `logRateLimited` aus `lib/log-rate-limit.ts`:

```ts
logRateLimited("warn", "autonomous-scheduler:poll", err, "[autonomous-scheduler] Poll failed");
```

Das erste Auftreten eines Schlüssels wird protokolliert. Weitere im Zeitfenster (standardmäßig 60 s) werden gezählt; die nächste Zeile enthält `suppressedRepeats`. Nimm die fehlschlagende Einheit, etwa Paket- oder Chat-ID, in den Schlüssel auf, damit ein defekter Eintrag keinen anderen verdeckt.

## Prompt- und Modelltext

Prompts, Modellausgaben, Anbieter-Antwortbodys und Polling-Bodys gehören auf **debug**, nie auf warn oder error. Sie können Geschichte des Nutzers enthalten; Anbieter-Bodys können Zugangsdaten oder Prompts wiederholen. Auf warn protokollierst du Größe (`rawLength`, `bodyLength`) und Grund. Eine JSON-Parsing-Fehlermeldung kann den problematischen Text zitieren: Auf warn deshalb nur den Fehlertyp schreiben. Fehler und Text selbst gehören auf eine separate debug-Zeile:

```ts
logger.warn(
  { errorType: err instanceof Error ? err.name : typeof err, rawLength: raw.length },
  "[game/scene-wrap] Failed to parse LLM response as JSON",
);
logger.debug({ err }, "[game/scene-wrap] Unparsed LLM response: %s", raw.slice(0, 200));
```

Der Debug-Schalter der Oberfläche funktioniert weiter über `logDebugOverride`. Das ist der vorgesehene Weg, Prompts auch dann zu sehen, wenn `LOG_LEVEL` debug ausblendet.

Gib Prompt-Text mit `%s` unverändert aus. Übergib bei einem strukturierten Wert (einem Nachrichtenarray, einem Anfragebody an einen Anbieter, einer geparsten Antwort) `debugJson(value)` an `%s`, nicht `%j` oder `JSON.stringify(value)`. Es gibt eingerücktes JSON aus, dessen Zeilenumbrüche innerhalb von Strings echte Zeilenumbrüche sind. So bleibt ein mehrzeiliger Prompt lesbar, und gerendert wird erst, wenn die Zeile ausgegeben wird. Ein Replacer zum Schwärzen kommt wie bei `JSON.stringify` ins zweite Argument. Eine Debug-Ansicht in der App gibt denselben Text mit `readableJson` aus `@marinara-engine/shared` aus. Der Regressionstest `debug-log-line-breaks` deckt das und die Formatwahl ab.

Inline-Medien landen nie vollständig im Log. `debugJson` ersetzt jede Base64-Nutzlast durch eine Markierung wie `[image/png base64, ~1.2 MB: iVBORw0KGgoAAAA...ElFTkSuQmCC]`: Typ, Größe sowie die ersten und letzten 16 Zeichen. Das erfasst `data:`-URLs (als ganze Strings oder innerhalb von Text) und die reinen `data`-Felder in Medienteilen von Anthropic und Google, auch bei Base64 über mehrere Zeilen. Der Serializer `msg` macht dasselbe für `data:`-URLs in einfachen `%s`- und `%j`-Zeilen; ein reines `data`-Feld wird nur durch `debugJson` gekürzt. Nur die ausgegebene Kopie ändert sich, der übergebene Wert bleibt immer unverändert. `LOG_INLINE_MEDIA=full` in `.env` gibt die Nutzlasten wieder vollständig aus. Der Regressionstest `log-inline-media` deckt das ab.

## Konsole in der App

Einstellungen → Erweitert → **Konsole öffnen** zeigt die letzten Serverzeilen in der App, für Installationen, deren Terminal nicht erreichbar ist (NAS, VPS, Docker, Termux).

- `lib/log-buffer.ts` hält die letzten 1.500 Zeilen im Arbeitsspeicher, höchstens etwa 4 Millionen Zeichen. Jede Nachricht und jeder Feldblock wird bei 16.000 Zeichen gekürzt. Nichts wird auf die Festplatte geschrieben, und ein Neustart leert den Puffer.
- `logger.ts` kopiert jede serialisierte Zeile über Pinos `hooks.streamWrite` hinein. Der Puffer enthält damit, was das Terminal oder die Log-Datei bekommen hat, mit demselben `LOG_LEVEL`. Zeilen, die Pino umgehen, etwa dotenv mit `injected env` oder die Rohausgabe eines Kindprozesses, fehlen darin.
- `GET /api/admin/logs?afterId=` liefert die Zeilen nach `afterId` sowie `latestId`, `truncated` (vor diesem Lesen wurden Zeilen verworfen) und den `logLevel` des Servers. Der Endpunkt liegt hinter `requirePrivilegedAccess` und ist `no-store`. Seine Route läuft mit `logLevel: "silent"`, damit die eigenen Abfragen der Konsole nie darin auftauchen.
- Die Regeln dieser Seite gelten auch hier: Alles, was du auf warn oder error protokollierst, liest ein entfernter Admin in der App. Lass Prompts und Anbieter-Bodys deshalb auf debug.

## Prüfungen

Die Regressionen `logging-request-trail`, `logging-failure-lines` und `logging-startup-timeline` decken diese Seite ab, und `server-console-logs` deckt die Konsole in der App ab:

```sh
node scripts/run-regressions.mjs --filter logging-
```
