# Przejście z aplikacji SillyTavern

Większość funkcji znanych z aplikacji SillyTavern znajdziesz w aplikacji Marinara Engine (dalej Marinara), czasem pod inną nazwą. Znajdź znany termin w tabeli, a potem naciśnij **Pokaż mi**, żeby otworzyć odpowiednie miejsce w aplikacji, albo nazwę, żeby przeczytać przewodnik.

Możesz też wpisać termin z aplikacji SillyTavern w wyszukiwarce (**Ctrl+K** albo dotknięcie tytułu na telefonie). "chat completion preset", "world info", "regex" i "author's note" prowadzą do odpowiednich funkcji aplikacji Marinara.

Żeby przenieść postacie, czaty, presety i World Info, zobacz [Importowanie z aplikacji SillyTavern](importing-from-sillytavern.md). Czaty zachowują daty wiadomości, notatkę autora i personę, a presety zachowują ustawienia samplerów.

## Ta sama funkcja pod nazwą z aplikacji Marinara

| W aplikacji SillyTavern | W aplikacji Marinara | Gdzie | |
| --- | --- | --- | --- |
| Chat Completion presets, AI Response Configuration (samplery) | [Presety](../prompts/presets.md) | Biblioteka → **Presety**. Temperatura, Top P/K, Min P i kary to **Parametry** presetu | [Pokaż mi](#show-presets) |
| Prompt Manager | [Sekcje presetu](../prompts/presets.md) | Biblioteka → **Presety**, otwórz preset → **Sekcje** | [Pokaż mi](#show-presets) |
| Zapisane konfiguracje czatu, domyślne ustawienia czatu | [Profile ustawień](../chats/settings-profiles.md) | Biblioteka → **Profile ustawień** albo Nowy Roleplay → **Użyj profilu** | [Pokaż mi](#show-settingsProfiles) |
| World Info, World Book | [Lorebooki](../lorebooks/overview.md) | Biblioteka → **Księgi wiedzy** | [Pokaż mi](#show-lorebooks) |
| Author's Note | [Notatki autora](../roleplay/getting-started.md) | Ustawienia czatu (Roleplay) | [Pokaż mi](#show-authorsNotes) |
| Regex | [Skrypty regex](../extending/regex-scripts.md) | Biblioteka → **Skrypty regex** | [Pokaż mi](#show-regexScripts) |
| Czaty grupowe | [Czaty grupowe](../chats/group-chats.md) | Dodaj do czatu co najmniej dwie postacie | [Pokaż mi](#show-groupChats) |
| Karty postaci, alternatywne powitania | [Karty postaci](../characters/import-export.md) | Biblioteka → **Postacie** → **Importuj**. Alternatywne powitanie wybierasz przy rozpoczynaniu czatu w trybie Roleplay | |
| Quick Replies, STscript | [Szybkie odpowiedzi i komendy slash](../chats/guided-and-impersonate.md) | Obok **Wyślij** albo wpisz `/` | [Pokaż mi](#show-quickReplies) |
| Extensions (Summarize, Image Generation…) | [Agenci](../agents/agents-overview.md) | Biblioteka → **Agenci**, potem włączenie dla każdego czatu | [Pokaż mi](#show-agents) |
| Summarize, Vector Storage, Data Bank | [Przywoływanie pamięci i podsumowania](../agents/memory.md) | Ustawienia czatu → **Przywoływanie pamięci** | [Pokaż mi](#show-memory) |
| API Connections, Connection Profiles | [Połączenia](../connections/connecting-to-a-provider.md) | Biblioteka → **Połączenia** | [Pokaż mi](#show-connections) |
| Prompt Itemization | [Podgląd promptu](../chats/peek-prompt.md) | Najnowsza odpowiedź AI → **Podgląd promptu** | [Pokaż mi](#show-peekPrompt) |
| Checkpoints, branches | [Gałęzie](../chats/branches.md) | Wiadomość → **Utwórz gałąź stąd** | [Pokaż mi](#show-branches) |
| Swipes, reroll | [Swipe'y](../chats/messages.md) | Strzałki pod odpowiedzią albo przesunięcie palcem na ekranie dotykowym | [Pokaż mi](#show-swipes) |
| Persona Management | [Persony](../characters/personas.md) | Biblioteka → **Persony** | [Pokaż mi](#show-personas) |
| UI Themes, Custom CSS | [Motywy i motywy CSS](../appearance/custom-css-themes.md) | Ustawienia → **Wygląd** | [Pokaż mi](#show-themes) |

**Pokaż mi** otwiera stronę albo rozpoczyna dany krok, gdy to możliwe. Dla funkcji wewnątrz czatu (podgląd promptu, pamięć) najpierw otwórz czat; w przeciwnym razie otworzy się przewodnik.

## Co działa inaczej

- **Brak szablonów instruct i kontekstu.** Marinara wysyła wiadomości czatu, a serwer modelu stosuje własny szablon tego modelu, więc nie ma tu nic do wybrania w sekcji **Advanced Formatting** aplikacji SillyTavern. Sekcje presetu zastępują tekst story string.
- **Samplery.** Ustawienia presetu to wartości początkowe dla czatów, które go używają. Wartości ustawione w połączeniu lub czacie mają pierwszeństwo. Maksymalna długość odpowiedzi i rozmiar kontekstu należą do połączenia. Top A i kara za powtórzenia nie mają tu ustawienia.
- **Notatka autora.** Trafia do czatu na swojej głębokości przy każdej odpowiedzi. Gdy opcja **Przetwarzanie końcowe wiadomości** ma wartość **Zastosuj** (domyślnie), jest wysyłana wewnątrz pobliskiej wiadomości użytkownika. Ustawienia częstotliwości, pozycji i roli z aplikacji SillyTavern nie mają tu odpowiedników. **Podejrzyj prompt** oznacza miejsce, w które trafiła.
- **Czaty grupowe.** W trybie Roleplay jeden narrator domyślnie mówi za wszystkie postacie, co zużywa mniej tokenów. Żeby każda postać odpowiadała po kolei, jak w aplikacji SillyTavern, otwórz Ustawienia czatu → **Czat grupowy** i zmień tryb. Grupy zaimportowane z aplikacji SillyTavern już używają trybu **Indywidualnie**.
- **Klawisze.** Enter dodaje nowy wiersz w czacie, a **Ctrl+Enter** wysyła wiadomość. Włącz **Wysyłaj klawiszem Enter** w Ustawienia → **Czatowanie**, żeby wysyłać klawiszem Enter. Strzałki przełączają swipe'y dopiero po włączeniu opcji **Intuicyjna nawigacja wariantów** w tej samej zakładce.
- **Szybkie odpowiedzi.** Tutaj są to działania uruchamiane jednym kliknięciem obok **Wyślij** (pisanie za ciebie, odpowiedzi ze wskazówką). Zestawy Quick Reply z aplikacji SillyTavern nie są importowane.

- **Trzy tryby czatu.** Marinara dzieli czaty na **Conversation** (wiadomości jak na komunikatorze), **Roleplay** (długie sceny z narracją) i **Game** (mistrz gry prowadzi świat z zasadami). Każdy nowy czat pyta o wybór trybu, a jego konfiguracja pokazuje tylko opcje używane w tym trybie.
- **Rozpoczynanie czatu.** Nowy czat otwiera krótką konfigurację. Zapisz często używaną konfigurację jako profil ustawień, a następnym razem wystarczy jeden krok: **Użyj profilu**, a potem **Zastosuj i rozpocznij**. Oznacz profil gwiazdką, żeby ustawić go jako domyślny dla nowych czatów w tym trybie.
- **Wyszukiwarka znajduje wszystko.** **Ctrl+K** znajduje czaty, postacie, ustawienia i przewodniki, uruchamia polecenia oraz odpowiada na pytania z pomocą asystentki Professor Mari.
- **Professor Mari.** Wbudowana asystentka aplikacji Marinara odpowiada na pytania o aplikację i może tworzyć dla ciebie postacie, lorebooki i agentów. Otwórz jej czat z ekranu głównego.

## Powiązane przewodniki

- [Importowanie z aplikacji SillyTavern](importing-from-sillytavern.md)
- [Profile ustawień](../chats/settings-profiles.md)
- [Ustawienia czatu](../chats/chat-settings.md)
