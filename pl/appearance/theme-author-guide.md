# Poradnik autora motywów

Ten poradnik jest dla osób, które tworzą lub udostępniają własne motywy. Pierwsza część prowadzi przez tworzenie pierwszego motywu bez znajomości programowania. Reszta to opis wszystkich kolorów, obrazów i części, które motyw może zmieniać, oraz zasad bezpieczeństwa obowiązujących każdy motyw. Wybieranie, wypróbowywanie, importowanie i usuwanie motywów opisuje poradnik [Własne motywy CSS](custom-css-themes.md).

**Wersja 1 kontraktu tokenów** (`--mari-tokens-version: 1` na `:root`). Nazwy z tego poradnika działają między wydaniami. Gdy któraś musi się zmienić, numer wersji rośnie, a zmiana trafia do sekcji [Zmiany](#changes) na końcu. Wszystko inne (pozostałe zmienne `--ov-*`, `--mari-*` i `--marinara-*`, klasy Tailwind, struktura elementów) to szczegóły wewnętrzne, które mogą się zmienić przy każdej aktualizacji.

## Pierwszy motyw krok po kroku

Motyw to krótka lista ustawień zapisana w CSS, języku używanym przez strony internetowe do określania kolorów i czcionek. Na początek nie musisz znać CSS. Każdy wiersz wygląda tak: `--name: value;`: **token** (nazwane ustawienie zaczynające się od `--`), dwukropek, wartość i średnik.

1. Otwórz **Biblioteka → Ustawienia → Wygląd** i kliknij **Motywy CSS** w rzędzie sekcji.
2. Aby zmienić motyw startowy, pobierz wybrany motyw przez **Przeglądaj galerię motywów**, znajdź go w sekcji **Motywy startowe** i kliknij **Klonuj i edytuj** (ikona kopiowania). Marinara tworzy twoją kopię, nazwaną na przykład "Petal OS (moja kopia)", i otwiera ją w edytorze. Motywy startowe pozostają tylko do odczytu, więc oryginał jest zawsze dostępny. Aby zacząć od zera, kliknij **Nowy motyw**. Szablon zawiera wiersze między `/*` a `*/`, które są wyłączone. Usuń te znaki wokół wiersza, aby go włączyć.
3. Wpisz nazwę w polu nazwy.
4. Zmień kolor. Znajdź wiersz taki jak `--primary: #3fae7a;` i zastąp kolor. `#3fae7a` to szesnastkowy kod koloru. Uzyskasz go w dowolnym internetowym selektorze kolorów. Działają też nazwy takie jak `teal`.
5. Zostaw włączony **Podgląd**. Aplikacja zmienia się podczas pisania, więc każdą zmianę widzisz od razu.
6. Spójrz pod edytor. **Nie znaleziono problemów z CSS.** oznacza, że CSS jest poprawny. W przeciwnym razie każdy problem pojawia się z numerem wiersza, na przykład brakujący `;` lub `}`.
7. Kliknij **Zapisz**. Nowy motyw się włącza, a Marinara pyta **Zachować ten motyw?** Kliknij **Zachowaj motyw** w ciągu 15 sekund, inaczej wróci poprzedni wygląd.

Tokeny, które najczęściej zmienia się na początek:

| Token | Co koloruje |
| --- | --- |
| `--background` | Stronę pod całą resztą |
| `--foreground` | Główny tekst |
| `--primary` | Przyciski, linki i wyróżnienia |
| `--card` | Karty i panele |
| `--sidebar` | Paski boczne czatów i Biblioteki |
| `--border` | Obramowania elementów |
| `--mari-font-ui` | Czcionkę aplikacji, na przykład `"Georgia", serif` |

Mały motyw:

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }` zawiera ustawienia dla każdego schematu kolorów. `[data-theme="dark"] { … }` zawiera ustawienia tylko dla schematu Ciemny, a `[data-theme="light"] { … }` tylko dla schematu Jasny. Aby podczas pracy zobaczyć pełną listę tokenów, otwórz **Lista zmiennych CSS** pod edytorem albo przeczytaj sekcję [Tokeny kolorów](#colour-tokens) poniżej.

### Dodawanie obrazów i czcionek

Otwórz **Obrazy i dane udostępniania (autor, wersja, miniatura, czcionki)** pod edytorem i kliknij **Dodaj obrazy**. Kliknij nazwę obrazu, aby wstawić go do CSS w miejscu kursora. Sekcje [Obrazy](#pictures) i [Tła](#backdrops) opisują, gdzie można umieszczać obrazy.

Obrazy i czcionki muszą znajdować się wewnątrz motywu. Motyw nie może wczytywać niczego z innej strony internetowej, więc link do obrazu lub czcionki Google Font w CSS nie zadziała.

### Poproś asystentkę Professor Mari o stworzenie grafiki

Jeśli masz model obrazów skonfigurowany w sekcji **Połączenia** (Codex, NovelAI, ComfyUI, model obrazów OpenAI i tak dalej), Professor Mari może stworzyć obrazy do motywu i je w nim umieścić. Poproś ją zwykłymi słowami, na przykład "zrób tło nocnego nieba do mojego motywu Harbor" lub "dodaj mosiężną ramkę do kart na stronie głównej".

1. Mari pracuje tylko nad twoimi własnymi motywami. W przypadku motywu startowego najpierw kliknij **Klonuj i edytuj** i poproś ją o pracę nad kopią.
2. Sama pisze prompt obrazu i wysyła go do twojego modelu obrazów dokładnie w tej postaci. Pomija twoje profile stylu obrazów i prefiksy promptów (zwykle przygotowane dla grafik postaci), żeby zamiast tła nie powstał portret.
3. Mari sama ogląda każdy obraz (małe powiększa, przezroczyste części pokazuje na szarym tle), zanim go opisze, a ty widzisz go przed jakąkolwiek zmianą. Poproś o kilka wersji do wyboru (do 4 naraz) lub poprawki takie jak "przytnij do górnej połowy", "zrób przezroczyste białe tło" albo "zmniejsz". Każda poprawka to nowa wersja, a wcześniejsze zostają.
4. Gdy się zgodzisz, Mari zapisuje obraz w twoim motywie (jako WebP, tak samo jak **Dodaj obrazy**) i umieszcza go w CSS motywu. Pojawia się w sekcji **Obrazy i dane udostępniania** jak każdy obraz dodany samodzielnie.

Rysowane ozdoby, takie jak poręcze, płotki i przyciski wysyłania, to obrazy SVG. Mari może zmieniać ich kolory bezpośrednio, bez twojego modelu obrazów, a one zachowują ostrość.

Każdy obraz zajmuje tyle czasu, ile potrzebuje twój model obrazów, często od pół minuty do półtorej minuty. Jeśli połączenie do obrazów używa twojego własnego workflow ComfyUI, tekst wpisany w ten workflow nadal jest wysyłany.

### Udostępnianie motywu

1. W sekcji **Obrazy i dane udostępniania** wypełnij pola **Autor**, **Wersja** (na przykład `1.0`), **Opis** i **Miniatura** oraz wybierz **Przeznaczony do** (trybu ciemnego, jasnego lub obu). Aby wraz z motywem zasugerować swoje kolory i czcionkę, kliknij **Użyj moich obecnych ustawień wyglądu** w sekcji **Ustawienia**. Zapisz.
2. Kliknij **Eksportuj** (ikona wysyłania) w wierszu swojego motywu. Marinara zapisuje jeden plik `.json` z CSS, obrazami i czcionkami w środku.
3. Jeśli wykorzystujesz grafikę lub czcionki stworzone przez kogoś innego, otwórz plik w edytorze tekstu i dodaj informacje o autorach oraz licencję. Zobacz [Pliki motywów](#theme-files).
4. Wyślij ten plik. Druga osoba importuje go przez **Importuj plik** i przed instalacją widzi twoje imię, informacje o autorach oraz listę wszystkiego, co motyw zmienia.

### Gdy coś pójdzie nie tak

Marinara zachowuje działanie górnego paska, pasków bocznych, <kbd>Ctrl</kbd>+<kbd>K</kbd> i pola wiadomości niezależnie od działań motywu. Jeśli motyw ukrywa, przesuwa lub zasłania któryś z tych elementów, przy zapisie pojawi się informacja, co nie działa. Nadal możesz wybrać **Mimo to zapisz**, ale Marinara wyłączy motyw na karcie, gdy tylko zakłóci on działanie któregoś z tych elementów. Aby w dowolnej chwili przywrócić zwykły wygląd, naciśnij <kbd>Esc</kbd> trzy razy, dodaj `?safe` na końcu adresu lub naciśnij <kbd>Ctrl</kbd>+<kbd>K</kbd> i wpisz "Własny motyw".

Motywy startowe to dobre przykłady do nauki. Sklonuj jeden i przeczytaj jego CSS, aby zobaczyć, jak używa opisanych poniżej tokenów i selektorów części.

## Jak motyw uzyskuje pierwszeństwo

CSS aplikacji znajduje się w warstwach kaskady zadeklarowanych na samym początku `index.html`:

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- Motyw jest **poza warstwami**, więc zwykły selektor motywu ma pierwszeństwo przed każdą regułą aplikacji bez `!important`, niezależnie od specyficzności reguły aplikacji.
- `mari-pickers` zawiera selektory z sekcji Wygląd (tło, akcent, czcionki, kolory czatu). Znajduje się ponad domyślnymi ustawieniami aplikacji, ale pod motywem, więc kolory motywu mają pierwszeństwo przed selektorami, a sekcja Wygląd informuje użytkownika, gdy motyw nadpisuje selektor.
- `!important` w motywie nadal działa. Te reguły są kopiowane do `mari-theme-important`, która ma pierwszeństwo przed regułami `!important` aplikacji.
- `mari-protected` utrzymuje na miejscu górny pasek, pasek boczny czatów, pasek boczny Biblioteki i Ctrl+K. Motyw może zmieniać ich styl (kolory, czcionki, obramowania, promień narożników, cienie), ale nie może ich ukrywać, przesuwać, zmniejszać ani zasłaniać. Jeśli spróbuje, zostaje wyłączony na tej karcie, a użytkownik dowiaduje się dlaczego.
- Przejście może czekać najwyżej sekundę przed rozpoczęciem (`transition-delay` lub druga wartość czasu w `transition`). Motyw, który dłużej opóźnia zmianę, jest odrzucany, aby nic nie pojawiło się długo po sprawdzeniu ekranu. Animacje mogą mieć dowolne opóźnienie.

Droga powrotu zawsze działa: `?safe` w adresie URL, **Escape trzy razy** lub Ctrl+K → "Własny motyw" wyłącza motyw. Nowy motyw pyta "Zachować ten motyw?" i wraca do poprzedniego wyglądu po 15 sekundach.

## Tokeny kolorów

### Podstawowe (definiuje je każdy styl wizualny)

`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`,
`--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`,
`--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`,
`--border`, `--input`, `--ring`, `--radius`, `--sidebar`, `--sidebar-foreground`, `--sidebar-border`,
`--sidebar-accent`, `--sidebar-accent-foreground`.

Wartości to pełne kolory CSS (`#1b1530`, `rgb(…)`, `oklch(…)`). Same trójki wartości HSL, takie jak `270 25% 8%` (konwencja shadcn), **nie** są tutaj prawidłowe.

