# Własne motywy CSS

Motyw zmienia cały wygląd aplikacji Marinara Engine: kolory, czcionki, obrazy i kształt paneli. Marinara ma galerię gotowych motywów startowych do pobrania. Możesz też zaimportować motyw udostępniony przez kogoś albo stworzyć własny.

Aby szybko zmienić wygląd bez używania motywu, zobacz [Ustawienia wyglądu](appearance-settings.md) lub [Gotowe style okien czatu](#ready-made-chat-window-styles). Jeśli chcesz stworzyć własny motyw, [Przewodnik autora motywów](theme-author-guide.md) przeprowadzi cię przez to krok po kroku.

## Czym jest własny motyw

Motyw to blok kodu CSS, którym strony internetowe określają kolory, czcionki i odstępy, oraz dołączone obrazy i czcionki. Motywy są zapisywane na twoim serwerze Marinara, więc zainstalowany motyw pojawia się na każdym urządzeniu połączonym z tym serwerem. Włączony może być tylko jeden motyw naraz, a przechowywać możesz ich dowolnie wiele.

## Gdzie znaleźć motywy

Otwórz **Biblioteka → Ustawienia → Wygląd** i kliknij **Motywy CSS** w rzędzie sekcji. W klasycznym układzie jest to **Ustawienia → Dodatki → Biblioteka motywów**.

Sekcja zawiera:

- **Nowy motyw** i **Importuj plik** na górze.
- **Zezwalaj na motywy z HTML (akceptuję ryzyko)**, domyślnie wyłączone. Zobacz [Motywy z HTML](#themes-with-html).
- **Zainstalowane motywy**: **Domyślny motyw**, następnie twoje własne motywy, a potem pobrane motywy startowe.
- **Przeglądaj galerię motywów**: motywy startowe do pobrania.

## Motywy startowe

Motywy startowe nie są częścią instalacji, więc nie zajmują miejsca, dopóki któregoś nie zechcesz. Znajdują się w galerii motywów, a Marinara pobiera motyw dopiero wtedy, gdy go wybierzesz.

1. Kliknij **Przeglądaj galerię motywów** pod sekcją **Zainstalowane motywy**. Marinara potrzebuje do tego połączenia z internetem.
2. Przy każdym motywie widać podgląd, krótki opis, rozmiar i tagi.
3. Kliknij **Pobierz** obok tych, które ci się podobają. Pojawią się w grupie **Motywy startowe** w sekcji **Zainstalowane motywy**, gotowe do włączenia.

| Motyw | Wygląd |
| --- | --- |
| **Apogee Lounge** | Salon widokowy kosmicznego liniowca w stylu lat 70., z gazowym olbrzymem za oknem i wiadomościami na profilowanych panelach. |
| **Crepuscular** | Almanach nocnego morza: zakapturzone postacie czuwają na klifie pod czujnym księżycem (jedzą naleśniki), a wiadomości biegną w dół jedną liniowaną kolumną księgi rachunkowej. |
| **Dewglass** | Błyszczące szkło w stylu lat 2000.: wiadomości to żelowe krople na tle słonecznej laguny lub nocnej zorzy. |
| **Granite Watch** | Zimnowojenne stanowisko dowodzenia pod górą: odpowiedzi drukują się na papierze dalekopisowym, a widgety wiszą na podkładkach z klipsem. |
| **Gutterlight** | Deszczowe gotyckie miasto narysowane jak komiks kryminalny, z tuszowanymi kadrami i ramkami narracyjnymi. |
| **Lantern Meadow** | Spokojny i bardzo czytelny, bez ruchu. |
| **Lantern Path** | Kolumna do czytania z delikatnym ruchem. |
| **Maple's Bramble Cottage** | Przytulny domek z kolumną do czytania długich odpowiedzi. |
| **MARI to the Moon** | Terminal giełdowy: każda odpowiedź to zlecenie, górny pasek wyświetla taśmę z notowaniami, a lista czatów to lista obserwowanych. |
| **NEON//GRID** | Neonowy cyberpunk stworzony z myślą o długich odpowiedziach. |
| **Petal OS** | Żartobliwy pulpit retro z pikselowymi czcionkami. |
| **Quiet Iris** | Spokojna inteligencja statku: matowe grafitowe przyrządy, jedna czerwono-bursztynowa soczewka i każdy czat zadokowany wzdłuż jednego podświetlonego kręgosłupa. |
| **Rosalind's Folio** | Układ baśniowej książki z elementami visual novel. |
| **Sanguine Keep** | Gotycki zamek w świetle księżyca: karmazynowy aksamit i złocenia nocą, jasny marmur za dnia, z portretami w oknach ostrołukowych i wiadomościami na panelach relikwiarzy. |
| **Swiss Poster** | Spokojna, przejrzysta stylistyka plakatu, bez ruchu. |
| **Under Sail** | Pokład żaglowca na morzu: każda wiadomość to płócienny żagiel zawieszony na drewnianej rei. |
| **Velvet Casket** | Pastelowy gotyk za dnia i tradycyjny gotyk nocą, z wiadomościami w kształcie trumien. |

Każdy motyw startowy ma wersję ciemną i jasną. Małe tagi pod nazwą, takie jak **No motion** (bez ruchu) czy **High legibility** (wysoka czytelność), podpowiadają, czego się spodziewać.

Gdy w galerii pojawi się nowsza wersja pobranego motywu, na liście galerii przy motywie zobaczysz **Aktualizuj**. Kliknij ten przycisk, aby pobrać nową wersję.

Pobrane motywy startowe są tylko do odczytu, więc zawsze zachowują pierwotną postać. Każdy ma cztery przyciski:

- **(i) Autorzy i licencje**: kto stworzył grafikę i czcionki oraz jak możesz je ponownie wykorzystać.
- **Klonuj i edytuj** (ikona kopiowania): tworzy twoją własną kopię, na przykład "Petal OS (moja kopia)", i otwiera ją w edytorze.
- **Eksportuj** (ikona wysyłania): zapisuje motyw jako plik.
- **Usuń** (ikona kosza): usuwa motyw z tej instalacji. W każdej chwili możesz pobrać go ponownie z galerii.

Pliki motywów możesz też pobrać bez aplikacji: są w folderze `themes` galerii motywów w serwisie GitHub ([gałąź kolacheee-themes](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)). Pobierz stamtąd plik `.json` i użyj przycisku **Importuj plik**.

## Włączanie motywu

1. Kliknij nazwę motywu w sekcji **Zainstalowane motywy**. Motyw włączy się w tej karcie przeglądarki.
2. Pasek pyta **Zachować ten motyw?** i odlicza 15 sekund. Najechanie wskaźnikiem na pasek wstrzymuje odliczanie.
3. Kliknij **Zachowaj motyw**, aby go zachować. Od tej pory pojawi się też na twoich innych urządzeniach. Kliknij **Wróć** lub poczekaj do końca odliczania, aby przywrócić poprzedni wygląd.

Kliknij **Domyślny motyw**, aby wyłączyć własne motywy. Przycisk **Resetuj wygląd** na górze sekcji **Ustawienia → Wygląd → Motyw** także wyłącza motyw.

Aby używać innego motywu tylko na jednym urządzeniu, najpierw ustaw **Wygląd na tym urządzeniu** na **Tylko to urządzenie** w sekcji **Ustawienia → Wygląd → Motyw**.

### Przywracanie zwykłego wyglądu

Jeśli motyw utrudnia korzystanie z aplikacji Marinara Engine, każda z tych czynności wyłączy go w tej karcie:

- Naciśnij <kbd>Esc</kbd> trzy razy.
- Dodaj `?safe` na końcu adresu w przeglądarce.
- Naciśnij <kbd>Ctrl</kbd>+<kbd>K</kbd> i wpisz "Własny motyw".

Marinara chroni też górny pasek, paski boczne, <kbd>Ctrl</kbd>+<kbd>K</kbd> i pole wiadomości. Motyw może zmienić ich styl, ale jeśli któryś z tych elementów ukryje, przesunie lub zasłoni, Marinara wyłączy motyw w tej karcie i poda przyczynę.

## Importowanie motywu

1. Kliknij **Importuj plik**.
2. Wybierz plik motywu `.json` lub `.css`.
3. Podgląd pokazuje nazwę motywu, autora, wersję, obrazy i rozmiar oraz informacje o autorach i licencji. Wymienia wszystko, co warto wiedzieć przed instalacją, na przykład ruchome obrazy, tekst dodawany przez motyw lub części, które nie zadziałają.
4. Wybierz, co dołączyć. Podgląd proponuje zalecane przez motyw ustawienia, takie jak schemat kolorów, kolor akcentu i czcionka; większość z nich jest zaznaczona. Może też dodać tła motywu do twojej galerii teł czatu.
5. Kliknij **Zainstaluj i wypróbuj**, aby od razu włączyć motyw, lub **Zainstaluj**, aby dodać go do listy.

Jeśli masz już motyw o tej samej nazwie, podgląd proponuje jego aktualizację lub opcję **Zachowaj oba**. Gdy rezygnujesz z wypróbowywanego motywu, Marinara przywraca też wszystkie ustawienia, które zmieniła.

Nie można zainstalować motywu, który wyświetla tekst proszący o hasła lub klucze albo podszywa się pod aplikację Marinara Engine. Nigdy nie wpisuj klucza ani hasła na prośbę motywu.

### Motywy z HTML

Niektóre motywy dodają do każdej wiadomości mały blok HTML, nazywany szablonem wiadomości. Marinara usuwa z niego skrypty, linki, obrazy i formularze, ale HTML od kogoś innego nadal może wprowadzać w błąd. Takie motywy można instalować tylko przy włączonej opcji **Zezwalaj na motywy z HTML (akceptuję ryzyko)**. Gdy przełącznik jest wyłączony, zainstalowany motyw wyświetla się bez swojego HTML.

## Tworzenie motywu

Kliknij **Nowy motyw** lub **Klonuj i edytuj** przy motywie startowym, aby zacząć od czegoś, co już dobrze wygląda. Edytor ma pole nazwy, duże pole CSS, przełącznik **Podgląd** i przycisk **Zapisz**. Nowy motyw włącza się przy zapisie i pyta **Zachować ten motyw?**

[Przewodnik autora motywów](theme-author-guide.md#your-first-theme-step-by-step) opisuje krok po kroku tworzenie pierwszego motywu.

### Tworzenie motywu z Professor Mari

Nie musisz samodzielnie pisać CSS. Poproś asystentkę Professor Mari zwykłymi słowami, na przykład "zrób mi przytulny jesienny motyw, który działa na moim telefonie" albo "co jest nie tak z moim motywem Harbor?". Ma podręcznik projektowania i przeglądania motywów, którego się trzyma:

1. **Najpierw uzgadnia z tobą pomysł.** Pyta o nastrój, tryb jasny lub ciemny (albo oba), twoje urządzenia oraz o to, czy chcesz obrazy i pogodę, a potem podsumowuje jeden wygląd w zdaniu, na przykład "kapsuły z matowego szkła na tle morza".
2. **Tworzy motyw, ale go nie włącza.** Mówi ci, gdzie go wypróbować: wybierz go w sekcji **Motywy CSS** i naciśnij **Zachowaj motyw** w ciągu 15 sekund. Jeśli poprosisz ją, aby sama go włączyła, twoja karta tak samo zapyta **Zachować ten motyw?** i przywróci poprzedni wygląd, jeśli nikt nie odpowie.
3. **Prosi cię o sprawdzenie wyglądu.** Professor Mari nie widzi twojego ekranu, więc wskazuje konkretne miejsca do sprawdzenia w trybie jasnym i ciemnym oraz prosi o zrzut ekranu wszystkiego, co wygląda nie tak. Jeśli Marinara wyłączyła motyw, przekaż asystentce treść komunikatu: podaje on przyczynę, którą ona naprawi.
4. **Może stworzyć obrazy do motywu.** Gdy w sekcji Połączenia jest skonfigurowany model obrazów, tworzy tła, ramki i ikony, najpierw pokazuje ci każdy obraz i zapisuje go w motywie, gdy wyrazisz zgodę. Może też zmienić kolory rysowanych ozdób (obrazów SVG) w motywie. Zobacz [Poproś asystentkę Professor Mari o stworzenie grafiki](theme-author-guide.md#ask-professor-mari-to-make-the-art).

Podczas przeglądu motywu wymienia to, co do siebie nie pasuje (różne kształty narożników, cienie, nieczytelne etykiety), ekran po ekranie, i niczego nie zmienia, dopóki nie wskażesz, co poprawić.

Professor Mari pracuje tylko nad twoimi własnymi motywami. Motywy startowe są tylko do odczytu, więc najpierw kliknij przy jednym z nich **Klonuj i edytuj**, a potem poproś ją o pracę nad kopią. Czcionki, informacje o autorach i miniatury dodajesz samodzielnie w sekcji **Obrazy i dane udostępniania (autor, wersja, miniatura, czcionki)**.

## Edytowanie, eksportowanie i usuwanie własnych motywów

Twoje własne motywy mają w swoim wierszu trzy przyciski:

- **Edytuj CSS motywu** (ikona kodu) otwiera edytor. Edycja nie zmienia tego, który motyw jest włączony.
- **Eksportuj** (ikona wysyłania) pobiera plik `.json`, który możesz udostępnić lub zaimportować w innym miejscu.
- **Usuń** (ikona kosza) usuwa motyw po potwierdzeniu. Nie da się tego cofnąć, więc najpierw wyeksportuj motyw, jeśli może ci się jeszcze przydać.

## Motyw dla jednego czatu

Czat może mieć własny motyw:

1. Otwórz czat i jego **Ustawienia czatu**.
2. W sekcji **Motyw** wybierz motyw. Opcja **Zgodnie z aplikacją** używa motywu aplikacji, a **Wygląd domyślny (bez własnego motywu)** wyłącza motywy w tym czacie.
3. W czacie z jedną postacią zaznacz **Używaj we wszystkich czatach z tą postacią**, aby ustawić ten motyw dla tej postaci.

Ustawienia i Biblioteka zawsze używają motywu aplikacji.

## Kto może zmieniać motywy

Na komputerze, na którym działa Marinara, sekret nie jest potrzebny. Na innym urządzeniu, na przykład telefonie, tworzenie, importowanie, klonowanie, edytowanie i usuwanie motywów wymaga sekretu administratora. Wpisz go w sekcji **Ustawienia → Zaawansowane → Bezpieczeństwo**. Wybranie już zainstalowanego motywu nie wymaga sekretu. Zobacz [Sekret administratora](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions).

## Gotowe style okien czatu

Zanim zaczniesz: do tego nie potrzeba CSS.

1. Otwórz **Ustawienia → Wygląd → Przyciski i okna czatu**.
2. W sekcji **Styl widgetów czatu** wybierz styl.

| Styl | Wygląd |
| --- | --- |
| **Default** (domyślny) | Pierwotny wygląd. |
| **Dottore** | Lodowoniebieskie ramki przywodzące na myśl aparaturę, jasne metalowe krawędzie i przycięte narożniki. |
| **Prof. Mari** | Baśniowe ramki ze złotym wykończeniem, błękity kamieni szlachetnych i Primogemy przy tytułach okien. Przyciski tego stylu mają takie samo tło jak okna. |

Każdy styl ma własną czcionkę, działa w jasnym i ciemnym trybie i nadaje wspólny wygląd przyciskom, oknom oraz rozwijanym sekcjom. Wybranie stylu przywraca ustawienia **Font** (czcionka), **Shape** (kształt) i wszystkich trzech kolorów. Położenie okien pozostaje bez zmian.

Te elementy możesz zmieniać osobno:

- **Font** i **Shape** korzystają ze stylu (opcje **Preset font** i **Preset shape**, czyli czcionka i kształt presetu), dopóki nie wybierzesz innych.
- **Border & Buttons Color** (kolor obramowań i przycisków) zmienia obrysy oraz ikony przycisków. Ikony korzystają z pierwszego koloru gradientu.
- **Background Color** (kolor tła) wypełnia przyciski, okna, rozwijane sekcje i pola edycji.
- **Text Color** (kolor tekstu) zmienia tekst widgetów. Gradienty są widoczne w nagłówkach i etykietach, a pola edycji korzystają z pierwszego koloru.

Każdy kolor ma narzędzie wyboru jednolitego koloru oraz opcję gradientu. **Reset color** (przywrócenie koloru) przy danej opcji przywraca jasne lub ciemne kolory stylu. Ozdobne emblematy zachowują swoje oryginalne kolory.

### Przenoszenie stylu na czat

Trzy przełączniki pod narzędziami wyboru kolorów rozszerzają działanie stylu. Każdy jest początkowo wyłączony i działa niezależnie. Wyłączenie przełącznika przywraca zwykły wygląd odpowiedniej części czatu, a wybranie innego stylu zachowuje ustawienia przełączników.

| Przełącznik | Co stosuje |
| --- | --- |
| **Apply preset font** (zastosowanie czcionki presetu) | Czcionkę widgetów w wiadomościach, polach wpisywania i kontrolkach czatu. |
| **Apply preset shape** (zastosowanie kształtu presetu) | Kształt ramki w wiadomościach Roleplay (w układzie klasycznym i visual novel), polu dialogowym Game, polach wpisywania i kontrolkach. Wiadomości Conversation zachowują swój kształt. |
| **Apply preset colors** (zastosowanie kolorów presetu) | Kolory obramowań, tła i tekstu w tych obszarach, także w wiadomościach Conversation. Twoje własne kolory i gradienty też są stosowane. Wypowiedzi w cudzysłowie zachowują kolor Dialogue Highlight Color ustawiony dla danej postaci lub persony. Wiadomość złożona z HTML, na przykład ostylowany blok od agenta, zachowuje kolory tekstu, które sama ustawia. |

Przyciski historii, czyli **Load More** (wczytaj więcej) i **Show older** (pokaż starsze), stosują się do przełączników tak jak pozostałe kontrolki czatu. W trybie Game Mode przełączniki obejmują też uwagi poboczne, widgety paska HUD, panel mapy, karty postaci, dzienniki, ekwipunek, panele walki i okna dialogowe. Asystentka Professor Mari może też tworzyć własne motywy dla tych obszarów.

Własny motyw nadal może nadpisywać style. Zmienne okien i rozwijanych sekcji opisane w sekcji [Styl okien i rozwijanych sekcji czatu](#styling-chat-windows-and-drawers) mają pierwszeństwo przed kolorami stylu. Zmienna `--mari-window-font-family` ustawia czcionkę okien, `--mari-drawer-radius` zmienia narożniki sekcji, a `--mari-window-ornament: none` ukrywa ozdobę przy tytule. Aby usunąć wszystkie ozdoby stylu, najpierw wybierz **Default**.

## Dla autorów motywów

Dalsza część tego przewodnika to materiał referencyjny dla osób, które samodzielnie piszą CSS motywów. Zacznij od [Przewodnika autora motywów](theme-author-guide.md), który wymienia wszystkie stabilne tokeny, punkty zaczepienia elementów i zasady bezpieczeństwa.

## Motywy i Card CSS

Marinara ma dwa sposoby na dodanie własnego kodu CSS i oba mogą być aktywne jednocześnie.

- Własny motyw przemalowuje całą aplikację. Wolno mu nadpisywać podstawowe zmienne aplikacji Marinara Engine, używać `!important` oraz `position: fixed`.
- Card CSS jest osadzony w karcie postaci lub persony i włącza się go osobno dla każdego czatu. Jest czyszczony ostrzej: nie może nadpisać podstawowych zmiennych, `!important` zostaje usunięty, a `position: fixed` zamienia się w `position: absolute`. Nadaje styl wiadomościom w czacie, a nie całej aplikacji. Zobacz [Przewodnik po stylowaniu kart w CSS](card-css-theming.md).

## Limity rozmiaru i nazwy

Nazwa motywu może mieć do 200 znaków. Kod CSS może zajmować do 256 KiB, liczone w bajtach UTF-8. Większy motyw zostaje odrzucony przy zapisie lub imporcie. Kod CSS własnego motywu przechodzi też przez czyszczenie, zanim zacznie działać: style, które wczytują plik z innej strony, nie działają. Zamiast tego osadź obrazek albo czcionkę jako URI `data:`.

## Wykaz zmiennych CSS

Edytor motywu ma rozwijaną sekcję **CSS Variable Reference**. Kliknij ją, aby zobaczyć najbardziej przydatne zmienne, które można nadpisać. Motyw zmienia wygląd aplikacji, ustawiając te zmienne w bloku `:root`. Wykaz wymienia następujące zmienne:

| Zmienna | Za co odpowiada |
| --- | --- |
| `--background` | Tło strony |
| `--foreground` | Główny tekst |
| `--primary` | Akcent i przyciski |
| `--primary-foreground` | Tekst na kolorze primary |
| `--secondary` | Karty i pola |
| `--card` | Tło karty |
| `--border` | Obramowania |
| `--muted-foreground` | Przygaszony tekst |
| `--sidebar` | Tło paska bocznego |
| `--sidebar-border` | Obramowanie paska bocznego |
| `--marinara-shell-edge-border` | Lewa i prawa krawędź obudowy |
| `--destructive` | Błędy i usuwanie |
| `--popover` | Tło listy rozwijanej |
| `--accent` | Podświetlenia pod kursorem |

Motyw może ustawić dowolną zmienną CSS używaną przez aplikację Marinara Engine, nie tylko te. Niektóre efekty mają własne zmienne. Na przykład `--marinara-theme-accent-pulse: enabled` prosi o animację pulsowania akcentu.

## Styl okien i rozwijanych sekcji czatu

Na komputerze **Chat Settings** (ustawienia czatu) otwiera się jako przesuwane okno. Jego rozwijane sekcje nazywają się po angielsku **drawers**. Sekcję można wydzielić do osobnego okna, a potem zminimalizować do małego, przesuwanego przycisku, nazywanego **bubble**.

Takie okna i przyciski służą też innym narzędziom czatu, w tym **Game controls** (sterowanie grą), **Session** (sesja), **Volume** (głośność), **Game Assets** (zasoby gry), powiązanym czatom i kontrolkom pakietów. Na telefonie większość okien otwiera się jako panele na całą szerokość; Echo Chamber pozostaje niewielkim oknem, które można przesuwać i którego rozmiar można zmieniać. Narzędzia wydzielone z Chat Settings znajdziesz w przesuwanym menu **Chat tools** (narzędzia czatu) z trzema kropkami; przyciski trackerów pozostają osobno.

Poniższe klasy, atrybuty i zmienne pozwalają nadać tym elementom wspólny styl. Reguły własnego motywu nadpisują ustawienia domyślne bez `!important`.

### Klasy

| Element | Klasa |
| --- | --- |
| Okno | `.mari-window` |
| Pasek tytułu | `.mari-window__header` |
| Tytuł z ikoną | `.mari-window__title-row` |
| Tytuł | `.mari-window__title` |
| Przyciski paska tytułu (**Reset View**, gwiazdka ulubionego układu, **Tracker Panel**, przypięcie, blokada, zamknięcie, **Put back**) | `.mari-window__controls` (każdy przycisk ma klasę `.mari-window__control`) |
| Zawartość okna | `.mari-window__body` |
| Krawędzie i narożniki do zmiany rozmiaru | `.mari-window__resize-handle` |
| Znacznik w narożniku widoczny, gdy wskaźnik lub fokus klawiatury znajduje się w oknie | `.mari-window__resize-grip` |
| Rozwijana sekcja | `.mari-drawer` |
| Nagłówek i tytuł sekcji | `.mari-drawer__header`, `.mari-drawer__title` |
| Ikona sekcji, plakietka z liczbą i **?** | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| Podgląd zwiniętej sekcji (mały widget trackera) | `.mari-drawer__summary` |
| Przyciski sekcji obok strzałki i przycisk wydzielenia do okna | `.mari-drawer__actions`, `.mari-drawer__popout` |
| Strzałka i zawartość sekcji | `.mari-drawer__arrow`, `.mari-drawer__body` |
| Podgląd, który podąża za wskaźnikiem podczas przeciągania sekcji poza okno | `.mari-drawer-ghost` |
| Przycisk zminimalizowanego okna (bubble) | `.mari-window-bubble` |
| Aktualne podsumowanie, które przycisk pokazuje zamiast ikony (baner World State) | `.mari-window-bubble__banner` |
| Linia pomocnicza widoczna, gdy przeciągany przycisk wyrównuje się z innym | `.mari-window-snap-guide` |
| Kropka widoczna podczas pracy agentów (przycisk **Chat Settings**, okno **Trackers**) | `.mari-agents-running-dot` |

### Atrybuty danych

- `data-window` określa okno i jego przycisk: `chat-settings`, `trackers`, okna kontrolek `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` i `control:beholder:<package>` oraz `drawer:<window>:<drawer>` dla wydzielonej sekcji, na przykład `drawer:chat-settings:chat-name`.
- `data-drawer` określa sekcję, na przykład `chat-name`. Niektóre nazwy zaczynają się od trybu czatu, jak `roleplay-agents` lub `conversation-agents`. Trackery korzystają z nazw `tracker-world`, `tracker-persona`, `tracker-characters`, `tracker-quests`, `tracker-inventory`, `tracker-custom` i `agent-activity`.
- `data-presentation` ma wartość `"window"` w oknie na komputerze albo `"sheet"` w panelu na telefonie.
- `data-pinned` i `data-locked` mają wartość `"true"`, gdy okno jest przypięte lub zablokowane.
- `data-window-control` określa przycisk paska tytułu: `"pin"`, `"lock"`, `"close"` lub `"put-back"`. Włączony przycisk przypięcia lub blokady ma też `aria-pressed="true"`.
- `data-chat-settings-control` oznacza dodatkowe przyciski paska tytułu **Chat Settings**: `"reset-view"`, `"favorite-layout"` i `"tracker-panel"`. Gwiazdka ulubionego układu ma `aria-pressed="true"` i wypełnioną ikonę, gdy bieżący układ odpowiada zapisanemu ulubionemu.
- `data-edge` ma wartość `"n"`, `"s"`, `"e"`, `"w"`, `"ne"`, `"nw"`, `"se"` lub `"sw"` na odpowiednim uchwycie zmiany rozmiaru.
- Przycisk otwartej sekcji wewnątrz `.mari-drawer__header` ma `aria-expanded="true"`.
- `data-drawer-control="pop-out"` oznacza przycisk wydzielenia sekcji do osobnego okna.
- `data-outside="true"` oznacza podgląd przeciągania wystarczająco daleko poza oknem, aby po upuszczeniu powstało osobne okno.
- `data-axis` ma wartość `"x"` dla pionowej linii wyrównania, a `"y"` dla poziomej.
- `data-detached` ma wartość `"true"`, gdy sekcja jest pokazana w osobnym oknie; atrybut występuje na oknie i sekcji w jego wnętrzu. Okno wydzielonej sekcji ma nazwę `data-window="drawer:<window>:<drawer>"`, na przykład `data-window="drawer:chat-settings:chat-name"`, a `data-drawer-host` określa okno, z którego pochodzi sekcja.
- `data-dragging` ma wartość `"true"` na sekcji podczas przeciągania jej tytułu, a `data-drop-target` ma wartość `"true"` na oknie, nad którym trzymasz wydzieloną sekcję gotową do włożenia z powrotem.
- Przycisk zminimalizowanego okna ma jego `data-window` i `data-minimized="true"`, na przykład `.mari-window-bubble[data-window="control:volume"]`. Okna kontrolek mają nazwy `control:game`, `control:session`, `control:volume`, `control:assets`, `control:connected-chat`, `control:package:<package>` i `control:beholder:<package>`. Podczas przeciągania przycisku `data-dragging` ma na nim wartość `"true"`. Przycisk, który zamiast ikony pokazuje aktualne podsumowanie, na przykład zminimalizowany tracker World State, ma `data-banner="true"` i rozszerza się do szerokości tego podsumowania.
- Zablokowany przycisk, także przycisk **Chat Settings**, ma `data-locked="true"`. Nadal otwiera swoje okno, ale nie da się go przesunąć, dopóki okno jest zablokowane. Użyj `.mari-window-bubble[data-locked="true"]`, aby wyróżnić takie przyciski.
- Na telefonie okna mają `data-presentation="sheet"`. Ten sam atrybut mają ich nieco większe przyciski. Przycisk **Tracker Panel** to `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`.
- Przycisk **Chat Settings** także jest przyciskiem okna: `.mari-window-bubble[data-chat-settings-button]`. Ma `data-open="true"`, gdy **Chat Settings** jest otwarte.
- Wydzielona sekcja zmniejsza się do przycisku z `data-drawer-host` (oknem, z którego pochodzi). Przycisk **Put back** (włożenie z powrotem) w jej oknie to `[data-window-control="put-back"]`.

### Zmienne

Każda zmienna domyślnie korzysta ze wspólnych kolorów interfejsu czatu, więc motyw potrzebuje tylko tych zmiennych, które ma zmienić.

| Zmienna | Co ustawia |
| --- | --- |
| `--mari-window-bg` | Tło okna |
| `--mari-window-text` | Tekst w oknie |
| `--mari-window-border`, `--mari-window-border-width` | Obramowanie okna |
| `--mari-window-radius` | Zaokrąglenie narożników okna |
| `--mari-window-shadow` | Cień okna |
| `--mari-window-backdrop-filter` | Rozmycie za oknem |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | Kolory paska tytułu |
| `--mari-window-header-padding` | Odstępy na pasku tytułu |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | Przyciski paska tytułu, w tym gwiazdkę ulubionego układu |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | Włączone przyciski paska tytułu, w tym przypięcie, blokadę i wypełnioną gwiazdkę |
| `--mari-window-control-radius`, `--mari-window-control-gap` | Zaokrąglenie i odstępy przycisków |
| `--mari-window-focus-ring` | Obrys fokusu klawiatury i okna, do którego można włożyć sekcję z powrotem |
| `--mari-window-resize-handle-size` | Szerokość krawędzi zmiany rozmiaru |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | Rozmiar, zaokrąglenie i cień przycisku okna |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | Tło i obramowanie przycisku okna |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | Kolor ikony przycisku okna |
| `--mari-window-snap-guide` | Kolor linii wyrównania |
| `--mari-drawer-bg`, `--mari-drawer-border` | Tło sekcji i linię podziału |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | Kolory nagłówka sekcji |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | Odstępy w sekcji |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | Tekst i ikony nagłówka sekcji |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | Plakietkę z liczbą w sekcji |

Ustaw zmienną w `:root`, aby zmienić wszystkie okna, albo na wybranym selektorze, aby zmienić jedno:

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## Stylowanie wiadomości, pól wpisywania i kontrolek czatu

Trzy przełączniki **Apply preset** pozwalają też własnemu motywowi stosować wygląd widgetów w pozostałej części czatu. Motyw może nadpisywać poszczególne elementy za pomocą poniższych zmiennych. Jeśli nie chcesz pisać CSS, poproś asystentkę Professor Mari o pasujący motyw czatu.

| Element | Klasa |
| --- | --- |
| Pola wiadomości Roleplay i Game, uwagi poboczne Game, widgety paska HUD, panel mapy i karty postaci oraz pola wpisywania wiadomości | `.mari-chat-style-surface` |
| Dzienniki, ekwipunek, panele walki, opcje wyboru i okna dialogowe Game; panele mają też atrybut `data-game-section` ze swoją nazwą, np. `logs`, `inventory` albo `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| Treści Game w oknie, takie jak zakładka Journal, które korzystają z kolorów okna | `.mari-game-section` |
| Wiadomości Conversation (tylko czcionka i kolory) | `.mari-chat-style-conversation` |
| Tekst wiadomości Conversation bez obramowania | `.mari-chat-style-text` |
| Kontrolki czatu, w tym Calls i kontrolki grup Conversation | `.mari-chat-style-control` |
| Przyciski historii: **Load More**, **Show older**, **Show newer** (pokaż nowsze), **Latest** (najnowsze) oraz **Older** (starsze), **All** (wszystkie) i **Show more older logs** (pokaż więcej starszych dzienników) w dziennikach Game. Mają też `.mari-chat-style-control` | `.mari-chat-history-pager` |
| Wiadomość złożona z HTML, na przykład ostylowany blok od agenta. Ustawione w niej kolory tekstu zostają zachowane przy włączonym **Apply preset colors** | `.mari-html-content` |

| Zmienna | Co zmienia |
| --- | --- |
| `--mari-chat-font-family` | Czcionkę odpowiednich obszarów czatu |
| `--mari-chat-bg` | Tło pola; przyjmuje kolor lub gradient |
| `--mari-chat-text` | Czytelny, jednolity kolor tekstu |
| `--mari-chat-border` | Obramowanie pola; przyjmuje kolor lub gradient |
| `--mari-chat-border-color` | Jednolity kolor obramowania używany jako wartość zapasowa |
| `--mari-chat-radius` | Zaokrąglenie pól z wyjątkiem wiadomości Conversation |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | Tła przycisków czatu |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | Kolor ikon i zaokrąglenie przycisków czatu |
| `--mari-chat-input-bg` | Tło wewnątrz pól edycji |

Na przykład przy włączonych **Apply preset font** i **Apply preset colors**:

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

Nieustawione zmienne korzystają z ustawień widgetów i presetu. Aby te zmienne działały przez wbudowane style, odpowiedni przełącznik musi być włączony. Wiadomości Conversation zachowują swój kształt nawet przy włączonym **Apply preset shape**. Własne motywy mogą też bezpośrednio odwoływać się do klas; ozdobne przycinanie nie powinno obejmować obrysów fokusu, menu ani treści wiadomości.

Na telefonach menu z trzema kropkami rozwija się w okrągłe przyciski. Jego przycisk otwierający to `[data-chat-tools-menu-button]`, rozwinięta kolumna to `[data-chat-tools-menu]`, a każda pozycja listy ma `data-chat-tools-menu-item` ustawione na identyfikator swojego okna. Przyciski narzędzi używają `.mari-window-bubble.mari-chat-tools-button` i `data-chat-tools-menu-tool` z tym samym identyfikatorem. Kolumna nie ma ramki okna; jej przyciski korzystają z kolorów widgetów i ustawionego rozmiaru przycisków, niezależnie od trzech przełączników dla reszty czatu, a przy tym zachowują okrągły kształt.

<a id="styling-character-sheets"></a>
## Stylowanie arkuszy postaci

Arkusz zestawu zasad wygląda tak samo w Roleplay i Game. Te klasy i atrybuty pozwalają motywowi go stylować.

| Część | Klasa | Atrybuty danych |
| --- | --- | --- |
| Cały arkusz | `.mari-ruleset-sheet` | `data-ruleset` (ID zasad, np. `local/my-rules`), `data-rank-display` (`value`, `label`, `dots`, `roman` lub `number`), `data-editing="true"` podczas edycji |
| Tytuł i **Edytuj kartę** | `.mari-ruleset-sheet__header` | |
| Zakładki | `.mari-ruleset-sheet__tabs` | Każda ma `data-tab-id` i `aria-selected` |
| Nagłówek grupy | `.mari-ruleset-sheet__heading` | |
| Pole u góry | `.mari-ruleset-sheet__field` (w `.mari-ruleset-sheet__fields`) | `data-field`, lub `data-derived` dla wartości obliczonej |
| Cecha | `.mari-ruleset-sheet__ability` (w `.mari-ruleset-sheet__abilities`); wynik i wartość testu: `__ability-score` i `__ability-value` | `data-ability`; grupa cech ma `data-section` |
| Pula, np. Zdrowie | `.mari-ruleset-sheet__pool` (w `.mari-ruleset-sheet__pools`) | `data-pool`; grupa pul ma `data-pool-group` |
| Tor | `.mari-ruleset-sheet__track` (w `.mari-ruleset-sheet__tracks`) | `data-track`; tor ran ma też `data-wound="true"` |
| Stany | `.mari-ruleset-sheet__conditions` | |
| Wyszkolona umiejętność lub rzut obronny | `.mari-ruleset-sheet__rank` (w `.mari-ruleset-sheet__trained`, grupami w `.mari-ruleset-sheet__rank-group`); ranga lub wartość testu przy `data-rank-display="value"`: `__rank-value`; wartość obok na telefonie: `__rank-check`; praktyka: `__practice` | `data-skill` lub `data-save`, `data-tier` (ID stopnia), `data-rank` (`0` niewyszkolony, `1` następny stopień itd.) |
| Umiejętność lub rzut obronny w edycji | `.mari-ruleset-sheet-editor__rank` | `data-skill` lub `data-save`, `data-tier`, `data-rank` |
| Lista, np. Ekwipunek | `.mari-ruleset-sheet__list`; każdy wiersz: `.mari-ruleset-sheet__list-row` | `data-list`; zaznaczony wiersz ma `data-marked="true"` |

Przykład pokazuje rangę 2 jednego zestawu jako dwie gwiazdki. Dodaj taką parę reguł dla każdej zmienianej rangi. Używaj tylko przy kropkach, nazwach, cyfrach rzymskich lub liczbach: przy wartościach testu `__rank-value` zawiera tę wartość i zostałaby ukryta.

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## Powiązane przewodniki

- [Przewodnik autora motywów](theme-author-guide.md)
- [Pogoda w twoim motywie](theme-weather.md)
- [Przewodnik po stylowaniu kart w CSS](card-css-theming.md)
- [Ustawienia wyglądu](appearance-settings.md)
- [Konfiguracja serwera](../CONFIGURATION.md)
- [Dostęp zdalny](../REMOTE_ACCESS.md)
