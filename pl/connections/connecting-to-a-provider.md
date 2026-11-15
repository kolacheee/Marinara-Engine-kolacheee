# Łączenie z dostawcą AI

Do czatowania aplikacja Marinara Engine potrzebuje modelu AI. Możesz dodać konto w usłudze AI, wkleić jej klucz API i wybrać model. Klucz API to tajny kod od usługi, dzięki któremu Marinara może korzystać z twojego konta w tej usłudze. Traktuj go jak hasło. Możesz też użyć [modelu wbudowanego](local-model.md), małego modelu, który działa na twoim komputerze bez klucza.

## Dodawanie konta

Zanim zaczniesz, zdobądź klucz API w usłudze, z której chcesz korzystać. Po wybraniu usługi na kroku z kluczem znajdziesz link **Gdzie znaleźć klucz?**. Oto strony, które otwiera dla popularnych usług.

- OpenRouter (ma darmowe modele): `openrouter.ai/keys`
- NanoGPT: `nano-gpt.com/api`
- OpenAI: `platform.openai.com/api-keys`
- Anthropic: `console.anthropic.com/settings/keys`
- Google Gemini: `aistudio.google.com/apikey`

Większość usług wymaga rejestracji, a niektóre także doładowania środków, zanim klucz zacznie działać. Inne usługi opisuje przewodnik [Obsługiwani dostawcy AI](providers-reference.md). Żeby użyć modelu na własnym komputerze bez klucza, zobacz [Konfiguracja modelu wbudowanego](local-model.md).

1. Otwórz **Biblioteka → Połączenia**. (Kliknij **Biblioteka** w prawym górnym rogu, a potem **Połączenia**. Możesz też nacisnąć <kbd>Ctrl</kbd>+<kbd>K</kbd> i wpisać `connections`.)
2. Kliknij **Dodaj połączenie** (na telefonie **Nowy**). Otworzy się lista usług podzielona na kategorie **Tekst**, **Obraz**, **Wideo**, **Głos** i **Decyzja**. Zwykłego modelu czatu szukaj w kategorii **Tekst**.
3. Kliknij wybraną usługę. Wpisz tekst w polu **Szukaj usług**, żeby znaleźć usługę, której nie ma na liście.
4. Wklej klucz w polu **Klucz API**. Kliknij przycisk z ikoną oka, żeby sprawdzić, czy wkleił się cały.
5. Kliknij **Connect** (połącz). Marinara testuje klucz. Gdy działa, widzisz **Connected** z liczbą znalezionych modeli.
6. W sekcji **Znaleziono w … – użyj do:** każdy wiersz to jedno zadanie, na przykład **Main** albo **Obrazy**. Zaznacz zadania, które mają używać modelu znalezionego przez aplikację Marinara. Jeśli usługa nie udostępnia listy modeli, wpisz identyfikator modelu w wierszu. Kliknij **Gotowe** albo **Pomiń**, żeby zachować konto bez przypisywania mu zadania.
7. Dalszy przebieg zależy od tego, czy masz już model Main. Main to zadanie pisania odpowiedzi w twoich czatach.
   - **Nie masz jeszcze modelu Main albo okno Add otwarto z nowego czatu:** okno pokazuje modele usługi. Modele **Recommended** (zalecane) są na górze. Kliknij model, żeby go dodać, albo wpisz nazwę w polu **Search or enter model ID…** (wyszukiwanie lub wpisanie identyfikatora modelu). Jeśli nie wiesz, który wybrać, weź jeden z modeli **Recommended**. Możesz to później zmienić. Zostaw zaznaczone **Make … my Main model** (ustaw jako mój model główny). Ta opcja pojawia się tylko wtedy, gdy nie masz modelu Main. Gdy okno Add otwarto z nowego czatu, a model Main już masz, zamiast niej pojawia się przycisk **Set … as Main** (ustaw jako model główny). Potem kliknij **Done** (gotowe) albo, w nowym czacie, **Start chatting** (rozpocznij czat).
   - **Okno Add otwarto z listy wyboru zadania:** okno się zamyka, a Marinara wraca do tego zadania z nowym modelem na liście.
   - **Masz już model Main:** okno się zamyka, a komunikat informuje, że konto zostało dodane, i podaje liczbę jego modeli. Żeby dodać więcej modeli, kliknij **⋯** na koncie i wybierz **Add model** (dodanie modelu).

