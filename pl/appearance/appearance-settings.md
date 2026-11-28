# Ustawienia wyglądu

Zakładka **Wygląd** zmienia wygląd aplikacji Marinara Engine: kolory, rozmiar tekstu, odstępy, tła oraz przyciski i okna czatu. Sąsiednie zakładki **Conversation**, **Roleplay** i **Game** odpowiadają za styl poszczególnych trybów czatu.

Szukasz czegoś innego?

- Gotowy wygląd albo własny motyw: [Własne motywy CSS](custom-css-themes.md).
- Inna czcionka: [Własne czcionki i Google Fonts](fonts.md).
- Obraz tła czatu: [Biblioteka teł](chat-backgrounds.md).
- Własny wygląd postaci w czacie: [Przewodnik po stylowaniu kart w CSS](card-css-theming.md).

## Otwieranie ustawień wyglądu

1. Otwórz **Biblioteka → Ustawienia**.
2. Kliknij zakładkę **Wygląd**.
3. Kliknij nazwę sekcji w wierszu pod zakładkami, żeby do niej przejść, albo przewiń.

| Zakładka | Sekcje |
| --- | --- |
| **Wygląd** | **Motyw**, **Czcionki i rozmiar tekstu**, **Ułatwienia dostępu**, **Kolory tekstu**, **Układ**, **Efekty**, **Tła**, **Przyciski i okna czatu**, **Motywy CSS** |
| **Conversation** | **Układ Conversation**, **Tło Conversation** |
| **Roleplay** | **Panel trackerów**, **Wiadomości Roleplay**, **Awatary**, **Visual Novel** |
| **Game** | **Tekst gry**, **Grafika gry**, **Zasoby gry** |

Żeby zacząć od nowa, kliknij **Resetuj wygląd** na górze sekcji **Motyw**. Przycisk przywraca domyślny wygląd aplikacji Marinara Engine, czyści tło bieżącego czatu i wyłącza własny motyw.

W klasycznym układzie te sekcje znajdują się w zakładce **Wygląd** pod czterema przyciskami: **Aplikacja**, **Conversation**, **Roleplay** i **Game**.

## Motyw

| Ustawienie | Do czego służy |
| --- | --- |
| **Styl wizualny** | **Default (Marinara)** to retrowy wygląd w stylu Y2K z efektami poświaty. **SillyTavern** to czysty, minimalistyczny wygląd. To ustawienie zmienia wyłącznie wygląd i nie ma nic wspólnego z importem z aplikacji SillyTavern. **Stage** używa śliwkowych, mosiężnych i karmazynowych barw nowego układu. |
| **Nowy układ (podgląd przebudowy interfejsu)** | Domyślnie włączony. Wyłącz go, żeby wrócić do klasycznego układu. Te przewodniki opisują najpierw nowy układ. |
| **Wygląd na tym urządzeniu** | **Tak samo jak na innych urządzeniach** (domyślnie) współdzieli styl wizualny, kolory, czcionkę i własny motyw ze wszystkimi urządzeniami. **Tylko to urządzenie** nadaje temu urządzeniu osobny wygląd, na przykład jasny na telefonie, a ciemny na komputerze. |
| **Schemat kolorów** | **Ciemny** (domyślnie), **Jasny**, **Zgodnie z systemem** lub **Zgodnie z porą dnia** – ta ostatnia opcja przełącza schemat według zegara tego urządzenia o wybranych godzinach. |
| **Własny kursor myszy** | Domyślnie włączony. Wyświetla kursor aplikacji Marinara Engine w kolorze akcentu. Wyłącz go, żeby korzystać z kursora systemowego albo żeby o kursorze decydował własny motyw. |
| **Kolor akcentu** | Przyciski, aktywne ikony, obwódki fokusu, podświetlenia i kontury. Domyślnie **Gradient Marinara**, mieszanka różu, pomarańczu i cyjanu. |
| **Pulsowanie akcentu** | Delikatnie rozjaśnia i przygasza akcent albo przechodzi po kolei przez barwy gradientu. Domyślnie włączone na komputerze, wyłączone na telefonie. |
| **Tryb RGB** | Przeprowadza akcent przez tęczową paletę. Zapisany **Kolor akcentu** pozostaje bez zmian. Domyślnie wyłączony. |

**Kolor akcentu** przyjmuje jednolity kolor albo gradient, czyli płynne przejście między dwoma lub większą liczbą kolorów. Kliknij **Przywróć domyślne**, żeby wrócić do wartości domyślnej. Tło aplikacji zależy od trybu ciemnego lub jasnego, a własny motyw może ustawić inne. Naraz może być włączone tylko jedno z ustawień **Pulsowanie akcentu** i **Tryb RGB**.