Określaj zakres osobno dla jasnego i ciemnego schematu za pomocą `[data-theme="light"]` i `[data-theme="dark"]`.

### Nowy układ

| Token | Zastosowanie |
| --- | --- |
| `--ov-line` | Cienkie linie i obramowania paneli |
| `--ov-text`, `--ov-muted`, `--ov-dim` | Tekst, tekst drugorzędny, słabo widoczny tekst |
| `--ov-accent` | Akcentowane miejsca (domyślnie `--primary`) |
| `--ov-hover`, `--ov-active-bg` | Tła po najechaniu i naciśnięciu |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | Kolory trybów czatu na pasku bocznym czatów i w edytorach |
| `--ov-serif` | Czcionka tytułów (zgodna z `--mari-font-heading`) |
| `--mari-selected-tint` | Zaznaczone wiersze, pastylki i przełączniki. Domyślnie neutralny (`--foreground`); ustaw `var(--primary)`, aby zaznaczenie miało kolor akcentu |
| `--mari-selected-bg`, `--mari-selected-ring` | Wyliczane z odcienia (10% i 18%) |

### Tokeny motywu (v1)

Każdy domyślnie używa wyglądu aplikacji. Jasny schemat ma własne czytelne wartości.

| Token | Zastosowanie |
| --- | --- |
| `--mari-font-ui` | Czcionka całej aplikacji |
| `--mari-font-heading` | Tytuły stron i sekcji |
| `--mari-font-chat` | Tekst wiadomości w czatach w trybach Roleplay i Conversation |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game` | Plakietki na stronie głównej, ostatnie czaty, panel rozpoczynania nowego czatu, nadtytuły widgetów strony głównej |
| `--mari-home-pink`, `--mari-home-violet` | Pozostałe akcenty widgetów strony głównej |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline` | Kropki i etykiety dostępności |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger` | Wskaźniki gry i paski HP. W normalnym stanie nadal wygrywa własny kolor widgetu; zagrożenie zawsze używa tokenu |
| `--mari-game-combat`, `--mari-game-combat-text` | Przycisk Walka w grze |
| `--mari-stage-empty-bg` | Scena gry przed wczytaniem jej obrazu (dowolne `background`, także gradienty) |
| `--mari-scrim` | Przyciemnione tło za Ctrl+K |
| `--mari-user-avatar-placeholder` | Twój awatar, gdy nie masz obrazu (gradient) |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | Gradient na kartach bez obrazu. Każda karta zachowuje swój odcień; ustaw te wartości (w procentach), aby stonować gradienty |
| `--mari-app-backdrop` | Obraz lub gradient za całą aplikacją, rysowany raz (zobacz niżej) |
| `--mari-accent-fx-animation` | Animacja Pulsowanie akcentu lub Tryb RGB, gdy któraś jest włączona, w przeciwnym razie `none` |

### Tokeny motywu dodane w v1.1

Nie mają wartości, dopóki motyw ich nie ustawi, więc do tego czasu obowiązuje ustawienie użytkownika.

| Token | Zastosowanie |
| --- | --- |
| `--mari-text-outline` | Obrys tekstu wiadomości, na przykład `0`, aby go wyłączyć, lub `1px #3b2a1a`. W przeciwnym razie obowiązuje ustawienie użytkownika Obrys tekstu |
| `--mari-dialogue-color` | Kolor dialogu, gdy postać lub persona nie ma własnego (ich własny kolor nadal ma pierwszeństwo) |
| `--mari-chat-font-size` | Rozmiar tekstu wiadomości. Minimum z sekcji Ułatwienia dostępu nadal obowiązuje |
| `--mari-composer-placeholder` | Tekst zastępczy pola wiadomości jako ciąg w cudzysłowie: `"> waiting for user input..."`. Ustaw go na `:root` lub na jednym polu, takim jak `[data-composer="game"]`. Tekst proszący o klucze lub hasła jest ignorowany |
| `--mari-page-veil` | Kolor nakładany na Ustawienia, Bibliotekę, edytory i Dokumentację, aby długi tekst był czytelny na tle. Domyślnie `transparent` |
| `--mari-page-floor` | Prawie nieprzezroczysta warstwa, na której stoi każda pełna strona nad tłem. Domyślnie `color-mix(in srgb, var(--background) 94%, transparent)`; `transparent` ją usuwa |
| `--mari-top-bar-bg` | Pełna wartość `background` dla górnego paska: obraz, gradient lub kilka warstw. `--mari-top-bar-rendering: pixelated` zachowuje ostrość pixel artu. Zakładki i ikony zawsze pozostają na wierzchu i są widoczne |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius` | Nad grafiką górnego paska każda zakładka, zakładka otwartego czatu, przycisk z ikoną i logo spoczywa na podkładce, aby zachować czytelność. Te tokeny ustawiają jej kolor i promień narożników (domyślnie `0.5rem`); ustaw promień na `0`, aby uzyskać kwadratowe przyciski w stylu pixel art. |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | Pasek pod kartami górnego paska (np. przewijane wiadomości lub płot) przenosi się do wiersza grupy, gdy ten jest widoczny (`:root[data-ov-tabrow]`; wiersz to `[data-tab-row]`). Ustaw na `[data-tab-row]` wartość `background`, wysokość i zajmowane miejsce pod kartami (domyślnie wysokość; `0px` umieszcza go z tyłu). `[data-mari-part="tab-row-strip"]` można animować. Pod `:root[data-ov-tabrow]` sam usuń pasek z górnej belki. |
| `--mari-msg-head-rule` | Linia pod imieniem w wiadomościach w trybie Roleplay (wartość `border-bottom`, na przykład `none` lub `2px dashed currentColor`) |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg` | Ramka i powierzchnia każdego widgetu strony głównej, także asystentki Professor Mari |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | Typografia widgetów strony głównej. Widgety rosną na wysokość, gdy tekst potrzebuje więcej miejsca, zamiast go przycinać |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale` | Mała etykieta nad tytułami widgetów, tekst przycisku Zapytaj asystentki Professor Mari i rozmiar obrazu Mari (1 = domyślny) |
| `--mari-home-wash` | Odcień nakładany przez stronę główną na tło (domyślnie: kolor karty z kryciem 65%); `transparent` pokazuje grafikę w pełni |
| `--mari-home-art` | `none` ukrywa domyślne obrazy na kartach strony głównej; wczytują się dopiero w razie potrzeby, więc ukryte nie są pobierane. To małe obrazy wewnątrz pojedynczych kart (Co nowego, Przy stole), a nie tło strony głównej: grafika za nią to tło aplikacji |
| `--mari-ambient` (oraz `-opacity`, `-blend`, `-animation`) | Nakładka otoczenia: zobacz Nakładka otoczenia |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji` | Obraz zamiast ikony pola wiadomości (wartość `background-image`) |
| `--mari-cursor`, `--mari-cursor-pointer` | Wskaźnik w postaci obrazu (pełna wartość `cursor`). Ma pierwszeństwo przed ustawieniem Własny kursor myszy, gdy motyw jest włączony |

### Tokeny motywu dodane w v1.4

Podobnie jak tokeny v1.1, pierwsza grupa nic nie robi, dopóki motyw jej nie ustawi.

