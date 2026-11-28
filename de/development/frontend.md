# Frontend-Architektur (für Entwickler)

Dieser Text richtet sich an Entwickler, nicht an Endnutzer. Er beschreibt den Aufbau des Marinara-Engine-Clients: die Struktur der React-App, die Zustand-Stores, die React-Query-Hooks, die wichtigsten Komponenten und die Landkarte der Server-API. Wer die App einfach nur benutzen will, startet besser bei den Anleitungen.

## Überblick

Marinara Engine ist eine KI-Chat-Anwendung mit den Modi Conversation, Roleplay und Game. Der Client ist eine React-19-Single-Page-App, die Vite ausliefert. Das Styling übernimmt Tailwind CSS v4, ausgeliefert wird das Ganze als Progressive Web App (PWA).

Der Client liegt in `packages/client`. Er spricht über REST und Server-Sent Events (SSE) mit einem Fastify-API-Server (`packages/server`). Die gemeinsamen Datenverträge – Typen, Zod-Schemas, Konstanten – liegen in `packages/shared` und werden von beiden Seiten importiert.

## Architektur der Anwendung

### Layout der App-Hülle

`components/layout/AppShell.tsx` ordnet die obere Leiste, die mittlere Spalte und eine Seitenleiste an. Die Seitenleiste zeigt Chats oder ein Panel, nie beides. Standardmäßig dockt sie rechts an, bei `sidebarSide` gleich `"left"` links:

```
+-----------------------------------+----------------+
|  Center                           |  Sidebar       |
|                                   |                |
|  Chat area or Editor              |  Chats         |
|  (lazy-loaded)                    |  (chat list,   |
|                                   |  folders,      |
|  ChatConversationSurface          |  mode tabs)    |
|  ChatRoleplaySurface              |                |
|  GameSurface                      |  or a panel:   |
|  CharacterEditor                  |  Characters    |
|  LorebookEditor                   |  Personas      |
|  PresetEditor                     |  Lorebooks     |
|  ...other editors                 |  Presets, ...  |
+-----------------------------------+----------------+
```