## Czcionki i rozmiar tekstu

- **Czcionka** wybiera czcionkę aplikacji. Zobacz [Własne czcionki i Google Fonts](fonts.md).
- **Rozmiar wyświetlania** ustawia bazowy rozmiar tekstu dla całej aplikacji na tym urządzeniu. Zmiana działa od razu.

| Opcja | Rozmiar |
| --- | --- |
| **Tiny** | 12 px |
| **Small** | 14 px |
| **Medium** | 16 px |
| **Default** | 17 px |
| **Large** | 19 px |
| **Huge** | 22 px |
| **Extra large** | 26 px |
| **Extra extra large** | 30 px |
| **Maximum** | 34 px |

- **Chat Font Size** (rozmiar czcionki czatu) to suwak rozmiaru tekstu wiadomości w czacie, od 12 px do 72 px. Domyślnie jest to 16 px.

## Ułatwienia dostępu

| Ustawienie | Do czego służy |
| --- | --- |
| **Interlinia** | Odstępy między wierszami wiadomości i dłuższego tekstu: **Domyślne**, **Swobodne (1,6)**, **Luźne (1,8)** lub **Podwójne (2,0)**. Menu i przyciski zachowują swój rozmiar. |
| **Odstępy między literami** | Odstępy między literami w całej aplikacji: **Domyślne**, **Nieco szerzej**, **Szerzej** lub **Najszersze**. |
| **Wysoki kontrast** | Wyraźniejsze kolory tekstu, obramowań i fokusu. Opcja **Zgodnie z systemem** włącza go, gdy urządzenie prosi o większy kontrast. |
| **Wyraźne obwódki fokusu** | Gruby obrys elementu wybranego klawiaturą. Klawisz <kbd>Tab</kbd> udostępnia też linki **Przejdź do treści**. |
| **Ogranicz ruch** | Zatrzymuje animacje, przejścia, **Pulsowanie akcentu** i efekty motywu. Włącza się automatycznie, gdy urządzenie prosi o ograniczenie ruchu. |
| **Intensywność grafiki motywu** | Określa, jak mocno widać obraz tła i nakładkę własnego motywu (deszcz, liście, linie skanowania). Zmniejsz wartość, gdy grafika motywu utrudnia czytanie tekstu. |
| **Kolory przyjazne daltonistom** | Niebieski i pomarańczowy zamiast zielonego i czerwonego dla kropek stanu, wskaźników i przycisków usuwania. |

## Kolory tekstu

- **Chat Text Color** (kolor tekstu czatu) to główny kolor tekstu wiadomości. Domyślnie jest to `#d4d4d4` w trybie Dark i `#1a1025` w trybie Light.
- **Domyślny kolor dialogu** koloruje wypowiedzi w cudzysłowie, gdy postać lub persona nie ma własnego koloru wyróżnienia dialogu. Kolory z karty mają pierwszeństwo. Gdy przełącznik **Zastosuj kolory presetu** jest włączony w sekcji **Przyciski i okna czatu**, wypowiedzi przyjmują kolor tekstu z tego stylu.
- **Kolor tekstu obramowania czatu** ustawia tekst kontrolek wokół czatu: widgetów trackerów, etykiet folderów, opisów ustawień i okien otwieranych przyciskami czatu. Ma te same wartości domyślne co **Kolor tekstu czatu**.
- **Text Outline / Stroke** (obrys tekstu) dodaje obwódkę, dzięki której tekst pozostaje czytelny na niespokojnym tle. Ustaw kolor i szerokość **Width** od 0 do 5 px. Domyślnie jest to 0,5 px, a 0 wyłącza obrys.

## Układ

- **Szerokość paska bocznego na komputerze** ustawia szerokość obu pasków bocznych na komputerze. Przycisk **Resetuj szerokość** ją przywraca. Telefony zachowują swój układ.
- **Pokaż pasek stanu Androida** pokazuje pasek stanu telefonu w aplikacji na system Android.

## Efekty

- **Dynamiczne efekty pogody (deszcz, śnieg, mgła itd.)** są domyślnie włączone. Pokazują pogodę zgodnie z pogodą i porą dnia w historii oraz wymagają włączonego agenta **World State** dla czatu. Zobacz [Agenci: pomocnicy AI w czatach](../agents/agents-overview.md).
- **Ogranicz animacje i efekty otoczenia** zatrzymuje ozdobne animacje, cząsteczki, obracające się podglądy i stopniowe odsłanianie tekstu.