| Token | Zastosowanie |
| --- | --- |
| `--mari-message-time` | Kolor czasu wiadomości (`[data-mari-part="time"]`) w każdym trybie czatu |
| `--mari-chat-wash` | Odcień nad tłem czatu w trybie Roleplay jako pełna wartość `background`. Domyślnie to ciemna nakładka, lawendowobiała w schemacie Jasny. `none` ją usuwa |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal` | Kropki stanu wpisów lorebooka |
| `--mari-toast-font-size` | Rozmiar tekstu powiadomień (już używają `--mari-font-ui`) |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size` | Wiersze skrótów Poznaj silnik i Przy stole na stronie głównej. Gdy ustawione jest tylko `--mari-home-widget-text-size`, używają tej wartości, a opisy 0,85 jej wartości |
| `--mari-min-ui-text` | Dolna granica najmniejszego tekstu aplikacji (etykiety, liczniki, plakietki 9-12 px). Można też ustawić tokeny Tailwind `--text-xs`, `--text-sm` i `--text-base` |
| `--mari-user-avatar-image` | Obraz twojego awatara, gdy persona go nie ma. Bez tokenu element zastępczy pokazuje teraz własny obraz persony, jeśli go ma |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | Miejsca na dodatki, zobacz niżej |

Te tokeny zastępują wartości zapisane na stałe w aplikacji, a bez nich wracają do domyślnego wyglądu:

| Token | Zastosowanie |
| --- | --- |
| `--mari-chrome-accent` | Podkreślenie aktywnej zakładki, obramowania edytorów, listy wyboru i ekrany połączeń |
| `--mari-chrome-muted` | Szary tekst drugorzędny w panelach, paskach bocznych i na stronie głównej (domyślnie: 58% koloru tekstu interfejsu) |
| `--mari-resource-accent`, `--mari-resource-<type>` | Kolory Biblioteki według typu: `characters`, `personas`, `lorebooks`, `presets`, `connections`, `agents`, `settings`, `backgrounds`, `browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game` | Kolory wierszy Ctrl+K według trybu |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | Przycisk Walka w trybie Game Mode (oba tła to pełne `background`, więc gradient działa; dodaj też warstwę jednolitego koloru) |
| `--mari-accent-text` | Akcent użyty jako mały tekst lub ikona (aktywne zakładki, etykiety sekcji, linki). Domyślnie: akcent przyciemniony w schemacie Jasny i rozjaśniony w schemacie Ciemny na tyle, aby był czytelny |
| `--mari-top-bar-plate-active` | Podkładka pod aktywnym elementem górnego paska, gdy pasek zawiera grafikę (domyślnie: podkładka zmieszana z 20% akcentu) |
| `--mari-chat-header-bg` | Zanikające tło za nagłówkiem rozmowy (domyślnie: kolor strony o kryciu 88%, zanikający do przezroczystości; `none` przy tle aplikacji) |
| `--mari-home-hero-padding`, `--mari-home-widget-glow` | Odstępy wewnętrzne powitania na stronie głównej i poświata za nagłówkiem jej widgetu |

Aplikacja udostępnia też `--mari-top-bar-height` na `<html>` (rzeczywistą wysokość górnego paska, która zmienia się, gdy motyw go podwyższa), aby motyw mógł odsunąć pod niego własne warstwy.

### Tokeny motywu dodane w v1.5

Do długich odpowiedzi i elementów, które wcześniej wymagały klas wewnętrznych. Każdy nic nie robi, dopóki motyw go nie ustawi, z wyjątkiem tych z podaną wartością domyślną.

| Token | Zastosowanie |
| --- | --- |
| `--mari-chat-column` | Kolumna trybu Roleplay wspólna dla wiadomości i pola wiadomości (domyślnie 58rem). Własne ustawienie czytelnika Ustawienia czatu → Szerokość obszaru czatu nadal ma pierwszeństwo |
| `--mari-message-measure` | Najdłuższy wiersz tekstu wiadomości, na przykład `68ch` (Roleplay i Conversation) |
| `--mari-chat-line-height` | Wysokość wiersza tekstu wiadomości w każdym trybie czatu (domyślnie 1,5). Ułatwienia dostępu → Interlinia nadal ma pierwszeństwo |
| `--mari-dialogue-weight` | Grubość cytowanej wypowiedzi (`[data-mari-part="dialogue"]`), na przykład `400`, aby długa wypowiedź nie była wielkim blokiem pogrubionego tekstu |
| `--mari-dialogue-color` | Teraz działa także wtedy, gdy kolory `--mari-chat-*` motywu włączają kolorowanie czatu, podobnie jak kolory nadane przez motyw kursywie i linkom |
| `--mari-paragraph-gap` | Odstęp między akapitami zamiast jednego pustego wiersza, na przykład `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg` | `on`: wiersz z imieniem w długiej odpowiedzi w trybie Roleplay pozostaje na górze czatu podczas jej przewijania (komputer i tablet). Tło domyślnie odpowiada tłu dymka |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | Położenie przypiętego wiersza (domyślnie: górna krawędź widocznego czatu) i jego zasięg poza tekst (domyślnie 1rem) |
| `--mari-phone-avatar` | `hidden`: telefony pomijają kolumnę awatara w trybie Roleplay, aby odpowiedź zajmowała całą szerokość |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` | Mały obraz obok imienia na telefonach (**Zdjęcia profilowe na telefonach: Mini**, ustawienie domyślne): jego rozmiar i obwódka jako `box-shadow`. To `[data-mari-part="mini-avatar"]` z `data-role` (`user`, `assistant`) |
| `--mari-phone-convo-avatar` | `full`: czaty w trybie Conversation zachowują pełną kolumnę awatara na telefonach nawet wtedy, gdy użytkownik wybierze **Mini** |
| `--mari-vn-fade` | Zanik u dołu pola tekstowego VN, gdy dalsza część akapitu znajduje się niżej (domyślnie 1,75rem, `0` go wyłącza) |
| `--mari-message-actions`, `--mari-swipe-counter` | Kolor narzędzi pod wiadomością i jej licznika swipe'ów "2 / 5" |
| `--mari-card-art-placeholder` | Pełne `background` dla kart Biblioteki bez obrazu zamiast gradientu o losowym odcieniu |
| `--mari-chat-row-art-opacity` | Obraz otwartego czatu za jego wierszem na pasku bocznym czatów (domyślnie 0,14; `0` go ukrywa) |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient` | Teraz obejmują też powierzchnie odczytujące akcent z `<html>` (zakładki Convo / Roleplay / Game, obramowania interfejsu) |
| `--mari-focus-frame-outset` | Zasięg ramki wyróżnienia poza jej powierzchnię (długość, najwyżej 2rem; zobacz Miejsca na dodatki) |
| `--mari-scrim` | Przyciemniona warstwa za oknami |
| `--mari-confirm-scrim` | Jasna, przezroczysta warstwa za krótkimi oknami potwierdzenia (utrzymuj ją delikatną, aby jasne motywy pozostały spokojne) |

Aplikacja udostępnia też `--mari-center-x` na `<html>`, gdy motyw ma nakładkę otoczenia: poziomy środek panelu czatu, dzięki któremu maska może zachować odsłoniętą kolumnę tekstu niezależnie od otwarcia pasków bocznych. Używa go `--mari-gutter-mask`.

## Obrazy

Motyw przechowuje obrazy w `images` w pliku motywu, a jego CSS odwołuje się do nich po nazwie:

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- Obrazy wliczają się do limitu pakietu 6 MiB, a nie do limitu CSS 256 KiB, więc mieszczą się grafiki w pełnym rozmiarze.
- W edytorze otwórz **Obrazy i dane udostępniania** i naciśnij **Dodaj obrazy**. PNG i JPEG są przy dodawaniu zapisywane jako WebP (małe bezstratnie, aby pixel art i ramki z dziewięciu części zachowały ostrość; najwyżej 2560 px na dłuższym boku). Kliknij nazwę obrazu, aby wstawić `url("theme:name")` w miejscu kursora.
- Import motywu robi to samo: obrazy zapisane bezpośrednio jako adresy URL `data:` trafiają z CSS do `images`, nieruchome PNG i JPEG stają się WebP, a podgląd pokazuje każdy obraz wraz z rozmiarem (z polem wyboru "Zachowaj zamiast tego oryginalne pliki (większe)").
- Nazwy `theme:` wyszukują też po nazwie elementy `backgrounds` motywu, więc grafiki dołączone do galerii teł czatu można wykorzystać także w CSS, niezależnie od tego, czy użytkownik doda je do galerii.
- Po zastosowaniu motywu każdy obraz otrzymuje krótki adres URL `blob:` z tego samego źródła: nic nie jest pobierane, a obraz użyty w wielu miejscach jest dekodowany raz.
- GIF, APNG, animowany WebP i SVG z `<animate>` są uznawane za ruchome obrazy. Podgląd importu o tym informuje, a po włączeniu opcji Ogranicz ruch pokazują pierwszą klatkę.

## Tła

Ustaw `--mari-app-backdrop` na `:root`, aby narysować grafikę za aplikacją:

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

Jest rysowana raz, na własnej nieruchomej warstwie pod całą aplikacją (`[data-mari-part="app-backdrop"]`, więc dekoracje strony głównej i jasny schemat nigdy jej nie ukrywają), i pojawia się też za czatami: powierzchnie trybów Roleplay, Conversation i Game Mode stają się przezroczyste, a domyślne tło czatu ustępuje miejsca. Tło wybrane przez użytkownika dla czatu nadal pojawia się na wierzchu. Panele zachowują `--card` i `--sidebar`, więc nadaj im półprzezroczystość, jeśli grafika ma być za nimi widoczna, a `--mari-page-veil` użyj do zabarwienia pełnych stron. Aby nadać stronom własny panel, ustaw styl `[data-mari-part="page"]` (zobacz Selektory): zawiera każdą stronę Biblioteki, edytor, Ustawienia i Dokumentację, więc Księgi wiedzy otrzymują taki sam panel jak Postacie. Nad tłem każda pełna strona stoi też na prawie nieprzezroczystej warstwie w kolorze twojego `--background` (`--mari-page-floor`, domyślnie 94%), aby długie listy i edytory były czytelne. Ustaw `--mari-page-floor` na inny kolor albo na `transparent`, aby pokazać więcej grafiki. Motyw, który stylizuje `[data-mari-part="page"]` z `!important`, zastępuje tę warstwę własnym panelem.