Strona Połączenia pokazuje twoje konto. **Connected** w kroku 5 już oznacza, że klucz działa. Jeśli nowy model jest twoim modelem Main, rozpocznij czat i wyślij wiadomość: odpowiedź oznacza, że wszystko działa. Jeśli model Main był już wcześniej ustawiony, nowe czaty nadal go używają. Żeby korzystać z nowego konta, dodaj do niego model (**⋯** → **Add model**), a potem wybierz ten model dla czatu albo zadania (zobacz [Wybór modelu do każdego zadania](#choosing-the-model-for-each-job)).

Jeśli to nie zadziałało:

- **The key was not accepted. Check that you copied all of it.** Wklej klucz jeszcze raz i kliknij **Try again** (ponowna próba). Klucz musi pochodzić z wybranej usługi.
- **The service is busy, or your credit is used up.** Doładuj środki na stronie usługi albo poczekaj i spróbuj ponownie.
- Komunikat **Marinara could not reach** oznacza, że nie udało się połączyć z usługą. Sprawdź połączenie z internetem, a potem kliknij **Try again**.

### Opcjonalne pola konta

Kliknij **Więcej opcji** na kroku z kluczem, żeby zobaczyć te pola. Zostaw je puste, chyba że ich potrzebujesz.

- **Name (optional)** (nazwa, opcjonalnie): nazwa widoczna na stronie Połączenia. Puste pole oznacza nazwę usługi. Drugie konto w tej samej usłudze dostaje ostatnie 4 znaki swojego klucza, na przykład `OpenAI · …a1b2`.
- **Address** (adres): miejsce, do którego Marinara wysyła żądania. Gdy pole jest puste, Marinara używa własnego adresu usługi. Wypełnij je tylko dla serwera proxy, pośrednika (gateway) albo serwera, który uruchamiasz samodzielnie. Usługi, w których logujesz się na swoim komputerze, nie pokazują tego pola.
- **Requests per minute** (żądania na minutę): ogranicza tempo żądań aplikacji Marinara Engine na tym koncie. Puste pole oznacza brak limitu. Dozwolone wartości to od 1 do 600.
- **Parallel jobs** (zadania równoległe): ile żądań działa jednocześnie. Puste pole oznacza brak limitu. Dozwolone wartości to od 1 do 16. W oknie **Edit account** (edycja konta) to samo ustawienie nazywa się **Parallel requests** (żądania równoległe).

Niektóre usługi zamiast klucza używają logowania na twoim komputerze. Mają etykietę **Sign in** (logowanie) i nie mają pola klucza. Zobacz [Połączenia abonamentowe z Claude, ChatGPT i Grok](subscription-clis.md). Serwer na twoim komputerze opisuje przewodnik [Podłączanie modelu lokalnego lub samodzielnie hostowanego](local-self-hosted.md). Po nieudanym teście pojawia się **Continue anyway** (kontynuuj mimo to). Ta opcja zapisuje konto bez zaliczonego testu.

### Rozpoczynanie czatu bez konta

Jeśli zaczniesz czat, zanim będziesz mieć jakikolwiek model, Marinara najpierw otwiera okno **Add account**. Po kliknięciu **Connect** kliknij model, a potem **Start chatting**.

## Strona Połączenia

Kontami zarządzasz na stronie **Połączenia** (**Biblioteka → Połączenia**). Od góry do dołu pokazuje ona:

- **Importuj** (wczytanie pliku konta) i **Dodaj połączenie**.
- **Wszystkie rodzaje**, które zawęża listę do kont **Czat**, **Obrazy**, **Wideo** albo **Głos**, pole wyszukiwania (**Szukaj kont i modeli**) i menu sortowania.
- **Domyślne**, sekcję pokazującą, który model wykonuje każde zadanie. Zobacz [Wybór modelu do każdego zadania](#choosing-the-model-for-each-job).
- Tabelę kont z kolumnami **Modele**, **Stan** i **Saldo**. W sekcji **Na tym urządzeniu** znajduje się [Model wbudowany](local-model.md). Kliknij konto, żeby pokazać pod nim zapisane modele.

Każde konto ma przycisk **⋯** z opcjami **Edytuj konto**, **Zastąp klucz** i **Dodaj model**. W oknie **Edytuj konto** znajdziesz też **Testuj konto**, **Używaj tego konta** (wyłączenie konta bez usuwania) i [opcjonalne pola](#optional-account-fields). Grupowanie kont w folderach opisuje przewodnik [Porządkowanie połączeń](organizing-connections.md).

**Konto** to jeden zapisany klucz, jedno logowanie albo jeden adres dla jednej usługi. Jeśli używasz dwóch kluczy w tej samej usłudze, masz dwa konta. **Model** to jeden model AI zapisany z konta. Każdy zapisany model ma własne ustawienia.

## Wybór modelu do każdego zadania

Zadanie to coś, co model robi dla ciebie. Sekcja **Domyślne** wymienia zadania:

| Grupa | Zadania |
| --- | --- |
| **Chat** | **Main** (główny) pisze odpowiedzi w twoich czatach. **Agents** (agenci) uruchamia agentów pomocniczych. **Impersonate** (pisanie za ciebie) pisze w twoim imieniu. |
| **Omnibar** (wyszukiwarka) | **Professor Mari** i **Quick answers** (szybkie odpowiedzi). |
| **Pictures & sound** (obrazy i dźwięk) | **Images** (obrazy), **Video** (wideo), **Voice (Text to Speech)** (głos, synteza mowy) i **Dictation (Speech to Text)** (dyktowanie, zamiana mowy na tekst), gdy jest dostępne. |
| **Behind the scenes** (za kulisami) | **Decision** (decyzje), **Embeddings** (embeddingi) i **Image reading** (odczytywanie obrazów). |

Każde zadanie pokazuje model, który je wykonuje, albo to, co robi bez modelu, na przykład **Używa ustawień Main** albo **Wyłączone**. Zadanie, które wymaga modelu, pokazuje **Nie ustawiono**, a sekcja podaje liczbę zadań wymagających uwagi. Kliknij **Domyślne**, żeby ją zwinąć.

Żeby zmienić model zadania, kliknij je. Otwiera się okno **Model for** (model dla) tego zadania, z wyjątkiem trzech wierszy. **Decision** i **Embeddings** otwierają własne kontrolki (zobacz [Modele decyzyjne](decision-models.md) i [Obsługiwani dostawcy AI](providers-reference.md#embeddings)). **Dictation (Speech to Text)** otwiera konfigurację mowy.

W oknie **Model for**:

1. Przejrzyj listę.
2. Kliknij model. Lista pokazuje model wykonujący zadanie w grupie **Now** (teraz), potem twoje modele z grupy **Starred** (oznaczone gwiazdką), a potem zapisane modele według kont. **All models** (wszystkie modele) pod kontem otwiera jego pełną listę. Wpisz tekst w polu **Search all models or paste a model ID** (przeszukiwanie wszystkich modeli lub wklejenie identyfikatora modelu), żeby przeszukać naraz wszystkie konta. Nie trzeba wcześniej zapisywać modelu.

**If it fails** (jeśli zawiedzie) u góry okna wybiera drugi model, który odpowiada, gdy pierwszy zawiedzie. **Add account** na dole otwiera okno dodawania konta.

### Gdy funkcja potrzebuje modelu

Funkcja, która nie może działać bez określonego rodzaju modelu, pokazuje etykietę **Needs an image model** (potrzebny model obrazów) albo analogiczną dla wideo, dźwięku, decyzji lub czatu. Widać ją na karcie agenta na stronie **Agenci**, w **Chat Settings** (ustawienia czatu), w edytorze agenta oraz w oknach obrazów i wideo. Kliknij **Set up** (konfiguracja) obok niej, a potem wybierz model albo kliknij **Add account**. Etykieta znika, gdy zadanie ma już model.

## Testowanie konta

**Połącz** już testuje klucz. Żeby przetestować go ponownie później, kliknij **⋯** na koncie, wybierz **Edytuj konto** i kliknij **Testuj konto**. Sprawdza klucz i adres w takiej postaci, w jakiej zostały wpisane, jeszcze przed zapisem.

## Wybór modelu dla jednego czatu

Nowy czat używa twojego modelu **Main**. Żeby dać jednemu czatowi inny model, kliknij przycisk modelu w polu wiadomości (ikona linku z nazwą bieżącego modelu) albo użyj pola **Model** (model) w **Chat Settings → Connection** (ustawienia czatu, połączenie). Oba otwierają okno **Model for this chat** (model dla tego czatu):

- **Now** pokazuje model, którego używa czat. **This chat only** oznacza, że czat ma własny wybór. **follows Main** oznacza, że używa modelu Main.
- **Recent** (ostatnie) i **Starred** wymieniają twoje modele według kont.
- **Search models or paste an ID…** (wyszukiwanie modeli lub wklejenie identyfikatora) przeszukuje wszystkie konta. **Browse** (przeglądanie) otwiera pełną listę jednego konta.
- **Follow Main** (podążanie za modelem głównym) usuwa własny wybór czatu. **Shuffle** (losowanie) za każdym razem wybiera inny model.

Wybór zmienia tylko ten czat. Komunikat po wyborze proponuje **Make it my Main model** (ustaw jako mój model główny) i **Undo** (cofnięcie). W trybie Game Mode pole ma etykietę **Game Master model** (model mistrza gry).

## Częste błędy

Jeśli test albo wiadomość się nie uda, sprawdź najpierw te rzeczy:

- Zły lub wygasły klucz. Kliknij **⋯** na koncie, wybierz **Replace key** (zastąpienie klucza) i wklej klucz jeszcze raz. Konto bez klucza pokazuje **Needs key**.
- Wyłączone konto. Pokazuje **Wyłączone**. Kliknij **⋯**, wybierz **Edytuj konto** i włącz **Używaj tego konta**.
- Klucz z innej usługi. Każda usługa wymaga własnego klucza.
- Zablokowany adres w polu **Address**. Puste pole oznacza własny adres usługi.

Więcej sposobów naprawy znajdziesz w przewodniku [Rozwiązywanie problemów w aplikacji Marinara Engine](../TROUBLESHOOTING.md).

## Powiązane przewodniki

- [Porządkowanie połączeń](organizing-connections.md)
- [Obsługiwani dostawcy AI](providers-reference.md)
- [Połączenia abonamentowe z Claude, ChatGPT i Grok](subscription-clis.md)
- [Podłączanie modelu lokalnego lub samodzielnie hostowanego](local-self-hosted.md)
