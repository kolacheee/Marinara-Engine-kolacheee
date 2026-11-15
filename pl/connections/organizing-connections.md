# Porządkowanie połączeń

Ten przewodnik opisuje, jak utrzymać porządek wśród kont i modeli na stronie **Połączenia** (**Biblioteka → Połączenia**): oznaczanie gwiazdką, sortowanie, edycję, usuwanie, funkcję Shuffle, foldery i eksport. Jak dodać konto, opisuje [Łączenie z dostawcą AI](connecting-to-a-provider.md).

## Lista kont

Pod sekcją **Domyślne** strona wymienia twoje konta w tabeli z kolumnami **Modele**, **Status** i **Saldo**. Sekcja **Na tym urządzeniu** zawiera [model wbudowany](local-model.md). Kliknij konto, żeby pokazać pod nim zapisane modele, i kliknij ponownie, żeby je zwinąć. Wiersz modelu pokazuje jego nazwę i plakietki, takie jak zadanie, które model wykonuje (**Main**, **Agenci**, **Obrazy**), **Własne ustawienia**, jego cenę albo **Plan** przy modelach wliczonych w subskrypcję. Konto lokalne albo na własnym serwerze może też pokazywać pozycję **Domyślny** z opisem "Dowolny model załadowany na serwerze", bez gwiazdki. Zobacz [Używanie dowolnego modelu załadowanego na serwerze](local-self-hosted.md#use-whatever-model-the-server-has-loaded).

Nad tabelą:

- **Wszystkie rodzaje** ogranicza listę do kont typu **Czat**, **Obrazy**, **Wideo** albo **Głos**.
- Pole **Szukaj kont i modeli** filtruje listę w trakcie pisania.
- Menu sortowania zawiera **Sortuj: Nazwa**, **Sortuj: Najwięcej modeli** i **Sortuj: Ostatnio zmienione**.

Niektóre konta sięgają do modeli kilku twórców, na przykład NanoGPT albo serwer proxy. Ich modele są zgrupowane pod nagłówkami takimi jak **via NanoGPT**.

### Działania na koncie

Kliknij **⋯** w wierszu konta:

| Działanie | Co robi |
| --- | --- |
| **Edytuj konto** | Otwiera jego ustawienia: **Nazwa**, **Adres**, **Klucz API**, **Używaj tego konta** (wyłącz konto bez usuwania), **Testuj konto**, **Zużycie i saldo** oraz **Więcej opcji** z polami **Żądania na minutę** i **Równoległe żądania**. Jest tu też przycisk **Usuń**. |
| **Replace key** (zastąpienie klucza) | Pozwala wkleić nowy klucz. Jeśli stary klucz jest też na innych kontach, Marinara pyta, czy zaktualizować również je. |
| **Add model** (dodanie modelu) | Otwiera listę modeli konta. **Add image model** (dodanie modelu obrazów) pojawia się przy usługach, które tworzą też obrazy. |

Żeby usunąć konto, otwórz **Edytuj konto** i kliknij **Usuń**. Marinara prosi o potwierdzenie i w sekcji **Used by** (używane przez) wymienia, co korzysta z jego modeli: czaty, agentów, modele i zadania. Kliknij **Delete with its N models** (usunięcie razem z N modelami), żeby usunąć konto i jego modele. Te czaty i zadania będą wtedy potrzebować innego modelu. Jeśli jakiegoś modelu nie da się usunąć, edytor wymienia go pod komunikatem **This account still has models. Remove these first:**. Otwórz każdy z tych modeli i usuń go.

### Ikony dostawców

Każde konto pokazuje ikonę swojej usługi. Ikony są dostarczane razem z aplikacją Marinara Engine i nigdy nie są wczytywane z internetu. Konto z własnym adresem pokazuje ikonę znanego serwera lub pośrednika, gdy jego adres albo nazwa zawiera nazwę takiego serwera, na przykład Ollama, LM Studio, KoboldCpp, Bifrost albo LiteLLM. W przeciwnym razie pokazuje pierwszą literę swojej nazwy. W klasycznym układzie możesz wybrać własną ikonę: kliknij obrazek konta, a potem wybierz logo usługi, prześlij własny obraz albo użyj liter.

## Modele oznaczone gwiazdką

Gwiazdka oznacza modele, które chcesz szybko znajdować. Modele oznaczone gwiazdką są wymienione w grupie **Starred** (oznaczone gwiazdką) blisko góry każdego selektora modeli: w oknach **Model for** (model dla) w sekcji **Domyślne**, w oknie **Model for this chat** (model dla tego czatu) oraz w polach modelu w **Chat Settings** (ustawienia czatu) i w edytorze agenta.

Aby oznaczyć model gwiazdką, kliknij jego gwiazdkę w wierszu modelu albo na liście **Dodaj model** konta. Przydzielenie modelowi zadania też go zapisuje.

Aby usunąć gwiazdkę, kliknij ją ponownie. Marinara usuwa model i przez kilka sekund pokazuje **Undo** (cofnięcie). Model zostaje, bez gwiazdki, gdy używa go czat, ma zadanie w sekcji **Domyślne**, ma własne ustawienia albo jest ostatnim modelem swojego konta. Komunikat podaje powód.

## Edycja i usuwanie modelu

Kliknij wiersz modelu, żeby otworzyć okno **Edytuj model** ze wszystkimi jego ustawieniami. **Export model** (eksport modelu) zapisuje go do pliku (zobacz [Eksport i import](#export-and-import)). Aby przydzielić modelowi zadanie, kliknij to zadanie w sekcji **Domyślne** i wybierz tam model.

Na komputerze możesz przeciągnąć wiersz modelu na czat, żeby użyć tego modelu w czacie.

### Działania na modelu

Kliknij **⋯** na końcu wiersza modelu albo kliknij wiersz prawym przyciskiem myszy:

| Działanie | Co robi |
| --- | --- |
| **Edytuj model** | Otwiera ustawienia modelu. |
| **Ustaw jako domyślny dla…** | Przydziela modelowi zadanie, tak samo jak wybranie go w sekcji **Domyślne**. Znacznik zaznaczenia pokazuje zadania, które model już ma. |
| **Przenieś na konto…** | Przenosi model do innego konta. Model używa wtedy klucza tamtego konta. Razem z nim przechodzą jego nazwa, obrazek, zadania i czaty, a opcje usługi wracają do ustawień domyślnych. |
| **Przenieś do folderu** | Umieszcza model w folderze (zobacz [Foldery](#folders)). |
| **Duplikuj** | Tworzy pełną kopię z tymi samymi ustawieniami i ją otwiera. |
| **Dodaj do Shuffle** / **Usuń z Shuffle** | Zobacz [Funkcja Shuffle](#shuffle). Model należący do puli ma w swoim wierszu tag **Shuffle**. |
| **Eksportuj** | Zapisuje model do pliku. |
| **Remove** (usunięcie) | Usuwa model po potwierdzeniu. Okno potwierdzenia wymienia, co z niego korzysta. |

## Foldery

Foldery grupują twoje modele, na przykład **RP** i **Work**. Model należy do jednego folderu.

1. Kliknij **⋯** na modelu i wybierz **Przenieś do folderu**.
2. Wybierz folder albo kliknij **New folder…** (nowy folder), wpisz nazwę i kliknij **Create** (utwórz).
3. Aby zobaczyć foldery, zmień **Według konta** na **Według folderu** w menu obok menu sortowania.

W widoku **Według folderu** każdy folder wymienia swoje modele z nazwami ich kont, a modele bez folderu są w grupie **Poza folderami**. Kliknij **⋯** na folderze albo kliknij go prawym przyciskiem myszy, żeby zmienić jego nazwę lub go usunąć. Usunięcie folderu zachowuje jego modele w grupie **Poza folderami**. Klasyczny panel pokazuje te same foldery i pozwala też nadać folderowi ikonę i kolor.

## Funkcja Shuffle

Funkcja Shuffle pozwala czatowi wybierać inny model przy każdej odpowiedzi. Przydaje się, gdy żądania mają się rozkładać na kilka usług albo modeli.

1. Kliknij **⋯** na każdym modelu, który ma trafić do puli, i wybierz **Add to Shuffle**.
2. W czacie otwórz okno **Model for this chat** z pola wiadomości albo **Chat Settings → Connection → Model** (ustawienia czatu, połączenie, model) i wybierz **Shuffle** (losowanie).

Każda odpowiedź losuje wtedy model z twojej puli Shuffle.

Jeśli model wylosowany dla odpowiedzi zawiedzie, a **Main** ma model **If it fails** (jeśli zawiedzie), odpowiedź pisze ten model. Powiadomienie podaje model, który zawiódł, i krótki powód, na przykład "key rejected", "rate limited" albo "not found". Odpowiedź zachowuje małą etykietę **Fallback** (połączenie zapasowe). Dotknij jej albo wskaż ją kursorem, żeby znów zobaczyć tę samą informację.

Wybór w oknie **Model for this chat** zmienia tylko ten czat. Aby zmienić model dla nowych czatów, ustaw **Main** w sekcji **Domyślne**.

## W klasycznym układzie

Klasyczny panel Połączenia ma kilka dodatkowych narzędzi. Przełącz się na niego opcją **Nowy układ (podgląd przebudowy interfejsu)** w **Ustawienia → Wygląd → Motyw** i wróć w ten sam sposób. Oba układy używają tych samych kont.

- Menu **⋯** modelu zawiera też **Zmień obraz**.
- Menu **⋯** konta zawiera też **Testuj**, **Wybierz modele** (przeniesienie lub usunięcie kilku naraz), **Duplikuj** oraz **Wyłącz** / **Włącz**.
- Menu **Więcej działań** (trzy kropki) u góry panelu zawiera **Zwiń wszystkie konta**, **Rozwiń wszystkie konta**, **Pokaż tylko wyłączone lub wymagające klucza** i **Pokazuj plakietki kosztów**.

## Eksport i import

Konta da się wyeksportować do pliku jako kopię zapasową albo po to, żeby przenieść je do innej instalacji, a później zaimportować.

> **Ostrzeżenie:** Eksport nigdy nie zawiera kluczy API. Po imporcie otwórz każde konto i wpisz jego klucz jeszcze raz. Nigdy nikomu nie udostępniaj klucza.

- **Eksport jednego modelu:** otwórz go przez **Edit model** i kliknij **Export model** (eksport modelu).
- **Eksport wszystkiego:** kliknij **Eksportuj wszystkie konta** (ikonę przesyłania obok **Importuj**) u góry strony Połączenia. Marinara przypomina, że plik nie zawiera kluczy. Kliknij **Eksportuj**.
- **Import:** kliknij **Importuj** u góry strony Połączenia. Upuść na okno jeden plik lub kilka plików (`.json`, `.jsonl` albo `.zip`) albo kliknij, żeby je wskazać. Obejmuje to także wyeksportowany plik `marinara-connections.zip`. Każde zaimportowane konto ma pusty klucz, dopóki go nie uzupełnisz.

Jeden model pobiera się jako plik `.connection.json`. Kilka modeli pobiera się razem jako `marinara-connections.zip`. Gwiazdki trafiają do eksportu. Katalog modeli usługi już nie, więc wczytuje się ponownie przy pierwszym otwarciu modeli konta.

## Powiązane przewodniki

- [Łączenie z dostawcą AI](connecting-to-a-provider.md)
- [Panel **Chat Settings** – przegląd](../chats/chat-settings.md)
