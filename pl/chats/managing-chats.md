# Zarządzanie listą czatów

Twoje czaty znajdują się na pasku bocznym po prawej stronie, w sekcji **Czaty**. Kliknij **Biblioteka** w prawym górnym rogu, żeby pokazać lub ukryć pasek boczny, a potem wybierz **Czaty** w przełączniku u góry paska (druga opcja to **Biblioteka**). Na telefonie lub tablecie dotknij przycisku ze stosem w prawym górnym rogu; pasek boczny wysunie się nad stroną z tym samym przełącznikiem. Lista czatów służy do zakładania, wyszukiwania, sortowania, porządkowania i usuwania czatów.

## Lista czatów i zakładki trybów

U góry są przyciski **Importuj**, **Nowy folder**, **Zaznacz czaty** i **Nowy**. Na telefonie wszystkie oprócz **Nowy** znajdują się w menu **⋯** obok niego. Pod nimi są trzy zakładki trybów, każda z liczbą swoich czatów (na telefonie pierwsza nosi nazwę **Conversation**). Każda zakładka pokazuje tylko czaty z danego trybu.

| Zakładka | Tryb |
| --- | --- |
| **Convo** | Conversation: czat w stylu komunikatora. |
| **Roleplay** | Roleplay: scena z postaciami i śledzeniem stanu świata. |
| **Game** | Game: gra RPG dla jednego gracza prowadzona przez AI. |

Każdy wiersz pokazuje nazwę czatu i awatary jego postaci. W czatach w trybie Conversation kolorowa kropka na awatarze pokazuje status postaci. Czerwona plakietka to liczba nieprzeczytanych wiadomości. Wiersz z małą ikoną gałęzi i liczbą to czat z kilkoma gałęziami, zebranymi w jednym wierszu. Zobacz [Gałęzie czatu](branches.md). Na komputerze najechanie kursorem na wiersz pokazuje podgląd czatu oraz przyciski **Zmień nazwę czatu** i **Tagi czatu**.

Przypięte czaty są na początku listy. Żeby przypiąć czat, kliknij go prawym przyciskiem myszy (albo przesuń w lewo na ekranie dotykowym) i wybierz **Przypnij**.

## Zakładanie czatu

Zanim zaczniesz: dodaj co najmniej jedno konto w **Connections** (Połączenia). Zobacz [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).

1. Kliknij zakładkę wybranego trybu.
2. Kliknij **Nowy** u góry listy. Podpowiedź to **Nowa rozmowa**, **Nowe odgrywanie roli** albo **Nowa gra**, zgodnie z zakładką. Możesz też rozpocząć czat, wybierając **Conversation**, **Roleplay** albo **Game** na ekranie głównym.

Marinara tworzy czat i go otwiera. Obok otwierają się panel **Chat Settings** (ustawienia czatu) i kreator konfiguracji. Dopóki nie ukończysz konfiguracji, czat nie pojawia się na liście. Jeśli opuścisz konfigurację i wybierzesz zachowanie czatu, pojawi się on jako **Konfiguracja nieukończona**, żeby można było do niego wrócić. Czat startuje z nazwą **New Conversation**, **New Roleplay** albo **New Game**. Jeśli dla trybu Conversation lub Roleplay zapisano domyślny profil ustawień oznaczony gwiazdką, Marinara stosuje go do nowego czatu. Zobacz [Profile ustawień](settings-profiles.md).

Jeśli to nie zadziałało: gdy nie ma zapisanego konta, zamiast czatu otwiera się okno **Add account** (dodanie konta). Wybierz usługę, kliknij **Connect** (połącz), a potem wybierz model. Pełny opis krok po kroku znajdziesz w przewodniku [Łączenie z dostawcą AI](../connections/connecting-to-a-provider.md).

## Importowanie czatu

Możesz zaimportować zapis czatu w pliku `.jsonl` z aplikacji SillyTavern lub Marinara Engine.

