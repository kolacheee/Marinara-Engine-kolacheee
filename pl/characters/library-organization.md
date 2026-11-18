# Porządkowanie biblioteki postaci

Strona **Postacie** w bibliotece (po prawej) zawiera wszystkie utworzone lub zaimportowane postacie. Służy do wyszukiwania, sortowania, grupowania postaci w foldery, oznaczania ulubionych, filtrowania po tagach oraz eksportowania i usuwania wielu postaci naraz.

## Strona Postacie

Otwórz **Biblioteka → Postacie**. Strona pokazuje postacie jako karty z portretami. U góry znajdziesz:

- **Przeglądaj online** otwiera [Przeglądarkę kart](bot-browser.md), w której znajdziesz postacie z publicznych witryn.
- **Importuj** wczytuje plik postaci. Zobacz [Importowanie i eksportowanie kart postaci](import-export.md).
- **Nowa postać** otwiera okno **Utwórz postać**, w którym utworzysz pustą postać lub skorzystasz z szablonu. Karta **Nowa postać** w siatce robi to samo.
- **Search characters or tag:name** filtruje karty (zobacz [Wyszukiwanie](#search)).
- Przycisk **Tagi** obok pola wyszukiwania ogranicza widok do kart z wybranymi tagami (zobacz [Tagi](#tags)).
- **Ulubione** i **Ostatnio edytowane** ograniczają widoczne karty. Na telefonie tworzą jedną listę **Filtr**.
- Menu sortowania zawiera **Od A do Z**, **Od Z do A**, **Najnowsze**, **Najstarsze** i **Moja kolejność**.
- Trzy przyciski rozmiaru ustawiają małe, średnie lub duże karty.
- **Nowy folder** (ikona folderu) i **Zaznacz** (ikona zaznaczenia) znajdują się obok tytułu strony.

Kliknij kartę, żeby otworzyć postać. Jej przycisk **Czat** rozpoczyna czat z tą postacią. Jeśli masz wiele postaci, kliknij **Wczytaj więcej** u dołu.

### Działania na karcie

Najedź kursorem na kartę i kliknij **⋯** w jej lewym górnym rogu albo kliknij kartę prawym przyciskiem myszy. Na ekranie dotykowym naciśnij i przytrzymaj kartę. Menu zawiera:

- **Duplikuj** tworzy kopię postaci.
- **Przenieś do folderu** umieszcza postać w folderze albo wyjmuje ją z niego po wybraniu **Bez folderu**.
- **Eksportuj** pobiera postać w natywnym formacie aplikacji Marinara.
- **Zaznacz** rozpoczyna zaznaczanie od tej karty.
- **Usuń** usuwa postać po potwierdzeniu.

### Własna kolejność

Przeciągnij kartę i upuść ją przed inną kartą albo za nią. Menu sortowania przełącza się na **Moja kolejność** i zachowuje tę kolejność do czasu wybrania innego sortowania. Wybierz ponownie **Moja kolejność**, żeby do niej wrócić. **Kolejność ręczna** w klasycznym panelu oznacza tę samą kolejność.

### Foldery

1. Kliknij **Nowy folder** obok tytułu strony. Nad kartami pojawia się folder o nazwie **bez nazwy**.
2. Aby zmienić jego nazwę, kliknij **⋯** na folderze i wybierz **Zmień nazwę**.
3. Przeciągnij kartę na folder albo użyj **Przenieś do folderu** w menu karty.

Kliknij nazwę folderu, żeby go zwinąć lub rozwinąć. Liczba obok nazwy to liczba postaci w środku. **Usuń folder** w menu **⋯** folderu usuwa tylko folder: jego postacie wracają na stronę poza folderem.

### Eksportowanie lub usuwanie wielu postaci

1. Kliknij **Zaznacz** obok tytułu strony. Na każdej karcie pojawia się pole wyboru.
2. Kliknij wybrane karty. Pasek u dołu pokazuje liczbę zaznaczonych kart i przycisk **Zaznacz wszystko**.
3. Wybierz **Przenieś do folderu**, **Eksportuj** albo **Usuń** na pasku.

**Eksportuj** pobiera jeden plik zip o nazwie `marinara-characters.zip`. **Usuń** najpierw prosi o potwierdzenie. Kliknij **X** na pasku albo naciśnij <kbd>Esc</kbd>, żeby zakończyć zaznaczanie.

Sortowanie **Najpierw ulubione** i usuwanie tagu ze wszystkich postaci są dostępne w panelu postaci klasycznego układu, opisanym poniżej. Przełącz się na niego opcją **Nowy układ (podgląd przebudowy interfejsu)** w **Ustawienia → Wygląd → Motyw** i wróć w ten sam sposób.

## W klasycznym układzie: panel Postacie

Z górnej części panelu możesz:

- Kliknąć **Download** (pobranie), żeby otworzyć [Card Browser](bot-browser.md) i znaleźć postacie w publicznych serwisach.
- Kliknąć **Open Library** (otwarcie biblioteki), żeby otworzyć większą, pełnoekranową siatkę tych samych postaci.
- Kliknąć **New** (nowa, ikona plusa), żeby otworzyć okno **Create Character** (tworzenie postaci).
- Kliknąć **Import** (import, ikona pobierania), żeby zaimportować plik postaci. Zobacz [Importowanie i eksportowanie kart postaci](import-export.md).
- Kliknąć **Select** (zaznaczanie, ikona ptaszka), żeby włączyć tryb zaznaczania do działań zbiorczych.

Pełna biblioteka zapamiętuje zaznaczoną kartę, kolejność sortowania i pozycję przewijania, gdy otwierasz postać do edycji i wracasz.

Każdy wiersz pokazuje awatar, nazwę, opcjonalną linię z tytułem, autora i wersję, do 3 tagów oraz przybliżoną liczbę tokenów. Mała plakietka z gwiazdką oznacza ulubioną postać. Po najechaniu na wiersz pojawiają się **Duplicate** (duplikowanie) i **Delete** (usuwanie). Przy dużej liczbie postaci kliknij **Load more** (wczytanie kolejnych) na dole, żeby wczytać następną stronę.

## Wyszukiwanie

Wpisz tekst w pole wyszukiwania na górze. Tekst zastępczy to **Search characters or tag:name** (**Szukaj postaci/tagów** w klasycznym układzie). Zwykły tekst jest porównywany z nazwą postaci, tytułem, opisem i tagami, bez rozróżniania wielkości liter. Po wpisaniu `knight` zobaczysz każdą postać, która ma "knight" w którymkolwiek z tych miejsc.

| Zapytanie | Co znajduje |
| --- | --- |
| `male genshin` albo `male,genshin` | Karty, które mają oba dokładne tagi. |
| `male "Modern AU"` | Tag ze spacjami lub przecinkami ujmij w cudzysłów. |
| `-tag:"slow burn"` | Ukrywa każdą kartę z tym tagiem, nawet jeśli reszta zapytania do niej pasuje. |
| `-vampire` | To samo dla tagu jednowyrazowego. Cudzysłowy można pominąć. |
| `mage -tag:"villain"` | Karty pasujące do "mage", bez tych z tagiem "villain". |

Zwykłe wyszukiwanie fraz nadal działa. Ten sam sposób wyszukiwania działa w pełnoekranowej bibliotece Character Library i dla person.

## Sortowanie (klasyczny układ)

Lista rozwijana sortowania w klasycznym panelu zawiera:

| Opcja | Działanie |
| --- | --- |
| **Manual order** | Kolejność ustawiona przez ciebie. |
| **A-Z** | Nazwy od A do Z. |
| **Z-A** | Nazwy od Z do A. |
| **Newest** | Najpierw ostatnio utworzone. |
| **Oldest** | Najpierw najstarsze. |
| **Favorites** | Najpierw ulubione, potem cała reszta. |
| **Najwięcej tokenów** | Najpierw największe karty, według szacowanego rozmiaru widocznego w każdym wierszu. Foldery są sortowane według sumy rozmiarów swoich kart. |
| **Najmniej tokenów** | Najpierw najmniejsze karty. |

Sortowanie według rozmiaru pomaga znaleźć karty do skrócenia lub rozbudowania. Licznik szacuje rozmiar tekstu samej karty; nie jest to liczba tokenów obliczona przez tokenizer twojego modelu. Persony, lorebooki i presety promptów oferują te same dwa sposoby sortowania.

Żeby ustawić własną kolejność, przeciągnij wiersz w górę lub w dół albo naciśnij <kbd>Alt</kbd>+<kbd>Up</kbd> lub <kbd>Alt</kbd>+<kbd>Down</kbd> na wierszu, który ma fokus. Każdy z tych sposobów przełącza sortowanie na **Manual order** (kolejność ręczna).

## Foldery (klasyczny układ)

Foldery grupują pokrewne postacie, na przykład według historii albo serii, dzięki czemu długą listę łatwiej przejrzeć. Są opcjonalne, a nowy układ pokazuje te same foldery.

1. Kliknij **New Folder** (nowy folder). Pojawia się folder o nazwie **unnamed**.
2. Zmień jego nazwę: kliknij go dwukrotnie, dotknij go dwukrotnie albo zaznacz go i naciśnij <kbd>F2</kbd>. Wpisz nową nazwę i naciśnij <kbd>Enter</kbd>.
3. Przeciągnij wiersz postaci na folder, żeby umieścić ją w środku. Gdy masz już folder, wyświetla się wskazówka **Drag and drop characters to folders, double-click or double-tap to rename**.

Żeby wyjąć postać z folderu, najedź na jej wiersz wewnątrz folderu i kliknij przycisk usuwania z folderu albo przeciągnij ją na zewnątrz. Kliknięcie folderu rozwija go lub zwija. Liczba obok jego nazwy mówi, ile postaci jest w środku.

Na ekranie dotykowym naciśnij i przytrzymaj wiersz, żeby go podnieść, a potem przeciągnij. Zwykłe przesunięcie palcem nadal przewija listę.

Żeby przenieść kilka postaci naraz, przytrzymaj jeden wiersz i stuknij drugim palcem inne wiersze, żeby zabrać je razem jako stos. Potem upuść stos na folder.

Żeby usunąć folder, najedź na niego i kliknij jego przycisk kosza. Folder z postaciami prosi o potwierdzenie: **Delete "name"? Its N characters will stay in the library and move out of the folder.** Pusty folder znika od razu. Usunięcie folderu nigdy nie usuwa postaci, które są w środku.

## Używanie folderu jako składu czatu grupowego

Każdy folder jest też zapisanym składem postaci do czatów grupowych. Podczas przygotowywania czatu z więcej niż jedną postacią **Add from Folder** (dodanie z folderu) dodaje wszystkie postacie z folderu w jednym kroku. Zobacz [Czaty grupowe w trybach Conversation i Roleplay](../chats/group-chats.md).

## Ulubione i tagi

### Ulubione

Otwórz postać i kliknij jej gwiazdkę **Favorite** (ulubione), żeby włączyć lub wyłączyć oznaczenie. Na stronie postaci przycisk **Ulubione** pokazuje tylko ulubione postacie. W klasycznym panelu ulubione mają małą plakietkę z gwiazdką, a trzy przyciski pod polem wyszukiwania filtrują listę:

- **All** pokazuje wszystkie postacie.
- **Favs** pokazuje tylko ulubione.
- **Non-favs** pokazuje tylko postacie, które nie są ulubione.

Możesz też wybrać **Favorites** na liście rozwijanej sortowania, żeby przenieść ulubione na górę.

### Tagi

Tagi to etykiety takie jak `fantasy` albo `slow burn`. Dodaje się je w edytorze postaci. Zobacz [Tworzenie i edycja postaci](creating-and-editing-characters.md#metadata-tab). Import dodaje **Zaimportowane** i tag źródła karty, na przykład **ST** albo **CharX**. Zobacz [Opcje importu](import-export.md#import-options).

Aby filtrować według tagu na stronie postaci:

1. Kliknij **Tagi** obok pola wyszukiwania. Otwiera się lista wszystkich tagów z liczbą postaci, które mają dany tag.
2. Wpisz tekst w polu **Szukaj tagów**, żeby znaleźć tag, a potem kliknij wybrane tagi. Przy kilku zaznaczonych widać tylko postacie, które mają je **wszystkie**. **Bez tagów** pokazuje postacie bez tagów.
3. Przycisk **Tagi** pokazuje liczbę wybranych tagów. Kliknij **Wyczyść** na liście, żeby usunąć wybór.

Strony **Persony** i **Księgi wiedzy** mają taki sam przycisk **Tagi**, podobnie jak **Presety**. Wpisywanie `tag:name` w polu wyszukiwania nadal działa na każdej z nich.

W klasycznym panelu, gdy postacie mają tagi, pojawia się przycisk **Tagi** z liczbą, na przykład **Tagi (12)**. Kliknij go, żeby rozwinąć pełną listę:

- Kliknij tag, żeby dodać go do filtrów. Przy kilku zaznaczonych tagach pasuje postać, która ma którykolwiek z nich.
- Kliknij X przy tagu, żeby usunąć ten tag ze wszystkich postaci, które go mają. Pojawia się prośba o potwierdzenie: **Remove tag "name" from all characters?**
- **Clear** (wyczyszczenie) pojawia się, gdy filtr tagów jest aktywny. Kliknij go, żeby wyczyścić filtry tagów.

Żeby zamiast tego wykluczyć tag, użyj `-tag:` w polu wyszukiwania, jak pokazano w sekcji [Wyszukiwanie](#search).

## Eksportowanie lub usuwanie wielu postaci (klasyczny układ)

1. Kliknij **Select** na górze panelu. W każdym wierszu pojawia się pole wyboru.
2. Kliknij postacie, które chcesz zaznaczyć. Nagłówek panelu pokazuje, ile jest zaznaczonych.
3. Skorzystaj z paska akcji na dole.

Pasek akcji ma dwa przyciski:

- **Export** (eksport) pobiera zaznaczone postacie jako jeden plik zip o nazwie `marinara-characters.zip`, w natywnym formacie aplikacji Marinara Engine.
- **Delete** usuwa zaznaczone postacie. Najpierw pojawia się pytanie: **Delete N characters?**

W trybie zaznaczania da się też przeciągnąć zaznaczone postacie razem do folderu. Formaty plików opisuje przewodnik [Importowanie i eksportowanie kart postaci](import-export.md).

## Powiązane przewodniki

- [Importowanie i eksportowanie kart postaci](import-export.md)
- [Tworzenie i edycja postaci](creating-and-editing-characters.md)
- [Czaty grupowe w trybach Conversation i Roleplay](../chats/group-chats.md)
