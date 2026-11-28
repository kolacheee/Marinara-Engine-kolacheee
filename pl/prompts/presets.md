# Edytor presetów i menedżer promptów

Preset to zapisany schemat promptu, czyli tekstu, który Marinara wysyła do modelu przy każdej odpowiedzi. Decyduje o tym, co trafia do promptu i w jakiej kolejności: twoje instrukcje, karta postaci, twoja persona, historia czatu, wpisy z lorebooków i inne elementy. Zbuduj go w **Preset Editor** (edytor presetów), a potem przypisz do czatu.

Presety budują prompt w czatach **Roleplay**. Czaty **Conversation** i **Game** korzystają zamiast tego z jednego pola promptu (zobacz [Czaty Conversation i Game](#conversation-and-game-chats)). Presety nie wymagają klucza API, ale do wysłania promptu nadal potrzebne jest działające konto. Zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).

## Przypisywanie presetu do czatu

Preset nic nie robi, dopóki nie korzysta z niego czat. W czacie **Roleplay** użyj jednego z dwóch sposobów. Żeby wybrać gotowy preset, przypisz go. Żeby zrobić własny, zobacz [Tworzenie presetu](#create-a-preset).

Z panelu **Presets** (presety):

1. Otwórz czat.
2. W panelu **Presets** znajdź wiersz presetu. Na komputerze najedź kursorem na wiersz, żeby pokazać jego przyciski.
3. Kliknij przycisk **Assign to chat** (przypisanie do czatu) z ptaszkiem. Ptaszek pokazuje, że preset jest w użyciu. Kliknij przycisk ponownie, żeby cofnąć przypisanie.

Z **Chat Settings** (ustawienia czatu):

1. Otwórz czat, a potem **Chat Settings**.
2. Znajdź **Prompt Preset** (preset promptu) i wybierz preset z listy rozwijanej.

Jeśli preset ma zmienne, otwiera się okno **Configure Preset Variables** (konfiguracja zmiennych presetu). Zobacz [Zmienne presetu](preset-variables.md). Przełączenie na inny preset kasuje wcześniejsze wybory zmiennych.

## Tworzenie presetu

1. Otwórz **Biblioteka → Presety**. Biblioteka znajduje się po prawej.
2. Kliknij **Nowy preset**. Otwiera się okno **Utwórz preset**.
3. Wpisz nazwę w polu **Name** (nazwa). To pole jest wymagane. Jeśli chcesz, dodaj opis w polu **Description** (opis).
4. Kliknij **Create** (utwórz). Preset otwiera się w **Preset Editor**.
5. Zbuduj prompt w zakładce **Sections** (sekcje).
6. Kliknij **Save** (zapisanie) w prawym górnym rogu.

Edytor nie zapisuje sam z siebie. Klikaj **Save** po każdej zmianie. Jeśli wychodzisz z niezapisanymi zmianami, ostrzeżenie oferuje **Keep editing** (dalsza edycja), **Discard** (odrzucenie) i **Save & close** (zapisanie i zamknięcie).

Aby wyeksportować preset, kliknij ikonę strzałki w górę na górnym pasku (podpowiedź **Export preset**). Jeśli masz niezapisane zmiany, Marinara najpierw prosi o zapisanie. Aby usunąć preset, kliknij ikonę kosza.

## Strona Presety

**Biblioteka → Presety** wyświetla presety w tabeli z kolumnami **Opis**, **Sekcje**, **Autor**, **Domyślny** i **Zaktualizowano**. U góry są przyciski **Importuj** (wczytanie pliku `.json`) i **Nowy preset**. **Wszystkie** / **Domyślne** zawęża listę, **Tagi** obok wyszukiwarki pokazuje tylko presety z wybranymi tagami (importowane presety mają tag **Zaimportowane** i tag źródła, na przykład **ST**), **Lista** / **Galeria** przełącza widok, a menu sortowania oferuje **Ostatnio edytowane**, **Od A do Z**, **Od Z do A** i **Moja kolejność**. Kliknij preset, żeby go otworzyć.

Aby uporządkować presety:

- **⋯** na końcu wiersza (albo kliknięcie wiersza prawym przyciskiem myszy) udostępnia **Duplikuj**, **Przenieś do folderu**, **Eksportuj**, **Zaznacz** i **Usuń**. **Duplikuj** tworzy edytowalną kopię i otwiera ją – w ten sposób dostosujesz wbudowany preset. Presetu domyślnego nie można usunąć.
- Przeciągnij wiersz nad inny lub pod niego, żeby ustawić własną kolejność. Menu sortowania przełącza się na **Moja kolejność**.
- **Nowy folder** (ikona folderu obok tytułu) grupuje presety. Przeciągnij preset na folder albo użyj **Przenieś do folderu**.
- **Zaznacz** (ikona zaznaczenia obok tytułu) pozwala wybrać kilka presetów, a potem użyć **Przenieś do folderu**, **Eksportuj** (jeden plik `marinara-presets.zip`) albo **Usuń** na pasku u dołu.

Skrypty regex mają własną stronę, [Biblioteka → Skrypty regex](../extending/regex-scripts.md), podobnie jak własne narzędzia: [Biblioteka → Własne narzędzia](../extending/custom-tools.md).

## W układzie klasycznym: panel Presets

Panel ma cztery zakładki: **Prompty**, **Regexy**, **Narzędzia** i **Profile**. Każda ma u góry ten sam rząd przycisków i pole wyszukiwania. W zakładce **Prompty** użyj **Utwórz preset**, żeby utworzyć preset, **Importuj preset**, żeby wczytać plik `.json`, albo **Zaznacz presety**, żeby wyeksportować lub usunąć kilka naraz; **Zaznacz wszystkie presety** zaznacza każdy preset widoczny w wynikach wyszukiwania. Zakładka **Regexy** zawiera skrypty regex; zobacz [Skrypty regex](../extending/regex-scripts.md#manage-your-scripts). Zakładka **Narzędzia** zawiera własne narzędzia; zobacz [Własne narzędzia](../extending/custom-tools.md). Zakładka **Profile** zawiera profile ustawień czatu; zobacz [Profile ustawień](../chats/settings-profiles.md#the-profiles-tab).

- Pole **Search presets** (wyszukiwanie presetów) filtruje listę.
- Menu sortowania oferuje opcje **Manual order** (kolejność ręczna), **A-Z**, **Z-A**, **Newest**, **Oldest**, **Najwięcej tokenów** i **Najmniej tokenów**. Rozmiar obejmuje własny tekst włączonych sekcji, czyli instrukcje, które preset zawsze wysyła. Sekcje znacznikowe, takie jak postać, lorebook i historia czatu, są wypełniane osobno dla każdego czatu i nie są wliczane. Każdy wiersz pokazuje szacowaną liczbę tokenów. Przy **Manual order** przeciągnij wiersz albo naciśnij <kbd>Alt</kbd>+<kbd>Up</kbd> lub <kbd>Alt</kbd>+<kbd>Down</kbd> na zaznaczonym wierszu. Na ekranie dotykowym naciśnij i przytrzymaj wiersz, żeby go podnieść.
- **New Folder** (nowy folder) grupuje presety. Przeciągnij preset na folder, a nazwę folderu zmień podwójnym kliknięciem lub podwójnym stuknięciem.

Każdy wiersz pokazuje nazwę, format opakowania, liczbę sekcji i autora. Plakietka **DEFAULT** oznacza preset domyślny wyróżniony gwiazdką. Kliknij wiersz, żeby go otworzyć.

## Zakładki panelu Preset Editor

| Zakładka | Co zawiera |
| --- | --- |
| **Overview** | Nazwa, opis, format opakowania i autor. |
| **Sections** | Struktura promptu, zbudowana z bloków i znaczników. |
| **Prompts** | Prompty trybów dla czatów Conversation i Game. |
| **Parameters** | Początkowe ustawienia generowania. Zobacz [Parametry generowania](generation-parameters.md). |
| **Regex** | Skrypty regex powiązane z tym presetem oraz **Scoped regex default** (domyślny tryb skryptów regex przypisanych do postaci). Zobacz [Skrypty regex](../extending/regex-scripts.md). |

### Zakładka Overview

- **Name** to tytuł widoczny w panelu **Presets**.
- **Description** to krótkie podsumowanie.
- **Wrap Format** (format opakowania) decyduje o tym, jak sekcje są formatowane (zobacz [Formaty opakowania](#wrap-formats)).
- **Author** (autor) to opcjonalna nazwa twórcy, przydatna przy udostępnianiu presetu.
- **Tagi** porządkują presety dla filtra **Tagi** na stronie Presety. Wpisz tag i naciśnij Enter albo kliknij **×** przy tagu, żeby go usunąć.

Dwa kafelki tylko do odczytu pokazują liczniki **Sections** i **Groups**.

### Zakładka Prompts

- **Conversation Mode** to pole tekstowe na prompt trybu Conversation w tym presecie. Zostaw je puste, żeby używać wbudowanego promptu.
- **Roleplay Mode** nie da się tu edytować. Tryb Roleplay korzysta z promptu złożonego z twoich sekcji w **Sections**.
- **Game Mode** to pole tekstowe na prompt trybu Game w tym presecie. Zostaw je puste, żeby używać wbudowanego promptu.
- **Ustawienia historii gry** przenosi styl historii, przemoc i granice treści do trybu Game Mode. Zobacz [Ustawienia historii gry](#game-story-settings).

#### Ustawienia historii gry

Preset może przenosić styl historii, poziom przemocy i granice treści do trybu Game Mode, żeby nie trzeba było ustawiać ich dla każdej gry. Zobacz [Styl historii, przemoc i granice treści](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. Na zakładce **Prompty**, pod **Ustawienia historii gry**, włącz **Przenieś ustawienia historii do gier korzystających z tego presetu**.
2. Wybierz **Styl historii** i poziom **Przemoc**. Opcja **Zgodnie z kategorią** zachowuje domyślną przemoc wynikającą z kategorii każdej gry.
3. Opcjonalnie: wpisz **Granice treści**, po jednej w wierszu.
4. Kliknij **Zapisz**.

Gdy wybierzesz preset dla gry w kreatorze konfiguracji albo w **Ustawienia czatu → Preset promptu**, gra przejmuje styl historii i przemoc presetu. Granice presetu są dodawane do granic, które gra już ma, więc żadne własne granice gry nie znikają. Późniejsze zmiany presetu nie zmieniają gier, które już go wybrały. Ustawienie jest zachowywane przy duplikowaniu, eksporcie i imporcie presetu.

#### Ustawienia historii gry

Preset może przenosić styl historii, poziom przemocy i granice treści do trybu Game Mode, żeby nie trzeba było ustawiać ich dla każdej gry. Zobacz [Styl historii, przemoc i granice treści](../game/getting-started.md#story-style-violence-and-content-boundaries).

1. Na zakładce **Prompty**, pod **Ustawienia historii gry**, włącz **Przenieś ustawienia historii do gier korzystających z tego presetu**.
2. Wybierz **Styl historii** i poziom **Przemoc**. Opcja **Zgodnie z kategorią** zachowuje domyślną przemoc wynikającą z kategorii każdej gry.
3. Opcjonalnie: wpisz **Granice treści**, po jednej w wierszu.
4. Kliknij **Zapisz**.

Gdy wybierzesz preset dla gry w kreatorze konfiguracji albo w **Ustawienia czatu → Preset promptu**, gra przejmuje styl historii i przemoc presetu. Granice presetu są dodawane do granic, które gra już ma, więc żadne własne granice gry nie znikają. Późniejsze zmiany presetu nie zmieniają gier, które już go wybrały. Ustawienie jest zachowywane przy duplikowaniu, eksporcie i imporcie presetu.

Wbudowany **Marinara's Universal Preset** dostarcza tekst promptu, ale żadnych parametrów generowania. Jego starsze zapisane ustawienia próbkowania, rozumowania, formatowania i tokenów są ignorowane, a zamiast nich obowiązują ustawienia twojego konta, nadpisania czatu i wartości domyślne aplikacji. Aby go dostosować, utwórz edytowalną kopię.

## Sekcje i znaczniki

W zakładce **Sections** budujesz prompt. Sekcje składają się w całość od góry do dołu.

1. Kliknij **Add Section** (dodanie sekcji).
2. Wybierz **Prompt Block** (blok promptu) albo znacznik.

**Prompt Block** to tekst, który piszesz samodzielnie: instrukcje systemowe, zasady tonu, wszystko, co ma być w każdym prompcie. Znacznik nie ma własnego tekstu. Marinara wypełnia go bieżącą zawartością czatu w chwili wysyłania promptu.

| Znacznik | Co wstawia |
| --- | --- |
| **Character Info** | Szczegóły karty aktywnej postaci. |
| **Persona** | Szczegóły twojej aktywnej persony. |
| **Chat History** | Wiadomości czatu. |
| **Ostatnia historia** | Najnowsze wiadomości z **Historia czatu**. Zobacz [Dzielenie historii przez Recent History](#split-the-history-with-recent-history). |
| **Chat Summary** | Zebrane podsumowanie czatu. |
| **Dialogue Examples** | Przykładowe dialogi postaci. |
| **Lorebook Marker (All)** | Wszystkie aktywne wpisy z lorebooków. |
| **Lorebook Marker (Before)** | Wpisy z lorebooków ustawione na wstawianie przed. |
| **Lorebook Marker (After)** | Wpisy z lorebooków ustawione na wstawianie po. |
| **Przywoływanie pamięci** | Wspomnienia, które funkcja [Memory Recall](../agents/memory.md) znajduje dla każdej odpowiedzi. Bez tego znacznika trafiają tuż przed historię czatu. |

Wiersz znacznika ma plakietkę **MARKER**. W większości znaczników nie da się nic wpisać. Używaj **Lorebook Marker (All)**, chyba że chcesz rozdzielić wpisy z lorebooków na te przed i te po.

Trzy rzadziej używane znaczniki:

- **Current Scene Summary** (podsumowanie bieżącej sceny) i **Recalled Scenes** (przywołane sceny) umieszczają podsumowania tworzone przez Advanced Memory Recall. Bez znacznika **Recalled Scenes** pojawiają się one przed historią czatu. Zobacz [Memory Recall i podsumowania czatu](../agents/memory.md).
- **ID Macro Cards** (karty wstawiane makrem identyfikatora) umieszcza karty postaci, które wciągasz do promptu, wpisując identyfikator karty postaci w podwójnych nawiasach klamrowych. Bez tego znacznika trafiają w domyślne miejsce. Zobacz [Makra promptów](macros.md).

Bez włączonego znacznika **Dialogue Examples** niepuste przykładowe dialogi trafiają do **Character Info** za scenariuszem, w formacie opakowania presetu. Dodaj ten znacznik, żeby wybrać ich miejsce. Marinara nigdy nie wstawia ich dwa razy.

Jeśli czat ma aktywne lorebooki, a preset nie ma żadnego znacznika lorebooka, pojawia się ostrzeżenie: "Add a lorebook marker when this preset should receive active lorebook entries." Dodaj taki znacznik, żeby wpisy dotarły do modelu. Zobacz [Lorebooki – przegląd](../lorebooks/overview.md).

Jeśli masz własnych agentów z włączoną opcją "inject as section", menu dodawania pokazuje **Agent Sections** (sekcje agentów). Każda z nich wstawia najnowszy wynik danego agenta, a dookoła można dopisać własne instrukcje.

### Edycja sekcji

1. Kliknij nazwę sekcji albo jej strzałkę, żeby ją rozwinąć.
2. Zmień jej **Name** albo rolę (**System**, **User** lub **Assistant**).
3. W sekcji **Prompt Block** edytuj **Content** (treść). To pole obsługuje [makra](macros.md).
4. Kliknij **Save** w prawym górnym rogu.

Kontrolki wiersza:

- **Duplicate** (powielenie) kopiuje sekcję.
- Ikona oka włącza ją lub wyłącza.
- **Delete** (usunięcie) ją usuwa.
- Aby zmienić kolejność, przeciągnij uchwyt, użyj strzałek w górę i w dół albo przytrzymaj palec na sekcji na ekranie dotykowym.

### Grupy

Grupa zamyka kilka sekcji w jednym pojemniku.

1. W zakładce **Sections** kliknij **Groups** (grupy), a potem **New Group** (nowa grupa).
2. Kliknij nazwę grupy, żeby ją zmienić.
3. Rozwiń sekcję i wybierz grupę z jej listy rozwijanej **Group**.

Przy formacie **XML** grupa staje się jednym tagiem nadrzędnym. Przy **Markdown** staje się jednym nagłówkiem. Usunięcie grupy nie usuwa jej sekcji. Przestają one tylko należeć do grupy. Nieprzylegające sekcje tej samej grupy dostają osobne tagi lub nagłówki.

### Pozycja i głębokość

Każda sekcja ma w swoim edytorze ustawienie **Position** (pozycja).

- **Ordered (in sequence)** (po kolei) umieszcza sekcję tam, gdzie stoi na liście. To zwykły wybór.
- **Depth (from end of chat)** (głębokość od końca czatu) umieszcza ją określoną liczbę wiadomości przed końcem czatu, według liczby **Depth**. Głębokość 0 oznacza miejsce za ostatnią wiadomością. Używaj tego do przypomnień, które model ma widzieć blisko najnowszych wiadomości.

## Formaty opakowania

Pole **Wrap Format** w zakładce **Overview** ustala, jak opakowana jest każda sekcja.

| Format | Wynik |
| --- | --- |
| **XML** | Każda sekcja jest umieszczona w tagach. Grupy stają się tagami nadrzędnymi. To ustawienie domyślne. |
| **MARKDOWN** | Każda sekcja dostaje nagłówek. Grupy stają się nagłówkami wyższego poziomu. |
| **NONE** | Bez opakowania. Treść jest wysyłana w takiej formie, w jakiej ją zapisano. |

XML pasuje do większości modeli. Pozostałe formaty wypróbuj tylko wtedy, gdy model lepiej odpowiada bez tagów.

Aby wysłać jeden **Prompt Block** bez jego tagu lub nagłówka, rozwiń go i włącz przełącznik **Send without wrapper** (wysyłanie bez opakowania). Tag grupy nadal może go otaczać, więc jeśli blok ma być zupełnie bez opakowania, usuń go z grupy. Znaczniki zawsze zachowują swoje opakowanie, a przełącznik jest ukryty, gdy format to **NONE**.

## Czaty Conversation i Game

Te czaty nie budują promptu z sekcji. Korzystają z jednego promptu trybu. W **Chat Settings** sekcja **Prompt Preset** ma listę rozwijaną **Prompt source** (źródło promptu) z twoimi presetami. Na początku stoi na **Default conversation prompt** albo **Default game prompt**, a gdy nie masz żadnych presetów, pokazuje **No presets available**. W panelu **Presets** przycisk przypisania pokazuje "Prompt presets are not available in conversation mode."

Pod listą rozwijaną plakietka pokazuje, skąd pochodzi prompt.

| Plakietka | Znaczenie |
| --- | --- |
| **Default** | Wbudowany prompt. |
| **Preset** | Prompt wybranego presetu. |
| **Style** | Prompt wybranego stylu promptu mistrza gry. Tylko czaty Game. |
| **Custom** | Zmiana lokalna, obowiązująca tylko w tym czacie. Ma pierwszeństwo przed wszystkimi pozostałymi. |

Pole tekstowe pokazuje prompt, który jest w użyciu. Edytuj je, żeby utworzyć lokalną kopię dla tego czatu. Jeśli twój tekst dokładnie odpowiada presetowi lub wartości domyślnej, Marinara traktuje go jako niezmieniony. Dopóki istnieje własna zmiana, widać ikonę resetowania (podpowiedź **Reset to default prompt**).

Czaty Game mają więcej kontrolek. **Styl historii**, **Przemoc**, **Granice treści** i **Wytyczne kategorii wiekowej** określają, co może zawierać fabuła gry. Zobacz [Zmiana podczas gry](../game/getting-started.md#change-them-during-a-game). Dwie kolejne kontrolki kształtują prompt. **GM prompt style** (styl promptu mistrza gry) zastępuje tylko prompt trybu Game, a lokalna zmiana w czacie nadal ma pierwszeństwo. **Extra instructions** (dodatkowe instrukcje) dodaje tekst do promptu trybu Game, do 2000 znaków, na przykład "Write in the style of Terry Pratchett."

## Kolejność sekcji a pamięć podręczna promptów

Pamięć podręczna promptów pozwala usłudze ponownie wykorzystać początek promptu, który już przeczytała, dzięki czemu długie czaty kosztują mniej i szybciej otrzymują odpowiedzi. Usługa wykorzystuje prompt ponownie tylko do pierwszego tekstu, który zmienił się od ostatniej wiadomości. Przywołane wspomnienia zmieniają się przy prawie każdej wiadomości, więc umieszczone przed historią czatu wykluczają całą historię z pamięci podręcznej.

Żeby samodzielnie wybrać ich miejsce, dodaj do presetu znacznik **Przywoływanie pamięci**. Przeciągnij go pod **Historia czatu** albo ustaw jego pole **Pozycja** na **Głębokość (od końca czatu)**, żeby umieścić go wewnątrz historii. Wspomnienia czytane przed opowieścią sprawiają, że odpowiedzi trzymają się ich bliżej, więc domyślnie pozostają przed historią.

<a id="split-the-history-with-recent-history"></a>
## Dzielenie historii przez Recent History

**Ostatnia historia** wysyła najnowsze wiadomości w swoim miejscu, **Historia czatu** starsze. Sekcje pomiędzy trafiają między starsze a nowsze. Używaj do zmiennych informacji, np. miejsca i obecnych postaci. Stałe trzymaj nad **Historia czatu**.

1. W **Sekcje** kliknij **Dodaj sekcję**, potem **Ostatnia historia**. Trafia za **Historia czatu**.
2. Rozwiń i ustaw **Ostatnie wiadomości** (domyślnie 4).
3. Przeciągnij zmienne sekcje, np. **Lorebook Marker** lub agenta, pomiędzy.
4. Kliknij **Zapisz**.

Model czyta zmiany blisko nowych wiadomości i lepiej je pamięta. Starsze pozostają stałe i można je ponownie wykorzystać z pamięci podręcznej. Claude umieszcza punkt pamięci na końcu starszych wiadomości.

- **Maks. wiadomości** w **Historia czatu** liczy obie części. Puste wysyła wszystko.
- Przy mniej niż **Ostatnie wiadomości** wszystkie trafiają do **Ostatnia historia**.
- **Głębokość (od końca czatu)** liczy tylko wiadomości. Głębokość ponad **Ostatnie wiadomości** trafia do starszych i blokuje ich ponowne użycie.
- Bez **Historia czatu** wysyła całość. **Ostatnia historia** przed nim lub drugi egzemplarz nic nie wysyła. Wiersz ostrzega w każdym przypadku.
- **XML**: starsze w `<chat_history>`, nowsze w `<recent_history>`, najnowsza w `<last_message>`.
- Starsze wersje nie znają **Ostatnia historia** i mogą odrzucić import presetu.

## Bloki decyzyjne i pamięć podręczna promptu

Sekcja może zawierać blok decyzyjny `{{#if decision:"..."}}`, dzięki czemu ta część jest wysyłana tylko wtedy, gdy stwierdzenie o czacie jest prawdziwe. Zobacz [Pytanie modelu decyzyjnego](conditional-prompts.md#asking-the-decision-model).

Bloki decyzyjne, które często się zmieniają, umieszczaj pod koniec promptu, na przykład w instrukcjach po historii. Zmieniona gałąź może uniemożliwić dostawcy ponowne użycie promptu od tego miejsca, więc wczesna zmiana traci większość oszczędności z pamięci podręcznej. Niezmieniona wcześniejsza część nadal może zostać użyta ponownie. Decyzję blisko początku zostawiaj tylko wtedy, gdy jej odpowiedź rzadko się zmienia. Zobacz [Pamięć podręczna promptu](conditional-prompts.md#prompt-caching).

Stwierdzenia w wyłączonych sekcjach i grupach nigdy nie są zadawane i nie liczą się do **Decision statements per turn** (stwierdzenia decyzyjne na turę).

## Sprawdzanie, co dostało AI

**Peek Prompt** pokazuje kompletnie złożony prompt dla danej wiadomości. To najszybszy sposób na zdiagnozowanie dziwnej odpowiedzi. Zobacz [Peek Prompt: zobacz, co dostał model AI](../chats/peek-prompt.md).

## Powiązane przewodniki

- [Zmienne presetu](preset-variables.md)
- [Makra promptów](macros.md)
- [Parametry generowania](generation-parameters.md)
- [Profile ustawień](../chats/settings-profiles.md)
- [Panel **Chat Settings** – przegląd](../chats/chat-settings.md)
- [Peek Prompt: zobacz, co dostał model AI](../chats/peek-prompt.md)