| Token | Wartość domyślna |
| --- | --- |
| `--mari-app-backdrop` | Jeden obraz lub gradient |
| `--mari-app-backdrop-size` | `cover` (wypróbuj `auto` lub `64px` dla kafelków) |
| `--mari-app-backdrop-position` | `center` |
| `--mari-app-backdrop-repeat` | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering` | `auto` (`pixelated` dla pixel artu) |
| `--mari-app-backdrop-layers` | Pełna wartość `background` z kilkoma warstwami, na przykład `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`. Ma pierwszeństwo przed tokenami pojedynczego obrazu |

Własne obrazy to najbardziej elastyczna część motywu: tła, pas górnego paska, ramki widgetów strony głównej i wiadomości (`border-image` lub `background` na dowolnym selektorze części), powtarzane wzory i dołączone czcionki pikselowe mieszczą się w pliku motywu, a podgląd importu je wymienia. Ustawienie użytkownika Wygląd → Ułatwienia dostępu → Intensywność grafiki motywu zmniejsza widoczność tła i nakładki otoczenia, a Wysoki kontrast ogranicza ją do 25%; motyw nie może cofnąć żadnej z tych opcji.

## Nakładka otoczenia

`--mari-ambient` przyjmuje pełną wartość `background` dla warstwy nad czatem i stronami, ale **pod** górnym paskiem i oboma paskami bocznymi: deszcz, spadające liście, linie skanowania, winieta.

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend` ustawia `mix-blend-mode`, a `[data-mari-part="ambient"]::before` i `::after` są dostępne dla dwóch kolejnych warstw. Warstwa nigdy nie przechwytuje kliknięć, przestaje się poruszać po włączeniu opcji Ogranicz ruch (jej obrazy stają się nieruchomymi klatkami) i musi pozostać w większości przezroczysta: motyw, którego warstwa otoczenia zasłaniałaby czat, zostaje wyłączony. Użyj jej zamiast pełnoekranowego `body::after`, który mechanizm ochrony traktuje jako zasłanianie aplikacji.

Warstwa pozostaje nieruchoma, gdy nikt jej nie widzi: gdy aplikacja działa w tle (aktywna jest inna karta lub aplikacja), a na telefonach i tabletach także wtedy, gdy pełna strona, na przykład strona Biblioteki, edytor lub Ustawienia, zasłania czat. Niekończące się animacje w innych częściach motywu też zatrzymują się w tle. Wznawiają działanie od miejsca zatrzymania, więc nie uzależniaj od nich czasu ważnych zdarzeń.

Własne tło czatu to `<img data-mari-part="backdrop">`. Domyślne (gdy nie wybrano tła) ma też `data-default-background="true"`, więc motyw może zastąpić tylko je:

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## Pogoda

Gdy w historii występuje pogoda (Ustawienia → Wygląd → Efekty → Dynamiczne efekty pogody, przy włączonym agencie World State), aplikacja rysuje nad czatem deszcz, śnieg, mgłę, płatki, gwiazdy, słońce lub księżyc. Motyw może zmieniać ich styl za pomocą tokenów `--mari-weather-*` i dopasowywać własną grafikę do pogody.

Dopiero zaczynasz? [Pogoda w twoim motywie](theme-weather.md) prowadzi krok po kroku, z obrazkami.

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

Aplikacja nadal odpowiada za całe rysowanie. Odczytuje te tokeny przy wczytywaniu motywu, zmianie schematu kolorów i edycji motywu, sprawdza każdą wartość i ignoruje wszystko, czego nie rozumie. Pogoda dzienna i nocna (lub osobna dla czatu) działa więc jak każdy inny token.

| Token | Wartości |
| --- | --- |
| `--mari-weather-style` | `smooth` (domyślnie) lub `pixel`: warstwa jest rysowana w niskiej rozdzielczości i powiększana z zachowaniem ostrych krawędzi, a cząsteczki stają się kwadratowymi komórkami |
| `--mari-weather-pixel-size` | Od 2 do 6 (px na komórkę), domyślnie 3 |
| `--mari-weather-<kind>-color` | Zwykły kolor (`#hex`, nazwa koloru, `rgb()`, `hsl()`), bez gradientów i obrazów |
| `--mari-weather-<kind>-image` | Do 4 własnych obrazów motywu, `url("theme:a.png") url("theme:b.png")`; każda cząsteczka wybiera jeden. W stylu smooth liście, płatki i popiół obracają się podczas opadania |
| `--mari-weather-<kind>-size` | Mnożnik od 0,5 do 3. W stylu pixel obraz jest rysowany w swoim rozmiarze pomnożonym przez tę wartość, dzięki czemu pixel art zachowuje piksele (piksel grafiki = rozmiar x 1 px) |
| `--mari-weather-<kind>-shape` | `round` lub `square` (styl smooth; kwadraty do "śniegu danych" lub iskier) |
| `--mari-weather-amount` | Od 0,25 do 1: motyw może zmniejszyć liczbę cząsteczek pogody, ale nigdy jej zwiększyć |
| `--mari-weather-speed` | Mnożnik od 0,5 do 1,5 |
| `--mari-weather-strength` | Mnożnik od 0,5 do 1,5 określający widoczność cząsteczek (delikatny deszcz nad ciemnym miastem) |
| `--mari-weather-tint-strength` | Mnożnik od 0 do 1 dla domyślnego zabarwienia nieba (niebieskie w deszczu, ciemne nocą) |
| `--mari-weather-rain-length` | Mnożnik długości smug deszczu od 0,5 do 3 |
| `--mari-weather-sun`, `-moon` | `none`, gdy tło ma własne słońce lub księżyc |
| `--mari-weather-lightning-color` | Kolor błysku. Jego siła i czas pozostają łagodnymi, bezpiecznymi dla osób z padaczką wartościami aplikacji |
| `--mari-weather-lightning-bolt` | `on`, `none` lub 0,5-3 (szerokość): rozgałęziona błyskawica po lewej lub prawej stronie przy każdym błysku, zanikająca wraz z nim |

Rodzaje: `rain`, `snow`, `hail`, `fog`, `dust`, `leaf` (wietrzna pogoda), `petal` (kwitnienie), `ember`, `ash`, `sand`, `firefly`, `star`, `aurora` oraz `sun` i `moon` (kolor, rozmiar i jeden obraz).

### Grafika podążająca za pogodą

Gdy pogoda czatu jest widoczna, `<html>` zawiera dwa słowa ze stałych list (nigdy tekst samej historii):

| Atrybut | Wartości |
| --- | --- |
| `data-mari-weather` | `clear`, `cloudy`, `rain`, `storm`, `snow`, `hail`, `fog`, `sand`, `ash`, `embers`, `wind`, `blossom`, `aurora` |
| `data-mari-sky` | `dawn`, `day`, `dusk`, `night` |
| `data-mari-shelter` | `indoors` lub `outdoors` (brak, gdy aplikacja nie potrafi tego określić) |

W pomieszczeniach aplikacja nie rysuje cząsteczek, ławic mgły, słońca, księżyca ani gwiazd, tylko zabarwienie i błysk błyskawicy, więc tokeny pogody motywu są widoczne tylko na zewnątrz. Atrybuty są ustawiane niezależnie od opcji Ogranicz animacje i efekty otoczenia (zamiana tła nie jest ruchem) i usuwane, gdy czat nie ma pogody lub użytkownik ją wyłączy. Użyj ich, aby poszarzyć słoneczne tło podczas deszczu lub wyłączyć własną warstwę otoczenia, aby nie dublowała pogody:

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### Co pozostaje w gestii użytkownika

- Motyw nie może włączać ani wyłączać pogody; decyduje przełącznik użytkownika.
- Opcja Ogranicz animacje i efekty otoczenia (lub ustawienie ograniczania ruchu na urządzeniu) całkowicie wyłącza rysowanie pogody.
- Opcja Ograniczone efekty renderowania usuwa zabarwienie, poświaty i nakładkę zachodu słońca oraz rysuje 60% cząsteczek.
- Opcja Intensywność grafiki motywu zmniejsza widoczność pogody motywu tak jak jego tła, a Wysoki kontrast ogranicza ją do 25%.
- Na każdym urządzeniu rysowanie pogody zatrzymuje się, gdy panel, edytor lub Mari zasłania czat.

Petal OS (pikselowa pogoda i własne płatki), NEON//GRID (deszcz cyjanowych smug) oraz Lantern Path (malowane liście, tła szarzejące przy złej pogodzie) to gotowe przykłady: użyj **Klonuj i edytuj** na jednym z nich, aby przeczytać jego CSS.

## Efekty akcentu

Pulsowanie akcentu i Tryb RGB animują kilka akcentowanych miejsc w nowym układzie ("+ Nowy", główne przyciski, kafelek awatara asystenta) za pomocą filtra CSS. Nic nie jest przepisywane przy każdej klatce. Motyw może:

