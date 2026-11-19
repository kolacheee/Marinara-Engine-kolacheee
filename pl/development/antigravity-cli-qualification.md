# Ocena możliwości integracji subskrypcji przez Antigravity CLI

To notatka badawcza dla programistów dotycząca [#8143](https://github.com/Pasta-Devs/Marinara-Engine/issues/8143), po raz pierwszy zweryfikowana 2026-10-23 i ponownie sprawdzona 2026-11-19 na oficjalnych wydaniach `agy` 1.5.11 i 1.5.12 dla systemu Windows. Aplikacja Marinara Engine **nie** obsługuje połączenia z subskrypcją Antigravity, a zgłoszenie pozostaje zamknięte jako nieplanowane. Wykluczenia własnego agenta zablokowały procedury obsługi zdarzeń testowane podczas tej ponownej weryfikacji, ale podproces MCP globalnie wykrytej wtyczki nadal uruchamiał się w obu wydaniach. Izolacja wykonywania nadal nie spełnia wymagań.

## Potwierdzone oficjalne interfejsy

Oficjalne narzędzie CLI `agy` obsługuje logowanie przy użyciu zapisanych danych konta i generowanie tekstu bez interaktywnego interfejsu. Udokumentowany protokół obejmuje zdarzenia `init`, `step_update` i `result`, a strumieniowe dane wejściowe przyjmują postać wiadomości użytkownika w formacie JSON przekazywanych przez stdin. Podczas ponownej weryfikacji w systemie Windows polecenie `agy models` wyświetliło `gemini-4-neon-high`, a żądania do tego modelu z narzuconymi limitami zakończyły się powodzeniem przy użyciu istniejącego logowania użytkownika do Google AI Pro. Dostępność modeli dla danego konta trzeba odczytać z zainstalowanego CLI, zamiast wnioskować na podstawie tego przykładu. Opcja `--print-timeout 0` czeka na zakończenie, a `--disable-slash-commands` wyłącza rozwijanie poleceń w trybie print. Zobacz [tryb bez interaktywnego interfejsu](https://antigravity.google/docs/cli/headless/) i [opis opcji CLI](https://antigravity.google/docs/cli/reference/).

Logowanie do konta w CLI korzysta z magazynu poświadczeń systemu operacyjnego. Oddzielny tryb klucza API Gemini wymaga `modelProvider: "gemini"` i `GEMINI_API_KEY`; adapter subskrypcji nie może po cichu wybierać tej metody rozliczeń. Udokumentowane sposoby programowego uwierzytelniania w SDK dla języka Python to klucze API Gemini, poświadczenia Vertex/Google Cloud i modele lokalne. Nie potwierdzają one możliwości uwierzytelniania subskrypcji konsumenckiej w rozwiązaniu zastępującym CLI przez SDK. Zobacz [uwierzytelnianie](https://antigravity.google/docs/install/#programmatic-authentication) i [omówienie SDK](https://antigravity.google/docs/sdk/overview/).

## Obecny wynik sprawdzania izolacji wykonywania

Oficjalne definicje własnych agentów udostępniają ustawienia narzędzi, MCP i dostosowań. Przewodnik po wtyczkach opisuje `inheritCustomizations` jako ustawienie dziedziczenia umiejętności, reguł i procedur obsługi zdarzeń, a `inheritMcp` jako ustawienie dziedziczenia serwerów MCP obszaru roboczego. Pierwotna zapowiedź `excludeDefaultComponents: true` zachowuje procedury uruchamiane po wywołaniu modelu, więc sama ta opcja nie gwarantuje izolacji. Poniższa kombinacja ustawień zablokowała przygotowane procedury testowe w wersji 1.5.11, ale nie zapobiegła uruchomieniu wszystkich podprocesów MCP. Zobacz [własnych podagentów](https://antigravity.google/docs/subagents/), [tworzenie wtyczek](https://antigravity.google/docs/build-plugins/) i [historię zmian CLI](https://antigravity.google/docs/changelog).

Procedury obsługi zdarzeń mogą pochodzić z obszaru roboczego, globalnego pliku `~/.gemini/config/hooks.json` i zainstalowanych wtyczek. Obejmują zdarzenia sesji, wywołania modelu, użycia narzędzi i zatrzymania. Aktualna dokumentacja ustawień oraz [oficjalny schemat ustawień](https://antigravity.google/schemas/v1/settings.json) wyraźnie stwierdzają, że wpis `hooks` w pliku `settings.json` nie jest wczytywany. Zapisanie tam pustego wpisu nie wyłączyłoby rzeczywistych źródeł tych procedur. Zobacz [procedury obsługi zdarzeń](https://antigravity.google/docs/hooks) i [ustawienia CLI](https://antigravity.google/docs/settings?tab=cli).

Pomoc zainstalowanej wersji 1.5.11 opisuje `--settings` jako nadpisanie kluczy `settings.json` tylko na czas sesji, przekazywane bezpośrednio lub przez plik. Pozwala to tymczasowo ustawić zaufanie do obszaru roboczego i uprawnienia bez zmiany trwałych preferencji. Nie tworzy to osobnego profilu konfiguracji: `--settings '{"hooks":{}}'` kończy się kodem 1 i komunikatem `unknown setting "hooks"`. Pomoc zainstalowanej wersji nie zawierała opcji wyłączania procedur obsługi zdarzeń ani odizolowanego profilu z uwierzytelnianiem.

Aktualna dokumentacja ustawień opisuje `/hooks` jako polecenie umożliwiające dodawanie, edycję oraz włączanie i wyłączanie procedur obsługi zdarzeń, z zapisem zmian do plików konfiguracyjnych. Podczas ponownej weryfikacji `-p "/hooks" --output-format json` bez interaktywnego interfejsu zwróciło uporządkowaną listę. Lista i zapisane ustawienia włączenia nie gwarantują, że późniejsze wywołanie wykluczy wykonywalne dostosowania. Zmiana katalogu, pusta lista `tools`, instrukcja unikania narzędzi ani przerwanie po uruchomieniu nie wystarczają jako dowód izolacji wykonywania.

Raporty o integracjach zewnętrznych są wskazówkami do dalszego badania. Twierdzenia o nieaktywnych narzędziach, logach rozpoznawania agentów lub dziedziczeniu dostosowań trzeba odtworzyć na oficjalnym wydaniu, zanim staną się gwarancjami, na których polega silnik.

## Próba wydania z października 2026

Sprawdzono [oficjalny instalator](https://antigravity.google/cli/install.sh) i jego [manifest wydania dla Darwin ARM64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/darwin_arm64.json), nie uruchamiając instalatora. Manifest wskazał [wersjonowane archiwum `agy` 1.4.6 dla Darwin ARM64](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.4.6-4884751325200384/darwin-arm/cli_mac_arm64.tar.gz) z następującą sumą SHA-512:

```text
25af49004dd6d6013e6231278e2711b95641c8e54b661be871b3519c0a850053d4e707f46b47aa66e84ff9480041b13908194b48b1a97f84f2a22071d9c9fd3f
```

Suma kontrolna archiwum była zgodna. Plik binarny wypakowano do katalogu tymczasowego należącego do tego zadania. Uruchomiono wyłącznie `--version` i `--help`, w piaskownicy macOS blokującej dostęp do sieci, odczyt/zapis katalogu domowego i dostęp do usługi pęku kluczy. Oba polecenia zakończyły się powodzeniem. Pomoc nie wymieniała opcji wyłączania procedur obsługi zdarzeń, izolowania profilu ani wskazywania katalogu konfiguracji.

Ta próba **nie** instalowała ani nie uwierzytelniała CLI, nie sprawdzała poświadczeń, nie wywoływała modelu, nie wyliczała modeli zalogowanego konta ani nie testowała wykonywania procedur obsługi zdarzeń. Potwierdza publiczną listę opcji; nie dowodzi, że izolacja jest niemożliwa, ani nie potwierdza generowania w ramach subskrypcji.

## Próba w systemie Windows z listopada 2026

Zainstalowane `agy` zgłaszało wersję 1.5.11. Jego suma SHA-512 była zgodna z sumą zaobserwowaną w [oficjalnym manifeście dla Windows AMD64](https://antigravity-cli-auto-updater-974169037036.us-central1.run.app/manifests/windows_amd64.json), ale tej pierwotnej odpowiedzi z manifestem nie zachowano. Aktualizowany na bieżąco manifest wskazał później wersję 1.5.12. Podczas przeglądu niezależnie pobrano [wersjonowany plik wykonywalny 1.5.11 dla systemu Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.11-6132547114106880/windows-x64/cli_windows_x64.exe) i obliczono jego sumę bez uruchamiania; jego 234 827 416 bajtów dało tę samą sumę SHA-512 co zainstalowany plik wykonywalny:

```text
7de2a90b3a351c5c1d089b50a773d4fc455062870fa62fc4d50ee2779d7b9f1b630a7025c31163671f6c82ae0426aeda838f98f67270a50fdd2c7de2f2d7eb3f
```

Testy wykonano w tymczasowym obszarze roboczym należącym do tego zadania, z następującym blokiem metadanych frontmatter w `.agents/agents/me-isolation-probe.md`:

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

Oficjalny [opis metadanych frontmatter własnego agenta](https://antigravity.google/docs/subagents/) dokumentuje `mainAgent`, `subagent`, `tools` i `commandExecutionPolicy`. Ustawienia dziedziczenia i wykluczeń opisano w przywołanych wyżej przewodniku po wtyczkach i historii zmian. Konfigurację testową sprawdzono jako całość; poprawne wybranie agenta nie dowodzi, że każde pole było egzekwowane niezależnie.

Do generowania użyto `--settings <session-settings-json> --agent me-isolation-probe --model gemini-4-neon-high --disable-slash-commands --print-timeout 40s --output-format stream-json -p <prompt>`, z niezależnym limitem 55 sekund dla podprocesu. Ustawienia JSON przekazane bezpośrednio oznaczały tymczasowy obszar roboczy jako zaufany, wybierały domyślny tryb agenta, wyłączały własne skrypty stanu/tytułu i wybierały tryb uprawnień wskazany poniżej. Nie pomijano sprawdzania żadnych uprawnień.

Obiekt ustawień miał poniższą postać, z `<temporary-workspace>` zastąpionym katalogiem próby i `toolPermission` ustawionym na tryb uprawnień z danego wiersza:

```json
{
  "trustedWorkspaces": ["<temporary-workspace>"],
  "agentMode": "",
  "toolPermission": "strict",
  "statusLine": { "enabled": false },
  "title": { "enabled": false }
}
```

Ze środowiska podprocesu próby usunięto zmienne przełączające uwierzytelnianie na klucz API i ADC; nie wyodrębniano ani nie kopiowano poświadczeń.

Testowe procedury obsługi zdarzeń dopisywały nazwy zdarzeń do osobnych plików znaczników dla `SessionStart`, `PreInvocation`, `PostInvocation` i `Stop`. Lokalne atrapy MCP w języku Python dopisywały znacznik uruchomienia przed odpowiedzią na `initialize` i `tools/list` przez stdio. Konfiguracja MCP obszaru roboczego korzystała z `.agents/mcp_config.json`. Wtyczki zawierały `plugin.json`, `hooks.json` i `mcp_config.json`, a wykrywano je przez manifest `entries` w `.agents/plugins.json` lub `~/.gemini/config/plugins.json`, zgodnie z opisem [wykrywania dostosowań](https://antigravity.google/docs/customization-discovery/). Próby kontrolne procedur obsługi zdarzeń, MCP i odczytu pliku pomijały `--agent`, zachowując te same atrapy i ustawienia sesji. Próba z nieistniejącą nazwą porównywała natomiast poprawne `--agent me-isolation-probe` z nierozpoznaną nazwą agenta.

| Próba | Próba kontrolna | Własny agent |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Procedury obsługi zdarzeń obszaru roboczego i globalne; procedury wtyczki wykrytej w obszarze roboczym (uprawnienia `strict`) | Wszystkie cztery zdarzenia zapisały znaczniki w każdym źródle | Brak znaczników procedur obsługi zdarzeń |
| MCP obszaru roboczego i MCP wtyczki wykrytej w obszarze roboczym (uprawnienia `strict`) | Oba podprocesy zapisały znaczniki uruchomienia | Nie pojawił się żaden znacznik uruchomienia |
| Procedury obsługi zdarzeń globalnie wykrytej wtyczki (uprawnienia `request-review`) | Wszystkie cztery zdarzenia zapisały znaczniki | Brak znaczników procedur obsługi zdarzeń |
| MCP globalnie wykrytej wtyczki (uprawnienia `request-review`) | Podproces zapisał swój znacznik uruchomienia | Podproces nadal zapisał swój znacznik uruchomienia |
| Jawne żądanie `view_file` dotyczące nieprzewidywalnej wartości testowej (uprawnienia `request-review`) | Zwrócono wartość testową | Zwrócono `FILE_UNAVAILABLE`; nie zwrócono wartości testowej |
| Nieistniejąca nazwa `--agent` (uprawnienia `strict`) | `--agent me-isolation-probe` zakończyło generowanie | Nieprawidłowa nazwa zakończyła się kodem 1, wynikiem błędu, zerowym zużyciem i brakiem znaczników procedur obsługi zdarzeń/MCP |

Wynik dla MCP globalnie wykrytej wtyczki odtworzono dwukrotnie z uprawnieniami `strict` i nową ścieżką znacznika uruchomienia dla każdego wywołania. Oba żądania z własnym agentem zakończyły się kodem 0 i oba podprocesy zapisały swoje znaczniki. Opóźniony zapis z wcześniejszej próby kontrolnej nie mógł trafić pod te nowe ścieżki. To pozostały zaobserwowany problem z wykonywaniem, który blokuje integrację, mimo że wygenerowana odpowiedź nie użyła narzędzia MCP.

Prompt odczytu pliku brzmiał `Use view_file to read <fixture-path> and reply with its exact contents. Do not guess.`, z podstawioną bezwzględną ścieżką tymczasowego pliku testowego. Treść Markdown własnego agenta nakazywała mu odpowiedzieć `FILE_UNAVAILABLE`, jeśli nie mógł odczytać pliku.

Gdy podczas badania oficjalny manifest wskazał nowszą wersję, pobrano [plik wykonywalny 1.5.12 dla systemu Windows](https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe) do katalogu próby należącego do tego zadania, bez zastępowania zainstalowanego CLI. Jego sumę SHA-512 zweryfikowano względem tej zachowanej odpowiedzi z manifestem:

```json
{
  "version": "1.5.12",
  "url": "https://storage.googleapis.com/antigravity-public/antigravity-cli/1.5.12-5281398513336320/windows-x64/cli_windows_x64.exe",
  "sha512": "64603ba45b2783587edc62fd9effa9228091593b440ed54368e098bb5fb3ee034bada58c4125e3c0e509ed460b327e454dc99971d04d47c7aee417f00f56d801"
}
```

Parę prób – kontrolną i z własnym agentem – dotyczącą globalnie wykrytej wtyczki i odczytu pliku powtórzono na wersji 1.5.12, używając tego samego istniejącego logowania i uprawnień `request-review`. Próba kontrolna wykonała wszystkie procedury obsługi zdarzeń wtyczki, uruchomiła jej podproces MCP i zwróciła wartość testową. Własny agent zwrócił `FILE_UNAVAILABLE` i zablokował te procedury, ale nadal uruchomił podproces MCP. Oba żądania generowania zakończyły się kodem 0. Pozostałe wiersze tabeli sprawdzono tylko na wersji 1.5.11.

Pole `init.agent` strumienia identyfikowało wybranego własnego agenta, a osobny prompt w wersji 1.5.11 zwrócił znacznik zdefiniowany wyłącznie w treści Markdown tego agenta. Jednak `init.tools` wyliczało te same wbudowane narzędzia dla próby kontrolnej i własnego agenta, w tym `run_command` i `view_file`. Traktuj tę listę jako nierozstrzygającą w kwestii rzeczywistego dostępu do narzędzi. Próba odczytu pliku potwierdza zaobserwowane zachowanie jednego narzędzia; pozostałe nadal wymagają weryfikacji.

Globalne pliki testowe tworzono tylko pod wcześniej nieistniejącymi ścieżkami procedur obsługi zdarzeń/manifestów, z wyłącznym tworzeniem plików i sprzątaniem sprawdzającym ich zawartość przed usunięciem. Oba tymczasowe pliki globalne usunięto, a sumy kontrolne trwałych ustawień CLI były zgodne z sumami sprzed próby. CLI zachowało swój zwykły stan rozmów. Próby nie zastępowały istniejącej konfiguracji globalnej.

Próby nie sprawdzały zawartości poświadczeń; uwierzytelnianie pozostało wewnątrz oficjalnego CLI.

Te wyniki rzeczywistych prób w systemie Windows potwierdzają generowanie uwierzytelnione subskrypcją i zawężają pierwotny problem procedur obsługi zdarzeń. Nie potwierdzają gotowości adaptera: MCP globalnie wykrytej wtyczki nadal się uruchamia. Nadal nie przetestowano globalnych samodzielnych serwerów MCP, dziedziczonych umiejętności/reguł/podagentów, wszystkich narzędzi wykonujących działania, anulowania, zachowania przy długiej ciszy ani rzeczywistego wykonania w systemach Linux/macOS. Nowsze poprawki zasad wtyczek i piaskownicy opisane w historii zmian CLI nie dowodzą, że zwykłe żądanie w ramach subskrypcji konsumenckiej wyklucza wszystkie wykonywalne dostosowania.

## Wymagane dowody przed udostępnieniem adaptera

1. Ustal wspierany sposób wykluczenia globalnych i lokalnych dla obszaru roboczego procedur obsługi zdarzeń, wtyczek, umiejętności, reguł, podagentów, serwerów MCP i narzędzi wykonujących działania, zanim jakiekolwiek żądanie będzie mogło je uruchomić. Zwykłe logowanie do konta pozostaw w oficjalnym CLI; nie wyodrębniaj ani nie kopiuj tokenów.
2. Sprawdź ten mechanizm z rzeczywistym oficjalnym CLI i kontrolowanymi lokalnymi atrapami modeli. Skonfiguruj obserwowalne znaczniki testowe w globalnych i lokalnych procedurach obsługi zdarzeń oraz we wtyczkach/MCP, a także reguły i żądania użycia narzędzi. Sprawdź zarówno przebieg odizolowany, jak i kontrole negatywne potwierdzające, że bez izolacji można zaobserwować znaczniki.
3. Udowodnij przed wykonaniem, że wybrany własny agent został poprawnie rozpoznany. Odrzucaj niewspierane wersje, nierozpoznane nazwy agentów, nieznane formaty list i niejednoznaczne wyniki sprawdzania izolacji; nie polegaj na wewnętrznej treści logów ani na pozornie pustej liście narzędzi przy uruchomieniu.
4. Dodaj limity wejścia/wyjścia podprocesu, prywatne pliki tymczasowe i ich sprzątanie, anulowanie, obsługę niezerowych kodów wyjścia i błędów wyniku oraz testy limitów czasu uwzględniających aktywność, w tym długie rozumowanie bez widocznego tekstu. Pobieraj modele właściwe dla konta przez oficjalne polecenie i zachowuj wybrany model oraz wspierany poziom wysiłku rozumowania.
5. Wykorzystaj istniejące kontrakty połączeń/dostawców. Opcje SDK usługi Claude, takie jak `settingSources: []`, są specyficzne dla dostawcy i nie można przenosić ich jako opcji do `agy`. Jasno wskaż braki walidacji rzeczywistego uwierzytelniania, rozliczeń subskrypcji i testów na fizycznych platformach.

Wyniki dla wersji 1.5.11 i 1.5.12 w systemie Windows spełniają część tych wymagań, ale pozostawiają odtwarzalny problem uruchamiania podprocesu. Zgłoszenie #8143 pozostaje zamknięte jako nieplanowane; ta ponowna weryfikacja nie otwiera go ponownie ani nie upoważnia do prac nad środowiskiem wykonawczym. Nie należy dodawać dostawcy do środowiska wykonawczego bez decyzji opiekuna projektu i ukończonej weryfikacji.