- Seitenleiste (`[data-component="SidebarSlot"]` in `AppShell.tsx`): ein Platz auf dem Desktop. Innerhalb ihrer verschiebbaren Hülle (`SidebarSlotPanel`) liegen zwei Ebenen übereinander. `ChatSidebarPanel` rendert `components/layout/ChatSidebar.tsx`, die Chatliste mit Ordnern und den Modus-Tabs (Conversation, Roleplay, Game). Auf dem Desktop bleibt sie immer eingehängt, weil die Zähler ungelesener Nachrichten und die Benachrichtigungsblasen darüber geladen werden. `RightPanelDesktop` rendert `components/layout/RightPanel.tsx` und wird beim ersten Öffnen eines Panels eingehängt. Die verborgene Ebene ist `invisible`, `inert` und `aria-hidden`. Der Wechsel zwischen Chats und einem Panel erfolgt sofort; beim Öffnen oder Schließen gleitet die Seitenleiste hinein oder hinaus.
- Breite: Ein Trennelement an der inneren Kante der Seitenleiste (aria-label „Resize sidebar“) legt die gemeinsame Breite fest, von `SHARED_SIDEBAR_WIDTH_MIN` (280) bis `SHARED_SIDEBAR_WIDTH_MAX` (480). Lies sie mit `selectSharedSidebarWidth`; der Store hält `sidebarWidth` und `rightPanelWidth` gleich.
- Seite: Bei `sidebarSide: "left"` erhält der Platz die CSS-Eigenschaft `order: -1`. Er behält seine Position im React-Baum, sodass ein Seitenwechsel nie ein Panel neu einhängt. `--mari-chat-ui-inset-left` / `--mari-chat-ui-inset-right`, der Versatz des angedockten Tracker Panels und die Einrückungen eines nichtmodalen `Modal` folgen der Seite.
- Smartphones und Tablets: Wenn `isMobileShellViewport()` wahr ist (`MOBILE_SHELL_MEDIA_QUERY` oder ein für das angedockte Layout zu schmales Fenster), erscheint die Seitenleiste als bildschirmfüllendes Fenster von rechts, gerendert als `ChatSidebarPanel` oder `RightPanelMobile`. `sidebarSide` gilt dort nicht.
- Mittlere Spalte: entweder die aktive Chat-Fläche oder ein vollflächiger Editor (Charakter, Lorebook, Preset und so weiter). Sichtbar ist immer nur eines davon. Editoren ersetzen den Chatbereich.
- Panels (`components/layout/RightPanel.tsx`): ordnet `rightPanel` einer Panel-Komponente zu und lässt bereits besuchte Panels eingehängt. Siehe [Panel-System](#panel-system-componentspanels).
- Obere Leiste (`components/layout/TopBar.tsx`): Startseite und Chat-Informationen auf einer Seite. Auf der Seite der Seitenleiste enthält `[data-tour="panel-buttons"]` zuerst die Schaltfläche Chats (`[data-tour="sidebar-toggle"]`), dann je eine Schaltfläche pro Panel. Bei `sidebarSide: "left"` wird die Leiste gespiegelt (`flex-row-reverse`): Die Panel-Schaltflächen stehen links und Startseite ganz rechts. Auf Smartphones und Tablets bleibt Chats neben Startseite; auf Smartphones wandern Chats und die Panel-Schaltflächen ins Menü **Mehr**.

### Navigation

Die Navigation läuft über den Zustand, nicht über URLs – einen Router gibt es nicht. Was gerendert wird, steuert der Zustand-Store `stores/ui.store.ts`:

| Navigationsziel        | Store-Feld           | Auslösende Funktion                               |
| ---------------------- | -------------------- | ------------------------------------------------- |
| Charakter-Editor öffnen | `characterDetailId`  | `openCharacterDetail(id)`                          |
| Lorebook-Editor öffnen  | `lorebookDetailId`   | `openLorebookDetail(id)`                           |
| Preset-Editor öffnen    | `presetDetailId`     | `openPresetDetail(id)`                             |
| Verbindungs-Editor öffnen | `connectionDetailId` | `openConnectionDetail(id)`                         |
| Agent-Editor öffnen     | `agentDetailId`      | `openAgentDetail(id)`                              |
| Persona-Editor öffnen   | `personaDetailId`    | `openPersonaDetail(id)`                            |
| Ein Panel anzeigen | `rightPanel`         | `openRightPanel(name)` / `toggleRightPanel(name)` |
| Chats anzeigen | `sidebarOpen`        | `toggleSidebar()` / `setSidebarOpen(open)`        |
| Fenster öffnen          | `modal`              | `openModal(type, props?)`                          |

Chats und die Panels teilen sich die Seitenleiste, schließen sich also auf jeder Bildschirmgröße gegenseitig aus. `openRightPanel` und `toggleRightPanel` schließen Chats; `toggleSidebar` und `setSidebarOpen(true)` schließen das Panel. `setSidebarOpen(false)` lässt ein geöffnetes Panel unberührt. `selectSidebarShown` ist falsch, solange ein Panel geöffnet ist. Deshalb wird bei einem veralteten Zustand, in dem beide Flags wahr sind, das Panel angezeigt; beim Persistieren wird ein solches gespeichertes Paar auf das Panel allein reduziert.

### Code-Splitting

Die großen Editoren und schweren Komponenten lädt `AppShell.tsx` verzögert nach – über `React.lazy()` in Kombination mit `Suspense`. So bleibt das Initial-Bundle klein (siehe Bundle-Budget weiter unten).

## Zustandsverwaltung

### Zustand-Stores (Client-Zustand)

Für Oberflächen- und Laufzeitzustand nutzt der Client mehrere Zustand-Stores unter `packages/client/src/stores/`. Nur `ui.store.ts` wird persistiert. Die übrigen halten Laufzeitzustand für Chats, Agenten, Spiele, die lokale Modell-Laufzeit, Übersetzung, Dialogfenster und Backfill.

Aktuell existieren diese Store-Dateien: `agent.store.ts`, `backfill.store.ts`, `chat-tools-menu.store.ts`, `chat.store.ts`, `combat-screen.store.ts`, `conversation-games.store.ts`, `dialog.store.ts`, `encounter.store.ts`, `floating-window.store.ts`, `gallery.store.ts`, `game-asset.store.ts`, `game-mode.store.ts`, `game-state.store.ts`, `roleplay-sheet.store.ts`, `sidecar.store.ts`, `translation.store.ts` und `ui.store.ts`. Die Stores der Tischspiele sind in ihre herunterladbaren Pakete umgezogen; `conversation-games.store.ts` verfolgt nur noch die Spielauswahl und Einrichtung in Conversation. `combat-screen.store.ts` verfolgt, welche Kampfansicht und welche Runde angezeigt werden, damit die obere Leiste nur dann die Kampfsteuerung zeigt. `roleplay-sheet.store.ts` verfolgt, wessen Regelsatzbogen in einem Roleplay-Chat geöffnet ist.

#### `ui.store.ts`: Einstellungen und Oberflächenrahmen

Der einzige persistierte Store (localStorage über die Zustand-`persist`-Middleware). Er enthält:

- Theme: `visualTheme` („default“ oder „sillytavern“), den `data-theme`-Wert (dark oder light) und eigene Farbüberschreibungen.
- Darstellung: `fontSize`, `chatFontSize`, `fontFamily`, eigene Schriften und Cursor-Stil.
- Chat-Anzeige: `boldDialogue`, `showTimestamps`, `showModelName` und `messagesPerPage`.
- Textgestaltung: Chat-Textfarbe, Deckkraft des Nachrichtenhintergrunds im Roleplay und Textkontur.
- Streaming: `enableStreaming` und `streamingSpeed`.
- Conversation-Theme: Verlaufsfarben der Nachrichtenblasen.
- Ton: `convoNotificationSound` und `rpNotificationSound`.
- Verhalten: `confirmBeforeDelete`, `enterToSendRP`, `enterToSendConvo`, `weatherEffects` und `guideGenerations`.
- Navigation: `rightPanel`, `rightPanelOpen`, `sidebarOpen`, `settingsTab`, sämtliche `*DetailId`-Felder und `modal`.
- Seitenleistenlayout: `sidebarSide` (`"right"` oder `"left"`, Standard `"right"`, geräteübergreifend synchronisiert und durch `resetAppearanceSettings` auf `"right"` zurückgesetzt) sowie `sidebarWidth` / `rightPanelWidth` (werden gleich gehalten; lies sie mit `selectSharedSidebarWidth`).

Synchronisierte eigene Themes liegen nicht in `ui.store.ts`. Sie kommen per React Query vom Server und werden auf alle Geräte gespiegelt, die mit derselben Marinara-Instanz verbunden sind.

#### `chat.store.ts`: Chat-Laufzeit

Nicht persistiert. Verfolgt die aktive Chat-Sitzung:

- `activeChatId`: welcher Chat angezeigt wird.
- `messages`: das aktuelle Nachrichten-Array.
- `isStreaming`, `streamBuffer`: laufende Generierung.
- `inputDrafts`: Nachrichtenentwürfe pro Chat.
- `currentInput`: der aktuelle Wert des Chat-Eingabefelds.
- `perChatTyping`: Zustand der Tipp-Anzeige.
- `unreadCounts`, `chatNotifications`: Benachrichtigungs-Badges.
- `abortControllers`: laufende Generierungen abbrechen.

#### `agent.store.ts`: Agenten-Ausführung

Verfolgt den Zustand der Agenten-Pipeline während und nach der Generierung:

- `activeAgents`: gerade laufende Agenten.
- `thoughtBubbles`: die Überlegungen der Agenten, in Echtzeit angezeigt.
- `echoMessages`: die Echokammer (simulierter Zuschauer-Chat).
- `cyoaChoices`: die Oberfläche für Verzweigungsentscheidungen.
- `debugLog`: Leistungsdaten und Token-Verbrauch.
- `failedAgentTypes`: Agenten mit Fehler (für die Wiederholen-Oberfläche).

#### `game-state.store.ts`: RPG-Begleiter

Hält Szenen- und Weltkontext für den Roleplay Mode:

- `current` (GameState): Datum, Uhrzeit, Ort, Wetter, anwesende Charaktere, Ereignisse, Spielerwerte, Quests und Inventar.
- `isVisible`, `expandedSections`: Anzeigezustand des HUD (der Info-Leiste am oberen Chatrand).

#### `encounter.store.ts`: Kampfsystem

Zustand des zugbasierten Kampfs:

- `active`: ob gerade eine Begegnung läuft.
- `party`, `enemies`: Kämpfende mit HP, Angriffen und Statuswerten.
- `environment`: Details zur Arena.
- `playerActions`, `encounterLog`: Aktionswarteschlange und Verlauf.
- `combatResult`: Sieg, Niederlage, Flucht oder Abbruch.

#### `gallery.store.ts`: Bild-Overlays

- `pinnedImages`: Bilder, die als Overlay über dem Chatbereich angeheftet sind.

### React Query (Server-Daten)

Sämtliche Server-Daten laufen über TanStack React Query, konfiguriert in `lib/query-client.ts`:

- Stale Time: 30 Sekunden (globaler Standard).
- Wiederholung: 1 Versuch.
- Neuladen bei Fokus: deaktiviert.
- Cache: nur im Arbeitsspeicher, ohne Persistenz.

Zu jeder Entität gehört eine eigene Hook-Datei, die Query- und Mutation-Hooks exportiert.

## Hook-Referenz

Alle Hooks liegen in `src/hooks/` und folgen dem Muster `use-{entity}.ts`. Die Tabellen unten decken nur die wichtigsten Hooks ab; alle findest du in `packages/client/src/hooks/`.

### Chat-Hooks (`use-chats.ts`)

| Hook                               | Typ            | Beschreibung                                 |
| ---------------------------------- | -------------- | -------------------------------------------- |
| `useChats()`                       | Query          | Alle Chats                                   |
| `useChat(id)`                      | Query          | Einzelner Chat per ID                        |
| `useChatMessages(chatId, perPage)` | Infinite Query | Seitenweise Nachrichten eines Chats          |
| `useChatGroup(groupId)`            | Query          | Chat-Gruppe                                  |
| `useCreateChat()`                  | Mutation       | Neuen Chat anlegen                           |
| `useDeleteChat()`                  | Mutation       | Chat löschen                                 |
| `useUpdateChatMetadata()`          | Mutation       | Chat-Metadaten aktualisieren (Agenten, Sprites und mehr) |
| `useBranchChat()`                  | Mutation       | Chat ab einer bestimmten Nachricht verzweigen |
| `useUpdateMessage()`               | Mutation       | Nachrichtentext bearbeiten (optimistisches Update) |
| `useDeleteMessage()`               | Mutation       | Eine einzelne Nachricht löschen              |
| `useDeleteMessages()`              | Mutation       | Mehrere Nachrichten löschen                  |
| `useSetActiveSwipe()`              | Mutation       | Zu einem anderen Swipe wechseln              |
| `usePeekPrompt()`                  | Mutation       | Den fertig zusammengesetzten Prompt ansehen  |
| `useClearAllData()`                | Mutation       | Alles löschen (destruktiv)                   |

### Charakter-Hooks (`use-characters.ts`)

| Hook                   | Typ      | Beschreibung                           |
| ---------------------- | -------- | -------------------------------------- |
| `useCharacters()`      | Query    | Alle Charaktere                        |
| `useCharacter(id)`     | Query    | Einzelner Charakter mit geparsten Kartendaten |
| `useCreateCharacter()` | Mutation | Charakter anlegen                      |
| `useUpdateCharacter()` | Mutation | Charakterkarten-Daten aktualisieren    |
| `useDeleteCharacter()` | Mutation | Charakter löschen                      |
| `useUploadAvatar()`    | Mutation | Avatar-Bild hochladen                  |
| `usePersonas()`        | Query    | Alle Personas                          |
| `usePersona(id)`       | Query    | Einzelne Persona                       |
| `useCreatePersona()`   | Mutation | Persona anlegen                        |
| `useUpdatePersona()`   | Mutation | Persona aktualisieren                  |
| `useDeletePersona()`   | Mutation | Persona löschen                        |
| `useCharacterGroups()` | Query    | Charakter-Gruppen                      |
| `usePersonaGroups()`   | Query    | Persona-Gruppen                        |

### Preset-Hooks (`use-presets.ts`)

| Hook                           | Typ      | Beschreibung                                                |
| ------------------------------ | -------- | ---------------------------------------------------------- |
| `usePresets()`                 | Query    | Alle Presets                                               |
| `usePresetFull(id)` | Query | Ein Preset mit seinen Abschnitten, Gruppen und Variablen |
| `useDefaultPreset()`           | Query    | Das Standard-Preset                                        |
| `useUpdatePreset()`            | Mutation | Preset aktualisieren                                       |
| `useDeletePreset()`            | Mutation | Preset löschen                                             |
| `useDuplicatePreset()` | Mutation | Preset duplizieren |
| `useSetDefaultPreset()` | Mutation | Ein Preset zum Standard machen |
| `useCreateSection()` | Mutation | Einen Prompt-Abschnitt anlegen (daneben liegen Hooks zum Aktualisieren, Löschen und Umsortieren) |
| `useCreateGroup()` | Mutation | Eine Abschnittsgruppe anlegen (daneben liegen Hooks zum Aktualisieren und Löschen) |
| `useCreateVariable()` | Mutation | Eine Preset-Variable anlegen, früher ein Auswahlblock (daneben liegen Hooks zum Aktualisieren, Löschen und Umsortieren) |

### Agenten-Hooks (`use-agents.ts`)

| Hook                 | Typ      | Beschreibung                    |
| -------------------- | -------- | ------------------------------- |
| `useAgentConfigs()`  | Query    | Alle Agenten-Konfigurationen    |
| `useCreateAgent()`   | Mutation | Eigenen Agenten anlegen         |
| `useUpdateAgent()`   | Mutation | Agenten-Konfiguration aktualisieren |
| `useDeleteAgent()`   | Mutation | Agenten löschen                 |
| `useUpdateAgentByType()` | Mutation | Eine Agenten-Konfiguration anhand des Agententyps aktualisieren |

### Generierungs-Hook (`use-generate.ts`)

Der komplexeste Hook. Er liefert `{ generate, retryAgents }` zurück.

`generate(params)` erwartet ein einzelnes Options-Objekt mit Feldern wie `chatId`, `connectionId`, `userMessage`, `regenerateMessageId`, `continueMessageId`, `impersonate` und `attachments`. Läuft für denselben Chat bereits eine Generierung, gibt die Funktion `false` zurück. Der Ablauf:

1. Streaming-Zustand in `chat.store.ts` setzen.
2. Die Generierungsanfrage an `/api/generate` schicken.
3. SSE-Ereignisse auswerten, etwa `token`, `agent_start`, `agent_result`, `agent_error`, `thinking`, `tool_call`, `game_state`, `game_state_patch`, `text_rewrite`, `scene_created`, `done` und `error`.
4. Den React-Query-Cache um die neuen Nachrichten ergänzen.
5. Den Agenten-Store mit Gedankenblasen und Debug-Infos füllen.
6. Fehler über Toast-Benachrichtigungen melden.

### Weitere Hooks

Im Ordner `src/hooks/` stecken außerdem viele funktionsspezifische Hooks. Eine repräsentative Auswahl:

| Datei                          | Zweck                                     |
| ------------------------------ | ----------------------------------------- |
| `use-connections.ts`           | CRUD für API-Verbindungen samt Test       |
| `use-lorebooks.ts`             | CRUD für Lorebooks und Einträge            |
| `use-scene.ts`                 | Szenen planen, anlegen, abschließen        |
| `use-encounter.ts`             | Kampfbegegnung starten, Aktion, Zusammenfassung |
| `use-autonomous-messaging.ts`  | Abfrage und Zeitplanung autonomer Nachrichten |
| `use-idle-detection.ts`        | Erkennung von 10 Minuten Inaktivität      |
| `use-background-autonomous.ts` | Hintergrundabfrage für inaktive Chats     |
| `use-translate.ts`             | Textübersetzung                           |
| `use-apply-regex.ts`           | Regex-Skripte auf Nachrichten anwenden     |
| `use-custom-tools.ts` | CRUD für eigene Tools, Umsortieren und gemeinsames Ein- oder Ausschalten |
| `use-knowledge-sources.ts`     | Verwaltung der Wissensquellen              |
| `use-gallery.ts`               | Bilder der Chat-Galerie                    |
| `use-chat-folders.ts`          | CRUD für Chat-Ordner samt Sortierung       |
| `use-regex-scripts.ts`         | CRUD für Regex-Skripte                     |
| `use-haptic.ts`                | Verbindung und Befehle für Haptik-Geräte   |

## Komponenten-Überblick

### Chat-System (`components/chat/`)

Das Chat-System ist der umfangreichste Funktionsbereich. `ChatArea.tsx` lädt drei Render-Flächen verzögert nach: Conversation, Roleplay und Game Mode.

#### Conversation Mode (`ChatConversationSurface.tsx`)

Chat-Blasen wie im Messenger. Eigene Nachrichten rechts, die des Assistenten links. Enthalten sind:

- Seitenweises Nachladen beim Scrollen (ältere Nachrichten erscheinen, sobald du nach oben scrollst).
- Aktionen pro Nachricht: bearbeiten, kopieren, neu generieren, löschen, verzweigen, Prompt ansehen.
- Unterstützung für Anhänge (Bilder und Dateien).
- Emoji- und GIF-Auswahl.
- Slash-Befehle.
- Hinweistöne bei neuen Nachrichten.
- Entwürfe, die pro Chat erhalten bleiben.

#### Roleplay Mode (`ChatRoleplaySurface.tsx`)

Eine dunkle, dichte Oberfläche im RPG-Look. Sie bietet alles aus dem Conversation Mode und zusätzlich:

- Charakter-Sprites, deren Gesichtsausdruck der Expression-Agent steuert.
- Das Roleplay-HUD mit dem Spielzustand (Uhrzeit, Ort, Wetter, anwesende Charaktere).
- Wettereffekte – Partikel-Overlays passend zum Wetter der Szene.
- Das Panel der Echokammer (simulierte Zuschauerreaktionen).
- Kampfbegegnungen mit zugbasiertem Aktionssystem.
- Ein World-Info-Panel mit den gerade aktiven Lorebook-Einträgen.
- Ein Szenensystem für verzweigte Mini-Roleplays.
- Hintergrundbilder mit weichen Übergängen.

#### Game Mode (`GameSurface.tsx`)

Die Fläche für den KI-Game-Master. Sie liegt außerhalb des Chat-Ordners, nämlich in `components/game/GameSurface.tsx`. `ChatArea.tsx` rendert sie, sobald der Chat-Modus `game` ist. Sie liest die eigenen Game-Stores (`game-mode.store.ts`, `game-asset.store.ts`, `game-state.store.ts`) und steuert Sitzungen, Würfelwürfe, Fertigkeitsproben, Karten und Zug-Storyboards über die Hooks in `use-game.ts` und `use-game-storyboards.ts`.

#### Zentrale Komponenten

- `ChatArea.tsx`: der zentrale Dirigent. Holt alle Daten (Nachrichten, Charaktere, Personas), baut die Charakter-Zuordnung auf, ermittelt den Chat-Modus und rendert die passende Fläche.
- `ChatMessage.tsx`: rendert eine einzelne Nachricht mit Markdown, Swipe-Navigation, Bearbeitung und Aktionsmenüs. Für die Bearbeitung nutzt sie die unkontrollierte Unterkomponente `EditTextarea`, damit währenddessen keine Re-Renders anfallen.
- `ChatInput.tsx`: die Eingabe mit automatischer Höhenanpassung, gespeicherten Entwürfen, Vervollständigung für Slash-Befehle, Anhängen sowie Emoji- und GIF-Einfügung.

### Editor-Komponenten

Jeder Ressourcentyp hat einen vollflächigen Editor, der den Chatbereich ersetzt:

| Editor            | Datei                                         | Verwaltet                                                                       |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| Character Editor  | `components/characters/CharacterEditor.tsx`   | Felder der Charakterkarte, Avatar, Begrüßung, Persönlichkeit, System-Prompt, Metadaten |
| Lorebook Editor   | `components/lorebooks/LorebookEditor.tsx`     | Lorebook-Metadaten und Einträge mit Schlüsselwörtern, Aktivierungsregeln, Einfüge-Einstellungen |
| Preset Editor     | `components/presets/PresetEditor.tsx`         | Prompt-Abschnitte, Gruppen, Marker, Generierungsparameter, Auswahlblöcke        |
| Connection Editor | `components/connections/ConnectionEditor.tsx` | API-Anbieter, Basis-URL, Modell, Kontextfenster, Schalter                       |
| Agent Editor      | `components/agents/AgentEditor.tsx`           | Prompt-Vorlage, Phase, Verbindung, Werkzeuge und Einstellungen des Agenten      |
| Persona Editor    | `components/personas/PersonaEditor.tsx`       | Nutzer-Persona mit Name, Beschreibung, Werten und Avatar                        |

### Fenster-System (`components/modals/`)

Die Fenster rendert `components/layout/ModalRenderer.tsx`. Die Komponente liest `ui.store.modal` und rendert die passende Komponente innerhalb von `Suspense`. Die Fenster-Komponenten liegen unter `components/modals/`.

Aktuell gibt es unter anderem diese Fenstertypen (die Liste ist beispielhaft, nicht vollständig):

| Typ                        | Komponente                    | Zweck                                      |
| -------------------------- | ----------------------------- | ------------------------------------------ |
| `create-character`         | `CreateCharacterModal`        | Charakter schnell anlegen (Name und Avatar) |
| `create-connection`        | `CreateConnectionModal`       | Verbindung schnell anlegen                 |
| `create-persona`           | `CreatePersonaModal`          | Persona schnell anlegen                    |
| `create-lorebook`          | `CreateLorebookModal`         | Lorebook schnell anlegen                   |
| `create-preset`            | `CreatePresetModal`           | Preset schnell anlegen                     |
| `import-character`         | `ImportCharacterModal`        | Import aus Datei (JSON oder PNG)           |
| `import-connection`        | `ImportConnectionModal`       | Verbindungspaket importieren               |
| `import-lorebook`          | `ImportLorebookModal`         | Import aus Datei                           |
| `import-preset`            | `ImportPresetModal`           | Import aus Datei                           |
| `import-persona`           | `ImportPersonaModal`          | Import aus Datei                           |
| `character-card-update`    | `CharacterCardUpdateModal`    | Vom Agenten vorgeschlagene Kartenänderungen prüfen |
| `agent-write-approval`     | `AgentWriteApprovalModal`     | Zustimmung und Prüfung für Schreibzugriffe von Agenten |
| `docs-viewer`              | `DocsViewerModal`             | Dokumentation direkt in der App            |
| `st-bulk-import`           | `STBulkImportModal`           | Massenimport aus SillyTavern-Daten         |
| `about-me-viewer`          | `AboutMeViewerModal`          | Ein About Me aus dem Conversation Mode ansehen |
| `scene-prompt-preferences` | `ScenePromptPreferencesModal` | Einstellungen für Szenen-Prompts           |

Muster für Fenster: Alle nehmen `{ open, onClose }` entgegen, betten ihren Inhalt in die Basiskomponente `Modal` ein, nutzen Mutations für API-Aufrufe und zeigen den Ladezustand aus `mutation.isPending`.

### Panel-System (`components/panels/`)

Panels öffnen sich anstelle von Chats in der Seitenleiste und zeigen Ressourcenlisten mit Suche, Sortierung und Filtern. Ein Klick auf eine Ressource öffnet ihren vollflächigen Editor in der mittleren Spalte.

Panels werden in `RightPanel.tsx` an zwei Stellen registriert:

1. `PANEL_CONFIG`: Titel, Symbol und Verlaufsfarbe.
2. `RIGHT_PANELS` (in `right-panel-panels.ts`): die Komponenten-Zuordnung.

Panels behalten ihren Zustand über ein `mountedPanels`-Set, das in einem `useState` innerhalb von `RightPanel` liegt. Es hält fest, welche Panels bereits geöffnet waren. Einmal eingehängt, bleibt ein Panel im DOM (versteckt über `display: none` oder `aria-hidden`) und behält damit seinen Zustand. Das Set gehört zu einer einzelnen Einhängung von `RightPanel`. Wird es erneut eingehängt, etwa beim erneuten Öffnen des Fensters auf dem Smartphone, beginnt es nur mit dem aktuellen Panel.

### UI-Bausteine (`components/ui/`)

| Komponente         | Beschreibung                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `Modal`            | Basisfenster mit Klick auf den Hintergrund, Esc-Taste sowie Ein- und Ausblendanimation |
| `ColorPicker`      | Auswahl einer Volltonfarbe oder eines Verlaufs mit vorgegebenen Farbfeldern |
| `ExpandedTextarea` | Bildschirmfüllendes Portal-Overlay zum Bearbeiten langer Texte        |
| `EmojiPicker`      | Durchsuchbares Emoji-Popover (über ein Portal gerendert)              |
| `GifPicker`        | GIF-Suche über die Giphy-API                                          |
| `HelpTooltip`      | Symbol, das beim Draufzeigen einen über ein Portal platzierten Tooltip einblendet |
| `LibraryToolbar` | Die gemeinsame Werkzeugleiste aller Bibliothekspanels (siehe unten) |
| `EditorHeader` | Die gemeinsame Kopfzeile aller ganzseitigen Editoren (siehe unten) |

Alle UI-Komponenten arbeiten mit kontrollierten Props (value plus onChange) und rendern Overlays über Portale.

**Bibliothekspanels verwenden `LibraryToolbar`.** Die Panels für Charaktere, Personas, Lorebooks und Agenten sowie die Tabs des Presets-Panels rendern ihre oberen Bedienelemente darüber: eine optionale Bibliothekszeile (eine Schaltfläche über die volle Breite oder das Paar Herunterladen / Bibliothek öffnen), Erstellen / Importieren / Exportieren / Auswählen, Suche mit dem gemeinsamen Sortiermenü, Neuer Ordner und dann die Panelfilter als `children`. Die Zeilen sind typisierte Props, keine Slots. So erhält ein neues Bibliothekspanel dasselbe Markup statt einer Kopie, die auseinanderläuft. Ergänze dort eine Prop, statt im Panel eine eigene Werkzeugleiste zu bauen.

`LibraryToolbar.tsx` exportiert außerdem `SegmentedButtons`, eine lange Schaltfläche mit `.mari-chrome-segmented`, unterteilt durch `|`. Sie stellt das Paar Herunterladen / Bibliothek öffnen und die Tabs **Prompts** / **Regex-Skripte** / **Tools** / **Profile** des Presets-Panels dar, damit die oberste Zeile jedes Panels dieselbe Höhe hat. Mit `groupLabel` wird die Zeile zu einer Tab-Gruppe mit `role="group"`; `pressed` setzt das `aria-pressed` jedes Tabs. `.mari-chrome-segmented` hat `flex-shrink: 0`, sodass der eigene Flex-Scrollbereich eines Panels mit fester Höhe (wie bei Charakteren) die Zeile nicht zusammendrücken kann.

**Ganzseitige Editoren verwenden `EditorHeader`.** Er zeichnet Zurück, die Symbolkachel, den Namen, optionale Abschnittstabs, Aktionen und Schließen in zwei Layouts. Mit `nav` (Abschnittstabs) richten die Dichteregeln von `mari-editor-header--with-nav` alles an den Tabs aus. Ohne diese Tabs bekommen Aktionen auf Handys eine eigene Zeile und Save zeigt dort nur sein Symbol. Name, Kachelinhalt und Buttons sind Slots, sodass jeder Editor sein Namensfeld und seine Bedienelemente behält. Baue Buttons mit `EditorSaveButton` und `EditorHeaderAction`: Ihr Label dient immer als Tooltip und barrierefreier Name. Ergänze dort einen Slot oder Part, statt einen eigenen Editor-Header zu bauen.

## API-Client (`lib/api-client.ts`)

Die gesamte Kommunikation mit dem Server läuft über das `api`-Objekt:

```typescript
import { api, ApiError } from "@/lib/api-client";
```

| Methode                        | Signatur            | Beschreibung                          |
| ------------------------------ | ------------------- | ------------------------------------- |
| `api.get<T>(path)`             | `GET /api{path}`    | JSON abrufen                          |
| `api.post<T>(path, body)`      | `POST /api{path}`   | JSON senden, JSON empfangen           |
| `api.put<T>(path, body)`       | `PUT /api{path}`    | Vollständige Aktualisierung           |
| `api.patch<T>(path, body)`     | `PATCH /api{path}`  | Teilweise Aktualisierung              |
| `api.delete(path)`             | `DELETE /api{path}` | Ressource löschen                     |
| `api.upload(path, FormData)`   | `POST /api{path}`   | Datei-Upload als Multipart            |
| `api.download(path, filename)` | `GET /api{path}`    | Download mit Speichern-unter-Dialog   |
| `api.streamEvents(path, body)` | `POST /api{path}`   | Asynchroner SSE-Generator (alle Ereignistypen) |

Fehler werfen `ApiError` – dieses Objekt trägt die Eigenschaften `status` und `message`.

## Auswahlfelder und Dropdown-Menüs

Jedes Bedienelement zur Auswahl eines Werts öffnet dasselbe gemeinsame Auswahlfenster. Eine Designänderung an Auswahlen (Oberfläche, Zeilenstil, Breite) gehört in die unten aufgeführten gemeinsamen Komponenten, nie in eine einzelne Funktion. Verwende weder ein natives `<select>` noch eine selbst gezeichnete Liste in einem eigenen Popover: Beides gibt es in der App nicht mehr.

| Ebene | Datei | Zuständigkeit |
| --- | --- | --- |
| Fenster | `components/ui/PickerWindow.tsx` | Die Oberfläche. Auf dem Desktop ist sie ein Popover neben dem Feld, so breit wie für die Zeilen nötig (mindestens so breit wie das Feld, höchstens 352 px oder bei einem breiteren Feld dessen Breite). Auf dem Smartphone ist sie ein von unten eingeblendetes Fenster (ein `Modal`); innerhalb eines `Modal` bleibt sie ein Popover, damit nie zwei solche Fenster übereinanderliegen. Escape, Zurück, ein Klick außerhalb oder das Herausscrollen des Felds aus dem sichtbaren Bereich schließen sie. |
| Zeilen | `components/ui/PickerParts.tsx` | `PickRow` (eine Zeile: Bild, Titel, eine auf zwei Zeilen umbrechende zweite Textzeile, Badge, Häkchen oder Kontrollkästchen), `PickerSearch`, Ordnerüberschriften und `usePickerKeyboard` (Pfeiltasten, Enter). |
| Liste | `components/ui/PickerFolderList.tsx` | Der Inhalt: Suchfeld, nach Bibliotheksordnern oder `group` gruppierte Zeilen, Einfach- oder Mehrfachauswahl, „Alle hinzufügen“ pro Ordner. |
| Felder | `components/ui/Select.tsx` | `Select`: ein Wert aus einer festen Liste, der Ersatz für ein natives `<select>`. Ein Combobox-Auslöser, Suche ab `SELECT_SEARCH_MIN` Optionen, Pfeiltasten und Auswahl durch Tippen im geschlossenen Feld. |
| | `components/ui/PickerField.tsx` | `PickerField` (ein Eintrag mit einer Zeile „Keine“ und Ordnern), `PickerListField` / `PickerListWindow` (mehrere Einträge; die Auswahl wird unter dem Feld mit Schaltflächen zum Entfernen aufgelistet) und `useFieldWindow` (Öffnungszustand und Fokus zurück auf das Feld beim Schließen). |
| | `components/ui/LibraryPickers.tsx`, `components/characters/CharacterSelect.tsx` | Die aus den obigen Komponenten aufgebauten Felder für Presets, Lorebooks, Charaktere und Personas. |

So fügst du eine Auswahl hinzu:

- **Ein Wert aus einer Liste:** `Select`. Gib ein `label` an: Es benennt das Feld und gibt dem Fenster seinen Titel.
- **Ein Bibliothekseintrag** (mit Ordnern, Bildern, einer Zeile „Keine“): `PickerField` oder das passende Feld in `LibraryPickers.tsx`.
- **Mehrere Einträge:** `PickerListField`. Escape und Klicks außerhalb schließen das Fenster; eine Auswahl lässt es offen.
- **Etwas, das kein Feld ist** (eine Schaltfläche, die eine kurze Auswahl öffnet, etwa „Mit Unterhaltung verknüpfen“): `useFieldWindow` für Öffnungszustand und Fokus, ein an der Schaltfläche verankertes `PickerWindow` und darin `PickerFolderList` oder `PickRow`s.

Noch nicht auf die gemeinsame Auswahl umgestellt: die Verbindungs- und Modellauswahl (`ConnectionSelect` / `ModelPicker`, mit eigenem Fenster). Andere Bedienelemente mit eigenen Oberflächen sind keine Auswahlen: Symbolgalerien (`StatIconPicker`), Tag-Autovervollständigung, Kontext- und Aktionsmenüs.

**Tests.** Ein `Select`-Auslöser hat `role="combobox"`, seinen ausgewählten Wert in `data-value` und ein Fenster mit der Rolle `dialog`, das nach dem Feldlabel benannt ist. Zeilen tragen `data-pick-row`; die gewählte Zeile einer Einfachauswahl hat `aria-current="true"`, Zeilen einer Mehrfachauswahl haben `aria-pressed`. `e2e/select-field.ts` enthält `chooseOption` und `pickerLabels`, die Playwrights `selectOption` für die alten nativen Select-Felder ersetzen.

## Styling-System

### Tailwind CSS v4

Das Projekt setzt Tailwind CSS v4 mit dem Plugin `@tailwindcss/vite` ein; eine PostCSS-Konfiguration braucht es dafür nicht. Die Theme-Token bilden CSS-Custom-Properties aus `globals.css` ab:

```css
@theme {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-border: var(--border);
  /* ... */
}
```

### Aufbau der Themes

`globals.css` ist in benannte Abschnitte gegliedert. Dazu zählen die Tailwind-`@theme`-Zuordnung, die Variablen des dunklen Themes, die Überschreibungen für das helle Theme, das Basis-Reset, eigene Cursor, Scrollleisten, Glas-Panels, Glow-Utilities, UI-Komponenten und Keyframe-Animationen. Weitere Abschnitte decken Chat-Animationen, das Chat-Styling je Modus, Sprites und Game-HUD, Function-Call-Karten, Regeln für responsives Verhalten, das importierte SillyTavern-Theme, Barrierefreiheit und Performance-Hinweise ab.

### Eigene Themes

Nutzer können eigene Themes anlegen. Die Theme-Definitionen liegen auf dem Marinara-Server und werden auf alle verbundenen Geräte synchronisiert – das gilt auch für das gerade aktive eigene Theme. Das CSS fügt `CustomThemeInjector.tsx` als `style`-Tag ein.

Synchronisiertes Theme-CSS kann die eingebaute Accent-Pulse-Engine mit `--marinara-theme-accent-pulse: enabled` anfordern. Ergänze `--marinara-theme-accent-pulse-source: #a78bfa` (oder einen Verlauf), wenn der Puls eine bestimmte Theme-Akzentfarbe statt der aktuellen Akzentfarbe aus der Darstellung verwenden soll.

### Personal Extensions

Personal Extensions sind auf dem Server gespeicherter Sandbox-Code, der per exaktem Hash freigegeben wird. Die Addons-Oberfläche nutzt `use-personal-extensions.ts`; `PersonalExtensionInjector.tsx` führt freigegebenen Browser-Code in einem eigenen Worker innerhalb eines Sandbox-iframes mit undurchsichtigem Ursprung aus und vermittelt unveränderliche Snapshots des aktiven Chat-Kontexts. Die Kontextfelder sind immer vorhanden; außerhalb eines aktiven Chats sind `chatId` und `characterId` `null`, und `characterIds` ist leer. Begrenzte Felder der aktiven Charakterkarte und der ausgewählten Persona brauchen separat deklarierte, an den Hash gebundene Berechtigungen. Server-Erweiterungen laufen in einem separaten Node-Prozess unter macOS Seatbelt oder Linux Bubblewrap und verweigern den Start, wenn keines von beidem verfügbar ist. Für externe Quellen braucht es zusätzlich die `.env`-Freigabe und das Opt-in in der Danger Zone – geprüft beim Auflisten, bei der Freigabe und zur Laufzeit.

Lies [Architektur der Personal Extensions](personal-extensions.md), bevor du an dieser Funktion etwas änderst.

## Gemeinsames Paket (`packages/shared`)

Das Frontend importiert Typen, Schemas und Konstanten aus `@marinara-engine/shared`.

### Konstanten

Die wichtigsten Dateien in `packages/shared/src/constants/`:

- `defaults.ts`: exportiert unter anderem `APP_VERSION`, `PROFESSOR_MARI_ID`, `DEFAULT_CONNECTION_ID`, `DEFAULT_GENERATION_PARAMS`, `MAX_FILE_SIZES` und `LIMITS`. Hier steht die Version, und hier liegen die Standardwerte für die Generierung.
- `providers.ts`: exportiert `PROVIDERS`, also die Konfigurationen der API-Anbieter (OpenAI, Anthropic, Google und weitere) samt URLs und Authentifizierung.
- `model-lists.ts`: statische Modellkataloge je Anbieter, dazu `IMAGE_GENERATION_SOURCES` für die Anbieter der Bildgenerierung.
- `agent-prompts.ts`: die Basis-Prompts für Zusammenfassung und Secret Plot sowie das Nachschlagen der Prompts zur Laufzeit, die installierte Agenten-Pakete mitbringen.

### Schemas (Zod)

Alle Eingaben werden über Zod-Schemas aus `packages/shared/src/schemas/` geprüft. Repräsentative Dateien:

| Schema-Datei            | Entitäten                                                          |
| ----------------------- | ------------------------------------------------------------------ |
| `agent.schema.ts`       | AgentConfig anlegen und aktualisieren, Agenten-Phasen, Ergebnistypen |
| `character.schema.ts`   | Charakterkarten, Kompatibilitäts-Metadaten, Character Books, Gruppen |
| `chat.schema.ts`        | Chat anlegen, Nachricht anlegen, Generierungsanfrage              |
| `connection.schema.ts`  | API-Verbindung anlegen und aktualisieren                           |
| `custom-tool.schema.ts` | Definitionen eigener Werkzeuge                                     |
| `lorebook.schema.ts`    | Lorebook und Eintrag anlegen/aktualisieren, Aktivierungsbedingungen, Zeitpläne |
| `prompt.schema.ts`      | Preset, Abschnitt, Gruppe, Auswahlblock, Generierungsparameter     |
| `regex.schema.ts`       | Regex-Skript anlegen und aktualisieren                             |
| `personal-extension.schema.ts` | Entwürfe für Personal Extensions, Freigabe per exaktem Hash, Rücknahme und privater Speicher |

Im selben Ordner liegen außerdem Schemas für App-Einstellungen, Chat-Einstellungsprofile, Conversation-Anrufe, eigene Emojis und Sticker, Noodle und Themes.

### Typen

Die Typdefinitionen der Entitäten liegen in `packages/shared/src/types/`. Eine Auswahl der wichtigsten Dateien:

| Typ-Datei             | Zentrale Interfaces                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `agent.ts`            | `AgentConfig`, `AgentResult`, `AgentContext`, `ToolDefinition`, `ToolCall`, `ToolResult`, `BUILT_IN_AGENTS` |
| `character.ts`        | `Character`, `CharacterCardV2`, `CharacterData`, `RPGStatsConfig`                                           |
| `chat.ts`             | `Chat`, `ChatMetadata`, `Message`, `MessageExtra`, `GenerationInfo`, `StreamEvent`                          |
| `connection.ts`       | `APIConnection`, `ModelInfo`, `ModelCapabilities`, `ConnectionTestResult`                                   |
| `combat-encounter.ts` | `CombatPartyMember`, `CombatEnemy`, `CombatActionResult`, `EncounterSettings`                               |
| `game-state.ts`       | `GameState`, `PresentCharacter`, `PlayerStats`, `QuestProgress`, `InventoryItem`                            |
| `lorebook.ts`         | `Lorebook`, `LorebookEntry`, `ActivationCondition`, `LorebookSchedule`, `QuestData`                         |
| `persona.ts`          | `Persona`, `PersonaStatsConfig`                                                                             |
| `personal-extension.ts` | `PersonalExtension`, Laufzeit-Metadaten, Revisionen, Quelle und Server-Laufzeitzustand                     |
| `prompt.ts`           | `PromptPreset`, `PromptSection`, `PromptGroup`, `ChoiceBlock`, `GenerationParameters`                       |
| `scene.ts`            | `SceneMeta`, `SceneFullPlan`                                                                                |
| `haptic.ts`           | `HapticDevice`, `HapticStatus`, `HapticDeviceCommand`                                                       |

### Hilfsfunktionen

| Datei             | Zweck                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `macro-engine.ts` | `resolveMacros(template, context)`: ersetzt Makros wie `{{date}}`, `{{char}}`, `{{random}}`, `{{roll:2d6}}` und `{{getvar::name}}`     |
| `xml-wrapper.ts`  | `nameToXmlTag()`: wandelt einen Anzeigenamen in einen XML-Tag-Slug um (aus „World Info (Before)“ wird „world_info_before“)                           |

## API-Endpunkte

Der Server (`packages/server`) stellt REST-APIs unter `/api` bereit. Was folgt, ist eine grobe Landkarte, keine vollständige Liste. Maßgeblich sind die Datei `packages/server/src/routes/index.ts` und die einzelnen Route-Dateien.

### Kernressourcen

| Präfix               | Methoden                 | Beschreibung                                                                               |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------------- |
| `/api/characters`    | GET, POST, PATCH, DELETE | CRUD für Charaktere, Gruppen, Export (JSON oder PNG)                                        |
| `/api/chats`         | GET, POST, PATCH, DELETE | CRUD für Chats, Nachrichten, Metadaten, verbinden und trennen                              |
| `/api/prompts`       | GET, POST, PATCH, DELETE | CRUD für Presets, Abschnitte, Gruppen, Auswahlblöcke, Export                               |
| `/api/connections`   | GET, POST, PATCH, DELETE | CRUD für API-Verbindungen, duplizieren, testen                                             |
| `/api/agents`        | GET, POST, PATCH, DELETE | CRUD für Agenten, Echo-Nachrichten, Läufe; mitgelieferte Agenten schaltet `PUT /api/agents/toggle/:agentType` |
| `/api/lorebooks`     | GET, POST, PATCH, DELETE | CRUD für Lorebooks, Einträge, Export                                                       |
| `/api/custom-tools` | GET, POST, PUT, PATCH, DELETE | CRUD für eigene Tools, `PUT /reorder` und `PUT /enabled` |
| `/api/regex-scripts` | GET, POST, PUT, PATCH, DELETE | CRUD für Regex-Skripte, `PUT /reorder` und `PUT /enabled` |
| `/api/library-folders/regex` | GET, POST, PATCH, DELETE | CRUD für Regex-Ordner, Pause-Status und `POST /move` |
| `/api/library-folders/functions` | GET, POST, PATCH, DELETE | CRUD für Ordner eigener Tools, Pause-Status und `POST /move` |

`PUT /api/regex-scripts/enabled` akzeptiert `scriptIds` und `enabled`. Fehlt eine ID, gibt der Endpunkt 404 zurück und ändert kein Skript. Die Regex-Liste enthält `pausedByFolder` getrennt vom gespeicherten Status `enabled`. `PUT /api/custom-tools/enabled` funktioniert genauso mit `toolIds`, und auch die Liste eigener Tools enthält `pausedByFolder`. Ein Tool in einem pausierten Ordner wird dem Modell nie angeboten.

Die Gedächtnis-Werkzeuge der Agenten laufen über `/api/agents/memory/:agentType/:chatId`. Dabei ist `agentType` der Typ-String des Agenten und `chatId` die ID des Ziel-Chats.

### Generierung

| Endpunkt                     | Methode | Beschreibung                                         |
| ---------------------------- | ------ | ---------------------------------------------------- |
| `/api/generate`              | POST   | Die zentrale SSE-Generierung samt Agenten-Pipeline    |
| `/api/generate/retry-agents` | POST   | SSE-Wiederholung für die vom Aufrufer genannten Agententypen |

### Chat-Funktionen

| Präfix                    | Endpunkte                        | Beschreibung                 |
| ------------------------- | -------------------------------- | ---------------------------- |
| `/api/chat-folders`       | CRUD plus Sortierung             | Verwaltung der Chat-Ordner   |
| `/api/conversation` | schedule, status, activity, autonomous | System für autonome Nachrichten |
| `/api/scene`              | create, plan, conclude           | Szenenverzweigung            |
| `/api/encounter`          | init, action, summary            | Kampfbegegnungen             |
| `/api/translate`          | POST                             | Textübersetzung              |
| `/api/game`               | CRUD und Aktionen                | Sitzungen und Zustand im Game Mode |
| `/api/game-assets`        | CRUD und Upload                  | Game-Assets                  |
| `/api/game-rulesets`      | Import, Schema, Quelle, Entfernen | Importierte Game Mode-Regelsätze |
| `/api/game-worlds`        | CRUD der Bibliothek und Weltbearbeitung | Weltbibliothek für neue Spiele und Kartenpakete |
| `/api/game-tile-packs`    | Tile-Pakete, dazu `/creatures` und `/boards` | Grafikpakete für Karten, Kreaturen und Kampfbretter |
| `/api/turn-games` | catalog, state, start, move, resign | Tischspiele in Conversation (die Spiele kommen aus Paketen) |
| `/api/conversation-calls` | Routen für Anrufe und Sitzungen (vom Paket für Conversation-Anrufe registriert) | Audio-Anrufe in Conversation |

### Medien und Assets

| Präfix                        | Beschreibung                 |
| ----------------------------- | ---------------------------- |
| `/api/avatars/file/:filename` | Ausliefern von Avatar-Bildern |
| `/api/backgrounds`            | CRUD für Hintergründe samt Upload |
| `/api/sprites/:characterId`   | Verwaltung der Sprite-Gesichtsausdrücke |
| `/api/fonts`                  | Verwaltung eigener Schriften |
| `/api/gallery/:chatId`        | Galerie-Bilder eines Chats   |
| `/api/global-gallery`         | Bilder der globalen Galerie  |
| `/api/tts`                    | Routen für Text to Speech (Sprachausgabe) |
| `/api/speech-to-text`         | Einstellungen und Test des Speech-to-Text-Servers |
| `/api/avatar-models`          | 2D- und 3D-Avatar-Modelle für die Avatar-Agenten |
| `/api/avatar-generation`      | Avatar-Entwürfe aus Sprites und der Tripo-Key |
| `/api/avatar-classify`        | Emotionsklassifikator für Avatare und sein lokales Modell |
| `/api/youtube`                | Routen für den YouTube-DJ    |
| `/api/custom-emojis`          | Eigene Emoji-Assets          |
| `/api/custom-stickers`        | Eigene Sticker-Assets        |
| `/api/gifs/search`            | GIF-Suche (Giphy-Proxy)      |

### Externe Integrationen

| Präfix                          | Beschreibung                 |
| ------------------------------- | ---------------------------- |
| `/api/bot-browser/chub/*`       | Charaktersuche auf Chub      |
| `/api/bot-browser/janny/*`      | Suche auf JannyAI            |
| `/api/bot-browser/pygmalion/*`  | Suche auf Pygmalion          |
| `/api/bot-browser/wyvern/*`     | Suche auf Wyvern             |
| `/api/bot-browser/datacat/*`    | Suche auf DataCat            |
| `/api/haptic/*`                 | Steuerung von Haptik-Geräten |
| `/api/spotify/*`                | Spotify-Anmeldung            |
| `/api/knowledge-sources`        | Wissensbasis für die Abfrage |

### System

| Endpunkt                        | Beschreibung                            |
| ------------------------------- | --------------------------------------- |
| `/api/updates/check` | Versionsabgleich mit den GitHub-Releases; bei Git-Installationen auch der Abstand der Entwicklungs-Installation zu ihrem Update-Kanal |
| `/api/updates/channel` | Update-Kanal, aktueller Branch und Kanalliste |
| `/api/updates/apply` | Ein Update einspielen |
| `/api/backup`                   | Vollständiges Backup, Export, Import    |
| `/api/import/*`                 | Profil-Import aus SillyTavern und Marinara |
| `/api/admin/clear-all`          | Alle Daten löschen                      |
| `/api/themes`                   | Synchronisierte eigene Themes           |
| `/api/personal-extensions`      | Richtlinien, Entwürfe, Freigabe, Laufzeit und privater Speicher der Sandbox-Erweiterungen |
| `/api/app-settings`             | App-Einstellungen auf Serverseite       |
| `/api/sidecar`                  | Laufzeit für lokale Modelle             |
| `/api/chat-presets`             | Chat-Einstellungsprofile (Endpunktname aus Alt-Zeiten) |
| `/api/connection-folders`       | Ordner für Verbindungen                 |
| `/api/prompt-overrides`         | Überschreibungen mitgelieferter Prompts |
| `/api/achievements`             | Freigeschaltete Errungenschaften        |
| `/api/capability-packages`      | Agenten-Katalog, Installationen, Updates, Release Notes und Paket-Assets |
| `/api/noodle`                   | Die soziale Timeline von Noodle (vom Noodle-Paket registriert) |
| `/api/professor-mari/workspace` | Workspace-Operationen von Professor Mari |
| `/api/professor-mari/quick`     | Schnelle Antworten von Professor Mari und das Übernehmen ihrer Änderungsvorschläge |

## PWA-Unterstützung

Die App ist eine Progressive Web App, konfiguriert über VitePWA:

- Manifest: `public/manifest.json` mit dem App-Namen „Marinara Engine“, dem Anzeigemodus standalone und dunklem Theme.
- Symbole: ein 64px-Favicon, maskierbare Symbole in 192px und 512px sowie ein Splash-Logo.
- Service Worker: Workbox mit `registerType: "prompt"`, sodass eine neue Version wartet, bis der Nutzer sie annimmt.
- Caching: statische Assets werden zwischengespeichert; `/api/*`-Routen laufen mit NetworkOnly.
- Keep-alive: `lib/keep-alive.ts` nutzt die Web Locks API und BroadcastChannel-Pings, damit der Tab nicht einschläft.

### Erkennung von Versionsunterschieden

`App.tsx` fragt alle 5 Minuten `/api/health` ab. Weicht die Server-Version von der zwischengespeicherten Client-Version ab, lädt sich der Client über `forceRefreshSpa` in `lib/browser-runtime.ts` neu. Diese Funktion meldet den Service Worker ab und leert die Caches.

## Agenten-System

Das Agenten-System verarbeitet KI-Antworten über konfigurierbare Pipelines. Agenten laufen in drei Phasen:

1. Vor der Generierung: vor dem eigentlichen LLM-Aufruf, etwa zum Einfügen von Kontext oder zum Abrufen von Wissen.
2. Parallel: gleichzeitig zur Hauptgenerierung, etwa für Weltzustand oder Kampf.
3. Nachbearbeitung: nach der Hauptantwort, etwa zum Umschreiben der Prosa oder zum Aktualisieren von Lorebooks.

Wiederholungsanfragen gehen an `/api/generate/retry-agents`, zusammen mit einer expliziten `agentTypes`-Liste. Eine übergreifende Aktion wie **Re-run Trackers** (Tracker erneut ausführen) übergibt alle aktiven Tracker-Typen. Ein einzelnes Widget-Bedienelement übergibt nur seinen eigenen Tracker.

Die Gedächtnis-Werkzeuge der Agenten – etwa das Secret-Plot-Panel des Narrative Director – laufen über `/api/agents/memory/:agentType/:chatId`. Die Route gilt für konfigurierte Agenten, die je Chat ein Gedächtnis speichern. In aktuellen Konfigurationen liegt das Secret-Plot-Gedächtnis unter `director`; für ältere Chats wird `secret-plot-driver` weiterhin akzeptiert.

### Herunterladbare Agenten aus erster Hand

Die schlanke Engine startet mit einer leeren Agenten-Registry zur Laufzeit. Erst Pakete aus dem öffentlichen Katalog [Pasta-Devs/Marinara-Agents](https://github.com/Pasta-Devs/Marinara-Agents) steuern geprüfte Agenten-Manifeste, Client- und Server-Einstiegspunkte sowie UI-Slots zur Laufzeit bei. Der Kompatibilität halber liegen die aktiven Definitionen weiterhin unter `BUILT_IN_AGENTS` – sie stammen aber aus installierten Paketen, nicht aus mitgelieferten Implementierungen. Der offizielle Katalog enthält diese Pakete:

| Agent                    | Phase           | Aufgabe                                                           |
| ------------------------ | --------------- | ----------------------------------------------------------------- |
| `prose-guardian`         | post_processing | Wacht über die Schreibqualität (keine Wiederholungen, zeigen statt erzählen) |
| `continuity`             | post_processing | Erkennt Widersprüche und kann Hinweise zum Umschreiben liefern    |
| `director`               | pre_generation  | Fügt Erzählvorgaben und optional den Secret-Plot-Zustand ein      |
| `echo-chamber`           | parallel        | Simuliert Publikumsreaktionen                                     |
| `world-state`            | post_processing | Liest Datum, Uhrzeit, Ort und Wetter aus der Erzählung heraus     |
| `expression`             | post_processing | Wählt die Gesichtsausdrücke der Charakter-Sprites                 |
| `quest`                  | post_processing | Verfolgt neue, geänderte und abgeschlossene Quests                |
| `background`             | post_processing | Wählt passende Hintergrundbilder                                  |
| `character-tracker`      | post_processing | Verfolgt Zustandsänderungen der Charaktere                        |
| `persona-stats`          | post_processing | Verfolgt Änderungen an den Werten der Spieler-Persona             |
| `custom-tracker`         | post_processing | Verfolgt selbst definierte strukturierte Zustände                 |
| `inventory-tracker`      | post_processing | Verfolgt Währungen, ausgerüstete Gegenstände und Inventar         |
| `quartermaster`          | post_processing | Führt einen Roleplay-Charakterbogen, ausgerüstete Gegenstände und Outfits |
| `beholder`               | post_processing | Verfolgt, was jeder Charakter trägt und hält, und seine Verletzungen |
| `relationship-tracker`   | post_processing | Verfolgt, wie die Charaktere und die Persona zueinander stehen    |
| `memory-nag`             | post_processing | Merkt sich offene Enden wie Versprechen und erinnert das Modell daran |
| `illustrator`            | post_processing | Erzeugt Bild-Prompts für Szenen und Medienanfragen                |
| `lorebook-keeper`        | post_processing | Legt Lorebook-Einträge automatisch an und aktualisiert sie        |
| `card-evolution-auditor` | post_processing | Prüft Charakterkarten und schlägt Weiterentwicklungen vor         |
| `combat`                 | parallel        | Verfolgt Kampfrunden, HP, Initiative und Ausgang                  |
| `html`                   | post_processing | Schreibt fertige Roleplay-Antworten um und ergänzt diegetische HTML-Grafiken |
| `spotify`                | post_processing | Steuert die Wiedergabe im Music DJ (Spotify, YouTube oder lokale Musik) |
| `knowledge-retrieval`    | pre_generation  | Holt Kontext aus den Wissensquellen                               |
| `knowledge-router`       | pre_generation  | Leitet passende Lorebook- und Wissenseinträge weiter              |
| `long-term-memory`       | feature         | Speichert dauerhafte Erinnerungen und ruft passenden Kontext ab   |
| `haptic`                 | post_processing | Schickt Befehle an Haptik-Geräte                                  |
| `cyoa`                   | post_processing | Erzeugt Auswahlmöglichkeiten                                      |
| `storyboard` | post_processing | Plant unbewegte oder animierte Storyboards in Game und Roleplay |
| `2d-avatars` | feature | Zeigt animierte 2D-Avatare aus Sprites oder Meshes |
| `3d-avatars` | feature | Zeigt animierte 3D-Avatare in VRM, MMD PMX, GLB und FBX |
| `conversation-calls`     | feature         | Ergänzt Audio- und Videoanrufe in Conversation samt Einstellungen |
| `hierarchical-maps`      | feature         | Ergänzt Karten, räumlichen Kontext und Bewegung in Roleplay/Game   |
| `noodle` | feature | Ergänzt den lokalen sozialen Feed Noodle auf Home |
| `otome-forge` | feature | Ergänzt Home um Otome Hearth, ein Otome-Spiel aus Charakteren |
| `saucelings` | feature | Ergänzt Home um Saucelings, ein von Charakteren betreutes virtuelles Haustier |
| `slurp2`                 | feature         | Ergänzt Slurp, eine private Creator-App für Charaktere, auf Home  |
| `story-writer` | feature | Ergänzt Home um Story Writer, einen Arbeitsbereich zum gemeinsamen Bücherschreiben |
| `gacha-forge`            | feature         | Ergänzt ein Gacha-Spiel auf Home                                  |
| `blackjack` | feature | Ergänzt den Blackjack-Tisch in Conversation |
| `uno`                    | feature         | Ergänzt den UNO-Tisch in Conversation                             |
| `chess`                  | feature         | Ergänzt das Schachbrett in Conversation                           |
| `poker`                  | feature         | Ergänzt den Texas-Hold'em-Tisch in Conversation                   |
| `eightball`              | feature         | Ergänzt den 8-Ball-Billardtisch in Conversation                   |
| `tic-tac-toe`            | feature         | Ergänzt das Tic-Tac-Toe-Feld in Conversation                      |
| `rock-paper-scissors`    | feature         | Ergänzt Schere-Stein-Papier-Partien in Conversation               |
| `wordle` | feature | Ergänzt das tägliche Wordle-Rennen in Conversation |

### Ergebnistypen der Agenten

Agenten liefern typisierte Ergebnisse, die das Frontend verarbeitet. Die Union `AgentResultType` in `packages/shared/src/types/agent.ts` umfasst:

`game_state_update`, `text_rewrite`, `sprite_change`, `echo_message`, `quest_update`, `image_prompt`, `context_injection`, `continuity_check`, `director_event`, `lorebook_update`, `character_card_update`, `character_card_create`, `background_change`, `character_tracker_update`, `persona_stats_update`, `custom_tracker_update`, `inventory_tracker_update`, `spotify_control`, `youtube_control`, `local_music_control`, `haptic_command`, `cyoa_choices`, `secret_plot`, `game_master_narration`, `party_action`, `game_map_update`, `game_state_transition`, `prompt_patch`, `character_activity_update`, `frontend_theme_update`, `about_me_update` und `memory_nag`.

## Chat-Modi

### Conversation Mode

Reiner Dialog mit einem oder mehreren KI-Charakteren. Charaktere können verschiedene Status haben (online, abwesend, bitte nicht stören, offline), die Zeitpunkt und Stil der Antwort beeinflussen. Mitgelieferte Agenten werden pro Chat hinzugefügt, nicht global aktiviert.

### Roleplay Mode

Ein dichtes Erzählerlebnis mit Verfolgung des Spielzustands: Szenenkontext (Ort, Zeit, Wetter), Anwesenheit und Stimmung der Charaktere, Spielerwerte, Inventar und Quests, Kampfbegegnungen, World Info aus Lorebooks und Sprite-Gesichtsausdrücke.

### Game Mode

Sitzungen mit einem KI-Game-Master, dazu Partymitglieder, Würfel, Spielzustand, Assets, Storyboards, ein Journal und ein strukturierter Sitzungsablauf. Der Game Mode nutzt eigene Stores und Routen für Spielzustand, Assets, Tischspiele, Szenenvideos und Storyboards. Den Ablauf aus Nutzersicht beschreibt [Game Mode: Erste Schritte](../game/getting-started.md).

## Entwicklung

### Befehle

Abhängigkeiten installieren:

```bash
pnpm install
```

Server und Client mit Hot Reload starten:

```bash
pnpm dev
```

Nur den Dev-Server des Clients starten:

```bash
pnpm dev:client
```

Nur den API-Server starten:

```bash
pnpm dev:server
```

Die Basisprüfung ausführen (Prettier, ESLint, Typprüfungen und Produktions-Builds; setze auf einem Rechner mit wenig Arbeitsspeicher `MARINARA_CHECK_JOBS=1`):

```bash
pnpm check
```

Für die Produktion bauen:

```bash
pnpm build
```

### Bundle-Budget

- Haupteinstieg: höchstens 1 MB.
- Pro Chunk: `chunkSizeWarningLimit` liegt bei 512 KB. Eine Überschreitung gibt eine Build-Warnung aus, lässt den Build aber nicht fehlschlagen.
- Vendor-Splits: react, tanstack, motion, zustand, icons und misc.

### Pfad-Alias

`@/*` verweist sowohl in der TypeScript- als auch in der Vite-Konfiguration auf `./src/*`.

## Verwandte Anleitungen

- [Architektur-Landkarte (für Entwickler)](architecture-map.md)
- [Dateibasierte Speicherung (für Entwickler)](file-storage.md)