- włączyć Pulsowanie akcentu dla swoich użytkowników przez `:root { --marinara-theme-accent-pulse: enabled; }`;
- dodać własne elementy przez `animation: var(--mari-accent-fx-animation);`.

Oba efekty zatrzymują się przy `prefers-reduced-motion` i ustawieniu aplikacji "Ogranicz animacje i efekty otoczenia".

## Selektory

### Na `<html>`

| Atrybut | Wartości |
| --- | --- |
| `data-theme` | `dark`, `light` |
| `data-visual-theme` | `default` (Marinara), `sillytavern` (Dottore), `stage` |
| `data-overhaul` | `on` (nowy układ, komputer), `mobile` (nowy układ, telefon i tablet); brak w starym układzie |
| `data-custom-theme` | Identyfikator aktywnego motywu |
| `data-seasonal-theme` | Wygląd sezonowy, gdy jest włączony |
| `data-mari-accent-fx` | `pulse` lub `rgb`, gdy działa efekt akcentu |
| `data-chat-id` | Identyfikator otwartego czatu |
| `data-chat-open-mode` | Tryb otwartego czatu: `roleplay`, `conversation`, `game` |
| `data-chat-tags` | Tagi otwartego czatu, małymi literami ze spacjami zastąpionymi przez `-`: nadaj historii styl przez `:root[data-chat-tags~="horror"]` |
| `data-mari-chat-art-behind` | Obecny, gdy tło czatu jest wyświetlane za panelami bocznymi (`--mari-chat-art` to obraz) |
| `data-marinara-reduced-effects` | Obecny, gdy animacje otoczenia są ograniczone |
| `data-mari-a11y-line-height` | Obecny, gdy użytkownik zwiększy odstępy między wierszami (`--mari-a11y-line-height`) |
| `data-mari-a11y-letter-spacing` | Obecny, gdy użytkownik zwiększy odstępy między literami (`--mari-a11y-letter-spacing`) |
| `data-mari-a11y-focus` | Obecny, gdy włączone są wyraźne obwódki fokusu |
| `data-mari-contrast` | `more`, gdy włączony jest wysoki kontrast (wybór użytkownika lub żądanie urządzenia) |
| `data-mari-cvd-safe` | Obecny, gdy włączone są kolory przyjazne daltonistom |
| `data-mari-weather` | Pogoda historii, gdy jest widoczna: `rain`, `snow`, `fog` i inne (zobacz [Pogoda](#weather)) |
| `data-mari-sky` | `dawn`, `day`, `dusk` lub `night`, gdy pogoda historii jest widoczna |
| `data-mari-shelter` | `indoors` lub `outdoors`, gdy pogoda historii jest widoczna, o ile aplikacja potrafi to określić na podstawie lokalizacji |

### Obszary

`[data-component="…"]` nazywa duże obszary: `AppShell`, `TopBar`, `ChatSidebar`, `ChatSidebarSlot`, `RightPanelDesktop`, `RightPanelDesktopSlot`, `CenterContent`, `GlobalOmnibar`, `OverhaulLibraryNav`, `OverhaulSettingsPage`, `OverhaulLibraryPage`, `OverhaulCardGallery`, `OverhaulEditorHead`, `OverhaulEditorRail`.

### Części

| Selektor | Co oznacza |
| --- | --- |
| `[data-mari-part="message"]` | Jeden wiersz wiadomości w każdym trybie czatu: pełna szerokość czatu, z awatarem, wierszem imienia i dymkiem w środku. Koloruj dymek (`bubble` poniżej), a nie ten wiersz, inaczej każdy dymek znajdzie się w drugim polu. Ma też `data-message-id` i `data-message-role` (`user`, `assistant`, `system`, i inne) oraz dane wiadomości opisane niżej |
| `[data-mari-part="bubble"]` | Sam dymek wiadomości w trybach Roleplay i Conversation (`.mari-rp-bubble` / `.texting-bubble`). Tu ustawiaj tło, obramowanie, promień narożników i cień |
| `[data-mari-part="message"][data-latest]` | Najnowsza odpowiedź postaci |
| `[data-mari-part="message"][data-streaming]` | Odpowiedź, która jest jeszcze pisana |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | Wewnątrz wiadomości: awatar, wiersz imienia i narzędzia wiadomości |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]` | Przełącznik (lub pole) rozumowania i jego tekst, ten sam selektor na komputerze i telefonie |
| `[data-mari-part="composer"]` | Pole wiadomości. `data-composer` ma wartość `roleplay`, `conversation` lub `game` |
| `[data-mari-part="home-art"]` | Domyślne obrazy na kartach strony głównej |
| `[data-mari-part="message"][data-vn]` | Pole dialogowe visual novel: wiadomość z tymi samymi danymi (postać, rola, indeks) oraz częściami `avatar` i `header` w środku |
| `[data-mari-part="vn-sprite"]` | Pusta warstwa za polem dialogowym VN, sięgająca dołu sceny. Ma `data-vn-speaker` (imię mówiącej postaci jako slug lub jej rolę), `data-vn-speaker-role`, `data-character` i `data-character-id` aktualnie mówiącej postaci, więc motyw może umieścić tam jej obraz. `[data-roleplay-vn-media]` ma te same atrybuty |
| `[data-mari-part="message"][data-game-narration]` | Pole narracji w trybie Game Mode. `data-message-role` ma wartość `narrator` albo `assistant` z `data-character` i `data-character-name`, gdy mówi postać; `data-segment-type` i `data-expression` opisują bieżący wiersz |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]` | Warstwy tła i otoczenia. Ich miejsce na stronie jest stałe; ustawiaj styl przez tokeny |
| `[data-mari-part="home-widget"]` | Karta widgetu strony głównej, także asystentki Professor Mari. Jej ramka ma `data-home-widget-id` (`recent`, `professor`, `whats-new`, `character-library`, i inne). W środku: `home-widget-eyebrow`, `home-widget-title`, `home-widget-text` |
| `[data-mari-part="top-bar"]` | Górny pasek na każdym urządzeniu. Druga strona widoku podzielonego ma własny wąski pasek z tymi samymi selektorami (`[data-component="TopBar"]`, `.ov-tab`, `.ov-tab__label`, `.ov-icon-btn`), oznaczony `[data-split-bar]`, więc obejmują go też grafika i czcionki górnego paska |
| `[data-mari-part="page-title"]` | Duży tytuł głównej strony: każdej sekcji Biblioteki (Postacie, Księgi wiedzy, Połączenia, Agenci i inne), Ustawień, Rozszerzeń i Dokumentacji. Ustawiaj styl tytułów stron tym jednym selektorem, aby były spójne na każdej stronie |
| `[data-mari-part="backdrop"]` | Obraz tła czatu (zobacz Tła) |
| `[data-mari-part="stage-empty"]` | Scena gry bez obrazu sceny |
| `[data-mari-part="time"]` | Czas wiadomości w każdym trybie czatu |
| `[data-mari-part="chat-header"]` | Nagłówek rozmowy (`data-chat-mode="conversation"`) |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]` | Pływający panel mapy i drużyny w trybie Game Mode oraz rząd narzędzi narracji |
| `[data-mari-part="avatar-placeholder"]` | Puste koło awatara; `data-role` ma wartość `user` lub `assistant` |
| `[data-mari-part="header"][data-placement]` | W wiadomościach w trybie Roleplay: `outside` (imię nad dymkiem) lub `inside` |
| `[data-mari-part="home-widget-glow"]` | Poświata za nagłówkiem widgetu strony głównej |
| `[data-mari-part="dialogue"]` | Cytowana wypowiedź w wiadomości |
| `[data-mari-part="paragraph-gap"]` | Pusty wiersz między dwoma akapitami (staje się blokiem po ustawieniu `--mari-paragraph-gap`) |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav` | Pole tekstowe VN (`data-more-below`, gdy można je dalej przewijać), licznik "3 / 9" i przyciski Poprzedni / Następny (`data-direction`) |
| `[data-mari-part="card-art"]` | Obraz karty Biblioteki; `data-placeholder`, gdy go nie ma |
| `[data-mari-part="page"]` | Powierzchnia każdej pełnej strony: każdej strony Biblioteki (Postacie, Księgi wiedzy, Presety, Skrypty regex, Połączenia, Agenci, Własne narzędzia), każdego edytora, Ustawień i Dokumentacji. Narysuj panel lub arkusz tutaj, a nie na klasie konkretnej strony, aby każda strona otrzymała tę samą czytelną powierzchnię. Czaty i strona główna znajdują się poza nią |
| `[data-mari-part="chat-row-art"]` | Obraz otwartego czatu za jego wierszem na pasku bocznym |
| `[data-mari-part="avatar-placeholder"]` | Teraz w każdym miejscu, w którym pojawia się pusty awatar: wiersze rozmowy, wiersze czatów (inicjały), przełącznik persony, pole wiadomości i tryb Game Mode |
| `.ov-lrow__dot[data-status]` | Kropka wpisu lorebooka: `constant`, `selective` lub `normal` |
| `[data-chat-row]` | Wiersz na pasku bocznym czatów; `data-selected="true"` dla otwartego czatu |
| `[data-chat-mode]` | Powierzchnia czatu według trybu |
| `.mari-messages-scroll` | Przewijana lista wiadomości |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant` | Dymki w trybach Roleplay i Conversation |
| `.mari-window`, `.mari-drawer` | Wysuwane okna i panele |

### Miejsca na dodatki

Pojawiają się tylko wtedy, gdy aktywny motyw ich żąda, więc domyślna strona nie zawiera dodatkowych części.

- **Ramka wyróżnienia.** `--mari-focus-frame` przyjmuje pełną wartość `border-image`, na przykład `url("theme:frame.png") 24 fill / 24px / 6px stretch`, i rysuje ją wokół elementu skupiającego uwagę czytelnika: najnowszej odpowiedzi, Ctrl+K, otwartego okna i Ostatnich czatów na stronie głównej. Dodaj `data-mari-focus-surface` do dowolnego innego elementu (w szablonie wiadomości), aby też go obramować. Od v1.5 ramka wychodzi poza swoją powierzchnię tylko przez `--mari-focus-frame-outset` (najwyżej 2rem), a wcale, gdy wartość zawiera `fill`, więc nie może zamalować czatu; wysunięcie zapisane wewnątrz `--mari-focus-frame` jest ignorowane. Ramka to `border-image`: skrót `border` zapisany później w CSS dla tego samego elementu ją resetuje, więc zamiast niego ustaw tam `border-color`, `border-width` i `border-style`.
- **Tytuły okien.** Ustawienie `--mari-window-title` (dowolna wartość, na przykład `on`) dodaje wiersz tytułu na górze każdej wiadomości, widgetu strony głównej i pola wiadomości: `[data-mari-part="window-title"]` z `data-window` (`message`, `home-widget`, `composer`, a od v1.5 także `narration`, `omnibar`, `window` i `dialog`), zawierający `window-title-text` (mówiącą postać, tytuł widgetu lub "Wiadomość") oraz puste `window-buttons` na twoje ozdoby `_ [] X`.
- **Podglądy wierszy czatów.** Ustawienie `--mari-chat-row-preview` (dowolna wartość, na przykład `on`) dodaje najnowszy wiersz każdego czatu pod jego nazwą na liście Czaty: `[data-mari-part="chat-row-preview"]` z `data-role` (`user`, `assistant`, `narrator` i inne), zaczynający się od `[data-mari-part="chat-row-preview-who"]` ("Ty:" dla twoich wierszy lub imię mówiącej postaci w czacie grupowym). Ustępuje miejsca bieżącej informacji wiersza ("pisze…", "Niewysłany szkic"), więc wiersz nigdy nie pokazuje dwóch. Bez tokenu tekst nie jest pobierany ani rysowany.
- **Otoczenie za kartami.** `--mari-ambient-placement: behind-cards` przesuwa warstwę otoczenia pod wiadomości, widgety strony głównej i panele (nadal nad tłem) zamiast nad czat. `--mari-ambient-mask` (pełna wartość `mask`) określa, gdzie jest widoczna, a `--mari-ambient-mask: var(--mari-gutter-mask)` pozostawia środek okna odsłonięty, aby deszcz padał na bocznych marginesach, a nie na tekście. `--mari-gutter-clear` ustawia połowę szerokości odsłoniętego obszaru (26rem).

### Dane wiadomości

Każda wiadomość zawiera informację o autorze, numerze i czasie powstawania jako atrybuty dla selektorów i `attr()` oraz zmienne CSS dla `content:` i `counter()`:

| Atrybut | Zmienna | Wartość |
| --- | --- | --- |
| `data-character-id` | | Identyfikator postaci (brak w twoich wiadomościach) |
| `data-character-name` | `--mari-msg-char` | Wyświetlane imię (`--mari-msg-char` to ciąg w cudzysłowie) |
| `data-character` | | Imię małymi literami ze spacjami zastąpionymi przez `-`, do selektorów: `[data-character="captain-faye"]` |
| `data-message-index` | `--mari-msg-index` | Numer wiadomości pokazywany przez "Pokazuj numery wiadomości" |
| `data-gen-ms` | `--mari-msg-gen` | Czas generowania w ms (`--mari-msg-gen` to ciąg taki jak `"3.2s"`) |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### Szablon wiadomości (HTML)

Gdy CSS nie wystarcza, na przykład do pola stanu z imieniem mówiącej postaci i numerem wiadomości, plik motywu może zawierać mały szablon HTML dla każdej roli. Jest wypełniany dla każdej wiadomości i pokazywany w polu na jej końcu, `[data-mari-part="message-extra"]`, którego styl i położenie określa twój CSS:

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

Klucze: `message` (każda rola), `assistant`, `user`, `narrator` (własny szablon roli ma pierwszeństwo przed `message`). Pola: `{{char}}`, `{{role}}`, `{{index}}`, `{{gen}}`, `{{time}}`, `{{date}}`; nieznane pola pozostają puste. Każdy szablon ma najwyżej 4 000 znaków. Marinara zachowuje tekst i znaczniki układu (`div`, `span`, `p`, `b`, `i`, `ul`, `table`, `details`, `progress` i inne) z atrybutami `class`, `title`, `role` i `data-*`, a usuwa skrypty, style, `style` zapisane bezpośrednio w znaczniku, linki, obrazy, formularze i atrybuty zdarzeń. Szablon, którego tekst prosi o klucze lub hasła, jest odrzucany.

HTML wymaga zgody użytkownika: motyw z szablonem można zainstalować tylko po włączeniu **Ustawienia → Wygląd → Motywy CSS → Zezwalaj na motywy z HTML (akceptuję ryzyko)** (domyślnie wyłączone). Podgląd importu o tym ostrzega, a po wyłączeniu przełącznika zainstalowany motyw jest wyświetlany bez swojego HTML.

## Wygląd osobny dla czatu

Ustawienia czatu → Motyw nadaje jednemu czatowi własny motyw ("Wygląd domyślny" wyłącza własne motywy dla tego czatu). W czacie z dokładnie jedną postacią wybór może stać się domyślnym ustawieniem tej postaci dla jej pozostałych czatów jeden na jeden; czaty grupowe i drużyny w grze nigdy nie przejmują ustawienia domyślnego jednego uczestnika. Sekcja Motyw pokazuje, skąd pochodzi bieżący wygląd: z czatu, postaci czy aplikacji. Ustawienia, Biblioteka, edytory i Dokumentacja zawsze używają motywu aplikacji, a `data-chat-id` i `data-chat-tags` znajdują się na `<html>` tylko wtedy, gdy widoczny jest sam czat.

Tagi to przenośny sposób nadawania stylu konkretnym historiom w jednym motywie: `:root[data-chat-tags~="noir"] { --primary: #c9a227; }`. Dodaj tagi w Ustawienia czatu → Nazwa czatu ("+ Dodaj tag"), przyciskiem tagów w wierszu czatu (lub przez "Tagi" w menu po długim naciśnięciu na ekranach dotykowych). W atrybucie tagi mają małe litery, a spacje są zastępowane przez `-`, więc "Noir Mystery" pasuje do `noir-mystery`.

Ustawienie dowolnej zmiennej `--mari-chat-*` (na przykład `--mari-chat-bg`, `--mari-chat-text`, `--mari-chat-radius`, `--mari-chat-font-family`) samo włącza odpowiedni styl powierzchni czatu; użytkownicy nie muszą używać przełączników "Zastosuj preset ...", aby zobaczyć kolory czatu z motywu.

## Dzień i noc

Ustawienia → Wygląd → Schemat kolorów może dostosowywać się do systemu lub pory dnia (domyślnie Jasny od 07:00, Ciemny od 19:00; obie godziny można zmienić). W obu przypadkach przełącza tylko `data-theme` na `<html>`, więc motyw uzyskuje wygląd dzienny i nocny, określając styl obu:

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

Schemat jest ustalany na każdym urządzeniu według jego własnego zegara (nie jest synchronizowany), więc telefon i komputer w różnych miejscach pokazują odpowiednią część. Plik motywu może sam zasugerować przełączanie: `"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }` (lub `"system"`). Podgląd importu proponuje je jak każde inne ustawienie.

## Pliki motywów

Eksport zapisuje jeden motyw jako jeden plik JSON:

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

Informacje o autorach (v1.5) trafiają do tego samego pliku i pojawiają się na liście motywów (przycisk (i)) oraz w podglądzie importu:

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` to najwyżej cztery krótkie tagi (po 40 znaków), pokazywane pod nazwą motywu. Czcionka lub informacja o autorze z licencją `OFL-1.1` prowadzi do tekstu SIL Open Font License dołączonego do aplikacji. Obrazy szersze niż 1920 px (lub 2560 px na dłuższym boku) są zmniejszane podczas importu motywu.

Wymagane są tylko `kind`, `name` i `css`. `templates` opisano w sekcji Szablon wiadomości. Klucze `settings`: `colorScheme` (`dark`, `light`, `time` lub `system`), `dayStart`, `nightStart`, `visualStyle`, `accent`, `accentLight`, `background`, `backgroundLight`, `fontFamily`, `accentPulse`, `fontSize` (Rozmiar wyświetlania w px: 12, 14, 16, 17, 19, 22, 26, 30 lub 34) i `reduceMotion` (true lub false). Import najpierw pokazuje podgląd z zaznaczonymi sugerowanymi ustawieniami, z wyjątkiem opcji Styl wizualny, Pulsowanie akcentu, Rozmiar wyświetlania i Ogranicz ruch, które użytkownik zaznacza według uznania. Użytkownik wybiera też, czy dodać tła do swojej galerii. Obrazy poniżej 4 KiB pozostają zapisane bezpośrednio w CSS i są pokazywane jako jedna plakietka "małe ikony". Czcionki wczytują się z motywem (jako reguły `@font-face`) i znikają wraz z nim. Import motywu o tej samej nazwie co zainstalowany proponuje aktualizację, a aktualizacja nie dodaje drugi raz tego samego tła do galerii. Limit CSS wynosi 256 KiB tekstu CSS; obrazy, miniatura, czcionki i tła mają razem 6 MiB. Obraz, który się nie mieści, jest pomijany osobno wraz z informacją o rozmiarze, a reszta motywu nadal się instaluje. Nadal można importować zwykłe pliki `.css`, `{ "name", "css" }` oraz starszy eksport `marinara.theme-folder`.

## Jak zachować szybkość motywu

Na telefonach i tabletach, zwłaszcza na iPadach w przeglądarce Safari, powolny CSS daje się odczuć przy każdym dotknięciu. Większość motywów działa dobrze; te wzorce spowalniały motywy podczas testów:

- **`:has()` na rodzicu, który następnie określa styl swoich dzieci**, na przykład `.panel:has(> .row) > *` lub `body:has(.open) .chat *`. Przeglądarka ponownie sprawdza wtedy całą stronę przy każdej wpisanej literze i każdym przesyłanym strumieniowo słowie. Umieść `:has()` na elemencie, którego styl określasz (`.row:has(> img)`), albo użyj selektora `data-mari-part`.
- **`backdrop-filter` na wielu elementach naraz**, na przykład na każdej wiadomości lub każdym wierszu czatu. Jeden lub dwa panele z efektem matowego szkła są w porządku; rozmycie na każdym ze stu wierszy już nie. Zamiast tego użyj przezroczystego koloru.
- **Animowanie układu** (`width`, `height`, `top`, `margin`) lub dużych cieni `box-shadow`. Animuj `opacity` i `transform` albo `background-position` na warstwie otoczenia.

**Ustawienia → Zaawansowane → Rozwiązywanie problemów → Pokaż czasy dotknięć** pokazuje, ile trwa każde dotknięcie na danym urządzeniu, z twoim motywem i bez niego. Porównaj oba wyniki, aby znaleźć powolną regułę.

## Ułatwienia dostępu

Ustawienia → Wygląd → Ułatwienia dostępu stosuje wybrane przez użytkownika odstępy między wierszami i literami, obwódki fokusu, wysoki kontrast, kolory przyjazne daltonistom oraz minimum 12 px dla tekstu wiadomości. Wartości są zapisywane w warstwie `mari-protected` bezpośrednio na każdym elemencie (lib/accessibility-css.ts), więc motyw nie może ich cofnąć, nawet przez ponowne zdefiniowanie zmiennych. Gdy opcja jest wyłączona, motyw może ustawić:

| Token | Zastosowanie |
| --- | --- |
| `--mari-focus-ring-color` | Zwykła obwódka fokusu aplikacji (domyślnie `--primary`) |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | Kolory stanów i wskaźników, gdy chcesz użyć własnej pary niebieski/pomarańczowy |

W przypadku grafiki trzy dodatkowe opcje mają pierwszeństwo przed motywem:

- **Intensywność grafiki motywu** (0-100%) zmniejsza widoczność tła i nakładki otoczenia.
- **Wysoki kontrast** dodatkowo nadaje powierzchniom nieprzezroczyste kolory danego schematu (`--background`, `--card`, `--popover`, `--sidebar`, `--secondary`, `--muted`, `--mari-rp-bubble-bg`, zasłona strony, nakładka strony głównej, widgety strony głównej i podkładka górnego paska) oraz utrzymuje widoczność grafiki motywu na poziomie najwyżej 25%, aby tekst nigdy nie leżał na pastelowym obrazie. Kolory zapisane bezpośrednio przez motyw we własnych selektorach nie są zmieniane, więc wybieraj tokeny.
- **Ogranicz ruch** pokazuje ruchome obrazy jako pierwszą klatkę i zatrzymuje nakładkę otoczenia. Wymuszone kolory (Windows High Contrast) ukrywają grafikę i ramki `border-image`.

Używaj powyższych tokenów stanów i wskaźników zamiast stałych zieleni i czerwieni, a przełącznik kolorów przyjaznych daltonistom obejmie też twój motyw. Linki przejścia do treści (`.mari-skip-link`) pozostają dostępne niezależnie od działań motywu. Podgląd importu informuje użytkownika, gdy motyw próbuje zmienić którykolwiek z tych elementów.

## Bezpieczeństwo

- Można zmieniać styl górnego paska (także jego automatycznego ukrywania w trybie pełnoekranowym), paska bocznego czatów i jego wierszy, paska bocznego Biblioteki, Ctrl+K i pola wiadomości, ale nie można ich ukrywać, przesuwać, zasłaniać, wygaszać, usuwać filtrami ani uniemożliwiać ich klikania. Mechanizm ochrony mierzy je z motywem i bez niego po wczytaniu motywu, po 2,5 s i 10 s, przy otwieraniu czatu i panelu, zmianie schematu kolorów, zmianie rozmiaru oraz rozpoczęciu lub zakończeniu jednej z animacji motywu. Wyłącza motyw na tej karcie, gdy zakłóca on działanie któregoś z tych elementów.
- Obrazy też się liczą (ochrona v3). Wszystko, co jest rysowane nad zakładką, ikoną, wierszem czatu lub polem wiadomości, jest wykrywane w środku tego elementu niezależnie od `pointer-events: none` i rozmiaru, a warstwa, która go ukrywa (kolor, gradient lub obraz, którego piksele w tym miejscu są w większości nieprzezroczyste), jest uznawana za zasłanianie. Dotyczy to też wysunięcia `border-image`, które nachodzi na element, i obrazowej `mask` na nim. Wewnątrz górnego paska każde `::before` i `::after` znajduje się pod etykietami i ikonami, a maski, `list-style-image` i `border-image-outset` nie działają. Tło i nakładka otoczenia nigdy nie są uwzględniane: z założenia znajdują się pod paskami.
- Ochrona v4 (runda 4). Sprawdzanie kontrastu odczytuje warstwy za tekstem w kolejności rysowania (wypełnienie `border-image`, potem każda warstwa tła od góry, a następnie kolor), waży każdą według faktycznie zakrywanej części tekstu (rozmiar, pozycja i powtarzanie) i próbkuje obraz tylko pod tekstem. Cienka linia lub mała ozdoba w rogu już się nie liczy, a ciemna zasłona nad jasną stroną jest odczytywana jako ciemna. Górny pasek i pole wiadomości są sprawdzane bardziej rygorystycznie: ich tekst musi zachować kontrast 3:1 w najgorszym miejscu, jeśli miał go wcześniej. Obraz na własnym `::before` lub `::after` elementu, który go zakrywa, jest uznawany za zasłanianie na górnym pasku, w wierszach czatów i w polu wiadomości. Obraz z `position: fixed` na pseudoelemencie powoduje ostrzeżenie w edytorze; zamiast tego użyj `position: absolute`, `--mari-ambient` lub `--mari-app-backdrop`. Gdy grafika górnego paska zostanie wykryta na pseudoelemencie, zakładki i ikony dostają podkładki jak przy `--mari-top-bar-bg`.
- Kontrast na grafice: gdy obraz znajduje się za tekstem, mechanizm ochrony odczytuje kolory obrazu zamiast pomijać sprawdzenie.
- Tekst czatu (v1.5): mechanizm ochrony próbkuje kilka ostatnich wierszy widocznych na ekranie czatu i wyłącza motyw, gdy ten zamalowuje połowę z nich (zasłona z pseudoelementu, nieprzezroczyste otoczenie za kartami lub ramka wyróżnienia, której wysunięcie nachodzi na tekst). Wiersz przesunięty poza ekran przez sam układ motywu nie jest liczony, podobnie jak wiersz imienia przypięty przez motyw nad odpowiedzią.
- Tekst dodawany przez motyw za pomocą `content:` jest pokazywany w podglądzie importu.
- Zasady tekstu motywów (audyt bezpieczeństwa, listopad 2026). Każdy ciąg, który motyw może wyświetlić, jest sprawdzany przed zastosowaniem motywu, niezależnie od źródła (plik, edytor, Mari, kopia zapasowa, wybór dla czatu): ciągi `content:` i `quotes`, właściwości niestandardowe (więc `content: var(--x)` też się liczy), symbole `@counter-style`, tekst zastępczy pola wiadomości, szablony wiadomości (słowa i `title`) oraz tekst w obrazach SVG. Tekst proszący o klucze, hasła, logowanie lub dane konta, podszywający się pod aplikację ("zhakowano", "RCE", "alert bezpieczeństwa", "zweryfikowane przez aplikację Marinara", "zadzwoń do pomocy technicznej"), zawierający numer telefonu lub adres internetowy albo przekraczający 80 liter i cyfr w jednej deklaracji jest odrzucany: motywu nie można zainstalować, a zainstalowany nie zostaje zastosowany. Podobnie wyglądające litery, znaki diakrytyczne, znaki o zerowej szerokości, odstępy i zapis 1337 są najpierw normalizowane. Ciągi w selektorach, `font-family` i nazwach obszarów siatki nie są liczone. Nazwa, autor, opis i informacje o autorach motywu również nie mogą prosić o sekrety ani twierdzić, że są oficjalne (adresy internetowe są tam dozwolone).
- Adresy URL: oprócz oczyszczania tekstu (lista dozwolonych url(), brak `@import`, czcionki tylko jako data:) arkusz stylów jest analizowany przez przeglądarkę przed zastosowaniem, a każdy adres inny niż własne obrazy motywu, osadzone obrazy i czcionki data:, `#fragments` i `about:invalid` powoduje odrzucenie motywu. `src()` podlega regułom url(), a niedomknięte na końcu `image-set(` jest usuwane.
- Sugerowane kolory w pliku motywu (`settings.accent`, `background` i ich jasne odpowiedniki) muszą być zwykłymi kolorami lub gradientami: bez `url()`, `image-set()` ani niczego, co wychodzi poza wartość.
- Obrazy SVG są przed użyciem odbudowywane według listy dozwolonych elementów: bez `<script>`, `<foreignObject>`, `<a>`, atrybutów zdarzeń, zewnętrznych linków, `<?xml-stylesheet?>` i encji DOCTYPE, a ich CSS jest oczyszczany tak jak CSS motywu. Obrazy rastrowe, które po zdekodowaniu przekroczyłyby 8192 px na bok lub 40 megapikseli, są odrzucane.
- Tokeny pogody są odczytywane według listy dozwolonych wartości: znane nazwy tokenów, liczby ograniczone do swoich zakresów, słowa ze stałych list i zwykłe kolory (bez `url()`, gradientów i funkcji innych niż funkcje kolorów). Obrazy pogody muszą być własnymi obrazami motywu (adresy z tego samego źródła utworzone dla nich przez aplikację, po odbudowie SVG i ograniczeniu rozmiaru); każdy inny adres jest ignorowany. Nic, co zapisuje motyw, nie jest wykonywane, a błysk błyskawicy zachowuje siłę i czas aplikacji.
- Szablony wiadomości nie mogą używać ról tworzących okno, menu lub ogłoszenie ani własnych atrybutów `data-` aplikacji lub nazw klas `mari-`/`ov-`.
- Wypróbowywanie motywu ("Zachować ten motyw?") odbywa się tylko na tej karcie: inne urządzenia otrzymują go dopiero po zachowaniu. Brak odpowiedzi oznacza powrót; najechanie na pasek lub przeniesienie na niego fokusu zatrzymuje odliczanie. Trzykrotne naciśnięcie Escape wyłącza własne motywy na karcie; Escape zamykający Ctrl+K, menu lub okno aplikacji nie jest liczony.

## Zmiany

- **Miniaturowe obrazy na telefonach, spokojniejsze animacje** (12-14 listopada 2026, kontrakt nadal w wersji 1): `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` i `--mari-phone-convo-avatar` dla małego obrazu obok imienia na telefonach; `--mari-chat-row-preview` dodaje najnowszy wiersz każdego czatu na liście Czaty; przejście może czekać najwyżej sekundę; warstwa otoczenia i niekończące się animacje pozostają nieruchome, gdy nikt ich nie widzi; [Jak zachować szybkość motywu](#keeping-a-theme-fast).

- **Czytelny tekst akcentu i selektor paska widoku podzielonego** (11 listopada 2026, kontrakt nadal w wersji 1): akcent używany jako mały tekst nieco ciemnieje w schemacie Jasny i jaśnieje w schemacie Ciemny, aby etykiety były czytelne, a przyciski zachowują pełny akcent; `--mari-accent-text` pozwala samodzielnie ustawić ten kolor tekstu. `[data-mari-part="top-bar"]` to górny pasek na każdym urządzeniu, a druga strona widoku podzielonego ma własny pasek z tymi samymi selektorami `[data-component="TopBar"]` (oraz `[data-split-bar]`), więc obejmują go grafika, czcionki i kolory zakładek górnego paska motywu. `--mari-game-combat-bg` i `-bg-hover` to pełne `background`, więc gradienty działają.

- **Selektor powierzchni strony** (10 listopada 2026, kontrakt nadal w wersji 1): `[data-mari-part="page"]` to wspólna powierzchnia każdej strony Biblioteki, edytora, Ustawień i Dokumentacji, więc motyw może nadać im ten sam panel.

- **Galeria motywów i błyskawice** (9 listopada 2026, kontrakt nadal w wersji 1): motywy startowe są pobierane na żądanie z galerii motywów; `--mari-weather-lightning-bolt` (`on`, `none` lub szerokość od 0,5 do 3) rysuje rozgałęzioną błyskawicę wzdłuż jednego boku ekranu przy każdym błysku burzy.

- **Pogoda motywu** (listopad 2026, kontrakt nadal w wersji 1): tokeny `--mari-weather-*` (styl pikselowy, kolory, obrazy, rozmiar, prędkość, liczba, siła, zabarwienie, wyłączenie słońca i księżyca), `data-mari-weather` i `data-mari-sky` na `<html>` oraz zatrzymywanie pogody pod panelami zasłaniającymi czat. Używają ich Petal OS, NEON//GRID i Lantern Path.

- **Runda 6 i audyt bezpieczeństwa** (listopad 2026, bez nowych tokenów, kontrakt nadal w wersji 1): motywy startowe są tylko do odczytu, a **Klonuj i edytuj** tworzy edytowalną kopię (od 9 listopada są pobierane na żądanie z galerii motywów zamiast być częścią instalacji); informacje o autorach, licencja i etykiety pojawiają się w podglądzie importu i pod przyciskiem (i); wypróbowywanie motywu odbywa się tylko na tej karcie do wybrania **Zachowaj motyw**; zasady tekstu motywów, sprawdzanie adresów URL, odbudowa SVG i sprawdzanie sugerowanych kolorów opisane w sekcji [Bezpieczeństwo](#safety).

- **v1.5** (runda 5 motywów, długie odpowiedzi): `--mari-chat-column`, `--mari-message-measure`, `--mari-chat-line-height`, `--mari-dialogue-weight`, `--mari-paragraph-gap`, przypięta mówiąca postać, `--mari-phone-avatar`, części pola tekstowego VN i zanikanie, `--mari-message-actions`, `--mari-swipe-counter`, `--mari-card-art-placeholder`, `--mari-chat-row-art-opacity`, `--mari-focus-frame-outset`, `--mari-scrim` i `--mari-center-x`; części dialogue, paragraph-gap, card-art i chat-row-art oraz elementy zastępcze awatarów wszędzie; tytuły okien w narracji, Ctrl+K, oknach i oknach dialogowych; akcent interfejsu obejmuje elementy z zakresem w korzeniu; ochrona sprawdza tekst czatu; informacje o autorach motywu, licencja i etykiety wraz z dołączonym tekstem OFL; duże obrazy zmniejszają się przy imporcie.

- **v1.4** (runda 4 motywów): ochrona v4 (warstwowe tła, zamalowany obszar, rygorystyczne sprawdzanie górnego paska i pola wiadomości, zasłony z pseudoelementów); `fontSize` i `reduceMotion` w plikach motywów oraz zaznaczanie sugerowanych ustawień w podglądzie importu; tokeny czasu wiadomości, nakładki trybu Roleplay, akcentu interfejsu i przygaszonego tekstu, kolorów Biblioteki i Ctrl+K, przycisku Walka, powiadomień, kropek lorebooków, skrótów strony głównej, minimalnego rozmiaru tekstu i awatara użytkownika; `--mari-top-bar-height` i `--mari-top-bar-plate-active`; części time, chat-header, game-hud, game-tools, avatar-placeholder i home-widget-glow; miejsca na ramkę wyróżnienia, tytuł okna, otoczenie za kartami i maskę marginesów.

- **v1.3** (runda 3 motywów, obrazy): `images` w pliku motywu i `url("theme:name")`; limit CSS obejmuje tylko tekst CSS; WebP przy imporcie; tło na własnej warstwie; `--mari-page-veil` zachowane nad tłem; zachowane skróty `!important` z `var()`; nakładka otoczenia; obrazowe ikony i kursor; `--mari-home-wash`, `--mari-home-art` i więcej tokenów widgetów strony głównej; selektory dialogu VN, miejsca na sprite'a VN i narracji trybu Game Mode; pliki motywów mogą sugerować opcję Zgodnie z porą dnia; ochrona v3.

- **v1.2**: miejsce na szablon wiadomości (`templates` w pliku motywu, `[data-mari-part="message-extra"]`), wymagające zgody użytkownika przez "Zezwalaj na motywy z HTML (akceptuję ryzyko)".

- **v1.1**: selektory wiadomości w każdym trybie czatu z postacią, indeksem i czasem generowania; części awatara, nagłówka, działań i rozumowania; `--mari-composer-placeholder`; tło v2 (rozmiar, pozycja, powtarzanie, pikselowość, warstwy) widoczne też za czatami; `--mari-page-veil`; `--mari-top-bar-bg`; `--mari-text-outline`, `--mari-dialogue-color`, `--mari-chat-font-size`, `--mari-msg-head-rule`; tokeny widgetów strony głównej z asystentką Professor Mari jako `home-widget`. `--mari-stage-empty-bg` jest teraz wartością `background` (gradienty działają).
- **v1.0.1**: ochrona v2, chronione wartości Ułatwień dostępu, sprawdzanie dodawanego tekstu. Instalacja odbywa się w całości albo wcale, dołączone tła są instalowane, Wróć przywraca też ustawienia zastosowane przez motyw, czcionki motywu pojawiają się na liście Czcionka, odwołania `url(#id)` są zachowywane, a nazwy dołączonych czcionek są odczytywane z czcionek.
- **v1** (pierwszy opublikowany kontrakt): opisane wyżej tokeny motywu, selektory części, tło i efekty akcentu.