- **Pokazuj rzuty kośćmi jako tekst** (domyślnie wyłączone) pokazuje każdy rzut jako krótki wiersz z kośćmi, wynikami i sumą zamiast animowanych kości. Rzuty nadal się odbywają, a model i gra otrzymują wyniki. Dotyczy to wszystkich trybów czatu, także kości w testach umiejętności.
- **Ograniczone efekty renderowania** spłaszcza kosztowne półprzezroczyste panele i cienie, żeby słabsze urządzenia działały płynnie.

## Tła

Ta sekcja zawiera selektor **Tło czatu** i ustawienie **Rozmycie tła**. Selektor pokazuje tło bieżącego czatu (albo **Domyślne tło**) i ostatnio wybrane obrazy. Kliknij obraz lub **Przeglądaj bibliotekę**, żeby wybrać inny. Są tu też:

- **Przezroczystość obrazu tła w trybie Conversation**: określa, jak mocno widać tło czatu w trybie Conversation.
- **Tło czatu za panelami bocznymi**: rozciąga złagodzone tło otwartego czatu za paskami bocznymi i górnym paskiem.
- **Tła na liście czatów**: pokazuje tło każdego czatu jako przygaszony baner za jego wierszem na liście czatów. Wybierz **Active & Hovered**, **Every Row** albo **Off**.

Zobacz [Biblioteka teł](chat-backgrounds.md).

## Przyciski i okna czatu

**Styl widgetów czatu** ustawia wygląd przesuwanych przycisków, okien i sekcji czatu. Wybierz **Domyślny**, **Dottore** (lodowy błękit, blady metal i ścięte narożniki) lub **Professor Mari** (bajkowe ramki ze złotymi wykończeniami). Wybór resetuje kontrolki poniżej.

| Kontrolka | Do czego służy |
| --- | --- |
| **Czcionka** | **Czcionka presetu**, **Czcionka aplikacji**, **Bezszeryfowa**, **Książkowa szeryfowa** lub **Techniczna o stałej szerokości**. |
| **Kształt** | **Kształt presetu**, **Zaokrąglony**, **Prostokątny**, **Ścięte narożniki** lub **Łukowy**. |
| **Rozmiar przycisków (px)** | Zmienia rozmiar przesuwanych przycisków czatu i ich ikon. Wpisz wartość od 32 do 96 albo zostaw pole puste, żeby użyć rozmiaru domyślnego. |
| **Kolor obramowań i przycisków**, **Kolor tła**, **Kolor tekstu** | Trzy główne kolory. Zresetuj wybrany kolor, żeby zależał od presetu i trybu ciemnego lub jasnego. |
| **Zastosuj czcionkę presetu**, **Zastosuj kształt presetu**, **Zastosuj kolory presetu** | Przenoszą styl także na wiadomości, pola wpisywania i kontrolki czatu. Domyślnie wyłączone. |

Asystentka Professor Mari może stworzyć dla ciebie własny styl czatu. Poproś ją o to na czacie.

## Motywy CSS

Gotowe motywy oraz motywy, które tworzysz lub importujesz. Zobacz [Własne motywy CSS](custom-css-themes.md).

## Zakładka Conversation

- **Układ czatu** (w sekcji **Układ Conversation**) zmienia wygląd wiadomości w trybie Conversation i pokazuje podgląd na żywo. **Linear** (domyślnie) wyświetla wiersze w stylu czatu. **Bubbles** wyświetla dymki w stylu komunikatora.
- **Avatar Shape** (kształt awatara) to **Circular** (okrągły) albo **Square** (kwadratowy). Rozmiar awatara się nie zmienia.
- **Zdjęcia profilowe na telefonach** ustawia zdjęcia obok wiadomości na telefonie w każdym trybie czatu. **Mini** (domyślnie) umieszcza małe zdjęcie przy każdym imieniu: przed imieniem postaci i za twoim, dzięki czemu wiadomości zachowują pełną szerokość. **Pełne** zachowuje kolumnę ze zdjęciem, a **Wyłączone** ukrywa zdjęcia. Na tabletach i komputerach zawsze widać pełne zdjęcie.
- **Motyw rozmowy** (w sekcji **Tło Conversation**) ustawia dwukolorowy gradient za każdym czatem w trybie Conversation. Zakładki **Ciemny** i **Jasny** mają każda własny gradient. To ustawienie domyślne dla wszystkich czatów w trybie Conversation, a nie dla pojedynczego czatu.

Przełączniki menu swipe'ów znajdują się w sekcji **Ustawienia → Czatowanie → Edycja i swipe'y**.

## Zakładka Roleplay

**Panel trackerów** odpowiada za styl panelu statystyk, stroju i lokalizacji obok czatów w trybie Roleplay. Zobacz [Pasek HUD i trackery w trybie Roleplay](../roleplay/hud-and-trackers.md).