1. Kliknij zakładkę trybu, w którym ma się znaleźć czat.
2. Kliknij przycisk **Importuj** (strzałka pobierania) u góry listy. Jego etykieta to **Importuj czat JSONL z aplikacji SillyTavern lub Marinara**.
3. Wybierz plik `.jsonl`.

Marinara tworzy czat, otwiera go i pokazuje **Imported N messages**. Formaty eksportu i eksport zbiorczy opisuje przewodnik [Eksport i import czatów](export-import.md).

Jeśli to nie zadziałało: na dole ekranu pojawia się krótki komunikat **Import failed** z przyczyną. Przyjmowane są tylko pliki `.jsonl`.

## Zmiana nazwy czatu

Nazwa czatu jest tylko dla ciebie. Nie trafia do modelu.

1. Otwórz czat, a potem panel **Chat Settings**.
2. W sekcji **Chat Name** (nazwa czatu) kliknij bieżącą nazwę.
3. Wpisz nową nazwę, a potem naciśnij <kbd>Enter</kbd> albo kliknij znak zaznaczenia.

Jak otworzyć ten panel, opisuje [Panel **Chat Settings** – przegląd](chat-settings.md).

## Usuwanie czatu

1. Kliknij wiersz czatu prawym przyciskiem myszy i wybierz **Usuń**. Na ekranie dotykowym przesuń wiersz w lewo albo naciśnij i przytrzymaj go, a potem dotknij **Usuń**.
2. W oknie **Delete Chat** (usunięcie czatu) kliknij **Delete** (usuń).

Usunięcie jest nieodwracalne. Zatrzymuje też odpowiedź, która wciąż się pisze w tym czacie. Żeby usunąć wiele czatów naraz, zobacz [Zaznaczanie wielu czatów](#selecting-multiple-chats).

Jeśli czat ma kilka gałęzi, okno podaje ich liczbę i daje dwie możliwości:

- **Delete This Branch Only** (usunięcie tylko tej gałęzi) usuwa klikniętą gałąź.
- **Delete All N branches** (usunięcie wszystkich N gałęzi) usuwa wszystkie gałęzie w grupie.

Jak zarządzać gałęziami bez usuwania czatu, opisuje [Gałęzie czatu](branches.md).

O tych oknach decyduje ustawienie całej aplikacji **Confirm before deleting** (potwierdzanie przed usunięciem). Domyślnie jest włączone. Znajdziesz je w **Ustawienia → Ogólne → Potwierdzenia i pomoc**.

## Foldery czatów

Foldery grupują czaty w obrębie jednej zakładki trybu.

1. Otwórz zakładkę, która ma co najmniej jeden czat.
2. Kliknij **Nowy folder** (przycisk folderu u góry listy). Folder dostaje nazwę **bez nazwy** (a kolejne **bez nazwy 2**, **bez nazwy 3**).

| Cel | Co zrobić |
| --- | --- |
| Zmiana nazwy folderu | Kliknij go dwukrotnie albo dotknij dwukrotnie, albo ustaw na nim fokus i naciśnij <kbd>F2</kbd>. Pusta nazwa jest ignorowana. |
| Usunięcie folderu | Kliknij przycisk kosza w wierszu folderu. Gdy folder zawiera czaty, pojawia się okno **Delete Folder** (usunięcie folderu). Czaty przechodzą na poziom główny i nie są usuwane. |
| Zmiana kolejności folderów | Przeciągnij folder w górę lub w dół. Menu sortowania przełącza się na **Custom** (własna). |
| Przeniesienie czatu do folderu | Przeciągnij wiersz czatu na folder. Na ekranie dotykowym najpierw naciśnij i przytrzymaj czat przez mniej więcej pół sekundy. |
| Wyjęcie czatu z folderu | Przeciągnij go na pusty obszar pod folderami. |

Gdy zaznaczonych jest kilka czatów, przeciągnięcie jednego przenosi całe zaznaczenie. Czaty spoza folderów są wypisane pod folderami.

## Wyszukiwanie, sortowanie i filtrowanie

### Wyszukiwanie czatu po nazwie

Każda zakładka ma pole wyszukiwania. Jego tekst zastępczy to **Search conversations**, **Search roleplays** albo **Search games**. Wpisz słowo. Wyszukiwanie dopasowuje nazwy czatów, tagi i imiona postaci, ale nie treść wiadomości.

### Filtrowanie według tagu

Kliknij **Tagi** (przycisk z tagiem obok pola wyszukiwania). Wybierz co najmniej jeden tag albo **Bez tagów**. Przycisk pokazuje liczbę wybranych tagów. Czat wraz z gałęziami liczy się jako jedna pozycja. Dodaj tagi do czatu przyciskiem **Tagi czatu** w jego wierszu albo opcją **Tagi** w menu otwieranym prawym przyciskiem myszy lub przesunięciem.

### Wyszukiwanie wiadomości we wszystkich czatach

Naciśnij <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> na komputerze Mac) albo znajdź tę funkcję przyciskiem wyszukiwania na górnym pasku. Wyszukiwanie obejmuje każdy czat i może filtrować po trybie, postaci, nadawcy i dacie.