**Wiadomości Roleplay**

| Ustawienie | Do czego służy | Domyślnie |
| --- | --- | --- |
| **Położenie czatu** | Gdzie na szerokim ekranie stoją wiadomości i pole wpisywania: **Po lewej**, **Na środku** lub **Po prawej**. Na telefonie czat zajmuje całą szerokość. | **Na środku** |
| **Własna szerokość czatu** | Ustawia własną szerokość kolumny wiadomości. | Wyłączone |
| **Nieprzezroczystość tła wiadomości w trybie Roleplay** | Zmniejsz wartość, żeby tło prześwitywało przez dymki wiadomości. Nadpisuje półprzezroczyste kolory z kart i presetów. | 90% |
| **Rozciągaj wiadomości** | Każda wiadomość wypełnia cały wiersz, dzięki czemu krótkie wiadomości wyrównują się z długimi. | Wyłączone |
| **Ukryj linię pod imionami** | Usuwa cienką linię pod imionami. | Wyłączone |

**Awatary**

| Ustawienie | Do czego służy | Domyślnie |
| --- | --- | --- |
| Styl awatara | **Brak**, **Małe koła**, **Małe prostokąty**, **Panel boczny** lub **Zanikający panel boczny**, czyli szeroki portret, który wtapia się w wiadomość. | **Małe koła** |
| **Scrollable Avatars** | Utrzymuje awatary na widoku podczas przewijania długiej wiadomości. | Wyłączone |
| **Przełączane awatary narratora**, **Obramowania awatarów Narratora** | Wygląd awatara narratora. | |
| **Skala awatarów wiadomości** | Od 75% do 250%. | 100% |
| **Domyślna skala sprite'ów** | Od 50% do 175%. Rozmiar sprite'ów ustawiony dla czatu nadal ma pierwszeństwo. | 100% |

**Visual Novel**

**Widok Visual Novel** pokazuje po jednym gotowym akapicie naraz, z portretem dialogowym i twoimi sprite'ami. Ustawia widok nowych czatów w trybie Roleplay oraz tych bez własnego wyboru. **Automatyczne odtwarzanie akapitów VN** z ustawieniem **Opóźnienie akapitów**, **Skala portretu dialogowego** i **Skala sprite'ów całej postaci** określają sposób odtwarzania.

**Pokazuj myślenie w wiadomościach** i **Nie zwijaj myślenia** znajdują się w sekcji **Ustawienia → Czatowanie → Myślenie**.

## Zakładka Game

**Tekst gry**

- **Natychmiast pokazuj tekst gry** pomija efekt pisania.
- **Nawigacja kółkiem myszy i kliknięciem** pozwala przechodzić przez historię za pomocą myszy.
- **Szybkość narracji w Game** i **Przerwa między segmentami autoodtwarzania Game** określają szybkość wyświetlania tekstu i przechodzenia dalej.
- **Wyświetlanie dialogów w grze**: **Classic Dialogue Box** (domyślnie) pokazuje jeden fragment, a wcześniejsze linijki są dostępne pod przyciskiem **Logi**. **History Above Dialogue Box** pokazuje wcześniejsze fragmenty nad polem.
- **Efekty tekstu gry** (domyślnie włączone) animują dramatyczne słowa, wyróżnienia pisane WIELKIMI LITERAMI, wtrącenia i tagi efektów tekstowych. Wyłącz je, żeby wyświetlać zwykły tekst.

**Grafika gry** ma dwa suwaki: **Skala portretu dialogowego** (od 75% do 175%, domyślnie 100%) i **Skala sprite'ów całej postaci** (od 75% do 275%, domyślnie 135%).

Sekcję **Zasoby gry** opisuje przewodnik [Zasoby gry](../game/game-assets.md).

## Ustawienia, które zostają na tym urządzeniu

Większość ustawień wyglądu synchronizuje się z pozostałymi urządzeniami. **Rozmiar wyświetlania** i **Rozmiar czcionki czatu** nie. Zapisują się w przeglądarce, której używasz. Żeby nadać urządzeniu całkiem inny wygląd, użyj **Wygląd na tym urządzeniu** w sekcji **Motyw**. Co się synchronizuje, opisuje [Przegląd ustawień](../settings/settings-overview.md).

## Powiązane przewodniki

- [Własne motywy CSS](custom-css-themes.md)
- [Własne czcionki i Google Fonts](fonts.md)
- [Biblioteka teł](chat-backgrounds.md)
- [Przewodnik po stylowaniu kart w CSS](card-css-theming.md)
- [Przegląd ustawień](../settings/settings-overview.md)