### Sortowanie

Menu sortowania **Sort chats** (sortowanie czatów) ma takie opcje:

| Opcja | Kolejność |
| --- | --- |
| **Custom** | Twoja kolejność folderów. |
| **Manual order** (kolejność ręczna) | Czaty w kolejności, w jakiej je przeciągniesz. Z klawiatury ustaw fokus na czacie i naciśnij <kbd>Alt</kbd>+<kbd>Up</kbd> albo <kbd>Alt</kbd>+<kbd>Down</kbd>. |
| **Recent** (ostatnie) | Najpierw ostatnio aktywne. To opcja domyślna. |
| **Newest** (najnowsze) | Najpierw ostatnio utworzone. |
| **Oldest** (najstarsze) | Najpierw najstarsze. |
| **Od A do Z** i **Od Z do A** | Według nazwy. |

Lista początkowo pokazuje 40 czatów i dodaje kolejne 40, gdy przewiniesz ją prawie do końca.

## Kiedy lista się odświeża

Żeby aplikacja działała szybko, lista czatów nie odświeża się przez cały czas:

- Odświeża się od razu, gdy utworzysz, zmienisz lub usuniesz czat na tym urządzeniu.
- Zmiany z innego urządzenia (na przykład czat rozpoczęty na telefonie) pojawiają się po powrocie do aplikacji z innej aplikacji lub karty przeglądarki: lista odświeża się wtedy raz.
- Serwer nie może sam wysłać zmian do twojego urządzenia. Jeśli masz otwartą aplikację na dwóch urządzeniach obok siebie, przełącz się z niej do innej aplikacji i wróć, żeby zobaczyć zmiany z drugiego urządzenia.

## Zaznaczanie wielu czatów

1. Kliknij przycisk **Select chats** (wybór czatów) ze znakiem zaznaczenia u góry listy.
2. Kliknij każdy czat, który chcesz zaznaczyć. Zamiast się otwierać, wiersze pokazują pole wyboru.
3. Użyj paska na dole, który pokazuje liczbę zaznaczonych czatów.

**Export** (eksport) pobiera zaznaczone czaty jako jeden plik `.zip` z plikami `.jsonl`. **Delete** prosi o potwierdzenie w oknie **Delete Chats** (usunięcie czatów), a potem je usuwa. Kliknij ponownie przycisk ze znakiem zaznaczenia, żeby wyjść z trybu zaznaczania. Przełączenie zakładki też czyści zaznaczenie.

## Ostatnie czaty na ekranie startowym

Ekran startowy ma widget **Recent chats** (ostatnie czaty) z twoimi najnowszymi czatami. Każdy czat pokazuje swoją nazwę, plakietkę trybu i ostatnią wiadomość. Kliknij czat, żeby go otworzyć. Gdy nie ma czatów, widget pokazuje napis **Your chats will show here**. Zobacz [Widgety ekranu głównego](../home/welcome.md#home-widgets).
